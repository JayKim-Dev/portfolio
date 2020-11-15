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
  CInput,
  CSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormGroup,
  CCardFooter,
  CForm,
  CFormText,
} from "@coreui/react";
import { properties } from "../../properties";
import SiteList from "../modal/SiteList";
import InfoModal from "../modal/InfoModal";
import * as EditPassword from "../../function/EditPassword";
import ModifyPassword from "../modal/ModifyPassword";

function Users() {
  // 회원 정보를 저장하는 배열 관리
  const [usersData, setUsersData] = useState([]);
  // SiteID 상태 관리
  const [siteId, setSiteId] = useState("");
  // 현장 이름 상태 관리
  const [siteName, setSiteName] = useState("");
  // 삭제 계정 상태 관리
  const [delAccount, setDelAccount] = useState({});
  // 회원 삭제 Modal 관리
  const [deleteAcc, setDeleteAcc] = useState(false);
  // 테스트 계정 Modal 관리
  const [testAccount, setTestAccount] = useState(false);
  // Info Modal 관리
  const [infoModal, setInfoModal] = useState(false);
  // info Modal 객체 관리
  const [infoModalObject, setInfoModalObject] = useState({});
  // 검색 조건 객체 관리
  const [requirement, setRequirement] = useState({ status: false });
  // 검색 조건에 따라, 계정 삭제 후 표시할 데이터 관리
  const [delClassify, setDelClassify] = useState();
  // 비밀번호 수정 Modal 관리
  const [modPassword, setModPassword] = useState(false);
  // 비밀번호 변경, 승인 계정 관리
  const [id, setId] = useState("");
  // 패스워드 복잡도 관리
  const [pw, setPw] = useState({});
  // 패스워드 확인 관리
  const [confirmPw, setConfirmPw] = useState({});
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

  // 회원 승인 여부를 Badge로 나타내기 위한 함수 정의
  const getBadge = (MEM_APPROVE_YN) => {
    switch (MEM_APPROVE_YN) {
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
    { key: "SITE_ID", label: "현장번호", _style: { width: "6rem" } },
    { key: "MEM_ID", label: "ID" },
    { key: "mem_name", label: "이름" },
    { key: "DONG", label: "동" },
    { key: "HO", label: "호" },
    { key: "mobile_no", label: "전화번호" },
    { key: "mem_email", label: "이메일" },
    {
      key: "MEM_APPROVE_YN",
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
      key: "deleteUser",
      label: "",
      sorter: false,
      filter: false,
      _style: { width: "5rem" },
    },
  ];

  // SiteList에서 전달받은 SiteID값이 바뀌면 아래 코드를 실행한다.
  useEffect(() => {
    if (siteId !== "") {
      const axios = require("axios");
      const usersDataUrl = `${properties.url}/user/dongho?siteId=${siteId}`;
      const token = localStorage.getItem("token").replace(/['"]+/g, "");

      axios
        .get(usersDataUrl, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setUsersData(res.data.data);
        })
        .catch((error) => {
          setInfoModalObject({
            color: "danger",
            title: "오류",
            body: error.response.data.resultMessage,
          });
          setUsersData([]);
          setInfoModal(!infoModal);
        });
    } else {
      setUsersData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  // SiteID 기준으로 입주민 회원 리스트 요청
  const userListSiteID = () => {
    const axios = require("axios");
    const usersDataUrl = `${properties.url}/user/dongho?siteId=${siteId}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .get(usersDataUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setUsersData(res.data.data);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  // ID 기준으로 입주민 회원 리스트 요청
  const userListMemberId = (memId) => {
    const axios = require("axios");
    const userIdUrl = `${properties.url}/user/dongho?siteId=${siteId}&memId=${memId}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .get(userIdUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setDelClassify("memId");
        setUsersData(res.data.data);
      })
      .catch((error) => {
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setInfoModal(!infoModal);
        setUsersData([]);
      });
  };

  // 이름 기준으로 입주민 회원 리스트 요청
  const userListMemberName = (memName) => {
    const axios = require("axios");
    const userIdUrl = `${properties.url}/user/dongho?siteId=${siteId}&memName=${memName}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .get(userIdUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setDelClassify("memName");
        setUsersData(res.data.data);
      })
      .catch((error) => {
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setInfoModal(!infoModal);
        setUsersData([]);
      });
  };

  // 비밀번호 변경 함수 정의
  const modifyPassword = (id, password) => {
    const axios = require("axios");
    const url = `${properties.url}/user/password/edit?id=${id}`;
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

  // 입주민 회원 삭제 함수 정의
  const deleteAccount = (id, siteID, dong, ho) => {
    const axios = require("axios");
    const accountUrl = `${properties.url}/user/delete?id=${id}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");
    axios
      .post(
        accountUrl,
        {},
        {
          headers: {
            Authorization: token,
          },
          data: {
            siteId: siteID,
            dong: dong,
            ho: ho,
          },
        }
      )
      .then((res) => {
        setDeleteAcc(!deleteAcc);
        setInfoModalObject({
          color: "danger",
          title: "사용자 삭제",
          body: res.data.resultMessage,
        });
        setInfoModal(!infoModal);
        if (siteId !== "") {
          userListSiteID(siteID);
        } else if (delClassify === "memId") {
          setUsersData([]);
        } else {
          userListMemberName(document.getElementById("select").value);
        }
      })
      .catch((error) => {
        setDeleteAcc(!deleteAcc);
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setInfoModal(!infoModal);
        userListSiteID(siteID);
      });
  };

  // 테스트 계정 생성 함수 정의
  const account = (id, password, name, siteId, dong, ho, telephone, email) => {
    const axios = require("axios");
    const accountUrl = `${properties.url}/user/register`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");
    axios
      .post(
        accountUrl,
        {},
        {
          headers: {
            Authorization: token,
          },
          data: {
            id: id,
            password: password,
            name: name,
            siteId: siteId,
            dong: dong,
            ho: ho,
            telephone: telephone,
            email: email,
          },
        }
      )
      .then((res) => {
        setTestAccount(!testAccount);
        userListSiteID(siteId);
        setInfoModalObject({
          color: "info",
          title: "테스트 계정 등록",
          body: res.data.resultMessage,
        });
        setInfoModal(!infoModal);
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response.status === 406) {
          setTestAccount(!testAccount);
          setInfoModalObject({
            color: "danger",
            title: "오류",
            body: error.response.data.resultMessage.name,
          });
          setInfoModal(!infoModal);
        } else {
          setTestAccount(!testAccount);
          setInfoModalObject({
            color: "danger",
            title: "오류",
            body: error.response.data.resultMessage,
          });
          setInfoModal(!infoModal);
        }
      });
  };

  // CoreUI에서는 json 형태가 flat하게 되어있어야 Table에 표시할 수 있다. 따라서 새로운 배열을 만들고, 서버에서 받은 json 형식을 flat하게 변경한다.
  const UsersRes = [];
  usersData.forEach((e) => {
    e.member_info
      ? UsersRes.push({
          SITE_ID: e.SITE_ID,
          MEM_ID: e.MEM_ID,
          mem_name: e.member_info.mem_name,
          DONG: e.DONG,
          HO: e.HO,
          mobile_no: e.member_info.mobile_no,
          mem_email: e.member_info.mem_email,
          MEM_APPROVE_YN: e.MEM_APPROVE_YN,
        })
      : UsersRes.push({
          SITE_ID: e.SITE_ID,
          MEM_ID: e.MEM_ID,
          mem_name: "데이터가 없습니다.",
          DONG: e.DONG,
          HO: e.HO,
          mobile_no: "데이터가 없습니다.",
          mem_email: "데이터가 없습니다.",
          MEM_APPROVE_YN: e.MEM_APPROVE_YN,
        });
  });

  // 글자수 Byte 변환 함수 구현
  const getByte = (str) => {
    return str
      .split("")
      .map((s) => s.charCodeAt(0))
      .reduce((prev, c) => prev + (c === 10 ? 2 : c >> 7 ? 2 : 1), 0);
  };

  // SiteList에서 전달받은 siteId, siteName을 나타내기 위한 함수 정의
  const getSiteId = (id) => {
    setSiteId(id);
  };

  const getSiteName = (name) => {
    setSiteName(name);
  };

  // 이름, ID로 검색 함수 정의
  const checkInput = () => {
    if (getByte(document.getElementById("select").value) >= 4) {
      if (document.getElementById("selectType").value === "name") {
        userListMemberName(document.getElementById("select").value);
      } else {
        userListMemberId(document.getElementById("select").value);
      }
    }
  };

  // 검색 조건 만족 시, status를 true로 변경하여, 검색 버튼 활성화
  const InputVerify = () => {
    if (getByte(document.getElementById("select").value) >= 4) {
      setRequirement({
        color: "",
        body: "",
        status: true,
      });
    } else {
      setRequirement({
        color: "danger",
        body: "검색어를 2자 이상 입력하세요.",
        status: false,
      });
    }
  };

  const testAccountReset = () => {
    document.getElementById("test_id").value = "";
    document.getElementById("test_pw").value = "";
    document.getElementById("test_name").value = "";
    document.getElementById("test_dong").value = "";
    document.getElementById("test_ho").value = "";
    document.getElementById("test_email").value = "";
    document.getElementById("test_phone").value = "";
  };

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>입주민</CCardHeader>
          <CCardBody>
            <CFormGroup row>
              <CCol xs="9" md="3" xl="3">
                <CInput placeholder="현장명" id="siteName" defaultValue={siteName} disabled />
              </CCol>
              <CCol xs="3" md="2" xl="1">
                <CInput placeholder="현장번호" id="siteId" defaultValue={siteId} disabled />
              </CCol>
              <SiteList getSiteId={getSiteId} getSiteName={getSiteName} />
            </CFormGroup>
            <CFormGroup row>
              <CCol xs="4" md="2" xl="1">
                <CSelect custom name="team" id="selectType">
                  <option value="name">이름</option>
                  <option value="id">아이디</option>
                </CSelect>
              </CCol>
              <CCol xs="5" md="3" xl="3">
                <CInput
                  id="select"
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.key === "NumpadEnter") {
                      checkInput();
                    }
                  }}
                  onChange={() => {
                    InputVerify();
                  }}
                />
                <CFormText id="requirement" className="help-block" color={requirement.color}>
                  {requirement.body}
                </CFormText>
              </CCol>
              <CCol xs="3" md="2" xl="1">
                <CButton
                  color="info"
                  block
                  onClick={() => {
                    checkInput();
                  }}
                  disabled={!requirement.status}
                >
                  검색
                </CButton>
              </CCol>
            </CFormGroup>
            <CDataTable
              items={UsersRes}
              fields={fields}
              columnFilter
              itemsPerPage={20}
              hover
              sorter
              pagination={{
                align: "center",
              }}
              scopedSlots={{
                MEM_APPROVE_YN: (item) => (
                  <td>
                    <CBadge color={getBadge(item.MEM_APPROVE_YN)}>{item.MEM_APPROVE_YN}</CBadge>
                  </td>
                ),
                modPassword: (item) => {
                  return item.mem_name !== "데이터가 없습니다." ? (
                    <td className="py-2">
                      <CButton
                        color="info"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          setId(item.MEM_ID);
                          setModPassword(!modPassword);
                        }}
                      >
                        비밀번호 변경
                      </CButton>
                    </td>
                  ) : (
                    <td className="py-2">
                      <CButton color="dark" variant="outline" shape="square" size="sm" disabled>
                        비밀번호 변경
                      </CButton>
                    </td>
                  );
                },
                deleteUser: (item) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          setDelAccount({
                            id: item.MEM_ID,
                            siteId: item.SITE_ID,
                            dong: item.DONG,
                            ho: item.HO,
                          });
                          setDeleteAcc(!deleteAcc);
                        }}
                      >
                        삭제
                      </CButton>
                    </td>
                  );
                },
              }}
            />
          </CCardBody>
          <CCardFooter className="text-right">
            <CButton
              color="info"
              onClick={() => setTestAccount(!testAccount)}
              disabled={siteName !== "" && siteId !== "" ? false : true}
            >
              테스트 계정 등록
            </CButton>
          </CCardFooter>

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

          {/* 입주민 회원 삭제 Modal 구현 */}
          <CModal
            show={deleteAcc}
            color="danger"
            closeOnBackdrop={false}
            centered
            onClose={() => setDeleteAcc(!deleteAcc)}
          >
            <CModalHeader>
              <CModalTitle>사용자 삭제</CModalTitle>
            </CModalHeader>
            <CModalBody className="text-left">{delAccount.id} 계정을 삭제하시겠습니까?</CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setDeleteAcc(!deleteAcc);
                }}
              >
                취소
              </CButton>
              <CButton
                color="danger"
                onClick={() => {
                  deleteAccount(delAccount.id, delAccount.siteId, delAccount.dong, delAccount.ho);
                }}
              >
                확인
              </CButton>
            </CModalFooter>
          </CModal>

          {/* 테스트 계정 등록 Modal */}
          <CModal
            show={testAccount}
            color="info"
            closeOnBackdrop={false}
            centered
            onClose={() => {
              setTestAccount(!testAccount);
              testAccountReset();
            }}
          >
            <CModalHeader>테스트 계정 등록</CModalHeader>
            <CModalBody>
              <CForm className="form-horizontal">
                <CFormGroup row>
                  <CCol md="3">현장번호</CCol>
                  <CCol>
                    <CInput type="text" id="test_site_id" value={siteId} disabled />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">현장명</CCol>
                  <CCol>
                    <CInput type="text" id="test_site_name" value={siteName} disabled />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">동/호</CCol>
                  <CCol>
                    <CInput
                      type="text"
                      id="test_dong"
                      onKeyUp={() => {
                        let dong = document.getElementById("test_dong");
                        let ho = document.getElementById("test_ho");
                        let id = document.getElementById("test_id");
                        let pw = document.getElementById("test_pw");
                        let email = document.getElementById("test_email");
                        id.value = `${siteId}ht${dong.value}${ho.value}`;
                        pw.value = `${siteId}Ht${dong.value}${ho.value}!`;
                        email.value = `${id.value}@hthomeservice.com`;
                      }}
                    />
                  </CCol>
                  <CCol>
                    <CInput
                      type="text"
                      id="test_ho"
                      onKeyUp={() => {
                        let dong = document.getElementById("test_dong");
                        let ho = document.getElementById("test_ho");
                        let id = document.getElementById("test_id");
                        let pw = document.getElementById("test_pw");
                        let email = document.getElementById("test_email");
                        id.value = `${siteId}ht${dong.value}${ho.value}`;
                        pw.value = `${siteId}Ht${dong.value}${ho.value}!`;
                        email.value = `${id.value}@test.com`;
                      }}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">아이디</CCol>
                  <CCol>
                    <CInput type="text" id="test_id" disabled />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">비밀번호</CCol>
                  <CCol>
                    <CInput type="text" id="test_pw" disabled />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">이름</CCol>
                  <CCol>
                    <CInput type="text" id="test_name" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">이메일</CCol>
                  <CCol>
                    <CInput type="text" id="test_email" disabled />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">전화번호</CCol>
                  <CCol>
                    <CInput
                      type="text"
                      id="test_phone"
                      maxLength="13"
                      onKeyUp={() => {
                        const telephone = document
                          .getElementById("test_phone")
                          .value.replace(/[^0-9]/g, "")
                          .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
                          .replace("--", "-");
                        document.getElementById("test_phone").value = telephone;
                      }}
                    />
                  </CCol>
                </CFormGroup>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setTestAccount(!testAccount);
                  testAccountReset();
                }}
              >
                취소
              </CButton>
              <CButton
                color="info"
                onClick={() => {
                  account(
                    document.getElementById("test_id").value,
                    document.getElementById("test_pw").value,
                    document.getElementById("test_name").value,
                    parseInt(document.getElementById("test_site_id").value),
                    document.getElementById("test_dong").value,
                    document.getElementById("test_ho").value,
                    document.getElementById("test_phone").value,
                    document.getElementById("test_email").value
                  );
                  testAccountReset();
                }}
              >
                등록
              </CButton>
            </CModalFooter>
          </CModal>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default Users;
