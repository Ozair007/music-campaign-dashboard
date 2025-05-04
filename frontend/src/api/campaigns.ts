
import { CampaignFormData } from "@/types";
import { supabase } from "@/utils/supabase";

const API_BASE = import.meta.env.VITE_API_BASE || 'https://music-campaign-dashboard-backend.netlify.app/api';

export const fetchCampaigns = async () => {
  const response = await fetch(`${API_BASE}/campaigns`);
  if (!response.ok) throw new Error('Failed to fetch campaigns');
  return response.json();
};

export const createCampaign = async (campaignData: CampaignFormData) => {
  const response = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify(campaignData)
  });
  if (!response.ok) throw new Error('Failed to create campaign');
  return response.json();
};

export const updateCampaign = async (id: string, campaignData: CampaignFormData) => {
  const response = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify(campaignData)
  });
  if (!response.ok) throw new Error('Failed to update campaign');
  return response.json();
};

export const deleteCampaign = async (id: string) => {
  const response = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${await getAccessToken()}`
    }
  });
  
  if (!response.ok) throw new Error('Failed to delete campaign');
  if (response.status !== 204) {
    return response.json();
  }

  return;
};

// Helper to get Supabase access token
const getAccessToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};