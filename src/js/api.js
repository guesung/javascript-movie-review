// TMDB API Configuration
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// API Endpoints
const ENDPOINTS = {
  popularMovies: '/movie/popular',
  searchMovies: '/search/movie',
  movieDetails: '/movie',
};

// Image Sizes
const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  }
};

// API Options
const API_OPTIONS = {
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

class MovieAPI {
  constructor() {
    if (!API_KEY) {
      throw new Error('TMDB API Key is not configured');
    }
  }

  async fetchPopularMovies(page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}${ENDPOINTS.popularMovies}?language=ko-KR&page=${page}`,
        API_OPTIONS
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status_message || 'Failed to fetch popular movies');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  async searchMovies(query, page = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}${ENDPOINTS.searchMovies}?language=ko-KR&query=${encodeURIComponent(query)}&page=${page}`,
        API_OPTIONS
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status_message || 'Failed to search movies');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId) {
    try {
      const response = await fetch(
        `${BASE_URL}${ENDPOINTS.movieDetails}/${movieId}?language=ko-KR`,
        API_OPTIONS
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status_message || 'Failed to fetch movie details');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  getImageUrl(path, size = 'original', type = 'poster') {
    if (!path) return null;
    const imageSize = IMAGE_SIZES[type][size] || IMAGE_SIZES[type].original;
    return `${IMAGE_BASE_URL}/${imageSize}${path}`;
  }
}

export const movieAPI = new MovieAPI();