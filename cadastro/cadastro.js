// cadastro.js

const CADASTRO_URL = "http://localhost:5500/cadastro";
const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
    // Escuta o evento de 'submit' do formulário
    formCadastro.addEventListener('submit', handleCadastro);
}


async function handleCadastro(e) {
    e.preventDefault(); 
    
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    
    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    const dados = { email, senha };

    try {
        const res = await fetch(CADASTRO_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados) 
        });

        const resposta = await res.json();

        if (res.status === 201) {
            alert("✅ Cadastro realizado com sucesso! Você será redirecionado para a página de login.");
            // Redireciona para o login após sucesso no cadastro
            window.location.href = 'login.html'; 
        } else {
            alert(`Falha no Cadastro (${res.status}): ${resposta.message}`);
        }
    } catch (erro) {
        console.error("Erro na requisição Fetch:", erro);
        alert("❌ Falha ao conectar com o servidor.");
    }
}