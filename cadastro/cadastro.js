// cadastro.js (USANDO sessionStorage)

const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
    formCadastro.addEventListener('submit', handleCadastro);
}

function handleCadastro(e) {
    e.preventDefault(); 
    
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    
    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    // 1. Verifica se o usuário JÁ existe no sessionStorage
    const storedUsersJSON = sessionStorage.getItem('appUsers');
    const users = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];

    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
        alert("Falha: Este e-mail já está cadastrado no seu navegador.");
        return;
    }

    // 2. Adiciona o novo usuário
    const newUser = { email: email, senha: senha };
    users.push(newUser);

    // 3. Armazena a lista ATUALIZADA de volta no sessionStorage
    sessionStorage.setItem('appUsers', JSON.stringify(users));

    alert("✅ Cadastro local realizado com sucesso! Redirecionando para o Login.");
    window.location.href = 'login.html'; 
}

// script.js

