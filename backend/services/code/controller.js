const vm = require('vm')
const fs = require('fs')
const {exec} = require('child_process')
const Path = require('path')
const {PythonShell} = require('python-shell')
const WebSocket = require('ws')

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
    const filePath = Path.join(__dirname,`../../temp/${Math.floor(Math.random()*1e19)}.java`)
    let output = {}
    console.log(filePath)
    fs.writeFile(filePath, userCode, (err) => {
        if (err) {
            return res.json({ output: ['internal error'] });
        }
        // Compile the Java file
        exec(`java ${filePath}`, (compileErr, compileStdout, compileStderr) => {
            fs.unlink(filePath,()=>{});
            if (compileErr) {
                return res.json({output: [compileStderr]});
            }
            return res.json({output: [compileStdout]});
        });
    });

}
function runPython(userCode,res){
    const id = Math.floor(Math.random()*1e19)
    const filePath = Path.join(__dirname,`../../temp/${id}.py`)
    const options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: './temp',
    }

    fs.writeFile(filePath,userCode,(err)=>{
        if (err) {
            return res.json({output:['internal error']})
        }
        PythonShell.run(`${id}.py`,options).then((result)=>{
            fs.unlink(filePath,()=>{})
            return res.json({output:result})
        }).catch((err)=>{
            console.log(err)
            res.json({output:[err.message]})
        })
    })

}

module.exports = {
    runJavaCode,
    runJavaScript,
    runPython
}