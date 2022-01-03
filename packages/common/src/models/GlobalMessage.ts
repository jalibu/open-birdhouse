import { NotificationKind } from "carbon-components-react";
export type GlobalMessage = {
  text?: string;
  title?: string;
  requestId?: string;
  kind?: NotificationKind;
  /* eslint-disable-next-line */
  actions?: any;
};
