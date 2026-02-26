# Hook Extraction Patterns

## When to Extract a Hook

Extract when a component has **2+ of these**:
- ≥ 3 `useState` calls that are related
- ≥ 2 `useEffect` calls
- Complex derived state or memoized computations
- Event handlers that depend on multiple state values
- API calls mixed with UI state

## Pattern 1: State + Logic Hook

When a component manages form/feature state with handlers:

```typescript
// ❌ Before: state + handlers in component
function AttendanceForm({ memberId }: Props) {
  const [penaltyType, setPenaltyType] = useState<PenaltyType>("LATE");
  const [lateMinutes, setLateMinutes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await submitAttendance({ memberId, penaltyType, lateMinutes });
    setIsSubmitting(false);
  };

  return <form>...</form>;
}

// ✅ After: extract hook
// hooks/useAttendanceForm.ts
export function useAttendanceForm(memberId: number) {
  const [penaltyType, setPenaltyType] = useState<PenaltyType>("LATE");
  const [lateMinutes, setLateMinutes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await submitAttendance({ memberId, penaltyType, lateMinutes });
    setIsSubmitting(false);
  };

  return { penaltyType, setPenaltyType, lateMinutes, setLateMinutes, isSubmitting, handleSubmit };
}

// Component: UI only
function AttendanceForm({ memberId }: Props) {
  const { penaltyType, setPenaltyType, lateMinutes, setLateMinutes, isSubmitting, handleSubmit } =
    useAttendanceForm(memberId);

  return <form>...</form>;
}
```

## Pattern 2: Data Hook (TanStack Query)

When a component fetches and transforms API data:

```typescript
// ❌ Before: API call in component
function UserDetail({ id }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);

  return <div>{user?.name}</div>;
}

// ✅ After: TanStack Query hook
// hooks/useGetUser.ts
export function useGetUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
  });
}

// Component: UI only
function UserDetail({ id }: Props) {
  const { data: user, isLoading } = useGetUser(id);

  if (isLoading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

## Pattern 3: Modal/Dialog State Hook

When a component manages 3+ modal states:

```typescript
// ❌ Before
const [isEditOpen, setIsEditOpen] = useState(false);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [isAddOpen, setIsAddOpen] = useState(false);

// ✅ After
type ModalType = "edit" | "delete" | "add" | null;

function useModal() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  return {
    activeModal,
    openModal: (type: ModalType) => setActiveModal(type),
    closeModal: () => setActiveModal(null),
    isOpen: (type: ModalType) => activeModal === type,
  };
}
```

## Pattern 4: Pagination Hook

When multiple components share the same in-memory pagination logic:

```typescript
// hooks/usePagination.ts
export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  return { page, setPage, totalPages, paginatedItems };
}
```

## Placement Rules

| Scope | Where to put |
|-------|-------------|
| Used by 1 component | Alongside component as `use<Feature>.ts` |
| Used by 2+ components | `app/hooks/use<Feature>.ts` |
| Data fetching | `app/hooks/useGet<Resource>.ts` |