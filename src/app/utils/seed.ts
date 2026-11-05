import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Status, UserRole } from "../../../prisma/generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "./AppError";

export const seedSuperAdmin = async () => {
	try {
		const isSuperAdminExist = await prisma.user.findFirst({
			where: {
				role: UserRole.CITY_ADMIN,
			},
		});

		if (isSuperAdminExist) {
			console.log("Super Admin Already Exists!");
			return;
		}

		const name = config.super_admin_name;
		const email = config.super_admin_email;
		const password = config.super_admin_password;

		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Super Admin Name , Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const superAdmin = await prisma.user.create({
			data: {
				fullName:name,
				email,
				password: hashedPassword,
				role: UserRole.CITY_ADMIN,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Super Admin Created : ", superAdmin);
	} catch (error) {
		console.log("Error Seeding Super Admin : ", error);

		await prisma.user.delete({
			where: {
				email: config.super_admin_email,
			},
		});
	}
};

//create manager admin

export const seedManagerAdmin = async () => {
	try {
		const isManagerAdminExist = await prisma.user.findUnique({
			where: {
				email: config.manager_admin_email,
			},
		});

		if (isManagerAdminExist) {
			console.log("Manager Admin Already Exists!");
			return;
		}

		const name = config.manager_admin_name;
		const email = config.manager_admin_email;
		const password = config.manager_admin_password;

		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Manager Admin Name , Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const managerAdmin = await prisma.user.create({
			data: {
				fullName: name,
				email,
				password: hashedPassword,
				role: UserRole.DEPARTMENT_MANAGER,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Manager Admin Created : ", managerAdmin);
	} catch (error) {
		console.log("Error Seeding Manager Admin : ", error);

		await prisma.user.delete({
			where: {
				email: config.manager_admin_email,
			},
		});
	}
};

// create tester technician

export const seedTesterTechnician = async () => {
	try {
		const isTesterTechnicianExist = await prisma.user.findUnique({
			where: {
				email: config.tester_technician_email,
			},
		});

		if (isTesterTechnicianExist) {
			console.log("Tester Technician Already Exists!");
			return;
		}

		const name = config.tester_technician_name;
		const email = config.tester_technician_email;
		const password = config.tester_technician_password;

		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Tester Technician Name , Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const testerTechnician = await prisma.user.create({
			data: {
				fullName: name,
				email,
				password: hashedPassword,
				role: UserRole.TECHNICIAN,
				needPasswordChange: false,
				emailVerified: true,
				doctor: {
					create: {
						email,
						name,
						experienceYears: 5,
						licenseNumber: "BMDC0000",
						qualifications: "MBBS",
						specialization: "Neurology",
						verificationStatus: Status.ACTIVE,
					},
				},
			},
		});

		console.log("Tester Technician Created : ", testerTechnician);
	} catch (error) {
		console.log("Error Seeding Tester Technician : ", error);

		await prisma.user.delete({
			where: {
				email: config.tester_technician_email,
			},
		});
	}
};
