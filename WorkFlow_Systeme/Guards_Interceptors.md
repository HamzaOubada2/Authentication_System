# RateLimitGuard:

    Blocks requests if a user sends too many requests in a short time.

    Example:
    Limit = 100 requests / minute
    User sends = 433 requests / minute

    Result:
    System blocks the request and returns:
    429 Too Many Requests

# JwtAuthGuard:

        JwtAuthGuard:
            1. Read the Authorization header:
            Authorization: Bearer TOKEN
            2. Verify the JWT token.
            3. Extract the user payload and attach it to the request.

            Example:
            req.user = {
                id: 1,
                email: "hamza@mail.com",
                role: "admin"
            }

# RolesGuard:

    RolesGuard:
    Used for Role-Based Access Control (RBAC).

    Example:
    GET /admin/users
    Only users with role "admin" are allowed.
    @Controller("admin")
    @Roles("admin")
    @Get("users")

# Permissions:

    1- Before that we were use Role BUT Now We user Permissions
    2- Example:
                create:user
                delete:user
    3- @Permissions("create:user")
    4- Guard Make Sure: if (!user.permissions.includes("create:user")) {
                            throw new ForbiddenException()
                            }

## Roles & Permissions:

    Roles:  admin
            manager
            user

    Permissions:
            create:user
            delete:user
    ! Roles -> Contains Permissions

    Example:
        ```
        ROLES           PERMISSIONS
        ──────────────────────────────────────────
        admin       →   create:user, delete:user,
                        create:post, delete:post, read:all

        manager     →   create:post, delete:post, read:all

        user        →   read:own, update:own
        ```


# ResponseInterceptore:

        Edit the structure of the API response:
        Before: {
                name: "Hamza"
                }
        After:{
                success: true,
                data: { name: "Hamza" },
                timestamp: "2026-03-07"
            }

# ExceptionFilter:

    ExceptionFilter:
    Catches all errors that occur in the application.
    It can catch errors from:
    - Guards
    - Services
    - Controllers
    - Interceptors
