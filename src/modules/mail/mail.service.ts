import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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
