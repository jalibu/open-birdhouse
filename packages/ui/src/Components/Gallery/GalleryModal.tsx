import { Content } from "@open-birdhouse/common";
import { Modal } from "carbon-components-react";
import ReactPlayer from "react-player";
import React from "react";
import { t } from "i18next";

export default function GalleryModal({
  isOpened,
  handleClose,
  modalContent,
  uri,
}: {
  isOpened: boolean;
  handleClose: () => void;
  modalContent: Content | undefined;
  uri: string;
}): JSX.Element | null {
  return modalContent ? (
    <Modal
      className="gallery-modal"
      modalHeading={t("GALLERY.RECORDING")}
      onRequestClose={handleClose}
      open={isOpened}
      passiveModal
      size="sm"
    >
      <ReactPlayer
        playing
        light={
          modalContent.imageUrl.startsWith("http")
            ? modalContent.imageUrl
            : `${uri}/${modalContent?.imageUrl}`
        }
        url={
          modalContent.videoUrl?.startsWith("http")
            ? modalContent.videoUrl
            : `${uri}/${modalContent?.videoUrl}`
        }
        controls
        style={{ maxWidth: "100%", width: "100%", minHeight: "320px" }}
      />
      <p>
        {(() => {
          const date = new Date(`${modalContent?.date}`);
          return date.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          });
        })()}
      </p>
      <p>
        {`${
          modalContent?.filesize
            ? (modalContent?.filesize / 1000000).toFixed(1)
            : 0
        } MB`}
      </p>
    </Modal>
  ) : null;
}
