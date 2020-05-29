const User = require('../../models/user');




module.exports = async (req, res) => {
    if(req.user){
        try{
            const user = await User.findById(req.user)
            .populate([{
                path:'posts',
                model:'Posts'
            },
            {
                path:'nakamas',
                model:'User'
            }
        ]);

        if(!user){
            console.log('here')
            return res.status(404).json({success: false, message: 'User not found'});
        }else{
            return res.status(202).json({success: true, user:user});

        }


        }catch(e){
            if(e){
                return res.status(404).json({success: false, errors: e});
            }
        }
    }else{
        return res.status(403).json({success: false, message: 'Authentication failed'})
    }
}