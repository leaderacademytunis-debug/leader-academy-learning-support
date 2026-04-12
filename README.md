# 📚 Leader Academy Learning Support Service

Microservice مسؤول عن توليد الجذاذات والتقييمات والموارد التعليمية باستخدام الذكاء الاصطناعي.

## 📋 الميزات

✅ **توليد الجذاذات** - إنشاء جذاذات درس احترافية (Agent A)  
✅ **توليد التقييمات** - إنشاء اختبارات وتقييمات  
✅ **إدارة الموارد** - تنظيم الموارد التعليمية  
✅ **سجل التوليد** - تتبع عمليات التوليد  
✅ **المفضلة** - حفظ العناصر المفضلة  

## 🏗️ البنية المعمارية

```
Learning Support Service (Port 3002)
├── Lesson Plans (الجذاذات)
├── Assessments (التقييمات)
├── Resources (الموارد)
├── Generation History (سجل التوليد)
└── Favorites (المفضلة)
```

## 🤖 Agent A - Lesson Plan Generator

**الميزات:**
- توليد جذاذات درس كاملة
- توافق مع معايير وزارة التربية التونسية
- 5 أقسام رسمية في كل جذاذة
- دعم اللغات: العربية، الإنجليزية، الفرنسية

**الأقسام:**
1. `lesson_planning` - التخطيط البيداغوجي
2. `teaching_the_four_skills` - تدريس المهارات الأربع
3. `integrating_life_skills` - دمج مهارات الحياة
4. `designing_pedagogic_scenarios` - تصميم سيناريوهات بيداغوجية
5. `formative_assessment` - التقييم التكويني

## 🚀 البدء السريع

### التثبيت

```bash
npm install
```

### التطوير

```bash
npm run dev
```

### البناء

```bash
npm run build
```

### الإنتاج

```bash
npm start
```

## 🔧 الإعدادات

### ملف .env

```env
SERVICE_PORT=3002
SERVICE_NAME=learning-support
DATABASE_URL=mysql://user:password@localhost:3306/leader_academy_learning_support
LLM_API_URL=https://api.openai.com/v1
LLM_API_KEY=your-api-key-here
LLM_MODEL=gpt-4
NODE_ENV=development
```

## 📚 API Endpoints

### Generate Lesson Plan
```bash
POST /api/learning-support/generate-lesson-plan
Content-Type: application/json

{
  "subject": "الرياضيات",
  "level": "3ème année",
  "title": "الكسور العشرية",
  "duration": 45,
  "language": "ar",
  "objectives": ["فهم الكسور العشرية", "تطبيق العمليات"],
  "context": "الدرس الأول من الوحدة"
}
```

### Generate Assessment
```bash
POST /api/learning-support/generate-assessment
Content-Type: application/json

{
  "subject": "الرياضيات",
  "level": "3ème année",
  "type": "quiz",
  "language": "ar",
  "numQuestions": 10
}
```

### Get Lesson Plans
```bash
GET /api/learning-support/lesson-plans
```

### Get Assessments
```bash
GET /api/learning-support/assessments
```

## 💾 قاعدة البيانات

### الجداول الرئيسية

- **lesson_plans** - الجذاذات
- **assessments** - التقييمات
- **assessment_questions** - أسئلة التقييمات
- **assessment_answers** - إجابات الأسئلة
- **resources** - الموارد التعليمية
- **generation_history** - سجل التوليد
- **favorites** - المفضلة

## 🛠️ المتطلبات

- Node.js >= 16
- npm >= 8
- MySQL >= 5.7
- OpenAI API Key (أو أي LLM API)

## 📝 الترخيص

MIT

## 👨‍💼 المؤلف

Leader Academy Team

---

**Made with ❤️ for Education**
