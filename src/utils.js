export const mapGet = (keys, objects) => {
  const mapObject = {}
  keys.forEach(key => {
    let value
    for (let object of objects) {
      value = object[key]
      if (value) {
        break
      }
    }
    mapObject[key] = value
  })
  return mapObject
}
