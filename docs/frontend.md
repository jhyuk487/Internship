# Frontend 명세서 & Documentation

이 문서는 웹 인터페이스의 구성, 기술 스택, 그리고 백엔드와의 상호작용 방식을 설명합니다.

## 1. 개요
- **기술 스택:** HTML5, CSS3, Vanilla JavaScript.
- **목적:** 가볍고 빠른 반응성을 위한 로컬 우선(Local-first) 설계.
- **주요 기능:** 사용자 인증(JWT), 실시간 AI 채팅, 수강 이력 조회.

## 2. 주요 구성 요소

### 2.1. 채팅 인터페이스
- **메시지 로그:** 사용자 및 챗봇의 메시지를 시간 순으로 표시.
- **입력창:** 텍스트 입력을 위한 Area 및 전송 버튼 (Guest 모드 시 비활성화).
- **출처 표시:** AI 답변 시 하단에 인용된 출처(Vector DB 등) 표시.

### 2.2. 인증 시스템
- **로그인 모달:** Student ID와 Password 입력을 위한 팝업 창 (인플레이스 비밀번호 찾기 포함).
- **토큰 관리:** JWT 토큰을 브라우저 `localStorage`에 저장하여 API 요청 시 `Authorization: Bearer` 헤더로 사용.
- **세션 복구:** 페이지 로드 시 `initSession` 함수가 `/auth/me`를 호출하여 자동 로그인 처리.
- **로그아웃:** 저장된 세션 정보를 삭제하고 UI를 즉시 초기화.

## 3. 주요 파일 및 코드 설명

### [main.py](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/backend/app/main.py)
*   **역할**: 프론트엔드 파일을 호스팅하고 기본 페이지 제공.
*   **주요 코드**:
    ```python
    app.mount("/static", StaticFiles(directory="../frontend"), name="static")
    
    @app.get("/")
    async def root():
        return FileResponse("../frontend/index.html")
    ```

### [login.js](file:///c:/Users/ehobi/Desktop/uni/비교과/말레이시아/project3/frontend/js/login.js)
*   **handleLogin**: 로그인 버튼 클릭 시 실행되며, 성공 시 토큰과 유저 정보를 저장하고 UI를 갱신합니다.
*   **initSession**: 페이지 로드 시 실행되며, 유효한 토큰이 있으면 세션을 복구합니다.
    ```javascript
    document.addEventListener('DOMContentLoaded', initSession);
    ```
*   **UI 갱신**: 서버에서 받은 유저 데이터(`name`, `major` 등)를 사용하여 사이드바 프로필 영역을 동적으로 업데이트합니다.

## 4. 통신 흐름
1. **메시지 전송**: 사용자가 메시지 입력 -> `POST /chat` 호출.
2. **응답 처리**: 서버로부터 스트리밍 또는 JSON 응답 수신 -> 메시지 버블 생성.
3. **이력 관리**: `POST /chat/history`를 통해 대화 내용 자동 저장.

## 5. UI/UX 디자인
- **테마**: UCSI 대학교 브랜드 컬러를 반영한 전문적이고 깔끔한 디자인 (다크 모드 지원).
- **반응형**: 웹 브라우저 및 모바일 환경에서도 최적화된 레이아웃 제공.
