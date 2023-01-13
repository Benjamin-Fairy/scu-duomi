const getIndex = (list, sid) => {
  let index1 = 0;
  let index2 = 0;
  console.log(sid)
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i].length; j++) {
      if (list[i][j].sid == sid || list[i][j].cid == sid) {
        index1 = i;
        index2 = j;
        break
      }
    }
  }
  return [index1, index2]
}

const isInList = (list, id) => {
  if (!list) return -1
  for (let i = 0; i < list.length; i++) {
    if (list[i].sid == id) {
      return i;
    }
  }
  return -1;
}

module.exports = {
  getIndex,
  isInList
}