import express from "express";

const app = express();
app.use(express.json());

app.use(express.static("client"));

const orders = {
  123: {
    id: 123,
    status: "PLACED",
  },
};

// Short Polling

// app.get("/orders/:id", (req, res) => {
//   const order = orders[req.params.id];

//   if (!order) {
//     return res.status(404).json({ error: "Order not found" });
//   }

//   res.json(order);
// });

// app.post("/orders/:id/status", (req, res) => {
//   const order = orders[req.params.id];

//   if (!order) {
//     return res.status(404).json({ error: "Order not found" });
//   }

//   order.status = req.body.status;

//   res.json(order);
// });

// Long Polling
// const waiters = new Map();

// function removeConnection(id, res) {
//   const waitersForOrder = waiters.get(id);

//   if (!waitersForOrder) return;

//   const index = waitersForOrder.indexOf(res);

//   if (index !== -1) {
//     waitersForOrder.splice(index, 1);
//   }

//   if (waitersForOrder.length === 0) {
//     waiters.delete(id);
//   }
// }

// app.get("/order/:id/updates", (req, res) => {
//   const id = req.params.id;

//   let orderWaiters = waiters.get(id);

//   if (!orderWaiters) {
//     orderWaiters = [];
//     waiters.set(id, orderWaiters);
//   }

//   orderWaiters.push(res);

//   // Will wait for 30s for response else close it
//   const timer = setTimeout(() => {
//     removeConnection(id, res);
//     res.status(204).end();
//   }, 30_000);

//   req.on("close", () => {
//     clearTimeout(timer);
//     removeConnection(id, res);
//   });
// });

// app.post("/orders/:id/status", (req, res) => {
//   const id = req.params.id;
//   const order = orders[id];

//   if (!order) {
//     return res.status(404).json({
//       error: "Order not found",
//     });
//   }

//   order.status = req.body.status;

//   // Notify anyone waiting
//   const orderWaiters = waiters.get(id) || [];

//   for (const response of orderWaiters) {
//     response.json(order);
//   }

//   waiters.delete(id);

//   res.json(order);
// });

// SSE (Server Sent Events)

const subscribers = new Map();

function removeSubscriber(id, res) {
  const subcribersForOrders = subscribers.get(id);

  if (!subcribersForOrders) return;

  const index = subcribersForOrders.indexOf(res);

  if (index !== -1) {
    subcribersForOrders.splice(index, 1);
  }

  if (subcribersForOrders.length === 0) {
    subscribers.delete(id);
  }
}

app.get("/orders/:id/events", (req, res) => {
  const id = req.params.id;

  res.setHeader("Content-Type", "text/event-stream");

  res.setHeader("Cache-Control", "no-cache");

  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  // Send initial state
  res.write(`event: order\n` + `data: ${JSON.stringify(orders[id])}\n\n`);

  // Save connection
  let subscribersForOrder = subscribers.get(id);

  if (!subscribersForOrder) {
    subscribersForOrder = [];
    subscribers.set(id, subscribersForOrder);
  }

  subscribersForOrder.push(res);

  const timer = setTimeout(() => {
    removeSubscriber(id, res);
    res.end();
  }, 60_000);

  req.on("close", () => {
    clearTimeout(timer);
    removeSubscriber(id, res);
  });
});

function notifyOrderSubscribers(id) {
  const subscribersByOrder = subscribers.get(id) || [];

  for (const res of subscribersByOrder) {
    res.write(`event: order\n` + `data: ${JSON.stringify(orders[id])}\n\n`);
  }
}

app.post("/orders/:id/status", (req, res) => {
  const id = req.params.id;
  const order = orders[id];

  if (!order) {
    return res.status(404).json({
      error: "Order not found",
    });
  }

  order.status = req.body.status;

  notifyOrderSubscribers(id);

  res.json(order);
});

app.listen(3000, () => {
  console.log("Server listening on :3000");
});
