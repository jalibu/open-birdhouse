import { GlobalMessage } from "../../Models/GlobalMessage";
import React, { useState } from "react";
import StatusContext from "./StatusContext";

export default function StatusContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [loaders, setLoaders] = useState<number>(0);

  const clearMessages = (): void => {
    setMessages([]);
  };

  const addMessage = (newMessage: GlobalMessage): void => {
    setMessages((messages) => {
      const existingMessage = messages.find(
        (message) => message.text === newMessage.text
      );
      if (!existingMessage) {
        return [...messages, newMessage];
      }
      return messages;
    });
  };

  const isLoading = (): boolean => {
    return loaders > 0;
  };

  const addLoader = (): void => {
    setLoaders((loaders) => {
      return loaders + 1;
    });
  };

  const finalizeLoader = (): void => {
    setLoaders((loaders) => {
      return loaders - 1 < 0 ? 0 : loaders - 1;
    });
  };

  return (
    <StatusContext.Provider
      value={{
        messages,
        isLoading,
        addLoader,
        finalizeLoader,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}
