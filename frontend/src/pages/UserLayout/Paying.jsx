import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import axiosJWT from '../../config/axiosJWT';

const Paying = () => {
  const { requirepaying } = useParams();
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  useEffect(() => {
    if (requirepaying && requirepaying !== 'null') {
      // try to parse numeric
      const n = Number(requirepaying);
      if (!Number.isNaN(n) && n > 0) setAmount(String(n));
    }
  }, [requirepaying]);

  const handleRequest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axiosJWT.post('/api/payments/request', { amount: Number(amount) || 0 });
      if (res.data && res.data.success) {
        setResult(res.data.data);
      } else {
        alert('Yêu cầu thất bại');
      }
    } catch (err) {
      console.error('request pay error', err);
      alert('Lỗi khi tạo yêu cầu thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPaid = async () => {
    if (!result) return;
    try {
      const payload = { historyId: result.historyId, amount: result.amount };
      const res = await axiosJWT.post('/api/payments/approvals', payload);
      if (res.data && res.data.success) {
        setConfirmSent(true);
        alert('Đã gửi yêu cầu xác nhận thanh toán tới admin');
      } else {
        alert(res.data?.message || 'Gửi yêu cầu thất bại');
      }
    } catch (err) {
      console.error('confirm paid error', err);
      const msg = err?.response?.data?.message || 'Lỗi khi gửi yêu cầu xác nhận';
      alert(msg);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Nạp tiền</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography sx={{ mb: 1 }}>Số tiền (VND)</Typography>
        <TextField
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền hoặc chọn từ trang gói"
          type="number"
          fullWidth
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleRequest} disabled={loading}>
            Yêu cầu thanh toán
          </Button>
          <Button variant="outlined" onClick={() => { setAmount(''); setResult(null); }}>
            Hủy
          </Button>
        </Box>
      </Paper>

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{fontWeight:'bold'}} color='primary.main'>Thông tin chuyển khoản</Typography>
          <Typography>Ngân hàng: {result.bankName}</Typography>
          <Typography>Số tài khoản: {result.bankAccount}</Typography>
          <Typography>Nội dung chuyển khoản: {result.content}</Typography>
          <Typography>Số tiền: {result.amount}</Typography>
          <Typography>Thời gian: {new Date(result.time).toLocaleString()}</Typography>

          <Box sx={{ mt: 2 }}>
            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Quét mã QR tại đây </Typography>
            {result.vietqrImageUrl ? (
              <img alt="VietQR" src={result.vietqrImageUrl} />
            ) : (
              <img alt="QR" src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(result.vietqrPayload)}`} />
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleConfirmPaid} disabled={confirmSent}>
                {confirmSent ? 'Đã gửi yêu cầu' : 'Xác nhận đã thanh toán'}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Paying;
