import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import EmailChat from '../EmailChat/EmailChat';
import classes from './Email.module.css';
import emaillogin from '../../assets/emaillogin.png';
import config from '../../config/enviroments';

function Email() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
        const password = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

        if (!email || !password) {
            toast.error('Пожалуйста, введите все данные');
            return;
        }

        try {
            const response = await axios.post(`${config.baseApiUrl}mail/auth`, { email, password });
            const { access_token } = response.data;

            if (access_token) {
                localStorage.setItem('accessToken', access_token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`; 
                setIsAuthenticated(true);
                toast.success('Успешная авторизация');
            } else {
                toast.error('Ошибка авторизации. Попробуйте еще раз.');
            }
        } catch (error) {
            toast.error('Ошибка авторизации. Проверьте данные и попробуйте снова.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        toast.info('Вы вышли из аккаунта');
    };

    if (isAuthenticated) {
        return <EmailChat onLogout={handleLogout} />;
    }

    return (
        <main className={classes.main}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className={classes.container}>
                <div className={classes.imageContainer}>
                    <div className={classes.imagePlaceholder}>
                        <img src={emaillogin} alt="Email login" />
                    </div>
                </div>
                <div className={classes.form}>
                    <h2 className={classes.heading}>С возвращением!</h2>
                    <p className={classes.subheading}>Введите ваши данные</p>
                    <form className={classes.formContent} onSubmit={handleLoginSubmit}>
                        <label htmlFor="email" className={classes.label}>Почта</label>
                        <input type="email" id="email" name="email" placeholder="Введите почту" className={classes.input} required />
                        <label htmlFor="password" className={classes.label}>Пароль</label>
                        <input type="password" id="password" name="password" placeholder="Введите пароль" className={classes.input} required />
                        <button type="submit" className={classes.submitButton}>Авторизироваться</button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Email;
