import React, { useState, useEffect } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CInput,
  CForm,
  CFormGroup,
} from "@coreui/react";
import { properties } from "../../properties";
import InfoModal from "../modal/InfoModal";
import * as EditPassword from "../../function/EditPassword";
import { useSelector } from "react-redux";
import ModifyPassword from "../modal/ModifyPassword";

function SysUsers() {
  // 회원 삭제 Modal 관리
  const [delAdmin, setDelAdmin] = useState(false);
  // 비밀번호 수정 Modal 관리
  const [modPassword, setModPassword] = useState(false);
  // 비밀번호 변경, 승인 계정 관리
  const [id, setId] = useState("");
  // 회원 승인 Modal 관리
  const [approve, setApprove] = useState(false);
  // 회원 승인 상태 관리
  const [approveYn, setApproveYn] = useState();
  // 삭제 계정 관리
  const [adminInfo, setAdminInfo] = useState({});
  // 시스템 회원 리스트를 받아 data 배열에 저장
  const [data, setData] = useState([]);
  // 패스워드 복잡도 관리
  const [pw, setPw] = useState({});
  // 패스워드 확인 관리
  const [confirmPw, setConfirmPw] = useState({});
  // Info Modal 관리
  const [infoModal, setInfoModal] = useState(false);
  // info Modal 객체 관리
  const [infoModalObject, setInfoModalObject] = useState({});
  const [inputs, setInputs] = useState({
    password: "",
    check_password: "",
  });

  const onChange = (e) => {
    const { value, id } = e.target;
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  // 시스템 회원 정보 리스트 요청
  const fetchData = () => {
    const axios = require("axios");
    const usersDataUrl = `${properties.url}/adminuser`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .get(usersDataUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => {
        console.error(error);
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setInfoModal(!infoModal);
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redux에서 부서 코드를 불러옴
  const departmentCode = useSelector((state) => state.dept.department);

  // data 배열 중 코드로 전달받은 department 치환
  const depName = (DeptCode) => {
    let deptName;
    for (let i = 0; i < departmentCode.length; i++) {
      if (DeptCode === departmentCode[i].code) {
        deptName = departmentCode[i].description;
      }
    }
    return deptName;
  };

  for (let i = 0; i < data.length; i++) {
    if (!isNaN(data[i].department)) {
      data[i].department = depName(data[i].department);
    }
  }

  // 회원 승인 여부를 Badge로 나타내기 위한 함수 정의
  const getBadge = (approve) => {
    switch (approve) {
      case "Y":
        return "success";
      case "N":
        return "danger";
      default:
        return "secondary";
    }
  };

  // 테이블에 표시할 column 정의
  const fields = [
    { key: "id", label: "ID" },
    { key: "name", label: "이름" },
    { key: "telephone", label: "전화번호" },
    { key: "email", label: "이메일" },
    { key: "department", label: "부서" },
    {
      key: "approve",
      label: "승인",
      sorter: false,
      filter: false,
      _style: { width: "4rem" },
    },
    {
      key: "modPassword",
      label: "",
      sorter: false,
      filter: false,
      _style: { width: "8rem" },
    },
    {
      key: "approveAdmin",
      label: "",
      sorter: false,
      filter: false,
      _style: { width: "6rem" },
    },
    {
      key: "deleteAdmin",
      label: "",
      sorter: false,
      filter: false,
      _style: { width: "5rem" },
    },
  ];

  // 비밀번호 변경 함수 정의
  const modifyPassword = (id, password) => {
    const axios = require("axios");
    const url = `${properties.url}/adminuser/password/edit?id=${id}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");
    axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: token,
          },
          data: {
            password: password,
          },
        }
      )
      .then((res) => {
        setModPassword(!modPassword);
        setId("");
        res.data.resultStatus === "1"
          ? setInfoModalObject({
              color: "info",
              title: "비밀번호 변경",
              body: "비밀번호가 변경 되었습니다.",
            })
          : setInfoModalObject({
              color: "danger",
              title: "비밀번호 변경",
              body: "비밀번호가 변경되지 않았습니다.",
            });
        setInfoModal(!infoModal);
        setPw({});
        setConfirmPw({});
        return res.data;
      })
      .catch((error) => {
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setModPassword(!modPassword);
        setInfoModal(!infoModal);
      });
  };

  // 회원 승인 함수 정의
  const approveAdmin = (id) => {
    const axios = require("axios");
    const url = `${properties.url}/adminuser/approve?id=${id}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");
    axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: token,
          },
          data: {
            approve: approveYn,
          },
        }
      )
      .then((res) => {
        setInfoModalObject({
          color: "success",
          title: "회원 승인",
          body: "승인 상태가 변경되었습니다.",
        });
        setInfoModal(!infoModal);
        fetchData();
      })
      .catch((error) => {
        console.error(error.response);
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setInfoModal(!infoModal);
      });
  };

  // 회원 삭제 함수 정의
  const deleteAdmin = (id, reason) => {
    const axios = require("axios");
    const url = `${properties.url}/adminuser/delete?id=${id}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");
    axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: token,
          },
          data: {
            reason: reason,
          },
        }
      )
      .then((res) => {
        setDelAdmin(!delAdmin);
        setInfoModalObject({
          color: "danger",
          title: "사용자 삭제",
          body: res.data.resultMessage,
        });
        setInfoModal(!infoModal);
        setAdminInfo({});
        fetchData();
      })
      .catch((error) => {
        setDelAdmin(!delAdmin);
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setInfoModal(!infoModal);
      });
  };

  return (
    <CRow>
      <CCol xl={12}>
        <CCard xl={12}>
          <CCardHeader>시스템 회원</CCardHeader>
          <CCardBody>
            <CDataTable
              items={data}
              fields={fields}
              columnFilter
              itemsPerPage={20}
              hover
              sorter
              pagination={{
                align: "center",
              }}
              scopedSlots={{
                approve: (item) => (
                  <td>
                    <CBadge color={getBadge(item.approve)}>{item.approve}</CBadge>
                  </td>
                ),
                modPassword: (item) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="info"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          setModPassword(!modPassword);
                          setId(item.id);
                        }}
                      >
                        비밀번호 변경
                      </CButton>
                    </td>
                  );
                },
                approveAdmin: (item) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color={localStorage.getItem("id") === item.id ? "dark" : "success"}
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          setApprove(!approve);
                          setId(item.id);
                          item.approve === "Y" ? setApproveYn("N") : setApproveYn("Y");
                        }}
                        disabled={localStorage.getItem("id") === item.id ? true : false}
                      >
                        {item.approve === "Y" ? "승인취소" : "승인"}
                      </CButton>
                    </td>
                  );
                },
                deleteAdmin: (item) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color={localStorage.getItem("id") === item.id ? "dark" : "danger"}
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          setDelAdmin(!delAdmin);
                          setAdminInfo({
                            id: item.id,
                            department: item.department,
                            name: item.name,
                            telephone: item.telephone,
                          });
                        }}
                        disabled={localStorage.getItem("id") === item.id ? true : false}
                      >
                        삭제
                      </CButton>
                    </td>
                  );
                },
              }}
            />

            {/* 비밀번호 변경 Modal */}
            <ModifyPassword
              show={modPassword}
              id={id}
              onCancelClick={() => {
                document.getElementById("password").value = "";
                document.getElementById("check_password").value = "";
                setModPassword(!modPassword);
                setPw({});
                setConfirmPw({});
              }}
              onClick={() => {
                modifyPassword(id, document.getElementById("password").value);
                document.getElementById("password").value = "";
                document.getElementById("check_password").value = "";
              }}
              onClose={() => {
                document.getElementById("password").value = "";
                document.getElementById("check_password").value = "";
                setModPassword(!modPassword);
                setPw({});
                setConfirmPw({});
              }}
              onPwChange={(e) => {
                onChange(e);
                EditPassword.checkPwd(document.getElementById("password").value, pw);
                if (document.getElementById("check_password").value !== "") {
                  EditPassword.confirmPwd(
                    document.getElementById("password").value,
                    document.getElementById("check_password").value,
                    confirmPw
                  );
                }
              }}
              onPwCheckChange={(e) => {
                onChange(e);
                EditPassword.confirmPwd(
                  document.getElementById("password").value,
                  document.getElementById("check_password").value,
                  confirmPw
                );
              }}
              pwColor={pw.color}
              confirmPwColor={confirmPw.color}
              pwText={pw.text}
              confirmPwText={confirmPw.text}
              pwStatus={pw.status}
              confirmPwStatus={confirmPw.status}
            />

            {/* Info Modal 구현 */}
            <InfoModal
              show={infoModal}
              color={infoModalObject.color}
              title={infoModalObject.title}
              body={infoModalObject.body}
              onClick={() => {
                setInfoModal(!infoModal);
              }}
              onClose={() => {
                setInfoModal(!infoModal);
              }}
            />

            {/* 회원 승인 Modal 구현 */}
            <CModal
              show={approve}
              color="success"
              closeOnBackdrop={false}
              centered
              onClose={() => {
                setApprove(!approve);
              }}
            >
              <CModalHeader>
                <CModalTitle>회원 승인</CModalTitle>
              </CModalHeader>
              <CModalBody className="text-left">
                {approveYn === "Y" ? "승인 하시겠습니까?" : "승인취소 하시겠습니까?"}
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setApprove(!approve);
                  }}
                >
                  취소
                </CButton>
                <CButton
                  color="success"
                  onClick={() => {
                    approveAdmin(id);
                    setApprove(!approve);
                  }}
                >
                  확인
                </CButton>
              </CModalFooter>
            </CModal>

            {/* 시스템 회원 삭제 Modal 구현 */}
            <CModal
              show={delAdmin}
              color="danger"
              closeOnBackdrop={false}
              centered
              onClose={() => {
                setDelAdmin(!delAdmin);
              }}
            >
              <CModalHeader>
                <CModalTitle>사용자 삭제</CModalTitle>
              </CModalHeader>
              <CModalBody className="text-left">
                <CForm className="form-horizontal">
                  <CFormGroup row>
                    <CCol md="3">아이디</CCol>
                    <CCol>
                      <CInput type="text" id="delete_id" defaultValue={adminInfo.id} disabled />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">부서</CCol>
                    <CCol>
                      <CInput type="text" id="delete_department" defaultValue={adminInfo.department} disabled />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">이름</CCol>
                    <CCol>
                      <CInput type="text" id="delete_name" defaultValue={adminInfo.name} disabled />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">전화번호</CCol>
                    <CCol>
                      <CInput type="text" id="delete_phone" defaultValue={adminInfo.telephone} disabled />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">삭제 사유</CCol>
                    <CCol>
                      <CInput type="text" id="delete_reason" maxLength="32" />
                    </CCol>
                  </CFormGroup>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setDelAdmin(!delAdmin);
                  }}
                >
                  취소
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => {
                    deleteAdmin(adminInfo.id, document.getElementById("delete_reason").value);
                  }}
                  disabled={false}
                >
                  확인
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default SysUsers;
