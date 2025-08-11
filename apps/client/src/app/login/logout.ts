import { logout } from "./api";

export async function performLogout() {
    try {
        await logout();
        // Optionally clear client-side state, localStorage, etc.
    } catch (e) {
        console.error("Logout failed", e);
        throw e;
    }
}
