import { ERROR_MESSAGE } from '../../src/consts/message';

describe('검색 기능 테스트', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('검색 인풋 기능 테스트', () => {
    it('검색 결과에 아무것도 입력하지 않았을 시 검색되지 않는다.', () => {
      cy.get('#search-button').click();

      cy.get('.toast-message').should('be.visible');
    });

    it('검색어로 없는 영화를 입력했을 시, not-found UI가 뜬다.', () => {
      const searchInput = cy.get('#search-input');
      const INVALID_MOVIE_NAME = '알고보니내가재벌3세';
      searchInput.type(INVALID_MOVIE_NAME);
      cy.get('#search-button').click();

      cy.get('.error').should('be.visible');
      cy.get('.error h2').should('text', ERROR_MESSAGE.SEARCH_NOT_FOUND);
    });

    it('검색어로 해리포터를 검색하면 해리포터가 포함된 영화가 뜬다.', () => {
      const searchInput = cy.get('#search-input');
      searchInput.type('해리포터');
      cy.get('#search-button').click();

      cy.get('.item-title').each(movie => {
        cy.wrap(movie).should('contain.text', '해리 포터');
      });
    });

    it('20개 미만의 개수의 영화 검색어를 입력했을 시, 20개에서 남은 영화가 보이지 않는다.', () => {
      const searchInput = cy.get('#search-input');
      searchInput.type('해리포터');
      cy.get('#search-button').click();

      cy.get('.item-box').not('have.length', 20);
    });
  });
});
