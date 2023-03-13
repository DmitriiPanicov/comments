let comments = [];
loadComments();

const inputName = document.getElementById('comment-name');

inputName.addEventListener("click", removeError);



document.getElementById('comment-add').onclick = function (event) {
    event.preventDefault();
    let commentName = document.getElementById('comment-name');
    let commentBody = document.getElementById('comment-body');
    let commentDate = document.getElementById('comment-date');

    if (commentName.value === '') {
        commentName.closest('.form-group').classList.add('error')
        return false
    }

    let comment = {
        name: commentName.value,
        body: commentBody.value,
        time: commentDate.value === '' ? Date.now() : commentDate.value,
        id: Date.now(),
        btnLHart: false
    }

    commentName.value = '';
    commentBody.value = '';
    commentDate.value = '';
    comments.push(comment);
    showComments();
    saveComments();
    addEvenListeners();
}

function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
    if (localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
    addEvenListeners();
}

function showComments() {

    let commentField = document.getElementById('comment-field');
    let out = '';

    comments.forEach(function (item) {
        out += `
        <div class='comment'>
            <div class='comment-head'>
                <p class='user-name'><b>${item.name}</b></p>
                <p class='comment-date'>${timeConverter(item.time)}</p>
            </div>
            <p class='comment-body'>${item.body}</p>
            <div class='buttons'>
                <button type='button' class='btn-trash' id='${item.id}'><i class="fa-solid fa-trash"></i></button>
                <button type='button' class="btn-hart" id='${item.id}' style='color:${item.btnLHart ? 'red' : 'gray'}'><i class="fas fa-heart"></i></button>
            </div>
        </div>
        `;
    });
    commentField.innerHTML = out;
}

function addEvenListeners() {

    const buttonsDelete = document.querySelectorAll('.btn-trash');
    buttonsDelete.forEach(button => {
        button.addEventListener('click', removeComment)
    });

    const buttonsHart = document.querySelectorAll('.btn-hart');
    buttonsHart.forEach(buttonHart => {
        buttonHart.addEventListener('click', btnHartSwith)
    });
}

function timeConverter(time) {

    let dateComment = new Date(time);
    let dateNow = new Date(Date.now());
    
    if (dateNow.getFullYear() === dateComment.getFullYear() && dateNow.getMonth() === dateComment.getMonth()){
        if (dateNow.getDate() === dateComment.getDate()){
            return `сегодня, ${dateComment.getHours()}:${dateComment.getMinutes()}`
        } else if (dateNow.getDate() === dateComment.getDate() + 1){
            return `вчера, ${dateComment.getHours()}:${dateComment.getMinutes()}`
        }
    }
    return `${dateComment.getFullYear()} ${dateComment.getMonth() + 1} ${dateComment.getDate()}, ${dateComment.getHours()}:${dateComment.getMinutes()}`


}

function removeComment(e) {

    //remove from comments list
    let index = comments.findIndex(item => item.id === +(e.currentTarget.id));
    comments.splice(index, 1);

    //remove from DOM
    const currentButton = e.currentTarget;
    currentButton.closest('.comment').remove();

    //remove from localStorage
    localStorage.setItem('comments', JSON.stringify(comments));
}


function btnHartSwith(e) {

    let index = comments.findIndex(item => item.id === +(e.currentTarget.id));

    if (comments[index].btnLHart) {
        comments[index].btnLHart = false
    } else {
        comments[index].btnLHart = true
    };
    showComments();
    addEvenListeners();
    saveComments();
}

function removeError(e) {
    e.currentTarget.closest('.form-group').classList.remove('error');
}