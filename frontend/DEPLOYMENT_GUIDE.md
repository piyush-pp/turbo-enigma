# Public Booking Interface - Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] No console errors or warnings
- [ ] All linting passes: `npm run lint`
- [ ] TypeScript strict mode: `npm run type-check`
- [ ] No TODO or FIXME comments
- [ ] Code reviewed by team member
- [ ] All imports resolved

### Testing
- [ ] Unit tests pass: `npm test`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] Manual testing completed
- [ ] All test cases in TESTING_GUIDE.md verified
- [ ] Performance benchmarks met
- [ ] Mobile responsiveness verified

### Documentation
- [ ] Code comments updated
- [ ] README updated
- [ ] Deployment steps documented
- [ ] Environment variables documented
- [ ] API integration documented
- [ ] Troubleshooting guide created

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables configured
- [ ] CORS properly configured for production domain
- [ ] API rate limiting configured
- [ ] Email validation implemented
- [ ] No sensitive data logged

---

## Environment Configuration

### Development (.env.development)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Appointment Booking
VITE_TIMEZONE=UTC
```

### Staging (.env.staging)
```env
VITE_API_URL=https://api-staging.example.com/api
VITE_APP_NAME=Appointment Booking (Staging)
VITE_TIMEZONE=UTC
```

### Production (.env.production)
```env
VITE_API_URL=https://api.example.com/api
VITE_APP_NAME=Appointment Booking
VITE_TIMEZONE=UTC
```

**Important:** Never commit `.env.production` to git. Use environment secrets in CI/CD.

### Vite Config

In `vite.config.ts`:
```typescript
export default defineConfig({
  // ... other config
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
})
```

Access in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL
```

---

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview

# Check build output
ls -lah dist/
```

### Build Output Structure
```
dist/
├── index.html          (Main entry point)
├── assets/
│  ├── index-xxx.js     (Main bundle)
│  ├── BookingWizard-xxx.js
│  ├── index-xxx.css    (Tailwind CSS)
│  └── ...
└── manifest.json       (Asset manifest)
```

### Build Size

Expected sizes (gzipped):
- Main JS bundle: 150-200KB
- Main CSS bundle: 30-50KB
- Total: < 250KB

Check with: `npm run build -- --visualize`

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Pros:** Easy GitHub integration, automatic deployments, edge functions, analytics

**Steps:**

1. **Connect Repository**
   - Go to vercel.com
   - Click "New Project"
   - Select GitHub repo
   - Vercel auto-detects Vite config

2. **Configure Build**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_URL=https://api.example.com/api`
   - Set for Production, Preview, Development

4. **Deploy**
   ```bash
   # Deploy from local
   npm i -g vercel
   vercel deploy --prod
   
   # Or push to main branch for automatic deployment
   git push origin main
   ```

5. **Custom Domain**
   - Go to Project Settings → Domains
   - Add custom domain
   - Update DNS records with Vercel nameservers

6. **Monitor**
   - Watch deployment logs
   - Check analytics
   - Monitor error rates

### Option 2: Netlify

**Pros:** Simple deployment, good CMS integration, good free tier

**Steps:**

1. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select GitHub repo

2. **Configure**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**
   - Build settings → Environment
   - Add `VITE_API_URL`

4. **Deploy**
   - Push to main branch
   - Netlify auto-deploys

5. **Configure Redirects** (`_redirects` file)
   ```
   /* /index.html 200
   ```

### Option 3: AWS S3 + CloudFront

**Pros:** Scalable, highly customizable, good for large apps

**Steps:**

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://appointment-booking --region us-east-1
   
   # Enable static website hosting
   aws s3api put-bucket-website \
     --bucket appointment-booking \
     --website-configuration '{
       "IndexDocument": {"Suffix": "index.html"},
       "ErrorDocument": {"Key": "index.html"}
     }'
   ```

2. **Build and Upload**
   ```bash
   npm run build
   
   aws s3 sync dist/ s3://appointment-booking \
     --delete \
     --cache-control "max-age=3600" \
     --exclude "index.html"
   
   aws s3 cp dist/index.html s3://appointment-booking/index.html \
     --cache-control "max-age=0, no-cache"
   ```

3. **Setup CloudFront**
   ```bash
   # Create CloudFront distribution
   # Origin: S3 bucket
   # Default root object: index.html
   # Cache behavior: 24 hours for assets
   ```

4. **Deploy Script**
   ```bash
   #!/bin/bash
   npm run build
   aws s3 sync dist/ s3://appointment-booking --delete
   aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
   ```

### Option 4: DigitalOcean App Platform

**Pros:** Affordable, integrated with DigitalOcean ecosystem

**Steps:**

1. **Create App**
   - Go to App Platform
   - Connect GitHub repo
   - Select root directory: `frontend`

2. **Configure**
   ```yaml
   name: appointment-booking
   services:
   - name: web
     github:
       repo: your-repo
       branch: main
     build_command: npm run build
     source_dir: frontend
     http_port: 80
     envs:
     - key: VITE_API_URL
       value: https://api.example.com/api
   ```

3. **Deploy**
   - Click "Create"
   - DigitalOcean builds and deploys

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Check if deployed
curl https://booking.example.com

# Check if static assets loading
curl https://booking.example.com/assets/index-*.js

# Check API connectivity
curl https://booking.example.com/api/health
```

### 2. Functional Testing

- [ ] Home page loads in < 3s
- [ ] Can lookup business
- [ ] Can navigate to booking page
- [ ] All API calls succeed
- [ ] Booking submission works
- [ ] Success page displays
- [ ] Mobile view responsive

### 3. Performance Metrics

Use tools:
- **Lighthouse:** `npm run build && npm run preview`
- **WebPageTest:** https://www.webpagetest.org/
- **GTmetrix:** https://gtmetrix.com/

Target scores:
- Lighthouse: > 80
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

### 4. Error Monitoring

Setup error tracking:
```typescript
// Sentry (optional)
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
})
```

### 5. Analytics

Setup analytics to track:
- Page views
- Booking completion rate
- Error rates
- API response times
- User geography

```typescript
// Google Analytics
import { useEffect } from 'react'

export function useAnalytics() {
  useEffect(() => {
    window.gtag?.('config', 'GA_ID')
  }, [])
}
```

---

## CORS Configuration

### Backend Setup

In `backend/src/app.ts`:
```typescript
const corsOptions = {
  origin: [
    'http://localhost:5173',           // Dev
    'https://booking.example.com',     // Production
    'https://booking-staging.example.com', // Staging
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
```

### Frontend API Client

Verify in `src/lib/api.ts`:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})
```

---

## SSL/TLS Certificate

### Using Let's Encrypt (Free)

```bash
# On production server
sudo certbot certonly --webroot -w /var/www/html -d booking.example.com

# Auto-renew
sudo certbot renew --dry-run
```

### Using AWS Certificate Manager

1. Request certificate in ACM console
2. Validate domain ownership
3. Attach to CloudFront distribution
4. Auto-renewal handled by AWS

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: 'frontend/package-lock.json'
    
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
    
    - name: Lint
      working-directory: ./frontend
      run: npm run lint
    
    - name: Type check
      working-directory: ./frontend
      run: npm run type-check
    
    - name: Build
      working-directory: ./frontend
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
      run: npm run build
    
    - name: Deploy to Vercel
      uses: vercel/action@master
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./frontend
```

### Manual Deployment

```bash
# 1. Build
npm run build

# 2. Test build
npm run preview

# 3. Deploy to Vercel
vercel deploy --prod

# 4. or Deploy to Netlify
netlify deploy --prod --dir=dist

# 5. or Deploy to S3
aws s3 sync dist/ s3://appointment-booking --delete
```

---

## Rollback Procedure

### If Deployment Breaks

**Vercel:**
```bash
# Revert to previous deployment
vercel deployments
vercel rollback [DEPLOYMENT_ID]
```

**Netlify:**
```bash
# Via UI: Deploys → (select previous) → Restore
netlify deploys
netlify api --http-method GET /sites/xxx/deploys
```

**Manual:**
```bash
# Restore from backup
aws s3 sync s3://appointment-booking-backup dist/
aws s3 sync dist/ s3://appointment-booking --delete
```

---

## Monitoring & Maintenance

### Uptime Monitoring

Setup with Pingdom or UptimeRobot:
- Check every 5 minutes
- Alert on 500 errors
- Alert on > 5s response time
- Alert on SSL certificate expiring

### Log Aggregation

Send logs to:
- Datadog
- CloudWatch
- ELK Stack
- Splunk

### Database Backups

```bash
# Backup database daily
0 2 * * * pg_dump dbname > /backups/db-$(date +\%Y-\%m-\%d).sql

# Cleanup old backups
find /backups -name "db-*.sql" -mtime +30 -delete
```

---

## Troubleshooting

### Blank Page on Load

**Cause:** JavaScript error or missing assets

**Fix:**
```bash
# Check browser console for errors
# Verify dist/index.html exists
# Verify API_URL is correct
# Check CORS configuration
```

### API Calls Failing

**Cause:** CORS, wrong API URL, or backend down

**Fix:**
```bash
# Check VITE_API_URL in build
cat dist/index.html | grep VITE_API_URL

# Test API directly
curl https://api.example.com/api/health

# Check backend logs
ssh user@api.example.com
tail -f logs/app.log
```

### Slow Performance

**Cause:** Large bundle, slow network, or backend issues

**Fix:**
```bash
# Check bundle size
npm run build -- --visualize

# Monitor backend performance
curl -w "@curl-format.txt" -o /dev/null https://booking.example.com

# Check CDN/caching headers
curl -I https://booking.example.com/assets/index-*.js
```

### Certificates Expiring

**Fix:**
```bash
# Check expiration
curl -vI https://booking.example.com 2>&1 | grep expire

# Renew with Let's Encrypt
sudo certbot renew

# Check auto-renewal is working
sudo certbot renew --dry-run
```

---

## Scaling Considerations

### As Usage Grows

1. **Use CDN for Assets**
   - Cloudflare (free tier available)
   - CloudFront (AWS)
   - Bunny CDN

2. **Enable Caching**
   - Cache-Control headers
   - Service Worker
   - Browser cache

3. **Optimize Images**
   - WebP format
   - Lazy loading
   - Responsive images

4. **Monitor Metrics**
   - Request rate
   - Error rate
   - Response time
   - Resource usage

5. **Load Testing**
   ```bash
   # Test with Apache Bench
   ab -n 1000 -c 10 https://booking.example.com
   
   # Or k6
   k6 run load-test.js
   ```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers set (CSP, X-Frame-Options, etc.)
- [ ] Rate limiting enabled on backend
- [ ] Input validation on all forms
- [ ] No sensitive data in localStorage except JWT
- [ ] JWT expiration set to reasonable time (30 min)
- [ ] Refresh tokens stored securely
- [ ] CORS properly configured
- [ ] No console.log of sensitive data
- [ ] API keys/secrets in environment variables only
- [ ] Regular security audits: `npm audit`
- [ ] Dependency updates: `npm update`
- [ ] Penetration testing before launch

---

## Maintenance Schedule

### Daily
- [ ] Monitor error rates
- [ ] Check uptime status
- [ ] Review user feedback

### Weekly
- [ ] Review performance metrics
- [ ] Check for security updates
- [ ] Review backup status

### Monthly
- [ ] Full security audit
- [ ] Dependency updates
- [ ] Performance optimization review
- [ ] Update documentation

### Quarterly
- [ ] Penetration testing
- [ ] Database optimization
- [ ] Capacity planning
- [ ] Disaster recovery drill

---

## Success Criteria

Your deployment is successful when:

✅ **Availability**
- 99.9% uptime over 30 days
- < 1 second response time (p95)
- < 100ms Time to First Byte (TTFB)

✅ **Performance**
- Lighthouse score > 85
- First Contentful Paint < 2s
- Largest Contentful Paint < 2.5s

✅ **Functionality**
- 100% booking completion rate in testing
- All API calls returning correct data
- No console errors
- Mobile responsive on all devices

✅ **Security**
- HTTPS on all pages
- No security vulnerabilities (npm audit)
- Rate limiting preventing abuse
- Proper CORS configuration

✅ **Business**
- Customers completing bookings
- Confirmation emails delivered
- Provider dashboard shows bookings
- Zero double-booking incidents

---

## Contact & Support

- **Production Issues:** ops@example.com
- **Security Issues:** security@example.com
- **Deployment Help:** devops@example.com

---

## Rollback Plan Summary

| Issue | Detection | Action | Time |
|-------|-----------|--------|------|
| 404 on home page | Uptime monitor | Revert deployment | 2 min |
| API 500 errors | Error tracking | Check backend | 5 min |
| Slow performance | Performance monitoring | Check CDN cache | 10 min |
| High error rate | Error percentage threshold | Rollback to last stable | 5 min |

Always maintain ability to rollback within 5 minutes of detecting issue.
