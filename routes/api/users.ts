import * as express from 'express';
import { check, validationResult } from 'express-validator'
import { UserModel } from '../../models/UserModel';
import * as gravatar from 'gravatar';
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { envVariable } from '../../config/configuration';


export const usersRouter = express.Router();
// @route      POST /api/users
// @access     Public

usersRouter.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Valid Email is required').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;
    try {
      // Check if user exist
      let user = await UserModel.findOne({ email })
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }

      // Get user's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })
      user = new UserModel({
        name,
        email,
        avatar,
        password,
      })

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt)
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      }
      jwt.sign(payload,
        envVariable.jwtSecret,
        // { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token })
        }
      )

    } catch (e) {
      console.log('Error in users route:', e.message);
      res.status(500).send('Server Error')
    }
  })
