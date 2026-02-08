# 문제 해결

## 로그인은 되는데 세션이 복구되지 않음
- `frontend/js/login.js`의 `/auth/me` 호출이 절대 경로입니다.
- 백엔드 호스트/포트가 다르면 상대 경로로 변경하세요.

## 보호 라우트 401 발생
- `Authorization: Bearer <token>`이 포함되어 있는지 확인하세요.
- 토큰이 만료되었을 수 있으니 다시 로그인하세요.

## MongoDB 연결 오류
- `.env`의 `DB_HOST`, `DB_PORT`, `DATABASE_NAME` 확인
- MongoDB가 실행 중인지 확인

## RAG 응답이 비어 있음
- `backend/data/docs/`에 `.txt` 문서가 있는지 확인
- `POST /chat/ingest`로 FAISS 인덱스를 재생성하세요.

## GPA 저장이 안 됨
- `/grades/me`는 보호 라우트입니다. 로그인 필요.
- 요청에 토큰이 포함되어 있는지 확인하세요.

## 로그인 후 채팅 히스토리가 비어 있음
- `/chat/history`가 정상 응답하는지 확인
- 로그인 이후 `loadChatHistoryFromBackend()`가 호출되는지 확인

## 브라우저 CORS 오류
- 백엔드는 현재 모든 Origin 허용이지만, 프론트는 같은 Origin으로 서빙하는 것이 안전합니다.
- 다른 Origin에서 접근한다면 CORS Origin을 명시적으로 설정하세요.
