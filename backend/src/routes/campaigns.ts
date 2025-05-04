import { Router } from 'express';
import { db } from '../db/index';
import { campaigns } from '../supabase/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const allCampaigns = await db.select().from(campaigns);
    res.json(allCampaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get single campaign
router.get('/:id', async (req, res) => {
  try {
    const campaign = await db.select()
      .from(campaigns)
      .where(eq(campaigns.id, req.params.id));
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Create campaign
router.post('/', async (req, res) => {
  try {
    const newCampaign = await db.insert(campaigns)
      .values(req.body)
      .returning();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign
router.put('/:id', async (req, res) => {

  const { start_date, end_date, ...rest } = req.body;
    
    const updateData = {
      ...rest,
      ...(start_date && { start_date: new Date(start_date) }),
      ...(end_date && { end_date: new Date(end_date) }),
      updated_at: new Date()
    };

  try {
    const updatedCampaign = await db.update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, req.params.id))
      .returning();
    res.json(updatedCampaign);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
  try {
    await db.delete(campaigns)
      .where(eq(campaigns.id, req.params.id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export const campaignsRouter = router;