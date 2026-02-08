# 설정 레퍼런스

이 문서는 런타임 설정과 주요 상수를 요약합니다.

## 환경 변수 (backend/.env)
- `GOOGLE_API_KEY`: AI 응답/임베딩에 필요
- `SECRET_KEY`: JWT 서명 키. 기본값은 개발용이며 운영에서는 변경 필요
- `DB_HOST`: MongoDB 호스트, 기본 `localhost`
- `DB_PORT`: MongoDB 포트, 기본 `27017`
- `DB_USER`: 정의되어 있으나 현재 연결 URL에는 미사용
- `DB_PASS`: 정의되어 있으나 현재 연결 URL에는 미사용
- `DATABASE_NAME`: MongoDB DB 이름, 기본 `teamB`

## 백엔드 설정 (backend/app/core/config.py)
- `PROJECT_NAME`, `VERSION`, `DESCRIPTON`
- `DATA_DIR`: `backend/data`
- `DOCS_DIR`: `backend/data/docs`
- `FAISS_INDEX_DIR`: `backend/data/faiss_index`
- `STUDENT_DB_PATH`: `backend/data/student_db.json` (현재 사용하지 않음)

## 프론트엔드 상수 (frontend/js/main.js)
- `ALLOW_GUEST_CHAT`: `true`면 게스트 채팅 허용
- `GUEST_CHAT_KEY`: 게스트 히스토리 로컬 스토리지 키

## 세션 복구 (frontend/js/login.js)
- `/auth/me` 호출이 절대 경로로 되어 있어 배포 시 상대 경로로 변경 필요
