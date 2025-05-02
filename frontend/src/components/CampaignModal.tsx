import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
  } from '@/components/ui/dialog';
  import { useNavigate } from 'react-router-dom';
  
  type Props = {
	title: string;
	children: React.ReactNode;
  };
  
  export default function CampaignModal({ title, children }: Props) {
	const navigate = useNavigate();
  
	return (
	  <Dialog open onOpenChange={(open) => !open && navigate('/dashboard')}>
		<DialogContent className="max-w-2xl">
		  <DialogHeader className="flex justify-between items-center">
			<DialogTitle>{title}</DialogTitle>
		  </DialogHeader>
		  {children}
		</DialogContent>
	  </Dialog>
	);
  }
  