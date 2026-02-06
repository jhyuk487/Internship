# Login & User Management Documentation

이 문서는 사용자의 인증, 계정 보안 및 정보 조회와 관련된 데이터 흐름을 설명합니다.

## 1. 인증 및 세션 (Authentication)
1. **로그인 요청 (POST /auth/login)**: `user_id`, `user_password` JSON 검증
2. **JWT 발행**: 인증 성공 시 `access_token` 발급
3. **세션 유지 (GET /auth/me)**: 토큰으로 사용자 정보 복구
4. **OAuth2 로그인 (POST /auth/token)**: 폼 기반 로그인 지원

## 2. 비밀번호 찾기 (Password Recovery)
- **엔드포인트**: `POST /auth/find-password`
- **검증 절차**:
  1. 학번(`user_id`)과 이메일(`email`) 입력
  2. `user_info`에서 이메일 일치 확인
  3. `login_info`에서 비밀번호 반환

## 3. 게스트 접근 정책 (Guest Policy)
- 게스트는 채팅 입력이 비활성화됩니다.
- 채팅 히스토리 및 GPA 계산기 기능은 로그인 후 사용 가능합니다.

## 4. 사용자 프로필 조회
- **`GET /auth/profile/{user_id}`**: 프로필 모달 표시용
- **`GET /auth/me`**: 세션 복구용

## 5. 로컬 저장 키
- `access_token`: JWT 토큰
- `user_id`: 로그인한 학번
