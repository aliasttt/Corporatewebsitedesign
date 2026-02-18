# تنظیمات دامنه revoliftasansor.com

## ✅ تنظیمات انجام شده:

### 1. Django Settings
- **config/settings.py**: `ALLOWED_HOSTS` به‌روزرسانی شد
- **config/settings_production.py**: `ALLOWED_HOSTS` برای production تنظیم شد

### 2. Nginx Configuration
- **nginx_asansor.conf**: دامنه `revoliftasansor.com` و `www.revoliftasansor.com` تنظیم شد

### 3. Environment Variables
- **.env.example**: دامنه در فایل نمونه تنظیم شد

## 📋 مراحل Deployment روی VPS:

### مرحله 1: تنظیم DNS
اطمینان حاصل کنید که DNS دامنه به IP سرور شما اشاره می‌کند:
```
A Record: revoliftasansor.com -> YOUR_SERVER_IP
A Record: www.revoliftasansor.com -> YOUR_SERVER_IP
```

### مرحله 2: تنظیم Nginx
```bash
sudo cp nginx_asansor.conf /etc/nginx/sites-available/asansor
sudo ln -s /etc/nginx/sites-available/asansor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### مرحله 3: تنظیم SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d revoliftasansor.com -d www.revoliftasansor.com
```

بعد از دریافت SSL، در `config/settings_production.py`:
```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

### مرحله 4: تنظیم فایل .env
```bash
cd /var/www/asansor
nano .env
```

محتویات:
```
ALLOWED_HOSTS=revoliftasansor.com,www.revoliftasansor.com
DB_NAME=asansor_db
DB_USER=asansor_user
DB_PASSWORD=your-secure-password
SECRET_KEY=your-django-secret-key
```

### مرحله 5: راه‌اندازی مجدد سرویس‌ها
```bash
sudo systemctl restart asansor
sudo systemctl restart nginx
```

## 🔍 بررسی نهایی:

```bash
# بررسی وضعیت سرویس‌ها
sudo systemctl status asansor
sudo systemctl status nginx

# بررسی لاگ‌ها
sudo tail -f /var/log/nginx/asansor_error.log
sudo tail -f /var/log/gunicorn/asansor_error.log
```

## 🌐 دسترسی به سایت:

- http://revoliftasansor.com
- http://www.revoliftasansor.com
- https://revoliftasansor.com (بعد از SSL)
- https://www.revoliftasansor.com (بعد از SSL)

## ⚠️ نکات مهم:

1. ✅ DNS باید به درستی تنظیم شده باشد
2. ✅ پورت 80 و 443 باید در فایروال باز باشد
3. ✅ SSL را حتماً فعال کنید
4. ✅ بعد از SSL، تنظیمات امنیتی Django را فعال کنید
