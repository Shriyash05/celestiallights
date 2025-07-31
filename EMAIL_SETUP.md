# Email Setup Guide

The application now supports free email functionality using Nodemailer. To enable email notifications for quote requests, you can set up any free SMTP provider.

## Free SMTP Options

### 1. Gmail (Recommended for testing)
- **SMTP_HOST**: smtp.gmail.com
- **SMTP_PORT**: 587
- **SMTP_SECURE**: false
- **SMTP_USER**: your-gmail@gmail.com
- **SMTP_PASS**: your-app-password (not regular password)
- **ADMIN_EMAIL**: where-to-send-quotes@yourdomain.com

Note: You'll need to generate an "App Password" in your Gmail security settings.

### 2. Outlook/Hotmail
- **SMTP_HOST**: smtp.live.com
- **SMTP_PORT**: 587
- **SMTP_SECURE**: false
- **SMTP_USER**: your-email@outlook.com
- **SMTP_PASS**: your-password

### 3. Yahoo Mail
- **SMTP_HOST**: smtp.mail.yahoo.com
- **SMTP_PORT**: 587 or 465
- **SMTP_SECURE**: true (for port 465)
- **SMTP_USER**: your-email@yahoo.com
- **SMTP_PASS**: your-app-password

## How to Add Email Credentials

Add these environment variables to your `.env` file:
- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASS
- ADMIN_EMAIL

## Without Email Setup

The application works perfectly without email setup - quote requests will be logged to the server console and you can manually check them there.