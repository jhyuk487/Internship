# Backend 명세서

본 프로젝트의 백엔드는 Python 3.13과 FastAPI를 기반으로 하는 비동기 서버 시스템입니다.

## 1. 개요
- **프레임워크**: FastAPI (Python 3.13)
- **실행 환경**: Uvicorn (기본 127.0.0.1:8000)
- **주요 특징**: 비동기 I/O, 자동 Swagger 문서, 모듈화된 라우터 구조

## 2. 서버 구조
- `backend/app/main.py`: 앱 생성, CORS 설정, 정적 파일 마운트, 라우터 등록
- `backend/app/auth/`: 로그인/토큰/프로필 API
- `backend/app/ai/`: AI 채팅, RAG, 히스토리 API
- `backend/app/database/`: MongoDB 연결 및 테스트 API
- `backend/app/api/`: 부가 API (코스 검색)
- `backend/app/services/`: 도메인 서비스 (학생, 채팅 히스토리, 코스 검색)
- `backend/app/models/`: Pydantic 스키마

## 3. 주요 API 엔드포인트
- `GET /` : 프론트엔드 `index.html` 제공
- `GET /health` : 서버 상태 확인
- `POST /auth/login` : JSON 로그인
- `POST /auth/token` : OAuth2 폼 로그인
- `GET /auth/me` : 토큰 기반 세션 복구
- `GET /auth/profile/{user_id}` : 사용자 프로필 조회
- `POST /auth/find-password` : 비밀번호 찾기
- `POST /chat` 또는 `POST /chat/ask` : AI 채팅
- `POST /chat/ingest` : 벡터 인덱스 재생성
- `GET /chat/history` : 내 채팅 목록
- `POST /chat/history` : 채팅 저장
- `GET /chat/history/{chat_id}` : 특정 채팅 조회
- `PUT /chat/history/{chat_id}` : 제목/핀/메시지 업데이트
- `DELETE /chat/history/{chat_id}` : 채팅 삭제
- `GET /courses/search` : 코스 이름 검색
- `GET /db/test` / `POST /db/test` / `DELETE /db/test/{id}` : DB 연결 테스트

## 4. 미들웨어 및 보안
- **CORS**: 모든 Origin 허용 (개발 환경)
- **JWT 인증**: `backend/app/auth/security.py`에서 토큰 생성 및 검증
- **DB 초기화**: `startup` 이벤트에서 `init_db()` 호출
