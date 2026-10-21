import Movie from '../models/movies.js';

// Add a new movie
export const addMovie = async (req, res) => {
  try {
    const { title, poster, description, duration, genre, date } = req.body;

    const newMovie = new Movie({
      title,
      poster,
      description,
      duration,
      genre,
      date
    });

    const savedMovie = await newMovie.save();

    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add movie', error });
  }
};

// Update a movie
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, poster, description, duration, genre, date } = req.body;

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, poster, description, duration, genre, date },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie', error });
  }
};

// Delete a movie
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete movie', error });
  }
};

// Get all movies
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error });
  }
};

// Get a single movie by ID
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie', error });
  }
};
