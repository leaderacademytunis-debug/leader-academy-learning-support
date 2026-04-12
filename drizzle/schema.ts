import {
  mysqlTable,
  varchar,
  text,
  int,
  timestamp,
  boolean,
  json,
  primaryKey,
  foreignKey,
  index,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ==========================================
// Lesson Plans (الجذاذات)
// ==========================================
export const lessonPlans = mysqlTable(
  'lesson_plans',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 100 }),
    level: varchar('level', { length: 50 }), // مثل: 1ère année، 2ème année
    duration: int('duration'), // بالدقائق
    language: mysqlEnum('language', ['ar', 'en', 'fr']).default('ar'),
    
    // محتوى الجذاذة (JSON)
    content: json('content'), // يحتوي على الأقسام الخمسة
    
    // الحالة
    status: mysqlEnum('status', ['draft', 'published', 'archived']).default('draft'),
    
    // البيانات الوصفية
    metadata: json('metadata'), // معايير، أهداف، إلخ
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index('idx_lesson_plan_user_id').on(table.userId),
    subjectIdx: index('idx_lesson_plan_subject').on(table.subject),
    levelIdx: index('idx_lesson_plan_level').on(table.level),
  })
);

// ==========================================
// Assessments (التقييمات)
// ==========================================
export const assessments = mysqlTable(
  'assessments',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 100 }),
    level: varchar('level', { length: 50 }),
    type: mysqlEnum('type', ['quiz', 'exam', 'assignment']).default('quiz'),
    language: mysqlEnum('language', ['ar', 'en', 'fr']).default('ar'),
    
    // محتوى التقييم
    content: json('content'), // الأسئلة والإجابات
    
    // الحالة
    status: mysqlEnum('status', ['draft', 'published', 'archived']).default('draft'),
    
    // البيانات الوصفية
    metadata: json('metadata'), // معايير، نقاط، إلخ
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index('idx_assessment_user_id').on(table.userId),
    subjectIdx: index('idx_assessment_subject').on(table.subject),
    typeIdx: index('idx_assessment_type').on(table.type),
  })
);

// ==========================================
// Assessment Questions
// ==========================================
export const assessmentQuestions = mysqlTable(
  'assessment_questions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull(),
    question: text('question').notNull(),
    type: mysqlEnum('type', ['multiple_choice', 'short_answer', 'essay']),
    points: int('points').default(1),
    order: int('order'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [assessments.id],
    }),
    assessmentIdIdx: index('idx_question_assessment_id').on(table.assessmentId),
  })
);

// ==========================================
// Assessment Answers
// ==========================================
export const assessmentAnswers = mysqlTable(
  'assessment_answers',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    questionId: varchar('question_id', { length: 36 }).notNull(),
    answer: text('answer').notNull(),
    isCorrect: boolean('is_correct').default(false),
    order: int('order'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    questionIdFk: foreignKey({
      columns: [table.questionId],
      foreignColumns: [assessmentQuestions.id],
    }),
    questionIdIdx: index('idx_answer_question_id').on(table.questionId),
  })
);

// ==========================================
// Resources (الموارد التعليمية)
// ==========================================
export const resources = mysqlTable(
  'resources',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    type: mysqlEnum('type', ['document', 'video', 'image', 'link', 'other']),
    subject: varchar('subject', { length: 100 }),
    level: varchar('level', { length: 50 }),
    url: text('url'),
    language: mysqlEnum('language', ['ar', 'en', 'fr']).default('ar'),
    
    // الحالة
    isPublic: boolean('is_public').default(false),
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index('idx_resource_user_id').on(table.userId),
    typeIdx: index('idx_resource_type').on(table.type),
    subjectIdx: index('idx_resource_subject').on(table.subject),
  })
);

// ==========================================
// Generation History (سجل التوليد)
// ==========================================
export const generationHistory = mysqlTable(
  'generation_history',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    type: mysqlEnum('type', ['lesson_plan', 'assessment', 'resource']),
    prompt: text('prompt').notNull(),
    result: json('result'), // النتيجة المولدة
    language: mysqlEnum('language', ['ar', 'en', 'fr']).default('ar'),
    
    // الأداء
    generationTime: int('generation_time'), // بالثواني
    tokenUsage: int('token_usage'),
    
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_history_user_id').on(table.userId),
    typeIdx: index('idx_history_type').on(table.type),
  })
);

// ==========================================
// Favorites (المفضلة)
// ==========================================
export const favorites = mysqlTable(
  'favorites',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    itemId: varchar('item_id', { length: 36 }).notNull(),
    itemType: mysqlEnum('item_type', ['lesson_plan', 'assessment', 'resource']),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_favorite_user_id').on(table.userId),
    itemIdIdx: index('idx_favorite_item_id').on(table.itemId),
  })
);

// ==========================================
// Relations
// ==========================================
export const lessonPlansRelations = relations(lessonPlans, ({ many }) => ({
  favorites: many(favorites),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  questions: many(assessmentQuestions),
  favorites: many(favorites),
}));

export const assessmentQuestionsRelations = relations(assessmentQuestions, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [assessmentQuestions.assessmentId],
    references: [assessments.id],
  }),
  answers: many(assessmentAnswers),
}));

export const assessmentAnswersRelations = relations(assessmentAnswers, ({ one }) => ({
  question: one(assessmentQuestions, {
    fields: [assessmentAnswers.questionId],
    references: [assessmentQuestions.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ many }) => ({
  favorites: many(favorites),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  lessonPlan: one(lessonPlans, {
    fields: [favorites.itemId],
    references: [lessonPlans.id],
  }),
  assessment: one(assessments, {
    fields: [favorites.itemId],
    references: [assessments.id],
  }),
  resource: one(resources, {
    fields: [favorites.itemId],
    references: [resources.id],
  }),
}));
