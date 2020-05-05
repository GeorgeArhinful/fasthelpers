const nodeMailer = require('nodemailer')
const MAILL = require('./../../config/mail')

// CONTACT US PAGE ENDPOINT API HANDLER

module.exports.contactUs = (req, res) => {
// This fuction will send email to fasthelpers if a user uses the contact form in 
// the contact us page 
    let {body} = req
    let transporter = nodeMailer.createTransport({
        service: 'gmail',
        secure: true,
        requireTLS: true,
        auth: {
               user: MAILL.EMAIL_ADDRESS,
               pass: MAILL.EMAIL_PASSWORD
           },
        tls:{
            rejectUnauthorized: false
        }
       })
    var mailOptions = {     
        from: `${body.email}`,
        to: MAILL.EMAIL_ADDRESS,
        subject: `Message from ${body.email}, website contact us `,
        text: `Hello Fasthelpers my name is ${body.name} , ${body.msg}`,
    };
    
    transporter.sendMail(mailOptions, function(error, info){     
        if(error) return res.send(200,{success: false, message:'Email sent unsuccessfull',err:error,response:null});                     
        console.log('Message sent: ' + info.response); 
        return res.send(200,{success: true, message:'Email sent Successfull',err:null,response:null});                
    });
};