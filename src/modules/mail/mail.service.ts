// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailerService {
//   private transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: 'chikhoai001@gmail.com',
//         pass: 'Quangxtld2498#',
//       },
//     });
//   }

//   async sendVerificationEmail(email: string, token: string) {
//     const url = `http://localhost:3000/auth/confirm?token=${token}`;
//     await this.transporter.sendMail({
//       to: email,
//       subject: 'Verify your email address',
//       html: `Please click <a href="${url}">here</a> to confirm your email address.`,
//     });
//     return url;
//   }
// }
