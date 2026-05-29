import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class QrTokensService {
  generate(empresaId: string) {
    const secret = process.env.TERMINAL_SECRET || 'terminal-secret';
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const payload = `${timestamp}.${empresaId}`;

    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const token = `${payload}.${signature}`;

    return {
      token,
      expiresIn: 15,
    };
  }
}
