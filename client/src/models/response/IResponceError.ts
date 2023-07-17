interface IServerValidationError{
    value:string,
    msg:string,
    param:string,
    location:string
}
export interface IResponseError{
    status:number,
    data:{
        message:string,
        errors:IServerValidationError[],
        type:string
    }
}