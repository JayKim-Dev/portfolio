export default [
  {
    _tag: "CSidebarNavTitle",
    _children: ["홈"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "대시보드",
    to: "/",
    icon: "cil-speedometer",
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["입주민관리"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "입주민 회원 관리",
    to: "/users",
    icon: "cil-people",
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["통계정보"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "연간 사용자 정보",
    to: "/yearcharts",
    icon: "cil-chart-line",
  },
  {
    _tag: "CSidebarNavItem",
    name: "월간 사용자 정보",
    to: "/monthcharts",
    icon: "cil-chart-line",
  },
  {
    _tag: "CSidebarNavDivider",
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["시스템관리"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "시스템 회원 관리",
    to: "/sysusers",
    icon: "cil-people",
  },
];
