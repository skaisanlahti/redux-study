import { JwtPayload, jwtDecode } from "jwt-decode";
import { State } from "../utils/state";
import { Disposer } from "../utils/disposer";

export type UserInfo = { username: string; token: string };

export class AuthService {
    public user = new State<UserInfo | null>(null);

    private initialized = false;
    private disposer = new Disposer();
    private logoutTimer: NodeJS.Timeout | undefined;

    public async init(cancel?: AbortSignal): Promise<void> {
        if (this.initialized) {
            return;
        }

        await this.checkLoginStatus(cancel);

        this.disposer
            .add(this.user.subscribe(this.saveUser.bind(this)))
            .add(this.user.subscribe(this.startLogoutTimer.bind(this)));

        this.initialized = true;
    }

    public async login(
        username: string,
        password: string,
        cancel?: AbortSignal,
    ): Promise<boolean> {
        try {
            const res = await fetch("/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                signal: cancel,
            });

            if (!res.ok) {
                return false;
            }

            const userInfo: UserInfo = await res.json();
            this.user.set(userInfo);
            return true;
        } catch (e) {
            return false;
        }
    }

    public logout(): void {
        this.user.set(null);
    }

    public async checkLoginStatus(cancel?: AbortSignal): Promise<void> {
        try {
            const username = localStorage.getItem("username");
            const token = localStorage.getItem("token");
            const res = await fetch("/login/status", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                signal: cancel,
            });

            if (!res.ok || !username || !token) {
                return;
            }

            const exp = jwtDecode<JwtPayload>(token).exp ?? 0;
            const expired = exp * 1000 < Date.now();
            if (expired) {
                return;
            }

            this.user.set({ username, token });
        } catch (e) {
            return;
        }
    }

    public dispose(): void {
        clearTimeout(this.logoutTimer);
        this.disposer.dispose();
        this.user.dispose();
    }

    private saveUser(user: UserInfo | null): void {
        if (!user) {
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            return;
        }

        localStorage.setItem("username", user.username);
        localStorage.setItem("token", user.token);
    }

    private startLogoutTimer(user: UserInfo | null): void {
        clearTimeout(this.logoutTimer);
        if (!user) {
            return;
        }

        const expiresSeconds = jwtDecode(user.token).exp ?? 0;
        const timeout = expiresSeconds * 1000 - Date.now();
        if (timeout > 0) {
            this.logoutTimer = setTimeout(() => {
                this.logout();
            }, timeout);
        }
    }
}

export const authService = new AuthService();
