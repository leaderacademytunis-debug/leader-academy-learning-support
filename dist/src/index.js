"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const agentA_1 = __importDefault(require("./agents/agentA"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ==========================================
// Middleware
// ==========================================
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});
// ==========================================
// Routes
// ==========================================
// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'learning-support',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// Generate Lesson Plan
app.post('/api/learning-support/generate-lesson-plan', async (req, res) => {
    try {
        const { subject, level, title, duration, language = 'ar', objectives, context } = req.body;
        if (!subject || !level || !title || !duration) {
            return res.status(400).json({
                error: 'Missing required fields: subject, level, title, duration',
            });
        }
        console.log(`🎓 Generating lesson plan: ${title}`);
        const lessonPlan = await agentA_1.default.generateLessonPlan({
            subject,
            level,
            title,
            duration,
            language,
            objectives,
            context,
        });
        res.json({
            success: true,
            data: lessonPlan,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('❌ Error generating lesson plan:', error.message);
        res.status(500).json({
            error: 'Failed to generate lesson plan',
            message: error.message,
        });
    }
});
// Generate Assessment
app.post('/api/learning-support/generate-assessment', async (req, res) => {
    try {
        const { subject, level, type = 'quiz', language = 'ar', numQuestions = 10 } = req.body;
        if (!subject || !level) {
            return res.status(400).json({
                error: 'Missing required fields: subject, level',
            });
        }
        console.log(`📝 Generating assessment: ${type}`);
        const assessment = await agentA_1.default.generateAssessment(subject, level, type, language, numQuestions);
        res.json({
            success: true,
            data: assessment,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('❌ Error generating assessment:', error.message);
        res.status(500).json({
            error: 'Failed to generate assessment',
            message: error.message,
        });
    }
});
// Get Lesson Plans
app.get('/api/learning-support/lesson-plans', async (req, res) => {
    try {
        res.json({
            message: 'Learning Support Service - GET /api/learning-support/lesson-plans',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get Assessments
app.get('/api/learning-support/assessments', async (req, res) => {
    try {
        res.json({
            message: 'Learning Support Service - GET /api/learning-support/assessments',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// Error Handling
// ==========================================
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
        method: req.method,
    });
});
// ==========================================
// Server Start
// ==========================================
const PORT = parseInt(process.env.SERVICE_PORT || '3002', 10);
async function start() {
    try {
        // Initialize Database
        await (0, db_1.initializeDatabase)();
        // Start Server
        const server = app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   📚 Leader Academy Learning Support Service              ║
║                                                            ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║                                                            ║
║   Features:                                                ║
║   - Lesson Plan Generation (Agent A)                      ║
║   - Assessment Generation                                 ║
║   - Resource Management                                   ║
║   - Pedagogical Support Tools                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
        });
        // Graceful Shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
start();
exports.default = app;
//# sourceMappingURL=index.js.map