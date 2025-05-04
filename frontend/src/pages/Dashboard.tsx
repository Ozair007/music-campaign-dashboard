import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import { fetchCampaigns, deleteCampaign } from '@/api/campaigns';
import { Campaign } from '@/types';
import { toast } from 'sonner';

const placeholder = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

export default function Dashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/');
    };

    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    loadCampaigns();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      toast.success('Campaign deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete campaign');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
        <div className="flex gap-2">
          <Button className='cursor-pointer' onClick={() => navigate('/create')}>+ New Campaign</Button>
          <Button className='cursor-pointer' variant="destructive" onClick={async () => {
            await supabase.auth.signOut();
            navigate('/');
          }}>Logout</Button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading campaigns...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={c.image_url || placeholder}
                  alt={c.title}
                  className="mb-3 rounded-md h-40 w-full object-cover"
                />
                <p className="text-sm text-muted-foreground">
                  <strong>Brand:</strong> {c.brand}<br />
                  <strong>Start:</strong> {c.start_date}<br />
                  <strong>End:</strong> {c.end_date}<br />
                  <strong>Budget:</strong> ${c.budget}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className='cursor-pointer' onClick={() => navigate(`/edit/${c.id}`)}>Edit</Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className='cursor-pointer'
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}