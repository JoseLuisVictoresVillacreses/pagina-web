// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// 🔐 Configura tu cuenta (SMTP de Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'avila-luis1034@unesum.edu.ec',      // <- CAMBIA ESTO
    pass: 'zkii suic nrrw xsbq'  // <- USA contraseña de aplicación, no tu clave personal
  }
});

app.post('/enviar-pedido', (req, res) => {
  const { carrito, numeroCliente, correoCliente } = req.body;

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const lista = carrito.map(p =>
    `• ${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toFixed(2)}`
  ).join('\n');

  const contenido = `
Nuevo pedido desde la tienda:

${lista}

Total: $${total.toFixed(2)}

Contacto: 
WhatsApp: ${numeroCliente || 'No proporcionado'}
Email: ${correoCliente || 'No proporcionado'}
  `;

  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to: 'TU_CORREO_DESTINO@gmail.com', // ← TU CORREO RECEPTOR
    subject: '👜 Nuevo pedido recibido - Miss Saria',
    text: contenido
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar correo:', error);
      return res.status(500).json({ error: 'Error al enviar el correo.' });
    }
    console.log('Correo enviado:', info.response);
    res.json({ mensaje: 'Correo enviado correctamente.' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

