/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import axios from 'axios';

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
  CFormText,
  CLink,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { properties } from '../../../properties';
import InfoModal from '../../modal/InfoModal';

function Login() {
  // Info Modal 관리
  const [infoModal, setInfoModal] = useState(false);
  // info Modal 객체 관리
  const [infoModalObject, setInfoModalObject] = useState({});
  // 미승인 계정 로그인 Modal 관리
  const [approveN, setApproveN] = useState(false);

  function auth(id, password) {
    const AuthUrl = `${properties.url}/login`;

    axios
      .post(AuthUrl,
        {
          id,
          password,
        })
      .then((res) => {
        if (res.data.approveStatus === 'N') {
          localStorage.setItem('token', res.data.token);  // 로그인 토큰 저장
          setApproveN(!approveN);
        } else {
          localStorage.setItem('token', res.data.token);  // 로그인 토큰 저장
          window.location.replace('/'); // href와 차이점 : 뒤로가기(history) 불가
        }
        localStorage.setItem('id', id); // 아이디 저장
        localStorage.setItem('approve', res.data.approveStatus);  // 계정 승인여부 저장
        localStorage.setItem('expiresIn', res.data.expiresIn); // 만료 시간 저장
        localStorage.setItem('logintime', Date.now()); // 로그인 시간 저장

        return res.data;
      })
      .catch((e) => {
        setInfoModalObject({
          color: 'danger',
          title: '로그인 실패',
          body: '아이디/비밀번호가 일치하지 않습니다',
        });
        setInfoModal(!infoModal);
        console.error(e);
      });
  }

  return (
    <>
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="5">
              <CCardGroup>
                <CCard className="px-4">
                  <CCardBody>
                    <CForm>
                      {/* 로고 */}
                      <CCol className="mb-5" align="center">
                        <h1>HTDSS</h1>
                        <p className="text-muted">로그인</p>
                      </CCol>

                      {/* 아이디 Input */}
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput className="form-control-warning" type="text" placeholder="아이디" id="userid" maxLength="16" />
                      </CInputGroup>

                      {/* 비밀번호 Input */}
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          className="form-control-warning"
                          type="password"
                          placeholder="비밀번호"
                          id="userpwd"
                          maxLength="32"
                          onKeyUp={(e) => {
                            if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                              auth(
                                document.getElementById('userid').value,
                                document.getElementById('userpwd').value,
                              );
                            }
                          }}
                        />
                      </CInputGroup>

                      {/* 로그인 Button */}
                      <CCol className="my-1 p-0">
                        <CButton
                          onClick={() => auth(
                            document.getElementById('userid').value,
                            document.getElementById('userpwd').value,
                          )}
                          color="info"
                          block
                        >로그인
                        </CButton>
                      </CCol>

                      {/* InfoModal 구현 */}
                      <InfoModal
                        show={infoModal}
                        color={infoModalObject.color}
                        title={infoModalObject.title}
                        body={infoModalObject.body}
                        onClick={() => {
                          setInfoModal(!infoModal);
                        }}
                      />

                      {/* 미승인 계정 로그인 Modail */}
                      <CModal show={approveN} color="danger" closeOnBackdrop={false} centered>
                        <CModalHeader>
                          <CModalTitle>미승인 계정 로그인</CModalTitle>
                        </CModalHeader>
                        <CModalBody className="text-center">
                          미승인 계정으로 로그인하였습니다 <br />
                          페이지 접근 권한이 제한됩니다
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            color="danger"
                            onClick={() => {
                              setApproveN(false);
                              window.location.replace('/');
                            }}
                          >확인
                          </CButton>
                        </CModalFooter>
                      </CModal>

                      {/* 회원가입 */}
                      <CCol className="text-center mb-4">
                        <CLink to="/register">
                          <CButton color="link" size="sm">회원가입</CButton>
                        </CLink>
                      </CCol>

                      {/* 비밀번호 분실관련 내용 */}
                      <CCol className="text-center">
                        <CFormText>비밀번호 분실 시 관리자에게 연락바랍니다.</CFormText>
                      </CCol>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
}

export default Login;
