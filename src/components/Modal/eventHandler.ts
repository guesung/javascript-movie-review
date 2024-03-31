import isElement from '../../utils/isElement';

const escKeyListener = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    removeModal();
  }
};

const removeModal = () => {
  const modal = document.querySelector('.modal');
  if (!isElement(modal)) return;

  modal.classList.remove('modal--open');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', escKeyListener);
};

export const onPropagationContainer = () => {
  const modalContainer = document.querySelector('.modal-container');

  if (isElement(modalContainer)) {
    modalContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
};

export const onCloseModal = () => {
  const dimmer = document.querySelector('.modal-backdrop');
  const modal = document.querySelector('.modal');

  if (!isElement(dimmer) || !isElement(modal)) return;

  dimmer.addEventListener('click', () => {
    modal.classList.remove('modal--open');
    document.body.classList.remove('modal-open');
  });
};

export const onOpenModal = () => {
  const modal = document.querySelector('.modal');
  if (!isElement(modal)) return;

  modal.classList.add('modal--open');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', escKeyListener);
};

export const onCloseButtonClick = () => {
  const closeButton = document.querySelector('.close-text');
  if (!isElement(closeButton)) return;

  closeButton.addEventListener('click', removeModal);
};
