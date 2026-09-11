
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider, CssBaseline } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 250;

const adminMenu = [
 
  {
    label: 'Quản lý bài đăng',
    icon: <HomeWorkIcon color="primary" />,
    path: '/admin/posts',
  },
  {
    label: 'Quản lý hỗ trợ',
    icon: <ContactSupportIcon color="primary" />,
    path: '/admin/viewsupport',
  },
  {
    label: 'Quản lý tài khoản',
    icon: <AccountCircleIcon color="primary" />,
    path: '/admin/users',
  },
  {
    label: 'Xem website',
    icon: <PeopleIcon color="primary" />,
    path: '/',
  },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#f8fafd', borderRight: '1px solid #e0e0e0' },
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {adminMenu.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            selected={item.path && location.pathname.startsWith(item.path)}
            sx={{ pl: 2, py: 1.2, bgcolor: item.path && location.pathname.startsWith(item.path) ? '#e3f2fd' : 'inherit' }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6fb' }}>
      <CssBaseline />
      <AdminSidebar />
      <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: 64 }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;