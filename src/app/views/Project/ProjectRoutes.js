import {EgretLoadable} from "egret";
import ConstantList from "../../appConfig";

const ProjectIndex = EgretLoadable({
    loader: () => import("./ProjectIndex"),
});
const ViewComponent = ProjectIndex;

const Routes = [
    {
        path: ConstantList.ROOT_PATH + "category/project",
        exact: true,
        component: ViewComponent,
    },
];

export default Routes;
