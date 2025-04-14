# 영화 리뷰 애플리케이션

## 기능 목록

### 1단계
- [x] 영화 목록 조회 (인기순)
  - [x] 페이지당 20개 영화 표시
  - [x] 무한 스크롤 구현
  - [x] Skeleton UI 구현
- [x] 영화 검색
  - [x] 엔터키로 검색
  - [x] 검색 버튼 클릭으로 검색
- [x] 오류 처리
  - [x] 사용자 친화적인 오류 메시지 표시

### 2단계
- [x] 영화 상세정보 조회
  - [x] 모달 창으로 상세 정보 표시
  - [x] ESC 키로 모달 닫기
- [x] 별점 매기기
  - [x] 5단계 별점 시스템 (2점 단위)
  - [x] localStorage를 이용한 별점 저장
- [x] UI/UX 개선
  - [x] 반응형 레이아웃
  - [x] 무한 스크롤 구현

## 설치 및 실행

1. 환경 변수 설정
   ```bash
   # .env 파일 생성
   TMDB_API_KEY=your_api_key_here
   ```

2. 로컬 서버 실행
   ```bash
   # http-server 설치 (필요한 경우)
   npm install -g http-server

   # 서버 실행
   http-server
   ```

3. 브라우저에서 접속
   ```
   http://localhost:8080
   ```

## 기술 스택

- Vanilla JavaScript
- HTML5
- CSS3
- TMDB API

## 프로젝트 구조

```
├── src/
│   ├── js/
│   │   ├── components/
│   │   │   ├── MovieList.js
│   │   │   ├── Search.js
│   │   │   └── Modal.js
│   │   ├── api.js
│   │   └── app.js
│   ├── styles/
│   │   ├── main.css
│   │   ├── modal.css
│   │   ├── search.css
│   │   ├── skeleton.css
│   │   ├── tab.css
│   │   └── thumbnail.css
│   └── images/
├── index.html
└── README.md
```

## API 키 보안

- API 키는 환경 변수로 관리
- GitHub에 API 키가 노출되지 않도록 .gitignore에 .env 파일 포함

## 테스트

- E2E 테스트는 Cypress를 사용하여 구현
- 주요 사용자 시나리오에 대한 테스트 케이스 포함