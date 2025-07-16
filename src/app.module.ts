import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from './routes/route.module';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './configs/app.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SchemaModule } from './cores/__schema__/schema.module';
import { CommonModule } from './cores/services/common.module';
import { BullModule } from '@nestjs/bull';

const { mongoose, redis, appName } = appSettings;
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RouterModule.forRoot(),
    SchemaModule,
    CommonModule,
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: mongoose.uri
      })
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: redis.host,
          port: redis.port,
          password: redis.password,
        },
        prefix: appName,
        defaultJobOptions: {
          removeOnComplete: true,
        }
      })
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { }
}
