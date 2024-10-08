const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const Post = require('./models/Post');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({dest:'uploads/'});
const fs = require("fs");


const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.REACT_APP_CONNECTION_SECRET;

const salt = bcrypt.genSaltSync(10);
app.use(cors({credentials:true, origin:'http://localhost:3000'}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'));



mongoose.connect( process.env.REACT_APP_MONGOS_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      const newUser = await User.create({ 
        username, 
        password:bcrypt.hashSync(password, salt)});

      res.json(newUser);
    } catch (error) {
      // Handle error
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    try {
      const userDoc = await User.findOne({username});
      if (!userDoc) {
        return res.status(404).json({ message: "User not found" });
      }

      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk){
        // log
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token).json({
            id:userDoc._id,
            username,
          }) 
        });
      }
      else{
        res.status(400).json("wrong credentials");
      }
    }
    catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      // Handle token verification error
      return res.status(401).json({ error: 'Token verification failed' });
    }
    res.json(info);
  });
});


app.post('/logout',(req,res)=>{
  res.cookie('token',"").json("ok");
})
  
app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length-1];
  const newPath = path+"."+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
  });
  res.json("ok");
  });

});

app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file){
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    newPath = path+"."+ext;
    fs.renameSync(path, newPath);
  }

  
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor){
      return res.status(400).json('you are not the author');
    }

    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    /*const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,*/
  });
  res.json("ok");
});


app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
    .populate('author',['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
});


app.get('/post/:id', async (req,res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

const port = process.env.REACT_APP_PORT;
app.listen(port, () => console.log(`Server running on port ${port}`))


 
