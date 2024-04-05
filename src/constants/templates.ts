import { LOGO, MODAL_CLOSE_BTN, NO_IMAGE, STAR_EMPTY, STAR_FILLED } from '../images';
import { MovieDetailType, MovieType } from '../types/movie';
import { ClickedRatingValueType } from '../types/ratings';
import { MOVIE_POSTER_PATH } from './movie';
import { RATING_MESSAGE } from './rating';

export const MOVIE_ITEM_TEMPLATE = (movie: MovieType, imagePath: string) => /* html */ `
  <li class="movie-item">
    <a data-id=${movie.id}>
      <div class="item-card">
        <img
          class="item-thumbnail"
          src="${imagePath}"
          loading="lazy"
          alt="${movie.title}"
        />
        <p class="item-title">${movie.title}</p>
        <p class="item-score">
          ${movie.vote_average.toFixed(1)}<img src=${STAR_FILLED} alt="별점" />
        </p>
      </div>
    </a>
  </li>  
`;

export const SKELETON_ITEM_TEMPLATE = /* html */ `
<li class="li--skeleton">
  <a>
    <div class="item-card">
      <div class="item-thumbnail skeleton"></div>
      <div class="item-title skeleton"></div>
      <div class="item-score skeleton"></div>
    </div>
  </a>
</li>  
`;

export const HEADER_TEMPLATE = /* html */ `
<h1><img src=${LOGO} id="logo-img" alt="MovieList 로고" /></h1>
<form class="search-form" id="search-form">
  <input type="search" class="search-input" name="search" id="search" placeholder="검색" />
  <button type="submit" class="search-button">검색</button>
</form>
`;

export const DETAIL_MODAL_TEMPLATE = (
  movie: MovieDetailType,
  ratingValue: ClickedRatingValueType,
) => /* html */ `
  <div id="detail-modal--header" class="detail-modal--header">
    <div id="detail-modal--title" class="detail-modal--title">${movie.title}</div>  
    <div id="detail-modal--close-btn" class="detail-modal--close-btn"><img src="${MODAL_CLOSE_BTN}" alt="닫기"/></div>
  </div>
  <div id="detail-modal--body" class="detail-modal--body">
    <img id="detail-modal--body-img" class="detail-modal--body-img" src="${
      movie.poster_path ? `${MOVIE_POSTER_PATH}/${movie.poster_path}` : NO_IMAGE
    }"/>
    <div id="detail-modal--contents" class="detail-modal--contents">
      <div id="detail-modal--info" class="detail-modal--info">
        <div id="detail-modal--info-header" class="detail-modal--info-header">
          <div id="detail-modal--genre" clas="detail-modal--genre">${
            movie.genres.length !== 0
              ? movie.genres.map((genre) => genre.name).join(', ')
              : '장르가 없습니다.'
          }</div>
          <div id="detail-modal--vote" class="detail-modal--vote"><img src="${STAR_FILLED}"/>${movie.vote_average.toFixed(
  1,
)}</div>
        </div>
        <div id="detail-modal--overview" class="detail-modal--overview">${
          movie.overview ? movie.overview : '등록된 줄거리가 없습니다.'
        }</div>
      </div>
      <div id="detail-modal--rating" class="detail-modal--rating">
        <div id="detail-modal--label" class="detail-modal--label">내 별점</div>
        <div id="detail-modal--rating-stars" class="detail-modal--rating-stars">
        ${Array.from({ length: 5 }, (_, index) => {
          const starIndex = (index + 1) * 2;
          return `<img src="${
            ratingValue >= starIndex ? STAR_FILLED : STAR_EMPTY
          }" class="rating-star" data-id="${starIndex}" alt="별점"/>`;
        }).join('')}
        </div>
        <div id="detail-modal--rating-value" class="detail-modal--rating-value">${ratingValue}</div>
        <div id="detail-modal--rating-label" class="detail-modal--rating-label">${
          RATING_MESSAGE[ratingValue]
        }</div>
      </div>
    </div>
  </div>
`;

export const DETAIL_MODAL_SKELETON = /* html */ `
  <div id="detail-modal--header" class="detail-modal--header detail-modal--header-skeleton">
    <div id="detail-modal--title" class="detail-modal--title skeleton"></div>  
    <div id="detail-modal--close-btn" class="detail-modal--close-btn"></div>  
  </div>
  <div id="detail-modal--body" class="detail-modal--body">
    <div id="detail-modal--body-img" class="detail-modal--body-img skeleton"></div>
    <div id="detail-modal--contents" class="detail-modal--contents">
      <div id="detail-modal--info" class="detail-modal--info">
        <div id="detail-modal--info-header" class="detail-modal--info-header skeleton">
          <div id="detail-modal--genre" class="detail-modal--genre"></div>
          <div id="detail-modal--vote" class="detail-modal--vote"></div>
        </div>
        <div id="detail-modal--overview" class="detail-modal--overview skeleton"></div>
      </div>
      <div id="detail-modal--rating" class="detail-modal--rating skeleton">
        <div id="detail-modal--label" class="detail-modal--label"></div>
        <div id="detail-modal--rating-stars" class="detail-modal--rating-stars"></div>
        <div id="detail-modal--rating-value" class="detail-modal--rating-value"></div>
        <div id="detail-modal--rating-label" class="detail-modal--rating-label"></div>
      </div>
    </div>
  </div>
`;
