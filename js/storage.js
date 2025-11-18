// ===== SISTEMA DE ARMAZENAMENTO LOCAL =====

class StorageManager {
    static init() {
        this.storageKey = 'ong-platform-data';
        this.initializeData();
        console.log('💾 Sistema de armazenamento inicializado');
    }

    static initializeData() {
        if (!this.getData()) {
            this.setData({
                usuarios: [],
                voluntarios: [],
                doadores: [],
                projetos: [],
                ultimoId: 0,
                configuracoes: {
                    tema: 'claro',
                    notificacoes: true
                }
            });
        }
    }

    // CRUD Básico
    static getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao recuperar dados:', error);
            return null;
        }
    }

    static setData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    // Gerenciamento de Usuários
    static salvarUsuario(usuario) {
        const data = this.getData();
        if (!data) return false;

        usuario.id = this.gerarNovoId();
        usuario.dataCadastro = new Date().toISOString();
        data.usuarios.push(usuario);

        return this.setData(data);
    }

    static obterUsuarios() {
        const data = this.getData();
        return data ? data.usuarios : [];
    }

    static obterUsuarioPorEmail(email) {
        const usuarios = this.obterUsuarios();
        return usuarios.find(user => user.email === email);
    }

    // Gerenciamento de Voluntários
    static salvarVoluntario(voluntario) {
        const data = this.getData();
        if (!data) return false;

        voluntario.id = this.gerarNovoId();
        voluntario.status = 'pendente';
        voluntario.dataCadastro = new Date().toISOString();
        data.voluntarios.push(voluntario);

        // Disparar evento de novo voluntário
        this.dispatchStorageEvent('voluntario-adicionado', voluntario);

        return this.setData(data);
    }

    static obterVoluntarios() {
        const data = this.getData();
        return data ? data.voluntarios : [];
    }

    // Gerenciamento de Projetos
    static salvarProjeto(projeto) {
        const data = this.getData();
        if (!data) return false;

        projeto.id = this.gerarNovoId();
        projeto.dataCriacao = new Date().toISOString();
        projeto.apoiadores = projeto.apoiadores || 0;
        data.projetos.push(projeto);

        return this.setData(data);
    }

    static obterProjetos() {
        const data = this.getData();
        return data ? data.projetos : [];
    }

    static incrementarApoiadores(projetoId) {
        const data = this.getData();
        if (!data) return false;

        const projeto = data.projetos.find(p => p.id === projetoId);
        if (projeto) {
            projeto.apoiadores = (projeto.apoiadores || 0) + 1;
            return this.setData(data);
        }
        return false;
    }

    // Estatísticas
    static obterEstatisticas() {
        const data = this.getData();
        if (!data) return null;

        return {
            totalUsuarios: data.usuarios.length,
            totalVoluntarios: data.voluntarios.length,
            totalDoadores: data.doadores.length,
            totalProjetos: data.projetos.length,
            totalApoiadores: data.projetos.reduce((sum, projeto) => sum + (projeto.apoiadores || 0), 0)
        };
    }

    // Utilitários
    static gerarNovoId() {
        const data = this.getData();
        if (!data) return Date.now();

        data.ultimoId += 1;
        this.setData(data);
        return data.ultimoId;
    }

    static limparDados() {
        try {
            localStorage.removeItem(this.storageKey);
            this.initializeData();
            return true;
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            return false;
        }
    }

    static exportarDados() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-ong-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static importarDados(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (this.validarEstruturaDados(data)) {
                        this.setData(data);
                        resolve(true);
                    } else {
                        reject(new Error('Estrutura de dados inválida'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }

    static validarEstruturaDados(data) {
        return data && 
               Array.isArray(data.usuarios) &&
               Array.isArray(data.voluntarios) &&
               Array.isArray(data.doadores) &&
               Array.isArray(data.projetos) &&
               typeof data.ultimoId === 'number';
    }

    // Eventos personalizados
    static dispatchStorageEvent(type, detail) {
        const event = new CustomEvent(type, { detail });
        document.dispatchEvent(event);
    }

    // Configurações
    static salvarConfiguracao(chave, valor) {
        const data = this.getData();
        if (!data) return false;

        data.configuracoes = data.configuracoes || {};
        data.configuracoes[chave] = valor;

        return this.setData(data);
    }

    static obterConfiguracao(chave) {
        const data = this.getData();
        return data?.configuracoes?.[chave];
    }
}
