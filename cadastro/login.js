// O nome do ID deve ser o mesmo do seu botão no HTML!
const button = document.getElementById('login'); 

if (button) {
    // 1. Usa addEventListener para anexar a função sendUser ao evento de clique.
    // O objeto de evento (e) é passado automaticamente.
    button.addEventListener('click', sendUser);
} else {
    console.error("Erro: O botão de login com ID 'login' não foi encontrado no HTML.");
}


/**
 * Envia os dados do formulário para o backend via requisição POST.
 * @param {Event} e - O objeto de evento do clique.
 */
function sendUser(e) {
    // Se o botão estiver dentro de um formulário e for type="submit",
    // esta linha impede a recarga da página.
    e.preventDefault(); 
    
    // Pega os dados digitados
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const lembrar = document.getElementById("lembrar-me").checked;

    // Validação simples
    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    // Monta o objeto que será enviado
    const dados = {
        email: email,
        senha: senha,
        lembrar: lembrar
    };

    // 🚀 Envio dos dados para o backend
    fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados) 
    })
    .then(async (res) => {
        let resposta;
        try {
            resposta = await res.json();
        } catch (error) {
            resposta = { message: `Erro no servidor (Status ${res.status}).` };
        }

        if (res.ok) { // Status 200-299
            alert("Login realizado com sucesso!");
            console.log("Resposta do servidor:", resposta);
            window.location.href = '../index.html'
        } else { // Status 4xx ou 5xx
            alert(`Erro ao fazer login (${res.status}): ${resposta.message}`);
        }
    })
    .catch((erro) => {
        console.error("Erro na requisição Fetch (Rede/CORS):", erro);
        alert("Falha ao conectar com o servidor.");
    });
}