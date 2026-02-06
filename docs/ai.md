# AI Implementation Details

이 문서는 프로젝트 내 AI 기능의 구현 현황과 비활성화 사유를 설명합니다.

## 1. 현재 상태: 비활성화 (AI Features Disabled)

현재 프로젝트의 AI 관련 기능(벡터 검색, 의도 파악 등)은 네트워크 및 환경 문제로 인해 **임시 비활성화** 상태입니다.

### 주요 사유
- **Hugging Face 모델 다운로드 타임아웃**: `all-MiniLM-L6-v2` 임베딩 모델을 로컬로 다운로드하는 과정에서 네트워크 시간 초과가 발생하여 서버 시작이 불가능해지는 현상을 방지하기 위함입니다.
- **성능 최적화**: 필수 기능인 로그인 및 DB 연동을 우선적으로 확인하기 위해 무거운 AI 초기화 로직을 주석 처리했습니다.

## 2. 비활성화된 코드 위치

- **[vector.py](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/ai/vector.py)**: `HuggingFaceEmbeddings` 초기화 및 인덱스 로드 로직 주석 처리.
- **[main.py](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/main.py)**: `/chat` 엔드포인트를 제공하는 AI 라우터 등록 주석 처리.

## 3. 향후 재활성화 방안 (Google Embeddings 추천)

네트워크 문제를 피하고 AI 기능을 다시 사용하려면 다음 방안을 추천합니다:

1.  **Google Gemini Embedding API 사용**: 로컬 다운로드가 필요 없는 Google의 클라우드 API를 직접 사용합니다.
2.  **방법**: `backend/requirements.txt`에 `langchain-google-genai`를 추가하고, `vector.py`에서 `GoogleGenerativeAIEmbeddings`를 사용하도록 수정합니다.
