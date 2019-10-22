import axios from '@/utils/myaxios.js'
export const getAllUsers = (params) => {
  // console.log(params)
  return axios({
    url: 'users',
    params
  })
}

// 添加用户接口
export const addUser = (data) => {
  // console.log(data)
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 编辑接口
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 分配角色接口
export const grantUser = (data) => {
  console.log(data)
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    // data:{id:}
    data: { rid: data.rid }
  })
}

// 删除用户
export const delUserById = (id) => {
  // console.log(id)
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 状态修改
export const updateUser = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}
