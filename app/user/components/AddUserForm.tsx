"use client";

import { useGetGenerationDetail } from "@/app/hooks/useGetGenerationDetail";
import { useGetGenerations } from "@/app/hooks/useGetGenerations";
import { useCreateMember } from "@/app/hooks/useCreateMember";
import { AddUserFormData } from "@/app/types/userForm";
import { useState } from "react";
import UserForm from "./UserForm";
import Button from "@/app/components/commons/Button";

const PHONE_REGEX = /^\d{3}-\d{3,4}-\d{4}$/;

type FormErrors = Partial<
  Record<"name" | "loginId" | "password" | "phone", string>
>;

export default function AddUserForm({ onSuccess }: { onSuccess?: () => void }) {
  const { generations } = useGetGenerations();
  const [formData, setFormData] = useState<Partial<AddUserFormData>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const selectedGenerationId =
    formData.generationId ?? generations[0]?.id ?? null;

  const { parts, teams } = useGetGenerationDetail(selectedGenerationId);

  const { mutate: create, isPending } = useCreateMember();

  const set = (field: keyof AddUserFormData) => (value: string | number) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name) newErrors.name = "이름을 입력해주세요";
    if (!formData.loginId) newErrors.loginId = "아이디를 입력해주세요";
    if (!formData.password) newErrors.password = "비밀번호를 입력해주세요";
    if (!formData.phone) {
      newErrors.phone = "전화번호를 입력해주세요";
    } else if (!PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = "올바른 형식으로 입력해주세요 (예: 010-1234-5678)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const { name, loginId, password, phone, partId, teamId } = formData;
    if (!name || !loginId || !password || !phone || !selectedGenerationId)
      return;
    create(
      { name, loginId, password, phone, generationId: selectedGenerationId, partId, teamId },
      { onSuccess },
    );
  };

  return (
    <>
      <UserForm
        generations={generations}
        parts={parts}
        teams={teams}
        selectedGenerationId={selectedGenerationId}
        onGenerationChange={set("generationId")}
        onNameChange={set("name")}
        onLoginIdChange={set("loginId")}
        onPasswordChange={set("password")}
        onPhoneChange={set("phone")}
        onPartChange={set("partId")}
        onTeamChange={set("teamId")}
        errors={errors}
        showPasswordField
      />
      <Button
        className="mt-4 w-full"
        onClick={handleCreate}
        disabled={isPending}
      >
        추가
      </Button>
    </>
  );
}
