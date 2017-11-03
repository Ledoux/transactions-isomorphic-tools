import values from 'lodash.values'

function getQuery (queryString) {
  const query = {}
  queryString.split('&')
    .forEach(item => {
      const chunks = item.split(':')
      if (chunks.length > 1) {
        query[chunks[0]] = chunks.slice(1).join(':')
      }
    })
  return query
}
