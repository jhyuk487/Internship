# Login Documentation

이 문서는 사용자가 로그인할 때 발생하는 백엔드 로직과 데이터 흐름을 설명합니다.

## 1. 실행 및 인증 단계

1.  **로그인 요청 (POST)**: 프론트엔드에서 사용자의 `id`와 `password`를 JSON 형태로 서버에 보냅니다.
2.  **계정 인증**: `login_info` 컬렉션에서 해당 `id`가 존재하는지, 비밀번호가 일치하는지 확인합니다.
3.  **프로필 연동**: 인증이 성공하면, 동일한 `id`를 가진 유저를 `user_info` 컬렉션에서 찾아 상세 정보(수강 내역 등)를 가져옵니다.
4.  **응답 반환**: JWT 인증 토큰과 함께 유저의 상세 프로필 데이터를 응답값으로 전달합니다.

## 2. 주요 파일 및 코드 설명

### [router.py (auth)](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/auth/router.py)
*   **POST /login**: 아이디/비밀번호 인증 후 JWT 토큰과 유저 정보를 반환합니다.
*   **GET /me**: JWT 토큰을 사용하여 현재 로그인한 사용자의 정보를 다시 가져옵니다 (새로고침 시 사용).
    ```python
    @router.get("/me")
    async def get_me(user_id: str = Depends(get_current_user)):
        user_profile = await student_service.get_student_info(user_id)
        return {"user_data": user_profile}
    ```

### [student_service.py](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/services/student_service.py)
*   **authenticate**: `user_id`와 `user_password`를 검증하고 성공 시 유저 데이터를 반환합니다.
*   **get_student_info**: MongoDB의 `user_info` 컬렉션에서 `user_id`로 정보를 조회합니다. (ID 직렬화 오류 방지 로직 포함)
