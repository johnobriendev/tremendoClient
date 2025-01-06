//src/utils/portalManager.js


// This function either finds or creates the root container for all modals
export const getOrCreateModalRoot = () => {
  let modalRoot = document.getElementById('modal-root');
  // If no modal root, create one
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }
  return modalRoot;
};

// use this counter to keep track of how many components need the modal root
let portalUsers = 0;

// Components call this when they mount and might need to show a modal
export const registerPortalUser = () => {
  portalUsers++;
};

// Components call this when they unmount
export const unregisterPortalUser = () => {
  portalUsers--;
  // Only remove the modal root when no components need it anymore
  if (portalUsers === 0) {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.remove();
    }
  }
};