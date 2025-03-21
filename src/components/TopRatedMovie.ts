interface TopRatedMovieProps {
  title: string;
  voteAverage: number;
}

export default function TopRatedMovie({
  title,
  voteAverage,
}: TopRatedMovieProps) {
  const $topRatedMovie = document.createElement("div");
  $topRatedMovie.className = "top-rated-movie";

  $topRatedMovie.innerHTML = `
    <div class="rate">
      <img src="./images/star_empty.png" class="star" />
      <span class="rate-value">${voteAverage}</span>
    </div>
    <div class="title">${title}</div>
    <button class="primary detail">자세히 보기</button>
  `;

  return $topRatedMovie;
}
