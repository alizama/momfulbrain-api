export default async function handler(req, res) {
  const planes = {
    "inicio":   { name: "Plan Inicio",         price: 245.00, cancel: "plan-inicio" },
    "avanzado": { name: "Plan Avanzado",        price: 300.00, cancel: "plan-avanzado" },
    "premium":  { name: "Plan Premium",         price: 445.00, cancel: "plan-premium" },
    "agenda":   { name: "Agenda tu consulta",   price: 0.50,   cancel: "agenda-tu-consulta" }
  };

  const plan = planes[req.query.plan];
  if (!plan) return res.status(400).json({ error: "Plan inválido" });

  const response = await fetch("https://api-pay.n1co.shop/api/paymentlink/checkout", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.N1CO_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      orderName: plan.name,
      lineItems: [{ product: { name: plan.name, price: plan.price }, quantity: 1 }],
      successUrl: "https://momfulbrainsv.com/gracias",
      cancelUrl: `https://momfulbrainsv.com/products/${plan.cancel}`
    })
  });

  const data = await response.json();
  res.redirect(302, data.paymentLinkUrl);
}
