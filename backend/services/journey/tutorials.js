const router = require('express').Router()
const {getTopic,getTutorial} = require('../../gateways/database')
router.get('/topic/:language',(req,res)=>{
    const language = req.params.language
    if(!['java','python','javascript'].includes(language)){
        return res.status(403).json({error:'language not supported'})
    }
    getTopic(language).then((data)=>{
        res.json({output:data})
    })

})
router.get('/tutorial/:language/:index',(req,res)=>{
    const language = req.params.language
    const index = req.params.index
    if(!['java','python','javascript'].includes(language)){
        return res.status(403).json({error:'language not supported'})
    }
    if(!index){
        return res.status(403).json({error:'wrong index format'})
    }
    getTutorial(language,index).then((data)=>{
        res.json({output:data})
    })
})
module.exports = router