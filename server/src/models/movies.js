import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
  },
  {
    timestamps: true
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
