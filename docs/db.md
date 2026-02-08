# Database (DB) Documentation

이 문서는 프로젝트의 데이터베이스 구조와 연결 방식을 설명합니다.

## 1. 실행 및 연결 단계
1. MongoDB 연결: `AsyncIOMotorClient`로 접속
1. Beanie 초기화: Document 모델을 MongoDB 컬렉션과 매핑
1. 스키마 매핑: `backend/app/database/models.py` 기반으로 컬렉션 생성

## 2. 주요 파일 및 코드 설명
### `backend/app/database/database.py`
- 역할: 데이터베이스 환경 설정 및 초기화
- 연결 URL: 기본은 `mongodb://{DB_HOST}:{DB_PORT}` (인증 URL은 주석 처리)
- 초기화 모델: `User`, `Course`, `Major`, `TestRecord`, `Account`, `ChatHistory`, `GradeRecord`

### `backend/app/database/models.py`
- `Account` 모델: `login_info` 컬렉션
- `User` 모델: `user_info` 컬렉션
- `ChatHistory` 모델: `chat_histories` 컬렉션
- `GradeRecord` 모델: `grade_records` 컬렉션

### `backend/app/database/router.py`
- 역할: DB 연결 확인용 테스트 API 제공
- 엔드포인트: `GET/POST/DELETE /db/test`
