const User = require('../../models/user');
const { check, validationResult } = require('express-validator');




module.exports = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success: false, errors});
    }
    if(req.user){
        try{
          let user = await User.findById(req.user);
          user.firstName = req.body.personalInfos.firstName;
          user.lastName = req.body.personalInfos.lastName;
          user.telephone = req.body.personalInfos.telephone;
          user.birthDate = req.body.personalInfos.birthDate;
          user.profile_status = 2;
          
          let avatarUrl;
          // check if the user appended a file with the request..
          if(req.file){
              avatarUrl = req.protocol + "://" + 'localhost:3000/uploads/images/profile/' + req.file.filename;
          }

          user.avatar_url = req.file? avatarUrl : req.protocol + "://" + 'localhost:3000/uploads/images/profile/default-avatar.jpg';
          const profile = await user.save();

          if(profile){
              return res.status(200).json({success: true, message: "Profile initialized"})
          }

        }catch(e){
            return res.status(404).json({success: false, errors:e});

        }
    }else{
        return res.status(404).json({success: false, message: "You are not authenticated"});

    }
}