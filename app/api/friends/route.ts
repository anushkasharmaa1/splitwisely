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

    // Get all friendships for this user
    const friendships = await prisma.friendship.findMany({
      where: { userId: user.id },
      include: { friend: true },
    });

    if (friendships.length === 0) {
      return NextResponse.json({ friends: [] });
    }

    // Get all shared groups to calculate balances
    const groups = await prisma.group.findMany({
      where: { members: { some: { userId: user.id } } },
      include: {
        members: { include: { user: true } },
        expenses: {
          include: { splits: true, paidBy: true },
        },
      },
    });

    // Build balance map
    const balanceMap = new Map<string, { balance: number; sharedGroups: Set<string> }>();

    // Initialize all friends with 0 balance
    friendships.forEach(f => {
      balanceMap.set(f.friendId, { balance: 0, sharedGroups: new Set() });
    });

    groups.forEach(group => {
      group.expenses.forEach(expense => {
        expense.splits.forEach(split => {
          if (split.settled) return;
          if (!balanceMap.has(split.userId)) return; // not a friend

          const entry = balanceMap.get(split.userId)!;

          if (expense.paidById === user.id) {
            entry.balance += split.amount; // friend owes you
          } else if (expense.paidById === split.userId) {
            entry.balance -= split.amount; // you owe friend
          }
        });
      });

      // Count shared groups per friend
      group.members.forEach(member => {
        if (member.userId !== user.id && balanceMap.has(member.userId)) {
          balanceMap.get(member.userId)!.sharedGroups.add(group.id);
        }
      });
    });

    const friends = friendships.map(f => {
      const entry = balanceMap.get(f.friendId) ?? { balance: 0, sharedGroups: new Set() };
      return {
        id: f.friend.id,
        name: f.friend.name || 'Unknown',
        email: f.friend.email,
        avatar: f.friend.imageUrl || 'bg-blue-500',
        balance: entry.balance,
        sharedGroups: entry.sharedGroups.size,
      };
    });

    return NextResponse.json({ friends });
  } catch (error) {
    console.error('Friends error:', error);
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 });
  }
}