export interface Complaint {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "ON_HOLD"
    | "RESOLVED"
    | "CLOSED"
    | "REJECTED"
    | "REOPENED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  citizenId: string;
  categoryId: string;
  locationId: string;
  departmentId: string;
}
