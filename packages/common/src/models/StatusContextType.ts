import { GlobalMessage } from "./GlobalMessage";

export type StatusContextType = {
  message: GlobalMessage | null | undefined;
  isLoading: boolean;
  setLoading: (_isLoading: boolean) => void;
  setMessage: (_message: GlobalMessage) => void;
  clearMessage: () => void;
};
