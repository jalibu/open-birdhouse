import React from "react";
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderNavigation,
  Content,
} from "carbon-components-react/lib/components/UIShell";
import Controls from "./Components/Controls";
import Cams from "./Components/Cams";
import "./App.scss";
import { withTranslation } from "react-i18next";
import Statistics from "./Components/Statistics";

const App = ({ t }: { t: any }) => (
  <div className="container">
    <Header aria-label="Birdhouse">
      <HeaderName href="#" prefix={t("TITLE_BIRDHOUSE")}>
        {t("PAGES.CAMERAS")}
      </HeaderName>
      <HeaderNavigation aria-label={t("TITLE_BIRDHOUSE")} />
      <HeaderGlobalBar />
    </Header>
    <Content className="page-content">
      <Cams />
      <Controls />
      <Statistics />
    </Content>
  </div>
);

export default withTranslation()(App);
