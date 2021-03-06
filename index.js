/*
Script em Js NodeJs Adaptado por Juscilan Moreto
Responsavel por implementar a parte client do socket.io
2016 © - juscilan.com‎
*/

// Iniciando Socket Client
var socket = io.connect();
var isServ;
const adressLocal = 'http://localhost:3012';
const adressWeb = 'https://meu-app-iott.herokuapp.com/';

//Objeto interno de acoes a serem feitas no embarcado
function ObjAcoes(ledon, ledoff, relon, reloff) {
    this.ledon = ledon, this.ledoff = ledoff
};

var objacoes = new ObjAcoes(false, false);

//Objeto post Ajax
function ObjPost(url, data) {
    this.url = url, this.data = data
}

//isServer é emitido pelo socket.io no load da pagina
socket.on('isServer', function(dataAction) {

    //se eu ja tiver o objeto SessionState trata-se de um client
    if (Object.keys(dataAction).length > 0) {

        $('#btnSet').hide();

        $('#btnLed').show();

        $('#mensagem').show();
        $('#mensagem').css("color", "#0000FF");
        $('#mensagem').html(
            'Instância client remoto </br> Execute uma ação abaixo:'
        );

        isServ = false;

        objacoes = dataAction;

    } else {
        $('#btnSet').show();
    };

});

// Executa a ação de resposta em BroadCast
socket.on('ExecActionRes', function(dataAction) {
    //Aqui eu comparo se estou na instancia isServ
    if (isServ) {
        var objpost = new ObjPost(adressLocal, dataAction)
        enviaPost(objpost);
    }
});

//funcao interna para enviar um post
function enviaPost(dataPost) {

    var objForPost = {
        url: dataPost.url,
        type: "POST",
        data: JSON.stringify(dataPost.data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
    };

    $.ajax(objForPost);
}

//Jquery onload
$(function() {

    $('#btnSet').click(function() {
        socket.emit('sendreq', objacoes);
        isServ = true;
        $('#btnSet').hide();
        return false;
    });

    //Acoes click botao
    $('#btnLed').click(function() {

        objacoes = new ObjAcoes(false, false);

        if ($('#btnLed').val() == 'Ligar Led') {
            objacoes.ledon = true;
            $('#btnLed').val('Desligar Led');

        } else {
            objacoes.ledoff = true;
            $('#btnLed').val('Ligar Led');

        }
        socket.emit('ExecAction', objacoes);

        return false;
    });

    //Inicia os elementos html load
    $('#btnLed').hide();

    $('#mensagem').css("color", "#FF0000");
    $('#mensagem').html(
        'Instância bridge não fechar essa aba e nem recarregar. </br> App socket rodando...'
    );

});