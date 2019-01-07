
/*
starwars.js
 3:00 pm verson

*/

"use strict";
var foe = {};
var $htmlString = "";
var selectedChar = ""; // your character, key to map
var inBattle = false;
var currentEnimy = "";  // enimy you are current enimy
var you = "";
var theme = $('#theme')[0];
var numDefeated = 0;
var playerWon = false;

class character {
    //hit points, attackPower and counterattack power
    constructor(id, name, hp, ap, cap, image) {
        this.idname = id;
        this.name = name;
        this.hitPoints = hp;
        this.attackPower = ap;
        this.counterattackPower = cap;
        this.baseAttackPower = ap;
        this.image = "assets/images/" + image + ".jpg";
    }
    incr_attackPower() {
        this.attackPower += this.baseAttackPower;
    }
}
// initialize global characters
foe["jarjar"] = new character("jarjar", "Jar Jar",          105, 35, 40, "jarjar");
foe["handssolo"] = new character("handssolo", "Hands Solo", 95, 30, 41, "handssolo");
foe["r2d2"] = new character("r2d2", "R2D2",                 100, 20, 35, "r2d2");
foe["c3po"] = new character("c3po", "C3PO",                 130, 35, 55, "c3po");


function $make_player(thekey, sectionid) // key is for foes, sectionid = html id
{
    // \n does nothing but made html_s prettier for debugging...
    let html_s = '<div class="column gametext">\n';
    html_s = html_s + '            <h5 class="text-center">' + foe[thekey].name + '</h5>\n';
    html_s = html_s + '            <img src="' + foe[thekey].image + '" class="charbtn" id=' + sectionid + ' >\n';
    html_s = html_s + '            <h5 class="text-center" id = "' + 'hp' + thekey + sectionid + '">' + foe[thekey].hitPoints + '</h5>\n';
    html_s = html_s + '</div>\n';
    return (html_s);
}

// initially display all players in the lineup section
for (var key in foe)
    $("#charrow").append($make_player(key, key));

$("#instructions").html("<h1>Choose a character to represent yourself!</h1>");
// initially hide both reload and fight buttons since they are not applicable most of the time
$("#fight").hide();
$("#doreload").hide();



// select your character or select enimies, this will dissapear when in "battle" mode
$(".charbtn").click(function (event) {
    theme.play();
    selectedChar = $(this).attr("id");
    if (you == "") {   
        $(this).hide();
        $(this).siblings().hide(); 
        $htmlString = $make_player(selectedChar, "battle" + selectedChar); // was key
        $("#you").append($htmlString);
        you = foe[selectedChar];
    }
    else if (!inBattle) // pick a new character or it is time to battle
    {

        $(this).hide();
        $(this).siblings().hide(); // cool!
        $htmlString = $make_player(selectedChar, "battle" + selectedChar); // was key
        $("#enimy").append($htmlString); // was you
        currentEnimy = foe[selectedChar];

    }
    if (currentEnimy == "")
        $htmlString = "You are:" + you.name + ", Choose an enimy!";
    else if (inBattle) {
        $htmlString = "You are:" + you.name + ", currently battling " + currentEnimy.name;
        inBattle = true;
    }
    else {
        $htmlString = "You are:" + you.name + ", good luck defeating " + currentEnimy.name + "!!!";
        $("#fight").show();
        $(".lineup").hide();
        inBattle = true;
    }
    $('#instructions').html('<h1>' + $htmlString + '</h1>');
});

// battle button, only applicable when visable
//// play until either character "dies", then make you and the lineup visible again
$("#fight").click(function () {
    $htmlString = "<h1>" + you.name + " attacks " + currentEnimy.name + " for " + you.attackPower + " damage; <br> " +
        currentEnimy.name + " counterattacks " + " for " + currentEnimy.counterattackPower + " damage points";

    currentEnimy.hitPoints = currentEnimy.hitPoints - you.attackPower;
    if (currentEnimy.hitPoints >= 1) // only allow enimy to counterattack if not dead
        you.hitPoints = you.hitPoints - currentEnimy.counterattackPower;

    if (you.hitPoints < 1) {
        $("#instructions").text("You are dead!");
        $htmlString = "You were defeated by " + currentEnimy.name;
        $('#hp' + you.idname + 'battle' + you.idname).html("you are DEAD");
        $("#hp" + you.idname + 'battle' + you.idname).hide(2000); // hide the dead character
        $("#hp" + you.idname + 'battle' + you.idname).siblings().hide(); // hide the dead character
        $("#fight").hide(2000);
        $("#doreload").show(); // alow user to play again by being able to press button
        inBattle = false;
        playerWon = false;
    }
    else {
        $('#hp' + you.idname + 'battle' + you.idname).html(you.hitPoints);
    }

    if (currentEnimy.hitPoints < 1) {
        $('#hp' + currentEnimy.idname + 'battle' + currentEnimy.idname).html("DEAD");
        inBattle = false;
        numDefeated++;
        if (numDefeated == 3) {
            $("#doreload").show();  //allow user to play again
            $htmlString = "You have defeated all three enimies!  Click &LTplay again&GT if you dare!";
        }
        else {
            $htmlString = $htmlString + "<br>You defeated " + currentEnimy.name + "!  Choose a new enimy.";
            playerWon = true;
        }
    }
    else {
        $('#hp' + currentEnimy.idname + 'battle' + currentEnimy.idname).html(currentEnimy.hitPoints);
    }
    if (!inBattle) {
        if (you.hitPoints >= 1) {
            $("#battle" + currentEnimy.idname).siblings().hide(); // hide the dead character
            $("#battle" + currentEnimy.idname).hide(2000);
            $("#fight").hide();
        }
        if(playerWon)
            $(".lineup").show(); // show remaining (if any) enimies 
    }
    you.incr_attackPower();
    $("#instructions").html($htmlString);
});

// let user run game again, after beeing defeated or killing all 3 enimies 
$("#doreload").click(function () { // run this game again 
    location.reload(true);
});


