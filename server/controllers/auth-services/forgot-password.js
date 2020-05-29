// models
const User = require('../../models/user');
// packages
const jwt = require('jsonwebtoken');

// helpers...
const sendMail = require('../../helper-functions/mailer');



module.exports = async (req, res) =>{
    if(!req.body.email){
        return res.status(404).json({success: false, error:'Your email must be provided'});
    }

    try{
        const email = req.body.email;

        // find user..
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({success: false, error:'User Not Found'});
        }

        // check if there hasn't any token been requested eventually...
        if(user.passwordResetToken != undefined && user.passwordResetTokenExp > Date.now()){
            return res.status(404).json({success: false, error: 'There is a previous request to reset your password'});
        }
    
        // Generate reset token...
        const resetPasswordToken = await jwt.sign({id: user._id, roles: user.roles, email: user.email}, process.env.JWT_SECRET);

        // set reset token and exp into the user...
        user.passwordResetToken = resetPasswordToken;
        user.passwordResetTokenExp = Date.now() + 3600000;

        user.save((err, user) => {
            if(err){
                return res.status(404).json({success: false, error: err});
            }

            let mailOptions = {
                from: 'noreply@animania.com',
                to: user.email,
                subject: 'Animania Password Reset',
                text: 'Reset your password with just two clicks',
                html: `
                    <p> Hello ${user.username}<br/> <br/>
                    As per your request, you can reset your password by clicking the below link.
                    </p>
                    <br />
                    <h3 style="color: red">Please ignore this mail if you didn\'t request that! </h3>
                    <br/>
                    <a href='http://localhost:4200/reset-password/${user.passwordResetToken}' target = '_blank' > Reset my Password</a>
                    <br />
                    <p> We are pleased that you joined our own world.</p>
                    <p>Best regards,<p/>
                    <p>Animania<p/>
                    `
             };

             sendMail(mailOptions);
             return res.status(200).json({success: true, message:'Your will shortly get an email to reset your password'});

        })

        

    }catch(e){
        if(e){
            return res.status(404).json({success: false, errors: e});

        }
    }

   
}