
import express from 'express';
import asyncHandler from 'express-async-handler';
import { getTvShows, getTvListings, getShow } from '../tmdb-api'

const router = express.Router(); 

router.get('/tmdb/tvshows', asyncHandler( async(req, res) => {
    const shows = await getTvShows();
    res.status(200).json(shows);
  }));

  router.get('/tmdb/listings', asyncHandler( async(req, res) => {
    const listings = await getTvListings();
    res.status(200).json(listings);
  }));

  router.get('/tmdb/tvshows/:id', asyncHandler( async(req, res) => {
    const id = parseInt(req.params.id);
    const show = await getShow(id);
    res.status(200).json(show);
  }));
  export default router;

