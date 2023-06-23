import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://mock.mengxuegu.com/mock/629d727e6163854a32e8307e',
  timeout: 3000,
  // 跨域时候允许携带凭证
  withCredentials: true
})

interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

interface ResUserList {
  id: string;
  username: string;
  gender: number;
  user: { detail: { age: number } };
  idCard: string;
  email: string;
  address: string;
  createTime: string;
  status: number;
  avatar: string;
  photo: any[];
  children?: ResUserList[];
}

// 获取用户列表
export const getUserList = (params: any) => {
  return api.post<ResPage<ResUserList>>(`/geeker/user/list`, params);
};