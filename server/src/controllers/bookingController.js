import Booking from "../models/bookings.js";
import Show from "../models/show.js";
import { EmailHelper } from "../utils/emailHelper.js";

export const bookShow = async (req, res) => {
  try {
    const { showId, seats, transactionId } = req.body;
    const userId = req.userId;

    if (!showId || !Array.isArray(seats) || seats.length === 0 || !transactionId) {
      return res.status(400).json({ message: "showId, seats and transactionId are required" });
    }

    // 1. Block reuse of a payment transaction
    const existingBooking = await Booking.findOne({ transactionId });

    if(existingBooking) {
      return res.status(409).json({
        message: "This transaction has already been used for a booking",
      });
    }

    // 2. Reserve seats only if none are already booked
    const updatedShow = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: seats } },
      { $addToSet: { bookedSeats: { $each: seats } } },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        message: "One or more selected seats are already booked",
      });
    }

    try {
      const booking = new Booking({
        show: showId,
        user: userId,
        seats,
        transactionId,
      });
      await booking.save();


      const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name address" },
        ],
      })
      .populate("user");

    // 4. Send ticket email using the template
    await EmailHelper("ticket.html", populatedBooking.user.email, {
        userName: booking.user.name,
        showName: populatedBooking.show.movie.title,
        showDate: populatedBooking.show.date,
        showTime: populatedBooking.show.time,
        venueName: populatedBooking.show.theater.name,
        seats: populatedBooking.seats.join(", "),
        totalPrice: populatedBooking.show.ticketPrice,
        bookingId: booking._id,
        transactionId: booking.transactionId,
      },
    );

    } catch (saveError) {
      // Roll back the seat reservation if the booking fails to save
      await Show.updateOne(
        { _id: showId },
        { $pull: { bookedSeats: { $in: seats } } }
      );
      throw saveError;
    }

    res.status(201).json({ message: "Booking successful" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to book show",
      error: error.message,
    });
  }
};


export const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("USer: ", userId)

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not found in token" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        select: "date time ticketPrice movie theater bookedSeats",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name address" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};
