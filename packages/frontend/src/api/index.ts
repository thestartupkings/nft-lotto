import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export interface ClaimPrizeResponse {
  singature: string;
  winner: number;
  blockHeight: number;
}

export const claimPrize = async (roundId: number) => {
  const { data } = await api.post<ClaimPrizeResponse>("/claim-prize", {
    roundId,
  });
  return data;
};
