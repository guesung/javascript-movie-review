import { Movie } from "./MovieListBox/MovieList/MovieItem";
import MovieListBox from "./MovieListBox/MovieListBox";
import generateMain from "../common/generateMain";

interface MovieMainProps {
  title: string;
  onMovieMoreButtonClick: () => void;
  onMovieItemClick: (id: number) => void;
}

class MovieMain {
  private $element: HTMLElement;

  private movieListBox: MovieListBox;

  constructor({
    title,
    onMovieMoreButtonClick,
    onMovieItemClick,
  }: MovieMainProps) {
    this.movieListBox = new MovieListBox({
      title,
      onMovieMoreButtonClick,
      onMovieItemClick,
    });
    this.$element = generateMain({
      children: [this.movieListBox.getElement()],
    });
  }

  getElement() {
    return this.$element;
  }

  changeMovieListBox({
    title,
    onMovieMoreButtonClick,
    onMovieItemClick,
  }: MovieMainProps) {
    this.movieListBox = new MovieListBox({
      title,
      onMovieMoreButtonClick,
      onMovieItemClick,
    });

    this.replace(this.movieListBox.getElement());
  }

  reRender(movieList: Movie[]) {
    this.movieListBox.reRender(movieList);
  }

  removeMovieMoreButton() {
    this.movieListBox.removeMovieMoreButton();
  }

  renderMessage(message: string) {
    this.movieListBox.renderMessage(message);
  }

  private replace(movieListBoxElement: HTMLElement) {
    this.$element.replaceChildren(movieListBoxElement);
  }
}

export default MovieMain;
