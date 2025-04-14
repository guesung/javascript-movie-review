import { MovieList } from './components/MovieList.js';
import { Search } from './components/Search.js';
import { Modal } from './components/Modal.js';

class App {
  constructor() {
    this.movieList = null;
    this.search = null;
    this.modal = null;
    this.init();
  }

  init() {
    // Initialize components
    const movieListContainer = document.querySelector('main section');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-wrapper';
    movieListContainer.insertBefore(searchContainer, movieListContainer.firstChild);

    this.movieList = new MovieList(movieListContainer);
    this.search = new Search(searchContainer, this.handleSearch.bind(this));
    this.modal = new Modal();

    // Setup event listeners
    this.setupEventListeners();

    // Load initial movies
    this.movieList.loadMoreMovies();
  }

  setupEventListeners() {
    // Movie item click event
    document.addEventListener('click', (e) => {
      const movieItem = e.target.closest('.item');
      if (movieItem) {
        const movieId = movieItem.dataset.movieId;
        if (movieId) {
          this.modal.show(movieId);
        }
      }
    });

    // Tab click events
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleTabClick(tab);
      });
    });
  }

  handleTabClick(selectedTab) {
    // Remove selected class from all tabs
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.classList.remove('selected');
    });

    // Add selected class to clicked tab
    selectedTab.classList.add('selected');

    // Reset movie list and load new movies
    this.movieList.page = 1;
    this.movieList.movies = [];
    this.movieList.hasMore = true;
    this.movieList.loadMoreMovies();
  }

  handleSearch(query) {
    // Reset movie list
    this.movieList.page = 1;
    this.movieList.movies = [];
    this.movieList.hasMore = true;

    // Load search results
    this.movieList.loadMoreMovies();
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});