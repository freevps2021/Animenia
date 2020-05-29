const multer = require('multer');
const Image = require('../models/image');




    const storage = multer.diskStorage({
        destination: function (req, file, cb){
            cb(null, `./public/uploads/images/${file.fieldname}`);
        },
        filename: function (req, file, cb){
            const image = new Image({
                        user: req.params.id || req.user, // if used in users route, then req.params.id and if posts route, then req.user
                        category: file.fieldname,
                        date: new Date(),
                        path: `./public/uploads/images/${file.fieldname}`
                    });
                    image.save().then(image =>{
                    const ext= file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                    cb(null, image._id.toString()  + ext);
    
                    }).catch(err=>{
                        console.log(err);
                    })
                    
               
            
        }
    });
    const upload = multer({storage: storage});
    
    module.exports = upload;
