const Appointment = require('../models/Appointment');
const Dentist = require('../models/Dentist');


// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    let query;

    // Admin ดูได้ทั้งหมด
    if (req.user.role === 'admin') {
      if (req.params.dentistId) {
        query = Appointment.find({ dentist: req.params.dentistId });
      } else {
        query = Appointment.find();
      }
    } 
    // User ดูได้เฉพาะของตัวเอง
    else {
      query = Appointment.find({ user: req.user.id });
    }

    const appointments = await query.populate({
      path: 'dentist',
      select: 'dentist_name year_of_experience area_of_expertise'
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot find Appointment"
    });
  }
};


// @desc    Get single appointment
// @route   GET /api/v1/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: 'dentist',
      select: 'dentist_name year_of_experience area_of_expertise'
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No Appointment with the id of ${req.params.id}`
      });
    }

    // อนุญาตเฉพาะเจ้าของหรือ admin
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized`
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot find Appointment"
    });
  }
};


// @desc    Add appointment
// @route   POST /api/v1/dentists/:dentistId/appointments
// @access  Private
exports.addAppointment = async (req, res, next) => {
  try {
    req.body.dentist = req.params.dentistId;

    const dentist = await Dentist.findById(req.params.dentistId);
    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `No Dentist with the id of ${req.params.dentistId}`
      });
    }

    // เพิ่ม user id ลง body
    req.body.user = req.user.id;

    // ✅ จำกัด 1 appointment ต่อ 1 user
    const existedAppointment = await Appointment.findOne({ user: req.user.id });

    if (existedAppointment && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User already has an appointment'
      });
    }

    const appointment = await Appointment.create(req.body);

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot create Appointment"
    });
  }
};


// @desc    Update appointment
// @route   PUT /api/v1/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`
      });
    }

    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot update Appointment"
    });
  }
};


// @desc    Delete appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`
      });
    }

    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot delete Appointment"
    });
  }
};