import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { NewCampaign, campaigns } from './supabase/schema';
import { db } from './db';
import { eq, gt, sql } from 'drizzle-orm';

const t = initTRPC.create();

export const appRouter = t.router({
  campaignList: t.procedure.query(async () => {
    try {
      return await db.select().from(campaigns);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to load campaigns');
    }
  }),
  campaignById: t.procedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, input.id));
    return result[0];
  }),
  campaignCreate: t.procedure
    .input(
      z.object({
        title: z.string(),
        brand: z.string(),
        start_date: z.string(),
        end_date: z.string(),
        budget: z.number().min(0, "Budget must be positive"),
        image_url: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const newCampaign: NewCampaign = {
        title: input.title,
        brand: input.brand,
        start_date: input.start_date,
        end_date: input.end_date,
        budget: String(input.budget),
        description: input.description,
        image_url: input.image_url,
      };
      return await db.insert(campaigns).values(newCampaign).returning();
    }),
  campaignUpdate: t.procedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        brand: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
        budget: z.number().optional(),
        description: z.string().optional(),
        image_url: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updates = {
        ...(input.title && { title: input.title }),
        ...(input.brand && { brand: input.brand }),
        ...(input.start_date && { start_date: input.start_date }),
        ...(input.end_date && { end_date: input.end_date }),
        ...(input.budget !== undefined && { budget: String(input.budget) }),
        ...(input.description && { description: input.description }),
        ...(input.image_url && { image_url: input.image_url }),
      };
      return await db
        .update(campaigns)
        .set(updates)
        .where(eq(campaigns.id, input.id))
        .returning();
    }),
  campaignDelete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db.delete(campaigns).where(eq(campaigns.id, input.id)).returning();
    }),
  dashboardStats: t.procedure.query(async () => {
    const [totalCampaigns, activeCampaigns] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(campaigns),
      db.select({ count: sql<number>`count(*)` })
        .from(campaigns)
        .where(gt(campaigns.end_date, sql`CURRENT_DATE`)),
    ]);
  
    return {
      totalCampaigns: totalCampaigns[0]?.count ?? 0,
      activeCampaigns: activeCampaigns[0]?.count ?? 0,
    };
  }),
});

export type AppRouter = typeof appRouter;
