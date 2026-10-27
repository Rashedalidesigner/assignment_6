import type { UserRole } from "../../../../prisma/generated/prisma/client";

export interface ILoginUserPayload {
	email: string;
	password: string;
}

export interface IRegistercitizenPayload {
	fullname: string;
	email: string;
	password: string;
	phone?:string;
}
export interface IVerifyEmailPayload {
	email: string;
	otp: string;
}

export interface IRequestUser {
	userId: string;
	email: string;
	fullname: string;
	role: UserRole;
}

export interface IGoogleLoginPayload {
	idToken: string;
}

export interface IForgotPasswordPayload {
	email: string;
}
export interface IResetPasswordPayload {
	email: string;
	newPassword: string;
	otp: string;
}
