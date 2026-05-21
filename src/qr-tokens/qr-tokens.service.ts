import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class QrTokensService {
  generate() {
    const secret = process.env.TERMINAL_SECRET || 'terminal-secret';
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signature = crypto
      .createHmac('sha256', secret)
      .update(timestamp)
      .digest('hex');

    const token = `${timestamp}.${signature}`;

    return {
      token,
      expiresIn: 10,
    };
  }
}
