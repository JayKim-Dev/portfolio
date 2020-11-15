import React from "react";
import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CFormText,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

function ModifyPassword(props) {
  return (
    <>
      {/* 입주민 회원 비밀번호 변경 Modal 구현 */}
      <CModal show={props.show} color="info" closeOnBackdrop={false} centered onClose={props.onClose}>
        <CModalHeader>
          <CModalTitle>비밀번호 변경</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-left">
          <CForm className="form-horizontal">
            <CFormGroup row>
              <CCol md="3">비밀번호</CCol>
              <CCol>
                <CInput type="password" id="password" minLength="9" maxLength="16" onChange={props.onPwChange} />
                <CFormText id="pw" className="help-block" color={props.pwColor}>
                  {props.pwText}
                </CFormText>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="3">비밀번호 확인</CCol>
              <CCol>
                <CInput
                  type="password"
                  id="check_password"
                  minLength="9"
                  maxLength="16"
                  onChange={props.onPwCheckChange}
                />
                <CFormText id="checkPw" className="help-block" color={props.confirmPwColor}>
                  {props.confirmPwText}
                </CFormText>
              </CCol>
            </CFormGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={props.onCancelClick}>
            취소
          </CButton>
          <CButton color="info" onClick={props.onClick} disabled={!props.pwStatus || !props.confirmPwStatus}>
            확인
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default ModifyPassword;
