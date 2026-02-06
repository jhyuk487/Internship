# Project Walkthrough (Summary of Changes)

이 문서는 최근 진행된 주요 개발 작업과 변경 사항을 요약합니다.

## 1. AI 인프라 고도화
- `google-genai` SDK 기반으로 Gemma 3 모델 통합
- FAISS + Google Embeddings 기반 RAG 활성화
- `/chat/ingest`로 문서 인덱스 갱신 지원

## 2. 인증 및 보안 강화
- JWT 기반 로그인/세션 복구
- 학번/이메일 기반 비밀번호 찾기
- 게스트 기능 제한 적용

## 3. 프론트엔드 기능 확장
- 채팅 히스토리 저장/핀/삭제 UI 연동
- GPA 계산기 추가 및 로컬 저장
- 코스 자동완성 검색 기능 추가

## 4. API 정리
- `/chat`, `/chat/history`, `/courses/search`, `/auth/me` 등 핵심 엔드포인트 정리
