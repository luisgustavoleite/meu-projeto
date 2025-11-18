// ===== UTILITÁRIOS GLOBAIS =====

class Utils {
    // DEBOUNCE E THROTTLE
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // FORMATAÇÃO
    static formatarCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatarTelefone(telefone) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    static formatarCEP(cep) {
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    static formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    static formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    // VALIDAÇÕES
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validarURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // MANIPULAÇÃO DE STRINGS
    static capitalizar(texto) {
        return texto.replace(/\b\w/g, l => l.toUpperCase());
    }

    static truncar(texto, limite, sufixo = '...') {
        return texto.length > limite ? texto.substring(0, limite) + sufixo : texto;
    }

    static removerAcentos(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // MANIPULAÇÃO DE ARRAYS
    static shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    static uniqueArray(array, key = null) {
        if (key) {
            const seen = new Set();
            return array.filter(item => {
                const value = item[key];
                return seen.has(value) ? false : seen.add(value);
            });
        }
        return [...new Set(array)];
    }

    // MANIPULAÇÃO DE OBJETOS
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static mergeObjects(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                target[key] = this.mergeObjects(target[key] || {}, source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    // LOCAL STORAGE HELPERS
    static getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    static setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    static removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    }

    // COOKIES
    static setCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    static getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }

    // DATAS E HORAS
    static formatarDataRelativa(data) {
        const now = new Date();
        const diff = now - new Date(data);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'agora mesmo';
        if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
        if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;
        
        return this.formatarData(data);
    }

    static diferencaEntreDatas(data1, data2) {
        const diff = Math.abs(new Date(data1) - new Date(data2));
        return {
            dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
            horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        };
    }

    // RANDOM
    static gerarId(prefix = '') {
        return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }

    static gerarCorAleatoria() {
        return `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }

    // DOM
    static $(seletor) {
        return document.querySelector(seletor);
    }

    static $$(seletor) {
        return document.querySelectorAll(seletor);
    }

    static criarElemento(tag, atributos = {}, conteudo = '') {
        const element = document.createElement(tag);
        
        Object.keys(atributos).forEach(key => {
            if (key === 'className') {
                element.className = atributos[key];
            } else {
                element.setAttribute(key, atributos[key]);
            }
        });
        
        if (conteudo) element.innerHTML = conteudo;
        return element;
    }

    // ANIMAÇÕES
    static animarScrollPara(elemento, offset = 0) {
        const element = typeof elemento === 'string' ? this.$(elemento) : elemento;
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    static toggleVisibilidade(elemento, duracao = 300) {
        const element = typeof elemento === 'string' ? this.$(elemento) : elemento;
        if (!element) return;

        const isHidden = element.style.display === 'none';
        
        if (isHidden) {
            element.style.display = 'block';
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transition = `opacity ${duracao}ms ease`;
            }, 10);
        } else {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duracao}ms ease`;
            
            setTimeout(() => {
                element.style.display = 'none';
            }, duracao);
        }
    }

    // PERFORMANCE
    static medirPerformance(nome, callback) {
        const start = performance.now();
        const resultado = callback();
        const end = performance.now();
        
        console.log(`⏱️ ${nome}: ${(end - start).toFixed(2)}ms`);
        return resultado;
    }

    // ERROR HANDLING
    static tratarErro(erro, contexto = '') {
        console.error(`🚨 Erro${contexto ? ` em ${contexto}` : ''}:`, erro);
        
        // Disparar evento global de erro
        const event = new CustomEvent('appError', {
            detail: { error: erro, context: contexto }
        });
        document.dispatchEvent(event);
        
        return {
            sucesso: false,
            erro: erro.message,
            contexto: contexto
        };
    }

    // EXPORTAÇÃO E IMPORTACAÇÃO
    static exportarParaJSON(dados, nomeArquivo) {
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo || `export-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    static importarDeJSON(arquivo) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const dados = JSON.parse(e.target.result);
                    resolve(dados);
                } catch (erro) {
                    reject(erro);
                }
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(arquivo);
        });
    }
}

// Utilitários globais para uso fácil
window.$ = Utils.$;
window.$$ = Utils.$$;
