import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { getBkashIdToken } from "./app/lib/bkash";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { UserRoutes } from "./app/module/user/user.route";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { LocationRouter } from "./app/module/location/location.route";
import { StaffRouter } from "./app/module/staff/staff.route";
import { TechnicianRoute } from "./app/module/technician/technician.route";
import { FeedbackRouter } from "./app/module/feedback/feedback.route";
import { DepartmentRouter } from "./app/module/department/department.route";
import { ComplaintRouter } from "./app/module/complaint/complaint.route";
import { categoryRouter } from "./app/module/category/category.route";
import { AddAttchment } from "./app/module/attachment/attachment.route";
import { AsiignementRouter } from "./app/module/assignment/assignment.route";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/location",LocationRouter);
app.use("/api/staff",StaffRouter);
app.use("/api/technician",TechnicianRoute);
app.use("/api/feedback",FeedbackRouter);
app.use("/api/department",DepartmentRouter);
app.use("/api/complaint",ComplaintRouter);
app.use("/api/category",categoryRouter);
app.use("/api/addAttchment",AddAttchment);
app.use("/api/assignment",AsiignementRouter);

app.get("/test", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const grantIdTokenResult = await getBkashIdToken();

		console.log(grantIdTokenResult);

		res.status(httpStatus.OK).json({
			success: true,
			message: "Welcome to PH Healthcare System Backend",
			data: null,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// Basic route
app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to PH Healthcare System Backend",
	});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
