# 보안 노트

본 프로젝트는 로컬 우선(Local-first) 사용을 전제로 합니다. 배포 전 아래 사항을 검토하세요.

## 인증
- `/auth/login`, `/auth/token`에서 JWT 발급
- 보호 라우트는 `Authorization: Bearer <token>` 필요

## 보호 라우트
- `/auth/me`
- `/chat/history` 및 `/chat/history/{chat_id}`
- `/grades/me`

## 공개 라우트
- `/auth/profile/{user_id}`는 현재 공개 상태
- `/chat`은 토큰이 선택 사항이며, 잘못된 토큰은 무시됩니다.

## 비밀번호 찾기
- `/auth/find-password`는 DB의 평문 비밀번호를 그대로 반환합니다.
- 운영 환경에서는 재설정 링크 기반 흐름으로 변경해야 합니다.

## 시크릿 키
- `SECRET_KEY` 기본값은 개발용이며 운영 환경에서는 반드시 변경해야 합니다.

## 권장 강화
- `/auth/profile/{user_id}`에 JWT 검증 적용
- 비밀번호 해시 저장 적용
- CORS Origin 제한
