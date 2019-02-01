const simpleModal = document.getElementById('simple-modal');
const modalBtn = document.getElementById('modal-button');
const closeBtn = document.querySelector('.close_btn');

function openModal() {
  simpleModal.style.display = 'block';
}

function closeModal() {
  simpleModal.style.display = 'none';
}

modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
