// O URL do endpoint de login do seu backend
const API_LOGIN_URL = "https://backend-dusky-kappa-53.vercel.app/login";

// 1. Obtém o formulário
const formLogin = document.getElementById('form-login'); 
// Se você não tiver um <form id="form-login">, use o botão diretamente:
const button = document.querySelector("button"); 

// 2. Adiciona o Listener
if (formLogin) {
    formLogin.addEventListener('submit', handleLogin);
} else if (button) {
    button.addEventListener('click', handleLogin);
}


/**
 * Função principal para lidar com o login.
 * Realiza validações e envia as credenciais para a API.
 */
async function handleLogin(e) {
    e.preventDefault(); 
    
    // Obtém os valores dos campos
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#senha").value.trim(); // Usando 'password' para a API
    
    // Validação de campos
    if (!email || !password) {
        alert("🚨 Por favor, preencha todos os campos.");
        return;
    }

    // Cria o objeto de usuário no formato esperado pela API
    const user = {
        email,
        password
    };
    
    try {
        // Envia a requisição POST para a API
        const response = await fetch(API_LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user }) // Envia o objeto aninhado 'user'
        });

        const data = await response.json();

        // Se a resposta contém uma mensagem, geralmente é um erro (401 ou 409)
        if (data.message) {
             alert(`❌ Falha no Login: ${data.message}`);
             return; 
        }

        // Se não há "message", o login foi bem-sucedido e a API retornou { id, name }
        const { id, name } = data;

        // Armazena as informações do usuário logado no sessionStorage
        // (Similar à sua intenção original de guardar o usuário ativo)
        sessionStorage.setItem("user", JSON.stringify({ id, name, email })); 
        // Você pode também guardar o email separadamente, se preferir
        sessionStorage.setItem('usuarioAtivo', email);
        
        alert(`✅ Login realizado com sucesso! Bem-vindo(a), ${name}.`);

        // Redireciona para a página principal
        window.location.href = "../index.html";
        
    } catch (error) {
        console.error("Erro ao conectar ou processar a resposta da API:", error);
        alert("⚠️ Erro de conexão com o servidor. Verifique o console.");
    }
}