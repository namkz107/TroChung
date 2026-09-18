import React from 'react';
import { Box, Container, Divider, IconButton, Link, Stack, Typography } from '@mui/material';
import { Facebook, Instagram, MailOutline, PlaceOutlined, PhoneOutlined, YouTube } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const footerGroups = [
  {
    title: 'Khám phá',
    links: [['Trang chủ', '/'], ['Tìm phòng', '/rooms'], ['Tìm người ở ghép', '/invite-rooms'], ['Về chúng tôi', '/about']],
  },
  {
    title: 'Dành cho bạn',
    links: [['Đăng tin cho thuê', '/user/post-room'], ['Phòng yêu thích', '/favorites'], ['Quản lý phòng', '/user/manage-rooms'], ['Hỗ trợ', '/user/support']],
  },
  {
    title: 'Chính sách',
    links: [['Bảo mật thông tin', '/privacy'], ['Điều khoản sử dụng', '/terms'], ['Thanh toán & hoàn tiền', '/payment-policy'], ['Nguyên tắc cộng đồng', '/community-guidelines']],
  },
];

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: '#0d3b34', color: '#fff', pt: { xs: 7, md: 9 }, pb: 3, position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', bgcolor: 'rgba(126,211,186,.06)', right: -170, top: -220 }} />
    <Container maxWidth="lg" sx={{ position: 'relative' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.3fr 1fr 1fr', md: '1.6fr 1fr 1fr 1fr' }, gap: { xs: 5, md: 6 } }}>
        <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: 'auto' } }}>
          <Box component="img" src="/Logomautrang.png" alt="TroChung" sx={{ width: 155, height: 58, objectFit: 'contain', objectPosition: 'left center', mb: 2 }} />
          <Typography sx={{ color: 'rgba(255,255,255,.68)', lineHeight: 1.75, maxWidth: 300, fontSize: '.92rem' }}>
            Nơi kết nối bạn với không gian sống phù hợp — minh bạch, nhanh chóng và an tâm.
          </Typography>
          <Stack spacing={1.2} sx={{ mt: 3, color: 'rgba(255,255,255,.75)' }}>
            <Stack direction="row" spacing={1.2}><PlaceOutlined fontSize="small" /><Typography variant="body2">Việt Nam</Typography></Stack>
            <Stack direction="row" spacing={1.2}><MailOutline fontSize="small" /><Typography variant="body2">support@trochung.vn</Typography></Stack>
            <Stack direction="row" spacing={1.2}><PhoneOutlined fontSize="small" /><Typography variant="body2">1900 1234</Typography></Stack>
          </Stack>
        </Box>
        {footerGroups.map((group) => (
          <Box component="nav" key={group.title} aria-label={group.title}>
            <Typography sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.12rem', mb: 2.2 }}>{group.title}</Typography>
            <Stack spacing={1.45}>
              {group.links.map(([label, to]) => (
                <Link key={label} component={RouterLink} to={to} underline="none" sx={{ color: 'rgba(255,255,255,.65)', fontSize: '.88rem', transition: 'color .2s ease, transform .2s ease', '&:hover': { color: '#a8e8d3', transform: 'translateX(3px)' } }}>{label}</Link>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,.12)', mt: 7, mb: 2.5 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
        <Typography sx={{ color: 'rgba(255,255,255,.48)', fontSize: '.8rem' }}>© {new Date().getFullYear()} TroChung. Không gian tốt, cuộc sống đẹp.</Typography>
        <Stack direction="row" spacing={.7}>
          {[Facebook, Instagram, YouTube].map((Icon, index) => <IconButton key={index} aria-label="Mạng xã hội" sx={{ color: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.15)', '&:hover': { color: '#a8e8d3', bgcolor: 'rgba(255,255,255,.08)', transform: 'translateY(-2px)' } }}><Icon fontSize="small" /></IconButton>)}
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
