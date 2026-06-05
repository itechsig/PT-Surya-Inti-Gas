# SEO Deployment Guide for PT Surya Inti Gas Website

## 🚀 Setup SEO Configuration After Hosting

Since your website hasn't been hosted yet, all SEO files currently use placeholder URLs (`YOUR-DOMAIN.com`). After you deploy your website to a hosting service, follow these steps to configure SEO properly.

---

## 📋 Pre-Deployment Checklist

### 1. **Choose Your Domain Name**
- Decide on your actual domain (e.g., `suryaintigas.co.id`, `suryaintigas.com`, etc.)
- Purchase the domain from a registrar (GoDaddy, Namecheap, etc.)
- Configure DNS settings to point to your hosting

### 2. **Hosting Setup**
- Choose a hosting provider (Vercel, Netlify, AWS, DigitalOcean, etc.)
- Deploy your Frontend (React) and Backend (Laravel) applications
- Ensure SSL/HTTPS is properly configured
- Test that the website is accessible

---

## 🔧 Post-Deployment SEO Configuration

### Step 1: Update Domain URLs in Files

After your website is live with your actual domain, update these files:

#### **1.1 Update `index.html`**
Replace all instances of `YOUR-DOMAIN.com` with your actual domain:

```bash
# Replace in Frontend/index.html
- https://YOUR-DOMAIN.com
+ https://your-actual-domain.com
```

**Locations to update:**
- Open Graph URL (line ~26)
- Canonical URL (line ~40)
- Hreflang tags (lines ~43-46)
- Schema.org organization URL (line ~54)
- Schema.org logo URL (line ~55)
- Social media URLs (lines ~89-91) - if needed
- Service provider URL (line ~145)

#### **1.2 Update `sitemap.xml`**
Replace all instances of `YOUR-DOMAIN.com` with your actual domain in `Frontend/public/sitemap.xml`:

```bash
# Replace in Frontend/public/sitemap.xml
- https://YOUR-DOMAIN.com
+ https://your-actual-domain.com
```

#### **1.3 Update `robots.txt`**
Replace the sitemap URL in `Frontend/public/robots.txt`:

```bash
# Replace in Frontend/public/robots.txt
- Sitemap: https://YOUR-DOMAIN.com/sitemap.xml
+ Sitemap: https://your-actual-domain.com/sitemap.xml
```

---

### Step 2: Verify Files are Accessible

After updating the URLs, ensure these files are publicly accessible:

```bash
# Test in your browser:
https://your-actual-domain.com/
https://your-actual-domain.com/sitemap.xml
https://your-actual-domain.com/robots.txt
```

---

### Step 3: Configure i18n for Chinese Language

Add Chinese language support to your i18n configuration:

#### **Update `src/utils/i18n.ts` or your i18n config file:**

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from '../locales/id.json';
import en from '../locales/en.json';
import zh from '../locales/zh.json'; // Add this

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: id },
      en: { translation: en },
      zh: { translation: zh } // Add this
    },
    lng: 'id', // default language
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

#### **Update Language Switcher Component**

Ensure your `LanguageSwitcher.tsx` includes Chinese option:

```tsx
// In LanguageSwitcher.tsx
const languages = [
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' } // Add this
];
```

---

### Step 4: Submit to Search Engines

#### **4.1 Google Search Console**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (your actual domain)
3. Verify ownership (HTML file, DNS, or Google Analytics)
4. Submit your sitemap:
   ```
   https://your-actual-domain.com/sitemap.xml
   ```
5. Monitor indexing status in the "Coverage" report

#### **4.2 Bing Webmaster Tools**
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your website
3. Verify ownership
4. Submit your sitemap

#### **4.3 Baidu Webmaster Tools** (For China Market)
1. Go to [Baidu Webmaster Tools](https://ziyuan.baidu.com/)
2. Add your website (may require Chinese account)
3. Submit your sitemap for better Chinese SEO

---

### Step 5: Local SEO Optimization

#### **5.1 Google My Business**
1. Create/claim your Google My Business listing
2. Add your business information:
   - Business name: PT Surya Inti Gas
   - Address: Jl. Lingkar Timur KM 5.5, Rangkah Kidul, Sidoarjo
   - Phone: Your actual phone number
   - Website: https://your-actual-domain.com
   - Business category: Industrial Gas Supplier
3. Add photos of your facilities and products
4. Encourage customers to leave reviews

#### **5.2 Update Contact Information**
Ensure your actual contact details are updated in:
- Contact page
- Schema.org contact information in `index.html`
- Footer information

---

### Step 6: Monitor SEO Performance

#### **Tools to Use:**
- **Google Search Console** - Monitor search performance, indexing, and issues
- **Google Analytics** - Track traffic and user behavior
- **Ahrefs/SEMrush** - Monitor keyword rankings and backlinks
- **PageSpeed Insights** - Check and improve page speed

#### **Key Metrics to Track:**
- Organic traffic
- Keyword rankings (Indonesian, English, Chinese)
- Click-through rates (CTR)
- Indexing status
- Core Web Vitals

---

### Step 7: Ongoing SEO Maintenance

#### **Weekly/Monthly Tasks:**
- Update sitemap when adding new pages
- Check for broken links
- Monitor keyword rankings
- Create fresh content (blog, case studies)
- Build quality backlinks

#### **Quarterly Tasks:**
- Review and update meta tags
- Audit technical SEO
- Analyze competitor strategies
- Update structured data if needed

---

## 🎯 SEO Keywords Strategy

### **Primary Keywords (Indonesian):**
- Distributor gas industri terpercaya
- Supplier gas medis Indonesia
- PT Surya Inti Gas Sidoarjo
- Jual oksigen industri, nitrogen, argon
- Layanan instalasi gas industri

### **Primary Keywords (English):**
- Industrial gas supplier Indonesia
- Medical gas distributor
- PT Surya Inti Gas trusted partner
- Oxygen, nitrogen, argon supplier
- Gas installation services East Java

### **Primary Keywords (Chinese):**
- 工业气体供应商 (Industrial gas supplier)
- 医用气体分销商 (Medical gas distributor)
- 印尼氧气供应商 (Indonesia oxygen supplier)
- 氮气供应商 (Nitrogen supplier)
- 工业气体安装服务 (Industrial gas installation service)

---

## 📱 Additional SEO Tips

### **1. Mobile Optimization**
- Ensure your website is fully responsive
- Test on various mobile devices
- Optimize touch targets and font sizes

### **2. Page Speed Optimization**
- Compress images
- Minimize CSS/JS files
- Enable browser caching
- Use CDN for static assets

### **3. Content Strategy**
- Create blog posts about gas industry topics
- Share case studies and customer testimonials
- Publish product guides and safety information
- Use multilingual content to target international markets

### **4. Social Media Integration**
- Link to your social media profiles in footer
- Share website content on social media
- Use social meta tags properly
- Encourage social sharing

---

## ⚠️ Important Notes

1. **Don't forget to replace ALL instances** of `YOUR-DOMAIN.com` with your actual domain
2. **Test all language versions** (id, en, zh) after deployment
3. **Verify sitemap and robots.txt** are accessible
4. **Monitor Google Search Console** regularly for indexing issues
5. **Keep your sitemap updated** as you add new content

---

## 🆘 Troubleshooting

### **Sitemap not indexed:**
- Wait 24-48 hours after submission
- Check for crawl errors in Search Console
- Ensure sitemap.xml is accessible (200 status code)

### **Language versions not indexed:**
- Verify hreflang tags are correct
- Check that language switcher works properly
- Ensure each language version has unique content

### **Keywords not ranking:**
- SEO takes time (3-6 months for significant results)
- Focus on long-tail keywords first
- Build quality backlinks
- Create fresh, relevant content

---

## 📞 Need Help?

If you encounter any issues with SEO configuration after deployment:

1. Check this guide first
2. Review Google Search Console for errors
3. Test your sitemap and robots.txt accessibility
4. Verify all placeholder URLs have been replaced

---

**Good luck with your SEO journey! 🚀**

*Last updated: June 4, 2025*