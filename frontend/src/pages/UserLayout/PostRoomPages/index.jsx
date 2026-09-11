import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { createPostAction, uploadFiles } from '../../../services/api/postApi';
import { useToast } from '../../../Components/ToastProvider';
import SelectLocation from "../component/selectLocation";
import BasicInfoSection from "../component/BasicInfoSection";
import UtilitiesSection from "../component/UtilitiesSection";
import CostsSection from "../component/CostsSection";
import HouseRulesSection from "../component/HouseRulesSection";
import MediaUploadSection from "../component/MediaUploadSection";
import ContractSection from "../component/ContractSection";

const PostRoomPages = () => {
  const theme = useTheme();
  
  const [filters, setFilters] = useState({
    category: '',
    priceFrom: '',
    priceTo: '',
    area: '',
    beds: 0,
    baths: 0,
    province: '',
    district: '',
    ward: '',
    street: ''
  });

  // Tiêu đề của bài đăng
  const [title, setTitle] = useState('');
  // Mô tả ngắn hiển thị dưới tiêu đề
  const [overviewDescription, setOverviewDescription] = useState('');

  // Trạng thái địa chỉ cho component SelectLocation
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [address, setAddress] = useState('');

  const [selectedUtilities, setSelectedUtilities] = useState([]);
  // post tier: svip, vip, normal
  const [postTier, setPostTier] = useState('normal');
  const [additionalCosts, setAdditionalCosts] = useState([]);
  const [newCost, setNewCost] = useState({ type: '', frequency: '' });
  const [houseRules, setHouseRules] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [contractImages, setContractImages] = useState([]);
  // Danh sách URL lưu sau khi upload lên Cloudinary
  const [imagesUrls, setImagesUrls] = useState([]);
  const [videosUrls, setVideosUrls] = useState([]);
  const [contractUrls, setContractUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [nameLocation, setNameLocation] = useState({
    provinceName: '',
    districtName: '',
    wardName: ''
  });
  const { showToast } = useToast();

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUtilityChange = (utility) => {
    setSelectedUtilities(prev =>
      prev.includes(utility)
        ? prev.filter(item => item !== utility)
        : [...prev, utility]
    );
  };

  const handleAddCost = () => {
    if (newCost.type && newCost.frequency) {
      setAdditionalCosts(prev => [...prev, { ...newCost, id: Date.now() }]);
      setNewCost({ type: '', frequency: '' });
    }
  };

  const handleRemoveCost = (id) => {
    setAdditionalCosts(prev => prev.filter(cost => cost.id !== id));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + uploadedImages.length > 15) {
      showToast('Tối đa 15 ảnh với tin đăng. Dung lượng không quá 6MB', 'warning');
      return;
    }
    // keep local previews
    // just keep local previews; uploads are deferred until submit
    setUploadedImages(prev => [...prev, ...files]);
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + uploadedVideos.length > 2) {
      showToast('Tối đa 2 video với tin đăng', 'warning');
      return;
    }
    // defer upload until submit
    setUploadedVideos(prev => [...prev, ...files]);
  };

  const handleContractUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + contractImages.length > 6) {
      showToast('Tối đa 6 ảnh hợp đồng', 'warning');
      return;
    }
    // defer upload until submit
    setContractImages(prev => [...prev, ...files]);
  };

  const removeImage = (index, type) => {
    if (type === 'images') {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      setImagesUrls(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'videos') {
      setUploadedVideos(prev => prev.filter((_, i) => i !== index));
      setVideosUrls(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'contract') {
      setContractImages(prev => prev.filter((_, i) => i !== index));
      setContractUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    // DEBUG: log current form/location state to help find why fields appear empty
    console.log('submit debug', { title, overviewDescription, filters, selectedProvince, selectedDistrict, selectedWard, address, nameLocation });

    // Kiểm tra các trường bắt buộc trước khi upload/gọi API
    const missing = [];
    if (!title || !title.trim()) missing.push('Tiêu đề');
    if (!overviewDescription || !overviewDescription.trim()) missing.push('Mô tả');
    if (!filters.category) missing.push('Loại phòng');
    if (!filters.priceFrom) missing.push('Giá (từ)');
    if (!filters.area) missing.push('Diện tích');
    // use selectedProvince/selectedDistrict as fallback if nameLocation not populated
    if (!(nameLocation?.provinceName) && !selectedProvince) missing.push('Tỉnh/Thành');
    if (!(nameLocation?.districtName) && !selectedDistrict) missing.push('Quận/Huyện');
    if (!address || !address.trim()) missing.push('Địa chỉ chi tiết');
    if (missing.length) {
      showToast('Vui lòng điền các trường bắt buộc: ' + missing.join(', '), 'error');
      return;
    }

    // Gom tất cả dữ liệu để lưu vào database
    setIsSubmitting(true);
    try {
      // upload any selected files now and merge with existing URL lists
      let finalImageUrls = Array.isArray(imagesUrls) ? [...imagesUrls] : [];
      let finalVideoUrls = Array.isArray(videosUrls) ? [...videosUrls] : [];
      let finalContractUrls = Array.isArray(contractUrls) ? [...contractUrls] : [];

      // upload images if any File objects present
      if (Array.isArray(uploadedImages) && uploadedImages.length) {
        try {
          const urls = await uploadFiles(uploadedImages, 'posts/media', 3);
          finalImageUrls = [...finalImageUrls, ...urls];
        } catch (e) {
          console.error('One or more image uploads failed', e.details || e);
          // Build a helpful message for the user/developer
          let msg = 'Có lỗi khi upload ảnh.';
          if (e && e.details && Array.isArray(e.details.errors) && e.details.errors.length) {
            msg += ' Chi tiết: ' + e.details.errors.map(x => `#${x.index}: ${x.status || ''} ${x.message || ''}`).join(' | ');
          } else if (e && e.response && e.response.data) {
            try { msg += ' Chi tiết: ' + JSON.stringify(e.response.data); } catch(_) { msg += ` Chi tiết: ${e.response.data}`; }
          } else if (e && e.message) {
            msg += ' ' + e.message;
          }
            showToast(msg, 'error');
          return;
        }
      }

      // upload videos
      if (Array.isArray(uploadedVideos) && uploadedVideos.length) {
        try {
          const urls = await uploadFiles(uploadedVideos, 'posts/media', 2);
          finalVideoUrls = [...finalVideoUrls, ...urls];
        } catch (e) {
          console.error('One or more video uploads failed', e.details || e);
          let msg = 'Có lỗi khi upload video.';
          if (e && e.details && Array.isArray(e.details.errors) && e.details.errors.length) {
            msg += ' Chi tiết: ' + e.details.errors.map(x => `#${x.index}: ${x.status || ''} ${x.message || ''}`).join(' | ');
          } else if (e && e.response && e.response.data) {
            try { msg += ' Chi tiết: ' + JSON.stringify(e.response.data); } catch(_) { msg += ` Chi tiết: ${e.response.data}`; }
          } else if (e && e.message) {
            msg += ' ' + e.message;
          }
            showToast(msg, 'error');
          return;
        }
      }

      // upload contracts
      if (Array.isArray(contractImages) && contractImages.length) {
        try {
          const urls = await uploadFiles(contractImages, 'posts/contracts', 2);
          finalContractUrls = [...finalContractUrls, ...urls];
        } catch (e) {
          console.error('One or more contract uploads failed', e.details || e);
          let msg = 'Có lỗi khi upload hợp đồng.';
          if (e && e.details && Array.isArray(e.details.errors) && e.details.errors.length) {
            msg += ' Chi tiết: ' + e.details.errors.map(x => `#${x.index}: ${x.status || ''} ${x.message || ''}`).join(' | ');
          } else if (e && e.response && e.response.data) {
            try { msg += ' Chi tiết: ' + JSON.stringify(e.response.data); } catch(_) { msg += ` Chi tiết: ${e.response.data}`; }
          } else if (e && e.message) {
            msg += ' ' + e.message;
          }
          showToast(msg, 'error');
          return;
        }
      }

      const formData = {
      // Tiêu đề bài đăng
      title: title,
      // Thông tin cơ bản
      overviewDescription: overviewDescription,
      category: filters.category,
      priceFrom: filters.priceFrom,
      priceTo: filters.priceTo,
      area: filters.area,
      beds: filters.beds,
      baths: filters.baths,

      // Địa chỉ (từ SelectLocation component)
      location: {
        province: nameLocation.provinceName,
        district: nameLocation.districtName,
        ward: nameLocation.wardName,
        detailAddress: address
      },

      // Tiện ích
      utilities: selectedUtilities,

      // Chi phí phát sinh
      additionalCosts: additionalCosts,

      // Nội quy
      houseRules: houseRules,

      // File uploads
      // gửi danh sách URL (ít nhất là mảng string)
      images: finalImageUrls,
      videos: finalVideoUrls,
      contractImages: finalContractUrls
      ,
      postTier: postTier
    };
  console.log('📦 Dữ liệu sẽ lưu vào database:', formData);
  // DEBUG: also show the exact payload object that will be POSTed to /api/posts
  const payloadToSend = { form: formData };
  console.log('📤 Payload to POST /api/posts:', payloadToSend);

      // No pre-validation of media URLs; backend will accept URL lists as provided.

      // call createPostAction which dispatches start/success/failure
      const mediaFiles = [];
      const contractFiles = [];
      try {
        const res = await createPostAction(formData, mediaFiles, contractFiles, dispatch);
        if (res && !res.error) {
          showToast('✅ Đăng tin thành công', 'success');
          // reset các trường form sau khi thành công
          setTitle('');
          setOverviewDescription('');
          setFilters({
            category: '',
            priceFrom: '',
            priceTo: '',
            area: '',
            beds: 0,
            baths: 0,
            province: '',
            district: '',
            ward: '',
            street: ''
          });
          setSelectedProvince('');
          setSelectedDistrict('');
          setSelectedWard('');
          setAddress('');
          setSelectedUtilities([]);
          setAdditionalCosts([]);
          setNewCost({ type: '', frequency: '' });
          setHouseRules('');
          setUploadedImages([]);
          setUploadedVideos([]);
          setContractImages([]);
          setImagesUrls([]);
          setVideosUrls([]);
          setContractUrls([]);
          setNameLocation({ provinceName: '', districtName: '', wardName: '' });
        } else {
          // nếu backend trả lỗi có chi tiết, show nó
          if (res && res.error && res.data) {
            const m = res.data.message || JSON.stringify(res.data);
            showToast('❌ Đăng tin thất bại: ' + m, 'error');
          } else {
            showToast('❌ Đăng tin thất bại', 'error');
          }
        }
        } catch (err) {
        console.error(err);
        showToast('❌ Lỗi hệ thống khi đăng tin', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <Box
      className="invite-roommate-content"
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        p: 2,
        width: '100%'
      }}
    >
      {/* Header Section - Mô tả chức năng */}
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mb: 1,
            textAlign: 'left'
          }}
        >
          Đăng Tin Nhà Trọ
        </Typography>
      </Box>

      <Grid container spacing={2}>

        {/* FULL WIDTH LAYOUT */}
        <Grid size={12}>
           <Grid size={{xs: 12, sm: 10, md: 8, lg: 8 }}>
               <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1} sx={{ textAlign: 'left' }}>
              Tiêu đề
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Tiêu đề bài đăng "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ bgcolor: '#fff' }}
            />
             
           
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1} sx={{ textAlign: 'left' }}>
              Mô tả chung
            </Typography>
           
            <TextField
              fullWidth
              size="small"
              placeholder="Mô tả ngắn tối đa 200 ký tự"
              value={overviewDescription}
              onChange={(e) => setOverviewDescription(e.target.value)}
              sx={{ bgcolor: '#fff', mt: 1 }}
              inputProps={{ maxLength: 200 }}
            />
          </Box>
           </Grid>
          {/* Title input - nằm đầu tiên */}
       
          {/* Hàng 1 & 2: Thông tin cơ bản - Loại phòng, Giá, Diện tích */}
          <BasicInfoSection
            selectedCategory={filters.category}
            setSelectedCategory={(value) => handleFilterChange('category', value)}
            selectedPrice={filters.priceFrom}
            setSelectedPrice={(value) => handleFilterChange('priceFrom', value)}
            selectedArea={filters.area}
            setSelectedArea={(value) => handleFilterChange('area', value)}
            selectedBeds={filters.beds}
            setSelectedBeds={(value) => handleFilterChange('beds', value)}
            selectedBaths={filters.baths}
            setSelectedBaths={(value) => handleFilterChange('baths', value)}
          />

          {/* Hàng 3: Khu vực */}
          <SelectLocation
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
            address={address}
            setAddress={setAddress}
            setNameLocation={setNameLocation}
            nameLocation={nameLocation}
          />

          {/* thông tin mô tả cơ bản */}

          {/* Tiện ích & Nội thất */}
          <UtilitiesSection
            selectedUtilities={selectedUtilities}
            handleUtilityChange={handleUtilityChange}
          />

          {/* Chi phí phụ */}
          <CostsSection
            additionalCosts={additionalCosts}
            newCost={newCost}
            setNewCost={setNewCost}
            handleAddCost={handleAddCost}
            handleRemoveCost={handleRemoveCost}
          />

          {/* Nội quy */}
          <HouseRulesSection
            houseRules={houseRules}
            setHouseRules={setHouseRules}
          />

          {/* Hình ảnh/Video */}
          <MediaUploadSection
            uploadedImages={uploadedImages}
            uploadedVideos={uploadedVideos}
            handleImageUpload={handleImageUpload}
            handleVideoUpload={handleVideoUpload}
            removeImage={removeImage}
            disabled={isSubmitting}
          />

          {/* Bảng hợp đồng */}
          <ContractSection
            contractImages={contractImages}
            handleContractUpload={handleContractUpload}
            removeImage={removeImage}
            disabled={isSubmitting}
          />

          {/* Submit Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Đang gửi...
                </>
              ) : (
                'Đăng tin'
              )}
            </Button>
          </Box>

        </Grid>

      </Grid>
    </Box>
  )
}
export default PostRoomPages;