import React, {FC, useEffect, useState} from 'react';
import {Avatar, Button, List, Popconfirm, Skeleton} from "antd";
import {addProduct, deleteProduct, editProduct, getAllProducts} from "../../../redux/reducers/product-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../../redux/Store";
import {IProduct} from "../../../types/types";
import MyMenu from "../../Menu/MyMenu";
import ModalProductInput from "./Actions/ModalProductInput";
import {PlusCircleOutlined} from "@ant-design/icons";

const ProductManagement:FC = () => {
    const dispatch = useDispatch()
    const allProducts = useSelector<AppStateType>(state=>state.product.products) as IProduct[]
    const [selected,setSelected] = useState("All")
    const [isEditing,setEditing]= useState(false)
    const [isAdding,setAdding] = useState(false)
    const [products,setProducts] = useState(allProducts || [] as IProduct[])
    useEffect(()=>{
        dispatch(getAllProducts())
        setProducts(allProducts)
    },[])
    useEffect(()=>{
        setProducts(allProducts)
    },[allProducts])
    const isLoading = useSelector<AppStateType>(state=>state.product.isLoading)  as boolean
    const onOk =(product: IProduct| null,img:File | null) => {
        dispatch(editProduct(product as IProduct,img))
        setEditing(false)
    }
    const onAdd = (product: IProduct| null,img:File | null) => {
            dispatch(addProduct(product as IProduct,img))
            setAdding(false)
    }
    const onEdit = (prod:IProduct)=> {
        setProduct(prod)
        setEditing(true)
    }
    const onDelete = (prodName: string)=>{
        dispatch(deleteProduct(prodName))
    }
    const [product,setProduct]= useState<IProduct|null>(null)
    useEffect(()=>{
        if(allProducts && selected !=="All" ){
            setProducts(allProducts.filter(p=> p.category === selected))
        }else if(allProducts){
            setProducts(allProducts)
        }
    },[products,selected,allProducts])
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
                        actions={[<a className={"edit-item"} onClick={()=>{onEdit(prod)}}>Edit</a>,
                            <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>{onDelete(prod.productName as string)}}>
                                <a className={"delete-item"} >Delete</a>
                            </Popconfirm>
                           ]}
                    >
                        <Skeleton avatar title={false} loading={isLoading} active>
                            <List.Item.Meta
                                avatar={<Avatar src={prod.imgUrl} size={160} shape={"square"}/>}
                                title={<b>{prod.productName}</b>}
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
                    </List.Item>

                )}

            />

        }
            <Button className={"add-prod-bnt"} type="primary" shape="round" icon={<PlusCircleOutlined />} size={"large"}
                    onClick={()=>setAdding(true)}>
                Add
            </Button>
            <ModalProductInput visible={isEditing} setVisible={setEditing} onOk={onOk} isLoading={isLoading} product={product} setProduct={setProduct} />
            <ModalProductInput visible={isAdding} setVisible={setAdding} onOk={onAdd} isLoading={isLoading} product={null} setProduct={()=>{}} />
        </>
    );
};

export default ProductManagement;