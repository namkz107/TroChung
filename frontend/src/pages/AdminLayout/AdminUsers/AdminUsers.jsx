import React from 'react';
import { Typography, Box } from '@mui/material';

const AdminUsers = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quản lý người dùng
      </Typography>
      <Typography>
        Trang quản lý người dùng - sẽ có table và các chức năng quản lý user
      </Typography>
    </Box>
  );
};

export default AdminUsers;