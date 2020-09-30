import { utils, Contract, Signer } from "ethers";

export const TOTAL_SUPPLY = utils.parseEther("10000000000");

const holder1Balance = utils.parseEther("250000000");

export const balances = [holder1Balance, TOTAL_SUPPLY.sub(holder1Balance)]
export const holders = ["0x9D101b121c74fd7fada6FeE121651Da2DE753309", "0x2BeB1098fA72E2a7AF1157d70888aedfF495Be94"]