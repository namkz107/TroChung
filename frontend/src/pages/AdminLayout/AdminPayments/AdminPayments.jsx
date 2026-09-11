import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axiosJWT from '../../../config/axiosJWT';

const AdminPayments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosJWT.get('/api/payments/approvals/pending');
      if (res.data && res.data.success) setItems(res.data.items || []);
    } catch (err) {
      console.error('load approvals', err);
      alert('Lỗi khi tải danh sách duyệt');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Xác nhận đã nhận tiền và muốn cộng tiền vào ví?')) return;
    try {
      const res = await axiosJWT.put(`/api/payments/approvals/${id}/approve`);
      if (res.data && res.data.success) {
        alert('Đã xác nhận thành công');
        load();
      } else {
        alert('Xác nhận thất bại');
      }
    } catch (err) {
      console.error('approve error', err);
      alert('Lỗi khi xác nhận');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Duyệt giao dịch nạp tiền</Typography>
      {loading && <Typography>Đang tải...</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Người gửi</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(it => (
              <TableRow key={it._id}>
                <TableCell>{it.user?.username || it.user?.email || String(it.user)}</TableCell>
                <TableCell>{it.amount}</TableCell>
                <TableCell>{new Date(it.createdAt).toLocaleString()}</TableCell>
                <TableCell>{it.approved ? 'Đã duyệt' : 'Chờ duyệt'}</TableCell>
                <TableCell>
                  {!it.approved && <Button variant="contained" color="primary" onClick={() => handleApprove(it._id)}>Xác nhận</Button>}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}><Typography sx={{ p: 2 }}>Không có giao dịch chờ duyệt</Typography></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminPayments;
