import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import obfuscator from 'rollup-plugin-obfuscator';

const obfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: false,
    stringArray: true,
    stringArrayThreshold: 0.75
};

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/domma.min.js',
            format: 'umd',
            name: 'Domma',
            sourcemap: false
        },
        {
            file: 'dist/domma.esm.js',
            format: 'es',
            sourcemap: false
        }
    ],
    plugins: [
        resolve(),
        terser(),
        obfuscator({ options: obfuscatorOptions })
    ]
};
