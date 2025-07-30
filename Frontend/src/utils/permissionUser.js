export function isCountedUser(roleName) {
    if (!roleName) return false;
    const excludedRoles = ["admin", "hrd", "manager"];
    return !excludedRoles.includes(roleName.toLowerCase());
}

export function isGetByUsername(username) {
    if (!username) return false;
    const privilegedUsernames = ["admin", "hrd", "manager"];
    return privilegedUsernames.includes(username.toLowerCase());
}