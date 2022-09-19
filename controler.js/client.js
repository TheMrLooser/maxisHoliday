const clientSchema = require('../model/clientSchema.js');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring"); 
const bcrypt = require('bcryptjs');
const employee = require('../model/employee.js');

const generateDaysAndNight=(membershipYear)=>{
    const allowedDays = 8*membershipYear;
    const allowedNight = 7*membershipYear;

    const holidayPack = {allowedDays,allowedNight};
    return holidayPack

}


const RegisterNewClient = async(req,res,next)=>{
    try{
        const check = await clientSchema.findOne({phone:req.body.phone});
        const salesEmployee = await employee.findOne({employeeId:req.body.salesEmployeeId})
        if(!check && salesEmployee){
            const phone = req.body.phone;
            const membershipYear = req.body.membershipYear
            const getTotalAllowedDaysAndNight  = generateDaysAndNight(membershipYear)
            const  hashPassword  = await bcrypt.hash(phone,10);
            const genrateUserId = randomstring.generate(
                {
                    length: 3,
                    charset: '1234567890'
                }
            ); 
            const clientID = `MHC${genrateUserId}` 
            const newUser = new clientSchema({...req.body, password:hashPassword,clientId:clientID, totalAllowedDays:getTotalAllowedDaysAndNight.allowedDays,totalAllowedNights:getTotalAllowedDaysAndNight.allowedNight});
            await newUser.save();
            await employee.findByIdAndUpdate(salesEmployee._id,{$push:{clients:clientID}})
            const sendData = {clientId:clientID,password:phone}
            return res.status(200).send(sendData)
        }
        return res.status(404).send("Phone number is allready exist or You can't add new client ")
    }catch(error){
        return res.status(404).send(error)
    }
};

const LoginClient = async(req,res,next)=>{
    try {
        const check = await clientSchema.findOne({clientId:req.body.clientId});
        if(check){
            const password = req.body.password;
            const checkPassword  = await bcrypt.compare(password,check.password);
            if(checkPassword){
                const token = jwt.sign({id:check.phone},process.env.SECRET_KEY)
                res.cookie("access_token",token,{secure: true,sameSite: 'none',httpOnly:true}).status(200)
                await clientSchema.findByIdAndUpdate(check._id,{$set:{token:token}}) 
                const {password,...others} = check._doc
                return res.status(200).send(others)
            }
            return res.status(404).send("Wrong password!")
        }
        return res.status(404).send("Wrong clientId!")
    } catch (error) {
         
        return res.status(404).send(error)
    }
}


const getSingleClient = async(req,res,next)=>{
    try {
        const checkClient = await clientSchema.findOne({clientId:req.body.clientId});
        if(checkClient){
            const {password,...Others} = checkClient._doc
            return res.status(200).send(Others)
        }
        return res.status(404).send("Clent Not Found!")
    } catch (error) {
        return res.status(404).send(error)
    }
}


const getAllClients = async(req,res,next)=>{
    try{
        const clients = await clientSchema.find();
        return res.status(200).send(clients)
    }catch(error){
        return res.status(404).send(error)
    }

}

const UpdateClientDetaile = async(req,res,next)=>{
    try {
        const checkClient = await clientSchema.findOne({clientId:req.body.clientId});
        if(checkClient){
            await clientSchema.findByIdAndUpdate(checkClient._id,{$set:{...req.body}});
            return res.status(200).send("Client Updated")
        }
        return res.status(404).send("Client not found!")
    } catch (error) {
        return res.status(404).send(error)
    }
}

const deleteClient = async(req,res,next)=>{
    try {
        const checkClient = await clientSchema.findOne({clientId:req.body.clientId});
        if(checkClient){
            await clientSchema.findByIdAndDelete(checkClient._id);
            return res.status(200).send(`Client "${checkClient.name}" deleted!`)
        }
        return res.status(404).send("Client not found")
    } catch (error) {
        return res.status(404).send(error)
    }
}
module.exports  = {RegisterNewClient,LoginClient,getSingleClient,getAllClients,UpdateClientDetaile ,deleteClient}