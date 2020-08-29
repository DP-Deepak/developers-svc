import { middleware } from './../../middleware/auth';
import * as express from 'express';
import { ProfileModel } from '../../models/ProfileModel';
import { check, validationResult } from 'express-validator'
import { UserModel } from '../../models/UserModel';
import * as request from 'request';
import { envVariable } from '../../config/configuration';


export const profileRouter = express.Router();

// @route      GET /api/profile/me
// @desc       Get current users profile
// @access     Private
profileRouter.get('/me', middleware, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

  } catch (e) {
    console.log('Error in profile:', e.message);
    res.status(500).send('Server Error')
  }
  res.send('Profile route')
})


// @route      POST /api/profile/
// @desc       Create current users profile
// @access     Private
profileRouter.post('/', [
  middleware,
  [check('status', 'Status is required')
    .not()
    .isEmpty(),
  check('skills', 'Skills are required')
    .not()
    .isEmpty()
  ]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build Profile object
    let profileFields = {
      user: req.user.id,
      social: {}
    }

    if (company) Object.assign(profileFields, { company });
    if (website) Object.assign(profileFields, { website });
    if (location) Object.assign(profileFields, { location });
    if (bio) Object.assign(profileFields, { bio });
    if (status) Object.assign(profileFields, { status });
    if (githubusername) Object.assign(profileFields, { githubusername });
    if (skills) {
      Object.assign(profileFields, { skills: skills.split(',').map(skill => skill.trim()) });
    }

    //Build social object
    // let profileFields.social=
    if (twitter) Object.assign(profileFields.social, { twitter });
    if (youtube) Object.assign(profileFields.social, { youtube });
    if (facebook) Object.assign(profileFields.social, { facebook });
    if (linkedin) Object.assign(profileFields.social, { linkedin });
    if (instagram) Object.assign(profileFields.social, { instagram });

    try {
      let profile = await ProfileModel.findOne({ user: req.user.id })

      if (profile) {
        //Update
        profile = await ProfileModel.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })

        return res.json(profile);
      }

      // Create
      profile = new ProfileModel(profileFields)
      await profile.save()
      return res.json(profile);
    } catch (e) {
      console.log('Error in profile:', e.message);
      res.status(500).send('Server Error')
    }
  }
)

// @route      GET /api/profile
// @desc       Get All user profile
// @access     public
profileRouter.get('/', async (req, res) => {
  try {
    const profiles = await ProfileModel.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (e) {
    console.log('Error in profile:', e.message);
    res.status(500).send('Server Error')
  }
})

// @route      GET /api/profile/user/:user_id
// @desc       Get profile by user_ ID
// @access     public
profileRouter.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(404).send({ msg: 'Profile not found' })
    }
    res.json(profile)
  } catch (e) {
    console.log('Error in profile:', e.message);
    if (e.kind == 'ObjectId') {
      return res.status(404).send({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route      Delete /api/profile
// @desc       Delete profile and post
// @access     public
profileRouter.delete('/', middleware, async (req, res) => {
  try {
    // @todo - remove users post
    // REmove profile
    await ProfileModel.findOneAndRemove({ user: req.user.id })
    await UserModel.findOneAndRemove({ _id: req.user.id })
    res.json({ msg: 'User removed' })
  } catch (e) {
    console.log('Error in profile:', e.message);
    res.status(500).send('Server Error')
  }
})

// @route      PUT /api/profile/experience
// @desc       Add experience in Profile
// @access     Private

profileRouter.put('/experience', [middleware, [
  check('title', 'Please enter title').notEmpty(),
  check('company', 'Enter company name').notEmpty(),
  check('from', 'From date is required').notEmpty(),
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const {
    title, company, location, from, to, current, description
  } = req.body

  const newExp = {
    title, company, location, from, to, current, description
  }
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id })

    profile.experience.unshift(newExp)
    await profile.save()
    res.json(profile)
  } catch (e) {
    console.log('Error in profile:', e.message);
    res.status(500).send('Server Error')
  }

})

// @route      DELETE /api/profile/experience/exp_id
// @desc       Delete experience in Profile
// @access     Private

profileRouter.delete('/experience/:exp_id', middleware,
  async (req, res) => {
    try {
      const profile = await ProfileModel.findOne({ user: req.user.id })
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
      if (removeIndex >= 0) {

        profile.experience.splice(removeIndex, 1);
        await profile.save()
        return res.json(profile)
      }
      res.status(404).send('Can not delete experience')
    } catch (e) {
      console.log('Error in profile:', e.message);
      res.status(500).send('Server Error')
    }
  })

// @route      PUT /api/profile/education
// @desc       Add education in Profile
// @access     Private

profileRouter.put('/education', [middleware, [
  check('school', 'Please enter school').notEmpty(),
  check('degree', 'Enter degree!').notEmpty(),
  check('fieldofstudy', 'fieldofstudy is required').notEmpty(),
  check('from', 'from is required').notEmpty(),
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const {
    school, degree, fieldofstudy, from, to, current, description
  } = req.body

  const newEdu = {
    school, degree, fieldofstudy, from, to, current, description
  }
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id })

    profile.education.unshift(newEdu)
    await profile.save()
    res.json(profile)
  } catch (e) {
    console.log('Error in profile:', e.message);
    res.status(500).send('Server Error')
  }

})


// @route      DELETE /api/profile/education/edu_id
// @desc       Delete education in Profile
// @access     Private
profileRouter.delete('/education/:edu_id', middleware,
  async (req, res) => {
    try {
      const profile = await ProfileModel.findOne({ user: req.user.id })
      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
      if (removeIndex >= 0) {
        profile.education.splice(removeIndex, 1)
        await profile.save()
        return res.json(profile)
      }
      res.status(404).send('Can not delete education')
    } catch (e) {
      console.log('Error in profile:', e.message);
      res.status(500).send('Server Error')
    }
  })

// @route      GET /api/profile/github/:username
// @desc       Get user repos from github
// @access     Public
profileRouter.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${envVariable.githubClientID}&client_secret=${envVariable.githubSecret}`,
      method: 'GET',
      headers: { 'user-agent': 'node-js' }
    }
    console.log('==uri===', options.uri);

    request(options, (error, response, body) => {
      if (error) console.error(error)
      if (response.statusCode !== 200) {
        return res.status(404).send('No Github profile found')
      }

      res.json(JSON.parse(body))
    })
  } catch (error) {
    console.log('Error in profile:', error.message);
    res.status(500).send('Server Error')
  }
})