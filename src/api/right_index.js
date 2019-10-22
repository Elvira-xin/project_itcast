import axios from '@/utils/myaxios.js'
export const getAllRight = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
export const getLeftMenu = () => {
  return axios({
    url: 'menus'
  })
}
