import React, {FC} from 'react';
import {IProduct} from "../../types/types";
import {Menu} from "antd";

interface MenuProps{
    products:IProduct[]
    selected:string
    setSelected:(value:string)=>void
}


const MyMenu:FC<MenuProps> = ({products,selected,setSelected}) => {
    let categories = products? Array.from(new Set(products.map(p=>p.category))):[]
    return (
        <div style={{ width: 256 }}>
            <Menu
                defaultSelectedKeys={[selected]}
                mode="inline"
                theme="dark"

            >
                <Menu.Item key = "All" onClick={()=>setSelected("All")}>All</Menu.Item>
                {categories.map(c => <Menu.Item key = {c} onClick={()=>setSelected(c as string)}>
                    {c}
                </Menu.Item>)}
            </Menu>
        </div>
    );
};

export default MyMenu;