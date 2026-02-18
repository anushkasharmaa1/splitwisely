import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to environment variables');
  }

  // ✅ FIX: headers() is async in Next.js 16
  const headerPayload = await headers();

  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- missing svix headers', {
      status: 400,
    });
  }

  // Get request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }

  const eventType = evt.type;

  // USER CREATED
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          imageUrl: image_url || null,
        },
      });

      console.log('✅ User created in database:', id);
    } catch (error) {
      console.error('❌ Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  // USER UPDATED
  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0].email_address,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          imageUrl: image_url || null,
        },
      });

      console.log('✅ User updated in database:', id);
    } catch (error) {
      console.error('❌ Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  // USER DELETED
  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      });

      console.log('✅ User deleted from database:', id);
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
