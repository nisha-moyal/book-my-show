import Show from "../models/show.js";

export const addShow = async (req, res) => {
  console.log("addShow: ", req.body);

  try {
    const show = await Show.create(req.body);
    console.log("Show created successfully");
    res.status(201).json(show);
  } catch (err) {
    console.log("Show creation failed");
    res.status(500).json({ message: err.message });
  }
};

export const getShowByMovie = async (req, res) => {
  try {
    const { movieId, date } = req.query;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

    const shows = await Show.find({
      movie: movieId,
      date: date,
    }).populate("theater");

    res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shows",
      error: error.message,
    });
  }
};

export const getShowByTheater = async (req, res) => {
  try {
    const { theaterId } = req.query;

    if (!theaterId) {
      return res.status(400).json({
        success: false,
        message: "Theater ID is required",
      });
    }

    const shows = await Show.find({
      theater: theaterId,
    }).populate("movie");

    res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shows",
      error: error.message,
    });
  }
};
