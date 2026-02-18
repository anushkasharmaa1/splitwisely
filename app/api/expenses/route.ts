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
        splits: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ expenses });
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

