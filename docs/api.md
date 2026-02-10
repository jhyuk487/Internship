# API 레퍼런스

모든 경로는 서버 루트 기준입니다. 보호된 라우트는 `Authorization: Bearer <token>` 헤더를 사용합니다.

## Auth
### POST /auth/login
Request
```json
{
  "user_id": "5004273354",
  "user_password": "password123"
}
```
Response
```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "user_data": {
    "user_id": "5004273354",
    "name": "Student Name"
  }
}
```

### POST /auth/token
OAuth2 폼 로그인. `username`, `password` 필드 사용.

### GET /auth/me
보호됨. 현재 사용자 프로필 반환.

### GET /auth/profile/{user_id}
공개 라우트(현재 구현 기준). 사용자 프로필 반환.

### POST /auth/find-password
Request
```json
{
  "user_id": "5004273354",
  "email": "student@example.com"
}
```
Response
```json
{
  "password": "[보안] 비밀번호가 암호화되어 있어 직접 조회할 수 없습니다. 관리자에게 문의하세요."
}
```
Notes
- 실제 비밀번호는 반환하지 않습니다.

## Chat
### POST /chat
### POST /chat/ask
Request
```json
{
  "message": "When is course registration?",
  "user_id": "5004273354"
}
```
Response
```json
{
  "response": "Answer text",
  "sources": ["Vector Knowledge Base"]
}
```
Notes
- `user_id`는 선택 사항입니다. 없으면 토큰에서 user를 추출합니다.
- intent가 `personal`이고 user가 없으면 로그인 안내 메시지를 반환합니다.

### POST /chat/stream
- `/chat`과 동일한 요청 스키마를 사용합니다.
- 응답은 `text/plain` 스트리밍입니다.

### POST /chat/feedback
Request
```json
{
  "user_query": "question text",
  "ai_response": "answer text",
  "rating": "like",
  "user_id": "5004273354",
  "chat_id": "abc123",
  "message_index": 2
}
```
Response
```json
{
  "status": "success",
  "message": "Feedback saved"
}
```

### POST /chat/ingest
FAISS 재인덱싱을 백그라운드 작업으로 시작합니다.

## Chat History
### GET /chat/history
보호됨. 채팅 목록 반환.

### POST /chat/history
보호됨. 새 채팅 저장.
```json
{
  "title": "New Conversation",
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "ai", "content": "Hi" }
  ]
}
```

### GET /chat/history/{chat_id}
### PUT /chat/history/{chat_id}
### DELETE /chat/history/{chat_id}
보호됨. Update는 `title`, `is_pinned`, `messages`를 지원합니다.

## Grades
### GET /grades/me
보호됨. 현재 사용자의 GPA 기록 반환.

### PUT /grades/me
보호됨. 현재 사용자의 GPA 기록 upsert.
```json
{
  "terms": {
    "Y1S1": [
      {
        "course_code": "MED-001-1001",
        "course_name": "Intro to Programming",
        "credits": 3,
        "grade": "A",
        "is_major": true
      }
    ]
  }
}
```

## Courses
### GET /courses/search?query=...
코스 검색 결과 목록을 반환합니다.
Response
```json
[
  {
    "course_unique_id": "MED-001-1000",
    "course_name": "Human Anatomy",
    "credits": 4,
    "major_id": "MED-001",
    "major_name": "Doctor of Medicine (MD)",
    "year": 1,
    "semester": 1,
    "prerequisite_code": [],
    "recommended_courses": ["MED-001-1008", "MED-001-1009"]
  }
]
```

## Health
### GET /health
`{"status": "ok"}` 반환.

## DB Test
### GET /db/test
### POST /db/test
### DELETE /db/test/{id}
MongoDB 연결 확인용 테스트 API.
