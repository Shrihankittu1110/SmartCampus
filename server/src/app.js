import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Middlewares
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorResponse } from './utils/apiResponse.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & Utility Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, origin);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static files directory for uploads
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadDir));

// Apply general rate limit to all /api requests
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CampusFlow Backend API',
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Catch 404 for undefined routes
app.use('*', (req, res) => {
  errorResponse(res, 404, `Route ${req.originalUrl} not found`);
});

// Centralized error handler
app.use(errorHandler);

export default app;
