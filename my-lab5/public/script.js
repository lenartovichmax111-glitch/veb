let info = navigator.userAgent;
localStorage.setItem("infoBrowzer", info);

let footer = document.getElementById("footer-info");
let iB = localStorage.getItem("infoBrowzer");
footer.innerText = iB;



let url = "https://jsonplaceholder.typicode.com/posts/1/comments";
let blockForComment = document.getElementById("comments-text");

fetch(url)
    .then((response) => response.json())
    .then(comments => {
        comments.forEach(comment => {
            blockForComment.innerHTML +=`
            <p>ID: ${comment.id}<br> 
            Ім'я: ${comment.name}<br> <span class="bold-text">Email:</span> ${comment.email}</p>
            <p>${comment.body}</p>
            <hr>
            `
        });
    });


let modal = document.getElementById("modalWindow");
let closec = document.getElementById("modal-close");
let form = document.getElementById("form");

function setTimer(){
    return setTimeout(function(){
        form.reset();
        modal.style.display = "block";
}, 60000);
}

let timer = setTimer();

closec.onclick = function(){
    modal.style.display = "none";
    clearTimeout(timer);
    timer = setTimer();
}



let buton = document.getElementById("temu");

function autoTemu(){
    let time = new Date().getHours();

    if(time >= 7 && time <21){
        document.body.classList.remove("dark");
    }
    else{
        document.body.classList.add("dark");
    }
}
autoTemu();

buton.onclick = function(){
    document.body.classList.toggle("dark");
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();


    const data = Object.fromEntries(new FormData(form).entries());


    let errorStyle = document.getElementById("error");
    const responce = await fetch("/api/contact", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(responce.ok){
        errorStyle.style.display = "none";
        modal.style.display = "none";
        clearTimeout(timer);
        timer = setTimer();
    }else{
        const errorData = await responce.json();
        errorStyle.innerText = "⚠️ " + (errorData.message || "Помилка валідації");
        errorStyle.style.display = "block";
    }
});