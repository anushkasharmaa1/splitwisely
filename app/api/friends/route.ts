import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all groups user is in
    const groups = await prisma.group.findMany({
      where: {
        members: { some: { userId: user.id } },
      },
      include: {
        members: { include: { user: true } },
        expenses: {
          include: {
            splits: true,
            paidBy: true,
          },
        },
      },
    });

    // Calculate balance with each friend
    const friendBalances = new Map<string, {
      user: any;
      balance: number;
      sharedGroups: number;
    }>();

    groups.forEach(group => {
      group.expenses.forEach(expense => {
        expense.splits.forEach(split => {
          if (split.settled) return;

          const friendId = split.userId;
          if (friendId === user.id) return;

          if (!friendBalances.has(friendId)) {
            const friendMember = group.members.find(m => m.userId === friendId);
            if (!friendMember) return;

            friendBalances.set(friendId, {
              user: friendMember.user,
              balance: 0,
              sharedGroups: 0,
            });
          }

          const entry = friendBalances.get(friendId)!;

          if (expense.paidById === user.id) {
            // You paid, friend owes you (positive balance)
            entry.balance += split.amount;
          } else if (expense.paidById === friendId) {
            // Friend paid, you owe them (negative balance)
            entry.balance -= split.amount;
          }
        });
      });

      // Count shared groups
      group.members.forEach(member => {
        if (member.userId !== user.id && friendBalances.has(member.userId)) {
          friendBalances.get(member.userId)!.sharedGroups++;
        }
      });
    });

    const friends = Array.from(friendBalances.values()).map(entry => ({
      id: entry.user.id,
      name: entry.user.name || 'Unknown',
      email: entry.user.email,
      avatar: entry.user.imageUrl || 'bg-blue-500',
      balance: entry.balance,
      sharedGroups: entry.sharedGroups,
    }));

    return NextResponse.json({ friends });
  } catch (error) {
    console.error('Friends error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}