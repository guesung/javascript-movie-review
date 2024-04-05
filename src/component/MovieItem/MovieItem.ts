import starFilledImg from "../../image/star_filled.png";

class MovieItem {
  #movieItemInfo;

  constructor(movieItemInfo: IMovieItemData) {
    this.#movieItemInfo = movieItemInfo;
  }

  setMovieItemData(liElement: HTMLLIElement) {
    liElement.id = this.#movieItemInfo.id.toString();

    const thumbnailElement = liElement.querySelector("img");
    if (thumbnailElement) {
      thumbnailElement.src = `https://image.tmdb.org/t/p/w220_and_h330_face${
        this.#movieItemInfo.poster_path
      }`;
      thumbnailElement.alt = this.#movieItemInfo.title;
    }

    const titleElement = liElement.querySelector("h3");
    if (titleElement) {
      titleElement.textContent = this.#movieItemInfo.title;
    }

    const scoreElement = liElement.querySelector("span");
    if (scoreElement) {
      scoreElement.textContent = String(
        this.#movieItemInfo.vote_average.toFixed(1)
      );
    }

    const starImgElement = liElement.querySelector(
      ".item-filled-star"
    ) as HTMLImageElement;
    if (starImgElement) {
      starImgElement.src = starFilledImg;
      starImgElement.alt = "starFilledImg for grade";
    }
  }
}

export default MovieItem;
