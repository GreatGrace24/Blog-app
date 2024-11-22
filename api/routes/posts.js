const router = require("express").Router();
const User = require("../model/Users");
const Post = require("../model/Post");
//const authMiddleware = require("../middleware/authMiddleware");

//CREATE POST
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  try {
    // Create a new post with the authenticated user's ID as the author
    const newPost = new Post({
      title,
      desc,
      author: req.user.id,
    });

    // Save the post to the database
    const post = await newPost.save();

    // Send the created post in the response
    res.status(200).json(post);
  } catch (err) {
    // Send a detailed error message in case of server error
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if the authenticated user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// DELETE POST

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Post.deleteOne(req.params.id); // Use deleteOne() instead of remove()
    res.status(200).json({ msg: "Post has been deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post Not Found!");
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).send("Server Error!");
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
