import { movieAPI } from '../api.js';

export class MovieList {
  constructor(container) {
    this.container = container;
    this.page = 1;
    this.loading = false;
    this.hasMore = true;
    this.movies = [];
    this.setupInfiniteScroll();
  }

  setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        !this.loading &&
        this.hasMore
      ) {
        this.loadMoreMovies();
      }
    });
  }

  async loadMoreMovies() {
    if (this.loading) return;

    this.loading = true;
    this.showSkeletonLoader();
    this.hideError(); // 이전 에러 메시지 제거

    try {
      const response = await movieAPI.fetchPopularMovies(this.page);
      this.movies = [...this.movies, ...response.results];
      this.hasMore = this.page < response.total_pages;
      this.page++;
      this.render();
    } catch (error) {
      this.showError(error.message || '영화 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      this.loading = false;
      this.hideSkeletonLoader();
    }
  }

  showSkeletonLoader() {
    const skeletons = Array(4).fill(0).map(() => `
      <li class="skeleton-item">
        <div class="skeleton-thumbnail"></div>
        <div class="skeleton-desc">
          <div class="skeleton-rate"></div>
          <div class="skeleton-title"></div>
        </div>
      </li>
    `).join('');

    const skeletonContainer = document.createElement('ul');
    skeletonContainer.className = 'thumbnail-list skeleton';
    skeletonContainer.innerHTML = skeletons;
    this.container.appendChild(skeletonContainer);
  }

  hideSkeletonLoader() {
    const skeleton = this.container.querySelector('.skeleton');
    if (skeleton) {
      skeleton.remove();
    }
  }

  showError(message) {
    // 기존 에러 메시지 제거
    this.hideError();
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
      <p>${message}</p>
      <button class="retry-button">다시 시도</button>
    `;
    
    // 재시도 버튼 이벤트 리스너 추가
    const retryButton = errorElement.querySelector('.retry-button');
    retryButton.addEventListener('click', () => {
      this.hideError();
      this.loadMoreMovies();
    });
    
    this.container.appendChild(errorElement);
  }

  hideError() {
    const errorElement = this.container.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  render() {
    const movieElements = this.movies.map(movie => `
      <li>
        <div class="item" data-movie-id="${movie.id}">
          <img
            class="thumbnail"
            src="${movieAPI.getImageUrl(movie.poster_path, 'medium', 'poster')}"
            alt="${movie.title}"
            loading="lazy"
            onerror="this.src='/images/no-image.png'"
          />
          <div class="item-desc">
            <p class="rate">
              <img src="/images/star_empty.png" class="star" />
              <span>${movie.vote_average.toFixed(1)}</span>
            </p>
            <strong>${movie.title}</strong>
          </div>
        </div>
      </li>
    `).join('');

    const listContainer = document.createElement('ul');
    listContainer.className = 'thumbnail-list';
    listContainer.innerHTML = movieElements;
    
    // Replace existing content if it's the first page, otherwise append
    if (this.page === 2) {
      this.container.innerHTML = '';
      this.container.appendChild(listContainer);
    } else {
      const existingList = this.container.querySelector('.thumbnail-list');
      if (existingList) {
        existingList.insertAdjacentHTML('beforeend', movieElements);
      } else {
        this.container.appendChild(listContainer);
      }
    }
  }
}