"use client";

import { useGetGenerationDetail } from "@/app/hooks/useGetGenerationDetail";
import { useGetGenerations } from "@/app/hooks/useGetGenerations";
import { useUpdateMember } from "@/app/hooks/useUpdateMember";
import { useDeleteMember } from "@/app/hooks/useDeleteMember";
import { UserType } from "@/app/types/user";
import { EditUserFormData } from "@/app/types/userForm";
import { useState } from "react";
import UserForm from "./UserForm";
import Button from "@/app/components/commons/Button";

const PHONE_REGEX = /^\d{3}-\d{3,4}-\d{4}$/;

type FormErrors = Partial<Record<"phone", string>>;

export default function EditUserForm({ userInfo }: { userInfo: UserType }) {
  const { generations } = useGetGenerations();
  const [formData, setFormData] = useState<EditUserFormData>({
    userId: userInfo.id,
    phone: userInfo.phone,
    generationId: userInfo.generation,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { parts, teams } = useGetGenerationDetail(formData.generationId);

  const { mutate: update, isPending: isUpdating } = useUpdateMember();
  const { mutate: remove, isPending: isDeleting } = useDeleteMember();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.phone) {
      newErrors.phone = "전화번호를 입력해주세요";
    } else if (!PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = "올바른 형식으로 입력해주세요 (예: 010-1234-5678)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;
    const { userId, ...body } = formData;
    update({ id: userId, body });
  };

  const handleDelete = () => {
    remove(formData.userId);
  };

  const set = (field: keyof EditUserFormData) => (value: string | number) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="w-full">
      <UserForm
        generations={generations}
        parts={parts}
        teams={teams}
        selectedGenerationId={formData.generationId}
        onGenerationChange={set("generationId")}
        onPhoneChange={set("phone")}
        onPartChange={set("partId")}
        onTeamChange={set("teamId")}
        readOnlyFields={{ name: true, loginId: true }}
        errors={errors}
        defaultValues={{
          name: userInfo.name,
          loginId: userInfo.loginId,
          phone: userInfo.phone,
          partName: userInfo.partName,
          teamName: userInfo.teamName,
          createdAt: userInfo.createdAt,
        }}
      />
      <div className="flex gap-2 px-5">
        <Button onClick={handleUpdate} disabled={isUpdating}>
          수정
        </Button>
        <Button
          variant="warning"
          onClick={handleDelete}
          disabled={isDeleting || userInfo.status === "WITHDRAWN"}
        >
          회원 만료
        </Button>
      </div>
    </div>
  );
}
