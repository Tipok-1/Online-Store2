import { useState } from 'react';
import { IReview } from '../../models/IReview';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ReviewForm from '../ReviewForm/ReviewForm';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles';
import { authReviewApi } from '../../services/reviewService';


function stringAvatar(name: string) {
    const splitName = name.split(' ');
    let child = name[0] || 'g';
    if (splitName.length >= 2) {
        child = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    }
    return {
        children: child,
    };
}
function makeDate(date: Date) {
    let res = '';
    if (date.getDate() < 10) {
        res += `0${date.getDate()}`;
    } else { res += `${date.getDate()}` }

    if (date.getMonth() + 1 < 10) {
        res += `.0${date.getMonth() + 1}`;
    } else { res += `.${date.getMonth() + 1}` }

    res += `.${date.getFullYear()}`;
    return res;

}
interface IOneReview {
    deleteButton?: boolean,
    updateButton?: boolean,
    setOpenForm?: (arg: boolean) => void
}
const OneReview = ({ updatedAt, grade, name = 'Guest', review, id: ReviewId, deleteButton, updateButton, setOpenForm }: IReview & IOneReview) => {
    const [updateMode, setUpdateMode] = useState(false);
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [deleteReview, {
        isLoading: deleteReviewLoading,
    }] = authReviewApi.useDeleteReviewMutation()

    if (updateMode) {
        return (
            <ReviewForm
                oldReviewId={ReviewId}
                myName={name}
                myGrade={grade}
                myReview={review}
                setUpdateMode={setUpdateMode}
                setOpenForm={setOpenForm} 
                />
        )
    }
    function deleteReviewFn() {
        deleteReview(ReviewId);
    }
    return (
        <Box sx={{ width: '100%', bgcolor: 'rgb(35,35,35)', borderRadius: '5px' }}>
            <Box alignItems="flex-start" sx={theme => ({
                mb: '20px',
                p: '20px',
                [theme.breakpoints.down("sm")]: {
                    mb: '10px',
                },
            })} >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '5px' }}>
                    <Avatar sx={{ mr: '15px' }} {...stringAvatar(name)} />
                    <Typography component="span" sx={{ mr: '10px' }}>{name || 'guest'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                    <Rating value={grade} readOnly size='small' precision={0.5} />
                    <Typography sx={{ color: 'rgb(168, 167, 167)', ml: '5px', fontSize: '12px', mt: '2px' }}> {makeDate(updatedAt)}</Typography>
                </Box>
                <Box>
                    <Typography
                        sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', }}
                        component="span"
                        variant="body2"
                    >
                        {review}
                    </Typography>
                </Box>
                {
                    (deleteButton || updateButton) &&
                    <Box sx={{ mt: '15px' }}>
                        {updateButton && <LoadingButton
                            sx={{ mr: '10px' }}
                            variant='outlined'
                            color='customColor'
                            size='small'
                            startIcon={<EditNoteIcon />}
                            disabled={deleteReviewLoading ? true : false}
                            onClick={() => setUpdateMode(true)}
                        >Изменить {!mobile && 'отзыв'}</LoadingButton>}
                        {deleteButton && <LoadingButton
                            variant='outlined'
                            color='customColor'
                            size='small'
                            onClick={() => deleteReviewFn()}
                            loading={deleteReviewLoading}
                            startIcon={<DeleteIcon />}
                        >Удалить {!mobile && 'отзыв'}</LoadingButton>}
                    </Box>
                }
            </Box >

        </Box >
    );
};

export default OneReview;