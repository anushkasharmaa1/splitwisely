import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  _req: Request,
  { params }: { params: { expenseId: string } }
) {
  try {
    const { expenseId } = params;

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

    // ✅ Mark ONLY the current user's split as settled
    await prisma.expenseSplit.updateMany({
      where: {
        expenseId,
        userId: user.id,
      },
      data: {
        settled: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error settling expense:', error);
    return NextResponse.json(
      { error: 'Failed to settle expense' },
      { status: 500 }
    );
  }
}







