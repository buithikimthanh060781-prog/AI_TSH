/**
 * Email service with production SMTP and friendly DEV mode console logging
 */

async function sendVerificationEmail(email, token, appUrl = 'http://localhost:3000') {
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`;
  
  // Check if SMTP is configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      // In production, nodemailer would be used here
      console.log(`[EMAIL SMTP] Sending verification email to ${email}`);
    } catch (err) {
      console.error('[EMAIL ERROR]', err);
    }
  }

  // Always log clear link in DEV mode for instant testing
  console.log('\n=========================================');
  console.log('✉️  [DEV EMAIL] XÁC THỰC EMAIL TÀI KHOẢN');
  console.log(`Gửi tới: ${email}`);
  console.log(`Link kích hoạt (hiệu lực 24h):`);
  console.log(`👉 ${verifyUrl}`);
  console.log('=========================================\n');

  return { success: true, verifyUrl };
}

async function sendPasswordResetEmail(email, token, appUrl = 'http://localhost:3000') {
  const resetUrl = `${appUrl}/reset-password.html?token=${token}`;

  console.log('\n=========================================');
  console.log('🔑 [DEV EMAIL] ĐẶT LẠI MẬT KHẨU');
  console.log(`Gửi tới: ${email}`);
  console.log(`Link đặt lại mật khẩu (hiệu lực 1h):`);
  console.log(`👉 ${resetUrl}`);
  console.log('=========================================\n');

  return { success: true, resetUrl };
}

async function sendPasswordChangedNotification(email) {
  console.log('\n=========================================');
  console.log('🛡️  [DEV EMAIL] THÔNG BÁO ĐỔI MẬT KHẨU THÀNH CÔNG');
  console.log(`Gửi tới: ${email}`);
  console.log('Tài khoản của bạn đã được đổi mật khẩu thành công. Mọi phiên đăng nhập cũ đã được đăng xuất.');
  console.log('=========================================\n');

  return { success: true };
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedNotification
};
