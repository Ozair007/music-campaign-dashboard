import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../backend/src/router'; // Adjust path if needed
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';

export const trpc = createTRPCReact<AppRouter>();

export const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: `/api`,
    }),
  ],
});

export const queryClient = new QueryClient();
