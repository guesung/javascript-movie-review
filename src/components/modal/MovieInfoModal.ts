import { MOVIE_INFO_COMMON_CLASS, NONE_MOVIE_INFO } from '../../constants';
import { MovieInfo } from '../../type/movie';
import { createElementWithAttribute } from '../../utils';
import { MovieImg, MovieScore, MovieTitle, UserScore } from '../movie';

import ModalContainerController from './controller/ModalContainerController';
import ModalCloseButton from './ModalCloseButton';
import ModalContainer from './ModalContainer';

class MovieInfoModal {
  #movieInfo: MovieInfo;
  #element: HTMLElement;

  constructor(movieInfo: MovieInfo) {
    this.#movieInfo = movieInfo;
    this.#element = this.#makeMovieInfoModal();
    this.#renderMovieInfoModal();
  }

  #makeMovieInfoModal() {
    const $movieInfoModal = createElementWithAttribute('div', {
      class: MOVIE_INFO_COMMON_CLASS,
    });

    const $movieInfoModalInner = this.#makeMovieInfoInner();
    $movieInfoModal.appendChild($movieInfoModalInner);

    return $movieInfoModal;
  }

  #makeMovieGenreEl() {
    const { genres } = this.#movieInfo;

    const $genreBox = createElementWithAttribute('span', {
      class: `${MOVIE_INFO_COMMON_CLASS}__genre`,
    });

    $genreBox.textContent = genres
      ? genres.map((i) => i.name).join(', ')
      : NONE_MOVIE_INFO.genre;

    return $genreBox;
  }

  #makeMovieInfoInner() {
    const $movieInfoInner = createElementWithAttribute('div', {
      class: `${MOVIE_INFO_COMMON_CLASS}__inner`,
    });

    $movieInfoInner.appendChild(this.#makeHeader());
    $movieInfoInner.appendChild(this.#makeMovieInfoContents());

    return $movieInfoInner;
  }

  #makeMovieInfoContents() {
    const $movieInfoContents = createElementWithAttribute('div', {
      class: `${MOVIE_INFO_COMMON_CLASS}__inner__contents`,
    });

    $movieInfoContents.appendChild(
      new MovieImg({ ...this.#movieInfo }).element,
    );
    $movieInfoContents.appendChild(this.#makeMovieDescription());

    return $movieInfoContents;
  }

  #makeHeader() {
    const $h2 = createElementWithAttribute('div', {
      class: `${MOVIE_INFO_COMMON_CLASS}__inner__header`,
    });

    $h2.appendChild(new MovieTitle(this.#movieInfo.title).element);
    $h2.appendChild(new ModalCloseButton().element);

    return $h2;
  }

  #makeMovieDescription() {
    const $description = createElementWithAttribute('div', {
      class: `${MOVIE_INFO_COMMON_CLASS}__description`,
    });

    $description.appendChild(this.#makeMovieDescriptionTop());
    $description.appendChild(this.#makeMovieDescriptionOverView());
    $description.appendChild(new UserScore(this.#movieInfo.id).element);

    return $description;
  }

  #makeMovieDescriptionTop() {
    const $top = createElementWithAttribute('section', {
      class: `${MOVIE_INFO_COMMON_CLASS}__description__top`,
    });
    const $genreBox = this.#makeMovieGenreEl();
    const $movieScore = new MovieScore(this.#movieInfo.vote_average).element;

    if ($genreBox) {
      $top.appendChild($genreBox);
    }
    $top.appendChild($movieScore);

    return $top;
  }

  #makeMovieDescriptionOverView() {
    const $overView = createElementWithAttribute('section', {
      class: `${MOVIE_INFO_COMMON_CLASS}__description__overview`,
    });
    $overView.textContent =
      this.#movieInfo.overview || NONE_MOVIE_INFO.overview;

    return $overView;
  }

  //render modal
  #renderMovieInfoModal() {
    new ModalContainer({
      $children: this.#element,
      isKeepExistingModal: true,
    });
    ModalContainerController.changePosition();
  }
}

export default MovieInfoModal;
