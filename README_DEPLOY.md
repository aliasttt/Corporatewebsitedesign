# راهنمای سریع Deployment

## فایل‌های ایجاد شده:

1. **gunicorn_config.py** - تنظیمات Gunicorn
2. **asansor.service** - فایل systemd service
3. **nginx_asansor.conf** - تنظیمات Nginx
4. **config/settings_production.py** - تنظیمات Django برای production
5. **.env.example** - نمونه فایل متغیرهای محیطی
6. **DEPLOYMENT.md** - راهنمای کامل deployment
7. **deploy.sh** - اسکریپت خودکار (اختیاری)

## مراحل سریع:

### 1. روی سرور VPS:

```bash
# نصب وابستگی‌ها
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv python3-dev \
    postgresql postgresql-contrib nginx git build-essential libpq-dev

# ایجاد دیتابیس PostgreSQL
sudo -u postgres psql
CREATE DATABASE asansor_db;
CREATE USER asansor_user WITH PASSWORD 'رمز-قوی-ای-اینجا';
GRANT ALL PRIVILEGES ON DATABASE asansor_db TO asansor_user;
\q
```

### 2. آپلود پروژه:

```bash
# ایجاد دایرکتوری
sudo mkdir -p /var/www/asansor
sudo chown $USER:$USER /var/www/asansor

# آپلود فایل‌ها (از کامپیوتر محلی)
scp -r * user@your-server:/var/www/asansor/
```

### 3. تنظیم پروژه:

```bash
cd /var/www/asansor

# ایجاد virtual environment
python3 -m venv venv
source venv/bin/activate

# نصب وابستگی‌ها
pip install -r requirements.txt

# ایجاد فایل .env
cp .env.example .env
nano .env  # ویرایش و تنظیم مقادیر

# تنظیمات production
export DJANGO_SETTINGS_MODULE=config.settings_production

# Migration و Static
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### 4. تنظیم Gunicorn:

```bash
# کپی فایل service
sudo cp asansor.service /etc/systemd/system/

# ویرایش مسیرها در فایل (اگر نیاز باشد)
sudo nano /etc/systemd/system/asansor.service

# فعال‌سازی و شروع
sudo systemctl daemon-reload
sudo systemctl enable asansor
sudo systemctl start asansor
sudo systemctl status asansor
```

### 5. تنظیم Nginx:

```bash
# کپی فایل تنظیمات
sudo cp nginx_asansor.conf /etc/nginx/sites-available/asansor

# ویرایش دامنه
sudo nano /etc/nginx/sites-available/asansor

# فعال‌سازی
sudo ln -s /etc/nginx/sites-available/asansor /etc/nginx/sites-enabled/

# تست و راه‌اندازی مجدد
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL (اختیاری):

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## بررسی لاگ‌ها:

```bash
# Gunicorn
sudo tail -f /var/log/gunicorn/asansor_error.log

# Django
sudo tail -f /var/log/django/asansor.log

# Nginx
sudo tail -f /var/log/nginx/asansor_error.log
```

## دستورات مفید:

```bash
# راه‌اندازی مجدد سرویس
sudo systemctl restart asansor
sudo systemctl restart nginx

# وضعیت سرویس
sudo systemctl status asansor
sudo systemctl status nginx

# به‌روزرسانی پروژه
cd /var/www/asansor
source venv/bin/activate
git pull  # یا آپلود فایل‌های جدید
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart asansor
```

## نکات مهم:

1. ✅ رمزهای عبور را در فایل `.env` تغییر دهید
2. ✅ `ALLOWED_HOSTS` را در `settings_production.py` تنظیم کنید
3. ✅ دامنه را در `nginx_asansor.conf` تغییر دهید
4. ✅ SSL را برای امنیت بیشتر فعال کنید
5. ✅ از فایروال استفاده کنید: `sudo ufw allow 'Nginx Full'`

## ساختار نهایی:

```
/var/www/asansor/
├── config/
│   ├── settings.py
│   └── settings_production.py
├── website/
├── templates/
├── staticfiles/          # بعد از collectstatic
├── media/                 # برای فایل‌های آپلود شده
├── venv/
├── .env                  # فایل متغیرهای محیطی
├── manage.py
├── requirements.txt
├── gunicorn_config.py
└── ...
```

## پشتیبانی:

برای جزئیات بیشتر، فایل `DEPLOYMENT.md` را مطالعه کنید.
