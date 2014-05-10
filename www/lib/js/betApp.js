

function resultsController($scope, $http) {

    $scope.bets = [];
    $http.get('http://le-gall.info/betApp/WsBetApp.svc/bets/1').
         success(function (data) {
             $scope.bets = data;

         });

}

function betsController($scope, $http) {

    $scope.bet = {};
    $http.get('http://le-gall.info/betApp/WsBetApp.svc/bets/1').
         success(function (data) {
             $scope.bets = data;
            
         });

}

function betController($scope, $http) {

    $scope.bet = {};
    var idBet = getUrlVars()["id"];
    $http.get('http://le-gall.info/betApp/WsBetApp.svc/bet/' + idBet).
         success(function (data) {
             $scope.bet = data;
             var date = new Date($scope.bet.DateAndTime);
             var madate = moment(new Date(parseInt($scope.bet.DateAndTime.replace('/Date(', '')))).format("DD-MM-YYYY HH:mm");
             $scope.bet.DateAndTime = madate;
         });

}

function adminController($scope, $http) {


    $scope.bets = [];
    $scope.bet = {};
    $scope.user = {};

    $scope.connectMe = function () {

        $http.get('http://le-gall.info/betApp/WsBetApp.svc/user/' + $scope.user.id + '/' + $scope.user.password).
			success(function (data) {
			    $scope.user = data;
			}).
			error(function (data) {
			    alert('pas bon!');
			});
        console.log($scope.user);

        if ($scope.user.id !== null) {
            $http.get('http://le-gall.info/betApp/WsBetApp.svc/bets/' + $scope.user.id ).
                success(function (data) {
                    $scope.bets = data;
                });
            $('#buttonnewBet').show();

        }
    }
    $scope.displayForm = function () {
        $('#newBetForm').show();
        $('#buttonnewBet').hide();
        $('#btnForm').show();

        affichecalendar();

    }

    $scope.controleBet = function () {


        if ((isNaN($scope.bet.Odd))) {
            alert('la c�te contient des caract�res interdits');
        }

        var d = $("#date").val();

        var amin = 2010;
        var amax = 2020;
        var separateur = "-";
        var separateurh = ":";
        var j = (d.substring(0, 2));
        var m = (d.substring(3, 5));
        var a = (d.substring(6, 10));
        var h = (d.substring(11, 13));
        var mm = (d.substring(14, 16));
        var ok = 1;

        if (((isNaN(j)) || (j < 1) || (j > 31)) && (ok == 1)) {
            alert("Le jour n'est pas correct."); ok = 0;
        }
        if (((isNaN(m)) || (m < 1) || (m > 12)) && (ok == 1)) {
            alert("Le mois n'est pas correct."); ok = 0;
        }
        if (((isNaN(a)) || (a < amin) || (a > amax)) && (ok == 1)) {
            alert("L'ann�e n'est pas correcte."); ok = 0;
        }
        if (((isNaN(h)) || (h < 0) || (h > 24)) && (ok == 1)) {
            alert("L'heure n'est pas correcte."); ok = 0;
        }
        if (((isNaN(mm)) || (mm < 0) || (mm > 60)) && (ok == 1)) {
            alert("Les minutes ne sont pas correctes."); ok = 0;
        }
        if (((d.substring(2, 3) != separateur) || (d.substring(5, 6) != separateur) || (d.substring(13, 14) != separateurh)) && (ok == 1)) {
            alert("Les s�parateurs doivent �tre des " + separateur); ok = 0;
        }
        if (ok == 1) {
            // date ok !
        }



        //if $scope.amount=="" ou scope.amount==null
        //pour amount, title, details etc.

    }


    $scope.completeForm = function (aBet) {
        $scope.displayForm();
        $scope.bet = angular.copy(aBet);
        var date = new Date($scope.bet.DateAndTime);
        var madate = moment(new Date(parseInt($scope.bet.DateAndTime.replace('/Date(', '')))).format("DD-MM-YYYY HH:mm");
        $scope.bet.DateAndTime = madate;
        affichecalendar();
        //$("#betId").val(bet.Id);
        //$("#betId").trigger('input');
        //$("#betTitle").val(bet.Title);
        //$("#betTitle").trigger('input');
        //$("#betSport").val(bet.Sport);
        //$("#betSport").trigger('input');


        //$("#betOdd").val(bet.Odd);
        //$("#betBookmaker").val(bet.Bookmaker.replace(/\s/g, ''));
        //$("#betDate").val(bet.Bookmaker);
        //$("#betAmount").val(bet.Amount);
        //$("#betDetails").val(bet.Details);
        $("#buttonCreateUpdate").html('Modifier');
        $("#buttonCancel").show();

    };

    $scope.cancelBet = function () {

      
        $("#buttonCreateUpdate").html('Cr&eacute;er');
        $("#buttonCancel").hide();
        $scope.bet = {};
        return false;

    } 

    $scope.createOrUpdate = function () {

        //if(test tt les champs)
        
        if ($scope.bet.Id == null) {
            $scope.controleBet();
            $scope.bet.DateAndTime = $("#date").val();

            var match = $scope.bet.DateAndTime.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)$/)
            var date = new Date(match[3], match[2] - 1, match[1], match[4], match[5])
            var dateticks = date.getTime();
            $scope.bet.DateAndTime = '\/Date(' + dateticks + '+0200)\/';
            $scope.bet.IdConsumer = $scope.user.Id;


            var JSONObject = {
                "bet": $scope.bet
            };



            $http({
                url: "http://le-gall.info/betApp/WsBetApp.svc/bets",
                method: "POST",
                data: JSON.stringify(JSONObject)
            }).success(function (data, status, headers, config) {
                $scope.bets.push($scope.bet);
                console.log("ok");
                $scope.cancelBet();

            }).error(function (data, status, headers, config) {
                console.log("pas ok");
                console.log(data + " - " + status + " - " + headers + " - " + config);
            });



            //$.ajax({
            //    type: 'POST',
            //    url: "http://le-gall.info/betApp/WsBetApp.svc/bets",
            //    data: JSON.stringify(JSONObject),
            //    contentType: "application/json",
            //    dataType: "json", //Expected data format from server
            //    processdata: true, //True or False
            //    success: function (response) {

            //        alert("Pronostic cr&eacute;&eacute; !");

            //        console.log(response);

            //    },

            //    error: function (xhr, ajaxOptions, thrownError) {

            //        alert("Erreur lors de la cr&eacute;ation du pronostic, contactez l'administrateur!");
            //        console.log(xhr + " - " + ajaxOptions + " - " + thrownError);
            //    }
            //});


        }

        else {

            $scope.bet.DateAndTime = $("#date").val();
            var match = $scope.bet.DateAndTime.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)$/)
            var date = new Date(match[3], match[2] - 1, match[1], match[4], match[5])
            var dateticks = date.getTime();
            $scope.bet.DateAndTime = '\/Date(' + dateticks + '+0200)\/';


            var JSONObject = {
                "bet": $scope.bet
            };

            $http({
                url: "http://le-gall.info/betApp/WsBetApp.svc/bets/update",
                method: "POST",
                data: JSON.stringify(JSONObject)
            }).success(function (data, status, headers, config) {
                console.log("ok");
                $scope.cancelBet();

            }).error(function (data, status, headers, config) {
                console.log("pas ok");
                console.log(data + " - " + status + " - " + headers + " - " + config);
            });



        }
    };



    $scope.delete = function () {


        //if(test tt les champs)


        $scope.bet.DateAndTime = $("#date").val();
        var match = $scope.bet.DateAndTime.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)$/)
        var date = new Date(match[3], match[2] - 1, match[1], match[4], match[5])
        var dateticks = date.getTime();
        $scope.bet.DateAndTime = '\/Date(' + dateticks + '+0200)\/';
        $scope.bet.IdConsumer = 1;

        var JSONObject = {
            "bet": $scope.bet
        };


        $http({
            url: "http://le-gall.info/betApp/WsBetApp.svc/bets",
            method: "DELETE",
            data: JSON.stringify(JSONObject)
        }).success(function (data, status, headers, config) {
            $scope.bets.splice($scope.bets.indexOf($scope.bet), 1);
            console.log("ok");
            $scope.cancelBet();

        }).error(function (data, status, headers, config) {
            console.log("pas ok");
            console.log(data + " - " + status + " - " + headers + " - " + config);
        });









    };







    //alert('lol');

    //$http({
    //    method: "POST",
    //    url: "http://le-gall.info/betApp/WsBetApp.svc/bets/0",
    //    data: JSON.stringify($scope.bet),
    //    headers: {
    //        Accept: "application/json",
    //        contentType: "application/json"
    //    }
    //})
    // .success(function (data) {
    //     alert("Votre article a bien �t� enregistr� et sera examin� par un administrateur.\nVous pouvez le modifier � votre guise jusqu'� ce que la validation soit effectu�e.");
    // })
    // .error(function (jq, status, error) {
    //     alert("Erreur lors de la publication.");
    //     console.log(JSON.stringify(status + " " + error));
    // });



    //$.ajax({
    //    type: "POST",
    //    url: "http://le-gall.info/betApp/WsBetApp.svc/bets/0",
    //    data: $scope.bet,
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    processData: true,
    //    success: function (data, status, jqXHR) {
    //        alert("success..." + data);
    //    },
    //    error: function (xhr) {
    //        alert(xhr.responseText);
    //    }
    //});



    //    $http({
    //        method: "POST",
    //        url: "http://le-gall.info/betApp/WsBetApp.svc/bets/",
    //        data: JSON.stringify($scope.bet),
    //        headers: {
    //            Accept: "application/json",
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            processData: true
    //        }
    //    })
    //.success(function (data) {
    //    alert("Pronostic ajout� !");
    //})
    //.error(function (jq, status, error) {
    //    alert("Erreur lors de la cr�ation.");
    //    console.log(JSON.stringify(status + " " + error));
    //});

   


};



function ajax($scope, $http) {

    $.ajax({
        url: urlWS + "userblog/login",
        type: "PUT",
        data: JSON.stringify(user),
        contentType: "application/json",
        headers: { Accept: "application/json" }
    })
    .success(function (data, status, jq) {
        if (jq.status === 200) { //authentification r�ussie
            alert("Vous �tes connect� !");
            sessionStorage.setItem("logged", true);
            sessionStorage.setItem("user-id", data.id);
            sessionStorage.setItem("role-id", data.role.id);
            location.reload();
        }
        else {
            alert(jq.status + "Nom d'utilisateur ou mot de passe incorrect. Essayez � nouveau.");
            console.log(JSON.stringify(data));
        }
    })
    .error(function (jq, status, error) {
        alert("Erreur lors de l'appel du WebService. Consulter la console pour toute information compl�mentaire.");
        console.log(JSON.stringify(status + " " + error));
    });

}



function getUrlVars() {

    var vars = {};

    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {

        vars[key] = value;

    });

    return vars;

}

function affichecalendar() {

    $('#datetimepicker1').datetimepicker({
        format: "dd-mm-yyyy hh:ii",
        showToday: true,
        language: 'fr'
    });
}

