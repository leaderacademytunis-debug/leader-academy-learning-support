import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db';
import agentA from './agents/agentA';

dotenv.config();

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  
  next();
});

// ==========================================
// Routes
// ==========================================

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'learning-support',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Generate Lesson Plan
app.post('/api/learning-support/generate-lesson-plan', async (req: Request, res: Response) => {
  try {
    const { subject, level, title, duration, language = 'ar', objectives, context } = req.body;

    if (!subject || !level || !title || !duration) {
      return res.status(400).json({
        error: 'Missing required fields: subject, level, title, duration',
      });
    }

    console.log(`🎓 Generating lesson plan: ${title}`);
    
    const lessonPlan = await agentA.generateLessonPlan({
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
  } catch (error: any) {
    console.error('❌ Error generating lesson plan:', error.message);
    res.status(500).json({
      error: 'Failed to generate lesson plan',
      message: error.message,
    });
  }
});

// Generate Assessment
app.post('/api/learning-support/generate-assessment', async (req: Request, res: Response) => {
  try {
    const { subject, level, type = 'quiz', language = 'ar', numQuestions = 10 } = req.body;

    if (!subject || !level) {
      return res.status(400).json({
        error: 'Missing required fields: subject, level',
      });
    }

    console.log(`📝 Generating assessment: ${type}`);
    
    const assessment = await agentA.generateAssessment(
      subject,
      level,
      type,
      language,
      numQuestions
    );

    res.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Error generating assessment:', error.message);
    res.status(500).json({
      error: 'Failed to generate assessment',
      message: error.message,
    });
  }
});

// Get Lesson Plans
app.get('/api/learning-support/lesson-plans', async (req: Request, res: Response) => {
  try {
    res.json({
      message: 'Learning Support Service - GET /api/learning-support/lesson-plans',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Assessments
app.get('/api/learning-support/assessments', async (req: Request, res: Response) => {
  try {
    res.json({
      message: 'Learning Support Service - GET /api/learning-support/assessments',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Error Handling
// ==========================================

app.use((req: Request, res: Response) => {
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
    await initializeDatabase();

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
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
