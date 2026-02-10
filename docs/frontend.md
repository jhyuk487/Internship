# Frontend 명세서 & Documentation

이 문서는 웹 UI 구성, 주요 동작, 백엔드 연동 방식을 설명합니다.

## 1. 개요
- 기술 스택: HTML5, CSS3, Vanilla JavaScript
- 목표: 프리미엄 UI/UX 기반 AI 학사 길잡이
- 핵심 기능: 로그인, AI 채팅(스트리밍), 채팅 히스토리, GPA 계산기, 코스 자동완성
- 게스트 정책: `ALLOW_GUEST_CHAT` 활성화 시 채팅 가능, 개인 정보 조희 시 로그인 유도

## 2. 주요 구성 요소
### 채팅 인터페이스
- 메시지 로그 및 타이핑 로딩 표시
- `ALLOW_GUEST_CHAT`가 `true`이면 게스트도 입력 가능

### 채팅 히스토리
- 로그인 사용자: `/chat/history`로 저장/로드/핀/삭제
- 게스트: `sessionStorage` 키 `guestChatHistory` 사용 (탭 종료 시 자동 삭제)
- 게스트가 “Start New Chat”을 누르면 기록 삭제 확인 모달이 뜨고, 확인 시 게스트 기록이 초기화됩니다.

### GPA 계산기
- 학기별 과목/성적 입력 및 GPA 계산
- 로그인 사용자: `/grades/me`로 저장/로드
- UI 데이터 구조: `semesterData`, `terms`

### 코스 자동완성
- `/courses/search?query=...` 사용
- 입력창에서 실시간 추천

### 프로필 모달
- `/auth/profile/{user_id}` 호출
- 프론트에서 로그인 여부로 접근 제한

## 3. 주요 파일
- `frontend/index.html`: SPA 마크업
- `frontend/js/main.js`: 채팅 스트리밍 로직, 히스토리, GPA, 코스 검색 핵심 엔진
- `frontend/js/login.js`: JWT 인증, 세션 유지, 보안 로그아웃 (상대 경로 API 연동)
- `frontend/css/style.css`: BEM 명명법 기반 프리미엄 다크 모드 스타일링

## 4. 통신 흐름
1. 로그인 → `POST /auth/login` → 토큰 저장 → `initSession()`에서 `GET /auth/me`
1. 메시지 전송 → `POST /chat`
1. 히스토리 저장/로드 → `/chat/history` (JWT)
1. GPA 저장/로드 → `/grades/me` (JWT)
1. 코스 검색 → `/courses/search`
1. 프로필 조회 → `/auth/profile/{user_id}`

## 5. 스타일 관리
- 현재 Tailwind를 사용하지 않고 `frontend/css/style.css`에 커스텀 CSS를 관리합니다.
- `frontend/css/tailwind.css`, `frontend/css/tailwind.input.css`, `frontend/tools/`는 레거시이며 필요 시 정리 가능합니다.
- 스타일 변경 시 `frontend/index.html` 클래스와 `frontend/css/style.css`를 함께 수정합니다.

## 6. 개발 및 배포 가이드
- **API 경로**: 유연한 배포를 위해 모든 호출은 상대 경로(예: `/auth/me`)를 사용합니다.
- **모달 제어**: `grade-modal--closed`와 같은 CSS 클래스 토글 방식을 사용하여 성능과 애니메이션 가독성을 높였습니다.
- **BEM 구조**: CSS 유지보수를 위해 `.block__element--modifier` 형식을 엄격히 준수합니다.
