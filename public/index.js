const b = document.getElementsByTagName('h1');

b[0].addEventListener('click', (event) => {
    let kek = document.getElementById('kek2');
    kek.innerHTML = 'sobaka';
    kek.style = 'background: blue';
    event.stopImmediatePropagation();
})

const title = document.getElementById('kek');

title.addEventListener('click', () => {
    title.style = 'background: red';
})

function a() {
    console.log('kek');
}

a();
