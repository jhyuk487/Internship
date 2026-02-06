# AI Implementation Details (Reactivated)

<<<<<<< HEAD
이 문서는 프로젝트 내 AI 기능의 구현 현황과 기술적 전략을 설명합니다.

## 1. 현재 상태: 활성화 (AI Features Active)

현재 프로젝트의 AI 기능은 완전히 복구되었으며, 최신 모델과 SDK를 기반으로 정상 작동 중입니다.

### 주요 업데이트 사항
- **SDK 마이그레이션:** 최신 `google-genai` (Google AI Python SDK v2) 라이브러리로 완전히 마이그레이션하여 성능과 안정성을 확보했습니다.
- **하이브리드 지원:** 제미나이(Gemini)와 젬마(Gemma) 모델을 유연하게 교체할 수 있는 구조를 갖추었습니다.
- **임베딩 최적화:** `GoogleGenerativeAIEmbeddings`를 사용하여 로컬 타임아웃 문제 없이 고성능 RAG 기능을 지원합니다.

## 2. 사용 중인 모델 전략

- **주력 모델:** `gemma-3-27b-it` (최신 오픈 소스 모델)
  - **특징:** 높은 추론 지능과 빠른 응답 속도를 제공하며, 대학 안내 챗봇의 시스템 인스트럭션 이행 능력이 뛰어납니다.
- **보조 모델:** `gemini-2.0-flash`
  - 더 광범위한 데이터 처리나 고성능 추론이 필요한 경우 즉시 전환 가능하도록 설계되어 있습니다.

## 3. 핵심 기능 구현 내용

### ✅ 의도 파악 (Intent Detection)
- 사용자의 질문을 `general`과 `personal`로 분류합니다.
- 개인 정보(성적, 등록금 등) 관련 질문일 경우 MongoDB 연동을 트리거하여 보안 인증을 거친 정보를 제공합니다.

### ✅ 문맥 인식 상담 (Context Awareness)
- UCSI 대학교의 특정 데이터를 시스템 인프라 및 프롬프트에 주입하여, 대학교 전용 AI로서 정확하고 신뢰성 있는 답변을 생성합니다.

## 4. 핵심 코드 구조

- **[gemini.py](file:///c:/Users/SeChun/Documents/Internship/backend/app/ai/gemini.py)**: `GeminiService` 클래스를 통해 모델 초기화, 텍스트 생성, 의도 파악 등을 중앙 집중 관리합니다.
- **[vector.py](file:///c:/Users/SeChun/Documents/Internship/backend/app/ai/vector.py)**: 벡터 데이터베이스 검색 및 실시간 문서 참조를 처리합니다.
- **[router.py](file:///c:/Users/SeChun/Documents/Internship/backend/app/ai/router.py)**: API 엔드포인트와 AI 서비스를 연결하며, 게스트 및 로그인 사용자의 권한을 제어합니다.

## 5. 향후 로드맵
1.  **고급 RAG 파이프라인**: 대학 학사 규정(PDF) 등에 대한 FAISS/Vector Search 연동 고도화.
2.  **멀티모달 확장**: 학생 증명서나 성적표 이미지를 인식하여 자동 답변하는 기능 연구.
