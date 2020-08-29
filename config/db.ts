import { envVariable } from './configuration';
import * as mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(envVariable.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    console.log('MongoDB connected');
  } catch (err) {
    console.log('Error:', err);
  }
}