const requestHolidaySchema = require('../model/requestHoliday.js');

const CreateRequest = async(req,res,next)=>{
    try {
            
            const newRequest = new requestHolidaySchema({...req.body});
            await newRequest.save();
            return res.status(200).send("Request sended")
    } catch (error) {
        console.log(error)
        return res.status(404).send(error)
    }
}
 
const GetAllRequest = async(req,res,next)=>{
    try {
        const status = req.params.status
        const requests = await requestHolidaySchema.find({status:status});
        return res.status(200).send(requests.reverse())
    } catch (error) {
        return res.status(404).send(error)
    }
}

const DeleteRequest = async(req,res,next)=>{
    try {
        const Id = req.body.id
        await requestHolidaySchema.findByIdAndDelete(Id);
        return res.status(200).send("Request Deleted")
    } catch (error) {
        return res.status(404).send(error)
    }
}
const UpdateRequest = async(req,res,next)=>{
    try {
        const Id = req.body.id
        await requestHolidaySchema.findByIdAndUpdate(Id,{$set:{...req.body}});
        return res.status(200).send("Request Updated")
    } catch (error) {
        return res.status(404).send(error)
    }
}

module.exports = {CreateRequest,GetAllRequest,DeleteRequest,UpdateRequest}