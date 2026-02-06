# UCSI University AI Chatbot Project

이 프로젝트는 UCSI 대학교 학생들을 위한 AI 챗봇 서비스입니다. FastAPI 백엔드와 현대적인 프론트엔드를 기반으로 하며, 학생 정보 조회 및 AI 기반 상담 기능을 제공합니다.

---

## ✨ 주요 기능 (Key Features)

### 1. AI 챗봇 상담
- **Google Gemini API 연동**: 최신 `google-genai` SDK 및 `gemini-2.0-flash` 모델 도입.
- **문맥 인식 응답**: 대학교 학사 규정 및 일반 정보를 바탕으로 한 지능형 답변 제공.
- **RAG (Retrieval-Augmented Generation)**: 벡터 데이터베이스(FAISS)를 통한 문서 기반 지식 추출 및 답변 생성 지원.

### 2. 학생 인증 및 보안
- **JWT (JSON Web Token)**: 보안이 강화된 토큰 기반 인증 시스템.
- **비밀번호 찾기 (Forgot Password)**: 학번과 이메일을 통한 보안 인증 후 모달 내에서 즉시 비밀번호 조회 기능.
- **게스트 접근 제어**: 로그인하지 않은 익명 사용자의 채팅 입력을 차단하여 리소스 보호 및 보안 강화.

### 3. 사용자 인터페이스 (UI/UX)
- **사용자 프로필 모달**: 사이드바의 **설정(Settings) 아이콘**을 통해 학번, 전공, 학점, 이메일 등 자신의 상세 정보를 확인 가능.
- **채팅 이력 관리**: 사이드바를 통한 대화 내역 저장, 핀 고정, 이름 변경 및 삭제 기능.
- **자동 초기화**: 로그아웃 시 개인정보 보호를 위해 대화창 및 히스토리를 즉각 초기화.

---

## 📂 프로젝트 구조

```text
project-root/
├── backend/            # FastAPI 백엔드 서버
│   ├── app/            # 핵심 애플리케이션 로직
│   │   ├── ai/         # AI 모델 및 서비스 (list_models 포함)
│   │   ├── auth/       # 인증 및 보안 관련 로직
│   │   ├── core/       # 설정 및 공통 유틸리티
│   │   ├── database/   # DB 모델 및 연결 설정
│   │   └── services/   # 비즈니스 로직 서비스
│   ├── data/           # 로컬 데이터 저장소 (JSON, FAISS 등)
│   ├── .env            # 환경 변수 설정 파일 (API_KEY 등)
│   └── requirements.txt # 백엔드 의존성 목록
├── frontend/           # 웹 프론트엔드 (HTML/CSS/JS)
├── debug/              # 개발 및 디버깅용 유틸리티 스크립트
├── docs/               # 프로젝트 관련 기술 문서 (.md)
├── data_sets/          # 초기 DB 시딩을 위한 JSON 데이터셋
└── README.md           # 프로젝트 전체 안내서
```

---

## 🚀 시작하기

### 1. 환경 설정
백엔드 실행을 위해 Python 3.13 환경이 필요합니다.

```bash
# 가상환경 활성화 (Windows 기준)
.\.venv\Scripts\activate

# 의존성 설치
cd backend
pip install -r requirements.txt
```

### 2. 환경 변수 설정
`backend/.env` 파일을 생성하고 아래 내용을 입력합니다.
```env
GOOGLE_API_KEY=your_google_api_key_here
SECRET_KEY=your_secret_key_here
```

### 3. 서버 실행
```bash
# 백엔드 실행
cd backend
uvicorn app.main:app --reload
```

---

## 🛠 개발자 도구 (Debug Tools)

`debug/` 폴더에 개발에 유용한 스크립트들이 포함되어 있습니다.

- `seed_db.py`: `data_sets` 폴더의 모든 JSON 데이터를 MongoDB 컬렉션에 자동으로 동기화.
- `seed_user_info.py`: 상세 학생 데이터(Profile)를 `user_info` 컬렉션에 시딩.
- `export_db.py` / `import_db.py`: DB 백업 및 복구.
- `verify_login.py`: 로그인 및 프로필 연동 테스트.
- `check_health.py`: 서버 및 API 상태 점검.

---

## 📝 주요 데이터 설계 (Data Schema)

- **로그인 정보**: 학번(`user_id`), 비밀번호 등 (`Account` 모델)
- **사용자 정보**: 전공, 학년, 학점, 이메일 등 (`User` 모델)
- **대학교 정보**: 과목 코드, 강의 정보, 수강 요건 등

상세 내용은 `docs/` 폴더 내의 개별 문서들을 참조해 주세요.
