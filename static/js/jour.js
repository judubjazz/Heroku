
$(document).ready(()=>{
    if($('#span_bowser').length >0 ){
        showText("#span_bowser", "AUCUNE DONNÉE POUR CE JOUR", 0, 100);
    }
    if($('#erreur_404').length > 0) {
        showText("#erreur_404", "IL N'Y A PAS DE MATRICULE À CE NOM", 0, 100);
    }
    // if($('#date_p').length > 0) {
    //     $( "#date_p" ).html(window.location.href.slice(-10));
    // }
});



// https://stackoverflow.com/questions/7264974/show-text-letter-by-letter
showText = (target, message, index, interval)=> {
    if (index < message.length) {
        $(target).append(message[index++]);
        setTimeout( ()=> {showText(target, message, index, interval);}, interval);
    }

};


/**
 *construit un url pour visualiser le mois du post
 *
 */
overview_calendar = ()=>{
    let pathname = location.href.slice(-18,-10);
    console.log(pathname);
    console.log(pathname.slice(0,8));
   let url = location.protocol + location.hostname +':'+ location.port + pathname;
   url +='overview/';
   url +=location.href.slice(-10,-3);
   url = new URL(url);
   window.location.href=url;
};


/**
 * avancer à demain ou reculer à hier
 * @param action : today | tomorrow
 * @param _date: date courrante
 */
naviguer_jour = (action, _date) =>{
    _date = _date.replace(/[^\w\s-]/gi, '');
    let date = new Date(_date);
    let url = window.location.href.slice(0,-10);
    let now = new Date(date.getTime());
    if(action === 'yesterday'){
        let yesterday = new Date (now.setDate(date.getDate() - 1));
        let day_tostring = yesterday.toISOString().slice(0,10);
        window.location.href = url+day_tostring;
    }else if ( action === 'tomorrow'){
        let tomorrow = new Date (now.setDate(date.getDate() + 1));
        let day_tostring = tomorrow.toISOString().slice(0,10);
        window.location.href = url+day_tostring;
    }else{
        console.log('error action')
    }
};


/**
 * construit un objet à modifier
 * @param action : DELETE | UPDATE
 * @param id: le id à modifier dans la bd
 */
modifier= (action, id) =>{
    let code_projet = document.getElementById("code_projet" + id).value;
    let matricule = document.getElementById("matricule" + id).value;
    let duree = document.getElementById("duree" + id).value;
    let dateString =document.getElementById("date" + id).value;
    let mois = window.location.pathname.slice(-7);

    let object_json= {"id":id,"code_projet": code_projet, "matricule": matricule, "date_publication" :dateString, "duree": duree, "mois": mois};
     console.log(object_json);

     if (action === 'supprimer'){
        submit_object_json(object_json, 'DELETE')
     }else{
        submit_object_json(object_json, 'UPDATE')
     }

};


/**
 * fetch sur la base de donnée
 * @param object_json : object à soumettre
 * @param action: UPDATE | DELETE
 */
submit_object_json = (object_json, action)=>{

    let url= new URL(location.protocol + location.hostname +':'+ location.port + '/login');
    fetch(url, {
          method:action,
          headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(object_json)
      })
          .then(result => {
              if (result.ok){
                  //pour reloader apres execution de la function showdiv
                $('#div_mario').bind('showText', showText("#span_mario", "YAHOOOOO!", 0, 50));

                //show le div et trigger showText
                $('#div_mario').show('slow','linear', ()=>{
                    $(this).trigger('showText').then(window.location.reload());
                });

              }
              console.log(result);
           })
          .catch(error => {
                  console.log('login():Erreur : ' + error.stack);
                  alert(error.stack)
              }
          )
          .then((response) => {console.log(response);});
};