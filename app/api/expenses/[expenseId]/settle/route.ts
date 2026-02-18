import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ expenseId: string }> }
  ) {
    const { expenseId } = await params;

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
      include: { splits: true },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    await prisma.expenseSplit.updateMany({
      where: {
        expenseId,
        userId: user.id,
      },
      data: {
        settled: true,
      },
    });

    const remaining = await prisma.expenseSplit.count({
      where: {
        expenseId,
        settled: false,
      },
    });

    if (remaining === 0) {
      await prisma.expense.update({
        where: { id: expenseId },
        data: { settled: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to settle expense' },
      { status: 500 }
    );
  }
}




