const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name:{
        type:String,
        require: [true,'Please add a name'],
        unique:true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 chracters']
    },
    address:{
        type:String,
        require: [true,'Please add an address']
    },
    district:{
        type:String,
        require: [true,'Please add a district']
    },
    province:{
        type:String,
        require: [true,'Please add a province']
    },
    postalcode:{
        type:String,
        require: [true,'Pleae add a postalcode'],
        maxlength:[5,'Postal Code can not be more than 5 digits']
    },
    tel:{
        type:String
    },
    region:{
        type:String,
        require: [true,'Please add a region']
    }
},{toJSON: {virtuals:true},
        toObject: {virtuals:true}});

//Reverse populate with virtuals
HospitalSchema.virtual('appointments',{
    ref:'Appointment',
    localField:'_id',
    foreignField:'hospital',
    justOne:false
})
module.exports=mongoose.model('Hospital',HospitalSchema);