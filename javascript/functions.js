/**
* Cookies
*/
function getCookie(name){
   var needle = name + '=';
   var haystack = document.cookie.split(';');

   for(var i = 0, n = haystack.length; i < n; i++){
       var cookie = haystack[i].trim();
       if(cookie.indexOf(needle) == 0){
           // return the value of the cookie
           return cookie.substring(needle.length, cookie.length);
       }
   }
   return undefined;
}

function setCookie(name, value, days_limite){
   var date = new Date();
   date.setTime(date.getTime() + (days_limite * 60 * 60 * 1000 * 24));
   document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + ';path=/';
}

function deleteCookie(name){
   // deletes a cookie by setting a negativ date
   setCookie(name, '', -1);
}



/**
* Personnalisation du jeu
*/


// envoi un formulaire en ajax
function submitForm(form, callback){
    var method = form.getAttribute('method');
    var action = form.getAttribute('action');
    var type = form.getAttribute('data-type');

    ajaxRequest(action + '?type=' + type, method, formToUrlEncoded(form), callback);
}

// envoi une requête ajax
function ajaxRequest(action, method, values, callback){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == 4 && xhttp.status == 200){
            if(typeof callback === 'function'){
                callback(JSON.parse(xhttp.responseText), xhttp);
            }
        }
    }

    xhttp.open(method, action, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(values);
}

// converti un formulaire en x-www-form-urlencoded
function formToUrlEncoded(form){
    var fields = form.getElementsByTagName('input');
    var str = '';

    for(var i = 0, n = fields.length; i < n; i++){
        var field = fields[i];

        if(typeof field !== 'undefined'){
            var value = field.value;
            var name = field.getAttribute('name');

            if(value != null && name != null){
                if(str != '') str += '&';
                str += name + '=' + value;
            }
        }
    }

    return str;
}

function objectToUrlEncoded(items){
    var str = '';
    var keys = Object.keys(items);

    for(var i = 0, n = keys.length; i < n; i++){
        if(keys[i] != null && items[keys[i]] != null){
            if(str != '') str += '&';
            str += keys[i] + '=' + items[keys[i]];
        }
    }

    return str;
}



/**
* FORMS & autres
*/

function hide(element){
    element.style.display = 'none';
}

function show(element){
    element.style.display = 'block';
}

function showMessages(form, messages){
    // show targets
    if(typeof messages !== 'undefined'){
        for(var i = 0; i < messages.length; i++){
            show(document.getElementById(messages[i]));
        }
    }
}

function clearMessages(form){
    // hide all
    var all = form.getElementsByClassName('message');
    for(var i = 0; i < all.length; i++){
        if(typeof all[i] !== 'undefined'){
            hide(all[i]);
        }
    }
}


function lock(form){
    var all = form.getElementsByTagName('input');
    for(var i = 0; i < all.length; i++){
        if(typeof all[i] !== 'undefined'){
            all[i].setAttribute('disabled', true);
        }
    }
}
