const apiData = require('./api_data')
const fs = require('fs')


function formatForm(data) {
  const items =
    (data.parameter && data.parameter.fields && data.parameter.fields.Parameter) || []
  const required = items.filter(_ => _.optional).map(_ => _.field)
  const properties = {}

  items.forEach(_ => {
    properties[_.field] = {
      description: _.description,
      type: _.type,
      mock: {
        mock: '@string'
      }
    }
  })

  const nData = {
    required,
    properties
  }

  return JSON.stringify(nData)
}

fomatResBody(data) {
  const items = JSON.parse(item.success && item.success.examples && item.success.examples.length && item.success.examples[0].content || [])
 
  const properties = {}
  items.forEach(_ => {
    properties[_.]
    return {

    }
  })
}

const data = []
const nData = []
const groups = new Set()

apiData.forEach(item => {
  groups.add(item.groupTitle)
  const _item = {
    groupTitle: item.groupTitle,
    query_path: {
      path: item.url,
      params: []
    },
    status: 'done',
    type: 'static',
    req_body_is_json_schema: true,
    res_body_is_json_schema: true,
    api_opened: false,
    method: item.type,
    title: item.title,
    path: `/${item.url}`,
    project_id: 11,
    req_params: [],
    res_body_type: 'json',
    uid: 11,
    add_time: 1564544559,
    up_time: 1564551238,
    req_query: [
      // {
      //   required: '1',
      //   name: 'name',
      //   example: 'kong',
      //   desc: ''
      // }
    ],
    req_headers: item.header && item.header.fields.Header.map(_ => {
      return {
        required: _.optional ? '1' : 0,
        name: _.field,
        value: _.type,
        desc: _.description
      }
    }),
    req_body_other: formatForm(item),
    req_body_type: 'json',
    desc: '',
    markdown: '',
    res_body: item.success && item.success.examples && item.success.examples.length && item.success.examples[0].content || ''
  }

  data.push(_item)
})

let index = 0
groups.forEach(name => {
  console.log(name)
  if (index > 1) return
  nData.push({
    index,
    name,
    desc: name,
    list: data.filter(_ => _.groupTitle === name)
  })
  index ++
})

fs.writeFile('./data/api_format.json', JSON.stringify(nData), (err, data) => {
  if (err) {
    // reject(err)
  } else {
    // resolve(config)
  }
})