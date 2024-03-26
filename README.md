# javascript-movie-review

## FE 레벨1 영화관 미션

# 기능 요구사항

## 도메인

- [x] API GET 구현
  - [x] API key request, respond 검증
    - [x] key respond의 success가 false일 경우 에러를 발생시킨다.
  - [x] 영화 인기 순위 request interface 구현
  - [x] 영화 검색 결과 request interface 구현
  - [x] 영화 데이터 respond interface 구현

- [x] 검색창 입력에 대한 유효성 검증
  - [x] 빈 값인지 확인한다.
  - [x] 문자열이 공백으로만 이루어져있는지 확인한다.

## UI
- [x] 헤더 컴포넌트
  - [x] 무비리스트 
    - [x] 로고 클릭시 지금 인기 있는 영화 목록을 조회할 수 있다.
  - [x] 검색
    - [x] 영화 검색 API를 이용하여 내가 보고 싶은 영화를 검색할 수 있다.
    - [x] 엔터키를 눌러 검색할 수 있다.
    - [x] 검색 버튼을 클릭하여 검색할 수 있다.
    - [x] 오류가 발생하는 경우에는 사용자를 위한 토스트 오류 메시지를 띄워 준다.

- [x] 영화리스트 컴포넌트
  - [x] 영화 목록 조회 (인기순)
    - [x] 컴포넌트 호출시 영화 목록의 1페이지(20개)를 불러온다.
    - [x] 더보기 버튼을 누르면 그 다음 페이지(20개)의 영화 목록을 불러 올 수 있다.
    - [x] 페이지 끝에 도달한 경우에는 더보기 버튼을 화면에 출력하지 않는다.
    - [x] 데이터가 패치되기 전 영화 목록 아이템에 대한 Skeleton UI를 구현한다.
  - [x] 영화 목록 조회 (검색 결과)
    - [x] 위와 동일한 방식으로 구현한다.
