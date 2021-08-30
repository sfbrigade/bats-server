
class tabData {
    constructor(tabName, currentStatus) {
      this.name = tabName;
      this.currentStatus = currentStatus;
    }
  }

  const currentStatus = {
    CURRENT: 'CURRENT',
    NOT_CURRENT: 'NOT_CURRENT'
  };

  export default class AdminInfo{

    constructor(){
        this.currentTab = this.currentTab || '';
        this.tabStatus = {
            usersTab: new tabData("Users", currentStatus.NOT_CURRENT),
            organizationTab: new tabData("Organizations", currentStatus.NOT_CURRENT),
            addUserTab: new tabData("Add User", currentStatus.NOT_CURRENT)
        }
    }


    get Tab(){
      return this.currentTab;
    }

    set Tab(selectedTab){
      this.currentTab = selectedTab;
    }

    setTabStatus(){
      for(const tab in this.tabStatus){
        if (this.tabStatus[tab].name === this.Tab){
          this.tabStatus[tab].currentStatus = currentStatus.CURRENT;
        } else {
          this.tabStatus[tab].currentStatus = currentStatus.NOT_CURRENT;
        }
      }
    }


  }