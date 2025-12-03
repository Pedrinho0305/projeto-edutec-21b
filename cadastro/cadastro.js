// O URL do endpoint de cadastro do seu backend
const API_CADASTRO_URL = "https://backend-edutec-85jy.vercel.app/cadastrar";

// 1. Obtém o formulário e o botão
const formCadastro = document.getElementById('form-cadastro'); 
// Se você não tiver um <form id="form-cadastro">, use o botão diretamente:
const button = document.querySelector("button"); 

// 2. Adiciona o Listener ao formulário ou botão
if (formCadastro) {
    formCadastro.addEventListener('submit', handleCadastro);
} else if (button) {
    button.addEventListener('click', handleCadastro);
}


/**
 * Função principal para lidar com o envio do formulário de cadastro.
 * Realiza validações e envia os dados para a API externa.
 */
async function handleCadastro(e) {
    e.preventDefault(); 
    
    // Obtém os valores dos campos
    const name = document.querySelector("#nome") ? document.querySelector("#nome").value.trim() : "";
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#senha").value.trim();
    
    // Validação de campos (similar à lógica do primeiro código)
    if (!name || !email || !password) {
        alert("🚨 Por favor, preencha todos os campos (Nome, E-mail e Senha).");
        return;
    }

    // Cria o objeto de usuário no formato esperado pela API
    const user = {
        name, 
        email,
        password
    };
    
    try {
        // Envia a requisição POST para a API (similar à lógica do segundo código)
        const response = await fetch(API_CADASTRO_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user }) // Envia o objeto aninhado 'user'
        });

        const data = await response.json();

        // Verifica o status da resposta (se a requisição HTTP foi bem-sucedida ou não)
        if (response.ok && response.status === 201) {
             alert(`✅ Sucesso! ${data.message || "Usuário cadastrado com sucesso!"}`);
        } else {
             // Exibe a mensagem de erro retornada pela API
             alert(`❌ Falha no Cadastro: ${data.message || "Ocorreu um erro desconhecido."}`);
             return; // Interrompe o processo para não redirecionar
        }

    } catch (error) {
        console.error("Erro ao conectar ou processar a resposta da API:", error);
        alert("⚠️ Erro de conexão com o servidor. Verifique o console.");
        return; // Interrompe o processo para não redirecionar
    }

    // Redirecionamento após o sucesso
    window.location.href = "./login.html";
}