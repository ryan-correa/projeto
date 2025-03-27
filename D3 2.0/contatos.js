document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-contatos");
    const btnAbrirModal = document.getElementById("Contatos");
    const btnFecharModal = document.querySelector(".close");
    const formulario = document.getElementById("formulario-contato");
    const rightArea = document.querySelector(".right-area");

    // Abrir modal
    btnAbrirModal.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Fechar modal
    btnFecharModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Adicionar contato
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const email = document.getElementById("email").value;
        
        if (nome && telefone) {
            const contatoDiv = document.createElement("div");
            contatoDiv.classList.add("contato");
            contatoDiv.innerHTML = `
                <h3>${nome}</h3>
                <p>Telefone: ${telefone}</p>
                <p>Email: ${email || "Não informado"}</p>
            `;
            rightArea.appendChild(contatoDiv);
            
            formulario.reset();
            modal.style.display = "none";
        } else {
            alert("Nome e telefone são obrigatórios!");
        }
    });
});