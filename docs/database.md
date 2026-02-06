# Database 명세서 (최신화)

이 문서는 UCSI 챗봇 프로젝트의 데이터 구조와 관리 방식을 설명합니다.

## 1. 개요
- **시스템:** MongoDB (Atlas 또는 로컬 인스턴스)
- **드라이버:** Motor / Beanie ODM
- **특징:** 6만 건 이상의 데이터를 처리하기 위해 최적화된 인덱싱 및 비동기 통신 지원.

## 2. 데이터 컬렉션 (Collections)

### 2.1. User (학생 상세 정보)
- **Collection Name:** `user_info`
- **주요 필드:** `student_id`, `name`, `major`, `gpa`, `credits_completed`, `course_history`.
- **용도:** 챗봇이 학생의 개인적인 학업 관련 질문에 대해 답변할 때 사용.

### 2.2. Account (인증 정보)
- **Collection Name:** `login_info`
- **주요 필드:** `user_id`, `user_password`.
- **용도:** 로그인 세션 관리 및 JWT 토큰 발행을 위한 인증 처리.

### 2.3. Course & Major (학사 정보)
- **Collection Name:** `uni_courses_info`, `uni_majors_info`.
- **용도:** 대학교 전체 강의 목록 및 전공 정보를 관리하며, 일반적인 학사 안내 답변 생성 시 참조.

## 3. 데이터 동기화 알고리즘
- **도구:** [seed_db.py](file:///c:/Users/SeChun/Documents/Internship/backend/seed_db.py)
- **과정:** 
    1.  `data_sets/` 내 JSON 파일을 로드.
    2.  Pydantic 모델을 통한 데이터 유효성 검사 실행 (Validation).
    3.  기존 컬렉션 데이터 초기화 후 대량 주입(Bulk Insert) 방식으로 동기화.
- **주기:** 데이터 업데이트 필요 시 수동 실행하거나 서버 배포 시 자동화 가능.

## 4. 보안 정책
- **환경 설정:** `.env`를 통해 호스트, 포트, 계정 정보(DB_USER, DB_PASS) 관리.
- **접근 제어:** FastAPI의 `get_current_user` 의존성 주입을 통해 인증된 사용자만 자신의 정보에 접근 가능하도록 설계.
