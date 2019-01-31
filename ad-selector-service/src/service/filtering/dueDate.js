module.exports = {
  process: (container, camps, query, userData) => {
    return camps.filter(camp => {
      if(camp.startDate && camp.startDate >= Date.now()) return false; 
      if(camp.endDate && camp.endDate <= Date.now()) return false;
      return true
    })
  }
}