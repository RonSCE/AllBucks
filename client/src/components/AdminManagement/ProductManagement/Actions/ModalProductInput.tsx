import React, {FC, useEffect, useState} from 'react';
import {Input, InputNumber, message, Modal, Switch, Upload} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import {IProduct} from "../../../../types/types";
interface InputProps{
    product:IProduct | null
    setProduct:(prod:IProduct)=>void | null
    visible:boolean
    setVisible:(visible:boolean) => void
    onOk:(product:IProduct | null,img:string) => void
    isLoading:boolean
}
const ModalProductInput:FC<InputProps> = ({product,isLoading,setVisible,visible,onOk,setProduct}) => {
    const [imgUrl,setImgUrl] = useState<string>("" )
    const [Url,setUrl] = useState<string>("" )
    const [isSpecial,setSpecial] = useState( false)
    const [inStock,setStock] = useState(false)
    const [category,setCategory] = useState( "")
    const [productName,setProductName] = useState("")
    const [price,setPrice] = useState(0)
    const [salePrice,setSalePrice] = useState(0)
    const [desc,setDesc] = useState("")
    const [loadingImg,setLoadingImg]=useState(false)
    function getBase64(img:File, callback:any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    function beforeUpload(file:File) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isLt2M) {
            message.error('Image must smaller than 4MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    const handleChange = (info:any) => {
        if (info.file.status === 'uploading') {
            setLoadingImg(true );
            return;
        }
        if (info.file.status === 'done') {
            console.log(info);
            getBase64(info.file.originFileObj, (imageUrl:string) =>{
                setImgUrl(imageUrl)
                setUrl(info.file.response.url)
                setLoadingImg(false)}
            );
        }
    };
    const uploadButton = (
        <div>
            {loadingImg ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
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
        onOk(product,Url);
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
               name="pic"
               listType="picture-card"
               className="avatar-uploader"
               showUploadList={false}
               action="https://localhost:5000/api/product/upload-img"
               method={"POST"}
               maxCount={1}
               beforeUpload={beforeUpload}
               onChange={handleChange}
           >
               {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
           </Upload>
            <b>Price</b><br/><InputNumber value={price} min={1} max={1000}  onChange={(e)=>{ setPrice(e)}} />
            <br/><b>Sale Price</b><br/><InputNumber value={salePrice } min={1} max={1000} onChange={(e)=>{setSalePrice(e)  }} />
            <br/><b>Is In Stock:</b><Switch checked={inStock} onChange={(e)=>{setStock(e)}} />
            <br/><b>Is Special:</b><Switch checked={isSpecial} onChange={(e)=>{setSpecial(e)}} />
            <br/><b>Description</b><TextArea value={desc} maxLength={200} onChange={(e)=>{setDesc(e.target.value) }} />
       </Modal>);
};

export default ModalProductInput;