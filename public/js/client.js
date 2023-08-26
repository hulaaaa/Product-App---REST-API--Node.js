function renderProduct(i,data) {
    let divCard = document.createElement('div')
    divCard.className = 'card w-96 bg-base-100 shadow-xl';
    document.querySelector('#container').appendChild(divCard);

    let figure = document.createElement('figure')
    figure.innerHTML = `<img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />`
    divCard.appendChild(figure);

    let bodyCard = document.createElement('div');
    bodyCard.className = 'card-body';
    divCard.appendChild(bodyCard);


    let h2 = document.createElement('h2')
    h2.className = 'card-title';
    h2.innerText = data[i].name;
    let badgeDiv = document.createElement('div')
    badgeDiv.className = 'badge badge-secondary'
    badgeDiv.innerHTML = 'New!'
    bodyCard.appendChild(h2)
    h2.appendChild(badgeDiv)
    
    let p = document.createElement('p')
    p.id = 'idPrice'
    p.innerHTML = `$${data[i].price}`;
    bodyCard.appendChild(p)

    let span = document.createElement('span')
    span.innerHTML = `${data[i].id}`;
    span.style.display = 'none';
    p.appendChild(span)

    let cardBtn = document.createElement('div')
    cardBtn.className = 'card-actions justify-end';
    bodyCard.appendChild(cardBtn);

    let cardBtnbadge1 = document.createElement('div')
    cardBtnbadge1.className = 'badge badge-outline badgeEdit';
    cardBtnbadge1.innerHTML = 'Edit'
    cardBtn.appendChild(cardBtnbadge1);
    
    let cardBtnbadge2 = document.createElement('div')
    cardBtnbadge2.className = 'badge badge-outline';
    cardBtnbadge2.innerHTML = 'Remove'
    cardBtn.appendChild(cardBtnbadge2);

    divCard.addEventListener('click', (e) => {
        switch (e.target) {
            case cardBtnbadge1:
                updateProduct(e.target,data[i].id)
                break;
            case cardBtnbadge2:
                deleteProduct(e.target,data[i].id)
                break;
            default:
                if(e.target !== cardBtnbadge1 || cardBtnbadge2) viewProduct(e.target,data[i].id)
                break;
        }        
    })
}
function renderAddBtn() {
    let divCard = document.createElement('div')
    divCard.className = 'card w-96 bg-primary text-primary-content';
    divCard.innerHTML = `
    <div class="card-body">
        <h2 class="card-title">Add New Product</h2>
        <p>Add any product that interesting for you</p>
        <div class="card-actions" style=" justify-content: space-between; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap:10px">
                <input type="text" placeholder="Input name" class="input input-bordered input-s w-50 max-w-xs"  id="idNewCardName">
                <input type="number" placeholder="Input price" class="input input-bordered input-s w-50 max-w-xs"  id="idNewCardPrice">
            </div>
            <button class="btn" id="btnAddProduct">Add</button>
        </div>
    </div>`
    document.querySelector('#container').appendChild(divCard);

    document.querySelector('#btnAddProduct').addEventListener('click',async(e)=>{
        const requestData = {
            name: document.querySelector('#idNewCardName').value,
            price: document.querySelector('#idNewCardPrice').value
        };
        let response = await fetch(`/api/create`, { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData)
        });
        let data = await response.json();
        document.querySelector('#container').innerHTML = ``
        document.querySelector('#container').style.display = 'flex';
        for (let i = 0; i < data.length; i++) {
            renderProduct(i,data)
        }
        renderAddBtn()
    })
}
async function viewProduct(e,id){
    let response = await fetch(`/api/product/${id}`);
    if (response.status === 200) {
        let data = await response.json();
        console.log(data);
        document.querySelector('#container').innerHTML = ``

        document.querySelector('.headText').innerHTML = `
        <i class="fa-solid fa-arrow-left" id="btnBackMain" style="font-size: 1.5rem;"></i> 
        Product`
        document.querySelector('.headText').style.display = 'flex'
        document.querySelector('.headText').style = "display:flex;gap:80px;align-items:center;"
        let divCard = document.createElement('div')
        divCard.className = 'card w-90 bg-base-100 shadow-xl';

        document.querySelector('#container').appendChild(divCard);

        let figure = document.createElement('figure')
        figure.innerHTML = `<img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />`
        divCard.appendChild(figure);

        let bodyCard = document.createElement('div');
        bodyCard.className = 'card-body';
        divCard.appendChild(bodyCard);


        let h2 = document.createElement('h2')
        h2.className = 'card-title';
        h2.innerText = data.name;
        let badgeDiv = document.createElement('div')
        badgeDiv.className = 'badge badge-secondary'
        badgeDiv.innerHTML = 'New!'
        bodyCard.appendChild(h2)
        h2.appendChild(badgeDiv)
        
        let p = document.createElement('p')
        p.id = 'idPrice'
        p.innerHTML = `$${data.price}`;
        bodyCard.appendChild(p)

        let span = document.createElement('span')
        span.innerHTML = `${data.id}`;
        span.style.display = 'none';
        p.appendChild(span);

        document.querySelector('#btnBackMain').addEventListener('click',async()=>{
            let response = await fetch('/api/product');
            if (response.status === 200) {
                document.querySelector('#container').innerHTML = '';
                let data = await response.json();
                console.log(data);
                document.querySelector('.headText').innerHTML = `All products`
                document.querySelector('#container').style.display = 'flex';
                for (let i = 0; i < data.length; i++) {
                    renderProduct(i,data)
                }
                renderAddBtn()
            }
        })
    }
}
function updateProduct(e,id){
    let cardBody = e.parentElement.parentElement;
    cardBody.innerHTML = `
    <input type="text" class="input input-bordered input-xs w-full max-w-xs"  id="idCardName">
    <input type="number" class="input input-bordered input-xs w-full max-w-xs"  id="idCardPrice">
    <div class="card-actions justify-end">
        <div class="badge badge-outline" id="badgeEdit">Done</div>
        <div class="badge badge-outline">Remove</div>
    </div>
    `
    document.querySelector('#badgeEdit').addEventListener('click',async(e)=>{
        const requestData = {
            name: document.querySelector('#idCardName').value,
            price: document.querySelector('#idCardPrice').value
        };
        let response = await fetch(`/api/update/${id}`, { 
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData)
        });
        let data = await response.json();
        document.querySelector('#container').innerHTML = ``
        document.querySelector('#container').style.display = 'flex';
        for (let i = 0; i < data.length; i++) {
            renderProduct(i,data)
        }
        
    })
    
}
async function deleteProduct(e,id){
    let response = await fetch(`/api/delete/${id}`, { 
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.status === 200) {
        document.querySelector('#container').innerHTML = ``
        let data = await response.json();
        console.log(data);
        document.querySelector('#container').style.display = 'flex';
        for (let i = 0; i < data.length; i++) {
            renderProduct(i,data)
        }
        renderAddBtn()
    }
}
window.onload = async() =>{
    let response = await fetch('/api/product');
    if (response.status === 200) {
        let data = await response.json();
        console.log(data);
        document.querySelector('#container').style.display = 'flex';
        for (let i = 0; i < data.length; i++) {
            renderProduct(i,data)
        }

        renderAddBtn()
    }
}