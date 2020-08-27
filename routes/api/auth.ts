import * as express from 'express';
import { middleware } from '../../middleware/auth';
import { UserModel } from '../../models/UserModel';
export const authRouter = express.Router();

// @route      GET /api/auth
// @access     Public

authRouter.post('/', middleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    res.json(user)
  } catch (e) {
    console.log(e.message);
res.status(500).send('Server Error in middleware')

  }
})
