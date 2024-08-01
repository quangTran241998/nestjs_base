import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
      user: 'chikhoai001@gmail.com',
      // email app password google
      pass: 'tqte osma uydw clhk',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}
  //tqte osma uydw clhk

  async sendVerificationEmail(email: string, token: string) {
    const url = `${process.env.BASE_URL}/auth/confirm?token=${token}`;
    await this.transporter.sendMail({
      form: 'chikhoai001@gmail.com',
      to: email,
      subject: 'Verify your email address',
      html: `Please click <a href="${url}">here</a> to confirm your email address.`,
    });
    return url;
  }
}
