import express from "express";

const app = express();
app.use(express.json());

app.use(express.static('client'));

const orders = {
  123: {
    id: 123,
    status: "PLACED"
  }
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


// app.get('/order/:id/updates', (req,res) => {
//   const id = req.params.id;

//   let orderWaiters = waiters.get(id);

//   if (!orderWaiters) {
//     orderWaiters = [];
//     waiters.set(id, orderWaiters);
//   }

//   orderWaiters.push(res);

  // req.on("close", () => {
  //     const waitersForOrder = waiters.get(id);

  //     if (!waitersForOrder) return;

  //     const index = waitersForOrder.indexOf(res);

  //     if (index !== -1) {
  //       waitersForOrder.splice(index, 1);
  //     }

  //     if (waitersForOrder.length === 0) {
  //       waiters.delete(id);
  //     }
  //   });
// })

// app.post("/orders/:id/status", (req, res) => {
//   const id = req.params.id;
//   const order = orders[id];

//   if (!order) {
//     return res.status(404).json({
//       error: "Order not found"
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

app.listen(3000, () => {
  console.log("Server listening on :3000");
});
