const Review = require('../../models/review');
const Anime = require('../../models/anime');



module.exports = async(req, res)=>{
    if(req.user){
        try{
            console.log(req.body.title.eng, req.body.title.romaji, req.body.summary, req.body.first_aired, req.body.status);

            if(req.body.title.eng  && req.body.title.romaji && req.body.summary && req.body.summary.trim() !==' ' && req.body.status && req.body.first_aired && req.body.author ){
              const newAnime = new Anime({
                title:{ eng: req.body.title.eng, romaji: req.body.title.romaji},
                summary: req.body.summary,
                status: req.body.status,
                author: req.body.author,
                first_aired: req.body.first_aired  
              });
              const savedAnime = await newAnime.save();
              return res.status(200).json({success: true, message:'Anime created successfully!', savedAnime});  
            }else{
                console.log('Failed to add Anime because of missing details');
                return res.status(401).json({success: false, message: 'Failed to add Anime because of missing details!'})
            }
        }catch(e){
            console.log(e);
            return res.status(404).json({success: false, error: e });
        }
    }else{
        return res.status(403).json({success: false, message: 'Unauthorized!' });
  
    }
}