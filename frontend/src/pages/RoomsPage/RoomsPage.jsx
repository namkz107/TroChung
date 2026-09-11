import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, Menu, MenuItem, Stack, Chip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Components/ToastProvider';
import { useRooms } from './hooks/useRooms';
import { useFavorites } from './hooks/useFavorites';
import { useFilters } from './hooks/useFilters';
import FilterSidebar from './components/FilterSidebar/FilterSidebar';
import FilterDialog from './components/FilterDialog/FilterDialog';
import AIFilterDialog from './components/AIFilterDialog/AIFilterDialog';
import RoomList from './components/RoomList/RoomList';
import UtilityPanel from './components/UtilityPanel/UtilityPanel';
import { DEFAULT_PAGE_SIZE } from './constants/filterOptions';
import { fetchRooms } from '../../services/api/postApi';
import Grid from '@mui/material/GridLegacy';
const RoomsPage = ({ postType = 'room_rental' }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  console.log('🏠 [RoomsPage] Received postType:', postType);

  // ==================== STATE MANAGEMENT ====================
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('title'); // 'title' or 'user'
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTypeAnchorEl, setSearchTypeAnchorEl] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [openAIFilter, setOpenAIFilter] = useState(false);
  const [aiSearchText, setAISearchText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Custom hooks
  const { rooms: hookRooms, total: hookTotal, page, setPage, searchParams, setSearchParams, setRooms, setTotal } = useRooms(sort, postType, showToast);
  const { favorites, toggleFavorite } = useFavorites(showToast);
  
  // Use local state for rooms/total para manter controle quando usar AI
  const [rooms, setRoomsLocal] = useState(hookRooms);
  const [total, setTotalLocal] = useState(hookTotal);
  
  // Sync with hook when hookRooms changes
  useEffect(() => {
    setRoomsLocal(hookRooms);
    setTotalLocal(hookTotal);
  }, [hookRooms, hookTotal]);
  
  const {
    filters,
    setFilters,
    draftPrice,
    setDraftPrice,
    draftArea,
    setDraftArea,
    draftTypes,
    setDraftTypes,
    draftUtilities,
    setDraftUtilities,
    draftTrusts,
    setDraftTrusts,
    applyPrice,
    applyArea,
    applyTypes,
    applyUtilities,
    applyTrusts,
    toggleType,
    toggleUtility,
    removeUtility,
    clearAllFilters
  } = useFilters();

  // Filter Dialog State
  const [selectedCategory, setSelectedCategory] = useState('Phòng trọ');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedWardCode, setSelectedWardCode] = useState('');
  const [provinceEl, setProvinceEl] = useState(null);
  const [districtEl, setDistrictEl] = useState(null);
  const [wardEl, setWardEl] = useState(null);
  const [selectedPriceKey, setSelectedPriceKey] = useState('all');
  const [selectedAreaKey, setSelectedAreaKey] = useState('all');
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // API Data State
  const [provinces] = useState([
    { code: 1, name: 'Hà Nội' },
    { code: 79, name: 'TP. Hồ Chí Minh' }
  ]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // ==================== LOCATION OPTIONS ====================
  // Load districts when province is selected
  useEffect(() => {
    if (!selectedProvinceCode) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict('');
      setSelectedDistrictCode('');
      setSelectedWard('');
      setSelectedWardCode('');
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`);
        if (response.ok) {
          const data = await response.json();
          setDistricts(data.districts || []);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        showToast('Không thể tải danh sách quận/huyện', 'error');
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [selectedProvinceCode, showToast]);

  // Load wards when district is selected
  useEffect(() => {
    if (!selectedDistrictCode) {
      setWards([]);
      setSelectedWard('');
      setSelectedWardCode('');
      return;
    }

    const fetchWards = async () => {
      try {
        setLoadingWards(true);
        const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`);
        if (response.ok) {
          const data = await response.json();
          setWards(data.wards || []);
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
        showToast('Không thể tải danh sách phường/xã', 'error');
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [selectedDistrictCode, showToast]);

  // Sync URL params to state on mount/change
  useEffect(() => {
    // Restore utilities
    const utilitiesParam = searchParams.get('utilities');
    if (utilitiesParam) {
      const utilitiesArray = utilitiesParam.split(',').map(u => u.trim()).filter(Boolean);
      setDraftUtilities(utilitiesArray);
      setFilters(prev => ({ ...prev, utilities: utilitiesArray }));
    } else {
      setDraftUtilities([]);
      setFilters(prev => ({ ...prev, utilities: [] }));
    }

    // Restore price
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice !== null || maxPrice !== null) {
      const priceRange = [
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : 20
      ];
      setDraftPrice(priceRange);
      setFilters(prev => ({ ...prev, price: priceRange }));
    }

    // Restore area
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    if (minArea !== null || maxArea !== null) {
      const areaRange = [
        minArea ? Number(minArea) : 0,
        maxArea ? Number(maxArea) : 150
      ];
      setDraftArea(areaRange);
      setFilters(prev => ({ ...prev, area: areaRange }));
    }

    // Restore types
    const typesParam = searchParams.get('types');
    if (typesParam) {
      const typesArray = typesParam.split(',').map(t => t.trim()).filter(Boolean);
      setDraftTypes(typesArray);
      setFilters(prev => ({ ...prev, types: typesArray }));
    } else {
      setDraftTypes([]);
      setFilters(prev => ({ ...prev, types: [] }));
    }

    // Restore location
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const ward = searchParams.get('ward');
    if (city) setSelectedProvince(city);
    if (district) setSelectedDistrict(district);
    if (ward) setSelectedWard(ward);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ==================== PAGINATION ====================
  const totalPages = Math.max(1, Math.ceil((total || 0) / DEFAULT_PAGE_SIZE));
  const currentItems = rooms;

  const handlePageChange = (_e, value) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('page', String(value));
    setSearchParams(next);
  };

  // ==================== HANDLERS ====================
  const handleSortChange = (_e, value) => {
    if (value) setSort(value);
  };

  const openPriceMenu = (e) => setAnchorEl(e.currentTarget);
  const closePriceMenu = () => setAnchorEl(null);
  const openLocationMenu = (e) => setLocationAnchorEl(e.currentTarget);
  const closeLocationMenu = () => setLocationAnchorEl(null);
  const openSearchTypeMenu = (e) => setSearchTypeAnchorEl(e.currentTarget);
  const closeSearchTypeMenu = () => setSearchTypeAnchorEl(null);
  const openFilterOverlay = () => setOpenFilter(true);
  const closeFilterOverlay = () => setOpenFilter(false);
  const openAIFilterDialog = () => setOpenAIFilter(true);
  const closeAIFilterDialog = () => setOpenAIFilter(false);

  // Override applyUtilities to include URL params update
  const handleApplyUtilities = () => {
    console.log('🔥 handleApplyUtilities called, draftUtilities:', draftUtilities);
    applyUtilities();
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', '1');
    if (draftUtilities.length > 0) {
      sp.set('utilities', draftUtilities.join(','));
    } else {
      sp.delete('utilities');
    }
    console.log('🔥 Setting searchParams with utilities:', sp.toString());
    setSearchParams(sp);
    setPage(1);
  };

  const handleRemoveUtility = (utility) => {
    removeUtility(utility);
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', '1');
    const updatedUtilities = filters.utilities.filter(u => u !== utility);
    if (updatedUtilities.length > 0) {
      sp.set('utilities', updatedUtilities.join(','));
    } else {
      sp.delete('utilities');
    }
    setSearchParams(sp);
    setPage(1);
  };

  const handleSearch = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', '1');

    // Search text and type
    if (search) {
      sp.set('search', search);
      sp.set('searchType', searchType);
    } else {
      sp.delete('search');
      sp.delete('searchType');
    }

    // Price filter
    if (filters.price && filters.price.length === 2) {
      sp.set('minPrice', String(filters.price[0]));
      sp.set('maxPrice', String(filters.price[1]));
    }

    // Area filter
    if (filters.area && filters.area.length === 2) {
      sp.set('minArea', String(filters.area[0]));
      sp.set('maxArea', String(filters.area[1]));
    }

    // Types filter
    if (filters.types && filters.types.length) {
      sp.set('types', filters.types.join(','));
    } else {
      sp.delete('types');
    }

    // Utilities filter
    if (filters.utilities && filters.utilities.length) {
      sp.set('utilities', filters.utilities.join(','));
    } else {
      sp.delete('utilities');
    }

    // Location filters
    if (selectedProvince) sp.set('city', selectedProvince);
    else sp.delete('city');

    if (selectedDistrict) sp.set('district', selectedDistrict);
    else sp.delete('district');

    if (selectedWard) sp.set('ward', selectedWard);
    else sp.delete('ward');

    setSearchParams(sp);
    setPage(1);
    closeSearchTypeMenu();
  };

  const handleProvinceSelect = (provinceCode, provinceName, isFromDialog = false) => {
    setSelectedProvinceCode(provinceCode);
    setSelectedProvince(provinceName);
    setSelectedDistrict('');
    setSelectedDistrictCode('');
    setSelectedWard('');
    setSelectedWardCode('');

    // Auto-apply filter if not from dialog
    if (!isFromDialog) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', '1');
      if (provinceName) sp.set('city', provinceName);
      else sp.delete('city');
      sp.delete('district');
      sp.delete('ward');
      setSearchParams(sp);
      setPage(1);
    }
  };

  const handleDistrictSelect = (districtCode, districtName, isFromDialog = false) => {
    setSelectedDistrictCode(districtCode);
    setSelectedDistrict(districtName);
    setSelectedWard('');
    setSelectedWardCode('');

    // Auto-apply filter if not from dialog
    if (!isFromDialog) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', '1');
      if (districtName) sp.set('district', districtName);
      else sp.delete('district');
      sp.delete('ward');
      setSearchParams(sp);
      setPage(1);
    }
  };

  const handleWardSelect = (wardCode, wardName, isFromDialog = false) => {
    setSelectedWardCode(wardCode);
    setSelectedWard(wardName);

    // Auto-apply filter if not from dialog
    if (!isFromDialog) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', '1');
      if (wardName) sp.set('ward', wardName);
      else sp.delete('ward');
      setSearchParams(sp);
      setPage(1);
    }
  };

  const clearLocation = (isFromDialog = false) => {
    setSelectedProvince('');
    setSelectedProvinceCode('');
    setSelectedDistrict('');
    setSelectedDistrictCode('');
    setSelectedWard('');
    setSelectedWardCode('');
    setDistricts([]);
    setWards([]);

    // Auto-apply filter if not from dialog
    if (!isFromDialog) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.delete('city');
      sp.delete('district');
      sp.delete('ward');
      setSearchParams(sp);
      setPage(1);
    }
  };

  const handleViewDetails = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const applyFilters = () => {
    setFilters((f) => ({
      ...f,
      price: draftPrice,
      area: draftArea,
      types: draftTypes,
      utilities: draftUtilities,
      trusts: draftTrusts
    }));
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', '1');
    if (search) sp.set('search', search);
    else sp.delete('search');
    if (draftPrice && draftPrice.length === 2) {
      sp.set('minPrice', String(draftPrice[0]));
      sp.set('maxPrice', String(draftPrice[1]));
    }
    if (draftArea && draftArea.length === 2) {
      sp.set('minArea', String(draftArea[0]));
      sp.set('maxArea', String(draftArea[1]));
    }
    if (draftTypes && draftTypes.length) sp.set('types', draftTypes.join(','));
    else sp.delete('types');
    if (draftUtilities && draftUtilities.length) sp.set('utilities', draftUtilities.join(','));
    else sp.delete('utilities');
    if (selectedProvince) sp.set('city', selectedProvince);
    else sp.delete('city');
    if (selectedDistrict) sp.set('district', selectedDistrict);
    else sp.delete('district');
    if (selectedWard) sp.set('ward', selectedWard);
    else sp.delete('ward');
    setSearchParams(sp);
    setPage(1);
    closeFilterOverlay();
  };

  // AI Search Handler
  const handleAISearch = async () => {
    console.log('🤖 AI Search initiated with:', {
      textSearchAI: aiSearchText,
      filters: {
        province: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
        priceRange: draftPrice,
        areaRange: draftArea,
        utilities: draftUtilities,
        features: selectedFeatures
      }
    });
    
    // Start loading
    setAiLoading(true);
    
    try {
      // Apply filters - KHÔNG thêm textSearchAI vào URL
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', '1');
      
      // Add filters (không có textSearchAI)
      if (selectedProvince) sp.set('city', selectedProvince);
      else sp.delete('city');
      if (selectedDistrict) sp.set('district', selectedDistrict);
      else sp.delete('district');
      if (selectedWard) sp.set('ward', selectedWard);
      else sp.delete('ward');
      if (draftPrice && draftPrice.length === 2) {
        sp.set('minPrice', String(draftPrice[0]));
        sp.set('maxPrice', String(draftPrice[1]));
      }
      if (draftArea && draftArea.length === 2) {
        sp.set('minArea', String(draftArea[0]));
        sp.set('maxArea', String(draftArea[1]));
      }
      if (draftUtilities && draftUtilities.length) {
        sp.set('utilities', draftUtilities.join(','));
      }
      
      // Gọi API trực tiếp với textSearchAI
      const res = await fetchRooms({
        page: 1,
        limit: parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE,
        search: searchParams.get('search') || '',
        searchType: searchParams.get('searchType') || 'title',
        minPrice: draftPrice?.[0],
        maxPrice: draftPrice?.[1],
        minArea: draftArea?.[0],
        maxArea: draftArea?.[1],
        city: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
        utilities: draftUtilities?.join(','),
        sort: searchParams.get('sort') || sort,
        postType: postType,
        textSearchAI: aiSearchText.trim() // Gửi AI text qua API, KHÔNG lưu trong URL
      });

      if (res && res.success) {
        // Cập nhật rooms trực tiếp (không qua URL params)
        setRoomsLocal(Array.isArray(res.rooms) ? res.rooms : []);
        setTotalLocal(Number(res.total) || 0);
        setPage(1);
        
        // Update URL params (không có textSearchAI)
        setSearchParams(sp);
        
        // Xử lý AI message nếu có
        if (res.aiMessage) {
          showToast(res.aiMessage, 'warning');
        } else {
          showToast('AI đã phân tích và tìm thấy kết quả phù hợp!', 'success');
        }
        
        if (res.aiStats) {
          console.log('🤖 AI Stats:', res.aiStats);
        }
      }
    } catch (error) {
      console.error('🤖 AI Search error:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm AI', 'error');
    } finally {
      setAiLoading(false);
      closeAIFilterDialog();
    }
  };

  const clearAllFiltersAndReset = () => {
    clearAllFilters();
    setSelectedCategory('Phòng trọ');
    setSelectedPriceKey('all');
    setSelectedAreaKey('all');
    setSelectedFeatures([]);
    clearLocation();
    setPage(1);
  };

  // ==================== RENDER BLOCKS ====================

  // Block 1: FilterFeature Component (Sidebar Desktop)
  const renderFilterFeature = () => (
    <Grid
      item
      xs={12}
      lg={2.5}

      sx={{
        display: { xs: 'none', lg: 'block' },
        '@media (max-width:1112px)': { display: 'none' },
      }}
    >
      <FilterSidebar
        draftPrice={draftPrice}
        setDraftPrice={setDraftPrice}
        draftArea={draftArea}
        setDraftArea={setDraftArea}
        draftTypes={draftTypes}
        draftTrusts={draftTrusts}
        setDraftTrusts={setDraftTrusts}
        applyPrice={applyPrice}
        applyArea={applyArea}
        toggleType={toggleType}
        applyTypes={applyTypes}
        applyTrusts={applyTrusts}
      />
    </Grid>
  );

  // Block 2: DialogFilter Component (Mobile/Tablet)
  const renderDialogFilter = () => (
    <>
      <FilterDialog
        openFilter={openFilter}
        closeFilterOverlay={closeFilterOverlay}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
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
        selectedPriceKey={selectedPriceKey}
        setSelectedPriceKey={setSelectedPriceKey}
        draftPrice={draftPrice}
        setDraftPrice={setDraftPrice}
        selectedAreaKey={selectedAreaKey}
        setSelectedAreaKey={setSelectedAreaKey}
        draftArea={draftArea}
        setDraftArea={setDraftArea}
        draftUtilities={draftUtilities}
        toggleUtility={toggleUtility}
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
        clearAllFilters={clearAllFiltersAndReset}
        applyFilters={applyFilters}
        setSearchParams={setSearchParams}
      />
      
      {/* AI Filter Dialog */}
      <AIFilterDialog
        open={openAIFilter}
        onClose={closeAIFilterDialog}
        aiSearchText={aiSearchText}
        setAISearchText={setAISearchText}
        aiLoading={aiLoading}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        selectedProvinceCode={selectedProvinceCode}
        setSelectedProvinceCode={setSelectedProvinceCode}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedDistrictCode={selectedDistrictCode}
        setSelectedDistrictCode={setSelectedDistrictCode}
        selectedWard={selectedWard}
        setSelectedWard={setSelectedWard}
        selectedWardCode={selectedWardCode}
        setSelectedWardCode={setSelectedWardCode}
        provinceEl={provinceEl}
        setProvinceEl={setProvinceEl}
        districtEl={districtEl}
        setDistrictEl={setDistrictEl}
        wardEl={wardEl}
        setWardEl={setWardEl}
        provinceOptions={provinces}
        districtOptions={districts}
        wardOptions={wards}
        loadingDistricts={loadingDistricts}
        loadingWards={loadingWards}
        handleProvinceSelect={handleProvinceSelect}
        handleDistrictSelect={handleDistrictSelect}
        handleWardSelect={handleWardSelect}
        selectedPriceKey={selectedPriceKey}
        setSelectedPriceKey={setSelectedPriceKey}
        draftPrice={draftPrice}
        setDraftPrice={setDraftPrice}
        selectedAreaKey={selectedAreaKey}
        setSelectedAreaKey={setSelectedAreaKey}
        draftArea={draftArea}
        setDraftArea={setDraftArea}
        draftUtilities={draftUtilities}
        toggleUtility={toggleUtility}
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
        clearAllFilters={clearAllFiltersAndReset}
        onAISearch={handleAISearch}
        setSearchParams={setSearchParams}
      />
    </>
  );

  // Block 3: ListRoomPage Component (Main Content)
  const renderListRoomPage = () => (
    <Grid
      item
      xs={12}
      lg={7.5}
      sx={{
        mx: { xs: 0, md: 2, lg: 0 },
        px: { xs: 2, lg: 0 },
        '@media (max-width:1300px) and (min-width:1113px)': {
          flexBasis: '75%',
          maxWidth: '75%'
        },
        '@media (max-width:1112px) and (min-width:990px)': {
          flexBasis: '95%',
          maxWidth: '95%',
          mx: 3
        }
      }}
    >
      <Box sx={{ width: '100%', py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: 'text.primary'
            }}
          >
            Tìm phòng trọ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tìm kiếm trong {total} phòng trọ
          </Typography>
        </Box>

        {/* Search & Sort Toolbar */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 3,
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* First Row: Filter, Search, Sort */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {/* Filter Button (All Screens) */}
            <ToggleButton
              value="filter"
              selected={openFilter}
              onClick={openFilterOverlay}
              sx={{
                borderRadius: 2,
                px: 2
              }}
            >
              <FilterAltOutlinedIcon sx={{ mr: 0.5 }} />
              Lọc
            </ToggleButton>

            {/* Search Bar */}
            <TextField
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              size="small"
              placeholder={searchType === 'title' ? 'Tìm kiếm theo tiêu đề, địa chỉ...' : 'Tìm kiếm theo người đăng...'}
              sx={{
                flexGrow: 1,
                flex: { xs: '1 1 100%', sm: '1 1 auto' },
                minWidth: { xs: '100%', sm: 240 },
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      onClick={openSearchTypeMenu}
                      endIcon={<ExpandMoreIcon />}
                      sx={{
                        minWidth: 'auto',
                        textTransform: 'none',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        borderLeft: '1px solid #ddd',
                        borderRadius: 0,
                        pl: 2
                      }}
                    >
                      {searchType === 'title' ? 'Tiêu đề' : 'Người đăng'}
                    </Button>
                  </InputAdornment>
                )
              }}
            />

            {/* Search Type Menu */}
            <Menu
              anchorEl={searchTypeAnchorEl}
              open={Boolean(searchTypeAnchorEl)}
              onClose={closeSearchTypeMenu}
              PaperProps={{
                sx: { minWidth: 150 }
              }}
            >
              <MenuItem
                onClick={() => {
                  setSearchType('title');
                  closeSearchTypeMenu();
                }}
                selected={searchType === 'title'}
              >
                Tiêu đề
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSearchType('user');
                  closeSearchTypeMenu();
                }}
                selected={searchType === 'user'}
              >
                Người đăng
              </MenuItem>
            </Menu>

            {/* Search Button */}
            <Button
              variant="contained"
              size="medium"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                whiteSpace: 'nowrap'
              }}
            >
              Tìm kiếm
            </Button>

            {/* AI Search Button - Only for invite-rooms */}
            {postType === 'invite roomate' && (
              <Button
                variant="contained"
                size="medium"
                onClick={openAIFilterDialog}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #5e3c82 100%)',
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                🤖 Tìm kiếm với AI
              </Button>
            )}

            {/* Sort Buttons */}
            <ToggleButtonGroup
              value={sort}
              exclusive
              onChange={handleSortChange}
              size="small"
              sx={{
                ml: { sm: 'auto' },
                '& .MuiToggleButton-root': {
                  px: 2,
                  textTransform: 'none'
                }
              }}
            >
              <ToggleButton value="popular">Phổ biến</ToggleButton>
              <ToggleButton value="newest">Mới nhất</ToggleButton>
              <ToggleButton value="price" onClick={openPriceMenu}>
                Giá <ExpandMoreIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closePriceMenu}>
              <MenuItem onClick={() => { setSort('priceAsc'); closePriceMenu(); }}>
                Giá tăng dần
              </MenuItem>
              <MenuItem onClick={() => { setSort('priceDesc'); closePriceMenu(); }}>
                Giá giảm dần
              </MenuItem>
            </Menu>
          </Box>

          {/* Second Row: Location Filter */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {/* Province Selection */}
            <Button
              variant="outlined"
              size="small"
              onClick={openLocationMenu}
              endIcon={<ExpandMoreIcon />}
              startIcon={<LocationOnIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                whiteSpace: 'nowrap'
              }}
            >
              {selectedProvince || 'Chọn tỉnh/thành'}
            </Button>

            <Menu
              anchorEl={locationAnchorEl}
              open={Boolean(locationAnchorEl)}
              onClose={closeLocationMenu}
              PaperProps={{
                sx: { maxHeight: 400 }
              }}
            >
              <MenuItem
                onClick={() => {
                  clearLocation(false);
                  closeLocationMenu();
                }}
                selected={!selectedProvince}
              >
                Tất cả
              </MenuItem>
              {provinces.map((province) => (
                <MenuItem
                  key={province.code}
                  onClick={() => {
                    handleProvinceSelect(province.code, province.name, false);
                    closeLocationMenu();
                  }}
                  selected={selectedProvinceCode === province.code}
                >
                  {province.name}
                </MenuItem>
              ))}
            </Menu>

            {/* District Selection */}
            {selectedProvince && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => setDistrictEl(e.currentTarget)}
                  endIcon={<ExpandMoreIcon />}
                  disabled={loadingDistricts || districts.length === 0}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 2,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {loadingDistricts ? 'Đang tải...' : (selectedDistrict || 'Chọn quận/huyện')}
                </Button>

                <Menu
                  anchorEl={districtEl}
                  open={Boolean(districtEl)}
                  onClose={() => setDistrictEl(null)}
                  PaperProps={{
                    sx: { maxHeight: 400 }
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setSelectedDistrict('');
                      setSelectedDistrictCode('');
                      setSelectedWard('');
                      setSelectedWardCode('');
                      setDistrictEl(null);
                      // Apply filter
                      const sp = new URLSearchParams(searchParams.toString());
                      sp.delete('district');
                      sp.delete('ward');
                      setSearchParams(sp);
                    }}
                    selected={!selectedDistrict}
                  >
                    Tất cả
                  </MenuItem>
                  {districts.map((district) => (
                    <MenuItem
                      key={district.code}
                      onClick={() => {
                        handleDistrictSelect(district.code, district.name, false);
                        setDistrictEl(null);
                      }}
                      selected={selectedDistrictCode === district.code}
                    >
                      {district.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            {/* Ward Selection */}
            {selectedDistrict && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => setWardEl(e.currentTarget)}
                  endIcon={<ExpandMoreIcon />}
                  disabled={loadingWards || wards.length === 0}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 2,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {loadingWards ? 'Đang tải...' : (selectedWard || 'Chọn phường/xã')}
                </Button>

                <Menu
                  anchorEl={wardEl}
                  open={Boolean(wardEl)}
                  onClose={() => setWardEl(null)}
                  PaperProps={{
                    sx: { maxHeight: 400 }
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setSelectedWard('');
                      setSelectedWardCode('');
                      setWardEl(null);
                      // Apply filter
                      const sp = new URLSearchParams(searchParams.toString());
                      sp.delete('ward');
                      setSearchParams(sp);
                    }}
                    selected={!selectedWard}
                  >
                    Tất cả
                  </MenuItem>
                  {wards.map((ward) => (
                    <MenuItem
                      key={ward.code}
                      onClick={() => {
                        handleWardSelect(ward.code, ward.name, false);
                        setWardEl(null);
                      }}
                      selected={selectedWardCode === ward.code}
                    >
                      {ward.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Box>

        {/* Active Filters - Always show */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {/* Location Filter Chips */}
          {selectedProvince && (
            <Chip
              label={selectedProvince}
              size="small"
              color="secondary"
              variant="outlined"
              onDelete={() => clearLocation()}
            />
          )}
          {selectedDistrict && (
            <Chip
              label={selectedDistrict}
              size="small"
              color="secondary"
              variant="outlined"
              onDelete={() => {
                setSelectedDistrict('');
                setSelectedDistrictCode('');
                setSelectedWard('');
                setSelectedWardCode('');
              }}
            />
          )}
          {selectedWard && (
            <Chip
              label={selectedWard}
              size="small"
              color="secondary"
              variant="outlined"
              onDelete={() => {
                setSelectedWard('');
                setSelectedWardCode('');
              }}
            />
          )}

          {/* Type Filters */}
          {filters.types.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}

          {/* Utility Filters */}
          {filters.utilities.map((utility) => (
            <Chip
              key={utility}
              label={utility}
              size="small"
              color="info"
              variant="outlined"
              onDelete={() => handleRemoveUtility(utility)}
            />
          ))}

          {/* Price Filter - Always show */}
          <Chip
            label={filters.price[1] >= 20 ? 'Tất cả mức giá' : `Giá ≤ ${filters.price[1]}tr`}
            size="small"
            color={filters.price[1] < 20 ? 'success' : 'default'}
            variant="outlined"
          />

          {/* Area Filter - Always show */}
          <Chip
            label={filters.area[1] >= 150 ? 'Tất cả diện tích' : `DT ≤ ${filters.area[1]}m²`}
            size="small"
            color={filters.area[1] < 150 ? 'info' : 'default'}
            variant="outlined"
          />

          {/* Trust Level Filters */}
          {filters.trusts.vip && (
            <Chip label="VIP" size="small" color="warning" variant="outlined" />
          )}
          {filters.trusts.verified && (
            <Chip label="Đã xác minh" size="small" color="success" variant="outlined" />
          )}
        </Stack>

        {/* Room List */}
        <RoomList
          currentItems={currentItems}
          filters={filters}
          total={total}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          handleViewDetails={handleViewDetails}
          totalPages={totalPages}
          page={page}
          handlePageChange={handlePageChange}
        />

      </Box>
    </Grid>
  );

  return (
    <Box sx={{
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      minHeight: 'calc(100vh - 70px)',
      width: '100%',
      m: 0,
      p: 0
    }}>
      <Grid container spacing={3} sx={{ width: '100%', px: { xs: 2, lg: 0 } }}>
        {/* BLOCK 1: FilterFeature - Sidebar (Desktop Only) */}
        {renderFilterFeature()}

        {/* BLOCK 3: ListRoomPage - Main Content */}
        {renderListRoomPage()}

        {/* BLOCK 4: UtilityPanel - Right Sidebar (Desktop Only) */}
        <Grid
          item
          lg={2}
          sx={{
            "@media (max-width:1300px)": { display: 'none' },
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <UtilityPanel
            draftUtilities={draftUtilities}
            toggleUtility={toggleUtility}
            applyUtilities={handleApplyUtilities}
          />
        </Grid>
      </Grid>

      {/* BLOCK 2: DialogFilter - Mobile Filter Dialog */}
      {renderDialogFilter()}
    </Box>
  );
};

export default RoomsPage;
