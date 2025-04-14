// API configuration
const API_KEY = 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const movieList = document.getElementById('movieList');
const movieModal = document.getElementById('movieModal');
const movieDetails = document.getElementById('movieDetails');
const closeButton = document.querySelector('.close');

// Event Listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearch();
});
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === movieModal) closeModal();
});

// Functions
async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    showLoader();
    const movies = await searchMovies(query);
    displayMovies(movies);
  } catch (error) {
    showError('Failed to search movies. Please try again.');
  } finally {
    hideLoader();
  }
}

async function searchMovies(query) {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error('Failed to fetch movies');
  const data = await response.json();
  return data.results;
}

function displayMovies(movies) {
  movieList.innerHTML = '';
  
  if (!movies.length) {
    showError('No movies found.');
    return;
  }

  movies.forEach(movie => {
    const movieCard = createMovieCard(movie);
    movieList.appendChild(movieCard);
  });
}

function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  
  const imageUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : '/src/images/no-poster.png';

  card.innerHTML = `
    <img src="${imageUrl}" alt="${movie.title}" class="movie-poster" />
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <p>${movie.release_date?.split('-')[0] || 'N/A'}</p>
      <div class="rating">★ ${movie.vote_average?.toFixed(1) || 'N/A'}</div>
    </div>
  `;

  card.addEventListener('click', () => showMovieDetails(movie.id));
  return card;
}

async function showMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,reviews`
    );
    if (!response.ok) throw new Error('Failed to fetch movie details');
    
    const movie = await response.json();
    displayMovieDetails(movie);
    movieModal.style.display = 'block';
  } catch (error) {
    showError('Failed to load movie details. Please try again.');
  }
}

function displayMovieDetails(movie) {
  const imageUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : '/src/images/no-poster.png';

  movieDetails.innerHTML = `
    <div class="modal-header">
      <img src="${imageUrl}" alt="${movie.title}" class="modal-poster" />
      <div class="modal-title">
        <h2>${movie.title}</h2>
        <p>${movie.release_date?.split('-')[0] || 'N/A'} | ${movie.runtime} min</p>
        <div class="rating">★ ${movie.vote_average?.toFixed(1) || 'N/A'}</div>
      </div>
    </div>
    <div class="modal-body">
      <p class="overview">${movie.overview}</p>
      <div class="cast">
        <h3>Cast</h3>
        <div class="cast-list">
          ${getCastHTML(movie.credits?.cast)}
        </div>
      </div>
      <div class="reviews">
        <h3>Reviews</h3>
        ${getReviewsHTML(movie.reviews?.results)}
      </div>
    </div>
  `;
}

function getCastHTML(cast = []) {
  return cast
    .slice(0, 5)
    .map(actor => `
      <div class="cast-member">
        <img 
          src="${actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : '/src/images/no-profile.png'}"
          alt="${actor.name}"
          class="cast-photo"
        />
        <p>${actor.name}</p>
        <p class="character">${actor.character}</p>
      </div>
    `)
    .join('');
}

function getReviewsHTML(reviews = []) {
  if (!reviews.length) return '<p class="no-reviews">No reviews yet.</p>';

  return reviews
    .slice(0, 3)
    .map(review => `
      <div class="review">
        <div class="review-header">
          <strong>${review.author}</strong>
          <span>${new Date(review.created_at).toLocaleDateString()}</span>
        </div>
        <p>${review.content.slice(0, 200)}${review.content.length > 200 ? '...' : ''}</p>
      </div>
    `)
    .join('');
}

function closeModal() {
  movieModal.style.display = 'none';
  movieDetails.innerHTML = '';
}

function showLoader() {
  movieList.innerHTML = `
    <div class="skeleton-loader">
      ${Array(6).fill('<div class="skeleton-card"></div>').join('')}
    </div>
  `;
}

function hideLoader() {
  const loader = document.querySelector('.skeleton-loader');
  if (loader) loader.remove();
}

function showError(message) {
  movieList.innerHTML = `<div class="error-message">${message}</div>`;
}