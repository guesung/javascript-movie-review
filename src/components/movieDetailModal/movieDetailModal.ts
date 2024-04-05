import './style.css';
import { DETAIL_MODAL_SKELETON, DETAIL_MODAL_TEMPLATE } from '../../constants/templates';
import { MovieDetailType } from '../../types/movie';
import { STAR_EMPTY, STAR_FILLED } from '../../images';
import { RATING_MESSAGE } from '../../constants/rating';
import { ClickedRatingValueType } from '../../types/ratings';
import rating from '../../domain/rating';
import movieData from '../../domain/movieData';

const movieDetailModal = {
  createModal() {
    return document.createElement('dialog');
  },

  insertTemplate(movie: MovieDetailType | null) {
    const dialog = document.querySelector('dialog');
    if (!movie || !dialog) return;

    const ratingValue = this.getLocalRatingValue(movie.id);
    dialog.innerHTML = DETAIL_MODAL_TEMPLATE(movie, ratingValue);
    this.setModalCloseEvent();
    this.handleRating(movie.id);
  },

  handleDetailModal(ul: HTMLElement) {
    const dialog = document.querySelector('dialog');

    if (dialog && ul) {
      ul.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLDivElement;
        if (target && target.className === 'item-list') return;

        const movieId = Number(target?.closest('a')?.getAttribute('data-id')) ?? 0;
        dialog.innerHTML = DETAIL_MODAL_SKELETON;

        movieData.getMovieDetail(movieId).then((movie: MovieDetailType | null) => {
          if (movie !== null) movieDetailModal.insertTemplate(movie);
        });
        dialog.showModal();
        this.fixBackGroundBody();
      });
    }
  },

  createModalSkeleton() {
    const dialog = document.querySelector('dialog');
    if (!dialog) return;
  },

  setModalCloseEvent() {
    const closeButton = document.querySelector('#detail-modal--close-btn');
    const dialog = document.querySelector('dialog');
    if (!closeButton || !dialog) return;

    closeButton.addEventListener('click', () => this.closeModal(dialog));
    dialog.addEventListener('click', (event: Event) => this.handleDialogClick(event, dialog));
    window.addEventListener('keydown', (event: KeyboardEvent) => this.handleKeyDown(event, dialog));
  },

  closeModal(dialog: HTMLDialogElement) {
    dialog.close();
    this.unfixBackGroundBody();
  },

  handleDialogClick(event: Event, dialog: HTMLDialogElement) {
    const { target } = event;
    if (target instanceof HTMLElement && target.nodeName === 'DIALOG') {
      this.closeModal(dialog);
    }
  },

  handleKeyDown(event: KeyboardEvent, dialog: HTMLDialogElement) {
    if (event.key === 'Escape') {
      this.unfixBackGroundBody();
      this.closeModal(dialog);
    }
  },

  handleRating(movieId: number) {
    const ratingHtml = document.querySelector('#detail-modal--rating');
    if (!ratingHtml || !(ratingHtml instanceof HTMLElement)) return;

    ratingHtml.addEventListener('click', (event: Event) => {
      const clickedRatingValue: ClickedRatingValueType = this.findClickedIndex(event, movieId);
      this.fillStars(ratingHtml, clickedRatingValue);
      this.updateRatingValue(ratingHtml, clickedRatingValue);
      this.updateRatingLabel(ratingHtml, clickedRatingValue);
    });
  },

  findClickedIndex(event: Event, movieId: number): ClickedRatingValueType {
    const target = event.target as HTMLElement;
    if (!target || target.className !== 'rating-star') return 0;

    const idAttribute = target.getAttribute('data-id');
    if (!idAttribute) return 0;
    const ratingValue: ClickedRatingValueType = Number(idAttribute) as ClickedRatingValueType;
    this.updateLocalRatingValue(movieId, ratingValue);
    return ratingValue;
  },

  fillStars(ratingHtml: HTMLElement, clickedRatingValue: ClickedRatingValueType) {
    const ratingStarList = ratingHtml.querySelectorAll('.rating-star');
    ratingStarList.forEach((star, index) => {
      const calculatedIndex = index * 2 + 1;
      star.setAttribute('src', calculatedIndex < clickedRatingValue ? STAR_FILLED : STAR_EMPTY);
    });
  },

  updateRatingValue(ratingHtml: HTMLElement, clickedRatingValue: ClickedRatingValueType) {
    const ratingValueHtml = ratingHtml.querySelector('#detail-modal--rating-value');
    if (!ratingValueHtml) return;
    ratingValueHtml.innerHTML = String(clickedRatingValue);
  },

  updateRatingLabel(ratingHtml: HTMLElement, clickedRatingValue: ClickedRatingValueType) {
    const ratingLabelHtml = ratingHtml.querySelector('#detail-modal--rating-label');
    if (!ratingLabelHtml) return;
    ratingLabelHtml.innerHTML = RATING_MESSAGE[clickedRatingValue];
  },

  getLocalRatingValue(id: number): ClickedRatingValueType {
    return rating.getLocalDataItem(id).ratingValue;
  },

  updateLocalRatingValue(id: number, ratingValue: ClickedRatingValueType) {
    rating.updateLocalData(id, ratingValue);
  },

  fixBackGroundBody() {
    const body = document.querySelector('body');
    if (!body) return;

    body.style.top = `-${window.scrollY}px`;
    body.classList.add('body-fixed');
  },

  unfixBackGroundBody() {
    const body = document.querySelector('body');
    if (!body) return;
    body.classList.remove('body-fixed');
    const scrollY = document.body.style.top;
    const scrollToOriginalY = parseInt(scrollY || '0', 10) * -1;
    window.scrollTo(0, scrollToOriginalY);
  },
};

export default movieDetailModal;
