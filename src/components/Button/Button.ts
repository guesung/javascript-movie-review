import './style.css';

interface ButtonProps {
  className: string[] | string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = {
  createTemplate({ className, text, disabled, onClick }: ButtonProps) {
    const button = document.createElement('button');
    button.classList.add(...className);
    button.textContent = text;

    if (onClick) this.setEventListener(button, onClick);
    button.disabled = !!disabled;
    return button;
  },

  setEventListener(button: HTMLButtonElement, onClick: () => void) {
    button.addEventListener('click', onClick);
  },
};

export default Button;
