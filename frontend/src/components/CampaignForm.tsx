import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Spinner } from './Spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/utils/supabase';
import { CampaignSchema } from '@/schemas/campaign';
import { format, parseISO } from 'date-fns';
import { CampaignFormData } from '@/types';

type Props = {
  initialData?: CampaignFormData;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  isLoading: boolean;
};

export default function CampaignForm({ initialData, onSubmit, isLoading }: Props) {
  const { 
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm<CampaignFormData>({
    resolver: zodResolver(CampaignSchema),
    defaultValues: initialData ? {
      ...initialData,
      image_url: initialData.image_url || '',
      start_date: format(parseISO(initialData.start_date), 'yyyy-MM-dd'),
      end_date: format(parseISO(initialData.end_date), 'yyyy-MM-dd')
    } : {
      title: '',
      brand: '',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      budget: 0,
      description: '',
      image_url: ''
    }
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `campaign-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error } = await supabase.storage
      .from('campaign-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('campaign-images')
      .getPublicUrl(uploadData.path);

    return publicUrl;
  };

  const processSubmit = async (data: CampaignFormData) => {
    try {
      let imageUrl = data.image_url;
      
      if (imageFile) {
        setUploadProgress(0);
        imageUrl = await uploadImage(imageFile);
        setUploadProgress(null);
      }

      await onSubmit({ 
        ...data,
        image_url: imageUrl
      });

    } catch (error) {
      toast.error("Error occurred", {
        description: error instanceof Error ? error.message : "Failed to save campaign"
      });
    } finally {
      setUploadProgress(null);
    }
  };

  const startDate = watch('start_date');
  useEffect(() => {
    trigger('end_date');
  }, [startDate, trigger]);


  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit(processSubmit, () => {
        toast.error("Validation error", {
          description: "Please check the form fields."
        });
      })}>
        <CardContent className="space-y-4">
           {/* Title Field */}
           <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Title *
              </label>
              <Input
                id="title"
                {...register('title')}
                onError={() =>errors.title?.message}
              />
            </div>

          <div className="space-y-2">
            <label htmlFor="brand" className="block text-sm font-medium">
              Brand *
            </label>
            <Input
              id="brand"
              {...register('brand')}
              onError={() => errors.brand?.message}
              required
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="start_date" className="block text-sm font-medium">
                Start Date *
              </label>
              <Input
                id="start_date"
                type="date"
                {...register('start_date')}
                onError={() => errors.start_date?.message}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="end_date" className="block text-sm font-medium">
                End Date *
              </label>
              <Input
                id="end_date"
                type="date"
                {...register('end_date')}
                min={watch('start_date')}
                onError={() => errors.end_date?.message}
              />
            </div>
          </div>

          
          {/* Budget Field */}
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium">
              Budget ($) *
            </label>
            <Input
              id="budget"
              type="number"
              min="0"
              step="0.01"
              {...register('budget', { valueAsNumber: true })}
              onError={() => errors.budget?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              rows={4}
              {...register('description')}
              onError={() => errors.description?.message}
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
            {(watch('image_url') || imageFile) && (
              <div className="mt-2">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : watch('image_url')}
                  alt="Preview"
                  className="h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
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