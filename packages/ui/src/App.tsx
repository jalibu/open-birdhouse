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
import Gallery from "./Components/Gallery/Gallery";

const App = ({ t }: { t: any }) => (
  <div className="container">
    <StatusContextProvider>
      <GlobalLoadingNotification />
      <GlobalNotification />
      <PageHeader />
      <Content className="page-content">
        <Cams />
        <Controls />
        <Gallery />
        <Statistics />
      </Content>
    </StatusContextProvider>
  </div>
);

export default withTranslation()(App);
