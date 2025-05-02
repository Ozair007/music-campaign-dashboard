// utils/storage.ts
export const getPublicUrl = (path: string | null) => {
	const placeholder = '/placeholder-image.jpg';
	
	if (!path) return placeholder;
  
	// Handle already complete URLs
	if (path.startsWith('http')) return path;
  
	// Handle different path formats
	if (path.includes('campaign-images/')) {
	  return path;
	}
  
	// Default case - assume it's in the campaigns folder
	return `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/campaign-images/campaigns/${path}`;
  };