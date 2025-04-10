document.addEventListener('DOMContentLoaded', function() {
    const modalEditar = document.getElementById('modal-editar');
    const closeEditarBtn = document.querySelector('.close-editar');
    const formularioEditar = document.getElementById('formulario-editar');
    let contatoAtual;

    // Função para abrir o modal de edição com os dados do contato
    function openEditarModal(contato) {
        contatoAtual = contato;
        document.getElementById('editar-nome').value = contato.dataset.nome;
        document.getElementById('editar-telefone').value = contato.dataset.telefone;
        document.getElementById('editar-email').value = contato.dataset.email;
        modalEditar.style.display = 'block'; // Torna o modal visível
    }

    // Função para fechar o modal de edição
    function closeEditarModal() {
        modalEditar.style.display = 'none'; // Torna o modal invisível
    }

    // Função para atualizar os dados do contato
    formularioEditar.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('editar-nome').value;
        const telefone = document.getElementById('editar-telefone').value;
        const email = document.getElementById('editar-email').value;

        // Atualizar os dados do contato
        contatoAtual.dataset.nome = nome;
        contatoAtual.dataset.telefone = telefone;
        contatoAtual.dataset.email = email;
        contatoAtual.textContent = nome;

        // Remover os botões antigos
        const btns = contatoAtual.getElementsByTagName('button');
        while (btns.length > 0) {
            contatoAtual.removeChild(btns[0]);
        }

        // Adicionar botão de remover
        const btnRemoverContato = document.createElement('button');
        btnRemoverContato.classList.add('btn-remover-contato');
        btnRemoverContato.textContent = '🗑️';
        contatoAtual.appendChild(btnRemoverContato);

        // Adicionar botão de editar
        const btnEditarContato = document.createElement('button');
        btnEditarContato.classList.add('btn-editar-contato');
        btnEditarContato.textContent = '✏️';
        contatoAtual.appendChild(btnEditarContato);

        // Adicionar evento de remoção ao novo botão
        btnRemoverContato.addEventListener('click', function(event) {
            event.stopPropagation();
            removerContato(nome, telefone, email);
        });

        // Adicionar evento de edição ao novo botão
        btnEditarContato.addEventListener('click', function(event) {
            event.stopPropagation();
            openEditarModal(contatoAtual);
        });

        // Fechar o modal de edição
        closeEditarModal();
    });

    // Fechar o modal de edição ao clicar no botão de fechar (X)
    closeEditarBtn.addEventListener('click', function() {
        closeEditarModal(); // Chama a função para fechar o modal
    });

    // Função para adicionar eventos de edição aos botões de lápis
    function adicionarEventosDeEdicao() {
        const botoesEditar = document.querySelectorAll('.btn-editar-contato');
        
        botoesEditar.forEach(botao => {
            botao.addEventListener('click', function(event) {
                event.stopPropagation();
                const contatoDiv = event.target.closest('.contato-nome');
                openEditarModal(contatoDiv);
            });
        });
    }

    // Chama a função para adicionar eventos de edição após carregar o DOM
    adicionarEventosDeEdicao();
});