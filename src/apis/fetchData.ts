import toast from '../components/toast/toast';
import { MOVIE_SEARCH_URL, NETWORK_ERROR_MESSAGE, POPULAR_MOVIES_URL } from '../constants/constant';
import { mapDataToMovies } from '../domain/MovieService';
import { MovieAPIResponse, UrlParams } from '../interface/Movie';

const API_KEY: string | undefined = process.env.API_KEY;

export async function fetchPopularMovieList(pageNumber: number): Promise<MovieAPIResponse> {
  try {
    const popularMovies = await buildData(
      { api_key: API_KEY, language: 'ko-KR', page: pageNumber.toString() } as UrlParams,
      POPULAR_MOVIES_URL,
    );

    return [mapDataToMovies(popularMovies), popularMovies.total_pages, popularMovies.total_results];
  } catch (error) {
    toast(NETWORK_ERROR_MESSAGE);
    return [[], 0, 0];
  }
}

export async function fetchSearchMovieList(inputValue: string, pageNumber: number): Promise<MovieAPIResponse> {
  try {
    const searchMovies = await buildData(
      { query: inputValue, api_key: API_KEY, language: 'ko-KR', page: pageNumber.toString() } as UrlParams,
      MOVIE_SEARCH_URL,
    );
    return [mapDataToMovies(searchMovies), searchMovies.total_pages, searchMovies.total_results];
  } catch (error) {
    toast(NETWORK_ERROR_MESSAGE);
    return [[], 0, 0];
  }
}

async function buildData(urlParams: UrlParams, baseURL: string) {
  const targetMovieUrl = baseURL + '?' + new URLSearchParams(urlParams);
  const response = await fetch(targetMovieUrl);
  console.log(response);
  if (!response.ok) {
    await response.json();
    throw new Error(NETWORK_ERROR_MESSAGE);
  }
  const jsonData = await response.json();
  return jsonData;
}
