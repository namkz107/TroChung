import React from 'react';
import Carousel from './Carousel/Carousel.jsx';
import Box from '@mui/material/Box';
import PostNews from './PostUpNews/PostNews.jsx';
import PostUpVip from './PostUpVip/PostUpVip.jsx';
import Section from './Section.jsx';
import PostNewInvite from './PostInviteNews/PostInviteNews.jsx';
/* --- HERO CAROUSEL (có nút next/prev + auto slide) --- */
const HomeLanding = () => {

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ mt: 1, p: 2 }}>
        <Carousel sx={{ mt: 2, }} />

      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 1500, width: '100%', mx: 'auto', px: 2 }}>
          <Section title="Tin nổi bật">
            <PostUpVip />
          </Section>

          <Box sx={{ height: 20 }} />

          <Section title="Tin mới đăng">
            <PostNews />
          </Section>
          <Section title="Ở ghép khẩn cấp ">
            <PostNews postType="invite" />
          </Section>

        </Box>


      </Box>

    </Box>

  )
}

export default HomeLanding;
