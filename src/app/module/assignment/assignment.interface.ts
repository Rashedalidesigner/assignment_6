import { AssignmentStatus } from "../../../../prisma/generated/prisma/enums";

export interface IAssignment {
    id:string;
    technicianId:string;
    compaintId:string;
    workStatus:AssignmentStatus;
}