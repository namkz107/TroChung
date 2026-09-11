import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { supportApi } from '../../../services/api';

const AdminSupport = () => {
    const [supports, setSupports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        count: 0,
        totalItems: 0
    });
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSupport, setSelectedSupport] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const statusColors = {
        open: 'warning',
        in_progress: 'info',
        closed: 'success'
    };

    const statusLabels = {
        open: 'Mở',
        in_progress: 'Đang xử lý',
        closed: 'Đã đóng'
    };

    const fetchSupports = async (page = 1, status = 'all') => {
        setLoading(true);
        setError('');
        try {
            const response = await supportApi.getAllSupports({ page, limit: 10, status });
            if (response.data.success) {
                setSupports(response.data.data);
                setPagination(response.data.pagination);
            } else {
                setError('Không thể tải danh sách tin hỗ trợ');
            }
        } catch (err) {
            console.error('Error fetching supports:', err);
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (supportId, newStatus) => {
        try {
            const response = await supportApi.updateSupportStatus(supportId, newStatus);
            if (response.data.success) {
                // Cập nhật local state
                setSupports(prev =>
                    prev.map(support =>
                        support._id === supportId
                            ? { ...support, status: newStatus }
                            : support
                    )
                );
            } else {
                setError('Không thể cập nhật trạng thái');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };

    const handlePageChange = (event, page) => {
        fetchSupports(page, statusFilter);
    };

    const handleStatusFilterChange = (event) => {
        const newStatus = event.target.value;
        setStatusFilter(newStatus);
        fetchSupports(1, newStatus);
    };

    const handleViewDetails = (support) => {
        setSelectedSupport(support);
        setDialogOpen(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    useEffect(() => {
        fetchSupports();
    }, []);

    if (loading && supports.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý tin hỗ trợ
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        label="Trạng thái"
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        <MenuItem value="open">Mở</MenuItem>
                        <MenuItem value="in_progress">Đang xử lý</MenuItem>
                        <MenuItem value="closed">Đã đóng</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Tổng số tin
                            </Typography>
                            <Typography variant="h5">
                                {pagination.totalItems}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Đang mở
                            </Typography>
                            <Typography variant="h5" color="warning.main">
                                {supports.filter(s => s.status === 'open').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Đã đóng
                            </Typography>
                            <Typography variant="h5" color="success.main">
                                {supports.filter(s => s.status === 'closed').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Người gửi</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Tin nhắn</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {supports.map((support) => (
                            <TableRow key={support._id}>
                                <TableCell>
                                    <Box>
                                        <Typography variant="subtitle2">
                                            {support.name}
                                        </Typography>
                                        {support.userId && (
                                            <Typography variant="caption" color="textSecondary">
                                                @{support.userId.username}
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>{support.email}</TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 200,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {support.message}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={statusLabels[support.status]}
                                        color={statusColors[support.status]}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption">
                                        {formatDate(support.createdAt)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleViewDetails(support)}
                                        >
                                            Xem
                                        </Button>
                                        <Select
                                            value={support.status}
                                            onChange={(e) => handleStatusChange(support._id, e.target.value)}
                                            size="small"
                                            sx={{ minWidth: 120 }}
                                        >
                                            <MenuItem value="open">Mở</MenuItem>
                                            <MenuItem value="in_progress">Đang xử lý</MenuItem>
                                            <MenuItem value="closed">Đã đóng</MenuItem>
                                        </Select>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination.total > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={pagination.total}
                        page={pagination.current}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            {/* Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Chi tiết tin hỗ trợ</DialogTitle>
                <DialogContent>
                    {selectedSupport && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tên"
                                        value={selectedSupport.name}
                                        fullWidth
                                        disabled
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        value={selectedSupport.email}
                                        fullWidth
                                        disabled
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Số điện thoại"
                                        value={selectedSupport.phone || 'Không có'}
                                        fullWidth
                                        disabled
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Trạng thái"
                                        value={statusLabels[selectedSupport.status]}
                                        fullWidth
                                        disabled
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Tin nhắn"
                                        value={selectedSupport.message}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        disabled
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Ngày tạo"
                                        value={formatDate(selectedSupport.createdAt)}
                                        fullWidth
                                        disabled
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Cập nhật lần cuối"
                                        value={formatDate(selectedSupport.updatedAt)}
                                        fullWidth
                                        disabled
                                        margin="normal"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminSupport;
