import { Module } from '@nestjs/common';
import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

@Module({
  providers: [
    {
      provide: 'FCM',
      useFactory: () => {
        const app = initializeApp({});
        return getMessaging(app);
      },
    },
  ],
  exports: ['FCM'],
})
export class FirebaseModule {}
