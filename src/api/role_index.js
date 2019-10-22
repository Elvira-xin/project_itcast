import axios from '@/utils/myaxios.js'
export const getAllRoles = (params) => {
  return axios({
    url: 'roles',
    params
  })
}

// 删除角色
export const delRolesById = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 获取角色授权
export const grantRoleById = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}

// 添加角色
export const addRoles = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

// 删除角色
export const delRoles = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}
