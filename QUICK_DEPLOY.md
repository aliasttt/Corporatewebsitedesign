# 🚀 دستورات سریع Deployment

## مرحله 1: نصب وابستگی‌ها

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv python3-dev postgresql postgresql-contrib nginx git build-essential libpq-dev
```

## مرحله 2: تنظیم PostgreSQL

```bash
sudo -u postgres psql
```

در PostgreSQL:
```sql
CREATE DATABASE asansor_db;
CREATE USER asansor_user WITH PASSWORD 'YOUR_SECURE_PASSWORD';
ALTER ROLE asansor_user SET client_encoding TO 'utf8';
ALTER ROLE asansor_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE asansor_user SET timezone TO 'Asia/Tehran';
GRANT ALL PRIVILEGES ON DATABASE asansor_db TO asansor_user;
\q
```

## مرحله 3: ایجاد دایرکتوری و آپلود پروژه

```bash
sudo mkdir -p /var/www/asansor
sudo chown $USER:$USER /var/www/asansor
cd /var/www/asansor

# آپلود فایل‌ها از کامپیوتر محلی:
# scp -r * user@your-server:/var/www/asansor/
```

## مرحله 4: تنظیم Virtual Environment

```bash
cd /var/www/asansor
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## مرحله 5: تنظیم فایل .env

```bash
cp .env.example .env
nano .env
```

محتویات `.env`:
```
DB_NAME=asansor_db
DB_USER=asansor_user
DB_PASSWORD=YOUR_SECURE_PASSWORD
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=YOUR_DJANGO_SECRET_KEY
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-server-ip
```

تولید SECRET_KEY:
```bash
python manage.py shell
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
exit()
```

## مرحله 6: Migration و Static Files

```bash
export DJANGO_SETTINGS_MODULE=config.settings_production
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

## مرحله 7: تنظیم Gunicorn Service

```bash
sudo cp asansor.service /etc/systemd/system/
sudo nano /etc/systemd/system/asansor.service  # بررسی مسیرها
sudo mkdir -p /var/log/gunicorn /var/log/django /var/run/gunicorn
sudo chown -R www-data:www-data /var/log/gunicorn /var/log/django /var/run/gunicorn
sudo systemctl daemon-reload
sudo systemctl enable asansor
sudo systemctl start asansor
sudo systemctl status asansor
```

## مرحله 8: تنظیم Nginx

```bash
sudo cp nginx_asansor.conf /etc/nginx/sites-available/asansor
sudo nano /etc/nginx/sites-available/asansor  # تغییر دامنه
sudo ln -s /etc/nginx/sites-available/asansor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## مرحله 9: SSL (اختیاری)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

بعد از SSL، در `settings_production.py`:
```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## مرحله 10: Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

## ✅ بررسی نهایی

```bash
# بررسی سرویس‌ها
sudo systemctl status asansor
sudo systemctl status nginx
sudo systemctl status postgresql

# بررسی لاگ‌ها
sudo tail -f /var/log/gunicorn/asansor_error.log
sudo tail -f /var/log/nginx/asansor_error.log
```

## 🔄 به‌روزرسانی پروژه

```bash
cd /var/www/asansor
source venv/bin/activate
# git pull  یا آپلود فایل‌های جدید
pip install -r requirements.txt
export DJANGO_SETTINGS_MODULE=config.settings_production
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart asansor
```

## 📝 نکات مهم

1. ✅ تمام رمزهای عبور را تغییر دهید
2. ✅ دامنه را در `nginx_asansor.conf` و `ALLOWED_HOSTS` تنظیم کنید
3. ✅ فایل `.env` را در `.gitignore` قرار دهید
4. ✅ SSL را فعال کنید
5. ✅ بکاپ منظم از دیتابیس بگیرید

## 🆘 عیب‌یابی

```bash
# بررسی لاگ Gunicorn
sudo journalctl -u asansor -n 50

# بررسی لاگ Nginx
sudo tail -f /var/log/nginx/error.log

# تست اتصال دیتابیس
sudo -u postgres psql -d asansor_db -U asansor_user
```

---

**برای راهنمای کامل، فایل `DEPLOYMENT.md` را مطالعه کنید.**
