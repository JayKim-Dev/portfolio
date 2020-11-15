/* eslint-disable linebreak-style */
import React from 'react';
import {
  CButton,
  CModalTitle,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react';

function ReturnLogin(props) {
  return (
    <CModal show={props.show} color="danger" closeOnBackdrop={false} centered>
      <CModalHeader>
        <CModalTitle>인증 세션 만료</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center">
        인증 세션이 만료되어 로그인 페이지로 이동합니다.
      </CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={props.onClick}>
          확인
        </CButton>
      </CModalFooter>
    </CModal>
  );
}

export default ReturnLogin;
