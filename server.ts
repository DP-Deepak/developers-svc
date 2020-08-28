import { usersRouter } from './routes/api/users';
import * as express from 'express';
import { connectDB } from './config/db';
import { envVariable } from './config/configuration';
import { authRouter } from './routes/api/auth';
import { postsRouter } from './routes/api/posts';
import { profileRouter } from './routes/api/profile';


const app = express()
// Connect DataBase
connectDB();
const PORT = envVariable.port

app.use(express.json());
app.get('/', (req, res) => res.send('API running'))

// Define Routes
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)
app.use('/api/profile', profileRouter)

app.listen(PORT, () => console.log('Server started on PORT:', PORT))


