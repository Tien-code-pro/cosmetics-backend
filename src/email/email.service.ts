import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPasswordChangedEmail(to: string) {
    try {
      await this.resend.emails.send({
        from: 'Shop Admin <onboarding@resend.dev>', // dùng domain mặc định lúc chưa verify domain riêng
        to,
        subject: 'Mật khẩu tài khoản admin vừa được thay đổi',
        html: `<p>Mật khẩu tài khoản admin (${to}) vừa được thay đổi thành công.</p>
               <p>Nếu không phải bạn thực hiện, hãy liên hệ ngay để bảo vệ tài khoản.</p>`,
      });
    } catch (error) {
      console.error('Gửi email thất bại:', error);
      // Không throw lỗi ra ngoài — đổi mật khẩu vẫn thành công dù gửi email lỗi
    }
  }

  async sendResetPasswordEmail(to: string, resetLink: string) {
    try {
      await this.resend.emails.send({
        from: 'Shop Admin <onboarding@resend.dev>',
        to,
        subject: 'Yêu cầu đặt lại mật khẩu',
        html: `<p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
             <p><a href="${resetLink}">Bấm vào đây để đặt lại mật khẩu</a> (link hết hạn sau 1 giờ).</p>
             <p>Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>`,
      });
    } catch (error) {
      console.error('Gửi email reset thất bại:', error);
    }
  }
}
