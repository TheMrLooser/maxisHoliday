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
        const paidAmount = parseInt(req.body.paidAmount,10)
        const membershipAmount = parseInt(req.body.netAmount,10)
        if(!check && salesEmployee){
            const phone = req.body.phone;
            const membershipYear = req.body.membershipYear
            const getTotalAllowedDaysAndNight  = generateDaysAndNight(membershipYear)
            const  hashPassword  = await bcrypt.hash(phone.toString(),10);
            const genrateUserId = randomstring.generate(
                {
                    length: 3, 
                    charset: '1234567890'
                }
            ); 
            
            const clientID = `MHC${genrateUserId}` 
            const  balanceAmount = membershipAmount-paidAmount;

            const AMCStatus = req.body.AMCStatus
            const currentYear = new Date().getFullYear()
            const AMC = req.body.AMC
            const PaidAmc = req.body.PaidAmc
            const DueAMC = AMC-PaidAmc
            const todaysDate = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`
            const AMCObject = {AMC:AMC,Due:DueAMC,Status:AMCStatus,DateOfPaying:todaysDate ,AMCYear:currentYear}

            const newUser = new clientSchema({...req.body,balanceAmount,paidAmount, password:hashPassword,clientId:clientID, totalAllowedDays:getTotalAllowedDaysAndNight.allowedDays,totalAllowedNights:getTotalAllowedDaysAndNight.allowedNight ,balanceDays:getTotalAllowedDaysAndNight.allowedDays,balanceNight:getTotalAllowedDaysAndNight.allowedNight,AMCList:AMCObject , DueAMC});
            await newUser.save();
            
            await employee.findByIdAndUpdate(salesEmployee._id,{$push:{clients:clientID}})
            const sendData = {clientId:clientID,password:phone,totalAllowedDays:getTotalAllowedDaysAndNight.allowedDays,totalAllowedNights:getTotalAllowedDaysAndNight.allowedNight}
            return res.status(200).send(sendData)
        }
        return res.status(202).send("Phone number is allready exist or You can't add new client ")
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
                const Token = jwt.sign({id:check.phone},process.env.SECRET_KEY)
                res.cookie("access_token",Token,{secure: true,sameSite: 'none',httpOnly:true}).status(200)
                await clientSchema.findByIdAndUpdate(check._id,{$set:{token:Token}}) 
                const {password ,_id ,__v,token,...others} = check._doc
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
        return res.status(200).send(clients.reverse())
    }catch(error){
        return res.status(404).send(error)
    }

}
const getAllDueAmountClients = async(req,res,next)=>{
    try{
        const clients = await clientSchema.find();
        let i = 0;
        const filterClients = []
        while(clients.length>i){
            const BalAmou = clients[i].balanceAmount
            if(BalAmou>0){
                filterClients.push(clients[i])
            }
            i++
        }
        return res.status(200).send(filterClients)
    }catch(error){
        return res.status(404).send(error)
    }

}
const getAllDueAmcClients = async(req,res,next)=>{
    try{
        const clients = await clientSchema.find();
        let i = 0;
        const filterClients = []
        while(clients.length>i){
            const AmcStatus = clients[i].AMCStatus
            const AmcPaidList = clients[i].AMCList  
            
            let j = 0;
            while(AmcPaidList.length > j){
                const filter = AmcPaidList!=[] ? AmcPaidList[j]:null
                if(filter!= undefined){
                    const Values = Object.values(filter)
                    const currentYear = new Date().getFullYear()
                    const Status = "Paid"
                    const isIncludeCurrentYear = Values.includes(currentYear)
                    const isPaid = Values.includes(Status)
                    // console.log(isIncludeCurrentYear , isPaid , Values, currentYear,)
                    const clientId = clients[i].id
                    const DueAMC = parseInt( filter.Due)
                    const LastAMCPaidYear = filter.DateOfPaying
                    // console.log(DueAMC) 
                    if(isIncludeCurrentYear && isPaid){
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ AMCStatus:"Paid"}});
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ DueAMC}});
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ LastAMCPaidYear}});
                        

                    }
                    else if(isIncludeCurrentYear && !isPaid){
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ AMCStatus:"Due"}});
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ DueAMC}});
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ LastAMCPaidYear}});


                    }
                    else if(!isIncludeCurrentYear && !isPaid){
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ AMCStatus:"Unpaid"}});
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ DueAMC:0}});
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ LastAMCPaidYear}});


                    }
                    else{
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ AMCStatus:"Unpaid"}});
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ DueAMC}});
                        await clientSchema.findByIdAndUpdate(clientId,{$set:{ LastAMCPaidYear}});

                        

                    }
                }
                j++
            }

             
            if(AmcStatus=="Unpaid" || AmcStatus=="Due"){ 
                filterClients.push(clients[i])
            }
            i++
        }

        return res.status(200).send(filterClients)
    }catch(error){
        return res.status(404).send(error)
    }

}

const UpdateClientDetaile = async(req,res,next)=>{
    try {

        const checkClient = await clientSchema.findOne({clientId:req.body.clientId});
        const usingHolidayPackage = req.body.usingHolidayPackage;
        const AmcAmount = req.body.AmcAmount
        const PMA = parseInt(req.body.DMA)
        const noOfdays = req.body.noOfdays
        if(checkClient){
            const MembershipType = req.body.membershipType
            if(usingHolidayPackage){
                const usedDays = parseInt(usingHolidayPackage.Days, 10);
                const usedNight = parseInt(usingHolidayPackage.Nights, 10)
                // const oneDayPrice = parseInt(usingHolidayPackage.OneDayPrice, 10)
                const balanceDays = checkClient.totalAllowedDays - usedDays
                const balanceNight = checkClient.totalAllowedNights - usedNight
                // const balanceAmount = (checkClient.netAmount)-((usedDays+usedNight)*oneDayPrice)
                await clientSchema.findByIdAndUpdate(checkClient._id,{$set:{ usedDays,usedNight,balanceDays, balanceNight}});
                await clientSchema.findByIdAndUpdate(checkClient._id,{$push:{usingHolidayPackage}});
                return res.status(200).send("Booking Registered ")
                
            }
            else if(MembershipType){
                const newMembershipYear = parseInt(MembershipType.split(" ")[0])
                const getTotalAllowedDaysAndNight  = generateDaysAndNight(newMembershipYear)
                await clientSchema.findByIdAndUpdate(checkClient._id,{$set:{membershipType:MembershipType,membershipYear:newMembershipYear,totalAllowedDays:getTotalAllowedDaysAndNight.allowedDays, totalAllowedNights:getTotalAllowedDaysAndNight.allowedNight }})
                
                return res.status(200).send("New Package Updated")
            }
            else if(AmcAmount){
               
                // const currentYear = new Date().getFullYear()
                const AMC = checkClient.AMC
                const DueAMC = checkClient.DueAMC - AmcAmount
                const Status = DueAMC>0?"Due":"Paid"
                console.log(DueAMC)
                const AMCYear = parseInt(req.body.AMCYear)
                const todaysDate = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`
                const AMCObject = {AMC:AMC,Due:DueAMC,Status:Status,DateOfPaying:todaysDate ,AMCYear:AMCYear}
                await clientSchema.findByIdAndUpdate(checkClient._id,{$push:{AMCList:AMCObject},$set:{DueAMC:DueAMC}});
 
            }

            else if(PMA){
                // console.log("working")
                const paidAmount = parseInt(checkClient.paidAmount + PMA)
                // console.log(paidAmount , typeof(paidAmount) ,PMA)

                const balanceAmount = parseInt(checkClient.netAmount-paidAmount)
                // console.log(balanceAmount , typeof(balanceAmount))

                await clientSchema.findByIdAndUpdate(checkClient._id,{$set:{paidAmount ,balanceAmount}})
                // console.log("working perfect")
                
            }
            else if(noOfdays){
                const totalNoOfNights = req.body.noOfNights
                await clientSchema.findByIdAndUpdate(checkClient._id,{$set:{totalAllowedDays:noOfdays,totalAllowedNights:totalNoOfNights}})
            }
            await clientSchema.findByIdAndUpdate(checkClient._id,{$set:{...req.body}});
            return res.status(200).send("Client Updated")
        }
        return res.status(202).send("Client not found!")
    } catch (error) {
         
        return res.status(404).send(error)
    }
}

const deleteClient = async(req,res,next)=>{
    try {
        const checkClient = await clientSchema.findOne({clientId:req.params.clientId});
        if(checkClient){
            await clientSchema.findByIdAndDelete(checkClient._id);
            return res.status(200).send(`Client "${checkClient.name}" deleted!`)
        }
        return res.status(404).send("Client not found")
    } catch (error) {
        return res.status(404).send(error)
    }
}



 


module.exports  = {RegisterNewClient,LoginClient,getSingleClient,getAllClients,UpdateClientDetaile ,deleteClient ,getAllDueAmountClients,getAllDueAmcClients}