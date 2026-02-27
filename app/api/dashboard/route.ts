import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
interface ActivityItem {
  id: string;
  title: string;
  paidBy: string;
  category: string;
  group: string;
  amount: number;
  type: string;
  date: string;
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

    // Get all expenses user is involved in
    const expenses = await prisma.expense.findMany({
      where: {
        group: {
          members: {
            some: { userId: user.id },
          },
        },
      },
      include: {
        paidBy: true,
        group: true,
        splits: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let youOwe = 0;
    let youAreOwed = 0;
    const peopleYouOwe = new Set<string>();
    const peopleWhoOweYou = new Set<string>();
   const recentActivity: ActivityItem[] = [];

    expenses.forEach(expense => {
      const userSplit = expense.splits.find(s => s.userId === user.id);
      if (!userSplit) return;

      // Calculate for activity feed
      const activityAmount = userSplit.amount;
      const activityType = expense.paidById === user.id ? 'owed' : 'owe';

      recentActivity.push({
        id: expense.id,
        title: expense.description,
        paidBy: expense.paidBy.name || expense.paidBy.email,
        category: expense.category,
        group: expense.group.name,
        amount: activityAmount,
        type: activityType,
        date: expense.createdAt.toISOString(),
      });

      // Skip settled expenses for balance calculation
      if (userSplit.settled) return;

      if (expense.paidById === user.id) {
        // You paid - others owe you
        expense.splits.forEach(split => {
          if (split.userId !== user.id && !split.settled) {
            youAreOwed += split.amount;
            peopleWhoOweYou.add(split.userId);
          }
        });
      } else {
        // Someone else paid - you owe them
        youOwe += userSplit.amount;
        peopleYouOwe.add(expense.paidById);
      }
    });

    const totalBalance = youAreOwed - youOwe;

    return NextResponse.json({
      totalBalance,
      youOwe,
      youAreOwed,
      owedToPeople: peopleYouOwe.size,
      owedFromPeople: peopleWhoOweYou.size,
      recentActivity: recentActivity.slice(0, 10),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}