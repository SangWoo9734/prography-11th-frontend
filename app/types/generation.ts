export interface GenerationType {
  id: number;
  generation: number;
  name: string;
}

export interface GenerationDetailType {
  parts: { id: number; name: string }[];
  teams: { id: number; name: string }[];
}
