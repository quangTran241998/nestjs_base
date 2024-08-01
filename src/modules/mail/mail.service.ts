import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
      user: 'chikhoai001@gmail.com',
      pass: 'tqte osma uydw clhk',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // constructor(private readonly authService: AuthService) {}
  //tqte osma uydw clhk

  async sendVerificationEmail(email: string) {
    // const token = this.authService.tests();
    // const url = `${process.env.BASE_URL}/auth/confirm?token=${token}`;
    // await this.transporter.sendMail({
    //   form: 'chikhoai001@gmail.com',
    //   to: email,
    //   subject: 'Verify your email address',
    //   html: `Please click <a href="${url}">here</a> to confirm your email address.`,
    // });
    return '';
  }
}
