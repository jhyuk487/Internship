# 배포 가이드

본 프로젝트는 로컬 우선(Local-first)에 최적화되어 있습니다. 배포 시 아래 항목을 확인하세요.

## 로컬 실행
1. `backend/`에서 의존성을 설치하고 가상환경을 활성화합니다.
1. `backend/.env`에 필요한 키를 설정합니다.
1. `backend` 폴더에서 `uvicorn app.main:app --reload` 실행
1. `http://127.0.0.1:8000/`에서 UI 접속

## 정적 파일
- `backend/app/main.py`에서 정적 파일을 `../frontend`로 마운트합니다.
- 서버 실행 위치가 `backend/` 기준이므로, 루트에서 실행하면 경로 조정이 필요합니다.
- 운영 환경에서는 FastAPI 대신 Nginx 등의 리버스 프록시로 `frontend/`를 서빙하는 것을 권장합니다.

## Base URL 및 상대 경로
- 대부분 `fetch()`는 상대 경로를 사용합니다.
- `frontend/js/login.js`의 `/auth/me`는 절대 경로로 작성되어 있으므로 배포 시 상대 경로로 변경하세요.

## 환경 변수
- `GOOGLE_API_KEY`: AI 응답 및 임베딩에 필요
- `SECRET_KEY`: 운영 환경에서는 반드시 변경
- `DB_HOST`, `DB_PORT`, `DATABASE_NAME`: MongoDB 환경에 맞게 설정

## CORS
- 현재는 모든 Origin을 허용합니다.
- 배포 환경에서는 신뢰 가능한 도메인으로 제한하세요.

## RAG 인덱스
- 문서 위치: `backend/data/docs/`
- 문서 업데이트 후 `POST /chat/ingest` 호출로 인덱스 재생성
