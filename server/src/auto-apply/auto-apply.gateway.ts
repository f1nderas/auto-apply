import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AutoApplyService } from './auto-apply.service';
import { CLIENT_URL } from '../config';

@WebSocketGateway({ cors: { origin: CLIENT_URL } })
class AutoApplyGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly autoApplyService: AutoApplyService) {}

  afterInit(): void {
    // Регистрируем эмиттер в сервисе — теперь сервис может слать события всем клиентам
    this.autoApplyService.setEmitter((event, data) =>
      this.server.emit(event, data),
    );
  }

  handleConnection(client: Socket): void {
    // Новый клиент получает текущий статус задачи (нужно при переподключении)
    client.emit('status', this.autoApplyService.getStatus());
  }
}

export { AutoApplyGateway };
