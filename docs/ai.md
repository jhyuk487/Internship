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
- `personal` 질문 시, 로그인한 학생의 프로필 정보와 함께 **성적 데이터(`academic_records`)**를 컨텍스트에 주입하여 답변합니다.
- `general` 질문은 벡터 검색 후 컨텍스트를 주입해 답변하며, 문서 기반 응답일 때 `sources = ["Vector Knowledge Base"]`를 반환합니다.
- **피드백 루프 (RLHF 기반):** 모든 AI 답변 하단에 **아이콘 형태의 Like/Dislike** 버튼을 제공합니다.
    - 사용자는 자유롭게 선택을 변경(Re-vote)할 수 있으며, 데이터는 `chat_feedback` 콜렉션에 [질문/답변/평가/시간] 세트로 실시간 기록됩니다.
    - 수집된 데이터는 향후 **Gemma 3 모델의 미세 조정(Fine-tuning)** 및 성능 분석의 핵심 자산으로 활용됩니다.
