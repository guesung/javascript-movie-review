describe('E2E테스트', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('목록', () => {
    it('사용자가 영화 목록 20개를 볼 수 있다.', () => {
      cy.get('.thumbnail-list > li').should('have.length', 20);
    });

    it('사용자가 더 보기를 누르면 다음 목록을 보여준다.', () => {
      cy.get('[data-action="show-more"]').click();
      cy.get('.thumbnail-list > li').should('have.length', 40);
    });
  });

  describe('검색', () => {
    it('검색어를 입력했을 때 목록이 있다면 목록을 보여준다.', () => {
      cy.get('.top-rated-search-input').click();
      cy.get('.top-rated-search-input').type('짱구');
      cy.get('.top-rated-search-button').click();
      cy.get('.thumbnail-list > li').should('have.length', 20);
    });
    it('검색어를 입력했을 때 목록이 없다면 빈 화면을 보여준다.', () => {
      cy.get('.top-rated-search-input').click();
      cy.get('.top-rated-search-input').type('없는제목우아아아아아아');
      cy.get('.top-rated-search-button').click();
      cy.get('.error').contains('검색 결과가 없습니다.').should('exist');
    });
  });
});

describe('비동기 API 테스트', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('영화 목록 API를 호출하면 한 번에 20개씩 목록에 나열되어야 한다.', () => {
    const popularMovieUrl = 'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1';
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${Cypress.env('VITE_TMDB_TOKEN')}`,
      },
    };

    cy.request({
      method: 'GET',
      url: popularMovieUrl,
      ...options,
    }).as('popularMovies');

    cy.get('@popularMovies').its('status').should('eq', 200);
    cy.get('@popularMovies').its('body.results').should('have.length', 20);
  });
});

describe.only('Fixture를 이용한 테스트', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: /^https:\/\/api\.themoviedb\.org\/3\/movie\/popular*/,
      },
      { fixture: 'movie-popular.json' },
    ).as('getPopularMovies');

    cy.visit('/');
  });

  it('영화 목록 API를 호출하면 한 번에 20개씩 목록에 나열되어야 한다', () => {
    cy.wait('@getPopularMovies').then((interception) => {
      const popularMovies = interception.response.body.results;
      expect(popularMovies.length).to.equal(20);

      // 제대로 렌더링이 되었는지 테스트하는 코드 샘플
      const popularMovieItems = cy.get('.thumbnail-list > li');
      expect(popularMovieItems.should('have.length', 20));
    });
  });
});
