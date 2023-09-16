import React from 'react';
import OneReview from '../OneReview/OneReview';
import { StyledTypography } from '../styledElements/styledTypography';
import Box from '@mui/material/Box';
import { IReview } from '../../models/IReview';

interface IMyReview{
    myReview:IReview,
    setOpenForm?:(arg:boolean)=>void
}

const MyReview = ({myReview,setOpenForm}:IMyReview) => {
    return (
        <Box>
            <StyledTypography variant="h5" sx={{ mb: '25px' }}>Ваш отзыв</StyledTypography>
            <OneReview
                setOpenForm={setOpenForm}
                deviceId={myReview.deviceId}
                updatedAt={myReview.updatedAt}
                id={myReview.id}
                name={myReview.name}
                review={myReview.review}
                grade={myReview.grade}
                deleteButton={true}
                updateButton={true}
            />
        </Box>
    );
};

export default MyReview;