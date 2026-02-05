# Login Documentation

이 문서는 사용자가 로그인할 때 발생하는 백엔드 로직과 데이터 흐름을 설명합니다.

## 1. 실행 및 인증 단계

1.  **로그인 요청 (POST)**: 프론트엔드에서 사용자의 `id`와 `password`를 JSON 형태로 서버에 보냅니다.
2.  **계정 인증**: `login_info` 컬렉션에서 해당 `id`가 존재하는지, 비밀번호가 일치하는지 확인합니다.
3.  **프로필 연동**: 인증이 성공하면, 동일한 `id`를 가진 유저를 `user_info` 컬렉션에서 찾아 상세 정보(수강 내역 등)를 가져옵니다.
4.  **응답 반환**: JWT 인증 토큰과 함께 유저의 상세 프로필 데이터를 응답값으로 전달합니다.

## 2. 주요 파일 및 코드 설명

### [router.py (auth)](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/auth/router.py)
*   **역할**: 로그인 API 엔드포인트 제공.
*   **주요 코드**:
    ```python
    @router.post("/login", response_model=Token)
    async def login(request: LoginRequest):
        user = await student_service.authenticate(request.user_id, request.user_password)
        # ... 인증 실패 시 예외 처리
        access_token = create_access_token(data={"sub": user["id"]})
        return {"access_token": access_token, "user_data": user.get("user_data")}
    ```
    - 사용자 요청을 받아 `student_service`에 전달하고, 결과에 따라 토큰을 생성합니다.

### [student_service.py](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/services/student_service.py)
*   **역할**: 실제 인증 로직 및 데이터 조회 수행.
*   **주요 코드**:
    ```python
    async def authenticate(self, user_id, password):
        account = await Account.find_one(Account.user_id == user_id)
        if account and account.user_password == password:
            user_profile = await self.get_student_info(user_id)
            return {"id": account.user_id, "user_data": user_profile}
    ```
    - `Account` 모델(`login_info`)과 `User` 모델(`user_info`)을 차례로 조회하여 데이터를 통합합니다.
    - 데이터베이스의 `id` 필드가 Beanie의 기본 키와 충돌하지 않도록 `login_id` 필드를 사용합니다.
