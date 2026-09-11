import React from 'react';
import { Typography, Grid, Button } from '@mui/material';
import { CATEGORY_OPTIONS } from '../../constants/filterOptions';

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Danh mục cho thuê</Typography>
      <Grid container spacing={1.2} sx={{ mb: 2 }}>
        {CATEGORY_OPTIONS.map((c) => (
          <Grid item key={c}>
            <Button
              variant={selectedCategory === c ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setSelectedCategory(c)}
              sx={{ borderRadius: 3 }}
            >
              {c}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CategoryFilter;
