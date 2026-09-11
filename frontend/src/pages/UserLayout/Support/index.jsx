import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, TextField, Typography, Button, Stack, Divider } from '@mui/material';
import { getCaptcha, sendSupport } from './supportService'; // <-- import từ service
import { useToast } from '../../../Components/ToastProvider';

const SupportPage = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [captcha, setCaptcha] = useState({ display: '', token: '' });
    const { showToast } = useToast();

    const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    // 🟢 Dùng service để lấy captcha
    const loadCaptcha = async () => {
        try {
            const res = await getCaptcha();
            if (res.data?.success) {
                setCaptcha({ display: res.data.display, token: res.data.token });
            }
        } catch {
            console.error('Lỗi khi tải captcha');
        }
    };
    useEffect(() => {
        loadCaptcha();
    }, []);

    // 🟢 Dùng service để gửi form liên hệ
    const handleSubmit = async () => {
        try {
            const res = await sendSupport(form, captcha.token);
            if (res.data?.success) {
                showToast('Đã gửi liên hệ. Cảm ơn bạn!', 'success');
                setForm({ name: '', email: '', phone: '', message: '', captchaCode: '' });
                loadCaptcha();
            }
        } catch (e) {
            showToast('Gửi thất bại. Vui lòng kiểm tra captcha hoặc đăng nhập.', 'error');
            setForm({ name: '', email: '', phone: '', message: '', captchaCode: '' });
            loadCaptcha();
        }
    };

    return (
        <Box sx={{ width: '100%', bgcolor: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Liên hệ trực tiếp
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <TextField label="Tên của bạn" required fullWidth size="small"
                                value={form.name} onChange={handleChange('name')} />
                            <TextField label="Email" required fullWidth size="small" type="email"
                                value={form.email} onChange={handleChange('email')} />
                            <TextField label="Điện thoại" fullWidth size="small"
                                value={form.phone} onChange={handleChange('phone')} />
                            <TextField label="Nội dung liên hệ" required fullWidth size="small" multiline minRows={4}
                                value={form.message} onChange={handleChange('message')} />
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={8}>
                                    <TextField label="Mã xác nhận" required fullWidth size="small"
                                        value={form.captchaCode || ''} onChange={handleChange('captchaCode')} />
                                </Grid>
                                <Grid item xs={8} sm={3}>
                                    <Paper variant="outlined" sx={{ p: 1.2, textAlign: 'center', fontWeight: 700, letterSpacing: 4 }}>
                                        {captcha.display || '----'}
                                    </Paper>
                                </Grid>
                                <Grid item xs={4} sm={1}>
                                    <Button variant="text" onClick={loadCaptcha}>Đổi</Button>
                                </Grid>
                            </Grid>
                            <Box>
                                <Button variant="contained" onClick={handleSubmit}>Gửi liên hệ</Button>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                            THÔNG TIN LIÊN HỆ
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Chúng tôi biết bạn có rất nhiều sự lựa chọn. Cảm ơn vì đã tin tưởng.
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            <Typography variant="body2"><strong>Điện thoại:</strong> 09678.333.78</Typography>
                            <Typography variant="body2"><strong>Email:</strong> nhatroviet@gmail.com</Typography>
                            <Typography variant="body2"><strong>Zalo:</strong> 09678.333.78</Typography>
                            <Typography variant="body2"><strong>Viber:</strong> 09678.333.78</Typography>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SupportPage;
