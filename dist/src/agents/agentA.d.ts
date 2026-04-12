export interface LessonPlanRequest {
    subject: string;
    level: string;
    title: string;
    duration: number;
    language: 'ar' | 'en' | 'fr';
    objectives?: string[];
    context?: string;
}
export interface LessonPlanResponse {
    title: string;
    subject: string;
    level: string;
    language: string;
    sections: {
        lesson_planning: any;
        teaching_the_four_skills: any;
        integrating_life_skills: any;
        designing_pedagogic_scenarios: any;
        formative_assessment: any;
    };
    metadata: {
        generatedAt: string;
        model: string;
        duration: number;
    };
}
export declare class AgentA {
    private apiUrl;
    private apiKey;
    private model;
    constructor();
    /**
     * توليد جذاذة درس كاملة
     */
    generateLessonPlan(request: LessonPlanRequest): Promise<LessonPlanResponse>;
    /**
     * توليد تقييم شامل
     */
    generateAssessment(subject: string, level: string, type: 'quiz' | 'exam' | 'assignment', language: 'ar' | 'en' | 'fr', numQuestions?: number): Promise<any>;
    /**
     * بناء System Prompt للجذاذة
     */
    private buildSystemPrompt;
    /**
     * بناء User Prompt للجذاذة
     */
    private buildUserPrompt;
    /**
     * بناء System Prompt للتقييم
     */
    private buildAssessmentSystemPrompt;
    /**
     * بناء User Prompt للتقييم
     */
    private buildAssessmentUserPrompt;
}
declare const _default: AgentA;
export default _default;
//# sourceMappingURL=agentA.d.ts.map