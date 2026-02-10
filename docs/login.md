# Login & User Management Documentation

이 문서는 사용자의 인증, 계정 보안 및 정보 조회와 관련된 데이터 흐름을 설명합니다.

## 1. 인증 및 세션 (Authentication)
1. 로그인 요청: `POST /auth/login`에 `user_id`, `user_password` JSON 전달
1. JWT 발행: 인증 성공 시 `access_token` 반환
1. 세션 복구: `GET /auth/me`에 토큰 전달
1. OAuth2 로그인: `POST /auth/token` 폼 기반 로그인

## 2. 비밀번호 찾기 (Password Recovery)
- 엔드포인트: `POST /auth/find-password`
- 입력: 학번(`user_id`)과 이메일(`email`)
- 결과: 비밀번호는 반환하지 않고 안내 메시지를 반환 (보안 정책)

## 3. 게스트 접근 정책 (Guest Policy)
- 채팅은 `ALLOW_GUEST_CHAT` 값에 따라 허용됩니다.
- 채팅 히스토리와 GPA 기록은 로그인 후 사용 가능합니다.
- 프로필 모달은 프론트에서 로그인 여부로 접근을 제한합니다.

## 4. 사용자 프로필 조회
- `GET /auth/profile/{user_id}`: 프로필 조회 (현재는 토큰 없이 접근 가능)
- `GET /auth/me`: 토큰 기반 세션 복구

## 5. 로컬 저장 키
- `access_token`: JWT 토큰
- `user_id`: 로그인한 학번
