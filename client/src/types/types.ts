export interface IUser {
    cid: string | null
    name: string | null
    type: string | null
    numOfCoffeeCups: number | null
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
    productName: string | null
    quantity: number | null
    price: number | null
    salePrice: number | null
}
export interface IOrder {
    orderedBy:string | null
    status: string | null
    orderedItems: IOrderedProduct[]

}
export interface ITable{
    tableNum:number | null
    capacity:number | null
    isAvailable:boolean | null
    isInside:boolean | null
}
export interface IProduct{
    productName: string | null
    category: string | null
    price: number| null
    imgUrl: string | null
    desc: string | null
    inStock:boolean| null
    isSpecial:boolean| null
    salePrice: number| null
}
