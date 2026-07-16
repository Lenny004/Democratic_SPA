function reloj(){
    var hoy = new Date();
    var hr = hoy.getHours();
    var min = hoy.getMinutes();
    var sec = hoy.getSeconds();
    var zona = hoy.getTimezoneOffset()/60;
    //Agregamos un cero en frente de los números menores a 10
    if (zona>0) {
        zona = '+' + zona;
    }
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = hr + " : " + min + " : " + sec + " - UTC" + zona;
    var time = setTimeout(function(){ reloj() }, 500);
}

function checkTime(i){
    if (i < 10){
        i = "0" + i;
    }
    return i;
}

function fecha(){
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();

    document.getElementById("date").innerHTML = dia + " / " + mes + " / " + anio;
}

function fechaE(){
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();

    document.getElementById("date").innerHTML = mes + " / " + dia + " / " + anio;
}