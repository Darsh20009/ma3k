# Environment Configuration Guide - Ma3k Company Platform

## Environment Structure

The application supports three environments:

```
Development → Staging → Production
```

## Environment Variables

### 1. Development Environment (.env.development)

**Database**
```
MONGODB_URI=mongodb://localhost:27017/ma3k_dev
DATABASE_URL=postgresql://localhost:5432/ma3k_dev
```

**Payment Services** (Sandbox/Test)
```
PAYPAL_CLIENT_ID=test_paypal_client_id
PAYPAL_SECRET=test_paypal_secret
STRIPE_SECRET_KEY=sk_test_xxxx
```

**Other Services**
```
SENDGRID_API_KEY=test_sendgrid_api_key
SESSION_SECRET=dev-session-secret-change-in-production
EMPLOYEE_REGISTRATION_CODE=DEV2024
NODE_ENV=development
PORT=5000
```

**Frontend**
```
VITE_PAYPAL_CLIENT_ID=test_paypal_client_id
```

---

### 2. Staging Environment (.env.staging)

**Database** (Production cluster, staging database)
```
MONGODB_URI=mongodb+srv://user:password@prod-cluster.mongodb.net/ma3k_staging
DATABASE_URL=postgresql://user:password@staging-host:5432/ma3k_staging
```

**Payment Services** (Live credentials, test transactions)
```
PAYPAL_CLIENT_ID=staging_paypal_client_id
PAYPAL_SECRET=staging_paypal_secret
STRIPE_SECRET_KEY=sk_live_xxxx (test mode enabled)
```

**Other Services**
```
SENDGRID_API_KEY=staging_sendgrid_api_key
SESSION_SECRET=staging-session-secret-use-strong-password
EMPLOYEE_REGISTRATION_CODE=STAGING2024
NODE_ENV=staging
PORT=5000
```

---

### 3. Production Environment (.env.production)

**Database** (Production cluster)
```
MONGODB_URI=mongodb+srv://user:password@prod-cluster.mongodb.net/ma3k_prod
DATABASE_URL=postgresql://user:password@prod-host:5432/ma3k_prod
```

**Payment Services** (Live credentials)
```
PAYPAL_CLIENT_ID=live_paypal_client_id
PAYPAL_SECRET=live_paypal_secret
STRIPE_SECRET_KEY=sk_live_xxxx
```

**Other Services**
```
SENDGRID_API_KEY=production_sendgrid_api_key
SESSION_SECRET=use-strong-random-secret-key
EMPLOYEE_REGISTRATION_CODE=PROD2024
NODE_ENV=production
PORT=5000
```

---

## Setup Instructions

### Using Replit Secrets

1. Go to Replit Secrets tab
2. Add each environment variable for your current environment
3. Restart the application

### Environment Selection

The application automatically detects the environment:

```
NODE_ENV=development  → Uses .env.development
NODE_ENV=staging      → Uses .env.staging
NODE_ENV=production   → Uses .env.production
```

---

## Important Security Notes

- ⚠️ **NEVER commit .env files** to version control
- ⚠️ **Use Replit Secrets** for sensitive values
- ⚠️ **Production credentials** should only be known to authorized people
- ⚠️ **Rotate secrets regularly** (especially SESSION_SECRET)
- ⚠️ **Use strong passwords** for database connections

---

## Database Migration Between Environments

```bash
# Development → Staging
npm run db:push -- --force

# Staging → Production (requires backup first)
npm run db:backup
npm run db:push -- --force
```

---

## Monitoring Per Environment

### Development
- Full error logging
- All console output visible
- Can modify data freely

### Staging
- Production-like setup
- Monitor performance and bugs
- Test payment flows with real credentials (test mode)

### Production
- Errors logged to monitoring service
- Limited console output
- NO test transactions
- Automatic backups enabled

---

## Quick Reference

| Config | Development | Staging | Production |
|--------|------------|---------|-----------|
| Database | Local/Dev Cloud | Staging Cloud | Production Cloud |
| Payment | Sandbox | Live (Test) | Live |
| Logging | Verbose | Normal | Minimal |
| Backups | Manual | Daily | Hourly |
| Monitoring | Local | Cloud | Cloud + Alerts |

---

## Troubleshooting

**"Database connection failed"**
- Check MONGODB_URI and DATABASE_URL
- Verify network access rules
- Check credentials

**"Payment provider error"**
- Verify correct API keys for environment
- Check if sandbox/live mode matches
- Review payment provider logs

**"Email not sending"**
- Verify SENDGRID_API_KEY
- Check sender address configuration
- Review email service logs

---

For more information, see the main documentation in `replit.md`.
