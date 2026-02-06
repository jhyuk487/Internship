# 프로젝트 상태 보고서: UCSI 챗봇

## 1. 프로젝트 개요
- **목표:** Python 3.13 및 Google Gemini API(무료 티어)를 사용하여 UCSI 대학교를 위한 로컬 우선(Local-first) AI 챗봇 개발.
- **현재 상태:** 프론트엔드 및 백엔드가 모든 핵심 기능을 갖춘 고도화된 프로토타입 단계.

## 2. 구현된 기능

### ✅ 백엔드 (FastAPI)
- **프레임워크:** FastAPI (Uvicorn 기반).
- **구조:** 모듈식 아키텍처 (`app/auth`, `app/database`, `app/services`).
- **엔드포인트:**
  - `POST /auth/login`: 유저 인증 및 프로필 연동.
  - `POST /auth/find-password`: 학번/이메일 인증을 통한 비밀번호 찾기 (DB 연동).
  - `GET /user/profile/{user_id}`: 상세 학생 정보 조회.
  - `POST /chat`: AI 상담 인터페이스.
  - `GET/POST/DELETE /chat/history`: 유저별 대화 기록 관리.

### ✅ AI 통합 (Google Gemini)
- **SDK:** 최신 `google-genai` 라이브러리로 마이그레이션 완료.
- **모델:** `gemini-2.0-flash` 모델 적용 (성능 및 응답성 향상).
- **상태:** 현재 쿼터 최적화 및 유지보수를 위해 실제 모델 호출부는 일시 주석 처리 (Placeholder 응답 제공).

### ✅ 프론트엔드 (HTML/JS/CSS)
- **UI/UX 개선:**
  - **인플레이스 비밀번호 찾기**: 별도 창 없이 모달 내에서 즉각적인 결과 확인.
  - **로그인 상태 제어**: 게스트 사용자의 채팅 입력 차단 및 안내 문구 표시.
  - **사용자 프로필 모달**: 사이드바 설정을 통해 학생 상세 정보(학점, 전공 등) 조회 기능 추가.
  - **로그아웃 초기화**: 로그아웃 시 대화 내용 및 히스토리를 즉각 클리어하여 보안 강화.

### ✅ 데이터베이스 (MongoDB & Beanie)
- **ORM:** Beanie (Pydantic 기반)를 사용한 비동기 DB 조작.
- **컬렉션:** `Account` (인증), `User` (프로필), `ChatHistory` (대화 기록).
- **데이터 시딩:** 600여 건의 학생 데이터를 포함한 실데이터 동기화 완료.

## 3. 보류 / 진행 중
- **AI 기능 재활성화:** API 쿼터 한도 확인 후 `GeminiService` 내 주석 해제 및 RAG 강화 연구.
- **고급 RAG 파이프라인:** `data/docs/` 폴더 내 대학 규정 문서를 FAISS로 완전 수집하여 실시간 참조 성능 고도화.

## 4. 최근 변경 사항 (최종 업데이트: 2026-02-06)
1. **Password Recovery**: 영어 번역 및 학번/이메일 크로스 매칭 로직 강화.
2. **Guest Restriction**: 비로그인 사용자의 접근 권한 분리.
3. **Infrastructure**: AI 서비스 객체를 최신 SDK 표준으로 전면 리팩토링.
4. **Docs Update**: 프로젝트 전반에 걸친 기술 문서 및 README 최신화.
