// models
const User = require('../../models/user');
const ConfirmationToken = require('../../models/confirmationToken');
// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = async (req, res) => {

    if(!req.params.token){
        return res.status(403).json({success: false, message: 'Verification token not provided'})
    }

    try{
        const token = await jwt.verify(req.params.token, process.env.JWT_SECRET);

        const confirmationToken = await ConfirmationToken.findOne({token: req.params.token});

        if(!confirmationToken){
            return res.status(403).json({success: false, message: 'Token couldn\'t be found'});
        }

        const user = await User.findById(token.id);
        if(user.isVerified){
            return res.status(404).json({success: false, message: 'Your account is already verified'});

        }
        user.isVerified = true;

        user.save((err, user) => {
            if(err){
                return res.status(403).json({success: false, errors: err});
            }
            return res.status(202).json({success: true, message: 'Email verified successfully'});
   
        })


    }catch(e){
        if(e){
            return res.status(403).json({success: false, errors: e});

        }
    }


}