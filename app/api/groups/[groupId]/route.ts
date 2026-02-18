import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

// Prisma singleton
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// GET /api/groups/[groupId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    // 🔑 IMPORTANT: params is async in Next.js 16
    const { groupId } = await params;

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID missing from route' },
        { status: 400 }
      );
    }

    // Auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch group with members + expenses
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
        expenses: true,
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Ensure user is member
    const isMember = group.members.some(
      m => m.userId === currentUser.id
    );

    if (!isMember) {
      return NextResponse.json(
        { error: 'You are not a member of this group' },
        { status: 403 }
      );
    }

    // Format response for frontend
    const formattedGroup = {
      id: group.id,
      name: group.name,
      type: group.type,
      createdAt: group.createdAt,
      memberCount: group.members.length,
      expenseCount: group.expenses.length,
      members: group.members.map(m => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        imageUrl: m.user.imageUrl,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
      currentUserRole:
        group.members.find(m => m.userId === currentUser.id)?.role ?? 'member',
    };

    // ✅ IMPORTANT: frontend expects this shape
    return NextResponse.json({
      success: true,
      group: formattedGroup,
    });
  } catch (error: any) {
    console.error('Error fetching group:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch group' },
      { status: 500 }
    );
  }
}
