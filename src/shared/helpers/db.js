

export class MockDB {
  constructor(){
    // this.historyStrategies will be an array of names of all saved strategies
    this.symbols = ['TCS', 'INFY'];
    if (!window.localStorage.getItem('historyStrategies')) {
      window.localStorage.setItem('historyStrategies', '[]');
      this.historyStrategies = [];
    } else {
      this.historyStrategies = window.localStorage.getItem('historyStrategies') ? JSON.parse(window.localStorage.getItem('historyStrategies')) : [];
    }
  }
  
  sync(){
    this.historyStrategies = window.localStorage.getItem('historyStrategies') ? JSON.parse(window.localStorage.getItem('historyStrategies')) : [];  
  }
  
  insert(savedStrategyName){
    this.historyStrategies.push(savedStrategyName); 
    window.localStorage.setItem('historyStrategies',  this.historyStrategies ? JSON.stringify(this.historyStrategies) : '[]');  
  }
  
  get(key){
    return JSON.parse(window.localStorage.getItem(key)) || {
      payoffDate: '2021-09-09'
    };
  }
  
  set(key, val){
    if(key && val){
      window.localStorage.setItem(key, JSON.stringify(val));
      this.insert(key);
      return true;
    }
    return false;
  }
  
  remove(key){
    window.localStorage.removeItem(key);
  }
  
}
  