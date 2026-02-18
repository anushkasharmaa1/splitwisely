import { defineConfig } from '@prisma/client/config';

export default defineConfig({
  adapter: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL,
  },
});