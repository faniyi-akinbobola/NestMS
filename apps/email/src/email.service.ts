import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { join } from 'path';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          partialsDir: join(__dirname, 'templates'),
          defaultLayout: false,
        },
        viewPath: join(__dirname, 'templates'),
        extName: '.hbs',
      }),
    );
  }


  async sendSignupEmail(to: string, name: string) {
    try {
      return await this.transporter.sendMail({
        to,
        subject: 'Welcome to Our App!',
        template: 'signup',
        context: { name },
      });
    } catch (error) {
      // Log error or handle as needed
      console.error('Error sending signup email:', error);
      throw error;
    }
  }

  async sendLoginEmail(to: string, time: string) {
    try {
      return await this.transporter.sendMail({
        to,
        subject: 'New Login Detected',
        template: 'login',
        context: { time },
      });
    } catch (error) {
      // Log error or handle as needed
      console.error('Error sending login email:', error);
      throw error;
    }
  }
}
