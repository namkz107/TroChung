import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Grid, Chip, Stack, Pagination, Button, Slider, List, ListItemButton, ListItemText, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, Menu, MenuItem, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { FavoriteApi } from '../../services/api';
import { fetchAllRooms } from '../../services/api/postApi';
import { useSelector } from 'react-redux';
import { useToast } from '../../Components/ToastProvider';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((s) => s?.auth?.login?.accessToken);
  const { showToast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [favIds, setFavIds] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const MAX_FAVORITES = 20;

  // Toolbar states
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState('popular');
  const [anchorEl, setAnchorEl] = useState(null);

  // Sidebar/Overlay like RoomsPage
  const [filters, setFilters] = useState({ price: [0, 20], area: [0, 150], types: [], trusts: { vip: false, verified: false, normal: true } });
  const [draftPrice, setDraftPrice] = useState([0, 20]);
  const [draftArea, setDraftArea] = useState([0, 150]);
  const [draftTypes, setDraftTypes] = useState([]);
  const [draftTrusts, setDraftTrusts] = useState({ vip: false, verified: false, normal: true });

  useEffect(() => {
    const load = async () => {
      try {
        const rooms = await fetchAllRooms();
        setRooms(Array.isArray(rooms) ? rooms : []);
      } catch (e) { 
        console.error('Error loading rooms:', e);
        setRooms([]); 
      }
      try {
        console.log('🔄 Loading favorites from API...');
        const res = await FavoriteApi.getMyFavorites();
        console.log('📥 API response:', res);
        const ids = (res?.favorites || []).map(f => String(f.room?._id || f.clientRoomId || f.room));
        console.log('🆔 Extracted favorite IDs:', ids);
        setFavIds(ids);
      } catch (e) {
        console.error('❌ Error loading favorites from API:', e);
        // If cannot load from API, fall back to empty list for anonymous users
        setFavIds([]);
      }
    };
    load();
    const onFavUpdate = async () => {
      if (accessToken) {
        try {
          const res = await FavoriteApi.getMyFavorites();
          const ids = (res?.favorites || []).map(f => String(f.room?._id || f.clientRoomId || f.room));
          setFavIds(ids);
        } catch (err) {
          console.error('Error refreshing favorites after update:', err);
        }
      } else {
        // anonymous users keep favorites in-memory only; nothing to refresh here
      }
    };
    window.addEventListener('favoritesUpdated', onFavUpdate);
    return () => window.removeEventListener('favoritesUpdated', onFavUpdate);
  }, []);

  const favoriteRooms = useMemo(() => {
    const filtered = rooms.filter(r => favIds.includes(r.id));
    console.log('🔍 FavoritesPage - Tổng số phòng:', rooms.length);
    console.log('❤️ FavoritesPage - ID yêu thích:', favIds);
    console.log('📋 FavoritesPage - Phòng yêu thích:', filtered.length);
    return filtered;
  }, [rooms, favIds]);

  // Derived lists from favorites only
  const filteredRooms = favoriteRooms.filter((r) => {
    // Chuyển đổi giá từ VND sang triệu VND để so sánh với filter
    const priceInMillion = r.price / 1000000;
    const priceOk = priceInMillion >= filters.price[0] && priceInMillion <= filters.price[1];
    const areaOk = r.area >= filters.area[0] && r.area <= filters.area[1];
    const typeOk = filters.types.length === 0 ? true : filters.types.includes(r.roomType);
    const searchOk = search.trim() === '' ? true : (
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.address?.toLowerCase().includes(search.toLowerCase()) ||
      r.district?.toLowerCase().includes(search.toLowerCase()) ||
      r.city?.toLowerCase().includes(search.toLowerCase())
    );
    return priceOk && areaOk && typeOk && searchOk;
  });

  const sortRooms = (list) => {
    if (sort === 'newest') {
      return [...list].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    }
    if (sort === 'priceAsc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'priceDesc') return [...list].sort((a, b) => b.price - a.price);
    return list;
  };

  const sortedRooms = sortRooms(filteredRooms);
  const totalPages = Math.max(1, Math.ceil(sortedRooms.length / pageSize));
  const currentItems = sortedRooms.slice((page - 1) * pageSize, page * pageSize);

  const handleSortChange = (_e, v) => { if (v) setSort(v); };
  const openPriceMenu = (e) => setAnchorEl(e.currentTarget);
  const closePriceMenu = () => setAnchorEl(null);
  const applyPrice = () => setFilters((f) => ({ ...f, price: draftPrice }));
  const applyArea = () => setFilters((f) => ({ ...f, area: draftArea }));
  const applyTypes = () => setFilters((f) => ({ ...f, types: draftTypes }));
  const applyTrusts = () => setFilters((f) => ({ ...f, trusts: draftTrusts }));
  const toggleType = (t) => setDraftTypes((prev) => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleFavorite = async (roomId) => {
    setFavIds((prev) => {
      const set = new Set(prev);
      if (set.has(roomId)) {
        console.log('❌ Removing from favorites');
        set.delete(roomId);
        if (accessToken) FavoriteApi.removeFavorite(roomId).catch((e) => console.error('Error removing favorite:', e));
      } else {
        if (set.size >= MAX_FAVORITES) { 
          showToast(`Bạn chỉ có thể lưu tối đa ${MAX_FAVORITES} phòng yêu thích.`, 'warning');
          return prev; 
        }
        console.log('✅ Adding to favorites');
        set.add(roomId);
        if (accessToken) FavoriteApi.addFavorite(roomId).catch((e) => console.error('Error adding favorite:', e));
      }
      const arr = Array.from(set);
      try { window.dispatchEvent(new Event('favoritesUpdated')); } catch (_) {}
      console.log('💾 Updated favorites:', arr);
      return arr;
    });
  };

  return (
    <Box sx={{ bgcolor: '#f7f7f7', minHeight: 'calc(100vh - 70px)', width: '100%', m: 0, p: 0 }}>
      <Grid container spacing={0} sx={{ width: '100%', m: 0 }}>
        {/* LEFT: Sidebar (reuse from RoomsPage) */}
        <Grid item xs={12} lg={2} sx={{ display: { xs: 'none', lg: 'block' }, '@media (max-width:1112px)': { display: 'none' } }}>
          <Box sx={{ p: { lg: 1.5, xl: 2 }, borderRight: '1px solid #eee', position: 'sticky', top: '70px', alignSelf: 'flex-start', ml: 0, minWidth: 220, width: { lg: 240, xl: 300 }, '@media (max-width:1200px) and (min-width:1113px)': { width: 220, p: 1.25 } }}>
            <Chip label="Giá" color="success" size="small" sx={{ borderRadius: 2, mb: 1 }} />
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Slider value={draftPrice} onChange={(_, v) => setDraftPrice(v)} min={0} max={20} step={0.1} valueLabelDisplay="auto" valueLabelFormat={(v) => `${v.toFixed(1)}tr`} />
              <Button size="small" onClick={applyPrice}>Áp dụng</Button>
            </Paper>
            <Chip label="Diện tích" color="success" size="small" sx={{ borderRadius: 2, mb: 1 }} />
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Slider value={draftArea} onChange={(_, v) => setDraftArea(v)} min={0} max={150} step={1} valueLabelDisplay="auto" valueLabelFormat={(v) => `${v}m²`} />
              <Button size="small" onClick={applyArea}>Áp dụng</Button>
            </Paper>
            <Chip label="Loại hình" color="success" size="small" sx={{ borderRadius: 2, mb: 1 }} />
            <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, mb: 2 }}>
              <List dense>
                {['Phòng trọ', 'Căn hộ mini', 'Nhà nguyên căn', 'Ở ghép', 'Studio', 'Căn hộ 1PN'].map((t) => (
                  <ListItemButton key={t} onClick={() => toggleType(t)} selected={draftTypes.includes(t)}>
                    <ListItemText primary={<Typography variant="body2">{t}</Typography>} />
                  </ListItemButton>
                ))}
              </List>
              <Box sx={{ px: 1, pb: 1 }}>
                <Button size="small" onClick={applyTypes}>Áp dụng</Button>
              </Box>
            </Paper>
            <Chip label="Độ tin cậy & Xác minh" color="success" size="small" sx={{ borderRadius: 2, mb: 1 }} />
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <FormControlLabel control={<Checkbox size="small" checked={draftTrusts.vip} onChange={(e) => setDraftTrusts((s) => ({ ...s, vip: e.target.checked }))} />} label={<Typography variant="body2">VIP</Typography>} />
              <FormControlLabel control={<Checkbox size="small" checked={draftTrusts.verified} onChange={(e) => setDraftTrusts((s) => ({ ...s, verified: e.target.checked }))} />} label={<Typography variant="body2">Đã xác minh</Typography>} />
              <FormControlLabel control={<Checkbox size="small" checked={draftTrusts.normal} onChange={(e) => setDraftTrusts((s) => ({ ...s, normal: e.target.checked }))} />} label={<Typography variant="body2">Tin thường</Typography>} />
              <Button size="small" onClick={applyTrusts}>Áp dụng</Button>
            </Paper>
          </Box>
        </Grid>

        {/* RIGHT: Content with toolbar + list */}
        <Grid item xs={12} lg={10} sx={{ mx: { lg: 'auto' }, '@media (max-width:1112px)': { width: '100%' } }}>
          <Box component="main" sx={{ pl: { xs: 1, lg: 0 }, pr: { xs: 1, lg: 1.5 }, py: { xs: 1.2, lg: 1.6 }, ml: { lg: -2 }, maxWidth: { lg: 1360, xl: 1440 }, mx: 'auto', '@media (max-width:1112px)': { ml: 0 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Phòng yêu thích
            </Typography>

            {/* Toolbar search + sort (reuse) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <ToggleButtonGroup value={sort} exclusive onChange={handleSortChange} size="small" sx={{ mr: 'auto' }}>
                <ToggleButton value="popular">Phổ biến</ToggleButton>
                <ToggleButton value="newest">Mới nhất</ToggleButton>
                <ToggleButton value="price" onClick={openPriceMenu}>Giá <ExpandMoreIcon fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closePriceMenu}>
                <MenuItem onClick={() => { setSort('priceAsc'); closePriceMenu(); }}>Giá tăng dần</MenuItem>
                <MenuItem onClick={() => { setSort('priceDesc'); closePriceMenu(); }}>Giá giảm dần</MenuItem>
              </Menu>
              <TextField
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                size="small"
                placeholder="Search for..."
                sx={{ minWidth: 280, bgcolor: '#eee', borderRadius: 5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
              <Chip label={`Tổng: ${sortedRooms.length}`} />
              {filters.types.map((t) => (<Chip key={t} color="primary" label={t} />))}
              <Chip label={`≤ ${filters.price[1]}tr`} />
              <Chip label={`≤ ${filters.area[1]}m²`} />
            </Stack>

            {sortedRooms.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Chưa có phòng nào trong danh sách yêu thích hoặc không có phòng nào khớp bộ lọc.</Typography>
              </Paper>
            ) : (
              <Stack spacing={1}>
                {currentItems.map((room) => (
                  <Paper key={room.id} variant="outlined" sx={{ p: 2.2, borderRadius: 2 }}>
                    <Grid container spacing={1.2} alignItems="stretch">
                      <Grid item xs={12} sm={5} md={3} lg={3}>
                        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: 1.2 }}>
                          <Box component="img" src={room.image} alt={room.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <Tooltip title={favIds.includes(room.id) ? 'Bỏ yêu thích' : 'Yêu thích'}>
                            <IconButton onClick={() => toggleFavorite(room.id)} size="medium" sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(255,255,255,0.9)' }}>
                              {favIds.includes(room.id) ? <FavoriteIcon color="error" fontSize="medium" /> : <FavoriteBorderIcon fontSize="medium" />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={7} md={9} lg={9}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, height: '100%' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.6 }}>
                              {room.title}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 0.6, flexWrap: 'wrap' }}>
                              <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
                                {room.price} {room.unit}
                              </Typography>
                              <Typography variant="body2">{room.area} m²</Typography>
                              <Typography variant="body2">{room.beds || 0}pn</Typography>
                              <Typography variant="body2">{room.baths || 0}wc</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mb: 0.6, flexWrap: 'wrap' }}>
                              <Typography variant="body2" color="text.secondary">{room.district}</Typography>
                              <Typography variant="body2" color="text.secondary">,</Typography>
                              <Typography variant="body2" color="text.secondary">{room.city}</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: 14 }}>
                              {room.description}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Chip size="small" label={room.roomType} />
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => navigate(`/room/${room.id}`)}
                                sx={{ ml: 'auto', textTransform: 'none', fontSize: '12px', minWidth: 'auto', px: 2 }}
                              >
                                Xem chi tiết
                              </Button>
                            </Stack>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            )}

            {sortedRooms.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" shape="rounded" />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FavoritesPage;

