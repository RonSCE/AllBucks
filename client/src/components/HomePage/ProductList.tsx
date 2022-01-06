import React, {FC, useEffect, useState} from 'react';
import {Avatar, Badge, List, message, Popover, Skeleton, Typography} from "antd";
import {PlusSquareOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/Store";
import {IOrder, IOrderedProduct, IProduct} from "../../types/types";
import { getAllProducts } from '../../redux/reducers/product-reducer';
import MyMenu from "../Menu/MyMenu";
import {setLocalOrder} from "../../redux/reducers/order-reducer";

const ProductManagement:FC = () => {
    const dispatch = useDispatch()
    const allProducts = useSelector<AppStateType>(state=>state.product.products) as IProduct[]
    const [selected,setSelected] = useState("All")
    const [products,setProducts] = useState(allProducts || [] as IProduct[])
    const [sale,setSale]=useState<boolean | null>(null)
    const [range,setRange]=useState<[number,number]>([0,150])
    const [special,setSpecial]=useState<boolean | null>(null)
    const currentOrder = useSelector<AppStateType>(state=>state.order.currentOrder) as IOrder
    const calcSale= (price:number,salePrice:number)=>{
        return (((price-salePrice)/(price/100))).toFixed(2)
    }
    let tempProducts = [] as IProduct[]
    useEffect(()=>{
        dispatch(getAllProducts())
        setProducts(allProducts)
    },[])
    useEffect(()=>{
        setProducts(allProducts)
    },[allProducts])
    const isLoading = useSelector<AppStateType>(state=>state.product.isLoading)  as boolean
    const onAdd = (product: IProduct) => {
        const prod = {
            productName: product.productName,
            quantity: 1,
            price: product.price,
            salePrice:product.salePrice
        } as IOrderedProduct
        if(currentOrder.orderedItems.find(i=> i.productName === product.productName)){
            dispatch(setLocalOrder({...currentOrder,orderedItems:
                    currentOrder.orderedItems.
                    map(i=> i.productName === product.productName? {...i,quantity:(i.quantity as number+1 )}:i)}))
        }else{
            dispatch(setLocalOrder({...currentOrder,orderedItems:[...currentOrder.orderedItems,prod]}))
        }

        info(product)
    }
    const info = (prod:IProduct) => {
        message.info(`${prod.productName} is added to cart`);
    };
    useEffect(()=>{
        if(allProducts && selected !=="All"){
            tempProducts =allProducts.filter(p=> p.category === selected)
        }else if(allProducts){
            tempProducts = allProducts
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
        setProducts(tempProducts)
    },[selected,allProducts,sale,special,range])
    return (
        <>
            <MyMenu setSelected={setSelected} selected={selected} products={allProducts} range={range} sale={sale}
                    setRange={setRange} setSale={setSale} special={special} setSpecial={setSpecial}/>
            { products &&
            <List
                className="item-list"
                loading={isLoading}
                dataSource={products}
                renderItem={prod => (
                    <List.Item className={"item"}
                               actions={[
                                   <a className={"edit-item"} onClick={()=>{onAdd(prod)}}><PlusSquareOutlined /> Add To Cart</a>
                               ]}
                    >
                        <Skeleton avatar title={false} loading={isLoading} active>
                            <List.Item.Meta
                                avatar={
                                        <Avatar src={prod.imgUrl} size={160} shape={"square"}/>
                                }
                                title={
                                    <b>{prod.productName}</b>
                                }
                                description={

                                    <div>
                                        <Popover content={<p>{prod.desc}</p>} title="Description" >
                                            <b>Description - Hover To See</b>
                                        </Popover>

                                        <br/>
                                        <div><b>Category:</b>{prod.category}</div>
                                        <div><b>Is In stock:</b>{prod.inStock ? "Yes": "No"}</div>
                                        <div><b>Price:</b>
                                                {prod.salePrice?
                                                    <>
                                                    <Typography.Text delete> {prod.price}₪</Typography.Text>
                                                        {"   "}
                                                     <Typography.Text type="danger">{prod.salePrice}₪</Typography.Text>
                                                        <Badge.Ribbon text="Sale" placement={"end"} color="volcano">
                                                        </Badge.Ribbon>
                                                        <Typography.Text type="warning">{calcSale(prod.price as number, prod.salePrice)} % OFF</Typography.Text>
                                                    </>

                                                     :
                                                    <span>{prod.price}₪</span>
                                                }

                                        </div>

                                        <div><b>Is special:</b>{prod.isSpecial ? "Yes" : 'No'}</div>
                                    </div>
                                }
                            />

                        </Skeleton>
                    </List.Item>

                )}

            />

            }
        </>
    );
};

export default ProductManagement;