import React, { useState } from 'react';
import { Box, Button, Chip, InputBase, Typography } from '@mui/material';
import { ArrowForward, LocationOn, Search, Verified } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QUICK_CITIES = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'];

function HeroSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submit = (event) => {
    event?.preventDefault();
    const query = keyword.trim();
    navigate(query ? `/rooms?search=${encodeURIComponent(query)}&page=1` : '/rooms');
  };

  return (
    <Box className="home-hero">
      <Box className="home-hero__image" />
      <Box className="home-hero__glow home-hero__glow--one" />
      <Box className="home-hero__glow home-hero__glow--two" />
      <Box className="home-hero__content">
        <Chip className="home-hero__eyebrow" icon={<Verified />} label="Hàng nghìn phòng đã được xác thực" />
        <Typography component="h1" className="home-hero__title">
          Chạm đến không gian<br /><span>thuộc về riêng bạn.</span>
        </Typography>
        <Typography className="home-hero__lead">
          Tìm căn phòng phù hợp với nhịp sống của bạn — nhanh hơn, an tâm hơn và đầy cảm hứng.
        </Typography>
        <Box component="form" onSubmit={submit} className="hero-search">
          <LocationOn className="hero-search__pin" />
          <Box className="hero-search__field">
            <Typography component="label">Bạn muốn sống ở đâu?</Typography>
            <InputBase fullWidth value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Nhập quận, thành phố hoặc tên đường..." inputProps={{ 'aria-label': 'Tìm kiếm phòng theo địa điểm' }} />
          </Box>
          <Button type="submit" className="hero-search__button" startIcon={<Search />}>Tìm phòng</Button>
        </Box>
        <Box className="home-hero__quick">
          <Typography>Khám phá nhanh:</Typography>
          {QUICK_CITIES.map((city) => <Button key={city} onClick={() => navigate(`/rooms?city=${encodeURIComponent(city)}&page=1`)}>{city}</Button>)}
        </Box>
      </Box>
      <Button className="home-hero__explore" onClick={() => navigate('/rooms')} endIcon={<ArrowForward />}>Xem tất cả phòng</Button>
    </Box>
  );
}

export default HeroSearch;
