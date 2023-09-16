import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import './Auth.css'
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../../utils/consts';
import { useState, useEffect } from 'react';
import { authApiUser } from '../../services/authService';
import { IResponseError } from '../../models/response/IResponceError';
import Loader from '../../components/Loader/Loader';
import { NavbarHeight } from '../../components/Navbar/Navbar';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { StyledTextField } from '../../components/styledElements/styledTextField';



const Auth = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [triggerRegistration, resultRegistration] = authApiUser.useRegistrationMutation();

    const [triggerLogin, resultLogin] = authApiUser.useLoginMutation();

    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    useEffect(() => {
        let err
        if (resultRegistration.isError && !isLogin) {
            err = resultRegistration.error as IResponseError;
        }
        if (resultLogin.isError && isLogin) {
            err = resultLogin.error as IResponseError;
        }
        if (err) {
            if (err.data.type.split(' ')[0] == 'email') {
                setEmailMessage(err.data.message);
            } else if (err.data.type.split(' ')[0] == 'password') {
                setPasswordMessage(err.data.message);
            }
        }

    }, [resultRegistration.isError, resultLogin.isError])

    useEffect(() => {
        if (resultLogin.isSuccess || resultRegistration.isSuccess) {
            if (!isLogin) {
                setOpenSnackbar(true);
            } else {
                navigate("/");
            }
        }
    }, [resultLogin.isSuccess, resultRegistration.isSuccess])

    function clickRegButton(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            email: {
                value: string
                checkValidity: () => boolean,
            };
            password: {
                value: string,
                checkValidity: () => boolean
            };
        };
        if (email && password && target.email.checkValidity() && target.password.checkValidity()) {
            console.log('Всё ок')
            if (!isLogin) {
                triggerRegistration({ email, password, role: 'ADMIN' });
            } else {
                triggerLogin({ email, password });
            }
        }

    }

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    function blurEmailInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) {
        if (!email) {
            setEmailMessage(`Поле email не может быть пустым`)
        }
        if (e.target.validationMessage) {
            setEmailMessage(e.target.validationMessage);
        }

    }
    function blurPasswordInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) {
        if (!password) {
            setPasswordMessage(`Поле password не может быть пустым`)
        }
        if (e.target.validationMessage) {
            setPasswordMessage(e.target.validationMessage);
        }
    }

    return (
        <Box className='Auth' style={{ height: `calc(100vh - ${NavbarHeight + 5}px` }}>
            <form className='Auth-form' onSubmit={e => { clickRegButton(e) }}>
                <h2 className='Auth-form__title'>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <StyledTextField
                    type='email'
                    name='email'
                    size='small'
                    placeholder='Введите email'
                    className='Auth-form__data'
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        setEmailMessage('')
                    }}
                    onBlur={e => blurEmailInput(e)}
                    onFocus={() => setEmailMessage('')}
                    error={emailMessage ? true : false}
                    sx={theme => ({
                        '& :valid': {
                            borderColor: email ? theme.palette.success.light : ''
                        }
                    })}
                    helperText={emailMessage ? emailMessage : ' '}
                />
                <StyledTextField
                    inputProps={{ maxLength: 32, minLength: 3 }}
                    type='password'
                    name='password'
                    size='small'
                    className='Auth-form__data'
                    value={password}
                    placeholder='Введите пароль'
                    onChange={e => {
                        setPassword(e.target.value);
                        setPasswordMessage('');
                    }}
                    onFocus={() => setPasswordMessage('')}
                    sx={theme => ({
                        '& :valid': {
                            borderColor: password ? theme.palette.success.light : ''
                        }
                    })}
                    error={passwordMessage ? true : false}
                    helperText={passwordMessage ? passwordMessage : ' '}
                    onBlur={e => blurPasswordInput(e)} />
                <div className='Auth-form__button__wrap'>
                    {isLogin ?
                        <p>Нет аккаунта? <NavLink to={REGISTRATION_ROUTE} onClick={() => {
                            setEmailMessage('');
                            setPasswordMessage('')
                            setEmail('')
                            setPassword('')
                        }}>Зарегистрируйся!</NavLink></p>
                        : <p>Уже есть аккаунт? <NavLink to={LOGIN_ROUTE} onClick={() => {
                            setEmailMessage('');
                            setPasswordMessage('')
                            setEmail('')
                            setPassword('')
                        }}>Войдите!</NavLink></p>
                    }
                    {
                            <LoadingButton
                                variant="outlined"
                                color='customColor'
                                className='Auth-form__button'
                                type="submit"
                                loading={(resultLogin.isLoading || resultRegistration.isLoading)}
                            >{isLogin ? 'Войти' : 'Регистрация'}
                            </LoadingButton>
                    }
                </div>
            </form>
            <Snackbar
                sx={{ width: 'auto' }}
                color='secondary'
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info" sx={{ width: '100%' }} onClose={handleClose}>
                    На вашу почту {email} выслано сообщение
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Auth;