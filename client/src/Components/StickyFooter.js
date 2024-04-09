import { useEffect, useState } from 'react';
import classNames from 'classnames';

import './StickyFooter.scss';

function StickyFooter({ children, className }) {
  const [isScrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY >= document.documentElement.scrollHeight - window.innerHeight);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <div className={classNames('sticky-footer', { 'sticky-footer--scrolled': isScrolled }, className)}>{children}</div>;
}

export default StickyFooter;
