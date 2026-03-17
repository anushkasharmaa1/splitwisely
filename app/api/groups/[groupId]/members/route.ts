import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(
  request: Request,
  context: { params: Promise<{ groupId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { groupId } = await context.params; // FIXED: await params
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = await prisma.groupMember.findFirst({
      where: {
        userId: currentUser.id,
        groupId: groupId, // FIXED: use awaited groupId
        role: 'admin',
      },
    });

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can add members' },
        { status: 403 }
      );
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }, // FIXED: normalize email
    });

    if (!userToAdd) {
      return NextResponse.json(
        { error: 'User not found. They must sign up for Splitwisely first.' },
        { status: 404 }
      );
    }

    const alreadyMember = await prisma.groupMember.findFirst({
      where: {
        userId: userToAdd.id,
        groupId: groupId, // FIXED: use awaited groupId
      },
    });

    if (alreadyMember) {
      return NextResponse.json(
        { error: 'User is already a member of this group' },
        { status: 400 }
      );
    }

    const member = await prisma.groupMember.create({
      data: {
        userId: userToAdd.id,
        groupId: groupId, // FIXED: use awaited groupId
        role: 'member',
      },
      include: {
        user: true, // FIXED: include user details in response
      },
    });
    // Auto-add as friends (both directions)
await prisma.friendship.upsert({
  where: { userId_friendId: { userId: currentUser.id, friendId: userToAdd.id } },
  create: { userId: currentUser.id, friendId: userToAdd.id },
  update: {},
});
await prisma.friendship.upsert({
  where: { userId_friendId: { userId: userToAdd.id, friendId: currentUser.id } },
  create: { userId: userToAdd.id, friendId: currentUser.id },
  update: {},
});
    // Auto-add as friends (both directions), ignore if already friends
const friendshipData = [
  { userId: currentUser.id, friendId: userToAdd.id },
  { userId: userToAdd.id,   friendId: currentUser.id },
];

for (const f of friendshipData) {
  await prisma.friendship.upsert({
    where: { userId_friendId: { userId: f.userId, friendId: f.friendId } },
    create: f,
    update: {}, // do nothing if already exists
  });
}

    return NextResponse.json({ 
      success: true, 
      message: 'Member added successfully',
      member: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        imageUrl: member.user.imageUrl,
        role: member.role,
      }
    });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}