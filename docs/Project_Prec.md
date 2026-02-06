# [프로젝트 명세서 V2.0] UCSI University AI Chatbot (Local-First)

## 1. 프로젝트 개요
본 프로젝트는 Python 3.13 기반 FastAPI 서버와 로컬 중심 UI를 통해 UCSI 대학교 학사 안내 및 개인 맞춤형 상담을 제공하는 챗봇 시스템입니다.

## 2. 시스템 아키텍처
- **UI**: HTML/CSS/Vanilla JS 기반 단일 페이지 UI
- **API Layer**: FastAPI (로컬 실행 우선)
- **AI Engine**: Google GenAI SDK 기반 Gemma 3
- **Data Layer**: MongoDB + FAISS (로컬)

## 3. 기술 스택
- **Language**: Python 3.13
- **Backend**: FastAPI + Uvicorn
- **AI/NLP**: `google-genai`
- **Vector DB**: FAISS + `langchain_community`
- **Embeddings**: GoogleGenerativeAIEmbeddings (`models/embedding-001`)
- **Database**: MongoDB (Motor + Beanie)
- **Auth**: JWT
- **Frontend**: HTML/CSS/Vanilla JS

## 4. 주요 기능
- **일반 상담**: 대학 소개, 학과, 캠퍼스 정보
- **개인 상담**: 성적, 수강 이력 등 (로그인 필요)
- **RAG 기반 답변**: `data/docs` 문서 기반 답변
- **채팅 히스토리**: 저장/핀/삭제
- **GPA 계산**: 학기별 성적 입력 및 계산

## 5. 로컬 개발 가이드
- `.env`에 `GOOGLE_API_KEY`, `SECRET_KEY` 설정
- `uvicorn app.main:app --reload`로 실행
- MongoDB 로컬 인스턴스 필요
