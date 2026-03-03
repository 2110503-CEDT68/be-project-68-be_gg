const mongoose = require('mongoose');

const DentistSchema = new mongoose.Schema({
    name:{
        type:String,
        require: [true,'Please add a name'],
        unique:true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 chracters']
    },
    year_of_experience:{
        type:Number,
        require: [true,'Please add a year of experience']
    },
    area_of_expertise:{
        type:String,
        require: [true,'Please add an area of expertise']
    },
},{toJSON: {virtuals:true},
        toObject: {virtuals:true}});

//Reverse populate with virtuals
DentistSchema.virtual('bookings',{
    ref:'Booking',
    localField:'_id',
    foreignField:'dentist',
    justOne:false
})
module.exports=mongoose.model('Dentist',DentistSchema);