function setInterVal(){
  SetInterValCount++;
  getTopList();
  if (SetInterValCount % 2 == 0) {
    SetInterValCount = 0;
    sendMonitorData();
  }
  setTimeout(setInterVal,1000*30);
}