export function isTokenExpired(date: string) {
	const tokenDateTime: Date = new Date(date);
	tokenDateTime.setHours(tokenDateTime.getHours() + 1);
	const currentDateTime: Date = new Date();
	
	if (currentDateTime >= tokenDateTime) return true

	return false
}
