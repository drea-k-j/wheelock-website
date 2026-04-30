# Domain and Email Setup Instructions

## Part 1: Connecting Your InMotion Domain to Render

### Prerequisites
- Your domain is registered with InMotion Hosting
- You have access to the InMotion control panel
- Your Render services are already deployed

### Step-by-Step Guide

#### 1. Get Your Render Domain Information

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **Frontend Service** (wheelock-frontend)
3. Go to the **Settings** tab
4. Look for **Custom Domains** section
5. Note the custom domain nameservers that Render provides (usually something like `ns1.render.com`, `ns2.render.com`, etc.)

#### 2. Update DNS in InMotion

1. Log in to [InMotion Hosting Control Panel](https://www.inmotionhosting.com/controlpanel)
2. Navigate to **Domains** → **Manage DNS**
3. Select your domain name
4. You'll see a section for **Nameservers**

**Option A: Update Nameservers (Recommended)**
- Replace InMotion's nameservers with Render's nameservers
- This gives Render full control of your DNS
- You'll get Render's nameserver addresses from the Custom Domains section

**Option B: Add CNAME Record (If keeping InMotion DNS)**
- If you want to keep InMotion's DNS management:
- Go to **DNS Records** → **CNAME Records**
- Add:
  - **Name**: `www` (or your subdomain)
  - **Points to**: The Render-provided CNAME endpoint (from Custom Domains settings)

#### 3. Add Domain to Render

1. In Render Dashboard → Your Frontend Service → **Settings**
2. Click **Add Custom Domain**
3. Enter your domain: `yourdomain.com`
4. For `www` subdomain, add: `www.yourdomain.com`
5. Wait for DNS propagation (can take 5-48 hours, usually 5-30 minutes)

#### 4. Set Up SSL/TLS Certificate

Render automatically provisions SSL certificates via Let's Encrypt. Just wait for the "Certificate Issued" status.

#### 5. Update Backend API CORS (If Needed)

If your backend uses CORS and you're using your custom domain:

1. Go to your Backend Service on Render
2. Click **Environment** tab
3. Update `ALLOWED_ORIGINS` to include your custom domain:
   ```
   https://yourdomain.com,https://www.yourdomain.com
   ```
4. Redeploy the backend service

### Verification

- Visit `https://yourdomain.com` in your browser
- You should see your website with a green lock icon (indicating HTTPS)
- Open browser DevTools → Network tab to verify API calls work

---

## Part 2: Moving Email Associated with Your Domain to Render

Unfortunately, **Render does not provide email hosting services**. You have several options:

### Option 1: Keep Email with InMotion (Easiest)

This is the recommended approach for most users:

1. Keep your email hosted with InMotion
2. Update your MX records to point to InMotion's mail servers
3. Your domain DNS is managed by Render, but InMotion still handles email

**Steps:**
1. In InMotion Control Panel → **Email** section, note your mail server details
2. In Render → Your Frontend Service → Custom Domains settings
3. Or if using DNS manager: Add these MX records:
   - **Priority 10**: mail.yourdomain.com (or InMotion's mail server)
   - **Priority 20**: mail2.yourdomain.com (backup, if provided)
4. Add these A/AAAA records for your mail server (if needed)

### Option 2: Use Google Workspace (Recommended for Professionals)

Provides email, calendar, docs, and more:

1. Go to [Google Workspace Admin](https://admin.google.com)
2. Add your domain (verify via DNS)
3. Follow Google's MX record setup
4. In Render DNS or InMotion, add Google's MX records:
   ```
   Priority 5:  aspmx.l.google.com
   Priority 10: alt1.aspmx.l.google.com
   Priority 20: alt2.aspmx.l.google.com
   Priority 30: alt3.aspmx.l.google.com
   Priority 40: alt4.aspmx.l.google.com
   ```

### Option 3: Use a Third-Party Email Service

Popular options:
- **Zoho Mail** - Affordable, reliable
- **Microsoft 365** - Full Office suite
- **Proton Mail** - Privacy-focused
- **SendGrid** (transactional only) - For automated emails

**General steps for any provider:**
1. Sign up with the email provider
2. Add your domain to their system
3. They'll provide MX records to add to your DNS
4. Add those MX records to Render's DNS settings (or InMotion if using their DNS)
5. Wait for DNS propagation

### Option 4: Keep Full InMotion Management

If you want to keep everything with InMotion:

1. Don't change nameservers to Render
2. Use InMotion's DNS management for everything
3. Add Render's CNAME records via InMotion's DNS instead
4. Manage email through InMotion's interface

**Trade-off**: You'll need to manually manage DNS records if moving to a new host in the future.

---

## DNS Records Cheat Sheet

Here's what a complete DNS setup might look like (example values):

| Type  | Name | Value | Priority | TTL |
|-------|------|-------|----------|-----|
| A     | @    | Render IP | - | 3600 |
| CNAME | www  | your-render-domain.onrender.com | - | 3600 |
| MX    | @    | mail.yourdomain.com | 10 | 3600 |
| TXT   | @    | v=spf1 include:yourmailprovider.com ~all | - | 3600 |

---

## Troubleshooting

### Domain not resolving
- Wait 24-48 hours for DNS propagation
- Check your DNS settings are correct
- Clear browser cache: `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
- Use online tools: https://dns.google or https://www.whatsmydns.net

### Email not working after domain change
- Verify MX records are set correctly
- Check SPF record (should include your email provider)
- Add DKIM and DMARC records for better deliverability
- Contact your email provider's support

### HTTPS certificate not issuing
- Wait 5-10 minutes (automatic renewal takes time)
- Verify domain DNS points to Render
- Check for typos in domain name
- Contact Render support if still not working

### Backend API failing with custom domain
- Verify `ALLOWED_ORIGINS` includes your domain
- Check backend logs in Render Dashboard
- Ensure HTTPS is working (check browser console for mixed content errors)

---

## Additional Resources

- [Render Custom Domains Docs](https://render.com/docs/custom-domains)
- [InMotion DNS Management](https://www.inmotionhosting.com/support/tutorials/change-domain-nameservers/)
- [Google Workspace Setup](https://support.google.com/a/answer/1347270)
- [DNS Propagation Checker](https://www.whatsmydns.net)
