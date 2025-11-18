// ===== SISTEMA DE VALIDAÇÃO AVANÇADA =====

class FormValidator {
    static init() {
        this.setupFormValidation();
        this.setupRealTimeValidation();
        this.setupCustomValidation();
        
        console.log('✅ Sistema de validação inicializado');
    }

    static setupFormValidation() {
        const forms = document.querySelectorAll('form[novalidate]');
        forms.forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
    }

    static setupRealTimeValidation() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.validateField(e.target);
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.validateField(e.target, true);
            }
        });
    }

    static setupCustomValidation() {
        // Validação customizada de CPF
        this.addCustomValidator('cpf', this.validateCPF.bind(this));
        
        // Validação customizada de telefone
        this.addCustomValidator('telefone', this.validatePhone.bind(this));
        
        // Validação customizada de CEP
        this.addCustomValidator('cep', this.validateCEP.bind(this));
        
        // Validação de data de nascimento
        this.addCustomValidator('dataNascimento', this.validateBirthDate.bind(this));
    }

    static addCustomValidator(fieldName, validator) {
        const fields = document.querySelectorAll(`[name="${fieldName}"]`);
        fields.forEach(field => {
            field.addEventListener('blur', () => validator(field));
        });
    }

    static handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        if (this.validateForm(form)) {
            this.handleValidForm(form);
        } else {
            this.handleInvalidForm(form);
        }
    }

    static validateForm(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        // Reset de validações anteriores
        this.clearValidationStates(form);

        fields.forEach(field => {
            if (!this.validateField(field, true)) {
                isValid = false;
            }
        });

        // Validações customizadas adicionais
        if (!this.validateHelpOptions(form)) {
            isValid = false;
        }

        return isValid;
    }

    static validateField(field, showFeedback = false) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Validações básicas
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Este campo é obrigatório';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Digite um email válido';
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            message = 'Digite um telefone válido';
        }

        // Validações customizadas por tipo
        switch (field.name) {
            case 'cpf':
                if (value && !this.isValidCPF(value)) {
                    isValid = false;
                    message = 'CPF inválido';
                }
                break;
            case 'cep':
                if (value && !this.isValidCEP(value)) {
                    isValid = false;
                    message = 'CEP inválido';
                }
                break;
            case 'dataNascimento':
                if (value && !this.isValidBirthDate(value)) {
                    isValid = false;
                    message = 'Data de nascimento inválida';
                }
                break;
        }

        // Aplicar estado visual
        this.setFieldState(field, isValid, message, showFeedback);

        return isValid;
    }

    static setFieldState(field, isValid, message, showFeedback) {
        // Remover estados anteriores
        field.classList.remove('valid', 'invalid');
        
        if (field.value.trim() === '') {
            return; // Campo vazio, não mostrar estado
        }

        if (isValid) {
            field.classList.add('valid');
            this.showFieldSuccess(field);
        } else {
            field.classList.add('invalid');
            if (showFeedback) {
                this.showFieldError(field, message);
            }
        }
    }

    static showFieldError(field, message) {
        this.removeFieldFeedback(field);
        
        const feedback = document.createElement('div');
        feedback.className = 'field-error';
        feedback.innerHTML = `
            <span class="error-icon">⚠</span>
            <span class="error-message">${message}</span>
        `;
        
        field.parentNode.appendChild(feedback);
        
        // Scroll suave para o campo com erro
        field.focus({ preventScroll: true });
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    static showFieldSuccess(field) {
        this.removeFieldFeedback(field);
        
        const feedback = document.createElement('div');
        feedback.className = 'field-success';
        feedback.innerHTML = `
            <span class="success-icon">✓</span>
            <span class="success-message">Campo válido</span>
        `;
        
        field.parentNode.appendChild(feedback);
    }

    static removeFieldFeedback(field) {
        const existingFeedback = field.parentNode.querySelector('.field-error, .field-success');
        if (existingFeedback) {
            existingFeedback.remove();
        }
    }

    static clearValidationStates(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('valid', 'invalid');
            this.removeFieldFeedback(field);
        });
    }

    static validateHelpOptions(form) {
        const helpOptions = form.querySelectorAll('input[name="tipoAjuda"]:checked');
        if (helpOptions.length === 0) {
            UIManager.showToast('Selecione pelo menos uma forma de ajudar', 'warning');
            return false;
        }
        return true;
    }

    // VALIDAÇÕES ESPECÍFICAS
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    static isValidCPF(cpf) {
        // Remover caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');
        
        // Verificar se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verificar se não é uma sequência de números iguais
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Algoritmo de validação de CPF
        let sum = 0;
        let remainder;
        
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
        
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    }

    static isValidCEP(cep) {
        const cepRegex = /^\d{5}-\d{3}$/;
        return cepRegex.test(cep);
    }

    static isValidBirthDate(date) {
        const birthDate = new Date(date);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 100);
        
        return birthDate <= today && birthDate >= minDate;
    }

    // Métodos para validações customizadas
    static validateCPF(field) {
        if (field.value.trim() && !this.isValidCPF(field.value)) {
            this.setFieldState(field, false, 'CPF inválido', true);
            return false;
        }
        return true;
    }

    static validatePhone(field) {
        if (field.value.trim() && !this.isValidPhone(field.value)) {
            this.setFieldState(field, false, 'Telefone inválido', true);
            return false;
        }
        return true;
    }

    static validateCEP(field) {
        if (field.value.trim() && !this.isValidCEP(field.value)) {
            this.setFieldState(field, false, 'CEP inválido', true);
            return false;
        }
        return true;
    }

    static validateBirthDate(field) {
        if (field.value.trim() && !this.isValidBirthDate(field.value)) {
            this.setFieldState(field, false, 'Data de nascimento inválida', true);
            return false;
        }
        return true;
    }

    static handleValidForm(form) {
        UIManager.showToast('Formulário validado com sucesso!', 'success');
        
        // Simular envio
        setTimeout(() => {
            FormManager.handleFormSubmission(form);
        }, 1000);
    }

    static handleInvalidForm(form) {
        UIManager.showToast('Por favor, corrija os erros no formulário', 'error');
        
        // Encontrar primeiro campo com erro e focar nele
        const firstError = form.querySelector('.invalid');
        if (firstError) {
            firstError.focus();
        }
    }
}
