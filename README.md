# 🎯 FocusFlow

> 집중력을 높이는 스마트 포모도로 타이머 앱

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 📌 프로젝트 소개

**FocusFlow**는 포모도로 기법을 기반으로 한 집중력 관리 앱입니다.  
할 일 관리, 스킬 성장 추적, AI/주식 뉴스까지 한 화면에서 관리할 수 있습니다.

---

## ✨ 주요 기능

### ⏱ 포모도로 타이머
- 집중 / 단시 휴식 / 장시 휴식 모드 전환
- 아날로그 시계 스타일의 시각적 타이머
- 세션 완료 시 브라우저 알림
- 타이머 시간 커스터마이징

### ✅ 할 일 관리
- 카테고리별 분류 (Work / Project / Personal / Learning / Health)
- 우선순위 설정 (Low / Medium / High / Urgent)
- 마감일 지정 및 포모도로 연동 카운트

### ⚡ 스킬 관리
- 스킬 등록 및 카테고리 분류 (프로그래밍 / 디자인 / 언어 / 수학 / 음악 / 기타)
- 포모도로 세션과 연동하여 자동 시간 누적
- 목표 시간 설정 및 진행률 시각화 (프로그레스 바)
- 달성 시 초록색 강조 표시

### 📊 통계
- 오늘의 세션 수 및 집중 시간 확인
- 주간 집중 기록 차트

### 📰 오늘의 뉴스
- AI / 주식 관련 뉴스 랜덤 표시
- 10분마다 자동 새로고침
- 외부 링크 연결

### 🔒 로그인
- GitHub OAuth 소셜 로그인
- NextAuth.js v5 기반 세션 관리
- 미인증 접근 차단 (proxy 미들웨어)

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.2.6 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| 언어 | TypeScript 5 |
| 인증 | NextAuth.js v5 (GitHub OAuth) |
| 빌드 | Turbopack |
| 배포 | Vercel + GitHub Actions |
| 저장소 | localStorage (클라이언트 퍼시스턴스) |

---

## 📱 화면 구성

```
🏠 Home     — 타이머 + 뉴스 + 스킬 선택
✅ Tasks    — 할 일 목록 관리
📊 Stats    — 주간 집중 통계
⚡ Skills   — 스킬 등록 및 성장 추적
⚙️ Settings — 타이머 시간 설정 / PIN 관리
```

---

## 🚀 시작하기

### 요구사항
- Node.js 18.x 이상
- GitHub OAuth 앱 ([생성 방법](https://github.com/settings/developers))

### 설치

```bash
git clone https://github.com/keunho2025/focusflow.git
cd focusflow
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 내용을 입력합니다:

```env
NEXTAUTH_SECRET=랜덤_시크릿_32자_이상
NEXTAUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

> GitHub OAuth 앱의 **Authorization callback URL**:  
> `http://localhost:3000/api/auth/callback/github`

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 🌐 배포 (Vercel)

1. [vercel.com/new](https://vercel.com/new) 에서 GitHub 저장소 임포트
2. 환경 변수 설정 (NEXTAUTH_SECRET, NEXTAUTH_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
3. **Deploy** 클릭

자동 배포: `master` 브랜치 push 시 GitHub Actions가 자동 배포합니다.

---

## 📂 프로젝트 구조

```
src/
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API 라우트
│   ├── login/                   # 로그인 페이지
│   ├── layout.tsx               # 루트 레이아웃 (SessionProvider)
│   └── page.tsx                 # 메인 앱 (전체 UI)
├── auth.ts                      # NextAuth 설정
└── proxy.ts                     # 라우트 보호 미들웨어
```

---

## 📄 라이선스

MIT License © 2026 FocusFlow
