import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/* =========================
   GET – fetch expenses
========================= */
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
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // ✅ Calculate user-specific amounts for each expense
    const expensesWithUserData = expenses.map(expense => {
      const userSplit = expense.splits.find(s => s.userId === user.id);
      const userShare = userSplit?.amount || 0;
      const settled = userSplit?.settled || false;

      let userOwes = 0;
      let userLent = 0;

      if (expense.paidById === user.id) {
        // User paid - calculate how much others owe them
        userLent = expense.splits
          .filter(s => s.userId !== user.id && !s.settled)
          .reduce((sum, s) => sum + s.amount, 0);
      } else if (userSplit && !userSplit.settled) {
        // Someone else paid - user owes them
        userOwes = userShare;
      }

      return {
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        createdAt: expense.createdAt,
        paidBy: {
          id: expense.paidBy.id,
          name: expense.paidBy.name,
          email: expense.paidBy.email,
        },
        group: {
          id: expense.group.id,
          name: expense.group.name,
        },
        userShare,
        userOwes,
        userLent,
        settled,
      };
    });

    return NextResponse.json({ expenses: expensesWithUserData });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

/* =========================
   POST – create expense
========================= */
export async function POST(req: Request) {
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

    const body = await req.json();
    const { description, amount, category, groupId } = body;

    if (!description || !amount || !groupId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group || group.members.length === 0) {
      return NextResponse.json(
        { error: 'Invalid group' },
        { status: 400 }
      );
    }

    const splitAmount = amount / group.members.length;

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        groupId,
        paidById: user.id,
        splits: {
          create: group.members.map(m => ({
            userId: m.userId,
            amount: splitAmount,
            settled: m.userId === user.id,
          })),
        },
      },
    });

    // 🔴 THIS RESPONSE WAS MISSING EARLIER
    return NextResponse.json({
      success: true,
      expense,
    });
  } catch (err) {
    console.error('CREATE EXPENSE ERROR:', err);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

