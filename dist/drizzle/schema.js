"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesRelations = exports.resourcesRelations = exports.assessmentAnswersRelations = exports.assessmentQuestionsRelations = exports.assessmentsRelations = exports.lessonPlansRelations = exports.favorites = exports.generationHistory = exports.resources = exports.assessmentAnswers = exports.assessmentQuestions = exports.assessments = exports.lessonPlans = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
// ==========================================
// Lesson Plans (الجذاذات)
// ==========================================
exports.lessonPlans = (0, mysql_core_1.mysqlTable)('lesson_plans', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 36 }).notNull(),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    subject: (0, mysql_core_1.varchar)('subject', { length: 100 }),
    level: (0, mysql_core_1.varchar)('level', { length: 50 }), // مثل: 1ère année، 2ème année
    duration: (0, mysql_core_1.int)('duration'), // بالدقائق
    language: (0, mysql_core_1.mysqlEnum)('language', ['ar', 'en', 'fr']).default('ar'),
    // محتوى الجذاذة (JSON)
    content: (0, mysql_core_1.json)('content'), // يحتوي على الأقسام الخمسة
    // الحالة
    status: (0, mysql_core_1.mysqlEnum)('status', ['draft', 'published', 'archived']).default('draft'),
    // البيانات الوصفية
    metadata: (0, mysql_core_1.json)('metadata'), // معايير، أهداف، إلخ
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    userIdIdx: (0, mysql_core_1.index)('idx_lesson_plan_user_id').on(table.userId),
    subjectIdx: (0, mysql_core_1.index)('idx_lesson_plan_subject').on(table.subject),
    levelIdx: (0, mysql_core_1.index)('idx_lesson_plan_level').on(table.level),
}));
// ==========================================
// Assessments (التقييمات)
// ==========================================
exports.assessments = (0, mysql_core_1.mysqlTable)('assessments', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 36 }).notNull(),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    subject: (0, mysql_core_1.varchar)('subject', { length: 100 }),
    level: (0, mysql_core_1.varchar)('level', { length: 50 }),
    type: (0, mysql_core_1.mysqlEnum)('type', ['quiz', 'exam', 'assignment']).default('quiz'),
    language: (0, mysql_core_1.mysqlEnum)('language', ['ar', 'en', 'fr']).default('ar'),
    // محتوى التقييم
    content: (0, mysql_core_1.json)('content'), // الأسئلة والإجابات
    // الحالة
    status: (0, mysql_core_1.mysqlEnum)('status', ['draft', 'published', 'archived']).default('draft'),
    // البيانات الوصفية
    metadata: (0, mysql_core_1.json)('metadata'), // معايير، نقاط، إلخ
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    userIdIdx: (0, mysql_core_1.index)('idx_assessment_user_id').on(table.userId),
    subjectIdx: (0, mysql_core_1.index)('idx_assessment_subject').on(table.subject),
    typeIdx: (0, mysql_core_1.index)('idx_assessment_type').on(table.type),
}));
// ==========================================
// Assessment Questions
// ==========================================
exports.assessmentQuestions = (0, mysql_core_1.mysqlTable)('assessment_questions', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    assessmentId: (0, mysql_core_1.varchar)('assessment_id', { length: 36 }).notNull(),
    question: (0, mysql_core_1.text)('question').notNull(),
    type: (0, mysql_core_1.mysqlEnum)('type', ['multiple_choice', 'short_answer', 'essay']),
    points: (0, mysql_core_1.int)('points').default(1),
    order: (0, mysql_core_1.int)('order'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    assessmentIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.assessmentId],
        foreignColumns: [exports.assessments.id],
    }),
    assessmentIdIdx: (0, mysql_core_1.index)('idx_question_assessment_id').on(table.assessmentId),
}));
// ==========================================
// Assessment Answers
// ==========================================
exports.assessmentAnswers = (0, mysql_core_1.mysqlTable)('assessment_answers', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    questionId: (0, mysql_core_1.varchar)('question_id', { length: 36 }).notNull(),
    answer: (0, mysql_core_1.text)('answer').notNull(),
    isCorrect: (0, mysql_core_1.boolean)('is_correct').default(false),
    order: (0, mysql_core_1.int)('order'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    questionIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.questionId],
        foreignColumns: [exports.assessmentQuestions.id],
    }),
    questionIdIdx: (0, mysql_core_1.index)('idx_answer_question_id').on(table.questionId),
}));
// ==========================================
// Resources (الموارد التعليمية)
// ==========================================
exports.resources = (0, mysql_core_1.mysqlTable)('resources', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 36 }).notNull(),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    type: (0, mysql_core_1.mysqlEnum)('type', ['document', 'video', 'image', 'link', 'other']),
    subject: (0, mysql_core_1.varchar)('subject', { length: 100 }),
    level: (0, mysql_core_1.varchar)('level', { length: 50 }),
    url: (0, mysql_core_1.text)('url'),
    language: (0, mysql_core_1.mysqlEnum)('language', ['ar', 'en', 'fr']).default('ar'),
    // الحالة
    isPublic: (0, mysql_core_1.boolean)('is_public').default(false),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    userIdIdx: (0, mysql_core_1.index)('idx_resource_user_id').on(table.userId),
    typeIdx: (0, mysql_core_1.index)('idx_resource_type').on(table.type),
    subjectIdx: (0, mysql_core_1.index)('idx_resource_subject').on(table.subject),
}));
// ==========================================
// Generation History (سجل التوليد)
// ==========================================
exports.generationHistory = (0, mysql_core_1.mysqlTable)('generation_history', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 36 }).notNull(),
    type: (0, mysql_core_1.mysqlEnum)('type', ['lesson_plan', 'assessment', 'resource']),
    prompt: (0, mysql_core_1.text)('prompt').notNull(),
    result: (0, mysql_core_1.json)('result'), // النتيجة المولدة
    language: (0, mysql_core_1.mysqlEnum)('language', ['ar', 'en', 'fr']).default('ar'),
    // الأداء
    generationTime: (0, mysql_core_1.int)('generation_time'), // بالثواني
    tokenUsage: (0, mysql_core_1.int)('token_usage'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    userIdIdx: (0, mysql_core_1.index)('idx_history_user_id').on(table.userId),
    typeIdx: (0, mysql_core_1.index)('idx_history_type').on(table.type),
}));
// ==========================================
// Favorites (المفضلة)
// ==========================================
exports.favorites = (0, mysql_core_1.mysqlTable)('favorites', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 36 }).notNull(),
    itemId: (0, mysql_core_1.varchar)('item_id', { length: 36 }).notNull(),
    itemType: (0, mysql_core_1.mysqlEnum)('item_type', ['lesson_plan', 'assessment', 'resource']),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    userIdIdx: (0, mysql_core_1.index)('idx_favorite_user_id').on(table.userId),
    itemIdIdx: (0, mysql_core_1.index)('idx_favorite_item_id').on(table.itemId),
}));
// ==========================================
// Relations
// ==========================================
exports.lessonPlansRelations = (0, drizzle_orm_1.relations)(exports.lessonPlans, ({ many }) => ({
    favorites: many(exports.favorites),
}));
exports.assessmentsRelations = (0, drizzle_orm_1.relations)(exports.assessments, ({ one, many }) => ({
    questions: many(exports.assessmentQuestions),
    favorites: many(exports.favorites),
}));
exports.assessmentQuestionsRelations = (0, drizzle_orm_1.relations)(exports.assessmentQuestions, ({ one, many }) => ({
    assessment: one(exports.assessments, {
        fields: [exports.assessmentQuestions.assessmentId],
        references: [exports.assessments.id],
    }),
    answers: many(exports.assessmentAnswers),
}));
exports.assessmentAnswersRelations = (0, drizzle_orm_1.relations)(exports.assessmentAnswers, ({ one }) => ({
    question: one(exports.assessmentQuestions, {
        fields: [exports.assessmentAnswers.questionId],
        references: [exports.assessmentQuestions.id],
    }),
}));
exports.resourcesRelations = (0, drizzle_orm_1.relations)(exports.resources, ({ many }) => ({
    favorites: many(exports.favorites),
}));
exports.favoritesRelations = (0, drizzle_orm_1.relations)(exports.favorites, ({ one }) => ({
    lessonPlan: one(exports.lessonPlans, {
        fields: [exports.favorites.itemId],
        references: [exports.lessonPlans.id],
    }),
    assessment: one(exports.assessments, {
        fields: [exports.favorites.itemId],
        references: [exports.assessments.id],
    }),
    resource: one(exports.resources, {
        fields: [exports.favorites.itemId],
        references: [exports.resources.id],
    }),
}));
//# sourceMappingURL=schema.js.map