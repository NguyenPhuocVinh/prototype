import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from './routes/route.module';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './configs/app.config';
import { AuthModule } from './apis/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SchemaModule } from './cores/__schema__/schema.module';
import { TenantMiddleware } from './cores/middlewares/tenant.middleware';
import { RoutesAdminModule } from './routes/router/routes-admin.module';
import { CommonModule } from './cores/services/common.module';

const { mongoose } = appSettings;
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
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { }
}
