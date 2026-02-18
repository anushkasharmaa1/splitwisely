import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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

    const memberships = await prisma.groupMember.findMany({
      where: { userId: user.id },
      select: { groupId: true },
    });

    const groupIds = memberships.map(m => m.groupId);

    const expenses = await prisma.expense.findMany({
      where: { groupId: { in: groupIds } },
      include: {
        paidBy: true,
        group: true,
        splits: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedExpenses = expenses.map(expense => {
      const userSplit = expense.splits.find(
        split => split.userId === user.id
      );

      const isUserPayer = expense.paidById === user.id;

      // ✅ Expense-level settlement
      const isSettled = expense.splits.every(
        split => split.settled === true || split.amount === 0
      );

      // 🟢 IMPORTANT FIX:
      // Once settled, balances must be zero
      if (isSettled) {
        return {
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          createdAt: expense.createdAt,
          paidBy: expense.paidBy,
          group: expense.group,
          userShare: userSplit?.amount || 0,
          userOwes: 0,
          userLent: 0,
          settled: true,
        };
      }

      // Normal (pending) calculation
      const userShare = userSplit?.amount || 0;
      const paidByUser = isUserPayer ? expense.amount : 0;
      const balance = paidByUser - userShare;

      return {
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        createdAt: expense.createdAt,
        paidBy: expense.paidBy,
        group: expense.group,
        userShare,
        userOwes: balance < 0 ? Math.abs(balance) : 0,
        userLent: balance > 0 ? balance : 0,
        settled: false,
      };
    });

    return NextResponse.json({
      success: true,
      expenses: formattedExpenses,
    });
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

