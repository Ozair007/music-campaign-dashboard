import { trpc, client, queryClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { 
  RouterProvider, 
  createBrowserRouter,
  Navigate,
  Outlet, 
  useLocation
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CreateCampaign from './pages/CreateCampaign';
import EditCampaign from './pages/EditCampaign';
import { useAuth } from './hooks/useAuth';
import { Spinner } from './components/Spinner';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <p className='text-center'><Spinner /></p>;
  
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const { user } = useAuth();
  
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <Login /> },
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/create', element: <CreateCampaign /> },
      { path: '/edit/:id', element: <EditCampaign /> },
    ]
  }
]);

function App() {
  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;