import React from "react";
import { Content } from "carbon-components-react/lib/components/UIShell";
import Controls from "./Components/Controls";
import Cams from "./Components/Cams";
import "./App.scss";
import { withTranslation } from "react-i18next";
import Statistics from "./Components/Statistics";
import PageHeader from "./Components/Header/PageHeader";
import StatusContextProvider from "./Context/StatusContext/StatusContextProvider";
import {
  GlobalLoadingNotification,
  GlobalNotification,
} from "./Context/StatusContext/StatusConsumers";
import ContentGallery from "./Components/Gallery/Gallery";
import { ToastNotification } from "carbon-components-react";

const App = ({ t }: { t: any }) => (
  <div className="container">
    <StatusContextProvider>
      <GlobalLoadingNotification />
      <GlobalNotification />
      <PageHeader />
      <Content className="page-content">
        {process.env.REACT_APP_MAINTENANCE_MODE !== "true" ? (
          <>
            <Cams />
            <Controls />
            <ContentGallery />
            <Statistics />
          </>
        ) : (
          <ToastNotification
            hideCloseButton
            kind="info"
            subtitle={<span>{t('MAINTENANCE_TEXT')}</span>}
            timeout={0}
            title={t('MAINTENANCE_TITLE')}
          />
        )}
      </Content>
    </StatusContextProvider>
  </div>
);

export default withTranslation()(App);
