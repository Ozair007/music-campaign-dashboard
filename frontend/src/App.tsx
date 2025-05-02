import { trpc, client, queryClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CreateCampaign from './pages/CreateCampaign';
import EditCampaign from './pages/EditCampaign';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/create', element: <CreateCampaign /> },
  { path: '/edit/:id', element: <EditCampaign /> },
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
