const nodemaler = require('nodemailer');
const path = require('path')
var hbs = require('nodemailer-express-handlebars');
var hbs_2 = require('handlebars')
const puppeteer = require("puppeteer");
const fs = require('fs-extra');
// const emailBody = require('../views/email.hbs')


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


const Converter = async (templateName , data)=>{
  try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      const filePath = path.join(__dirname,"../views/email.hbs")

      const html = await fs.readFile(filePath,'utf8');
      const file = hbs_2.compile(html)(data)

      await page.setContent( file)

      await page.pdf({
          path: 'welcome.pdf',
          format: 'A4',
          printBackground: true
      })
      // console.log("done creating pdf")
      await browser.close()
      // process.exit()

  } catch (error) {
    console.log(error)
    
  }
}

const sendDefaltMail = async(req,res,next)=>{
    try {
        const {
          to,name
        
        } = req.body;

         // converting html to pdf
         await Converter('email',req.body)

        var transporter = nodemaler.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
          });
          
          const handlebarOptions = {
            viewEngine: {
              extName: ".hbs",
              partialsDir: path.resolve('./views'),
              defaultLayout: false,
            },
            viewPath: path.resolve('./views'),
            extName: ".hbs",
          }
          
          transporter.use('compile', hbs(handlebarOptions));
          
          var mailOptions = {
            from: process.env.EMAIL,
            to: to,
            subject: 'Welcome to maxisholidays',
            template: 'emailText',
            context: {
              name: name,
              comp_phone:1204955466 ,
              comp_email:'booking@maxisholidays.com',
               
            },
            attachments:[
              { 
              path:'./welcome.pdf'
            }
            ]
             

          
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