# راه حل مشکل Cache و استایل‌ها

## مشکل:
اگر تغییرات در مرورگر نمایش داده نمی‌شوند، احتمالاً مشکل از cache است.

## راه حل‌ها:

### 1. Hard Refresh در مرورگر:
- **Chrome/Edge**: `Ctrl + Shift + R` یا `Ctrl + F5`
- **Firefox**: `Ctrl + Shift + R` یا `Ctrl + F5`
- **Safari**: `Cmd + Shift + R`

### 2. پاک کردن Cache مرورگر:
1. باز کردن Developer Tools (F12)
2. راست کلیک روی دکمه Refresh
3. انتخاب "Empty Cache and Hard Reload"

### 3. بررسی در حالت Incognito/Private:
- باز کردن صفحه در حالت Incognito برای تست بدون cache

### 4. بررسی Console برای خطاها:
- باز کردن Developer Tools (F12)
- بررسی تب Console برای خطاهای JavaScript
- بررسی تب Network برای خطاهای لود شدن فایل‌ها

### 5. بررسی Static Files:
```bash
# بررسی اینکه فایل‌ها وجود دارند
python manage.py findstatic logo.jpg
python manage.py findstatic main.css
python manage.py findstatic page-styles.css

# جمع‌آوری مجدد static files
python manage.py collectstatic --noinput --clear
```

### 6. Restart سرور:
```bash
# توقف سرور (Ctrl+C)
# سپس راه‌اندازی مجدد
python manage.py runserver 8000
```

## بررسی URL‌های Static:
بعد از باز کردن صفحه، در Developer Tools > Network بررسی کنید:
- `/static/logo.jpg` باید 200 برگرداند
- `/static/main.css` باید 200 برگرداند
- `/static/page-styles.css` باید 200 برگرداند
- `/static/favicon.ico` باید 200 برگرداند

اگر 404 می‌بینید، مشکل از تنظیمات static files است.
