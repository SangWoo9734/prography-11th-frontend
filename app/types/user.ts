export interface UserType {
  createdAt: string;
  deposit: number;
  generation: number;
  id: number;
  loginId: string;
  name: string;
  partName: string;
  phone: string;
  role: "ADMIN" | "MEMBER";
  status: string; // "ACTIVE" ;
  teamName: string;
  updatedAt: string;
}
