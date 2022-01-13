import { Video } from "@open-birdhouse/common";
import { Modal } from "carbon-components-react";
import ReactPlayer from "react-player";
import React from "react";

export default function GalleryModal({
  isOpened,
  handleClose,
  modalVideo,
  uri,
}: {
  isOpened: boolean;
  handleClose: () => void;
  modalVideo: Video | undefined;
  uri: string;
}): JSX.Element | null {
  return modalVideo ? (
    <Modal
      className="gallery-modal"
      iconDescription="Close"
      modalHeading="Recording"
      onRequestClose={handleClose}
      open={isOpened}
      passiveModal
      size="sm"
    >
      <ReactPlayer
        url={
          modalVideo.videoUrl.startsWith("http")
            ? modalVideo.videoUrl
            : `${uri}/${modalVideo?.videoUrl}`
        }
        controls
        style={{ maxWidth: "100%", width: "100%", minHeight: "320px" }}
      />
      <p>
        {(() => {
          const date = new Date(`${modalVideo?.date}`);
          return date.toLocaleString();
        })()}
      </p>
      <p>
        {`${
          modalVideo?.filesize ? (modalVideo?.filesize / 1000000).toFixed(1) : 0
        } MB`}
      </p>
    </Modal>
  ) : null;
}
