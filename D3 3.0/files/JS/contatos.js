document.addEventListener('DOMContentLoaded', function() {
    // [Seleção dos elementos do DOM - mantido igual]
    const btnAdicionarContato = document.getElementById('btn-adicionar-contato');
    const modalContatos = document.getElementById('modal-contatos');
    const closeModalBtn = document.querySelector('.close');
    const formularioContato = document.getElementById('formulario-contato');
    const listaContatos = document.getElementById('lista-contatos');
    const listaContatosFrequentes = document.getElementById('lista-contatos-frequentes');
    const contatosArea = document.getElementById('contatos-area');
    const contatosFrequentesArea = document.getElementById('contatos-frequentes-area');
    const modalErro = document.getElementById('modal-erro');
    const mensagemErro = document.getElementById('mensagem-erro');
    const closeErroBtn = document.querySelector('.close-erro');
    const modalEditar = document.getElementById('modal-editar');
    const closeEditarBtn = document.querySelector('.close-editar');
    const formularioEditar = document.getElementById('formulario-editar');
    let contatoAtual = null;

    // [Funções de modal - mantidas iguais]
    function openModal() { modalContatos.style.display = 'block'; }
    function closeModal() { modalContatos.style.display = 'none'; }
    function openInfoModal(nome, telefone, email) {
        document.getElementById('info-nome').textContent = nome;
        document.getElementById('info-telefone').textContent = telefone;
        document.getElementById('info-email').textContent = email;
        document.getElementById('modal-info').style.display = 'block';
        addToFrequentes(nome, telefone, email);
    }
    function closeInfoModal() { document.getElementById('modal-info').style.display = 'none'; }
    function openErroModal(mensagem) {
        mensagemErro.textContent = mensagem;
        modalErro.style.display = 'block';
        setTimeout(() => modalErro.style.display = 'none', 2000);
    }
    function openEditarModal(contato) {
        if (!contato) return console.error("Erro: Contato não definido!");
        contatoAtual = contato;
        document.getElementById('editar-nome').value = contato.dataset.nome || '';
        document.getElementById('editar-telefone').value = contato.dataset.telefone || '';
        document.getElementById('editar-email').value = contato.dataset.email || '';
        modalEditar.style.display = 'block';
    }
    function closeEditarModal() {
        modalEditar.style.display = 'none';
        contatoAtual = null;
    }

    // [Funções auxiliares - mantidas iguais]
    function atualizarContato(contatoElement, nome, telefone, email) {
        contatoElement.dataset.nome = nome;
        contatoElement.dataset.telefone = telefone;
        contatoElement.dataset.email = email;
        const nomeElemento = contatoElement.querySelector('.nome-text');
        if (nomeElemento) nomeElemento.textContent = nome;
    }
    function atualizarContatosFrequentes(nomeAntigo, telefoneAntigo, emailAntigo, novoNome, novoTelefone, novoEmail) {
        const contatosFrequentes = listaContatosFrequentes.querySelectorAll('.contato-nome');
        contatosFrequentes.forEach(contato => {
            if (contato.dataset.nome === nomeAntigo || contato.dataset.telefone === telefoneAntigo || contato.dataset.email === emailAntigo) {
                atualizarContato(contato, novoNome, novoTelefone, novoEmail);
            }
        });
    }
    function isContatoExistente(nome, telefone, email, contatoIgnorar = null) {
        const contatos = listaContatos.querySelectorAll('.contato-nome');
        for (const contato of contatos) {
            if (contato === contatoIgnorar) continue;
            if (contato.dataset.nome === nome || contato.dataset.telefone === telefone || contato.dataset.email === email) return true;
        }
        const contatosFrequentes = listaContatosFrequentes.querySelectorAll('.contato-nome');
        for (const contato of contatosFrequentes) {
            if (contato === contatoIgnorar) continue;
            if (contato.dataset.nome === nome || contato.dataset.telefone === telefone || contato.dataset.email === email) return true;
        }
        return false;
    }
    function addToFrequentes(nome, telefone, email) {
        if (isContatoFrequente(nome, telefone, email)) return;
        const contatoFrequenteDiv = document.createElement('div');
        contatoFrequenteDiv.classList.add('contato-nome', 'estilizado');
        contatoFrequenteDiv.innerHTML = `<span class="nome-text">${nome}</span>`;
        contatoFrequenteDiv.dataset.nome = nome;
        contatoFrequenteDiv.dataset.telefone = telefone;
        contatoFrequenteDiv.dataset.email = email;
        contatoFrequenteDiv.onclick = () => openInfoModal(nome, telefone, email);
        listaContatosFrequentes.appendChild(contatoFrequenteDiv);
    }
    function isContatoFrequente(nome, telefone, email) {
        const contatosFrequentes = listaContatosFrequentes.getElementsByClassName('contato-nome');
        for (let contato of contatosFrequentes) {
            if (contato.dataset.nome === nome || contato.dataset.telefone === telefone || contato.dataset.email === email) return true;
        }
        return false;
    }

    // FUNÇÃO DE REMOÇÃO COM SweetAlert2 (ATUALIZADA)
    function removerContato(nome, telefone, email) {
        Swal.fire({
            title: 'Confirmar remoção',
            html: `Você realmente deseja remover <b>${nome}</b> dos seus contatos?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar',
            background: '#f8f9fa',
            iconColor: '#dc3545'
        }).then((result) => {
            if (result.isConfirmed) {
                // Remove com animação
                const removerComEfeito = (elemento) => {
                    elemento.style.transition = 'all 0.3s ease';
                    elemento.style.transform = 'scale(0.9)';
                    elemento.style.opacity = '0';
                    setTimeout(() => elemento.remove(), 300);
                };

                // Remove da lista principal
                Array.from(listaContatos.getElementsByClassName('contato-nome')).forEach(contato => {
                    if (contato.dataset.nome === nome && 
                        contato.dataset.telefone === telefone && 
                        contato.dataset.email === email) {
                        removerComEfeito(contato);
                    }
                });

                // Remove da lista de frequentes
                Array.from(listaContatosFrequentes.getElementsByClassName('contato-nome')).forEach(contato => {
                    if (contato.dataset.nome === nome && 
                        contato.dataset.telefone === telefone && 
                        contato.dataset.email === email) {
                        removerComEfeito(contato);
                    }
                });

                // Feedback visual
                Swal.fire({
                    title: 'Removido!',
                    text: `O contato ${nome} foi removido com sucesso.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    // [Restante do código - mantido igual]
    function adicionarEventosDeEdicao() {
        document.querySelectorAll('.btn-editar-contato').forEach(botao => {
            botao.addEventListener('click', function(event) {
                event.stopPropagation();
                const contatoDiv = event.target.closest('.contato-nome');
                contatoDiv ? openEditarModal(contatoDiv) : console.error("Elemento do contato não encontrado!");
            });
        });
    }
    function toggleFavorito(contatoDiv, btnFavoritar) {
        if (contatoDiv.classList.contains('favorito')) {
            contatoDiv.classList.remove('favorito');
            btnFavoritar.textContent = '⭐';
            listaContatos.appendChild(contatoDiv);
        } else {
            contatoDiv.classList.add('favorito');
            btnFavoritar.textContent = '🌟';
            listaContatos.insertBefore(contatoDiv, listaContatos.firstChild);
        }
    }

    // [Event Listeners - mantidos iguais]
    formularioContato.addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;

        if (isContatoExistente(nome, telefone, email)) {
            openErroModal('Contato já existe com esse nome, telefone ou email.');
            return;
        }

        const contatoDiv = document.createElement('div');
        contatoDiv.classList.add('contato-nome', 'estilizado');
        contatoDiv.style.opacity = '0';
        setTimeout(() => contatoDiv.style.opacity = '1', 10);
        contatoDiv.innerHTML = `<span class="nome-text">${nome}</span>`;
        contatoDiv.dataset.nome = nome;
        contatoDiv.dataset.telefone = telefone;
        contatoDiv.dataset.email = email;

        // Botão de favoritar
        const btnFavoritar = document.createElement('button');
        btnFavoritar.classList.add('btn-favoritar');
        btnFavoritar.textContent = '⭐';
        btnFavoritar.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorito(contatoDiv, btnFavoritar);
        });
        contatoDiv.appendChild(btnFavoritar);

        // Botão de remover (com SweetAlert2)
        const btnRemover = document.createElement('button');
        btnRemover.classList.add('btn-remover-contato');
        btnRemover.textContent = '🗑️';
        btnRemover.addEventListener('click', (e) => {
            e.stopPropagation();
            removerContato(nome, telefone, email);
        });
        contatoDiv.appendChild(btnRemover);

        // Botão de editar
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn-editar-contato');
        btnEditar.textContent = '✏️';
        btnEditar.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditarModal(contatoDiv);
        });
        contatoDiv.appendChild(btnEditar);

        contatoDiv.onclick = () => openInfoModal(nome, telefone, email);
        listaContatos.appendChild(contatoDiv);
        formularioContato.reset();
        closeModal();
    });

    formularioEditar.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!contatoAtual) return console.error("Nenhum contato selecionado para edição!");

        const novoNome = document.getElementById('editar-nome').value;
        const novoTelefone = document.getElementById('editar-telefone').value;
        const novoEmail = document.getElementById('editar-email').value;

        if (isContatoExistente(novoNome, novoTelefone, novoEmail, contatoAtual)) {
            openErroModal('Já existe um contato com esses dados atualizados.');
            return;
        }

        const nomeAntigo = contatoAtual.dataset.nome;
        const telefoneAntigo = contatoAtual.dataset.telefone;
        const emailAntigo = contatoAtual.dataset.email;

        atualizarContato(contatoAtual, novoNome, novoTelefone, novoEmail);
        atualizarContatosFrequentes(nomeAntigo, telefoneAntigo, emailAntigo, novoNome, novoTelefone, novoEmail);
        closeEditarModal();
    });

    // [Outros listeners - mantidos iguais]
    closeModalBtn.addEventListener('click', closeModal);
    closeErroBtn.addEventListener('click', () => modalErro.style.display = 'none');
    closeEditarBtn.addEventListener('click', closeEditarModal);
    document.getElementById('btn-contatos').addEventListener('click', () => {
        contatosArea.style.display = 'block';
        contatosFrequentesArea.style.display = 'none';
    });
    document.getElementById('btn-contatos-frequentes').addEventListener('click', () => {
        contatosArea.style.display = 'none';
        contatosFrequentesArea.style.display = 'block';
    });
    btnAdicionarContato.addEventListener('click', openModal);
    window.onclick = function(event) {
        if (event.target == modalContatos) closeModal();
        if (event.target == document.getElementById('modal-info')) closeInfoModal();
        if (event.target == modalErro) modalErro.style.display = 'none';
        if (event.target == modalEditar) closeEditarModal();
    }

    // Inicialização
    adicionarEventosDeEdicao();
});
