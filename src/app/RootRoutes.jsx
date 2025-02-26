import React from "react";
import { Redirect } from "react-router-dom";
import sessionRoutes from "./views/sessions/SessionRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
// import userRoutes from "./views/User/UserRoutes";
// import roleRoutes from "./views/Role/RoleRoutes";
import ConstantList from "./appConfig";
import countryRoutes from "./views/Country/CountryRoutes";
import departmentRoutes from "./views/Department/DepartmentRoutes";
import staffRoutes from "./views/Staff/StaffRoutes";
import projectRoutes from "./views/Project/ProjectRoutes";
import timeSheetRoutes from "./views/TimeSheet/TimeSheetRoutes";

const redirectRoute = [
  {
    path: ConstantList.ROOT_PATH,
    exact: true,
    component: () => <Redirect to={ConstantList.HOME_PAGE} />, //Luôn trỏ về HomePage được khai báo trong appConfig
  },
];

const errorRoute = [
  {
    component: () => <Redirect to={ConstantList.ROOT_PATH + "session/404"} />,
  },
];

const routes = [
  ...sessionRoutes,
  ...dashboardRoutes,
  ...redirectRoute,
  // ...userRoutes,
  // ...roleRoutes,
  ...countryRoutes,
  ...departmentRoutes,
  ...staffRoutes,
  ...projectRoutes,
  ...timeSheetRoutes,
  // ...errorRoute,
];

export default routes;
