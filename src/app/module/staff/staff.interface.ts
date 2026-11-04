export interface Staff {
  id: string;
  userId: string;
  departmentId: string;
  departmentRole: "STAFF" | "TECHNICIAN" | "MANAGER";
}
