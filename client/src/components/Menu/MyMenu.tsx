import React, {FC} from 'react';
import {IProduct} from "../../types/types";
import {Menu, Radio, Slider, Switch} from "antd";
import SubMenu from 'antd/lib/menu/SubMenu';
import {BarsOutlined, DollarCircleOutlined, MinusOutlined} from "@ant-design/icons";

interface MenuProps{
    products:IProduct[]
    selected:string
    setSelected:(value:string)=>void
    special:boolean | null
    setSpecial:(value:boolean | null)=>void
    sale:boolean | null
    setSale:(value:boolean | null)=>void
    range:[number,number]
    setRange:(range:[number,number])=>void
    sortOrder:boolean | null
    setSortOrder:  React.Dispatch<React.SetStateAction<boolean | null>>
}


const MyMenu:FC<MenuProps> = ({products,selected,setSelected,
                                  range,setRange,sale,
                                  setSale,special,setSpecial,sortOrder,setSortOrder}) => {
    let categories = products? Array.from(new Set(products.map(p=>p.category))):[]
    return (
        <div style={{ width: 230 ,float:"left"}}>
            <h2 style={{marginLeft:45}}><b>Products:</b></h2>
            <Menu
                style={{position:"fixed",width: 230}}
                defaultSelectedKeys={[selected]}
                mode="inline"
                theme="light"

            >   <SubMenu key="sub-menu" icon={<BarsOutlined />} title="Categories" >
                <Menu.Item key = "All" onClick={()=>setSelected("All")}>All</Menu.Item>
                {categories.map(c => <Menu.Item key = {c} onClick={()=>setSelected(c as string)}>
                    {c}
                </Menu.Item>)}
            </SubMenu>
                <SubMenu key="sub-menu-others" icon={<MinusOutlined />} title="Other Filters" >
                <Menu.Item key = "Special"  onClick={()=>setSpecial(!special)}><Switch checked={!!special}  /> Special</Menu.Item>
                <Menu.Item key = "Sale" onClick={()=> {setSale(!sale)}}><Switch checked={!!sale}  /> Sales</Menu.Item>
                </SubMenu>
                <SubMenu key="sub-menu-range" icon={<DollarCircleOutlined />} title="Price Range & Sorting" popupOffset={[20,20]}>
                <Menu.Item key = "Range" onClick={()=>{}} unselectable={"on"}>
                    <Slider range={true} value={range} min={0} max={150} onChange={(e)=> setRange(e)}/>
                </Menu.Item>
                    <Radio.Group style={{marginLeft:25}} value={sortOrder===null?"Asc":sortOrder?"Asc":"Desc"} onChange={ () => {
                         setSortOrder(prevState => prevState===null?false:!prevState)
                    }}>
                        <Radio value={"Asc"} >Sort in ascending price</Radio>
                        <Radio value={"Desc"} >Sort in descending price</Radio>
                    </Radio.Group>
                </SubMenu>
            </Menu>
        </div>
    );
};

export default MyMenu;