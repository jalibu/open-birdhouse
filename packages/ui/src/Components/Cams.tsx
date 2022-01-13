import React, { useContext, useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  TabsSkeleton,
  SkeletonPlaceholder,
  InlineLoading,
} from "carbon-components-react";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../Services/ApiRequestService";
import { Cam } from "@open-birdhouse/common";
import StatusContext from "../Context/StatusContext/StatusContext";

const Cams = ({ t }: { t: any }) => {
  const [cams, setCams] = useState<Cam[]>([]);
  const [activeCam, setActiveCam] = useState<number>(0);
  const [waitForCam, setWaitForCam] = useState<boolean>(false);

  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getCams();
      if (response) {
        setCams(response);
        if (response.length > 0) {
          setActiveCam(0);
        }
        setWaitForCam(true);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return cams.length > 0 ? (
    <section>
      <Tabs
        onSelectionChange={(tabIndex) => {
          setActiveCam(tabIndex);
          setWaitForCam(true);
        }}
      >
        {cams.map((cam, camIndex) => (
          <Tab
            id={`tab-cam-${cam.id}`}
            key={`tab-cam-${cam.id}`}
            label={cam.name}
          >
            <img
              src={camIndex === activeCam ? cam.url : ""}
              onLoad={() => {
                setWaitForCam(false);
              }}
              style={{
                minHeight: "240px",
                maxHeight: "600px",
                maxWidth: "100%",
              }}
              alt={t("CAMERAS.IMG_ALT")}
            />
            {waitForCam && (
              <>
                <InlineLoading
                  className="liveFeedLoader"
                  description={`${t("LOADING")} ${cam.name} ${t(
                    "CAMERAS.LIVE_FEED"
                  )}...`}
                />
              </>
            )}
          </Tab>
        ))}
      </Tabs>
    </section>
  ) : (
    <section>
      <p> {`${t("LOADING")} ${t("CAMERAS.TITLE")}...`}</p>
      <TabsSkeleton />
      <SkeletonPlaceholder />
    </section>
  );
};

export default withTranslation()(Cams);
