import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET - Fetch all groups for current user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find current user in database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Fetch all groups the user is a member of
    const groupMembers = await prisma.groupMember.findMany({
      where: { userId: currentUser.id },
      include: {
        group: {
          include: {
            members: true,
            expenses: true,
          },
        },
      },
    });

    const groups = groupMembers.map((gm) => ({
      id: gm.group.id,
      name: gm.group.name,
      type: gm.group.type,
      memberCount: gm.group.members.length,
      expenseCount: gm.group.expenses.length,
      role: gm.role,
      createdAt: gm.group.createdAt,
    }));

    return NextResponse.json({ groups });
  } catch (error: any) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

// POST - Create a new group
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const body = await request.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    // Create the group and add the creator as admin
    const group = await prisma.group.create({
      data: {
        name,
        type,
        members: {
          create: {
            userId: currentUser.id,
            role: 'admin',
          },
        },
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json({
      success: true,
      group: {
        id: group.id,
        name: group.name,
        type: group.type,
        memberCount: group.members.length,
        createdAt: group.createdAt,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create group' },
      { status: 500 }
    );
  }
}