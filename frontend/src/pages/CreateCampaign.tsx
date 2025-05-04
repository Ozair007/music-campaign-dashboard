import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignForm from '@/components/CampaignForm';
import CampaignModal from '@/components/CampaignModal';
import { createCampaign } from '@/api/campaigns';
import { CampaignFormData } from '@/types';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: CampaignFormData) => {
    setIsLoading(true);
    try {
      await createCampaign(data);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CampaignModal title="Create Campaign">
      <CampaignForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </CampaignModal>
  );
}
