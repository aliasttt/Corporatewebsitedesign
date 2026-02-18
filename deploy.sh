#!/bin/bash
# اسکریپت deployment برای VPS
# استفاده: bash deploy.sh

set -e  # در صورت خطا متوقف شود

echo "🚀 شروع فرآیند Deployment..."

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# بررسی دسترسی root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}لطفاً با دسترسی sudo اجرا کنید${NC}"
    exit 1
fi

# متغیرها
PROJECT_DIR="/var/www/asansor"
PROJECT_USER="www-data"
DB_NAME="asansor_db"
DB_USER="asansor_user"

echo -e "${YELLOW}📦 نصب وابستگی‌های سیستم...${NC}"
apt update && apt upgrade -y
apt install -y python3 python3-pip python3-venv python3-dev \
    postgresql postgresql-contrib nginx git build-essential libpq-dev

echo -e "${YELLOW}🗄️ تنظیم PostgreSQL...${NC}"
# ایجاد دیتابیس و کاربر
sudo -u postgres psql <<EOF
CREATE DATABASE ${DB_NAME};
CREATE USER ${DB_USER} WITH PASSWORD 'CHANGE_THIS_PASSWORD';
ALTER ROLE ${DB_USER} SET client_encoding TO 'utf8';
ALTER ROLE ${DB_USER} SET default_transaction_isolation TO 'read committed';
ALTER ROLE ${DB_USER} SET timezone TO 'Asia/Tehran';
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
\q
EOF

echo -e "${YELLOW}📁 ایجاد ساختار دایرکتوری...${NC}"
mkdir -p ${PROJECT_DIR}
mkdir -p /var/log/gunicorn
mkdir -p /var/log/django
mkdir -p /var/run/gunicorn
chown -R ${PROJECT_USER}:${PROJECT_USER} /var/log/gunicorn /var/log/django /var/run/gunicorn

echo -e "${GREEN}✅ مراحل اولیه کامل شد!${NC}"
echo -e "${YELLOW}⚠️ لطفاً:${NC}"
echo "1. پروژه را به ${PROJECT_DIR} آپلود کنید"
echo "2. فایل .env را ایجاد و تنظیم کنید"
echo "3. فایل nginx_asansor.conf را ویرایش کنید (دامنه)"
echo "4. فایل asansor.service را بررسی کنید"
echo "5. سپس دستورات زیر را اجرا کنید:"
echo ""
echo "cd ${PROJECT_DIR}"
echo "python3 -m venv venv"
echo "source venv/bin/activate"
echo "pip install -r requirements.txt"
echo "export DJANGO_SETTINGS_MODULE=config.settings_production"
echo "python manage.py migrate"
echo "python manage.py collectstatic --noinput"
echo "sudo systemctl start asansor"
echo "sudo systemctl enable asansor"
