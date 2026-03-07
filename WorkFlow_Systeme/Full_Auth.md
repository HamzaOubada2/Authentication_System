# Register:

    1- User Register (email,password,name...)
    2- Hashing password
    3- Create Email verification Token
    4- Send Email to User have Like (https://myapp.com/verify-email?token=abc123)
    5- User before This is Structure In database: User:
                                                    id
                                                    email
                                                    password
                                                    isVerified = false
                                                    verificationToken=

# Verify Email:

    1- User Click Email Link (https://myapp.com/verify-email?token=abc123)
        GET /auth/verify-email?token=abc123
    2- Server search in database this token (SELECT * FROM users WHERE verificationToken = token)
    3- if Find make this IsVerified = true & verificationToken=null(Because the token was used only once)

# Login

    1- User Login (email,password)
    2- Make verification by email
    3- Make sure the account isVerified
    4- make Compare Password
    5- Create Access Token(15min) & Refresh Token(7d)
        -> Access_Token= short duration & have to access to an api
        -> Refresh_Token = Long Duration & using to create New AccessToken

# Forgot Password:

    1- User Click in FORGOT_PASSWORD
    2- POST /auth/forgot-password
       email
    3- Server Create reset_Token
    4- save resetHashToken in database
    5- Send Email to User (https://app.com/reset-password?token=xyz)

# Reset Password:

    1- User Click Reset_password
    2- Server Make sure resetHashToken=token
    3- Create New Hash Password
    4- remove token from reset_Token=null Because the token was used only once

# Refresh Token:

    1- User send POST /auth/refresh
                        refreshToken
    2- server check refresh_token if correct (create new access_token & new refresh_token)

# LogOut:
    1- if user click logout 
    2- server remove refreshToken
    3- refreshToken=null 