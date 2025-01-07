import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { apiUrl } from "./api";

export const getWherehouses = async () => {
  try {
    const response = await axios.get(`${apiUrl}/wherehouse/get`);
    return response.data;
  } catch (err) {
    console.error("Ошибка при получении складов:", err);
    throw err;
  }
};

export const postWherehouse = async (form) => {
  try {
    const res = await axios.post(`${apiUrl}/wherehouse/post` , form);
    toast.success("Склад успешно добавлен!", { autoClose: 500 });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const putWherehouse = async (id, form) => {
  try {
    const res = await axios.put(`${apiUrl}/wherehouse/put/${id}`, form);
    toast.success("Склад успешно изменен!", { autoClose: 500 });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteWherehouse = async (id) => {
  try {
    const res = await axios.delete(`${apiUrl}/wherehouse/delete/${id}`);
    toast.error("Склад успешно удален!", { autoClose: 500 });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
