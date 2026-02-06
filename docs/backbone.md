# Backbone 명세서 (AI Core)

UCSI 챗봇의 핵심 AI 흐름을 담당하는 모듈을 설명합니다.

## 1. 개요
- **AI 엔진**: Google GenAI SDK (`google-genai`)
- **기본 모델**: `gemma-3-27b-it`
- **핵심 기능**: 의도 파악(Intent Detection) + 검색 증강 생성(RAG)

## 2. 의도 파악 (Intent Detection)
- 질문을 `general`(일반) / `personal`(개인)로 분류합니다.
- `personal` 질문은 인증된 사용자에 한해 학생 정보를 조회합니다.

## 3. RAG 시스템 (Retrieval-Augmented Generation)
- **Vector DB**: FAISS (로컬 인덱스)
- **임베딩**: Google Generative AI Embeddings (`models/embedding-001`)
- **문서 소스**: `data/docs/**/*.txt`
- **흐름**:
  1. 질문 임베딩
  2. 관련 문서 검색
  3. 컨텍스트로 주입 후 답변 생성

## 4. 시스템 프롬프트 및 지침
- UCSI University 공식 도우미로서의 톤과 역할을 유지합니다.
- 컨텍스트가 없을 경우 일반 지식 기반으로 답변하되, 정보의 범위를 명확히 알립니다.
- 개인 정보 질문은 인증 필요 메시지를 안내합니다.
