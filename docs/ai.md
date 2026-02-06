# AI Implementation Details (Reactivated)

이 문서는 프로젝트 내 AI 기능의 구현 현황과 모델 전략을 설명합니다.

## 1. 현재 상태: 활성화 (AI Features Active)

현재 프로젝트의 AI 기능은 완전히 복구되었으며, 최신 모델을 기반으로 정상 작동 중입니다.

### 주요 업데이트 사항
- **Google SDK 통합:** 최신 `google-generativeai` 라이브러리를 사용하여 안정적인 통신을 보장합니다.
- **임베딩 최적화:** 로컬 타임아웃 문제를 해결하기 위해 `GoogleGenerativeAIEmbeddings`를 사용하여 RAG 성능을 고도화했습니다.
- **하이브리드 지원:** 제미나이(Gemini)와 젬마(Gemma) 모델을 손쉽게 교체할 수 있는 구조를 갖추었습니다.

## 2. 사용 중인 모델

- **주력 모델:** `gemma-3-27b-it` (최신 오픈 소스 모델)
  - **특징:** 높은 지능과 빠른 응답 속도를 균형 있게 제공하며, 대학 안내 챗봇에 최적화된 문맥 파악 능력을 보유하고 있습니다.
- **대체 모델:** `gemini-2.5-flash`
  - 필요에 따라 더 광범위한 추론이나 멀티모달 기능이 필요할 때 즉시 전환 가능하도록 설계되었습니다.

## 3. 핵심 코드 구조

- **[gemini.py](file:///c:/Users/SeChun/Documents/Internship/backend/app/ai/gemini.py)**: 모델 초기화, 생성(Generation), 의도 파악(Intent Detection) 로직 통합 관리.
- **[vector.py](file:///c:/Users/SeChun/Documents/Internship/backend/app/ai/vector.py)**: Google Embeddings를 활용한 벡터 데이터베이스 검색 및 문서 주입 처리.
- **[router.py](file:///c:/Users/SeChun/Documents/Internship/backend/app/ai/router.py)**: API 엔드포인트와 AI 서비스를 연결하며, 사용자 권한에 따른 정보 접근 제어.

## 4. 향후 로드맵
1.  **Gemma 3 맞춤형 프롬프트 고도화**: 오픈 모델 특성에 최적화된 지시문 개선.
2.  **개인화 상담 강화**: 로그인 사용자의 학업 이력을 바탕으로 한 맞춤형 장학금/수강 신청 안내.
