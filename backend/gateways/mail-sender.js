const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env['SENDER_ADDRESS'],
        pass: process.env['SENDER_PASS'],
    },
});
async function sendMail(options){
    const info = await transporter.sendMail({
        from:'korwutacollins@gmail.com',
        to:options.email,
        subject:options.subject,
        text:'Hello',
        html: `<a href="${options.url}${options.token}" target="_self">Click here to reset</a>`
    })
    console.log('Message sent: %s',info.messageId)
}
function hashEmail(email){
    email.substring(0,4)
    email.indexOf('@')
    return email.substring(0,4).padEnd(email.indexOf('@')+1,'*') + email.substring(email.indexOf('@'))
}
module.exports = {sendMail,hashEmail}