import Container from '@teqfw/di';
import path from 'node:path';
import Fl32_Web_Back_Server from '../../src/Back/Server.mjs';

const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);
const SRC = path.resolve(import.meta.dirname, '../../src');
const WEB_ROOT = path.resolve(import.meta.dirname, './web');

function waitForServerStart(instance) {
    return new Promise((resolve, reject) => {
        const onListening = () => {
            instance.off('error', onError);
            resolve();
        };
        const onError = (error) => {
            instance.off('listening', onListening);
            reject(error);
        };

        instance.once('listening', onListening);
        instance.once('error', onError);
    });
}

async function main() {
    const container = new Container();
    container.addNamespaceRoot('Fl32_Web_', SRC, '.mjs');

    /** @type {Fl32_Web_Back_PipelineEngine} */
    const pipelineEngine = await container.get('Fl32_Web_Back_PipelineEngine$');
    /** @type {Fl32_Web_Back_Dto_Source$Factory} */
    const sourceDtoFactory = await container.get('Fl32_Web_Back_Dto_Source__Factory$');
    /** @type {Fl32_Web_Back_Handler_Pre_Log} */
    const logHandler = await container.get('Fl32_Web_Back_Handler_Pre_Log$');
    /** @type {Fl32_Web_Back_Handler_Static} */
    const staticHandler = await container.get('Fl32_Web_Back_Handler_Static$');
    /** @type {Fl32_Web_Back_Config_Runtime$Factory} */
    const runtimeConfigFactory = await container.get('Fl32_Web_Back_Config_Runtime__Factory$');

    await staticHandler.init({
        sources: [
            sourceDtoFactory.create({
                root: WEB_ROOT,
                prefix: '/',
                allow: {
                    '.': ['.'],
                },
            }),
        ],
    });

    pipelineEngine.addHandler(logHandler);
    pipelineEngine.addHandler(staticHandler);

    /** @type {Fl32_Web_Back_Logger} */
    const logger = await container.get('Fl32_Web_Back_Logger$');
    /** @type {Fl32_Web_Back_Enum_Server_Type} */
    const SERVER_TYPE = await container.get('Fl32_Web_Back_Enum_Server_Type$');
    runtimeConfigFactory.configure({port: PORT});
    runtimeConfigFactory.freeze();
    /** @type {Fl32_Web_Back_Config_Runtime} */
    const config = await container.get('Fl32_Web_Back_Config_Runtime$');

    const server = new Fl32_Web_Back_Server({
        http: await import('node:http'),
        http2: await import('node:http2'),
        config,
        logger,
        pipelineEngine,
        SERVER_TYPE,
    });

    await server.start({port: PORT});
    await waitForServerStart(server.getInstance());

    const shutdown = async (signal) => {
        console.info(`[dev] Received ${signal}, stopping server...`);
        await server.stop();
        process.exit(0);
    };

    process.once('SIGINT', () => void shutdown('SIGINT'));
    process.once('SIGTERM', () => void shutdown('SIGTERM'));

    console.info(`[dev] Static smoke server is running on http://127.0.0.1:${PORT}/`);
    console.info(`[dev] Web root: ${WEB_ROOT}`);
    console.info('[dev] Open the URL in a browser and verify that static files are served.');
}

main().catch((error) => {
    console.error('[dev] Bootstrap failed');
    console.error(error);
    process.exit(1);
});
