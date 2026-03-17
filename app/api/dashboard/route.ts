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
  type: 'owe' | 'owed';
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
          include: { user: true },
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

      if (expense.paidById === user.id) {
        // YOU paid — you are owed by others
        const othersUnsettled = expense.splits.filter(
          s => s.userId !== user.id && !s.settled
        );

        const amountOwedToYou = othersUnsettled.reduce(
          (sum, s) => sum + s.amount, 0
        );

        // For activity: show how much others owe you in total
        recentActivity.push({
          id: expense.id,
          title: expense.description,
          paidBy: expense.paidBy.name || expense.paidBy.email,
          category: expense.category,
          group: expense.group.name,
          amount: amountOwedToYou,
          type: 'owed', // green, you are owed
          date: expense.createdAt.toISOString(),
        });

        youAreOwed += amountOwedToYou;
        othersUnsettled.forEach(s => peopleWhoOweYou.add(s.userId));

      } else {
        // Someone ELSE paid — you owe them your split
        if (!userSplit) return;

        recentActivity.push({
          id: expense.id,
          title: expense.description,
          paidBy: expense.paidBy.name || expense.paidBy.email,
          category: expense.category,
          group: expense.group.name,
          amount: userSplit.amount,
          type: 'owe', // red, you owe
          date: expense.createdAt.toISOString(),
        });

        if (!userSplit.settled) {
          youOwe += userSplit.amount;
          peopleYouOwe.add(expense.paidById);
        }
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