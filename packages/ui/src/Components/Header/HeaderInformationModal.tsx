import { Link, Modal } from "carbon-components-react";
import React from "react";

export default function HeaderInformationModal({
  isOpened,
  handleClose,
}: {
  isOpened: boolean;
  handleClose: () => void;
}): JSX.Element {
  return (
    <Modal
      iconDescription="Close"
      modalHeading="Information"
      modalLabel=""
      onRequestClose={handleClose}
      open={isOpened}
      passiveModal
      size="sm"
    >
      <div className="bx--modal-content__text">
        <h5>Open Birdhouse</h5>
        <p>MIT licensed</p>
        <p>
          © 2022 <Link target="_blank" href="https://github.com/jalibu/open-birdhouse">Jalibu</Link>
        </p>
      </div>
    </Modal>
  );
}
