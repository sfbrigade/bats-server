
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

  // logic for tab status may be better as it's own class outside of admin info 
  export default class AdminInfo{

    constructor(){
        this.currentTab = this.currentTab || 'Dashboard';
        this.tabStatus = {
            usersTab: new tabData("Users", currentStatus.NOT_CURRENT),
            dashBoardTab: new tabData("Dashboard", currentStatus.CURRENT),
            ringDownTab: new tabData("Ringdowns", currentStatus.NOT_CURRENT)
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