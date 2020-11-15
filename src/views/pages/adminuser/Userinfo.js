/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  CModalTitle,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CCardGroup,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { properties } from "../../../properties";
import InfoModal from "../../modal/InfoModal";
import * as EditPassword from "../../../function/EditPassword";
import { useSelector } from "react-redux";

function Userinfo() {
  // 내 정보 관리
  const [info, setInfo] = useState([]);
  // Info Modal 관리
  const [infoModal, setInfoModal] = useState(false);
  // info Modal 객체 관리
  const [infoModalObject, setInfoModalObject] = useState({});
  // 정보수정 성공 Modal
  const [infosuccess, setInfosuccess] = useState(false);
  // 패스워드 복잡도 관리
  const [pw, setPw] = useState({});
  // 패스워드 확인 관리
  const [confirmPw, setConfirmPw] = useState({});
  // 이메일 규칙 관리
  const [em, setEm] = useState({
    text: "",
    color: "success",
    status: true,
  });
  // input 관리
  const [inputs, setInputs] = useState({
    text: "",
    color: "success",
    status: false,
  });

  const onChange = (e) => {
    const { value, id } = e.target;
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  /* 이메일 규칙 함수 CheckEmail */
  function CheckEmail(email, em) {
    const useremail = email;
    const checkemail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
      useremail
    );

    if (checkemail) {
      em.text = "사용 가능 합니다.";
      em.color = "success";
      em.status = true;
    } else {
      em.text = "이메일 형식에 맞춰 입력해주세요";
      em.color = "danger";
      em.status = false;
    }
  }

  /* 내 정보 받아오는 함수 */
  useEffect(() => {
    const UserInfoUrl = `${properties.url}/adminuser/edit?id=${localStorage.getItem("id")}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .get(UserInfoUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setInfo(res.data.data);
        setPw({});
        setConfirmPw({});
      })
      .catch((e) => {
        console.error(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redux에서 부서 코드를 불러옴
  const department = useSelector((state) => state.dept.department);

  /* 내 정보 저장하는 함수 UserinfoEdit */
  function UserinfoEdit(password, name, telephone, email, department) {
    const UserInfoEditUrl = `${properties.url}/adminuser/edit?id=${localStorage.getItem("id")}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .post(
        UserInfoEditUrl,
        {},
        {
          headers: {
            Authorization: token,
          },
          data: {
            password,
            name,
            telephone,
            email,
            department,
          },
        }
      )
      .then((res) => {
        if (res.data.resultMessage === "SUCCESS") {
          setInfosuccess(!infosuccess);
        }
        setEm({});
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
              <CCard className="px-3">
                <CCardBody>
                  <CForm>
                    <CCol className="my-5" align="center">
                      <h1>내 정보</h1>
                      <p className="text-muted">내 정보를 확인하고 수정할 수 있습니다</p>
                    </CCol>

                    {/* 아이디 Input */}
                    <CCol sm="8">
                      <CInputGroup className="my-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="userid" maxLength="16" defaultValue={info.id} disabled />
                      </CInputGroup>
                    </CCol>

                    {/* 비밀번호 Input */}
                    <CCol sm="8">
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="password"
                          placeholder="비밀번호를 입력하세요"
                          id="password"
                          maxLength="16"
                          onChange={(e) => {
                            onChange(e);
                            EditPassword.checkPwd(document.getElementById("password").value, pw);
                            if (document.getElementById("confirmpassword").value !== "") {
                              EditPassword.confirmPwd(
                                document.getElementById("password").value,
                                document.getElementById("confirmpassword").value,
                                confirmPw
                              );
                            }
                          }}
                        />
                      </CInputGroup>
                      <CFormText id="pw" className="help-block ml-5 mb-3" align="left" color={pw.color}>
                        {pw.text}
                      </CFormText>
                    </CCol>

                    {/* 비밀번호 확인 Input */}
                    <CCol sm="8" align="auto">
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
                              document.getElementById("password").value,
                              document.getElementById("confirmpassword").value,
                              confirmPw
                            );
                          }}
                        />
                      </CInputGroup>
                      <CFormText id="checkPw" className="help-block ml-5 mb-3" align="left" color={confirmPw.color}>
                        {confirmPw.text}
                      </CFormText>
                    </CCol>

                    {/* 이름 Input */}
                    <CCol sm="8">
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="name" defaultValue={info.name} maxLength="16" />
                      </CInputGroup>
                    </CCol>

                    {/* 전화번호 Input */}
                    <CCol sm="8">
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-phone" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="tel"
                          id="telephone"
                          maxLength="13"
                          defaultValue={info.telephone}
                          onKeyUp={() => {
                            const telephone = document
                              .getElementById("telephone")
                              .value.replace(/[^0-9]/g, "")
                              .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
                              .replace("--", "-");
                            document.getElementById("telephone").value = telephone;
                          }}
                        />
                      </CInputGroup>
                    </CCol>

                    {/* 이메일 Input */}
                    <CCol sm="8">
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-envelope-closed" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="text"
                          id="email"
                          defaultValue={info.email}
                          onChange={(e) => {
                            onChange(e);
                            CheckEmail(document.getElementById("email").value, em);
                          }}
                        />
                      </CInputGroup>
                      <CFormText id="confirmemail" className="help-block ml-5 mb-3" align="left" color={em.color}>
                        {em.text}
                      </CFormText>
                    </CCol>

                    {/* 부서명 Input */}
                    <CCol sm="8">
                      <CInputGroup className="mb-5">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-people" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CSelect
                          name="department"
                          id="department"
                          value={info.department}
                          onChange={(e) => {
                            setInfo({ ...info, department: parseInt(e.target.value) });
                          }}
                        >
                          {department.map((department, code) => (
                            <option key={code} value={department.code} label={department.description} />
                          ))}
                        </CSelect>
                      </CInputGroup>
                    </CCol>

                    {/* 확인 Button */}
                    <CCol className="text-right mt-5">
                      <CButton
                        color="secondary mr-2"
                        onClick={() => {
                          localStorage.removeItem("confirmuser");
                          window.location.replace("/");
                        }}
                      >
                        취소
                      </CButton>
                      <CButton
                        color="info"
                        onClick={() => {
                          const userpwd = document.getElementById("password").value;
                          const userpwdcheck = document.getElementById("confirmpassword").value;

                          if (userpwd === "" && userpwdcheck === "") {
                            if (em.status) {
                              UserinfoEdit(
                                document.getElementById("password").value,
                                document.getElementById("name").value,
                                document.getElementById("telephone").value,
                                document.getElementById("email").value,
                                document.getElementById("department").value
                              );
                            } else {
                              setInfoModal(!infoModal);
                              setInfoModalObject({
                                color: "danger",
                                title: "정보수정 실패",
                                body: "각 항목의 형식에 맞게 입력해주세요",
                              });
                            }
                          } else {
                            if (pw.status && em.status) {
                              UserinfoEdit(
                                document.getElementById("password").value,
                                document.getElementById("name").value,
                                document.getElementById("telephone").value,
                                document.getElementById("email").value,
                                document.getElementById("department").value
                              );
                            } else {
                              setInfoModal(!infoModal);
                              setInfoModalObject({
                                color: "danger",
                                title: "정보수정 실패",
                                body: "각 항목의 형식에 맞게 입력해주세요",
                              });
                            }
                          }

                          if (userpwd !== userpwdcheck) {
                            setInfoModal(!infoModal);
                            setInfoModalObject({
                              color: "danger",
                              title: "정보수정 실패",
                              body: "비밀번호를 일치시켜주세요",
                            });
                          }
                        }}
                      >
                        확인
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

                    {/* 정보수정 성공 Modal */}
                    <CModal show={infosuccess} color="primary" closeOnBackdrop={false} centered>
                      <CModalHeader>
                        <CModalTitle>수정 완료</CModalTitle>
                      </CModalHeader>
                      <CModalBody className="text-center">정상적으로 수정되었습니다</CModalBody>
                      <CModalFooter>
                        <CButton
                          color="primary"
                          onClick={() => {
                            setInfosuccess(false);
                            localStorage.removeItem("confirmuser");
                            window.location.replace("/");
                          }}
                        >
                          확인
                        </CButton>
                      </CModalFooter>
                    </CModal>
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

export default Userinfo;
