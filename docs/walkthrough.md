# Project Walkthrough (Summary of Changes)

이 문서는 최근 진행된 주요 개발 작업과 변경 사항을 요약합니다.

## 1. AI 인프라 고도화
- `google-genai` SDK 기반 Gemma 3 모델 통합
- FAISS + Google Embeddings 기반 RAG 활성화
- `/chat/ingest`로 문서 인덱스 갱신 지원

## 2. 인증 및 세션 관리
- JWT 기반 로그인/세션 복구
- 학번/이메일 기반 비밀번호 찾기
- 게스트/로그인 UI 분기

## 3. 채팅 히스토리
- `/chat/history` API로 저장/로드/핀/삭제 지원
- 게스트는 로컬 스토리지로 임시 히스토리 유지

## 4. GPA 기록
- `/grades/me` API로 학기별 성적 저장/로드
- `grade_records` 컬렉션 추가

## 5. 프론트엔드 기능 확장
- 코스 자동완성 검색 기능
- 프로필 모달 및 세션 UI 업데이트
- GPA 계산기 UI 개선

## 6. API 정리
- `/chat`, `/chat/history`, `/grades/me`, `/courses/search`, `/auth/me` 등 핵심 엔드포인트 정리
