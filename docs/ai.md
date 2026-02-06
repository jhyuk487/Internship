# AI Implementation Details

이 문서는 프로젝트 내 AI 기능의 구현 방식과 현재 동작을 설명합니다.

## 1. SDK 및 모델
- **SDK**: `google-genai` (Python) — `genai.Client`로 초기화합니다.
- **기본 모델**: `gemma-3-27b-it`
- **설치 위치**: `backend/app/ai/gemini.py`
- **프롬프트 방식**: 시스템 지침을 프롬프트에 포함해 전달합니다.

## 2. 의도 파악 (Intent Detection)
- 같은 모델을 사용해 질문을 `general` 또는 `personal`로 분류합니다.
- `personal` 질문은 로그인된 사용자(`user_id` 또는 JWT)만 접근 가능합니다.

## 3. RAG / 벡터 검색
- **Vector DB**: FAISS (로컬 디스크 인덱스)
- **임베딩**: `GoogleGenerativeAIEmbeddings` (`models/embedding-001`)
- **문서 소스**: `data/docs/**/*.txt`
- **인덱스 저장 위치**: `data/faiss_index/`
- **업데이트 API**: `POST /chat/ingest` → 백그라운드에서 인덱스 재구성

## 4. 채팅 엔드포인트 동작
- **엔드포인트**: `POST /chat` 및 `POST /chat/ask`
- **토큰 처리**: JWT가 있으면 `sub`에서 `user_id`를 추출해 개인 데이터 접근에 사용합니다.
- **일반 질문**: 벡터 검색 → 컨텍스트 포함 답변 생성
- **개인 질문**: `user_info` 조회 후 컨텍스트 구성
- **출처**: 문서 기반 답변일 때 `sources = ["Vector Knowledge Base"]`

## 5. 주요 파일
- `backend/app/ai/gemini.py` — 모델 호출, 응답 생성, 의도 분류
- `backend/app/ai/vector.py` — FAISS 로딩/검색/인덱싱
- `backend/app/ai/router.py` — `/chat` API 및 히스토리 API
