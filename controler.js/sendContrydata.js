const getContryState_city = require('../jsonFiles/contrydata.json')

 const GetContry_Satate_city  = async(req,res,next)=>{
    try {
        return res.status(200).send(getContryState_city)
    } catch (error) {
        return res.status(404).send(error)
    }
}

module.exports = GetContry_Satate_city