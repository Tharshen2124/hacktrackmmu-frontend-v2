import { redirect } from "next/navigation";

export function tokenExpiryMod(date: Date) {
	// make token datetime from string to datetime format and add an hour
	const tokenDateTime: Date = new Date(date);
	tokenDateTime.setHours(tokenDateTime.getHours() + 1);

	const currentDateTime: Date = new Date();

	// check if current date time is more than token date time
	if (currentDateTime >= tokenDateTime) {
		throw redirect('/login');
	}
}
