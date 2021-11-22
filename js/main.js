function accShowContent(number) {
    var show = document.getElementById("accContent" + number);
    var hide = document.getElementById("accHeader" + number);
    show.style.display = "block";
    hide.style.display = "hidden";
}

function accHideContent(number) {
    var show = document.getElementById("accHeader" + number);
    var hide = document.getElementById("accContent" + number);
    show.style.display = "block";
    hide.style.display = "hidden";
}

function testingshit() {
    console.log("fek");
}