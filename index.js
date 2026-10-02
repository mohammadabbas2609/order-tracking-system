import express from "express";

const app = express();
app.use(express.json());

const orders = {
  123: {
    id: 123,
    status: "PLACED"
  }
};

app.get("/orders/:id", (req, res) => {
  const order = orders[req.params.id];

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

app.post("/orders/:id/status", (req, res) => {
  const order = orders[req.params.id];

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.status = req.body.status;

  res.json(order);
});

app.listen(3000, () => {
  console.log("Server listening on :3000");
});
