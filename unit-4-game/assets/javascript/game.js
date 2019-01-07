
/*
starwars.js

variables are not camelCase because camelCase makes it harder to read

I need new glasses


*/

"use strict";
var foe = {};
var $htmlstring = "";
var selectedchar = ""; // your character, key to map
var inbattle = false;
var currentenimy = "";  // enimy you are current enimy
var you = "";
var theme = $('#theme')[0];
var runagain;
var numdefeated = 0;

class character {
    //hit points, attackpower and counterattack power
    constructor(id, name, hp, ap, cap, image) {
        this.idname = id;
        this.name = name;
        this.hitpoints = hp;
        this.attackpower = ap;
        this.counterattackpower = cap;
        this.baseattackpower = ap;
        this.image = "assets/images/" + image + ".jpg";
    }
    incr_attackpower() {
        console.log("b4" + this.attackpower);
        this.attackpower += this.baseattackpower;
        console.log("after" + this.attackpower);
    }
}
// initialize global characters
foe["jarjar"] = new character("jarjar", "Jar Jar",          70,  40, 45, "jarjar");
foe["handssolo"] = new character("handssolo", "Hands Solo", 80,  35, 55, "handssolo");
foe["r2d2"] = new character("r2d2", "R2D2",                 90,  25, 65, "r2d2");
foe["c3po"] = new character("c3po", "C3PO",                 100, 20, 75, "c3po");


function $make_player(thekey, sectionid) // key is for foes, sectionid = html id
{
    // \n does nothing but made html_s prettier for debugging...
    let html_s =      '<div class="column gametext">\n';
    html_s = html_s + '            <h5 class="text-center">' + foe[thekey].name + '</h5>\n';
    html_s = html_s + '            <img src="' + foe[thekey].image + '" class="charbtn" id=' + sectionid + ' >\n';
    html_s = html_s + '            <h5 class="text-center" id = "' + 'hp' + thekey + sectionid + '">' + foe[thekey].hitpoints + '</h5>\n';
    html_s = html_s + '</div>\n';
    return (html_s);
}

// initially display all players in the lineup section
for (var key in foe) 
    $("#charrow").append($make_player(key,key));

$("#instructions").html("<h1>Choose a character to represent yourself!</h1>");
// initially hide both reload and fight buttons since they are not applicable most of the time
$("#fight").hide();
$("#doreload").hide();


// battle button, only applicable when visable
//// play until either character "dies", then make you and the lineup visible again
$("#fight").click(function () {
    you.incr_attackpower();
    $htmlstring = "<h1>" + you.name + " attacks " + currentenimy.name + " for " + you.attackpower + " damage; <br> " +
        currentenimy.name + " counterattacks " + " for " + currentenimy.counterattackpower + " damage points";

    currentenimy.hitpoints = currentenimy.hitpoints - you.attackpower;
    if (currentenimy.hitpoints >= 1) // only allow enimy to counterattack if not dead
        you.hitpoints = you.hitpoints - currentenimy.counterattackpower;

    if (you.hitpoints < 1) {
        $("#instructions").text("You are dead!");
        $htmlstring = "You were defeated by " + currentenimy.name;
        $('#hp' + you.idname + 'battle' + you.idname).html("DEAD");
        $("#hp" + you.idname + 'battle' + you.idname).siblings().hide(); // hide the dead character
        //$("#hp" + you.idname + 'battle' + you.idname).hide(2000);
        $("#fight").hide(2000);
        $("#doreload").show(); // alow user to play again
        inbattle = false;
    }
    else {
        $('#hp' + you.idname + 'battle' + you.idname).html(you.hitpoints);
    }

    if (currentenimy.hitpoints < 1) {
        $('#hp' + currentenimy.idname + 'battle' + currentenimy.idname).html("DEAD");
        inbattle = false;
        numdefeated++;
        if (numdefeated == 3) {
            $("#doreload").show();  //allow user to play again
            $htmlstring = "You have defeated all three enimies!  Click &LTplay again&GT if you dare!";
        }
        else {
            $htmlstring = $htmlstring + "<br>You defeated " + currentenimy.name + "!  Choose a new enimy.";
        }
    }
    else {
        $('#hp' + currentenimy.idname + 'battle' + currentenimy.idname).html(currentenimy.hitpoints);
    }
    if (!inbattle) {
        if (you.hitpoints >= 1) {
            $("#battle" + currentenimy.idname).siblings().hide(); // hide the dead character
            $("#battle" + currentenimy.idname).hide(2000);
            $("#fight").hide();
        }
        $(".lineup").show(); // show remaining (if any) enimies 
    }
    //alert($htmlstring);
    $("#instructions").html($htmlstring);
});
// select your character or select enimies, this will dissapear when in "battle" mode
$(".charbtn").click(function (event) {
    theme.play();
    selectedchar = $(this).attr("id");
    if (you == "") {   //this block gets fired when a new game is created
        $(this).hide();
        $(this).siblings().hide(); // cool, though I could have just removed the div!
        $htmlstring = $make_player(selectedchar, "battle" + selectedchar); // was key
        $("#you").append($htmlstring);
        you = foe[selectedchar];
    }
    else if (!inbattle) // pick a new character or it is time to battle
    {

        $(this).hide();
        $(this).siblings().hide(); // cool!
        $htmlstring = $make_player(selectedchar, "battle" + selectedchar); // was key
        $("#enimy").append($htmlstring); // was you
        currentenimy = foe[selectedchar];

    }
    //topline instructions
    if (currentenimy == "")
        $htmlstring = "You are:" + you.name + ", Choose an enimy!";
    else if (inbattle) {
        $htmlstring = "You are:" + you.name + ", currently battling " + currentenimy.name;
        inbattle = true;
    }
    else {
        $htmlstring = "You are:" + you.name + ", good luck defeating " + currentenimy.name + "!!!";
        $("#fight").show();
        $(".lineup").hide();
        inbattle = true;
    }
    $('#instructions').html('<h1>' + $htmlstring + '</h1>');
});


$("#doreload").click(function () { // run this game again 
    location.reload(true);
});


