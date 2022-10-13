const User = require("../models/User");
const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require('./vetifyToken');
const CryptoJS = require("crypto-js");

const router = require('express').Router();

// Update
router.put("/:id", verifyToken, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:req.body
        }, {new: true})
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get  
router.get("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(err)
    }
})

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
});


//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });


// Delete 
router.delete("/:id", verifyTokenAuthorization, async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    } catch (error) {
        res.status(500).json(err)
    }
})

module.exports = router;