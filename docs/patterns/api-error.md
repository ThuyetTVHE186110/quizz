# API Error Pattern

Map application failures consistently:

- validation failure -> `400 Bad Request`
- missing resource -> `404 Not Found`
- conflict or duplicate action -> `409 Conflict`

Prefer NestJS built-in `HttpException` subclasses or a shared exception filter around them.

```ts
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

if (!isValidInput) {
  throw new BadRequestException('Invalid quiz payload');
}

if (!quiz) {
  throw new NotFoundException(`Quiz ${quizId} not found`);
}

if (nicknameTaken) {
  throw new ConflictException('Nickname already in use');
}
```
