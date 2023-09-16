export interface IReview{
    id:number,
    name:string,
    review: string,
    grade: number,
    updatedAt:Date,
    deviceId:number
}
//name, review, grade, deviceId, email 
export interface IReviewCreateRequest{
    name:string,
    review: string,
    grade: number,
    deviceId:number,
    email:string
}
export interface IReviewUpdateRequest{
    id:number, 
    name?:string, 
    review?:string, 
    grade?:number
}