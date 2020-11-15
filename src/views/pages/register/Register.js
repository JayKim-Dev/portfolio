/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CSelect,
  CFormText,
  CFormGroup,
  CLink,
  CModalTitle,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { properties } from '../../../properties';
import InfoModal from '../../modal/InfoModal';
import * as EditPassword from '../../../function/EditPassword';
import { useSelector } from "react-redux";

function Register() {
  // Info Modal 관리
  const [infoModal, setInfoModal] = useState(false);
  // info Modal 객체 관리
  const [infoModalObject, setInfoModalObject] = useState({});
  // 회원가입 성공 Modal 관리
  const [regsuccess, setRegsuccess] = useState(false);
  // 패스워드 복잡도 관리
  const [pw, setPw] = useState({});
  // 패스워드 확인 관리
  const [confirmPw, setConfirmPw] = useState({});
  // 이메일 규칙 관리
  const [em, setEm] = useState({});
  // 아이디 규칙 관리
  const [checkid, setCheckid] = useState({});
  // input 관리
  const [inputs, setInputs] = useState({
    text: '',
    color: 'success',
    status: false,
  });

  const onChange = (e) => {
    const { value, id } = e.target;
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  /* 중복확인 함수 ConfirmID */
  function ConfirmID(userid) {
    const ConfirmIDUrl = `${properties.url}/adminuser/id/verify/?id=${userid}`;
    axios
      .get(ConfirmIDUrl)
      .then((res) => {
        if (res.data.data.exist === '0') {
          setInfoModalObject({
            color: 'info',
            title: '중복확인',
            body: '사용가능한 아이디입니다',
          });
          setInfoModal(!infoModal);
          console.log('사용가능한 아이디');
          document.getElementById('check_id').innerText = 'Y';
        } else {
          setInfoModalObject({
            color: 'danger',
            title: '중복확인',
            body: '존재하는 아이디입니다',
          });
          setInfoModal(!infoModal);
          console.log('이미 있는 아이디');
          document.getElementById('check_id').innerText = 'N';
        }
        return res.data;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  /* 아이디 규칙 함수 CheckID */
  function CheckID(id, checkid) {
    const userid = id;
    // 아이디 규칙 : 4~16자의 영문 소문자, 숫자만 사용 가능
    const CheckIDEn = /^(?=.*[a-z]).{4,16}$/.test(userid); // 영문 소문자
    const CheckIDEnNum = /^(?=.*[a-z])(?=.*\d).{4,16}$/.test(userid); // 영문 소문자 + 숫자
    
    if (CheckIDEn || CheckIDEnNum) {
      checkid.text = "";
      checkid.color = "";
      checkid.status = true;
    } else if (!CheckIDEn || !CheckIDEnNum || userid === "") {
      checkid.text = "4~16자의 영문 소문자, 숫자만 사용 가능합니다.";
      checkid.color = "danger";
      checkid.status = false;
    }
    if (!id.status) {
      document.getElementById('check_id').innerText = 'N';
    }
  }

  /* 이메일 규칙 함수 CheckEmail */
  function CheckEmail(email, em) {
    const useremail = email;
    const checkemail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(useremail);
    
    if (checkemail) {
      em.text = "사용 가능 합니다.";
      em.color = "success"
      em.status = true;      
    } else if (!checkemail || useremail === "") {
      em.text = "이메일 형식에 맞춰 입력해주세요";
      em.color = "danger";
      em.status = false;  
    }
  }

  // redux에서 부서 코드를 불러옴
  const department = useSelector((state) => state.dept.department);

  /* 회원가입 함수 ConfirmRegister */
  function ConfirmRegister(id, password, name, telephone, email, department) {
    const ConfirmRegisterUrl = `${properties.url}/adminuser/register`;
    axios
      .post(ConfirmRegisterUrl,
        {
          id,
          password,
          name,
          telephone,
          email,
          department,
        })
      .then((res) => {
        if (res.data.resultMessage === 'SUCCESS') {
          setRegsuccess(!regsuccess);
          console.log('회원가입 성공');
        }
        return res.data;
      })
      .catch((e) => {
        setInfoModalObject({
          color: 'danger',
          title: '회원가입 실패',
          body: '모든 항목을 입력해주세요',
        });
        setInfoModal(!infoModal);
        console.error(e);
      });
    setPw({});
    setConfirmPw({});
    setCheckid({});
    setEm({});
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>

                  {/* 로고 */}
                  <CCol className="mb-5" align="center">
                    <h1>HTDSS</h1>
                    <p className="text-muted">회원가입</p>
                  </CCol>

                  {/* 아이디 Input, 중복확인 Button */}
                  <CFormGroup>
                    <div className="controls">
                      <CInputGroup className="input-prepend">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="text"
                          placeholder="아이디를 입력하세요"
                          id="id"
                          maxLength="16"
                          onChange={(e) => {
                            onChange(e);
                            CheckID(document.getElementById('id').value, checkid);
                          }}
                        />
                        <CButton
                          onClick={() => ConfirmID(
                            document.getElementById('id').value,
                          )}
                          color="info"
                        >중복확인
                        </CButton>
                      </CInputGroup>
                      <CFormText id="confirmid" className="help-block ml-5" color={checkid.color}>
                        {checkid.text}
                      </CFormText>
                    </div>
                  </CFormGroup>

                  {/* 비밀번호 Input */}
                  <CFormGroup>
                    <div className="controls">
                      <CInputGroup className="input-prepend">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="password"
                          placeholder="비밀번호를 입력하세요"
                          id="password"
                          minLength="9"
                          maxLength="16"
                          onChange={(e) => {
                            onChange(e);
                            EditPassword.checkPwd(document.getElementById('password').value, pw);
                            EditPassword.confirmPwd(
                              document.getElementById('password').value,
                              document.getElementById('confirmpassword').value,
                              confirmPw,
                            );
                          }}
                        />
                      </CInputGroup>
                      <CFormText id="pw" className="help-block ml-5 mb-3" align="left" color={pw.color}>
                        {pw.text}
                      </CFormText>
                    </div>
                  </CFormGroup>

                  {/* 비밀번호 확인 Input */}
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        id="confirmpassword"
                        maxLength="16"
                        onChange={(e) => {
                          onChange(e);
                          EditPassword.confirmPwd(
                            document.getElementById('password').value,
                            document.getElementById('confirmpassword').value,
                            confirmPw,
                          );
                        }}
                      />
                    </CInputGroup>
                    <CFormText id="checkPw" className="help-block ml-5 mb-3" align="left" color={confirmPw.color}>
                      {confirmPw.text}
                    </CFormText>
                  </CFormGroup>

                  {/* 이름 Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="이름을 입력하세요" id="name" maxLength="16" />
                  </CInputGroup>

                  {/* 전화번호 Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-phone" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="tel"
                      placeholder="전화번호를 입력하세요"
                      id="telephone"
                      maxLength="13"
                      onKeyUp={() => {
                        const telephone = document
                          .getElementById('telephone')
                          .value.replace(/[^0-9]/g, '')
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
                            '$1-$2-$3',
                          )
                          .replace('--', '-');
                        document.getElementById('telephone').value = telephone;
                      }}
                    />
                  </CInputGroup>

                  {/* 이메일 Input */}
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-envelope-closed" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="이메일을 입력하세요"
                        id="email"
                        onChange={(e) => {
                          onChange(e);
                          CheckEmail(document.getElementById('email').value,em);
                        }}
                      />
                    </CInputGroup>
                    <CFormText id="confirmemail" className="help-block ml-5" color={em.color}>
                      {em.text}
                    </CFormText>
                  </CFormGroup>

                  {/* 부서명 Input */}
                  <CInputGroup className="mb-5">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-people" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect
                      name="department"
                      id="department"
                    >
                      {department.map((department, code) => (
                        <option
                          key={code}
                          value={department.code}
                          label={department.description}
                        />
                      ))}
                    </CSelect>
                  </CInputGroup>

                  {/* 회원가입 취소, 확인 Button */}
                  <p id="check_id" hidden>N</p>
                  <CCol className="text-right p-0">
                    <CLink to="/login">
                      <CButton color="secondary mr-2">취소</CButton>
                    </CLink>
                    <CButton
                      color="info"
                      onClick={() => {
                        const IDCheck = document.getElementById('check_id').innerText;

                        if (IDCheck === 'N') {
                          setInfoModal(!infoModal);
                          setInfoModalObject({
                            color: 'danger',
                            title: '회원가입 실패',
                            body: '중복확인 버튼을 눌러주세요',
                          });
                        } else if (!checkid.status || !pw.status || !em.status) {
                          setInfoModal(!infoModal);
                          setInfoModalObject({
                            color: 'danger',
                            title: '회원가입 실패',
                            body: '각 항목의 형식에 맞게 작성해주세요',
                          });
                        } else if (!confirmPw.status) {
                          setInfoModal(!infoModal);
                          setInfoModalObject({
                            color: 'danger',
                            title: '회원가입 실패',
                            body: '비밀번호를 일치시켜주세요',
                          });
                        } else if (IDCheck === 'Y' && checkid.status && pw.status && em.status) {
                          ConfirmRegister(
                            document.getElementById('id').value,
                            document.getElementById('password').value,
                            document.getElementById('name').value,
                            document.getElementById('telephone').value,
                            document.getElementById('email').value,
                            document.getElementById('department').value,
                          );
                        } else {
                          setInfoModalObject({
                            color: 'danger',
                            title: '회원가입 실패',
                            body: '모든 항목을 입력해주세요',
                          });
                          setInfoModal(!infoModal);
                        }
                      }}
                    >확인
                    </CButton>
                  </CCol>

                  {/* Info Modal 구현 */}
                  <InfoModal
                    show={infoModal}
                    color={infoModalObject.color}
                    title={infoModalObject.title}
                    body={infoModalObject.body}
                    onClick={() => {
                      setInfoModal(!infoModal);
                    }}
                  />

                  {/* 회원가입 성공 Modail */}
                  <CModal show={regsuccess} color="primary" closeOnBackdrop={false} centered>
                    <CModalHeader>
                      <CModalTitle>회원가입 성공</CModalTitle>
                    </CModalHeader>
                    <CModalBody className="text-center">
                      회원가입이 완료되었습니다 <br />
                      관리자에게 승인을 받은 후 로그인해주세요
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color="primary"
                        onClick={() => {
                          setRegsuccess(false);
                          window.location.replace('/login');
                        }}
                      >확인
                      </CButton>
                    </CModalFooter>
                  </CModal>

                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default Register;
