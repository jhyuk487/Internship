# AI Implementation Details

이 문서는 프로젝트 내 AI 기능의 구현 현황과 기술 스택을 설명합니다.

## 1. 기술 스택 (Tech Stack)

- **SDK:** `google-genai` (Google AI Python SDK v2)
- **Model:** `gemini-2.0-flash`
- **Infrastructure:** `GeminiService` 클래스를 통해 추상화 및 중앙 관리.

## 2. 주요 구현 내용

### ✅ SDK 마이그레이션 (`google.generativeai` -> `google-genai`)
- 이전의 구형 라이브러리에서 최신 Google AI SDK로 전환하여 성능 및 최신 모델 지원을 확보했습니다.
- `from google import genai` 방식을 사용하여 모델 호출 구조를 표준화했습니다.

### ✅ 의도 파악 (Intent Detection)
- 사용자의 질문을 `general`과 `personal`로 분류합니다.
- 개인 정보 관련 질문일 경우 학생 DB(MongoDB) 연동을 트리거하도록 설계되었습니다.

### ✅ 문맥 인식 상담 (Context Awareness)
- UCSI 대학교의 특정 데이터를 시스템 인스트럭션으로 주입하여, 범용적인 답변이 아닌 대학교 전용 AI로서 동작하게 설정했습니다.

## 3. 현재 운영 상태: 일시 비활성화 (Quota Optimization)

현재 AI 할당량(Quota) 초과 방지 및 안정적인 서버 운영을 위해 **모델 생성부(`generate_content`)를 일시적으로 주석 처리**한 상태입니다.

- **Frontend**: 채팅 전송 시 `/chat` 요청을 보내지 않고 클라이언트 측에서 안내 문구를 출력합니다.
- **Backend**: `GeminiService` 내부에서 실제 API 호출 대신 Placeholder 텍스트를 반환합니다.

## 4. 향후 로드맵

1.  **RAG 강화**: 대학 규정 PDF/Text 데이터를 FAISS 또는 MongoDB Atlas Vector Search를 통해 연동.
2.  **보안 필터링**: 개인 데이터 노출 방지를 위한 자체 검열 레이어 추가.
3.  **멀티모달 확장**: 이미지(성적표, 등록증)를 인식하여 처리하는 기능 고도화.
