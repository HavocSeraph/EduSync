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
    const session = await this.redisClient.get(`session:${data.pin}`);
    if (!session) {
      client.emit('error', 'Invalid PIN');
      return;
    }
    client.join(data.pin);
    client.emit('joined_successfully', JSON.parse(session));
  }

  @SubscribeMessage('push_question')
  handlePushQuestion(@MessageBody() data: { pin: string, question: any }) {
    this.server.to(data.pin).emit('new_question', data.question);
  }

  @SubscribeMessage('submit_answer')
  async handleSubmit(@MessageBody() data: { pin: string, studentId: string, answer: string }, @ConnectedSocket() client: Socket) {
    const hasAnswered = await this.redisClient.setnx(`hasAnswered:${data.pin}:${data.studentId}`, '1');
    if (hasAnswered === 0) {
      client.emit('error', 'You have already submitted an answer');
      return;
    }
    await this.redisClient.expire(`hasAnswered:${data.pin}:${data.studentId}`, 7200);
    
    const totalAnswers = await this.redisClient.incr(`answerCount:${data.pin}`);
    this.server.to(data.pin).emit('score_update', totalAnswers);
  }
}
