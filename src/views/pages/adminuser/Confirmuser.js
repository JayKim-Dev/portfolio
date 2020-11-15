/* eslint-disable linebreak-style */
import React, { useState } from "react";
import axios from "axios";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CInput,
  CForm,
  CCardGroup,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CContainer,
  CLink,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { properties } from "../../../properties";
import InfoModal from "../../modal/InfoModal";

function Confirmuser() {
  // Info Modal 관리
  const [infoModal, setInfoModal] = useState(false);
  // info Modal 객체 관리
  const [infoModalObject, setInfoModalObject] = useState({});
  // 본인확인 완료 Modal 관리
  const [confirmsuccess, setConfirmsuccess] = useState(false);

  /* 비밀번호 확인 함수 ConfirmPWD */
  function ConfirmPWD(password) {
    const ConfirmPWDUrl = `${properties.url}/adminuser/password/verify?id=${localStorage.getItem("id")}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .post(
        ConfirmPWDUrl,
        {},
        {
          headers: {
            Authorization: token,
          },
          data: {
            password,
          },
        }
      )
      .then((res) => {
        if (res.data.resultMessage === "비밀번호가 일치합니다.") {
          localStorage.setItem("confirmuser", "Y");
          window.location.replace("/userinfo");
        } else {
          setInfoModalObject({
            color: "danger",
            title: "본인확인 실패",
            body: "비밀번호가 일치하지 않습니다",
          });
          setInfoModal(!infoModal);
        }
        return res.data;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8" align="center">
            <CCardGroup>
              <CCard className="px-4">
                <CCardBody>
                  <CForm>
                    <CCol className="my-5" align="center">
                      <h1>본인확인</h1>
                      <p className="text-muted">개인정보 보호를 위해 비밀번호를 한번 더 입력해주세요</p>
                    </CCol>

                    {/* 아이디 Input */}
                    <CCol sm="8">
                      <CInputGroup className="my-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          className="form-control-warning"
                          type="text"
                          id="userid"
                          maxLength="16"
                          defaultValue={localStorage.getItem("id")}
                          disabled
                        />
                      </CInputGroup>
                    </CCol>

                    {/* 비밀번호 Input */}
                    <CCol sm="8">
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="password"
                          placeholder="비밀번호"
                          id="password"
                          maxLength="16"
                          onKeyUp={(e) => {
                            if (e.key === "Enter" || e.key === "NumpadEnter") {
                              ConfirmPWD(document.getElementById("password").value);
                            }
                          }}
                        />
                      </CInputGroup>
                    </CCol>

                    {/* 확인 Button */}
                    <CCol className="text-center mt-5">
                      <CLink to="/home">
                        <CButton color="secondary mr-2">취소</CButton>
                      </CLink>
                      <CButton
                        color="info"
                        onClick={() => {
                          ConfirmPWD(document.getElementById("password").value);
                        }}
                      >
                        확인
                      </CButton>
                    </CCol>

                    {/* 본인확인 성공 Modal */}
                    <CModal show={confirmsuccess} color="primary" closeOnBackdrop={false} centered>
                      <CModalHeader>
                        <CModalTitle>본인확인 완료</CModalTitle>
                      </CModalHeader>
                      <CModalBody className="text-center">본인확인 완료되었습니다</CModalBody>
                      <CModalFooter>
                        <CButton
                          color="primary"
                          to="/userinfo"
                          onClick={() => {
                            setConfirmsuccess(false);
                          }}
                        >
                          확인
                        </CButton>
                      </CModalFooter>
                    </CModal>

                    {/* 본인확인 실패 InfoModal 구현 */}
                    <InfoModal
                      show={infoModal}
                      color={infoModalObject.color}
                      title={infoModalObject.title}
                      body={infoModalObject.body}
                      onClick={() => {
                        setInfoModal(!infoModal);
                      }}
                    />
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
}

export default Confirmuser;
