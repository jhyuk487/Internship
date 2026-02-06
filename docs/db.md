# Database (DB) Documentation

이 문서는 프로젝트의 데이터베이스 구조와 연결 방식을 설명합니다.

## 1. 실행 및 연결 단계

1.  **MongoDB 연결**: `AsyncIOMotorClient`를 사용하여 로컬 MongoDB에 접속합니다.
2.  **Beanie 초기화**: 정의된 Pydantic 모델(Document 모델)을 MongoDB 컬렉션과 매핑합니다.
3.  **스키마 매핑**: `data_sets/` 폴더의 JSON 파일 구조를 기준으로 컬렉션 이름과 필드명이 자동으로 매핑됩니다.

## 2. 주요 파일 및 코드 설명

### [database.py](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/database/database.py)
*   **역할**: 데이터베이스 환경 설정 및 초기화.
*   **주요 코드**:
    ```python
    async def init_db():
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        await init_beanie(database=db, document_models=[User, Course, Major, TestRecord, Account])
    ```
    - `init_db()` 함수는 서버 시작 시(`startup` 이벤트) 호출되어 모든 모델을 DB 컬렉션과 연결합니다.

### [models.py](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/database/models.py)
*   **역할**: 각 컬렉션의 데이터 구조(스키마) 정의.
*   **Account 모델**: `login_info` 컬렉션과 매핑되며, 인증 정보를 담고 있습니다.
    ```python
    class Account(Document):
        user_id: str = Field(alias="user_id")
        user_password: str
    ```
*   **User 모델**: `user_info` 컬렉션과 매핑되며, 학생 상세 프로필을 담고 있습니다.
    ```python
    class User(Document):
        user_id: str
        name: str
        major: str
        completed_courses: List[CourseInfo]
    ```
*   **특이 사항**: JSON 직렬화 오류 방지를 위해, API 응답 시 MongoDB의 내부 ID(`_id`) 필드는 제외하고 전송합니다.
