import { movieAPI } from '../api.js';

export class Modal {
  constructor() {
    this.modal = null;
    this.setupModal();
    this.setupEventListeners();
  }

  setupModal() {
    const modalTemplate = `
      <div class="modal" role="dialog" aria-modal="true" hidden>
        <div class="modal-overlay"></div>
        <div class="modal-container">
          <button class="modal-close" aria-label="닫기">×</button>
          <div class="modal-content">
            <div class="movie-details">
              <div class="movie-poster">
                <img src="" alt="" />
              </div>
              <div class="movie-info">
                <h2 class="movie-title"></h2>
                <div class="movie-meta">
                  <span class="release-date"></span>
                  <span class="runtime"></span>
                </div>
                <div class="rating">
                  <div class="stars">
                    <img src="./images/star_empty.png" data-rating="2" alt="1점" />
                    <img src="./images/star_empty.png" data-rating="4" alt="2점" />
                    <img src="./images/star_empty.png" data-rating="6" alt="3점" />
                    <img src="./images/star_empty.png" data-rating="8" alt="4점" />
                    <img src="./images/star_empty.png" data-rating="10" alt="5점" />
                  </div>
                  <span class="rating-text">평가하기</span>
                </div>
                <p class="overview"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalTemplate);
    this.modal = document.querySelector('.modal');
  }

  setupEventListeners() {
    // Close button click
    this.modal.querySelector('.modal-close').addEventListener('click', () => {
      this.hide();
    });

    // Overlay click
    this.modal.querySelector('.modal-overlay').addEventListener('click', () => {
      this.hide();
    });

    // ESC key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.hidden) {
        this.hide();
      }
    });

    // Star rating
    const stars = this.modal.querySelectorAll('.stars img');
    stars.forEach((star) => {
      star.addEventListener('click', (e) => {
        const rating = parseInt(e.target.dataset.rating);
        this.setRating(rating);
      });
    });
  }

  async show(movieId) {
    try {
      const movie = await movieAPI.getMovieDetails(movieId);
      this.updateModalContent(movie);
      this.modal.hidden = false;
      document.body.style.overflow = 'hidden';
      
      // Load saved rating
      const savedRating = localStorage.getItem(`movie-rating-${movieId}`);
      if (savedRating) {
        this.setRating(parseInt(savedRating));
      }
    } catch (error) {
      console.error('Error loading movie details:', error);
    }
  }

  hide() {
    this.modal.hidden = true;
    document.body.style.overflow = '';
  }

  updateModalContent(movie) {
    const posterImg = this.modal.querySelector('.movie-poster img');
    posterImg.src = movieAPI.getImageUrl(movie.poster_path, 'large', 'poster');
    posterImg.alt = movie.title;

    this.modal.querySelector('.movie-title').textContent = movie.title;
    this.modal.querySelector('.release-date').textContent = new Date(movie.release_date).getFullYear();
    this.modal.querySelector('.runtime').textContent = `${movie.runtime}분`;
    this.modal.querySelector('.overview').textContent = movie.overview;
  }

  setRating(rating) {
    const stars = this.modal.querySelectorAll('.stars img');
    const movieId = this.modal.querySelector('.movie-poster img').src.split('/').pop();
    const ratingTexts = {
      2: '최악이에요',
      4: '별로예요',
      6: '보통이에요',
      8: '재미있어요',
      10: '명작이에요'
    };

    stars.forEach((star, index) => {
      const starRating = parseInt(star.dataset.rating);
      star.src = starRating <= rating ? './images/star_filled.png' : './images/star_empty.png';
    });

    this.modal.querySelector('.rating-text').textContent = ratingTexts[rating] || '평가하기';
    localStorage.setItem(`movie-rating-${movieId}`, rating.toString());
  }
}