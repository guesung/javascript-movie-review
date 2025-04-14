import { movieAPI } from '../api.js';

export class Search {
  constructor(container, onSearch) {
    this.container = container;
    this.onSearch = onSearch;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="search-container">
        <input 
          type="text" 
          class="search-input" 
          placeholder="영화 검색..."
          aria-label="영화 검색"
        />
        <button class="search-button" aria-label="검색">
          <img src="./images/search.png" alt="검색" />
        </button>
      </div>
    `;

    this.searchInput = this.container.querySelector('.search-input');
    this.searchButton = this.container.querySelector('.search-button');
  }

  setupEventListeners() {
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });

    this.searchButton.addEventListener('click', () => {
      this.handleSearch();
    });
  }

  handleSearch() {
    const query = this.searchInput.value.trim();
    if (query) {
      this.onSearch(query);
    }
  }
}