import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SessionService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({ host: 'redis', port: 6379 });
    this.redisClient.on('error', (err) => console.error('Redis Error:', err));
  }

  async createSession(): Promise<{ pin: string; message: string }> {
    try {
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const sessionData = {
        isActive: true,
        createdAt: new Date().toISOString(),
        activeQuestion: {
          id: 'q1',
          text: 'What is the runtime environment for NestJS?',
          options: ['Python', 'Node.js', 'Java', 'Browser'],
        },
      };
      await this.redisClient.set(`session:${pin}`, JSON.stringify(sessionData), 'EX', 7200);
      return { pin, message: 'Session generated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate session in Redis');
    }
  }
}
