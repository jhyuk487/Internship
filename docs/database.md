# Database 명세서 (최신화)

이 문서는 UCSI 챗봇 프로젝트의 데이터 구조와 관리 방식을 설명합니다.

## 1. 개요
- DB: MongoDB (로컬 또는 Atlas)
- 드라이버: Motor + Beanie ODM
- 초기화: 서버 시작 시 `init_db()`에서 모델 매핑

## 2. 컬렉션 구조
- `user_info`: 학생 상세 프로필 (`User`)
- `login_info`: 로그인 계정 (`Account`)
- `uni_courses_info`: 강의 정보 (`Course`)
- `uni_majors_info`: 전공 정보 (`Major`)
- `chat_histories`: 채팅 히스토리 (`ChatHistory`)
- `grade_records`: GPA 기록 (`GradeRecord`)
- `teamB`: DB 연결 테스트용 (`TestRecord`)

## 3. 연결 환경 변수
- `DB_HOST` (기본: `localhost`)
- `DB_PORT` (기본: `27017`)
- `DB_USER`, `DB_PASS` (기본값 존재, 현재 연결 URL에서는 사용하지 않음)
- `DATABASE_NAME` (기본: `teamB`)

## 4. 데이터 동기화 (시드)
- `backend/seed_db.py`: `data_sets/*.json`을 동기화하며 `grade_records.json`도 포함
- `debug/seed_db.py`: 레거시 스크립트로 `grade_records`는 처리하지 않음
- `debug/seed_user.py`: 구형 필드명(`student_id`, `password`) 기준이라 수정 필요
- `debug/import_db.py` / `debug/export_db.py`: 백업 및 복구

## 5. 보안 정책
- 민감한 사용자 정보는 JWT 인증 후 조회됩니다.
- 개인 정보 질문은 `/auth` 인증 결과에 따라 제한됩니다.
