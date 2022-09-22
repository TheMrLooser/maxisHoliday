const nodemaler = require('nodemailer');

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

module.exports = SendMail