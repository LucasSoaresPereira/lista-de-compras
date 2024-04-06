let listaDeItens = [];
let itemAEditar;

const form = document.getElementById("form-itens");
const itensInput = document.getElementById("receber-item");
const ulItens = document.getElementById("lista-de-itens");
const ulItensComprados = document.getElementById("itens-comprados");
const listaRecuperada = localStorage.getItem('listaDeItens');

function atualizaLocalStorage(){
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens));
}

if(listaRecuperada){
    listaDeItens = JSON.parse(listaRecuperada);
    mostarItem();
} else {
    listaDeItens = [];
}

form.addEventListener("submit", (evento)=>{
    evento.preventDefault();
    salvarItem();
    mostarItem();
    itensInput.focus();
});

function salvarItem(){
    const comprasItem = itensInput.value;
    //some = comparar dois elementos no JS, para comparar se existem itens iguais na lista de compras, neste caso.
    const checarDuplicado = listaDeItens.some((elemento)=> elemento.valor.toUpperCase() === comprasItem.toUpperCase());

    if(checarDuplicado){
        alert("Item já existe na lista de compras!");
    } else {

        listaDeItens.push({
            valor: comprasItem,
            checar: false
        });
    }
    itensInput.value = '';
}

function mostarItem(){
    ulItens.innerHTML = '';
    ulItensComprados.innerHTML = '';
    listaDeItens.forEach((elemento,index)=>{
        if(elemento.checar){
            ulItensComprados.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" checked class="is-clickable" />  
            <span class="itens-comprados is-size-5">${elemento.valor}</span>
        </div>
        <div>
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
    </li>
            `;
        } else {
        ulItens.innerHTML += `
        <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" class="is-clickable" />
            <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''}></input>
        </div>
        <div>
        ${index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
    </li>
        `;
        }
    });

    const inputCheck = document.querySelectorAll('input[type="checkbox"]');
    inputCheck.forEach(i => {
        i.addEventListener('click', (evento)=>{
            const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
            listaDeItens[valorDoElemento].checar = evento.target.checked;
            mostarItem();
        })
    });
    //no paramêtro splice, se passa alguns valores: o primeiro é em qual posição vai se iniciar a adição de valores. O segundo é quantos valores que já
    //existiam serão substituidos e, terceiro, o que será adicionado
    //Ex: veiculos.splice(2,0, {veiculo3: "Bicicleta"}, {veiculo4: "Automóvel"}) Serão adicionados 2 veiculos novos na posição 3 da lista, sem substituir nenhum já existente
    const deletarObjetos = document.querySelectorAll(".deletar");
    deletarObjetos.forEach(i => {
        i.addEventListener('click', (evento)=>{
            valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
            listaDeItens.splice(valorDoElemento,1);
            mostarItem();
        })
    });

    const editarItens = document.querySelectorAll(".editar");
    editarItens.forEach(i => {
        i.addEventListener('click', (evento)=>{
            itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value');
            mostarItem();
        })
    });
    atualizaLocalStorage();

}

function salvarEdicao(){
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`);
    
    listaDeItens[itemAEditar].valor = itemEditado.value;
    console.log(listaDeItens);
    itemAEditar = -1;
    mostarItem()
}