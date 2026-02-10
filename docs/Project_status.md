# 프로젝트 상태 보고서: UCSI 챗봇 (업데이트: 2026-02-09)

## 1. 프로젝트 개요
- **목표**: UCSI 대학교 학생을 위한 AI 학사 도우미 개발
- **기술 스택**: Python 3.13, FastAPI, MongoDB, Google GenAI (Gemma 3)
- **현재 상태**: 핵심 기능 구현 완료, 프로덕션 준비 단계

## 2. 주요 업데이트 사항 (2026-02-09)
- **AI 모델 및 RAG**: `gemma-3-27b-it` + FAISS 기반 문서 검색, `/chat/ingest` 인덱스 재생성
- **인증 및 세션**: JWT 기반 로그인, `/auth/me` 세션 복구, 비밀번호 찾기 지원
- **채팅 히스토리**: `/chat/history` 저장/핀/삭제, 게스트는 로컬 스토리지 사용
- **GPA 기록 및 통합**: `/grades/me` 저장/로드 및 AI 컨텍스트 연동 (`academic_records` 키 추가). **성적 계산창 자동 닫힘 기능 추가**
- **AI 피드백 루프**: 아이콘 기반 Like/Dislike, 선택 변경(Re-vote) 지원, 데이터 수집 최적화
- **프론트 기능**: 코스 자동완성, 프로필 모달, 게스트/로그인 UI 분리

## 3. 시스템 아키텍처

### 3.1 백엔드 (FastAPI)
```
backend/
├── app/
│   ├── ai/              # AI 엔진 (Gemini, RAG, Vector DB)
│   ├── api/             # API 엔드포인트 (코스, 성적)
│   ├── auth/            # 인증/인가 (JWT)
│   ├── core/            # 설정 및 공통 유틸리티
│   ├── database/        # DB 모델 및 연결
│   ├── services/        # 비즈니스 로직
│   └── main.py          # FastAPI 앱 진입점
├── data/                # RAG 문서 및 FAISS 인덱스
├── requirements.txt
└── .env                 # 환경 변수
```

### 3.2 프론트엔드
```
frontend/
├── index.html           # 메인 UI (34KB, 단일 페이지)
├── css/                 # Tailwind + 커스텀 스타일
├── js/                  # Vanilla JS (login, main)
└── tools/               # Tailwind 빌드 도구
```

### 3.3 데이터베이스 (MongoDB)
**컬렉션 구조**:
- `login_info` (Account): 로그인 인증 정보
- `user_info` (User): 학생 프로필 정보
- `uni_courses_info` (Course): 대학 과목 정보
- `uni_majors_info` (Major): 전공 정보
- `chat_histories` (ChatHistory): 채팅 히스토리
- `grade_records` (GradeRecord): 학생 성적 기록
- `teamB` (TestRecord): 테스트용 컬렉션

## 4. 구현된 기능 상세

### 3.1 AI 채팅 시스템
**엔드포인트**: `POST /chat`, `POST /chat/ask`
- **AI 모델**: Google Gemma 3 (27B-IT)
- **Intent Detection**: 질문을 'general' (일반) / 'personal' (개인) 분류
- **RAG (Retrieval-Augmented Generation)**:
  - FAISS 벡터 DB 기반 문서 검색
  - LangChain + Sentence Transformers
  - 문서 경로: `backend/data/docs/**/*.txt`
  - 인덱스 재생성: `POST /chat/ingest`
- **개인 질문 처리**:
  - 로그인 사용자의 `User` + `GradeRecord` 정보를 컨텍스트로 제공
  - `academic_records` 키로 성적 정보 포함 (AI 인식 최적화)
  - 게스트는 로그인 유도 메시지 반환

### 3.2 인증 및 사용자 관리
**엔드포인트**:
- `POST /auth/login`: JSON 기반 로그인 (JWT 토큰 발급)
- `POST /auth/token`: OAuth2 폼 기반 로그인
- `POST /auth/find-password`: 학번 + 이메일로 비밀번호 찾기
- `GET /auth/me`: JWT 토큰으로 현재 사용자 프로필 조회 (세션 복구)
- `GET /auth/profile/{user_id}`: 학번으로 프로필 조회 (인증 불필요)

**보안**:
- JWT (HS256) 기반 인증
- 토큰 만료: 30분
- 비밀번호 평문 저장 (⚠️ 향후 해싱 필요)

### 3.3 채팅 히스토리 관리
**엔드포인트**:
- `GET /chat/history`: 사용자의 모든 채팅 히스토리 조회
- `POST /chat/history`: 새 채팅 저장
- `GET /chat/history/{chat_id}`: 특정 채팅 조회
- `PUT /chat/history/{chat_id}`: 채팅 수정 (제목, 핀, 메시지)
- `DELETE /chat/history/{chat_id}`: 채팅 삭제

**기능**:
- 로그인 사용자: MongoDB에 영구 저장
- 게스트: 세션 스토리지에 임시 저장 (브라우저 종료 시 삭제)
- 핀 기능 지원 (중요 채팅 상단 고정)

### 3.4 GPA 기록 및 계산
**엔드포인트**:
- `GET /grades/me`: 현재 사용자의 성적 기록 조회
- `PUT /grades/me`: 성적 기록 저장/업데이트

**기능**:
- 학기별 과목 입력 (과목명, 학점, 성적, 전공 여부)
- GPA 자동 계산 (전체/전공/교양 분리)
- 프론트엔드에서 시각적 성적 입력 UI 제공
- 코스 자동완성 지원 (`/courses/search`)

### 3.5 코스 검색
**엔드포인트**: `GET /courses/search?query={검색어}`
- 과목명 기반 검색
- 자동완성 UI 지원

## 4. 주요 기술 구현 세부사항

### 4.1 AI 서비스 (GeminiService)
```python
# backend/app/ai/gemini.py
- 모델: gemma-3-27b-it
- Intent Detection: 질문 분류 (general/personal)
- Response Generation: 컨텍스트 기반 답변 생성
- Markdown 형식 응답 지원
```

### 4.2 학생 서비스 (StudentService)
```python
# backend/app/services/student_service.py
- authenticate(): 로그인 인증
- get_student_info(): 학생 정보 조회 (User + GradeRecord 병합)
- find_password(): 비밀번호 찾기
```
**최신 업데이트** (2026-02-09):
- `get_student_info()`에서 `GradeRecord` 자동 조회 및 병합
- `academic_records` 키로 성적 정보 제공 → AI가 개인 질문 시 성적 정보 활용 가능

### 4.3 벡터 DB (VectorService)
```python
# backend/app/ai/vector.py
- FAISS 인덱스 기반 문서 검색
- Sentence Transformers 임베딩
- LangChain TextSplitter로 문서 청킹
```

## 5. 프론트엔드 기능

### 5.1 메인 UI (index.html)
- **게스트 모드**: 일반 질문만 가능, 채팅 히스토리 세션 스토리지
- **로그인 모드**: 모든 기능 사용 가능
- **프로필 모달**: 사용자 정보 표시
- **GPA 계산기**: 학기별 성적 입력 및 GPA 계산
- **채팅 히스토리**: 저장/로드/핀/삭제
- **반응형 디자인**: Tailwind CSS

### 5.2 JavaScript 모듈
- `login.js`: 로그인/로그아웃/세션 복구
- `main.js`: 채팅 UI 및 API 통신
- `gpa.js`: GPA 계산 로직 (미사용 시 제거 가능)

## 6. 환경 설정

### 6.1 필수 환경 변수 (.env)
```env
GOOGLE_API_KEY=AIzaSyCIxGg6PCWkZiVFyFEKcA91nw48WGDMpvQ
SECRET_KEY=dkqmfkzkekqmfk
DB_HOST=localhost
DB_PORT=27017
DATABASE_NAME=teamB
```

### 6.2 의존성 (requirements.txt)
```
fastapi, uvicorn, pydantic, python-dotenv
langchain, langchain-community, langchain-google-genai
faiss-cpu, sentence-transformers
beanie, motor (MongoDB)
google-generativeai, google-genai
pyjwt, aiofiles, python-multipart
```

## 7. 실행 방법

### 7.1 서버 시작
```bash
cd backend
.\venv\Scripts\activate  # Windows
python -m uvicorn app.main:app --port 8000 --reload
```

### 7.2 접속
- URL: `http://127.0.0.1:8000/`
- Health Check: `http://127.0.0.1:8000/health`

### 7.3 데이터 시드
```bash
cd backend
python seed_db.py  # data_sets/*.json → MongoDB 동기화
```

## 8. 테스트 계정
- 학번: (data_sets/login_info.json 참조)
- 비밀번호: (data_sets/login_info.json 참조)

## 9. 향후 개선 사항

### 9.1 보안
- [ ] 비밀번호 해싱 (bcrypt)
- [ ] JWT SECRET_KEY 강화 (현재 14바이트 → 32바이트 이상)
- [ ] HTTPS 적용 (프로덕션 배포 시)

### 9.2 기능
- [ ] RAG 문서 소스 확장 (PDF, DOCX 지원)
- [ ] 실시간 채팅 (WebSocket)
- [ ] 다국어 지원 (영어/말레이어)
- [ ] 프로필 편집 기능
- [ ] 관리자 대시보드

### 9.3 성능
- [ ] FAISS 인덱스 최적화
- [ ] Redis 캐싱
- [ ] API 응답 시간 모니터링

### 9.4 배포
- [ ] Docker 컨테이너화
- [ ] CI/CD 파이프라인
- [ ] 프로덕션 환경 설정 분리

## 10. 알려진 이슈
- JWT 키 길이 경고 (14바이트 → 32바이트 권장)
- 비밀번호 평문 저장 (해싱 필요)
- 프로필 API 인증 정책 불일치 (`/auth/profile/{user_id}` vs `/auth/me`)

## 11. 문서
- `README.md`: 프로젝트 개요 및 빠른 시작
- `docs/backend.md`: 백엔드 API 상세
- `docs/frontend.md`: 프론트엔드 구조
- `docs/ai.md`: AI 엔진 설명
- `docs/database.md`: 데이터베이스 스키마

## 12. 변경 이력
- **2026-02-09**: `get_student_info()`에 `GradeRecord` 자동 병합 추가, Google API Key 업데이트
- **2026-02-08**: 채팅 히스토리, GPA 기록 기능 완료
- **2026-02-05**: 프로젝트 구조 재정리 (backend/frontend 분리)
- **2026-02-04**: AI 모델 Gemma 3 적용, RAG 구현
- **2026-02-03**: 초기 FastAPI 서버 및 MongoDB 연동
