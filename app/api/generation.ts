import { GenerationDetailType, GenerationType } from "../types/generation";
import { apiClient } from "./client";

export const getGenerations = () =>
  apiClient.get<GenerationType[]>("/api/v1/admin/cohorts");

export const getGenerationDetail = (generationId: number) =>
  apiClient.get<GenerationDetailType>(`/api/v1/admin/cohorts/${generationId}`);
