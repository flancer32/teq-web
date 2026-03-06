/**
 * Provides a utility to create a configured TeqFW DI container for unit testing.
 */
import path from 'node:path';
import Container from '@teqfw/di';

// Resolve the plugin source path relative to this script
const SRC = path.resolve(import.meta.dirname, '../../src');

/**
 * Creates a clean DI container for unit tests.
 * New container instance is returned on each invocation.
 *
 * @returns {Promise<TeqFw_Di_Container>} Test container instance.
 */
export async function createTestContainer() {
    const container = new Container();
    container.addNamespaceRoot('Fl32_Web_', SRC, '.mjs');
    container.enableTestMode();
    return container;
}

/**
 * Backward-compatible alias for existing unit tests.
 *
 * @returns {TeqFw_Di_Container} Test container instance.
 */
export function buildTestContainer() {
    const container = new Container();
    container.addNamespaceRoot('Fl32_Web_', SRC, '.mjs');
    container.enableTestMode();
    return container;
}
