import * as express from 'express';
export const postsRouter = express.Router();

// @route      GET /api/post
// @access     Public

postsRouter.get('/', (req, res) => res.send('Post route'))
