import { useEffect, useState } from 'react';
import { FavoriteApi } from '../../services/api';
import { fetchRoomById, fetchRooms } from '../../services/api/postApi';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import { CommentApi } from '../../services/api/commentApi';
import { RatingApi } from '../../services/api/ratingApi';
import { useSelector } from 'react-redux';
import { useToast } from '../../Components/ToastProvider';

// Import components
import RoomHeader from './components/RoomHeader/RoomHeader';
import RoomInfoCard from './components/RoomInfoCard/RoomInfoCard';
import ImageGallery from './components/ImageGallery/ImageGallery';
import UtilitiesFurniture from './components/UtilitiesFurniture/UtilitiesFurniture';
import CostDetails from './components/CostDetails/CostDetails';
import Description from './components/Description/Description';
import VideoSection from './components/VideoSection/VideoSection';
import ReviewsComments from './components/ReviewsComments/ReviewsComments';
import SimilarRooms from './components/SimilarRooms/SimilarRooms';
import MapLocation from './components/MapLocation/MapLocation';
import ContactCard from './components/ContactCard/ContactCard';

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = useSelector((s) => s?.auth?.login?.accessToken);
  const { showToast } = useToast();
  const [room, setRoom] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [comments, setComments] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setSimilarRooms([]);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      try {
        const favPromise = accessToken
          ? FavoriteApi.getMyFavorites()
              .then((resFav) => (resFav?.favorites || []).map(f => String(f.room?._id || f.clientRoomId || f.room)))
              .catch(() => [])
          : Promise.resolve([]);

        const foundRoom = await fetchRoomById(id);
        if (cancelled) return;

        if (foundRoom) {
          setRoom(foundRoom);
          setLoading(false);

          const postId = foundRoom?.postId || foundRoom?.post || foundRoom?.id;
          const extras = [];
          if (postId) {
            extras.push(
              Promise.all([
                CommentApi.listByPost(postId).catch(() => []),
                RatingApi.stats(postId).catch(() => ({ average: 0, count: 0 })),
                accessToken ? RatingApi.me(postId).catch(() => null) : Promise.resolve(null)
              ]).then(([cmt, stats, mine]) => {
                if (!cancelled) {
                  setComments(Array.isArray(cmt) ? cmt : []);
                  setRatingStats(stats || { average: 0, count: 0 });
                  setMyRating(mine || null);
                }
              })
            );
          } else {
            setComments([]);
            setRatingStats({ average: 0, count: 0 });
            setMyRating(null);
          }

          extras.push(
            fetchRooms({ page: 1, limit: 12, postType: foundRoom.postType }).then((allRooms) => {
              const list = Array.isArray(allRooms?.rooms) ? allRooms.rooms : [];
              const similar = list
                .filter((r) => {
                  const rid = String(r?.id || r?._id || '');
                  return rid && rid !== String(foundRoom.id) && rid !== String(id);
                })
                .slice(0, 3);
              if (!cancelled) setSimilarRooms(similar);
            }).catch(() => {
              if (!cancelled) setSimilarRooms([]);
            })
          );

          extras.push(
            favPromise.then((ids) => {
              if (!cancelled) setFavorites(new Set(ids));
            })
          );

          await Promise.all(extras);
        } else {
          setRoom(null);
          setLoading(false);
          const ids = await favPromise;
          if (!cancelled) setFavorites(new Set(ids));
        }
      } catch (e) {
        console.error('Error loading room data:', e);
        if (!cancelled) {
          setRoom(null);
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [id, accessToken]);

  const toggleFavorite = async () => {
    console.log('❤️ Favorite toggle (header)');
    console.log('🔐 Access token:', accessToken ? 'EXISTS' : 'MISSING');
    // If not authenticated, allow in-memory favorite toggling (no backend call, no persistence)
    const MAX_FAVORITES = 20;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      if (accessToken) { try { await FavoriteApi.removeFavorite(id); } catch (_) {} }
    } else {
      if (newFavorites.size >= MAX_FAVORITES) {
        try { showToast(`Bạn chỉ có thể lưu tối đa ${MAX_FAVORITES} phòng yêu thích.`, 'warning'); } catch (_) {}
        return;
      }
      newFavorites.add(id);
      if (accessToken) { try { await FavoriteApi.addFavorite(id); } catch (_) {} }
    }
    setFavorites(newFavorites);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (!room) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Không tìm thấy phòng trọ</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Quay lại
        </Button>
      </Box>
    );
  }

  const isFavorite = favorites.has(String(room.id));

  return (
    <Box key={id} sx={{ maxWidth: 1200, mx: 'auto', p: 3, pb: { xs: 18, md: 22 } }}>
      {/* Header */}
      <RoomHeader 
        room={room}
        isFavorite={isFavorite}
        onBack={handleBack}
        onToggleFavorite={toggleFavorite}
      />

      {/* Room Info Card */}
      <RoomInfoCard room={room} ratingStats={ratingStats} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          {/* Image Gallery */}
          <ImageGallery room={room} />

          {/* Utilities & Furniture */}
          <UtilitiesFurniture utilities={room.utilities} />

          {/* Cost Details */}
          <CostDetails room={room} />

          {/* Description */}
          <Description description={room.description} />

          {/* Video Section */}
          <VideoSection room={room} />

          {/* Reviews & Comments */}
          <ReviewsComments 
            room={room}
            comments={comments}
            setComments={setComments}
            myRating={myRating}
            setMyRating={setMyRating}
            ratingStats={ratingStats}
            setRatingStats={setRatingStats}
            accessToken={accessToken}
            showToast={showToast}
          />

          {/* Similar Rooms */}
          <SimilarRooms 
            similarRooms={similarRooms}
            favorites={favorites}
            setFavorites={setFavorites}
            accessToken={accessToken}
            showToast={showToast}
            FavoriteApi={FavoriteApi}
          />

          {/* Map Location */}
          <MapLocation room={room} />
        </Grid>
      </Grid>

      {/* Floating Contact Card */}
      <ContactCard room={room} />
    </Box>
  );
};

export default RoomDetailPage;
