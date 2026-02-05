# UCSI 대학교 AI 챗봇 개요

이 문서는 프로젝트 내의 AI 챗봇 구현 내용을 요약합니다. 이 시스템은 RAG(Retrieval-Augmented Generation, 검색 증강 생성) 아키텍처를 사용하여 일반적인 대학 정보와 개인 학생 데이터를 모두 제공합니다.

## 🏗️ 아키텍처 개요

챗봇은 표준 클라이언트-서버 아키텍처를 따릅니다:
- **프론트엔드**: HTML, Tailwind CSS, 순수 자바스크립트(Vanilla JS)로 구축된 단일 페이지 애플리케이션(SPA).
- **백엔드**: RESTful 엔드포인트를 제공하는 FastAPI 애플리케이션.
- **AI 엔진**: Google Gemini (`google-generativeai` SDK 사용).
- **벡터 데이터베이스**: 로컬 문서 검색을 위한 FAISS (Facebook AI Similarity Search).

---

## 📂 주요 구성 요소 (리팩토링 완료)

AI 기능은 이제 `backend/app/ai` 폴더 아래에 모듈화되어 관리됩니다.

### 1. AI 라우터 (`backend/app/ai/router.py`)
챗봇의 통신 인터페이스를 정의합니다.
- **`POST /chat`**: 메인 엔드포인트.
    1. **의도 감지 (Intent Detection)**: Gemini를 사용하여 질문이 "일반(general)"인지 "개인(personal)"인지 분류합니다.
    2. **컨텍스트 검색 (Context Retrieval)**:
        - "개인"인 경우: `student_service.py`에서 데이터를 가져옵니다.
        - "일반"인 경우: `vector.py`를 사용하여 지식 베이스를 검색합니다.
    3. **응답 생성 (Response Generation)**: 사용자 질문과 검색된 컨텍스트를 Gemini에 전달하여 최종 답변을 생성합니다.
- **`POST /chat/ingest`**: 백그라운드에서 실행되며, `data/docs` 내의 문서를 기반으로 벡터 데이터베이스를 다시 구축합니다.

### 2. Gemini 서비스 (`backend/app/ai/gemini.py`)
Google Gemini API와의 모든 직접적인 상호작용을 처리합니다.
- **모델**: `gemini-3-flash-preview`를 사용합니다.
- **주요 함수**:
    - `generate_response`: 시스템 명령과 검색된 컨텍스트를 포함한 프롬프트를 구성합니다.
    - `detect_intent`: 사용자 쿼리를 "일반" 또는 "개인"으로 분류합니다.

### 3. 벡터 서비스 (`backend/app/ai/vector.py`)
RAG(검색 증강 생성) 로직을 구현합니다.
- **임베딩 (Embeddings)**: `HuggingFaceEmbeddings`의 `all-MiniLM-L6-v2` 모델을 사용합니다 (로컬 실행, 무료).
- **저장소**: 효율적인 유사도 검색을 위해 FAISS를 사용합니다.
- **데이터 로드 (Ingestion)**: `data/docs`에서 `.txt` 파일을 읽어 청크(chunk)로 나누고 인덱싱합니다.

### 4. 프론트엔드 UI (`frontend/index.html`)
현대적이고 반응형인 채팅 인터페이스입니다.
- **스타일링**: UCSI Red 색상을 적용한 Tailwind CSS.
- **주요 기능**:
    - "입력 중(typing)" 애니메이션을 포함한 실시간 채팅.
    - `localStorage`를 사용한 지속적인 채팅 기록 저장.
    - 대화 고정, 이름 변경 및 삭제 기능.
    - 개인 학생 정보 접근을 위한 통합 로그인 모달.

---

## ⚙️ 설정 (`backend/app/core/config.py`)
운영에 필요한 주요 설정:
- `GOOGLE_API_KEY`: Gemini 서비스를 위한 API 키 (`.env`에서 로드).
- `DOCS_DIR`: 벡터 데이터베이스의 소스 문서 경로 (`backend/data/docs`).
- `FAISS_INDEX_DIR`: FAISS 인덱스가 저장되는 경로 (`backend/data/faiss_index`).

---

## 🛠️ 데이터 흐름

1. **사용자**가 **프론트엔드**를 통해 메시지를 보냅니다.
2. **백엔드**에서 메시지를 수신하고 **Gemini**에 의도 감지를 요청합니다.
3. 의도가 **일반(general)**인 경우, **벡터 서비스**가 **FAISS**에서 관련 텍스트를 검색합니다.
4. **백엔드**는 사용자 메시지와 검색된 텍스트를 **Gemini**로 보냅니다.
5. **Gemini**가 자연어 응답을 반환합니다.
6. **프론트엔드**에 응답을 표시하고 로컬 기록에 저장합니다.
