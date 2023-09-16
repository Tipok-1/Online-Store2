import { useState, memo, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReviewList from '../ReviewList/ReviewList';
import { REGISTRATION_ROUTE } from '../../utils/consts';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Chip from '@mui/material/Chip';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import { StyledTypography } from '../styledElements/styledTypography';
import { useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import ReviewForm from '../ReviewForm/ReviewForm';
import MyReview from './MyReview'
import { reviewApi } from '../../services/reviewService';
import Loader from '../Loader/Loader';
import { IReview } from '../../models/IReview';
import { authApiUser } from '../../services/authService';
import { useAppDispatch } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice';

interface IReviewComponent {
    deviceId: number,
    reviewsCount: number
}

const Review = ({ deviceId, reviewsCount }: IReviewComponent) => {
    const { isAuth, user, sentEmailConfirmation} = useAppSelector(state => state.userReducer);
    const [sendMessage,{isSuccess:isSuccesSendMessage, isLoading:loadingSendMessage, isError:isErrorSendMessage}] = authApiUser.useSendActivationMessageMutation()
    const dispatch = useAppDispatch();
    const  {
        data: MyReviewData,
        isLoading: MyReviewLoading,
        isSuccess: MyReviewSuccess,
        isFetching:MyReviewFetching
    } = reviewApi.useGetMyDeviceReviewQuery({ deviceId, userId: user.id })

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarError, setSnackbarError] = useState('')
    const [openForm, setOpenForm] = useState(false);
    const navigate = useNavigate();

    function clickLeaveFeedback() {
        setOpenForm(prev => !prev);
    }

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarError('');
        setOpenSnackbar(false);
    };

    const myReviewMemo = useMemo<IReview | null>(() => {
        if (MyReviewSuccess && MyReviewData) {
            const obj: IReview = Object.assign({}, MyReviewData);
            obj.updatedAt = new Date(obj.updatedAt);
            return obj
        }
        return null

    }, [MyReviewData])

    useEffect(()=>{
        if(isSuccesSendMessage) {
            dispatch(userSlice.actions.setSentEmailConfirmation(false)) 
            setOpenSnackbar(true);
        } else if(isErrorSendMessage) {
            dispatch(userSlice.actions.setSentEmailConfirmation(false))
            setSnackbarError("Не удалось отправить сообщение")
            setOpenSnackbar(true);
        }
    },[isSuccesSendMessage, isErrorSendMessage])

    return (
        <>
            <Box>
                {
                    MyReviewLoading || MyReviewFetching ? <Box sx={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader h={20} w={20}></Loader></Box>
                        : (isAuth && user.isActivated && myReviewMemo) &&
                        <MyReview myReview={myReviewMemo} />

                }

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '25px' }}>
                    <StyledTypography variant="h5">Отзывы</StyledTypography>
                    {(!reviewsCount || (isAuth && user.isActivated && MyReviewSuccess && !MyReviewData)) &&
                        <Chip
                            label="ОСТАВИТЬ ОЗЫВ"
                            onClick={() => clickLeaveFeedback()}
                            icon={<ReviewsOutlinedIcon />}
                            sx={theme => ({
                                padding: '5px',
                                [theme.breakpoints.down("md")]: {
                                    fontSize: '12px'
                                },
                            })}
                        />

                    }
                </Box>
                {!isAuth && <Box sx={{ display: 'flex', alignItems: 'center', m: '20px 0' }}>
                    <Typography sx={{
                        whiteSpace: 'pre-wrap',
                        fontSize: 'inherit'
                    }}>Зарегистрируйтесь, чтобы оставлять отзывы</Typography>
                    <Button
                        variant='outlined'
                        color="customColor"
                        sx={{ ml: '10px' }}
                        onClick={() => {
                            window.scrollTo(0, 0);
                            navigate(REGISTRATION_ROUTE)
                        }}>Регистрация</Button>
                </Box>
                }
                {(isAuth && !user.isActivated) &&
                    < Box sx={{ display: 'flex', alignItems: 'center', m: '20px 0' }}>
                        <Typography sx={{
                            whiteSpace: 'pre-wrap',
                            fontSize: 'inherit'
                        }}>Пожалуйста подтвердите свой email адрес, чтобы оставлять отзывы</Typography>
                        <LoadingButton
                            variant='outlined'
                            color="customColor"
                            sx={{ ml: '10px' }}
                            loading={loadingSendMessage ? true : false}
                            disabled={sentEmailConfirmation}
                            onClick={() => { 
                                sendMessage(user.email);
                                dispatch(userSlice.actions.setSentEmailConfirmation(true))
                            }}>Отправить сообщение для подтверждения</LoadingButton>
                    </Box>
                }
                {openForm &&
                    <ReviewForm setOpenForm={setOpenForm}/>
                }
                {reviewsCount ?
                    <Box>
                        <ReviewList deviceId={deviceId} />
                    </Box>
                    : <Typography sx={{
                        whiteSpace: 'pre-wrap',
                        fontSize: 'inherit'
                    }}>Помогите другим пользователям с выбором - будьте первым, кто поделится своим мнением об этом товаре</Typography>
                }
            </Box>
            <Snackbar
                sx={{ width: 'auto' }}
                color='secondary'
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbarError ? 'error' : "info"} sx={{ width: '100%' }} onClose={handleClose}>
                    {snackbarError ?snackbarError :`На вашу почту ${user.email} выслано сообщение`}
                </Alert>
            </Snackbar>
        </>
    );
};

export default memo(Review);