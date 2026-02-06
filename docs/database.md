# Database 명세서

학생 정보 및 학사 데이터를 관리하기 위한 로컬 데이터 저장소 시스템입니다.

## 1. 개요
- **시스템:** 로컬 MongoDB 인스턴스
- **드라이버:** Motor (비동기 드라이버)
- **ODM (Object Data Manager):** Beanie
- **연결 자동화:** 서버 시작 시 `init_db` 함수를 통해 전역 싱글톤으로 바인딩.

## 2. 데이터 모델 (Schema)
### 2.1. Student (학생)
- **Collection Name:** `students`
- **주요 필드:**
    - `student_id`: 학생 고유 번호 (PK 개념)
    - `password`: 인증을 위한 비밀번호
    - `name`: 학생 이름
    - `major`: 소속 학과
    - `gpa`: 현재 평점
    - `tuition_status`: 학비 납부 상태

## 3. 이그레이션 및 서비스
- **JSON Migration:** 기존 `student_db.json` 파일을 읽어와 MongoDB 컬렉션으로 자동 이관하는 유틸리티 지원.
- **StudentService:** Beanie를 사용하여 비동기적으로 인증(`authenticate`) 및 정보 조회(`get_student_info`)를 수행.

## 4. 보안 및 관리
- **인증 방식:** 로컬 개발 환경에서는 무인증(No-AUTH) 연결을 지원하며, 운영 환경에서는 `.env` 설정을 통한 사용자 인증 가능.
- **데이터 무결성:** Pydantic 모델을 사용하여 데이터 유효성을 검증하고 런타임 오류 방지.
