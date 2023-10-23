const mercadopago = require('mercadopago')
require("dotenv").config();
const { Purchase, Comic } = require("../db");
const { FRONT_HOST, PORTS_SERVER, MP_AR_ACCESS_TOKEN, MP_PE_ACCESS_TOKEN, DEV, FE_DEPLOY, BE_DEPLOY } = process.env;
const transporter = require("../nodemailer/postEmail");

let comics = {};
let loggedUser = {};

const createOrder = async (req, res) => {
    const { user, cart } = req.body;
    try {
      if (!user) throw new Error("Usuario no Registrado");
    } catch (error) {
      console.log(error);
    }
    comics = cart;
    loggedUser = user;

    mercadopago.configure({
        access_token: MP_AR_ACCESS_TOKEN,
    });
    const result = await mercadopago.preferences.create({
        items: [
        
            {
                title: 'Pago KapowVerse',
                unit_price: cart.totalPrice,
                currency_id: 'ARS',
                quantity: 1,
            },
        ],
        back_urls: {
            success: `${
            DEV === "development"
                ? `${FRONT_HOST}/home`
                : `${FE_DEPLOY}/home`
            }`,
            failure: `${
                DEV === "development"
                    ? `${FRONT_HOST}/home`
                    : `${FE_DEPLOY}/home`
                }`,
            pending: `${
                DEV === "development"
                    ? `${FRONT_HOST}/payment/pending`
                    : `${FE_DEPLOY}/payment/pending`
                }`,
        },
        auto_return: "approved",
        notification_url:`${
            DEV === "development"
                ? `${PORTS_SERVER}/payment/webhook`
                : `${BE_DEPLOY}/payment/webhook`
            }`,       
    });
    res.send(result.body);

};

const receiveWebhook = async (req, res) => {
    const payment = req.query;

    try {
        if (payment.type === 'payment') {
            const data = await mercadopago.payment.findById(payment["data.id"]);
            if (data.response.status === 'approved') {
                if (comics) {
                    for (const comic of comics.cart) {
                        const purchase = await Purchase.create({
                            userId: loggedUser.id,
                            comicId: comic.id,
                            mpId: data.response.id,
                            total: comics.totalPrice,
                            quantity: comic.quantity,
                            status: data.response.status,
                        });
                        const comicDB = await Comic.findByPk(comic.id);
                        comicDB.stock -= comic.quantity;
                        await comicDB.save();
                    }
                }
                const emailOptions = {
                    from: "kapowverse@gmail.com",
                    to: loggedUser.email,
                    subject: "Pago exitoso",
                    text: "Tu pago ha sido exitoso",
                    html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                    </head>
                    <body>
                        <h1>Pago exitoso</h1>
                        <p>Tu pago ha sido exitoso.</p>
                    </body>
                    </html>`,
                  };
                  transporter.sendMail(emailOptions, (error, info) => {
                    if (error) {
                      console.log("Email error: ", error.message);
                    } else {
                      console.log("Correo enviado correctamente 📧");
                    }
                  });
                
            }
            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500).json({ error: error.message });
    }
};


module.exports = { createOrder, receiveWebhook };

