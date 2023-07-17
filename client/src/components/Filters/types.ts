import { IType, IBrand } from "../../models/IType&IBrand"

export interface IFilterList{
    options:IType[] | IBrand[],
    isLoading?:boolean,
    action?:TypeAction
}

type TypeAction = (payload: number| null)=>{
    payload: number | null;
    type: "devices/setSelectedType";
}