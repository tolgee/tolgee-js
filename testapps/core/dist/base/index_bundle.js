/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../packages/core/dist/polygloat.commonjs.js":
/*!******************************************************!*\
  !*** ../../packages/core/dist/polygloat.commonjs.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

exports["@polygloat/core"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_199__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_199__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_199__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_199__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__nested_webpack_require_199__.d = function(exports, name, getter) {
/******/ 		if(!__nested_webpack_require_199__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__nested_webpack_require_199__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__nested_webpack_require_199__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __nested_webpack_require_199__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__nested_webpack_require_199__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __nested_webpack_require_199__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nested_webpack_require_199__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__nested_webpack_require_199__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__nested_webpack_require_199__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_199__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_199__(__nested_webpack_require_199__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/reflect-metadata/Reflect.js":
/*!**************************************************!*\
  !*** ./node_modules/reflect-metadata/Reflect.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_9602__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof global === "object" ? global :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect || (Reflect = {}));

/* WEBPACK VAR INJECTION */}.call(this, __nested_webpack_require_9602__(/*! ./../process/browser.js */ "./node_modules/process/browser.js"), __nested_webpack_require_9602__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
    true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_86566__) {

"use strict";
__nested_webpack_require_86566__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __nested_webpack_require_86566__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js":
/*!***********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_98852__) {

"use strict";
__nested_webpack_require_98852__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_98852__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_98852__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_98852__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");
/* harmony import */ var _providers_injection_token__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_98852__(/*! ../providers/injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony import */ var _error_helpers__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_98852__(/*! ../error-helpers */ "./node_modules/tsyringe/dist/esm5/error-helpers.js");





function autoInjectable() {
    return function (target) {
        var paramInfo = Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_1__["getParamInfo"])(target);
        return (function (_super) {
            Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _super.apply(this, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(args.concat(paramInfo.slice(args.length).map(function (type, index) {
                    var _a, _b, _c;
                    try {
                        if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTokenDescriptor"])(type)) {
                            if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(type)) {
                                return type.multiple
                                    ? (_a = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                        .resolve(type.transform)).transform.apply(_a, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolveAll(type.token)], type.transformArgs)) : (_b = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                    .resolve(type.transform)).transform.apply(_b, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token)], type.transformArgs));
                            }
                            else {
                                return type.multiple
                                    ? _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolveAll(type.token)
                                    : _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token);
                            }
                        }
                        else if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(type)) {
                            return (_c = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                .resolve(type.transform)).transform.apply(_c, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token)], type.transformArgs));
                        }
                        return _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type);
                    }
                    catch (e) {
                        var argIndex = index + args.length;
                        throw new Error(Object(_error_helpers__WEBPACK_IMPORTED_MODULE_4__["formatErrorCtor"])(target, argIndex, e));
                    }
                })))) || this;
            }
            return class_1;
        }(target));
    };
}
/* harmony default export */ __webpack_exports__["default"] = (autoInjectable);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/index.js ***!
  \*************************************************************/
/*! exports provided: autoInjectable, inject, injectable, registry, singleton, injectAll, injectAllWithTransform, injectWithTransform, scoped */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_103460__) {

"use strict";
__nested_webpack_require_103460__.r(__webpack_exports__);
/* harmony import */ var _auto_injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_103460__(/*! ./auto-injectable */ "./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "autoInjectable", function() { return _auto_injectable__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_103460__(/*! ./inject */ "./node_modules/tsyringe/dist/esm5/decorators/inject.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "inject", function() { return _inject__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_103460__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "injectable", function() { return _injectable__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_103460__(/*! ./registry */ "./node_modules/tsyringe/dist/esm5/decorators/registry.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "registry", function() { return _registry__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _singleton__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_103460__(/*! ./singleton */ "./node_modules/tsyringe/dist/esm5/decorators/singleton.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "singleton", function() { return _singleton__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _inject_all__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_103460__(/*! ./inject-all */ "./node_modules/tsyringe/dist/esm5/decorators/inject-all.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "injectAll", function() { return _inject_all__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _inject_all_with_transform__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_103460__(/*! ./inject-all-with-transform */ "./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "injectAllWithTransform", function() { return _inject_all_with_transform__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _inject_with_transform__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_103460__(/*! ./inject-with-transform */ "./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "injectWithTransform", function() { return _inject_with_transform__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _scoped__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_103460__(/*! ./scoped */ "./node_modules/tsyringe/dist/esm5/decorators/scoped.js");
/* harmony reexport (safe) */ __nested_webpack_require_103460__.d(__webpack_exports__, "scoped", function() { return _scoped__WEBPACK_IMPORTED_MODULE_8__["default"]; });












/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_107102__) {

"use strict";
__nested_webpack_require_107102__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_107102__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectAllWithTransform(token, transformer) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var data = {
        token: token,
        multiple: true,
        transform: transformer,
        transformArgs: args
    };
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(data);
}
/* harmony default export */ __webpack_exports__["default"] = (injectAllWithTransform);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-all.js":
/*!******************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-all.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_108240__) {

"use strict";
__nested_webpack_require_108240__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_108240__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectAll(token) {
    var data = { token: token, multiple: true };
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(data);
}
/* harmony default export */ __webpack_exports__["default"] = (injectAll);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_109187__) {

"use strict";
__nested_webpack_require_109187__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_109187__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectWithTransform(token, transformer) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(token, {
        transformToken: transformer,
        args: args
    });
}
/* harmony default export */ __webpack_exports__["default"] = (injectWithTransform);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject.js":
/*!**************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_110239__) {

"use strict";
__nested_webpack_require_110239__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_110239__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function inject(token) {
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(token);
}
/* harmony default export */ __webpack_exports__["default"] = (inject);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js":
/*!******************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/injectable.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_111088__) {

"use strict";
__nested_webpack_require_111088__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_111088__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_111088__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function injectable() {
    return function (target) {
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["typeInfo"].set(target, Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["getParamInfo"])(target));
    };
}
/* harmony default export */ __webpack_exports__["default"] = (injectable);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/registry.js":
/*!****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/registry.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_112220__) {

"use strict";
__nested_webpack_require_112220__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_112220__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_112220__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function registry(registrations) {
    if (registrations === void 0) { registrations = []; }
    return function (target) {
        registrations.forEach(function (_a) {
            var token = _a.token, options = _a.options, provider = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__rest"])(_a, ["token", "options"]);
            return _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].register(token, provider, options);
        });
        return target;
    };
}
/* harmony default export */ __webpack_exports__["default"] = (registry);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/scoped.js":
/*!**************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/scoped.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_113539__) {

"use strict";
__nested_webpack_require_113539__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_113539__.d(__webpack_exports__, "default", function() { return scoped; });
/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_113539__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_113539__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function scoped(lifecycle, token) {
    return function (target) {
        Object(_injectable__WEBPACK_IMPORTED_MODULE_0__["default"])()(target);
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].register(token || target, target, {
            lifecycle: lifecycle
        });
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/singleton.js":
/*!*****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/singleton.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_114779__) {

"use strict";
__nested_webpack_require_114779__.r(__webpack_exports__);
/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_114779__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_114779__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function singleton() {
    return function (target) {
        Object(_injectable__WEBPACK_IMPORTED_MODULE_0__["default"])()(target);
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].registerSingleton(target);
    };
}
/* harmony default export */ __webpack_exports__["default"] = (singleton);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/dependency-container.js":
/*!*****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/dependency-container.js ***!
  \*****************************************************************/
/*! exports provided: typeInfo, instance, default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_115930__) {

"use strict";
__nested_webpack_require_115930__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_115930__.d(__webpack_exports__, "typeInfo", function() { return typeInfo; });
/* harmony export (binding) */ __nested_webpack_require_115930__.d(__webpack_exports__, "instance", function() { return instance; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_115930__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_115930__(/*! ./providers */ "./node_modules/tsyringe/dist/esm5/providers/index.js");
/* harmony import */ var _providers_provider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_115930__(/*! ./providers/provider */ "./node_modules/tsyringe/dist/esm5/providers/provider.js");
/* harmony import */ var _providers_injection_token__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_115930__(/*! ./providers/injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_115930__(/*! ./registry */ "./node_modules/tsyringe/dist/esm5/registry.js");
/* harmony import */ var _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_115930__(/*! ./types/lifecycle */ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js");
/* harmony import */ var _resolution_context__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_115930__(/*! ./resolution-context */ "./node_modules/tsyringe/dist/esm5/resolution-context.js");
/* harmony import */ var _error_helpers__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_115930__(/*! ./error-helpers */ "./node_modules/tsyringe/dist/esm5/error-helpers.js");
/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_115930__(/*! ./lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");
/* harmony import */ var _interceptors__WEBPACK_IMPORTED_MODULE_9__ = __nested_webpack_require_115930__(/*! ./interceptors */ "./node_modules/tsyringe/dist/esm5/interceptors.js");










var typeInfo = new Map();
var InternalDependencyContainer = (function () {
    function InternalDependencyContainer(parent) {
        this.parent = parent;
        this._registry = new _registry__WEBPACK_IMPORTED_MODULE_4__["default"]();
        this.interceptors = new _interceptors__WEBPACK_IMPORTED_MODULE_9__["default"]();
    }
    InternalDependencyContainer.prototype.register = function (token, providerOrConstructor, options) {
        if (options === void 0) { options = { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Transient }; }
        var provider;
        if (!Object(_providers_provider__WEBPACK_IMPORTED_MODULE_2__["isProvider"])(providerOrConstructor)) {
            provider = { useClass: providerOrConstructor };
        }
        else {
            provider = providerOrConstructor;
        }
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(provider)) {
            var path = [token];
            var tokenProvider = provider;
            while (tokenProvider != null) {
                var currentToken = tokenProvider.useToken;
                if (path.includes(currentToken)) {
                    throw new Error("Token registration cycle detected! " + Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(path, [currentToken]).join(" -> "));
                }
                path.push(currentToken);
                var registration = this._registry.get(currentToken);
                if (registration && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(registration.provider)) {
                    tokenProvider = registration.provider;
                }
                else {
                    tokenProvider = null;
                }
            }
        }
        if (options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton ||
            options.lifecycle == _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped ||
            options.lifecycle == _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped) {
            if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(provider) || Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"])(provider)) {
                throw new Error("Cannot use lifecycle \"" + _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"][options.lifecycle] + "\" with ValueProviders or FactoryProviders");
            }
        }
        this._registry.set(token, { provider: provider, options: options });
        return this;
    };
    InternalDependencyContainer.prototype.registerType = function (from, to) {
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
            return this.register(from, {
                useToken: to
            });
        }
        return this.register(from, {
            useClass: to
        });
    };
    InternalDependencyContainer.prototype.registerInstance = function (token, instance) {
        return this.register(token, {
            useValue: instance
        });
    };
    InternalDependencyContainer.prototype.registerSingleton = function (from, to) {
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(from)) {
            if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
                return this.register(from, {
                    useToken: to
                }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
            }
            else if (to) {
                return this.register(from, {
                    useClass: to
                }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
            }
            throw new Error('Cannot register a type name as a singleton without a "to" token');
        }
        var useClass = from;
        if (to && !Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
            useClass = to;
        }
        return this.register(from, {
            useClass: useClass
        }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
    };
    InternalDependencyContainer.prototype.resolve = function (token, context) {
        if (context === void 0) { context = new _resolution_context__WEBPACK_IMPORTED_MODULE_6__["default"](); }
        var registration = this.getRegistration(token);
        if (!registration && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "Single");
        if (registration) {
            var result = this.resolveRegistration(registration, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isConstructorToken"])(token)) {
            var result = this.construct(token, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
    };
    InternalDependencyContainer.prototype.executePreResolutionInterceptor = function (token, resolutionType) {
        var e_1, _a;
        if (this.interceptors.preResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.interceptors.preResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, resolutionType);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.interceptors.preResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.executePostResolutionInterceptor = function (token, result, resolutionType) {
        var e_2, _a;
        if (this.interceptors.postResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.interceptors.postResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, result, resolutionType);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.interceptors.postResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.resolveRegistration = function (registration, context) {
        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped &&
            context.scopedResolutions.has(registration)) {
            return context.scopedResolutions.get(registration);
        }
        var isSingleton = registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton;
        var isContainerScoped = registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped;
        var returnInstance = isSingleton || isContainerScoped;
        var resolved;
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(registration.provider)) {
            resolved = registration.provider.useValue;
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.resolve(registration.provider.useToken, context))
                : this.resolve(registration.provider.useToken, context);
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isClassProvider"])(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.construct(registration.provider.useClass, context))
                : this.construct(registration.provider.useClass, context);
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"])(registration.provider)) {
            resolved = registration.provider.useFactory(this);
        }
        else {
            resolved = this.construct(registration.provider, context);
        }
        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped) {
            context.scopedResolutions.set(registration, resolved);
        }
        return resolved;
    };
    InternalDependencyContainer.prototype.resolveAll = function (token, context) {
        var _this = this;
        if (context === void 0) { context = new _resolution_context__WEBPACK_IMPORTED_MODULE_6__["default"](); }
        var registrations = this.getAllRegistrations(token);
        if (!registrations && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "All");
        if (registrations) {
            var result_1 = registrations.map(function (item) {
                return _this.resolveRegistration(item, context);
            });
            this.executePostResolutionInterceptor(token, result_1, "All");
            return result_1;
        }
        var result = [this.construct(token, context)];
        this.executePostResolutionInterceptor(token, result, "All");
        return result;
    };
    InternalDependencyContainer.prototype.isRegistered = function (token, recursive) {
        if (recursive === void 0) { recursive = false; }
        return (this._registry.has(token) ||
            (recursive &&
                (this.parent || false) &&
                this.parent.isRegistered(token, true)));
    };
    InternalDependencyContainer.prototype.reset = function () {
        this._registry.clear();
        this.interceptors.preResolution.clear();
        this.interceptors.postResolution.clear();
    };
    InternalDependencyContainer.prototype.clearInstances = function () {
        var e_3, _a;
        try {
            for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_c.value, 2), token = _d[0], registrations = _d[1];
                this._registry.setAll(token, registrations
                    .filter(function (registration) { return !Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(registration.provider); })
                    .map(function (registration) {
                    registration.instance = undefined;
                    return registration;
                }));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    InternalDependencyContainer.prototype.createChildContainer = function () {
        var e_4, _a;
        var childContainer = new InternalDependencyContainer(this);
        try {
            for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_c.value, 2), token = _d[0], registrations = _d[1];
                if (registrations.some(function (_a) {
                    var options = _a.options;
                    return options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped;
                })) {
                    childContainer._registry.setAll(token, registrations.map(function (registration) {
                        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped) {
                            return {
                                provider: registration.provider,
                                options: registration.options
                            };
                        }
                        return registration;
                    }));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return childContainer;
    };
    InternalDependencyContainer.prototype.beforeResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.preResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.afterResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.postResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.getRegistration = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.get(token);
        }
        if (this.parent) {
            return this.parent.getRegistration(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.getAllRegistrations = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.getAll(token);
        }
        if (this.parent) {
            return this.parent.getAllRegistrations(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.construct = function (ctor, context) {
        var _this = this;
        if (ctor instanceof _lazy_helpers__WEBPACK_IMPORTED_MODULE_8__["DelayedConstructor"]) {
            return ctor.createProxy(function (target) {
                return _this.resolve(target, context);
            });
        }
        var paramInfo = typeInfo.get(ctor);
        if (!paramInfo || paramInfo.length === 0) {
            if (ctor.length === 0) {
                return new ctor();
            }
            else {
                throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
            }
        }
        var params = paramInfo.map(this.resolveParams(context, ctor));
        return new (ctor.bind.apply(ctor, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([void 0], params)))();
    };
    InternalDependencyContainer.prototype.resolveParams = function (context, ctor) {
        var _this = this;
        return function (param, idx) {
            var _a, _b, _c;
            try {
                if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTokenDescriptor"])(param)) {
                    if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(param)) {
                        return param.multiple
                            ? (_a = _this.resolve(param.transform)).transform.apply(_a, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolveAll(param.token)], param.transformArgs)) : (_b = _this.resolve(param.transform)).transform.apply(_b, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolve(param.token, context)], param.transformArgs));
                    }
                    else {
                        return param.multiple
                            ? _this.resolveAll(param.token)
                            : _this.resolve(param.token, context);
                    }
                }
                else if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(param)) {
                    return (_c = _this.resolve(param.transform, context)).transform.apply(_c, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolve(param.token, context)], param.transformArgs));
                }
                return _this.resolve(param, context);
            }
            catch (e) {
                throw new Error(Object(_error_helpers__WEBPACK_IMPORTED_MODULE_7__["formatErrorCtor"])(ctor, idx, e));
            }
        };
    };
    return InternalDependencyContainer;
}());
var instance = new InternalDependencyContainer();
/* harmony default export */ __webpack_exports__["default"] = (instance);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/error-helpers.js":
/*!**********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/error-helpers.js ***!
  \**********************************************************/
/*! exports provided: formatErrorCtor */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_136095__) {

"use strict";
__nested_webpack_require_136095__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_136095__.d(__webpack_exports__, "formatErrorCtor", function() { return formatErrorCtor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_136095__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

function formatDependency(params, idx) {
    if (params === null) {
        return "at position #" + idx;
    }
    var argName = params.split(",")[idx].trim();
    return "\"" + argName + "\" at position #" + idx;
}
function composeErrorMessage(msg, e, indent) {
    if (indent === void 0) { indent = "    "; }
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([msg], e.message.split("\n").map(function (l) { return indent + l; })).join("\n");
}
function formatErrorCtor(ctor, paramIdx, error) {
    var _a = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), _b = _a[1], params = _b === void 0 ? null : _b;
    var dep = formatDependency(params, paramIdx);
    return composeErrorMessage("Cannot inject the dependency " + dep + " of \"" + ctor.name + "\" constructor. Reason:", error);
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/index.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/index.js ***!
  \************************************************************/
/*! exports provided: instanceCachingFactory, predicateAwareClassFactory */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_137707__) {

"use strict";
__nested_webpack_require_137707__.r(__webpack_exports__);
/* harmony import */ var _instance_caching_factory__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_137707__(/*! ./instance-caching-factory */ "./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js");
/* harmony reexport (safe) */ __nested_webpack_require_137707__.d(__webpack_exports__, "instanceCachingFactory", function() { return _instance_caching_factory__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _predicate_aware_class_factory__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_137707__(/*! ./predicate-aware-class-factory */ "./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js");
/* harmony reexport (safe) */ __nested_webpack_require_137707__.d(__webpack_exports__, "predicateAwareClassFactory", function() { return _predicate_aware_class_factory__WEBPACK_IMPORTED_MODULE_1__["default"]; });





/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_139047__) {

"use strict";
__nested_webpack_require_139047__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_139047__.d(__webpack_exports__, "default", function() { return instanceCachingFactory; });
function instanceCachingFactory(factoryFunc) {
    var instance;
    return function (dependencyContainer) {
        if (instance == undefined) {
            instance = factoryFunc(dependencyContainer);
        }
        return instance;
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js":
/*!************************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_139955__) {

"use strict";
__nested_webpack_require_139955__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_139955__.d(__webpack_exports__, "default", function() { return predicateAwareClassFactory; });
function predicateAwareClassFactory(predicate, trueConstructor, falseConstructor, useCaching) {
    if (useCaching === void 0) { useCaching = true; }
    var instance;
    var previousPredicate;
    return function (dependencyContainer) {
        var currentPredicate = predicate(dependencyContainer);
        if (!useCaching || previousPredicate !== currentPredicate) {
            if ((previousPredicate = currentPredicate)) {
                instance = dependencyContainer.resolve(trueConstructor);
            }
            else {
                instance = dependencyContainer.resolve(falseConstructor);
            }
        }
        return instance;
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/index.js":
/*!**************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/index.js ***!
  \**************************************************/
/*! exports provided: Lifecycle, autoInjectable, inject, injectable, registry, singleton, injectAll, injectAllWithTransform, injectWithTransform, scoped, instanceCachingFactory, predicateAwareClassFactory, isClassProvider, isFactoryProvider, isNormalToken, isTokenProvider, isValueProvider, delay, container */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_141429__) {

"use strict";
__nested_webpack_require_141429__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_141429__(/*! ./types */ "./node_modules/tsyringe/dist/esm5/types/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "Lifecycle", function() { return _types__WEBPACK_IMPORTED_MODULE_0__["Lifecycle"]; });

/* harmony import */ var _decorators__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_141429__(/*! ./decorators */ "./node_modules/tsyringe/dist/esm5/decorators/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "autoInjectable", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["autoInjectable"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "inject", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["inject"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "injectable", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectable"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "registry", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["registry"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "singleton", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["singleton"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "injectAll", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectAll"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "injectAllWithTransform", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectAllWithTransform"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "injectWithTransform", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectWithTransform"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "scoped", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["scoped"]; });

/* harmony import */ var _factories__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_141429__(/*! ./factories */ "./node_modules/tsyringe/dist/esm5/factories/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "instanceCachingFactory", function() { return _factories__WEBPACK_IMPORTED_MODULE_2__["instanceCachingFactory"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "predicateAwareClassFactory", function() { return _factories__WEBPACK_IMPORTED_MODULE_2__["predicateAwareClassFactory"]; });

/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_141429__(/*! ./providers */ "./node_modules/tsyringe/dist/esm5/providers/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "isClassProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isClassProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "isFactoryProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isFactoryProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "isNormalToken", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isNormalToken"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "isTokenProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isTokenProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "isValueProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isValueProvider"]; });

/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_141429__(/*! ./lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");
/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "delay", function() { return _lazy_helpers__WEBPACK_IMPORTED_MODULE_4__["delay"]; });

/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_141429__(/*! ./dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");
/* harmony reexport (safe) */ __nested_webpack_require_141429__.d(__webpack_exports__, "container", function() { return _dependency_container__WEBPACK_IMPORTED_MODULE_5__["instance"]; });

if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
    throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
}








/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/interceptors.js":
/*!*********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/interceptors.js ***!
  \*********************************************************/
/*! exports provided: PreResolutionInterceptors, PostResolutionInterceptors, default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_146417__) {

"use strict";
__nested_webpack_require_146417__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_146417__.d(__webpack_exports__, "PreResolutionInterceptors", function() { return PreResolutionInterceptors; });
/* harmony export (binding) */ __nested_webpack_require_146417__.d(__webpack_exports__, "PostResolutionInterceptors", function() { return PostResolutionInterceptors; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_146417__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _registry_base__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_146417__(/*! ./registry-base */ "./node_modules/tsyringe/dist/esm5/registry-base.js");


var PreResolutionInterceptors = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PreResolutionInterceptors, _super);
    function PreResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreResolutionInterceptors;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));

var PostResolutionInterceptors = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PostResolutionInterceptors, _super);
    function PostResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PostResolutionInterceptors;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));

var Interceptors = (function () {
    function Interceptors() {
        this.preResolution = new PreResolutionInterceptors();
        this.postResolution = new PostResolutionInterceptors();
    }
    return Interceptors;
}());
/* harmony default export */ __webpack_exports__["default"] = (Interceptors);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js":
/*!*********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/lazy-helpers.js ***!
  \*********************************************************/
/*! exports provided: DelayedConstructor, delay */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_148518__) {

"use strict";
__nested_webpack_require_148518__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_148518__.d(__webpack_exports__, "DelayedConstructor", function() { return DelayedConstructor; });
/* harmony export (binding) */ __nested_webpack_require_148518__.d(__webpack_exports__, "delay", function() { return delay; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_148518__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var DelayedConstructor = (function () {
    function DelayedConstructor(wrap) {
        this.wrap = wrap;
        this.reflectMethods = [
            "get",
            "getPrototypeOf",
            "setPrototypeOf",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "set",
            "deleteProperty",
            "apply",
            "construct"
        ];
    }
    DelayedConstructor.prototype.createProxy = function (createObject) {
        var _this = this;
        var target = {};
        var init = false;
        var value;
        var delayedObject = function () {
            if (!init) {
                value = createObject(_this.wrap());
                init = true;
            }
            return value;
        };
        return new Proxy(target, this.createHandler(delayedObject));
    };
    DelayedConstructor.prototype.createHandler = function (delayedObject) {
        var handler = {};
        var install = function (name) {
            handler[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args[0] = delayedObject();
                var method = Reflect[name];
                return method.apply(void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(args));
            };
        };
        this.reflectMethods.forEach(install);
        return handler;
    };
    return DelayedConstructor;
}());

function delay(wrappedConstructor) {
    if (typeof wrappedConstructor === "undefined") {
        throw new Error("Attempt to `delay` undefined. Constructor must be wrapped in a callback");
    }
    return new DelayedConstructor(wrappedConstructor);
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/class-provider.js ***!
  \*********************************************************************/
/*! exports provided: isClassProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_151174__) {

"use strict";
__nested_webpack_require_151174__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_151174__.d(__webpack_exports__, "isClassProvider", function() { return isClassProvider; });
function isClassProvider(provider) {
    return !!provider.useClass;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js":
/*!***********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/factory-provider.js ***!
  \***********************************************************************/
/*! exports provided: isFactoryProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_151865__) {

"use strict";
__nested_webpack_require_151865__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_151865__.d(__webpack_exports__, "isFactoryProvider", function() { return isFactoryProvider; });
function isFactoryProvider(provider) {
    return !!provider.useFactory;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/index.js ***!
  \************************************************************/
/*! exports provided: isClassProvider, isFactoryProvider, isNormalToken, isTokenProvider, isValueProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_152586__) {

"use strict";
__nested_webpack_require_152586__.r(__webpack_exports__);
/* harmony import */ var _class_provider__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_152586__(/*! ./class-provider */ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152586__.d(__webpack_exports__, "isClassProvider", function() { return _class_provider__WEBPACK_IMPORTED_MODULE_0__["isClassProvider"]; });

/* harmony import */ var _factory_provider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_152586__(/*! ./factory-provider */ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152586__.d(__webpack_exports__, "isFactoryProvider", function() { return _factory_provider__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"]; });

/* harmony import */ var _injection_token__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_152586__(/*! ./injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony reexport (safe) */ __nested_webpack_require_152586__.d(__webpack_exports__, "isNormalToken", function() { return _injection_token__WEBPACK_IMPORTED_MODULE_2__["isNormalToken"]; });

/* harmony import */ var _token_provider__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_152586__(/*! ./token-provider */ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152586__.d(__webpack_exports__, "isTokenProvider", function() { return _token_provider__WEBPACK_IMPORTED_MODULE_3__["isTokenProvider"]; });

/* harmony import */ var _value_provider__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_152586__(/*! ./value-provider */ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152586__.d(__webpack_exports__, "isValueProvider", function() { return _value_provider__WEBPACK_IMPORTED_MODULE_4__["isValueProvider"]; });








/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js":
/*!**********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/injection-token.js ***!
  \**********************************************************************/
/*! exports provided: isNormalToken, isTokenDescriptor, isTransformDescriptor, isConstructorToken */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_154963__) {

"use strict";
__nested_webpack_require_154963__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_154963__.d(__webpack_exports__, "isNormalToken", function() { return isNormalToken; });
/* harmony export (binding) */ __nested_webpack_require_154963__.d(__webpack_exports__, "isTokenDescriptor", function() { return isTokenDescriptor; });
/* harmony export (binding) */ __nested_webpack_require_154963__.d(__webpack_exports__, "isTransformDescriptor", function() { return isTransformDescriptor; });
/* harmony export (binding) */ __nested_webpack_require_154963__.d(__webpack_exports__, "isConstructorToken", function() { return isConstructorToken; });
/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_154963__(/*! ../lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");

function isNormalToken(token) {
    return typeof token === "string" || typeof token === "symbol";
}
function isTokenDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "multiple" in descriptor);
}
function isTransformDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "transform" in descriptor);
}
function isConstructorToken(token) {
    return typeof token === "function" || token instanceof _lazy_helpers__WEBPACK_IMPORTED_MODULE_0__["DelayedConstructor"];
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/provider.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/provider.js ***!
  \***************************************************************/
/*! exports provided: isProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_156716__) {

"use strict";
__nested_webpack_require_156716__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_156716__.d(__webpack_exports__, "isProvider", function() { return isProvider; });
/* harmony import */ var _class_provider__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_156716__(/*! ./class-provider */ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js");
/* harmony import */ var _value_provider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_156716__(/*! ./value-provider */ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js");
/* harmony import */ var _token_provider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_156716__(/*! ./token-provider */ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js");
/* harmony import */ var _factory_provider__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_156716__(/*! ./factory-provider */ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js");




function isProvider(provider) {
    return (Object(_class_provider__WEBPACK_IMPORTED_MODULE_0__["isClassProvider"])(provider) ||
        Object(_value_provider__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(provider) ||
        Object(_token_provider__WEBPACK_IMPORTED_MODULE_2__["isTokenProvider"])(provider) ||
        Object(_factory_provider__WEBPACK_IMPORTED_MODULE_3__["isFactoryProvider"])(provider));
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/token-provider.js ***!
  \*********************************************************************/
/*! exports provided: isTokenProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_158467__) {

"use strict";
__nested_webpack_require_158467__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_158467__.d(__webpack_exports__, "isTokenProvider", function() { return isTokenProvider; });
function isTokenProvider(provider) {
    return !!provider.useToken;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/value-provider.js ***!
  \*********************************************************************/
/*! exports provided: isValueProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_159148__) {

"use strict";
__nested_webpack_require_159148__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_159148__.d(__webpack_exports__, "isValueProvider", function() { return isValueProvider; });
function isValueProvider(provider) {
    return provider.useValue != undefined;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/reflection-helpers.js ***!
  \***************************************************************/
/*! exports provided: INJECTION_TOKEN_METADATA_KEY, getParamInfo, defineInjectionTokenMetadata */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_159873__) {

"use strict";
__nested_webpack_require_159873__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_159873__.d(__webpack_exports__, "INJECTION_TOKEN_METADATA_KEY", function() { return INJECTION_TOKEN_METADATA_KEY; });
/* harmony export (binding) */ __nested_webpack_require_159873__.d(__webpack_exports__, "getParamInfo", function() { return getParamInfo; });
/* harmony export (binding) */ __nested_webpack_require_159873__.d(__webpack_exports__, "defineInjectionTokenMetadata", function() { return defineInjectionTokenMetadata; });
var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
function getParamInfo(target) {
    var params = Reflect.getMetadata("design:paramtypes", target) || [];
    var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    Object.keys(injectionTokens).forEach(function (key) {
        params[+key] = injectionTokens[key];
    });
    return params;
}
function defineInjectionTokenMetadata(data, transform) {
    return function (target, _propertyKey, parameterIndex) {
        var descriptors = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
        descriptors[parameterIndex] = transform
            ? {
                token: data,
                transform: transform.transformToken,
                transformArgs: transform.args || []
            }
            : data;
        Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, descriptors, target);
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/registry-base.js":
/*!**********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/registry-base.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_161666__) {

"use strict";
__nested_webpack_require_161666__.r(__webpack_exports__);
var RegistryBase = (function () {
    function RegistryBase() {
        this._registryMap = new Map();
    }
    RegistryBase.prototype.entries = function () {
        return this._registryMap.entries();
    };
    RegistryBase.prototype.getAll = function (key) {
        this.ensure(key);
        return this._registryMap.get(key);
    };
    RegistryBase.prototype.get = function (key) {
        this.ensure(key);
        var value = this._registryMap.get(key);
        return value[value.length - 1] || null;
    };
    RegistryBase.prototype.set = function (key, value) {
        this.ensure(key);
        this._registryMap.get(key).push(value);
    };
    RegistryBase.prototype.setAll = function (key, value) {
        this._registryMap.set(key, value);
    };
    RegistryBase.prototype.has = function (key) {
        this.ensure(key);
        return this._registryMap.get(key).length > 0;
    };
    RegistryBase.prototype.clear = function () {
        this._registryMap.clear();
    };
    RegistryBase.prototype.ensure = function (key) {
        if (!this._registryMap.has(key)) {
            this._registryMap.set(key, []);
        }
    };
    return RegistryBase;
}());
/* harmony default export */ __webpack_exports__["default"] = (RegistryBase);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/registry.js":
/*!*****************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/registry.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_163331__) {

"use strict";
__nested_webpack_require_163331__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_163331__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _registry_base__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_163331__(/*! ./registry-base */ "./node_modules/tsyringe/dist/esm5/registry-base.js");


var Registry = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Registry;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Registry);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/resolution-context.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/resolution-context.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_164454__) {

"use strict";
__nested_webpack_require_164454__.r(__webpack_exports__);
var ResolutionContext = (function () {
    function ResolutionContext() {
        this.scopedResolutions = new Map();
    }
    return ResolutionContext;
}());
/* harmony default export */ __webpack_exports__["default"] = (ResolutionContext);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/types/index.js":
/*!********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/types/index.js ***!
  \********************************************************/
/*! exports provided: Lifecycle */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_165115__) {

"use strict";
__nested_webpack_require_165115__.r(__webpack_exports__);
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_165115__(/*! ./lifecycle */ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js");
/* harmony reexport (safe) */ __nested_webpack_require_165115__.d(__webpack_exports__, "Lifecycle", function() { return _lifecycle__WEBPACK_IMPORTED_MODULE_0__["default"]; });




/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/types/lifecycle.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_165874__) {

"use strict";
__nested_webpack_require_165874__.r(__webpack_exports__);
var Lifecycle;
(function (Lifecycle) {
    Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
    Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
    Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
    Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));
/* harmony default export */ __webpack_exports__["default"] = (Lifecycle);


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/Constants/Global.ts":
/*!*********************************!*\
  !*** ./src/Constants/Global.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.POLYGLOAT_TARGET_ATTRIBUTE = exports.POLYGLOAT_ATTRIBUTE_NAME = exports.RESTRICTED_ASCENDANT_ATTRIBUTE = void 0;
exports.RESTRICTED_ASCENDANT_ATTRIBUTE = "data-polygloat-restricted";
exports.POLYGLOAT_ATTRIBUTE_NAME = "_polygloat";
exports.POLYGLOAT_TARGET_ATTRIBUTE = "_polygloat-target";


/***/ }),

/***/ "./src/Constants/ModifierKey.ts":
/*!**************************************!*\
  !*** ./src/Constants/ModifierKey.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierKey = void 0;
var ModifierKey;
(function (ModifierKey) {
    ModifierKey[ModifierKey["Alt"] = 0] = "Alt";
    ModifierKey[ModifierKey["Control"] = 1] = "Control";
    ModifierKey[ModifierKey["Shift"] = 2] = "Shift";
    ModifierKey[ModifierKey["Meta"] = 3] = "Meta";
})(ModifierKey = exports.ModifierKey || (exports.ModifierKey = {}));


/***/ }),

/***/ "./src/DTOs/TranslationData.ts":
/*!*************************************!*\
  !*** ./src/DTOs/TranslationData.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationData = void 0;
var TranslationData = /** @class */ (function () {
    function TranslationData(key, translations) {
        this.key = key;
        this.translations = translations;
    }
    return TranslationData;
}());
exports.TranslationData = TranslationData;


/***/ }),

/***/ "./src/Errors/ApiHttpError.ts":
/*!************************************!*\
  !*** ./src/Errors/ApiHttpError.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHttpError = void 0;
var ApiHttpError = /** @class */ (function (_super) {
    __extends(ApiHttpError, _super);
    function ApiHttpError(response, code) {
        var _this = _super.call(this, "Api http error") || this;
        _this.response = response;
        _this.code = code;
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, ApiHttpError.prototype);
        return _this;
    }
    return ApiHttpError;
}(Error));
exports.ApiHttpError = ApiHttpError;


/***/ }),

/***/ "./src/Observer.ts":
/*!*************************!*\
  !*** ./src/Observer.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_170687__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
var tsyringe_1 = __nested_webpack_require_170687__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var CoreHandler_1 = __nested_webpack_require_170687__(/*! ./handlers/CoreHandler */ "./src/handlers/CoreHandler.ts");
var Properties_1 = __nested_webpack_require_170687__(/*! ./Properties */ "./src/Properties.ts");
var TextHandler_1 = __nested_webpack_require_170687__(/*! ./handlers/TextHandler */ "./src/handlers/TextHandler.ts");
var AttributeHandler_1 = __nested_webpack_require_170687__(/*! ./handlers/AttributeHandler */ "./src/handlers/AttributeHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_170687__(/*! ./services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var Observer = /** @class */ (function () {
    function Observer(properties, coreHandler, basicTextHandler, attributeHandler, nodeRegistrar) {
        var _this = this;
        this.properties = properties;
        this.coreHandler = coreHandler;
        this.basicTextHandler = basicTextHandler;
        this.attributeHandler = attributeHandler;
        this.nodeRegistrar = nodeRegistrar;
        this.observer = new MutationObserver(function (mutationsList) { return __awaiter(_this, void 0, void 0, function () {
            var mutationsList_1, mutationsList_1_1, mutation, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, 10, 11]);
                        mutationsList_1 = __values(mutationsList), mutationsList_1_1 = mutationsList_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!mutationsList_1_1.done) return [3 /*break*/, 8];
                        mutation = mutationsList_1_1.value;
                        if (!(mutation.type === 'characterData')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.basicTextHandler.handle(mutation.target)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(mutation.type === 'childList')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.coreHandler.handleSubtree(mutation.target)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(mutation.type === 'attributes')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.attributeHandler.handle(mutation.target)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        mutationsList_1_1 = mutationsList_1.next();
                        return [3 /*break*/, 1];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (mutationsList_1_1 && !mutationsList_1_1.done && (_a = mutationsList_1.return)) _a.call(mutationsList_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        this.nodeRegistrar.refreshAll();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    Observer.prototype.observe = function () {
        this.observer.observe(this.properties.config.targetElement, { attributes: true, childList: true, subtree: true, characterData: true });
    };
    Observer.prototype.stopObserving = function () {
        this.observer.disconnect();
    };
    Observer = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            CoreHandler_1.CoreHandler,
            TextHandler_1.TextHandler,
            AttributeHandler_1.AttributeHandler,
            ElementRegistrar_1.ElementRegistrar])
    ], Observer);
    return Observer;
}());
exports.Observer = Observer;


/***/ }),

/***/ "./src/Polygloat.ts":
/*!**************************!*\
  !*** ./src/Polygloat.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_178950__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygloat = void 0;
var CoreService_1 = __nested_webpack_require_178950__(/*! ./services/CoreService */ "./src/services/CoreService.ts");
var PolygloatConfig_1 = __nested_webpack_require_178950__(/*! ./PolygloatConfig */ "./src/PolygloatConfig.ts");
var Properties_1 = __nested_webpack_require_178950__(/*! ./Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_178950__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventService_1 = __nested_webpack_require_178950__(/*! ./services/EventService */ "./src/services/EventService.ts");
var Observer_1 = __nested_webpack_require_178950__(/*! ./Observer */ "./src/Observer.ts");
var TranslationService_1 = __nested_webpack_require_178950__(/*! ./services/TranslationService */ "./src/services/TranslationService.ts");
var TextService_1 = __nested_webpack_require_178950__(/*! ./services/TextService */ "./src/services/TextService.ts");
var CoreHandler_1 = __nested_webpack_require_178950__(/*! ./handlers/CoreHandler */ "./src/handlers/CoreHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_178950__(/*! ./services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var NodeHelper_1 = __nested_webpack_require_178950__(/*! ./helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Polygloat = /** @class */ (function () {
    function Polygloat(config) {
        var _this = this;
        this.container = tsyringe_1.container.createChildContainer();
        this.properties = this.container.resolve(Properties_1.Properties);
        this._coreService = this.container.resolve(CoreService_1.CoreService);
        this.eventService = this.container.resolve(EventService_1.EventService);
        this.observer = this.container.resolve(Observer_1.Observer);
        this.translationService = this.container.resolve(TranslationService_1.TranslationService);
        this.textService = this.container.resolve(TextService_1.TextService);
        this.coreHandler = this.container.resolve(CoreHandler_1.CoreHandler);
        this.elementRegistrar = this.container.resolve(ElementRegistrar_1.ElementRegistrar);
        this.translate = function (key, params, noWrap) {
            if (params === void 0) { params = {}; }
            if (noWrap === void 0) { noWrap = false; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.properties.config.mode === 'development' && !noWrap) {
                        return [2 /*return*/, this.textService.wrap(key, params)];
                    }
                    return [2 /*return*/, this.textService.translate(key, params)];
                });
            });
        };
        this.instant = function (key, params, noWrap, orEmpty) {
            if (params === void 0) { params = {}; }
            if (noWrap === void 0) { noWrap = false; }
            if (_this.properties.config.mode === 'development' && !noWrap) {
                return _this.textService.wrap(key, params);
            }
            return _this.textService.instant(key, params, undefined, orEmpty);
        };
        this.stop = function () {
            _this.observer.stopObserving();
            _this.elementRegistrar.cleanAll();
            NodeHelper_1.NodeHelper.unmarkElementAsTargetElement(_this.properties.config.targetElement);
        };
        this.container = tsyringe_1.container.createChildContainer();
        this.properties.config = new PolygloatConfig_1.PolygloatConfig(config);
    }
    Object.defineProperty(Polygloat.prototype, "lang", {
        get: function () {
            return this.properties.currentLanguage;
        },
        set: function (value) {
            this.properties.currentLanguage = value;
            this.eventService.LANGUAGE_CHANGED.emit(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "coreService", {
        get: function () {
            return this._coreService;
        },
        enumerable: false,
        configurable: true
    });
    Polygloat.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.properties.config.mode === "development")) return [3 /*break*/, 2];
                        _a = this.properties;
                        return [4 /*yield*/, this.coreService.getScopes()];
                    case 1:
                        _a.scopes = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (this.properties.config.watch) {
                            this.observer.observe();
                        }
                        return [4 /*yield*/, this.translationService.loadTranslations()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.refresh()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Polygloat.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.coreHandler.handleSubtree(this.properties.config.targetElement)];
            });
        });
    };
    Object.defineProperty(Polygloat.prototype, "defaultLanguage", {
        get: function () {
            return this.properties.config.defaultLanguage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "onLangChange", {
        get: function () {
            return this.eventService.LANGUAGE_CHANGED;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "onLangLoaded", {
        get: function () {
            return this.eventService.LANGUAGE_LOADED;
        },
        enumerable: false,
        configurable: true
    });
    return Polygloat;
}());
exports.Polygloat = Polygloat;
exports.default = Polygloat;


/***/ }),

/***/ "./src/PolygloatConfig.ts":
/*!********************************!*\
  !*** ./src/PolygloatConfig.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_187892__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygloatConfig = void 0;
var ModifierKey_1 = __nested_webpack_require_187892__(/*! ./Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
var NodeHelper_1 = __nested_webpack_require_187892__(/*! ./helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var DEFAULT_TARGET_ELEMENT = document.body;
var PolygloatConfig = /** @class */ (function () {
    function PolygloatConfig(config) {
        this.tagAttributes = {
            'textarea': ['placeholder'],
            'input': ['value', 'placeholder']
        };
        this.passToParent = ["option", "optgroup"];
        this.restrictedElements = ['script', 'style'];
        this.defaultLanguage = 'en';
        this.availableLanguages = ['en'];
        this.inputPrefix = '%-%polygloat:';
        this.inputSuffix = '%-%';
        this.filesUrlPrefix = "i18n/";
        this.highlightKeys = [ModifierKey_1.ModifierKey.Alt];
        this.highlightColor = "rgb(224 240 255)";
        //workaround for: https://stackoverflow.com/questions/48725916/typescript-optional-property-with-a-getter
        Object.defineProperty(this, 'targetElement', {
            set: function (targetElement) {
                if (this.targetElement !== undefined) {
                    throw new Error("Target element is already defined!");
                }
                if (targetElement === undefined) {
                    this._targetElement = DEFAULT_TARGET_ELEMENT;
                }
                if (NodeHelper_1.NodeHelper.isElementTargetElement(targetElement)) {
                    console.error("Target element: ", this._targetElement);
                    throw new Error("An polygloat instance is inited with provided target element");
                }
                this._targetElement = targetElement;
                NodeHelper_1.NodeHelper.markElementAsTargetElement(this._targetElement);
            },
            get: function () {
                return this._targetElement;
            }
        });
        Object.assign(this, config || {});
        if (this._targetElement === undefined) {
            this._targetElement = DEFAULT_TARGET_ELEMENT;
        }
        this.mode = this.mode || (this.apiKey ? "development" : "production");
        this.fallbackLanguage = this.fallbackLanguage || this.defaultLanguage;
        if (this.watch === undefined) {
            this.watch = this.mode === "development";
        }
    }
    return PolygloatConfig;
}());
exports.PolygloatConfig = PolygloatConfig;


/***/ }),

/***/ "./src/Properties.ts":
/*!***************************!*\
  !*** ./src/Properties.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_190655__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Properties = void 0;
var tsyringe_1 = __nested_webpack_require_190655__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY = "__polygloat_preferredLanguages";
var CURRENT_LANGUAGE_LOCAL_STORAGE_KEY = "__polygloat_currentLanguage";
var Properties = /** @class */ (function () {
    function Properties() {
        this.scopes = [];
    }
    Object.defineProperty(Properties.prototype, "preferredLanguages", {
        get: function () {
            return new Set(JSON.parse(localStorage.getItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY)));
        },
        set: function (languages) {
            localStorage.setItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY, JSON.stringify(Array.from(languages)));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Properties.prototype, "currentLanguage", {
        get: function () {
            var result = localStorage.getItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY);
            if (!result) {
                result = this.getLanguageByNavigator();
                this.currentLanguage = result;
            }
            return result;
        },
        set: function (language) {
            localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY, language);
        },
        enumerable: false,
        configurable: true
    });
    Properties.prototype.getLanguageByNavigator = function () {
        if (window) {
            var preferred_1 = window.navigator.language;
            var exactMatch = this.config.availableLanguages.find(function (l) { return l === preferred_1; });
            if (exactMatch) {
                return exactMatch;
            }
            var getTwoLetters_1 = function (fullTag) { return fullTag.replace(/^(.+?)(-.*)?$/, "$1"); };
            var preferredTwoLetter_1 = getTwoLetters_1(window.navigator.language);
            var twoLetterMatch = this.config.availableLanguages.find(function (l) { return getTwoLetters_1(l) === preferredTwoLetter_1; });
            if (twoLetterMatch) {
                return twoLetterMatch;
            }
        }
        return this.config.defaultLanguage;
    };
    Properties = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped)
    ], Properties);
    return Properties;
}());
exports.Properties = Properties;


/***/ }),

/***/ "./src/handlers/AbstractHandler.ts":
/*!*****************************************!*\
  !*** ./src/handlers/AbstractHandler.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_193939__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_193939__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Global_1 = __nested_webpack_require_193939__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var AbstractHandler = /** @class */ (function () {
    function AbstractHandler(properties, textService, elementRegistrar, translationHighlighter) {
        this.properties = properties;
        this.textService = textService;
        this.elementRegistrar = elementRegistrar;
        this.translationHighlighter = translationHighlighter;
    }
    AbstractHandler.prototype.filterRestricted = function (nodes) {
        var restrictedElements = this.properties.config.restrictedElements;
        return nodes.filter(function (n) {
            var e = NodeHelper_1.NodeHelper.closestElement(n);
            return restrictedElements.indexOf(e.tagName.toLowerCase()) === -1
                && e.closest("[" + Global_1.RESTRICTED_ASCENDANT_ATTRIBUTE + "=\"true\"]") === null;
        });
    };
    AbstractHandler.prototype.handleNodes = function (nodes) {
        return __awaiter(this, void 0, void 0, function () {
            var nodes_1, nodes_1_1, textNode, result, text, keys, translatedNode, parentElement, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!nodes_1_1.done) return [3 /*break*/, 4];
                        textNode = nodes_1_1.value;
                        return [4 /*yield*/, this.textService.replace(textNode.textContent)];
                    case 2:
                        result = _b.sent();
                        if (result) {
                            text = result.text, keys = result.keys;
                            translatedNode = this.translateChildNode(textNode, text, keys);
                            parentElement = this.getParentElement(translatedNode);
                            parentElement._polygloat.nodes.add(translatedNode);
                            this.elementRegistrar.register(parentElement);
                        }
                        _b.label = 3;
                    case 3:
                        nodes_1_1 = nodes_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AbstractHandler.prototype.translateChildNode = function (node, newValue, keys) {
        node[Global_1.POLYGLOAT_ATTRIBUTE_NAME] = {
            oldTextContent: node.textContent,
            keys: keys
        };
        node.textContent = newValue;
        return node;
    };
    AbstractHandler.initParentElement = function (element) {
        if (element[Global_1.POLYGLOAT_ATTRIBUTE_NAME] === undefined) {
            element[Global_1.POLYGLOAT_ATTRIBUTE_NAME] = {
                nodes: new Set()
            };
            element.setAttribute(Global_1.POLYGLOAT_ATTRIBUTE_NAME, "");
        }
        return element;
    };
    AbstractHandler.prototype.getParentElement = function (node) {
        var parent = this.getSuitableParent(node);
        return AbstractHandler.initParentElement(parent);
    };
    AbstractHandler.prototype.getSuitableParent = function (node) {
        var domParent = NodeHelper_1.NodeHelper.getParentElement(node);
        if (domParent === undefined) {
            console.error(node);
            throw new Error("No suitable parent found for node above.");
        }
        if (!this.properties.config.passToParent) {
            return domParent;
        }
        if (Array.isArray(this.properties.config.passToParent)) {
            var tagNameEquals = function (elementTagName) { return domParent.tagName.toLowerCase() === elementTagName.toLowerCase(); };
            if (this.properties.config.passToParent.findIndex(tagNameEquals) === -1) {
                return domParent;
            }
        }
        if (typeof this.properties.config.passToParent === "function") {
            if (!this.properties.config.passToParent(domParent)) {
                return domParent;
            }
        }
        return this.getSuitableParent(domParent);
    };
    return AbstractHandler;
}());
exports.AbstractHandler = AbstractHandler;


/***/ }),

/***/ "./src/handlers/AttributeHandler.ts":
/*!******************************************!*\
  !*** ./src/handlers/AttributeHandler.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_202254__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeHandler = void 0;
var tsyringe_1 = __nested_webpack_require_202254__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var AbstractHandler_1 = __nested_webpack_require_202254__(/*! ./AbstractHandler */ "./src/handlers/AbstractHandler.ts");
var Properties_1 = __nested_webpack_require_202254__(/*! ../Properties */ "./src/Properties.ts");
var NodeHelper_1 = __nested_webpack_require_202254__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var TextService_1 = __nested_webpack_require_202254__(/*! ../services/TextService */ "./src/services/TextService.ts");
var ElementRegistrar_1 = __nested_webpack_require_202254__(/*! ../services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var TranslationHighlighter_1 = __nested_webpack_require_202254__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var AttributeHandler = /** @class */ (function (_super) {
    __extends(AttributeHandler, _super);
    function AttributeHandler(properties, textService, elementRegistrar, translationHighlighter) {
        var _this = _super.call(this, properties, textService, elementRegistrar, translationHighlighter) || this;
        _this.properties = properties;
        _this.textService = textService;
        _this.elementRegistrar = elementRegistrar;
        _this.translationHighlighter = translationHighlighter;
        return _this;
    }
    AttributeHandler.prototype.handle = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var inputPrefix, inputSuffix, _a, _b, _c, tag, attributes, attributes_1, attributes_1_1, attribute, expression, nodes, e_1_1, e_2_1;
            var e_2, _d, e_1, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        inputPrefix = this.properties.config.inputPrefix;
                        inputSuffix = this.properties.config.inputSuffix;
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 12, 13, 14]);
                        _a = __values(Object.entries(this.properties.config.tagAttributes)), _b = _a.next();
                        _f.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 11];
                        _c = __read(_b.value, 2), tag = _c[0], attributes = _c[1];
                        _f.label = 3;
                    case 3:
                        _f.trys.push([3, 8, 9, 10]);
                        attributes_1 = (e_1 = void 0, __values(attributes)), attributes_1_1 = attributes_1.next();
                        _f.label = 4;
                    case 4:
                        if (!!attributes_1_1.done) return [3 /*break*/, 7];
                        attribute = attributes_1_1.value;
                        expression = "descendant-or-self::" + tag + "/@" + attribute + "[contains(., '" + inputPrefix + "') and contains(., '" + inputSuffix + "')]";
                        nodes = NodeHelper_1.NodeHelper.evaluate(expression, node);
                        return [4 /*yield*/, this.handleNodes(nodes)];
                    case 5:
                        _f.sent();
                        _f.label = 6;
                    case 6:
                        attributes_1_1 = attributes_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (attributes_1_1 && !attributes_1_1.done && (_e = attributes_1.return)) _e.call(attributes_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2_1 = _f.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    AttributeHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            TextService_1.TextService,
            ElementRegistrar_1.ElementRegistrar,
            TranslationHighlighter_1.TranslationHighlighter])
    ], AttributeHandler);
    return AttributeHandler;
}(AbstractHandler_1.AbstractHandler));
exports.AttributeHandler = AttributeHandler;


/***/ }),

/***/ "./src/handlers/CoreHandler.ts":
/*!*************************************!*\
  !*** ./src/handlers/CoreHandler.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_212440__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_212440__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var CoreService_1 = __nested_webpack_require_212440__(/*! ../services/CoreService */ "./src/services/CoreService.ts");
var TextHandler_1 = __nested_webpack_require_212440__(/*! ./TextHandler */ "./src/handlers/TextHandler.ts");
var tsyringe_1 = __nested_webpack_require_212440__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventService_1 = __nested_webpack_require_212440__(/*! ../services/EventService */ "./src/services/EventService.ts");
var Properties_1 = __nested_webpack_require_212440__(/*! ../Properties */ "./src/Properties.ts");
var AttributeHandler_1 = __nested_webpack_require_212440__(/*! ./AttributeHandler */ "./src/handlers/AttributeHandler.ts");
var TextService_1 = __nested_webpack_require_212440__(/*! ../services/TextService */ "./src/services/TextService.ts");
var CoreHandler = /** @class */ (function () {
    function CoreHandler(service, basicTextHandler, eventService, properties, attributeHandler, textService) {
        this.service = service;
        this.basicTextHandler = basicTextHandler;
        this.eventService = eventService;
        this.properties = properties;
        this.attributeHandler = attributeHandler;
        this.textService = textService;
        eventService.LANGUAGE_CHANGED.subscribe(this.refresh.bind(this));
        eventService.TRANSLATION_CHANGED.subscribe(this.refresh.bind(this));
    }
    CoreHandler.prototype.handleSubtree = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.attributeHandler.handle(target)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.basicTextHandler.handle(target)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CoreHandler.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodes, nodes_1, nodes_1_1, node, _a, _b, textNode, result, e_1_1, e_2_1;
            var e_2, _c, e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        nodes = NodeHelper_1.NodeHelper.evaluate("//*[@_polygloat]", this.properties.config.targetElement);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 12, 13, 14]);
                        nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next();
                        _e.label = 2;
                    case 2:
                        if (!!nodes_1_1.done) return [3 /*break*/, 11];
                        node = nodes_1_1.value;
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 8, 9, 10]);
                        _a = (e_1 = void 0, __values(node._polygloat.nodes)), _b = _a.next();
                        _e.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 7];
                        textNode = _b.value;
                        return [4 /*yield*/, this.textService.replace(textNode._polygloat.oldTextContent)];
                    case 5:
                        result = _e.sent();
                        if (result) {
                            textNode.textContent = result.text;
                        }
                        _e.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        nodes_1_1 = nodes_1.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (nodes_1_1 && !nodes_1_1.done && (_c = nodes_1.return)) _c.call(nodes_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    CoreHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [CoreService_1.CoreService,
            TextHandler_1.TextHandler,
            EventService_1.EventService,
            Properties_1.Properties,
            AttributeHandler_1.AttributeHandler,
            TextService_1.TextService])
    ], CoreHandler);
    return CoreHandler;
}());
exports.CoreHandler = CoreHandler;


/***/ }),

/***/ "./src/handlers/TextHandler.ts":
/*!*************************************!*\
  !*** ./src/handlers/TextHandler.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_221914__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_221914__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Properties_1 = __nested_webpack_require_221914__(/*! ../Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_221914__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationHighlighter_1 = __nested_webpack_require_221914__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var TextService_1 = __nested_webpack_require_221914__(/*! ../services/TextService */ "./src/services/TextService.ts");
var AbstractHandler_1 = __nested_webpack_require_221914__(/*! ./AbstractHandler */ "./src/handlers/AbstractHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_221914__(/*! ../services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var TextHandler = /** @class */ (function (_super) {
    __extends(TextHandler, _super);
    function TextHandler(properties, translationHighlighter, textService, nodeRegistrar) {
        var _this = _super.call(this, properties, textService, nodeRegistrar, translationHighlighter) || this;
        _this.properties = properties;
        _this.translationHighlighter = translationHighlighter;
        _this.textService = textService;
        _this.nodeRegistrar = nodeRegistrar;
        return _this;
    }
    TextHandler.prototype.handle = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var inputPrefix, inputSuffix, xPath, nodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputPrefix = this.properties.config.inputPrefix;
                        inputSuffix = this.properties.config.inputSuffix;
                        xPath = "./descendant-or-self::text()[contains(., '" + inputPrefix + "') and contains(., '" + inputSuffix + "')]";
                        nodes = this.filterRestricted(NodeHelper_1.NodeHelper.evaluate(xPath, node));
                        return [4 /*yield*/, this.handleNodes(nodes)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TextHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            TranslationHighlighter_1.TranslationHighlighter,
            TextService_1.TextService,
            ElementRegistrar_1.ElementRegistrar])
    ], TextHandler);
    return TextHandler;
}(AbstractHandler_1.AbstractHandler));
exports.TextHandler = TextHandler;


/***/ }),

/***/ "./src/helpers/NodeHelper.ts":
/*!***********************************!*\
  !*** ./src/helpers/NodeHelper.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_228720__) {

"use strict";

var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHelper = void 0;
var Global_1 = __nested_webpack_require_228720__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var NodeHelper = /** @class */ (function () {
    function NodeHelper() {
    }
    NodeHelper.evaluateGenerator = function (expression, targetNode) {
        var node, evaluated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    evaluated = document.evaluate(expression, targetNode, undefined, XPathResult.ANY_TYPE);
                    _a.label = 1;
                case 1:
                    if (!((node = evaluated.iterateNext()) !== null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    NodeHelper.evaluate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Array.from(this.evaluateGenerator.apply(this, __spread(args)));
    };
    NodeHelper.evaluateToSingle = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr = this.evaluate.apply(this, __spread(args));
        if (arr.length === 1) {
            return arr[0];
        }
        if (arr.length < 1) {
            throw new Error("No element found");
        }
        throw new Error("Multiple elements found");
    };
    NodeHelper.closestElement = function (node) {
        if (node instanceof Text) {
            return node.parentElement;
        }
        return node;
    };
    NodeHelper.getParentElement = function (node) {
        if (node.parentElement) {
            return node.parentElement;
        }
        if (node.ownerElement) {
            return node.ownerElement;
        }
    };
    NodeHelper.isElementTargetElement = function (element) {
        return element.hasAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE);
    };
    NodeHelper.markElementAsTargetElement = function (element) {
        element.setAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE, "");
    };
    NodeHelper.unmarkElementAsTargetElement = function (element) {
        element.removeAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE);
    };
    NodeHelper.nodeContains = function (descendant, node) {
        if (descendant.contains(node)) {
            return true;
        }
        if (node instanceof Attr) {
            var ownerContainsAttr = Object.values(node.ownerElement.attributes).indexOf(node) > -1;
            if (descendant.contains(node.ownerElement) && ownerContainsAttr) {
                return true;
            }
        }
        return false;
    };
    return NodeHelper;
}());
exports.NodeHelper = NodeHelper;


/***/ }),

/***/ "./src/helpers/TextHelper.ts":
/*!***********************************!*\
  !*** ./src/helpers/TextHelper.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHelper = void 0;
var TextHelper = /** @class */ (function () {
    function TextHelper() {
    }
    TextHelper.splitOnNonEscapedDelimiter = function (string, delimiter) {
        var result = [];
        var actual = "";
        for (var i = 0; i < string.length; i++) {
            var char = string[i];
            if (char === delimiter) {
                if (!this.isCharEscaped(i, string)) {
                    result.push(this.removeEscapes(actual));
                    actual = "";
                    continue;
                }
            }
            actual += string[i];
        }
        result.push(this.removeEscapes(actual));
        return result;
    };
    TextHelper.isCharEscaped = function (position, fullString) {
        var escapeCharsCount = 0;
        while (position > -1 && fullString[position - 1] === "\\") {
            escapeCharsCount++;
            position--;
        }
        return escapeCharsCount % 2 == 1;
    };
    TextHelper.removeEscapes = function (text) {
        return text.replace(/\\?\\?/g, function (match) {
            if (match == "\\\\") {
                return "\\";
            }
            return "";
        });
    };
    return TextHelper;
}());
exports.TextHelper = TextHelper;


/***/ }),

/***/ "./src/highlighter/MouseEventHandler.ts":
/*!**********************************************!*\
  !*** ./src/highlighter/MouseEventHandler.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_236060__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseEventHandler = void 0;
var ModifierKey_1 = __nested_webpack_require_236060__(/*! ../Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
var tsyringe_1 = __nested_webpack_require_236060__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_236060__(/*! ../Properties */ "./src/Properties.ts");
var EventEmitter_1 = __nested_webpack_require_236060__(/*! ../services/EventEmitter */ "./src/services/EventEmitter.ts");
var MouseEventHandler = /** @class */ (function () {
    function MouseEventHandler(properties) {
        this.properties = properties;
        this.keysDown = new Set();
        this.mouseOn = new Set();
        this.mouseOnChanged = new EventEmitter_1.EventEmitterImpl();
        this.keysChanged = new EventEmitter_1.EventEmitterImpl();
        this.initKeyListener();
    }
    MouseEventHandler.prototype.handle = function (element, onclick) {
        var _this = this;
        if (element._polygloat.listeningForHighlighting) {
            console.error("Element is already listening mouse events! This is probably bug in polygloat");
            return;
        }
        element._polygloat.listeningForHighlighting = true;
        this.initEventListeners(element, onclick);
        this.mouseOnChanged.subscribe(function () {
            if (_this.highlighted !== _this.getMouseOn()) {
                _this.onConditionsChanged();
            }
        });
        this.keysChanged.subscribe(function () {
            _this.onConditionsChanged();
        });
    };
    MouseEventHandler.prototype.initEventListeners = function (element, onclick) {
        var _this = this;
        var onMouseOver = function () { return _this.onMouseOver(element); };
        var onMouseOut = function () { return _this.onMouseOut(element); };
        var onClick = function (e) {
            if (_this.areKeysDown()) {
                e.stopPropagation();
                e.preventDefault();
                onclick(e);
            }
        };
        element.addEventListener("mouseover", onMouseOver);
        element.addEventListener("click", onClick);
        var onMouseDownOrUp = function (e) {
            if (_this.areKeysDown()) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        element.addEventListener("mousedown", onMouseDownOrUp);
        element.addEventListener("mouseup", onMouseDownOrUp);
        element.addEventListener("mouseout", onMouseOut);
        element._polygloat.removeAllEventListeners = function () {
            element.removeEventListener("mousedown", onMouseDownOrUp);
            element.removeEventListener("mouseup", onMouseDownOrUp);
            element.removeEventListener("mouseover", onMouseOver);
            element.removeEventListener("click", onClick);
            element.removeEventListener("mouseout", onMouseOut);
        };
    };
    MouseEventHandler.prototype.onConditionsChanged = function () {
        this.unhighlight();
        if (this.areKeysDown() && this.getMouseOn()) {
            this.highlight();
        }
    };
    MouseEventHandler.prototype.highlight = function () {
        this.highlightedInitialBackgroundColor = this.getMouseOn().style.backgroundColor;
        this.getMouseOn().style.backgroundColor = this.properties.config.highlightColor;
        this.highlighted = this.getMouseOn();
    };
    MouseEventHandler.prototype.unhighlight = function () {
        if (this.highlighted) {
            this.highlighted.style.backgroundColor = this.highlightedInitialBackgroundColor;
            this.highlighted = null;
        }
    };
    MouseEventHandler.prototype.onMouseOut = function (element) {
        this.mouseOn.delete(element);
        this.mouseOnChanged.emit(this.getMouseOn());
    };
    MouseEventHandler.prototype.onMouseOver = function (element) {
        this.mouseOn.delete(element); //to get in to last place
        this.mouseOn.add(element);
        this.mouseOnChanged.emit(this.getMouseOn());
    };
    MouseEventHandler.prototype.getMouseOn = function () {
        var mouseOnArray = Array.from(this.mouseOn);
        return mouseOnArray.length ? mouseOnArray[0] : undefined;
    };
    MouseEventHandler.prototype.initKeyListener = function () {
        var _this = this;
        window.addEventListener('blur', function () {
            _this.keysDown = new Set();
            _this.keysChanged.emit(_this.areKeysDown());
        });
        window.addEventListener('keydown', function (e) {
            var modifierKey = ModifierKey_1.ModifierKey[e.key];
            if (modifierKey !== undefined) {
                _this.keysDown.add(modifierKey);
                _this.keysChanged.emit(_this.areKeysDown());
            }
        });
        window.addEventListener('keyup', function (e) {
            _this.keysDown.delete(ModifierKey_1.ModifierKey[e.key]);
            _this.keysChanged.emit(_this.areKeysDown());
        });
    };
    MouseEventHandler.prototype.areKeysDown = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.properties.config.highlightKeys), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (!this.keysDown.has(key)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    MouseEventHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties])
    ], MouseEventHandler);
    return MouseEventHandler;
}());
exports.MouseEventHandler = MouseEventHandler;


/***/ }),

/***/ "./src/highlighter/TranslationHighlighter.ts":
/*!***************************************************!*\
  !*** ./src/highlighter/TranslationHighlighter.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_243507__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationHighlighter = void 0;
var CoreService_1 = __nested_webpack_require_243507__(/*! ../services/CoreService */ "./src/services/CoreService.ts");
var tsyringe_1 = __nested_webpack_require_243507__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_243507__(/*! ../Properties */ "./src/Properties.ts");
var EventService_1 = __nested_webpack_require_243507__(/*! ../services/EventService */ "./src/services/EventService.ts");
var TranslationService_1 = __nested_webpack_require_243507__(/*! ../services/TranslationService */ "./src/services/TranslationService.ts");
var MouseEventHandler_1 = __nested_webpack_require_243507__(/*! ./MouseEventHandler */ "./src/highlighter/MouseEventHandler.ts");
var TranslationHighlighter = /** @class */ (function () {
    function TranslationHighlighter(service, properties, eventService, translationService, mouseEventHandler) {
        var _this = this;
        this.service = service;
        this.properties = properties;
        this.eventService = eventService;
        this.translationService = translationService;
        this.mouseEventHandler = mouseEventHandler;
        this.translationEdit = function (e, element) { return __awaiter(_this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof this.renderer === "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getKey(e, element)];
                    case 1:
                        key = _a.sent();
                        if (key) {
                            this.renderer.renderViewer(key);
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                    case 2:
                        console.warn("Polygloat UI is not provided. To translate interactively provide polygloat ui constructor to \"ui\" configuration property. " +
                            "To disable highlighting use production mode.");
                        return [2 /*return*/];
                }
            });
        }); };
    }
    TranslationHighlighter_1 = TranslationHighlighter;
    TranslationHighlighter.prototype.listen = function (element) {
        var _this = this;
        this.mouseEventHandler.handle(element, function (e) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.translationEdit(e, element)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
    };
    TranslationHighlighter.prototype.getKey = function (mouseEvent, element) {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = TranslationHighlighter_1.getKeyOptions(element);
                        if (!(keys.size > 1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.renderer.getKey({ keys: keys, openEvent: mouseEvent })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (keys.size === 1) {
                            return [2 /*return*/, Array.from(keys)[0]];
                        }
                        console.error("No key to translate. This seems like a bug in polygloat.");
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationHighlighter.getKeyOptions = function (node) {
        var nodes = Array.from(node._polygloat.nodes);
        var keys = nodes.reduce(function (acc, curr) {
            return __spread(acc, curr._polygloat.keys.map(function (k) { return k.key; }));
        }, []);
        return new Set(keys);
    };
    Object.defineProperty(TranslationHighlighter.prototype, "renderer", {
        get: function () {
            if (this._renderer === undefined) {
                if (typeof this.properties.config.ui === "function") {
                    this._renderer = new this.properties.config.ui({
                        coreService: this.service,
                        properties: this.properties,
                        eventService: this.eventService,
                        translationService: this.translationService
                    });
                }
            }
            return this._renderer;
        },
        enumerable: false,
        configurable: true
    });
    var TranslationHighlighter_1;
    TranslationHighlighter = TranslationHighlighter_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [CoreService_1.CoreService,
            Properties_1.Properties,
            EventService_1.EventService,
            TranslationService_1.TranslationService,
            MouseEventHandler_1.MouseEventHandler])
    ], TranslationHighlighter);
    return TranslationHighlighter;
}());
exports.TranslationHighlighter = TranslationHighlighter;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_252871__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierKey = exports.PolygloatConfig = exports.Polygloat = void 0;
__nested_webpack_require_252871__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");
__nested_webpack_require_252871__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
var Polygloat_1 = __nested_webpack_require_252871__(/*! ./Polygloat */ "./src/Polygloat.ts");
Object.defineProperty(exports, "Polygloat", { enumerable: true, get: function () { return Polygloat_1.Polygloat; } });
var PolygloatConfig_1 = __nested_webpack_require_252871__(/*! ./PolygloatConfig */ "./src/PolygloatConfig.ts");
Object.defineProperty(exports, "PolygloatConfig", { enumerable: true, get: function () { return PolygloatConfig_1.PolygloatConfig; } });
var ModifierKey_1 = __nested_webpack_require_252871__(/*! ./Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
Object.defineProperty(exports, "ModifierKey", { enumerable: true, get: function () { return ModifierKey_1.ModifierKey; } });


/***/ }),

/***/ "./src/services/ApiHttpService.ts":
/*!****************************************!*\
  !*** ./src/services/ApiHttpService.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_254166__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHttpService = void 0;
var tsyringe_1 = __nested_webpack_require_254166__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_254166__(/*! ../Properties */ "./src/Properties.ts");
var ApiHttpError_1 = __nested_webpack_require_254166__(/*! ../Errors/ApiHttpError */ "./src/Errors/ApiHttpError.ts");
var ApiHttpService = /** @class */ (function () {
    function ApiHttpService(properties) {
        this.properties = properties;
    }
    ApiHttpService_1 = ApiHttpService;
    ApiHttpService.prototype.fetch = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, url, rest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof args[0] === "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, fetch(__assign(__assign({}, args[0]), { url: this.getUrl(args[0].url) })).then(function (r) { return ApiHttpService_1.handleErrors(r); })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        _a = __read(args), url = _a[0], rest = _a.slice(1);
                        return [4 /*yield*/, fetch.apply(void 0, __spread([this.getUrl(url)], rest)).then(function (r) { return ApiHttpService_1.handleErrors(r); })];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.fetchJson = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch.apply(this, __spread(args)).then(function (res) {
                            return res.json();
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.post = function (url, body, init) {
        if (init === void 0) { init = {}; }
        var rest = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            rest[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch.apply(this, __spread([url, __assign({ body: JSON.stringify(body), method: 'POST', headers: {
                                    'Content-Type': 'application/json'
                                } }, init)], rest))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.postJson = function (url, body, init) {
        if (init === void 0) { init = {}; }
        var rest = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            rest[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post.apply(this, __spread([url, body, init], rest)).then(function (res) { return res.json(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.handleErrors = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var error, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(response.status >= 400)) return [3 /*break*/, 5];
                        error = new ApiHttpError_1.ApiHttpError(response);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        error.code = data.code;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.warn("Polygloat server responded with invalid status code.");
                        return [3 /*break*/, 4];
                    case 4: throw error;
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    ApiHttpService.prototype.getUrl = function (path) {
        return this.properties.config.apiUrl + "/uaa/" + path + "?ak=" + this.properties.config.apiKey;
    };
    var ApiHttpService_1;
    ApiHttpService = ApiHttpService_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties])
    ], ApiHttpService);
    return ApiHttpService;
}());
exports.ApiHttpService = ApiHttpService;


/***/ }),

/***/ "./src/services/CoreService.ts":
/*!*************************************!*\
  !*** ./src/services/CoreService.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_264065__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreService = void 0;
var Properties_1 = __nested_webpack_require_264065__(/*! ../Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_264065__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var ApiHttpService_1 = __nested_webpack_require_264065__(/*! ./ApiHttpService */ "./src/services/ApiHttpService.ts");
var CoreService = /** @class */ (function () {
    function CoreService(properties, apiHttpService) {
        this.properties = properties;
        this.apiHttpService = apiHttpService;
    }
    CoreService.prototype.getLanguages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var languages, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.languagePromise instanceof Promise)) {
                            this.languagePromise = this.apiHttpService.fetchJson("languages");
                        }
                        _a = Set.bind;
                        return [4 /*yield*/, this.languagePromise];
                    case 1:
                        languages = new (_a.apply(Set, [void 0, _b.sent()]))();
                        this.properties.preferredLanguages = new Set(Array.from(this.properties.preferredLanguages).filter(function (l) { return languages.has(l); }));
                        return [2 /*return*/, languages];
                }
            });
        });
    };
    CoreService.prototype.getScopes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apiHttpService.fetchJson("scopes")];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        console.error("Error getting scopes. Trying to switch to production mode!");
                        this.properties.config.mode = "production";
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CoreService.prototype.isAuthorizedTo = function (scope) {
        return this.properties.scopes.indexOf(scope) > -1;
    };
    CoreService.prototype.checkScope = function (scope) {
        if (!this.isAuthorizedTo(scope)) {
            throw new Error("Api key not permitted to do this, please add 'translations.view' scope.");
        }
    };
    CoreService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, ApiHttpService_1.ApiHttpService])
    ], CoreService);
    return CoreService;
}());
exports.CoreService = CoreService;


/***/ }),

/***/ "./src/services/ElementRegistrar.ts":
/*!******************************************!*\
  !*** ./src/services/ElementRegistrar.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_270633__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementRegistrar = void 0;
var tsyringe_1 = __nested_webpack_require_270633__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_270633__(/*! ../Properties */ "./src/Properties.ts");
var Global_1 = __nested_webpack_require_270633__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var TranslationHighlighter_1 = __nested_webpack_require_270633__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var NodeHelper_1 = __nested_webpack_require_270633__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var ElementRegistrar = /** @class */ (function () {
    function ElementRegistrar(properties, translationHighlighter) {
        this.properties = properties;
        this.translationHighlighter = translationHighlighter;
        this.registeredElements = new Set();
    }
    ElementRegistrar.prototype.register = function (element) {
        if (this.getActiveNodes(element).next().value === undefined) {
            throw new Error("Registered element with no nodes. This is probably an bug in Polygloat.");
        }
        if (this.properties.config.mode === "development" && !this.registeredElements.has(element)) {
            this.translationHighlighter.listen(element);
        }
        this.registeredElements.add(element);
    };
    ElementRegistrar.prototype.refreshAll = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.registeredElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var element = _c.value;
                this.cleanElementInactiveNodes(element);
                if (element._polygloat.nodes.size === 0) {
                    this.cleanElement(element);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ElementRegistrar.prototype.cleanAll = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.registeredElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var registeredElement = _c.value;
                this.cleanElement(registeredElement);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    ElementRegistrar.prototype.cleanElementInactiveNodes = function (element) {
        if (this.isElementActive(element)) {
            element._polygloat.nodes = new Set(this.getActiveNodes(element));
            return;
        }
    };
    ElementRegistrar.prototype.cleanElement = function (element) {
        if (typeof element._polygloat.removeAllEventListeners === "function") {
            element._polygloat.removeAllEventListeners();
        }
        element.removeAttribute(Global_1.POLYGLOAT_ATTRIBUTE_NAME);
        delete element._polygloat;
        this.registeredElements.delete(element);
    };
    ElementRegistrar.prototype.getActiveNodes = function (element) {
        var _a, _b, node, e_3_1;
        var e_3, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(element._polygloat.nodes), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    node = _b.value;
                    if (!NodeHelper_1.NodeHelper.nodeContains(this.properties.config.targetElement, node)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_3_1 = _d.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    ElementRegistrar.prototype.isElementActive = function (element) {
        return this.properties.config.targetElement.contains(element);
    };
    ElementRegistrar = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, TranslationHighlighter_1.TranslationHighlighter])
    ], ElementRegistrar);
    return ElementRegistrar;
}());
exports.ElementRegistrar = ElementRegistrar;


/***/ }),

/***/ "./src/services/EventEmitter.ts":
/*!**************************************!*\
  !*** ./src/services/EventEmitter.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_279022__) {

"use strict";

var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitterImpl = void 0;
var Subscription_1 = __nested_webpack_require_279022__(/*! ./Subscription */ "./src/services/Subscription.ts");
var EventEmitterImpl = /** @class */ (function () {
    function EventEmitterImpl() {
        this.idCounter = 0;
        this._subscriptions = new Map();
    }
    Object.defineProperty(EventEmitterImpl.prototype, "subscriptions", {
        get: function () {
            return this._subscriptions;
        },
        enumerable: false,
        configurable: true
    });
    EventEmitterImpl.prototype.emit = function (data) {
        var e_1, _a;
        var promiseReturns = [];
        try {
            for (var _b = __values(this.subscriptions.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var callback = _c.value;
                var returned = callback(data);
                if (typeof (returned === null || returned === void 0 ? void 0 : returned["then"]) === "function") {
                    promiseReturns.push(returned);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (promiseReturns.length === 0) {
            return;
        }
        return new Promise(function (resolve) { return Promise.all(promiseReturns).then(function () { return resolve(); }); });
    };
    EventEmitterImpl.prototype.subscribe = function (callback) {
        var _this = this;
        var newId = this.idCounter++;
        var subscription = new Subscription_1.Subscription(function () { return _this.unsubscribe(newId); });
        this.subscriptions.set(newId, callback);
        return subscription;
    };
    EventEmitterImpl.prototype.unsubscribe = function (id) {
        var wasPresent = this._subscriptions.delete(id);
        if (!wasPresent) {
            console.warn("Event to unsubscribe was not found");
        }
    };
    return EventEmitterImpl;
}());
exports.EventEmitterImpl = EventEmitterImpl;


/***/ }),

/***/ "./src/services/EventService.ts":
/*!**************************************!*\
  !*** ./src/services/EventService.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_281937__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
var tsyringe_1 = __nested_webpack_require_281937__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventEmitter_1 = __nested_webpack_require_281937__(/*! ./EventEmitter */ "./src/services/EventEmitter.ts");
var EventService = /** @class */ (function () {
    function EventService() {
        this.TRANSLATION_CHANGED = new EventEmitter_1.EventEmitterImpl();
        this.LANGUAGE_CHANGED = new EventEmitter_1.EventEmitterImpl();
        this.LANGUAGE_LOADED = new EventEmitter_1.EventEmitterImpl();
    }
    EventService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped)
    ], EventService);
    return EventService;
}());
exports.EventService = EventService;


/***/ }),

/***/ "./src/services/Subscription.ts":
/*!**************************************!*\
  !*** ./src/services/Subscription.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
var Subscription = /** @class */ (function () {
    function Subscription(onUnsubscribe) {
        this.onUnsubscribe = onUnsubscribe;
    }
    Subscription.prototype.unsubscribe = function () {
        this.onUnsubscribe();
    };
    return Subscription;
}());
exports.Subscription = Subscription;


/***/ }),

/***/ "./src/services/TextService.ts":
/*!*************************************!*\
  !*** ./src/services/TextService.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_284251__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextService = void 0;
var tsyringe_1 = __nested_webpack_require_284251__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationService_1 = __nested_webpack_require_284251__(/*! ./TranslationService */ "./src/services/TranslationService.ts");
var Properties_1 = __nested_webpack_require_284251__(/*! ../Properties */ "./src/Properties.ts");
var TextHelper_1 = __nested_webpack_require_284251__(/*! ../helpers/TextHelper */ "./src/helpers/TextHelper.ts");
var TextService = /** @class */ (function () {
    function TextService(properties, translationService) {
        var _this = this;
        this.properties = properties;
        this.translationService = translationService;
        this.replaceParams = function (translation, params) {
            var result = translation;
            var regExp = function (name) { return new RegExp("\\{\\{\\s*" + _this.escapeForRegExp(name) + "\\s*\\}\\}", "g"); };
            Object.entries(params).forEach(function (_a) {
                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                return result = result.replace(regExp(name), value);
            });
            return result;
        };
        this.escapeForRegExp = function (string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        this.escapeParam = function (string) { return string.replace(/[,:\\]/gs, "\\$&"); };
    }
    TextService_1 = TextService;
    TextService.prototype.translate = function (key, params, lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.replaceParams;
                        return [4 /*yield*/, this.translationService.getTranslation(key, lang)];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent(), params])];
                }
            });
        });
    };
    TextService.prototype.instant = function (key, params, lang, orEmpty) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return this.replaceParams(this.translationService.getFromCacheOrFallback(key, lang, orEmpty), params);
    };
    TextService.prototype.replace = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var matchRegexp, keysAndParams, matched, translated, withoutEscapes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matchRegexp = new RegExp(this.rawUnWrapRegex, "gs");
                        return [4 /*yield*/, this.translationService.loadTranslations()];
                    case 1:
                        _a.sent();
                        keysAndParams = [];
                        matched = false;
                        translated = text.replace(matchRegexp, function (_, pre, wrapped, unwrapped, position) {
                            if (pre === "\\") {
                                if (!TextHelper_1.TextHelper.isCharEscaped(position, text)) {
                                    return pre + wrapped;
                                }
                            }
                            var translated = _this.getTranslatedWithMetadata(unwrapped);
                            keysAndParams.push({ key: translated.key, params: translated.params });
                            matched = true;
                            return pre + translated.translated;
                        });
                        withoutEscapes = TextHelper_1.TextHelper.removeEscapes(translated);
                        if (matched) {
                            return [2 /*return*/, { text: withoutEscapes, keys: keysAndParams }];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    TextService.prototype.wrap = function (key, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var paramString = Object.entries(params).map(function (_a) {
            var _b = __read(_a, 2), name = _b[0], value = _b[1];
            return _this.escapeParam(name) + ":" + _this.escapeParam(value);
        }).join(",");
        paramString = paramString.length ? ":" + paramString : "";
        return "" + this.properties.config.inputPrefix + this.escapeParam(key) + paramString + this.properties.config.inputSuffix;
    };
    TextService.prototype.getTranslatedWithMetadata = function (text) {
        var _a = TextService_1.parseUnwrapped(text), key = _a.key, params = _a.params;
        var translated = this.instant(key, params, undefined, false);
        return { translated: translated, key: key, params: params };
    };
    TextService.parseUnwrapped = function (unWrappedString) {
        var strings = unWrappedString.match(/(?:[^\\,:\n]|\\.)+/g);
        var result = { key: TextHelper_1.TextHelper.removeEscapes(strings.shift()), params: {} };
        while (strings.length) {
            var _a = __read(strings.splice(0, 2), 2), name_1 = _a[0], value = _a[1];
            result.params[name_1] = value;
        }
        return result;
    };
    Object.defineProperty(TextService.prototype, "rawUnWrapRegex", {
        get: function () {
            var escapedPrefix = this.escapeForRegExp(this.properties.config.inputPrefix);
            var escapedSuffix = this.escapeForRegExp(this.properties.config.inputSuffix);
            return "(\\\\?)(" + escapedPrefix + "(.*?)" + escapedSuffix + ")";
        },
        enumerable: false,
        configurable: true
    });
    var TextService_1;
    TextService = TextService_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, TranslationService_1.TranslationService])
    ], TextService);
    return TextService;
}());
exports.TextService = TextService;


/***/ }),

/***/ "./src/services/TranslationService.ts":
/*!********************************************!*\
  !*** ./src/services/TranslationService.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_294411__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
var tsyringe_1 = __nested_webpack_require_294411__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationData_1 = __nested_webpack_require_294411__(/*! ../DTOs/TranslationData */ "./src/DTOs/TranslationData.ts");
var Properties_1 = __nested_webpack_require_294411__(/*! ../Properties */ "./src/Properties.ts");
var CoreService_1 = __nested_webpack_require_294411__(/*! ./CoreService */ "./src/services/CoreService.ts");
var ApiHttpService_1 = __nested_webpack_require_294411__(/*! ./ApiHttpService */ "./src/services/ApiHttpService.ts");
var TextHelper_1 = __nested_webpack_require_294411__(/*! ../helpers/TextHelper */ "./src/helpers/TextHelper.ts");
var ApiHttpError_1 = __nested_webpack_require_294411__(/*! ../Errors/ApiHttpError */ "./src/Errors/ApiHttpError.ts");
var EventService_1 = __nested_webpack_require_294411__(/*! ./EventService */ "./src/services/EventService.ts");
var TranslationService = /** @class */ (function () {
    function TranslationService(properties, coreService, apiHttpService, eventService) {
        var _this = this;
        this.properties = properties;
        this.coreService = coreService;
        this.apiHttpService = apiHttpService;
        this.eventService = eventService;
        this.translationsCache = new Map();
        this.fetchPromises = [];
        this.getTranslationsOfKey = function (key, languages) {
            if (languages === void 0) { languages = new Set([_this.properties.currentLanguage]); }
            return __awaiter(_this, void 0, void 0, function () {
                var data, e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.coreService.checkScope("translations.view");
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 6]);
                            return [4 /*yield*/, this.apiHttpService.postJson("keyTranslations/" + Array.from(languages).join(","), { key: key })];
                        case 2:
                            data = _b.sent();
                            return [2 /*return*/, new TranslationData_1.TranslationData(key, data)];
                        case 3:
                            e_1 = _b.sent();
                            if (!(e_1 instanceof ApiHttpError_1.ApiHttpError)) return [3 /*break*/, 5];
                            if (!(e_1.response.status === 404)) return [3 /*break*/, 5];
                            if (!(e_1.code === "language_not_found")) return [3 /*break*/, 5];
                            _a = this.properties;
                            return [4 /*yield*/, this.coreService.getLanguages()];
                        case 4:
                            _a.preferredLanguages = _b.sent();
                            console.error("Requested language not found, refreshing the page!");
                            location.reload();
                            return [2 /*return*/];
                        case 5: throw e_1;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
    }
    TranslationService.prototype.loadTranslations = function (lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.translationsCache.get(lang) == undefined)) return [3 /*break*/, 2];
                        if (!(this.fetchPromises[lang] instanceof Promise)) {
                            this.fetchPromises[lang] = this.fetchTranslations(lang);
                        }
                        return [4 /*yield*/, this.fetchPromises[lang]];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.fetchPromises[lang] = undefined;
                        this.eventService.LANGUAGE_LOADED.emit(lang);
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getTranslation = function (name, lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.getFromCache(name, lang)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadTranslations(lang)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.getFromCacheOrFallback(name, lang)];
                }
            });
        });
    };
    TranslationService.prototype.setTranslations = function (translationData) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.coreService.checkScope("translations.edit");
                        return [4 /*yield*/, this.apiHttpService.post('', translationData)];
                    case 1:
                        _a.sent();
                        Object.keys(translationData.translations).forEach(function (lang) {
                            if (_this.translationsCache.get(lang)) { // if the language is not loaded, then ignore the change
                                var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(translationData.key, ".");
                                var root = _this.translationsCache.get(lang);
                                for (var i = 0; i < path.length; i++) {
                                    var item = path[i];
                                    if (root[item] === undefined) {
                                        root[item] = {};
                                    }
                                    if (i === (path.length - 1)) {
                                        root[item] = translationData.translations[lang];
                                        return;
                                    }
                                    root = root[item];
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getFromCacheOrFallback = function (name, lang, orEmpty) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        if (orEmpty === void 0) { orEmpty = false; }
        var translatedText = this.getFromCache(name, lang) || this.getFromCache(name, this.properties.config.fallbackLanguage);
        if (translatedText) {
            return translatedText;
        }
        if (orEmpty) {
            return "";
        }
        var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(name, ".");
        return path[path.length - 1];
    };
    TranslationService.prototype.fetchTranslations = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.properties.config.mode === "development")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchTranslationsDevelopment(lang)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.fetchTranslationsProduction(lang)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TranslationService.prototype.fetchTranslationsProduction = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            var result, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("" + (this.properties.config.filesUrlPrefix || "/") + lang + ".json")];
                    case 1:
                        result = _a.sent();
                        if (result.status >= 400) {
                            //on error set language data as empty object to not break the flow
                            this.translationsCache.set(lang, {});
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, result.json()];
                    case 2:
                        data = (_a.sent());
                        this.translationsCache.set(lang, data);
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.fetchTranslationsDevelopment = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.coreService.checkScope("translations.view");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apiHttpService.fetchJson("" + lang)];
                    case 2:
                        data = _a.sent();
                        this.translationsCache.set(lang, data[lang] || {});
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        this.translationsCache.set(lang, {});
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getFromCache = function (name, lang) {
        var e_3, _a;
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(name, ".");
        var root = this.translationsCache.get(lang);
        //if lang is not downloaded or does not exist at all
        if (root === undefined) {
            return undefined;
        }
        try {
            for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
                var item = path_1_1.value;
                if (root[item] === undefined) {
                    return undefined;
                }
                root = root[item];
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return root;
    };
    TranslationService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            CoreService_1.CoreService,
            ApiHttpService_1.ApiHttpService,
            EventService_1.EventService])
    ], TranslationService);
    return TranslationService;
}());
exports.TranslationService = TranslationService;


/***/ })

/******/ });
//# sourceMappingURL=polygloat.commonjs.js.map

/***/ }),

/***/ "../../packages/core/dist/polygloat.umd.js":
/*!*************************************************!*\
  !*** ../../packages/core/dist/polygloat.umd.js ***!
  \*************************************************/
/***/ ((module) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_555__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_555__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_555__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_555__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__nested_webpack_require_555__.d = function(exports, name, getter) {
/******/ 		if(!__nested_webpack_require_555__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__nested_webpack_require_555__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__nested_webpack_require_555__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __nested_webpack_require_555__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__nested_webpack_require_555__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __nested_webpack_require_555__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nested_webpack_require_555__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__nested_webpack_require_555__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__nested_webpack_require_555__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_555__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_555__(__nested_webpack_require_555__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/reflect-metadata/Reflect.js":
/*!**************************************************!*\
  !*** ./node_modules/reflect-metadata/Reflect.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_9958__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof global === "object" ? global :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect || (Reflect = {}));

/* WEBPACK VAR INJECTION */}.call(this, __nested_webpack_require_9958__(/*! ./../process/browser.js */ "./node_modules/process/browser.js"), __nested_webpack_require_9958__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
    true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_86922__) {

"use strict";
__nested_webpack_require_86922__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __nested_webpack_require_86922__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js":
/*!***********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_99208__) {

"use strict";
__nested_webpack_require_99208__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_99208__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_99208__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_99208__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");
/* harmony import */ var _providers_injection_token__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_99208__(/*! ../providers/injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony import */ var _error_helpers__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_99208__(/*! ../error-helpers */ "./node_modules/tsyringe/dist/esm5/error-helpers.js");





function autoInjectable() {
    return function (target) {
        var paramInfo = Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_1__["getParamInfo"])(target);
        return (function (_super) {
            Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _super.apply(this, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(args.concat(paramInfo.slice(args.length).map(function (type, index) {
                    var _a, _b, _c;
                    try {
                        if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTokenDescriptor"])(type)) {
                            if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(type)) {
                                return type.multiple
                                    ? (_a = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                        .resolve(type.transform)).transform.apply(_a, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolveAll(type.token)], type.transformArgs)) : (_b = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                    .resolve(type.transform)).transform.apply(_b, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token)], type.transformArgs));
                            }
                            else {
                                return type.multiple
                                    ? _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolveAll(type.token)
                                    : _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token);
                            }
                        }
                        else if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(type)) {
                            return (_c = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                .resolve(type.transform)).transform.apply(_c, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token)], type.transformArgs));
                        }
                        return _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type);
                    }
                    catch (e) {
                        var argIndex = index + args.length;
                        throw new Error(Object(_error_helpers__WEBPACK_IMPORTED_MODULE_4__["formatErrorCtor"])(target, argIndex, e));
                    }
                })))) || this;
            }
            return class_1;
        }(target));
    };
}
/* harmony default export */ __webpack_exports__["default"] = (autoInjectable);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/index.js ***!
  \*************************************************************/
/*! exports provided: autoInjectable, inject, injectable, registry, singleton, injectAll, injectAllWithTransform, injectWithTransform, scoped */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_103816__) {

"use strict";
__nested_webpack_require_103816__.r(__webpack_exports__);
/* harmony import */ var _auto_injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_103816__(/*! ./auto-injectable */ "./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "autoInjectable", function() { return _auto_injectable__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_103816__(/*! ./inject */ "./node_modules/tsyringe/dist/esm5/decorators/inject.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "inject", function() { return _inject__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_103816__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "injectable", function() { return _injectable__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_103816__(/*! ./registry */ "./node_modules/tsyringe/dist/esm5/decorators/registry.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "registry", function() { return _registry__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _singleton__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_103816__(/*! ./singleton */ "./node_modules/tsyringe/dist/esm5/decorators/singleton.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "singleton", function() { return _singleton__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _inject_all__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_103816__(/*! ./inject-all */ "./node_modules/tsyringe/dist/esm5/decorators/inject-all.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "injectAll", function() { return _inject_all__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _inject_all_with_transform__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_103816__(/*! ./inject-all-with-transform */ "./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "injectAllWithTransform", function() { return _inject_all_with_transform__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _inject_with_transform__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_103816__(/*! ./inject-with-transform */ "./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "injectWithTransform", function() { return _inject_with_transform__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _scoped__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_103816__(/*! ./scoped */ "./node_modules/tsyringe/dist/esm5/decorators/scoped.js");
/* harmony reexport (safe) */ __nested_webpack_require_103816__.d(__webpack_exports__, "scoped", function() { return _scoped__WEBPACK_IMPORTED_MODULE_8__["default"]; });












/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_107458__) {

"use strict";
__nested_webpack_require_107458__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_107458__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectAllWithTransform(token, transformer) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var data = {
        token: token,
        multiple: true,
        transform: transformer,
        transformArgs: args
    };
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(data);
}
/* harmony default export */ __webpack_exports__["default"] = (injectAllWithTransform);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-all.js":
/*!******************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-all.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_108596__) {

"use strict";
__nested_webpack_require_108596__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_108596__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectAll(token) {
    var data = { token: token, multiple: true };
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(data);
}
/* harmony default export */ __webpack_exports__["default"] = (injectAll);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_109543__) {

"use strict";
__nested_webpack_require_109543__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_109543__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectWithTransform(token, transformer) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(token, {
        transformToken: transformer,
        args: args
    });
}
/* harmony default export */ __webpack_exports__["default"] = (injectWithTransform);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject.js":
/*!**************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_110595__) {

"use strict";
__nested_webpack_require_110595__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_110595__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function inject(token) {
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(token);
}
/* harmony default export */ __webpack_exports__["default"] = (inject);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js":
/*!******************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/injectable.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_111444__) {

"use strict";
__nested_webpack_require_111444__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_111444__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_111444__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function injectable() {
    return function (target) {
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["typeInfo"].set(target, Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["getParamInfo"])(target));
    };
}
/* harmony default export */ __webpack_exports__["default"] = (injectable);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/registry.js":
/*!****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/registry.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_112576__) {

"use strict";
__nested_webpack_require_112576__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_112576__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_112576__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function registry(registrations) {
    if (registrations === void 0) { registrations = []; }
    return function (target) {
        registrations.forEach(function (_a) {
            var token = _a.token, options = _a.options, provider = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__rest"])(_a, ["token", "options"]);
            return _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].register(token, provider, options);
        });
        return target;
    };
}
/* harmony default export */ __webpack_exports__["default"] = (registry);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/scoped.js":
/*!**************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/scoped.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_113895__) {

"use strict";
__nested_webpack_require_113895__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_113895__.d(__webpack_exports__, "default", function() { return scoped; });
/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_113895__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_113895__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function scoped(lifecycle, token) {
    return function (target) {
        Object(_injectable__WEBPACK_IMPORTED_MODULE_0__["default"])()(target);
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].register(token || target, target, {
            lifecycle: lifecycle
        });
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/singleton.js":
/*!*****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/singleton.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_115135__) {

"use strict";
__nested_webpack_require_115135__.r(__webpack_exports__);
/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_115135__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_115135__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function singleton() {
    return function (target) {
        Object(_injectable__WEBPACK_IMPORTED_MODULE_0__["default"])()(target);
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].registerSingleton(target);
    };
}
/* harmony default export */ __webpack_exports__["default"] = (singleton);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/dependency-container.js":
/*!*****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/dependency-container.js ***!
  \*****************************************************************/
/*! exports provided: typeInfo, instance, default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_116286__) {

"use strict";
__nested_webpack_require_116286__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_116286__.d(__webpack_exports__, "typeInfo", function() { return typeInfo; });
/* harmony export (binding) */ __nested_webpack_require_116286__.d(__webpack_exports__, "instance", function() { return instance; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_116286__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_116286__(/*! ./providers */ "./node_modules/tsyringe/dist/esm5/providers/index.js");
/* harmony import */ var _providers_provider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_116286__(/*! ./providers/provider */ "./node_modules/tsyringe/dist/esm5/providers/provider.js");
/* harmony import */ var _providers_injection_token__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_116286__(/*! ./providers/injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_116286__(/*! ./registry */ "./node_modules/tsyringe/dist/esm5/registry.js");
/* harmony import */ var _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_116286__(/*! ./types/lifecycle */ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js");
/* harmony import */ var _resolution_context__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_116286__(/*! ./resolution-context */ "./node_modules/tsyringe/dist/esm5/resolution-context.js");
/* harmony import */ var _error_helpers__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_116286__(/*! ./error-helpers */ "./node_modules/tsyringe/dist/esm5/error-helpers.js");
/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_116286__(/*! ./lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");
/* harmony import */ var _interceptors__WEBPACK_IMPORTED_MODULE_9__ = __nested_webpack_require_116286__(/*! ./interceptors */ "./node_modules/tsyringe/dist/esm5/interceptors.js");










var typeInfo = new Map();
var InternalDependencyContainer = (function () {
    function InternalDependencyContainer(parent) {
        this.parent = parent;
        this._registry = new _registry__WEBPACK_IMPORTED_MODULE_4__["default"]();
        this.interceptors = new _interceptors__WEBPACK_IMPORTED_MODULE_9__["default"]();
    }
    InternalDependencyContainer.prototype.register = function (token, providerOrConstructor, options) {
        if (options === void 0) { options = { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Transient }; }
        var provider;
        if (!Object(_providers_provider__WEBPACK_IMPORTED_MODULE_2__["isProvider"])(providerOrConstructor)) {
            provider = { useClass: providerOrConstructor };
        }
        else {
            provider = providerOrConstructor;
        }
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(provider)) {
            var path = [token];
            var tokenProvider = provider;
            while (tokenProvider != null) {
                var currentToken = tokenProvider.useToken;
                if (path.includes(currentToken)) {
                    throw new Error("Token registration cycle detected! " + Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(path, [currentToken]).join(" -> "));
                }
                path.push(currentToken);
                var registration = this._registry.get(currentToken);
                if (registration && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(registration.provider)) {
                    tokenProvider = registration.provider;
                }
                else {
                    tokenProvider = null;
                }
            }
        }
        if (options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton ||
            options.lifecycle == _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped ||
            options.lifecycle == _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped) {
            if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(provider) || Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"])(provider)) {
                throw new Error("Cannot use lifecycle \"" + _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"][options.lifecycle] + "\" with ValueProviders or FactoryProviders");
            }
        }
        this._registry.set(token, { provider: provider, options: options });
        return this;
    };
    InternalDependencyContainer.prototype.registerType = function (from, to) {
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
            return this.register(from, {
                useToken: to
            });
        }
        return this.register(from, {
            useClass: to
        });
    };
    InternalDependencyContainer.prototype.registerInstance = function (token, instance) {
        return this.register(token, {
            useValue: instance
        });
    };
    InternalDependencyContainer.prototype.registerSingleton = function (from, to) {
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(from)) {
            if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
                return this.register(from, {
                    useToken: to
                }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
            }
            else if (to) {
                return this.register(from, {
                    useClass: to
                }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
            }
            throw new Error('Cannot register a type name as a singleton without a "to" token');
        }
        var useClass = from;
        if (to && !Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
            useClass = to;
        }
        return this.register(from, {
            useClass: useClass
        }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
    };
    InternalDependencyContainer.prototype.resolve = function (token, context) {
        if (context === void 0) { context = new _resolution_context__WEBPACK_IMPORTED_MODULE_6__["default"](); }
        var registration = this.getRegistration(token);
        if (!registration && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "Single");
        if (registration) {
            var result = this.resolveRegistration(registration, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isConstructorToken"])(token)) {
            var result = this.construct(token, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
    };
    InternalDependencyContainer.prototype.executePreResolutionInterceptor = function (token, resolutionType) {
        var e_1, _a;
        if (this.interceptors.preResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.interceptors.preResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, resolutionType);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.interceptors.preResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.executePostResolutionInterceptor = function (token, result, resolutionType) {
        var e_2, _a;
        if (this.interceptors.postResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.interceptors.postResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, result, resolutionType);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.interceptors.postResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.resolveRegistration = function (registration, context) {
        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped &&
            context.scopedResolutions.has(registration)) {
            return context.scopedResolutions.get(registration);
        }
        var isSingleton = registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton;
        var isContainerScoped = registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped;
        var returnInstance = isSingleton || isContainerScoped;
        var resolved;
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(registration.provider)) {
            resolved = registration.provider.useValue;
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.resolve(registration.provider.useToken, context))
                : this.resolve(registration.provider.useToken, context);
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isClassProvider"])(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.construct(registration.provider.useClass, context))
                : this.construct(registration.provider.useClass, context);
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"])(registration.provider)) {
            resolved = registration.provider.useFactory(this);
        }
        else {
            resolved = this.construct(registration.provider, context);
        }
        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped) {
            context.scopedResolutions.set(registration, resolved);
        }
        return resolved;
    };
    InternalDependencyContainer.prototype.resolveAll = function (token, context) {
        var _this = this;
        if (context === void 0) { context = new _resolution_context__WEBPACK_IMPORTED_MODULE_6__["default"](); }
        var registrations = this.getAllRegistrations(token);
        if (!registrations && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "All");
        if (registrations) {
            var result_1 = registrations.map(function (item) {
                return _this.resolveRegistration(item, context);
            });
            this.executePostResolutionInterceptor(token, result_1, "All");
            return result_1;
        }
        var result = [this.construct(token, context)];
        this.executePostResolutionInterceptor(token, result, "All");
        return result;
    };
    InternalDependencyContainer.prototype.isRegistered = function (token, recursive) {
        if (recursive === void 0) { recursive = false; }
        return (this._registry.has(token) ||
            (recursive &&
                (this.parent || false) &&
                this.parent.isRegistered(token, true)));
    };
    InternalDependencyContainer.prototype.reset = function () {
        this._registry.clear();
        this.interceptors.preResolution.clear();
        this.interceptors.postResolution.clear();
    };
    InternalDependencyContainer.prototype.clearInstances = function () {
        var e_3, _a;
        try {
            for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_c.value, 2), token = _d[0], registrations = _d[1];
                this._registry.setAll(token, registrations
                    .filter(function (registration) { return !Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(registration.provider); })
                    .map(function (registration) {
                    registration.instance = undefined;
                    return registration;
                }));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    InternalDependencyContainer.prototype.createChildContainer = function () {
        var e_4, _a;
        var childContainer = new InternalDependencyContainer(this);
        try {
            for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_c.value, 2), token = _d[0], registrations = _d[1];
                if (registrations.some(function (_a) {
                    var options = _a.options;
                    return options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped;
                })) {
                    childContainer._registry.setAll(token, registrations.map(function (registration) {
                        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped) {
                            return {
                                provider: registration.provider,
                                options: registration.options
                            };
                        }
                        return registration;
                    }));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return childContainer;
    };
    InternalDependencyContainer.prototype.beforeResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.preResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.afterResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.postResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.getRegistration = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.get(token);
        }
        if (this.parent) {
            return this.parent.getRegistration(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.getAllRegistrations = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.getAll(token);
        }
        if (this.parent) {
            return this.parent.getAllRegistrations(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.construct = function (ctor, context) {
        var _this = this;
        if (ctor instanceof _lazy_helpers__WEBPACK_IMPORTED_MODULE_8__["DelayedConstructor"]) {
            return ctor.createProxy(function (target) {
                return _this.resolve(target, context);
            });
        }
        var paramInfo = typeInfo.get(ctor);
        if (!paramInfo || paramInfo.length === 0) {
            if (ctor.length === 0) {
                return new ctor();
            }
            else {
                throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
            }
        }
        var params = paramInfo.map(this.resolveParams(context, ctor));
        return new (ctor.bind.apply(ctor, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([void 0], params)))();
    };
    InternalDependencyContainer.prototype.resolveParams = function (context, ctor) {
        var _this = this;
        return function (param, idx) {
            var _a, _b, _c;
            try {
                if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTokenDescriptor"])(param)) {
                    if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(param)) {
                        return param.multiple
                            ? (_a = _this.resolve(param.transform)).transform.apply(_a, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolveAll(param.token)], param.transformArgs)) : (_b = _this.resolve(param.transform)).transform.apply(_b, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolve(param.token, context)], param.transformArgs));
                    }
                    else {
                        return param.multiple
                            ? _this.resolveAll(param.token)
                            : _this.resolve(param.token, context);
                    }
                }
                else if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(param)) {
                    return (_c = _this.resolve(param.transform, context)).transform.apply(_c, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolve(param.token, context)], param.transformArgs));
                }
                return _this.resolve(param, context);
            }
            catch (e) {
                throw new Error(Object(_error_helpers__WEBPACK_IMPORTED_MODULE_7__["formatErrorCtor"])(ctor, idx, e));
            }
        };
    };
    return InternalDependencyContainer;
}());
var instance = new InternalDependencyContainer();
/* harmony default export */ __webpack_exports__["default"] = (instance);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/error-helpers.js":
/*!**********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/error-helpers.js ***!
  \**********************************************************/
/*! exports provided: formatErrorCtor */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_136451__) {

"use strict";
__nested_webpack_require_136451__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_136451__.d(__webpack_exports__, "formatErrorCtor", function() { return formatErrorCtor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_136451__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

function formatDependency(params, idx) {
    if (params === null) {
        return "at position #" + idx;
    }
    var argName = params.split(",")[idx].trim();
    return "\"" + argName + "\" at position #" + idx;
}
function composeErrorMessage(msg, e, indent) {
    if (indent === void 0) { indent = "    "; }
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([msg], e.message.split("\n").map(function (l) { return indent + l; })).join("\n");
}
function formatErrorCtor(ctor, paramIdx, error) {
    var _a = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), _b = _a[1], params = _b === void 0 ? null : _b;
    var dep = formatDependency(params, paramIdx);
    return composeErrorMessage("Cannot inject the dependency " + dep + " of \"" + ctor.name + "\" constructor. Reason:", error);
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/index.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/index.js ***!
  \************************************************************/
/*! exports provided: instanceCachingFactory, predicateAwareClassFactory */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_138063__) {

"use strict";
__nested_webpack_require_138063__.r(__webpack_exports__);
/* harmony import */ var _instance_caching_factory__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_138063__(/*! ./instance-caching-factory */ "./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js");
/* harmony reexport (safe) */ __nested_webpack_require_138063__.d(__webpack_exports__, "instanceCachingFactory", function() { return _instance_caching_factory__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _predicate_aware_class_factory__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_138063__(/*! ./predicate-aware-class-factory */ "./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js");
/* harmony reexport (safe) */ __nested_webpack_require_138063__.d(__webpack_exports__, "predicateAwareClassFactory", function() { return _predicate_aware_class_factory__WEBPACK_IMPORTED_MODULE_1__["default"]; });





/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_139403__) {

"use strict";
__nested_webpack_require_139403__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_139403__.d(__webpack_exports__, "default", function() { return instanceCachingFactory; });
function instanceCachingFactory(factoryFunc) {
    var instance;
    return function (dependencyContainer) {
        if (instance == undefined) {
            instance = factoryFunc(dependencyContainer);
        }
        return instance;
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js":
/*!************************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_140311__) {

"use strict";
__nested_webpack_require_140311__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_140311__.d(__webpack_exports__, "default", function() { return predicateAwareClassFactory; });
function predicateAwareClassFactory(predicate, trueConstructor, falseConstructor, useCaching) {
    if (useCaching === void 0) { useCaching = true; }
    var instance;
    var previousPredicate;
    return function (dependencyContainer) {
        var currentPredicate = predicate(dependencyContainer);
        if (!useCaching || previousPredicate !== currentPredicate) {
            if ((previousPredicate = currentPredicate)) {
                instance = dependencyContainer.resolve(trueConstructor);
            }
            else {
                instance = dependencyContainer.resolve(falseConstructor);
            }
        }
        return instance;
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/index.js":
/*!**************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/index.js ***!
  \**************************************************/
/*! exports provided: Lifecycle, autoInjectable, inject, injectable, registry, singleton, injectAll, injectAllWithTransform, injectWithTransform, scoped, instanceCachingFactory, predicateAwareClassFactory, isClassProvider, isFactoryProvider, isNormalToken, isTokenProvider, isValueProvider, delay, container */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_141785__) {

"use strict";
__nested_webpack_require_141785__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_141785__(/*! ./types */ "./node_modules/tsyringe/dist/esm5/types/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "Lifecycle", function() { return _types__WEBPACK_IMPORTED_MODULE_0__["Lifecycle"]; });

/* harmony import */ var _decorators__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_141785__(/*! ./decorators */ "./node_modules/tsyringe/dist/esm5/decorators/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "autoInjectable", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["autoInjectable"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "inject", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["inject"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "injectable", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectable"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "registry", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["registry"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "singleton", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["singleton"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "injectAll", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectAll"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "injectAllWithTransform", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectAllWithTransform"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "injectWithTransform", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectWithTransform"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "scoped", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["scoped"]; });

/* harmony import */ var _factories__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_141785__(/*! ./factories */ "./node_modules/tsyringe/dist/esm5/factories/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "instanceCachingFactory", function() { return _factories__WEBPACK_IMPORTED_MODULE_2__["instanceCachingFactory"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "predicateAwareClassFactory", function() { return _factories__WEBPACK_IMPORTED_MODULE_2__["predicateAwareClassFactory"]; });

/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_141785__(/*! ./providers */ "./node_modules/tsyringe/dist/esm5/providers/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "isClassProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isClassProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "isFactoryProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isFactoryProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "isNormalToken", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isNormalToken"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "isTokenProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isTokenProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "isValueProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isValueProvider"]; });

/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_141785__(/*! ./lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");
/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "delay", function() { return _lazy_helpers__WEBPACK_IMPORTED_MODULE_4__["delay"]; });

/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_141785__(/*! ./dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");
/* harmony reexport (safe) */ __nested_webpack_require_141785__.d(__webpack_exports__, "container", function() { return _dependency_container__WEBPACK_IMPORTED_MODULE_5__["instance"]; });

if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
    throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
}








/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/interceptors.js":
/*!*********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/interceptors.js ***!
  \*********************************************************/
/*! exports provided: PreResolutionInterceptors, PostResolutionInterceptors, default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_146773__) {

"use strict";
__nested_webpack_require_146773__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_146773__.d(__webpack_exports__, "PreResolutionInterceptors", function() { return PreResolutionInterceptors; });
/* harmony export (binding) */ __nested_webpack_require_146773__.d(__webpack_exports__, "PostResolutionInterceptors", function() { return PostResolutionInterceptors; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_146773__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _registry_base__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_146773__(/*! ./registry-base */ "./node_modules/tsyringe/dist/esm5/registry-base.js");


var PreResolutionInterceptors = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PreResolutionInterceptors, _super);
    function PreResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreResolutionInterceptors;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));

var PostResolutionInterceptors = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PostResolutionInterceptors, _super);
    function PostResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PostResolutionInterceptors;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));

var Interceptors = (function () {
    function Interceptors() {
        this.preResolution = new PreResolutionInterceptors();
        this.postResolution = new PostResolutionInterceptors();
    }
    return Interceptors;
}());
/* harmony default export */ __webpack_exports__["default"] = (Interceptors);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js":
/*!*********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/lazy-helpers.js ***!
  \*********************************************************/
/*! exports provided: DelayedConstructor, delay */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_148874__) {

"use strict";
__nested_webpack_require_148874__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_148874__.d(__webpack_exports__, "DelayedConstructor", function() { return DelayedConstructor; });
/* harmony export (binding) */ __nested_webpack_require_148874__.d(__webpack_exports__, "delay", function() { return delay; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_148874__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var DelayedConstructor = (function () {
    function DelayedConstructor(wrap) {
        this.wrap = wrap;
        this.reflectMethods = [
            "get",
            "getPrototypeOf",
            "setPrototypeOf",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "set",
            "deleteProperty",
            "apply",
            "construct"
        ];
    }
    DelayedConstructor.prototype.createProxy = function (createObject) {
        var _this = this;
        var target = {};
        var init = false;
        var value;
        var delayedObject = function () {
            if (!init) {
                value = createObject(_this.wrap());
                init = true;
            }
            return value;
        };
        return new Proxy(target, this.createHandler(delayedObject));
    };
    DelayedConstructor.prototype.createHandler = function (delayedObject) {
        var handler = {};
        var install = function (name) {
            handler[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args[0] = delayedObject();
                var method = Reflect[name];
                return method.apply(void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(args));
            };
        };
        this.reflectMethods.forEach(install);
        return handler;
    };
    return DelayedConstructor;
}());

function delay(wrappedConstructor) {
    if (typeof wrappedConstructor === "undefined") {
        throw new Error("Attempt to `delay` undefined. Constructor must be wrapped in a callback");
    }
    return new DelayedConstructor(wrappedConstructor);
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/class-provider.js ***!
  \*********************************************************************/
/*! exports provided: isClassProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_151530__) {

"use strict";
__nested_webpack_require_151530__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_151530__.d(__webpack_exports__, "isClassProvider", function() { return isClassProvider; });
function isClassProvider(provider) {
    return !!provider.useClass;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js":
/*!***********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/factory-provider.js ***!
  \***********************************************************************/
/*! exports provided: isFactoryProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_152221__) {

"use strict";
__nested_webpack_require_152221__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_152221__.d(__webpack_exports__, "isFactoryProvider", function() { return isFactoryProvider; });
function isFactoryProvider(provider) {
    return !!provider.useFactory;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/index.js ***!
  \************************************************************/
/*! exports provided: isClassProvider, isFactoryProvider, isNormalToken, isTokenProvider, isValueProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_152942__) {

"use strict";
__nested_webpack_require_152942__.r(__webpack_exports__);
/* harmony import */ var _class_provider__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_152942__(/*! ./class-provider */ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152942__.d(__webpack_exports__, "isClassProvider", function() { return _class_provider__WEBPACK_IMPORTED_MODULE_0__["isClassProvider"]; });

/* harmony import */ var _factory_provider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_152942__(/*! ./factory-provider */ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152942__.d(__webpack_exports__, "isFactoryProvider", function() { return _factory_provider__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"]; });

/* harmony import */ var _injection_token__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_152942__(/*! ./injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony reexport (safe) */ __nested_webpack_require_152942__.d(__webpack_exports__, "isNormalToken", function() { return _injection_token__WEBPACK_IMPORTED_MODULE_2__["isNormalToken"]; });

/* harmony import */ var _token_provider__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_152942__(/*! ./token-provider */ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152942__.d(__webpack_exports__, "isTokenProvider", function() { return _token_provider__WEBPACK_IMPORTED_MODULE_3__["isTokenProvider"]; });

/* harmony import */ var _value_provider__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_152942__(/*! ./value-provider */ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152942__.d(__webpack_exports__, "isValueProvider", function() { return _value_provider__WEBPACK_IMPORTED_MODULE_4__["isValueProvider"]; });








/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js":
/*!**********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/injection-token.js ***!
  \**********************************************************************/
/*! exports provided: isNormalToken, isTokenDescriptor, isTransformDescriptor, isConstructorToken */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_155319__) {

"use strict";
__nested_webpack_require_155319__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_155319__.d(__webpack_exports__, "isNormalToken", function() { return isNormalToken; });
/* harmony export (binding) */ __nested_webpack_require_155319__.d(__webpack_exports__, "isTokenDescriptor", function() { return isTokenDescriptor; });
/* harmony export (binding) */ __nested_webpack_require_155319__.d(__webpack_exports__, "isTransformDescriptor", function() { return isTransformDescriptor; });
/* harmony export (binding) */ __nested_webpack_require_155319__.d(__webpack_exports__, "isConstructorToken", function() { return isConstructorToken; });
/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_155319__(/*! ../lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");

function isNormalToken(token) {
    return typeof token === "string" || typeof token === "symbol";
}
function isTokenDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "multiple" in descriptor);
}
function isTransformDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "transform" in descriptor);
}
function isConstructorToken(token) {
    return typeof token === "function" || token instanceof _lazy_helpers__WEBPACK_IMPORTED_MODULE_0__["DelayedConstructor"];
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/provider.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/provider.js ***!
  \***************************************************************/
/*! exports provided: isProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_157072__) {

"use strict";
__nested_webpack_require_157072__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_157072__.d(__webpack_exports__, "isProvider", function() { return isProvider; });
/* harmony import */ var _class_provider__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_157072__(/*! ./class-provider */ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js");
/* harmony import */ var _value_provider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_157072__(/*! ./value-provider */ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js");
/* harmony import */ var _token_provider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_157072__(/*! ./token-provider */ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js");
/* harmony import */ var _factory_provider__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_157072__(/*! ./factory-provider */ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js");




function isProvider(provider) {
    return (Object(_class_provider__WEBPACK_IMPORTED_MODULE_0__["isClassProvider"])(provider) ||
        Object(_value_provider__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(provider) ||
        Object(_token_provider__WEBPACK_IMPORTED_MODULE_2__["isTokenProvider"])(provider) ||
        Object(_factory_provider__WEBPACK_IMPORTED_MODULE_3__["isFactoryProvider"])(provider));
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/token-provider.js ***!
  \*********************************************************************/
/*! exports provided: isTokenProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_158823__) {

"use strict";
__nested_webpack_require_158823__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_158823__.d(__webpack_exports__, "isTokenProvider", function() { return isTokenProvider; });
function isTokenProvider(provider) {
    return !!provider.useToken;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/value-provider.js ***!
  \*********************************************************************/
/*! exports provided: isValueProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_159504__) {

"use strict";
__nested_webpack_require_159504__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_159504__.d(__webpack_exports__, "isValueProvider", function() { return isValueProvider; });
function isValueProvider(provider) {
    return provider.useValue != undefined;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/reflection-helpers.js ***!
  \***************************************************************/
/*! exports provided: INJECTION_TOKEN_METADATA_KEY, getParamInfo, defineInjectionTokenMetadata */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_160229__) {

"use strict";
__nested_webpack_require_160229__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_160229__.d(__webpack_exports__, "INJECTION_TOKEN_METADATA_KEY", function() { return INJECTION_TOKEN_METADATA_KEY; });
/* harmony export (binding) */ __nested_webpack_require_160229__.d(__webpack_exports__, "getParamInfo", function() { return getParamInfo; });
/* harmony export (binding) */ __nested_webpack_require_160229__.d(__webpack_exports__, "defineInjectionTokenMetadata", function() { return defineInjectionTokenMetadata; });
var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
function getParamInfo(target) {
    var params = Reflect.getMetadata("design:paramtypes", target) || [];
    var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    Object.keys(injectionTokens).forEach(function (key) {
        params[+key] = injectionTokens[key];
    });
    return params;
}
function defineInjectionTokenMetadata(data, transform) {
    return function (target, _propertyKey, parameterIndex) {
        var descriptors = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
        descriptors[parameterIndex] = transform
            ? {
                token: data,
                transform: transform.transformToken,
                transformArgs: transform.args || []
            }
            : data;
        Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, descriptors, target);
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/registry-base.js":
/*!**********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/registry-base.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_162022__) {

"use strict";
__nested_webpack_require_162022__.r(__webpack_exports__);
var RegistryBase = (function () {
    function RegistryBase() {
        this._registryMap = new Map();
    }
    RegistryBase.prototype.entries = function () {
        return this._registryMap.entries();
    };
    RegistryBase.prototype.getAll = function (key) {
        this.ensure(key);
        return this._registryMap.get(key);
    };
    RegistryBase.prototype.get = function (key) {
        this.ensure(key);
        var value = this._registryMap.get(key);
        return value[value.length - 1] || null;
    };
    RegistryBase.prototype.set = function (key, value) {
        this.ensure(key);
        this._registryMap.get(key).push(value);
    };
    RegistryBase.prototype.setAll = function (key, value) {
        this._registryMap.set(key, value);
    };
    RegistryBase.prototype.has = function (key) {
        this.ensure(key);
        return this._registryMap.get(key).length > 0;
    };
    RegistryBase.prototype.clear = function () {
        this._registryMap.clear();
    };
    RegistryBase.prototype.ensure = function (key) {
        if (!this._registryMap.has(key)) {
            this._registryMap.set(key, []);
        }
    };
    return RegistryBase;
}());
/* harmony default export */ __webpack_exports__["default"] = (RegistryBase);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/registry.js":
/*!*****************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/registry.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_163687__) {

"use strict";
__nested_webpack_require_163687__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_163687__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _registry_base__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_163687__(/*! ./registry-base */ "./node_modules/tsyringe/dist/esm5/registry-base.js");


var Registry = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Registry;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Registry);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/resolution-context.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/resolution-context.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_164810__) {

"use strict";
__nested_webpack_require_164810__.r(__webpack_exports__);
var ResolutionContext = (function () {
    function ResolutionContext() {
        this.scopedResolutions = new Map();
    }
    return ResolutionContext;
}());
/* harmony default export */ __webpack_exports__["default"] = (ResolutionContext);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/types/index.js":
/*!********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/types/index.js ***!
  \********************************************************/
/*! exports provided: Lifecycle */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_165471__) {

"use strict";
__nested_webpack_require_165471__.r(__webpack_exports__);
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_165471__(/*! ./lifecycle */ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js");
/* harmony reexport (safe) */ __nested_webpack_require_165471__.d(__webpack_exports__, "Lifecycle", function() { return _lifecycle__WEBPACK_IMPORTED_MODULE_0__["default"]; });




/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/types/lifecycle.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_166230__) {

"use strict";
__nested_webpack_require_166230__.r(__webpack_exports__);
var Lifecycle;
(function (Lifecycle) {
    Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
    Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
    Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
    Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));
/* harmony default export */ __webpack_exports__["default"] = (Lifecycle);


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/Constants/Global.ts":
/*!*********************************!*\
  !*** ./src/Constants/Global.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.POLYGLOAT_TARGET_ATTRIBUTE = exports.POLYGLOAT_ATTRIBUTE_NAME = exports.RESTRICTED_ASCENDANT_ATTRIBUTE = void 0;
exports.RESTRICTED_ASCENDANT_ATTRIBUTE = "data-polygloat-restricted";
exports.POLYGLOAT_ATTRIBUTE_NAME = "_polygloat";
exports.POLYGLOAT_TARGET_ATTRIBUTE = "_polygloat-target";


/***/ }),

/***/ "./src/Constants/ModifierKey.ts":
/*!**************************************!*\
  !*** ./src/Constants/ModifierKey.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierKey = void 0;
var ModifierKey;
(function (ModifierKey) {
    ModifierKey[ModifierKey["Alt"] = 0] = "Alt";
    ModifierKey[ModifierKey["Control"] = 1] = "Control";
    ModifierKey[ModifierKey["Shift"] = 2] = "Shift";
    ModifierKey[ModifierKey["Meta"] = 3] = "Meta";
})(ModifierKey = exports.ModifierKey || (exports.ModifierKey = {}));


/***/ }),

/***/ "./src/DTOs/TranslationData.ts":
/*!*************************************!*\
  !*** ./src/DTOs/TranslationData.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationData = void 0;
var TranslationData = /** @class */ (function () {
    function TranslationData(key, translations) {
        this.key = key;
        this.translations = translations;
    }
    return TranslationData;
}());
exports.TranslationData = TranslationData;


/***/ }),

/***/ "./src/Errors/ApiHttpError.ts":
/*!************************************!*\
  !*** ./src/Errors/ApiHttpError.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHttpError = void 0;
var ApiHttpError = /** @class */ (function (_super) {
    __extends(ApiHttpError, _super);
    function ApiHttpError(response, code) {
        var _this = _super.call(this, "Api http error") || this;
        _this.response = response;
        _this.code = code;
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, ApiHttpError.prototype);
        return _this;
    }
    return ApiHttpError;
}(Error));
exports.ApiHttpError = ApiHttpError;


/***/ }),

/***/ "./src/Observer.ts":
/*!*************************!*\
  !*** ./src/Observer.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_171043__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
var tsyringe_1 = __nested_webpack_require_171043__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var CoreHandler_1 = __nested_webpack_require_171043__(/*! ./handlers/CoreHandler */ "./src/handlers/CoreHandler.ts");
var Properties_1 = __nested_webpack_require_171043__(/*! ./Properties */ "./src/Properties.ts");
var TextHandler_1 = __nested_webpack_require_171043__(/*! ./handlers/TextHandler */ "./src/handlers/TextHandler.ts");
var AttributeHandler_1 = __nested_webpack_require_171043__(/*! ./handlers/AttributeHandler */ "./src/handlers/AttributeHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_171043__(/*! ./services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var Observer = /** @class */ (function () {
    function Observer(properties, coreHandler, basicTextHandler, attributeHandler, nodeRegistrar) {
        var _this = this;
        this.properties = properties;
        this.coreHandler = coreHandler;
        this.basicTextHandler = basicTextHandler;
        this.attributeHandler = attributeHandler;
        this.nodeRegistrar = nodeRegistrar;
        this.observer = new MutationObserver(function (mutationsList) { return __awaiter(_this, void 0, void 0, function () {
            var mutationsList_1, mutationsList_1_1, mutation, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, 10, 11]);
                        mutationsList_1 = __values(mutationsList), mutationsList_1_1 = mutationsList_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!mutationsList_1_1.done) return [3 /*break*/, 8];
                        mutation = mutationsList_1_1.value;
                        if (!(mutation.type === 'characterData')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.basicTextHandler.handle(mutation.target)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(mutation.type === 'childList')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.coreHandler.handleSubtree(mutation.target)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(mutation.type === 'attributes')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.attributeHandler.handle(mutation.target)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        mutationsList_1_1 = mutationsList_1.next();
                        return [3 /*break*/, 1];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (mutationsList_1_1 && !mutationsList_1_1.done && (_a = mutationsList_1.return)) _a.call(mutationsList_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        this.nodeRegistrar.refreshAll();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    Observer.prototype.observe = function () {
        this.observer.observe(this.properties.config.targetElement, { attributes: true, childList: true, subtree: true, characterData: true });
    };
    Observer.prototype.stopObserving = function () {
        this.observer.disconnect();
    };
    Observer = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            CoreHandler_1.CoreHandler,
            TextHandler_1.TextHandler,
            AttributeHandler_1.AttributeHandler,
            ElementRegistrar_1.ElementRegistrar])
    ], Observer);
    return Observer;
}());
exports.Observer = Observer;


/***/ }),

/***/ "./src/Polygloat.ts":
/*!**************************!*\
  !*** ./src/Polygloat.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_179306__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygloat = void 0;
var CoreService_1 = __nested_webpack_require_179306__(/*! ./services/CoreService */ "./src/services/CoreService.ts");
var PolygloatConfig_1 = __nested_webpack_require_179306__(/*! ./PolygloatConfig */ "./src/PolygloatConfig.ts");
var Properties_1 = __nested_webpack_require_179306__(/*! ./Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_179306__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventService_1 = __nested_webpack_require_179306__(/*! ./services/EventService */ "./src/services/EventService.ts");
var Observer_1 = __nested_webpack_require_179306__(/*! ./Observer */ "./src/Observer.ts");
var TranslationService_1 = __nested_webpack_require_179306__(/*! ./services/TranslationService */ "./src/services/TranslationService.ts");
var TextService_1 = __nested_webpack_require_179306__(/*! ./services/TextService */ "./src/services/TextService.ts");
var CoreHandler_1 = __nested_webpack_require_179306__(/*! ./handlers/CoreHandler */ "./src/handlers/CoreHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_179306__(/*! ./services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var NodeHelper_1 = __nested_webpack_require_179306__(/*! ./helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Polygloat = /** @class */ (function () {
    function Polygloat(config) {
        var _this = this;
        this.container = tsyringe_1.container.createChildContainer();
        this.properties = this.container.resolve(Properties_1.Properties);
        this._coreService = this.container.resolve(CoreService_1.CoreService);
        this.eventService = this.container.resolve(EventService_1.EventService);
        this.observer = this.container.resolve(Observer_1.Observer);
        this.translationService = this.container.resolve(TranslationService_1.TranslationService);
        this.textService = this.container.resolve(TextService_1.TextService);
        this.coreHandler = this.container.resolve(CoreHandler_1.CoreHandler);
        this.elementRegistrar = this.container.resolve(ElementRegistrar_1.ElementRegistrar);
        this.translate = function (key, params, noWrap) {
            if (params === void 0) { params = {}; }
            if (noWrap === void 0) { noWrap = false; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.properties.config.mode === 'development' && !noWrap) {
                        return [2 /*return*/, this.textService.wrap(key, params)];
                    }
                    return [2 /*return*/, this.textService.translate(key, params)];
                });
            });
        };
        this.instant = function (key, params, noWrap, orEmpty) {
            if (params === void 0) { params = {}; }
            if (noWrap === void 0) { noWrap = false; }
            if (_this.properties.config.mode === 'development' && !noWrap) {
                return _this.textService.wrap(key, params);
            }
            return _this.textService.instant(key, params, undefined, orEmpty);
        };
        this.stop = function () {
            _this.observer.stopObserving();
            _this.elementRegistrar.cleanAll();
            NodeHelper_1.NodeHelper.unmarkElementAsTargetElement(_this.properties.config.targetElement);
        };
        this.container = tsyringe_1.container.createChildContainer();
        this.properties.config = new PolygloatConfig_1.PolygloatConfig(config);
    }
    Object.defineProperty(Polygloat.prototype, "lang", {
        get: function () {
            return this.properties.currentLanguage;
        },
        set: function (value) {
            this.properties.currentLanguage = value;
            this.eventService.LANGUAGE_CHANGED.emit(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "coreService", {
        get: function () {
            return this._coreService;
        },
        enumerable: false,
        configurable: true
    });
    Polygloat.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.properties.config.mode === "development")) return [3 /*break*/, 2];
                        _a = this.properties;
                        return [4 /*yield*/, this.coreService.getScopes()];
                    case 1:
                        _a.scopes = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (this.properties.config.watch) {
                            this.observer.observe();
                        }
                        return [4 /*yield*/, this.translationService.loadTranslations()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.refresh()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Polygloat.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.coreHandler.handleSubtree(this.properties.config.targetElement)];
            });
        });
    };
    Object.defineProperty(Polygloat.prototype, "defaultLanguage", {
        get: function () {
            return this.properties.config.defaultLanguage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "onLangChange", {
        get: function () {
            return this.eventService.LANGUAGE_CHANGED;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "onLangLoaded", {
        get: function () {
            return this.eventService.LANGUAGE_LOADED;
        },
        enumerable: false,
        configurable: true
    });
    return Polygloat;
}());
exports.Polygloat = Polygloat;
exports.default = Polygloat;


/***/ }),

/***/ "./src/PolygloatConfig.ts":
/*!********************************!*\
  !*** ./src/PolygloatConfig.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_188248__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygloatConfig = void 0;
var ModifierKey_1 = __nested_webpack_require_188248__(/*! ./Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
var NodeHelper_1 = __nested_webpack_require_188248__(/*! ./helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var DEFAULT_TARGET_ELEMENT = document.body;
var PolygloatConfig = /** @class */ (function () {
    function PolygloatConfig(config) {
        this.tagAttributes = {
            'textarea': ['placeholder'],
            'input': ['value', 'placeholder']
        };
        this.passToParent = ["option", "optgroup"];
        this.restrictedElements = ['script', 'style'];
        this.defaultLanguage = 'en';
        this.availableLanguages = ['en'];
        this.inputPrefix = '%-%polygloat:';
        this.inputSuffix = '%-%';
        this.filesUrlPrefix = "i18n/";
        this.highlightKeys = [ModifierKey_1.ModifierKey.Alt];
        this.highlightColor = "rgb(224 240 255)";
        //workaround for: https://stackoverflow.com/questions/48725916/typescript-optional-property-with-a-getter
        Object.defineProperty(this, 'targetElement', {
            set: function (targetElement) {
                if (this.targetElement !== undefined) {
                    throw new Error("Target element is already defined!");
                }
                if (targetElement === undefined) {
                    this._targetElement = DEFAULT_TARGET_ELEMENT;
                }
                if (NodeHelper_1.NodeHelper.isElementTargetElement(targetElement)) {
                    console.error("Target element: ", this._targetElement);
                    throw new Error("An polygloat instance is inited with provided target element");
                }
                this._targetElement = targetElement;
                NodeHelper_1.NodeHelper.markElementAsTargetElement(this._targetElement);
            },
            get: function () {
                return this._targetElement;
            }
        });
        Object.assign(this, config || {});
        if (this._targetElement === undefined) {
            this._targetElement = DEFAULT_TARGET_ELEMENT;
        }
        this.mode = this.mode || (this.apiKey ? "development" : "production");
        this.fallbackLanguage = this.fallbackLanguage || this.defaultLanguage;
        if (this.watch === undefined) {
            this.watch = this.mode === "development";
        }
    }
    return PolygloatConfig;
}());
exports.PolygloatConfig = PolygloatConfig;


/***/ }),

/***/ "./src/Properties.ts":
/*!***************************!*\
  !*** ./src/Properties.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_191011__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Properties = void 0;
var tsyringe_1 = __nested_webpack_require_191011__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY = "__polygloat_preferredLanguages";
var CURRENT_LANGUAGE_LOCAL_STORAGE_KEY = "__polygloat_currentLanguage";
var Properties = /** @class */ (function () {
    function Properties() {
        this.scopes = [];
    }
    Object.defineProperty(Properties.prototype, "preferredLanguages", {
        get: function () {
            return new Set(JSON.parse(localStorage.getItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY)));
        },
        set: function (languages) {
            localStorage.setItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY, JSON.stringify(Array.from(languages)));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Properties.prototype, "currentLanguage", {
        get: function () {
            var result = localStorage.getItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY);
            if (!result) {
                result = this.getLanguageByNavigator();
                this.currentLanguage = result;
            }
            return result;
        },
        set: function (language) {
            localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY, language);
        },
        enumerable: false,
        configurable: true
    });
    Properties.prototype.getLanguageByNavigator = function () {
        if (window) {
            var preferred_1 = window.navigator.language;
            var exactMatch = this.config.availableLanguages.find(function (l) { return l === preferred_1; });
            if (exactMatch) {
                return exactMatch;
            }
            var getTwoLetters_1 = function (fullTag) { return fullTag.replace(/^(.+?)(-.*)?$/, "$1"); };
            var preferredTwoLetter_1 = getTwoLetters_1(window.navigator.language);
            var twoLetterMatch = this.config.availableLanguages.find(function (l) { return getTwoLetters_1(l) === preferredTwoLetter_1; });
            if (twoLetterMatch) {
                return twoLetterMatch;
            }
        }
        return this.config.defaultLanguage;
    };
    Properties = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped)
    ], Properties);
    return Properties;
}());
exports.Properties = Properties;


/***/ }),

/***/ "./src/handlers/AbstractHandler.ts":
/*!*****************************************!*\
  !*** ./src/handlers/AbstractHandler.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_194295__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_194295__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Global_1 = __nested_webpack_require_194295__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var AbstractHandler = /** @class */ (function () {
    function AbstractHandler(properties, textService, elementRegistrar, translationHighlighter) {
        this.properties = properties;
        this.textService = textService;
        this.elementRegistrar = elementRegistrar;
        this.translationHighlighter = translationHighlighter;
    }
    AbstractHandler.prototype.filterRestricted = function (nodes) {
        var restrictedElements = this.properties.config.restrictedElements;
        return nodes.filter(function (n) {
            var e = NodeHelper_1.NodeHelper.closestElement(n);
            return restrictedElements.indexOf(e.tagName.toLowerCase()) === -1
                && e.closest("[" + Global_1.RESTRICTED_ASCENDANT_ATTRIBUTE + "=\"true\"]") === null;
        });
    };
    AbstractHandler.prototype.handleNodes = function (nodes) {
        return __awaiter(this, void 0, void 0, function () {
            var nodes_1, nodes_1_1, textNode, result, text, keys, translatedNode, parentElement, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!nodes_1_1.done) return [3 /*break*/, 4];
                        textNode = nodes_1_1.value;
                        return [4 /*yield*/, this.textService.replace(textNode.textContent)];
                    case 2:
                        result = _b.sent();
                        if (result) {
                            text = result.text, keys = result.keys;
                            translatedNode = this.translateChildNode(textNode, text, keys);
                            parentElement = this.getParentElement(translatedNode);
                            parentElement._polygloat.nodes.add(translatedNode);
                            this.elementRegistrar.register(parentElement);
                        }
                        _b.label = 3;
                    case 3:
                        nodes_1_1 = nodes_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AbstractHandler.prototype.translateChildNode = function (node, newValue, keys) {
        node[Global_1.POLYGLOAT_ATTRIBUTE_NAME] = {
            oldTextContent: node.textContent,
            keys: keys
        };
        node.textContent = newValue;
        return node;
    };
    AbstractHandler.initParentElement = function (element) {
        if (element[Global_1.POLYGLOAT_ATTRIBUTE_NAME] === undefined) {
            element[Global_1.POLYGLOAT_ATTRIBUTE_NAME] = {
                nodes: new Set()
            };
            element.setAttribute(Global_1.POLYGLOAT_ATTRIBUTE_NAME, "");
        }
        return element;
    };
    AbstractHandler.prototype.getParentElement = function (node) {
        var parent = this.getSuitableParent(node);
        return AbstractHandler.initParentElement(parent);
    };
    AbstractHandler.prototype.getSuitableParent = function (node) {
        var domParent = NodeHelper_1.NodeHelper.getParentElement(node);
        if (domParent === undefined) {
            console.error(node);
            throw new Error("No suitable parent found for node above.");
        }
        if (!this.properties.config.passToParent) {
            return domParent;
        }
        if (Array.isArray(this.properties.config.passToParent)) {
            var tagNameEquals = function (elementTagName) { return domParent.tagName.toLowerCase() === elementTagName.toLowerCase(); };
            if (this.properties.config.passToParent.findIndex(tagNameEquals) === -1) {
                return domParent;
            }
        }
        if (typeof this.properties.config.passToParent === "function") {
            if (!this.properties.config.passToParent(domParent)) {
                return domParent;
            }
        }
        return this.getSuitableParent(domParent);
    };
    return AbstractHandler;
}());
exports.AbstractHandler = AbstractHandler;


/***/ }),

/***/ "./src/handlers/AttributeHandler.ts":
/*!******************************************!*\
  !*** ./src/handlers/AttributeHandler.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_202610__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeHandler = void 0;
var tsyringe_1 = __nested_webpack_require_202610__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var AbstractHandler_1 = __nested_webpack_require_202610__(/*! ./AbstractHandler */ "./src/handlers/AbstractHandler.ts");
var Properties_1 = __nested_webpack_require_202610__(/*! ../Properties */ "./src/Properties.ts");
var NodeHelper_1 = __nested_webpack_require_202610__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var TextService_1 = __nested_webpack_require_202610__(/*! ../services/TextService */ "./src/services/TextService.ts");
var ElementRegistrar_1 = __nested_webpack_require_202610__(/*! ../services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var TranslationHighlighter_1 = __nested_webpack_require_202610__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var AttributeHandler = /** @class */ (function (_super) {
    __extends(AttributeHandler, _super);
    function AttributeHandler(properties, textService, elementRegistrar, translationHighlighter) {
        var _this = _super.call(this, properties, textService, elementRegistrar, translationHighlighter) || this;
        _this.properties = properties;
        _this.textService = textService;
        _this.elementRegistrar = elementRegistrar;
        _this.translationHighlighter = translationHighlighter;
        return _this;
    }
    AttributeHandler.prototype.handle = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var inputPrefix, inputSuffix, _a, _b, _c, tag, attributes, attributes_1, attributes_1_1, attribute, expression, nodes, e_1_1, e_2_1;
            var e_2, _d, e_1, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        inputPrefix = this.properties.config.inputPrefix;
                        inputSuffix = this.properties.config.inputSuffix;
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 12, 13, 14]);
                        _a = __values(Object.entries(this.properties.config.tagAttributes)), _b = _a.next();
                        _f.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 11];
                        _c = __read(_b.value, 2), tag = _c[0], attributes = _c[1];
                        _f.label = 3;
                    case 3:
                        _f.trys.push([3, 8, 9, 10]);
                        attributes_1 = (e_1 = void 0, __values(attributes)), attributes_1_1 = attributes_1.next();
                        _f.label = 4;
                    case 4:
                        if (!!attributes_1_1.done) return [3 /*break*/, 7];
                        attribute = attributes_1_1.value;
                        expression = "descendant-or-self::" + tag + "/@" + attribute + "[contains(., '" + inputPrefix + "') and contains(., '" + inputSuffix + "')]";
                        nodes = NodeHelper_1.NodeHelper.evaluate(expression, node);
                        return [4 /*yield*/, this.handleNodes(nodes)];
                    case 5:
                        _f.sent();
                        _f.label = 6;
                    case 6:
                        attributes_1_1 = attributes_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (attributes_1_1 && !attributes_1_1.done && (_e = attributes_1.return)) _e.call(attributes_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2_1 = _f.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    AttributeHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            TextService_1.TextService,
            ElementRegistrar_1.ElementRegistrar,
            TranslationHighlighter_1.TranslationHighlighter])
    ], AttributeHandler);
    return AttributeHandler;
}(AbstractHandler_1.AbstractHandler));
exports.AttributeHandler = AttributeHandler;


/***/ }),

/***/ "./src/handlers/CoreHandler.ts":
/*!*************************************!*\
  !*** ./src/handlers/CoreHandler.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_212796__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_212796__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var CoreService_1 = __nested_webpack_require_212796__(/*! ../services/CoreService */ "./src/services/CoreService.ts");
var TextHandler_1 = __nested_webpack_require_212796__(/*! ./TextHandler */ "./src/handlers/TextHandler.ts");
var tsyringe_1 = __nested_webpack_require_212796__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventService_1 = __nested_webpack_require_212796__(/*! ../services/EventService */ "./src/services/EventService.ts");
var Properties_1 = __nested_webpack_require_212796__(/*! ../Properties */ "./src/Properties.ts");
var AttributeHandler_1 = __nested_webpack_require_212796__(/*! ./AttributeHandler */ "./src/handlers/AttributeHandler.ts");
var TextService_1 = __nested_webpack_require_212796__(/*! ../services/TextService */ "./src/services/TextService.ts");
var CoreHandler = /** @class */ (function () {
    function CoreHandler(service, basicTextHandler, eventService, properties, attributeHandler, textService) {
        this.service = service;
        this.basicTextHandler = basicTextHandler;
        this.eventService = eventService;
        this.properties = properties;
        this.attributeHandler = attributeHandler;
        this.textService = textService;
        eventService.LANGUAGE_CHANGED.subscribe(this.refresh.bind(this));
        eventService.TRANSLATION_CHANGED.subscribe(this.refresh.bind(this));
    }
    CoreHandler.prototype.handleSubtree = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.attributeHandler.handle(target)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.basicTextHandler.handle(target)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CoreHandler.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodes, nodes_1, nodes_1_1, node, _a, _b, textNode, result, e_1_1, e_2_1;
            var e_2, _c, e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        nodes = NodeHelper_1.NodeHelper.evaluate("//*[@_polygloat]", this.properties.config.targetElement);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 12, 13, 14]);
                        nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next();
                        _e.label = 2;
                    case 2:
                        if (!!nodes_1_1.done) return [3 /*break*/, 11];
                        node = nodes_1_1.value;
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 8, 9, 10]);
                        _a = (e_1 = void 0, __values(node._polygloat.nodes)), _b = _a.next();
                        _e.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 7];
                        textNode = _b.value;
                        return [4 /*yield*/, this.textService.replace(textNode._polygloat.oldTextContent)];
                    case 5:
                        result = _e.sent();
                        if (result) {
                            textNode.textContent = result.text;
                        }
                        _e.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        nodes_1_1 = nodes_1.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (nodes_1_1 && !nodes_1_1.done && (_c = nodes_1.return)) _c.call(nodes_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    CoreHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [CoreService_1.CoreService,
            TextHandler_1.TextHandler,
            EventService_1.EventService,
            Properties_1.Properties,
            AttributeHandler_1.AttributeHandler,
            TextService_1.TextService])
    ], CoreHandler);
    return CoreHandler;
}());
exports.CoreHandler = CoreHandler;


/***/ }),

/***/ "./src/handlers/TextHandler.ts":
/*!*************************************!*\
  !*** ./src/handlers/TextHandler.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_222270__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_222270__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Properties_1 = __nested_webpack_require_222270__(/*! ../Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_222270__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationHighlighter_1 = __nested_webpack_require_222270__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var TextService_1 = __nested_webpack_require_222270__(/*! ../services/TextService */ "./src/services/TextService.ts");
var AbstractHandler_1 = __nested_webpack_require_222270__(/*! ./AbstractHandler */ "./src/handlers/AbstractHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_222270__(/*! ../services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var TextHandler = /** @class */ (function (_super) {
    __extends(TextHandler, _super);
    function TextHandler(properties, translationHighlighter, textService, nodeRegistrar) {
        var _this = _super.call(this, properties, textService, nodeRegistrar, translationHighlighter) || this;
        _this.properties = properties;
        _this.translationHighlighter = translationHighlighter;
        _this.textService = textService;
        _this.nodeRegistrar = nodeRegistrar;
        return _this;
    }
    TextHandler.prototype.handle = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var inputPrefix, inputSuffix, xPath, nodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputPrefix = this.properties.config.inputPrefix;
                        inputSuffix = this.properties.config.inputSuffix;
                        xPath = "./descendant-or-self::text()[contains(., '" + inputPrefix + "') and contains(., '" + inputSuffix + "')]";
                        nodes = this.filterRestricted(NodeHelper_1.NodeHelper.evaluate(xPath, node));
                        return [4 /*yield*/, this.handleNodes(nodes)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TextHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            TranslationHighlighter_1.TranslationHighlighter,
            TextService_1.TextService,
            ElementRegistrar_1.ElementRegistrar])
    ], TextHandler);
    return TextHandler;
}(AbstractHandler_1.AbstractHandler));
exports.TextHandler = TextHandler;


/***/ }),

/***/ "./src/helpers/NodeHelper.ts":
/*!***********************************!*\
  !*** ./src/helpers/NodeHelper.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_229076__) {

"use strict";

var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHelper = void 0;
var Global_1 = __nested_webpack_require_229076__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var NodeHelper = /** @class */ (function () {
    function NodeHelper() {
    }
    NodeHelper.evaluateGenerator = function (expression, targetNode) {
        var node, evaluated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    evaluated = document.evaluate(expression, targetNode, undefined, XPathResult.ANY_TYPE);
                    _a.label = 1;
                case 1:
                    if (!((node = evaluated.iterateNext()) !== null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    NodeHelper.evaluate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Array.from(this.evaluateGenerator.apply(this, __spread(args)));
    };
    NodeHelper.evaluateToSingle = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr = this.evaluate.apply(this, __spread(args));
        if (arr.length === 1) {
            return arr[0];
        }
        if (arr.length < 1) {
            throw new Error("No element found");
        }
        throw new Error("Multiple elements found");
    };
    NodeHelper.closestElement = function (node) {
        if (node instanceof Text) {
            return node.parentElement;
        }
        return node;
    };
    NodeHelper.getParentElement = function (node) {
        if (node.parentElement) {
            return node.parentElement;
        }
        if (node.ownerElement) {
            return node.ownerElement;
        }
    };
    NodeHelper.isElementTargetElement = function (element) {
        return element.hasAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE);
    };
    NodeHelper.markElementAsTargetElement = function (element) {
        element.setAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE, "");
    };
    NodeHelper.unmarkElementAsTargetElement = function (element) {
        element.removeAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE);
    };
    NodeHelper.nodeContains = function (descendant, node) {
        if (descendant.contains(node)) {
            return true;
        }
        if (node instanceof Attr) {
            var ownerContainsAttr = Object.values(node.ownerElement.attributes).indexOf(node) > -1;
            if (descendant.contains(node.ownerElement) && ownerContainsAttr) {
                return true;
            }
        }
        return false;
    };
    return NodeHelper;
}());
exports.NodeHelper = NodeHelper;


/***/ }),

/***/ "./src/helpers/TextHelper.ts":
/*!***********************************!*\
  !*** ./src/helpers/TextHelper.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHelper = void 0;
var TextHelper = /** @class */ (function () {
    function TextHelper() {
    }
    TextHelper.splitOnNonEscapedDelimiter = function (string, delimiter) {
        var result = [];
        var actual = "";
        for (var i = 0; i < string.length; i++) {
            var char = string[i];
            if (char === delimiter) {
                if (!this.isCharEscaped(i, string)) {
                    result.push(this.removeEscapes(actual));
                    actual = "";
                    continue;
                }
            }
            actual += string[i];
        }
        result.push(this.removeEscapes(actual));
        return result;
    };
    TextHelper.isCharEscaped = function (position, fullString) {
        var escapeCharsCount = 0;
        while (position > -1 && fullString[position - 1] === "\\") {
            escapeCharsCount++;
            position--;
        }
        return escapeCharsCount % 2 == 1;
    };
    TextHelper.removeEscapes = function (text) {
        return text.replace(/\\?\\?/g, function (match) {
            if (match == "\\\\") {
                return "\\";
            }
            return "";
        });
    };
    return TextHelper;
}());
exports.TextHelper = TextHelper;


/***/ }),

/***/ "./src/highlighter/MouseEventHandler.ts":
/*!**********************************************!*\
  !*** ./src/highlighter/MouseEventHandler.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_236416__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseEventHandler = void 0;
var ModifierKey_1 = __nested_webpack_require_236416__(/*! ../Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
var tsyringe_1 = __nested_webpack_require_236416__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_236416__(/*! ../Properties */ "./src/Properties.ts");
var EventEmitter_1 = __nested_webpack_require_236416__(/*! ../services/EventEmitter */ "./src/services/EventEmitter.ts");
var MouseEventHandler = /** @class */ (function () {
    function MouseEventHandler(properties) {
        this.properties = properties;
        this.keysDown = new Set();
        this.mouseOn = new Set();
        this.mouseOnChanged = new EventEmitter_1.EventEmitterImpl();
        this.keysChanged = new EventEmitter_1.EventEmitterImpl();
        this.initKeyListener();
    }
    MouseEventHandler.prototype.handle = function (element, onclick) {
        var _this = this;
        if (element._polygloat.listeningForHighlighting) {
            console.error("Element is already listening mouse events! This is probably bug in polygloat");
            return;
        }
        element._polygloat.listeningForHighlighting = true;
        this.initEventListeners(element, onclick);
        this.mouseOnChanged.subscribe(function () {
            if (_this.highlighted !== _this.getMouseOn()) {
                _this.onConditionsChanged();
            }
        });
        this.keysChanged.subscribe(function () {
            _this.onConditionsChanged();
        });
    };
    MouseEventHandler.prototype.initEventListeners = function (element, onclick) {
        var _this = this;
        var onMouseOver = function () { return _this.onMouseOver(element); };
        var onMouseOut = function () { return _this.onMouseOut(element); };
        var onClick = function (e) {
            if (_this.areKeysDown()) {
                e.stopPropagation();
                e.preventDefault();
                onclick(e);
            }
        };
        element.addEventListener("mouseover", onMouseOver);
        element.addEventListener("click", onClick);
        var onMouseDownOrUp = function (e) {
            if (_this.areKeysDown()) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        element.addEventListener("mousedown", onMouseDownOrUp);
        element.addEventListener("mouseup", onMouseDownOrUp);
        element.addEventListener("mouseout", onMouseOut);
        element._polygloat.removeAllEventListeners = function () {
            element.removeEventListener("mousedown", onMouseDownOrUp);
            element.removeEventListener("mouseup", onMouseDownOrUp);
            element.removeEventListener("mouseover", onMouseOver);
            element.removeEventListener("click", onClick);
            element.removeEventListener("mouseout", onMouseOut);
        };
    };
    MouseEventHandler.prototype.onConditionsChanged = function () {
        this.unhighlight();
        if (this.areKeysDown() && this.getMouseOn()) {
            this.highlight();
        }
    };
    MouseEventHandler.prototype.highlight = function () {
        this.highlightedInitialBackgroundColor = this.getMouseOn().style.backgroundColor;
        this.getMouseOn().style.backgroundColor = this.properties.config.highlightColor;
        this.highlighted = this.getMouseOn();
    };
    MouseEventHandler.prototype.unhighlight = function () {
        if (this.highlighted) {
            this.highlighted.style.backgroundColor = this.highlightedInitialBackgroundColor;
            this.highlighted = null;
        }
    };
    MouseEventHandler.prototype.onMouseOut = function (element) {
        this.mouseOn.delete(element);
        this.mouseOnChanged.emit(this.getMouseOn());
    };
    MouseEventHandler.prototype.onMouseOver = function (element) {
        this.mouseOn.delete(element); //to get in to last place
        this.mouseOn.add(element);
        this.mouseOnChanged.emit(this.getMouseOn());
    };
    MouseEventHandler.prototype.getMouseOn = function () {
        var mouseOnArray = Array.from(this.mouseOn);
        return mouseOnArray.length ? mouseOnArray[0] : undefined;
    };
    MouseEventHandler.prototype.initKeyListener = function () {
        var _this = this;
        window.addEventListener('blur', function () {
            _this.keysDown = new Set();
            _this.keysChanged.emit(_this.areKeysDown());
        });
        window.addEventListener('keydown', function (e) {
            var modifierKey = ModifierKey_1.ModifierKey[e.key];
            if (modifierKey !== undefined) {
                _this.keysDown.add(modifierKey);
                _this.keysChanged.emit(_this.areKeysDown());
            }
        });
        window.addEventListener('keyup', function (e) {
            _this.keysDown.delete(ModifierKey_1.ModifierKey[e.key]);
            _this.keysChanged.emit(_this.areKeysDown());
        });
    };
    MouseEventHandler.prototype.areKeysDown = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.properties.config.highlightKeys), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (!this.keysDown.has(key)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    MouseEventHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties])
    ], MouseEventHandler);
    return MouseEventHandler;
}());
exports.MouseEventHandler = MouseEventHandler;


/***/ }),

/***/ "./src/highlighter/TranslationHighlighter.ts":
/*!***************************************************!*\
  !*** ./src/highlighter/TranslationHighlighter.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_243863__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationHighlighter = void 0;
var CoreService_1 = __nested_webpack_require_243863__(/*! ../services/CoreService */ "./src/services/CoreService.ts");
var tsyringe_1 = __nested_webpack_require_243863__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_243863__(/*! ../Properties */ "./src/Properties.ts");
var EventService_1 = __nested_webpack_require_243863__(/*! ../services/EventService */ "./src/services/EventService.ts");
var TranslationService_1 = __nested_webpack_require_243863__(/*! ../services/TranslationService */ "./src/services/TranslationService.ts");
var MouseEventHandler_1 = __nested_webpack_require_243863__(/*! ./MouseEventHandler */ "./src/highlighter/MouseEventHandler.ts");
var TranslationHighlighter = /** @class */ (function () {
    function TranslationHighlighter(service, properties, eventService, translationService, mouseEventHandler) {
        var _this = this;
        this.service = service;
        this.properties = properties;
        this.eventService = eventService;
        this.translationService = translationService;
        this.mouseEventHandler = mouseEventHandler;
        this.translationEdit = function (e, element) { return __awaiter(_this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof this.renderer === "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getKey(e, element)];
                    case 1:
                        key = _a.sent();
                        if (key) {
                            this.renderer.renderViewer(key);
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                    case 2:
                        console.warn("Polygloat UI is not provided. To translate interactively provide polygloat ui constructor to \"ui\" configuration property. " +
                            "To disable highlighting use production mode.");
                        return [2 /*return*/];
                }
            });
        }); };
    }
    TranslationHighlighter_1 = TranslationHighlighter;
    TranslationHighlighter.prototype.listen = function (element) {
        var _this = this;
        this.mouseEventHandler.handle(element, function (e) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.translationEdit(e, element)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
    };
    TranslationHighlighter.prototype.getKey = function (mouseEvent, element) {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = TranslationHighlighter_1.getKeyOptions(element);
                        if (!(keys.size > 1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.renderer.getKey({ keys: keys, openEvent: mouseEvent })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (keys.size === 1) {
                            return [2 /*return*/, Array.from(keys)[0]];
                        }
                        console.error("No key to translate. This seems like a bug in polygloat.");
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationHighlighter.getKeyOptions = function (node) {
        var nodes = Array.from(node._polygloat.nodes);
        var keys = nodes.reduce(function (acc, curr) {
            return __spread(acc, curr._polygloat.keys.map(function (k) { return k.key; }));
        }, []);
        return new Set(keys);
    };
    Object.defineProperty(TranslationHighlighter.prototype, "renderer", {
        get: function () {
            if (this._renderer === undefined) {
                if (typeof this.properties.config.ui === "function") {
                    this._renderer = new this.properties.config.ui({
                        coreService: this.service,
                        properties: this.properties,
                        eventService: this.eventService,
                        translationService: this.translationService
                    });
                }
            }
            return this._renderer;
        },
        enumerable: false,
        configurable: true
    });
    var TranslationHighlighter_1;
    TranslationHighlighter = TranslationHighlighter_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [CoreService_1.CoreService,
            Properties_1.Properties,
            EventService_1.EventService,
            TranslationService_1.TranslationService,
            MouseEventHandler_1.MouseEventHandler])
    ], TranslationHighlighter);
    return TranslationHighlighter;
}());
exports.TranslationHighlighter = TranslationHighlighter;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_253227__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierKey = exports.PolygloatConfig = exports.Polygloat = void 0;
__nested_webpack_require_253227__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");
__nested_webpack_require_253227__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
var Polygloat_1 = __nested_webpack_require_253227__(/*! ./Polygloat */ "./src/Polygloat.ts");
Object.defineProperty(exports, "Polygloat", { enumerable: true, get: function () { return Polygloat_1.Polygloat; } });
var PolygloatConfig_1 = __nested_webpack_require_253227__(/*! ./PolygloatConfig */ "./src/PolygloatConfig.ts");
Object.defineProperty(exports, "PolygloatConfig", { enumerable: true, get: function () { return PolygloatConfig_1.PolygloatConfig; } });
var ModifierKey_1 = __nested_webpack_require_253227__(/*! ./Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
Object.defineProperty(exports, "ModifierKey", { enumerable: true, get: function () { return ModifierKey_1.ModifierKey; } });


/***/ }),

/***/ "./src/services/ApiHttpService.ts":
/*!****************************************!*\
  !*** ./src/services/ApiHttpService.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_254522__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHttpService = void 0;
var tsyringe_1 = __nested_webpack_require_254522__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_254522__(/*! ../Properties */ "./src/Properties.ts");
var ApiHttpError_1 = __nested_webpack_require_254522__(/*! ../Errors/ApiHttpError */ "./src/Errors/ApiHttpError.ts");
var ApiHttpService = /** @class */ (function () {
    function ApiHttpService(properties) {
        this.properties = properties;
    }
    ApiHttpService_1 = ApiHttpService;
    ApiHttpService.prototype.fetch = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, url, rest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof args[0] === "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, fetch(__assign(__assign({}, args[0]), { url: this.getUrl(args[0].url) })).then(function (r) { return ApiHttpService_1.handleErrors(r); })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        _a = __read(args), url = _a[0], rest = _a.slice(1);
                        return [4 /*yield*/, fetch.apply(void 0, __spread([this.getUrl(url)], rest)).then(function (r) { return ApiHttpService_1.handleErrors(r); })];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.fetchJson = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch.apply(this, __spread(args)).then(function (res) {
                            return res.json();
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.post = function (url, body, init) {
        if (init === void 0) { init = {}; }
        var rest = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            rest[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch.apply(this, __spread([url, __assign({ body: JSON.stringify(body), method: 'POST', headers: {
                                    'Content-Type': 'application/json'
                                } }, init)], rest))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.postJson = function (url, body, init) {
        if (init === void 0) { init = {}; }
        var rest = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            rest[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post.apply(this, __spread([url, body, init], rest)).then(function (res) { return res.json(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.handleErrors = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var error, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(response.status >= 400)) return [3 /*break*/, 5];
                        error = new ApiHttpError_1.ApiHttpError(response);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        error.code = data.code;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.warn("Polygloat server responded with invalid status code.");
                        return [3 /*break*/, 4];
                    case 4: throw error;
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    ApiHttpService.prototype.getUrl = function (path) {
        return this.properties.config.apiUrl + "/uaa/" + path + "?ak=" + this.properties.config.apiKey;
    };
    var ApiHttpService_1;
    ApiHttpService = ApiHttpService_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties])
    ], ApiHttpService);
    return ApiHttpService;
}());
exports.ApiHttpService = ApiHttpService;


/***/ }),

/***/ "./src/services/CoreService.ts":
/*!*************************************!*\
  !*** ./src/services/CoreService.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_264421__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreService = void 0;
var Properties_1 = __nested_webpack_require_264421__(/*! ../Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_264421__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var ApiHttpService_1 = __nested_webpack_require_264421__(/*! ./ApiHttpService */ "./src/services/ApiHttpService.ts");
var CoreService = /** @class */ (function () {
    function CoreService(properties, apiHttpService) {
        this.properties = properties;
        this.apiHttpService = apiHttpService;
    }
    CoreService.prototype.getLanguages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var languages, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.languagePromise instanceof Promise)) {
                            this.languagePromise = this.apiHttpService.fetchJson("languages");
                        }
                        _a = Set.bind;
                        return [4 /*yield*/, this.languagePromise];
                    case 1:
                        languages = new (_a.apply(Set, [void 0, _b.sent()]))();
                        this.properties.preferredLanguages = new Set(Array.from(this.properties.preferredLanguages).filter(function (l) { return languages.has(l); }));
                        return [2 /*return*/, languages];
                }
            });
        });
    };
    CoreService.prototype.getScopes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apiHttpService.fetchJson("scopes")];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        console.error("Error getting scopes. Trying to switch to production mode!");
                        this.properties.config.mode = "production";
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CoreService.prototype.isAuthorizedTo = function (scope) {
        return this.properties.scopes.indexOf(scope) > -1;
    };
    CoreService.prototype.checkScope = function (scope) {
        if (!this.isAuthorizedTo(scope)) {
            throw new Error("Api key not permitted to do this, please add 'translations.view' scope.");
        }
    };
    CoreService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, ApiHttpService_1.ApiHttpService])
    ], CoreService);
    return CoreService;
}());
exports.CoreService = CoreService;


/***/ }),

/***/ "./src/services/ElementRegistrar.ts":
/*!******************************************!*\
  !*** ./src/services/ElementRegistrar.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_270989__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementRegistrar = void 0;
var tsyringe_1 = __nested_webpack_require_270989__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_270989__(/*! ../Properties */ "./src/Properties.ts");
var Global_1 = __nested_webpack_require_270989__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var TranslationHighlighter_1 = __nested_webpack_require_270989__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var NodeHelper_1 = __nested_webpack_require_270989__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var ElementRegistrar = /** @class */ (function () {
    function ElementRegistrar(properties, translationHighlighter) {
        this.properties = properties;
        this.translationHighlighter = translationHighlighter;
        this.registeredElements = new Set();
    }
    ElementRegistrar.prototype.register = function (element) {
        if (this.getActiveNodes(element).next().value === undefined) {
            throw new Error("Registered element with no nodes. This is probably an bug in Polygloat.");
        }
        if (this.properties.config.mode === "development" && !this.registeredElements.has(element)) {
            this.translationHighlighter.listen(element);
        }
        this.registeredElements.add(element);
    };
    ElementRegistrar.prototype.refreshAll = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.registeredElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var element = _c.value;
                this.cleanElementInactiveNodes(element);
                if (element._polygloat.nodes.size === 0) {
                    this.cleanElement(element);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ElementRegistrar.prototype.cleanAll = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.registeredElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var registeredElement = _c.value;
                this.cleanElement(registeredElement);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    ElementRegistrar.prototype.cleanElementInactiveNodes = function (element) {
        if (this.isElementActive(element)) {
            element._polygloat.nodes = new Set(this.getActiveNodes(element));
            return;
        }
    };
    ElementRegistrar.prototype.cleanElement = function (element) {
        if (typeof element._polygloat.removeAllEventListeners === "function") {
            element._polygloat.removeAllEventListeners();
        }
        element.removeAttribute(Global_1.POLYGLOAT_ATTRIBUTE_NAME);
        delete element._polygloat;
        this.registeredElements.delete(element);
    };
    ElementRegistrar.prototype.getActiveNodes = function (element) {
        var _a, _b, node, e_3_1;
        var e_3, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(element._polygloat.nodes), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    node = _b.value;
                    if (!NodeHelper_1.NodeHelper.nodeContains(this.properties.config.targetElement, node)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_3_1 = _d.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    ElementRegistrar.prototype.isElementActive = function (element) {
        return this.properties.config.targetElement.contains(element);
    };
    ElementRegistrar = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, TranslationHighlighter_1.TranslationHighlighter])
    ], ElementRegistrar);
    return ElementRegistrar;
}());
exports.ElementRegistrar = ElementRegistrar;


/***/ }),

/***/ "./src/services/EventEmitter.ts":
/*!**************************************!*\
  !*** ./src/services/EventEmitter.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_279378__) {

"use strict";

var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitterImpl = void 0;
var Subscription_1 = __nested_webpack_require_279378__(/*! ./Subscription */ "./src/services/Subscription.ts");
var EventEmitterImpl = /** @class */ (function () {
    function EventEmitterImpl() {
        this.idCounter = 0;
        this._subscriptions = new Map();
    }
    Object.defineProperty(EventEmitterImpl.prototype, "subscriptions", {
        get: function () {
            return this._subscriptions;
        },
        enumerable: false,
        configurable: true
    });
    EventEmitterImpl.prototype.emit = function (data) {
        var e_1, _a;
        var promiseReturns = [];
        try {
            for (var _b = __values(this.subscriptions.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var callback = _c.value;
                var returned = callback(data);
                if (typeof (returned === null || returned === void 0 ? void 0 : returned["then"]) === "function") {
                    promiseReturns.push(returned);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (promiseReturns.length === 0) {
            return;
        }
        return new Promise(function (resolve) { return Promise.all(promiseReturns).then(function () { return resolve(); }); });
    };
    EventEmitterImpl.prototype.subscribe = function (callback) {
        var _this = this;
        var newId = this.idCounter++;
        var subscription = new Subscription_1.Subscription(function () { return _this.unsubscribe(newId); });
        this.subscriptions.set(newId, callback);
        return subscription;
    };
    EventEmitterImpl.prototype.unsubscribe = function (id) {
        var wasPresent = this._subscriptions.delete(id);
        if (!wasPresent) {
            console.warn("Event to unsubscribe was not found");
        }
    };
    return EventEmitterImpl;
}());
exports.EventEmitterImpl = EventEmitterImpl;


/***/ }),

/***/ "./src/services/EventService.ts":
/*!**************************************!*\
  !*** ./src/services/EventService.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_282293__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
var tsyringe_1 = __nested_webpack_require_282293__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventEmitter_1 = __nested_webpack_require_282293__(/*! ./EventEmitter */ "./src/services/EventEmitter.ts");
var EventService = /** @class */ (function () {
    function EventService() {
        this.TRANSLATION_CHANGED = new EventEmitter_1.EventEmitterImpl();
        this.LANGUAGE_CHANGED = new EventEmitter_1.EventEmitterImpl();
        this.LANGUAGE_LOADED = new EventEmitter_1.EventEmitterImpl();
    }
    EventService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped)
    ], EventService);
    return EventService;
}());
exports.EventService = EventService;


/***/ }),

/***/ "./src/services/Subscription.ts":
/*!**************************************!*\
  !*** ./src/services/Subscription.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
var Subscription = /** @class */ (function () {
    function Subscription(onUnsubscribe) {
        this.onUnsubscribe = onUnsubscribe;
    }
    Subscription.prototype.unsubscribe = function () {
        this.onUnsubscribe();
    };
    return Subscription;
}());
exports.Subscription = Subscription;


/***/ }),

/***/ "./src/services/TextService.ts":
/*!*************************************!*\
  !*** ./src/services/TextService.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_284607__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextService = void 0;
var tsyringe_1 = __nested_webpack_require_284607__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationService_1 = __nested_webpack_require_284607__(/*! ./TranslationService */ "./src/services/TranslationService.ts");
var Properties_1 = __nested_webpack_require_284607__(/*! ../Properties */ "./src/Properties.ts");
var TextHelper_1 = __nested_webpack_require_284607__(/*! ../helpers/TextHelper */ "./src/helpers/TextHelper.ts");
var TextService = /** @class */ (function () {
    function TextService(properties, translationService) {
        var _this = this;
        this.properties = properties;
        this.translationService = translationService;
        this.replaceParams = function (translation, params) {
            var result = translation;
            var regExp = function (name) { return new RegExp("\\{\\{\\s*" + _this.escapeForRegExp(name) + "\\s*\\}\\}", "g"); };
            Object.entries(params).forEach(function (_a) {
                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                return result = result.replace(regExp(name), value);
            });
            return result;
        };
        this.escapeForRegExp = function (string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        this.escapeParam = function (string) { return string.replace(/[,:\\]/gs, "\\$&"); };
    }
    TextService_1 = TextService;
    TextService.prototype.translate = function (key, params, lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.replaceParams;
                        return [4 /*yield*/, this.translationService.getTranslation(key, lang)];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent(), params])];
                }
            });
        });
    };
    TextService.prototype.instant = function (key, params, lang, orEmpty) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return this.replaceParams(this.translationService.getFromCacheOrFallback(key, lang, orEmpty), params);
    };
    TextService.prototype.replace = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var matchRegexp, keysAndParams, matched, translated, withoutEscapes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matchRegexp = new RegExp(this.rawUnWrapRegex, "gs");
                        return [4 /*yield*/, this.translationService.loadTranslations()];
                    case 1:
                        _a.sent();
                        keysAndParams = [];
                        matched = false;
                        translated = text.replace(matchRegexp, function (_, pre, wrapped, unwrapped, position) {
                            if (pre === "\\") {
                                if (!TextHelper_1.TextHelper.isCharEscaped(position, text)) {
                                    return pre + wrapped;
                                }
                            }
                            var translated = _this.getTranslatedWithMetadata(unwrapped);
                            keysAndParams.push({ key: translated.key, params: translated.params });
                            matched = true;
                            return pre + translated.translated;
                        });
                        withoutEscapes = TextHelper_1.TextHelper.removeEscapes(translated);
                        if (matched) {
                            return [2 /*return*/, { text: withoutEscapes, keys: keysAndParams }];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    TextService.prototype.wrap = function (key, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var paramString = Object.entries(params).map(function (_a) {
            var _b = __read(_a, 2), name = _b[0], value = _b[1];
            return _this.escapeParam(name) + ":" + _this.escapeParam(value);
        }).join(",");
        paramString = paramString.length ? ":" + paramString : "";
        return "" + this.properties.config.inputPrefix + this.escapeParam(key) + paramString + this.properties.config.inputSuffix;
    };
    TextService.prototype.getTranslatedWithMetadata = function (text) {
        var _a = TextService_1.parseUnwrapped(text), key = _a.key, params = _a.params;
        var translated = this.instant(key, params, undefined, false);
        return { translated: translated, key: key, params: params };
    };
    TextService.parseUnwrapped = function (unWrappedString) {
        var strings = unWrappedString.match(/(?:[^\\,:\n]|\\.)+/g);
        var result = { key: TextHelper_1.TextHelper.removeEscapes(strings.shift()), params: {} };
        while (strings.length) {
            var _a = __read(strings.splice(0, 2), 2), name_1 = _a[0], value = _a[1];
            result.params[name_1] = value;
        }
        return result;
    };
    Object.defineProperty(TextService.prototype, "rawUnWrapRegex", {
        get: function () {
            var escapedPrefix = this.escapeForRegExp(this.properties.config.inputPrefix);
            var escapedSuffix = this.escapeForRegExp(this.properties.config.inputSuffix);
            return "(\\\\?)(" + escapedPrefix + "(.*?)" + escapedSuffix + ")";
        },
        enumerable: false,
        configurable: true
    });
    var TextService_1;
    TextService = TextService_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, TranslationService_1.TranslationService])
    ], TextService);
    return TextService;
}());
exports.TextService = TextService;


/***/ }),

/***/ "./src/services/TranslationService.ts":
/*!********************************************!*\
  !*** ./src/services/TranslationService.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_294767__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
var tsyringe_1 = __nested_webpack_require_294767__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationData_1 = __nested_webpack_require_294767__(/*! ../DTOs/TranslationData */ "./src/DTOs/TranslationData.ts");
var Properties_1 = __nested_webpack_require_294767__(/*! ../Properties */ "./src/Properties.ts");
var CoreService_1 = __nested_webpack_require_294767__(/*! ./CoreService */ "./src/services/CoreService.ts");
var ApiHttpService_1 = __nested_webpack_require_294767__(/*! ./ApiHttpService */ "./src/services/ApiHttpService.ts");
var TextHelper_1 = __nested_webpack_require_294767__(/*! ../helpers/TextHelper */ "./src/helpers/TextHelper.ts");
var ApiHttpError_1 = __nested_webpack_require_294767__(/*! ../Errors/ApiHttpError */ "./src/Errors/ApiHttpError.ts");
var EventService_1 = __nested_webpack_require_294767__(/*! ./EventService */ "./src/services/EventService.ts");
var TranslationService = /** @class */ (function () {
    function TranslationService(properties, coreService, apiHttpService, eventService) {
        var _this = this;
        this.properties = properties;
        this.coreService = coreService;
        this.apiHttpService = apiHttpService;
        this.eventService = eventService;
        this.translationsCache = new Map();
        this.fetchPromises = [];
        this.getTranslationsOfKey = function (key, languages) {
            if (languages === void 0) { languages = new Set([_this.properties.currentLanguage]); }
            return __awaiter(_this, void 0, void 0, function () {
                var data, e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.coreService.checkScope("translations.view");
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 6]);
                            return [4 /*yield*/, this.apiHttpService.postJson("keyTranslations/" + Array.from(languages).join(","), { key: key })];
                        case 2:
                            data = _b.sent();
                            return [2 /*return*/, new TranslationData_1.TranslationData(key, data)];
                        case 3:
                            e_1 = _b.sent();
                            if (!(e_1 instanceof ApiHttpError_1.ApiHttpError)) return [3 /*break*/, 5];
                            if (!(e_1.response.status === 404)) return [3 /*break*/, 5];
                            if (!(e_1.code === "language_not_found")) return [3 /*break*/, 5];
                            _a = this.properties;
                            return [4 /*yield*/, this.coreService.getLanguages()];
                        case 4:
                            _a.preferredLanguages = _b.sent();
                            console.error("Requested language not found, refreshing the page!");
                            location.reload();
                            return [2 /*return*/];
                        case 5: throw e_1;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
    }
    TranslationService.prototype.loadTranslations = function (lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.translationsCache.get(lang) == undefined)) return [3 /*break*/, 2];
                        if (!(this.fetchPromises[lang] instanceof Promise)) {
                            this.fetchPromises[lang] = this.fetchTranslations(lang);
                        }
                        return [4 /*yield*/, this.fetchPromises[lang]];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.fetchPromises[lang] = undefined;
                        this.eventService.LANGUAGE_LOADED.emit(lang);
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getTranslation = function (name, lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.getFromCache(name, lang)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadTranslations(lang)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.getFromCacheOrFallback(name, lang)];
                }
            });
        });
    };
    TranslationService.prototype.setTranslations = function (translationData) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.coreService.checkScope("translations.edit");
                        return [4 /*yield*/, this.apiHttpService.post('', translationData)];
                    case 1:
                        _a.sent();
                        Object.keys(translationData.translations).forEach(function (lang) {
                            if (_this.translationsCache.get(lang)) { // if the language is not loaded, then ignore the change
                                var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(translationData.key, ".");
                                var root = _this.translationsCache.get(lang);
                                for (var i = 0; i < path.length; i++) {
                                    var item = path[i];
                                    if (root[item] === undefined) {
                                        root[item] = {};
                                    }
                                    if (i === (path.length - 1)) {
                                        root[item] = translationData.translations[lang];
                                        return;
                                    }
                                    root = root[item];
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getFromCacheOrFallback = function (name, lang, orEmpty) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        if (orEmpty === void 0) { orEmpty = false; }
        var translatedText = this.getFromCache(name, lang) || this.getFromCache(name, this.properties.config.fallbackLanguage);
        if (translatedText) {
            return translatedText;
        }
        if (orEmpty) {
            return "";
        }
        var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(name, ".");
        return path[path.length - 1];
    };
    TranslationService.prototype.fetchTranslations = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.properties.config.mode === "development")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchTranslationsDevelopment(lang)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.fetchTranslationsProduction(lang)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TranslationService.prototype.fetchTranslationsProduction = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            var result, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("" + (this.properties.config.filesUrlPrefix || "/") + lang + ".json")];
                    case 1:
                        result = _a.sent();
                        if (result.status >= 400) {
                            //on error set language data as empty object to not break the flow
                            this.translationsCache.set(lang, {});
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, result.json()];
                    case 2:
                        data = (_a.sent());
                        this.translationsCache.set(lang, data);
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.fetchTranslationsDevelopment = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.coreService.checkScope("translations.view");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apiHttpService.fetchJson("" + lang)];
                    case 2:
                        data = _a.sent();
                        this.translationsCache.set(lang, data[lang] || {});
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        this.translationsCache.set(lang, {});
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getFromCache = function (name, lang) {
        var e_3, _a;
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(name, ".");
        var root = this.translationsCache.get(lang);
        //if lang is not downloaded or does not exist at all
        if (root === undefined) {
            return undefined;
        }
        try {
            for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
                var item = path_1_1.value;
                if (root[item] === undefined) {
                    return undefined;
                }
                root = root[item];
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return root;
    };
    TranslationService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            CoreService_1.CoreService,
            ApiHttpService_1.ApiHttpService,
            EventService_1.EventService])
    ], TranslationService);
    return TranslationService;
}());
exports.TranslationService = TranslationService;


/***/ })

/******/ });
});
//# sourceMappingURL=polygloat.umd.js.map

/***/ }),

/***/ "../../packages/core/dist/polygloat.window.js":
/*!****************************************************!*\
  !*** ../../packages/core/dist/polygloat.window.js ***!
  \****************************************************/
/***/ (() => {

window["@polygloat/core"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_198__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_198__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_198__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_198__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__nested_webpack_require_198__.d = function(exports, name, getter) {
/******/ 		if(!__nested_webpack_require_198__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__nested_webpack_require_198__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__nested_webpack_require_198__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __nested_webpack_require_198__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__nested_webpack_require_198__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __nested_webpack_require_198__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nested_webpack_require_198__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__nested_webpack_require_198__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__nested_webpack_require_198__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_198__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_198__(__nested_webpack_require_198__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/reflect-metadata/Reflect.js":
/*!**************************************************!*\
  !*** ./node_modules/reflect-metadata/Reflect.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_9601__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof global === "object" ? global :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect || (Reflect = {}));

/* WEBPACK VAR INJECTION */}.call(this, __nested_webpack_require_9601__(/*! ./../process/browser.js */ "./node_modules/process/browser.js"), __nested_webpack_require_9601__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
    true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_86565__) {

"use strict";
__nested_webpack_require_86565__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __nested_webpack_require_86565__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js":
/*!***********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_98851__) {

"use strict";
__nested_webpack_require_98851__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_98851__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_98851__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_98851__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");
/* harmony import */ var _providers_injection_token__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_98851__(/*! ../providers/injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony import */ var _error_helpers__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_98851__(/*! ../error-helpers */ "./node_modules/tsyringe/dist/esm5/error-helpers.js");





function autoInjectable() {
    return function (target) {
        var paramInfo = Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_1__["getParamInfo"])(target);
        return (function (_super) {
            Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _super.apply(this, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(args.concat(paramInfo.slice(args.length).map(function (type, index) {
                    var _a, _b, _c;
                    try {
                        if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTokenDescriptor"])(type)) {
                            if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(type)) {
                                return type.multiple
                                    ? (_a = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                        .resolve(type.transform)).transform.apply(_a, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolveAll(type.token)], type.transformArgs)) : (_b = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                    .resolve(type.transform)).transform.apply(_b, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token)], type.transformArgs));
                            }
                            else {
                                return type.multiple
                                    ? _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolveAll(type.token)
                                    : _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token);
                            }
                        }
                        else if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(type)) {
                            return (_c = _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"]
                                .resolve(type.transform)).transform.apply(_c, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type.token)], type.transformArgs));
                        }
                        return _dependency_container__WEBPACK_IMPORTED_MODULE_2__["instance"].resolve(type);
                    }
                    catch (e) {
                        var argIndex = index + args.length;
                        throw new Error(Object(_error_helpers__WEBPACK_IMPORTED_MODULE_4__["formatErrorCtor"])(target, argIndex, e));
                    }
                })))) || this;
            }
            return class_1;
        }(target));
    };
}
/* harmony default export */ __webpack_exports__["default"] = (autoInjectable);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/index.js ***!
  \*************************************************************/
/*! exports provided: autoInjectable, inject, injectable, registry, singleton, injectAll, injectAllWithTransform, injectWithTransform, scoped */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_103459__) {

"use strict";
__nested_webpack_require_103459__.r(__webpack_exports__);
/* harmony import */ var _auto_injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_103459__(/*! ./auto-injectable */ "./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "autoInjectable", function() { return _auto_injectable__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_103459__(/*! ./inject */ "./node_modules/tsyringe/dist/esm5/decorators/inject.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "inject", function() { return _inject__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_103459__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "injectable", function() { return _injectable__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_103459__(/*! ./registry */ "./node_modules/tsyringe/dist/esm5/decorators/registry.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "registry", function() { return _registry__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _singleton__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_103459__(/*! ./singleton */ "./node_modules/tsyringe/dist/esm5/decorators/singleton.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "singleton", function() { return _singleton__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _inject_all__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_103459__(/*! ./inject-all */ "./node_modules/tsyringe/dist/esm5/decorators/inject-all.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "injectAll", function() { return _inject_all__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _inject_all_with_transform__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_103459__(/*! ./inject-all-with-transform */ "./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "injectAllWithTransform", function() { return _inject_all_with_transform__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _inject_with_transform__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_103459__(/*! ./inject-with-transform */ "./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "injectWithTransform", function() { return _inject_with_transform__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _scoped__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_103459__(/*! ./scoped */ "./node_modules/tsyringe/dist/esm5/decorators/scoped.js");
/* harmony reexport (safe) */ __nested_webpack_require_103459__.d(__webpack_exports__, "scoped", function() { return _scoped__WEBPACK_IMPORTED_MODULE_8__["default"]; });












/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_107101__) {

"use strict";
__nested_webpack_require_107101__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_107101__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectAllWithTransform(token, transformer) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var data = {
        token: token,
        multiple: true,
        transform: transformer,
        transformArgs: args
    };
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(data);
}
/* harmony default export */ __webpack_exports__["default"] = (injectAllWithTransform);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-all.js":
/*!******************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-all.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_108239__) {

"use strict";
__nested_webpack_require_108239__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_108239__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectAll(token) {
    var data = { token: token, multiple: true };
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(data);
}
/* harmony default export */ __webpack_exports__["default"] = (injectAll);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_109186__) {

"use strict";
__nested_webpack_require_109186__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_109186__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function injectWithTransform(token, transformer) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(token, {
        transformToken: transformer,
        args: args
    });
}
/* harmony default export */ __webpack_exports__["default"] = (injectWithTransform);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/inject.js":
/*!**************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/inject.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_110238__) {

"use strict";
__nested_webpack_require_110238__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_110238__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");

function inject(token) {
    return Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["defineInjectionTokenMetadata"])(token);
}
/* harmony default export */ __webpack_exports__["default"] = (inject);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js":
/*!******************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/injectable.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_111087__) {

"use strict";
__nested_webpack_require_111087__.r(__webpack_exports__);
/* harmony import */ var _reflection_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_111087__(/*! ../reflection-helpers */ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_111087__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function injectable() {
    return function (target) {
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["typeInfo"].set(target, Object(_reflection_helpers__WEBPACK_IMPORTED_MODULE_0__["getParamInfo"])(target));
    };
}
/* harmony default export */ __webpack_exports__["default"] = (injectable);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/registry.js":
/*!****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/registry.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_112219__) {

"use strict";
__nested_webpack_require_112219__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_112219__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_112219__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function registry(registrations) {
    if (registrations === void 0) { registrations = []; }
    return function (target) {
        registrations.forEach(function (_a) {
            var token = _a.token, options = _a.options, provider = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__rest"])(_a, ["token", "options"]);
            return _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].register(token, provider, options);
        });
        return target;
    };
}
/* harmony default export */ __webpack_exports__["default"] = (registry);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/scoped.js":
/*!**************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/scoped.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_113538__) {

"use strict";
__nested_webpack_require_113538__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_113538__.d(__webpack_exports__, "default", function() { return scoped; });
/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_113538__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_113538__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function scoped(lifecycle, token) {
    return function (target) {
        Object(_injectable__WEBPACK_IMPORTED_MODULE_0__["default"])()(target);
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].register(token || target, target, {
            lifecycle: lifecycle
        });
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/decorators/singleton.js":
/*!*****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/decorators/singleton.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_114778__) {

"use strict";
__nested_webpack_require_114778__.r(__webpack_exports__);
/* harmony import */ var _injectable__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_114778__(/*! ./injectable */ "./node_modules/tsyringe/dist/esm5/decorators/injectable.js");
/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_114778__(/*! ../dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");


function singleton() {
    return function (target) {
        Object(_injectable__WEBPACK_IMPORTED_MODULE_0__["default"])()(target);
        _dependency_container__WEBPACK_IMPORTED_MODULE_1__["instance"].registerSingleton(target);
    };
}
/* harmony default export */ __webpack_exports__["default"] = (singleton);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/dependency-container.js":
/*!*****************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/dependency-container.js ***!
  \*****************************************************************/
/*! exports provided: typeInfo, instance, default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_115929__) {

"use strict";
__nested_webpack_require_115929__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_115929__.d(__webpack_exports__, "typeInfo", function() { return typeInfo; });
/* harmony export (binding) */ __nested_webpack_require_115929__.d(__webpack_exports__, "instance", function() { return instance; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_115929__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_115929__(/*! ./providers */ "./node_modules/tsyringe/dist/esm5/providers/index.js");
/* harmony import */ var _providers_provider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_115929__(/*! ./providers/provider */ "./node_modules/tsyringe/dist/esm5/providers/provider.js");
/* harmony import */ var _providers_injection_token__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_115929__(/*! ./providers/injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_115929__(/*! ./registry */ "./node_modules/tsyringe/dist/esm5/registry.js");
/* harmony import */ var _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_115929__(/*! ./types/lifecycle */ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js");
/* harmony import */ var _resolution_context__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_115929__(/*! ./resolution-context */ "./node_modules/tsyringe/dist/esm5/resolution-context.js");
/* harmony import */ var _error_helpers__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_115929__(/*! ./error-helpers */ "./node_modules/tsyringe/dist/esm5/error-helpers.js");
/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_115929__(/*! ./lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");
/* harmony import */ var _interceptors__WEBPACK_IMPORTED_MODULE_9__ = __nested_webpack_require_115929__(/*! ./interceptors */ "./node_modules/tsyringe/dist/esm5/interceptors.js");










var typeInfo = new Map();
var InternalDependencyContainer = (function () {
    function InternalDependencyContainer(parent) {
        this.parent = parent;
        this._registry = new _registry__WEBPACK_IMPORTED_MODULE_4__["default"]();
        this.interceptors = new _interceptors__WEBPACK_IMPORTED_MODULE_9__["default"]();
    }
    InternalDependencyContainer.prototype.register = function (token, providerOrConstructor, options) {
        if (options === void 0) { options = { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Transient }; }
        var provider;
        if (!Object(_providers_provider__WEBPACK_IMPORTED_MODULE_2__["isProvider"])(providerOrConstructor)) {
            provider = { useClass: providerOrConstructor };
        }
        else {
            provider = providerOrConstructor;
        }
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(provider)) {
            var path = [token];
            var tokenProvider = provider;
            while (tokenProvider != null) {
                var currentToken = tokenProvider.useToken;
                if (path.includes(currentToken)) {
                    throw new Error("Token registration cycle detected! " + Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(path, [currentToken]).join(" -> "));
                }
                path.push(currentToken);
                var registration = this._registry.get(currentToken);
                if (registration && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(registration.provider)) {
                    tokenProvider = registration.provider;
                }
                else {
                    tokenProvider = null;
                }
            }
        }
        if (options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton ||
            options.lifecycle == _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped ||
            options.lifecycle == _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped) {
            if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(provider) || Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"])(provider)) {
                throw new Error("Cannot use lifecycle \"" + _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"][options.lifecycle] + "\" with ValueProviders or FactoryProviders");
            }
        }
        this._registry.set(token, { provider: provider, options: options });
        return this;
    };
    InternalDependencyContainer.prototype.registerType = function (from, to) {
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
            return this.register(from, {
                useToken: to
            });
        }
        return this.register(from, {
            useClass: to
        });
    };
    InternalDependencyContainer.prototype.registerInstance = function (token, instance) {
        return this.register(token, {
            useValue: instance
        });
    };
    InternalDependencyContainer.prototype.registerSingleton = function (from, to) {
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(from)) {
            if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
                return this.register(from, {
                    useToken: to
                }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
            }
            else if (to) {
                return this.register(from, {
                    useClass: to
                }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
            }
            throw new Error('Cannot register a type name as a singleton without a "to" token');
        }
        var useClass = from;
        if (to && !Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(to)) {
            useClass = to;
        }
        return this.register(from, {
            useClass: useClass
        }, { lifecycle: _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton });
    };
    InternalDependencyContainer.prototype.resolve = function (token, context) {
        if (context === void 0) { context = new _resolution_context__WEBPACK_IMPORTED_MODULE_6__["default"](); }
        var registration = this.getRegistration(token);
        if (!registration && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "Single");
        if (registration) {
            var result = this.resolveRegistration(registration, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isConstructorToken"])(token)) {
            var result = this.construct(token, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
    };
    InternalDependencyContainer.prototype.executePreResolutionInterceptor = function (token, resolutionType) {
        var e_1, _a;
        if (this.interceptors.preResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.interceptors.preResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, resolutionType);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.interceptors.preResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.executePostResolutionInterceptor = function (token, result, resolutionType) {
        var e_2, _a;
        if (this.interceptors.postResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this.interceptors.postResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, result, resolutionType);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.interceptors.postResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.resolveRegistration = function (registration, context) {
        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped &&
            context.scopedResolutions.has(registration)) {
            return context.scopedResolutions.get(registration);
        }
        var isSingleton = registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].Singleton;
        var isContainerScoped = registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped;
        var returnInstance = isSingleton || isContainerScoped;
        var resolved;
        if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(registration.provider)) {
            resolved = registration.provider.useValue;
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isTokenProvider"])(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.resolve(registration.provider.useToken, context))
                : this.resolve(registration.provider.useToken, context);
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isClassProvider"])(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.construct(registration.provider.useClass, context))
                : this.construct(registration.provider.useClass, context);
        }
        else if (Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"])(registration.provider)) {
            resolved = registration.provider.useFactory(this);
        }
        else {
            resolved = this.construct(registration.provider, context);
        }
        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ResolutionScoped) {
            context.scopedResolutions.set(registration, resolved);
        }
        return resolved;
    };
    InternalDependencyContainer.prototype.resolveAll = function (token, context) {
        var _this = this;
        if (context === void 0) { context = new _resolution_context__WEBPACK_IMPORTED_MODULE_6__["default"](); }
        var registrations = this.getAllRegistrations(token);
        if (!registrations && Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isNormalToken"])(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "All");
        if (registrations) {
            var result_1 = registrations.map(function (item) {
                return _this.resolveRegistration(item, context);
            });
            this.executePostResolutionInterceptor(token, result_1, "All");
            return result_1;
        }
        var result = [this.construct(token, context)];
        this.executePostResolutionInterceptor(token, result, "All");
        return result;
    };
    InternalDependencyContainer.prototype.isRegistered = function (token, recursive) {
        if (recursive === void 0) { recursive = false; }
        return (this._registry.has(token) ||
            (recursive &&
                (this.parent || false) &&
                this.parent.isRegistered(token, true)));
    };
    InternalDependencyContainer.prototype.reset = function () {
        this._registry.clear();
        this.interceptors.preResolution.clear();
        this.interceptors.postResolution.clear();
    };
    InternalDependencyContainer.prototype.clearInstances = function () {
        var e_3, _a;
        try {
            for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_c.value, 2), token = _d[0], registrations = _d[1];
                this._registry.setAll(token, registrations
                    .filter(function (registration) { return !Object(_providers__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(registration.provider); })
                    .map(function (registration) {
                    registration.instance = undefined;
                    return registration;
                }));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    InternalDependencyContainer.prototype.createChildContainer = function () {
        var e_4, _a;
        var childContainer = new InternalDependencyContainer(this);
        try {
            for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_c.value, 2), token = _d[0], registrations = _d[1];
                if (registrations.some(function (_a) {
                    var options = _a.options;
                    return options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped;
                })) {
                    childContainer._registry.setAll(token, registrations.map(function (registration) {
                        if (registration.options.lifecycle === _types_lifecycle__WEBPACK_IMPORTED_MODULE_5__["default"].ContainerScoped) {
                            return {
                                provider: registration.provider,
                                options: registration.options
                            };
                        }
                        return registration;
                    }));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return childContainer;
    };
    InternalDependencyContainer.prototype.beforeResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.preResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.afterResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.postResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.getRegistration = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.get(token);
        }
        if (this.parent) {
            return this.parent.getRegistration(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.getAllRegistrations = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.getAll(token);
        }
        if (this.parent) {
            return this.parent.getAllRegistrations(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.construct = function (ctor, context) {
        var _this = this;
        if (ctor instanceof _lazy_helpers__WEBPACK_IMPORTED_MODULE_8__["DelayedConstructor"]) {
            return ctor.createProxy(function (target) {
                return _this.resolve(target, context);
            });
        }
        var paramInfo = typeInfo.get(ctor);
        if (!paramInfo || paramInfo.length === 0) {
            if (ctor.length === 0) {
                return new ctor();
            }
            else {
                throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
            }
        }
        var params = paramInfo.map(this.resolveParams(context, ctor));
        return new (ctor.bind.apply(ctor, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([void 0], params)))();
    };
    InternalDependencyContainer.prototype.resolveParams = function (context, ctor) {
        var _this = this;
        return function (param, idx) {
            var _a, _b, _c;
            try {
                if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTokenDescriptor"])(param)) {
                    if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(param)) {
                        return param.multiple
                            ? (_a = _this.resolve(param.transform)).transform.apply(_a, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolveAll(param.token)], param.transformArgs)) : (_b = _this.resolve(param.transform)).transform.apply(_b, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolve(param.token, context)], param.transformArgs));
                    }
                    else {
                        return param.multiple
                            ? _this.resolveAll(param.token)
                            : _this.resolve(param.token, context);
                    }
                }
                else if (Object(_providers_injection_token__WEBPACK_IMPORTED_MODULE_3__["isTransformDescriptor"])(param)) {
                    return (_c = _this.resolve(param.transform, context)).transform.apply(_c, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_this.resolve(param.token, context)], param.transformArgs));
                }
                return _this.resolve(param, context);
            }
            catch (e) {
                throw new Error(Object(_error_helpers__WEBPACK_IMPORTED_MODULE_7__["formatErrorCtor"])(ctor, idx, e));
            }
        };
    };
    return InternalDependencyContainer;
}());
var instance = new InternalDependencyContainer();
/* harmony default export */ __webpack_exports__["default"] = (instance);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/error-helpers.js":
/*!**********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/error-helpers.js ***!
  \**********************************************************/
/*! exports provided: formatErrorCtor */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_136094__) {

"use strict";
__nested_webpack_require_136094__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_136094__.d(__webpack_exports__, "formatErrorCtor", function() { return formatErrorCtor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_136094__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

function formatDependency(params, idx) {
    if (params === null) {
        return "at position #" + idx;
    }
    var argName = params.split(",")[idx].trim();
    return "\"" + argName + "\" at position #" + idx;
}
function composeErrorMessage(msg, e, indent) {
    if (indent === void 0) { indent = "    "; }
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([msg], e.message.split("\n").map(function (l) { return indent + l; })).join("\n");
}
function formatErrorCtor(ctor, paramIdx, error) {
    var _a = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), _b = _a[1], params = _b === void 0 ? null : _b;
    var dep = formatDependency(params, paramIdx);
    return composeErrorMessage("Cannot inject the dependency " + dep + " of \"" + ctor.name + "\" constructor. Reason:", error);
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/index.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/index.js ***!
  \************************************************************/
/*! exports provided: instanceCachingFactory, predicateAwareClassFactory */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_137706__) {

"use strict";
__nested_webpack_require_137706__.r(__webpack_exports__);
/* harmony import */ var _instance_caching_factory__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_137706__(/*! ./instance-caching-factory */ "./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js");
/* harmony reexport (safe) */ __nested_webpack_require_137706__.d(__webpack_exports__, "instanceCachingFactory", function() { return _instance_caching_factory__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _predicate_aware_class_factory__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_137706__(/*! ./predicate-aware-class-factory */ "./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js");
/* harmony reexport (safe) */ __nested_webpack_require_137706__.d(__webpack_exports__, "predicateAwareClassFactory", function() { return _predicate_aware_class_factory__WEBPACK_IMPORTED_MODULE_1__["default"]; });





/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_139046__) {

"use strict";
__nested_webpack_require_139046__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_139046__.d(__webpack_exports__, "default", function() { return instanceCachingFactory; });
function instanceCachingFactory(factoryFunc) {
    var instance;
    return function (dependencyContainer) {
        if (instance == undefined) {
            instance = factoryFunc(dependencyContainer);
        }
        return instance;
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js":
/*!************************************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_139954__) {

"use strict";
__nested_webpack_require_139954__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_139954__.d(__webpack_exports__, "default", function() { return predicateAwareClassFactory; });
function predicateAwareClassFactory(predicate, trueConstructor, falseConstructor, useCaching) {
    if (useCaching === void 0) { useCaching = true; }
    var instance;
    var previousPredicate;
    return function (dependencyContainer) {
        var currentPredicate = predicate(dependencyContainer);
        if (!useCaching || previousPredicate !== currentPredicate) {
            if ((previousPredicate = currentPredicate)) {
                instance = dependencyContainer.resolve(trueConstructor);
            }
            else {
                instance = dependencyContainer.resolve(falseConstructor);
            }
        }
        return instance;
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/index.js":
/*!**************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/index.js ***!
  \**************************************************/
/*! exports provided: Lifecycle, autoInjectable, inject, injectable, registry, singleton, injectAll, injectAllWithTransform, injectWithTransform, scoped, instanceCachingFactory, predicateAwareClassFactory, isClassProvider, isFactoryProvider, isNormalToken, isTokenProvider, isValueProvider, delay, container */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_141428__) {

"use strict";
__nested_webpack_require_141428__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_141428__(/*! ./types */ "./node_modules/tsyringe/dist/esm5/types/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "Lifecycle", function() { return _types__WEBPACK_IMPORTED_MODULE_0__["Lifecycle"]; });

/* harmony import */ var _decorators__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_141428__(/*! ./decorators */ "./node_modules/tsyringe/dist/esm5/decorators/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "autoInjectable", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["autoInjectable"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "inject", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["inject"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "injectable", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectable"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "registry", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["registry"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "singleton", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["singleton"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "injectAll", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectAll"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "injectAllWithTransform", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectAllWithTransform"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "injectWithTransform", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["injectWithTransform"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "scoped", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__["scoped"]; });

/* harmony import */ var _factories__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_141428__(/*! ./factories */ "./node_modules/tsyringe/dist/esm5/factories/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "instanceCachingFactory", function() { return _factories__WEBPACK_IMPORTED_MODULE_2__["instanceCachingFactory"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "predicateAwareClassFactory", function() { return _factories__WEBPACK_IMPORTED_MODULE_2__["predicateAwareClassFactory"]; });

/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_141428__(/*! ./providers */ "./node_modules/tsyringe/dist/esm5/providers/index.js");
/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "isClassProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isClassProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "isFactoryProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isFactoryProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "isNormalToken", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isNormalToken"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "isTokenProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isTokenProvider"]; });

/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "isValueProvider", function() { return _providers__WEBPACK_IMPORTED_MODULE_3__["isValueProvider"]; });

/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_141428__(/*! ./lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");
/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "delay", function() { return _lazy_helpers__WEBPACK_IMPORTED_MODULE_4__["delay"]; });

/* harmony import */ var _dependency_container__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_141428__(/*! ./dependency-container */ "./node_modules/tsyringe/dist/esm5/dependency-container.js");
/* harmony reexport (safe) */ __nested_webpack_require_141428__.d(__webpack_exports__, "container", function() { return _dependency_container__WEBPACK_IMPORTED_MODULE_5__["instance"]; });

if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
    throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
}








/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/interceptors.js":
/*!*********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/interceptors.js ***!
  \*********************************************************/
/*! exports provided: PreResolutionInterceptors, PostResolutionInterceptors, default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_146416__) {

"use strict";
__nested_webpack_require_146416__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_146416__.d(__webpack_exports__, "PreResolutionInterceptors", function() { return PreResolutionInterceptors; });
/* harmony export (binding) */ __nested_webpack_require_146416__.d(__webpack_exports__, "PostResolutionInterceptors", function() { return PostResolutionInterceptors; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_146416__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _registry_base__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_146416__(/*! ./registry-base */ "./node_modules/tsyringe/dist/esm5/registry-base.js");


var PreResolutionInterceptors = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PreResolutionInterceptors, _super);
    function PreResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreResolutionInterceptors;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));

var PostResolutionInterceptors = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PostResolutionInterceptors, _super);
    function PostResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PostResolutionInterceptors;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));

var Interceptors = (function () {
    function Interceptors() {
        this.preResolution = new PreResolutionInterceptors();
        this.postResolution = new PostResolutionInterceptors();
    }
    return Interceptors;
}());
/* harmony default export */ __webpack_exports__["default"] = (Interceptors);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js":
/*!*********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/lazy-helpers.js ***!
  \*********************************************************/
/*! exports provided: DelayedConstructor, delay */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_148517__) {

"use strict";
__nested_webpack_require_148517__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_148517__.d(__webpack_exports__, "DelayedConstructor", function() { return DelayedConstructor; });
/* harmony export (binding) */ __nested_webpack_require_148517__.d(__webpack_exports__, "delay", function() { return delay; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_148517__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var DelayedConstructor = (function () {
    function DelayedConstructor(wrap) {
        this.wrap = wrap;
        this.reflectMethods = [
            "get",
            "getPrototypeOf",
            "setPrototypeOf",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "set",
            "deleteProperty",
            "apply",
            "construct"
        ];
    }
    DelayedConstructor.prototype.createProxy = function (createObject) {
        var _this = this;
        var target = {};
        var init = false;
        var value;
        var delayedObject = function () {
            if (!init) {
                value = createObject(_this.wrap());
                init = true;
            }
            return value;
        };
        return new Proxy(target, this.createHandler(delayedObject));
    };
    DelayedConstructor.prototype.createHandler = function (delayedObject) {
        var handler = {};
        var install = function (name) {
            handler[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args[0] = delayedObject();
                var method = Reflect[name];
                return method.apply(void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(args));
            };
        };
        this.reflectMethods.forEach(install);
        return handler;
    };
    return DelayedConstructor;
}());

function delay(wrappedConstructor) {
    if (typeof wrappedConstructor === "undefined") {
        throw new Error("Attempt to `delay` undefined. Constructor must be wrapped in a callback");
    }
    return new DelayedConstructor(wrappedConstructor);
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/class-provider.js ***!
  \*********************************************************************/
/*! exports provided: isClassProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_151173__) {

"use strict";
__nested_webpack_require_151173__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_151173__.d(__webpack_exports__, "isClassProvider", function() { return isClassProvider; });
function isClassProvider(provider) {
    return !!provider.useClass;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js":
/*!***********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/factory-provider.js ***!
  \***********************************************************************/
/*! exports provided: isFactoryProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_151864__) {

"use strict";
__nested_webpack_require_151864__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_151864__.d(__webpack_exports__, "isFactoryProvider", function() { return isFactoryProvider; });
function isFactoryProvider(provider) {
    return !!provider.useFactory;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/index.js ***!
  \************************************************************/
/*! exports provided: isClassProvider, isFactoryProvider, isNormalToken, isTokenProvider, isValueProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_152585__) {

"use strict";
__nested_webpack_require_152585__.r(__webpack_exports__);
/* harmony import */ var _class_provider__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_152585__(/*! ./class-provider */ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152585__.d(__webpack_exports__, "isClassProvider", function() { return _class_provider__WEBPACK_IMPORTED_MODULE_0__["isClassProvider"]; });

/* harmony import */ var _factory_provider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_152585__(/*! ./factory-provider */ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152585__.d(__webpack_exports__, "isFactoryProvider", function() { return _factory_provider__WEBPACK_IMPORTED_MODULE_1__["isFactoryProvider"]; });

/* harmony import */ var _injection_token__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_152585__(/*! ./injection-token */ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js");
/* harmony reexport (safe) */ __nested_webpack_require_152585__.d(__webpack_exports__, "isNormalToken", function() { return _injection_token__WEBPACK_IMPORTED_MODULE_2__["isNormalToken"]; });

/* harmony import */ var _token_provider__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_152585__(/*! ./token-provider */ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152585__.d(__webpack_exports__, "isTokenProvider", function() { return _token_provider__WEBPACK_IMPORTED_MODULE_3__["isTokenProvider"]; });

/* harmony import */ var _value_provider__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_152585__(/*! ./value-provider */ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js");
/* harmony reexport (safe) */ __nested_webpack_require_152585__.d(__webpack_exports__, "isValueProvider", function() { return _value_provider__WEBPACK_IMPORTED_MODULE_4__["isValueProvider"]; });








/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/injection-token.js":
/*!**********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/injection-token.js ***!
  \**********************************************************************/
/*! exports provided: isNormalToken, isTokenDescriptor, isTransformDescriptor, isConstructorToken */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_154962__) {

"use strict";
__nested_webpack_require_154962__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_154962__.d(__webpack_exports__, "isNormalToken", function() { return isNormalToken; });
/* harmony export (binding) */ __nested_webpack_require_154962__.d(__webpack_exports__, "isTokenDescriptor", function() { return isTokenDescriptor; });
/* harmony export (binding) */ __nested_webpack_require_154962__.d(__webpack_exports__, "isTransformDescriptor", function() { return isTransformDescriptor; });
/* harmony export (binding) */ __nested_webpack_require_154962__.d(__webpack_exports__, "isConstructorToken", function() { return isConstructorToken; });
/* harmony import */ var _lazy_helpers__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_154962__(/*! ../lazy-helpers */ "./node_modules/tsyringe/dist/esm5/lazy-helpers.js");

function isNormalToken(token) {
    return typeof token === "string" || typeof token === "symbol";
}
function isTokenDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "multiple" in descriptor);
}
function isTransformDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "transform" in descriptor);
}
function isConstructorToken(token) {
    return typeof token === "function" || token instanceof _lazy_helpers__WEBPACK_IMPORTED_MODULE_0__["DelayedConstructor"];
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/provider.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/provider.js ***!
  \***************************************************************/
/*! exports provided: isProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_156715__) {

"use strict";
__nested_webpack_require_156715__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_156715__.d(__webpack_exports__, "isProvider", function() { return isProvider; });
/* harmony import */ var _class_provider__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_156715__(/*! ./class-provider */ "./node_modules/tsyringe/dist/esm5/providers/class-provider.js");
/* harmony import */ var _value_provider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_156715__(/*! ./value-provider */ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js");
/* harmony import */ var _token_provider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_156715__(/*! ./token-provider */ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js");
/* harmony import */ var _factory_provider__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_156715__(/*! ./factory-provider */ "./node_modules/tsyringe/dist/esm5/providers/factory-provider.js");




function isProvider(provider) {
    return (Object(_class_provider__WEBPACK_IMPORTED_MODULE_0__["isClassProvider"])(provider) ||
        Object(_value_provider__WEBPACK_IMPORTED_MODULE_1__["isValueProvider"])(provider) ||
        Object(_token_provider__WEBPACK_IMPORTED_MODULE_2__["isTokenProvider"])(provider) ||
        Object(_factory_provider__WEBPACK_IMPORTED_MODULE_3__["isFactoryProvider"])(provider));
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/token-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/token-provider.js ***!
  \*********************************************************************/
/*! exports provided: isTokenProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_158466__) {

"use strict";
__nested_webpack_require_158466__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_158466__.d(__webpack_exports__, "isTokenProvider", function() { return isTokenProvider; });
function isTokenProvider(provider) {
    return !!provider.useToken;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/providers/value-provider.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/providers/value-provider.js ***!
  \*********************************************************************/
/*! exports provided: isValueProvider */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_159147__) {

"use strict";
__nested_webpack_require_159147__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_159147__.d(__webpack_exports__, "isValueProvider", function() { return isValueProvider; });
function isValueProvider(provider) {
    return provider.useValue != undefined;
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/reflection-helpers.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/reflection-helpers.js ***!
  \***************************************************************/
/*! exports provided: INJECTION_TOKEN_METADATA_KEY, getParamInfo, defineInjectionTokenMetadata */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_159872__) {

"use strict";
__nested_webpack_require_159872__.r(__webpack_exports__);
/* harmony export (binding) */ __nested_webpack_require_159872__.d(__webpack_exports__, "INJECTION_TOKEN_METADATA_KEY", function() { return INJECTION_TOKEN_METADATA_KEY; });
/* harmony export (binding) */ __nested_webpack_require_159872__.d(__webpack_exports__, "getParamInfo", function() { return getParamInfo; });
/* harmony export (binding) */ __nested_webpack_require_159872__.d(__webpack_exports__, "defineInjectionTokenMetadata", function() { return defineInjectionTokenMetadata; });
var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
function getParamInfo(target) {
    var params = Reflect.getMetadata("design:paramtypes", target) || [];
    var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    Object.keys(injectionTokens).forEach(function (key) {
        params[+key] = injectionTokens[key];
    });
    return params;
}
function defineInjectionTokenMetadata(data, transform) {
    return function (target, _propertyKey, parameterIndex) {
        var descriptors = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
        descriptors[parameterIndex] = transform
            ? {
                token: data,
                transform: transform.transformToken,
                transformArgs: transform.args || []
            }
            : data;
        Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, descriptors, target);
    };
}


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/registry-base.js":
/*!**********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/registry-base.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_161665__) {

"use strict";
__nested_webpack_require_161665__.r(__webpack_exports__);
var RegistryBase = (function () {
    function RegistryBase() {
        this._registryMap = new Map();
    }
    RegistryBase.prototype.entries = function () {
        return this._registryMap.entries();
    };
    RegistryBase.prototype.getAll = function (key) {
        this.ensure(key);
        return this._registryMap.get(key);
    };
    RegistryBase.prototype.get = function (key) {
        this.ensure(key);
        var value = this._registryMap.get(key);
        return value[value.length - 1] || null;
    };
    RegistryBase.prototype.set = function (key, value) {
        this.ensure(key);
        this._registryMap.get(key).push(value);
    };
    RegistryBase.prototype.setAll = function (key, value) {
        this._registryMap.set(key, value);
    };
    RegistryBase.prototype.has = function (key) {
        this.ensure(key);
        return this._registryMap.get(key).length > 0;
    };
    RegistryBase.prototype.clear = function () {
        this._registryMap.clear();
    };
    RegistryBase.prototype.ensure = function (key) {
        if (!this._registryMap.has(key)) {
            this._registryMap.set(key, []);
        }
    };
    return RegistryBase;
}());
/* harmony default export */ __webpack_exports__["default"] = (RegistryBase);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/registry.js":
/*!*****************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/registry.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_163330__) {

"use strict";
__nested_webpack_require_163330__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_163330__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _registry_base__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_163330__(/*! ./registry-base */ "./node_modules/tsyringe/dist/esm5/registry-base.js");


var Registry = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Registry;
}(_registry_base__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Registry);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/resolution-context.js":
/*!***************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/resolution-context.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_164453__) {

"use strict";
__nested_webpack_require_164453__.r(__webpack_exports__);
var ResolutionContext = (function () {
    function ResolutionContext() {
        this.scopedResolutions = new Map();
    }
    return ResolutionContext;
}());
/* harmony default export */ __webpack_exports__["default"] = (ResolutionContext);


/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/types/index.js":
/*!********************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/types/index.js ***!
  \********************************************************/
/*! exports provided: Lifecycle */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_165114__) {

"use strict";
__nested_webpack_require_165114__.r(__webpack_exports__);
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_165114__(/*! ./lifecycle */ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js");
/* harmony reexport (safe) */ __nested_webpack_require_165114__.d(__webpack_exports__, "Lifecycle", function() { return _lifecycle__WEBPACK_IMPORTED_MODULE_0__["default"]; });




/***/ }),

/***/ "./node_modules/tsyringe/dist/esm5/types/lifecycle.js":
/*!************************************************************!*\
  !*** ./node_modules/tsyringe/dist/esm5/types/lifecycle.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __nested_webpack_require_165873__) {

"use strict";
__nested_webpack_require_165873__.r(__webpack_exports__);
var Lifecycle;
(function (Lifecycle) {
    Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
    Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
    Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
    Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));
/* harmony default export */ __webpack_exports__["default"] = (Lifecycle);


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/Constants/Global.ts":
/*!*********************************!*\
  !*** ./src/Constants/Global.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.POLYGLOAT_TARGET_ATTRIBUTE = exports.POLYGLOAT_ATTRIBUTE_NAME = exports.RESTRICTED_ASCENDANT_ATTRIBUTE = void 0;
exports.RESTRICTED_ASCENDANT_ATTRIBUTE = "data-polygloat-restricted";
exports.POLYGLOAT_ATTRIBUTE_NAME = "_polygloat";
exports.POLYGLOAT_TARGET_ATTRIBUTE = "_polygloat-target";


/***/ }),

/***/ "./src/Constants/ModifierKey.ts":
/*!**************************************!*\
  !*** ./src/Constants/ModifierKey.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierKey = void 0;
var ModifierKey;
(function (ModifierKey) {
    ModifierKey[ModifierKey["Alt"] = 0] = "Alt";
    ModifierKey[ModifierKey["Control"] = 1] = "Control";
    ModifierKey[ModifierKey["Shift"] = 2] = "Shift";
    ModifierKey[ModifierKey["Meta"] = 3] = "Meta";
})(ModifierKey = exports.ModifierKey || (exports.ModifierKey = {}));


/***/ }),

/***/ "./src/DTOs/TranslationData.ts":
/*!*************************************!*\
  !*** ./src/DTOs/TranslationData.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationData = void 0;
var TranslationData = /** @class */ (function () {
    function TranslationData(key, translations) {
        this.key = key;
        this.translations = translations;
    }
    return TranslationData;
}());
exports.TranslationData = TranslationData;


/***/ }),

/***/ "./src/Errors/ApiHttpError.ts":
/*!************************************!*\
  !*** ./src/Errors/ApiHttpError.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHttpError = void 0;
var ApiHttpError = /** @class */ (function (_super) {
    __extends(ApiHttpError, _super);
    function ApiHttpError(response, code) {
        var _this = _super.call(this, "Api http error") || this;
        _this.response = response;
        _this.code = code;
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, ApiHttpError.prototype);
        return _this;
    }
    return ApiHttpError;
}(Error));
exports.ApiHttpError = ApiHttpError;


/***/ }),

/***/ "./src/Observer.ts":
/*!*************************!*\
  !*** ./src/Observer.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_170686__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
var tsyringe_1 = __nested_webpack_require_170686__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var CoreHandler_1 = __nested_webpack_require_170686__(/*! ./handlers/CoreHandler */ "./src/handlers/CoreHandler.ts");
var Properties_1 = __nested_webpack_require_170686__(/*! ./Properties */ "./src/Properties.ts");
var TextHandler_1 = __nested_webpack_require_170686__(/*! ./handlers/TextHandler */ "./src/handlers/TextHandler.ts");
var AttributeHandler_1 = __nested_webpack_require_170686__(/*! ./handlers/AttributeHandler */ "./src/handlers/AttributeHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_170686__(/*! ./services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var Observer = /** @class */ (function () {
    function Observer(properties, coreHandler, basicTextHandler, attributeHandler, nodeRegistrar) {
        var _this = this;
        this.properties = properties;
        this.coreHandler = coreHandler;
        this.basicTextHandler = basicTextHandler;
        this.attributeHandler = attributeHandler;
        this.nodeRegistrar = nodeRegistrar;
        this.observer = new MutationObserver(function (mutationsList) { return __awaiter(_this, void 0, void 0, function () {
            var mutationsList_1, mutationsList_1_1, mutation, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, 10, 11]);
                        mutationsList_1 = __values(mutationsList), mutationsList_1_1 = mutationsList_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!mutationsList_1_1.done) return [3 /*break*/, 8];
                        mutation = mutationsList_1_1.value;
                        if (!(mutation.type === 'characterData')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.basicTextHandler.handle(mutation.target)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(mutation.type === 'childList')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.coreHandler.handleSubtree(mutation.target)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(mutation.type === 'attributes')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.attributeHandler.handle(mutation.target)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        mutationsList_1_1 = mutationsList_1.next();
                        return [3 /*break*/, 1];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (mutationsList_1_1 && !mutationsList_1_1.done && (_a = mutationsList_1.return)) _a.call(mutationsList_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        this.nodeRegistrar.refreshAll();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    Observer.prototype.observe = function () {
        this.observer.observe(this.properties.config.targetElement, { attributes: true, childList: true, subtree: true, characterData: true });
    };
    Observer.prototype.stopObserving = function () {
        this.observer.disconnect();
    };
    Observer = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            CoreHandler_1.CoreHandler,
            TextHandler_1.TextHandler,
            AttributeHandler_1.AttributeHandler,
            ElementRegistrar_1.ElementRegistrar])
    ], Observer);
    return Observer;
}());
exports.Observer = Observer;


/***/ }),

/***/ "./src/Polygloat.ts":
/*!**************************!*\
  !*** ./src/Polygloat.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_178949__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygloat = void 0;
var CoreService_1 = __nested_webpack_require_178949__(/*! ./services/CoreService */ "./src/services/CoreService.ts");
var PolygloatConfig_1 = __nested_webpack_require_178949__(/*! ./PolygloatConfig */ "./src/PolygloatConfig.ts");
var Properties_1 = __nested_webpack_require_178949__(/*! ./Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_178949__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventService_1 = __nested_webpack_require_178949__(/*! ./services/EventService */ "./src/services/EventService.ts");
var Observer_1 = __nested_webpack_require_178949__(/*! ./Observer */ "./src/Observer.ts");
var TranslationService_1 = __nested_webpack_require_178949__(/*! ./services/TranslationService */ "./src/services/TranslationService.ts");
var TextService_1 = __nested_webpack_require_178949__(/*! ./services/TextService */ "./src/services/TextService.ts");
var CoreHandler_1 = __nested_webpack_require_178949__(/*! ./handlers/CoreHandler */ "./src/handlers/CoreHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_178949__(/*! ./services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var NodeHelper_1 = __nested_webpack_require_178949__(/*! ./helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Polygloat = /** @class */ (function () {
    function Polygloat(config) {
        var _this = this;
        this.container = tsyringe_1.container.createChildContainer();
        this.properties = this.container.resolve(Properties_1.Properties);
        this._coreService = this.container.resolve(CoreService_1.CoreService);
        this.eventService = this.container.resolve(EventService_1.EventService);
        this.observer = this.container.resolve(Observer_1.Observer);
        this.translationService = this.container.resolve(TranslationService_1.TranslationService);
        this.textService = this.container.resolve(TextService_1.TextService);
        this.coreHandler = this.container.resolve(CoreHandler_1.CoreHandler);
        this.elementRegistrar = this.container.resolve(ElementRegistrar_1.ElementRegistrar);
        this.translate = function (key, params, noWrap) {
            if (params === void 0) { params = {}; }
            if (noWrap === void 0) { noWrap = false; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.properties.config.mode === 'development' && !noWrap) {
                        return [2 /*return*/, this.textService.wrap(key, params)];
                    }
                    return [2 /*return*/, this.textService.translate(key, params)];
                });
            });
        };
        this.instant = function (key, params, noWrap, orEmpty) {
            if (params === void 0) { params = {}; }
            if (noWrap === void 0) { noWrap = false; }
            if (_this.properties.config.mode === 'development' && !noWrap) {
                return _this.textService.wrap(key, params);
            }
            return _this.textService.instant(key, params, undefined, orEmpty);
        };
        this.stop = function () {
            _this.observer.stopObserving();
            _this.elementRegistrar.cleanAll();
            NodeHelper_1.NodeHelper.unmarkElementAsTargetElement(_this.properties.config.targetElement);
        };
        this.container = tsyringe_1.container.createChildContainer();
        this.properties.config = new PolygloatConfig_1.PolygloatConfig(config);
    }
    Object.defineProperty(Polygloat.prototype, "lang", {
        get: function () {
            return this.properties.currentLanguage;
        },
        set: function (value) {
            this.properties.currentLanguage = value;
            this.eventService.LANGUAGE_CHANGED.emit(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "coreService", {
        get: function () {
            return this._coreService;
        },
        enumerable: false,
        configurable: true
    });
    Polygloat.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.properties.config.mode === "development")) return [3 /*break*/, 2];
                        _a = this.properties;
                        return [4 /*yield*/, this.coreService.getScopes()];
                    case 1:
                        _a.scopes = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (this.properties.config.watch) {
                            this.observer.observe();
                        }
                        return [4 /*yield*/, this.translationService.loadTranslations()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.refresh()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Polygloat.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.coreHandler.handleSubtree(this.properties.config.targetElement)];
            });
        });
    };
    Object.defineProperty(Polygloat.prototype, "defaultLanguage", {
        get: function () {
            return this.properties.config.defaultLanguage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "onLangChange", {
        get: function () {
            return this.eventService.LANGUAGE_CHANGED;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Polygloat.prototype, "onLangLoaded", {
        get: function () {
            return this.eventService.LANGUAGE_LOADED;
        },
        enumerable: false,
        configurable: true
    });
    return Polygloat;
}());
exports.Polygloat = Polygloat;
exports.default = Polygloat;


/***/ }),

/***/ "./src/PolygloatConfig.ts":
/*!********************************!*\
  !*** ./src/PolygloatConfig.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_187891__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygloatConfig = void 0;
var ModifierKey_1 = __nested_webpack_require_187891__(/*! ./Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
var NodeHelper_1 = __nested_webpack_require_187891__(/*! ./helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var DEFAULT_TARGET_ELEMENT = document.body;
var PolygloatConfig = /** @class */ (function () {
    function PolygloatConfig(config) {
        this.tagAttributes = {
            'textarea': ['placeholder'],
            'input': ['value', 'placeholder']
        };
        this.passToParent = ["option", "optgroup"];
        this.restrictedElements = ['script', 'style'];
        this.defaultLanguage = 'en';
        this.availableLanguages = ['en'];
        this.inputPrefix = '%-%polygloat:';
        this.inputSuffix = '%-%';
        this.filesUrlPrefix = "i18n/";
        this.highlightKeys = [ModifierKey_1.ModifierKey.Alt];
        this.highlightColor = "rgb(224 240 255)";
        //workaround for: https://stackoverflow.com/questions/48725916/typescript-optional-property-with-a-getter
        Object.defineProperty(this, 'targetElement', {
            set: function (targetElement) {
                if (this.targetElement !== undefined) {
                    throw new Error("Target element is already defined!");
                }
                if (targetElement === undefined) {
                    this._targetElement = DEFAULT_TARGET_ELEMENT;
                }
                if (NodeHelper_1.NodeHelper.isElementTargetElement(targetElement)) {
                    console.error("Target element: ", this._targetElement);
                    throw new Error("An polygloat instance is inited with provided target element");
                }
                this._targetElement = targetElement;
                NodeHelper_1.NodeHelper.markElementAsTargetElement(this._targetElement);
            },
            get: function () {
                return this._targetElement;
            }
        });
        Object.assign(this, config || {});
        if (this._targetElement === undefined) {
            this._targetElement = DEFAULT_TARGET_ELEMENT;
        }
        this.mode = this.mode || (this.apiKey ? "development" : "production");
        this.fallbackLanguage = this.fallbackLanguage || this.defaultLanguage;
        if (this.watch === undefined) {
            this.watch = this.mode === "development";
        }
    }
    return PolygloatConfig;
}());
exports.PolygloatConfig = PolygloatConfig;


/***/ }),

/***/ "./src/Properties.ts":
/*!***************************!*\
  !*** ./src/Properties.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_190654__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Properties = void 0;
var tsyringe_1 = __nested_webpack_require_190654__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY = "__polygloat_preferredLanguages";
var CURRENT_LANGUAGE_LOCAL_STORAGE_KEY = "__polygloat_currentLanguage";
var Properties = /** @class */ (function () {
    function Properties() {
        this.scopes = [];
    }
    Object.defineProperty(Properties.prototype, "preferredLanguages", {
        get: function () {
            return new Set(JSON.parse(localStorage.getItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY)));
        },
        set: function (languages) {
            localStorage.setItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY, JSON.stringify(Array.from(languages)));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Properties.prototype, "currentLanguage", {
        get: function () {
            var result = localStorage.getItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY);
            if (!result) {
                result = this.getLanguageByNavigator();
                this.currentLanguage = result;
            }
            return result;
        },
        set: function (language) {
            localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY, language);
        },
        enumerable: false,
        configurable: true
    });
    Properties.prototype.getLanguageByNavigator = function () {
        if (window) {
            var preferred_1 = window.navigator.language;
            var exactMatch = this.config.availableLanguages.find(function (l) { return l === preferred_1; });
            if (exactMatch) {
                return exactMatch;
            }
            var getTwoLetters_1 = function (fullTag) { return fullTag.replace(/^(.+?)(-.*)?$/, "$1"); };
            var preferredTwoLetter_1 = getTwoLetters_1(window.navigator.language);
            var twoLetterMatch = this.config.availableLanguages.find(function (l) { return getTwoLetters_1(l) === preferredTwoLetter_1; });
            if (twoLetterMatch) {
                return twoLetterMatch;
            }
        }
        return this.config.defaultLanguage;
    };
    Properties = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped)
    ], Properties);
    return Properties;
}());
exports.Properties = Properties;


/***/ }),

/***/ "./src/handlers/AbstractHandler.ts":
/*!*****************************************!*\
  !*** ./src/handlers/AbstractHandler.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_193938__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_193938__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Global_1 = __nested_webpack_require_193938__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var AbstractHandler = /** @class */ (function () {
    function AbstractHandler(properties, textService, elementRegistrar, translationHighlighter) {
        this.properties = properties;
        this.textService = textService;
        this.elementRegistrar = elementRegistrar;
        this.translationHighlighter = translationHighlighter;
    }
    AbstractHandler.prototype.filterRestricted = function (nodes) {
        var restrictedElements = this.properties.config.restrictedElements;
        return nodes.filter(function (n) {
            var e = NodeHelper_1.NodeHelper.closestElement(n);
            return restrictedElements.indexOf(e.tagName.toLowerCase()) === -1
                && e.closest("[" + Global_1.RESTRICTED_ASCENDANT_ATTRIBUTE + "=\"true\"]") === null;
        });
    };
    AbstractHandler.prototype.handleNodes = function (nodes) {
        return __awaiter(this, void 0, void 0, function () {
            var nodes_1, nodes_1_1, textNode, result, text, keys, translatedNode, parentElement, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!nodes_1_1.done) return [3 /*break*/, 4];
                        textNode = nodes_1_1.value;
                        return [4 /*yield*/, this.textService.replace(textNode.textContent)];
                    case 2:
                        result = _b.sent();
                        if (result) {
                            text = result.text, keys = result.keys;
                            translatedNode = this.translateChildNode(textNode, text, keys);
                            parentElement = this.getParentElement(translatedNode);
                            parentElement._polygloat.nodes.add(translatedNode);
                            this.elementRegistrar.register(parentElement);
                        }
                        _b.label = 3;
                    case 3:
                        nodes_1_1 = nodes_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AbstractHandler.prototype.translateChildNode = function (node, newValue, keys) {
        node[Global_1.POLYGLOAT_ATTRIBUTE_NAME] = {
            oldTextContent: node.textContent,
            keys: keys
        };
        node.textContent = newValue;
        return node;
    };
    AbstractHandler.initParentElement = function (element) {
        if (element[Global_1.POLYGLOAT_ATTRIBUTE_NAME] === undefined) {
            element[Global_1.POLYGLOAT_ATTRIBUTE_NAME] = {
                nodes: new Set()
            };
            element.setAttribute(Global_1.POLYGLOAT_ATTRIBUTE_NAME, "");
        }
        return element;
    };
    AbstractHandler.prototype.getParentElement = function (node) {
        var parent = this.getSuitableParent(node);
        return AbstractHandler.initParentElement(parent);
    };
    AbstractHandler.prototype.getSuitableParent = function (node) {
        var domParent = NodeHelper_1.NodeHelper.getParentElement(node);
        if (domParent === undefined) {
            console.error(node);
            throw new Error("No suitable parent found for node above.");
        }
        if (!this.properties.config.passToParent) {
            return domParent;
        }
        if (Array.isArray(this.properties.config.passToParent)) {
            var tagNameEquals = function (elementTagName) { return domParent.tagName.toLowerCase() === elementTagName.toLowerCase(); };
            if (this.properties.config.passToParent.findIndex(tagNameEquals) === -1) {
                return domParent;
            }
        }
        if (typeof this.properties.config.passToParent === "function") {
            if (!this.properties.config.passToParent(domParent)) {
                return domParent;
            }
        }
        return this.getSuitableParent(domParent);
    };
    return AbstractHandler;
}());
exports.AbstractHandler = AbstractHandler;


/***/ }),

/***/ "./src/handlers/AttributeHandler.ts":
/*!******************************************!*\
  !*** ./src/handlers/AttributeHandler.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_202253__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeHandler = void 0;
var tsyringe_1 = __nested_webpack_require_202253__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var AbstractHandler_1 = __nested_webpack_require_202253__(/*! ./AbstractHandler */ "./src/handlers/AbstractHandler.ts");
var Properties_1 = __nested_webpack_require_202253__(/*! ../Properties */ "./src/Properties.ts");
var NodeHelper_1 = __nested_webpack_require_202253__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var TextService_1 = __nested_webpack_require_202253__(/*! ../services/TextService */ "./src/services/TextService.ts");
var ElementRegistrar_1 = __nested_webpack_require_202253__(/*! ../services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var TranslationHighlighter_1 = __nested_webpack_require_202253__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var AttributeHandler = /** @class */ (function (_super) {
    __extends(AttributeHandler, _super);
    function AttributeHandler(properties, textService, elementRegistrar, translationHighlighter) {
        var _this = _super.call(this, properties, textService, elementRegistrar, translationHighlighter) || this;
        _this.properties = properties;
        _this.textService = textService;
        _this.elementRegistrar = elementRegistrar;
        _this.translationHighlighter = translationHighlighter;
        return _this;
    }
    AttributeHandler.prototype.handle = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var inputPrefix, inputSuffix, _a, _b, _c, tag, attributes, attributes_1, attributes_1_1, attribute, expression, nodes, e_1_1, e_2_1;
            var e_2, _d, e_1, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        inputPrefix = this.properties.config.inputPrefix;
                        inputSuffix = this.properties.config.inputSuffix;
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 12, 13, 14]);
                        _a = __values(Object.entries(this.properties.config.tagAttributes)), _b = _a.next();
                        _f.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 11];
                        _c = __read(_b.value, 2), tag = _c[0], attributes = _c[1];
                        _f.label = 3;
                    case 3:
                        _f.trys.push([3, 8, 9, 10]);
                        attributes_1 = (e_1 = void 0, __values(attributes)), attributes_1_1 = attributes_1.next();
                        _f.label = 4;
                    case 4:
                        if (!!attributes_1_1.done) return [3 /*break*/, 7];
                        attribute = attributes_1_1.value;
                        expression = "descendant-or-self::" + tag + "/@" + attribute + "[contains(., '" + inputPrefix + "') and contains(., '" + inputSuffix + "')]";
                        nodes = NodeHelper_1.NodeHelper.evaluate(expression, node);
                        return [4 /*yield*/, this.handleNodes(nodes)];
                    case 5:
                        _f.sent();
                        _f.label = 6;
                    case 6:
                        attributes_1_1 = attributes_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (attributes_1_1 && !attributes_1_1.done && (_e = attributes_1.return)) _e.call(attributes_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2_1 = _f.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    AttributeHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            TextService_1.TextService,
            ElementRegistrar_1.ElementRegistrar,
            TranslationHighlighter_1.TranslationHighlighter])
    ], AttributeHandler);
    return AttributeHandler;
}(AbstractHandler_1.AbstractHandler));
exports.AttributeHandler = AttributeHandler;


/***/ }),

/***/ "./src/handlers/CoreHandler.ts":
/*!*************************************!*\
  !*** ./src/handlers/CoreHandler.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_212439__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_212439__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var CoreService_1 = __nested_webpack_require_212439__(/*! ../services/CoreService */ "./src/services/CoreService.ts");
var TextHandler_1 = __nested_webpack_require_212439__(/*! ./TextHandler */ "./src/handlers/TextHandler.ts");
var tsyringe_1 = __nested_webpack_require_212439__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventService_1 = __nested_webpack_require_212439__(/*! ../services/EventService */ "./src/services/EventService.ts");
var Properties_1 = __nested_webpack_require_212439__(/*! ../Properties */ "./src/Properties.ts");
var AttributeHandler_1 = __nested_webpack_require_212439__(/*! ./AttributeHandler */ "./src/handlers/AttributeHandler.ts");
var TextService_1 = __nested_webpack_require_212439__(/*! ../services/TextService */ "./src/services/TextService.ts");
var CoreHandler = /** @class */ (function () {
    function CoreHandler(service, basicTextHandler, eventService, properties, attributeHandler, textService) {
        this.service = service;
        this.basicTextHandler = basicTextHandler;
        this.eventService = eventService;
        this.properties = properties;
        this.attributeHandler = attributeHandler;
        this.textService = textService;
        eventService.LANGUAGE_CHANGED.subscribe(this.refresh.bind(this));
        eventService.TRANSLATION_CHANGED.subscribe(this.refresh.bind(this));
    }
    CoreHandler.prototype.handleSubtree = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.attributeHandler.handle(target)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.basicTextHandler.handle(target)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CoreHandler.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodes, nodes_1, nodes_1_1, node, _a, _b, textNode, result, e_1_1, e_2_1;
            var e_2, _c, e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        nodes = NodeHelper_1.NodeHelper.evaluate("//*[@_polygloat]", this.properties.config.targetElement);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 12, 13, 14]);
                        nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next();
                        _e.label = 2;
                    case 2:
                        if (!!nodes_1_1.done) return [3 /*break*/, 11];
                        node = nodes_1_1.value;
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 8, 9, 10]);
                        _a = (e_1 = void 0, __values(node._polygloat.nodes)), _b = _a.next();
                        _e.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 7];
                        textNode = _b.value;
                        return [4 /*yield*/, this.textService.replace(textNode._polygloat.oldTextContent)];
                    case 5:
                        result = _e.sent();
                        if (result) {
                            textNode.textContent = result.text;
                        }
                        _e.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        nodes_1_1 = nodes_1.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (nodes_1_1 && !nodes_1_1.done && (_c = nodes_1.return)) _c.call(nodes_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    CoreHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [CoreService_1.CoreService,
            TextHandler_1.TextHandler,
            EventService_1.EventService,
            Properties_1.Properties,
            AttributeHandler_1.AttributeHandler,
            TextService_1.TextService])
    ], CoreHandler);
    return CoreHandler;
}());
exports.CoreHandler = CoreHandler;


/***/ }),

/***/ "./src/handlers/TextHandler.ts":
/*!*************************************!*\
  !*** ./src/handlers/TextHandler.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_221913__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHandler = void 0;
var NodeHelper_1 = __nested_webpack_require_221913__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var Properties_1 = __nested_webpack_require_221913__(/*! ../Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_221913__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationHighlighter_1 = __nested_webpack_require_221913__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var TextService_1 = __nested_webpack_require_221913__(/*! ../services/TextService */ "./src/services/TextService.ts");
var AbstractHandler_1 = __nested_webpack_require_221913__(/*! ./AbstractHandler */ "./src/handlers/AbstractHandler.ts");
var ElementRegistrar_1 = __nested_webpack_require_221913__(/*! ../services/ElementRegistrar */ "./src/services/ElementRegistrar.ts");
var TextHandler = /** @class */ (function (_super) {
    __extends(TextHandler, _super);
    function TextHandler(properties, translationHighlighter, textService, nodeRegistrar) {
        var _this = _super.call(this, properties, textService, nodeRegistrar, translationHighlighter) || this;
        _this.properties = properties;
        _this.translationHighlighter = translationHighlighter;
        _this.textService = textService;
        _this.nodeRegistrar = nodeRegistrar;
        return _this;
    }
    TextHandler.prototype.handle = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var inputPrefix, inputSuffix, xPath, nodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputPrefix = this.properties.config.inputPrefix;
                        inputSuffix = this.properties.config.inputSuffix;
                        xPath = "./descendant-or-self::text()[contains(., '" + inputPrefix + "') and contains(., '" + inputSuffix + "')]";
                        nodes = this.filterRestricted(NodeHelper_1.NodeHelper.evaluate(xPath, node));
                        return [4 /*yield*/, this.handleNodes(nodes)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TextHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            TranslationHighlighter_1.TranslationHighlighter,
            TextService_1.TextService,
            ElementRegistrar_1.ElementRegistrar])
    ], TextHandler);
    return TextHandler;
}(AbstractHandler_1.AbstractHandler));
exports.TextHandler = TextHandler;


/***/ }),

/***/ "./src/helpers/NodeHelper.ts":
/*!***********************************!*\
  !*** ./src/helpers/NodeHelper.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_228719__) {

"use strict";

var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHelper = void 0;
var Global_1 = __nested_webpack_require_228719__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var NodeHelper = /** @class */ (function () {
    function NodeHelper() {
    }
    NodeHelper.evaluateGenerator = function (expression, targetNode) {
        var node, evaluated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    evaluated = document.evaluate(expression, targetNode, undefined, XPathResult.ANY_TYPE);
                    _a.label = 1;
                case 1:
                    if (!((node = evaluated.iterateNext()) !== null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    NodeHelper.evaluate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Array.from(this.evaluateGenerator.apply(this, __spread(args)));
    };
    NodeHelper.evaluateToSingle = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr = this.evaluate.apply(this, __spread(args));
        if (arr.length === 1) {
            return arr[0];
        }
        if (arr.length < 1) {
            throw new Error("No element found");
        }
        throw new Error("Multiple elements found");
    };
    NodeHelper.closestElement = function (node) {
        if (node instanceof Text) {
            return node.parentElement;
        }
        return node;
    };
    NodeHelper.getParentElement = function (node) {
        if (node.parentElement) {
            return node.parentElement;
        }
        if (node.ownerElement) {
            return node.ownerElement;
        }
    };
    NodeHelper.isElementTargetElement = function (element) {
        return element.hasAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE);
    };
    NodeHelper.markElementAsTargetElement = function (element) {
        element.setAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE, "");
    };
    NodeHelper.unmarkElementAsTargetElement = function (element) {
        element.removeAttribute(Global_1.POLYGLOAT_TARGET_ATTRIBUTE);
    };
    NodeHelper.nodeContains = function (descendant, node) {
        if (descendant.contains(node)) {
            return true;
        }
        if (node instanceof Attr) {
            var ownerContainsAttr = Object.values(node.ownerElement.attributes).indexOf(node) > -1;
            if (descendant.contains(node.ownerElement) && ownerContainsAttr) {
                return true;
            }
        }
        return false;
    };
    return NodeHelper;
}());
exports.NodeHelper = NodeHelper;


/***/ }),

/***/ "./src/helpers/TextHelper.ts":
/*!***********************************!*\
  !*** ./src/helpers/TextHelper.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHelper = void 0;
var TextHelper = /** @class */ (function () {
    function TextHelper() {
    }
    TextHelper.splitOnNonEscapedDelimiter = function (string, delimiter) {
        var result = [];
        var actual = "";
        for (var i = 0; i < string.length; i++) {
            var char = string[i];
            if (char === delimiter) {
                if (!this.isCharEscaped(i, string)) {
                    result.push(this.removeEscapes(actual));
                    actual = "";
                    continue;
                }
            }
            actual += string[i];
        }
        result.push(this.removeEscapes(actual));
        return result;
    };
    TextHelper.isCharEscaped = function (position, fullString) {
        var escapeCharsCount = 0;
        while (position > -1 && fullString[position - 1] === "\\") {
            escapeCharsCount++;
            position--;
        }
        return escapeCharsCount % 2 == 1;
    };
    TextHelper.removeEscapes = function (text) {
        return text.replace(/\\?\\?/g, function (match) {
            if (match == "\\\\") {
                return "\\";
            }
            return "";
        });
    };
    return TextHelper;
}());
exports.TextHelper = TextHelper;


/***/ }),

/***/ "./src/highlighter/MouseEventHandler.ts":
/*!**********************************************!*\
  !*** ./src/highlighter/MouseEventHandler.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_236059__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseEventHandler = void 0;
var ModifierKey_1 = __nested_webpack_require_236059__(/*! ../Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
var tsyringe_1 = __nested_webpack_require_236059__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_236059__(/*! ../Properties */ "./src/Properties.ts");
var EventEmitter_1 = __nested_webpack_require_236059__(/*! ../services/EventEmitter */ "./src/services/EventEmitter.ts");
var MouseEventHandler = /** @class */ (function () {
    function MouseEventHandler(properties) {
        this.properties = properties;
        this.keysDown = new Set();
        this.mouseOn = new Set();
        this.mouseOnChanged = new EventEmitter_1.EventEmitterImpl();
        this.keysChanged = new EventEmitter_1.EventEmitterImpl();
        this.initKeyListener();
    }
    MouseEventHandler.prototype.handle = function (element, onclick) {
        var _this = this;
        if (element._polygloat.listeningForHighlighting) {
            console.error("Element is already listening mouse events! This is probably bug in polygloat");
            return;
        }
        element._polygloat.listeningForHighlighting = true;
        this.initEventListeners(element, onclick);
        this.mouseOnChanged.subscribe(function () {
            if (_this.highlighted !== _this.getMouseOn()) {
                _this.onConditionsChanged();
            }
        });
        this.keysChanged.subscribe(function () {
            _this.onConditionsChanged();
        });
    };
    MouseEventHandler.prototype.initEventListeners = function (element, onclick) {
        var _this = this;
        var onMouseOver = function () { return _this.onMouseOver(element); };
        var onMouseOut = function () { return _this.onMouseOut(element); };
        var onClick = function (e) {
            if (_this.areKeysDown()) {
                e.stopPropagation();
                e.preventDefault();
                onclick(e);
            }
        };
        element.addEventListener("mouseover", onMouseOver);
        element.addEventListener("click", onClick);
        var onMouseDownOrUp = function (e) {
            if (_this.areKeysDown()) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        element.addEventListener("mousedown", onMouseDownOrUp);
        element.addEventListener("mouseup", onMouseDownOrUp);
        element.addEventListener("mouseout", onMouseOut);
        element._polygloat.removeAllEventListeners = function () {
            element.removeEventListener("mousedown", onMouseDownOrUp);
            element.removeEventListener("mouseup", onMouseDownOrUp);
            element.removeEventListener("mouseover", onMouseOver);
            element.removeEventListener("click", onClick);
            element.removeEventListener("mouseout", onMouseOut);
        };
    };
    MouseEventHandler.prototype.onConditionsChanged = function () {
        this.unhighlight();
        if (this.areKeysDown() && this.getMouseOn()) {
            this.highlight();
        }
    };
    MouseEventHandler.prototype.highlight = function () {
        this.highlightedInitialBackgroundColor = this.getMouseOn().style.backgroundColor;
        this.getMouseOn().style.backgroundColor = this.properties.config.highlightColor;
        this.highlighted = this.getMouseOn();
    };
    MouseEventHandler.prototype.unhighlight = function () {
        if (this.highlighted) {
            this.highlighted.style.backgroundColor = this.highlightedInitialBackgroundColor;
            this.highlighted = null;
        }
    };
    MouseEventHandler.prototype.onMouseOut = function (element) {
        this.mouseOn.delete(element);
        this.mouseOnChanged.emit(this.getMouseOn());
    };
    MouseEventHandler.prototype.onMouseOver = function (element) {
        this.mouseOn.delete(element); //to get in to last place
        this.mouseOn.add(element);
        this.mouseOnChanged.emit(this.getMouseOn());
    };
    MouseEventHandler.prototype.getMouseOn = function () {
        var mouseOnArray = Array.from(this.mouseOn);
        return mouseOnArray.length ? mouseOnArray[0] : undefined;
    };
    MouseEventHandler.prototype.initKeyListener = function () {
        var _this = this;
        window.addEventListener('blur', function () {
            _this.keysDown = new Set();
            _this.keysChanged.emit(_this.areKeysDown());
        });
        window.addEventListener('keydown', function (e) {
            var modifierKey = ModifierKey_1.ModifierKey[e.key];
            if (modifierKey !== undefined) {
                _this.keysDown.add(modifierKey);
                _this.keysChanged.emit(_this.areKeysDown());
            }
        });
        window.addEventListener('keyup', function (e) {
            _this.keysDown.delete(ModifierKey_1.ModifierKey[e.key]);
            _this.keysChanged.emit(_this.areKeysDown());
        });
    };
    MouseEventHandler.prototype.areKeysDown = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.properties.config.highlightKeys), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (!this.keysDown.has(key)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    MouseEventHandler = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties])
    ], MouseEventHandler);
    return MouseEventHandler;
}());
exports.MouseEventHandler = MouseEventHandler;


/***/ }),

/***/ "./src/highlighter/TranslationHighlighter.ts":
/*!***************************************************!*\
  !*** ./src/highlighter/TranslationHighlighter.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_243506__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationHighlighter = void 0;
var CoreService_1 = __nested_webpack_require_243506__(/*! ../services/CoreService */ "./src/services/CoreService.ts");
var tsyringe_1 = __nested_webpack_require_243506__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_243506__(/*! ../Properties */ "./src/Properties.ts");
var EventService_1 = __nested_webpack_require_243506__(/*! ../services/EventService */ "./src/services/EventService.ts");
var TranslationService_1 = __nested_webpack_require_243506__(/*! ../services/TranslationService */ "./src/services/TranslationService.ts");
var MouseEventHandler_1 = __nested_webpack_require_243506__(/*! ./MouseEventHandler */ "./src/highlighter/MouseEventHandler.ts");
var TranslationHighlighter = /** @class */ (function () {
    function TranslationHighlighter(service, properties, eventService, translationService, mouseEventHandler) {
        var _this = this;
        this.service = service;
        this.properties = properties;
        this.eventService = eventService;
        this.translationService = translationService;
        this.mouseEventHandler = mouseEventHandler;
        this.translationEdit = function (e, element) { return __awaiter(_this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof this.renderer === "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getKey(e, element)];
                    case 1:
                        key = _a.sent();
                        if (key) {
                            this.renderer.renderViewer(key);
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                    case 2:
                        console.warn("Polygloat UI is not provided. To translate interactively provide polygloat ui constructor to \"ui\" configuration property. " +
                            "To disable highlighting use production mode.");
                        return [2 /*return*/];
                }
            });
        }); };
    }
    TranslationHighlighter_1 = TranslationHighlighter;
    TranslationHighlighter.prototype.listen = function (element) {
        var _this = this;
        this.mouseEventHandler.handle(element, function (e) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.translationEdit(e, element)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
    };
    TranslationHighlighter.prototype.getKey = function (mouseEvent, element) {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = TranslationHighlighter_1.getKeyOptions(element);
                        if (!(keys.size > 1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.renderer.getKey({ keys: keys, openEvent: mouseEvent })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (keys.size === 1) {
                            return [2 /*return*/, Array.from(keys)[0]];
                        }
                        console.error("No key to translate. This seems like a bug in polygloat.");
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationHighlighter.getKeyOptions = function (node) {
        var nodes = Array.from(node._polygloat.nodes);
        var keys = nodes.reduce(function (acc, curr) {
            return __spread(acc, curr._polygloat.keys.map(function (k) { return k.key; }));
        }, []);
        return new Set(keys);
    };
    Object.defineProperty(TranslationHighlighter.prototype, "renderer", {
        get: function () {
            if (this._renderer === undefined) {
                if (typeof this.properties.config.ui === "function") {
                    this._renderer = new this.properties.config.ui({
                        coreService: this.service,
                        properties: this.properties,
                        eventService: this.eventService,
                        translationService: this.translationService
                    });
                }
            }
            return this._renderer;
        },
        enumerable: false,
        configurable: true
    });
    var TranslationHighlighter_1;
    TranslationHighlighter = TranslationHighlighter_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [CoreService_1.CoreService,
            Properties_1.Properties,
            EventService_1.EventService,
            TranslationService_1.TranslationService,
            MouseEventHandler_1.MouseEventHandler])
    ], TranslationHighlighter);
    return TranslationHighlighter;
}());
exports.TranslationHighlighter = TranslationHighlighter;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_252870__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierKey = exports.PolygloatConfig = exports.Polygloat = void 0;
__nested_webpack_require_252870__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");
__nested_webpack_require_252870__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
var Polygloat_1 = __nested_webpack_require_252870__(/*! ./Polygloat */ "./src/Polygloat.ts");
Object.defineProperty(exports, "Polygloat", { enumerable: true, get: function () { return Polygloat_1.Polygloat; } });
var PolygloatConfig_1 = __nested_webpack_require_252870__(/*! ./PolygloatConfig */ "./src/PolygloatConfig.ts");
Object.defineProperty(exports, "PolygloatConfig", { enumerable: true, get: function () { return PolygloatConfig_1.PolygloatConfig; } });
var ModifierKey_1 = __nested_webpack_require_252870__(/*! ./Constants/ModifierKey */ "./src/Constants/ModifierKey.ts");
Object.defineProperty(exports, "ModifierKey", { enumerable: true, get: function () { return ModifierKey_1.ModifierKey; } });


/***/ }),

/***/ "./src/services/ApiHttpService.ts":
/*!****************************************!*\
  !*** ./src/services/ApiHttpService.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_254165__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHttpService = void 0;
var tsyringe_1 = __nested_webpack_require_254165__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_254165__(/*! ../Properties */ "./src/Properties.ts");
var ApiHttpError_1 = __nested_webpack_require_254165__(/*! ../Errors/ApiHttpError */ "./src/Errors/ApiHttpError.ts");
var ApiHttpService = /** @class */ (function () {
    function ApiHttpService(properties) {
        this.properties = properties;
    }
    ApiHttpService_1 = ApiHttpService;
    ApiHttpService.prototype.fetch = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, url, rest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof args[0] === "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, fetch(__assign(__assign({}, args[0]), { url: this.getUrl(args[0].url) })).then(function (r) { return ApiHttpService_1.handleErrors(r); })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        _a = __read(args), url = _a[0], rest = _a.slice(1);
                        return [4 /*yield*/, fetch.apply(void 0, __spread([this.getUrl(url)], rest)).then(function (r) { return ApiHttpService_1.handleErrors(r); })];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.fetchJson = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch.apply(this, __spread(args)).then(function (res) {
                            return res.json();
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.post = function (url, body, init) {
        if (init === void 0) { init = {}; }
        var rest = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            rest[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch.apply(this, __spread([url, __assign({ body: JSON.stringify(body), method: 'POST', headers: {
                                    'Content-Type': 'application/json'
                                } }, init)], rest))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.prototype.postJson = function (url, body, init) {
        if (init === void 0) { init = {}; }
        var rest = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            rest[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post.apply(this, __spread([url, body, init], rest)).then(function (res) { return res.json(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiHttpService.handleErrors = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var error, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(response.status >= 400)) return [3 /*break*/, 5];
                        error = new ApiHttpError_1.ApiHttpError(response);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        error.code = data.code;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.warn("Polygloat server responded with invalid status code.");
                        return [3 /*break*/, 4];
                    case 4: throw error;
                    case 5: return [2 /*return*/, response];
                }
            });
        });
    };
    ApiHttpService.prototype.getUrl = function (path) {
        return this.properties.config.apiUrl + "/uaa/" + path + "?ak=" + this.properties.config.apiKey;
    };
    var ApiHttpService_1;
    ApiHttpService = ApiHttpService_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties])
    ], ApiHttpService);
    return ApiHttpService;
}());
exports.ApiHttpService = ApiHttpService;


/***/ }),

/***/ "./src/services/CoreService.ts":
/*!*************************************!*\
  !*** ./src/services/CoreService.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_264064__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreService = void 0;
var Properties_1 = __nested_webpack_require_264064__(/*! ../Properties */ "./src/Properties.ts");
var tsyringe_1 = __nested_webpack_require_264064__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var ApiHttpService_1 = __nested_webpack_require_264064__(/*! ./ApiHttpService */ "./src/services/ApiHttpService.ts");
var CoreService = /** @class */ (function () {
    function CoreService(properties, apiHttpService) {
        this.properties = properties;
        this.apiHttpService = apiHttpService;
    }
    CoreService.prototype.getLanguages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var languages, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.languagePromise instanceof Promise)) {
                            this.languagePromise = this.apiHttpService.fetchJson("languages");
                        }
                        _a = Set.bind;
                        return [4 /*yield*/, this.languagePromise];
                    case 1:
                        languages = new (_a.apply(Set, [void 0, _b.sent()]))();
                        this.properties.preferredLanguages = new Set(Array.from(this.properties.preferredLanguages).filter(function (l) { return languages.has(l); }));
                        return [2 /*return*/, languages];
                }
            });
        });
    };
    CoreService.prototype.getScopes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apiHttpService.fetchJson("scopes")];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        console.error("Error getting scopes. Trying to switch to production mode!");
                        this.properties.config.mode = "production";
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CoreService.prototype.isAuthorizedTo = function (scope) {
        return this.properties.scopes.indexOf(scope) > -1;
    };
    CoreService.prototype.checkScope = function (scope) {
        if (!this.isAuthorizedTo(scope)) {
            throw new Error("Api key not permitted to do this, please add 'translations.view' scope.");
        }
    };
    CoreService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, ApiHttpService_1.ApiHttpService])
    ], CoreService);
    return CoreService;
}());
exports.CoreService = CoreService;


/***/ }),

/***/ "./src/services/ElementRegistrar.ts":
/*!******************************************!*\
  !*** ./src/services/ElementRegistrar.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_270632__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementRegistrar = void 0;
var tsyringe_1 = __nested_webpack_require_270632__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var Properties_1 = __nested_webpack_require_270632__(/*! ../Properties */ "./src/Properties.ts");
var Global_1 = __nested_webpack_require_270632__(/*! ../Constants/Global */ "./src/Constants/Global.ts");
var TranslationHighlighter_1 = __nested_webpack_require_270632__(/*! ../highlighter/TranslationHighlighter */ "./src/highlighter/TranslationHighlighter.ts");
var NodeHelper_1 = __nested_webpack_require_270632__(/*! ../helpers/NodeHelper */ "./src/helpers/NodeHelper.ts");
var ElementRegistrar = /** @class */ (function () {
    function ElementRegistrar(properties, translationHighlighter) {
        this.properties = properties;
        this.translationHighlighter = translationHighlighter;
        this.registeredElements = new Set();
    }
    ElementRegistrar.prototype.register = function (element) {
        if (this.getActiveNodes(element).next().value === undefined) {
            throw new Error("Registered element with no nodes. This is probably an bug in Polygloat.");
        }
        if (this.properties.config.mode === "development" && !this.registeredElements.has(element)) {
            this.translationHighlighter.listen(element);
        }
        this.registeredElements.add(element);
    };
    ElementRegistrar.prototype.refreshAll = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.registeredElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var element = _c.value;
                this.cleanElementInactiveNodes(element);
                if (element._polygloat.nodes.size === 0) {
                    this.cleanElement(element);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ElementRegistrar.prototype.cleanAll = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.registeredElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var registeredElement = _c.value;
                this.cleanElement(registeredElement);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    ElementRegistrar.prototype.cleanElementInactiveNodes = function (element) {
        if (this.isElementActive(element)) {
            element._polygloat.nodes = new Set(this.getActiveNodes(element));
            return;
        }
    };
    ElementRegistrar.prototype.cleanElement = function (element) {
        if (typeof element._polygloat.removeAllEventListeners === "function") {
            element._polygloat.removeAllEventListeners();
        }
        element.removeAttribute(Global_1.POLYGLOAT_ATTRIBUTE_NAME);
        delete element._polygloat;
        this.registeredElements.delete(element);
    };
    ElementRegistrar.prototype.getActiveNodes = function (element) {
        var _a, _b, node, e_3_1;
        var e_3, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(element._polygloat.nodes), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    node = _b.value;
                    if (!NodeHelper_1.NodeHelper.nodeContains(this.properties.config.targetElement, node)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_3_1 = _d.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    ElementRegistrar.prototype.isElementActive = function (element) {
        return this.properties.config.targetElement.contains(element);
    };
    ElementRegistrar = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, TranslationHighlighter_1.TranslationHighlighter])
    ], ElementRegistrar);
    return ElementRegistrar;
}());
exports.ElementRegistrar = ElementRegistrar;


/***/ }),

/***/ "./src/services/EventEmitter.ts":
/*!**************************************!*\
  !*** ./src/services/EventEmitter.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_279021__) {

"use strict";

var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitterImpl = void 0;
var Subscription_1 = __nested_webpack_require_279021__(/*! ./Subscription */ "./src/services/Subscription.ts");
var EventEmitterImpl = /** @class */ (function () {
    function EventEmitterImpl() {
        this.idCounter = 0;
        this._subscriptions = new Map();
    }
    Object.defineProperty(EventEmitterImpl.prototype, "subscriptions", {
        get: function () {
            return this._subscriptions;
        },
        enumerable: false,
        configurable: true
    });
    EventEmitterImpl.prototype.emit = function (data) {
        var e_1, _a;
        var promiseReturns = [];
        try {
            for (var _b = __values(this.subscriptions.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var callback = _c.value;
                var returned = callback(data);
                if (typeof (returned === null || returned === void 0 ? void 0 : returned["then"]) === "function") {
                    promiseReturns.push(returned);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (promiseReturns.length === 0) {
            return;
        }
        return new Promise(function (resolve) { return Promise.all(promiseReturns).then(function () { return resolve(); }); });
    };
    EventEmitterImpl.prototype.subscribe = function (callback) {
        var _this = this;
        var newId = this.idCounter++;
        var subscription = new Subscription_1.Subscription(function () { return _this.unsubscribe(newId); });
        this.subscriptions.set(newId, callback);
        return subscription;
    };
    EventEmitterImpl.prototype.unsubscribe = function (id) {
        var wasPresent = this._subscriptions.delete(id);
        if (!wasPresent) {
            console.warn("Event to unsubscribe was not found");
        }
    };
    return EventEmitterImpl;
}());
exports.EventEmitterImpl = EventEmitterImpl;


/***/ }),

/***/ "./src/services/EventService.ts":
/*!**************************************!*\
  !*** ./src/services/EventService.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_281936__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
var tsyringe_1 = __nested_webpack_require_281936__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var EventEmitter_1 = __nested_webpack_require_281936__(/*! ./EventEmitter */ "./src/services/EventEmitter.ts");
var EventService = /** @class */ (function () {
    function EventService() {
        this.TRANSLATION_CHANGED = new EventEmitter_1.EventEmitterImpl();
        this.LANGUAGE_CHANGED = new EventEmitter_1.EventEmitterImpl();
        this.LANGUAGE_LOADED = new EventEmitter_1.EventEmitterImpl();
    }
    EventService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped)
    ], EventService);
    return EventService;
}());
exports.EventService = EventService;


/***/ }),

/***/ "./src/services/Subscription.ts":
/*!**************************************!*\
  !*** ./src/services/Subscription.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
var Subscription = /** @class */ (function () {
    function Subscription(onUnsubscribe) {
        this.onUnsubscribe = onUnsubscribe;
    }
    Subscription.prototype.unsubscribe = function () {
        this.onUnsubscribe();
    };
    return Subscription;
}());
exports.Subscription = Subscription;


/***/ }),

/***/ "./src/services/TextService.ts":
/*!*************************************!*\
  !*** ./src/services/TextService.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_284250__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextService = void 0;
var tsyringe_1 = __nested_webpack_require_284250__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationService_1 = __nested_webpack_require_284250__(/*! ./TranslationService */ "./src/services/TranslationService.ts");
var Properties_1 = __nested_webpack_require_284250__(/*! ../Properties */ "./src/Properties.ts");
var TextHelper_1 = __nested_webpack_require_284250__(/*! ../helpers/TextHelper */ "./src/helpers/TextHelper.ts");
var TextService = /** @class */ (function () {
    function TextService(properties, translationService) {
        var _this = this;
        this.properties = properties;
        this.translationService = translationService;
        this.replaceParams = function (translation, params) {
            var result = translation;
            var regExp = function (name) { return new RegExp("\\{\\{\\s*" + _this.escapeForRegExp(name) + "\\s*\\}\\}", "g"); };
            Object.entries(params).forEach(function (_a) {
                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                return result = result.replace(regExp(name), value);
            });
            return result;
        };
        this.escapeForRegExp = function (string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        this.escapeParam = function (string) { return string.replace(/[,:\\]/gs, "\\$&"); };
    }
    TextService_1 = TextService;
    TextService.prototype.translate = function (key, params, lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.replaceParams;
                        return [4 /*yield*/, this.translationService.getTranslation(key, lang)];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent(), params])];
                }
            });
        });
    };
    TextService.prototype.instant = function (key, params, lang, orEmpty) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return this.replaceParams(this.translationService.getFromCacheOrFallback(key, lang, orEmpty), params);
    };
    TextService.prototype.replace = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var matchRegexp, keysAndParams, matched, translated, withoutEscapes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matchRegexp = new RegExp(this.rawUnWrapRegex, "gs");
                        return [4 /*yield*/, this.translationService.loadTranslations()];
                    case 1:
                        _a.sent();
                        keysAndParams = [];
                        matched = false;
                        translated = text.replace(matchRegexp, function (_, pre, wrapped, unwrapped, position) {
                            if (pre === "\\") {
                                if (!TextHelper_1.TextHelper.isCharEscaped(position, text)) {
                                    return pre + wrapped;
                                }
                            }
                            var translated = _this.getTranslatedWithMetadata(unwrapped);
                            keysAndParams.push({ key: translated.key, params: translated.params });
                            matched = true;
                            return pre + translated.translated;
                        });
                        withoutEscapes = TextHelper_1.TextHelper.removeEscapes(translated);
                        if (matched) {
                            return [2 /*return*/, { text: withoutEscapes, keys: keysAndParams }];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    TextService.prototype.wrap = function (key, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var paramString = Object.entries(params).map(function (_a) {
            var _b = __read(_a, 2), name = _b[0], value = _b[1];
            return _this.escapeParam(name) + ":" + _this.escapeParam(value);
        }).join(",");
        paramString = paramString.length ? ":" + paramString : "";
        return "" + this.properties.config.inputPrefix + this.escapeParam(key) + paramString + this.properties.config.inputSuffix;
    };
    TextService.prototype.getTranslatedWithMetadata = function (text) {
        var _a = TextService_1.parseUnwrapped(text), key = _a.key, params = _a.params;
        var translated = this.instant(key, params, undefined, false);
        return { translated: translated, key: key, params: params };
    };
    TextService.parseUnwrapped = function (unWrappedString) {
        var strings = unWrappedString.match(/(?:[^\\,:\n]|\\.)+/g);
        var result = { key: TextHelper_1.TextHelper.removeEscapes(strings.shift()), params: {} };
        while (strings.length) {
            var _a = __read(strings.splice(0, 2), 2), name_1 = _a[0], value = _a[1];
            result.params[name_1] = value;
        }
        return result;
    };
    Object.defineProperty(TextService.prototype, "rawUnWrapRegex", {
        get: function () {
            var escapedPrefix = this.escapeForRegExp(this.properties.config.inputPrefix);
            var escapedSuffix = this.escapeForRegExp(this.properties.config.inputSuffix);
            return "(\\\\?)(" + escapedPrefix + "(.*?)" + escapedSuffix + ")";
        },
        enumerable: false,
        configurable: true
    });
    var TextService_1;
    TextService = TextService_1 = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties, TranslationService_1.TranslationService])
    ], TextService);
    return TextService;
}());
exports.TextService = TextService;


/***/ }),

/***/ "./src/services/TranslationService.ts":
/*!********************************************!*\
  !*** ./src/services/TranslationService.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __nested_webpack_require_294410__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
var tsyringe_1 = __nested_webpack_require_294410__(/*! tsyringe */ "./node_modules/tsyringe/dist/esm5/index.js");
var TranslationData_1 = __nested_webpack_require_294410__(/*! ../DTOs/TranslationData */ "./src/DTOs/TranslationData.ts");
var Properties_1 = __nested_webpack_require_294410__(/*! ../Properties */ "./src/Properties.ts");
var CoreService_1 = __nested_webpack_require_294410__(/*! ./CoreService */ "./src/services/CoreService.ts");
var ApiHttpService_1 = __nested_webpack_require_294410__(/*! ./ApiHttpService */ "./src/services/ApiHttpService.ts");
var TextHelper_1 = __nested_webpack_require_294410__(/*! ../helpers/TextHelper */ "./src/helpers/TextHelper.ts");
var ApiHttpError_1 = __nested_webpack_require_294410__(/*! ../Errors/ApiHttpError */ "./src/Errors/ApiHttpError.ts");
var EventService_1 = __nested_webpack_require_294410__(/*! ./EventService */ "./src/services/EventService.ts");
var TranslationService = /** @class */ (function () {
    function TranslationService(properties, coreService, apiHttpService, eventService) {
        var _this = this;
        this.properties = properties;
        this.coreService = coreService;
        this.apiHttpService = apiHttpService;
        this.eventService = eventService;
        this.translationsCache = new Map();
        this.fetchPromises = [];
        this.getTranslationsOfKey = function (key, languages) {
            if (languages === void 0) { languages = new Set([_this.properties.currentLanguage]); }
            return __awaiter(_this, void 0, void 0, function () {
                var data, e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.coreService.checkScope("translations.view");
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 6]);
                            return [4 /*yield*/, this.apiHttpService.postJson("keyTranslations/" + Array.from(languages).join(","), { key: key })];
                        case 2:
                            data = _b.sent();
                            return [2 /*return*/, new TranslationData_1.TranslationData(key, data)];
                        case 3:
                            e_1 = _b.sent();
                            if (!(e_1 instanceof ApiHttpError_1.ApiHttpError)) return [3 /*break*/, 5];
                            if (!(e_1.response.status === 404)) return [3 /*break*/, 5];
                            if (!(e_1.code === "language_not_found")) return [3 /*break*/, 5];
                            _a = this.properties;
                            return [4 /*yield*/, this.coreService.getLanguages()];
                        case 4:
                            _a.preferredLanguages = _b.sent();
                            console.error("Requested language not found, refreshing the page!");
                            location.reload();
                            return [2 /*return*/];
                        case 5: throw e_1;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
    }
    TranslationService.prototype.loadTranslations = function (lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.translationsCache.get(lang) == undefined)) return [3 /*break*/, 2];
                        if (!(this.fetchPromises[lang] instanceof Promise)) {
                            this.fetchPromises[lang] = this.fetchTranslations(lang);
                        }
                        return [4 /*yield*/, this.fetchPromises[lang]];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.fetchPromises[lang] = undefined;
                        this.eventService.LANGUAGE_LOADED.emit(lang);
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getTranslation = function (name, lang) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.getFromCache(name, lang)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadTranslations(lang)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.getFromCacheOrFallback(name, lang)];
                }
            });
        });
    };
    TranslationService.prototype.setTranslations = function (translationData) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.coreService.checkScope("translations.edit");
                        return [4 /*yield*/, this.apiHttpService.post('', translationData)];
                    case 1:
                        _a.sent();
                        Object.keys(translationData.translations).forEach(function (lang) {
                            if (_this.translationsCache.get(lang)) { // if the language is not loaded, then ignore the change
                                var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(translationData.key, ".");
                                var root = _this.translationsCache.get(lang);
                                for (var i = 0; i < path.length; i++) {
                                    var item = path[i];
                                    if (root[item] === undefined) {
                                        root[item] = {};
                                    }
                                    if (i === (path.length - 1)) {
                                        root[item] = translationData.translations[lang];
                                        return;
                                    }
                                    root = root[item];
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getFromCacheOrFallback = function (name, lang, orEmpty) {
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        if (orEmpty === void 0) { orEmpty = false; }
        var translatedText = this.getFromCache(name, lang) || this.getFromCache(name, this.properties.config.fallbackLanguage);
        if (translatedText) {
            return translatedText;
        }
        if (orEmpty) {
            return "";
        }
        var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(name, ".");
        return path[path.length - 1];
    };
    TranslationService.prototype.fetchTranslations = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.properties.config.mode === "development")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchTranslationsDevelopment(lang)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.fetchTranslationsProduction(lang)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TranslationService.prototype.fetchTranslationsProduction = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            var result, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("" + (this.properties.config.filesUrlPrefix || "/") + lang + ".json")];
                    case 1:
                        result = _a.sent();
                        if (result.status >= 400) {
                            //on error set language data as empty object to not break the flow
                            this.translationsCache.set(lang, {});
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, result.json()];
                    case 2:
                        data = (_a.sent());
                        this.translationsCache.set(lang, data);
                        return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.fetchTranslationsDevelopment = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.coreService.checkScope("translations.view");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apiHttpService.fetchJson("" + lang)];
                    case 2:
                        data = _a.sent();
                        this.translationsCache.set(lang, data[lang] || {});
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        this.translationsCache.set(lang, {});
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.getFromCache = function (name, lang) {
        var e_3, _a;
        if (lang === void 0) { lang = this.properties.currentLanguage; }
        var path = TextHelper_1.TextHelper.splitOnNonEscapedDelimiter(name, ".");
        var root = this.translationsCache.get(lang);
        //if lang is not downloaded or does not exist at all
        if (root === undefined) {
            return undefined;
        }
        try {
            for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
                var item = path_1_1.value;
                if (root[item] === undefined) {
                    return undefined;
                }
                root = root[item];
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return root;
    };
    TranslationService = __decorate([
        tsyringe_1.scoped(tsyringe_1.Lifecycle.ContainerScoped),
        __metadata("design:paramtypes", [Properties_1.Properties,
            CoreService_1.CoreService,
            ApiHttpService_1.ApiHttpService,
            EventService_1.EventService])
    ], TranslationService);
    return TranslationService;
}());
exports.TranslationService = TranslationService;


/***/ })

/******/ });
//# sourceMappingURL=polygloat.window.js.map

/***/ }),

/***/ "./apps/base/index.js":
/*!****************************!*\
  !*** ./apps/base/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_polygloat_core_dist_polygloat_umd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/@polygloat/core/dist/polygloat.umd */ "../../packages/core/dist/polygloat.umd.js");
/* harmony import */ var _node_modules_polygloat_core_dist_polygloat_umd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_polygloat_core_dist_polygloat_umd__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_polygloat_core_dist_polygloat_commonjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/@polygloat/core/dist/polygloat.commonjs */ "../../packages/core/dist/polygloat.commonjs.js");
/* harmony import */ var _node_modules_polygloat_core_dist_polygloat_window__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/@polygloat/core/dist/polygloat.window */ "../../packages/core/dist/polygloat.window.js");
/* harmony import */ var _node_modules_polygloat_core_dist_polygloat_window__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_polygloat_core_dist_polygloat_window__WEBPACK_IMPORTED_MODULE_2__);




[_node_modules_polygloat_core_dist_polygloat_umd__WEBPACK_IMPORTED_MODULE_0__, _node_modules_polygloat_core_dist_polygloat_commonjs__WEBPACK_IMPORTED_MODULE_1__["@polygloat/core"], window["@polygloat/core"]].forEach(bundle => {
    const bundleDivElement = document.createElement("div");

    const polygloat = new bundle.Polygloat({watch: true, targetElement: bundleDivElement});


    bundleDivElement.setAttribute("id", bundle);

    document.body.append(bundleDivElement);

    const htmlParagraphElement = document.createElement("p");

    bundleDivElement.append(htmlParagraphElement);

    polygloat.run().then(() => {
        polygloat.translate("test").then(t => {
            htmlParagraphElement.append(t);
            bundleDivElement.append("%-%polygloat:test%-%")
        });
    });
})


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./apps/base/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=index_bundle.js.map