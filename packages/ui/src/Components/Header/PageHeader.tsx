import React, { useState } from "react";
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderNavigation,
  HeaderGlobalAction,
} from "carbon-components-react/lib/components/UIShell";
import { Information20 } from "@carbon/icons-react";
import { withTranslation } from "react-i18next";
import HeaderInformationModal from "./HeaderInformationModal";
import Weather from "../Weather";
import "./Header.scss";

const PageHeader = ({ t }: { t: any }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <Header aria-label="Birdhouse">
      <HeaderName href="#" prefix={t("TITLE_BIRDHOUSE")}>
        {t("PAGES.CAMERAS")}
      </HeaderName>
      <HeaderNavigation aria-label={t("TITLE_BIRDHOUSE")} />
      <HeaderGlobalBar>
        <Weather />
        <HeaderGlobalAction
          aria-label="Search"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <Information20 />
        </HeaderGlobalAction>
        <HeaderInformationModal
          isOpened={isModalOpen}
          handleClose={(): void => {
            setIsModalOpen(false);
          }}
        />
      </HeaderGlobalBar>
    </Header>
  );
};
export default withTranslation()(PageHeader);
