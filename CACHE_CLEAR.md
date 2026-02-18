# راهنمای رفع مشکل Cache و مشاهده تغییرات

## مشکل: تغییرات نمایش داده نمی‌شوند

اگر کاروسل یا بخش‌های جدید را نمی‌بینید، احتمالاً مشکل از cache مرورگر است.

## راه حل‌های سریع:

### 1. Hard Refresh (بهترین روش):
- **Windows/Linux**: `Ctrl + Shift + R` یا `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### 2. پاک کردن Cache از Developer Tools:
1. باز کردن Developer Tools: `F12`
2. راست کلیک روی دکمه Refresh (در کنار آدرس)
3. انتخاب "Empty Cache and Hard Reload"

### 3. پاک کردن Cache کامل:
1. `Ctrl + Shift + Delete` (Windows) یا `Cmd + Shift + Delete` (Mac)
2. انتخاب "Cached images and files"
3. انتخاب "All time"
4. کلیک روی "Clear data"

### 4. باز کردن در حالت Incognito:
- `Ctrl + Shift + N` (Chrome) یا `Ctrl + Shift + P` (Firefox)
- این حالت cache ندارد

## بررسی تغییرات:

### کاروسل Hero:
- باید 4 اسلاید با تصاویر مختلف نمایش داده شود
- هر 2 ثانیه به صورت خودکار تغییر کند
- دکمه‌های قبلی/بعدی در دو طرف کاروسل
- نشانگرها (dots) در پایین کاروسل

### بخش Testimonials (یوروم):
- باید در صفحه اصلی، قبل از بخش "Bize Ulaşın" نمایش داده شود
- 6 کارت با نام و تاریخ متفاوت
- انیمیشن scroll خودکار از راست به چپ
- انیمیشن float (تکون) برای هر کارت

## اگر هنوز مشکل دارید:

1. بررسی Console برای خطاها:
   - `F12` > تب Console
   - بررسی خطاهای قرمز

2. بررسی Network:
   - `F12` > تب Network
   - Refresh صفحه
   - بررسی اینکه فایل‌های CSS و JS با کد 200 لود می‌شوند

3. Restart سرور Django:
   ```bash
   # توقف سرور (Ctrl+C)
   python manage.py runserver 8000
   ```

4. بررسی فایل‌های Static:
   ```bash
   python manage.py collectstatic --noinput --clear
   ```

## ویژگی‌های اضافه شده:

✅ کاروسل Hero با 4 اسلاید
✅ انتقال خودکار هر 2 ثانیه
✅ انیمیشن‌های fade و zoom
✅ بخش Testimonials با 6 نظر
✅ انیمیشن scroll خودکار
✅ انیمیشن float برای کارت‌ها
✅ تاریخ‌های متفاوت برای هر نظر
✅ نام و فامیل کامل برای هر نظر
