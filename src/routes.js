import React from "react";

const Home = React.lazy(() => import("./views/Home/Home"));
const MonthCharts = React.lazy(() => import("./views/charts/monthCharts"));
const YearCharts = React.lazy(() => import("./views/charts/yearCharts"));
const Users = React.lazy(() => import("./views/users/Users"));
const SysUsers = React.lazy(() => import("./views/users/SysUsers"));
const ConfirmUser = React.lazy(() => import("./views/pages/adminuser/Confirmuser"));

const routes = [
  { path: "/", exact: true, name: "Home", component: Home },
  { path: "/monthcharts", name: "Month Charts", component: MonthCharts },
  { path: "/yearcharts", name: "Year Charts", component: YearCharts },
  { path: "/users", exact: true, name: "Users", component: Users },
  { path: "/sysusers", exact: true, name: "System Users", component: SysUsers },
  { path: "/confirmuser", name: "Confirmuser", component: ConfirmUser }, 
];

export default routes;
