import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { appSettings } from 'src/configs/app.config';
import { LocalStrategy } from 'src/cores/strategies/local.strategy';
const { jwt } = appSettings;
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwt.secret,
      signOptions: {
        expiresIn: jwt.expiresIn,
        issuer: jwt.issuer,
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy
  ],
  exports: [
    AuthService,
    LocalStrategy
  ]
})
export class AuthModule { }
