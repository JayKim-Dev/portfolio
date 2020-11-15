import React, { forwardRef, useEffect, useState } from "react";
import { CCard, CCardBody, CCardHeader, CButton, CDataTable, CCol, CFormGroup, CInput, CRow } from "@coreui/react";
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

function MonthCharts() {
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
  // 월간 통계 정보 배열 관리
  const [monthInfo, setMonthInfo] = useState([]);

  const getSiteId = (id) => {
    setSiteId(id);
  };

  const getSiteName = (name) => {
    setSiteName(name);
  };

  // 선택된 연도를 year로 정의
  const year = startDate.getFullYear();
  // 선택된 월을 month로 정의(getMonth 시 0 ~ 11로 리턴되기 때문에 +1을 한다.)
  const month = startDate.getMonth() + 1;
  // 월별 마지막 일자 정의
  const lastDay = new Date(year, month, 0).getDate();

  // 월간 데이터 요청
  useEffect(() => {
    const axios = require("axios");
    const monthChartUrl = `${properties.url}/statistic/month/day?yearId=${year}&monthId=${month}&siteId=${siteId}`;
    const token = localStorage.getItem("token").replace(/['"]+/g, "");

    axios
      .get(monthChartUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setMonthInfo(res.data.data);
      })
      .catch((error) => {
        setMonthInfo([]);
        setInfoModalObject({
          color: "danger",
          title: "오류",
          body: error.response.data.resultMessage,
        });
        setInfoModal(!infoModal);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, siteId]);

  const ref = React.createRef();
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <CButton onClick={onClick} color="info" innerRef={ref}>
      {value}
    </CButton>
  ));

  // 테이블에 표시할 컬럼을 정의
  const fields = [{ key: "platform", label: "PlatForm" }];
  // 차트에 표시할 월별 일자를 정의하기 위해 배열 생성
  const day = [];
  // 월 별 일자 만큼 컬럼을 정의
  for (let i = 1; i <= lastDay; i++) {
    fields.push({ key: `${year}_${month}_${i}`, label: `${month}/${i}`, filter: false });
    day.push(`${month}/${i}`);
  }

  let monthStatistic = [];
  const dataByClient = [];

  if (monthInfo.length > 0) {
    // 응답받은 데이터에서 client_id를 monthStatistic 배열에 객체 형태로 push
    monthInfo.forEach((e) => {
      monthStatistic.push({ client_id: e.client_id });
    });

    // 중복되는 client_id가 있는 지 확인 후 중복 제거
    monthStatistic = monthStatistic.filter((client, index) => {
      const client_id = JSON.stringify(client);
      return (
        index ===
        monthStatistic.findIndex((obj) => {
          return JSON.stringify(obj) === client_id;
        })
      );
    });

    // 모든 데이터를 0으로 채우고, day에 따라 해당 위치에 total값을 splice
    for (let i = 0; i < monthStatistic.length; i++) {
      dataByClient[i] = [];
      for (let j = 0; j < lastDay; j++) {
        dataByClient[i].push(0);
      }
      const statisticsByClient = monthInfo.filter((data) => data.client_id === monthStatistic[i].client_id);
      for (let j = 0; j < lastDay; j++) {
        if (statisticsByClient[j]) {
          const getDate = statisticsByClient[j].date;
          const dateSplit = getDate.split("-");
          const dateFormat = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]);
          dataByClient[i].splice(dateFormat.getDate() - 1, 1, parseInt(statisticsByClient[j].total));
        }
      }
      monthStatistic[i]["data"] = dataByClient[i];
    }
  }

  // 테이블에 표시할 데이터를 monthData 배열에 Push
  const monthData = [];
  monthStatistic.forEach((e) => {
    monthData.push({
      platform: e.client_id,
    });
  });

  // 일 별 플랫폼 가입자 데이터를 monthData에 Push
  for (let i = 0; i < monthStatistic.length; i++) {
    for (let j = 0; j < lastDay; j++) {
      monthData[i][`${year}_${month}_${j + 1}`] = monthStatistic[i].data[j];
    }
  }

  // 차트에 표시할 데이터를 monthChartData 배열에 Push
  const monthChartData = [];
  for (let i = 0; i < monthStatistic.length; i++) {
    monthChartData.push({
      label: monthStatistic[i].client_id,
      data: monthStatistic[i].data,
      fill: false,
      lineTension: 0,
    });
  }

  // 플랫폼 별 그래프 색상 적용
  for (let i = 0; i < monthStatistic.length; i++) {
    const setColor = chartColor.find((color) => color.label === monthChartData[i].label);
    monthChartData[i].borderColor = setColor.borderColor;
    monthChartData[i].backgroundColor = setColor.backgroundColor;
  }

  // 월간 데이터 엑셀 다운로드 함수 정의
  const download = () => {
    const ws = XLSX.utils.json_to_sheet(monthData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "월간 사용자 정보");
    XLSX.writeFile(wb, "month info.xlsx");
  };

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>월간 사용자 정보</CCardHeader>
          <CCardBody>
            <CFormGroup row>
              <CCol xs="3" md="3">
                <CInput placeholder="현장명" id="siteName" defaultValue={siteName} disabled />
              </CCol>
              <CCol xs="2" md="1">
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
                dateFormat="yyyy년 MM월"
                showMonthYearPicker
                customInput={<CustomInput ref={ref} />}
                popperModifiers={{
                  preventOverflow: { enabled: true },
                }}
                popperPlacement="auto"
                minDate={new Date(2020, 9, 1)}
              />
            </CFormGroup>

            <CChartLine
              type="line"
              datasets={monthChartData}
              options={{
                tooltips: {
                  enabled: true,
                },
                maintainAspectRatio: false,
              }}
              labels={day}
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
                  월간 정보 다운로드
                </CButton>
              </CCol>
            </CFormGroup>
            <CDataTable items={monthData} fields={fields} />

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

export default React.memo(MonthCharts);
