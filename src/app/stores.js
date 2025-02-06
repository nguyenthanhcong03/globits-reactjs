import { createContext, useContext } from "react";
import CountryStore from "./views/Country/CountryStore";
import DepartmentStore from "./views/Department/DepartmentStore";
import StaffStore from "./views/Staff/StaffStore";
import EthnicsStore from "./views/Ethnics/EthnicsStore";
import ReligionStore from "./views/Religion/ReligionStore";
import ProjectStore from "./views/Project/ProjectStore";
import TimeSheetStore from "./views/TimeSheet/TimeSheetStore";
import FamilyRelationshipStore from "./views/FamilyRelationship/FamilyRelationshipStore";

export const store = {
  countryStore: new CountryStore(),
  departmentStore: new DepartmentStore(),
  familyRelationshipStore: new FamilyRelationshipStore(),
  staffStore: new StaffStore(),
  ethnicsStore: new EthnicsStore(),
  religionStore: new ReligionStore(),
  projectStore: new ProjectStore(),
  timeSheetStore: new TimeSheetStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
