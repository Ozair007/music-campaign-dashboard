import { useNavigate } from 'react-router-dom';
import { trpc } from '@/utils/trpc';
import CampaignForm, { CampaignFormData } from '@/components/CampaignForm';
import CampaignModal from '@/components/CampaignModal';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const mutation = trpc.campaignCreate.useMutation({
    onSuccess: () => navigate('/dashboard'),
  });

  const handleSubmit = (data: CampaignFormData) => {
    mutation.mutate(data);
  };

  return (
    <CampaignModal title="Create Campaign">
      <CampaignForm
        onSubmit={handleSubmit}
        isLoading={mutation?.isLoading}
      />
    </CampaignModal>
  );
}
