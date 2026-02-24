"use client";

import { useRouter } from "next/navigation";
import { useGetMembers } from "../../hooks/useGetMemebers";
import Button from "../../components/commons/Button";
import { useState } from "react";
import { createPortal } from "react-dom";
import AddUserForm from "./AddUserForm";

export default function UserList({ urlPage }: { urlPage: number }) {
  const router = useRouter();

  const { userList, totalPage, isLoading } = useGetMembers(
    { page: urlPage - 1 },
    { enabled: urlPage >= 1 },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  if (userList.length === 0)
    return (
      <div className="flex items-center m-auto flex-col gap-3">
        <p>데이터가 없습니다.</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.replace("?page=1")}
        >
          처음으로
        </Button>
      </div>
    );

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="w-full px-4 py-3 border-b-2 flex items-center justify-between">
          <h1 className="text-2xl">회원 관리</h1>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            추가
          </Button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="relative min-w-full w-fit text-sm text-left [&_th]:px-4 [&_th]:py-3 [&_th]:whitespace-nowrap [&_td]:px-4 [&_td]:py-3">
            <thead className="sticky top-0 bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th>Id</th>
                <th>Status</th>
                <th>Login Id</th>
                <th>Name</th>
                <th>Generation</th>
                <th>Part</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Team</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/user/${user.id}`)}
                >
                  <td className="text-gray-500">{user.id}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="font-medium">{user.loginId}</td>
                  <td>{user.name}</td>
                  <td className="text-center">{user.generation}</td>
                  <td>{user.partName}</td>
                  <td className="whitespace-nowrap">{user.phone}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>
                  <td>{user.teamName}</td>
                  <td className="whitespace-nowrap text-gray-500 text-xs">
                    {new Date(user.createdAt).toDateString()}
                  </td>
                  <td className="whitespace-nowrap text-gray-500 text-xs">
                    {new Date(user.updatedAt).toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.replace(`?page=${urlPage - 1}`)}
            disabled={urlPage === 1}
          >
            이전
          </Button>
          <span className="text-sm text-gray-600">
            {urlPage} / {totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.replace(`?page=${urlPage + 1}`)}
            disabled={urlPage >= totalPage}
          >
            다음
          </Button>
        </div>
      </div>
      {isModalOpen &&
        createPortal(
          <div className="fixed top-0 h-screen w-screen bg-gray-700/50 z-100">
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-lg p-8 min-w-80 max-w-4/5">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setIsModalOpen(false)}
              >
                닫기
              </Button>
              <div className="text-xl mb-8">회원 추가</div>
              <AddUserForm onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
