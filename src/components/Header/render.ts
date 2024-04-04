import createElement from '../../utils/createElement';
import headerLogo from '../../../templates/logo.png';
import isHTMLElement from '../../utils/isHTMLElement';

const createHeaderContainer = () => {
  const headerContainer = createElement('header');
  const h1 = createElement('h1');
  const logo = createLogo();
  h1.appendChild(logo);
  headerContainer.appendChild(h1);

  return headerContainer;
};

const createLogo = () => {
  const HREF_VALUE = '/javascript-movie-review/dist';

  const a = createElement('a', {
    href: HREF_VALUE,
  });

  const headerLogoImage = createElement('img', { src: headerLogo, alt: 'MovieList' });
  a.appendChild(headerLogoImage);

  return a;
};

const createSearchButton = () => {
  const searchButton = createElement('button', { className: 'search-button', textContent: '검색' });
  return searchButton;
};

const createSearchBar = () => {
  const searchBox = createElement('form', { className: 'search-form', id: 'searchForm' });
  const input = createElement('input', { type: 'text', placeholder: '검색' });
  const searchButton = createSearchButton();
  searchBox.appendChild(input);
  searchBox.appendChild(searchButton);

  return searchBox;
};

export const renderHandler = () => {
  const appContainer = document.getElementById('app');
  const headerContainer = createHeaderContainer();
  const searchBar = createSearchBar();
  headerContainer.appendChild(searchBar);
  if (isHTMLElement(appContainer)) {
    appContainer.appendChild(headerContainer);
  }
};
