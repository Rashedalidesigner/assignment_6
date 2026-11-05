import { Status } from "../../../../prisma/generated/prisma/enums";
import { IRegistercitizenPayload } from "../auth/auth.interface";

export interface ITechnician extends IRegistercitizenPayload {
     id          :  string;
    userId        : string;
    experienceYears : number;
    specialization  : string[];
    status          : Status
}