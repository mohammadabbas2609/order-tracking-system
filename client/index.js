const orderHeader = document.querySelector('.order')
function renderOrder(order){

  console.log(order)
  orderHeader.textContent = `Id:${order.id} - Status:${order.status}`  
}

// Short Polling
// async function watchOrder() {
//   while (true) {
//     const response = await fetch("/orders/123");
//     const order = await response.json();

//     renderOrder(order);

//     await new Promise(resolve => setTimeout(resolve, 5000));
//   }
// }

// watchOrder();


// Long Pollig
// async function longPollOrder(id) {
//   while (true) {
//     try {
//       const response = await fetch(
//         `/order/${id}/updates`
//       );

//       const order = await response.json();

//       renderOrder(order);

//     } catch (err) {
//       console.error(err);

//       await new Promise(resolve =>
//         setTimeout(resolve, 2000)
//       );
//     }
//   }
// }


// longPollOrder(123)


