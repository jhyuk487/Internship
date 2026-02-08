# 데이터셋 및 시드

이 프로젝트는 `data_sets/`의 JSON 파일을 MongoDB 초기 데이터로 사용합니다.

## 파일 목록
- `user_info.json`: 사용자 프로필 (`user_info`)
- `login_info.json`: 로그인 계정 (`login_info`)
- `uni_courses_info.json`: 과목 목록 (`uni_courses_info`)
- `uni_majors_info.json`: 전공 목록 (`uni_majors_info`)
- `grade_records.json`: GPA 기록 (`grade_records`)
- `chat_histories.json`: 채팅 히스토리 예시 (현재 스크립트 미사용)
- `user_completed_courses_info.json`: 레거시 샘플 (현재 미사용)

## 시드 스크립트
- `backend/seed_db.py`: `user_info`, `login_info`, `uni_courses_info`, `uni_majors_info`, `grade_records` 시드
- `debug/seed_db.py`: 레거시, `grade_records` 미포함
- `debug/seed_user.py`: 구형 필드명 사용(수정 필요)

## 샘플 구조
Grade Records (`grade_records.json`)
```json
{
  "user_id": "5004273354",
  "terms": {
    "Y1S1": [
      { "course_code": "MED-001-1001", "credits": 3, "grade": "A" }
    ]
  },
  "updated_at": "2026-02-07T10:00:00Z"
}
```

Chat Histories (`chat_histories.json`)
```json
{
  "user_id": "5004273354",
  "title": "Graduation Requirements",
  "messages": [
    { "role": "user", "content": "What are the requirements?" },
    { "role": "ai", "content": "Answer text" }
  ],
  "is_pinned": true,
  "created_at": "2026-02-07T12:30:00Z"
}
```
