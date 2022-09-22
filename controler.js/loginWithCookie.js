const  clientSchema = require("../model/clientSchema")
const employee = require("../model/employee")




const LoginWithCookie = async(req,res,next)=>{
    try {
        const getCookie = req.cookies.access_token
        if(getCookie){
            const getClient = await clientSchema.findOne({token:getCookie})
            const getEmployee = await employee.findOne({token:getCookie})

            if(getClient){
               return res.status(200).send( getClient)    
            }
            else if(getEmployee){
               return res.status(200).send( getEmployee)     
            }

            return res.status(404).send( "Cookie expires login again") 
        }
    } catch (error) {
        res.status(404).send(error) 
    }
}


const LogOut = (req,res,next)=>{
    res.cookie("access_token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).send("Loged out successfull")
}


module.exports = {LoginWithCookie , LogOut}