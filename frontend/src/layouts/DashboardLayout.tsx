import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../providers/AuthProvider';
import { Drawer } from '@mui/material';
import { Navigation } from '../components/Navigation';

export const DashboardLayout = () => {
  const { user, signOut } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Music Campaign Dashboard
          </Typography>
          {user && (
            <>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {user.email}
              </Typography>
              <Button color="inherit" onClick={signOut}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Navigation />
        </Box>
      </Drawer>
      <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};