const orderHeader = document.querySelector('.order')
function renderOrder(order){

  console.log(order)
  orderHeader.textContent = `Id:${order.id} - Status:${order.status}`  
}

Short Polling
// async function watchOrder() {
//   while (true) {
//     const response = await fetch("/orders/123");
//     const order = await response.json();

//     renderOrder(order);

//     await new Promise(resolve => setTimeout(resolve, 5000));
//   }
// }

// watchOrder();


