import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

const AdminPageHeader = ({ title, description, count, countLabel = 'bản ghi', action }) => (
  <Box className="admin-page-header">
    <Box>
      <Typography className="admin-page-header__eyebrow">QUẢN TRỊ HỆ THỐNG</Typography>
      <Typography component="h1" className="admin-page-header__title">{title}</Typography>
      <Typography className="admin-page-header__description">{description}</Typography>
    </Box>
    <Box className="admin-page-header__aside">
      {Number.isFinite(count) && (
        <Chip icon={<FiberManualRecord />} label={`${count} ${countLabel}`} className="admin-page-header__count" />
      )}
      {action}
    </Box>
  </Box>
);

export default AdminPageHeader;
