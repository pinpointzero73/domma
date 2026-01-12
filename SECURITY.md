# Security Best Practices - Domma

This document outlines security features, best practices, and recommendations for using Domma safely in production environments.

## Table of Contents

1. [XSS Protection](#xss-protection)
2. [CSRF Protection](#csrf-protection)
3. [Authentication](#authentication)
4. [Content Security Policy](#content-security-policy)
5. [Security Checklist](#security-checklist)
6. [Reporting Vulnerabilities](#reporting-vulnerabilities)

---

## XSS Protection

### Automatic HTML Sanitization

**Domma includes built-in XSS protection** through the `sanitize` module, which uses DOMPurify when available and falls back to HTML escaping.

#### DOM Manipulation (`.html()` method)

```javascript
// ✅ SAFE - Content is automatically sanitized
$('#content').html(userInput);

// ⚠️ UNSAFE - Only use for TRUSTED server content
$('#content').html(trustedServerHtml, {safe: false});

// ✅ STRICT - Only basic formatting allowed
$('#content').html(userBio, {preset: 'strict'});
```

**Sanitization Presets:**
- **default** - Allows common HTML tags (p, div, a, img, etc.)
- **strict** - Only basic text formatting (b, i, em, strong)
- **basic** - Minimal formatting (used for UI component text)

####  Sanitization in UI Components

**Dialog, Modal, Toast** components automatically sanitize user-provided content:

```javascript
// ✅ SAFE - Title and message are sanitized
Domma.elements.alert('User entered: ' + userInput);

// ✅ SAFE - Modal content is sanitized by default
Domma.elements.createModal({
    title: userProvidedTitle,
    content: userProvidedContent
});

// ⚠️ UNSAFE - Only for trusted HTML
Domma.elements.createModal({
    content: trustedServerHTML,
    unsafe: true
});
```

### Manual Sanitization

```javascript
// Use the sanitize module directly
import Domma from './domma.min.js';

const clean = Domma.sanitize.sanitize(userInput);
const strict = Domma.sanitize.sanitize(userInput, {preset: 'strict'});
const custom = Domma.sanitize.sanitize(userInput, {
    allowedTags: ['p', 'br', 'strong'],
    allowedAttrs: ['class']
});
```

### Loading DOMPurify

For maximum protection, load DOMPurify before Domma:

```html
<!-- Include DOMPurify for robust sanitization -->
<script src="https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"></script>

<!-- Then load Domma -->
<script src="dist/domma.min.js"></script>
```

**Without DOMPurify:** Domma falls back to HTML escaping (safe but removes all HTML).

---

## CSRF Protection

### Frontend (Automatic)

Domma's `http` module **automatically handles CSRF tokens** for state-changing requests:

```javascript
// ✅ CSRF token automatically included
await Domma.http.post('/api/data', { name: 'Example' });
await Domma.http.put('/api/data/1', { name: 'Updated' });
await Domma.http.delete('/api/data/1');

// Clear token after logout
Domma.http.clearCsrfToken();
```

**How it works:**
1. First state-changing request fetches CSRF token from `/api/csrf-token`
2. Token is cached and included in `x-csrf-token` header
3. Invalid tokens trigger automatic retry with fresh token

### Backend (Fastify)

CSRF protection is configured in `server.js`:

```javascript
await app.register(csrf, {
    cookieOpts: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    }
});
```

**All POST/PUT/PATCH/DELETE requests require valid CSRF tokens.**

---

## Authentication

### JWT Token Management

#### Token Expiration

- **Access tokens**: 15 minutes (configurable via `ACCESS_TOKEN_EXPIRY`)
- **Refresh tokens**: 7 days (configurable via `REFRESH_TOKEN_EXPIRY`)

```javascript
// Login returns both tokens
const { token, refreshToken } = await Domma.http.post('/api/auth/login', {
    email, password
});

// Refresh expired access token
const { token: newToken } = await Domma.http.post('/api/auth/refresh', {
    refreshToken
});
```

#### Secure Token Storage

**Option 1: httpOnly Cookies (Recommended)**

```javascript
// Backend sets httpOnly cookie automatically
// Frontend: No manual token management needed
Domma.http.post('/api/protected', data); // Cookies sent automatically
```

**Option 2: localStorage (Backwards Compatible)**

```javascript
// Store token
Domma.storage.set('authToken', token);

// Include in requests
Domma.http.post('/api/protected', data, {
    headers: { 'Authorization': `Bearer ${Domma.storage.get('authToken')}` }
});
```

⚠️ **httpOnly cookies are more secure** as they're not accessible to JavaScript (XSS-proof).

### Password Requirements

Passwords must meet these requirements:
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Rate Limiting

**Global limits:**
- 100 requests per minute per IP

**Authentication endpoints:**
- Login: 5 attempts per 15 minutes
- Registration: 3 attempts per hour

---

## Content Security Policy

### Recommended CSP Headers

Add this meta tag to your HTML `<head>`:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' data: https:;
    connect-src 'self' https:;
    frame-src 'none';
    object-src 'none';
">
```

**Note:** `'unsafe-inline'` and `'unsafe-eval'` are required for Domma's dynamic features. For stricter policies, use nonces or hashes.

### Production CSP (Stricter)

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline';
    font-src 'self' data:;
    img-src 'self' data: https:;
    connect-src 'self';
    frame-src 'none';
    object-src 'none';
">
```

---

## Security Checklist

### Development

- [ ] Load DOMPurify before Domma for XSS protection
- [ ] Use `.html()` without `{safe: false}` for user content
- [ ] Validate all user input on backend
- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable security event logging

### Environment Variables

```bash
# Required
JWT_SECRET=your-32-char-minimum-secret-here
NODE_ENV=production

# CORS (comma-separated)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional security config
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SECURITY_LOGGING=true
SECURITY_LOG_DIR=./logs
```

### Deployment

- [ ] Set `JWT_SECRET` to strong random value (32+ characters)
- [ ] Configure `CORS_ORIGINS` to specific domains
- [ ] Enable HTTPS (Let's Encrypt, CloudFlare, etc.)
- [ ] Set `NODE_ENV=production`
- [ ] Review security headers (Helmet configuration)
- [ ] Set up security log monitoring
- [ ] Implement backup and recovery procedures
- [ ] Configure firewall rules
- [ ] Keep dependencies updated (`npm audit`)

### Code Review

- [ ] No hardcoded secrets or API keys
- [ ] User input is validated and sanitized
- [ ] SQL/NoSQL queries use parameterized statements
- [ ] File uploads are validated and scanned
- [ ] Authentication is required for sensitive endpoints
- [ ] Authorization checks are in place (role-based access)
- [ ] Error messages don't leak sensitive information
- [ ] Logging doesn't include passwords or tokens

---

## Reporting Vulnerabilities

If you discover a security vulnerability in Domma, please:

1. **Do not** open a public GitHub issue
2. Email security concerns to: [your-security-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

We aim to respond within 48 hours and will work with you to address the issue promptly.

---

## Security Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| **XSS Protection** | ✅ Active | Automatic HTML sanitization with DOMPurify |
| **CSRF Protection** | ✅ Active | Token-based validation for state changes |
| **JWT Expiration** | ✅ Active | 15min access + 7day refresh tokens |
| **Rate Limiting** | ✅ Active | Global + endpoint-specific limits |
| **Password Policy** | ✅ Active | 12+ chars with complexity requirements |
| **Security Headers** | ✅ Active | Helmet with CSP configuration |
| **Security Logging** | ✅ Active | Authentication & security event tracking |
| **CORS Protection** | ✅ Active | Origin validation from whitelist |
| **ReDoS Protection** | ✅ Active | Regex input validation and escaping |

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Fastify Security Best Practices](https://fastify.dev/docs/latest/Guides/Security/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

**Last Updated:** 2026-01-12
**Domma Version:** 0.9.3-alpha
