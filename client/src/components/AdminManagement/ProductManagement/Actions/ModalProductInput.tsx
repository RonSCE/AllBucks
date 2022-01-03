import React, {FC, useEffect, useState} from 'react';
import {Input, InputNumber, Modal, Switch, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import {IProduct} from "../../../../types/types";
interface InputProps{
    product:IProduct | null
    setProduct:(prod:IProduct)=>void | null
    visible:boolean
    setVisible:(visible:boolean) => void
    onOk:(product:IProduct | null,img:File | null) => void
    isLoading:boolean
}
const ModalProductInput:FC<InputProps> = ({product,isLoading,setVisible,visible,onOk,setProduct}) => {
    const [file,setFile] = useState<File | null>(null )
    const [isSpecial,setSpecial] = useState( false)
    const [inStock,setStock] = useState(false)
    const [category,setCategory] = useState( "")
    const [productName,setProductName] = useState("")
    const [price,setPrice] = useState(0)
    const [salePrice,setSalePrice] = useState(0)
    const [desc,setDesc] = useState("")
    useEffect(()=>{
        setSpecial(product?.isSpecial || false)
        setStock(product?.inStock|| false)
        setCategory(product?.category || "")
        setProductName(product?.productName || "")
        setPrice(product?.price || 0)
        setDesc(product?.desc || "")
        setSalePrice(product?.salePrice || 0)
    },[product])
    const setProd = ()=>{
        if(product){
            if(productName )
                product.productName = productName
            if(price)
                product.price = price
            if(salePrice)
                product.salePrice = salePrice
            if(desc)
                product.desc = desc
            if(category)
                product.category = category
            product.isSpecial = isSpecial
            product.inStock = inStock
        }else{
            product = {
                productName: productName,
                price:price,
                salePrice :salePrice,
                desc : desc,
                inStock : inStock,
                category : category,
                isSpecial: isSpecial,
                imgUrl:null
            }

        }
        setProduct(product)
    }
    const onOkAction = () => {
        setProd();
        onOk(product,file);
        clearInput();
    }
    const  clearInput= () => {
        setSpecial(false)
        setStock(false)
        setCategory("")
        setProductName("")
        setPrice(0)
        setDesc("")
        setSalePrice(0)
    }
    return (
       <Modal
               title= {product?.productName || "Input New Product"}
               visible={visible}
               onOk={onOkAction}
               confirmLoading={isLoading}
               onCancel={()=>{setVisible(false)}}
               okText={"Save"}
       >
           <b>Category:</b><Input value={category} allowClear onChange={(e)=>{setCategory(e.target.value)  }} />
           <b>Product Name:</b><Input value={productName} allowClear onChange={(e)=>{setProductName(e.target.value)}} />
           <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}

           >
            {product&&product.imgUrl ? <img src={product.imgUrl} alt="avatar" style={{ width: '100%' }} /> : <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>}
            </Upload>
            <b>Price</b><br/><InputNumber value={price} min={1} max={1000}  onChange={(e)=>{ setPrice(e)}} />
            <br/><b>Sale Price</b><br/><InputNumber value={salePrice } min={1} max={1000} onChange={(e)=>{setSalePrice(e)  }} />
            <br/><b>Is In Stock:</b><Switch checked={inStock} onChange={(e)=>{setStock(e)}} />
            <br/><b>Is Special:</b><Switch checked={isSpecial} onChange={(e)=>{setSpecial(e)}} />
            <br/><b>Description</b><TextArea value={desc} maxLength={100} onChange={(e)=>{setDesc(e.target.value) }} />
       </Modal>);
};

export default ModalProductInput;