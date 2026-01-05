import { IUser } from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
        user?: IUser; // optional if middleware might not attach
        }
    }
}