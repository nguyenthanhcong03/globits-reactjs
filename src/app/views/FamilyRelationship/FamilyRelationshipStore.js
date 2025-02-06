import { makeAutoObservable, runInAction } from "mobx";
import { pagingFamilyRelationship } from "./FamilyRelationshipService";

export default class FamilyRelationshipStore {
  familyList = [];
  pageIndex = 0;
  pageSize = 10;
  keyword = "";

  constructor() {
    makeAutoObservable(this);
  }

  fetchFamilyRelationships = async () => {
    this.loading = true;
    let searchObject = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      keyword: this.keyword,
    };
    try {
      const response = await pagingFamilyRelationship(searchObject);
      runInAction(() => {
        this.familyList = response?.data?.content || [];
      });
      console.log("this.familyList", this.familyList);
    } catch (error) {
      console.error("Failed to fetch family", error);
      this.loading = false;
    }
  };

  resetStore = () => {
    this.familyList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.keyword = "";
  };
}
