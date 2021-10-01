import TabData from './tabData';

const currentStatus = {
  CURRENT: 'CURRENT',
  NOT_CURRENT: 'NOT_CURRENT',
};

// logic for tab status may be better as it's own class outside of admin info
export default class AdminInfo {
  constructor() {
    this.currentTab = this.currentTab || '';
    this.tabStatus = {
      UsersTab: new TabData('Users', currentStatus.NOT_CURRENT),
      DashBoardTab: new TabData('Dashboard', currentStatus.CURRENT),
      RingDownTab: new TabData('Ringdowns', currentStatus.NOT_CURRENT),
    };
  }

  get Tab() {
    return this.currentTab;
  }

  set Tab(selectedTab) {
    this.currentTab = selectedTab;
  }

  setTabStatus() {
    Object.keys(this.tabStatus).forEach((tab) => {
      if (this.tabStatus[tab].name === this.Tab) {
        this.tabStatus[tab].currentStatus = currentStatus.CURRENT;
      } else {
        this.tabStatus[tab].currentStatus = currentStatus.NOT_CURRENT;
      }
    });
  }
}
