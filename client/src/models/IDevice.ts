export interface IDevice{
    id:number,
    name:string,
    price:number,
    rating:number,
    img:string[],
    stock:number,
    description:string,
    reviewsCount:number,
    brandId:number,
    typeId:number
}

export interface IDeviceInfo{
    id:number,
    title:string,
    description: string
}