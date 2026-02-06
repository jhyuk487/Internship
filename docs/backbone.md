# Backbone 명세서 (AI Core)

UCSI 챗봇의 지능형 핵심 모듈로, 사용자의 감성을 읽고 대화를 오케스트레이션하는 역할을 합니다.

## 1. 개요
- **AI 엔진:** Google Gemini API (gemini-flash-latest)
- **오케스트레이션:** LangChain (Prompt Templates, LLM Chains)
- **핵심 기술:** 의도 파악(Intent Detection) 및 검색 증강 생성(RAG)

## 2. 의도 파악 (Intent Detection)
사용자의 입력을 분석하여 두 가지 경로로 분기합니다:
- **General (일반):** 대학 일반 정보에 관한 질문. Vector DB 기반 RAG를 수행합니다.
- **Personal (개인):** 성적, 출결 등 개인 학사 정보에 관한 질문. MongoDB의 실시간 데이터를 조회합니다.

## 3. RAG 시스템 (Retrieval-Augmented Generation)
- **Vector DB:** FAISS/Chroma (로컬 서버에 인덱스 저장).
- **기술 흐름:**
    1. 사용자의 질문을 임베딩 벡터로 변환.
    2. Vector DB에서 관련성이 높은 문서 조각(docs) 검색.
    3. 검색된 내용을 프롬프트에 Context로 주입하여 Gemini가 답변 생성.

## 4. 시스템 프롬프트 및 지침
- 챗봇은 UCSI University의 공식 도우미로서 정체성을 가집니다.
- 말레이시아 문화 및 UCSI 대학교의 특수 상황을 이해하도록 가이드라인이 설정되어 있습니다.
- 답변 시 출처(Sources)를 함께 제공하여 신뢰성을 확보합니다.
