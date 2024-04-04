const BASE_URL = process.env.BASE_URL;

export const API_URL = {
  MOVIES: `${BASE_URL}/movie/`,
  POPULAR_MOVIES: `${BASE_URL}/movie/popular`,
  SEARCH_MOVIES: `${BASE_URL}/search/movie`,
};

export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w220_and_h330_face/';
