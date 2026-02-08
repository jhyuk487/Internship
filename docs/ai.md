# AI Implementation Details

이 문서는 프로젝트 내 AI 기능의 구현 방식과 현재 동작을 설명합니다.

## 1. SDK 및 모델
- SDK: `google-genai` (`genai.Client`)
- 기본 모델: `gemma-3-27b-it`
- 구현 위치: `backend/app/ai/gemini.py`

## 2. 프롬프트 및 응답 방식
- 시스템 지침을 프롬프트 본문에 포함해 전달합니다.
- 응답은 Markdown 형식으로 생성하도록 유도합니다.

## 3. 의도 파악 (Intent Detection)
- 질문을 `general` 또는 `personal`로 분류합니다.
- 오류 발생 시 기본값은 `general`입니다.

## 4. RAG / 벡터 검색
- Vector DB: FAISS (`langchain_community`)
- 임베딩: `GoogleGenerativeAIEmbeddings` (`models/embedding-001`)
- 문서 경로: `backend/data/docs/**/*.txt`
- 인덱스 저장: `backend/data/faiss_index/`
- 갱신 API: `POST /chat/ingest` (백그라운드 작업)

## 5. 채팅 엔드포인트 동작
- `POST /chat`, `POST /chat/ask`에서 동일 로직 사용
- `personal` 질문이며 로그인이 없으면 로그인 안내 메시지를 반환합니다.
- `general` 질문은 벡터 검색 후 컨텍스트를 주입해 답변합니다.
- 문서 기반 응답일 때 `sources = ["Vector Knowledge Base"]`를 반환합니다.
