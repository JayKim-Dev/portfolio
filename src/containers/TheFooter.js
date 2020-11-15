import React from "react";
import { CFooter } from "@coreui/react";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <span>Copyright &copy; 2020 HYUNDAI TELECOM Co., Ltd.</span>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
