import * as dotenv from 'dotenv';
dotenv.config();
export const envVariable = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_KEY,
  githubClientID: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET
}
