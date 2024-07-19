const router = require('express').Router()
const {getQuestion} = require('../../gateways/database')
router.get('/question/:language',(req,res)=>{
    const language = req.params.language
    if(!['java','python','javascript'].includes(language)){
        return res.status(403).json({error:'language not supported'})
    }
    getQuestion(language).then((data)=>{
        res.json({output:data})
    })

})
module.exports = router