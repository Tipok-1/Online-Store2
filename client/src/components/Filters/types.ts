import { IType, IBrand } from "../../models/IType&IBrand"

export interface IFilterList{
    options:IType[] | IBrand[],
    isLoading?:boolean,
    action?:ChangeState ,
    active ?:number | null | number[]
}



type TypeAction = (payload: number| null)=>{
    payload: number | null;
    type: "devices/setSelectedType";
}

type AddBrand = (payload: number | null)=> {
    payload: number | null;
    type: "devices/addSelectedBrand";
}

type RemoveBrand = (payload: number)=> {
    payload: number;
    type: "devices/removeSelectedBrand";
}
type ChangeState = {
    add:TypeAction | AddBrand,
    remove?:RemoveBrand
}
