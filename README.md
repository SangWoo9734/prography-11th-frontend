# Prography 11th Frontend

프로그라피 11기 어드민 출결 관리 페이지입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Server State**: TanStack Query v4
- **Package Manager**: pnpm

---

## 실행 방법

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 API 서버 주소를 입력합니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

> 환경 변수를 설정하지 않으면 기본값 `http://localhost:8080` 으로 동작합니다.

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

### 4. 빌드

```bash
pnpm build
pnpm start
```

---

## 주요 기능

| 페이지                    | 기능                                                                   |
| ------------------------- | ---------------------------------------------------------------------- |
| `/user`                   | 회원 목록 조회, 이름/팀/포지션 검색, 회원 추가                         |
| `/user/[id]`              | 회원 정보 상세 조회 및 수정                                            |
| `/attendance`             | 출결 목록 조회, 날짜 필터(오늘/30일/1년 프리셋), 패널티 보유 회원 강조 |
| `/attendance/member/[id]` | 회원별 출결 상세, 출결 현황 통계, 출결 등록/수정                       |

---

## 프로젝트 구조

```
app/
├── api/                        # fetch 래퍼 + 엔드포인트 (attendance, session, user)
├── attendance/
│   ├── page.tsx                # 출결 목록 (서버 컴포넌트)
│   ├── components/             # AttendanceTable, AttendanceView, AttendanceSearchBar
│   └── member/[id]/
│       ├── page.tsx            # 회원별 출결 상세 (서버 컴포넌트)
│       └── components/         # MemberAttendanceDetail, AttendanceSummary
│                               # AddAttendanceModal, EditAttendanceModal
│                               # useAddAttendanceForm, useEditAttendanceForm
│                               # attendanceFormUtils
├── components/                 # Button, Pagination, ModalProvider
├── hooks/                      # usePagination, useGetMembers 등
├── types/                      # attendance.ts, user.ts
├── user/
│   ├── page.tsx                # 회원 목록 (서버 컴포넌트)
│   ├── [id]/page.tsx           # 회원 상세 (서버 컴포넌트)
│   └── components/             # UserList, UserForm, AddUserForm, EditUserForm
└── utils/                      # cn.ts (clsx + tailwind-merge), date.ts
```

---

## 설계 관련

### API 레이어 설계

`app/api/client.ts`에 fetch 래퍼를 두어 모든 요청이 공통 에러 처리를 거치도록 했습니다. API 에러 응답의 `code` 필드를 `Error` 객체에 부착해 컴포넌트에서 에러 코드별 메시지를 표시할 수 있습니다.

### 출결 패널티 타입 매핑

API는 `LATE / ABSENT / EXCUSED` 세 가지 상태만 존재하지만 UI에서는 지각/결석/조퇴/기타 네 가지로 구분합니다. `attendanceFormUtils.ts`의 `toApiFields()` / `toPenaltyType()` 함수로 양방향 매핑을 처리해 API와 UI 간 관심사를 분리했습니다.

### ModalProvider 패턴

모달 상태를 전역으로 관리하기 위해 `ModalProvider`를 구현했습니다. 페이지 레벨에서 `modal` prop으로 렌더링할 모달 컴포넌트를 주입하고, 하위 컴포넌트에서는 `useModal()` 훅으로 `toggleModal`을 호출해 열고 닫습니다. 모달 DOM은 `createPortal`로 `document.body`에 마운트되어 레이아웃 스택의 영향을 받지 않습니다.

### 서버 컴포넌트와 클라이언트 컴포넌트 분리

Next.js App Router의 서버 컴포넌트를 활용해 페이지 진입 시 초기 데이터를 서버에서 fetch합니다. 이후 수정/등록 등 사용자 인터랙션은 TanStack Query의 `useMutation`과 `invalidateQueries`로 클라이언트에서 처리합니다.

### 공통 Pagination

`usePagination` 훅(in-memory 배열 슬라이싱)과 `Pagination` 컴포넌트(5-window UI)를 분리했습니다. 훅은 순수 로직만 담당하고, 컴포넌트는 `onPageChange` 콜백을 받아 in-memory 방식(useState)과 URL 방식(router.replace) 모두에 재사용됩니다.

### 조건부 클래스 관리

`app/utils/cn.ts`에 `clsx` + `tailwind-merge` 기반 유틸리티를 두어 조건부 Tailwind 클래스를 안전하게 조합합니다. 템플릿 리터럴 대신 `cn()`을 사용해 클래스 충돌을 방지합니다.

### 컴포넌트 복잡도 관리

복잡도가 높아진 컴포넌트는 훅 추출과 서브 컴포넌트 분리로 개선했습니다.

- **훅 추출**: 모달의 상태 4개 + API 호출을 `useAddAttendanceForm` / `useEditAttendanceForm`으로 분리
- **공유 유틸**: 두 모달이 중복 정의하던 타입/상수/매핑 함수를 `attendanceFormUtils.ts`로 통합
- **서브 컴포넌트**: 244라인이었던 `MemberAttendanceDetail`에서 통계 섹션을 `AttendanceSummary`로 추출

---

## AI 사용 방법

### 사용 도구

[Claude Code](https://claude.ai/claude-code) CLI (claude-sonnet-4-6 모델)

### 활용 방식

- **API 구조 확인**: 백엔드 프로젝트 구조 파악 및 필요한 API 엔드포인트 분석
- **타입 설계**: `AttendanceStatusType`, `PenaltyType` 등 도메인 타입 정의와 매핑 함수 구현
- **코드 리뷰**: `/frontend-code-review` 스킬로 조건부 클래스 처리, `useCallback` 누락 등 품질 이슈 발견 및 개선
- **리팩토링 분석**: `/component-refactoring` 스킬로 복잡도가 높은 컴포넌트를 식별하고 훅 추출 및 컴포넌트 분리 진행
- **커밋 관리**: `/commit` 스킬로 변경사항을 논리적 단위로 그룹화하고 Conventional Commits 형식으로 커밋
- **스킬 제작**: `/skill-creator` 스킬로 프로젝트 전용 커스텀 스킬 작성 및 개선

### 주의한 점

AI가 생성한 코드는 그대로 사용하지 않고, 기존 코드베이스 패턴과의 일관성 및 요구사항 충족 여부를 직접 확인한 후 반영했습니다.
