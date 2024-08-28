const router = require('express').Router()
const {getQuestion, getAnswer, setAnswer, getScore} = require('../../gateways/database')
router.get('/question/:language/:id',(req,res)=>{
    const {language,id} = req.params
    if(!['java','python','javascript'].includes(language)){
        return res.status(403).json({error:'language not supported'})
    }
    getQuestion(language,id).then((data)=>{
        console.log(data)
        res.json({output:data})
    })

})
router.get(`/get-score/:id`,(req, res)=>{
    const {id} = req.params
    getScore(id).then(value=>{
        console.log(value)
        res.json({output:value})
    })
})
router.post('/mark-answer',(req,res)=>{
    const {answer,userId} = req.body
    if(!answer){
        return res.status(403).json({error:'invalid answer format'})
    }
    if(!userId){
        return res.status(403).json({error:'invalid user id format'})
    }
    setAnswer(userId,answer).then(()=>{
        res.json({success:true})
    }).catch((err)=>{
        console.log(err)
    })

})
module.exports = router