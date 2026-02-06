# UCSI University AI Chatbot Project

이 프로젝트는 UCSI 대학교 학생들을 위한 AI 챗봇 서비스입니다. FastAPI 백엔드와 현대적인 프론트엔드를 기반으로 하며, 학생 정보 조회 및 AI 기반 상담 기능을 제공합니다.

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
└── README.md           # 현재 파일
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

`debug/` 폴더에 개발에 유용한 스크립트들이 포함되어 있습니다. 실행 시 프로젝트 루트에서 실행해 주세요.

- `seed_db.py`: `data_sets`의 데이터를 DB에 동기화
- `seed_user.py`: 기본 테스트 계정(1001) 생성
- `export_db.py` / `import_db.py`: 데이터베이스 백업 및 복구
- `verify_login.py`: 로그인 기능 연동 테스트
- `check_health.py`: 서버 상태 확인

---

## 📝 주요 데이터 설계 (Data Schema)

- **로그인 정보**: 학번(`student_id`), 비밀번호 등
- **사용자 정보**: 전공, 학년, 학점, 이메일, 전화번호 등
- **대학교 정보**: 과목 코드, 과목명, 학점, 선수 과목, 분반 정보(교수명, 시간표, 장소)
- **전용 정보**: 전공 아이디, 전공명, 캠퍼스 위치

상세 내용은 `docs/` 폴더 내의 문서들을 참조해 주세요.
