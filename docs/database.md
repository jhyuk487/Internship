# Database 명세서 (최신화)

이 문서는 UCSI 챗봇 프로젝트의 데이터 구조와 관리 방식을 설명합니다.

## 1. 개요
- **DB**: MongoDB (로컬 또는 Atlas)
- **드라이버**: Motor + Beanie ODM
- **초기화**: 서버 시작 시 `init_db()`에서 모델 매핑

## 2. 컬렉션 구조
- **user_info**: 학생 상세 프로필 (`User`)
- **login_info**: 로그인 계정 (`Account`)
- **uni_courses_info**: 강의 정보 (`Course`)
- **uni_majors_info**: 전공 정보 (`Major`)
- **chat_histories**: 채팅 히스토리 (`ChatHistory`)
- **teamB**: DB 연결 테스트용 (`TestRecord`)

## 3. 연결 환경 변수
- `DB_HOST` (기본: `localhost`)
- `DB_PORT` (기본: `27017`)
- `DB_USER`, `DB_PASS` (현재 코드는 주석 처리된 인증 URL 제공)
- `DATABASE_NAME` (기본: `teamB`)

## 4. 데이터 동기화 (시드)
- `debug/seed_db.py`: `data_sets/` JSON을 MongoDB에 동기화
- `debug/seed_user.py`: 사용자 계정 및 샘플 데이터 주입
- `debug/import_db.py` / `debug/export_db.py`: 백업 및 복구

## 5. 보안 정책
- 민감한 사용자 정보는 JWT 인증 후 조회됩니다.
- 개인 정보 질문은 `/auth` 인증 결과에 따라 제한됩니다.
