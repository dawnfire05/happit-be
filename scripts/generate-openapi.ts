/**
 * OpenAPI 스펙을 openapi.json으로 내보냅니다.
 * 클라이언트에서 이 파일로 타입/API 클라이언트를 생성할 수 있습니다.
 *
 * 사용 예 (클라이언트 프로젝트):
 *   npx openapi-typescript ./openapi.json -o ./src/api-types.ts
 *   또는 orval: orval --input ./openapi.json
 */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from '../src/app.module';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('Happit API')
    .setDescription('Happit API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const path = resolve(__dirname, '..', 'openapi.json');
  writeFileSync(path, JSON.stringify(document, null, 2), 'utf-8');
  await app.close();
  console.log('Generated openapi.json at', path);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
