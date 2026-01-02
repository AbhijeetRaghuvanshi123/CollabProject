import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// --- ROUTES IMPORT ---
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctor.js';
import patientRoutes from './routes/patient.js';
import appointmentRoutes from './routes/appointments.js';
import taskRoutes from './routes/tasks.js';
import inviteRoutes from './routes/invites.js';
import organizationRoutes from './routes/organization.js';
import notificationRoutes from './routes/notifications.js';
import specializationRoutes from './routes/specializations.js';
import paymentRoutes from './routes/payment.js';
import reportRoutes from "./routes/report.js";
import waterRoutes from "./routes/water.js";

// --- MIDDLEWARE / UTILS IMPORT ---
import errorHandler from './middleware/errorMiddleware.js';
import { initSocket } from './utils/socket.js';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
dotenv.config({ path: path.join(path.dirname(__dirname), '.env') });

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// --- MIDDLEWARE SETUP ---
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    credentials: true
}));

// Initialize Socket.io
initSocket(httpServer);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/medicare_plus")
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.log('❌ DB Connection Error:', err));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/water", waterRoutes);

app.get('/', (req, res) => {
    res.send('MediCare+ API is Running');
});

// --- SERVER START ---
app.use(errorHandler);

const server = httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// --- GLOBAL ERROR HANDLING ---
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
