# FocusFlow

포모도로 기법 기반의 생산성 관리 앱입니다.  
집중 타이머, 할 일 관리, 스킬 트래킹, 통계를 한 화면에서 사용할 수 있습니다.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 주요 기능

### 포모도로 타이머
- 집중 / 짧은 휴식 / 긴 휴식 모드 전환
- 아날로그 시계 스타일 UI, 남은 시간 디지털 표시
- 세션 완료 시 Web Notification API + AudioContext 알림음
- 집중 시간, 휴식 시간 커스터마이징 (설정 화면)

### 할 일 관리 (Tasks)
- 카테고리별 분류 — Work / Project / Personal / Learning / Health
- 우선순위 설정 — Low / Medium / High / Urgent
- 마감일 지정 및 30일 타임라인 뷰
- 할 일에 포모도로 세션 연동, 완료 횟수 자동 집계

### 스킬 트래커 (Skills)
- 스킬 등록 및 카테고리 분류 — 프로그래밍 / 디자인 / 언어 / 수학 / 음악 / 기타
- 포모도로 세션과 연동하여 세션 수 · 총 시간 자동 누적
- 목표 시간 설정 및 진행률 프로그레스 바

### 통계 (Stats)
- 오늘의 세션 수 · 집중 시간 요약
- 최근 7일 집중 기록 바 차트

### 뉴스 피드
- AI / 주식 뉴스 랜덤 2개씩 표시
- 10분마다 자동 갱신, 외부 링크 연결

### 보안
- 4자리 PIN 잠금 (앱 최초 실행 시 설정, `localStorage` 저장)
- GitHub OAuth 로그인 (NextAuth.js v5)
- 미인증 접근 차단 — `proxy.ts` 라우트 미들웨어

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.2.6 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| 언어 | TypeScript 5 (strict 모드) |
| 인증 | NextAuth.js v5 — GitHub OAuth |
| 데이터 | `localStorage` (클라이언트 퍼시스턴스) |

---

## 시작하기

### 요구사항
- Node.js 18 이상
- GitHub OAuth App ([개발자 설정](https://github.com/settings/developers)에서 생성)

### 설치

```bash
npm install
```

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
AUTH_SECRET=<임의의 랜덤 문자열 32자 이상>
AUTH_GITHUB_ID=<GitHub OAuth App Client ID>
AUTH_GITHUB_SECRET=<GitHub OAuth App Client Secret>
```

GitHub OAuth App 콜백 URL: `http://localhost:3000/api/auth/callback/github`

### 개발 서버

```bash
npm run dev    # http://localhost:3000
```

---

## 스크립트

```bash
npm run dev      # 개발 서버 (Turbopack)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API 라우트
│   ├── login/                   # GitHub OAuth 로그인 페이지
│   ├── layout.tsx               # 루트 레이아웃 (SessionProvider, Geist 폰트)
│   ├── page.tsx                 # 메인 앱 (타이머 · 할 일 · 통계 · 스킬 · 설정)
│   └── globals.css              # Tailwind v4 CSS-first 테마 토큰
├── auth.ts                      # NextAuth 설정
└── proxy.ts                     # 라우트 보호 미들웨어
```

---

## 화면 구성

| 화면 | 내용 |
|------|------|
| Home | 포모도로 타이머 + 오늘 통계 + AI·주식 뉴스 |
| Tasks | 할 일 타임라인 (카테고리·우선순위 필터) |
| Stats | 주간 집중 현황 바 차트 |
| Skills | 스킬 목록 · 추가 · 목표 시간 관리 |
| Settings | 타이머 시간 커스터마이징 + PIN 관리 |
