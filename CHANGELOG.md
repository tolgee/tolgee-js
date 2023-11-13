# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.16.2](https://github.com/tolgee/tolgee-js/compare/v5.16.1...v5.16.2) (2023-11-13)


### Bug Fixes

* remove unused window check, as onMount only runs client side ([#3279](https://github.com/tolgee/tolgee-js/issues/3279)) ([568e5e4](https://github.com/tolgee/tolgee-js/commit/568e5e4b8d67ba680161ac2f930a6375c5186136))





## [5.16.1](https://github.com/tolgee/tolgee-js/compare/v5.16.0...v5.16.1) (2023-11-13)


### Bug Fixes

* return TextEncoder polyfill as it's not JS standard ([#3278](https://github.com/tolgee/tolgee-js/issues/3278)) ([d2423e1](https://github.com/tolgee/tolgee-js/commit/d2423e11694335c56d5bb30f409c2579731a5788))





# [5.16.0](https://github.com/tolgee/tolgee-js/compare/v5.15.0...v5.16.0) (2023-11-04)


### Features

* unify exports ([#3276](https://github.com/tolgee/tolgee-js/issues/3276)) ([c8d2563](https://github.com/tolgee/tolgee-js/commit/c8d25637375dfcf7ba3baa622f9dbbc50cc501ed))





# [5.15.0](https://github.com/tolgee/tolgee-js/compare/v5.14.0...v5.15.0) (2023-11-02)


### Features

* improve mouse handler ([#3274](https://github.com/tolgee/tolgee-js/issues/3274)) ([44cbf78](https://github.com/tolgee/tolgee-js/commit/44cbf78d6f848a1c50a429460b8e455f66332c8f))





# [5.14.0](https://github.com/tolgee/tolgee-js/compare/v5.13.3...v5.14.0) (2023-10-27)


### Features

* disabled translations ([#3272](https://github.com/tolgee/tolgee-js/issues/3272)) ([f063777](https://github.com/tolgee/tolgee-js/commit/f063777237b65c8205953bc44514577d3f6197cd))





## [5.13.3](https://github.com/tolgee/tolgee-js/compare/v5.13.2...v5.13.3) (2023-10-23)


### Bug Fixes

* chakra emotion cache conflict ([#3269](https://github.com/tolgee/tolgee-js/issues/3269)) ([e98eb16](https://github.com/tolgee/tolgee-js/commit/e98eb16d22744ca9e304c66b5484a997ef7f482d))





## [5.13.2](https://github.com/tolgee/tolgee-js/compare/v5.13.1...v5.13.2) (2023-10-20)


### Bug Fixes

* create dev-tools element lazily ([#3267](https://github.com/tolgee/tolgee-js/issues/3267)) ([e8794eb](https://github.com/tolgee/tolgee-js/commit/e8794eb7441e269953ec13e2b6f1ef1b27259424))





## [5.13.1](https://github.com/tolgee/tolgee-js/compare/v5.13.0...v5.13.1) (2023-10-16)


### Bug Fixes

* i18next processor properly parse namespace if in the key ([#3262](https://github.com/tolgee/tolgee-js/issues/3262)) ([6c4414e](https://github.com/tolgee/tolgee-js/commit/6c4414e29d86611bd374367f40fb05716f6372e5))





# [5.13.0](https://github.com/tolgee/tolgee-js/compare/v5.12.0...v5.13.0) (2023-10-13)


### Features

* onMissingTranslation callback ([#3255](https://github.com/tolgee/tolgee-js/issues/3255)) ([63b282c](https://github.com/tolgee/tolgee-js/commit/63b282c4793ef2f62408cc039e4493e558e728ca))





# [5.12.0](https://github.com/tolgee/tolgee-js/compare/v5.11.5...v5.12.0) (2023-09-11)


### Bug Fixes

* race condition error in react integration ([#3248](https://github.com/tolgee/tolgee-js/issues/3248)) ([0923175](https://github.com/tolgee/tolgee-js/commit/092317504656a972a0b7097341b4d4845cf1c6a0))
* sessionStorage security error ([#3246](https://github.com/tolgee/tolgee-js/issues/3246)) ([58479f8](https://github.com/tolgee/tolgee-js/commit/58479f8f105a14e3edad267e3f782d2b130e8cae))


### Features

* improve fallback and empty namespace treatment ([#3243](https://github.com/tolgee/tolgee-js/issues/3243)) ([c8f31cb](https://github.com/tolgee/tolgee-js/commit/c8f31cb79b76111ef4087168d80fd5f9cd1a7511))





## [5.11.5](https://github.com/tolgee/tolgee-js/compare/v5.11.4...v5.11.5) (2023-09-11)


### Bug Fixes

* mjs exports for vue and others ([#3245](https://github.com/tolgee/tolgee-js/issues/3245)) ([1c7f1e5](https://github.com/tolgee/tolgee-js/commit/1c7f1e5a189d0f8c36124e535dc5bbffc35ed88e))





## [5.11.4](https://github.com/tolgee/tolgee-js/compare/v5.11.3...v5.11.4) (2023-08-31)


### Bug Fixes

* dev tools height in firefox ([#3240](https://github.com/tolgee/tolgee-js/issues/3240)) ([93abe99](https://github.com/tolgee/tolgee-js/commit/93abe9992867870e8dc9c8dd19252aeedc05256a))





## [5.11.3](https://github.com/tolgee/tolgee-js/compare/v5.11.2...v5.11.3) (2023-08-31)


### Bug Fixes

* limit size of big-meta ([#3239](https://github.com/tolgee/tolgee-js/issues/3239)) ([39f7291](https://github.com/tolgee/tolgee-js/commit/39f7291457a6f836e47bd4e7f9e0e5730fffb124))





## [5.11.2](https://github.com/tolgee/tolgee-js/compare/v5.11.1...v5.11.2) (2023-08-31)


### Bug Fixes

* usage of pat token in-context ([#3236](https://github.com/tolgee/tolgee-js/issues/3236)) ([704fe4f](https://github.com/tolgee/tolgee-js/commit/704fe4f5739625ae528751dc0c1b876d82311bef))





## [5.11.1](https://github.com/tolgee/tolgee-js/compare/v5.11.0...v5.11.1) (2023-08-23)


### Bug Fixes

* improve packages compatibility + better testing ([#3233](https://github.com/tolgee/tolgee-js/issues/3233)) ([2de9bac](https://github.com/tolgee/tolgee-js/commit/2de9baceb4ede0f756a44ff726724622b234e499))





# [5.11.0](https://github.com/tolgee/tolgee-js/compare/v5.10.2...v5.11.0) (2023-08-11)


### Features

* prepare for server components (and server-only rendering) ([#3226](https://github.com/tolgee/tolgee-js/issues/3226)) ([358ed9c](https://github.com/tolgee/tolgee-js/commit/358ed9c44787c0faf150aef5ff1a79a86c0b4c25))





## [5.10.2](https://github.com/tolgee/tolgee-js/compare/v5.10.1...v5.10.2) (2023-07-27)


### Bug Fixes

* umd export name ([#3223](https://github.com/tolgee/tolgee-js/issues/3223)) ([2dad51e](https://github.com/tolgee/tolgee-js/commit/2dad51ec4476002ea804777fcd91a172e3cc816c))





## [5.10.1](https://github.com/tolgee/tolgee-js/compare/v5.10.0...v5.10.1) (2023-07-12)


### Bug Fixes

* tolgee fetching data multiple times in devmode ([#3221](https://github.com/tolgee/tolgee-js/issues/3221)) ([6cb113f](https://github.com/tolgee/tolgee-js/commit/6cb113f32f861f8cf3066c0003a2bb1e1ce35d7e))





# [5.10.0](https://github.com/tolgee/tolgee-js/compare/v5.9.12...v5.10.0) (2023-07-12)


### Features

* support Date as param ([#3220](https://github.com/tolgee/tolgee-js/issues/3220)) ([d9af2b2](https://github.com/tolgee/tolgee-js/commit/d9af2b27b58720eefef08f6fa9dba83a7ed93a0d))





## [5.9.12](https://github.com/tolgee/tolgee-js/compare/v5.9.11...v5.9.12) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.11](https://github.com/tolgee/tolgee-js/compare/v5.9.10...v5.9.11) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.10](https://github.com/tolgee/tolgee-js/compare/v5.9.9...v5.9.10) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.9](https://github.com/tolgee/tolgee-js/compare/v5.9.8...v5.9.9) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.8](https://github.com/tolgee/tolgee-js/compare/v5.9.7...v5.9.8) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.7](https://github.com/tolgee/tolgee-js/compare/v5.9.6...v5.9.7) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.6](https://github.com/tolgee/tolgee-js/compare/v5.9.5...v5.9.6) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.5](https://github.com/tolgee/tolgee-js/compare/v5.9.4...v5.9.5) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.4](https://github.com/tolgee/tolgee-js/compare/v5.9.3...v5.9.4) (2023-07-03)

**Note:** Version bump only for package root





## [5.9.3](https://github.com/tolgee/tolgee-js/compare/v5.9.2...v5.9.3) (2023-07-03)


### Bug Fixes

* lerna releases ([#3214](https://github.com/tolgee/tolgee-js/issues/3214)) ([8e9b5e2](https://github.com/tolgee/tolgee-js/commit/8e9b5e26b257f5600203e7b389aa912813cf22c0))





## [5.9.2](https://github.com/tolgee/tolgee-js/compare/v5.9.1...v5.9.2) (2023-07-03)


### Bug Fixes

* ngx package.json ([#3213](https://github.com/tolgee/tolgee-js/issues/3213)) ([25ca912](https://github.com/tolgee/tolgee-js/commit/25ca912a45e72008342102ba0106082386cae1ab))
* support for svelte 4 ([63f674f](https://github.com/tolgee/tolgee-js/commit/63f674f7b49eb1d25e67bd6636632b729c79b26b))





## [5.9.1](https://github.com/tolgee/tolgee-js/compare/v5.9.0...v5.9.1) (2023-06-28)


### Bug Fixes

* export props and return types for React ([#3210](https://github.com/tolgee/tolgee-js/issues/3210)) ([6f460e2](https://github.com/tolgee/tolgee-js/commit/6f460e2f2d3f1b6387814300dcd8518bfc6c0e86))





# [5.9.0](https://github.com/tolgee/tolgee-js/compare/v5.8.7...v5.9.0) (2023-06-20)


### Features

* sdk collecting page content data ([#3184](https://github.com/tolgee/tolgee-js/issues/3184)) ([90b34b6](https://github.com/tolgee/tolgee-js/commit/90b34b644ca318ff7d2a7dbc87d2d765f07d68a2))





## [5.8.7](https://github.com/tolgee/tolgee-js/compare/v5.8.6...v5.8.7) (2023-06-05)


### Bug Fixes

* support @vue/runtime-core in typescript ([#3205](https://github.com/tolgee/tolgee-js/issues/3205)) ([31e0d67](https://github.com/tolgee/tolgee-js/commit/31e0d675a7d541bc280ab8b892fcd9ec5bc140cb))





## [5.8.6](https://github.com/tolgee/tolgee-js/compare/v5.8.5...v5.8.6) (2023-05-24)


### Bug Fixes

* rem font size leaking into in-context dialog ([#3203](https://github.com/tolgee/tolgee-js/issues/3203)) ([6fe340e](https://github.com/tolgee/tolgee-js/commit/6fe340e9dd507b93efe5e9688eaf5f0c6223ec26))





## [5.8.5](https://github.com/tolgee/tolgee-js/compare/v5.8.4...v5.8.5) (2023-05-24)


### Bug Fixes

* improve tolgee missing language error ([#3204](https://github.com/tolgee/tolgee-js/issues/3204)) ([c72924f](https://github.com/tolgee/tolgee-js/commit/c72924f3f3ee05b1b2fd0467e1c9d1c93d5179e3))
* include type definitions in "exports" ([#3201](https://github.com/tolgee/tolgee-js/issues/3201)) ([3a76506](https://github.com/tolgee/tolgee-js/commit/3a765066be87d018cdc764f57b9207bc7fdbf433))





## [5.8.4](https://github.com/tolgee/tolgee-js/compare/v5.8.3...v5.8.4) (2023-05-16)


### Bug Fixes

* **ui:** case insensitive autocomplete ([#3200](https://github.com/tolgee/tolgee-js/issues/3200)) ([451601e](https://github.com/tolgee/tolgee-js/commit/451601eb8d229a8a6aa132b6bcdff81a9e258e4e))





## [5.8.3](https://github.com/tolgee/tolgee-js/compare/v5.8.2...v5.8.3) (2023-04-19)


### Bug Fixes

* move registry refresh out of the observer loop ([#3199](https://github.com/tolgee/tolgee-js/issues/3199)) ([243da10](https://github.com/tolgee/tolgee-js/commit/243da1060ab186b70cb5acd00ab05200c90ea51e))





## [5.8.2](https://github.com/tolgee/tolgee-js/compare/v5.8.1...v5.8.2) (2023-04-14)

**Note:** Version bump only for package root





## [5.8.1](https://github.com/tolgee/tolgee-js/compare/v5.8.0...v5.8.1) (2023-04-13)


### Bug Fixes

* compatibility with react-native ([#3197](https://github.com/tolgee/tolgee-js/issues/3197)) ([aa8228a](https://github.com/tolgee/tolgee-js/commit/aa8228ada40f4a676cd70c7bdeb883846216d20a))





# [5.8.0](https://github.com/tolgee/tolgee-js/compare/v5.7.3...v5.8.0) (2023-04-12)


### Features

* add language prop to t function ([#3196](https://github.com/tolgee/tolgee-js/issues/3196)) ([4a2490b](https://github.com/tolgee/tolgee-js/commit/4a2490b45049b04954e5aa02fe014f4ca5b88f41))





## [5.7.3](https://github.com/tolgee/tolgee-js/compare/v5.7.2...v5.7.3) (2023-04-11)


### Bug Fixes

* setEmitterActive name fix ([#3195](https://github.com/tolgee/tolgee-js/issues/3195)) ([f585241](https://github.com/tolgee/tolgee-js/commit/f58524165275ad0bcb266339a286b008d6b5972e))





## [5.7.2](https://github.com/tolgee/tolgee-js/compare/v5.7.1...v5.7.2) (2023-04-04)


### Bug Fixes

* allow manipulation of screenshots without other permissions ([#3190](https://github.com/tolgee/tolgee-js/issues/3190)) ([97815f6](https://github.com/tolgee/tolgee-js/commit/97815f68134f07d640bc5856eb0cd86427b13dbc))





## [5.7.1](https://github.com/tolgee/tolgee-js/compare/v5.7.0...v5.7.1) (2023-04-03)


### Bug Fixes

* ngx translate pipe not refreshed when lang changed ([#3189](https://github.com/tolgee/tolgee-js/issues/3189)) ([5381741](https://github.com/tolgee/tolgee-js/commit/538174106eabcc66e36c27bca9b9d47bdf1a4944))





# [5.7.0](https://github.com/tolgee/tolgee-js/compare/v5.6.1...v5.7.0) (2023-04-03)


### Features

* globally typeable key in tolgee core ([#3186](https://github.com/tolgee/tolgee-js/issues/3186)) ([8386b97](https://github.com/tolgee/tolgee-js/commit/8386b97acf4dd5b60b96f5797539130c06608bd1))





## [5.6.1](https://github.com/tolgee/tolgee-js/compare/v5.6.0...v5.6.1) (2023-03-29)


### Bug Fixes

* don't pass empty children to interpolated elements ([#3187](https://github.com/tolgee/tolgee-js/issues/3187)) ([acedc77](https://github.com/tolgee/tolgee-js/commit/acedc7760ac05bed20e55a0feadd0f9418db2187))





# [5.6.0](https://github.com/tolgee/tolgee-js/compare/v5.5.4...v5.6.0) (2023-03-22)


### Features

* screenshots with labeled positions of keys ([77c14c4](https://github.com/tolgee/tolgee-js/commit/77c14c4288ebb9c4f40a759d41c20045d6f6f328))





## [5.5.4](https://github.com/tolgee/tolgee-js/compare/v5.5.3...v5.5.4) (2023-03-20)


### Bug Fixes

* root styles leaking to shadow-dom ([#3182](https://github.com/tolgee/tolgee-js/issues/3182)) ([b215948](https://github.com/tolgee/tolgee-js/commit/b21594866977e6331ea80e4c099f9d724fb7360e))





## [5.5.3](https://github.com/tolgee/tolgee-js/compare/v5.5.2...v5.5.3) (2023-03-17)


### Bug Fixes

* i18next use default namespace if not specified ([#3178](https://github.com/tolgee/tolgee-js/issues/3178)) ([a5148a5](https://github.com/tolgee/tolgee-js/commit/a5148a5a33483fde3236c87624ecbfa5927db151))





## [5.5.2](https://github.com/tolgee/tolgee-js/compare/v5.5.1...v5.5.2) (2023-03-13)


### Bug Fixes

* don't show context menu when element contains same key twice & highliting with longer delay ([#3175](https://github.com/tolgee/tolgee-js/issues/3175)) ([6884bba](https://github.com/tolgee/tolgee-js/commit/6884bbaa44fcd78b39939256fb15052d771bd1b1))





## [5.5.1](https://github.com/tolgee/tolgee-js/compare/v5.5.0...v5.5.1) (2023-03-13)


### Bug Fixes

* vue - move t from onBeforeMount to setup function ([#3174](https://github.com/tolgee/tolgee-js/issues/3174)) ([29c137f](https://github.com/tolgee/tolgee-js/commit/29c137f9a3d5f00d9e8b6da7a4f5ee237106f590))





# [5.5.0](https://github.com/tolgee/tolgee-js/compare/v5.4.4...v5.5.0) (2023-03-10)


### Features

* add useTolgeeSSR for compatibility with react 18 and next.js 13 ([#3173](https://github.com/tolgee/tolgee-js/issues/3173)) ([6ee87db](https://github.com/tolgee/tolgee-js/commit/6ee87db17801f7788aafd441dd198e529bafb522))





## [5.4.4](https://github.com/tolgee/tolgee-js/compare/v5.4.3...v5.4.4) (2023-03-09)


### Bug Fixes

* revert type module ([#3172](https://github.com/tolgee/tolgee-js/issues/3172)) ([165dc98](https://github.com/tolgee/tolgee-js/commit/165dc98c7c0c52f1d38a86fe75754a57bc176fab))





## [5.4.3](https://github.com/tolgee/tolgee-js/compare/v5.4.2...v5.4.3) (2023-03-04)


### Bug Fixes

* tolgee loading forever if run fails ([#3170](https://github.com/tolgee/tolgee-js/issues/3170)) ([01ce148](https://github.com/tolgee/tolgee-js/commit/01ce1487d9fe9c6fafe06a8d4d87a867efdd47d3))





## [5.4.2](https://github.com/tolgee/tolgee-js/compare/v5.4.1...v5.4.2) (2023-02-27)


### Bug Fixes

* TolgeeTools ui version missing ([#3169](https://github.com/tolgee/tolgee-js/issues/3169)) ([5003cfe](https://github.com/tolgee/tolgee-js/commit/5003cfe8237350df0bd2d60bfa73d411348124af))





## [5.4.1](https://github.com/tolgee/tolgee-js/compare/v5.4.0...v5.4.1) (2023-02-24)


### Bug Fixes

* i18next peerDependencies and sourcemaps ([#3165](https://github.com/tolgee/tolgee-js/issues/3165)) ([e14199f](https://github.com/tolgee/tolgee-js/commit/e14199fa9a370806c3e73e82d7b120a302a23972))
* remove encoder and decoder polyfill ([#3167](https://github.com/tolgee/tolgee-js/issues/3167)) ([fe39cfb](https://github.com/tolgee/tolgee-js/commit/fe39cfb057b6cb38f286e7d370a1c3880c2a1084))





# [5.4.0](https://github.com/tolgee/tolgee-js/compare/v5.3.2...v5.4.0) (2023-02-22)


### Features

* observer works inside shadowDom ([#3163](https://github.com/tolgee/tolgee-js/issues/3163)) ([b9d61c4](https://github.com/tolgee/tolgee-js/commit/b9d61c469637b2564c3a23494bdae119f2e325c9))





## [5.3.2](https://github.com/tolgee/tolgee-js/compare/v5.3.1...v5.3.2) (2023-02-22)


### Bug Fixes

* Vue using Vite ([#3157](https://github.com/tolgee/tolgee-js/issues/3157)) ([b0ca4d2](https://github.com/tolgee/tolgee-js/commit/b0ca4d25b2e7f10a973ae19a2cff5ce990ac3e0a))





## [5.3.1](https://github.com/tolgee/tolgee-js/compare/v5.3.0...v5.3.1) (2023-02-20)


### Bug Fixes

* type module causing issues with require ([#3159](https://github.com/tolgee/tolgee-js/issues/3159)) ([63334ce](https://github.com/tolgee/tolgee-js/commit/63334ceaef54e45cdfd7b6dae5a0398e683ae726))





# [5.3.0](https://github.com/tolgee/tolgee-js/compare/v5.2.1...v5.3.0) (2023-02-10)


### Features

* use `type: module` everywhere ([05cf4b5](https://github.com/tolgee/tolgee-js/commit/05cf4b580d1489770d8a1adaea57b827fb13d14f))





## [5.2.1](https://github.com/tolgee/tolgee-js/compare/v5.2.0...v5.2.1) (2023-02-07)


### Bug Fixes

* add default apiUrl + allown null namespace ([#3151](https://github.com/tolgee/tolgee-js/issues/3151)) ([ce754a1](https://github.com/tolgee/tolgee-js/commit/ce754a1acb2302e69138535ba320c0e02812ff3f))
* highlighter not adjusting when target size changes ([#3150](https://github.com/tolgee/tolgee-js/issues/3150)) ([25d92ac](https://github.com/tolgee/tolgee-js/commit/25d92acddec2059f4e49771ef3d10a9840a3a507))





# [5.2.0](https://github.com/tolgee/tolgee-js/compare/v5.1.0...v5.2.0) (2023-01-31)


### Features

* DevTools correctly ommitted at production ([#3148](https://github.com/tolgee/tolgee-js/issues/3148)) ([5be6fd7](https://github.com/tolgee/tolgee-js/commit/5be6fd7a08d3f7d82edaed0e3ddcf4a858c6c3c5))





# [5.1.0](https://github.com/tolgee/tolgee-js/compare/v5.0.2...v5.1.0) (2023-01-27)


### Features

* improve i18next integration ([#3146](https://github.com/tolgee/tolgee-js/issues/3146)) ([d305426](https://github.com/tolgee/tolgee-js/commit/d3054268f981de8e014cf9193f94b8b4b0f61278))





## [5.0.2](https://github.com/tolgee/tolgee-js/compare/v5.0.1...v5.0.2) (2023-01-25)


### Bug Fixes

* make svelte work vite 4 ([#3145](https://github.com/tolgee/tolgee-js/issues/3145)) ([19df629](https://github.com/tolgee/tolgee-js/commit/19df629719b423ee87b873670627f3bf45bc9c23))





## [5.0.1](https://github.com/tolgee/tolgee-js/compare/v5.0.0...v5.0.1) (2023-01-17)

**Note:** Version bump only for package root





# [5.0.0](https://github.com/tolgee/tolgee-js/compare/v5.0.0-alpha.3...v5.0.0) (2023-01-11)

**Note:** Version bump only for package root





# [5.0.0-alpha.3](https://github.com/tolgee/tolgee-js/compare/v4.9.3...v5.0.0-alpha.3) (2023-01-11)


* feat!: Complete redesign, namespaces support, refactor (#3109) ([1978b91](https://github.com/tolgee/tolgee-js/commit/1978b917dfec2df89f59de4cd10b632920c47e57)), closes [#3109](https://github.com/tolgee/tolgee-js/issues/3109)


### BREAKING CHANGES

* Complete redesign, brand new API





# 5.0.0-alpha.2 (2023-01-09)

**Note:** Version bump only for package root





# 5.0.0-alpha.1 (2022-11-29)


### Bug Fixes

* xpath evaluate throws error when not executed on Element ([#3123](https://github.com/tolgee/tolgee-js/issues/3123)) ([aa5b7f9](https://github.com/tolgee/tolgee-js/commit/aa5b7f96729de99dfe4aee2a9bd57cd0d3a734f9))





## [4.9.3](https://github.com/tolgee/tolgee-js/compare/v4.9.2...v4.9.3) (2022-10-18)


### Bug Fixes

* tolgee i18next export also tolgeeProcessor ([a719911](https://github.com/tolgee/tolgee-js/commit/a71991189247c0798c4a8c82cf96e9da6411c46d))





## [4.9.2](https://github.com/tolgee/tolgee-js/compare/v4.9.1...v4.9.2) (2022-09-07)


### Bug Fixes

* don't fail on invalid locale code ([5434d32](https://github.com/tolgee/tolgee-js/commit/5434d328233e290f0d570c052f134b36def79f30))





## [4.9.1](https://github.com/tolgee/tolgee-js/compare/v4.9.0...v4.9.1) (2022-09-05)


### Bug Fixes

* fetch only selected languages with limit ([720bb85](https://github.com/tolgee/tolgee-js/commit/720bb85c61cd460bdf2047511c9f6a5981443508))





# [4.9.0](https://github.com/tolgee/tolgee-js/compare/v4.8.6...v4.9.0) (2022-09-03)


### Bug Fixes

* cypress tests ([db9aaf9](https://github.com/tolgee/tolgee-js/commit/db9aaf92fe2763eea80acbfd7cc94b8fd3ab6347))
* jest tests ([44eff5c](https://github.com/tolgee/tolgee-js/commit/44eff5c4720b9b003b3dee8e25f29056904c24c4))


### Features

* devtools to shadow dom to avoid css influence ([7097b4a](https://github.com/tolgee/tolgee-js/commit/7097b4a0166e8a8c6a300f2b605b112bb47da443))





## [4.8.6](https://github.com/tolgee/tolgee-js/compare/v4.8.5...v4.8.6) (2022-09-02)


### Bug Fixes

* improve UI dialog behavior when many languages ([8e5495b](https://github.com/tolgee/tolgee-js/commit/8e5495b2934e1a11b689c12f68d596c058ee5633))





## [4.8.5](https://github.com/tolgee/tolgee-js/compare/v4.8.4...v4.8.5) (2022-08-30)


### Bug Fixes

* Svelte with auto/node adapter (Rename UI esm build to .mjs) ([28329d3](https://github.com/tolgee/tolgee-js/commit/28329d316bff55c5daff520b0f90ece941ac57cd))





## [4.8.4](https://github.com/tolgee/tolgee-js/compare/v4.8.3...v4.8.4) (2022-08-29)


### Bug Fixes

* reduce ui bundle size ([58f2765](https://github.com/tolgee/tolgee-js/commit/58f2765920197516bb57e812d4e9174b079e6751))





## [4.8.3](https://github.com/tolgee/tolgee-js/compare/v4.8.2...v4.8.3) (2022-08-27)


### Bug Fixes

* Svelte with auto/node adapter (Import UI only in browser) ([8e1e6ef](https://github.com/tolgee/tolgee-js/commit/8e1e6ef5d164dd6f29120e2a5413c3a21d0fb049))





## [4.8.2](https://github.com/tolgee/tolgee-js/compare/v4.8.1...v4.8.2) (2022-08-23)


### Bug Fixes

* **sveltekit:** Update SvelteKit to lastest version. ([082a8e5](https://github.com/tolgee/tolgee-js/commit/082a8e57d1b633342ad6b19c6849c6d2df4c2e4c))





## [4.8.1](https://github.com/tolgee/tolgee-js/compare/v4.8.0...v4.8.1) (2022-08-23)

**Note:** Version bump only for package root





# [4.8.0](https://github.com/tolgee/tolgee-js/compare/v4.7.3...v4.8.0) (2022-08-01)


### Features

* update next.js ([331f80f](https://github.com/tolgee/tolgee-js/commit/331f80f9d16063775754948ce15c6ff21dfee0ba))





## [4.7.3](https://github.com/tolgee/tolgee-js/compare/v4.7.2...v4.7.3) (2022-08-01)

**Note:** Version bump only for package root





## [4.7.2](https://github.com/tolgee/tolgee-js/compare/v4.7.1...v4.7.2) (2022-07-04)


### Bug Fixes

* Core & UI > Add ./src to published package ([bb2ab52](https://github.com/tolgee/tolgee-js/commit/bb2ab52a5389fea9cb5ce7dd2b07e78162e1c652))
* Update svelte versions and fix named imports from @tolgee/core ([5c84e47](https://github.com/tolgee/tolgee-js/commit/5c84e478217f7dc9516e60b9a5d71ddf34ea3166))





## [4.7.1](https://github.com/tolgee/tolgee-js/compare/v4.7.0...v4.7.1) (2022-06-03)


### Bug Fixes

* loop of svelte getTranslate store ([e7d73af](https://github.com/tolgee/tolgee-js/commit/e7d73af97ce555f82f4a1abd00cc25491adb8043))


### Reverts

* Revert "fix loop of svelte getTranslate store" ([b591abe](https://github.com/tolgee/tolgee-js/commit/b591abec0e0772787668b5bac2452e3c711df359))





# [4.7.0](https://github.com/tolgee/tolgee-js/compare/v4.6.1...v4.7.0) (2022-05-30)


### Features

* add support for react 18 ([a5b60fb](https://github.com/tolgee/tolgee-js/commit/a5b60fbae0ac4c6fb28943547fafc95cfe139633))





## [4.6.1](https://github.com/tolgee/tolgee-js/compare/v4.6.0...v4.6.1) (2022-05-25)


### Bug Fixes

* Fix useTranslate types, react warnings, core observer edge case error ([1295d36](https://github.com/tolgee/tolgee-js/commit/1295d362c2099c69a13d2aab716049c1510e371b))





# [4.6.0](https://github.com/tolgee/tolgee-js/compare/v4.5.0...v4.6.0) (2022-05-23)


### Features

* Add and embrace Vue composition API ([acdd2a9](https://github.com/tolgee/tolgee-js/commit/acdd2a92df6552092f777e30f6ae5050b7571232))
* Improve highlighter ([334738a](https://github.com/tolgee/tolgee-js/commit/334738a06fd47cd6c7d12f309310fa15eeda5b59))
* Improve highlighter - add rounded corners ([2f27441](https://github.com/tolgee/tolgee-js/commit/2f274410764c208d6f6ecca9aebb72b417846ca2))
* Improve highlighter - fix tests and cleanup ([6ea5d34](https://github.com/tolgee/tolgee-js/commit/6ea5d34b8913170494b447c9c2d6c98813daf1a1))





# [4.5.0](https://github.com/tolgee/tolgee-js/compare/v4.4.0...v4.5.0) (2022-04-19)


### Features

* Make mode option deprecated ([7ecaf26](https://github.com/tolgee/tolgee-js/commit/7ecaf264c7884a76ca14338ca48b315e5b72ed1f))





# [4.4.0](https://github.com/tolgee/tolgee-js/compare/v4.3.0...v4.4.0) (2022-03-29)


### Features

* permitted languages support ([99c3b33](https://github.com/tolgee/tolgee-js/commit/99c3b33cd8c6543e403e1fdceb8cc50c0ffdbd2d))
* permitted languages support - adapt to API change ([f21550f](https://github.com/tolgee/tolgee-js/commit/f21550f72909e32e3259cef13b262b63686f1b59))





# [4.3.0](https://github.com/tolgee/tolgee-js/compare/v4.2.1...v4.3.0) (2022-03-29)


### Features

* ui is now included automatically ([3fd8146](https://github.com/tolgee/tolgee-js/commit/3fd814688b7553b8f872b62d870ec3d2092d17c6))





## [4.2.1](https://github.com/tolgee/tolgee-js/compare/v4.2.0...v4.2.1) (2022-03-14)


### Bug Fixes

* Make language stable ([cd96ee8](https://github.com/tolgee/tolgee-js/commit/cd96ee8456194e4a9557151c63a8bdbbe691c258))





# [4.2.0](https://github.com/tolgee/tolgee-js/compare/v4.1.1...v4.2.0) (2022-03-11)


### Features

* Quick parameters rename as naming is confusing ([df62d9a](https://github.com/tolgee/tolgee-js/commit/df62d9ac13e3d258c4b7ef24645298a61f887fe3))





## [4.1.1](https://github.com/tolgee/tolgee-js/compare/v4.1.0...v4.1.1) (2022-03-10)


### Bug Fixes

* t function returning array ([0136741](https://github.com/tolgee/tolgee-js/commit/01367411c0bf62bcbd11e5beaf405a0b3d9c811f))





# [4.1.0](https://github.com/tolgee/tolgee-js/compare/v4.0.0...v4.1.0) (2022-03-10)


### Features

* Allow language detection and localStorage disable ([b8e8f43](https://github.com/tolgee/tolgee-js/commit/b8e8f435bdc36eb1c029d5dbcc71bf09b7c77bb8))





# [4.0.0](https://github.com/tolgee/tolgee-js/compare/v3.6.0...v4.0.0) (2022-03-10)


### Features

* Use invisible wrapping instead of span component ([3848cda](https://github.com/tolgee/tolgee-js/commit/3848cdaf70fe9c76fd56c88d3c7399b87ff0f88b))


### BREAKING CHANGES

* default invisible mode, defaultValue





# [3.6.0](https://github.com/tolgee/tolgee-js/compare/v3.5.0...v3.6.0) (2022-02-28)


### Features

* Derrive availableLanguages from staticData ([009d615](https://github.com/tolgee/tolgee-js/commit/009d6150335c304841b6a638b70961a193b43070))





# [3.5.0](https://github.com/tolgee/tolgee-js/compare/v3.4.0...v3.5.0) (2022-02-24)


### Features

* Add tags interpolation for react ([10bf215](https://github.com/tolgee/tolgee-js/commit/10bf215f593fdcab3f635651f874a788e5b7bf38))





# [3.4.0](https://github.com/tolgee/tolgee-js/compare/v3.3.1...v3.4.0) (2022-02-21)


### Features

* UI popup stop closing on save ([2f08494](https://github.com/tolgee/tolgee-js/commit/2f084941947de8f34d573fe2078acb1d6c6a1ee9))





## [3.3.1](https://github.com/tolgee/tolgee-js/compare/v3.3.0...v3.3.1) (2022-02-15)


### Bug Fixes

* UI translation lang property ([bfc4f3a](https://github.com/tolgee/tolgee-js/commit/bfc4f3a91c15a422a08d3a2d2fedb52947d4771f))





# [3.3.0](https://github.com/tolgee/tolgee-js/compare/v3.2.0...v3.3.0) (2022-02-11)


### Features

* In-context translating on production TG-459 ([2ab5c20](https://github.com/tolgee/tolgee-js/commit/2ab5c2074c1bdf659dbc542e2254413aaba01184))





# [3.2.0](https://github.com/tolgee/tolgee-js/compare/v3.1.5...v3.2.0) (2022-02-04)


### Features

* Improve ssr (and next.js example) TG-497 ([2d8e6d5](https://github.com/tolgee/tolgee-js/commit/2d8e6d58b3373cf1552605220182076178f04927))





## [3.1.5](https://github.com/tolgee/tolgee-js/compare/v3.1.4...v3.1.5) (2022-02-02)


### Bug Fixes

* Readme typos ([b0ddfd4](https://github.com/tolgee/tolgee-js/commit/b0ddfd4e443dbdeb3fee7504aa56c92a1dfe891c))





## [3.1.4](https://github.com/tolgee/tolgee-js/compare/v3.1.3...v3.1.4) (2022-01-20)


### Bug Fixes

* React example app favicon TG-469 ([997e561](https://github.com/tolgee/tolgee-js/commit/997e561d826877be56ec8b63e7f9057b30163bbc))
* Use lerna in production pipelines TG-463 ([180dd59](https://github.com/tolgee/tolgee-js/commit/180dd59b8f6a5a95e3ea4aa2ab506fa23e391e5b))





## [3.1.3](https://github.com/tolgee/tolgee-js/compare/v3.1.2...v3.1.3) (2022-01-13)

**Note:** Version bump only for package root





## [3.1.2](https://github.com/tolgee/tolgee-js/compare/v3.1.1...v3.1.2) (2021-12-22)


### Bug Fixes

* Refactor tolgee-js API TG-455 ([e5518ff](https://github.com/tolgee/tolgee-js/commit/e5518ff7b242a9f80cd67ce0bbb2f42f4b560c11))





## [3.1.1](https://github.com/tolgee/tolgee-js/compare/v3.1.0...v3.1.1) (2021-12-22)


### Bug Fixes

* **js sdk:** Synchronous replacing TG-454 ([77fa921](https://github.com/tolgee/tolgee-js/commit/77fa9215fdc5d1470e4a24b9a9c1f2575985ed1b))





# [3.1.0](https://github.com/tolgee/tolgee-js/compare/v3.0.2...v3.1.0) (2021-12-22)


### Features

* Vue i18next example app TG-458 ([1ae7c74](https://github.com/tolgee/tolgee-js/commit/1ae7c749458c174e74045673c05357668aa1175b))





## [3.0.2](https://github.com/tolgee/tolgee-js/compare/v3.0.1...v3.0.2) (2021-12-20)


### Bug Fixes

* Refactor tolgee-ui context TG-422 ([73384be](https://github.com/tolgee/tolgee-js/commit/73384bee8e255fb7d5fb9ee57ccbcaabb238a1e0))





## [3.0.1](https://github.com/tolgee/tolgee-js/compare/v3.0.0...v3.0.1) (2021-12-18)


### Bug Fixes

* typo ([a985dbf](https://github.com/tolgee/tolgee-js/commit/a985dbfd5277bbf43f9279eefff138ef1ce653ae))





# [3.0.0](https://github.com/tolgee/tolgee-js/compare/v2.8.2...v3.0.0) (2021-12-17)


### Features

* Experiment with i18next integration TG-430 ([dc90766](https://github.com/tolgee/tolgee-js/commit/dc90766aea7aa1002c6ceed85cb6662dcca796cd))


### Performance Improvements

* modularize core ([fe5abca](https://github.com/tolgee/tolgee-js/commit/fe5abca13987c34d27c39fb6ca162336106d9efc))


### BREAKING CHANGES

* Tolgee constructor private





## [2.8.2](https://github.com/tolgee/tolgee-js/compare/v2.8.1...v2.8.2) (2021-12-15)


### Bug Fixes

* Tolgee ui - add link to tolgee app TG-377 ([e45efdf](https://github.com/tolgee/tolgee-js/commit/e45efdf94c786d25b842a50296b73d5253f62eda))





## [2.8.1](https://github.com/tolgee/tolgee-js/compare/v2.8.0...v2.8.1) (2021-12-07)


### Bug Fixes

* Removing attribute when mouseover node causes error TG-440 ([dde937f](https://github.com/tolgee/tolgee-js/commit/dde937f3b77893dd511c582814c0cc9aab170e5d))





# [2.8.0](https://github.com/tolgee/tolgee-js/compare/v2.7.0...v2.8.0) (2021-11-25)


### Bug Fixes

* Fix core event capturing TG-419 ([1b6efe8](https://github.com/tolgee/tolgee-js/commit/1b6efe8ee018358c93e4ac510d61be4f7dee6ef8))


### Features

* Angular improvements & testapp TG-418 ([02b8f49](https://github.com/tolgee/tolgee-js/commit/02b8f49eeaf1434e258e961c369d4293b0b20a6e))
* Angular improvements & testapp TG-418 ([56be3a9](https://github.com/tolgee/tolgee-js/commit/56be3a965c9491b06d697853970e2aca87ced566))
* Angular improvements & testapp TG-418 ([e5b58f2](https://github.com/tolgee/tolgee-js/commit/e5b58f2da08c2277c1e144464137a45743d1223c))
* Angular improvements & testapp TG-418 ([b1a8c3f](https://github.com/tolgee/tolgee-js/commit/b1a8c3fcd89633fe5a2c4daf4b844b3be75d7f66))





# [2.7.0](https://github.com/tolgee/tolgee-js/compare/v2.6.0...v2.7.0) (2021-11-23)


### Bug Fixes

* **js:** Dependabot automerge TG-416 ([7a05b3b](https://github.com/tolgee/tolgee-js/commit/7a05b3b581c8b916c4a007f885ba4751a1403b95))
* **js:** Fix readmes TG-415 ([856539f](https://github.com/tolgee/tolgee-js/commit/856539fe5d3de82a07317915d2b1222cd0785dcc))


### Features

* **js sdk:** Allow dynamic import of UI TG-378 ([69c7bf2](https://github.com/tolgee/tolgee-js/commit/69c7bf2489d2d2bb229a6c6a7534e45623c3d2aa))





# [2.6.0](https://github.com/tolgee/tolgee-js/compare/v2.5.3...v2.6.0) (2021-11-16)


### Bug Fixes

* Throw nicer error when using T outside provider ([8f5594b](https://github.com/tolgee/tolgee-js/commit/8f5594be08b6cdc071a2d439f2043b862e818a4a))


### Features

* vue app sync with documentation ([a9efcaa](https://github.com/tolgee/tolgee-js/commit/a9efcaa5b6598e6ba324edc563d250d23e9d619f))





## [2.5.3](https://github.com/tolgee/tolgee-js/compare/v2.5.2...v2.5.3) (2021-11-16)


### Bug Fixes

* Fix tolgee UI bug TG-401 ([0cef726](https://github.com/tolgee/tolgee-js/commit/0cef726999556b18b904ea046741db3067d62796))
* Packages publish fix ([4a21b52](https://github.com/tolgee/tolgee-js/commit/4a21b5250417e1f083503fc9cdc21f67633c9c71))





## [2.5.2](https://github.com/tolgee/tolgee-js/compare/v2.5.1...v2.5.2) (2021-11-16)


### Bug Fixes

* Fix core exported types (remove @types/react deps) TG-360 ([5847519](https://github.com/tolgee/tolgee-js/commit/58475192c1de5965177d06ef5b3f4dc2dbe469e0))





## [2.5.1](https://github.com/tolgee/tolgee-js/compare/v2.5.0...v2.5.1) (2021-11-11)


### Bug Fixes

* Svelte integration TG-380 - fix document not defined error ([ffabdf8](https://github.com/tolgee/tolgee-js/commit/ffabdf859d50439729e5ac770f836e224cdd9b99))





# [2.5.0](https://github.com/tolgee/tolgee-js/compare/v2.4.1...v2.5.0) (2021-11-11)


### Features

* **Vue:** add defaultValue prop ([b6bb5f6](https://github.com/tolgee/tolgee-js/commit/b6bb5f6cfab5f9190240f022f3fbf73ea658d750))





## [2.4.1](https://github.com/tolgee/tolgee-js/compare/v2.4.0...v2.4.1) (2021-11-10)


### Bug Fixes

* Svelte integration TG-380 - Fix missing document in svelteKit v192 ([218e3d0](https://github.com/tolgee/tolgee-js/commit/218e3d08b429b8a1c5e078c694a884945c3e2116))





# [2.4.0](https://github.com/tolgee/tolgee-js/compare/v2.3.2...v2.4.0) (2021-11-09)


### Features

* Svelte integration TG-380 ([9e56290](https://github.com/tolgee/tolgee-js/commit/9e562905a43dea557cf6d66ffb1109ef3897a3e6))





## [2.3.2](https://github.com/tolgee/tolgee-js/compare/v2.3.1...v2.3.2) (2021-11-08)

**Note:** Version bump only for package root





## [2.3.1](https://github.com/tolgee/tolgee-js/compare/v2.3.0...v2.3.1) (2021-11-08)


### Bug Fixes

* Remove unnecessary check ([8f8d4bf](https://github.com/tolgee/tolgee-js/commit/8f8d4bfbb3cf4d3a1a5ca60f554cc3670a776384))





# [2.3.0](https://github.com/tolgee/tolgee-js/compare/v2.2.0...v2.3.0) (2021-11-04)


### Features

* Vue.js Integration TG-371 ([3486110](https://github.com/tolgee/tolgee-js/commit/3486110b2445469c5d349b1603b5ea365fbd41e3))





# [2.2.0](https://github.com/tolgee/tolgee-js/compare/v2.1.2...v2.2.0) (2021-11-02)


### Features

* translate method support orEmpty option ([304687a](https://github.com/tolgee/tolgee-js/commit/304687a3872124c9c26b3c8f210de1b7d78e5c2b))





## [2.1.2](https://github.com/tolgee/tolgee-js/compare/v2.1.1...v2.1.2) (2021-10-27)


### Bug Fixes

* Fix cannot clear translations dialog TG-379 ([19a6a9c](https://github.com/tolgee/tolgee-js/commit/19a6a9c5e9055a9b792c582f12b412e232e3814e))





## [2.1.1](https://github.com/tolgee/tolgee-js/compare/v2.1.0...v2.1.1) (2021-10-26)


### Bug Fixes

* Tolgee translate fn params type is not optional ([2dbfde2](https://github.com/tolgee/tolgee-js/commit/2dbfde22925b30a6d1740e987db800f86faf0c46))





# [2.1.0](https://github.com/tolgee/tolgee-js/compare/v2.0.1...v2.1.0) (2021-10-26)


### Features

* Set base language input to default value TG-368 ([5f66114](https://github.com/tolgee/tolgee-js/commit/5f6611414395782facb76ec71f04a061cc9cdf17))





## [2.0.1](https://github.com/tolgee/tolgee-js/compare/v2.0.0...v2.0.1) (2021-10-21)


### Bug Fixes

* Chrome extension reload after install TG-370 ([ac977e6](https://github.com/tolgee/tolgee-js/commit/ac977e6ce8df690a19ec294045fa6a9f2b151d91))





# [2.0.0](https://github.com/tolgee/tolgee-js/compare/v1.9.0...v2.0.0) (2021-10-20)


### Bug Fixes

* Remove ignoreTag setting TG-369 ([1562403](https://github.com/tolgee/tolgee-js/commit/1562403d5f19f9d9624f3b28e2893d7d0b980f65))


### BREAKING CHANGES

* HTML is currently not ignored by Core Message Formatter and React T component and Angular t attribute will not render HTML to DOM.





# [1.9.0](https://github.com/tolgee/tolgee-js/compare/v1.8.4...v1.9.0) (2021-10-19)


### Features

* Add prompt to install chrome extension TG-366 ([3cc8482](https://github.com/tolgee/tolgee-js/commit/3cc84821ff17670f080e2e2bb928840dee455c36))





## [1.8.4](https://github.com/tolgee/tolgee-js/compare/v1.8.3...v1.8.4) (2021-10-19)


### Bug Fixes

* Error when translation is null from API TG-367 ([205983b](https://github.com/tolgee/tolgee-js/commit/205983bcc0a3c59201e650eb6b98ef32158a702f))





## [1.8.3](https://github.com/tolgee/tolgee-js/compare/v1.8.2...v1.8.3) (2021-10-15)

**Note:** Version bump only for package root





## [1.8.2](https://github.com/tolgee/tolgee-js/compare/v1.8.1...v1.8.2) (2021-10-15)

**Note:** Version bump only for package root





## [1.8.1](https://github.com/tolgee/tolgee-js/compare/v1.8.0...v1.8.1) (2021-10-14)


### Bug Fixes

* Dependencies add tests TG-324 ([5189e51](https://github.com/tolgee/tolgee-js/commit/5189e51f433904e606cb2374e43a85da3b3b69e9))





# [1.8.0](https://github.com/tolgee/tolgee-js/compare/v1.7.6...v1.8.0) (2021-10-13)


### Features

* Improve tolgee library UI TG-300 ([eee7a86](https://github.com/tolgee/tolgee-js/commit/eee7a86a3814eab61853b3aa118eb925e843c3f4))
* Improve tolgee library UI TG-300 ([7854930](https://github.com/tolgee/tolgee-js/commit/7854930b7f2e7f4ee8c78ede380b19aa4293d758))
* Try integrating jss into tolgee-js TG-300 ([813cd36](https://github.com/tolgee/tolgee-js/commit/813cd36f645a5be39818ba0c9d0f846361b35d2a))





## [1.7.6](https://github.com/tolgee/tolgee-js/compare/v1.7.5...v1.7.6) (2021-10-13)


### Bug Fixes

* **js sdk:** Fix package.json licences TG-355 ([008f2de](https://github.com/tolgee/tolgee-js/commit/008f2deb3edcc29054ecf69d9a32b03d7ef1a212))





## [1.7.5](https://github.com/tolgee/tolgee-js/compare/v1.7.4...v1.7.5) (2021-10-13)


### Bug Fixes

* **react sdk:** sets state while rendering TG-344 ([c06f606](https://github.com/tolgee/tolgee-js/commit/c06f606e4ac77b4d97f0ee6b1f14d459b51afb9b))





## 1.7.4 (2021-10-06)

**Note:** Version bump only for package root





## 1.7.3 (2021-10-06)

**Note:** Version bump only for package root





## 1.7.2 (2021-10-05)

**Note:** Version bump only for package root





## 1.7.1 (2021-10-05)

**Note:** Version bump only for package root





# 1.7.0 (2021-10-04)


### Features

* Add method to change translation for screenshot taking ([#496](https://github.com/tolgee/tolgee-js/issues/496)) ([40ddbe9](https://github.com/tolgee/tolgee-js/commit/40ddbe9d4afdd1b0ab2bfa09274d7d3787b86880))





## 1.6.1 (2021-09-30)


### Bug Fixes

* **js sdk:** Dialog position fixed TG-320 ([#452](https://github.com/tolgee/tolgee-js/issues/452)) ([c065951](https://github.com/tolgee/tolgee-js/commit/c065951740fdd2e01e7943256dc04c8eff12b263))





# 1.6.0 (2021-09-30)


### Features

* **js sdk:** Remove key structuring TG-333 ([#451](https://github.com/tolgee/tolgee-js/issues/451)) ([710b148](https://github.com/tolgee/tolgee-js/commit/710b148948913afbbab693b14a86a3995e5645b8))





## 1.5.1 (2021-09-30)


### Bug Fixes

* Fix umd packages TG-340 ([#450](https://github.com/tolgee/tolgee-js/issues/450)) ([dc5f59a](https://github.com/tolgee/tolgee-js/commit/dc5f59a2120a4c118b686330ddeb3107448b82da))





# 1.5.0 (2021-09-30)


### Features

* Enable default value providing TG-335 ([#445](https://github.com/tolgee/tolgee-js/issues/445)) ([cc0d838](https://github.com/tolgee/tolgee-js/commit/cc0d83842ca806775eceffd875514c5408f6ad46))





# 1.4.0 (2021-09-20)


### Features

* Chrome plugin for screenshot generation TG-281 ([70fb2ae](https://github.com/tolgee/tolgee-js/commit/70fb2aec66319fc42870ed216ce7a7b981465b4a))





# 1.3.0 (2021-09-15)


### Features

* **js sdk:** Allow element wrapping & test TG-280 ([#435](https://github.com/tolgee/tolgee-js/issues/435)) ([f47c3ed](https://github.com/tolgee/tolgee-js/commit/f47c3ed92ae2b55da8701d19d5e5d099ed2d3156))





## 1.2.4 (2021-09-15)


### Bug Fixes

* **sdk:** fix default tagAttributes property TG-288 ([#436](https://github.com/tolgee/tolgee-js/issues/436)) ([db19266](https://github.com/tolgee/tolgee-js/commit/db192665ed9409e39a2ff65cffd720e41265eefd))





## 1.2.3 (2021-09-15)


### Bug Fixes

* **js sdk:** Fix angular commonJs warnings TG-276 ([#437](https://github.com/tolgee/tolgee-js/issues/437)) ([84eadc0](https://github.com/tolgee/tolgee-js/commit/84eadc04f5040e2cd39dbb536fcb74c22b9236d4))





## 1.2.2 (2021-09-10)

**Note:** Version bump only for package root





## 1.2.1 (2021-09-10)


### Bug Fixes

* **js sdk:** Improve SSR stability TG-275 ([#429](https://github.com/tolgee/tolgee-js/issues/429)) ([220f6ed](https://github.com/tolgee/tolgee-js/commit/220f6edea5de9fd5395d903bc19ac4c1d099353d))





# 1.2.0 (2021-09-08)


### Features

* **js sdk:** Prepare for Next.js TG-272 ([#425](https://github.com/tolgee/tolgee-js/issues/425)) ([7c75a1b](https://github.com/tolgee/tolgee-js/commit/7c75a1b059610ef51889e03577be0095d8cace38))





## 1.1.1 (2021-09-07)


### Bug Fixes

* Fix socket.io bundle TG-271 ([#423](https://github.com/tolgee/tolgee-js/issues/423)) ([17e1cb4](https://github.com/tolgee/tolgee-js/commit/17e1cb42f66428ea2588330e19294357c1932d12))





# 1.1.0 (2021-09-07)


### Features

* SSR compatibility TG-10 ([#421](https://github.com/tolgee/tolgee-js/issues/421)) ([1cb878d](https://github.com/tolgee/tolgee-js/commit/1cb878d68bcbbfb0c44424e10ad3df4f852b5743))





# 1.0.0-alpha.60 (2021-09-03)


### Features

* Improve UI TG-257 ([#414](https://github.com/tolgee/tolgee-js/issues/414)) ([0f944d8](https://github.com/tolgee/tolgee-js/commit/0f944d8108c226db1893617d2bc55156c79b5399))





# 1.0.0-alpha.59 (2021-08-31)

**Note:** Version bump only for package root





# 1.0.0-alpha.58 (2021-08-31)

**Note:** Version bump only for package root





# 1.0.0-alpha.57 (2021-08-13)

**Note:** Version bump only for package root





# 1.0.0-alpha.56 (2021-08-05)

**Note:** Version bump only for package root





# 1.0.0-alpha.55 (2021-07-30)


### Bug Fixes

* Add node locking TG-215 ([ec1e344](https://github.com/tolgee/tolgee-js/commit/ec1e3446f9f477214269541c397eb5f39d3007c1))





# 1.0.0-alpha.54 (2021-07-29)


### Bug Fixes

* **deps:** AbstractHandler is handling single text node twice TG-206 ([66c32ba](https://github.com/tolgee/tolgee-js/commit/66c32bafcf776c41a535a36207d52ec83de18be4))





# 1.0.0-alpha.53 (2021-07-29)


### Bug Fixes

* **core:** AbstractHandler is handling single text node twice TG-206 ([9da2bbd](https://github.com/tolgee/tolgee-js/commit/9da2bbd80c74d3e5882ad27fcdd2f6cd2e77ac4b))





# 1.0.0-alpha.52 (2021-07-13)


### Bug Fixes

* **sockets:** Fix missing dist ([9d903c6](https://github.com/tolgee/tolgee-js/commit/9d903c697378ed96725fa3efdb6d39146c39aa85))





# 1.0.0-alpha.51 (2021-07-13)


### Bug Fixes

* **sockets:** Publish proper files, fix main ([c2c131c](https://github.com/tolgee/tolgee-js/commit/c2c131c2873ed704635d9c8f9cf0456690d56bbb))





# 1.0.0-alpha.50 (2021-07-13)


### Bug Fixes

* **sockets:** Publish proper files ([be8181b](https://github.com/tolgee/tolgee-js/commit/be8181b7ffffb829cf7b9d340002c2554850038c))





# 1.0.0-alpha.49 (2021-07-13)


### Bug Fixes

* **sockets:** Add transports configuration option ([2d77f8e](https://github.com/tolgee/tolgee-js/commit/2d77f8ea3369dbf1f3daa10664f1317111c9414a))





# 1.0.0-alpha.48 (2021-07-13)


### Bug Fixes

* **sockets:** Restrict transport to websockets, fix default url ([44b8e68](https://github.com/tolgee/tolgee-js/commit/44b8e68ba4abe9c400f1cf570316fd28a9db888a))





# 1.0.0-alpha.47 (2021-07-12)


### Features

* **sockets:** Socket.io preview ([64d61a5](https://github.com/tolgee/tolgee-js/commit/64d61a5d9a21f160f8bbee0101b409ea71835c53))





# 1.0.0-alpha.46 (2021-07-12)

**Note:** Version bump only for package root





# 1.0.0-alpha.45 (2021-04-28)

**Note:** Version bump only for package root





# 1.0.0-alpha.44 (2021-04-01)


### Bug Fixes

* lerna automatic answer "--yes" on "lerna version" ([52c3f66](https://github.com/tolgee/tolgee-js/commit/52c3f6610be78a966c10bc6b603feaa2346e6c09))





# 1.0.0-alpha.43 (2021-03-26)

**Note:** Version bump only for package root
