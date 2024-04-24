import { addListener } from "../utils/listener";
import { createStoreHooks } from "../utils/store";
import { AppState } from "./store";

export const {
    useStoreDispatch: useDispatch,
    useStoreValue: useSelector,
    useStore,
    StoreProvider,
    StoreConsumer,
} = createStoreHooks<AppState>();

export const addEffect = addListener.withTypes<AppState>();
