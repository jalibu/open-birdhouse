import { Video } from "@open-birdhouse/common";
import { Link, Modal } from "carbon-components-react";
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
}): JSX.Element {
  return (
    <Modal
      className="gallery-modal"
      iconDescription="Close"
      modalHeading=""
      modalLabel={(() => {
        const date = new Date(`${modalVideo?.date}`);
        return date.toLocaleString();
      })()}
      onRequestClose={handleClose}
      open={isOpened}
      passiveModal
      size="sm"
    >
      <div className="bx--modal-content__text">
        <img src={`${uri}/${modalVideo?.imageUrl}`} alt={modalVideo?.id} />
        <p>
          <Link target="_blank" href={`${uri}/${modalVideo?.videoUrl}`}>
            Download Video ({`${modalVideo?.filesize ? (modalVideo?.filesize / 1000000).toFixed(1) : 0} MB`})
          </Link>
        </p>
      </div>
    </Modal>
  );
}
