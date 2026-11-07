import { DepartmentRole, Status, UserRole } from "../../../../prisma/generated/prisma/enums";

export interface Staff {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status?: Status;
  isemailVerified: true;
  departmentId: string;
  resumeId:string;
  address:string;
  departmentRole:DepartmentRole
}

export interface IUser {
  name:string;
  email:string;
  role:UserRole;
  userId:string;
}

export interface VerifyPayload {
  otp:string,
  email:string
}