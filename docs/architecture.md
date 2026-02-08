# 아키텍처 개요

이 문서는 주요 모듈과 데이터 흐름을 설명합니다.

## 핵심 모듈
- `backend/app/main.py`: FastAPI 앱 설정, 정적 파일, 라우터, DB 초기화
- `backend/app/auth/`: JWT 인증 및 세션
- `backend/app/ai/`: AI 채팅, 의도 분류, 벡터 검색, 히스토리
- `backend/app/api/`: 코스 검색, GPA 기록 API
- `backend/app/database/`: MongoDB 연결 및 테스트 API
- `backend/app/services/`: 도메인 서비스 로직
- `frontend/`: HTML/CSS/JS 기반 SPA UI

## 데이터 저장소
- MongoDB: 사용자, 계정, 과목, 전공, 채팅 히스토리, GPA 기록
- FAISS 인덱스: RAG 문서 벡터 검색 (로컬 디스크)

## 요청 흐름
Chat
1. 클라이언트가 `POST /chat`로 메시지 전송
1. 서버가 의도를 `general`/`personal`로 분류
1. 일반 질문: 벡터 검색 + 답변 생성
1. 개인 질문: 인증된 사용자 데이터 조회 후 답변

Login
1. 클라이언트가 `POST /auth/login` 요청
1. 서버가 JWT와 프로필 반환
1. 클라이언트가 토큰 저장 후 `GET /auth/me` 호출

GPA
1. 클라이언트가 `GET /grades/me`로 조회
1. 클라이언트가 `PUT /grades/me`로 저장

Chat History
1. 클라이언트가 `GET /chat/history`로 목록 로드
1. 클라이언트가 `POST /chat/history`로 저장
