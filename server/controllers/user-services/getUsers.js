// models
const User = require('../../models/user');
const Post = require('../../models/post');
const Image = require('../../models/image');
// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');