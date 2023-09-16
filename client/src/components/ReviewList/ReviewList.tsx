import { useEffect, useState } from 'react';
import { IReview } from '../../models/IReview';
import { Box } from '@mui/material';
import OneReview from '../OneReview/OneReview';
import { StyledPagination } from '../styledElements/styledPagination';
import { reviewApi } from '../../services/reviewService';
import Loader from '../Loader/Loader';

const ReviewList = ({ deviceId }: { deviceId: number }) => {
    const [pageCount, setPageCount] = useState(1);
    const [activePage, setActivePage] = useState(1)
    const limit = 5;
    const {
        data: ReviewData,
        count: ReviewCount,
        isError:ReviewError,
        isLoading: ReviewLoading,
        isSuccess: ReviewSuccess,
        isFetching: ReviewFetching
    } = reviewApi.useGetDeviceReviewsQuery({ deviceId, limit, page: activePage }, {
        selectFromResult: ({ data, isError,  isLoading, isSuccess, isFetching }) => ({
            data: data ? data.rows : null,
            count: data ? data.count : null,
            isError,
            isLoading,
            isSuccess,
            isFetching
        })
    })
    useEffect(() => {
        if (ReviewCount !== null) {
            setPageCount(Math.ceil(ReviewCount / limit))
        }
    }, [ReviewCount])
    return (
        <Box>

            {
                ReviewLoading || ReviewFetching ? <Box sx={{
                    height: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><Loader h={20} w={20}></Loader>
                </Box>
                    : ReviewSuccess && ReviewData && <>
                        {
                            ReviewData.map(r => <OneReview
                                key={r.id}
                                id={r.id}
                                name={r.name}
                                review={r.review}
                                grade={r.grade}
                                deviceId={r.deviceId}
                                updatedAt={new Date(r.updatedAt)}
                            />)
                        }
                        {pageCount > 1 && < Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <StyledPagination
                                count={pageCount}
                                variant="outlined"
                                page={activePage}
                                onChange={(_, pageNum) => {
                                    setActivePage(pageNum);
                                }}
                                shape="rounded"

                                size={'medium'} />
                        </Box>
                        }
                    </>
                    
                    
            }
            {ReviewError && <span>Не удалось загрузить отзывы</span>}
        </Box>
    );
};

export default ReviewList;