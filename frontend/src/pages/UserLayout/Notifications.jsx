import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function Notifications() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Thông báo</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Hiện chưa có thông báo mới.
        </Typography>
      </Paper>
    </Box>
  );
}
