const Booking = require('../models/Booking');
const Dentist = require('../models/Dentist');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
exports.getBookings = async (req, res) => {
  try {
    let query;

    if (req.params.dentistId) {
      query = Booking.find({ dentist: req.params.dentistId });
    } else if (req.user.role !== 'admin') {
      query = Booking.find({ user: req.user.id });
    } else {
      query = Booking.find();
    }

    const bookings = await query.populate({
      path: 'dentist',
      select: 'name year_of_experience area_of_expertise'
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot get bookings"
    });
  }
};


// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'dentist',
      select: 'name year_of_experience area_of_expertise'
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot find booking"
    });
  }
};


// @desc    Add booking
// @route   POST /api/v1/dentists/:dentistId/bookings
exports.addBooking = async (req, res) => {
  try {
    req.body.dentist = req.params.dentistId;
    req.body.user = req.user.id;

    const dentist = await Dentist.findById(req.params.dentistId);
    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `No dentist with id ${req.params.dentistId}`
      });
    }

    const existing = await Booking.find({ user: req.user.id });

    if (existing.length >= 1 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: "User already has a booking"
      });
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot create booking"
    });
  }
};


// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot update booking"
    });
  }
};


// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot delete booking"
    });
  }
};