# Email Configuration for Celestial Lights Website

## Current Email Setup

The contact forms and quote requests use **Nodemailer** with SMTP configuration.

### Configuration Required

Add these environment variables to your hosting:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_business_email@gmail.com
SMTP_PASS=your_app_specific_password

# Business Information
BUSINESS_NAME=Celestial Lights
BUSINESS_EMAIL=info.celestiallight@gmail.com
BUSINESS_PHONE=+91 98765 43210
```

## Email Features

### 1. Quote Request Notifications
When customers submit quote requests:
- ✅ Customer receives confirmation email
- ✅ Business receives notification with quote details
- ✅ Auto-reply with business contact information

### 2. Contact Form Submissions
When customers use contact forms:
- ✅ Business receives inquiry details
- ✅ Customer receives acknowledgment
- ✅ Includes customer's contact information

### 3. WhatsApp Integration
- ✅ Automatic WhatsApp link generation
- ✅ Pre-filled messages for quote requests
- ✅ Direct communication channel

## Gmail Setup (Recommended)

### 1. Create Business Gmail Account
1. Create `info.celestiallight@gmail.com` (or your preferred business email)
2. Enable 2-Factor Authentication

### 2. Generate App Password
1. Go to Google Account Settings
2. Security → 2-Step Verification → App passwords
3. Generate password for "Mail"
4. Use this password in `SMTP_PASS`

### 3. Update Environment Variables
```env
SMTP_USER=info.celestiallight@gmail.com
SMTP_PASS=your_16_character_app_password
```

## Alternative SMTP Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your_mailgun_username
SMTP_PASS=your_mailgun_password
```

## Email Templates

The application includes pre-built templates for:

### Quote Request Confirmation
```
Subject: Quote Request Received - Celestial Lights
Content: Professional acknowledgment with next steps
```

### Business Notification
```
Subject: New Quote Request from [Customer Name]
Content: Complete customer details and project requirements
```

## Testing Email Configuration

After deployment, test email functionality:

1. **Submit Quote Request**: Verify both customer and business emails
2. **Contact Form**: Check form submission notifications
3. **Error Handling**: Ensure graceful failures if SMTP fails

## WhatsApp Configuration

Current WhatsApp settings in `client/src/config/contact.ts`:

```typescript
whatsappNumber: "918976453765"
businessPhone: "+91 98765 43210"  
businessEmail: "info.celestiallight@gmail.com"
```

Update these numbers with your actual business contact details.

## Troubleshooting

### Common Issues:

1. **Emails not sending**
   - Verify SMTP credentials
   - Check Gmail app password
   - Ensure 2FA is enabled

2. **Emails in spam**
   - Use business domain email
   - Configure SPF/DKIM records
   - Add sender to contacts

3. **Rate limiting**
   - Gmail: 500 emails/day
   - Consider upgrading to business email service

## Production Checklist

- ✅ Business email account created
- ✅ App password generated  
- ✅ Environment variables configured
- ✅ Email templates tested
- ✅ WhatsApp number updated
- ✅ Spam folder checked
- ✅ Error handling verified