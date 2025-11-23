function sendUser(e) {
    // Impede o formulário de recarregar a página
    e.preventDefault();

    // Pega os dados digitados no formulário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const lembrar = document.getElementById("lembrar-me").checked;

    // Validação simples
    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    // Monta o objeto que será enviado ao backend
    const dados = {
        email: email,
        senha: senha,
        lembrar: lembrar
    };

    // Envio dos dados para o backend
    fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)

        
    })
    .then(async (res) => {
        const resposta = await res.json();
        if (res.ok) {
            alert("Login realizado com sucesso!");
            console.log("Resposta do servidor:", resposta);
        } else {
            alert("Erro ao fazer login: " + resposta.message);
        }
    })
    .catch((erro) => {
        console.log("Erro:", erro);
        alert("Falha ao conectar com o servidor.");
    });
}

