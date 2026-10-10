import { Controller, Post } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @Post('create')
  async createSession() { return await this.sessionService.createSession(); }
}
