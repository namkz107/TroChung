import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Pagination, Switch, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tabs, Tooltip, Typography,
} from '@mui/material';
import { DeleteOutline, VisibilityOutlined } from '@mui/icons-material';
import { fetchAllPostsAdmin, deletePost } from '../../../services/api/postApi';
import axiosJWT from '../../../config/axiosJWT';
import { useConfirm } from '../../../Components/ConfirmProvider';
import AdminPageHeader from '../../../Components/Admin/AdminPageHeader';

const PAGE_SIZE = 10;

const normalizeType = (raw) => {
  const value = String(raw || '').toLowerCase().trim();
  const clean = value.replace(/[-_]/g, ' ');
  if (!clean || ['room rental', 'rental', 'roomrental'].includes(clean)) return 'room_rental';
  if (clean.includes('invite') || clean.includes('roomate') || clean.includes('roommate')) return 'invite roomate';
  return value;
};

const AdminPosts = () => {
  const { confirm } = useConfirm();
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewPost, setViewPost] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);

  const loadPosts = async () => {
    setLoading(true); setError(null);
    try {
      const list = await fetchAllPostsAdmin();
      setPosts(Array.isArray(list) ? list : []);
    } catch (err) { setError(err); setPosts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPosts(); }, []);

  const rentalPosts = posts.filter((post) => normalizeType(post.postType) === 'room_rental');
  const invitePosts = posts.filter((post) => normalizeType(post.postType) === 'invite roomate');
  const displayedPosts = tab === 0 ? posts : tab === 1 ? rentalPosts : invitePosts;
  const totalPages = Math.max(1, Math.ceil(displayedPosts.length / PAGE_SIZE));
  const pagedPosts = displayedPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [tab, posts.length]);

  const handleToggleStatus = async (post) => {
    if (!post.postId) return;
    try { setLoading(true); await axiosJWT.put(`/api/posts/${post.postId}/change-status`); await loadPosts(); }
    catch (err) { alert(`Lỗi khi cập nhật trạng thái: ${err?.response?.data?.message || err.message}`); }
    finally { setLoading(false); }
  };

  const handleDelete = async (post) => {
    if (!post.postId) return;
    const accepted = await confirm({ title: 'Xác nhận xóa bài', message: `Bạn có chắc muốn xóa bài “${post.title}”? Dữ liệu liên quan sẽ bị xóa vĩnh viễn.`, confirmText: 'Xóa' });
    if (!accepted) return;
    try { setDeletingId(post.postId); await deletePost(post.postId); await loadPosts(); }
    catch (err) { alert(`Lỗi khi xóa: ${err?.response?.data?.message || err.message}`); }
    finally { setDeletingId(null); }
  };

  return (
    <Box className="admin-page">
      <AdminPageHeader title="Quản lý bài đăng" description="Kiểm duyệt nội dung, khả năng hiển thị và trạng thái các tin đăng." count={posts.length} countLabel="bài đăng" />
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label={`Tất cả (${posts.length})`} />
        <Tab label={`Cho thuê (${rentalPosts.length})`} />
        <Tab label={`Tìm ở ghép (${invitePosts.length})`} />
      </Tabs>

      {error && <Typography color="error" sx={{ mb: 2 }}>Không thể tải danh sách bài đăng.</Typography>}
      <TableContainer className="admin-data-table admin-posts-table">
        <Table>
          <TableHead><TableRow>
            <TableCell>Bài đăng</TableCell><TableCell>Người đăng</TableCell><TableCell>Loại tin</TableCell>
            <TableCell>Giá thuê</TableCell><TableCell>Trạng thái</TableCell><TableCell align="center">Hành động</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {!loading && pagedPosts.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>Chưa có bài đăng trong mục này.</TableCell></TableRow>}
            {pagedPosts.map((post) => {
              const active = post.status !== 'rejected';
              return (
                <TableRow key={post.postId || post.id}>
                  <TableCell>
                    <Box className="admin-post-title">
                      <Avatar variant="rounded" src={post.images?.[0]}>{post.title?.charAt(0)}</Avatar>
                      <Box sx={{ minWidth: 0 }}><Typography fontWeight={700} noWrap title={post.title}>{post.title || 'Chưa có tiêu đề'}</Typography><Typography variant="caption" color="text.secondary" noWrap>{post.address || post.district || post.city || 'Chưa cập nhật địa chỉ'}</Typography></Box>
                    </Box>
                  </TableCell>
                  <TableCell><Typography fontSize=".82rem" noWrap>{post.author || post.user?.email || '—'}</Typography></TableCell>
                  <TableCell><Chip size="small" variant="outlined" label={normalizeType(post.postType) === 'room_rental' ? 'Cho thuê' : 'Ở ghép'} /></TableCell>
                  <TableCell><Typography fontWeight={700}>{post.price != null ? Number(post.price).toLocaleString('vi-VN') : '—'} <Typography component="span" variant="caption" color="text.secondary">{post.unit || 'VND'}</Typography></Typography></TableCell>
                  <TableCell><Chip size="small" color={active ? 'success' : 'default'} label={active ? 'Đang hiển thị' : 'Đã ẩn'} /></TableCell>
                  <TableCell align="center">
                    <Box className="admin-row-actions">
                      <Tooltip title="Xem nội dung"><IconButton onClick={() => setViewPost(post)}><VisibilityOutlined /></IconButton></Tooltip>
                      <Tooltip title={active ? 'Ẩn bài' : 'Hiển thị bài'}><Switch size="small" checked={active} onChange={() => handleToggleStatus(post)} /></Tooltip>
                      <Tooltip title="Xóa bài"><span><IconButton color="error" disabled={deletingId === post.postId} onClick={() => handleDelete(post)}><DeleteOutline /></IconButton></span></Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" /></Box>
      <Dialog open={!!viewPost} onClose={() => setViewPost(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết bài đăng</DialogTitle>
        <DialogContent dividers>{viewPost && <>
          <Typography variant="h6">{viewPost.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>{viewPost.description || 'Không có mô tả.'}</Typography>
          <Typography variant="body2">Địa chỉ: {[viewPost.address, viewPost.district, viewPost.city].filter(Boolean).join(', ') || '—'}</Typography>
          <Typography variant="body2">Giá: {viewPost.price != null ? Number(viewPost.price).toLocaleString('vi-VN') : '—'} {viewPost.unit || 'VND'}</Typography>
          <Typography variant="body2">Diện tích: {viewPost.area || '—'} m²</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>{(viewPost.images || []).map((image, index) => <Box component="img" key={index} src={image} alt="Phòng" sx={{ width: 120, height: 85, objectFit: 'cover', borderRadius: 2 }} />)}</Box>
        </>}</DialogContent>
        <DialogActions><Button onClick={() => setViewPost(null)}>Đóng</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPosts;
