import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/utils/supabase';

export type CampaignFormData = {
  title: string;
  brand: string;
  start_date: string;
  end_date: string;
  budget: number;
  description?: string;
  image_url?: string;
};

type Props = {
  initialData?: CampaignFormData;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  isLoading: boolean;
};

export default function CampaignForm({ initialData, onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<CampaignFormData>(
    initialData ?? {
      title: '',
      brand: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: 0,
      description: '',
    }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const { data: uploadData } = await supabase.storage
      .from('campaign-images')
      .upload(`campaign-${Date.now()}`, file);

      let imageUrl = '';
    if (uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(uploadData.path);

      imageUrl = publicUrl;
    }

    return imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = form.image_url;
      
      if (imageFile) {
        setUploadProgress(0);
        imageUrl = await uploadImage(imageFile);
        setUploadProgress(null);
      }

      await onSubmit({ 
        ...form, 
        image_url: imageUrl,
        budget: Number(form.budget)
      });

    } catch (error) {
      toast("Error has occurred", {
        description: "Cannot upload image at the moment",
      });
      console.log(error);
    } finally {
      setUploadProgress(null);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="brand" className="block text-sm font-medium">
              Brand *
            </label>
            <Input
              id="brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="start_date" className="block text-sm font-medium">
                Start Date *
              </label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="end_date" className="block text-sm font-medium">
                End Date *
              </label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                min={form.start_date}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium">
              Budget ($) *
            </label>
            <Input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="0.01"
              value={form.budget}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium">
              Campaign Image
            </label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {uploadProgress !== null && (
              <progress value={uploadProgress} max="100" className="w-full" />
            )}
            {(form.image_url || imageFile) && (
              <div className="mt-2">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
                  alt="Preview"
                  className="h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || uploadProgress !== null}
          >
            {isLoading || uploadProgress !== null ? (
              <span className="flex items-center gap-2">
                <Spinner />
                {uploadProgress !== null ? 'Uploading...' : 'Processing...'}
              </span>
            ) : (
              initialData ? 'Update Campaign' : 'Create Campaign'
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}

// Small spinner component
const Spinner = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);