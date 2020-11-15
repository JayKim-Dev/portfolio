import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CSubheader,
  CBreadcrumbRouter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import logo from "../assets/icons/logo2.png";

// routes config
import routes from "../routes";

import { TheHeaderDropdown } from "./index";

const TheHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow.sidebarShow);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow) ? false : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow) ? true : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  return (
    <CHeader withSubheader>
      <CToggler inHeader className="ml-md-3 d-lg-none" onClick={toggleSidebarMobile} />
      <CToggler inHeader className="ml-3 d-md-down-none" onClick={toggleSidebar} />
      <CHeaderBrand className="ml-auto d-lg-none" to="/">
        <CIcon src={logo} name="logo" width="89" height="25" alt="Logo" />
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto" />

      <CHeaderNav className="ml-auto">
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter className="border-0 c-subheader-nav m-0 px-0 px-md-3" routes={routes} />
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
