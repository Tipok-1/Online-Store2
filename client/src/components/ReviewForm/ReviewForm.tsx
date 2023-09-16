import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { StyledTextField } from '../../components/styledElements/styledTextField';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import LoadingButton from '@mui/lab/LoadingButton';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { authReviewApi } from '../../services/reviewService';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { IReviewCreateRequest, IReviewUpdateRequest } from '../../models/IReview';

const ReviewFormLabels: { [index: string]: string } = {
    'empty': 'Без оценки',
    0: 'Без оценки',
    0.5: 'Ужасно',
    1: 'Очень плохо',
    1.5: 'Плохо',
    2: 'Хуже среднего',
    2.5: 'Средне',
    3: 'Лучше среднего',
    3.5: 'Нормально',
    4: 'Хорошо',
    4.5: 'Отлично',
    5: 'Прекрасно',
};

interface IReviewForm {
    oldReviewId?:number,
    myName?: string,
    myReview?: string,
    myGrade?: number | null,
    setUpdateMode?: Function,
    setOpenForm?: (arg: boolean) => void
}
const ReviewForm = ({ myName = '', myReview = '', myGrade = null, oldReviewId, setUpdateMode, setOpenForm}: IReviewForm) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [createReview, {
        isLoading: createReviewLoading,
        isSuccess: createReviewSuccess
    }] = authReviewApi.useCreateReviewMutation()
    const [updateReview, {
        isLoading: updateReviewLoading,
        isSuccess: updateReviewSuccess
    }] = authReviewApi.useUpdateReviewMutation()

    let { id: deviceId } = useParams();
    const email = useAppSelector(state => state.userReducer.user.email)

    const [rating, setRating] = useState<number | null>(myGrade);
    const [hover, setHover] = useState(-1);
    const [name, setName] = useState(myName)
    const [comment, setComment] = useState(myReview);
    const [showError, setShowError] = useState(false);

    function changeRating(_: React.SyntheticEvent, newValue: number | null) {
        setRating(newValue);
        setShowError(false);
    }

    function clickPublicReview(mode = 'create') {
        if (rating === null) {
            setShowError(true);
            return;
        }

        if (mode === 'create') {
            const review: IReviewCreateRequest = {
                name: name ? name : 'Guest',
                review: comment,
                grade: rating!,
                email,
                deviceId: +(deviceId || 1)
            }
            if (deviceId) {
                createReview(review);
            }
            return
        } else if (mode === 'update') {
            if(oldReviewId !== undefined) {
                const review:IReviewUpdateRequest = {id:oldReviewId};
                if(name !== myName) {
                    review.name = name;
                }
                if(comment !== myReview) {
                    review.review = comment;
                }
                if(rating !== myGrade) {
                    review.grade = rating;
                }
                if(review.name || review.grade || review.review) {
                    updateReview(review)
                } else{
                    if(setUpdateMode) {
                        setUpdateMode(false);
                    }
                }
            }
        }
    }
    useEffect(() => {
        if (setOpenForm && (createReviewSuccess || updateReviewSuccess)) {
            setOpenForm(false)
        }
    }, [createReviewSuccess, updateReviewSuccess])

    return (
        <Box sx={theme => ({
            m: '20px 0 30px 0',
            borderRadius: '3px',
            border: '1px solid rgb(151, 149, 149);',
            padding: '40px',
            [theme.breakpoints.down("md")]: {
                p: '30px'
            },
            [theme.breakpoints.down("sm")]: {
                p: '30px 20px'
            },
        })}>
            <StyledTextField
                sx={theme => ({
                    width: '300px',
                    mb: '20px',
                    [theme.breakpoints.down("sm")]: {
                        width: '100%',
                    },
                })}
                label="Ваше имя"
                color="customColor"
                value={name}
                onChange={e => setName(e.target.value)}
                size={mobile ? 'small' : 'medium'}
            />
            <StyledTextField
                fullWidth
                label="Комментарий"
                color="customColor"
                multiline
                minRows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                sx={{ mb: '20px' }}
                size={mobile ? 'small' : 'medium'}
            />
            <Typography sx={{ fontSize: 'inherit', color: 'rgb(218, 217, 217);' }}>Ваша оценка<span style={{ color: '#d32f2f', fontSize: '0.9em' }}> *</span></Typography>
            {showError && <Typography sx={{ fontSize: '0.8em', color: '#d32f2f' }}>Это поле является обязательным</Typography>}
            <Box sx={{
                color: 'rgb(168, 167, 167)',
                display: 'flex',
                alignItems: 'center',
                m: '10px 0 20px 0'
            }}>
                <Rating
                    precision={0.5}
                    name="no-value"
                    size={mobile ? 'medium' : "large"}
                    value={rating}
                    onChange={(event: React.SyntheticEvent, value: number | null) => changeRating(event, value)}
                    onChangeActive={(_, newHover) => {
                        setHover(newHover);
                    }}
                />
                {!mobile && <>
                    — <Typography component='span' sx={{ ml: '5px', }}>
                        {ReviewFormLabels[hover !== -1 ? hover : rating !== null ? rating : 'empty']}
                    </Typography>
                </>
                }
            </Box>
            {myGrade === null ?
                <LoadingButton
                    variant='outlined'
                    size={mobile ? 'small' : 'medium'}
                    color='customColor'
                    loading={createReviewLoading}
                    onClick={() => clickPublicReview()}
                >Опубликовать отзыв</LoadingButton>
                : <Box>
                    <Button
                        variant='outlined'
                        color='customColor'
                        size={mobile ? 'small' : 'medium'}
                        startIcon={<CancelOutlinedIcon />}
                        onClick={() => {
                            if (setUpdateMode) {
                                setUpdateMode(false)
                            }
                        }}
                        disabled={updateReviewLoading ? true : false}
                    >Отменить {!mobile && 'изменения'}</Button>
                    <LoadingButton
                        sx={theme => ({
                            ml: '15px',
                        })}
                        variant='outlined'
                        color='customColor'
                        size={mobile ? 'small' : 'medium'}
                        onClick={() => clickPublicReview('update')}
                        loading={updateReviewLoading}
                        startIcon={<PublishedWithChangesIcon />}
                    > Сохранить {!mobile && 'изменения'}</LoadingButton>
                </Box>
            }
        </Box>
    );
};

export default ReviewForm;