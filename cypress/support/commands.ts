declare namespace Cypress {
  interface Chainable<Subject> {
    generateAPIKeyError(): Chainable<any>;
    fetchPopularMovies(): Chainable<any>;
    fetchMovieDetail(): Chainable<any>;
    moreButtonClick(count: number): Chainable<any>;
    searchMovie(text: string): Chainable<any>;
  }
}

Cypress.Commands.add('generateAPIKeyError', () => {
  cy.intercept(
    {
      method: 'GET',
      url: /\/3\/movie\/popular/,
      hostname: 'api.themoviedb.org',
    },
    {
      statusCode: 403,
    },
  ).as('APIKeyError');
});

Cypress.Commands.add('fetchPopularMovies', () => {
  cy.intercept({
    method: 'GET',
    url: /\/3\/movie\/popular/,
    hostname: 'api.themoviedb.org',
  }).as('PopularMoviesSuccess');
});

Cypress.Commands.add('fetchMovieDetail', () => {
  cy.intercept({
    method: 'GET',
    url: /\/3\/movie/,
    hostname: 'api.themoviedb.org',
  }).as('MovieDetailSuccess');
});

Cypress.Commands.add('moreButtonClick', (count: number) => {
  for (let i = 1; i <= count; i++) {
    cy.get('#more-button').click();
  }
});

Cypress.Commands.add('searchMovie', (text: string) => {
  cy.get('#search-input').type(text);
  cy.get('#search-form').submit();
});
