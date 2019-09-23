$(function () {
    function addLinha() {
        $("#tabela tbody").append(
            "<tr>" +
            "<td><input type='text'/></td>" +
            "<td><img src='src/img/seta.png' class='imgSeta'/></td>" +
            "<td><input type='text'/></td>" +
            "<td><img src='src/img/salvar.jpeg' class='btnSalvar'/><img src='src/img/deletar.jpeg' class='btnExcluir'/></td>" +
            "</tr>"
        );

        $(".btnSalvar").bind("click", salvaLinha);
        $(".btnExcluir").bind("click", deletaLinha);
    };

    function salvaLinha() {
        var par = $(this).parent().parent(); //tr
        var tdColuna1 = par.children("td:nth-child(1)");
        var tdSeta = par.children("td:nth-child(2)");
        var tdColuna2 = par.children("td:nth-child(3)");
        var tdBotoes = par.children("td:nth-child(4)");

        tdColuna1.html(tdColuna1.children("input[type=text]").val());
        tdSeta.html("<img src='src/img/seta.png' class='imgSeta'/>");
        tdColuna2.html(tdColuna2.children("input[type=text]").val());
        tdBotoes.html("<img src='src/img/deletar.jpeg'class='btnExcluir'/><img src='src/img/editar.png' class='btnEditar'/>");

        $(".btnEditar").bind("click", editaLinha);
        $(".btnExcluir").bind("click", deletaLinha);
    };

    function editaLinha() {
        var par = $(this).parent().parent(); //tr
        var tdColuna1 = par.children("td:nth-child(1)");
        var tdSeta = par.children("td:nth-child(2)");
        var tdColuna2 = par.children("td:nth-child(3)");
        var tdBotoes = par.children("td:nth-child(4)");

        tdColuna1.html("<input type='text' id='txtNome' value='" + tdColuna1.html() + "'/>");
        tdSeta.html("<img src='src/img/seta.png' class='imgSeta'/>");
        tdColuna2.html("<input type='text' id='txtEmail' value='" + tdColuna2.html() + "'/>");
        tdBotoes.html("<img src='src/img/salvar.jpeg' class='btnSalvar'/>");

        $(".btnSalvar").bind("click", salvaLinha);
        $(".btnEditar").bind("click", editaLinha);
        $(".btnExcluir").bind("click", deletaLinha);
    };

    function deletaLinha() {
        var par = $(this).parent().parent(); //tr
        par.remove();
    };

    $(".btnSalvar").bind("click", salvaLinha);
    $(".btnEditar").bind("click", editaLinha);
    $(".btnExcluir").bind("click", deletaLinha);
    $("#btnAdicionar").bind("click", addLinha);
});

function isTerminal(caractere){
    return caractere == caractere.toLowerCase();
}

function analisar(gr, texto, simbolo=gr.simboloInicial){

    if(texto.length == 0)
        return false;

    for(let i = 0; i < gr.regras[simbolo].length; i++){
        for(let j = 0; j < (gr.regras[simbolo][i]).length; j++){
            let charAtual = (gr.regras[simbolo][i])[j];
 
            if (isTerminal(charAtual)){ //compara com texto
                if(charAtual != texto[j]){
                    if (i == gr.regras[simbolo].length - 1) return false; //se for a ultima iteração e deu diferente
                    break;
                }
            }
            else if(!isTerminal(charAtual)){
                return analisar(gr, texto.slice(1), simbolo=charAtual);
            }

        }      
    }

    if(texto.length > 1)
        return false;
    else
        return true;
}

class gramatica{

    constructor(simboloIni){
        this.simbolos = [];
        this.regras = {};
        this.simboloInicial = simboloIni;
    }

    addSimbolo(simbolo){
        this.simbolos.push(simbolo);
        this.regras[simbolo] = [];
    }

    addRegra(simbolo, regra){
        this.regras[simbolo].push(regra);
    }

    mostrarSimbolos(){
        for(let i = 0; i < this.simbolos.length; i++){
            console.log(this.simbolos[i]);
        }
    }

    mostrarRegras(){
        for(let i = 0; i < this.simbolos.length; i++){
            console.log(this.simbolos[i]);
            for(let j = 0; j < this.regras[this.simbolos[i]].length; j++){
                console.log((this.regras[this.simbolos[i]])[j]);
            }
            console.log('');
        }
    }

}

let grammar = new gramatica('S');
grammar.addSimbolo('A');
grammar.addRegra('A', 'b');

grammar.addSimbolo('S');
grammar.addRegra('S', 'aA');
grammar.addRegra('S', 'disgraca');
grammar.addRegra('S', 'c');


//grammar.mostrarSimbolos();
//grammar.mostrarRegras();

console.log('ab= '+analisar(grammar, "ab"));
console.log('zab= '+analisar(grammar, "zab"));
console.log('azb= '+analisar(grammar, "azb"));
console.log('abz= '+analisar(grammar, "abz"));
console.log('c= '+analisar(grammar, "c"));
console.log('a= '+analisar(grammar, "a"));
console.log('aa= '+analisar(grammar, "aa"));
console.log('disgraca= ' + analisar(grammar, "disgraca"));

console.log('λ');