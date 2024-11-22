const router = require("express").Router();
const User = require("../model/Users");
const Post = require("../model/Post");
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", async (req, res) => {
  if (!req.body.userId) {
    return res.status(400).json("You must provide a user ID");
  }
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      //This will hash the user password before the update
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json("you can only update your account!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found!");
    }

    if (req.body.userId !== req.params.id) {
      return res.status(401).json("You can only delete your account!");
    }

    try {
      await Post.deleteMany({ username: user.username });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted!");
    } catch (err) {
      res.status(500).json("Error deleting user or posts!");
    }
  } catch (err) {
    res.status(500).json("Error finding user!");
  }
});

//GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).send({ error: "Server error", details: err.message });
  }
});
module.exports = router;
