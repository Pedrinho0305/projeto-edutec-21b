// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Chave usada para verificar o status de login
    const USUARIO_ATIVO_KEY = 'usuarioAtivo'; 
    
    // 1. Elementos HTML que precisamos manipular
    const loginLink = document.querySelector('a[href="./cadastro/login.html"]');
    const userStatusDisplay = document.getElementById('user-status-display');
    const navBar = document.querySelector('nav');

    // Verifica o status de login no sessionStorage
    const userEmail = sessionStorage.getItem(USUARIO_ATIVO_KEY);

    // =======================================================
    // FUNÇÃO DE LOGOUT
    // =======================================================
    function handleLogout(event) {
        event.preventDefault(); // Impede o link de navegar
        sessionStorage.removeItem(USUARIO_ATIVO_KEY); // Remove o email
        // Recarrega a página principal para atualizar o estado
        window.location.reload(); 
    }

    if (userEmail) {
        // =======================================================
        // AÇÕES SE O USUÁRIO ESTIVER LOGADO (CADASTRADO)
        // =======================================================
        
        console.log(`Usuário ativo: ${userEmail}. Ocultando link de login.`);
        
        // 1. FAZ A ÂNCORA DE LOGIN SUMIR
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        
        // 2. EXIBE O E-MAIL DO USUÁRIO E O BOTÃO DE SAIR
        if (userStatusDisplay) {
            // Cria um novo elemento para exibir o email
            const emailSpan = document.createElement('span');
            emailSpan.innerHTML = `<img src="./assets/material-symbols_person.svg" alt=""> <strong class = "nome-usuario">${userEmail.split('@')[0]}</strong>`;
            emailSpan.style.marginRight = '10px';
            emailSpan.style.color = '#388e3c'; // Cor verde para indicar sucesso

            // Cria o link de Sair/Logout
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Sair';
            logoutLink.style.color = '#d32f2f'; // Cor vermelha para indicar saída
            logoutLink.style.textDecoration = 'none';
            logoutLink.addEventListener('click', handleLogout);

            // Adiciona os elementos ao contêiner de status
            userStatusDisplay.appendChild(emailSpan);
            userStatusDisplay.appendChild(logoutLink);
        }

    } else {
        // =======================================================
        // AÇÕES SE O USUÁRIO NÃO ESTIVER LOGADO
        // =======================================================
        
        console.log("Nenhum usuário logado. Link 'Fazer login' visível.");
        
        // Garante que o link de login está visível (caso haja manipulação anterior)
        if (loginLink) {
            loginLink.style.display = 'inline';
        }
        // O userStatusDisplay permanece vazio.
    }
});