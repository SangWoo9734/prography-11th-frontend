import UserList from "./components/UserList";

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const urlPage = parseInt(page ?? "1");

  return <UserList urlPage={urlPage} />;
}
