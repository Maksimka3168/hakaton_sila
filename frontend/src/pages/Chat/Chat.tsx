import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './Chat.module.css';
import sengimg from '../../assets/sendimg.png';
import userAvatar from '../../assets/profile.png';
import modelAvatar from '../../assets/model.png';
import config from '../../config/enviroments'
interface Message {
  sender: string;
  text: string;
  isAnimated: boolean;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { sender: 'You', text: inputValue, isAnimated: true }]);
      setInputValue(''); 

      try {
        const response = await axios.post(`${config.baseApiUrl}predict`, {
          text: inputValue,
        });

        const { point_label, type_label, serial_number } = response.data;
        const modelResponse = `Точка отказа: ${point_label}.\nТип оборудования: ${type_label}.\nСерийный номер: ${serial_number}`;

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'Model', text: modelResponse, isAnimated: true },
        ]);
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
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
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      handleSend();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className={classes.main}>
      <div className={classes.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${classes.messageWrapper} ${
              message.sender === 'You' ? classes.userWrapper : classes.modelWrapper
            }`}
          >
            <div className={classes.avatar}>
              <img
                src={message.sender === 'You' ? userAvatar : modelAvatar}
                alt={`${message.sender} avatar`}
                className={classes.avatarImage}
              />
            </div>
            <div
              className={`${classes.message} ${
                message.sender === 'You' ? classes.userMessage : classes.modelMessage
              } ${message.isAnimated ? classes.animatedMessage : ''}`}
            >
              <div
                className={`${classes.sender} ${
                  message.sender === 'You' ? classes.userSender : classes.modelSender
                }`}
              >
                {message.sender}
              </div>
              <div
                className={`${classes.text} ${
                  message.sender === 'You' ? classes.userText : classes.modelText
                }`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={classes.inputBackgroundContainer}>
        <div className={classes.textInputContainer}>
          <input
            className={classes.textInput}
            type="text"
            placeholder="Введите текст..."
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className={classes.sendButton} onClick={handleSend}>
            <img src={sengimg} alt="Send" />
          </button>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
}

export default Chat;
