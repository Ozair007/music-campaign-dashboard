import { useParams, useNavigate } from 'react-router-dom';
import { trpc } from '@/utils/trpc';
import CampaignForm, { CampaignFormData } from '@/components/CampaignForm';
import CampaignModal from '@/components/CampaignModal';

export default function EditCampaign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  
  const { data: campaigns } = trpc.campaignList.useQuery();
  const mutation = trpc.campaignUpdate.useMutation({
    onSuccess: () => navigate('/dashboard'),
  });

  if (!campaigns) return null;

  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) return <p>Campaign not found</p>;

  const handleSubmit = (data: CampaignFormData) => {
    mutation.mutate({ id: id!, ...data });
  };

  return (
    <CampaignModal title="Edit Campaign">
      <CampaignForm
        initialData={{
          ...campaign,
          start_date: campaign.start_date.slice(0, 10),
          end_date: campaign.end_date.slice(0, 10),
        }}
        onSubmit={handleSubmit}
        isLoading={mutation?.isLoading}
      />
    </CampaignModal>
  );
}
