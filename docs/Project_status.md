# 프로젝트 상태 보고서: UCSI 챗봇

## 1. 프로젝트 개요
- **목표:** Python 3.13 및 Google Gemini API(무료 티어)를 사용하여 UCSI 대학교를 위한 로컬 우선(Local-first) AI 챗봇 개발.
- **현재 상태:** 프론트엔드 및 백엔드가 작동하는 기능성 프로토타입 단계.

## 2. 구현된 기능

### ✅ 백엔드 (FastAPI)
- **프레임워크:** Uvicorn 위에서 실행되는 FastAPI.
- **구조:** 모듈식 설계 (`app/api`, `app/core`, `app/services`).
- **엔드포인트:**
  - `GET /`: 채팅 UI (`index.html`) 제공.
  - `GET /health`: 상태 확인(Health check) 엔드포인트.
  - `POST /auth/token`: JWT 인증 엔드포인트.
  - `POST /chat/ask`: 메인 채팅 인터페이스.
- **정적 파일:** `app/static` 경로 서빙 정상 작동.

### ✅ AI 통합 (Google Gemini)
- **서비스:** `GeminiService` 클래스 구현 완료.
- **모델:** `gemini-flash-latest` 사용 설정됨.
- **기능:**
  - **의도 파악(Intent Detection):** 질문을 '일반(general)' 또는 '개인(personal)'으로 자동 분류.
  - **문맥 인식 응답:** UCSI 대학교 상황에 맞는 시스템 지침 설정 완료.
  - **RAG 기반:** 문맥 주입(Context Injection)을 지원하므로 검색 증강 생성(RAG) 구현 가능.

### ✅ 프론트엔드 (HTML/JS/CSS)
- **UI:** 메시지 기록이 있는 깔끔한 채팅 인터페이스.
- **상호작용:**
  - 실시간 메시지 송수신.
  - **인증 UI:** 로그인 모달, JWT 토큰 저장 및 로그아웃 기능.
  - **출처 표시:** 말풍선 내 인용 출처 표시 기능 지원.

### ✅ 테스트 및 개발
- **의존성:** `requirements.txt`를 통해 관리됨 (`langchain`, `faiss-cpu`, `fastapi` 등 포함).
- **테스트 스크립트:**
  - `test_gemini.py`: API 연결 확인.
  - `test_server.py`: 서버 상태 확인.
  - `test_chat_api.py`: 채팅 엔드포인트 검증.

## 3. 보류 / 진행 중
- **백터 데이터베이스(Vector Database):** `faiss-cpu`가 요구사항에 있지만, 문서 수집(ingestion)을 포함한 전체 RAG 파이프라인 통합 검증 필요.
- **데이터베이스 통합:** `data/student_db.json`이 존재하여 읽기 전용 DB 역할을 수행하지만, 이를 '개인(personal)' 의도와 연결하는 로직의 완전한 검증 필요.
- **LangChain 오케스트레이션:** 의존성은 설치되어 있으나, `chat.py` (Router)에서의 정확한 사용법 확인 필요.

## 4. 다음 단계
- `detect_intent` (Personal)와 `student_db.json` 검색 간의 연결 확인.
- 일반 대학 문서에 대한 Vector DB 수집(ingestion) 기능 확정.
