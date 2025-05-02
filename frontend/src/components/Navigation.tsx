import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Campaign, Dashboard, AddCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';

type NavItem = {
  text: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Campaigns', icon: <Campaign />, path: '/campaigns' },
  { text: 'Create Campaign', icon: <AddCircle />, path: '/campaigns/new' },
];

export const Navigation = () => {
  return (
    <List>
      {navItems.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};