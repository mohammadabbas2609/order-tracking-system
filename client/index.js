const orderHeader = document.querySelector(".order");
function renderOrder(order) {
  console.log(order);
  orderHeader.textContent = `Id:${order.id} - Status:${order.status}`;
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

// SSE
async function recieveEvent(id) {
  let eventSource;
  try {
    // Create an EventSource to listen to SSE events
    eventSource = new EventSource(`/orders/${id}/events`);

    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };

    // Handle incoming messages
    eventSource.addEventListener("order", (event) => {
      const data = JSON.parse(event.data);
      renderOrder(data);
    });
    // Handle errors
    eventSource.onerror = (error) => {
      console.error("Error connecting to SSE server.", error);
      eventSource.close();
    };
  } catch (error) {
    console.log(error);
    if (eventSource) {
      eventSource.close();
    }
  }
}

recieveEvent(123);
