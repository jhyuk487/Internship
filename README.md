# UCSI University AI Chatbot (Local-First)

UCSI 대학교 학생을 위한 AI 학사 도우미입니다. FastAPI 백엔드와 로컬 우선 UI로 구성되어 있으며,
일반 질문과 개인 질문(로그인 필요)을 분리해 답변합니다. RAG(문서 검색 기반)와 채팅 히스토리,
GPA 기록 기능을 제공합니다.

## 주요 기능
- AI 상담: 문서 검색(RAG) 기반 일반 질문 답변, 개인 질문은 로그인 사용자 정보 기반 응답
- 인증/세션: JWT 로그인 및 세션 복구, 학번/이메일 기반 비밀번호 찾기
- 채팅 히스토리: 로그인 사용자 `/chat/history` 저장/핀/삭제, 게스트는 로컬 스토리지에 임시 기록
- GPA 기록: 학기별 과목/성적 입력 및 GPA 계산, 로그인 사용자 `/grades/me` 저장/로드
- 코스 자동완성: `/courses/search`로 과목 검색

## 기술 스택
- Backend: FastAPI, Uvicorn, Beanie, Motor, MongoDB
- AI: `google-genai`, `langchain`, FAISS, `langchain-google-genai`
- Frontend: HTML, CSS, Vanilla JS
- Auth: JWT

## 프로젝트 구조
```text
project-root/
|-- backend/
|   |-- app/                 # FastAPI 앱
|   |-- data/                # RAG 문서/FAISS 인덱스 (실행 시 자동 생성)
|   |-- seed_db.py            # data_sets 동기화 스크립트
|   |-- requirements.txt
|-- frontend/                 # UI (HTML/CSS/JS)
|-- docs/                     # 문서
|-- debug/                    # 개발/점검 스크립트
|-- data_sets/                # 초기 DB 데이터(JSON)
|-- README.md
```

## 빠른 시작
1. 사전 준비: Python 3.13, MongoDB(로컬 또는 Atlas), Google GenAI API Key
1. 의존성 설치
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```
1. 환경 변수 설정
`backend/.env` 파일을 생성하고 아래 값을 설정합니다.
```env
GOOGLE_API_KEY=your_google_api_key_here
SECRET_KEY=your_secret_key_here
DB_HOST=localhost
DB_PORT=27017
DATABASE_NAME=teamB
```
1. 서버 실행
```bash
cd backend
uvicorn app.main:app --reload
```
1. 접속
브라우저에서 `http://127.0.0.1:8000/`로 접속합니다.

## 데이터 시드 및 도구
- `backend/seed_db.py`는 `data_sets/*.json`을 MongoDB에 동기화합니다. `grade_records.json`도 포함합니다.
- `debug/seed_db.py`는 레거시 동기화 스크립트로, `grade_records`는 처리하지 않습니다.
- `debug/seed_user.py`는 구형 필드명(`student_id`, `password`) 기준이라 수정이 필요할 수 있습니다.
- `debug/check_health.py`, `debug/export_db.py`, `debug/import_db.py` 등 점검 스크립트가 포함되어 있습니다.

## RAG 문서 갱신
- 문서 경로: `backend/data/docs/**/*.txt`
- 인덱스 재생성: `POST /chat/ingest`

## 더 자세한 문서
- `docs/backend.md`
- `docs/frontend.md`
- `docs/ai.md`
- `docs/database.md`
