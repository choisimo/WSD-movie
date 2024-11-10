# Angular 설치 가이드

이 프로젝트는 [Angular CLI](https://github.com/angular/angular-cli) 버전 18.2.9을 사용하여 생성되었습니다.

## Angular 설치

먼저, Angular CLI를 설치합니다. 권한 문제가 발생할 수 있으니 아래의 명령어를 사용하여 설치하세요.

```bash
npm install -g @angular/cli
```

설치 후 `ng` 명령어가 제대로 작동하는지 확인합니다. 설치 과정에서 문제가 발생하면 관리자 권한을 사용하거나 npm 전역 설치 경로를 사용자 디렉토리로 변경하는 방법을 고려해 보세요.

## AngularDemo 프로젝트 정보

### 개발 서버 실행

개발 서버를 실행하려면 다음 명령어를 사용하세요.

```bash
ng serve
```

명령어 실행 후 브라우저에서 `http://localhost:4200/`로 접속하면 애플리케이션이 실행됩니다. 소스 파일을 수정하면 애플리케이션이 자동으로 다시 로드됩니다.

### 코드 스캐폴딩 (구조 생성)

새로운 컴포넌트를 생성하려면 다음 명령어를 사용하세요.

```bash
ng generate component component-name
```

또는 다음과 같은 명령어로 디렉티브, 파이프, 서비스, 클래스, 가드, 인터페이스, 열거형(enum), 모듈을 생성할 수 있습니다.

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

### 빌드

프로젝트를 빌드하려면 다음 명령어를 사용하세요.

```bash
ng build
```

빌드된 파일은 `dist/` 디렉토리에 저장됩니다. 배포용으로 빌드하려면 `--prod` 옵션을 추가하여 최적화된 빌드를 생성할 수 있습니다.

### 단위 테스트 실행

단위 테스트를 실행하려면 다음 명령어를 사용하세요.

```bash
ng test
```

이 명령어는 [Karma](https://karma-runner.github.io) 프레임워크를 사용하여 단위 테스트를 실행합니다.

### 엔드 투 엔드(e2e) 테스트 실행

엔드 투 엔드 테스트를 실행하려면 다음 명령어를 사용하세요.

```bash
ng e2e
```

이 명령어를 사용하려면 엔드 투 엔드 테스트 기능을 제공하는 패키지를 먼저 추가해야 합니다. 예를 들어, [Protractor](http://www.protractortest.org/) 또는 [Cypress](https://www.cypress.io/)와 같은 도구를 사용할 수 있습니다.

### 추가 도움말

Angular CLI에 대한 추가 도움이 필요하면 다음 명령어를 사용하세요.

```bash
ng help
```

또는 [Angular CLI 개요 및 명령어 참조](https://angular.dev/tools/cli) 페이지에서 더 많은 정보를 확인할 수 있습니다.
```
