import isElement from '../../utils/isElement';
import isHTMLElement from '../../utils/isHTMLElement';
import Modal from '../Modal/Modal';
import { MovieDetailProps } from '../../types/movie';
import MovieStorageService from '../../services/MovieStorageService';

/* eslint-disable max-lines-per-function */

const renderDetailModal = (movieDetailData: MovieDetailProps) => {
  const { title, genres, vote_average, poster_path, overview, star_rating } = movieDetailData;
  Modal({
    title,
    genres,
    vote_average,
    poster_path,
    overview,
    star_rating,
  });
};

const getMovieDataByIdAndRender = async (movieId: number) => {
  const movieDetailData = await MovieStorageService.getDataFromMovieId(movieId);
  if (!movieDetailData) return;

  renderDetailModal(movieDetailData);
};

const getMovieTitleFromMovieId = async (event: Event, ul: Element) => {
  if (!(event.target instanceof Element)) return;

  const li = event.target.closest('li');
  if (!isHTMLElement(li)) return;

  if (li && ul.contains(li)) {
    const movieId = Number(li.dataset.id);
    await getMovieDataByIdAndRender(movieId);
  }
};

const onClickMovieListItem = (ul: Element) => {
  ul.addEventListener('click', (event) => getMovieTitleFromMovieId(event, ul));
};

const onRenderMovieDetailModal = () => {
  const ul = document.querySelector('.item-list');
  if (!isElement(ul)) return;

  onClickMovieListItem(ul);
};

export default onRenderMovieDetailModal;
