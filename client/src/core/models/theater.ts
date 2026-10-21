import { User } from "./user";

export interface Theater {
  id?: string;
  name: string;
  address: string;
  email: string;
  phone: number;
  owner: User | string;
  isActive: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
}

  