import Show from "../models/show.js";

export const addShow = async (req, res) => {
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

    // Match movie and date as string directly
    const filter = { 
      movie: movieId,
      date: date  // string match: '2026-10-22'
    };

    const shows = await Show.find(filter)
      .populate("theater")
      .sort({ time: 1 });

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

export const getShowById = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findById(id).populate("movie theater");

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.status(200).json(show);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch show', error });
  }
};
