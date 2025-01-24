import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";

const StaffIndex = EgretLoadable({
  loader: () => import("./StaffIndex"),
});
const ViewComponent = StaffIndex;

const Routes = [
  {
    path: ConstantList.ROOT_PATH + "category/staff",
    exact: true,
    component: ViewComponent,
  },
];

export default Routes;
