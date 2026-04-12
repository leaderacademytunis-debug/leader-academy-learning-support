"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentA = void 0;
const axios_1 = __importDefault(require("axios"));
class AgentA {
    constructor() {
        this.apiUrl = process.env.LLM_API_URL || 'https://api.openai.com/v1';
        this.apiKey = process.env.LLM_API_KEY || '';
        this.model = process.env.LLM_MODEL || 'gpt-4';
    }
    /**
     * توليد جذاذة درس كاملة
     */
    async generateLessonPlan(request) {
        const startTime = Date.now();
        const systemPrompt = this.buildSystemPrompt(request.language);
        const userPrompt = this.buildUserPrompt(request);
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/chat/completions`, {
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.3,
                max_tokens: 4000,
                response_format: { type: 'json_object' },
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            const content = response.data.choices[0].message.content;
            const parsedContent = JSON.parse(content);
            const duration = Date.now() - startTime;
            return {
                title: request.title,
                subject: request.subject,
                level: request.level,
                language: request.language,
                sections: parsedContent,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    model: this.model,
                    duration: Math.round(duration / 1000),
                },
            };
        }
        catch (error) {
            console.error('❌ Error generating lesson plan:', error);
            throw error;
        }
    }
    /**
     * توليد تقييم شامل
     */
    async generateAssessment(subject, level, type, language, numQuestions = 10) {
        const systemPrompt = this.buildAssessmentSystemPrompt(language);
        const userPrompt = this.buildAssessmentUserPrompt(subject, level, type, numQuestions, language);
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/chat/completions`, {
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.3,
                max_tokens: 3000,
                response_format: { type: 'json_object' },
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return JSON.parse(response.data.choices[0].message.content);
        }
        catch (error) {
            console.error('❌ Error generating assessment:', error);
            throw error;
        }
    }
    /**
     * بناء System Prompt للجذاذة
     */
    buildSystemPrompt(language) {
        const prompts = {
            ar: `أنت خبير تربوي متخصص في تصميم جذاذات درس احترافية وفقاً لمعايير وزارة التربية التونسية.
      
يجب أن تولد جذاذة درس شاملة تتضمن 5 أقسام رسمية:
1. lesson_planning - التخطيط البيداغوجي
2. teaching_the_four_skills - تدريس المهارات الأربع
3. integrating_life_skills - دمج مهارات الحياة
4. designing_pedagogic_scenarios - تصميم سيناريوهات بيداغوجية
5. formative_assessment - التقييم التكويني

كل قسم يجب أن يحتوي على تفاصيل دقيقة وعملية.
الرد يجب أن يكون بصيغة JSON فقط.`,
            en: `You are an expert educational consultant specializing in designing professional lesson plans according to Tunisian Ministry of Education standards.

You must generate a comprehensive lesson plan containing 5 official sections:
1. lesson_planning - Pedagogical Planning
2. teaching_the_four_skills - Teaching the Four Skills
3. integrating_life_skills - Integrating Life Skills
4. designing_pedagogic_scenarios - Designing Pedagogic Scenarios
5. formative_assessment - Formative Assessment

Each section must contain detailed and practical information.
The response must be in JSON format only.`,
            fr: `Vous êtes un expert en éducation spécialisé dans la conception de fiches pédagogiques professionnelles conformément aux normes du Ministère de l'Éducation tunisien.

Vous devez générer une fiche pédagogique complète contenant 5 sections officielles:
1. lesson_planning - Planification Pédagogique
2. teaching_the_four_skills - Enseignement des Quatre Compétences
3. integrating_life_skills - Intégration des Compétences de Vie
4. designing_pedagogic_scenarios - Conception de Scénarios Pédagogiques
5. formative_assessment - Évaluation Formative

Chaque section doit contenir des informations détaillées et pratiques.
La réponse doit être au format JSON uniquement.`,
        };
        return prompts[language] || prompts.ar;
    }
    /**
     * بناء User Prompt للجذاذة
     */
    buildUserPrompt(request) {
        return `
أنشئ جذاذة درس لـ:
- الموضوع: ${request.subject}
- المستوى: ${request.level}
- العنوان: ${request.title}
- المدة: ${request.duration} دقيقة
${request.objectives ? `- الأهداف: ${request.objectives.join(', ')}` : ''}
${request.context ? `- السياق: ${request.context}` : ''}

يجب أن تكون الجذاذة:
1. متوافقة مع معايير وزارة التربية التونسية
2. عملية وقابلة للتطبيق مباشرة
3. تتضمن أنشطة تفاعلية
4. تركز على المتعلم

الرد بصيغة JSON بالهيكل المطلوب.
    `;
    }
    /**
     * بناء System Prompt للتقييم
     */
    buildAssessmentSystemPrompt(language) {
        const prompts = {
            ar: `أنت خبير في تصميم التقييمات التعليمية. أنشئ تقييم احترافي يتضمن أسئلة متنوعة الأنواع.
كل سؤال يجب أن يكون واضحاً وقابلاً للقياس.
الرد بصيغة JSON فقط.`,
            en: `You are an expert in designing educational assessments. Create a professional assessment with diverse question types.
Each question must be clear and measurable.
Respond in JSON format only.`,
            fr: `Vous êtes un expert dans la conception d'évaluations éducatives. Créez une évaluation professionnelle avec des types de questions variés.
Chaque question doit être claire et mesurable.
Répondez au format JSON uniquement.`,
        };
        return prompts[language] || prompts.ar;
    }
    /**
     * بناء User Prompt للتقييم
     */
    buildAssessmentUserPrompt(subject, level, type, numQuestions, language) {
        return `
أنشئ ${type} يتضمن ${numQuestions} أسئلة لـ:
- الموضوع: ${subject}
- المستوى: ${level}
- النوع: ${type}

الأسئلة يجب أن تكون:
1. متنوعة الأنواع (اختيار من متعدد، إجابة قصيرة، مقالية)
2. واضحة وسهلة الفهم
3. قابلة للقياس
4. مناسبة للمستوى

الرد بصيغة JSON.
    `;
    }
}
exports.AgentA = AgentA;
exports.default = new AgentA();
//# sourceMappingURL=agentA.js.map