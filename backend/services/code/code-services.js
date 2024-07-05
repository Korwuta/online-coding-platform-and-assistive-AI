const {runJavaScript, runJavaCode, runPython} = require("./controller");
const router = require('express').Router()
router.post('/compile-code',(req,res)=>{
    let {code,language} = req.body;
    language = language.toLowerCase();
    switch(language){
        case 'javascript':
            return res.json(runJavaScript(code));
        case 'java':
            runJavaCode(code,res);
            break
        case 'python':
            runPython(code,res)
            break

    }

})


module.exports = router
