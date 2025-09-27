# دليل النشر على Vercel

## المشكلة الأساسية
عند النشر على Vercel، نظام الملفات يصبح read-only ولا يمكن الكتابة في ملفات JSON المحلية.

## الحل المطبق
تم إنشاء نظام قاعدة بيانات بديل يستخدم:
- **في المتصفح**: localStorage لحفظ البيانات
- **في الخادم**: ذاكرة مؤقتة للجلسة الواحدة

## خطوات النشر

### 1. تحديث متغيرات البيئة
في لوحة تحكم Vercel، أضف:
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
JWT_SECRET=your-super-secret-jwt-key-here
```

### 2. رفع التحديثات
```bash
git add .
git commit -m "Fix database for Vercel deployment"
git push
```

### 3. إعادة النشر
سيتم النشر تلقائياً عند push إلى GitHub.

## ملاحظات مهمة

### ⚠️ قيود النظام الحالي:
1. **البيانات مؤقتة**: تختفي عند إعادة تشغيل الخادم
2. **لا مشاركة بين المستخدمين**: كل مستخدم يرى بياناته فقط
3. **لا نسخ احتياطي حقيقي**: النسخ الاحتياطي للتحميل فقط

### 🔧 الحلول المستقبلية:
1. **قاعدة بيانات خارجية**: MongoDB, PostgreSQL, Supabase
2. **تخزين سحابي**: AWS S3, Cloudinary
3. **نظام CMS**: Strapi, Sanity

## اختبار النظام

### في المحلي:
```bash
npm run dev
```

### في الإنتاج:
1. اذهب إلى `/admin/login`
2. استخدم: `fawy_admin_2024` / `FawyMaly@2024!`
3. جرب إضافة/تعديل/حذف الألعاب

## حل دائم موصى به

للحصول على نظام مستقر، استخدم قاعدة بيانات خارجية:

```bash
# مثال مع Supabase
npm install @supabase/supabase-js
```

أو

```bash
# مثال مع MongoDB
npm install mongodb
```

## الدعم
إذا واجهت مشاكل، تحقق من:
1. Console في المتصفح
2. Vercel Function Logs
3. Network tab في Developer Tools