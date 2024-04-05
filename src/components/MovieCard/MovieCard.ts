import { Movie } from '../../index.d';
import starFilledImg from '../../images/star_filled.png';
import './MovieCard.css';
import DetailModal from '../DetailModal/DetailModal';

interface Props {
  classes?: string[];
  movie?: Movie;
}

export default class MovieCard {
  #liElement = document.createElement('li');

  #movie;

  constructor({ classes, movie }: Props) {
    this.#liElement.classList.add('item-card');
    if (classes) this.#liElement.classList.add(...classes);
    if (movie) {
      this.#movie = movie;
      this.#generateMovieItem(this.#movie);
    } else {
      this.#generateSkeletonMovieItem();
    }
    this.#addDetailModalEvent();
  }

  /* eslint-disable max-lines-per-function */
  #generateMovieItem(movie: Movie) {
    const element = /* html */ ` 
      <img
        class="item-thumbnail"
        src="https://image.tmdb.org/t/p/w220_and_h330_face${movie.poster_path}"
        loading="lazy"
        alt="${movie.title}"
      />
      <p class="item-title">${movie.title}</p>
      <p class="item-score">${movie.vote_average.toFixed(2)}<img src="${starFilledImg}" alt="별점" class="star-start" /></p>
     `;

    this.#liElement.innerHTML = element;
  }

  #generateSkeletonMovieItem() {
    const element = /* html */ ` 
      <div class="item-thumbnail skeleton"></div>
      <div class="item-title skeleton"></div>
      <div class="item-score skeleton"></div>
     `;

    this.#liElement.innerHTML = element;
  }

  #addDetailModalEvent() {
    const modal = document.querySelector('dialog');

    if (modal) {
      this.#liElement.addEventListener('click', () => {
        modal.innerHTML = '';
        const modalContent = new DetailModal(this.#movie as Movie);

        modal.showModal();
      });
    }
  }

  get element() {
    return this.#liElement;
  }
}
