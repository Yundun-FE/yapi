const apiData = require('./api_data')
const fs = require('fs')
const JSON5 = require('json5')

function formatForm(data) {
  const items =
    (data.parameter &&
      data.parameter.fields &&
      data.parameter.fields.Parameter) ||
    []
  const required = items.filter(_ => _.optional).map(_ => _.field)
  const properties = {}

  items.forEach(_ => {
    properties[_.field] = {
      description: _.description.replace('<p>', '').replace('</p>', ''),
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

function fomatResBody(data) {
  data =
    (data.success &&
      data.success.examples &&
      data.success.examples.length &&
      data.success.examples[0].content) ||
    {}

  try {
    data = JSON5.parse(data)
  } catch (e) {
    data = {}
  }

  const nData = {
    type: 'object',
    title: 'empty object',
    properties: {
      status: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            mock: {
              mock: '操作成功'
            }
          },
          code: {
            type: 'number',
            mock: {
              mock: '1'
            }
          }
        },
        required: ['message', 'code']
      },
      data: formatResItem(data.data)
    },
    required: ['status', 'data']
  }

  return JSON.stringify(nData)
}

function formatResItem(source) {
  if (!source && typeof source !== 'object') {
    return {}
    // throw new Error('error arguments', 'shallowClone')
  }

  const targetObj =
    source.constructor === Array
      ? {
          items: {},
          type: 'array'
        }
      : {
          properties: {},
          required: [],
          type: 'object'
        }

  if (source.constructor === Array) source = source.slice(0, 1)

  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object') {
      if (targetObj.items) {
        targetObj.items = formatResItem(source[key])
      } else {
        targetObj.properties[key] = formatResItem(source[key])
        targetObj.required.push(key)
      }
      // if (source[key].constructor === Array) {
      //   targetObj.items[key] = formatResItem(source[key][0])
      // } else {
      //   targetObj.properties[key] = formatResItem(source[key])
      //   targetObj.required.push(key)
      // }

      // targetObj[key] = source[key].constructor === Array ? [] : {}
      // targetObj[key] = formatResItem(source[key])
    } else {
      if (targetObj.items) {
        targetObj.items[key] = {
          type: typeof source[key],
          mock: {
            mock: source[key]
          }
        }
      } else {
        targetObj.properties[key] = {
          type: typeof source[key],
          mock: {
            mock: source[key]
          }
        }
      }
    }
  }
  console.log(targetObj);
  return targetObj
}

const data = []
const nData = []
const groups = new Set()

apiData.forEach(item => {
  groups.add(item.groupTitle)

  const methods = item.type.split(/\||\//)
  const method = methods[methods.length - 1].toUpperCase()

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
    method,
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
    req_headers:
      item.header &&
      item.header.fields.Header.map(_ => {
        return {
          required: _.optional ? '1' : 0,
          name: _.field,
          value: _.type,
          desc: _.description.replace('<p>', '').replace('</p>', '')
        }
      }),
    req_body_other: formatForm(item),
    req_body_type: 'json',
    desc: '',
    markdown: '',
    res_body: fomatResBody(item)
  }

  data.push(_item)
})

let index = 0
groups.forEach(name => {
  console.log(name)
  // if (index > 1) return
  nData.push({
    index,
    name,
    desc: name,
    list: data.filter(_ => _.groupTitle === name)
  })
  index++
})

fs.writeFile('./data/api_format.json', JSON.stringify(nData), (err, data) => {
  if (err) {
    // reject(err)
  } else {
    // resolve(config)
  }
})
