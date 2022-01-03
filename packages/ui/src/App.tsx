import React from "react";
import { Content } from "carbon-components-react/lib/components/UIShell";
import Controls from "./Components/Controls";
import Cams from "./Components/Cams";
import "./App.scss";
import { withTranslation } from "react-i18next";
import Statistics from "./Components/Statistics";
import PageHeader from "./Components/Header/PageHeader";

const App = ({ t }: { t: any }) => (
  <div className="container">
    <PageHeader />
    <Content className="page-content">
      <Cams />
      <Controls />
      <Statistics />
    </Content>
  </div>
);

export default withTranslation()(App);
