module.exports = {
  process: (container, camps, query, userData) => {
    return camps.filter(camp => camp.status == 0)
  }
}