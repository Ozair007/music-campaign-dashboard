import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';
// import { createContext } from './context';
import { db } from './db';
import "dotenv/config";

const app = express();
app.use(cors(
  {
    origin: "*",
    credentials: true,
  }
));
app.use(express.json());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    // createContext,
  })
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});