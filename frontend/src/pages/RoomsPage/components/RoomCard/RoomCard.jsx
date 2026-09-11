import React from 'react';
import { Paper, Grid } from '@mui/material';
import RoomImage from './RoomImage';
import RoomInfo from './RoomInfo';

const RoomCard = ({ room, favorites, toggleFavorite, handleViewDetails }) => {
  return (
    <Paper 
      key={room.id} 
      elevation={0}
      onClick={() => handleViewDetails(room.id)}
      sx={{ 
        p: 2.5, 
        borderRadius: 3, 
        minHeight: 180,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: '#E4E6EB',
        bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(24, 119, 242, 0.15)',
          transform: 'translateY(-2px)',
          borderColor: '#1877F2',
        }
      }}
    >
      <Grid
        container
        spacing={0.8}
        alignItems="flex-start"
        sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}
      >
        <Grid item xs={12} sm={4} sx={{ display: 'flex', flex: '0 0 auto' }}>
          <RoomImage room={room} favorites={favorites} toggleFavorite={toggleFavorite} />
        </Grid>
        <Grid item xs={12} sm={8} sx={{ display: 'flex', minWidth: 0 }}>
          <RoomInfo room={room} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RoomCard;
