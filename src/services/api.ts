import http from './axios';

// 定义通用数据类型
export interface Person {
  id?: string | number;
  name: string;
  age?: number;
  email?: string;
  [key: string]: string | number | boolean | undefined;
}

// 获取所有人员列表
export const getPersons = () => {
  return http.get('/persons');
};

// 根据ID获取单个人员
export const getPersonById = (id: string | number) => {
  return http.get(`/persons/${id}`);
};

// 搜索人员
export const searchPersons = (params: Partial<Person>) => {
  return http.get('/search/persons', { params });
};

// 添加人员
export const addPerson = (data: Person) => {
  return http.post('/persons', data);
};

// 更新人员
export const updatePerson = (id: string | number, data: Partial<Person>) => {
  return http.put(`/persons/${id}`, data);
};

// 删除人员
export const deletePerson = (id: string | number) => {
  return http.delete(`/persons/${id}`);
};

// 批量删除人员
export const deletePersons = (ids: (string | number)[]) => {
  return http.delete('/persons', { data: { ids } });
};

// 获取JsonPlaceholder用户列表
export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  website?: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export const getUsers = () => {
  return http.get('https://jsonplaceholder.typicode.com/users');
};
