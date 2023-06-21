const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_secret = "SecretFriend";
const fetchuser = require('../middleware/fetchUser');


//this endpoint is for creating a user
router.post(
  "/createuser",
  [
    body("name", "Please enter a valid name").isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password should be atleast 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }


    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success,error:"user with that email already exists"});
      }

      //here we are doing the hashing of password
      //salt
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      //here we created a user
      user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
      });

      //here we creating the data inorder to generate a authToken
      const data = {
        id: {
          id: user.id,
        },
      };

 

      //here we are creating the authentication token
      const authToken = jwt.sign(data, JWT_secret);
      success=true;
      res.json({ success,authToken });
    } catch (err) {
      res.status(500).json(success,"Some error occured");
    }
  }
);


//this endpoint is for logging in
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    let success=false;

    try {
      // desturcturing of email and password from req.body

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({success,error:"Please enter the correct login credentials"});
      }

      //here we comparing passwords
      const cmpPassword = await bcrypt.compare(password, user.password);
      if (!cmpPassword) {
        return res.json({success,error:"wrong password"});
      }

      const data = {
        id: {
          id: user.id,
        },
      };
      const secret = "SecretFriend";

      const authToken = jwt.sign(data, secret);
      success=true;
      res.json({success,authToken });
    } catch (err) {
      res.status(500).json({success,error:"Internal Server Error"});
    }
  }
);


router.post('/getuser',fetchuser,async (req,res)=>{
  try{
    userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
  }
  catch(error){
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
