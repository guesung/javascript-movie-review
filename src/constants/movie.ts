export const MOVIE_POSTER_PATH = 'https://image.tmdb.org/t/p/w220_and_h330_face';
export const API_PATH = 'https://api.themoviedb.org/3';

export const RENDER_TYPE = {
  POPULAR: 'popular',
  SEARCH: 'search',
} as const;

export const POPULAR_MOVIE_TITLE = '지금 인기 있는 영화';
export const SEARCH_MOVIE_TITLE = (movieName: string) => `"${movieName}" 검색 결과`;
