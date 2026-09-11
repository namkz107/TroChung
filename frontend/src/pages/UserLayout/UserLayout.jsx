import React, { useState, useEffect, Component } from 'react';
import { Box, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserSidebar from '../../Components/Dashboard/UserSidebar';

class OutletErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('User page crashed:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 3 }}>
          <p>Trang này đang gặp lỗi. Thử tải lại hoặc chọn mục khác trên menu.</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#c62828' }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </Box>
      );
    }
    return this.props.children;
  }
}

const UserLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const login = useSelector((state) => state.auth?.login);
  const isLoggedIn = Boolean(
    login?.currentUser || (login?.accessToken && String(login.accessToken).trim().length > 0)
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Đang chuyển tới trang đăng nhập...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)', width: '100%', overflowX: 'hidden' }}>
      <UserSidebar
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          backgroundColor: '#fff',
          minWidth: 0,
          overflow: 'auto',
          mt: { xs: '56px', md: 0 },
        }}
      >
        <OutletErrorBoundary key={location.pathname}>
          <Outlet />
        </OutletErrorBoundary>
      </Box>
    </Box>
  );
};

export default UserLayout;
