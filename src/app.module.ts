import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HabitModule } from './habit/habit.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, HabitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
