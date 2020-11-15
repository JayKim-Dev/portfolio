import React, { forwardRef, useEffect, useState } from "react";
import { CCard, CCardBody, CCardHeader, CButton, CDataTable, CCol, CFormGroup, CRow, CInput } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import SiteList from "../modal/SiteList";
import XLSX from "xlsx";
import DatePicker, { registerLocale } from "react-datepicker";
import "./react-datepicker.css";
import ko from "date-fns/locale/ko";
import chartColor from "./chartColor";
import { properties } from "../../properties";
import InfoModal from "../modal/InfoModal";

registerLocale("ko", ko);

function YearCharts() {
  // 오늘 날짜를 StartDate로 초기화
  const [startDate, setStartDate] = useState(new Date());
  // SiteID 상태 관리
  const [siteId, setSiteId] = useState("");
  // 현장 이름 상태 관리
  const [siteName, setSiteName] = useState("");
  // Info Modal 관리
  const [infoModal, setInfoModal] = useState(false);
  // info Modal 객체 관리
  const [infoModalObject, setInfoModalObject] = useState({});
  // 연간 통계 정보 배열 관리
  const [yearInfo, setYearInfo] = useState([]);

  const getSiteId = (id) => {
    setSiteId(id);
  };

  const getSiteName = (name) => {
    setSiteName(name);
  };

  // 선택된 연도를 year로 정의
  const year = startDate.getFullYear();

  // 연간 통계 데이터 요청
  useEffect(() => {
    const getYearData = async () => {
      const axios = require("axios");
      const yearChartUrl = `${properties.url}/statistic/year/day?yearId=${year}&siteId=${siteId}`;
      const token = localStorage.getItem("token").replace(/['"]+/g, "");

      await axios
        .get(yearChartUrl, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setYearInfo(res.data.data);
        })
        .catch((error) => {
          setYearInfo([]);
          setInfoModalObject({
            color: "danger",
            title: "오류",
            body: error.response.data.resultMessage,
          });
          setInfoModal(!infoModal);
        });
    };
    getYearData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, siteId]);

  // date-picker를 버튼으로 표현하기 위한 함수 정의
  const ref = React.createRef();
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <CButton onClick={onClick} color="info" innerRef={ref}>
      {value}
    </CButton>
  ));

  // 테이블에 표시할 컬럼을 정의
  const fields = [
    {
      key: "platform",
      label: "PlatForm",
      _style: { width: "18rem" },
    },
  ];
  for (let i = 0; i < 12; i++) {
    fields.push({
      key: `${year}_${i + 1}`,
      label: `${i + 1}월`,
    });
  }

  let yearStatistic = [];
  const dataByClient = [];

  if (yearInfo.length > 0) {
    // 응답받은 데이터에서 client_id를 yearStatistic 배열에 객체 형태로 push
    yearInfo.forEach((e) => {
      yearStatistic.push({ client_id: e.client_id });
    });

    // 중복되는 client_id가 있는 지 확인 후 중복 제거
    yearStatistic = yearStatistic.filter((client, index) => {
      const client_id = JSON.stringify(client);
      return (
        index ===
        yearStatistic.findIndex((obj) => {
          return JSON.stringify(obj) === client_id;
        })
      );
    });

    // 모든 데이터를 0으로 채우고, month에 따라 해당 위치에 total값을 splice
    for (let i = 0; i < yearStatistic.length; i++) {
      dataByClient[i] = [];
      for (let j = 0; j < 12; j++) {
        dataByClient[i].push(0);
      }
      const statisticsByClient = yearInfo.filter((data) => data.client_id === yearStatistic[i].client_id);
      for (let j = 0; j < 12; j++) {
        if (statisticsByClient[j]) {
          dataByClient[i].splice(statisticsByClient[j].month - 1, 1, parseInt(statisticsByClient[j].total));
        }
      }
      yearStatistic[i]["data"] = dataByClient[i];
    }
  }

  // 테이블에 표시할 데이터를 yearTableData 배열에 Push
  const yearTableData = [];
  yearStatistic.forEach((e) => {
    yearTableData.push({
      platform: e.client_id,
      [`${year}_1`]: e.data[0],
      [`${year}_2`]: e.data[1],
      [`${year}_3`]: e.data[2],
      [`${year}_4`]: e.data[3],
      [`${year}_5`]: e.data[4],
      [`${year}_6`]: e.data[5],
      [`${year}_7`]: e.data[6],
      [`${year}_8`]: e.data[7],
      [`${year}_9`]: e.data[8],
      [`${year}_10`]: e.data[9],
      [`${year}_11`]: e.data[10],
      [`${year}_12`]: e.data[11],
    });
  });

  // 차트에 표시할 데이터를 yearChartData 배열에 Push
  const yearChartData = [];
  for (let i = 0; i < yearStatistic.length; i++) {
    yearChartData.push({
      label: yearStatistic[i].client_id,
      data: yearStatistic[i].data,
      fill: false,
      lineTension: 0,
    });
  }

  // 플랫폼 별 그래프 색상 적용
  for (let i = 0; i < yearStatistic.length; i++) {
    const setColor = chartColor.find((color) => color.label === yearChartData[i].label);
    yearChartData[i].borderColor = setColor.borderColor;
    yearChartData[i].backgroundColor = setColor.backgroundColor;
  }

  // 연간 데이터 엑셀 다운로드 함수 정의
  const download = () => {
    const ws = XLSX.utils.json_to_sheet(yearTableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "연간 사용자 정보");
    XLSX.writeFile(wb, "year info.xlsx");
  };

  const month = [];
  for (let i = 0; i < 12; i++) {
    month.push(`${i + 1}월`);
  }

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>연간 사용자 정보</CCardHeader>
          <CCardBody>
            <CFormGroup row>
              <CCol xs="3" md="3" xl="3">
                <CInput placeholder="현장명" id="siteName" defaultValue={siteName} disabled />
              </CCol>
              <CCol xs="2" md="1" xl="1">
                <CInput placeholder="현장번호" id="siteId" defaultValue={siteId} disabled />
              </CCol>
              <SiteList getSiteId={getSiteId} getSiteName={getSiteName} />
            </CFormGroup>

            <CFormGroup className="row justify-content-md-center">
              <DatePicker
                className="react-datepicker__navigation"
                locale="ko"
                selected={startDate}
                onChange={setStartDate}
                showYearPicker
                dateFormat="yyyy년"
                customInput={<CustomInput ref={ref} />}
                popperModifiers={{
                  preventOverflow: { enabled: true },
                }}
                popperPlacement="auto"
                yearItemNumber={9}
                minDate={new Date(2019, 1, 1)}
              />
            </CFormGroup>

            <CChartLine
              type="line"
              datasets={yearChartData}
              options={{
                tooltips: {
                  enabled: true,
                },
                maintainAspectRatio: false,
              }}
              labels={month}
              style={{ height: "30rem" }}
            />

            <CFormGroup className="text-right">
              <CCol>
                <CButton
                  color="info"
                  onClick={() => {
                    download();
                  }}
                >
                  연간 정보 다운로드
                </CButton>
              </CCol>
            </CFormGroup>
            <CDataTable items={yearTableData} fields={fields} />

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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default YearCharts;
