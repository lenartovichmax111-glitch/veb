let info = navigator.userAgent;
localStorage.setItem("infoBrowzer", info);

let footer = document.getElementById("footer-info");
let iB = localStorage.getItem("infoBrowzer");
footer.innerText = iB;