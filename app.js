// import moudels
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// connect database
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected!");
});
db.on("error", function(err) {
  console.log("DB ERROR:", err);
});


// model setting
var postSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: Date
});
var Post = mongoose.model('post', postSchema);

// view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// set routes
app.get('/posts', function(req, res) {
  Post.find({}).sort('-createdAt').exec(function(err, posts) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/index", {data: posts});
  });
}); // index

app.get('/posts/new', function(req, res) {
  res.render("posts/new");
}); // new

app.post('/posts', function(req, res) {
  Post.create(req.body.post, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
  });
}); // create

app.get('/posts/:id', function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/show", {data: post});
  });
}); // show

app.put('/posts/:id', function(req, res) {
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" updated"});
  });
}); // update

app.delete('/posts/:id', function(req, res) {
  Post.findByIdAndRemove(req.params._id, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" deleted"});
  });
}); // destroy

// start server
app.listen(3000, function() {
  console.log('Server On!');
});
