# [프로젝트 명세서 V2.0] UCSI University AI Chatbot (Free & Local-First)

## 1. 프로젝트 개요 (Project Overview)
본 프로젝트는 Python 3.13을 기반으로 하며, 외부 비용 발생 없이 Google Gemini API의 무료 티어를 활용하여 UCSI 대학교의 입학, 학과, 성적 및 캠퍼스 생활 정보를 지원하는 AI 챗봇 시스템을 개발하는 것을 목표로 합니다.

개발 주기: 2주 (총 40시간).
개발 환경: Python 3.13 (Localhost 테스트 우선).
비용 목표: 0원 (무료 API 및 오픈소스 프레임워크 활용).
핵심 가치: 짧은 개발 주기 내에 DB 통합 및 자기 학습 능력을 갖춘 시스템 구축.

## 2. 시스템 아키텍처 (System Architecture)
개발 단계에서는 localhost에서 모든 기능을 테스트하며, 추후 제공되는 서버 인프라로 소스 코드를 이전할 수 있도록 유연하게 설계합니다.

Web / Mobile UI: 사용자의 입력을 받는 접점.
API Layer (FastAPI): Python 3.13 기반의 비동기 서버로, 로컬 환경에서 API 엔드포인트를 제공.
AI Conversation Engine: **Google Gemini API (Free)**를 사용하여 자연어 이해 및 생성을 처리.
Business Logic Layer: 규칙 적용 및 DB 데이터의 정확성 보장.
Data Layer: 로컬 Vector DB(FAISS/Chroma)와 UCSI 대학교 DB 연동.

## 3. 기술 스택 (Technology Stack - Zero Cost)
모든 도구는 무료이며 로컬 테스트에 최적화된 조합입니다.

구분상세 기술 (Cost: 0원)비고

Language
Python 3.13
최신 런타임 환경 사용

Backend
FastAPI
가볍고 빠른 API 프레임워크 (uvicorn으로 로컬 실행) 

AI / NLP
Google Gemini API (Free Tier)
일일 할당량 내에서 무료 사용 가능한 고성능 LLM 

Orchestration
LangChain
대화 흐름 제어 및 도구 연결 

Vector DB
FAISS / Chroma (Local)
서버 설치 없이 로컬 파일 형태로 저장 가능 

Database
UCSI DB (Read-only)
제공되는 데이터베이스에 대한 읽기 권한 활용 

Auth
JWT (PyJWT)
로컬에서도 테스트 가능한 자체 인증 체계 

## 4. 주요 기능 모듈 (Functional Modules)

### 4.1. 질의 및 상담 기능 
비인증 모드: 대학교 일반 정보, 학과 소개, 프로그램 안내, 기숙사 및 시설 정보 제공.
인증 모드 (Student ID/PW): 성적 조회, 수강 상태 확인 등 개인 맞춤형 정보 조회.

### 4.2. 대화 및 로직 흐름 
사용자 질문: localhost API를 통해 질문 수신.
의도 파인딩: Gemini API가 질문의 의도를 분석하고 분류.
인증 체크: 개인 정보가 필요한 질문인지 확인.
데이터 추출: 로컬 Vector DB 또는 외부 UCSI DB에서 정보 검색.
응답 생성: Gemini API가 최종 답변을 자연어로 생성하여 사용자에게 반환.

## 5. 자기 학습 메커니즘 (Self-Learning Capability)
비용 없이 시스템을 고도화하기 위한 로컬 기반 학습 파이프라인입니다.

로컬 지식 관리: 관리자가 로컬 경로에 PDF/Text 문서를 배치하면 자동으로 Vector DB 업데이트.
Vectorization Pipeline: 문서 → 텍스트 청킹 → 무료 임베딩 모델(HuggingFace 등) → 로컬 Vector DB 저장.
피드백 로깅: 답변 만족도를 로컬 파일(CSV/JSON)이나 DB에 기록하여 향후 개선 자료로 활용.

## 6. 개발 및 테스트 가이드 (Localhost First)
추후 제공될 인프라로의 원활한 이전을 고려한 지침입니다.

환경 격리: venv 또는 conda를 사용하여 Python 3.13 독립 환경 구축.
환경 변수 관리: .env 파일을 사용하여 Gemini API 키와 DB 접속 정보를 관리 (서버 이전 시 파일만 교체).
로컬 서버 실행: uvicorn main:app --reload 명령어로 로컬에서 실시간 코드 수정 및 테스트 진행.
배포 준비: 운영 서버로 옮길 때를 대비하여 모든 의존성을 requirements.txt에 명시.