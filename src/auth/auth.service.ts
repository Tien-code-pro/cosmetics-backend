import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu');
    if (!user.isActive) throw new UnauthorizedException('Tài khoản đã bị khóa');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('Không tìm thấy tài khoản');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Mật khẩu cũ không đúng');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.adminUser.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.emailService.sendPasswordChangedEmail(user.email);

    return { message: 'Đổi mật khẩu thành công' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });

    // Không tiết lộ email có tồn tại hay không — luôn trả về thông báo giống nhau
    if (!user) {
      return {
        message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi.',
      };
    }

    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.emailService.sendResetPasswordEmail(user.email, resetLink);

    return {
      message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new UnauthorizedException(
        'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    await this.emailService.sendPasswordChangedEmail(user.email);

    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
