const router = require('express').Router()
const vm = require('vm')
const fs = require('fs')
const {exec} = require('child_process')
const Path = require('path')
router.post('/compile-code',(req,res)=>{
    const {code,language} = req.body
    switch(language){
        case 'javascript':
            return res.json(runJavaScript(code));
        case 'java':
            runJavaCode(code,res);
    }

})

function runJavaScript(userCode){
    let output = [];
    const sandbox = {
        console: {
            log: (...args) => output.push(args.join(' '))
        }
    }
    try {
        const script = new vm.Script(`${userCode}`);
        script.runInNewContext(sandbox, { timeout: 5000 });
        return {output:output}
    } catch (error) {
        let errorDetail = {
            name:error.stack.substring(0,error.stack.indexOf('SyntaxError')).
            replace("evalmachine.<anonymous>","LINE"),
            message:error.message
        }
        return {output: [errorDetail.name,errorDetail.message]}
    }
}
function runJavaCode(userCode,res){
        const filePath = Path.join(__dirname,`../temp/${Math.floor(Math.random()*1e19)}.java`)
        let output = {}
        console.log(filePath)
        fs.writeFile(filePath, userCode, (err) => {
            if (err) {
                return res.json({ output: ['Error writing file'] });
            }
            // Compile the Java file
            exec(`java ${filePath}`, (compileErr, compileStdout, compileStderr) => {
                if (compileErr) {
                    return res.json({output: [compileStderr]});
                }
                return res.json({output: [compileStdout]});
            });
        });

}
module.exports = router
