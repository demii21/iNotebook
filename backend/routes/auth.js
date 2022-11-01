const express = require('express');
const User = require('../models/User'); 
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');
const  JWT_SECRET = 'secretpasswordPepega';

//Route 1 : Create a user using: POST "/api/auth/".No login Required
router.post('/createuser', [
    body('name','Enter a valid name').isLength({min :3 }),
    body('email','Enter a valid Email').isEmail(),
    body('password','Password must be atleast 7 characters.').isLength({min : 7})
    

],async (req,res) => { 
    let success = false;
    //If there are errors , Return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors : errors.array()});
    }
    //check whether the user with the same email exists already.
    try{
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({success,error : 'Email already registered'});
        }
        
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password,salt);
        user= await User.create({
            name : req.body.name,
            email: req.body.email,
            password : secPass
    
        });
        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        console.log(authToken);
        success=true; 
        res.json({success,authToken});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Some Error Occured");
    }
    
})

//Route 1 : Authenticate a user using: POST "/api/auth/login". No login Required

router.post('/login', [
    body('email','Enter a valid Email').isEmail(),
    body('password','Password cannot be empty').exists(),    

],async (req,res) => {
    let success = false;
    //If there are errors , Return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const { email,password } = req.body;
    try {
        let user = await User.findOne({email});
        if(!User){
            success = false;
            return res.status(400).json({success,error:"Please try to login with correct credentials."});            
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success,error:"Please try to login with correct credentials."});            
        }
        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken});
        
    }  catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});
//Route 3 : Get logged in User Detail  using: POST "/api/auth/getuser". Login Required.

router.post('/getuser',fetchUser,async (req,res) => { 
try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
}  catch(err){
    console.error(err.message);
    res.status(500).send("Internal Server Error");
}
});

module.exports = router