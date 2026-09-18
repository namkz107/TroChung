import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Section = ({ title, children, sx = {} }) => {
  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, mt: 6 }}>
        <Box>
          <Typography className="home-kicker">Tuyển chọn cho bạn</Typography>
          <Typography variant="h4" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#12372f', mt: .5 }}>{title}</Typography>
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'transparent' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Section;
