import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import EmailChat from '../EmailChat/EmailChat';
import classes from './Email.module.css';
import emaillogin from '../../assets/emaillogin.png';
import config from '../../config/enviroments'
function Email() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    console.log('Токен из localStorage:', storedToken);

    if (storedToken) {
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
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Введите корректный email');
      return;
    }

    try {
      const response = await axios.post(`${config.baseApiUrl}mail/auth`, {
        email,
        password,
      });
      
      const { access_token } = response.data;
      
      if (access_token) {
        toast.success('Успешная авторизация');
        setIsAuthenticated(true);
        localStorage.setItem('accessToken', access_token); 
      } else {
        toast.error('Ошибка авторизации. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      toast.error('Ошибка авторизации. Проверьте данные и попробуйте снова.');
    }
  };

  const handleLogout = () => {
    console.log('Выход из аккаунта');
    localStorage.removeItem('accessToken');
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
