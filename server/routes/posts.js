const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Image = require('../models/image');
const User = require('../models/user');
const Like = require('../models/like');
const Dislike = require('../models/dislike');
const Comment = require('../models/comment');
const CommentReply = require('../models/commentReply');
const CommentLike = require('../models/commentLike');
const CommentDislike = require('../models/commentDislike');

// post controllers
const addNewPost = require('../controllers/post-services/addPost');
const deletePost = require('../controllers/post-services/deletePost');
const getPosts = require('../controllers/post-services/getPosts');
const getPost = require('../controllers/post-services/getPost');
const editPost = require('../controllers/post-services/updatePost');
const sharePost = require('../controllers/post-services/sharePost');
const likePost = require('../controllers/post-services/like');
const dislikePost = require('../controllers/post-services/dislike');

// comment controllers
const addComment = require('../controllers/comment-services/addComment');
const deleteComment = require('../controllers/comment-services/deleteComment');
const likeComment = require('../controllers/comment-services/likeComment');
const getPostComments = require('../controllers/comment-services/getComments');
const getComment = require('../controllers/comment-services/getComments');
const updateComment = require('../controllers/comment-services/getComment');

// reply controllers
const addReply = require('../controllers/reply-services/addReply');
const deleteReply = require('../controllers/reply-services/deleteReply');
const getReply = require('../controllers/reply-services/getReply');
const getReplies = require('../controllers/reply-services/getReplies');
const updateReply = require('../controllers/reply-services/updateReply');
const likeReply = require('../controllers/reply-services/likeReply');
const dislikeReply = require('../controllers/reply-services/dislikeReply');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const  fs = require('fs');
const checkAuth = require('../middelwares/checkAuth');
const upload = require('../helper-functions/setMulterDiskStorage');


/** POST ROUTES */

// Get posts of the galaxy of authenticated user..
router.get('/', checkAuth, getPosts);

// Get Post
router.get('/:id', checkAuth, getPost);

// Add new post
router.post('/new-post', checkAuth, upload.single('posts'), addNewPost);


// Share a post
router.post('/:id/share', checkAuth, sharePost);

// Like a post
router.post('/:id/like', checkAuth, likePost);


// Dislike endpoint..
router.post('/:id/dislike', checkAuth, dislikePost);

// Delete Post
router.delete('/:id/delete-post', checkAuth, deletePost);

// Edit post
router.post('/:id/edit-content', checkAuth, editPost)




/** COMMENTS ROUTES*/

// Get post comments, where id is the post id...
router.get('/:post/comments', checkAuth, getPostComments);

// Get a specific comment..
router.get('/:id', checkAuth, getComment);

// Add comment on specific post
router.post('/:id/add-comment', checkAuth, addComment)

// Edit Comment
router.post('/:id', checkAuth, updateComment);

//Delete a comment..
router.post('/:id/delete-comment', checkAuth, deleteComment);

// Add a reply to a comment
router.post('/:cid/add-reply', checkAuth, addReply);

// Like a reply
router.post('/:id/like-reply', checkAuth, likeReply);

// Dislike a reply
router.post('/:id/dislike-reply', checkAuth, dislikeReply);

// Like a comment
router.post('/:post/:id', checkAuth, likeComment);



/** REPLY ROUTES */

// Get Reply..
router.get('/:id', checkAuth, getReply);

// Get replies
router.get('/:comment/replies', checkAuth, getReplies);





// Update reply...
router.put('/:id', checkAuth, updateReply);
    
// delete a reply..
router.delete('/:replyId/remove-reply', checkAuth, deleteReply)




module.exports = router;