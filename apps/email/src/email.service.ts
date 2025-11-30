
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
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

    // Determine template path based on environment

    const isProd = process.env.NODE_ENV === 'production';
    let templatePath;
    if (isProd) {
      templatePath = join(__dirname, 'templates');
    } else {
      // Use process.cwd() to always resolve from project root in dev
      templatePath = join(process.cwd(), 'apps/email/src/templates');
    }
    console.log('[EmailService] Using template path:', templatePath);

    this.transporter.use(
      'compile',
      nodemailerExpressHandlebars({
        viewEngine: {
          partialsDir: templatePath,
          defaultLayout: false,
        },
        viewPath: templatePath,
        extName: '.hbs',
      })
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
      return null;
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
