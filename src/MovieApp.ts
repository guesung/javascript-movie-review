import './reset.css';
import './app.css';

import Header from './components/Header/Header';
import MovieItems from './components/MovieItems/MovieItems';
import Fallback from './components/Fallback/Fallback';
import MovieDetailModal from './components/MovieDetailModal/MovieDetailModal';

import { MatchedMoviesService, PopularMoviesService } from './services/MovieService';

import MovieGenresCollection from './domain/MovieGenresCollection';

import FloatingButton from './imgs/floating_button.svg';

type AppEvents = 'GetPopularMovies' | 'GetMatchedMovies' | 'APIError' | 'toggleMovieDetailModal';

const IS_SET_EVENT_LISTENERS_TABLE: Record<AppEvents, boolean> = {
  GetPopularMovies: false,
  GetMatchedMovies: false,
  APIError: false,
  toggleMovieDetailModal: false,
};

class MovieApp {
  private body = document.querySelector('body') as HTMLBodyElement;
  private header = new Header();
  private movieItems = new MovieItems();
  private movieDetailModal = new MovieDetailModal();
  private fallback = new Fallback();
  private isSetEventListeners = IS_SET_EVENT_LISTENERS_TABLE;

  constructor() {
    this.createElements();
    this.setEventListeners();
    MovieGenresCollection.initialize();
  }

  createElements() {
    this.body.appendChild(this.header.getElement());
    this.body.appendChild(this.movieItems.getElement());
    this.body.appendChild(this.movieDetailModal.getElement());
    this.body.appendChild(this.fallback.getElement());
    this.body.appendChild(this.createFloatingButton());
  }

  createFloatingButton() {
    const button = document.createElement('button');
    const image = document.createElement('img');
    image.src = FloatingButton;
    image.classList.add('floating-button-image');
    button.appendChild(image);
    button.classList.add('floating-button');
    button.addEventListener('click', () => {
      window.scrollTo(0, 0);
    });

    return button;
  }

  setEventListeners() {
    this.setGetPopularMoviesEventListener();
    this.setGetMatchedMoviesEventListener();
    this.setAPIErrorEventListener();
    this.setToggleMovieDetailModalEventListener();
  }

  setGetPopularMoviesEventListener() {
    if (this.isSetEventListeners.GetPopularMovies) return;
    document.addEventListener('GetPopularMovies', () => {
      this.movieItems.moviesService = new PopularMoviesService();

      this.reLoad();
    });
    this.isSetEventListeners.GetPopularMovies = true;
  }

  setGetMatchedMoviesEventListener() {
    if (this.isSetEventListeners.GetMatchedMovies) return;
    document.addEventListener('GetMatchedMovies', (event) => {
      if (!(event instanceof CustomEvent)) return;
      const { query } = event.detail;

      this.movieItems.moviesService = new MatchedMoviesService(query);
      this.reLoad();
    });
    this.isSetEventListeners.GetMatchedMovies = true;
  }

  setAPIErrorEventListener() {
    if (this.isSetEventListeners.APIError) return;
    document.addEventListener('APIError', (event) => {
      if (!(event instanceof CustomEvent)) return;
      const main = this.body.querySelector('.item-view') as HTMLElement;
      main.innerHTML = '';
      this.fallback.setFallbackMessage(event.detail.message);
      this.fallback.toggleHidden();
    });
    this.isSetEventListeners.APIError = true;
  }

  setToggleMovieDetailModalEventListener() {
    if (this.isSetEventListeners.toggleMovieDetailModal) return;
    document.addEventListener('toggleMovieDetailModal', (event) => {
      if (!(event instanceof CustomEvent)) return;
      this.movieDetailModal.setMovieDetail(event.detail.value);
      this.movieDetailModal.toggleModal();
    });
    this.isSetEventListeners.toggleMovieDetailModal = true;
  }

  reLoad() {
    const fallback = this.body.querySelector('.fallback') as HTMLElement;
    if (!fallback.classList.contains('fallback--hidden')) {
      this.fallback.toggleHidden();
      this.movieItems.createTemplate();
    }
    this.movieItems.resetMovieItems();
  }
}

export default MovieApp;
