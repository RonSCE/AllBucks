import React, {FC, useEffect, useState} from 'react';
import {Avatar, List, Skeleton} from "antd";
import {editProduct, getAllProducts} from "../../../redux/reducers/product-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../../redux/Store";
import {IProduct} from "../../../types/types";
import EditProduct from "./EditProduct/EditProduct";
import MyMenu from "../../Menu/MyMenu";

const ProductManagement:FC = () => {
    const dispatch = useDispatch()
    const allProducts = useSelector<AppStateType>(state=>state.product.products) as IProduct[]
    useEffect(()=>{
        dispatch(getAllProducts())
        setProducts(allProducts)
    },[])
    const [selected,setSelected] = useState("All")
    const [visible,setVisible]= useState(false)
    const [products,setProducts] = useState(allProducts || [] as IProduct[])
    const isLoading = useSelector<AppStateType>(state=>state.product.isLoading)  as boolean
    const onOk =async (productName:string,product: IProduct| null,img:File | null) => {
        await dispatch(editProduct(productName,product as IProduct,img))
        setVisible(false)
        setProduct(product)
    }
    const onEdit = (prod:IProduct)=> {
        setProduct(prod)
        setVisible(true)
    }
    const [product,setProduct]= useState<IProduct|null>(null)
    useEffect(()=>{
        if(allProducts && selected!=="All" ){
            setProducts(allProducts.filter(p=> p.category === selected))
        }else if(allProducts){
            setProducts(allProducts)
        }
    },[selected])

    return (
        <>
            <MyMenu setSelected={setSelected} selected={selected} products={allProducts}/>
            { products &&
            <List
                className="item-list"
                loading={isLoading}
                dataSource={products}
                renderItem={prod => (
                    <List.Item className={"item"}
                        actions={[<a className={"edit-item"} onClick={()=>{onEdit(prod)}}>Edit</a>]}
                    >
                        <Skeleton avatar title={false} loading={isLoading} active>
                            <List.Item.Meta
                                avatar={<Avatar src={prod.imgUrl} size={"large"} shape={"square"}/>}
                                title={<h5>{prod.productName}</h5>}
                                description={
                                <div>
                                    {prod.desc}
                                <br/>
                                <div><b>Category:</b>{prod.category}</div>
                                    <div><b>Is In stock:</b>{prod.inStock? "Yes": "No"}</div>
                                    <div><b>Regular price:</b>{prod.price}NIS</div>
                                    <div><b>Sale Price:</b>{prod.salePrice || 'None' }</div>
                                    <div><b>Is special:</b>{prod.isSpecial? "Yes" : 'No'}</div>
                                    </div>
                                }
                            />

                        </Skeleton>
                        {product&& <EditProduct visible={visible} setVisible={setVisible} onOk={onOk} isLoading={isLoading} product={prod} />}
                    </List.Item>
                )}
            />
        }</>
    );
};

export default ProductManagement;