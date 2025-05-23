import { Role } from "@/enums/role";

export interface IUser {
	id: string;
	createdAt: string;
	updatedAt: string;

	fullName: string;
	email: string;
	password: string;
	phone: string;
	refreshToken?: string;
	role: Role;

	// apartments: IApartment[]; // Define this interface separately
	// contract?: IContract; // Define this interface separately
	// notifications: INotification[]; // Define this interface separately
}
