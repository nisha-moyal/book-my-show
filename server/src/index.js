import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

import { loggerMiddleware } from './middleware/loggerMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

import aboutRoutes from './routes/aboutRoutes.js';
import userRoutes from './routes/userRoutes.js';
import moviesRoutes from './routes/moviesRoute.js';
import theaterRoutes from './routes/theaterRoutes.js';
import showRoutes from './routes/showRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();
console.log("MongoDB URI from env: ",process.env.MONGO_URI);
const port = 5001;

const app = express();

app.use(cors({
  origin: 'http://localhost:4200'}));

app.use(express.json());
app.use(loggerMiddleware)
app.use('/api/about', aboutRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/theatres', theaterRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/payments', paymentRoutes);



app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/error-test', (req, res, next) => {
  const error = new Error('This is a test error!');
  error.statusCode = 400; // Bad request
  next(error); // Pass error to middleware
});


app.use(errorMiddleware)

connectDB();

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
