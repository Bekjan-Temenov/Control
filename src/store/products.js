import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { apiUrl } from "./api";

export const getProducts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/products/get`);
    return response.data;
  } catch (err) {
    console.error("Ошибка при получении продуктов:", err);
    throw err;
  }
};

export const postProduct = async (form) => {
  try {
    const res = await axios.post(`${apiUrl}/products/post`, form);
    toast.success("Продукт успешно добавлен!", { autoClose: 500 });
    return res.data;
  } catch (err) {
    console.log("Ошибка при создании продукта (POST):", err);
    throw err;
  }
};

export const putProduct = async (id, form) => {
  try {
    const res = await axios.put(`${apiUrl}/products/put/${id}`, form);
    toast.success("Продукт успешно изменен!", { autoClose: 500 });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const deleteProducts = async (id) => {
  try {
    const res = await axios.delete(`${apiUrl}/products/delete/${id}`);
    toast.error("Продукт успешно удален!", { autoClose: 500 });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
