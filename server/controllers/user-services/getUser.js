const User = require('../../models/user');


module.exports = async (req, res) => {
    if(!req.user){
        console.log('here at getuser');

        return res.status(403).json({success: false, message: 'Authentication failed'});
    }

    try{

        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            console.log('here at getuser');
            return res.status(404).json({success: false, message: 'User not found'});
        }else{
            return res.status(202).json({success: true, user});

        }

    }catch(e){
        if(e){
            return res.status(403).json({success: false, errors: e});
 
        }
    }
}