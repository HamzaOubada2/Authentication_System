# NestJS Custom Decorators

## Concept
* Custom decorators are used to add **metadata** to classes or methods.
* Metadata can then be read by **Guards** or **Interceptors**.
* Use `Reflector` to read metadata inside Guards.

---
## Roles Decorator
```ts
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```
### Notes
* `@Roles('admin','manager')` → allows multiple roles.
* `ROLES_KEY = 'roles'` → container to store roles.
* Guard reads roles via `Reflector`.
* Example usage:

```ts
@Roles('admin')
@Get('/users')
findAllUsers() {}
```

* Metadata stored: `roles = ['admin']`
---
## Permissions Decorator
```ts
import { SetMetadata } from '@nestjs/common';
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```
### Notes
* `@Permissions('user.create','user.delete')` → allows multiple permissions.
* `PERMISSIONS_KEY = 'permissions'` → container for permissions.
* Guard or interceptor reads metadata to check access.
* Example usage:

```ts
@Permissions('user.create')
@Post('/users')
createUser() {}
```
* Metadata stored: `permissions = ['user.create']`

---

## CurrentUser Decorator

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### Notes
* Provides **logged-in user** directly in controller parameters.
* Cleaner than using `@Req() req`.
* Example usage:

```ts
@Get('/profile')
getProfile(@CurrentUser() user) {
  return user;
}
```
* Works with AuthGuard/JWT strategy that sets `request.user`.

---

## Workflow Example
```text
1️⃣ User sends request
2️⃣ JWT AuthGuard validates token
3️⃣ request.user is populated
4️⃣ RolesGuard reads @Roles metadata via Reflector
5️⃣ PermissionsGuard reads @Permissions metadata
6️⃣ CurrentUser decorator retrieves the user object
7️⃣ Controller executes if access allowed

