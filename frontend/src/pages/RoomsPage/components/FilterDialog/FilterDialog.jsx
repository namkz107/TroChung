import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CategoryFilter from './CategoryFilter';
import LocationFilter from './LocationFilter';
import PriceRangeFilter from './PriceRangeFilter';
import AreaRangeFilter from './AreaRangeFilter';
import FeatureFilter from './FeatureFilter';

const FilterDialog = ({
  openFilter,
  closeFilterOverlay,
  selectedCategory,
  setSelectedCategory,
  selectedProvince,
  setSelectedProvince,
  selectedProvinceCode,
  setSelectedProvinceCode,
  selectedDistrict,
  setSelectedDistrict,
  selectedDistrictCode,
  setSelectedDistrictCode,
  selectedWard,
  setSelectedWard,
  selectedWardCode,
  setSelectedWardCode,
  provinceEl,
  setProvinceEl,
  districtEl,
  setDistrictEl,
  wardEl,
  setWardEl,
  provinces,
  districts,
  wards,
  loadingDistricts,
  loadingWards,
  handleProvinceSelect,
  handleDistrictSelect,
  handleWardSelect,
  selectedPriceKey,
  setSelectedPriceKey,
  draftPrice,
  setDraftPrice,
  selectedAreaKey,
  setSelectedAreaKey,
  draftArea,
  setDraftArea,
  draftUtilities,
  toggleUtility,
  selectedFeatures,
  setSelectedFeatures,
  clearAllFilters,
  applyFilters,
  setSearchParams
}) => {
  const handleClearAll = () => {
    clearAllFilters();
    setSearchParams(new URLSearchParams({ page: '1' }));
  };

  return (
    <Dialog open={openFilter} onClose={closeFilterOverlay} fullWidth maxWidth="md">
      <DialogTitle>Bộ lọc</DialogTitle>
      <DialogContent dividers>
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <LocationFilter
          selectedProvince={selectedProvince}
          selectedProvinceCode={selectedProvinceCode}
          setSelectedProvince={setSelectedProvince}
          setSelectedProvinceCode={setSelectedProvinceCode}
          selectedDistrict={selectedDistrict}
          selectedDistrictCode={selectedDistrictCode}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedDistrictCode={setSelectedDistrictCode}
          selectedWard={selectedWard}
          selectedWardCode={selectedWardCode}
          setSelectedWard={setSelectedWard}
          setSelectedWardCode={setSelectedWardCode}
          provinceEl={provinceEl}
          setProvinceEl={setProvinceEl}
          districtEl={districtEl}
          setDistrictEl={setDistrictEl}
          wardEl={wardEl}
          setWardEl={setWardEl}
          provinces={provinces}
          districts={districts}
          wards={wards}
          loadingDistricts={loadingDistricts}
          loadingWards={loadingWards}
          handleProvinceSelect={handleProvinceSelect}
          handleDistrictSelect={handleDistrictSelect}
          handleWardSelect={handleWardSelect}
          isFromDialog={true}
        />
        <PriceRangeFilter
          selectedPriceKey={selectedPriceKey}
          setSelectedPriceKey={setSelectedPriceKey}
          draftPrice={draftPrice}
          setDraftPrice={setDraftPrice}
        />
        <AreaRangeFilter
          selectedAreaKey={selectedAreaKey}
          setSelectedAreaKey={setSelectedAreaKey}
          draftArea={draftArea}
          setDraftArea={setDraftArea}
        />
        <FeatureFilter
          draftUtilities={draftUtilities}
          toggleUtility={toggleUtility}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClearAll}>
          Xóa tất cả bộ lọc
        </Button>
        <Button onClick={closeFilterOverlay}>Đóng</Button>
        <Button variant="contained" onClick={applyFilters}>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
