export default function objToArray(data) {
  const result = []
  const keys = Object.keys(data)
  keys.forEach(function(key) {
    result.push(data[key])
  })
  return result
}
