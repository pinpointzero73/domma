# Analytics Backend API Implementation

## Overview

The frontend analytics tracker (`public/assets/js/analytics.js`) sends page view data to the backend API. The backend
must capture the client's IP address from request headers and store it with the page view record.

## Required API Endpoint

### POST `/api/analytics/pageview`

Records a page view with client IP address captured from request headers.

#### Request Body

```json
{
  "path": "/showcase/index.html",
  "url": "http://localhost:3001/showcase/index.html",
  "title": "Domma Showcase",
  "referrer": "http://localhost:3001/",
  "userAgent": "Mozilla/5.0...",
  "screenResolution": "1920x1080",
  "viewport": "1440x900",
  "timestamp": "2025-12-29T23:00:00.000Z"
}
```

#### Response

**Success (201)**:

```json
{
  "success": true,
  "message": "Page view recorded",
  "data": {
    "id": 12345,
    "path": "/showcase/index.html",
    "ip": "192.168.1.100",
    "timestamp": "2025-12-29T23:00:00.000Z"
  }
}
```

**Error (400/500)**:

```json
{
  "success": false,
  "message": "Error message"
}
```

## IP Address Extraction

The backend should extract the client's IP address from request headers in this priority order:

```javascript
function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
}
```

### Headers to Check:

1. **X-Forwarded-For**: Most common for proxied requests (e.g., Nginx, Cloudflare)
2. **X-Real-IP**: Alternative header used by some proxies
3. **req.connection.remoteAddress**: Direct connection IP
4. **req.socket.remoteAddress**: Fallback for direct connections

## Database Schema

### pageviews Table (or Collection)

**SQL Example:**

```sql
CREATE TABLE pageviews (
  id SERIAL PRIMARY KEY,
  path VARCHAR(500) NOT NULL,
  url VARCHAR(1000),
  title VARCHAR(500),
  referrer VARCHAR(1000),
  user_agent TEXT,
  screen_resolution VARCHAR(50),
  viewport VARCHAR(50),
  ip_address VARCHAR(45), -- Supports both IPv4 and IPv6
  user_id INTEGER REFERENCES users(id), -- Optional: link to authenticated user
  session_id VARCHAR(100), -- Optional: for session tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_path (path),
  INDEX idx_created_at (created_at),
  INDEX idx_ip_address (ip_address)
);
```

**MongoDB Example:**

```javascript
{
  _id: ObjectId,
  path: String,
  url: String,
  title: String,
  referrer: String,
  userAgent: String,
  screenResolution: String,
  viewport: String,
  ipAddress: String,
  userId: ObjectId (optional),
  sessionId: String (optional),
  createdAt: Date
}

// Indexes
db.pageviews.createIndex({ path: 1 })
db.pageviews.createIndex({ createdAt: -1 })
db.pageviews.createIndex({ ipAddress: 1 })
```

## Implementation Notes

### Privacy Considerations

1. **IP Address Anonymization**: Consider implementing IP address anonymization for GDPR compliance:
    - For IPv4: Mask last octet (e.g., `192.168.1.100` → `192.168.1.0`)
    - For IPv6: Mask last 80 bits

2. **Data Retention**: Implement automatic deletion of old page view records (e.g., after 90 days)

3. **Opt-out Mechanism**: Respect Do Not Track (DNT) headers:
   ```javascript
   if (req.headers['dnt'] === '1') {
     // Don't record or anonymize IP
   }
   ```

### Rate Limiting

Implement rate limiting to prevent abuse:

- Limit: 100 page views per IP per minute
- Return 429 Too Many Requests if exceeded

### Example Implementation (Express.js)

```javascript
// Route handler
app.post('/api/analytics/pageview', async (req, res) => {
  try {
    const {
      path,
      url,
      title,
      referrer,
      userAgent,
      screenResolution,
      viewport,
      timestamp
    } = req.body;

    // Extract client IP
    const ipAddress = getClientIP(req);

    // Optional: Anonymize IP for privacy
    const anonymizedIP = anonymizeIP(ipAddress);

    // Optional: Check DNT header
    const respectDNT = req.headers['dnt'] === '1';

    // Save to database
    const pageView = await PageView.create({
      path,
      url,
      title,
      referrer,
      userAgent,
      screenResolution,
      viewport,
      ipAddress: respectDNT ? null : anonymizedIP,
      userId: req.user?.id || null, // If authenticated
      sessionId: req.session?.id || null,
      createdAt: new Date(timestamp)
    });

    res.status(201).json({
      success: true,
      message: 'Page view recorded',
      data: {
        id: pageView.id,
        path: pageView.path,
        ip: respectDNT ? 'anonymized' : anonymizedIP,
        timestamp: pageView.createdAt
      }
    });

  } catch (error) {
    console.error('Error recording page view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record page view'
    });
  }
});

function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

function anonymizeIP(ip) {
  if (!ip || ip === 'unknown') return ip;

  // IPv4
  if (ip.includes('.')) {
    return ip.split('.').slice(0, 3).join('.') + '.0';
  }

  // IPv6
  if (ip.includes(':')) {
    return ip.split(':').slice(0, 4).join(':') + '::';
  }

  return ip;
}
```

## Admin Dashboard Updates

The admin dashboard already displays page view data from `/api/admin/analytics`. Update that endpoint to include IP
address information if needed:

```javascript
// Admin analytics endpoint can aggregate by IP
app.get('/api/admin/analytics', adminAuth, async (req, res) => {
  const analytics = {
    todayPageViews: await PageView.countToday(),
    todaySessions: await PageView.uniqueSessions Today(),
    pageViewTrend: await PageView.getLast7Days(),
    topPages: await PageView.getTopPages(),
    // New: IP-based analytics
    uniqueVisitors: await PageView.countUniqueIPs(),
    topCountries: await PageView.getTopCountries(), // Using IP geolocation
  };

  res.json({ success: true, data: analytics });
});
```

## Testing

1. Open browser DevTools → Network tab
2. Navigate to any page with the layout system
3. Look for POST request to `/api/analytics/pageview`
4. Verify request body contains page data
5. Check backend logs to confirm IP address was captured
6. Query database to verify record was stored with IP address

## Files Modified

- `/public/assets/js/analytics.js` - Frontend tracking script
- `/public/layouts/js/layout.js` - Automatically loads analytics script
- Backend API endpoint `/api/analytics/pageview` - **Needs implementation**
