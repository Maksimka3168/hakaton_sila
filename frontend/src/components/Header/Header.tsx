import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classes from './Header.module.css';

function Header() {
  const location = useLocation();
  const [sliderStyle, setSliderStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null); 
  useEffect(() => {
    if (containerRef.current) {  
      const activeTab = containerRef.current.querySelector(`.${classes.active}`) as HTMLElement;
      if (activeTab) {
        setSliderStyle({
          width: `${activeTab.offsetWidth}px`,
          left: `${activeTab.offsetLeft}px`,
        });
      }
    }
  }, [location]);
  
  return (
    <header className={classes.header}>
      <div className={classes.container} ref={containerRef}>
        <div className={`${classes.slider}`} style={sliderStyle}></div>
        <Link
          to="/email"
          className={`${classes.tab} ${location.pathname === '/email' ? classes.active : ''}`}
        >
          Почта
        </Link>
        <Link
          to="/chat"
          className={`${classes.tab} ${location.pathname === '/chat' ? classes.active : ''}`}
        >
          Чат
        </Link>
        <Link
          to="/uploadfile"
          className={`${classes.tab} ${location.pathname === '/uploadfile' ? classes.active : ''}`}
        >
          Загрузка файла
        </Link>
        <Link
          to="/graphics"
          className={`${classes.tab} ${location.pathname === '/graphics' ? classes.active : ''}`}
        >
          Графики
        </Link>
        
      </div>
    </header>
  );
}

export default Header;
