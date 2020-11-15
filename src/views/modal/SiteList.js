import React, { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormGroup,
  CCol,
  CSelect,
  CInput,
  CButton,
  CDataTable,
  CModalFooter,
  CFormText,
} from "@coreui/react";
import { properties } from "../../properties";
import InfoModal from "./InfoModal";

function SiteList(props) {
  const [siteSelect, setSiteSelect] = useState(false);
  const [siteList, setSiteList] = useState([]);
  //현장명으로 검색 시, 현장 이름을 관리
  const [siteName, setSiteName] = useState("");
  //SiteID의 초기값을 공백으로 지정
  const [siteId, setSiteId] = useState("");
  // Info Modal 관리
  const [infoModal, setInfoModal] = useState(false);
  // info Modal 객체 관리
  const [infoModalObject, setInfoModalObject] = useState({});
  // 검색 조건 객체 관리
  const [requirement, setRequirement] = useState({ status: false });

  // SiteName 기준으로 현장 리스트 요청
  const siteListSiteName = (siteName) => {
    const axios = require("axios");
    const siteNameUrl = `${properties.url}/site?sitename=${siteName}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .get(siteNameUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.data.length > 0) {
          setSiteList(res.data.data);
        } else {
          setInfoModalObject({ color: "danger", title: "오류", body: "검색 결과가 없습니다." });
          setSiteSelect(!siteSelect);
          document.getElementById("search").value = "";
          setInfoModal(!infoModal);
          setSiteList([]);
        }
      })
      .catch((error) => {
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setSiteSelect(!siteSelect);
        document.getElementById("search").value = "";
        setInfoModal(!infoModal);
        setSiteList([]);
      });
  };

  // SiteId 기준으로 현장 리스트 요청
  const siteListSiteId = (siteIdList) => {
    const axios = require("axios");
    const siteIdUrl = `${properties.url}/site?siteId=${siteIdList}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .get(siteIdUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setSiteList([res.data.data]);
      })
      .catch((error) => {
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setSiteSelect(!siteSelect);
        document.getElementById("search").value = "";
        setInfoModal(!infoModal);
        setSiteList([]);
      });
  };

  // 현장명, 현장 ID로 검색 함수 정의
  const checkInput = () => {
    if (document.getElementById("search_type").value === "siteName") {
      if (getByte(document.getElementById("search").value) >= 4) {
        siteListSiteName(document.getElementById("search").value);
      }
    } else {
      if (getByte(document.getElementById("search").value) >= 1) {
        siteListSiteId(document.getElementById("search").value);
      }
    }
  };

  const siteNameRes = [];
  siteList.forEach((e) => {
    siteNameRes.push({
      SITE_ID: e.SITE_ID,
      SITE_NAME: e.SITE_NAME,
    });
  });

  // 글자수 Byte 변환 함수 구현
  const getByte = (str) => {
    return str
      .split("")
      .map((s) => s.charCodeAt(0))
      .reduce((prev, c) => prev + (c === 10 ? 2 : c >> 7 ? 2 : 1), 0);
  };

  useEffect(() => {
    props.getSiteId(siteId);
    props.getSiteName(siteName);
  }, [siteId, siteName, props]);

  // 검색 조건 만족 시, status를 true로 변경하여, 검색 버튼 활성화
  const InputVerify = () => {
    if (document.getElementById("search_type").value === "siteName") {
      if (getByte(document.getElementById("search").value) >= 4) {
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
    } else {
      if (getByte(document.getElementById("search").value) >= 1) {
        setRequirement({
          color: "",
          body: "",
          status: true,
        });
      } else {
        setRequirement({
          color: "danger",
          body: "숫자 1자 이상 입력하세요.",
          status: false,
        });
      }
    }
  };

  return (
    <>
      <CCol xs="3" md="2" xl="1">
        <CButton
          color="info"
          block
          onClick={() => {
            setSiteSelect(!siteSelect);
            InputVerify();
          }}
        >
          단지선택
        </CButton>
      </CCol>
      <CCol xs="5" md="3" xl="2">
        <CButton
          color="info"
          onClick={() => {
            setSiteId("");
            setSiteName("");
            setSiteList([]);
          }}
        >
          단지선택 초기화
        </CButton>
      </CCol>

      {/* 단지 선택 Modal 구현 */}
      <CModal
        show={siteSelect}
        color="info"
        closeOnBackdrop={false}
        centered
        onClose={() => {
          document.getElementById("search").value = "";
          setSiteList([]);
          setSiteSelect(!siteSelect);
        }}
      >
        <CModalHeader>
          <CModalTitle>단지 선택</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-left">
          <CFormGroup row>
            <CCol xs="4" md="4" xl="4">
              <CSelect
                custom
                name="team"
                id="search_type"
                onChange={() => {
                  InputVerify();
                }}
              >
                <option value="siteName">현장명</option>
                <option value="siteId">현장번호</option>
              </CSelect>
            </CCol>
            <CCol xs="6" md="6" xl="6">
              <CInput
                id="search"
                maxLength="10"
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
            <CButton
              className="h-50"
              color="info"
              onClick={() => {
                checkInput();
              }}
              disabled={!requirement.status}
            >
              검색
            </CButton>
          </CFormGroup>
          <CDataTable
            items={siteList}
            fields={[
              { key: "SITE_ID", label: "SITE ID" },
              {
                key: "SITE_NAME",
                label: "현장명",
                _style: { width: "23rem" },
              },
            ]}
            hover
            itemsPerPage={5}
            pagination={{
              align: "center",
            }}
            clickableRows
            onRowClick={(item) => {
              setSiteId(item.SITE_ID);
              setSiteName(item.SITE_NAME);
              document.getElementById("search").value = "";
              setSiteList([]);
              setSiteSelect(!siteSelect);
            }}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              document.getElementById("search").value = "";
              setSiteList([]);
              setSiteSelect(!siteSelect);
            }}
          >
            닫기
          </CButton>
        </CModalFooter>
      </CModal>

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
    </>
  );
}

export default SiteList;
