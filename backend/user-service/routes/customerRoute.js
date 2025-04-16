import express from 'express';
const router = express.Router();
import * as customerController from '../controllers/customerController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

router.post('/send-mobile-otp', customerController.sendMobileOTP);
router.post('/verify-mobile-otp', customerController.verifyMobileOTP);
router.post('/send-email-otp', customerController.sendEmailOTP);
router.post('/verify-email-otp', customerController.verifyEmailOTP);
router.get('/signout', customerController.signOut);
//router.post('/google-login', authController.googleLogin);
router.post('/complete-profile', authenticate, customerController.completeProfile);


export default router;
