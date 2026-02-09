# Feedback 연결(1번: 로그 수집/분석) 계획서

## 목표
- 좋아요/싫어요 피드백을 **저장·분석**하여 프롬프트/RAG 품질을 **수동 개선**할 수 있게 한다.
- **실시간 학습**은 하지 않는다. (모델 업데이트 없음)

## 범위 (In Scope)
- 피드백 데이터에 **분석용 메타데이터**를 추가 저장
- 피드백을 **JSONL/CSV**로 수동 추출할 수 있는 간단한 export 스크립트 제공
- 분석·개선 워크플로 문서화

## 비범위 (Out of Scope)
- 모델 파인튜닝/학습 파이프라인
- 실시간 응답 재생성 또는 자동 개선

## 저장할 메타데이터(최소)
- `model_name`: 응답 생성 모델 식별자 (예: gemma-3-27b-it)
- `prompt_version`: 프롬프트 버전 또는 해시
- `context_sources`: RAG 소스 요약(파일명/문서ID 등)
- `context_snippet`: 컨텍스트 요약(길이 제한)
- `response_hash`: 응답 텍스트 해시(중복/분석용)
- `created_at`: 서버 저장 시각
- `user_id`(선택), `session_id`(선택)

## 작업 단계
1. **현 상태 점검**
   - 프론트 `handleFeedback()` → 전달 필드 확인
   - 백엔드 `ChatFeedbackRequest`/`ChatFeedback` 확인
2. **스키마 확장**
   - `ChatFeedbackRequest`에 옵션 필드 추가
   - `ChatFeedback` 모델에 동일 필드 추가
   - 기존 클라이언트와 호환 유지(기본값/옵션 처리)
3. **feedback 저장 로직 확장**
   - `/chat/feedback`에서 메타데이터 저장
   - `created_at`는 서버에서 채움
4. **데이터 추출 경로(수동)**
   - `backend/scripts/export_feedback.py` 추가 (JSONL/CSV)
   - 기간/평점/모델 필터 옵션
5. **문서화**
   - `docs/feedback_plan.md`에 사용법/분석 방법 추가

## 산출물
- 스키마 변경: `backend/app/models/schemas.py`, `backend/app/database/models.py`
- 저장 로직 변경: `backend/app/ai/router.py`
- export 스크립트: `backend/scripts/export_feedback.py`
- 문서: `docs/feedback_plan.md` (본 파일)

## 분석 워크플로 (예시, 수동)
1. 필요 시 JSONL/CSV 추출
2. `rating=dislike` 묶어서 공통 패턴 분류
3. 프롬프트/문서 개선안 작성
4. 개선 반영 후 다음 추출 시 변화 확인

## 수동 추출 예시
```bash
python backend/scripts/export_feedback.py --format jsonl
python backend/scripts/export_feedback.py --format csv --rating dislike
python backend/scripts/export_feedback.py --start 2026-02-01 --end 2026-02-07
```

## 리스크/주의
- 피드백에는 사용자 질의/응답이 포함될 수 있으므로 **PII 정책** 확인 필요
- RAG 컨텍스트 저장 시 **길이 제한** 필요

## 다음 결정 필요
- `model_name`, `prompt_version`를 어디서 주입할지
- `context_sources/context_snippet` 생성 방식(소스만 저장 vs 요약 저장)
