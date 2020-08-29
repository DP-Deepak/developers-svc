import { UserModel } from './../../models/UserModel';
import { middleware } from './../../middleware/auth';
import * as express from 'express';
import { PostModel } from '../../models/PostModel';
import { check, validationResult } from 'express-validator'
import { checkObjectId } from '../../middleware/checkObjectId';



export const postsRouter = express.Router();

// @route      POST /api/posts
// @desc       Create posts of user
// @access     Private

postsRouter.post('/', [middleware, [
  check('text', 'Text is required').notEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const user = await UserModel.findById(req.user.id).select('-password')
    const newPost = new PostModel({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });
    const post = await newPost.save()
    res.json(post);
  } catch (e) {
    console.log('Error in posts:', e.message);
    res.status(500).send('Server Error')
  }
})


// @route      GET /api/posts
// @desc       Get all posts
// @access     Private
postsRouter.get('/', middleware, async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ date: -1 })
    res.json(posts)
  } catch (error) {
    console.log('Error in posts:', error.message);
    res.status(500).send('Server Error')
  }
})


// @route      GET /api/posts/:post_id
// @desc       Get posts by user ID
// @access     Private
postsRouter.get('/:post_id', middleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (error) {
    console.log('Error in posts:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route      Delete /api/posts/:id
// @desc       Delete posts of user
// @access     Private
postsRouter.delete('/:id', middleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    console.log('==posts==', post);
    console.log('==post.user.toString()==', post.user.toString());
    console.log('==req.params.id==', req.params.id);

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }
    await post.remove()
    res.json('Post removed')

  } catch (error) {
    console.log('Error in posts:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})


// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
postsRouter.put('/like/:id', [middleware, checkObjectId('id')], async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
postsRouter.put('/unlike/:id', [middleware, checkObjectId('id')], async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    // Check if the post has already been liked
    if (!post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not been liked' });
    }

    // get remove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
    if (removeIndex >= 0) {
      post.likes.splice(removeIndex, 1);
      await post.save();
    }
    return res.json(post.likes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
postsRouter.post(
  '/comment/:id',
  [
    middleware,
    checkObjectId('id'),
    [check('text', 'Text is required').not().isEmpty()]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await UserModel.findById(req.user.id).select('-password');
      const post = await PostModel.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    DELETE api/posts/comment/:id
// @desc     Delete comment on a post
// @access   Private
postsRouter.delete(
  '/comment/:id/:comment_id',
  [
    middleware,
    checkObjectId('id')
  ],
  async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.id);

      // Pull out comment
      const comment = post.comments.find(
        comment => comment.id === req.params.comment_id
      );
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      post.comments = post.comments.filter(
        ({ id }) => id !== req.params.comment_id
      );

      await post.save();

      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  });
