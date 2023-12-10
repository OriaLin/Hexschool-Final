// 後台管理
function init() {
    getOrders();
}
init();

// 取得訂單列表
const orderPageTable = document.querySelector('.orderPage-table');

function getOrders() {
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
    let headers = {
        headers: {
            authorization: token
        }
    };
    axios.get(url, headers)
        .then(res => {
            let orderData = res.data.orders;
            renderOrders(orderData);
            renderChart(orderData);
        })
        .catch(err => {
            console.log(err);

        });
}
// C3.js圓餅圖 Lv.1
function renderChart(orderData) {
    let chartData = [];
    let singleChartData = {};
    let chartColors={};
    let colorsArr =["#DACBFF","#9D7FEA","#5434A7","#301E5F"]
    // 外部forEach每筆訂單
    orderData.forEach(item => {
        let orderProductCategory = item.products;
        // 內部forEach組每筆訂單中的產品
        orderProductCategory.forEach(orderProductItem => {
            if (singleChartData[orderProductItem.category] === undefined) {
                singleChartData[orderProductItem.category] = 1;
            } else {
                singleChartData[orderProductItem.category] += 1;
            }
        });
    });
    console.log(singleChartData);
    let keyArr = Object.keys(singleChartData);
    let valueArr = Object.values(singleChartData);
    chartData = keyArr.map(function (item, index) {
        return [item, valueArr[index]];
    });
    
    keyArr.forEach(function(item,index){
        chartColors[item] = colorsArr[index]
    })
    
    let chart = c3.generate({
        data: {
            columns: chartData,
            type: 'pie',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); },
            colors: chartColors
        }
    });
}
// C3.js圓餅圖 Lv.2（未完成，卡在將4-8名整理為其他）
// function renderChart(orderData) {
//     let chartData = [];
//     let singleChartData = {};
//     let chartColors={};
//     let colorsArr =["#DACBFF","#9D7FEA","#5434A7","#301E5F"]
//     // 外部forEach每筆訂單
//     orderData.forEach(item => {
//         let orderProductCategory = item.products;
//         // 內部forEach組每筆訂單中的產品
//         orderProductCategory.forEach(orderProductItem => {
//             if (singleChartData[orderProductItem.title] === undefined) {
//                 singleChartData[orderProductItem.title] = 1;
//             } else {
//                 singleChartData[orderProductItem.title] += 1;
//             }
//         });
//     });
//     console.log(singleChartData);
//     let keyArr = Object.keys(singleChartData);
//     let valueArr = Object.values(singleChartData);
//     chartData = keyArr.map(function (item, index) {
//         return [item, valueArr[index]];
//     });
    
//     keyArr.forEach(function(item,index){
//         chartColors[item] = colorsArr[index]
//     })
    
//     let chart = c3.generate({
//         data: {
//             columns: chartData,
//             type: 'pie',
//             onclick: function (d, i) { console.log("onclick", d, i); },
//             onmouseover: function (d, i) { console.log("onmouseover", d, i); },
//             onmouseout: function (d, i) { console.log("onmouseout", d, i); },
//             colors: chartColors
//         }
//     });
// }
// console.log(chartData);
// console.log(chartData.isArray());


function renderOrders(orderData) {
    let orderItem = '';
    // 外部forEach組每筆訂單的字串
    orderData.forEach(item => {
        let orderProducts = item.products;
        let orderProductItems = '';
        // 內部forEach組每筆訂單中產品的字串
        orderProducts.forEach(orderProductItem => {
            orderProductItems += `<p>${orderProductItem.title}</p>`;
        });
        if (item.paid) {
            orderItem += `<tr>
        <td>${item.createdAt}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          ${orderProductItems}
        </td>
        <td>${new Date(item.createdAt).getFullYear()}/${new Date(item.createdAt).getMonth()}/${new Date(item.createdAt).getDate()}</td>
        <td class="orderStatus">
          <a href="#">已處理</a>
          <input type="button" class="changeOrderStatus-Btn" data-orderid="${item.id}" data-orderstatus="true" value="更改狀態">
        </td>
        <td>
              <input type="button" class="delSingleOrder-Btn" data-orderid="${item.id}" value="刪除">
            </td>
    </tr>`;
        } else if (!item.paid) {
            orderItem += `<tr>
            <td>${item.createdAt}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
            ${orderProductItems}
            </td>
            <td>${new Date(item.createdAt).getFullYear()}/${new Date(item.createdAt).getMonth()}/${new Date(item.createdAt).getDate()}</td>
            <td class="orderStatus">
              <a href="#">未處理</a>
              <input type="button" class="changeOrderStatus-Btn" data-orderid="${item.id}" data-orderstatus="false" value="更改狀態">
            </td>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" data-orderid="${item.id}" value="刪除">
        </tr>`;
        }
    });
    let str = `<thead>
    <tr>
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單日期</th>
        <th>訂單狀態</th>
        <th>操作</th>
    </tr>
</thead>${orderItem}`;
    orderPageTable.innerHTML = str;

    //更改訂單狀態
    const changeOrderStatusBtn = document.querySelectorAll(".changeOrderStatus-Btn");
    changeOrderStatusBtn.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            editOrderStatus(e.target.dataset.orderid, JSON.parse(e.target.dataset.orderstatus));
        });
    });

    // 刪除單一訂單
    const delSingleOrderBtn = document.querySelectorAll('.delSingleOrder-Btn');
    delSingleOrderBtn.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            deleteSingleOrder(e.target.dataset.orderid);
        });
    });

    // 清除全部訂單
    const discardAllBtn = document.querySelector('.discardAllBtn');
    discardAllBtn.addEventListener('click', e => {
        e.preventDefault();
        discardAllOrders();
    });

}

// 修改訂單狀態
function editOrderStatus(orderId, boolean) {
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
    let obj = {
        "data": {
            "id": orderId,
            "paid": !boolean
        }
    };
    let headers = {
        headers: {
            authorization: token
        }
    };
    axios.put(url, obj, headers)
        .then(res => {
            console.log(res);
            renderOrders(res.data.orders);
        })
        .catch(err => {
            console.log(err.response.data.message);

        });
}

// 刪除單一訂單
function deleteSingleOrder(id) {
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders/${id}`;
    let headers = {
        headers: {
            authorization: token
        }
    };
    axios.delete(url, headers)
        .then(res => {
            console.log(res);
            renderOrders(res.data.orders);
        })
        .catch(err => {
            console.log(err.response.data.message);

        });
}

// 刪除所有訂單
function discardAllOrders() {
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
    let headers = {
        headers: {
            authorization: token
        }
    };
    axios.delete(url, headers)
        .then(res => {
            renderOrders(res.data.orders);
            setTimeout(function () { alert(res.data.message); }, 800);

        })
        .catch(err => {
            console.log(err.response.data.message);
        });
}
