import React, {FC, useEffect, useState} from 'react';
import {Avatar, Button, List, Popconfirm, Popover, Skeleton} from "antd";
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
    const [sale,setSale]=useState<boolean | null>(null)
    const [range,setRange]=useState<[number,number]>([0,150])
    const [special,setSpecial]=useState<boolean | null>(null)
    const [available,setAvailable]=useState<boolean>(false)
    const [sortOrder,setSortOrder] = useState<boolean|null>(null) //true:ascend - false : descend
    let tempProducts = [] as IProduct[]
    useEffect(()=>{
        dispatch(getAllProducts())
        setProducts(allProducts)
    },[])
    useEffect(()=>{
        setProducts(allProducts)
    },[allProducts])
    const isLoading = useSelector<AppStateType>(state=>state.product.isLoading)  as boolean
    const onOk =(product: IProduct| null,img:string) => {
        dispatch(editProduct(product as IProduct,img))
        setEditing(false)
    }
    const onAdd = (product: IProduct| null,img:string) => {
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
        if(!available && allProducts){
            tempProducts = allProducts.filter(p=>p.inStock)
        }else if(allProducts){
            tempProducts = allProducts
        }else{
            tempProducts = []
        }
        if(allProducts && selected !=="All"){
            tempProducts =allProducts.filter(p=> p.category === selected)
            if(!available){
                tempProducts = tempProducts.filter(p=>p.inStock)
            }
        }
        if(tempProducts.length >0 && sale){
            tempProducts = tempProducts.filter(p=> p.salePrice && p.salePrice > 0)
        }
        if(tempProducts.length >0 && special){
            tempProducts = tempProducts.filter(p=> p.isSpecial===true)
        }
        if(tempProducts.length >0 && (range[0]>0 || range[1]<150)){
            tempProducts = tempProducts.filter(p=> p.price && p.price>=range[0] && p.price <=range[1])
        }
        if(sortOrder){
            tempProducts = [...tempProducts.sort((p1,p2)=> p1.price - p2.price)]
        }else if(sortOrder===false){
            tempProducts = [...tempProducts.sort((p1,p2)=> p2.price - p1.price)]
        }
        setProducts(tempProducts)
    },[selected,sortOrder,allProducts,sale,special,range])
    return (
        <>
            <MyMenu setSelected={setSelected} selected={selected} products={allProducts} range={range} sale={sale}
                    setRange={setRange} setSale={setSale} special={special} available={available} setAvailable={setAvailable}
                    setSpecial={setSpecial} sortOrder={sortOrder} setSortOrder={setSortOrder}/>
            { products &&
            <List
                className="item-list"
                loading={isLoading}
                dataSource={products}
                renderItem={prod => (
                    <List.Item style={{borderBottom:"2px solid grey"}} className={"item"}
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
                                        <Popover content={<p>{prod.desc}</p>} title="Description" >
                                            <b>Description - Hover To See</b>
                                        </Popover>

                                        <br/>
                                        <div><b>Category:</b>{prod.category}</div>
                                        <div><b>Is In stock:</b>{prod.inStock ? "Yes": "No"}</div>
                                        <div><b>Regular price:</b>{prod.price}NIS</div>
                                        <div><b>Sale Price:</b>{prod.salePrice || 'None' }</div>
                                        <div><b>Is special:</b>{prod.isSpecial ? "Yes" : 'No'}</div>
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