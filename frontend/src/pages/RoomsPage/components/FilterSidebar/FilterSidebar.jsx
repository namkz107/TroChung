import React from 'react';
import { Box, Chip } from '@mui/material';
import PriceFilter from './PriceFilter';
import AreaFilter from './AreaFilter';
import TypeFilter from './TypeFilter';
import TrustFilter from './TrustFilter';

const FilterSidebar = ({
  draftPrice,
  setDraftPrice,
  draftArea,
  setDraftArea,
  draftTypes,
  draftTrusts,
  setDraftTrusts,
  applyPrice,
  applyArea,
  toggleType,
  applyTypes,
  applyTrusts
}) => {
  return (
    <Box
      sx={{
        p: { lg: 1.5, xl: 2 },
        borderRight: '1px solid #eee',
        position: 'sticky',
        top: '70px',
        alignSelf: 'flex-start',
        ml: 0,
        minWidth: 190,
        width: { lg: 240, xl: 300 ,md: 200},
        '@media (max-width:1200px) and (min-width:1113px)': { width: 200, p: 1.25 },
         '@media (max-width:1400px) and (min-width:1113px)': { width: 220, p: 1.25 }

      }}
    >
      {/* Giá */}
      <Chip label="Giá" color="success" size="small" sx={{ borderRadius: 2, mb: 1 }} />
      <PriceFilter
        draftPrice={draftPrice}
        setDraftPrice={setDraftPrice}
        applyPrice={applyPrice}
      />

      {/* Diện tích */}
      <Chip label="Diện tích" color="success" size="small" sx={{ borderRadius: 2, mb: 1 }} />
      <AreaFilter
        draftArea={draftArea}
        setDraftArea={setDraftArea}
        applyArea={applyArea}
      />

      {/* Loại hình */}
      <Chip label="Loại hình" color="success" size="small" sx={{ borderRadius: 2, mb: 1 }} />
      <TypeFilter
        draftTypes={draftTypes}
        toggleType={toggleType}
        applyTypes={applyTypes}
      />

      {/* Độ tin cậy & Xác minh */}
      <Chip label="Độ tin cậy & Xác minh" color="success" size="small" sx={{ borderRadius: 2, mb: 1 }} />
      <TrustFilter
        draftTrusts={draftTrusts}
        setDraftTrusts={setDraftTrusts}
        applyTrusts={applyTrusts}
      />
    </Box>
  );
};

export default FilterSidebar;
