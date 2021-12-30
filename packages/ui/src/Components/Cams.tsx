import React, { useEffect, useState } from "react";
import { Tabs, Tab, Loading } from "carbon-components-react";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../Services/ApiRequestService";
import { Cam } from "@open-birdhouse/common";
import spinner from "../spinner.svg";

const apiService = new ApiRequestService();

const Cams = ({ t }: { t: any }) => {
  const [cams, setCams] = useState<Cam[]>([]);
  const [activeCam, setActiveCam] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getCams();
      setCams(response);
      if (response.length > 0) {
        setActiveCam(0);
      }
    };
    fetchData();
  }, []);

  return cams.length > 0 ? (
    <Tabs
      onSelectionChange={(tabIndex) => {
        setActiveCam(tabIndex);
      }}
    >
      {cams.map((cam, camIndex) => (
        <Tab
          id={`tab-cam-${cam.id}`}
          key={`tab-cam-${cam.id}`}
          label={cam.name}
        >
          <img src={camIndex === activeCam? cam.url : spinner} alt={cam.name} width="100%" />
        </Tab>
      ))}
    </Tabs>
  ) : (
    <Loading description={t("CAMS.LOADING")} withOverlay={false} />
  );
};

export default withTranslation()(Cams);
