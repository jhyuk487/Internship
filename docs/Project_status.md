# 📊 UCSI University AI Chatbot - 프로젝트 통합 현황 보고서 (V2.1)

**작성일시**: 2026-02-06
**작성자**: Antigravity (AI Assistant)
**상태**: 🟢 정상 작동 (Server Running)

---

## 1. 프로젝트 요약 (Executive Summary)
본 프로젝트는 **UCSI 대학교 학생 지원을 위한 로컬 우선(Local-First) AI 챗봇**입니다.
초기 개발 브랜치(`jun`)와 데이터 중심 브랜치(`ehobin`)를 **성공적으로 병합(Merge)**하여, 안정적인 FastAPI 서버 로직 위에 풍부한 학사 데이터를 확보한 상태입니다. 불필요한 레거시 코드를 제거(Optimization)하여 시스템을 경량화했습니다.

---

## 2. 시스템 아키텍처 (System Architecture)

### 2.1 하이브리드 구조 (Hybrid Structure)
두 개의 브랜치를 장점만을 취하여 통합했습니다.
- **Logic Core (`jun` branch)**: `app/api`, `app/db` 등 최신 FastAPI 클린 아키텍처 유지.
- **Knowledge Base (`ehobin` branch)**: `backend/data/`의 풍부한 대학 정보 JSON 데이터 및 `docs/`의 상세 기술 문서 흡수.

### 2.2 기술 스택
- **Language**: Python 3.13
- **Framework**: FastAPI (Async Performance)
- **Database**: 
  - **NoSQL**: MongoDB (Localhost:27017) - 학생 계정 관리
  - **Vector DB**: FAISS (Local) - RAG 검색 엔진
- **AI Engine**: 
  - **LLM**: Google Gemini (gemini-3-flash)
  - **Orchestration**: LangChain
- **Frontend**: Vanilla HTML/JS + Tailwind CSS (Single File Optimized)

---

## 3. 주요 구현 기능 (Key Features)

### ✅ A. 백엔드 및 AI (Backend & AI)
1.  **지능형 의도 분류 (Intent Detection)**:
    - 사용자 입력을 분석하여 `Personal`(개인 정보), `General`(일반 상담)로 자동 분류.
    - 개인 정보 요청 시 JWT 인증 여부 확인.
2.  **RAG (검색 증강 생성) 시스템**:
    - LangChain과 FAISS를 사용하여 로컬 문서(`docs/`) 및 데이터(`data/`) 기반의 정확한 답변 생성.
3.  **MongoDB 연동**:
    - `motor` 비동기 드라이버 및 `beanie` ODM을 사용하여 고성능 DB 입출력 구현.
4.  **API 보안**:
    - `.env`를 통한 API Key 및 DB 접속 정보 관리 (API Key 교체 및 검증 완료).

### ✅ B. 프론트엔드 (Frontend)
1.  **AI 채팅 인터페이스**:
    - Tailwind CSS 기반의 반응형 디자인.
    - 타이핑 효과(Streaming-like UI) 및 로딩 인디케이터 구현.
2.  **대화 고정 기능 (Pin Chat)**:
    - 중요 대화를 상단에 고정하는 핀(`push_pin`) 기능 구현.
    - 시각적 강조(노란색 아이콘 + 배경 하이라이트) 및 로컬 스토리지 저장.
3.  **최적화**:
    - 복잡한 파일 구조(`js/`, `css/`)를 단일 `index.html`로 통합하여 로딩 속도 및 관리 편의성 증대.

---

## 4. 최근 작업 내역 (Work Log)

1.  **API 키 대응**: 
    - Google Gemini API Key 변경 및 유효성 검증, 서버 재시작을 통한 즉시 반영.
2.  **코드 병합 (Git Merge)**:
    - `fatal: refusing to merge unrelated histories` 오류 해결.
    - `origin/ehobin`의 데이터와 문서를 가져오되, 실행 로직 충돌을 수동으로 해결하여 안정성 확보.
3.  **코드 최적화 (Optimization)**:
    - 병합 후 사용하지 않는 레거시 폴더(`auth/`, `services/` 등 구버전) 및 임시 파일 제거.
    - `README.md` 및 프로젝트 구조 정리.
4.  **오류 복구**:
    - 서버 재시작 시 `unused import`로 인한 실행 오류 발견 및 즉시 수정 (`app/ai/__init__.py`).
    - 포트 충돌 방지를 위한 좀비 프로세스 정리 후 재가동.

---

## 5. 프로젝트 디렉토리 구조

```text
root/
├── backend/            # 핵심 서버 코드
│   ├── app/
│   │   ├── ai/         # AI 서비스 (Gemini, Vector DB)
│   │   ├── api/        # API 라우터 (Auth, Chat)
│   │   ├── core/       # 설정 (Config)
│   │   ├── db/         # MongoDB 연결 및 모델
│   │   └── main.py     # 진입점 (App Entry)
│   ├── data/           # 지식 베이스 JSON 데이터 (Courses, Faculties 등)
│   └── requirements.txt
├── docs/               # 프로젝트 기술 문서 (10종)
├── frontend/           # 웹 UI
│   └── index.html      # 통합 프론트엔드 파일
└── README.md
```

---

## 6. 실행 방법 (How to Run)

**1. 서버 실행 (Backend)**
```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**2. 서비스 접속**
웹 브라우저에서 [http://127.0.0.1:8000](http://127.0.0.1:8000) 접속.
