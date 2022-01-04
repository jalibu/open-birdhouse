import { GlobalMessage } from "./GlobalMessage";

export type StatusContextType = {
  messages: GlobalMessage[];
  isLoading: () => boolean;
  addLoader: () => void;
  finalizeLoader: () => void;
  addMessage: (_message: GlobalMessage) => void;
  clearMessages: () => void;
};
