const authControllers = require('../controllers/authControllers');
const { verifyToken } = require('../middleware/middlewareControllers');

const router = require('express').Router();
//auth
router.post('/login', authControllers.login);
router.post('/register', authControllers.register);
router.post('/logout', authControllers.logout);
router.post('/change-password', verifyToken, authControllers.changePassword);

//refresh token
router.post('/refreshToken', authControllers.refreshToken);

router.post('/register-start', authControllers.startRegistration);
router.post('/verify-code', authControllers.verifyRegistration);
router.post('/resend-code', authControllers.resendCode);
// API quên mật khẩu
// Đăng ký + gửi mã xác minh
router.post('/forgot-password', authControllers.forgotPassword);

// Xác minh mã quên mật khẩu
router.post('/verify-password-reset-code', authControllers.verifyPasswordResetCode);

// Thay đổi mật khẩu
router.post('/reset-password', authControllers.resetPassword);
module.exports = router;