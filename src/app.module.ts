import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HabitModule } from './habit/habit.module';
import { FirebaseModule } from './firebase/firebase.module';
import { FcmService } from './fcm/fcm.service';
import { RecordModule } from './record/record.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, HabitModule, FirebaseModule, RecordModule],
  controllers: [AppController],
  providers: [AppService, FcmService],
})
export class AppModule {}
