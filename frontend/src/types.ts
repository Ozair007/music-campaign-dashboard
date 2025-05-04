import { AuthError, Session, User, WeakPassword } from "@supabase/supabase-js";

export interface Campaign {
	id: string;
	title: string;
	brand: string;
	start_date: string;
	end_date: string;
	budget: number;
	image_url?: string;
	description?: string;
  }
  
  export interface CampaignFormData {
	title: string;
	brand: string;
	start_date: string;
	end_date: string;
	budget: number;
	image_url?: string;
	description?: string;
  }

  export interface AuthContextType {
	user: User | null;
	signIn: (email: string, password: string) => Promise<{
	  user: User;
	  session: Session;
	  weakPassword?: WeakPassword;
	}>;
	signOut: () => Promise<{ error: AuthError | null }>;
  }