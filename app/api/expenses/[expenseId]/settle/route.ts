import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ expenseId: string }> }
) {
  try {
    const { expenseId } = await context.params;

    if (!expenseId) {
      return NextResponse.json({ error: 'Expense ID missing' }, { status: 400 });
    }

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

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        group: { include: { members: true } },
      },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const isMember = expense.group.members.some(
      m => m.userId === user.id
    );

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not allowed to settle this expense' },
        { status: 403 }
      );
    }

    await prisma.expense.update({
      where: { id: expenseId },
      data: { settled: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error settling expense:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to settle expense' },
      { status: 500 }
    );
  }
}





