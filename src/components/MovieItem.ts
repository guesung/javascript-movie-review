class MovieItem {
  private _node!: HTMLElement;

  constructor() {
    this.createTemplate();
  }

  get node(): HTMLElement {
    return this._node;
  }

  createTemplate(): this {
    this._node = document.createElement('li');

    this._node.insertAdjacentHTML(
      'afterbegin',
      `
      <a>
        <div class="item-card">
          <img
            class="item-thumbnail"
            src="https://image.tmdb.org/t/p/w220_and_h330_face/cw6jBnTauNmEEIIXcoNEyoQItG7.jpg"
            loading="lazy"
            alt="앤트맨과 와스프: 퀀텀매니아"
          />
          <p class="item-title">앤트맨과 와스프: 퀀텀매니아</p>
          <p class="item-score"><img src="./star_filled.png" alt="별점" /> 6.5</p>
        </div>
      </a>
      `
    );

    return this;
  }
}

export default MovieItem;
