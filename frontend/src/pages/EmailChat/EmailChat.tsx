import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './EmailChat.module.css';
import userAvatar from '../../assets/profile.png';
import modelAvatar from '../../assets/model.png';
import config from '../../config/enviroments'
interface Message {
  sender: string;
  text: string;
  isAnimated: boolean;
}

interface EmailChatProps {
  onLogout: () => void;
}

function EmailChat({ onLogout }: EmailChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAccessToken = () => localStorage.getItem('accessToken');

  const fetchUnreadMessages = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error('Токен доступа не найден');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${config.baseApiUrl}mail/unread?token=${accessToken}`);
      console.log('Данные ответа API:', response.data);

      if (response.data && response.data.length > 0) {
        for (const email of response.data) {
          const inputValue = `Тема: ${email.subject}\nСообщение: ${email.body}`;
          
          const emailMessage = {
            sender: email.from_,
            text: inputValue,
            isAnimated: true,
          };
          setMessages((prevMessages) => [...prevMessages, emailMessage]);

          try {
            const predictResponse = await axios.post(`${config.baseApiUrl}predict`, {
              text: inputValue,
            });

            const { point_label, type_label, serial_number } = predictResponse.data;
            const modelResponse = `Точка отказа: ${point_label}.\nТип оборудования: ${type_label}.\nСерийный номер: ${serial_number}`;

            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: 'Model', text: modelResponse, isAnimated: true },
            ]);
          } catch (predictError) {
            console.error('Ошибка при отправке запроса:', predictError);
            toast.error('Ошибка при отправке запроса на сервер. Попробуйте позже.', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'System', text: 'Почта пустая', isAnimated: true },
        ]);
      }
    } catch (error) {
      console.error('Ошибка при получении сообщений:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchUnreadMessages();
  }, []);

  return (
    <main className={classes.main}>
      <div className={classes.messagesContainer}>
        {messages.map((message, index) => (
          <div key={index} className={`${classes.messageWrapper} ${classes.modelWrapper}`}>
            <div className={classes.avatar}>
              <img
                src={message.sender === 'Model' ? modelAvatar : userAvatar}
                alt={`${message.sender} avatar`}
                className={classes.avatarImage}
              />
            </div>
            <div
              className={`${classes.message} ${classes.modelMessage} ${
                message.isAnimated ? classes.animatedMessage : ''
              }`}
            >
              <div className={`${classes.sender} ${classes.modelSender}`}>
                {message.sender}
              </div>
              <div className={`${classes.text} ${classes.modelText}`}>
                {message.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={classes.buttonContainer}>
        <button className={classes.checkemail} onClick={fetchUnreadMessages} disabled={loading}>
          {loading ? 'Идет проверка почты...' : 'Проверить почту'}
        </button>
        <button className={classes.logoutButton} onClick={onLogout}>
          Выйти
        </button>
      </div>
      <ToastContainer />
    </main>
  );
}

export default EmailChat;
