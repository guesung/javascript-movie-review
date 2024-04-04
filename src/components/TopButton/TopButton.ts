import { $ } from '../../utils/dom';

const TopButton = () => {
  const topButton = document.createElement('button');

  topButton.classList.add('top-button', 'hide-top-button');
  topButton.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.5129 4.59375H4.48711C4.36406 4.59375 4.26562 4.69219 4.26562 4.8125V6.45312C4.26562 6.57344 4.36406 6.67188 4.48711 6.67188H23.5129C23.6359 6.67188 23.7344 6.57344 23.7344 6.45312V4.8125C23.7344 4.69219 23.6359 4.59375 23.5129 4.59375ZM14.1723 9.70703C14.1518 9.68089 14.1257 9.65974 14.0958 9.6452C14.066 9.63066 14.0332 9.6231 14 9.6231C13.9668 9.6231 13.934 9.63066 13.9042 9.6452C13.8743 9.65974 13.8482 9.68089 13.8277 9.70703L10.7652 13.5816C10.74 13.6139 10.7243 13.6526 10.72 13.6933C10.7157 13.734 10.723 13.7751 10.741 13.8119C10.7589 13.8487 10.7869 13.8797 10.8216 13.9014C10.8564 13.923 10.8966 13.9345 10.9375 13.9344H12.9582V23.1875C12.9582 23.3078 13.0566 23.4062 13.177 23.4062H14.8176C14.9379 23.4062 15.0363 23.3078 15.0363 23.1875V13.9371H17.0625C17.2457 13.9371 17.3469 13.7266 17.2348 13.5844L14.1723 9.70703Z" fill="#F33F3F"/>
    </svg>
  `;

  topButton.addEventListener('click', () => {
    const header = $('header') as HTMLElement;
    window.scrollTo({
      top: header.offsetTop,
      behavior: 'smooth',
    });
  });

  return topButton;
};

export default TopButton;
