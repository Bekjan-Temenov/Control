import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { apiUrl } from "./api";


export const fetchSales = async (queryParams = "") => {
  try {
    const url = `${apiUrl}/sales/get${queryParams ? `?${queryParams}` : ""}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных о продажах:", error);
    throw error;
  }
};

export const fetchSaleById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/sales/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных о продаже:", error);
    throw error;
  } 
}
export const createSale = async (saleData , vm) => {
  try{
    const response = await axios.post(`${apiUrl}/sales/post`, saleData);
    toast.success("Продажа успешно добавлено!", { autoClose: 500 });
    vm.$router.push({ name: 'home' });
    return response.data;
  }catch(err){
    console.log(err);
  }
};

export const updateSale = async (saleData) => {
  try{
    const res = await axios.put(`${apiUrl}/sales/put/${saleData.id}`, saleData);
    toast.success("Продажа успешно изменено!", { autoClose: 500 });
    return res.data
  }catch(err){
    console.log(err);
  }
};

export const deleteSale = async (id) => {
  try{
    const res = await axios.delete(`${apiUrl}/sales/delete/${id}`);
    toast.error("Продажа успешно удалено!", { autoClose: 500 })
    
    return res.data; 
  }catch(err){
    console.log(err);
  }
};

export const fetchWarehouses = async () => {
  const response = await axios.get(`${apiUrl}/wherehouse/get`);
  return response.data;
};

export const fetchProducts = async () => {
  const response = await axios.get(`${apiUrl}/products/get`);
  return response.data;
};
