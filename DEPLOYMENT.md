# راهنمای Deployment پروژه Asansor روی VPS

این راهنما برای deploy کردن پروژه Django Asansor روی VPS با استفاده از Nginx، Gunicorn و PostgreSQL است.

## پیش‌نیازها

- سرور Ubuntu/Debian
- دسترسی root یا sudo
- دامنه (اختیاری اما توصیه می‌شود)

---

## مرحله 1: نصب وابستگی‌های سیستم

```bash
# به‌روزرسانی سیستم
sudo apt update && sudo apt upgrade -y

# نصب Python و pip
sudo apt install python3 python3-pip python3-venv python3-dev -y

# نصب PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# نصب Nginx
sudo apt install nginx -y

# نصب ابزارهای دیگر
sudo apt install git build-essential libpq-dev -y
```

---

## مرحله 2: تنظیم PostgreSQL

```bash
# ورود به PostgreSQL
sudo -u postgres psql

# در PostgreSQL shell:
CREATE DATABASE asansor_db;
CREATE USER asansor_user WITH PASSWORD 'your-secure-password-here';
ALTER ROLE asansor_user SET client_encoding TO 'utf8';
ALTER ROLE asansor_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE asansor_user SET timezone TO 'Asia/Tehran';
GRANT ALL PRIVILEGES ON DATABASE asansor_db TO asansor_user;
\q
```

**نکته:** رمز عبور قوی انتخاب کنید و آن را در جای امن نگه دارید.

---

## مرحله 3: ایجاد ساختار دایرکتوری

```bash
# ایجاد دایرکتوری پروژه
sudo mkdir -p /var/www/asansor
sudo chown $USER:$USER /var/www/asansor

# ایجاد دایرکتوری‌های لاگ
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/log/django
sudo mkdir -p /var/run/gunicorn
sudo chown -R www-data:www-data /var/log/gunicorn /var/log/django /var/run/gunicorn
```

---

## مرحله 4: آپلود پروژه به سرور

### روش 1: استفاده از Git

```bash
cd /var/www/asansor
git clone https://github.com/your-username/your-repo.git .
```

### روش 2: استفاده از SCP (از کامپیوتر محلی)

```bash
# از کامپیوتر محلی خود:
scp -r /path/to/asansor/* user@your-server-ip:/var/www/asansor/
```

---

## مرحله 5: تنظیم Virtual Environment

```bash
cd /var/www/asansor

# ایجاد virtual environment
python3 -m venv venv

# فعال‌سازی virtual environment
source venv/bin/activate

# نصب وابستگی‌ها
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
```

---

## مرحله 6: تنظیم Django برای Production

```bash
cd /var/www/asansor

# کپی فایل settings_production.py به config/settings_production.py (اگر وجود ندارد)
# ویرایش فایل config/settings_production.py:
# - تغییر ALLOWED_HOSTS
# - تغییر اطلاعات دیتابیس PostgreSQL

# ایجاد فایل .env برای متغیرهای محیطی (اختیاری اما توصیه می‌شود)
nano .env
```

محتوای فایل `.env`:
```
DB_NAME=asansor_db
DB_USER=asansor_user
DB_PASSWORD=your-secure-password-here
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-django-secret-key-here
```

**تولید SECRET_KEY جدید:**
```bash
python manage.py shell
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
exit()
```

---

## مرحله 7: Migration و Collect Static

```bash
cd /var/www/asansor
source venv/bin/activate

# تنظیم متغیر محیطی برای استفاده از settings production
export DJANGO_SETTINGS_MODULE=config.settings_production

# اجرای migrations
python manage.py migrate

# ایجاد superuser (اختیاری)
python manage.py createsuperuser

# جمع‌آوری فایل‌های static
python manage.py collectstatic --noinput
```

---

## مرحله 8: تنظیم Gunicorn

```bash
cd /var/www/asansor

# کپی فایل gunicorn_config.py به دایرکتوری پروژه (اگر وجود ندارد)
# کپی فایل asansor.service به /etc/systemd/system/

sudo cp asansor.service /etc/systemd/system/

# ویرایش فایل service برای تنظیم مسیرها
sudo nano /etc/systemd/system/asansor.service

# فعال‌سازی و راه‌اندازی سرویس
sudo systemctl daemon-reload
sudo systemctl enable asansor
sudo systemctl start asansor

# بررسی وضعیت سرویس
sudo systemctl status asansor
```

---

## مرحله 9: تنظیم Nginx

```bash
# کپی فایل تنظیمات Nginx
sudo cp nginx_asansor.conf /etc/nginx/sites-available/asansor

# ویرایش فایل برای تنظیم دامنه
sudo nano /etc/nginx/sites-available/asansor

# ایجاد symlink
sudo ln -s /etc/nginx/sites-available/asansor /etc/nginx/sites-enabled/

# تست تنظیمات Nginx
sudo nginx -t

# راه‌اندازی مجدد Nginx
sudo systemctl restart nginx

# بررسی وضعیت Nginx
sudo systemctl status nginx
```

---

## مرحله 10: تنظیم Firewall

```bash
# اگر UFW فعال است
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw status
```

---

## مرحله 11: تنظیم SSL با Let's Encrypt (اختیاری اما توصیه می‌شود)

```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx -y

# دریافت گواهینامه SSL
sudo certbot --nginx -d revoliftasansor.com -d www.revoliftasansor.com

# تست تمدید خودکار
sudo certbot renew --dry-run
```

**بعد از تنظیم SSL، در `settings_production.py` تغییر دهید:**
```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

---

## دستورات مفید

### بررسی لاگ‌ها

```bash
# لاگ Gunicorn
sudo tail -f /var/log/gunicorn/asansor_error.log
sudo tail -f /var/log/gunicorn/asansor_access.log

# لاگ Django
sudo tail -f /var/log/django/asansor.log

# لاگ Nginx
sudo tail -f /var/log/nginx/asansor_error.log
sudo tail -f /var/log/nginx/asansor_access.log
```

### مدیریت سرویس Gunicorn

```bash
# راه‌اندازی مجدد
sudo systemctl restart asansor

# توقف
sudo systemctl stop asansor

# شروع
sudo systemctl start asansor

# وضعیت
sudo systemctl status asansor
```

### مدیریت Nginx

```bash
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl status nginx
```

### به‌روزرسانی پروژه

```bash
cd /var/www/asansor
source venv/bin/activate

# اگر از Git استفاده می‌کنید
git pull

# نصب وابستگی‌های جدید
pip install -r requirements.txt

# اجرای migrations
python manage.py migrate

# جمع‌آوری static files
python manage.py collectstatic --noinput

# راه‌اندازی مجدد Gunicorn
sudo systemctl restart asansor
```

---

## عیب‌یابی

### مشکل: سرویس Gunicorn شروع نمی‌شود

```bash
# بررسی لاگ
sudo journalctl -u asansor -n 50

# بررسی مجوزها
ls -la /var/www/asansor
```

### مشکل: Nginx خطا می‌دهد

```bash
# تست تنظیمات
sudo nginx -t

# بررسی لاگ
sudo tail -f /var/log/nginx/error.log
```

### مشکل: دیتابیس اتصال برقرار نمی‌کند

```bash
# تست اتصال PostgreSQL
sudo -u postgres psql -d asansor_db -U asansor_user

# بررسی تنظیمات PostgreSQL
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

---

## نکات امنیتی

1. **رمزهای عبور قوی:** از رمزهای عبور پیچیده برای دیتابیس و Django SECRET_KEY استفاده کنید
2. **فایروال:** فقط پورت‌های لازم را باز کنید
3. **SSL:** حتماً SSL را فعال کنید
4. **به‌روزرسانی:** سیستم و پکیج‌ها را به‌روز نگه دارید
5. **بکاپ:** به صورت منظم از دیتابیس بکاپ بگیرید

---

## ساختار نهایی دایرکتوری

```
/var/www/asansor/
├── config/
├── website/
├── staticfiles/
├── media/
├── templates/
├── venv/
├── manage.py
├── requirements.txt
├── gunicorn_config.py
└── .env
```

---

## پشتیبانی

در صورت بروز مشکل، لاگ‌ها را بررسی کنید و مطمئن شوید تمام مراحل را به درستی انجام داده‌اید.
