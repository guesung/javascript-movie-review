import { DEFAULT_BACK_DROP_URL } from "../constants";
import { MovieResult } from "../types";

import { html } from "../utils";
import Component from "./core/Component";

interface ThumbnailListProps {
  movies: MovieResult[];
}

export default class ThumbnailList extends Component<ThumbnailListProps> {
  template() {
    return html`
      <ul class="thumbnail-list">
        ${this.props.movies
          .map((movie) => {
            const backgroundImage = movie.backdrop_path
              ? `${DEFAULT_BACK_DROP_URL}${movie.backdrop_path}`
              : "./images/default_thumbnail.jpeg";
            return `
            <li>
              <div class="item">
                <img
                  class="thumbnail"
                  src="${backgroundImage}"
                  alt="${movie.title}"
                />
                <div class="item-desc">
                  <p class="rate loading">
                    <img src="./images/star_empty.png" class="star" /><span
                      >${movie.vote_average}</span
                    >
                  </p>
                  <strong>${movie.title}</strong>
                </div>
              </div>
            </li>
          `;
          })
          .join("")}
      </section>
    `;
  }
}
