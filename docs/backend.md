# Backend 명세서

본 프로젝트의 백엔드는 Python 3.13 + FastAPI 기반 비동기 서버입니다.

## 1. 개요
- 프레임워크: FastAPI
- 서버 실행: Uvicorn (기본 127.0.0.1:8000)
- 특징: 비동기 I/O, 자동 OpenAPI 문서, 모듈화 라우터

## 2. 구성
- `backend/app/main.py`: 앱 생성, CORS, 정적 파일 마운트, 라우터 등록, DB 초기화
- `backend/app/auth/`: 인증/세션
- `backend/app/ai/`: AI 채팅, RAG, 히스토리
- `backend/app/api/`: 코스 검색, GPA 기록
- `backend/app/database/`: MongoDB 연결, 테스트 API
- `backend/app/services/`: 비즈니스 로직
- `backend/app/models/`: Pydantic 스키마

## 3. 엔드포인트
### UI/Health
- `GET /`: `frontend/index.html` 반환
- `GET /health`: 상태 확인

### Auth
- `POST /auth/login`: JSON 로그인
- `POST /auth/token`: OAuth2 폼 로그인
- `GET /auth/me`: JWT 기반 세션 복구
- `GET /auth/profile/{user_id}`: 사용자 프로필 조회 (현재는 토큰 없이 접근 가능)
- `POST /auth/find-password`: 비밀번호 찾기

### Chat
- `POST /chat`, `POST /chat/ask`: AI 채팅
- `POST /chat/ingest`: 벡터 인덱스 재생성
- `GET /chat/history`: 내 채팅 목록
- `POST /chat/history`: 채팅 저장
- `GET /chat/history/{chat_id}`: 채팅 조회
- `PUT /chat/history/{chat_id}`: 제목/핀/메시지 업데이트
- `DELETE /chat/history/{chat_id}`: 채팅 삭제

### Courses
- `GET /courses/search`: 코스 검색

### Grades
- `GET /grades/me`: 내 GPA 기록 조회
- `PUT /grades/me`: 내 GPA 기록 저장/갱신

### DB Test
- `GET /db/test`
- `POST /db/test`
- `DELETE /db/test/{id}`

## 4. 미들웨어 및 보안
- CORS: 모든 Origin 허용 (개발 환경)
- JWT 인증: `Authorization: Bearer <token>`
- 보호 라우트: `/chat/history*`, `/grades/me`, `/auth/me`
- 공개 라우트: `/auth/profile/{user_id}` (프론트에서 UI 레벨 제한)
