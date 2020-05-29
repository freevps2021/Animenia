// models
const User = require('../../models/user');
// packages
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = async (req, res) =>{
    if(!req.body.token || !req.body.newPassword || !req.body.passwordConfirmation){
        return res.status(404).json({success: false, error:'Your email & password & password confirmation must be provided'});
    }

    try{
        // resolve token..
       const tokenPayload = await jwt.verify(req.body.token, process.env.JWT_SECRET);
        // Get the user...
        const user = await User.findOne({_id: tokenPayload.id, passwordResetToken: req.body.token});
        if(!user){
            return res.status(403).json({success: false, error:'Please submit the forgot-password request again.'})

        }
        // Check if the token is stored and didn't expire..
        if(user.passwordResetToken == undefined || user.passwordResetTokenExp < Date.now()){
            return res.status(403).json({success: false, error:'Please submit the request again.'})
        }

        if(req.body.newPassword === req.body.passwordConfirmation){
            // Generate new Password..
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.newPassword, salt);

            // Set the password...
            user.password = hash;
            user.passwordResetToken = undefined;
            user.passwordResetTokenExp = undefined;

            user.save((err, updatedUser) => {
                if(err){
                    return res.status(403).json({success: false, error: err});
                }

                return res.status(202).json({success: true, message: 'Your password has been successfully reset'});
            })

        }else{
            return res.status(404).json({success: false, error:'Passwords didn\'t match!'});

        }

    }catch(e){
        if(e){
            return res.status(404).json({success: false, errors: e});

        }
    }

   
}



