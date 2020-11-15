import React from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CModalFooter,
} from "@coreui/react";

function InfoModal(props) {
  return (
    <CModal
      show={props.show}
      color={props.color}
      centered
      closeOnBackdrop={false}
      onClose={props.onClose}
    >
      <CModalHeader>
        <CModalTitle>{props.title}</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-left">{props.body}</CModalBody>
      <CModalFooter>
        <CButton color={props.color} onClick={props.onClick}>
          확인
        </CButton>
      </CModalFooter>
    </CModal>
  );
}

export default InfoModal;
