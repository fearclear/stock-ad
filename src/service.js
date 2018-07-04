
import axios from 'axios'
import qs from 'qs'
import lodash from 'lodash'
import { message } from 'antd'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const url = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8002/api' : 'http://39.107.66.203/api'
const api = {
  info: `${url}/info/info`,
  acUser: `${url}/user/acUser`,
  user: `${url}/user/user`,
  infos: `${url}/info/infos`,
  log: `${url}/log/log`,
  export: `${url}/log/export`
}

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url
  } = options
  const cloneData = lodash.cloneDeep(data)
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData
      })
    case 'post':
      return axios.post(url, qs.stringify(cloneData))
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}
const service = (options) => {
  return fetch(options).then((response) => {
    let data = response.data
    if(data instanceof Array) {
      data = {
        list: data
      }
    }
    data.status = response.status
    data.success = true
    return data
  }).catch((error) => {
    const { response } = error
    let data = response.data
    message.error(data.text)
    return { status: data.status, text: data.text }
  })
}
module.exports = {
  service,
  api
}
