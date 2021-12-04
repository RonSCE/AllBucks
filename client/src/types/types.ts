export interface IUser {
    cid: string | null
    name: string | null
    type: string | null
    numOfCoffeeCups: number | null
}
export interface UserType{
    type: "Member" | "Barista" | "Admin"
}