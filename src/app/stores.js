import { createContext, useContext } from "react";
import CountryStore from "./views/Country/CountryStore";
import DepartmentStore from "./views/Department/DepartmentStore";

export const store = {
  countryStore: new CountryStore(),
  departmentStore: new DepartmentStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
