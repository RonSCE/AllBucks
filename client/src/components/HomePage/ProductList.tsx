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
    const [available,setAvailable]=useState<boolean>(false)
    const [sortOrder,setSortOrder] = useState<boolean | null>(null)
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
        if(!available && allProducts){
            tempProducts = allProducts.filter(p=>p.inStock)
        }else if(allProducts && available){
            tempProducts = allProducts
        }else{
            tempProducts = []
        }
        if(allProducts && selected !=="All"){
            tempProducts =tempProducts.filter(p=> p.category === selected)
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
            tempProducts =[...tempProducts.sort((p1,p2)=> p2.price - p1.price)]
        }
        setProducts(tempProducts)
    },[selected,allProducts,sale,special,range,sortOrder,available])
    return (
        <>
            <MyMenu setSelected={setSelected} selected={selected} products={allProducts} range={range} sale={sale}
                    setRange={setRange} setSale={setSale} available={available}
                    special={special} setSpecial={setSpecial} setSortOrder={setSortOrder} sortOrder={sortOrder} setAvailable={setAvailable} />
            { products &&
            <List

                className="item-list"
                loading={isLoading}
                dataSource={products}
                renderItem={prod => (
                    <List.Item style={{borderBottom:"2px solid grey"}} className={"item"}
                               actions={[
                                   <>
                                       {prod.inStock ? <a className={"edit-item"} onClick={()=>{onAdd(prod)}}><PlusSquareOutlined /> Add To Cart</a>:
                                            <b style={{color:"red"}}>Unavailable</b>
                                       }
                                   </>

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
                                        {prod.isSpecial && <Badge.Ribbon style={{marginTop:3}} text="Special" color="green">

                                        </Badge.Ribbon>}
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