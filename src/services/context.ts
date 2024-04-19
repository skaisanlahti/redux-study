import { createTypeSafeContext } from "../utils/context";
import { AuthService } from "./auth";

export type ServiceContext = {
    authService: AuthService;
};

export const [useServiceContext, ServiceProvider, ServiceConsumer] =
    createTypeSafeContext<ServiceContext>();
