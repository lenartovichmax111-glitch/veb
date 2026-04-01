require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
        cors: true
    }
    });
    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('./public/index.html');
        }
    });



server.route({
    method: 'POST',
    path: '/api/contact',
    options: {
        validate: {
            payload: Joi.object({
            name: Joi.string().min(3).max(50).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().pattern(/^[0-9+()-\s]*$/).min(10).required(),
            message: Joi.string().min(5).max(1000).required()
            }),
        failAction: (request, h, err)=>{
            throw err;        }
        }
    },
    handler: async (request, h) => {
            console.log("є запит?");
            console.log("Дані з форми:", request.payload);
            const { name, email, phone, message } = request.payload;
            try{
                await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'maksym.lenartovych.kb.2024@lpnu.ua',
                subject: `Нове повідомлення від ${name}`,
                html: `
                    <p><strong>Ім'я:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Телефон:</strong> ${phone}</p>
                    <p><strong>Повідомлення:</strong> ${message}</p>
                `
                
            });
                return h.response({message: 'ok'}).code(200);
            }catch(error){
                return h.response({message: 'failed'}).code(500);
            }
        }

});
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public',
                listing: false
            }
        }
    });

    await server.start();
    console.log('Server running on:', server.info.uri);
};

init();