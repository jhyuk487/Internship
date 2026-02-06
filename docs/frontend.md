# Frontend Documentation

이 문서는 웹 인터페이스의 구성과 백엔드와의 상호작용 방식을 설명합니다.

## 1. 실행 및 UI 단계

1.  **정적 파일 서빙**: FastAPI의 `app.mount()`를 통해 `frontend/` 폴더 내의 HTML, JS, CSS 파일이 `/static` 경로로 배포됩니다.
2.  **로그인 요청**: 사용자가 아이디/비번을 입력하고 'Login'을 누르면 `login.js`의 `handleLogin` 함수가 실행됩니다.
3.  **데이터 수신 및 표시**: 서버로부터 성공 응답과 유저 데이터를 받으면, 이를 브라우저 `localStorage`에 저장하고 채팅창에 수강 내역을 출력합니다.

## 2. 주요 파일 및 코드 설명

### [main.py](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/main.py)
*   **역할**: 프론트엔드 파일을 호스팅하고 기본 페이지 제공.
*   **주요 코드**:
    ```python
    app.mount("/static", StaticFiles(directory="../frontend"), name="static")
    
    @app.get("/")
    async def root():
        return FileResponse("../frontend/index.html")
    ```
    - 프론트엔드 폴더를 백엔드 서버와 연결하여 사용자가 브라우저로 접속할 수 있게 합니다.

### [login.js](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/frontend/js/login.js)
*   **handleLogin**: 로그인 버튼 클릭 시 실행되며, 성공 시 토큰과 유저 정보를 브라우저에 저장하고 UI를 갱신합니다.
*   **initSession**: 페이지 로드 시 실행되며, 저장된 토큰이 있으면 자동으로 `/auth/me`를 호출하여 세션을 복구합니다.
    ```javascript
    document.addEventListener('DOMContentLoaded', initSession);
    ```
*   **UI 갱신**: 서버에서 받은 유저 데이터의 `name`, `major` 값을 사용하여 사이드바 프로필 영역을 동적으로 업데이트합니다. (이름 이니셜 추출 기능 포함)
*   **주요 코드**:
    ```javascript
    const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        body: JSON.stringify({ user_id: studentId, user_password: password })
    });

    
    if (data.user_data && data.user_data.completed_courses) {
        appendMessage('bot', `Welcome! Here are your courses: ...`);
    }
    ```
    - 백엔드에서 반환한 `user_data`를 확인하여 수강 완료 과목 목록을 추출합니다.
    - 추출된 데이터를 문자열로 포맷팅하여 채팅 화면에 나타냅니다.
