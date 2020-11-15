import React from "react";
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from "@coreui/react";
import CIcon from "@coreui/icons-react";

function TheHeaderDropdown() {
  return (
    <>
      <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar">
            <CIcon size="xl" name="cil-user" />
          </div>
        </CDropdownToggle>

        <CDropdownMenu className="m-0 pt-0" placement="bottom-end">
          <CDropdownItem header tag="div" color="light" className="text-center">
            <strong>계정</strong>
          </CDropdownItem>

          <CDropdownItem
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            <CIcon name="cil-user" className="mfe-2" />
            로그아웃
          </CDropdownItem>
          <CDropdownItem header tag="div" color="light" className="text-center">
            <strong>설정</strong>
          </CDropdownItem>
          <CDropdownItem to="/confirmuser">
            <CIcon name="cil-settings" className="mfe-2" />
            마이페이지
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  );
}

export default TheHeaderDropdown;
