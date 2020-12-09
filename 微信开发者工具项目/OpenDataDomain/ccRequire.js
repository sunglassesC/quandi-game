let moduleMap = {
'assets/internal/index.js' () { return require('assets/internal/index.js') },
'assets/main/index.js' () { return require('assets/main/index.js') },
'assets/internal/config.js' () { return require('assets/internal/config.js'); },
'assets/internal/import/02/0275e94c-56a7-410f-bd1a-fc7483f7d14a.js' () { return require('assets/internal/import/02/0275e94c-56a7-410f-bd1a-fc7483f7d14a.js'); },
'assets/internal/import/14/144c3297-af63-49e8-b8ef-1cfa29b3be28.js' () { return require('assets/internal/import/14/144c3297-af63-49e8-b8ef-1cfa29b3be28.js'); },
'assets/internal/import/28/2874f8dd-416c-4440-81b7-555975426e93.js' () { return require('assets/internal/import/28/2874f8dd-416c-4440-81b7-555975426e93.js'); },
'assets/internal/import/2a/2a296057-247c-4a1c-bbeb-0548b6c98650.js' () { return require('assets/internal/import/2a/2a296057-247c-4a1c-bbeb-0548b6c98650.js'); },
'assets/internal/import/2a/2a7c0036-e0b3-4fe1-8998-89a54b8a2bec.js' () { return require('assets/internal/import/2a/2a7c0036-e0b3-4fe1-8998-89a54b8a2bec.js'); },
'assets/internal/import/30/30682f87-9f0d-4f17-8a44-72863791461b.js' () { return require('assets/internal/import/30/30682f87-9f0d-4f17-8a44-72863791461b.js'); },
'assets/internal/import/3a/3a7bb79f-32fd-422e-ada2-96f518fed422.js' () { return require('assets/internal/import/3a/3a7bb79f-32fd-422e-ada2-96f518fed422.js'); },
'assets/internal/import/46/466d4f9b-e5f4-4ea8-85d5-3c6e9a65658a.js' () { return require('assets/internal/import/46/466d4f9b-e5f4-4ea8-85d5-3c6e9a65658a.js'); },
'assets/internal/import/6d/6d91e591-4ce0-465c-809f-610ec95019c6.js' () { return require('assets/internal/import/6d/6d91e591-4ce0-465c-809f-610ec95019c6.js'); },
'assets/internal/import/6f/6f801092-0c37-4f30-89ef-c8d960825b36.js' () { return require('assets/internal/import/6f/6f801092-0c37-4f30-89ef-c8d960825b36.js'); },
'assets/internal/import/a1/a153945d-2511-4c14-be7b-05d242f47d57.js' () { return require('assets/internal/import/a1/a153945d-2511-4c14-be7b-05d242f47d57.js'); },
'assets/internal/import/c0/c0040c95-c57f-49cd-9cbc-12316b73d0d4.js' () { return require('assets/internal/import/c0/c0040c95-c57f-49cd-9cbc-12316b73d0d4.js'); },
'assets/internal/import/cf/cf7e0bb8-a81c-44a9-ad79-d28d43991032.js' () { return require('assets/internal/import/cf/cf7e0bb8-a81c-44a9-ad79-d28d43991032.js'); },
'assets/internal/import/e0/e02d87d4-e599-4d16-8001-e14891ac6506.js' () { return require('assets/internal/import/e0/e02d87d4-e599-4d16-8001-e14891ac6506.js'); },
'assets/internal/import/ec/eca5d2f2-8ef6-41c2-bbe6-f9c79d09c432.js' () { return require('assets/internal/import/ec/eca5d2f2-8ef6-41c2-bbe6-f9c79d09c432.js'); },
'assets/internal/import/f1/f18742d7-56d2-4eb5-ae49-2d9d710b37c8.js' () { return require('assets/internal/import/f1/f18742d7-56d2-4eb5-ae49-2d9d710b37c8.js'); },
'assets/main/config.js' () { return require('assets/main/config.js'); },
'assets/main/import/45/458ad6a7-a741-41ab-82ca-c76af710e214.js' () { return require('assets/main/import/45/458ad6a7-a741-41ab-82ca-c76af710e214.js'); },
'assets/main/import/4d/4d7f84ef-5ee2-429a-9818-110d1dd6e9e0.js' () { return require('assets/main/import/4d/4d7f84ef-5ee2-429a-9818-110d1dd6e9e0.js'); },
'assets/main/import/5d/5dab09ec-e715-4118-aa4c-1edcd503aacf.js' () { return require('assets/main/import/5d/5dab09ec-e715-4118-aa4c-1edcd503aacf.js'); },
'assets/main/import/6e/6e056173-d285-473c-b206-40a7fff5386e.js' () { return require('assets/main/import/6e/6e056173-d285-473c-b206-40a7fff5386e.js'); },
'assets/main/import/6f/6f2844a8-ec7b-4aa6-b6d7-12dac012af6f.js' () { return require('assets/main/import/6f/6f2844a8-ec7b-4aa6-b6d7-12dac012af6f.js'); },
'assets/main/import/70/70fcc870-f1f3-43ae-a91b-350261262e53.js' () { return require('assets/main/import/70/70fcc870-f1f3-43ae-a91b-350261262e53.js'); },
'assets/main/import/88/880f089c-d64f-4959-8927-4bb53a74ed80.js' () { return require('assets/main/import/88/880f089c-d64f-4959-8927-4bb53a74ed80.js'); },
'assets/main/import/8c/8cdb44ac-a3f6-449f-b354-7cd48cf84061.js' () { return require('assets/main/import/8c/8cdb44ac-a3f6-449f-b354-7cd48cf84061.js'); },
'assets/main/import/8e/8e429718-f9de-4a7f-8b9f-e479352a5e85.js' () { return require('assets/main/import/8e/8e429718-f9de-4a7f-8b9f-e479352a5e85.js'); },
'assets/main/import/9c/9c3c5366-2720-4c03-9f4e-86fdeebd3cb5.js' () { return require('assets/main/import/9c/9c3c5366-2720-4c03-9f4e-86fdeebd3cb5.js'); },
'assets/main/import/a2/a23235d1-15db-4b95-8439-a2e005bfff91.js' () { return require('assets/main/import/a2/a23235d1-15db-4b95-8439-a2e005bfff91.js'); },
'assets/main/import/ad/ad9dedfa-1c72-41cf-aee6-16e97ca39764.js' () { return require('assets/main/import/ad/ad9dedfa-1c72-41cf-aee6-16e97ca39764.js'); },
// tail

};

window.__cocos_require__ = function (moduleName) {
    let func = moduleMap[moduleName];
    if (!func) {
        throw new Error(`cannot find module ${moduleName}`);
    }
    return func();
};