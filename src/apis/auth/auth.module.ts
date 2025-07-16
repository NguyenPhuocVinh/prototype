import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { appSettings } from 'src/configs/app.config';
import { LocalStrategy } from 'src/cores/strategies/local.strategy';
import { JwtStrategy } from 'src/cores/strategies/jwt.strategy';
import { RolesModule } from '../roles/roles.module';
const { jwt } = appSettings;
@Module({
  imports: [
    UsersModule,
    RolesModule,
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
    LocalStrategy,
    JwtStrategy
  ],
  exports: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ]
})
export class AuthModule { }
