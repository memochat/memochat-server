# NestJS-MySQL-TypeORM-Boilerplate

## 주요 패키지

- 클래스 변환
  - [class-transformer](https://github.com/typestack/class-transformer)
  - [class-validator](https://github.com/typestack/class-validator)
- EnumClass
  - [ts-jenum](https://github.com/reforms/ts-jenum)
- TEST
  - [jest](https://www.npmjs.com/package/jest)
  - [ts-mockito](https://github.com/NagRock/ts-mockito)
  - [supertest](https://www.npmjs.com/package/supertest)

## 데이터베이스 셋업

docker-compose파일로 데이터베이스 셋업을 진행합니다.
기본으로 mysql로 설정합니다.

```
npm run db:up --env=development
npm run db:up --env=test
```

## 환경변수 설정

.env.development, .env.test 파일이 필요합니다. 아래 양식에서 적절하게 채워줍니다.
프로덕션 환경에서는 직접 환경변수를 셋팅해야 합니다.

```
# 서버 포트
PORT=3000

# MYSQL SETUP
MYSQL_HOSTNAME=localhost
MYSQL_USERNAME=test
MYSQL_PASSWORD=test
MYSQL_PORT=3306
MYSQL_DATABASE=development
MYSQL_CONNECTION_TIMEOUT=2000

# JWT 설정
JWT_SECRET=jwtsecret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
```

## 테스트

`npm run test:unit`을 제외한 모든 테스트는 runInBand 옵션(-i)에 따라 순차적으로 동작하게 됩니다.
일반적으로 `jest`테스트는 파일별로 자식 프로세스가 생성되어 병렬적으로 실행됩니다. 따라서 여러 파일에서 하나의 데이터베이스에 간섭하는 경우 문제가 생기게 됩니다.
이를 해결하기 위해서는 transaction을 사용하는 방법과 간단하게 `--runInBand`(-i) 옵션을 통해 해결가능합니다.

데이터베이스를 사용하지 않는 테스트 파일 이름은 `*.unit.spec.ts` 로 설정하면 `npm run test:unit`과 함께 동작하여 병렬적으로 실행됩니다.

```bash
# 테스트 진행 (순차적)
npm run test

# e2e 테스트 진행 (순차적)
npm run test:e2e

# unit 테스트 진행 (병렬적)
npm run test:unit
```

## 구조

```
├── src
│   ├── app  # Api Modules
│   │   ├── auth
│   │   │   ├── __test__
│   │   │   └── dto
│   │   └── user
│   │       ├── __test__
│   │       └── dto
│   └── common
│       ├── config # Config Modules
│       │   ├── app
│       │   ├── database
│       │   │   ├── mysql
│       │   │   └── typeorm
│       │   └── jwt
│       ├── decorators # Custom Decorators
│       ├── exceptions # Custom Exceptions
│       ├── filters # Custom Filters
│       ├── guards # Custom Guards
|       ├── interceptors # Custom Interceptors
|       ├── middlewares # Custom Middlewares
│       ├── modules # Common Modules
│       │   ├── jwt-auth
│       │   └── token
│       │       ├── __test__
│       │       └── type
│       └── response # Response Entity
└── test # E2E Tests
```

```
├── app
│   ├── auth
│   │   ├── __test__ # Unit or Integration Tests
│   │   │   ├── auth.service.spec.ts
│   │   │   └── auth.service.unit.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto # Dtos
│   │   │   ├── auth-token.dto.ts
│   │   │   ├── refresh-tokens-request.dto.ts
│   │   │   ├── signin-request.dto.ts
│   │   │   └── signup-request.dto.ts
│   │   └── hash.service.ts
```

## 개발용 실행

`.env.development` 파일 정의 후, 아래와 같이 실행

```
npm run db:up --env=development
npm run start:dev
```

## Decorators

- `@ApiSuccessResponse(HttpStatus, ResponseDto)`: 자동으로 swagger에 리스폰스 생성(DTO내에 `@ApiProperty()`를 사용해주어야 함)
- `@ApiErrorResponse(extends HttpException)`: 자동으로 스웨거에 에러 리스폰스를 생성

```typescript
// auth.controller.ts
@Post('/refresh-tokens')
@ApiSuccessResponse(HttpStatus.OK, AuthTokenDto)
@ApiErrorResponse(InvalidTokenException)
async refreshAuthToken(@Body() refreshTokensRequest: RefreshTokensRequestDto) {
    const tokens = await this.authService.refreshAuthToken(refreshTokensRequest.refreshToken);

    return ResponseEntity.OK_WITH_DATA(AuthTokenDto.of(tokens));
}

// auth-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiICJ9.eyJzdWIiOjEsImlhdCI6MTY1NzM5lIjoiQUNDRVNTIn0.3LaWE-f8vy7DX8eDMspnSmN3Wk',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsIVCJ9.eyJzdWIiOjEsImlhdCI6MTY1NzOTgyMjg4LCJ0eXBlIjoiUkVGUkVTSCJ9.NoVdIAjgHh9S6bsjFaakxc0PD4',
  })
  refreshToken: string;

  @ApiProperty({ example: 1 })
  userId: number;

  static of({ accessToken, refreshToken, userId }: { accessToken: string; refreshToken: string; userId: number }) {
    const authTokenDto = new AuthTokenDto();
    authTokenDto.accessToken = accessToken;
    authTokenDto.refreshToken = refreshToken;
    authTokenDto.userId = userId;
    return authTokenDto;
  }
}

// invalid-token.exception.ts
import { UnauthorizedException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class InvalidTokenException extends UnauthorizedException {
  constructor(message = '유효하지 않은 토큰 정보 입니다') {
    super(new ErrorInfo(ResponseStatus.INVALID_TOKEN, message));
  }
}

```

- `@Auth()`: JWT 토큰인증 및 그에 따른 swagger 문서 생성

```typescript
@Patch('/nickname')
@Auth()
@ApiSuccessResponse(HttpStatus.NO_CONTENT)
async update(@CurrentUser() user: User, @Body() body: PathNicknameRequestDto) {
    await this.userService.updateNickname(user, body.nickname);
}
```

![image](https://user-images.githubusercontent.com/67570061/178225466-3efdaac4-11de-4b99-80db-1266896fc120.png)

## ApiLoggerMiddleware

`ApiSuccessLoggerMiddleware`, `ApiErrorLoggerMiddleware`를 사용해 API요청에 대한 응답 반환
NestJS의 default logger를 사용하도록 되어있으며 원하는 경우 수정이 필요함

```
[Nest] 94131  - 2022. 07. 11. 오후 6:26:38   ERROR [ApiErrorLoggerMiddleware] client: ::1 - POST /v1/auth/signin 404 - 28.685 ms - message: 해당하는 유저가 존재하지 않습니다
data: {"method":"POST","baseUrl":"localhost:3000","url":"/v1/auth/signin","auth":"No tokens","body":{"email":"tes@tst.com","password":"!a12345678"},"params":{},"query":{},"error":{"errorCode":"USER_NOT_FOUND","message":"해당하는 유저가 존재하지 않습니다"}}
```
