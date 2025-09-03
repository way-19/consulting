❯ npm run build:marketing


> consulting19-platform@1.0.0 build:marketing
> npm run --workspace @consulting19/marketing build


> @consulting19/marketing@1.0.0 build
> tsc && vite build

vite v5.4.19 building for production...
✓ 60 modules transformed.
x Build failed in 2.92s
error during build:
src/hooks/useOrderForm (4:7): Expected '{', got 'interface' (Note that you need plugins to import files that are not JavaScript)
file: /home/project/apps/marketing/src/hooks/useOrderForm:4:7

2: import { supabase } from '../lib/supabase';
3: 
4: export interface Country {
          ^
5:   id: string;
6:   name: string;

    at Module.getRollupError (file:///home/project/node_modules/rollup/dist/es/shared/parseAst.js:568:41)
    at ParseError.initialise (file:///home/project/node_modules/rollup/dist/es/shared/node-entry.js:14458:41)
    at convertNode (file:///home/project/node_modules/rollup/dist/es/shared/node-entry.js:16338:10)
    at convertProgram (file:///home/project/node_modules/rollup/dist/es/shared/node-entry.js:15578:12)
    at Module.setSource (file:///home/project/node_modules/rollup/dist/es/shared/node-entry.js:17333:24)
    at async ModuleLoader.addModuleSource (file:///home/project/node_modules/rollup/dist/es/shared/node-entry.js:21346:13)
npm error Lifecycle script `build` failed with error:
npm error code 1
npm error path /home/project/apps/marketing
npm error workspace @consulting19/marketing@1.0.0
npm error location /home/project/apps/marketing
npm error command failed
npm error command sh -c tsc && vite build