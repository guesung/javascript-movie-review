// API 설정
const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmEwYTdiNzE4ODA4YTVmYTJjZWMxNGYwOTNjZDZjZCIsIm5iZiI6MTc0MjI2MzAzMS41MTYsInN1YiI6IjY3ZDhkMmY3NGYwMjQ2ZGUzOWVlOWZlYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wYazrK1XQKvh5qGf8BQcnljLKMMRTdUGBv6KcRxAvHw";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// DOM 요소
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const movieList = document.getElementById("movieList");
const skeletonLoader = document.getElementById("skeletonLoader");
const modal = document.getElementById("movieModal");
const closeBtn = document.querySelector(".close");
const stars = document.querySelectorAll(".star");

// 상태 관리
let currentPage = 1;
let isLoading = false;
let isSearchMode = false;
let currentSearchQuery = "";
let lastScrollPosition = 0;

// 로컬 스토리지 키
const RATINGS_STORAGE_KEY = "movieRatings";

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  loadPopularMovies();
  setupInfiniteScroll();
  setupModalEvents();
  setupRatingSystem();
});

// 무한 스크롤 설정
function setupInfiniteScroll() {
  window.addEventListener("scroll", () => {
    if (isLoading) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 800) {
      if (isSearchMode) {
        searchMovies(currentSearchQuery, currentPage + 1);
      } else {
        loadPopularMovies(currentPage + 1);
      }
    }
  });
}

// 인기 영화 로드
async function loadPopularMovies(page = 1) {
  try {
    if (page === 1) {
      movieList.innerHTML = "";
      showSkeletonLoader();
    }

    isLoading = true;
    const response = await fetch(
      `${BASE_URL}/movie/popular?language=ko-KR&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("영화 데이터를 불러오는데 실패했습니다.");

    const data = await response.json();
    displayMovies(data.results, page === 1);
    currentPage = page;
  } catch (error) {
    showError(error.message);
  } finally {
    hideSkeletonLoader();
    isLoading = false;
  }
}

// 영화 검색
async function searchMovies(query, page = 1) {
  if (!query.trim()) return;

  try {
    if (page === 1) {
      movieList.innerHTML = "";
      showSkeletonLoader();
    }

    isLoading = true;
    isSearchMode = true;
    currentSearchQuery = query;

    const response = await fetch(
      `${BASE_URL}/search/movie?language=ko-KR&query=${encodeURIComponent(
        query
      )}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("검색에 실패했습니다.");

    const data = await response.json();
    displayMovies(data.results, page === 1);
    currentPage = page;
  } catch (error) {
    showError(error.message);
  } finally {
    hideSkeletonLoader();
    isLoading = false;
  }
}

// 영화 표시
function displayMovies(movies, clearList = false) {
  if (clearList) {
    movieList.innerHTML = "";
  }

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    movieCard.onclick = () => showMovieDetails(movie.id);

    const posterPath = movie.poster_path
      ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
      : "placeholder-image.jpg";

    movieCard.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span class="rating">★ ${movie.vote_average.toFixed(1)}</span>
            </div>
        `;

    movieList.appendChild(movieCard);
  });
}

// 영화 상세 정보 표시
async function showMovieDetails(movieId) {
  try {
    const [movieDetails, credits] = await Promise.all([
      fetch(`${BASE_URL}/movie/${movieId}?language=ko-KR`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
      fetch(`${BASE_URL}/movie/${movieId}/credits`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    ]);

    const modalPoster = document.getElementById("modalPoster");
    const modalTitle = document.getElementById("modalTitle");
    const modalOverview = document.getElementById("modalOverview");
    const castList = document.getElementById("castList");

    modalPoster.src = movieDetails.poster_path
      ? `${IMAGE_BASE_URL}/w500${movieDetails.poster_path}`
      : "placeholder-image.jpg";
    modalPoster.alt = movieDetails.title;

    modalTitle.textContent = movieDetails.title;
    modalOverview.textContent = movieDetails.overview;

    // 출연진 표시
    castList.innerHTML = credits.cast
      .slice(0, 6)
      .map(
        (actor) => `
                <div class="cast-member">
                    <img src="${
                      actor.profile_path
                        ? `${IMAGE_BASE_URL}/w185${actor.profile_path}`
                        : "placeholder-profile.jpg"
                    }"
                        alt="${actor.name}"
                        class="cast-photo">
                    <div class="actor-name">${actor.name}</div>
                    <div class="character">${actor.character}</div>
                </div>
            `
      )
      .join("");

    // 저장된 별점 표시
    const savedRating = getSavedRating(movieId);
    updateStarRating(savedRating);

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  } catch (error) {
    showError("영화 상세 정보를 불러오는데 실패했습니다.");
  }
}

// 모달 이벤트 설정
function setupModalEvents() {
  closeBtn.onclick = closeModal;
  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal();
    }
  };
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

// 모달 닫기
function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// 별점 시스템 설정
function setupRatingSystem() {
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = parseInt(star.dataset.rating);
      const movieId = getCurrentMovieId();
      saveRating(movieId, rating);
      updateStarRating(rating);
    });

    star.addEventListener("mouseover", () => {
      const rating = parseInt(star.dataset.rating);
      updateStarRating(rating, true);
    });
  });

  const ratingContainer = document.querySelector(".rating-container");
  ratingContainer.addEventListener("mouseleave", () => {
    const movieId = getCurrentMovieId();
    const savedRating = getSavedRating(movieId);
    updateStarRating(savedRating);
  });
}

// 현재 영화 ID 가져오기
function getCurrentMovieId() {
  const modalTitle = document.getElementById("modalTitle");
  return modalTitle.dataset.movieId;
}

// 별점 저장
function saveRating(movieId, rating) {
  const ratings = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || "{}");
  ratings[movieId] = rating;
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
}

// 저장된 별점 가져오기
function getSavedRating(movieId) {
  const ratings = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || "{}");
  return ratings[movieId] || 0;
}

// 별점 표시 업데이트
function updateStarRating(rating, isHover = false) {
  const ratingText = document.getElementById("ratingText");
  const ratingMessages = {
    0: "평가하기",
    2: "최악이에요",
    4: "별로예요",
    6: "보통이에요",
    8: "재미있어요",
    10: "명작이에요",
  };

  stars.forEach((star) => {
    const starRating = parseInt(star.dataset.rating);
    if (starRating <= rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });

  ratingText.textContent = ratingMessages[rating] || "평가하기";
}

// 스켈레톤 로더 표시/숨기기
function showSkeletonLoader() {
  skeletonLoader.style.display = "grid";
}

function hideSkeletonLoader() {
  skeletonLoader.style.display = "none";
}

// 에러 메시지 표시
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  movieList.appendChild(errorDiv);
}

// 이벤트 리스너
searchButton.addEventListener("click", () => {
  const query = searchInput.value;
  if (query.trim()) {
    currentPage = 1;
    searchMovies(query);
  }
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value;
    if (query.trim()) {
      currentPage = 1;
      searchMovies(query);
    }
  }
});
