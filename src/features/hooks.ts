import { createStoreHooks } from "../utils/store";
import { RootState } from "./store";

export const {
    useStoreDispatch: useDispatch,
    useStoreValue: useSelector,
    useStore,
    StoreProvider,
    StoreConsumer,
} = createStoreHooks<RootState>();
