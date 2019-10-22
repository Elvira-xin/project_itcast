import axios from '@/utils/myaxios.js'
export const getAllCateList = () => {
  return axios({
    url: 'categories'
  })
}
