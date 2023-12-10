
function init(){
    getProducts();
    getCarts();
}
init()

let products;
// 取得產品資料並渲染
const productWrap = document.querySelector('.productWrap');
function getProducts() {
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/products`;
    axios.get(url)
        .then(res => {
            products = res.data.products;
            renderProduct(products);

        })
        .catch(err => {
            console.log(err);

        });
}

function renderProduct(products) {
    let str = '';
    products.forEach(item => {
        str += `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item['origin_price']}</del>
        <p class="nowPrice">NT$${item.price}</p>
    </li>`;
    });
    productWrap.innerHTML = str;
    const addCardBtn = document.querySelectorAll('.addCardBtn');
    addCardBtn.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            addCart(e.target.dataset.id);
        });
    });
}

// 篩選功能
const productSelect = document.querySelector('.productSelect')
productSelect.addEventListener('change', e => {
    let filterproducts = [];
    if(e.target.value === "全部") {
        filterproducts = products
    } else {
        filterproducts = products.filter(item => {
            return item.category === e.target.value
        })
    }
    renderProduct(filterproducts)
})

// 加入購物車功能
function addCart(id) {
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
    let obj = {
        "data": {
            "productId": id,
            "quantity": 1
        }
    };
    axios.post(url, obj)
        .then(res => {
            renderCarts(res.data);
        })
        .catch(err => {
            console.log(err.response.data.message);

        });
}

// 取得購物車資料並渲染
const shoppingCart = document.querySelector('.shoppingCart-table');

function getCarts() {
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
    axios.get(url)
        .then(res => {
            let cart = res.data;
            renderCarts(cart);
        })
        .catch(err => {
            console.log(err);
        });
}

function renderCarts(cart) {
    let cartList = '';
    cart.carts.forEach(item => {
        cartList += `<tr>
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td>NT$${item.product.price}</td>
    <td>1</td>
    <td>NT$${item.product.price}</td>
    <td class="discardBtn" >
        <a href="#" class="material-icons" data-cartid="${item.id}">
            clear
        </a>
    </td>
</tr>`;

    });

    let str = `<tr>
<th width="40%">品項</th>
<th width="15%">單價</th>
<th width="15%">數量</th>
<th width="15%">金額</th>
<th width="15%"></th>
</tr>${cartList}<tr>
<td>
    <a href="#" class="discardAllBtn">刪除所有品項</a>
</td>
<td></td>
<td></td>
<td>
    <p>總金額</p>
</td>
<td class="cartTotalPrice">NT$${cart.finalTotal}</td>
</tr>`;
    shoppingCart.innerHTML = str;
    const discardBtn = document.querySelectorAll('.discardBtn');
    discardBtn.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            deleteCart(e.target.dataset.cartid);
        });
    });
    const discardAllBtn = document.querySelector('.discardAllBtn');
    discardAllBtn.addEventListener('click', e => {
        e.preventDefault();
        deleteAllCart();
    });
}

// 刪除購物車單一品項
function deleteCart(id) {
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${id}`;
    axios.delete(url)
        .then(res => {
            renderCarts(res.data);
        })
        .catch(err => {
            console.log(err);
        });
}
// 清空購物車
function deleteAllCart() {
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
    axios.delete(url)
        .then(res => {
            renderCarts(res.data);
            setTimeout(function(){alert(res.data.message)},800)
        })
        .catch(err => {
            console.log(err.response.data.message);
        });
}

// 送出訂單
const orderInfoForm = document.querySelector('.orderInfo-form')
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerEmail = document.querySelector('#customerEmail');
const customerAddress = document.querySelector('#customerAddress');
const tradeWay = document.querySelector('#tradeWay');
const submitOrder = document.querySelector('.orderInfo-btn');

submitOrder.addEventListener('click', e => {
    e.preventDefault()
    addOrder()
    orderInfoForm.reset()
})
    
function addOrder() {
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/orders`;
    let obj = {
        "data": {
            "user": {
                "name": customerName.value.trim(),
                "tel": customerPhone.value.trim(),
                "email": customerEmail.value.trim(),
                "address": customerAddress.value.trim(),
                "payment": tradeWay.value.trim()
            }
        }
    };
    axios.post(url, obj)
        .then(res => {
            getCarts();
            setTimeout(function(){alert(`訂單送出成功！`)},800)
        })
        .catch(err => {
            console.log(err.response.data.message);
            setTimeout(function(){alert(err.response.data.message)},800)
        })
}


