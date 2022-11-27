const nodemaler = require('nodemailer');
const path = require('path')
var hbs = require('nodemailer-express-handlebars');
var hbs_2 = require('handlebars')
const puppeteer = require("puppeteer");
const fs = require('fs-extra');
// const emailBody = require('../views/email.hbs')
const clientSchema = require('../model/clientSchema');

 
const SendMail = async(req,res,next)=>{
    try {
        const {to} = req.body;
        const user = await clientSchema.findOne({email:to})
        const transpoter = nodemaler.createTransport({
            service:"gmail",
            auth:{  
                user:process.env.EMAIL,
                pass:process.env.PASSWORD   
            }
        })  

        const handlebarOptions = {
          viewEngine: {
            extName: ".hbs",
            partialsDir: path.resolve('./views'),
            defaultLayout: false,
          },
          viewPath: path.resolve('./views'),
          extName: ".hbs",
        }

        transpoter.use('compile', hbs(handlebarOptions));
          
        const mailOptions = {
            from:process.env.EMAIL,
            to:to,
            subject:"Maxisholidays ",
            template: 'emailText',
            context: {
              name:           user.name,
              clientId:       user.clientId,
              email:          user.email,
              phone:          user.phone,
              address:        user.address,
              DOB:            user.DOB,
              membershipYear: user.membershipYear,
              membershipType: user.membershipType,
              netAmount:      user.netAmount,
              paidAmount:     user.paidAmount,
              balanceAmount:  user.balanceAmount,
              state:          user.state,
              city:           user.city,
              dateOfJoining:  user.dateOfJoining,
              fathersName:    user.fathersName,
              mothersName:    user.mothersName,
              AMC:            user.AMC,
              salesEmployeeId:user.salesEmployeeId,
              noOfNight:      user.totalAllowedNights,
              noOfDays:       user.totalAllowedDays,
              balanceDays:    user.balanceDays,
              balanceNight:   user.balanceNight, 
              spouseName:     user.spouseName,
              spouseDOB:      user.spouseDOB,
              MAD:            user.marriageAnniversaryDate,
              firstChildName: user.firstChildName,
              firstChildDOB:  user.firstChildDOB,
              secondChildName:user.secondChildName,
              secondChildDOB: user.secondChildDOB,
              thirdChildName: user.thirdChildName,
              thirdChildDOB:  user.thirdChildDOB,
              AMCStatus:      user.AMCStatus,
              DueAMC:         user.DueAMC,
            },
        }
 

        transpoter.sendMail(mailOptions,(error,info)=>{
            if(error){
                return res.status(202).send(error)
            }
            return res.status(200).send("Mail Sent")
        })
    } catch (error) {
        return res.status(404).send(error)
    }
}

 

const sendDefaltMail = async (req,res,next)=>{
    try {
        const {
          to,clientId ,name,email,phone,netAmount, 
          salesEmployeeId ,AMC,membershipType,membershipYear,
          dateOfJoining,noOfDays,noOfNight
        
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
            template: 'email',
            context: {
              name: name,
              clientId,
              phone,
              membershipYear,
              membershipType,
              email,
              AMC,
              netAmount,
              dateOfJoining,
              salesEmployeeId,
              noOfNight,
              noOfDays
               
            },
            
             

          
          };
          

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.send({message:error})
            } else {
                return res.send('email sent')
            }
          });


    } catch (error) {
        return res.status(202).send(error)
    }
}




module.exports = {SendMail,sendDefaltMail}