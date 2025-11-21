# Guia de Contribuição

Obrigado por considerar contribuir com a Plataforma ONG!

## Como Contribuir

### 1. Reportar Bugs
- Use o template de bug report
- Inclua steps para reproduzir
- Adicione screenshots se aplicável
- Especifique ambiente (browser, OS)

### 2. Sugerir Funcionalidades
- Descreva a funcionalidade claramente
- Explique o benefício para usuários
- Considere impactos na acessibilidade

### 3. Submeter Pull Requests

#### Processo
1. Fork o repositório
2. Crie branch a partir de `develop`
3. Siga as convenções de código
4. Adicione testes se aplicável
5. Atualize documentação
6. Submeta PR para `develop`

#### Convenções de Código

##### HTML
```html
<!-- Use landmarks ARIA -->
<header role="banner">
<nav role="navigation" aria-label="Principal">
<main role="main">
<footer role="contentinfo">

<!-- Sempre forneça alt text -->
<img src="..." alt="Descrição significativa">

<!-- Use labels para todos os inputs -->
<label for="email">E-mail</label>
<input type="email" id="email">
