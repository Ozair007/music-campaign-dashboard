  
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
  
export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
};

export type Context = ReturnType<typeof createContext>;