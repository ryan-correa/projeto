formularioEditar.addEventListener('submit', function(event) {
    event.preventDefault();

    // Verifica se 'contatoAtual' está definido
    if (!contatoAtual) {
        console.error("Erro: Nenhum contato selecionado para edição!");
        return;
    }

    // Obter valores do formulário
    const novoNome = document.getElementById('editar-nome').value;
    const novoTelefone = document.getElementById('editar-telefone').value;
    const novoEmail = document.getElementById('editar-email').value;

    // Atualizar os dados usando 'contatoAtual'
    contatoAtual.dataset.nome = novoNome;
    contatoAtual.dataset.telefone = novoTelefone;
    contatoAtual.dataset.email = novoEmail;

    // Atualiza o texto exibido
    const nomeElemento = contatoAtual.querySelector('.nome-text');
    if (nomeElemento) {
        nomeElemento.textContent = novoNome;
    }

    // Fechar o modal de edição
    closeEditarModal();
});