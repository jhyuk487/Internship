# Walkthrough: AI 피드백 루프 (좋아요/싫어요) 시스템

이 문서는 AI 답변의 품질을 평가하고 개선하기 위해 구축된 피드백 수집 시스템의 동작 방식과 구조를 설명합니다.

## 1. 개요
사용자가 AI의 각 대답에 대해 즉각적으로 평가를 내릴 수 있게 함으로써, 어떤 답변이 유용하고 어떤 답변이 보완이 필요한지 데이터를 수집합니다. 이 데이터는 향후 **RLHF(인간 피드백 기반 강화 학습)** 및 **Gemma 3 모델 튜닝**의 핵심 기초가 됩니다.

## 2. 주요 기능
- **아이콘 기반 평가 UI:** 텍스트 메시지 하단에 간결한 엄지 아이콘(Like/Dislike) 배치
- **자유로운 재투표(Re-vote):** 실수로 클릭했더라도 언제든 반대 버튼을 눌러 평가 수정 가능
- **실시간 데이터 기록 및 중복 방지 (Upsert):** 모든 평가는 즉시 MongoDB 전용 콜렉션에 저장되며, 사용자가 평가를 변경할 경우 기존 레코드가 업데이트되어 데이터의 중복을 방지합니다.

## 3. 기술 구조

### 백엔드 (FastAPI + MongoDB)
- **Model:** `ChatFeedback` (MongoDB `chat_feedback` 콜렉션)
- **Endpoint:** `POST /chat/feedback` (Upsert 로직 적용: 동일 메시지 인덱스에 대해 기존 피드백이 있으면 Update, 없으면 Insert 실행)
- **데이터 구조:**
  - `user_query`: 사용자 질문
  - `ai_response`: AI 답변 내용
  - `rating`: "like" 또는 "dislike"
  - `user_id`, `chat_id`, `created_at` 등

### 프론트엔드 (JavaScript)
- **`renderMessage()`:** AI 답변 생성 시 피드백 버튼 동적 생성
- **`handleFeedback()`:** 클릭 시 백엔드 통신 및 UI 상태(컬러 하이라이트, 'Updated' 알림) 갱신 로직

## 4. 데이터 확인 방법
MongoDB에서 아래 쿼리를 통해 수집된 피드백을 확인할 수 있습니다:
```bash
db.chat_feedback.find().sort({created_at: -1})
```

---
**업데이트:** 2026-02-09
