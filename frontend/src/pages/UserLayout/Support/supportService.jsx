import axiosJWT from '../../../config/axiosJWT';

export const getCaptcha = async () => {
    return await axiosJWT.get('/api/support/captcha');
};

export const sendSupport = async (form, captchaToken) => {
    return await axiosJWT.post('/api/support', {
        ...form,
        captcha: { code: form.captchaCode, token: captchaToken },
    });
};
