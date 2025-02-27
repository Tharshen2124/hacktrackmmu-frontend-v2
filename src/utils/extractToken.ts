export function extractToken() {
	const cookies = document.cookie;

	const [isAdmin, tokenValue, date] = cookies.split(';');
	
	const [, isAdminValue] = isAdmin.split('=') 
	
	let admin = false
	
	if(isAdminValue === 'true') {
		admin = true
	} else if(isAdminValue === 'false') {
		admin = false
	}
	
	const [, token] = tokenValue.split('=');
	const [, dateValue] = date.split('=');

	return {token, dateValue, admin};
}
