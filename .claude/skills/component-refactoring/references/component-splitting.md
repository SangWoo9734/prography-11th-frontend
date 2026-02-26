# Component Splitting Patterns

## When to Split

Split a component when it has **any** of these:
- JSX > 150 lines (after excluding imports/types)
- Multiple distinct UI sections (header + table + modal)
- Repeated JSX structures (≥ 3 times)
- Conditional rendering that makes the main return hard to read

## Pattern 1: Section Extraction

Extract large UI sections into focused sub-components:

```typescript
// ❌ Before: One component doing everything
function MemberPage({ member }: Props) {
  return (
    <div>
      {/* 50-line header section */}
      <div className="header">
        <h1>{member.name}</h1>
        <div className="stats">...</div>
        <div className="actions">...</div>
      </div>

      {/* 80-line attendance table */}
      <table>
        {attendanceList.map((item) => (
          <tr key={item.id}>...</tr>
        ))}
      </table>

      {/* 40-line modal */}
      {isEditOpen && <div className="modal">...</div>}
    </div>
  );
}

// ✅ After: Orchestration component + focused sub-components
function MemberPage({ member }: Props) {
  const { isEditOpen, openEdit, closeEdit } = useModal();

  return (
    <div>
      <MemberHeader member={member} onEdit={openEdit} />
      <AttendanceTable items={attendanceList} />
      {isEditOpen && <EditAttendanceModal onClose={closeEdit} />}
    </div>
  );
}
```

## Pattern 2: Row/Item Extraction

Extract table rows or list items when they contain significant logic:

```typescript
// ❌ Before: Row logic mixed into parent map
{rows.map((row) => (
  <tr
    key={row.id}
    className={cn("border-b", row.penaltyAmount > 0 ? "bg-amber-50" : "hover:bg-gray-50")}
    onClick={() => router.push(`/attendance/member/${row.memberId}`)}
  >
    <td>...</td>
    <td>
      <span className={cn("px-2 py-1 rounded-full text-xs", STATUS_STYLE[row.status])}>
        {ATTENDANCE_STATUS_TEXT[row.status]}
      </span>
    </td>
    {/* 10 more cells... */}
  </tr>
))}

// ✅ After: Dedicated row component
function AttendanceTableRow({ row }: { row: AttendanceRow }) {
  const router = useRouter();
  return (
    <tr
      className={cn("border-b cursor-pointer", row.penaltyAmount > 0 ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-50")}
      onClick={() => router.push(`/attendance/member/${row.memberId}`)}
    >
      {/* cells */}
    </tr>
  );
}

// Parent becomes readable
{rows.map((row, i) => <AttendanceTableRow key={i} row={row} />)}
```

## Pattern 3: Modal Extraction

Extract modals into their own files when they contain form logic:

```
feature/
├── FeatureList.tsx         # List + triggers modal open
├── AddFeatureModal.tsx     # Add form + submission
└── EditFeatureModal.tsx    # Edit form + submission
```

Keep modal components self-contained — they receive only the data they need plus an `onClose`/`onSuccess` callback.

## Directory Structure

### Flat (simple features)

```
user/components/
├── UserList.tsx
├── UserSearch.tsx
├── AddUserForm.tsx
└── EditUserForm.tsx
```

### Nested (complex features with many sub-components)

```
attendance/member/[id]/
├── page.tsx
└── components/
    ├── MemberAttendanceDetail.tsx   # orchestrator
    ├── AttendanceHeader.tsx
    ├── AttendanceTableRow.tsx       # extracted row
    ├── AddAttendanceModal.tsx
    └── EditAttendanceModal.tsx
```

## What NOT to Split

- Components < 80 lines with a single purpose
- JSX that's used only once and < 20 lines
- Sections that share so much state that extraction requires 5+ props (prop-drilling smell → extract hook instead)