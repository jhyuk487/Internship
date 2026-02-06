# Backend 명세서

본 프로젝트의 백엔드는 Python 3.13과 FastAPI를 기반으로 하는 비동기 서버 시스템입니다.

## 1. 개요
- **프레임워크:** FastAPI (Python 3.13)
- **실행 환경:** Uvicorn (로컬 호스트 8000번 포트 우선)
- **주요 특징:** 비동기 I/O 기반의 빠른 처리, 자동 Swagger 문서 제공.

## 2. 서버 구조
- `app/main.py`: 서버 구성의 진입점. Lifespan 이벤트를 통해 DB 초기화 수행.
- `app/api/`: 엔드포인트 라우터 (auth, chat).
- `app/core/`: 핵심 설정(Config) 및 보안(Security), DB 연결 로직.
- `app/services/`: 비즈니스 로직(AI 연동, 학생 정보 처리, 벡터 검색).
- `app/models/`: 데이터 스키마 및 DB 모델 정의.

## 3. 주요 API 엔드포인트
- `POST /auth/login`: JSON 기반 학생 로그인 및 JWT 발급.
- `POST /auth/token`: OAuth2 호환 로그인 폼 데이터 처리.
- `POST /chat/ask`: 메인 채팅 서비스 (AI 응답 생성).
- `GET /health`: 서버 상태 확인 서비스.

## 4. 미들웨어 및 보안
- **CORS:** 모든 Origin 허용 (개발 단계 설정).
- **JWT 인증:** `app/core/security.py`를 통해 토큰 생성 및 검증 처리.
- **비동기 처리:** `Lifespan`을 활용하여 앱 시작 시 MongoDB와 Beanie를 바인딩.
