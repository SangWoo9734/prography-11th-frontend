"use client";

import { formatDate } from "@/app/utils/date";
import { GenerationType } from "@/app/types/generation";

const fieldClass = "flex flex-col gap-1.5";
const labelClass = "text-sm font-bold text-gray-700 ml-0.5";
const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-300";
const readOnlyInputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50 text-gray-500 cursor-not-allowed border-dashed";

interface UserFormProps {
  generations: GenerationType[];
  parts: { id: number; name: string }[];
  teams: { id: number; name: string }[];
  selectedGenerationId: number | null;
  onGenerationChange: (id: number) => void;
  defaultValues?: {
    name?: string;
    loginId?: string;
    phone?: string;
    partName?: string;
    teamName?: string;
    createdAt?: string;
  };
  readOnlyFields?: { name?: boolean; loginId?: boolean };
  errors?: Partial<Record<"name" | "loginId" | "password" | "phone", string>>;
  showPasswordField?: boolean;
  onNameChange?: (v: string) => void;
  onLoginIdChange?: (v: string) => void;
  onPasswordChange?: (v: string) => void;
  onPhoneChange?: (v: string) => void;
  onPartChange?: (id: number) => void;
  onTeamChange?: (id: number) => void;
}

export default function UserForm({
  generations,
  parts,
  teams,
  selectedGenerationId,
  onGenerationChange,
  defaultValues = {},
  readOnlyFields = {},
  errors = {},
  showPasswordField,
  onNameChange,
  onLoginIdChange,
  onPasswordChange,
  onPhoneChange,
  onPartChange,
  onTeamChange,
}: UserFormProps) {
  return (
    <div className="flex flex-col gap-4 min-w-80 w-full">
      <div className={fieldClass}>
        <label className={labelClass}>이름</label>
        <input
          className={readOnlyFields.name ? readOnlyInputClass : inputClass}
          type="text"
          placeholder="홍길동"
          defaultValue={defaultValues.name}
          readOnly={readOnlyFields.name}
          onChange={(e) => onNameChange?.(e.target.value)}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>아이디</label>
        <input
          className={readOnlyFields.loginId ? readOnlyInputClass : inputClass}
          type="text"
          placeholder="test01"
          defaultValue={defaultValues.loginId}
          readOnly={readOnlyFields.loginId}
          onChange={(e) => onLoginIdChange?.(e.target.value)}
        />
        {errors.loginId && (
          <p className="text-xs text-red-500">{errors.loginId}</p>
        )}
      </div>

      {showPasswordField && (
        <div className={fieldClass}>
          <label className={labelClass}>비밀번호</label>
          <input
            className={inputClass}
            type="password"
            placeholder="비밀번호"
            onChange={(e) => onPasswordChange?.(e.target.value)}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>
      )}

      <div className={fieldClass}>
        <label className={labelClass}>기수</label>
        <select
          className={inputClass}
          value={selectedGenerationId ?? ""}
          onChange={(e) => onGenerationChange(Number(e.target.value))}
        >
          {generations.map((generation) => (
            <option key={generation.id} value={generation.id}>
              {generation.name}
            </option>
          ))}
        </select>
      </div>

      {parts.length !== 0 && (
        <div className={fieldClass}>
          <label className={labelClass}>파트</label>
          <select
            className={inputClass}
            defaultValue={defaultValues.partName ?? ""}
            onChange={(e) => onPartChange?.(Number(e.target.value))}
          >
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={fieldClass}>
        <label className={labelClass}>전화번호</label>
        <input
          className={inputClass}
          type="text"
          placeholder="010-0000-0000"
          defaultValue={defaultValues.phone}
          onChange={(e) => onPhoneChange?.(e.target.value)}
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      {teams.length !== 0 && (
        <div className={fieldClass}>
          <label className={labelClass}>참여 팀</label>
          <select
            className={inputClass}
            defaultValue={defaultValues.teamName ?? ""}
            onChange={(e) => onTeamChange?.(Number(e.target.value))}
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {defaultValues.createdAt && (
        <div className={fieldClass}>
          <label className={labelClass}>등록일</label>
          <input
            className={readOnlyInputClass}
            type="text"
            value={formatDate(defaultValues.createdAt)}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
