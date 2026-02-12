# API ?ˆí¼?°ìŠ¤

ëª¨ë“  ê²½ë¡œ???œë²„ ë£¨íŠ¸ ê¸°ì??…ë‹ˆ?? ë³´í˜¸???¼ìš°?¸ëŠ” `Authorization: Bearer <token>` ?¤ë”ë¥??¬ìš©?©ë‹ˆ??

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
OAuth2 ??ë¡œê·¸?? `username`, `password` ?„ë“œ ?¬ìš©.

### GET /auth/me
ë³´í˜¸?? ?„ì¬ ?¬ìš©???„ë¡œ??ë°˜í™˜.

### GET /auth/profile/{user_id}
ê³µê°œ ?¼ìš°???„ì¬ êµ¬í˜„ ê¸°ì?). ?¬ìš©???„ë¡œ??ë°˜í™˜.

### POST /auth/find-password
Request
`json
{
  "user_id": "5004273354",
  "email": "student@example.com"
}
`
Response
`json
{
  "verified": true
}
`

### POST /auth/reset-password
Request
`json
{
  "user_id": "5004273354",
  "email": "student@example.com",
  "new_password": "NewPassword123"
}
`
Response
`json
{
  "status": "ok"
}
`
Notes
- ? íƒ?“æ ?…ë ¥???ìœ¼ë¡? ?•ë³´?¸¦ ?¬ì¸?¨ç›„ ?ƒˆ ë¹„ë?ë²ˆí˜¸ë¥? ?¤ì •?©ë‹ˆ??
- ?„ë‹¬ ë¹„ë?ë²ˆí˜¸?Š” DB??bcrypt ÇØ½Ãë¡? ?€?¥ë¸º??

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
- `user_id`??? íƒ ?¬í•­?…ë‹ˆ?? ?†ìœ¼ë©?? í°?ì„œ userë¥?ì¶”ì¶œ?©ë‹ˆ??
- intentê°€ `personal`?´ê³  userê°€ ?†ìœ¼ë©?ë¡œê·¸???ˆë‚´ ë©”ì‹œì§€ë¥?ë°˜í™˜?©ë‹ˆ??

### POST /chat/stream
- `/chat`ê³??™ì¼???”ì²­ ?¤í‚¤ë§ˆë? ?¬ìš©?©ë‹ˆ??
- ?‘ë‹µ?€ `text/plain` ?¤íŠ¸ë¦¬ë°?…ë‹ˆ??

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
FAISS ?¬ì¸?±ì‹±??ë°±ê·¸?¼ìš´???‘ì—…?¼ë¡œ ?œì‘?©ë‹ˆ??

## Chat History
### GET /chat/history
ë³´í˜¸?? ì±„íŒ… ëª©ë¡ ë°˜í™˜.

### POST /chat/history
ë³´í˜¸?? ??ì±„íŒ… ?€??
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
ë³´í˜¸?? Update??`title`, `is_pinned`, `messages`ë¥?ì§€?í•©?ˆë‹¤.

## Grades
### GET /grades/me
ë³´í˜¸?? ?„ì¬ ?¬ìš©?ì˜ GPA ê¸°ë¡ ë°˜í™˜.

### PUT /grades/me
ë³´í˜¸?? ?„ì¬ ?¬ìš©?ì˜ GPA ê¸°ë¡ upsert.
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
ì½”ìŠ¤ ê²€??ê²°ê³¼ ëª©ë¡??ë°˜í™˜?©ë‹ˆ??
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
`{"status": "ok"}` ë°˜í™˜.

## DB Test
### GET /db/test
### POST /db/test
### DELETE /db/test/{id}
MongoDB ?°ê²° ?•ì¸???ŒìŠ¤??API.



