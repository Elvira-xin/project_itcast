import axios from '@/utils/myaxios.js'
export const getCateParams = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
