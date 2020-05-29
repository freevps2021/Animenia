// models
const User = require('../../models/user');
const Post = require('../../models/post');
const Image = require('../../models/image');
const ConfirmationToken = require('../../models/confirmationToken');

// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { check, validationResult } = require('express-validator');

// helpers
const sendMail = require('../../helper-functions/mailer');

module.exports = async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({success: false, errors: errors.array()});
    }
    // check if the user is already registerd with this mail..
    const userFound = await User.findOne({email: req.body.email});

    if(userFound){
        return res.status(401).json({success: false, error: "Email is already registerd!"})
    }

    // check if password and password-confirmation are matched..
    if(req.body.password !== req.body.passwordConfirm){
        return res.status(401).json({success: false, error: "Password dosen\'t match!"});
    }else{

        try{
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
    
            const user = new User({
                username: req.body.username,
                email: req.body.email,
               // gender: req.body.gender,
                password: hash,
                created_at: new Date()
            });
    
            const saveUser = await user.save();
            if(saveUser){
              
                // send the user a verification email...
                 const token = await jwt.sign({id: saveUser._id, roles: saveUser.roles, email: saveUser.email}, process.env.JWT_SECRET);
    
                 if(token){
                     const confirmationToken = new ConfirmationToken({
                         user: saveUser._id,
                         token: token
                     });
    
                     const persistToken = await confirmationToken.save();
                     if(!persistToken){
                        console.log('token failed')
                        return res.status(404).json({success: false, error: "Validation token could not be persisted"});
                     }
    
                     // send email for verfication with the token..
                     let mailOptions = {
                        from: 'noreply@animania.com',
                        to: saveUser.email,
                        subject: 'Animania Registration',
                        text: 'Please verify your email to complete registration',
                        html: `
                            <p> Hello ${saveUser.username}<br/> <br/>
                            please verify your account by clicking the link below
                            </p>
                            <br/>
                            <a href='http://localhost:4200/verify-account/${persistToken.token}' target = '_blank' >Here i verify</a>
                            <br />
                            <p> We are pleased that you joined our own world.</p>
                            <p>Best regards,<p/>
                            <p>Animania<p/>
                            `
                     };
    
                     sendMail(mailOptions);
                     return res.status(202).json({success: true, message: "Your registeration was successful. You will get a verifcation mail to verify your account."})
                 }    
                
            }else{
                console.log('Regsteratio failed')
                return res.status(401).json({success: false, error: "Registeration Failed!"});
            }
        
        }catch(e){
            if(e){
                console.log(e)

                return res.status(404).json({success: false, errors: e});
            }
        }

}
}