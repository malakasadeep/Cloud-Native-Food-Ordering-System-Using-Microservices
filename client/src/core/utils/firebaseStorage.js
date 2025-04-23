import { getStorage } from "firebase/storage";
import { app } from "./firebaseFunctions";

// Initialize Firebase Storage
export const storage = getStorage(app);
