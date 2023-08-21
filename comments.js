// create web server
var express = require('express');
var router = express.Router();
var db = require('../models/db');
var Comment = require('../models/comment');
var User = require('../models/user');
var Post = require('../models/post');
var async = require('async');

// GET /comments/:postid
// show comments for a post
router.get('/:postid', function(req, res, next) {
  // get post id from url
  var postid = req.params.postid;

  // get post
  Post.get(postid, function(err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/posts');
    }

    // get comments
    Comment.getComments(postid, function(err, comments) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/posts');
      }

      // get comment author
      async.eachSeries(comments, function(comment, callback) {
        User.get(comment.author, function(err, user) {
          if (err) {
            callback(err);
          } else {
            comment.author = user;
            callback();
          }
        });
      }, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/posts');
        }
        // render comments
        res.render('comments', {
          title: 'Comments',
          post: post,
          comments: comments
        });
      });
    });
  });
});

// POST /comments/:postid
// add a new comment
router.post('/:postid', function(req, res, next) {
  // get post id from url
  var postid = req.params.postid;

  // get user id from session
  var userid = req.session.user._id;

  // get comment content from request
  var content = req.body.content;

  // create a new comment
  //var comment = {postid: postid}''
