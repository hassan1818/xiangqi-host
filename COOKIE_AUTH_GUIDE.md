# Cookie-Based Authentication Configuration Guide

## 🍪 Frontend Cookie Configuration (COMPLETED)

### Current Setup:

- ✅ `withCredentials: true` in Axios configuration
- ✅ Automatic token refresh interceptor
- ✅ Queue failed requests during refresh
- ✅ Redirect to login on refresh failure

## 🔧 Backend Cookie Configuration (FOR YOUR SERVER)

### 1. Cookie Settings for Access Token:

```javascript
// Short-lived access token (15-30 minutes)
res.cookie("accessToken", accessToken, {
  httpOnly: true, // Prevents XSS attacks
  secure: true, // HTTPS only in production
  sameSite: "strict", // CSRF protection
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: "/",
});
```

### 2. Cookie Settings for Refresh Token:

```javascript
// Long-lived refresh token (7-30 days)
res.cookie("refreshToken", refreshToken, {
  httpOnly: true, // Prevents XSS attacks
  secure: true, // HTTPS only in production
  sameSite: "strict", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/api/v1/auth", // Only sent to auth endpoints
});
```

### 3. CORS Configuration:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Development
      "https://your-domain.com", // Production
      "https://xiangqi-platform.com", // Your actual domain
    ],
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

## 🔐 Recommended Token Strategy:

### Access Token (Short-lived: 15-30 minutes):

- Used for API authentication
- Stored in `accessToken` cookie
- Automatically refreshed when expired

### Refresh Token (Long-lived: 7-30 days):

- Used only to get new access tokens
- Stored in `refreshToken` cookie
- Sent only to `/auth` endpoints

## 📋 Backend Endpoints You Need:

### 1. Login Endpoint:

```javascript
POST / api / v1 / auth / login;
// Response: Set both accessToken and refreshToken cookies
// Return: { user: {...}, message: "Login successful" }
```

### 2. Signup Endpoint:

```javascript
POST / api / v1 / auth / signup;
// Response: Set both accessToken and refreshToken cookies
// Return: { user: {...}, message: "Signup successful" }
```

### 3. Refresh Token Endpoint:

```javascript
POST / api / v1 / auth / refresh - token;
// Check: refreshToken cookie
// Response: Set new accessToken cookie
// Return: { message: "Token refreshed" }
```

### 4. Logout Endpoint:

```javascript
POST / api / v1 / auth / logout;
// Response: Clear both cookies
// Return: { message: "Logged out" }
```

### 5. Get Current User:

```javascript
GET / api / v1 / users / me;
// Check: accessToken cookie
// Return: { user: {...} }
```

## 🛡️ Security Best Practices:

### 1. Environment Variables:

```bash
NODE_ENV=production
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FRONTEND_URL=https://your-domain.com
```

### 2. Cookie Security in Production:

```javascript
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  domain:
    process.env.NODE_ENV === "production" ? ".your-domain.com" : undefined,
};
```

### 3. Token Validation Middleware:

```javascript
const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};
```

## 🔄 Token Refresh Flow:

1. **Client makes request** with accessToken cookie
2. **Server checks token** - if expired, returns 401
3. **Frontend interceptor** catches 401, calls refresh endpoint
4. **Server validates refreshToken** and issues new accessToken
5. **Frontend retries** original request with new token
6. **If refresh fails** - redirect user to login

## 🚨 Error Handling:

### Server Responses:

```javascript
// Token expired
401 Unauthorized: "Token expired"

// Invalid token
403 Forbidden: "Invalid token"

// Refresh token expired
401 Unauthorized: "Refresh token expired"

// No token provided
401 Unauthorized: "Access token required"
```

## ✅ Testing Your Implementation:

### 1. Test Login:

- Check cookies are set in browser
- Verify httpOnly flag
- Confirm secure flag in production

### 2. Test Protected Routes:

- Access `/users/me` after login
- Verify token is sent automatically

### 3. Test Token Refresh:

- Wait for access token to expire
- Make API call and verify automatic refresh

### 4. Test Logout:

- Verify cookies are cleared
- Confirm subsequent requests fail

## 📱 Frontend Usage (Already Implemented):

```typescript
// Login
dispatch(login({ email, password }));

// Get current user (automatic token handling)
dispatch(getCurrentUser());

// Logout
dispatch(logout());

// All API calls automatically handle token refresh
```

## 🔍 Debugging Tips:

1. **Check Network Tab**: Verify cookies in request headers
2. **Application Tab**: View cookies in browser DevTools
3. **Server Logs**: Log cookie values (redact in production)
4. **CORS Issues**: Ensure `credentials: true` on both ends

This setup provides enterprise-level security with automatic token refresh and optimal user experience!
