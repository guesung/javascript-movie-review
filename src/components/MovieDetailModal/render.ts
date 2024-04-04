import { BASE_IMAGE_URL } from '../../constants/api/api';
import { Genre } from '../../types/tmdb';
import createElement from '../../utils/createElement';
import NoImage from '../ui/NoImage';
import RatingStars from '../RatingStars/RatingStarts';
import formatToDecimalPlaces from '../../utils/formatToDecimalPlaces';
import { THUMBNAIL_SIZE } from '../../constants/ui';

type MovieDetailProps = {
  id: number;
  title: string;
  poster_path: string;
  genres: Genre[];
  overview: string;
  vote_average: number;
};

const renderHandler = ({ id, title, poster_path, genres, overview, vote_average }: MovieDetailProps) => {
  const { movieDetail, movieDetailContainer } = createMovieDetailContainer();
  const genresText = genres.map(({ name }) => name).join(', ');

  const movieDetailHeader = createMovieDetailHeader(title);
  movieDetailContainer.appendChild(movieDetailHeader);

  const { movieDetailContent } = createMovieDetailContent(poster_path);
  movieDetailContainer.appendChild(movieDetailContent);

  const movieDetailInfo = createMovieDetailInfo(genresText, vote_average, overview);
  movieDetailContent.appendChild(movieDetailInfo);

  const bottomInfo = createBottomInfo(id);
  movieDetailInfo.appendChild(bottomInfo);

  document.body.appendChild(movieDetail);

  return movieDetail;
};

const createMovieDetailContainer = () => {
  const movieDetail = createElement('div', { className: 'movie-detail' });
  const movieDetailBackdrop = createElement('div', { className: 'movie-detail-backdrop' });
  const movieDetailContainer = createElement('div', { className: 'movie-detail-container' });

  movieDetail.appendChild(movieDetailBackdrop);
  movieDetail.appendChild(movieDetailContainer);

  return { movieDetail, movieDetailContainer };
};

const createMovieDetailHeader = (title: string) => {
  const movieDetailHeader = createElement('div', { className: 'movie-detail-header' });
  const movieTitle = createElement('h2', { className: 'movie-title', textContent: title });
  const closeButton = createElement('button', { className: 'close-btn', textContent: '×' });

  movieDetailHeader.appendChild(movieTitle);
  movieDetailHeader.appendChild(closeButton);

  return movieDetailHeader;
};

const createItemImage = (posterPath: string) => {
  if (posterPath === null) return NoImage();
  const imageContainer = createElement('div', { className: 'item-thumbnail-container' });
  const image = createElement('img', {
    className: 'item-thumbnail skeleton',
    src: `${BASE_IMAGE_URL}/${THUMBNAIL_SIZE}/${posterPath}`,
    alt: '',
    loading: 'lazy',
    onload: toggleSkeleton,
  });
  imageContainer.appendChild(image);

  return imageContainer;
};

const toggleSkeleton = (event: Event) => {
  const thumbnail = event.target as HTMLElement;
  thumbnail.classList.remove('skeleton');
};

const createMovieDetailContent = (posterPath: string) => {
  const movieDetailContent = createElement('div', { className: 'movie-detail-content' });
  const movieDetailThumbnail = createElement('div', { className: 'movie-detail-thumbnail' });
  const movieImage = createItemImage(posterPath);
  movieDetailThumbnail.appendChild(movieImage);
  movieDetailContent.appendChild(movieDetailThumbnail);

  return { movieDetailContent, movieDetailThumbnail };
};

const createMovieDetailInfo = (genres: string, voteAverage: number, overview: string) => {
  const movieDetailInfo = createElement('div', { className: 'movie-detail-info' });
  const movieDetailZz = createElement('div', { className: 'movie-info-container' });
  const movieOverview = createOverview(overview);
  const movieDetailDd = createElement('div', { className: 'movie-genres-and-rating' });
  const genreParagraph = createElement('p', { textContent: genres });
  const rating = createElement('div', {
    className: 'rating',
    textContent: formatToDecimalPlaces(voteAverage, 2).toString(),
  });

  movieDetailDd.appendChild(genreParagraph);
  movieDetailDd.appendChild(rating);
  movieDetailZz.appendChild(movieDetailDd);
  movieDetailZz.appendChild(movieOverview);
  movieDetailInfo.appendChild(movieDetailZz);

  return movieDetailInfo;
};

const createOverview = (overview: string) => {
  const overviewText = overview.length === 0 ? '줄거리가 아직 등록되지 않았습니다.' : overview;
  return createElement('p', { className: 'movie-detail-overview', textContent: overviewText });
};

const createBottomInfo = (id: number) => {
  const bottomInfo = createElement('div', { className: 'bottom-info' });
  const myScoreContainer = createElement('div', { className: 'my-score-container' });
  const myScoreLabel = createElement('span', { textContent: '내 별점' });

  const starsContainer = RatingStars(id);

  myScoreContainer.appendChild(myScoreLabel);
  myScoreContainer.appendChild(starsContainer);
  bottomInfo.appendChild(myScoreContainer);

  return bottomInfo;
};

export default renderHandler;
