export interface IUser {
    cid: string | null
    name: string | null
    type: string | null
    points: number | null
}
export interface UserType{
    type: "Member" | "Barista" | "Admin"
}
export enum userTypes{
    Member="Member" ,
    Barista= "Barista",
    Admin="Admin",
}
export interface IOrderedProduct{
    productName: string
    quantity: number
    price: number
    salePrice: number | null
}
export interface IOrder {
    orderId:string | "Unplaced"
    orderedBy:string | null
    reservedTable:number | null
    status: string | null
    orderedItems: IOrderedProduct[]

}
export interface ITable{
    tableNum:number
    capacity:number
    isAvailable:boolean
    isInside:boolean
}
export interface IProduct{
    productName: string | null
    category: string | null
    price: number
    imgUrl: string | null
    desc: string | null
    inStock:boolean| null
    isSpecial:boolean| null
    salePrice: number| null
}
