const supermercado = localStorage.getItem("supermercadoSelecionado");
document.getElementById("titulo-supermercado").innerText = "Listas - " + supermercado;

// Carregar listas do supermercado ou criar vazia
let listas = JSON.parse(localStorage.getItem("listasDeCompras")) || {};
if (!listas[supermercado]) {
  listas[supermercado] = [
    { nome: "Lista Normal", itens: [] }
  ];
}
localStorage.setItem("listasDeCompras", JSON.stringify(listas));

// Criar nova lista
function adicionarLista() {
  const nomeLista = prompt("Nome da nova lista:");
  if (nomeLista && nomeLista.trim() !== "") {
    listas[supermercado].push({ nome: nomeLista.trim(), itens: [] });
    salvar();
    renderizarListas();
  }
}

// Salvar no localStorage
function salvar() {
  localStorage.setItem("listasDeCompras", JSON.stringify(listas));
}

// Renderizar todas as listas
function renderizarListas() {
  const container = document.getElementById("container-listas");
  container.innerHTML = "";

  listas[supermercado].forEach((lista, i) => {
    const divLista = document.createElement("div");
    divLista.className = "lista";

    const titulo = document.createElement("div");
    titulo.className = "titulo-lista";
    titulo.innerText = lista.nome;
    titulo.onclick = () => {
      const itensDiv = divLista.querySelector(".itens");
      itensDiv.style.display = itensDiv.style.display === "none" ? "block" : "none";
    };

    const botoesLista = document.createElement("div");
    botoesLista.className = "acoes-lista";

    const btnEditar = document.createElement("button");
    btnEditar.innerText = "✏️";
    btnEditar.onclick = (e) => {
      e.stopPropagation();
      const novoNome = prompt("Renomear lista:", lista.nome);
      if (novoNome && novoNome.trim() !== "") {
        lista.nome = novoNome.trim();
        salvar();
        renderizarListas();
      }
    };

    const btnExcluir = document.createElement("button");
    btnExcluir.innerText = "🗑️";
    btnExcluir.onclick = (e) => {
      e.stopPropagation();
      if (confirm("Tem certeza que deseja apagar essa lista?")) {
        listas[supermercado].splice(i, 1);
        salvar();
        renderizarListas();
      }
    };

    botoesLista.appendChild(btnEditar);
    botoesLista.appendChild(btnExcluir);
    titulo.appendChild(botoesLista);
    divLista.appendChild(titulo);

    // Div para itens da lista
    const itensDiv = document.createElement("div");
    itensDiv.className = "itens";
    itensDiv.style.display = "none";

    // Campo para adicionar item
    const addItemDiv = document.createElement("div");
    addItemDiv.className = "add-item";

    const input = document.createElement("input");
    input.placeholder = "Digite o item";
    input.type = "text";

    const select = document.createElement("select");
    ["Hortifruti","Açougue","Bebidas","Higiene","Padaria","Mercearia"].forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.innerText = s;
      select.appendChild(opt);
    });

    const btnAddItem = document.createElement("button");
    btnAddItem.innerText = "Adicionar";
    btnAddItem.onclick = () => {
      if (input.value.trim() !== "" && select.value) {
        lista.itens.push({ nome: input.value.trim(), setor: select.value, comprado: false });
        input.value = "";
        renderizarListas();
        salvar();
      }
    };

    addItemDiv.appendChild(input);
    addItemDiv.appendChild(select);
    addItemDiv.appendChild(btnAddItem);
    itensDiv.appendChild(addItemDiv);

    // Lista de itens
    const ul = document.createElement("ul");
    lista.itens.forEach((item, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" ${item.comprado ? "checked" : ""}> ${item.nome} (${item.setor})`;

      li.querySelector("input").onchange = () => {
        item.comprado = !item.comprado;
        salvar();
        renderizarListas();
      };

      // Botões de editar/excluir item
      const btns = document.createElement("span");
      btns.innerHTML = ` <button onclick="editarItemLista(${i},${idx})">✏️</button> <button onclick="excluirItemLista(${i},${idx})">🗑️</button>`;
      li.appendChild(btns);

      ul.appendChild(li);
    });

    itensDiv.appendChild(ul);
    divLista.appendChild(itensDiv);

    container.appendChild(divLista);
  });
}

// Funções para editar/excluir itens dentro da lista
function editarItemLista(i, idx) {
  const item = listas[supermercado][i].itens[idx];
  const novoNome = prompt("Editar nome do item:", item.nome);
  if (novoNome && novoNome.trim() !== "") item.nome = novoNome.trim();
  const novoSetor = prompt("Editar setor do item:", item.setor);
  if (novoSetor && novoSetor.trim() !== "") item.setor = novoSetor.trim();
  salvar();
  renderizarListas();
}

function excluirItemLista(i, idx) {
  if (confirm("Tem certeza que deseja apagar esse item?")) {
    listas[supermercado][i].itens.splice(idx,1);
    salvar();
    renderizarListas();
  }
}

// Inicializar
renderizarListas();
