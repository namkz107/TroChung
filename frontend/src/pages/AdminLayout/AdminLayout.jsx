import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar, Box, CssBaseline, Divider, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Stack, Toolbar, Typography,
} from '@mui/material';
import {
  AccountCircleOutlined, ArticleOutlined, DashboardOutlined, ExitToApp,
  HomeOutlined, HotelOutlined, KeyboardReturnOutlined, PaymentsOutlined,
  SupportAgentOutlined, WalletOutlined,
} from '@mui/icons-material';
import { logoutUser } from '../../services/api/authApi';
import './AdminLayout.css';

const drawerWidth = 270;

const adminMenu = [
  { label: 'Tổng quan', icon: <DashboardOutlined />, path: '/admin', exact: true },
  { label: 'Quản lý đặt phòng', icon: <HotelOutlined />, path: '/admin/bookings' },
  { label: 'Quản lý trả phòng', icon: <KeyboardReturnOutlined />, path: '/admin/checkout' },
  { label: 'Yêu cầu đặt cọc', icon: <PaymentsOutlined />, path: '/admin/deposits' },
  { label: 'Trả phòng sớm', icon: <KeyboardReturnOutlined />, path: '/admin/early-checkout' },
  { label: 'Quản lý bài đăng', icon: <ArticleOutlined />, path: '/admin/posts' },
  { label: 'Quản lý hỗ trợ', icon: <SupportAgentOutlined />, path: '/admin/viewsupport' },
  { label: 'Quản lý tài khoản', icon: <AccountCircleOutlined />, path: '/admin/users' },
  { label: 'Yêu cầu rút tiền', icon: <WalletOutlined />, path: '/admin/withdrawals' },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const logout = async () => {
    try { await logoutUser(dispatch, navigate); } catch (error) { console.error('Logout error:', error); }
  };

  return (
    <Drawer variant="permanent" className="admin-sidebar" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
      <Toolbar className="admin-sidebar__brand">
        <Box className="admin-sidebar__mark">T</Box>
        <Box><Typography className="admin-sidebar__name">TroChung</Typography><Typography className="admin-sidebar__caption">ADMIN PANEL</Typography></Box>
      </Toolbar>
      <Box className="admin-sidebar__profile">
        <Avatar>{(user?.username || 'A').charAt(0).toUpperCase()}</Avatar>
        <Box sx={{ minWidth: 0 }}><Typography noWrap fontWeight={700}>{user?.username || 'Quản trị viên'}</Typography><Typography variant="caption">Quản trị hệ thống</Typography></Box>
      </Box>
      <Divider />
      <Typography className="admin-sidebar__section">QUẢN LÝ</Typography>
      <List className="admin-sidebar__menu">
        {adminMenu.map((item) => (
          <ListItemButton key={item.path} selected={isActive(item)} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon><ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box className="admin-sidebar__bottom">
        <Divider />
        <Stack spacing={.5} sx={{ pt: 1.5 }}>
          <ListItemButton onClick={() => navigate('/')}><ListItemIcon><HomeOutlined /></ListItemIcon><ListItemText primary="Xem website" /></ListItemButton>
          <ListItemButton className="admin-sidebar__logout" onClick={logout}><ListItemIcon><ExitToApp /></ListItemIcon><ListItemText primary="Đăng xuất" /></ListItemButton>
        </Stack>
      </Box>
    </Drawer>
  );
}

const AdminLayout = () => (
  <Box className="admin-shell" sx={{ display: 'flex', minHeight: '100vh' }}>
    <CssBaseline />
    <AdminSidebar />
    <Box component="main" className="admin-main">
      <Box className="admin-content"><Outlet /></Box>
    </Box>
  </Box>
);

export default AdminLayout;
