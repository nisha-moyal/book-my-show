import express from 'express';
import {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovies,
  getMovieById
} from '../controllers/moviesController.js';

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', addMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export default router;
