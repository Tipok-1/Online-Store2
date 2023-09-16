import { authApi, Api } from "./commonApi";
import { IReview, IReviewCreateRequest, IReviewUpdateRequest} from "../models/IReview";

export const authReviewApi = authApi.injectEndpoints({
    endpoints: (build) => ({
        createReview: build.mutation<IReview, IReviewCreateRequest>({
            query: (review) => ({
                url: '/review',
                method: 'POST',
                body: review
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const responce = await queryFulfilled;
                    dispatch(Api.util.invalidateTags([{type:'Device', id:responce.data.deviceId}]))
                    dispatch(Api.util.invalidateTags(['Review']));

                } catch (e) {
                    console.error("Create review error " + e);
                }
            },
        }),
        updateReview: build.mutation<IReview, IReviewUpdateRequest>({
            query: (review) => ({
                url: '/review',
                method: 'PATCH',
                body: review
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const responce = await queryFulfilled;
                    dispatch(Api.util.invalidateTags([{type:'Review', id:arg.id}]))
                    if(arg.grade) {
                        dispatch(Api.util.invalidateTags([{type:'Device', id:responce.data.deviceId}]))
                    }

                } catch (e) {
                    console.error("Update review error " + e);
                }
            },
        }),
        deleteReview: build.mutation<IReview, number>({
            query: (id) => ({
                url: '/review' + '/' + id,
                method: 'DELETE',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const responce =  await queryFulfilled;
                    dispatch(Api.util.invalidateTags([{type:'Device', id:responce.data.deviceId}]))
                    dispatch(Api.util.invalidateTags(['Review']))

                } catch (e) {
                    console.error("Delete review error " + e);
                }
            },
        }),



    })
})

interface IMyDeviceReviewRequest {
    deviceId: number,
    userId: number
}
interface IReviewResponce {
    count: number,
    rows: IReview[],
}
interface IReviewRequest {
    deviceId:number, 
    limit?:number, 
    page?:number
}

export const reviewApi = Api.injectEndpoints({
    endpoints: (build) => ({
        getDeviceReviews: build.query<IReviewResponce, IReviewRequest>({
            query: (req:IReviewRequest) => ({
                url: '/review' + '/' + req.deviceId,
                params:req
            }),
            providesTags: (result) =>
                (result && result.rows)
                    ? [...result?.rows.map(({ id }) => ({ type: 'Review' as const, id })), 'Review']
                    : ['Review'],
        }),
        getMyDeviceReview: build.query<IReview, IMyDeviceReviewRequest>({
            query: (params) => ({
                url: '/review',
                params
            }),
            providesTags: (result) =>  result ? [{type:'Review' as const, id:result.id}, 'Review']  : ['Review'],
        })
    }),
})
