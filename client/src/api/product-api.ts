import $api ,{ProductResponse,ProductsResponse,ActionResponse} from "./api"
import {IProduct} from "../types/types";
export default class ProductService {
    static async addProduct(product:IProduct,imgUrl:string) {
        return $api.post<ProductResponse>('/product/add', {...product,imgUrl}).then(res => res.data)
    }
    //TODO:UPLOAD PIC FROM FRONTEND
    static async editProduct(product:IProduct,imgUrl:string){
        return $api.put<ProductResponse>(`/product/edit/${product.productName}`, {...product,imgUrl}).then(res => res.data)
    }
    static async getAllProducts(){
        return $api.get<ProductsResponse>(`/product/`).then(res => res.data)
    }
    static async getOneProduct(productName:string){
        return $api.get<ProductResponse>(`/product/${productName}`).then(res => res.data)
    }
    static async deleteProduct(productName:string){
        return $api.delete<ActionResponse>(`/product/delete/${productName}`).then(res => res.data)
    }
}
