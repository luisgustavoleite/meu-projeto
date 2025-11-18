// ===== SISTEMA DE NAVEGAÇÃO E INTERATIVIDADE =====

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeFormValidation();
  initializeModals();
});

// Sistema de Navegação
function initializeNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Menu Hamburger
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }
  
  // Fechar menu ao clicar em um link (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Fechar menu ao clicar fora (mobile)
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && 
        !e.target.closest('.nav') && 
        navMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Ativar link atual
  highlightCurrentPage();
}

// Destacar página atual no menu
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

// Sistema de Formulário
function initializeFormValidation() {
  const form = document.getElementById('formCadastro');
  
  if (!form) return;
  
  // Aplicar máscaras
  applyInputMasks();
  
  // Validação do formulário
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
      showConfirmationModal();
      this.reset();
    } else {
      showToast('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
    }
  });
  
  // Validação em tempo real
  form.addEventListener('input', function(e) {
    if (e.target.hasAttribute('required')) {
      validateField(e.target);
    }
  });
}

// Aplicar máscaras nos campos
function applyInputMasks() {
  // Máscara para CPF
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      e.target.value = value;
    });
  }
  
  // Máscara para telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      e.target.value = value;
    });
  }
  
  // Máscara para CEP
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      e.target.value = value;
    });
  }
}

// Validar campo individual
function validateField(field) {
  const isValid = field.checkValidity();
  
  if (field.value.trim() === '') {
    field.classList.remove('valid', 'invalid');
    return;
  }
  
  if (isValid) {
    field.classList.add('valid');
    field.classList.remove('invalid');
  } else {
    field.classList.add('invalid');
    field.classList.remove('valid');
  }
  
  return isValid;
}

// Validar formulário completo
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  // Validar pelo menos uma opção de ajuda selecionada
  const helpOptions = form.querySelectorAll('input[name="tipoAjuda"]:checked');
  if (helpOptions.length === 0) {
    isValid = false;
    showToast('Selecione pelo menos uma forma de ajudar.', 'warning');
  }
  
  return isValid;
}

// Sistema de Modais
function initializeModals() {
  const modal = document.getElementById('confirmationModal');
  const closeModal = document.querySelector('.modal-close');
  
  if (modal && closeModal) {
    closeModal.addEventListener('click', closeConfirmationModal);
    
    // Fechar modal clicando fora
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeConfirmationModal();
      }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeConfirmationModal();
      }
    });
  }
}

// Mostrar modal de confirmação
function showConfirmationModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Fechar modal de confirmação
function closeConfirmationModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Sistema de Toast Notifications
function showToast(message, type = 'info') {
  // Remover toasts existentes
  removeExistingToasts();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="alert-icon">${getToastIcon(type)}</span>
    <span class="toast-message">${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, 5000);
}

function removeExistingToasts() {
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  });
}

function getToastIcon(type) {
  const icons = {
    success: '✓',
    error: '⚠',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[type] || 'ℹ';
}

// Utilitários Globais
window.closeModal = closeConfirmationModal;

// Smooth Scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
