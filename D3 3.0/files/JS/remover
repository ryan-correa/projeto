document.addEventListener('DOMContentLoaded', function() {
    // Função para remover contato
    function removerContato(event) {
        const contatoDiv = event.target.closest('.contato-nome');
        const nome = contatoDiv.dataset.nome;
        const telefone = contatoDiv.dataset.telefone;
        const email = contatoDiv.dataset.email;

        // Remover o contato da lista de contatos frequentes, se existir
        const contatosFrequentes = document.querySelectorAll('#lista-contatos-frequentes .contato-nome');
        contatosFrequentes.forEach(contato => {
            if (contato.dataset.nome === nome && contato.dataset.telefone === telefone && contato.dataset.email === email) {
                contato.remove();
            }
        });

        // Remover o contato da lista de contatos normais
        contatoDiv.remove();
    }

    // Adiciona eventos de clique aos botões de remoção
    function adicionarEventosDeRemocao() {
        const botoesRemover = document.querySelectorAll('.btn-remover-contato');
        
        botoesRemover.forEach(botao => {
            botao.addEventListener('click', removerContato);
        });
    }

    // Chama a função para adicionar eventos de remoção após carregar o DOM
    adicionarEventosDeRemocao();
});