export type ElementTag = keyof HTMLElementTagNameMap;

interface BasicOption {
  className?: string;
  id?: string;
  'data-id'?: number;
  'data-rating'?: string;
}

interface DivOption extends BasicOption {}

interface ImgOption extends BasicOption {
  src: string;
  alt: string;
  loading?: 'lazy';
  onload?: (this: HTMLImageElement, ev: Event) => any;
}

interface POption extends BasicOption {
  textContent: string;
}

interface InputOption extends BasicOption {
  type: string;
  placeholder?: string;
}

interface AOption extends BasicOption {
  href: string;
}

export type ElementOption = DivOption | ImgOption | InputOption | POption | AOption;
