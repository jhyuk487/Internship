# Frontend 명세서 & Documentation

이 문서는 웹 UI 구성, 주요 동작, 백엔드 연동 방식을 설명합니다.

## 1. 개요
- 기술 스택: HTML5, CSS3, Vanilla JavaScript
- 목표: 로컬 우선 UI와 빠른 반응성
- 핵심 기능: 로그인, AI 채팅, 채팅 히스토리, GPA 계산기, 코스 자동완성
- 게스트 정책: 채팅은 가능, 히스토리/프로필/GPA는 로그인 필요 (UI에서 제한)

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
- `frontend/js/main.js`: 채팅, 히스토리, GPA, 코스 검색
- `frontend/js/login.js`: 로그인/로그아웃, 세션 복구
- `frontend/css/style.css`: UI 스타일

## 4. 통신 흐름
1. 로그인 → `POST /auth/login` → 토큰 저장 → `initSession()`에서 `GET /auth/me`
1. 메시지 전송 → `POST /chat`
1. 히스토리 저장/로드 → `/chat/history` (JWT)
1. GPA 저장/로드 → `/grades/me` (JWT)
1. 코스 검색 → `/courses/search`
1. 프로필 조회 → `/auth/profile/{user_id}`

## 5. Tailwind 로컬 빌드
- 스타일은 `frontend/css/tailwind.css`로 빌드됩니다.
- 빌드 입력 파일: `frontend/css/tailwind.input.css`
- Tailwind 설정: `frontend/tools/tailwind.config.js`
- 빌드 명령:
```bash
cd frontend/tools
npm run build:css
```
- HTML 클래스나 Tailwind 설정을 바꾼 경우, 빌드를 다시 실행해야 합니다.
- `frontend/tools/node_modules`는 Git에서 무시됩니다. 팀원은 아래 명령으로 설치하세요.
```bash
cd frontend/tools
npm install
```

## 6. 배포 시 유의
- `frontend/js/login.js`의 `/auth/me` 호출은 `http://127.0.0.1:8000`로 고정되어 있습니다. 배포 환경에서는 상대 경로로 변경하세요.
- 백엔드 경로가 바뀌면 모든 `fetch()` 경로를 업데이트해야 합니다.
