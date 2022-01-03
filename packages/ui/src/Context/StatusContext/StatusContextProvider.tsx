import { GlobalMessage } from "@open-birdhouse/common";
import React, { useState } from "react";
import StatusContext from "./StatusContext";

export default function StatusContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [message, setMessage] = useState<GlobalMessage | null>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const clearMessage = (): void => {
    setMessage(null);
  };

  return (
    <StatusContext.Provider
      value={{
        message,
        isLoading,
        setLoading,
        setMessage,
        clearMessage,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}
