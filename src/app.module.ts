import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from './routes/route.module';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './configs/app.config';
import { AuthModule } from './apis/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

const { mongoose } = appSettings;
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RouterModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: mongoose.uri
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
