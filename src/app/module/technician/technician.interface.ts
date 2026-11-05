import { Status } from "../../../../prisma/generated/prisma/enums";

export interface ITechnician {
     id          :  string;
    userId        : string;
    experienceYears : number;
    specialization  : string[];
    status          : Status
}