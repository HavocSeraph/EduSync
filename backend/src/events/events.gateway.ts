import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  private readonly redisClient = new Redis({ host: 'redis', port: 6379 });

  @SubscribeMessage('join_session')
  async handleJoin(@MessageBody() data: { pin: string }, @ConnectedSocket() client: Socket) {
    const pinStr = String(data.pin);
    const session = await this.redisClient.get(`session:${pinStr}`);
    if (!session) {
      client.emit('error', 'Invalid PIN');
      return;
    }
    client.join(pinStr);
    client.emit('joined_successfully', JSON.parse(session));
  }

  @SubscribeMessage('push_question')
  async handlePushQuestion(@MessageBody() data: { pin: string, question: any }) {
    const pinStr = String(data.pin);
    await this.redisClient.del(`answerCount:${pinStr}`);
    this.server.to(pinStr).emit('score_update', 0);
    this.server.to(pinStr).emit('new_question', data.question);
  }

  @SubscribeMessage('submit_answer')
  async handleSubmit(@MessageBody() data: { pin: string, studentId: string, answer: string, questionId?: string }, @ConnectedSocket() client: Socket) {
    const pinStr = String(data.pin);
    const qId = data.questionId || (data as any).question?.id || 'current';
    const hasAnswered = await this.redisClient.setnx(`hasAnswered:${pinStr}:${qId}:${data.studentId}`, '1');
    if (hasAnswered === 0) {
      client.emit('error', 'You have already submitted an answer for this question');
      return;
    }
    await this.redisClient.expire(`hasAnswered:${pinStr}:${qId}:${data.studentId}`, 7200);
    
    const totalAnswers = await this.redisClient.incr(`answerCount:${pinStr}`);
    this.server.to(pinStr).emit('score_update', totalAnswers);
  }
}
