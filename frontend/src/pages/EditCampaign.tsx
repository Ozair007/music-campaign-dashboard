import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCampaigns, updateCampaign } from '@/api/campaigns';
import CampaignForm from '@/components/CampaignForm';
import CampaignModal from '@/components/CampaignModal';
import { Campaign, CampaignFormData } from '@/types';

export default function EditCampaign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const campaigns = await fetchCampaigns();
        const foundCampaign = campaigns.find((c: Campaign) => c.id === id);
        if (!foundCampaign) throw new Error('Campaign not found');
        setCampaign(foundCampaign);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [id]);

  const handleSubmit = async (data: CampaignFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString()
      };

      await updateCampaign(id, payload);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to update campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!campaign) return <p>Campaign not found</p>;

  return (
    <CampaignModal title="Edit Campaign">
      <CampaignForm
        initialData={{
          ...campaign,
          start_date: campaign.start_date.slice(0, 10),
          end_date: campaign.end_date.slice(0, 10),
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </CampaignModal>
  );
}