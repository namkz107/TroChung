import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { ArrowForward, ArticleOutlined, HotelOutlined, PeopleOutline, SupportAgentOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const shortcuts = [
    { title: 'Đặt phòng', description: 'Theo dõi và xử lý các lượt đặt phòng.', icon: <HotelOutlined />, path: '/admin/bookings' },
    { title: 'Bài đăng', description: 'Kiểm duyệt nội dung và trạng thái bài đăng.', icon: <ArticleOutlined />, path: '/admin/posts' },
    { title: 'Tài khoản', description: 'Quản lý người dùng trên hệ thống.', icon: <PeopleOutline />, path: '/admin/users' },
    { title: 'Hỗ trợ', description: 'Phản hồi các yêu cầu cần trợ giúp.', icon: <SupportAgentOutlined />, path: '/admin/viewsupport' },
  ];
  return (
    <Box>
      <Typography className="admin-page-kicker">TRUNG TÂM QUẢN TRỊ</Typography>
      <Typography variant="h4">Xin chào, Quản trị viên</Typography>
      <Typography color="text.secondary" sx={{ mt: -1, mb: 4 }}>Quản lý các hoạt động quan trọng của TroChung tại một nơi.</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2 }}>
        {shortcuts.map((item) => (
          <Card key={item.path} sx={{ '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 42px rgba(18,55,47,.11)' } }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ width: 45, height: 45, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: '#e2f2ec', color: 'primary.main', mb: 2 }}>{item.icon}</Box>
              <Typography variant="h6">{item.title}</Typography>
              <Typography color="text.secondary" sx={{ fontSize: '.84rem', minHeight: 42, mt: .5 }}>{item.description}</Typography>
              <Button onClick={() => navigate(item.path)} endIcon={<ArrowForward />} sx={{ px: 0, mt: 1.5 }}>Mở quản lý</Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
