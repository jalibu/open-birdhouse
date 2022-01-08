import React, { useState, useEffect, useContext } from "react";
import {
  Tag,
  TooltipIcon,
} from "carbon-components-react";
import "./Gallery.scss";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../Services/ApiRequestService";
import StatusContext from "../Context/StatusContext/StatusContext";
import { Video, VideoApiResponse } from "@open-birdhouse/common";
import { Translation } from "react-i18next";
import {
  Information16,
} from "@carbon/icons-react";

const Gallery = ({ t }: { t: any }) => {
  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);
  const [galery, setGalery] = useState<VideoApiResponse>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getGalery();
      if (response) {
        setGalery(response);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return galery && galery?.videos?.length > 0 ? (
    <section>
      <h6>
        {t("GALLERY.TITLE")}
        <Translation>
          {(t) => (
            <TooltipIcon tooltipText={`${t("GALLERY.TAGS")}`}>
              <Information16 />{" "}
            </TooltipIcon>
          )}
        </Translation>
      </h6>
      <div className="gallery-grid bx--grid">
        <div className="bx--row">
          {galery.videos.map((video) => (
            <GaleryEntry
              key={`gallery-entry-${video.id}`}
              uri={galery.uri}
              video={video}
            />
          ))}
        </div>
      </div>
    </section>
  ) : null
};

const GaleryEntry = ({ uri, video }: { uri: string; video: Video }) => {
  return (
    <div
      key={`wrap-${video.id}`}
      className="gallery-col bx--col-lg-4 bx--col-md-2 bx--col-sm-2"
    >
      <img
        key={`img-${video.id}`}
        className="gallery-image"
        src={`${uri}/${video.imageUrl}`}
        alt={video.imageUrl}
      />
      {video.annotations && (
        <div className="gallery-tags">
          <span className="gallery-date">
            {(() => {
              const date = new Date(`${video.date}`);
              return date.toLocaleString();
            })()}
          </span>
          {video?.annotations?.map((annotation) => (
            <Tag key={`tag-${video.id}-${annotation.name}`} type="blue">
              {annotation.name}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default withTranslation()(Gallery);
