
---

# React netflix custom clone project

## 소개
이 프로젝트는 **React**를 기반으로 한 웹 애플리케이션입니다.

주요 기능으로는 **React Router**를 통한 라우팅,
**Axios**를 이용한 HTTP 요청 처리 등이 있습니다. 
---

## 설치 및 실행

### 1. 설치
이 프로젝트를 실행하려면 **Node.js**와 **npm**이 필요합니다. [Node.js 공식 사이트](https://nodejs.org/)에서 설치한 뒤, 아래 명령어를 실행하세요.

```bash
# 패키지 설치
npm install
```

### 2. 실행
로컬 개발 서버를 시작하려면 다음 명령어를 사용하세요.

```bash
npm start
```

서버가 실행되면 기본적으로 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 3. 빌드
프로덕션 환경을 위한 정적 파일을 생성하려면 아래 명령어를 실행하세요:

```bash
npm run build
```

생성된 파일은 `build` 디렉토리에 저장됩니다.

### 4. 테스트
테스트를 실행하려면 다음 명령어를 사용하세요:

```bash
npm test
```

---

## 주요 기술 스택

### Dependencies
- **React (`^18.3.1`)**: 사용자 인터페이스를 구축하기 위한 라이브러리.
- **React DOM (`^18.3.1`)**: React의 DOM 렌더링 지원.
- **React Router DOM (`^6.28.0`)**: 라우팅 관리.
- **Axios (`^1.7.7`)**: HTTP 요청을 처리하기 위한 라이브러리.
- **FontAwesome (`^0.2.2`)**: 아이콘 사용을 위한 라이브러리.

### DevDependencies
- **babel-plugin-module-resolver (`^5.0.2`)**: Babel을 이용한 경로 설정 단순화.

---

## 프로젝트 구조
```plaintext
WSD-movie/
├── .github/                    # GitHub 관련 워크플로 및 설정 파일
├── react-app/                  # React 애플리케이션 소스 코드 디렉토리
│   ├── public/                 # 정적 파일 (HTML, 이미지 등)
│   ├── src/                    # React 소스 코드
│   │   ├── api/                # API 호출 로직 관련 파일
│   │   ├── artifacts/          # 리소스 및 데이터 관련 파일
│   │   ├── content/            # 정적 콘텐츠 파일
│   │   ├── App.css             # 글로벌 스타일
│   │   ├── App.js              # 메인 앱 컴포넌트
│   │   ├── AppRoutes.js        # 라우팅 설정
│   │   ├── index.css           # 전역 스타일시트
│   │   ├── index.js            # 애플리케이션 진입점
│   │   └── routes.json         # 라우팅 관련 JSON 설정
│   ├── .env                    # 환경 변수 파일
│   ├── .gitignore              # Git에 포함되지 않을 파일 정의
│   ├── jsconfig.json           # 절대 경로 설정을 위한 JS 설정
│   ├── package.json            # 프로젝트 의존성과 스크립트
│   ├── package-lock.json       # 의존성 잠금 파일
│   └── README.md               # 프로젝트 설명 파일
├── CNAME                       # 도메인 이름 설정 파일
└── .gitignore                  # 최상위 Git 설정 파일
```

---

## Scripts

### `npm start`
- 개발 서버를 시작합니다.
- 기본 포트: **3000**

### `npm run build`
- 애플리케이션을 프로덕션용으로 빌드합니다.
- 최적화된 파일이 `build/` 디렉토리에 생성됩니다.

### `npm test`
- 애플리케이션의 테스트 스위트를 실행합니다.

### `npm run eject`
- React 앱의 숨겨진 설정을 공개합니다. **주의: 이 작업은 되돌릴 수 없습니다.**

---

## 브라우저 지원
이 프로젝트는 다음 브라우저를 지원합니다:

### Production
- `>0.2%`
- `not dead`
- `not op_mini all`

### Development
- 최신 Chrome 버전

---

## 추가 정보
- 이 프로젝트는 `create-react-app`을 기반으로 생성되었습니다.
- 아이콘은 `FontAwesome`을 통해 관리됩니다.
- 경로 설정은 Babel 플러그인을 사용해 최적화되었습니다.

---

## 배포

이 프로젝트는 **GitHub Pages**를 통해 배포되었습니다. 

또한, 직접구매한 **커스텀 도메인**을 연동하여 프로젝트를 사용자 정의 도메인에서 접근할 수 있도록 설정했습니다.

### 1. GitHub Pages 설정
1. **GitHub Repository 설정**:
    - GitHub 저장소에서 **Settings > Pages**로 이동합니다.
    - 배포 소스를 `main` 브랜치 또는 `docs` 폴더로 설정합니다.
    - **저장**을 클릭하여 GitHub Pages를 활성화합니다.

2. **빌드 및 배포**:
    - 프로젝트의 정적 파일을 빌드한 뒤(`npm run build`), 빌드된 파일을 GitHub Pages 배포 브랜치에 푸시합니다.

### 2. 커스텀 도메인 설정
1. **도메인 연결**:
    - 구매한 도메인의 DNS 설정에서 아래 레코드를 추가합니다:
        - A 레코드: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
        - CNAME 레코드: GitHub Pages 도메인(예: `<username>.github.io`)

2. **CNAME 파일 생성**:
    - 프로젝트 루트에 `CNAME` 파일을 생성하고, 커스텀 도메인을 입력합니다:
      ```plaintext
      www.your-custom-domain.com
      ```

3. **GitHub Pages에서 도메인 설정**:
    - **Settings > Pages**로 이동해, `Custom domain`에 구매한 도메인을 입력하고 저장합니다.

### 3. 결과 확인
- 커스텀 도메인을 통해 애플리케이션에 접속할 수 있습니다:
    - [바로가기](https://movie.nodove.com)

---

# TMDB API 문서

---

## 공통 설정

### Axios 인스턴스
TMDB API 호출은 Axios 인스턴스를 사용합니다.

```javascript
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.REACT_APP_TMDB_API_KEY,
        language: 'ko-KR'
    }
});
```

### 공통 에러 처리
모든 API 응답은 에러 발생 시 콘솔에 상세한 오류를 출력합니다.

---

## API 함수 목록

### 1. 영화 목록 가져오기
#### `getMovies(type)`
특정 영화 목록(예: 인기 영화, 현재 상영 중인 영화 등)을 가져옵니다.

- **인자**: `type` (예: `popular`, `now_playing`, `top_rated`)
- **결과**: 영화 목록 배열

```javascript
const movies = await getMovies('popular');
```

---

### 2. 카테고리 영화 목록 가져오기
#### `getCategoryList(type, page)`
특정 카테고리의 영화 목록을 페이지 단위로 가져옵니다.

- **인자**:
   - `type`: 카테고리 유형 (예: `popular`, `now_playing`)
   - `page`: 페이지 번호 (기본값: 1)
- **결과**: 영화 데이터와 총 페이지 수

```javascript
const categoryList = await getCategoryList('popular', 2);
```

---

### 3. 장르별 영화 목록 가져오기
#### `getGenreMovieList(genreId, page)`
특정 장르에 속한 영화 목록을 가져옵니다.

- **인자**:
   - `genreId`: 장르 ID
   - `page`: 페이지 번호 (기본값: 1)
- **결과**: 영화 데이터와 총 페이지 수

```javascript
const genreMovies = await getGenreMovieList(28, 1); // Action 장르
```

---

### 4. 장르 목록 가져오기
#### `getGenres()`
영화의 모든 장르를 가져옵니다.

- **결과**: 장르 배열

```javascript
const genres = await getGenres();
```

---

### 5. 영화 상세 정보 가져오기
#### `getDetailMovie(movieId)`
특정 영화의 상세 정보를 가져옵니다.

- **인자**: `movieId` (영화 ID)
- **결과**: 영화 상세 정보

```javascript
const movieDetails = await getDetailMovie(12345);
```

---

### 6. 유사한 영화 가져오기
#### `getSimilarMovies(genreIds, page)`
특정 장르 ID 기반으로 유사한 영화를 가져옵니다.

- **인자**:
   - `genreIds`: 장르 ID 배열
   - `page`: 페이지 번호
- **결과**: 영화 데이터

```javascript
const similarMovies = await getSimilarMovies([28, 12], 1);
```

---

### 7. 영화 검색
#### `searchMovies({ query, page, genre, rating, sort, year })`
키워드 또는 조건을 기반으로 영화를 검색합니다.

- **인자**:
   - `query`: 검색 키워드 (없을 경우 조건 기반 검색)
   - `page`: 페이지 번호 (기본값: 1)
   - `genre`: 장르 ID
   - `rating`: 최소 평점
   - `sort`: 정렬 기준 (기본값: `popularity.desc`)
   - `year`: 특정 출시 연도
- **결과**: 검색된 영화 데이터

```javascript
const searchResults = await searchMovies({ query: 'Inception' });
```

---

### 8. 영화 배우 정보 가져오기
#### `getMovieCredits(movieId)`
특정 영화의 배우 및 제작진 정보를 가져옵니다.

- **인자**: `movieId` (영화 ID)
- **결과**: 배우 및 제작진 데이터

```javascript
const credits = await getMovieCredits(12345);
```

---

### 9. 영화 리뷰 가져오기
#### `getMovieReviews(movieId)`
특정 영화의 리뷰를 가져옵니다.

- **인자**: `movieId` (영화 ID)
- **결과**: 리뷰 배열

```javascript
const reviews = await getMovieReviews(12345);
```

---

### 10. 배우 출연 영화 가져오기
#### `getPersonMovieCredits(personId)`
특정 배우가 출연한 영화 목록을 가져옵니다.

- **인자**: `personId` (배우 ID)
- **결과**: 출연한 영화 목록

```javascript
const personMovies = await getPersonMovieCredits(1234);
```

---

## 참고
- 모든 함수는 TMDB API 키를 필요로 하며, 환경 변수 `REACT_APP_TMDB_API_KEY`에 저장됩니다.
- 응답 데이터는 TMDB API 문서를 참고하세요: [TMDB API 문서](https://developer.themoviedb.org/docs)

--- 

