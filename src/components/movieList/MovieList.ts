import EventComponent from "../abstract/EventComponent";
import SkeletonUI from "../SkeletonUI";

import QueryState from "../../states/QueryState";
import MovieState from "../../states/MovieState";

import { generateMovieItems } from "../templates/generateMovieItems";
import { generateEmptyMovieListScreen } from "../templates/generateUnexpectedScreen";

import { getPopularMovieList, getSearchMovieList } from "../../apis/movieList";
import { handleAPIError } from "../../error/handleAPIError";

import { $ } from "../../utils/dom";
import { throttle } from "../../utils/throttle";
import { HTMLTemplate, TargetId, Query } from "../../types/common";
import { FetchedMovieData } from "../../types/movies";

interface MovieListProps {
  targetId: TargetId;
  skeletonUI: SkeletonUI;
  queryState: QueryState;
  movieState: MovieState;
}

export default class MovieList extends EventComponent {
  private page = 1;
  private skeletonUI: SkeletonUI;
  private queryState: QueryState;
  private movieState: MovieState;
  private movieList: FetchedMovieData;

  constructor({
    targetId,
    queryState,
    movieState,
    skeletonUI,
  }: MovieListProps) {
    super({ targetId });
    this.skeletonUI = skeletonUI;
    this.queryState = queryState;
    this.movieState = movieState;
    this.movieList = {} as FetchedMovieData;
  }

  override async init(): Promise<void> {
    this.skeletonUI.render(this.targetId);
    this.resetPage();

    try {
      const movieList = await this.fetchMovies(
        this.page,
        this.queryState.get()
      );

      this.movieList = movieList;

      this.render();
      this.setEvent();
    } catch (error) {
      handleAPIError(error, this.targetId);
    }
  }

  protected getTemplate(): HTMLTemplate {
    const movieItemsTemplate = generateMovieItems(this.movieList);
    return `
      <ul id="item-list" class="item-list">
        ${
          this.movieList.results.length === 0
            ? generateEmptyMovieListScreen()
            : movieItemsTemplate
        }
      </ul>
    `;
  }

  protected setEvent(): void {
    window.addEventListener("scroll", throttle(this.onScroll, 500));
    $(this.targetId)?.addEventListener("click", this.openMovieDetailModal);
  }

  private onScroll = () => {
    const isEndOfPage =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight;
    const hasMorePages = this.page < this.movieList.total_pages;

    if (!isEndOfPage || !hasMorePages) return;

    this.loadMoreMovies();
  };

  private openMovieDetailModal = (event: Event): void => {
    event.preventDefault();
    const target = event.target;

    if (target instanceof HTMLElement) {
      const clickedMovieId = target.closest("li")?.dataset.movieId;

      if (clickedMovieId) {
        this.movieState.set(Number(clickedMovieId));
        document.body.classList.add("no-scroll");
        $<HTMLElement>("movie-detail-modal")?.classList.toggle("modal-open");
      }
    }
  };

  private fetchMovies = async (
    page: number,
    query?: Query
  ): Promise<FetchedMovieData> => {
    const fetchedMovieData = query
      ? await getSearchMovieList(query, page)
      : await getPopularMovieList(page);

    return fetchedMovieData;
  };

  private resetPage(): void {
    this.page = 1;
  }

  private loadMoreMovies = async () => {
    this.page += 1;

    this.skeletonUI.insert("item-list", "afterend");

    const additionalFetchedMovieData = await this.fetchMovies(
      this.page,
      this.queryState.get()
    );

    this.skeletonUI.remove("skeleton-movie-item-list");

    this.insertMovieItems(additionalFetchedMovieData);
  };

  private insertMovieItems = async (data: FetchedMovieData): Promise<void> => {
    const movieItemsTemplate = generateMovieItems(data);

    $("item-list")?.insertAdjacentHTML("beforeend", movieItemsTemplate);
  };
}
