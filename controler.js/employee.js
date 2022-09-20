const EmployeeSchema = require('../model/employee.js');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring"); 
const bcrypt = require('bcryptjs');

 

const RegisterNewEmployee = async(req,res,next)=>{
    try{
        const check = await EmployeeSchema.findOne({phone:req.body.phone});
        if(!check){
            const phone = req.body.phone;
            const  hashPassword  = await bcrypt.hash(phone,10);
            const genrateUserId = randomstring.generate(
                {
                    length: 3,
                    charset: '1234567890'
                }
            ); 
            const employeeId = `MHE${genrateUserId}` 
            const newEmployee = new EmployeeSchema({...req.body, password:hashPassword,employeeId:employeeId});
            await newEmployee.save();
            const sendData = {employeeId:employeeId,password:phone}
            return res.status(200).send(sendData)
        }
        return res.status(404).send("Phone number is allready exist")
    }catch(error){
        return res.status(404).send(error)
    }
};

const LoginEmployee = async(req,res,next)=>{
    try {
        const check = await EmployeeSchema.findOne({employeeId:req.body.employeeId});
        if(check){
            const password = req.body.password;
            const checkPassword  = await bcrypt.compare(password,check.password);
            if(checkPassword){
                const token = jwt.sign({id:check.phone},process.env.SECRET_KEY)
                res.cookie("access_token",token,{secure: true,sameSite: 'none',httpOnly:true}).status(200)
                await EmployeeSchema.findByIdAndUpdate(check._id,{$set:{token:token}}) 
                const {password,...others} = check._doc
                return res.status(200).send(others)
            }
            return res.status(404).send("Wrong password!")
        }
        return res.status(404).send("Wrong EmployeeId!")
    } catch (error) {
         
        return res.status(404).send(error)
    }
}


const getSingleEmployee = async(req,res,next)=>{
    try {
        const checkEmployee = await EmployeeSchema.findOne({employeeId:req.body.employeeId});
        if(checkEmployee){
            const {password,...Others} = checkEmployee._doc
            return res.status(200).send(Others)
        }
        return res.status(404).send("Employee Not Found!")
    } catch (error) {
        return res.status(404).send(error)
    }
}


const getAllEmployee = async(req,res,next)=>{
    try{
        const Employees = await EmployeeSchema.find();
        return res.status(200).send(Employees)
    }catch(error){
        return res.status(404).send(error)
    }

}

const UpdateEmployeeDetaile = async(req,res,next)=>{
    try {
        const checkEmployee= await EmployeeSchema.findOne({employeeId:req.body.employeeId});
        if(checkEmployee){
            await EmployeeSchema.findByIdAndUpdate(checkEmployee._id,{$set:{...req.body}});
            return res.status(200).send("Employee Updated")
        }
        return res.status(404).send("Employee not found!")
    } catch (error) {
        return res.status(404).send(error)
    }
}

const deleteEmployee = async(req,res,next)=>{
    try {
        const checkEmployee = await EmployeeSchema.findOne({employeeId:req.body.employeeId});
        if(checkEmployee){ 
            await EmployeeSchema.findByIdAndDelete(checkEmployee._id);
            return res.status(200).send(`Employee "${checkEmployee.name}" deleted!`)
        }
        return res.status(404).send("Employee not found")
    } catch (error) {
        return res.status(404).send(error)
    }
}

 





module.exports  = {RegisterNewEmployee,LoginEmployee,getAllEmployee,getSingleEmployee,UpdateEmployeeDetaile ,deleteEmployee }