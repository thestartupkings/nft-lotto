import axios from "axios";
import { Address } from "viem/accounts";

const api = axios.create({ baseURL: "/api" });

export interface ClaimPrizeResponse {
  signature: string;
  winner: number;
  blockHeight: number;
}

export const claimPrize = async (
  roundId: number,
  address: Address,
  signature: string
) => {
  const { data } = await api.post<ClaimPrizeResponse>("/claim-prize", {
    roundId,
    address,
    signature,
  });
  return data;
};
