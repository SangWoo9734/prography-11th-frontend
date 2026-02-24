interface BaseUserFormData {
  phone: string;
  generationId: number;
  partId?: number;
  teamId?: number;
}

export interface AddUserFormData extends BaseUserFormData {
  name: string;
  loginId: string;
  password: string;
}

export interface EditUserFormData extends BaseUserFormData {
  userId: number;
}
