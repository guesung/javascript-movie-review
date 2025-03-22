import { createElement } from "../utils";

export default function Inner() {
  const inner = createElement(/* html */ `
  <div id="movie-review-wrap">
        <header class="background-container">
          <div class="overlay" aria-hidden="true"></div>
          <div class="top-rated-header">
            <a href="/javascript-movie-review">
              <h1 class="logo">
                <img src="./images/logo.png" alt="MovieList" />
              </h1>
            </a>
            <form class="top-rated-search">
              <input
                id="top-rated-search-input"
                class="top-rated-search-input"
                placeholder="검색어를 입력하세요"
                name="search"
              />
              <button type="submit" class="top-rated-search-button">
                <img src="./images/search.svg" alt="MovieSearch" />
              </button>
            </form>
          </div>
          <div class="top-rated-container"></div>
        </header>
        <div class="container">
          <ul class="tab">
            <li>
              <a href="#">
                <div class="tab-item selected"><h3>상영 중</h3></div>
              </a>
            </li>
            <li>
              <a href="#">
                <div class="tab-item"><h3>인기순</h3></div>
              </a>
            </li>
            <li>
              <a href="#">
                <div class="tab-item"><h3>평점순</h3></div>
              </a>
            </li>
            <li>
              <a href="#">
                <div class="tab-item"><h3>상영 예정</h3></div>
              </a>
            </li>
          </ul>
          <main>
            <section>
              <h2 class="thumbnail-title">지금 인기 있는 영화</h2>
              <ul class="thumbnail-list"></ul>
              <div class="error close">
                <img src="./images/woowawa_planet.svg" alt="woowawa_planet" />
                <h2></h2>
              </div>
            </section>
          </main>
        </div>

        <footer class="footer">
          <p>&copy; 우아한테크코스 All Rights Reserved.</p>
          <p><img src="./images/woowacourse_logo.png" width="180" /></p>
        </footer>
        </div>
`);

  return inner;
}
