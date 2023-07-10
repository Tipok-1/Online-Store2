import { useLocation,NavLink, useNavigate} from 'react-router-dom';
import './Auth.css'
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../../utils/consts';
import { useState, useEffect} from 'react';
import { authApiUser} from '../../services/authService';
import { IResponseError } from '../../models/response/IResponceError';
import Loader from '../../components/Loader/Loader';
import { NavbarHeight } from '../../components/Navbar/Navbar';


const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [triggerRegistration, resultRegistration] = authApiUser.useRegistrationMutation();

    const [triggerLogin, resultLogin] = authApiUser.useLoginMutation();

    const[emailMessage, setEmailMessage] = useState('');
    const[passwordMessage, setPasswordMessage] = useState('');

    useEffect(()=>{
        let err
        if(resultRegistration.isError && !isLogin) {
             err = resultRegistration.error as IResponseError;
        }
        if(resultLogin.isError &&isLogin) {
            err = resultLogin.error as IResponseError;
        }
        if(err) {
            if(err.data.type.split(' ')[0] == 'email') {
                setEmailMessage(err.data.message);
            } else if(err.data.type.split(' ')[0] == 'password') {
                setPasswordMessage(err.data.message);
            }
        }
        
    }, [resultRegistration.isError, resultLogin.isError])

    useEffect(()=>{
        if(resultLogin.isSuccess || resultRegistration.isSuccess) {
            navigate("/");
        }
    }, [resultLogin.isSuccess, resultRegistration.isSuccess])

    function clickRegButton(e: React.FormEvent<HTMLFormElement>){
       e.preventDefault();
       const target = e.target as typeof e.target & {
        email: { 
            value: string
            checkValidity: ()=>boolean,
        };
        password: { 
            value: string,
            checkValidity: ()=>boolean
        };
      };
        if(email && password && target.email.checkValidity() && target.password.checkValidity()) {
            console.log('Всё ок')
            if(!isLogin) {
                triggerRegistration({email, password, role:'ADMIN'});
            } else {
                triggerLogin({email, password});
            }
        }
        
    }
    function blurEmailInput( e: React.FocusEvent<HTMLInputElement, Element>){
        if(!email) {
            setEmailMessage(`Поле email не может быть пустым`)
        }
        if(e.target.validationMessage) {
            setEmailMessage(e.target.validationMessage);
        }
        
    }
    function blurPasswordInput( e: React.FocusEvent<HTMLInputElement, Element>){
        if(!password) {
            setPasswordMessage(`Поле password не может быть пустым`)
        }
        if(e.target.validationMessage) {
            setPasswordMessage(e.target.validationMessage);
        }
    }

    return (
        <div className='Auth' style={{height:`calc(100vh - ${NavbarHeight+5}px`}}>
            <form className='Auth-form' onSubmit={e=>{clickRegButton(e)}}>
                <h2 className='Auth-form__title'>{isLogin? 'Авторизация' : 'Регистрация'}</h2>
                <div className='Auth-form__Input__wrap'>
                    <Input 
                        type='email' 
                        name='email'
                        placeholder='Введите email' 
                        className='Auth-form__data' value={email} 
                        onChange={e=>{
                            setEmail(e.target.value);
                            setEmailMessage('')
                        }}
                        onBlur={e=>blurEmailInput(e)}/>
                    <div className='Auth-form__Validate-message'>{emailMessage}</div>
                </div>
                <div className='Auth-form__Input__wrap'>
                    <Input 
                        minLength={3} 
                        maxLength={32} 
                        type='password' 
                        name='password'
                        className='Auth-form__data' 
                        value={password} 
                        placeholder='Введите пароль' 
                        onChange={e=>{
                            setPassword(e.target.value);
                            setPasswordMessage('');
                        }}
                        onBlur={e=>blurPasswordInput(e)}/>
                    <div className='Auth-form__Validate-message'>{passwordMessage}</div>
                </div>
                <div className='Auth-form__button__wrap'>
                { isLogin ?
                    <p>Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink></p>
                    :<p>Уже есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink></p>
                }
                    {
                        (resultLogin.isLoading || resultRegistration.isLoading) ?
                        <Loader h={35} w={35}/>:
                        <Button className='Auth-form__button'>{isLogin ? 'Войти' : 'Регистрация'}</Button>
                    }
                </div>
            </form>
        </div>
    );
};

export default Auth;