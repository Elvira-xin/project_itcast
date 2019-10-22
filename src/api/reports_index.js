import axios from '@/utils/myaxios.js'
export const getReportsData = (type) => {
  return axios({
    url: `reports/type/${type}`
  })
}
