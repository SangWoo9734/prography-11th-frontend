interface FormFieldType {
  type: string;
  placeholder: string;
  label: string;
}

const FORM_FORMAT: FormFieldType[] = [
  {
    type: "text",
    placeholder: "홍길동",
    label: "이름",
  },
  {
    type: "text",
    placeholder: "test111",
    label: "아이디",
  },
  {
    type: "select",
    placeholder: "11기",
    label: "기수",
  },
  {
    type: "select",
    placeholder: "Spring",
    label: "파트",
  },
  {
    type: "select",
    placeholder: "000-0000-0000",
    label: "파트",
  },
  {
    type: "select",
    placeholder: "1팀",
    label: "참여팀",
  },
];

export default function UserForm() {
  return (
    <div>
      {FORM_FORMAT.map((formData, index) => {
        return (
          <div key={index}>
            <label>{formData.label}</label>
            <FormInput formData={formData} />
          </div>
        );
      })}
    </div>
  );
}

function FormInput({ formData }: { formData: FormFieldType }) {
  if (formData.type === "text")
    return <TextInput placeholder={formData.placeholder} />;
  if (formData.type === "select") return <SelectInput />;

  return <TextInput placeholder={formData.placeholder} />;
}

function SelectInput() {
  return (
    <select>
      <option></option>
      <option></option>
      <option></option>
      <option></option>
    </select>
  );
}

function TextInput({ placeholder }: { placeholder: string }) {
  return <input type="text" placeholder={placeholder} />;
}
