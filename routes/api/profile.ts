import * as express from 'express';
export const profileRouter = express.Router();

// @route      GET /api/profile
// @access     Public

profileRouter.get('/', (req, res)=> res.send('Profile route'))
