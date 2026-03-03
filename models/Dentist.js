const mongoose = require('mongoose');

const DentistSchema = new mongoose.Schema(
  {
    dentist_name: {
      type: String,
      required: [true, 'Please add dentist name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    year_of_experience: {
      type: Number,
      required: [true, 'Please add years of experience']
    },
    area_of_expertise: {
      type: String,
      required: [true, 'Please add area of expertise']
    }
  },
  {
    timestamps: true
  }
);

// Reverse populate (optional but good practice)
DentistSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'dentist',
  justOne: false
});

module.exports = mongoose.model('Dentist', DentistSchema);