import React, {FC, useEffect, useState} from 'react';
import { Input, InputNumber, Switch} from "antd";
import Modal from 'antd/lib/modal/Modal';
import { IProduct } from '../../../../types/types';
import TextArea from 'antd/lib/input/TextArea';


interface editProps{
    visible:boolean
    setVisible:(visible:boolean) => void
    onOk:(productName:string,product:IProduct | null,img:File | null) => void
    isLoading:boolean
    product:IProduct
}

const EditProduct:FC<editProps> = ({visible,setVisible,onOk,isLoading,product}) => {
    let file = null as (File | null)
    const prodName = product?.productName || ''
    const [isSpecial,setSpecial] = useState( false)
    const [inStock,setStock] = useState(false)
    useEffect(()=>{
        setSpecial(product.isSpecial || false)
        setStock(product.inStock || false)
    },)
    return (
        <>
            <Modal
                title= {prodName}
                visible={visible}
                onOk={()=>{onOk(prodName,product,file)}}
                confirmLoading={isLoading}
                onCancel={()=>{setVisible(false)}}
                okText={"Save"}
            >

                <b>Category:</b><Input placeholder={product?.category || '-'} allowClear onChange={(e)=>{if(e.target.value!=="")product.category = e.target.value }} />
                <b>Product Name:</b><Input placeholder={product?.productName || '-'} allowClear onChange={(e)=>{if(e.target.value!=="")product.productName = e.target.value}} />
                <b>Picture:</b><Input type={"file"} allowClear onChange={(e)=>{
                e.target.files ? file = e.target.files[0] : file = null}} />
                <b>Price</b><br/><InputNumber placeholder={product?.price?.toString() || '-' } min={1} max={10} onChange={(e)=>{if(e)product.price = e}} />
                <br/><b>Sale Price</b><br/><InputNumber placeholder={product?.salePrice?.toString() || '-' } min={1} max={10} onChange={(e)=>{if(e)product.salePrice = e}} />
                <br/><b>Is In Stock:</b><Switch checked={inStock} onChange={(e)=>{product.inStock = e;setStock(e)}} />
                <br/><b>Is Special:</b><Switch checked={isSpecial} onChange={(e)=>{product.isSpecial = e;setSpecial(e)}} />
                <br/><b>Description</b><TextArea placeholder={"Description"} maxLength={100} onChange={(e)=>{if(e.target.value!=="")product.desc = e.target.value}} />
            </Modal>
        </>
    );
};

export default EditProduct;