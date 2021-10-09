import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "./pipes/validation.pipe";


async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    let whitelist = ['http://localhost:3000'];
    app.enableCors({
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                console.log("allowed cors for:", origin)
                callback(null, true)
            } else {
                console.log("blocked cors for:", origin)
                // callback(new Error('Not allowed by CORS'))
                callback(null, true)

            }
        },
        allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
        methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('Backend on Nest.js')
        .setDescription('Docs api')
        .setVersion('1.0.0')
        .addTag('Renat')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    app.useGlobalPipes(new ValidationPipe())

    await app.listen(PORT, () => {
        console.log(`Server started on port = ${PORT}`);
    })
}

start();