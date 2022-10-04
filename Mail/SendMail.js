const nodemaler = require('nodemailer');
const path = require('path')
var hbs = require('nodemailer-express-handlebars');


const SendMail = async(req,res,next)=>{
    try {
        const {message,to,subject} = req.body;

        const transpoter = nodemaler.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        })

        const mailOptions = {
            from:process.env.EMAIL,
            to:to,
            subject:subject,
            html:`<p>${message}</p>`
        }
 

        transpoter.sendMail(mailOptions,(error,info)=>{
            if(error){
                return res.status(202).send(error)
            }
            console.log('Mail sended' , info)
            return res.status(200).send("Mail sended")
        })
    } catch (error) {
        return res.status(404).send(error)
    }
}




const sendDefaltMail = async(req,res,next)=>{
    try {
        const {
          to,clientId,name,email,phone,netAmount,membershipYear ,salesEmployeeId,AMC,membershipType,dateOfJoining
        
        } = req.body;
        var transporter = nodemaler.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
          });
          
          const handlebarOptions = {
            viewEngine: {
              extName: ".handlebars",
              partialsDir: path.resolve('./views'),
              defaultLayout: false,
            },
            viewPath: path.resolve('./views'),
            extName: ".handlebars",
          }
          
          transporter.use('compile', hbs(handlebarOptions));
          
          var mailOptions = {
            from: process.env.EMAIL,
            to: to,
            subject: 'Sending Email using Node.js',
            template: 'email',
            context: {
              clientId:clientId,
              name: name,
              email:email,
              phone:phone,
              membershipYear:membershipYear,
              netAmount:netAmount?netAmount:'N/A',
              salesEmployeeId:salesEmployeeId?salesEmployeeId:'N/A',
              AMC:AMC?AMC:'N/A',
              membershipType:membershipType?membershipType:'N/A',
              dateOfJoining:dateOfJoining?dateOfJoining:'N/A',
            }
             

          
          };
          
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                return res.send('email sent')
            }
          });

    } catch (error) {
        return res.status(202).send(error)
    }
}




module.exports = {SendMail,sendDefaltMail}