import { MovieData } from './apiType';
import { throwError } from './errorStatus';
import { wrappingMovieAPI } from './wrappingAPI';

import { CONSTANT_URL, URL_LANGUAGE } from '../constant/api';

export const getPopularMovieList = async (page = 1): Promise<MovieData[]> => {
  const url = `${CONSTANT_URL.popularMovie}?${URL_LANGUAGE}&page=${page}`;
  const movieData = await throwError(url);

  const dataCleaning = movieData.results.map((movieData: MovieData) => {
    return wrappingMovieAPI(movieData);
  });

  return dataCleaning;
};
