import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UPDATE_RELATION_EVENT_TITLE } from './cores/event-handler/constants';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
