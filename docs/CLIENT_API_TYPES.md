# 클라이언트 API 타입 동기화

백엔드 API 모델이 바뀌어도 클라이언트가 **OpenAPI 스펙**만 다시 받아서 타입/클라이언트를 재생성하면 됩니다.

## 1. 백엔드에서 스펙 내보내기

```bash
# happit-be 루트에서
npm run generate:openapi
```

`openapi.json`이 프로젝트 루트에 생성됩니다. 이 파일을 클라이언트 저장소로 복사하거나, 같은 모노레포라면 경로만 참조하면 됩니다.

## 2. 클라이언트에서 타입 생성

### 옵션 A: 타입만 생성 (openapi-typescript)

```bash
npx openapi-typescript ./openapi.json -o ./src/api-types.ts
```

- 요청/응답 타입만 생성. `fetch`/`axios` 호출은 직접 작성하고, 파라미터·바디·응답에 위 타입 사용.

### 옵션 B: 타입 + API 함수 생성 (orval)

```bash
npm i -D orval
npx orval --input ./openapi.json --output ./src/api/generated.ts
```

- 엔드포인트별 함수와 타입이 함께 생성됨. 설정은 `orval.config.ts`로 조정 가능.

### 옵션 C: 타입 + 클라이언트 (openapi-ts)

```bash
npx @hey-api/openapi-ts -i ./openapi.json -o ./src/api
```

## 3. 워크플로우

1. 백엔드에서 DTO/응답 모델 수정 후 `npm run generate:openapi` 실행.
2. 생성된 `openapi.json`을 클라이언트가 사용하는 위치로 복사 또는 경로 유지.
3. 클라이언트에서 위 도구로 타입/클라이언트 재생성.
4. 빌드·타입 체크로 호환 여부 확인.

API 모델이 유동적으로 바뀌어도, **스펙 재생성 → 클라이언트 재생성**만 반복하면 됩니다.
