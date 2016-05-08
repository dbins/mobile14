//http://www.javascriptlint.com/online_lint.php

//Funcoes do Phonegap
var isPhoneGapReady = false;
var isConnected = false;
var isHighSpeed = false;
var tipo_conexao = "";
var email_aplicativo;
var latitude = "";
var longitude = "";

// alert dialog dismissed
function alertDismissed() {
	// do something
}

//$(document).ready(function(){
document.addEventListener("deviceready", onDeviceReady, false);
//});
 
function onDeviceReady() {
	isPhoneGapReady = true;
	// detect for network access
	networkDetection();
	// attach events for online and offline detection
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);
	if (isConnected){
		$.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false").done(function( script, textStatus ) {
			//alert(textStatus);	
			//console.log( textStatus );
		}).fail(function( jqxhr, settings, exception ) {
			//$( "div.log" ).text( "Triggered ajaxError handler." );
		});
	}
}

function networkDetection() {
	if (isPhoneGapReady) {
		
		var states = {};
		states[navigator.connection.UNKNOWN]  = 'Unknown connection';
		states[navigator.connection.ETHERNET] = 'Ethernet connection';
		states[navigator.connection.WIFI]     = 'WiFi connection';
		states[navigator.connection.CELL_2G]  = 'Cell 2G connection';
		states[navigator.connection.CELL_3G]  = 'Cell 3G connection';
		states[navigator.connection.CELL_4G]  = 'Cell 4G connection';
		states[navigator.connection.NONE]     = 'No network connection';
		var tipo_conexao = states[navigator.connection.type];
		if (tipo_conexao != 'No network connection') {
			isConnected = true;
		}
	}	
}

function onOnline() {
	isConnected = true;
}
function onOffline() {
	isConnected = false;
}

function ValidarNavegacao(){
	
	if (isPhoneGapReady){
		if (isConnected) {
			//Continuar
		} else {
			navigator.notification.alert('Não existe conexão com a Internet',alertDismissed, 'Interior na Web', 'OK');
			$(".tab4").addClass("ui-screen-hidden");
			$(".tab3").addClass("ui-screen-hidden");
			$(".tab2").addClass("ui-screen-hidden");
			$(".tab1").removeClass("ui-screen-hidden");
			prevSelection = "tab1";
		}
	} else {
		navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'Interior na Web', 'OK');
		$(".tab4").addClass("ui-screen-hidden");
		$(".tab3").addClass("ui-screen-hidden");
		$(".tab2").addClass("ui-screen-hidden");
		$(".tab1").removeClass("ui-screen-hidden");
		prevSelection = "tab1";
	}
}


function PaginaAtual(pagina){
	//Anunciantes
	if (pagina =="tab2"){
		ValidarNavegacao();
		ListaAnunciantes();
	}
	
	//Mapa Anunciantes
	if (pagina =="tab3"){
		ValidarNavegacao();
		load_mapa_anunciantes();
	}
	//Mapa Dispositivo
	if (pagina =="tab4"){
		ValidarNavegacao();
		getGeolocation();
	}
}

function RetornarDadosAnuncio(codigo_anuncio){
	var newSelection = "tab5";
	id_anuncio = codigo_anuncio;
	
	//Retornando os dados do anuncio selecionado
	$.ajax({
	type: "GET",
	url: "http://www.dbins.com.br/ferramentas/interior/xml_detalhe_anuncio.php?codigo=" + id_anuncio,
	dataType: "xml",
	success: function(data) {
		var output = "";	
		var markers = $(data).find('marker');
		for (var i = 0; i < markers.length; i++) {
			
			var codigo = markers[i].getAttribute("codigo");
			var nome = markers[i].getAttribute("nome");
			var endereco = markers[i].getAttribute("endereco");
			var ddd = markers[i].getAttribute("ddd");
			var telefone = markers[i].getAttribute("telefone");
			var cidade = markers[i].getAttribute("cidade");
			var estado = markers[i].getAttribute("estado");
			output += '<p><strong>' + nome.toUpperCase() + '</strong></p>';
			output += '<p>' + endereco + '</p>';
			output += '<p>' + ddd + ' - ' + telefone + '</p>';
			output += '<p>' + cidade + ' - ' + estado + '</p>';
			output += '<p><a href="#" id="voltar2">Voltar</a></p>';
		};
		$("#dados_anunciante").html(output);
		}
	});
	
	$("."+prevSelection).addClass("ui-screen-hidden");
	$("."+newSelection).removeClass("ui-screen-hidden");
	prevSelection = newSelection;
}

//Navegacao
var prevSelection = "tab1";
var id_anuncio = 0;
$(document).on("click","#navbar ul li",function(){
	var newSelection = $(this).children("a").attr("data-tab-class");
	PaginaAtual(newSelection);
	$("."+prevSelection).addClass("ui-screen-hidden");
	$("."+newSelection).removeClass("ui-screen-hidden");
	prevSelection = newSelection;
});

$(document).on("click","#anunciantes ul li", function(){
	var newSelection = "tab5";
	id_anuncio = $(this).attr('id');
	
	//Retornando os dados do anuncio selecionado
	$.ajax({
	type: "GET",
	url: "http://www.dbins.com.br/ferramentas/interior/xml_detalhe_anuncio.php?codigo=" + id_anuncio,
	dataType: "xml",
	success: function(data) {
		var output = "";	
		var markers = $(data).find('marker');
		for (var i = 0; i < markers.length; i++) {
			
			var codigo = markers[i].getAttribute("codigo");
			var nome = markers[i].getAttribute("nome");
			var endereco = markers[i].getAttribute("endereco");
			var ddd = markers[i].getAttribute("ddd");
			var telefone = markers[i].getAttribute("telefone");
			var cidade = markers[i].getAttribute("cidade");
			var estado = markers[i].getAttribute("estado");
			output += '<p><strong>' + nome.toUpperCase() + '</strong></p>';
			output += '<p>' + endereco + '</p>';
			output += '<p>' + ddd + ' - ' + telefone + '</p>';
			output += '<p>' + cidade + ' - ' + estado + '</p>';
			output += '<p><a href="#" id="voltar">Voltar</a></p>';
		};
		$("#dados_anunciante").html(output);
		}
	});
	
	$("."+prevSelection).addClass("ui-screen-hidden");
	$("."+newSelection).removeClass("ui-screen-hidden");
	prevSelection = newSelection;
});

$(document).on("click","#voltar",function(){
	var newSelection = "tab2";
	id_anuncio = 0;
	$("#dados_anunciante").html("");
	$("."+prevSelection).addClass("ui-screen-hidden");
	$("."+newSelection).removeClass("ui-screen-hidden");
	prevSelection = newSelection;
});

$(document).on("click","#voltar2",function(){
	var newSelection = "tab3";
	id_anuncio = 0;
	$("#dados_anunciante").html("");
	$("."+prevSelection).addClass("ui-screen-hidden");
	$("."+newSelection).removeClass("ui-screen-hidden");
	prevSelection = newSelection;
});

//Mapa Atual
//Funcoes para exibir o mapa da posicao atual
function getGeolocation() {
	// get the user's gps coordinates and display map
	var options = {
	maximumAge: 30000,
	timeout: 9000,
	enableHighAccuracy: false
	};
	navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
}

function loadMap(position) {
	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var myOptions = {
	zoom: 16,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	var mapObj = document.getElementById("map_canvas");
	var map = new google.maps.Map(mapObj, myOptions);
	var marker = new google.maps.Marker({
	position: latlng,
	map: map,
	title:"You"
	});
}

function geoError(error) {
	alert('codigo: ' + error.code + '\n' + 'mensagem: ' + error.message + '\n');
}


//Puxando o mapa dos anunciantes
var gmarkers = []; 



function load_mapa_anunciantes() {
  var latitude = "-23.195864";
  var longitude = "-49.384892";
  var myLatlng = new google.maps.LatLng(latitude, longitude);
  var mapOptions = {
	center: myLatlng,
	zoom: 14,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	mapTypeControl: true,
	mapTypeControlOptions: {
		style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		position: google.maps.ControlPosition.BOTTOM_CENTER
	},
	panControl: true,
	panControlOptions: {
		position: google.maps.ControlPosition.TOP_RIGHT
	},
	zoomControl: true,
	zoomControlOptions: {
		style: google.maps.ZoomControlStyle.LARGE,
		position: google.maps.ControlPosition.LEFT_CENTER
	},
	scaleControl: true,
	scaleControlOptions: {
		position: google.maps.ControlPosition.TOP_LEFT
	},
	streetViewControl: true,
	streetViewControlOptions: {
		position: google.maps.ControlPosition.LEFT_TOP
	}
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var infoWindow = new google.maps.InfoWindow;
  // Change this depending on the name of your PHP file
  downloadUrl("http://www.dbins.com.br/ferramentas/interior/xml_tipo1.php?cidade=PIRAJU", function(data) {
	var xml = data.responseXML;
	var markers = xml.documentElement.getElementsByTagName("marker");
	var total_resultados = markers.length;
	total_resultados = 20;
	for (var i = 0; i < total_resultados; i++) {
	  var codigo = 	markers[i].getAttribute("codigo");
	  var name = markers[i].getAttribute("name");
	  var address = markers[i].getAttribute("address");
	  var type = markers[i].getAttribute("type");
	  var point = new google.maps.LatLng(
		  parseFloat(markers[i].getAttribute("lat")),
		  parseFloat(markers[i].getAttribute("lng")));
	  var html = '<b>' + name + '</b> <br/>' + address + '<br/><a href="#" onclick=RetornarDadosAnuncio(' + codigo + ')>Ver</a>';
	 
	  //var marker = new google.maps.Marker({
	//	map: map,
	//	position: point,
	//	icon: icon.icon
		//icon: 'icone_mapas/' + (parseInt(i) + 1) + '.png' 
		//shadow: icon.shadow
	  //});
	  
	  var marker = new google.maps.Marker({
		position: point,
		map: map,
		title:name
		});
	  
	  bindInfoWindow(marker, map, infoWindow, html);
	}
  });
}

function bindInfoWindow(marker, map, infoWindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
	infoWindow.setContent(html);
	infoWindow.open(map, marker);
  });
  gmarkers.push(marker);
}

function myclick(i) {
	google.maps.event.trigger(gmarkers[i], "click");
}


function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
	  new ActiveXObject('Microsoft.XMLHTTP') :
	  new XMLHttpRequest;

  request.onreadystatechange = function() {
	if (request.readyState == 4) {
	  request.onreadystatechange = doNothing;
	  callback(request, request.status);
	}
  };

  request.open('GET', url, true);
  request.send(null);
}

function doNothing() {}


//Carregando Anunciantes
function ListaAnunciantes(){
	$("#listview").hide();
	$("#myFilter").hide();
	$("#loading").show();
	$.ajax({
	type: "GET",
	url: "http://www.dbins.com.br/ferramentas/interior/xml_anuncio.php",
	dataType: "xml",
	success: function(data) {
		var output = "";
		$('#listview').empty();

		var markers = $(data).find('marker');
		for (var i = 0; i < markers.length; i++) {
			var codigo = markers[i].getAttribute("codigo");
			var nome = markers[i].getAttribute("nome");
			var endereco = markers[i].getAttribute("endereco");
			var ddd = markers[i].getAttribute("ddd");
			var telefone = markers[i].getAttribute("telefone");
			var cidade = markers[i].getAttribute("cidade");
			var estado = markers[i].getAttribute("estado");
			var imagem = markers[i].getAttribute("imagem");
			var telefone_formatado = "";
			if (ddd != ""){
				if (telefone != ""){
					telefone_formatado = "(" + ddd + ") " + telefone;
				}
			}
			output += '<li id="' + codigo + '"><a href="#"><img style="height:100%" src="img/painel/' + imagem + '" /><h3>' + nome + '</h3><p>' + telefone_formatado + '</p></a></li>';
		};
		$('#listview').append(output).listview('refresh');
		$("#listview").listview("refresh");
		$(".ConteudoLista").css('max-height',$(window).height()-250);
		$("#listview").show();
		$("#myFilter").show();
		$("#loading").hide();
		}
	});
}		