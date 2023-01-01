import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ConfigService } from '../services/config/config.service';

@Injectable()
export class PartySocket extends Socket {
  constructor(configService: ConfigService) {
    const socketEndpoint = configService.config.getValue().socketEndpoint;

    super({ url: socketEndpoint, options: {} });
  }
}