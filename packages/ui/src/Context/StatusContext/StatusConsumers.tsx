import React from "react";
import { InlineNotification, Loading } from "carbon-components-react";
import StatusContext from "./StatusContext";
import "./StatusConsumers.scss";

export const GlobalNotification = (): JSX.Element => {
  return (
    <StatusContext.Consumer>
      {(context): JSX.Element | null => {
        if (context.messages.length > 0) {
          return (
            <div className="globalNotificationWrapper">
              {context.messages.map((message, index) => {
                return (
                  <InlineNotification
                    key={`msg-${index}`}
                    kind={message?.kind || "info"}
                    className="globalNotification"
                    actions={message.actions}
                    subtitle={
                      <div>
                        {message.text}
                        {message.requestId && (
                          <div>RequestId: {message.requestId}</div>
                        )}
                      </div>
                    }
                    title={message?.title || "Notification"}
                    onClick={(): void => {
                      context.clearMessages();
                    }}
                  />
                );
              })}
            </div>
          );
        }

        return null;
      }}
    </StatusContext.Consumer>
  );
};

export const GlobalLoadingNotification = (): JSX.Element => {
  return (
    <StatusContext.Consumer>
      {(context): JSX.Element | null => {
        if (context.isLoading()) {
          return <Loading description="Loading.." withOverlay />;
        }

        return null;
      }}
    </StatusContext.Consumer>
  );
};
