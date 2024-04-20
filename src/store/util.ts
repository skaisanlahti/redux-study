import { useDispatch, useSelector, useStore } from "react-redux";
import { type AppDispatch, type AppStore, type AppState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppStore = useStore.withTypes<AppStore>();
