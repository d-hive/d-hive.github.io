"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve2, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ../utils/src/numbers.ts
  function roundTo(v, factor) {
    return Math.round(v * factor) / factor;
  }

  // ../../node_modules/.pnpm/rgb-hex@4.0.1/node_modules/rgb-hex/index.js
  function rgbHex(red, green, blue, alpha) {
    const isPercent = (red + (alpha || "")).toString().includes("%");
    if (typeof red === "string") {
      [red, green, blue, alpha] = red.match(/(0?\.?\d+)%?\b/g).map((component) => Number(component));
    } else if (alpha !== void 0) {
      alpha = Number.parseFloat(alpha);
    }
    if (typeof red !== "number" || typeof green !== "number" || typeof blue !== "number" || red > 255 || green > 255 || blue > 255) {
      throw new TypeError("Expected three numbers below 256");
    }
    if (typeof alpha === "number") {
      if (!isPercent && alpha >= 0 && alpha <= 1) {
        alpha = Math.round(255 * alpha);
      } else if (isPercent && alpha >= 0 && alpha <= 100) {
        alpha = Math.round(255 * alpha / 100);
      } else {
        throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
      }
      alpha = (alpha | 1 << 8).toString(16).slice(1);
    } else {
      alpha = "";
    }
    return (blue | green << 8 | red << 16 | 1 << 24).toString(16).slice(1) + alpha;
  }

  // ../utils/src/array.ts
  function filterEmpty(arr) {
    return arr.filter(notEmpty);
  }
  function notEmpty(value) {
    return value !== null && value !== void 0;
  }

  // ../utils/src/assert.ts
  function shouldNotHappen(txt) {
    console.warn(txt);
    if (true) {
      debugger;
    }
  }

  // ../figma-to-html/src/variables.ts
  function isAlias(v) {
    return typeof v === "object" && v.type === "VARIABLE_ALIAS";
  }

  // ../utils/src/analytics/index.ts
  var _Analytics = class {
    constructor(def) {
      this.def = def;
    }
    addDefault(def) {
      if (this.def) {
        if (this.def.properties) {
          const { properties, ...rest } = def;
          Object.assign(this.def.properties, properties);
          def = rest;
        }
        Object.assign(this.def, def);
      } else {
        this.def = { ...def };
      }
    }
    resetDefault() {
      this.def = void 0;
    }
    transformOptions(options) {
      if (!options)
        return;
      const { country, userAgent } = options;
      const transformed = {};
      if (country)
        transformed.co = country;
      if (userAgent)
        transformed.ua = userAgent;
      return transformed;
    }
    async feature_test(feature, data) {
      if ("feature" in data) {
        console.error(
          "`feature` is a reserved property for feature_test tracking."
        );
        return;
      }
      return this.track("feature-test", {
        properties: {
          feature,
          ...data
        }
      });
    }
    async exception(name, error, details) {
      if (true) {
        console.error(`Analytics.exception(): ${name}`, error, details);
      }
      const properties = {
        name
      };
      if (details)
        properties.details = typeof details === "string" ? details : JSON.stringify(details);
      return this.track("exception", {
        error,
        properties
      });
    }
    catcher(name, details) {
      return (error) => {
        this.exception(name, error, details);
      };
    }
    unhandled(name, cb) {
      try {
        const ret = cb();
        if (ret && typeof ret === "object" && "catch" in ret) {
          return ret.catch(this.catcher(name));
        }
        return ret;
      } catch (error) {
        this.exception(name, error);
      }
    }
    async track(event, payloadPartial = {}, options) {
      const properties = this.def?.properties ? Object.assign(payloadPartial.properties || {}, this.def.properties) : payloadPartial.properties || {};
      if (payloadPartial.error) {
        const error = payloadPartial.error;
        properties.error_message = error.message || String(error);
        properties.error_stack = getStackTrace(error);
        delete payloadPartial.error;
      }
      const payload = {
        event,
        ...this.def,
        ...payloadPartial,
        ...{ version: "c29fccc7c1b06ff44b05" },
        properties,
        options: this.transformOptions(options)
      };
      if (!payload.product) {
        console.error("Analytics.track(): `product` property is missing.");
        return;
      }
      const tryFetch = async (url, logOnError) => {
        try {
          await fetch(`${url}/pa`, {
            method: "POST",
            body: JSON.stringify(payload)
          });
          return true;
        } catch (e) {
          if (logOnError) {
            console.error(
              `Analytics.track(): Unexpected error on event ${event}.`,
              e
            );
          }
        }
        return false;
      };
      if (_Analytics.serviceUrl) {
        await tryFetch(_Analytics.serviceUrl, true);
      } else {
        const urls = [..._Analytics.SHARED_SERVICE_URLS];
        while (urls.length) {
          const url = urls.shift();
          if (await tryFetch(url, !urls.length)) {
            _Analytics.serviceUrl = url;
            return;
          }
        }
        if (!_Analytics.serviceUrl)
          _Analytics.serviceUrl = _Analytics.SHARED_SERVICE_URLS[0];
      }
    }
  };
  var Analytics = _Analytics;
  Analytics.SHARED_SERVICE_URLS = false ? ["https://api.divriots.com", "https://api-eu.divriots.com"] : void 0 ? ["http://localhost:5001/dev-shared-services/us-central1/api"] : [
    "https://api-oddhqn4pmq-uc.a.run.app",
    "https://apieu-oddhqn4pmq-ew.a.run.app"
  ];
  var GlobalAnalytics = class extends Analytics {
    constructor() {
      super({});
      this.isInitialized = false;
    }
    initialize(def) {
      this.addDefault(def);
      this.isInitialized = true;
    }
  };
  var analytics = new GlobalAnalytics();
  var getStackTrace = (err) => {
    if (err.stack) {
      let stack = err.stack;
      if (err.cause) {
        const causeStack = getStackTrace(err.cause);
        stack += `
Caused by ${causeStack}`;
      }
      return stack;
    }
    return "";
  };

  // ../../node_modules/.pnpm/@create-figma-plugin+utilities@2.3.0_patch_hash=n536iktdewgu7v5byxuxdojvfq/node_modules/@create-figma-plugin/utilities/lib/events.js
  var eventHandlers = {};
  var currentId = 0;
  function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function() {
      delete eventHandlers[id];
    };
  }
  function once(name, handler) {
    let done = false;
    const dispose = on(name, function(...args) {
      if (done === true) {
        return;
      }
      done = true;
      dispose();
      handler(...args);
    });
    return dispose;
  }
  function invokeEventHandler(name, args) {
    for (const id in eventHandlers) {
      if (eventHandlers[id].name === name) {
        eventHandlers[id].handler.apply(null, args);
      }
    }
  }
  if (typeof window === "undefined") {
    figma.ui.onmessage = function([name, ...args]) {
      invokeEventHandler(name, args);
    };
  } else {
    window.addEventListener("message", function(event) {
      if (typeof event.data.pluginMessage === "undefined") {
        return;
      }
      const [name, ...args] = event.data.pluginMessage;
      invokeEventHandler(name, args);
    });
  }

  // ../figma-plugin-core-v2/src/events.ts
  var pluginId;
  var cfp_emit = typeof window === "undefined" ? function(name, ...args) {
    figma.ui.postMessage([name, ...args]);
  } : function(name, ...args) {
    if (pluginId) {
      window.parent.postMessage(
        {
          pluginMessage: [name, ...args],
          pluginId
        },
        "https://www.figma.com"
      );
    } else {
      window.parent.postMessage(
        {
          pluginMessage: [name, ...args]
        },
        "*"
      );
    }
  };
  function emit2(name, ...args) {
    if (true) {
      console.log(`EMIT`, name, args);
    }
    cfp_emit(name, ...args);
  }
  var requestId = 0;
  function genericEmitRequest(name, ...args) {
    const id = requestId++;
    return new Promise((resolve2, reject) => {
      once(`${String(name)}-response-${id}`, (response) => {
        if ("error" in response) {
          const { message, stack, name: name2 } = response.error;
          const localError = new Error(message);
          if (name2)
            localError.name = name2;
          localError.cause = new CustomError(message, stack);
          reject(localError);
        } else {
          resolve2(response.result);
        }
      });
      emit2(String(name), [id, ...args]);
    });
  }
  function genericEmitRequester() {
    return (name, ...args) => {
      return genericEmitRequest(name, ...args);
    };
  }
  var CustomError = class extends Error {
    constructor(message, stack) {
      super(message);
      this.stack = stack;
    }
  };

  // ../figma-plugin-core-v2/src/code/pluginData.ts
  var requestZstd = genericEmitRequester();

  // ../figma-to-html/src/helpers.ts
  function rgbaToString(rgba) {
    if ("a" in rgba) {
      const a = roundTo(rgba.a, 100);
      if (a !== 1)
        return `rgba(${rgba.r},${rgba.g},${rgba.b},${a})`;
    }
    const hex = rgbHex(rgba.r, rgba.g, rgba.b);
    if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
      return `#${hex[0]}${hex[2]}${hex[4]}`;
    }
    return `#${hex}`;
  }
  function figmaRgbaToCssRgba(color) {
    const { r, g, b, a = 1 } = color;
    return {
      r: roundTo(r * 255, 1),
      g: roundTo(g * 255, 1),
      b: roundTo(b * 255, 1),
      a
    };
  }
  function toPx(v) {
    return `${roundTo(v, 10)}px`;
  }
  function toPercent(v) {
    return `${roundTo(v, 10)}%`;
  }
  function valueToString(v) {
    switch (typeof v) {
      case "object":
        if (isAlias(v)) {
          return `var(${v.id})`;
        }
        if ("r" in v) {
          return rgbaToString(figmaRgbaToCssRgba(v));
        }
      case "string":
      case "number":
      case "boolean":
      default:
        return String(v);
    }
  }
  function templateId(id) {
    return "T" + id;
  }

  // ../figma-to-html/src/mapping/triggers.ts
  var reaction_types = [
    "appear",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mouseup",
    "timeout",
    "click",
    "press",
    "drag",
    "keydown",
    "hover"
  ];

  // ../utils/src/functions.ts
  function once2(run2) {
    if (!run2)
      return;
    return (...args) => {
      if (!run2)
        return;
      const toRun2 = run2;
      run2 = void 0;
      return toRun2(...args);
    };
  }

  // src/lifecycle.ts
  var isBoundElement = (e) => e instanceof HTMLElement || e instanceof SVGElement;
  function onDisconnected(e, cb) {
    if (!e.parentElement)
      return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations.filter((m) => m.type === "childList"))
        for (const node of mutation.removedNodes)
          if (node === e) {
            cb == null ? void 0 : cb();
            observer.disconnect();
          }
    });
    observer.observe(e.parentElement, { childList: true });
  }
  function onConnected(selector, cb) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations.filter((m) => m.type === "childList"))
        for (const n of mutation.addedNodes)
          if (isBoundElement(n) && n.matches(selector))
            onDisconnected(n, cb(n));
    });
    observer.observe(document, { childList: true, subtree: true });
    return () => observer.disconnect();
  }

  // ../figma-to-html/src/mapping/utils.ts
  var customVideoElements = /* @__PURE__ */ new Set([
    "youtube-video",
    "vimeo-video",
    "spotify-audio",
    "jwplayer-video",
    "videojs-video",
    "wistia-video",
    "cloudflare-video",
    "hls-video",
    "shaka-video",
    "dash-video"
  ]);

  // src/runtime/videos.ts
  function isVideoElement(elt2) {
    return customVideoElements.has(elt2.tagName.toLowerCase()) || elt2.tagName === "VIDEO";
  }
  function isYoutubeIframe(elt2) {
    if (elt2.tagName !== "IFRAME")
      return false;
    const src = elt2.src;
    return (src.includes("youtube.com") || src.includes("youtube-nocookie.com")) && src.includes("enablejsapi=1");
  }
  var YoutubeController = class {
    constructor(iframe) {
      this.iframe = iframe;
      this.info = {};
      this.messageListener = null;
      this.loaded = new Promise((resolve2) => {
        const loadListener = () => {
          this.iframe.removeEventListener("load", loadListener);
          setTimeout(() => {
            this.requestYoutubeListening();
          });
        };
        this.iframe.addEventListener("load", loadListener);
        this.messageListener = (event) => {
          if (event.source === this.iframe.contentWindow && event.data) {
            let eventData;
            try {
              eventData = JSON.parse(event.data);
            } catch (e) {
              console.error("YoutubeController messageListener", e);
              return;
            }
            if (eventData.event === "onReady") {
              this.iframe.removeEventListener("load", loadListener);
            }
            if (eventData.info) {
              Object.assign(this.info, eventData.info);
              resolve2(true);
            }
          }
        };
        window.addEventListener("message", this.messageListener);
        this.requestYoutubeListening();
      });
    }
    sendYoutubeMessage(_0) {
      return __async(this, arguments, function* (func, args = []) {
        var _a;
        yield this.loaded;
        (_a = this.iframe.contentWindow) == null ? void 0 : _a.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      });
    }
    requestYoutubeListening() {
      var _a;
      (_a = this.iframe.contentWindow) == null ? void 0 : _a.postMessage(
        JSON.stringify({ event: "listening" }),
        "*"
      );
    }
    get muted() {
      return this.info.muted;
    }
    get volume() {
      return this.info.volume;
    }
    set muted(value) {
      if (value)
        this.sendYoutubeMessage("mute");
      else
        this.sendYoutubeMessage("unMute");
    }
    get currentTime() {
      return this.info.currentTime;
    }
    set currentTime(value) {
      this.sendYoutubeMessage("seekTo", [value, true]);
    }
    get paused() {
      return this.info.playerState === 2;
    }
    play() {
      this.sendYoutubeMessage("playVideo");
    }
    pause() {
      this.sendYoutubeMessage("pauseVideo");
    }
    static from(elt2) {
      return elt2.f2w_yt_controller || (elt2.f2w_yt_controller = new YoutubeController(elt2));
    }
  };
  function getController(elt2) {
    if (isVideoElement(elt2))
      return elt2;
    if (isYoutubeIframe(elt2))
      return YoutubeController.from(elt2);
  }
  function toggleMute(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.muted = !controller.muted;
        return () => {
          controller.muted = !controller.muted;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function mute(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.muted = true;
        return () => {
          controller.muted = false;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function unMute(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.muted = false;
        return () => {
          controller.muted = true;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function play(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.play();
        return () => controller.pause();
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function pause(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.pause();
        return () => controller.play();
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function togglePlay(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        if (controller.paused)
          controller.play();
        else
          controller.pause();
        return () => {
          if (controller.paused)
            controller.play();
          else
            controller.pause();
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function seekTo(elt2, time) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.currentTime = time;
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function seekForward(elt2, seconds) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.currentTime += seconds;
        return () => {
          controller.currentTime -= seconds;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function seekBackward(elt2, seconds) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.currentTime -= seconds;
        return () => {
          controller.currentTime += seconds;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }

  // ../utils/src/navigator.ts
  function isSafari() {
    const ua = navigator.userAgent;
    return ua.includes("Safari") && !ua.includes("Chrome");
  }

  // ../utils/src/styles/index.ts
  function isAbsoluteOrFixed(position) {
    return position === "absolute" || position === "fixed";
  }

  // src/runtime/animator.ts
  var safari = isSafari();
  function setPropertiesWithAnimate(elt2, props, pseudo) {
    elt2.animate(
      __spreadValues({}, props),
      {
        pseudoElement: pseudo,
        iterations: 1,
        duration: 0,
        fill: "forwards"
      }
    );
  }
  function toObj(p) {
    return Object.fromEntries(p.map((it) => [it.camelKey, [it.from, it.to]]));
  }
  function animateProps(elt2, props, easing, duration2, containersToReOrder) {
    const parent = elt2.parentElement;
    const computedStyles = getComputedStyle(elt2);
    const parentStyles = getComputedStyle(parent);
    const parentDisplay = parentStyles.display;
    const isFlexOrGrid = parentDisplay.endsWith("flex") || parentDisplay.endsWith("grid");
    const isAbsolute = isAbsoluteOrFixed(computedStyles.position);
    const currentProps = props.map((it) => __spreadProps(__spreadValues({}, it), {
      camelKey: it.key.startsWith("--") ? it.key : it.key.replace(/-([a-z])/g, (_, l) => l.toUpperCase())
    }));
    const attrProps = {};
    const nProps = currentProps.filter((it) => {
      if (it.pseudo)
        return false;
      if (it.key.startsWith("--f2w-attr-")) {
        attrProps[it.key.slice(11)] = it.to;
        return false;
      }
      return true;
    });
    const nPropsObj = toObj(nProps);
    const bPropsObj = toObj(
      currentProps.filter((it) => it.pseudo === "::before")
    );
    const aPropsObj = toObj(currentProps.filter((it) => it.pseudo === "::after"));
    let displayAfterAnimation = void 0;
    if (nPropsObj.display) {
      if (nPropsObj.display[0] === "none") {
        elt2.style.display = String(nPropsObj.display[1]);
      } else if (nPropsObj.display[1] === "none") {
        if (isFlexOrGrid && !isAbsolute) {
          elt2.style.display = "none";
        }
      }
      displayAfterAnimation = String(nPropsObj.display[1]);
      delete nPropsObj.display;
    }
    if (safari) {
      setStyle(elt2, nPropsObj, "overflow");
      setStyle(elt2, nPropsObj, "rowGap", "gridRowGap");
    }
    let f2wOrder = +getComputedStyle(elt2).getPropertyValue("--f2w-order");
    if (nPropsObj["--f2w-order"]) {
      const to = nPropsObj["--f2w-order"][1];
      f2wOrder = to === void 0 ? NaN : +to;
      if (!isNaN(f2wOrder)) {
        elt2.style.setProperty("--f2w-order", String(f2wOrder));
      }
      delete nPropsObj["--f2w-order"];
    }
    if (!isNaN(f2wOrder)) {
      containersToReOrder.add(parent);
    }
    if (nPropsObj["--f2w-img-src"]) {
      let i = elt2.f2w_image_lazy_loader;
      const src = nPropsObj["--f2w-img-src"][1];
      if (!i) {
        elt2.f2w_image_lazy_loader = i = new Image();
        i.decoding = "sync";
        i.onload = () => {
          elt2.decoding = "sync";
          elt2.setAttribute("src", src);
          delete elt2.f2w_image_lazy_loader;
        };
      }
      i.src = src;
      delete nPropsObj["--f2w-img-src"];
    }
    if (nPropsObj["$innerHTML"]) {
      elt2.innerHTML = String(nPropsObj["$innerHTML"][1]);
      delete nPropsObj["$innerHTML"];
    }
    for (const [k, v] of Object.entries(attrProps)) {
      elt2.setAttribute(k, String(v));
    }
    if (nPropsObj.left && nPropsObj.right) {
      if (nPropsObj.left[1] === "revert" && nPropsObj.right[0] === "revert") {
        const { right: parentRight } = parent.getBoundingClientRect();
        const { right } = elt2.getBoundingClientRect();
        const rightStr = toPx(parentRight - right);
        setPropertiesWithAnimate(elt2, { left: "revert", right: rightStr });
        delete nPropsObj.left;
        nPropsObj.right[0] = rightStr;
      } else if (nPropsObj.left[0] === "revert" && nPropsObj.right[1] === "revert") {
        const { left: parentLeft } = parent.getBoundingClientRect();
        const { left } = elt2.getBoundingClientRect();
        const leftStr = toPx(left - parentLeft);
        setPropertiesWithAnimate(elt2, { right: "revert", left: leftStr });
        delete nPropsObj.right;
        nPropsObj.left[0] = leftStr;
      }
    }
    if (nPropsObj.top && nPropsObj.bottom) {
      if (nPropsObj.top[1] === "revert" && nPropsObj.bottom[0] === "revert") {
        const { bottom: parentBottom } = parent.getBoundingClientRect();
        const { bottom } = elt2.getBoundingClientRect();
        const bottomStr = toPx(parentBottom - bottom);
        setPropertiesWithAnimate(elt2, { top: "revert", bottom: bottomStr });
        delete nPropsObj.top;
        nPropsObj.bottom[0] = bottomStr;
      } else if (nPropsObj.top[0] === "revert" && nPropsObj.bottom[1] === "revert") {
        const { top: parentTop } = parent.getBoundingClientRect();
        const { top } = elt2.getBoundingClientRect();
        const topStr = toPx(top - parentTop);
        setPropertiesWithAnimate(elt2, { bottom: "revert", top: topStr });
        delete nPropsObj.bottom;
        nPropsObj.top[0] = topStr;
      }
    }
    const hasBgImage = !!nPropsObj["backgroundImage"];
    if (hasBgImage) {
      nProps.filter((it) => it.key.startsWith("background-")).forEach((it) => {
        elt2.style.setProperty(it.key, String(it.to));
        delete nPropsObj[it.camelKey];
      });
    }
    for (const [pseudo, obj] of [
      ["before", bPropsObj],
      ["after", aPropsObj]
    ]) {
      if (obj.display) {
        if (obj.display[1] === "none") {
          elt2.classList.remove(pseudo + "-visible");
          elt2.classList.add(pseudo + "-hidden");
        } else {
          elt2.classList.remove(pseudo + "-hidden");
          elt2.classList.add(pseudo + "-visible");
        }
      }
    }
    const anim = (toAnimate, pseudo, force = false) => {
      if (!force && !Object.keys(toAnimate).length)
        return;
      return elt2.animate(
        __spreadValues({
          easing
        }, toAnimate),
        {
          pseudoElement: pseudo,
          iterations: 1,
          duration: duration2,
          fill: "both"
        }
      );
    };
    const a = anim(nPropsObj, void 0, !!displayAfterAnimation);
    if (displayAfterAnimation) {
      a.finished.then(() => {
        elt2.style.display = displayAfterAnimation;
      });
    }
    anim(bPropsObj, "::before");
    anim(aPropsObj, "::after");
  }
  var setStyle = (e, o, ...props) => {
    const p = props.find((p2) => p2 in o);
    if (!p)
      return;
    e.style[props[0]] = String(o[p][1]);
    delete o[p];
  };

  // src/runtime/animations.ts
  function getMoveInAnimations(eltId, overlayPositionType2, transition2) {
    if (transition2.direction === "LEFT") {
      if (overlayPositionType2 === "BOTTOM_LEFT" || overlayPositionType2 === "TOP_LEFT") {
        return [
          {
            eltId,
            props: [
              {
                key: "left",
                from: "100%",
                to: "0%"
              }
            ]
          }
        ];
      } else if (overlayPositionType2 === "BOTTOM_RIGHT" || overlayPositionType2 === "TOP_RIGHT") {
        return [
          {
            eltId,
            props: [
              {
                key: "translate",
                from: "100% 0px",
                to: "0px 0px"
              }
            ]
          }
        ];
      } else {
        const ty = overlayPositionType2 === "CENTER" ? "-50%" : "0px";
        return [
          {
            eltId,
            props: [
              {
                key: "left",
                from: "100%",
                to: "50%"
              },
              {
                key: "translate",
                from: `0px ${ty}`,
                to: `-50% ${ty}`
              }
            ]
          }
        ];
      }
    } else if (transition2.direction === "RIGHT") {
      if (overlayPositionType2 === "BOTTOM_LEFT" || overlayPositionType2 === "TOP_LEFT") {
        return [
          {
            eltId,
            props: [
              {
                key: "translate",
                from: "-100% 0px",
                to: "0px 0px"
              }
            ]
          }
        ];
      } else if (overlayPositionType2 === "BOTTOM_RIGHT" || overlayPositionType2 === "TOP_RIGHT") {
        return [
          {
            eltId,
            props: [
              {
                key: "right",
                from: "100%",
                to: "0px"
              }
            ]
          }
        ];
      } else {
        const ty = overlayPositionType2 === "CENTER" ? "-50%" : "0px";
        return [
          {
            eltId,
            props: [
              {
                key: "left",
                from: "0px",
                to: "50%"
              },
              {
                key: "translate",
                from: `-100% ${ty}`,
                to: `-50% ${ty}`
              }
            ]
          }
        ];
      }
    } else if (transition2.direction === "TOP") {
      if (overlayPositionType2 === "BOTTOM_LEFT" || overlayPositionType2 === "BOTTOM_RIGHT" || overlayPositionType2 === "BOTTOM_CENTER") {
        const tx = overlayPositionType2 === "BOTTOM_CENTER" ? "-50%" : "0px";
        return [
          {
            eltId,
            props: [
              {
                key: "translate",
                from: `${tx} 100%`,
                to: `${tx} 0px`
              }
            ]
          }
        ];
      } else if (overlayPositionType2 === "TOP_LEFT" || overlayPositionType2 === "TOP_RIGHT" || overlayPositionType2 === "TOP_CENTER") {
        return [
          {
            eltId,
            props: [
              {
                key: "top",
                from: "100%",
                to: "0px"
              }
            ]
          }
        ];
      } else {
        return [
          {
            eltId,
            props: [
              {
                key: "top",
                from: "100%",
                to: "50%"
              },
              {
                key: "translate",
                from: `-50% 0%`,
                to: `-50% -50%`
              }
            ]
          }
        ];
      }
    } else if (transition2.direction === "BOTTOM") {
      if (overlayPositionType2 === "BOTTOM_LEFT" || overlayPositionType2 === "BOTTOM_RIGHT" || overlayPositionType2 === "BOTTOM_CENTER") {
        return [
          {
            eltId,
            props: [
              {
                key: "bottom",
                from: "100%",
                to: "0px"
              }
            ]
          }
        ];
      } else if (overlayPositionType2 === "TOP_LEFT" || overlayPositionType2 === "TOP_RIGHT" || overlayPositionType2 === "TOP_CENTER") {
        const tx = overlayPositionType2 === "TOP_CENTER" ? "-50%" : "0px";
        return [
          {
            eltId,
            props: [
              {
                key: "translate",
                from: `${tx} -100%`,
                to: `${tx} 0px`
              }
            ]
          }
        ];
      } else {
        return [
          {
            eltId,
            props: [
              {
                key: "top",
                from: "0px",
                to: "50%"
              },
              {
                key: "translate",
                from: `-50% -100%`,
                to: `-50% -50%`
              }
            ]
          }
        ];
      }
    } else {
      console.warn("Unsupported transition:", transition2);
    }
    return [];
  }

  // src/runtime_embed.ts
  var allReactions = () => window.F2W_REACTIONS;
  var allVariables = () => window.F2W_VARIABLES;
  var collectionModeBps = () => window.F2W_COLLECTION_MODE_BPS;
  var getColModes = (col) => {
    var _a, _b;
    return (_b = (_a = window.F2W_COLLECTION_VARS) == null ? void 0 : _a[col]) != null ? _b : {};
  };
  var getColVariables = (col, mode) => getColModes(col)[mode];
  function setVariable(id, value) {
    allVariables()[id] = value;
    const str = valueToString(value);
    document.body.style.setProperty(id, str);
    const attr = `data${id.slice(1)}`;
    if (document.body.hasAttribute(attr)) {
      document.body.setAttribute(attr, str);
    }
    document.dispatchEvent(
      new CustomEvent("f2w-set-variable", {
        detail: { id, value, str }
      })
    );
  }
  function setCollectionAttrAndVariables(colName, modeName) {
    var _a;
    document.body.setAttribute(`data-${colName}`, modeName);
    const vars = (_a = getColVariables(colName, modeName)) != null ? _a : {};
    for (const [id, value] of Object.entries(vars)) {
      setVariable(id, value);
    }
  }
  function setVariableMode(name, modeName) {
    setCollectionAttrAndVariables(name, modeName);
    saveMode(name, modeName);
  }
  function saveMode(name, modeName) {
    var _a, _b;
    if ((_a = window.F2W_COLOR_SCHEMES) == null ? void 0 : _a.includes(name)) {
      localStorage == null ? void 0 : localStorage.setItem(COLOR_SCHEME_KEY, modeName);
    } else if ((_b = window.F2W_LANGUAGES) == null ? void 0 : _b.includes(name)) {
      localStorage == null ? void 0 : localStorage.setItem(LANG_KEY, modeName);
      const alternate = Array.from(
        document.head.querySelectorAll('link[rel="alternate"]')
      ).find((it) => it.hreflang === modeName);
      if (alternate) {
        history.replaceState(null, "", new URL(alternate.href).pathname);
      }
    }
  }
  function toFloat(v) {
    if (typeof v === "number")
      return v;
    if (typeof v === "boolean")
      return v ? 1 : 0;
    if (typeof v === "string")
      return parseFloat(v);
    return 0;
  }
  function toString(v) {
    return String(v);
  }
  function toBoolean(v) {
    if (typeof v === "string")
      return v === "true";
    return !!v;
  }
  function resolve(value, rootId) {
    var _a, _b;
    if (value === void 0)
      return false;
    if (isAlias(value)) {
      return resolve(allVariables()[value.id]);
    }
    if (typeof value === "object" && "expressionArguments" in value) {
      const args = value.expressionArguments.map((it) => it.value).filter((it) => it !== void 0).map((it) => resolve(it, rootId));
      const resolvedType = (_b = (_a = value.expressionArguments[0]) == null ? void 0 : _a.resolvedType) != null ? _b : "STRING";
      switch (value.expressionFunction) {
        case "ADDITION":
          return resolvedType === "FLOAT" ? args.map(toFloat).reduce((a, b) => a + b) : args.map(toString).reduce((a, b) => a + b);
        case "SUBTRACTION":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) - toFloat(args[1]);
        case "DIVISION":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) / toFloat(args[1]);
        case "MULTIPLICATION":
          return args.map(toFloat).reduce((a, b) => a * b);
        case "NEGATE":
          if (args.length !== 1)
            throw new Error("Invalid expression");
          return -toFloat(args[0]);
        case "GREATER_THAN":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) > toFloat(args[1]);
        case "GREATER_THAN_OR_EQUAL":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) >= toFloat(args[1]);
        case "LESS_THAN":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) < toFloat(args[1]);
        case "LESS_THAN_OR_EQUAL":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) <= toFloat(args[1]);
        case "EQUALS":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return resolvedType === "FLOAT" ? toFloat(args[0]) === toFloat(args[1]) : resolvedType === "BOOLEAN" ? toBoolean(args[0]) === toBoolean(args[1]) : toString(args[0]) === toString(args[1]);
        case "NOT_EQUAL":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return resolvedType === "FLOAT" ? toFloat(args[0]) !== toFloat(args[1]) : resolvedType === "BOOLEAN" ? toBoolean(args[0]) !== toBoolean(args[1]) : toString(args[0]) !== toString(args[1]);
        case "AND":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toBoolean(args[0]) && toBoolean(args[1]);
        case "OR":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toBoolean(args[0]) || toBoolean(args[1]);
        case "NOT":
          if (args.length !== 1)
            throw new Error("Invalid expression");
          return !toBoolean(args[0]);
        case "VAR_MODE_LOOKUP":
        default:
          console.warn(
            `Expression not implemented yet: ${value.expressionFunction}`
          );
          return false;
      }
    } else {
      return value;
    }
  }
  function actionsToRun(actions, bound2, trigger2) {
    const runs = actions.map((it) => toRunWithDragCleanup(it, bound2, trigger2));
    return (e, i) => {
      const reverts = runs.map((it) => it(e, i)).filter((it) => !!it);
      if (reverts.length)
        return (e2, i2) => reverts.forEach((it) => it(e2, i2));
    };
  }
  function toRunWithDragCleanup(action2, bound2, trigger2) {
    while (action2.type === "ALIAS") {
      action2 = allReactions()[action2.alias];
    }
    const run2 = toRun(action2, bound2, trigger2);
    return (e) => {
      if (action2.type !== "ANIMATE" && trigger2 === "drag") {
        const d = e.detail;
        if (!d.handled) {
          d.handled = true;
          return run2(e);
        }
      }
      if (drag_started)
        return;
      if (action2.type === "ANIMATE" && action2.rootId) {
        const root = document.getElementById(action2.rootId);
        if (root == null ? void 0 : root.parentElement) {
          const revert = once2(run2(e));
          if (revert) {
            let el = root == null ? void 0 : root.parentElement;
            while (el) {
              (el.f2w_reset || (el.f2w_reset = [])).push(revert);
              el = el.parentElement;
              if ((el == null ? void 0 : el.tagName) === "BODY")
                break;
            }
          }
          return revert;
        }
      }
      return run2(e);
    };
  }
  function toRun(action, bound, trigger) {
    var _a, _b;
    switch (action.type) {
      case "BACK":
        return () => {
          var _a2;
          return ((_a2 = window.F2W_PREVIEW_BACK) != null ? _a2 : history.back)();
        };
      case "JS":
        return () => eval(action.code);
      case "URL":
        return () => {
          if (action.openInNewTab) {
            window.open(action.url, "_blank");
          } else {
            window.F2W_PREVIEW_NAVIGATE ? window.F2W_PREVIEW_NAVIGATE(action.url) : location.assign(action.url);
          }
        };
      case "SET_VARIABLE":
        const { variableId, variableValue } = action;
        if (variableId && (variableValue == null ? void 0 : variableValue.value) !== void 0)
          return () => setVariable(variableId, resolve(variableValue.value, variableId));
        break;
      case "SET_VARIABLE_MODE":
        const { variableCollectionName, variableModeName } = action;
        if (variableCollectionName && variableModeName)
          return () => setVariableMode(variableCollectionName, variableModeName);
        break;
      case "CONDITIONAL":
        const blocks = action.conditionalBlocks.map((v) => {
          const run2 = actionsToRun(v.actions, bound, trigger);
          const { condition } = v;
          const test = condition ? () => toBoolean(resolve(condition.value)) : () => true;
          return { test, run: run2 };
        });
        return () => {
          const reverts = [];
          for (const block of blocks) {
            if (block.test()) {
              const revert = block.run();
              if (revert)
                reverts.push(revert);
              break;
            }
          }
          if (reverts.length)
            return (e) => reverts.forEach((it) => it(e));
        };
      case "KEY_CONDITION":
        const run = actionsToRun(action.actions, bound, trigger);
        const keyCode = action.keyCodes[0];
        const shiftKey = action.keyCodes.slice(1).includes(16);
        const ctrlKey = action.keyCodes.slice(1).includes(17);
        const altKey = action.keyCodes.slice(1).includes(18);
        const metaKey = action.keyCodes.slice(1).includes(91);
        return (e) => {
          if (e instanceof KeyboardEvent) {
            if (e.keyCode !== keyCode)
              return;
            if (e.ctrlKey !== ctrlKey)
              return;
            if (e.altKey !== altKey)
              return;
            if (e.metaKey !== metaKey)
              return;
            if (e.shiftKey !== shiftKey)
              return;
            e.preventDefault();
            e.stopPropagation();
            run(e);
          }
        };
      case "CLOSE_OVERLAY": {
        if (action.self)
          return (e) => {
            var _a2, _b2;
            return (_b2 = (_a2 = e == null ? void 0 : e.target) == null ? void 0 : _a2.f2w_close) == null ? void 0 : _b2.call(_a2);
          };
        if (action.overlayId) {
          const overlay2 = document.getElementById(action.overlayId);
          if (!overlay2)
            break;
          return () => {
            var _a2;
            return (_a2 = overlay2.f2w_close) == null ? void 0 : _a2.call(overlay2);
          };
        }
        break;
      }
      case "SCROLL_TO":
        if (!action.destinationId)
          break;
        const elt = document.getElementById(action.destinationId);
        if (!elt)
          break;
        return (e) => {
          var _a2;
          if ((e == null ? void 0 : e.currentTarget) instanceof HTMLAnchorElement)
            e == null ? void 0 : e.preventDefault();
          elt.scrollIntoView({
            behavior: ((_a2 = action.transition) == null ? void 0 : _a2.type) ? "smooth" : "instant"
          });
        };
      case "OVERLAY":
        if (!action.destinationId)
          break;
        const overlay = document.getElementById(action.destinationId);
        if (!overlay)
          break;
        const modal = Array(...overlay.children).find(
          (it) => it.tagName !== "TEMPLATE"
        );
        if (!modal)
          break;
        const { transition, overlayPositionType, overlayRelativePosition } = action;
        const duration = Math.round(1e3 * ((_a = transition == null ? void 0 : transition.duration) != null ? _a : 0));
        const animations = [
          {
            eltId: action.destinationId,
            props: [
              { key: "visibility", from: "hidden", to: "visible" },
              { key: "opacity", from: "0", to: "1" }
            ]
          }
        ];
        if (overlayPositionType === "MANUAL") {
          return () => {
            var _a2, _b2, _c;
            if (trigger === "hover") {
              const leave = (_a2 = bound.f2w_mouseleave_remove) == null ? void 0 : _a2.call(bound);
              if (leave) {
                const mousemove = (event) => {
                  if (isOutside(event, bound) && isOutside(event, modal)) {
                    leave();
                    document.removeEventListener("mousemove", mousemove);
                  }
                };
                document.addEventListener("mousemove", mousemove);
              }
            }
            const dynamic_animations = animations.slice(0);
            const manualLeft = toPx(
              bound.getBoundingClientRect().left + ((_b2 = overlayRelativePosition == null ? void 0 : overlayRelativePosition.x) != null ? _b2 : 0)
            );
            const manualTop = toPx(
              bound.getBoundingClientRect().top + ((_c = overlayRelativePosition == null ? void 0 : overlayRelativePosition.y) != null ? _c : 0)
            );
            modal.style.setProperty("left", manualLeft);
            modal.style.setProperty("top", manualTop);
            if ((transition == null ? void 0 : transition.type) === "MOVE_IN") {
              if (transition.direction === "LEFT") {
                dynamic_animations.push({
                  eltId: modal.id,
                  props: [
                    {
                      key: "left",
                      from: "100%",
                      to: manualLeft
                    }
                  ]
                });
              } else if (transition.direction === "RIGHT") {
                dynamic_animations.push({
                  eltId: modal.id,
                  props: [
                    {
                      key: "left",
                      from: "0px",
                      to: manualLeft
                    },
                    {
                      key: "translate",
                      from: "-100% 0px",
                      to: "0px 0px"
                    }
                  ]
                });
              } else if (transition.direction === "TOP") {
                dynamic_animations.push({
                  eltId: modal.id,
                  props: [
                    {
                      key: "top",
                      from: "100%",
                      to: manualTop
                    }
                  ]
                });
              } else if (transition.direction === "BOTTOM") {
                dynamic_animations.push({
                  eltId: modal.id,
                  props: [
                    {
                      key: "top",
                      from: "0px",
                      to: manualTop
                    },
                    {
                      key: "translate",
                      from: "0px -100%",
                      to: "0px 0px"
                    }
                  ]
                });
              }
            }
            return toExecutableAnimations(
              dynamic_animations,
              transition == null ? void 0 : transition.easing,
              duration,
              bound,
              trigger,
              `${trigger}(manual_overlay)`,
              overlay
            )();
          };
        }
        if ((transition == null ? void 0 : transition.type) === "MOVE_IN") {
          animations.push(
            ...getMoveInAnimations(modal.id, overlayPositionType, transition)
          );
        } else if (transition == null ? void 0 : transition.type) {
          console.warn("Unsupported transition:", transition);
        }
        return toExecutableAnimations(
          animations,
          transition == null ? void 0 : transition.easing,
          duration,
          bound,
          trigger,
          `${trigger}(overlay)`,
          overlay
        );
      case "ANIMATE": {
        const { animations: animations2, transition: transition2, rootId, reset } = action;
        const duration2 = Math.round(1e3 * ((_b = transition2 == null ? void 0 : transition2.duration) != null ? _b : 0));
        const run2 = toExecutableAnimations(
          animations2,
          transition2 == null ? void 0 : transition2.easing,
          duration2,
          bound,
          trigger,
          reset ? `${trigger}(+reset)` : trigger
        );
        return reset && rootId ? (e, i) => {
          const root = document.getElementById(rootId);
          if (root) {
            const { f2w_reset } = root;
            if (f2w_reset == null ? void 0 : f2w_reset.length) {
              delete root.f2w_reset;
              f2w_reset.reverse().forEach((it) => it(void 0, true));
            }
          }
          return run2(e, i);
        } : run2;
      }
      case "UPDATE_MEDIA_RUNTIME": {
        if (!action.destinationId)
          break;
        const elt2 = document.getElementById(action.destinationId);
        if (!elt2)
          break;
        switch (action.mediaAction) {
          case "MUTE":
            return mute(elt2);
          case "UNMUTE":
            return unMute(elt2);
          case "TOGGLE_MUTE_UNMUTE":
            return toggleMute(elt2);
          case "PLAY":
            return play(elt2);
          case "PAUSE":
            return pause(elt2);
          case "TOGGLE_PLAY_PAUSE":
            return togglePlay(elt2);
          case "SKIP_BACKWARD":
            return seekBackward(elt2, action.amountToSkip);
          case "SKIP_FORWARD":
            return seekForward(elt2, action.amountToSkip);
          case "SKIP_TO":
            return seekTo(elt2, action.newTimestamp);
        }
      }
      default:
        return () => console.warn("Action not implemented yet: " + action.type);
    }
    return () => {
    };
  }
  var overlayStackZIndex = 9999;
  function toExecutableAnimations(origAnimations, easing = "linear", duration2, bound2, trigger2, debug, modal2) {
    return (e) => {
      let animations2 = origAnimations;
      if (modal2) {
        document.body.parentElement.style.overflow = "hidden";
        animations2 = [
          {
            eltId: modal2.id,
            props: [{ key: "z-index", from: 0, to: overlayStackZIndex++ }]
          },
          ...animations2
        ];
      }
      const reverseAnimations = executeAnimations(
        animations2,
        easing,
        duration2,
        bound2,
        trigger2,
        debug,
        e
      );
      const close = once2((_, i) => {
        if (modal2) {
          overlayStackZIndex--;
          document.body.parentElement.style.overflow = "";
        }
        executeAnimations(
          reverseAnimations,
          easing,
          i ? 0 : duration2,
          bound2,
          trigger2,
          `${debug}(revert)`
        );
      });
      if (modal2)
        modal2.f2w_close = close;
      return close;
    };
  }
  var eltToAltMappings = /* @__PURE__ */ new Map();
  function executeAnimations(animations2, easing, duration2, bound2, trigger2, debug, e) {
    var _a, _b, _c;
    if (true) {
      console.debug(`Executing animations (${debug})`, animations2, bound2);
    }
    const reverse = [];
    const containersToReOrder = /* @__PURE__ */ new Set();
    if (trigger2 === "drag") {
      executeDragStart(
        animations2,
        easing,
        duration2,
        bound2,
        e.detail
      );
      return [];
    }
    for (const { eltId, altId, props, reactions } of animations2) {
      let elt2 = document.getElementById(eltId);
      if (!elt2) {
        const eltId2 = eltToAltMappings.get(eltId);
        if (eltId2) {
          elt2 = document.getElementById(eltId2);
        }
      }
      if (!elt2) {
        shouldNotHappen(`Can't find element for id: ${eltId}`);
        continue;
      }
      if (altId) {
        let alt = document.getElementById(altId);
        if (!alt) {
          const altTpl = document.getElementById(templateId(altId));
          if (!altTpl) {
            shouldNotHappen(`Can't find template for id: ${altId}`);
            continue;
          }
          const altFragment = (_a = altTpl.content) == null ? void 0 : _a.cloneNode(
            true
          );
          alt = altFragment.querySelector("*");
        }
        const { f2w_mouseup } = elt2;
        const mouseleave = (_b = elt2.f2w_mouseleave_remove) == null ? void 0 : _b.call(elt2);
        if (mouseleave) {
          installMouseLeave(alt, mouseleave);
        }
        if (f2w_mouseup)
          alt.addEventListener("mouseup", f2w_mouseup);
        if (mouseleave || f2w_mouseup) {
          removePointerEventsNone(alt);
        }
        hook(alt, true, duration2);
        if (duration2) {
          elt2.insertAdjacentElement("afterend", alt);
          animateProps(
            elt2,
            [
              {
                key: "display",
                from: getComputedStyle(elt2).display,
                to: "none"
              }
            ],
            easing,
            duration2,
            containersToReOrder
          );
          animateProps(
            alt,
            [
              {
                key: "opacity",
                from: 0,
                to: "revert-layer"
              },
              {
                key: "display",
                from: "none",
                to: "revert-layer"
              }
            ],
            easing,
            duration2,
            containersToReOrder
          );
        } else {
          elt2.parentElement.replaceChild(alt, elt2);
          let eltTpl = document.getElementById(templateId(eltId));
          if (!eltTpl) {
            if (true) {
              console.debug(`Backing up element before swap, id: ${eltId}`);
            }
            eltTpl = document.createElement("template");
            eltTpl.id = templateId(eltId);
            eltTpl.innerHTML = elt2.outerHTML;
            alt.insertAdjacentElement("afterend", eltTpl);
          }
          eltToAltMappings.set(eltId, alt.id);
        }
        reverse.push({
          eltId: alt.id,
          altId: elt2.id
        });
        if (!isNaN(+getComputedStyle(alt).getPropertyValue("--f2w-order"))) {
          containersToReOrder.add(alt.parentElement);
        }
      } else {
        const currentProps = (props || []).map((it) => {
          const from = mapCurrent(elt2, it.key, it.from);
          const to = mapCurrent(elt2, it.key, it.to);
          return {
            key: it.key,
            pseudo: it.pseudo,
            from,
            to
          };
        }).filter((it) => it.from !== it.to);
        animateProps(elt2, currentProps, easing, duration2, containersToReOrder);
        if (reactions) {
          if (trigger2 !== "hover") {
            (_c = elt2.f2w_mouseleave_remove) == null ? void 0 : _c.call(elt2);
          }
          reactions.forEach((it) => hookElt(elt2, it.type, it.to, duration2));
        }
        const rev = {
          eltId,
          props: currentProps.map((p) => {
            const ret = {
              key: p.key,
              from: p.to,
              to: p.from
            };
            if (p.pseudo)
              ret.pseudo = p.pseudo;
            return ret;
          })
        };
        if (reactions) {
          rev.reactions = reactions.map((it) => ({
            type: it.type,
            from: it.to,
            to: it.from
          }));
        }
        reverse.push(rev);
      }
    }
    for (const container of containersToReOrder) {
      const children = Array.from(container.children).map((it, i) => ({ it, i }));
      let orderHasChanged = false;
      children.sort((a, b) => {
        const aOrder = +(getComputedStyle(a.it).getPropertyValue("--f2w-order") || "99999");
        const bOrder = +(getComputedStyle(b.it).getPropertyValue("--f2w-order") || "99999");
        return aOrder - bOrder;
      }).forEach((child, j) => {
        if (orderHasChanged) {
          container.appendChild(child.it);
        } else {
          orderHasChanged = j !== child.i;
        }
      });
    }
    return reverse;
  }
  function removePointerEventsNone(elt2) {
    let e = elt2;
    while (e) {
      e.classList.remove("pointer-events-none");
      e = e.parentElement;
    }
  }
  function executeDragStart(animations2, easing, duration2, bound2, dragging) {
    if (dragging.handled)
      return;
    const rect1 = bound2.getBoundingClientRect();
    const rev = executeAnimations(
      animations2.filter((it) => it.props).map(({ eltId, props }) => ({ eltId, props })),
      "linear",
      0,
      bound2,
      "click",
      `drag_start(tmp)`
    );
    const rect2 = bound2.getBoundingClientRect();
    const diffX = rect2.left - rect1.left;
    const diffY = rect2.top - rect1.top;
    const length = Math.sqrt(diffX * diffX + diffY * diffY);
    executeAnimations(rev, "linear", 0, bound2, "click", `drag_start(tmp undo)`);
    const { x: distX, y: distY } = getDistance(dragging.start, dragging.end);
    const acceptsDragDirection = distX > 0 && diffX > 0 || distX < 0 && diffX < 0 || diffX === 0 && (distY > 0 && diffY > 0 || distY < 0 && diffY < 0);
    if (acceptsDragDirection) {
      dragging.handled = true;
      const dragAnims = animations2.map((it) => {
        var _a;
        return __spreadProps(__spreadValues({}, it), {
          swapped: false,
          props: (_a = it.props) == null ? void 0 : _a.map((p) => __spreadProps(__spreadValues({}, p), { curr: p.from }))
        });
      });
      const getPercent = (d) => {
        const { x: distX2, y: distY2 } = getDistance(d.start, d.end);
        const dist = (distX2 * diffX + distY2 * diffY) / length;
        return Math.max(0, Math.min(100, 100 * dist / length));
      };
      const move = (d) => {
        d.end.preventDefault();
        d.end.stopPropagation();
        const percent = getPercent(d);
        executeAnimations(
          filterEmpty(
            dragAnims.map((it) => {
              const _a = it, { reactions: _ } = _a, rest = __objRest(_a, ["reactions"]);
              if (it.props) {
                return __spreadProps(__spreadValues({}, rest), {
                  props: it.props.map((p) => {
                    const to = interpolate(p, percent);
                    const from = p.curr;
                    p.curr = to;
                    return __spreadProps(__spreadValues({}, p), {
                      from,
                      to
                    });
                  })
                });
              }
              if (it.altId) {
                if (percent < 50 && it.swapped) {
                  it.swapped = false;
                  return { altId: it.eltId, eltId: it.altId };
                }
                if (percent >= 50 && !it.swapped) {
                  it.swapped = true;
                  return rest;
                }
              }
              return void 0;
            })
          ),
          "linear",
          0,
          bound2,
          "click",
          `dragging`
        );
      };
      move(dragging);
      bound2.f2w_drag_listener = (d) => {
        move(d);
        if (d.finished) {
          const percent = getPercent(d);
          executeAnimations(
            filterEmpty(
              dragAnims.map((it) => {
                if (it.props) {
                  const reactions = percent < 50 ? void 0 : it.reactions;
                  return {
                    eltId: it.eltId,
                    props: it.props.map((p) => __spreadProps(__spreadValues({}, p), {
                      from: p.curr,
                      to: percent < 50 ? p.from : p.to
                    })),
                    reactions
                  };
                }
                if (it.altId) {
                  if (percent < 50 && it.swapped) {
                    it.swapped = false;
                    return { altId: it.eltId, eltId: it.altId };
                  }
                  if (percent >= 50 && !it.swapped) {
                    it.swapped = true;
                    return it;
                  }
                }
                return void 0;
              })
            ),
            easing,
            duration2,
            bound2,
            "click",
            `drag_end`
          );
        }
      };
    }
  }
  function mapCurrent(elt2, key, v) {
    if (v !== "$current")
      return v;
    return getComputedStyle(elt2).getPropertyValue(key);
  }
  function hook(root, withRoot = false, fromAnimationDuration = 0) {
    for (const type of reaction_types) {
      for (const elt2 of querySelectorAllExt(
        root,
        `[data-reaction-${type}]`,
        withRoot
      )) {
        hookElt(
          elt2,
          type,
          elt2.getAttribute(`data-reaction-${type}`),
          fromAnimationDuration
        );
      }
    }
  }
  function querySelectorAllExt(root, sel, includeRoot = false) {
    const ret = [...root.querySelectorAll(sel)];
    if (includeRoot && root.matches(sel)) {
      ret.unshift(root);
    }
    return ret;
  }
  function hookElt(elt2, type, v = "", fromAnimationDuration = 0) {
    var _a;
    if (!v) {
      if (type !== "hover") {
        if (true) {
          console.debug(`Cleanup hooks ${type} on`, elt2);
        }
        cleanupEventListener(elt2, type);
        return;
      }
    }
    let delay = 0;
    if (v[0] === "T") {
      const idx = v.indexOf("ms");
      delay = parseFloat(v.slice(1, idx)) || 0;
      v = v.slice(idx + 3);
    }
    const reactions = allReactions();
    const actions = filterEmpty(v.split(",").map((id) => reactions[id]));
    if (true) {
      console.debug(`Setup hook ${type} on`, elt2, `->`, actions);
    }
    const run2 = actionsToRun(actions, elt2, type);
    if (type === "timeout") {
      setTimeoutWithCleanup(elt2, () => run2(), delay + fromAnimationDuration);
      return;
    }
    removePointerEventsNone(elt2);
    if (type === "press") {
      let revert = void 0;
      const mouseup = () => {
        revert == null ? void 0 : revert();
        revert = void 0;
      };
      elt2.f2w_mouseup = mouseup;
      addEventListenerWithCleanup(
        elt2,
        "mousedown",
        (e) => {
          revert == null ? void 0 : revert();
          revert = run2(e);
        },
        type,
        attachListener(elt2, "mouseup", mouseup)
      );
    } else if (type === "drag") {
      addEventListenerWithCleanup(
        elt2,
        "dragging",
        (e) => {
          run2(e);
        },
        type
      );
    } else if (type === "hover") {
      let revert = void 0;
      const runIfNotAlready = (e) => {
        if (!revert)
          revert = once2(run2(e));
      };
      const prev = (_a = elt2.f2w_mouseleave_remove) == null ? void 0 : _a.call(elt2);
      const mouseleave = () => {
        revert == null ? void 0 : revert();
        revert = void 0;
        prev == null ? void 0 : prev();
      };
      const timerId = setTimeout(() => {
        if (elt2.matches(":hover")) {
          if (!revert) {
            console.log(`Forcing hover on timeout`);
          }
          runIfNotAlready();
        }
      }, fromAnimationDuration);
      const mouseleave_remove = installMouseLeave(elt2, mouseleave, timerId);
      addEventListenerWithCleanup(
        elt2,
        "mouseenter",
        runIfNotAlready,
        type,
        mouseleave_remove
      );
    } else {
      if (type === "keydown" && !elt2.getAttribute("tabindex")) {
        elt2.setAttribute("tabindex", "-1");
      }
      if (type === "appear") {
        appearObserver.observe(elt2);
      }
      addEventListenerWithCleanup(
        elt2,
        type,
        (e) => {
          if (type !== "keydown") {
            e.stopPropagation();
          }
          if (delay)
            setTimeout(() => run2(e), delay);
          else
            run2(e);
        },
        type
      );
    }
  }
  function installMouseLeave(elt2, mouseleave, timerId = 0) {
    const unsub = attachListener(elt2, "mouseleave", mouseleave);
    const mouseleave_remove = () => {
      unsub();
      clearTimeout(timerId);
      if (elt2.f2w_mouseleave === mouseleave)
        delete elt2.f2w_mouseleave;
      if (elt2.f2w_mouseleave_remove === mouseleave_remove)
        delete elt2.f2w_mouseleave_remove;
      return mouseleave;
    };
    elt2.f2w_mouseleave = mouseleave;
    return elt2.f2w_mouseleave_remove = mouseleave_remove;
  }
  function isOutside({ clientX, clientY }, bound2) {
    const BOUNDS_XTRA_PIXELS = 2;
    const { top, left, right, bottom } = bound2.getBoundingClientRect();
    return clientX > right + BOUNDS_XTRA_PIXELS || clientX < left - BOUNDS_XTRA_PIXELS || clientY > bottom + BOUNDS_XTRA_PIXELS || clientY < top - BOUNDS_XTRA_PIXELS;
  }
  function cleanupFnKeyForType(type) {
    return `f2w_cleanup_${type}`;
  }
  function setTimeoutWithCleanup(elt2, fn, delay) {
    var _a;
    const timerId = setTimeout(fn, delay);
    (_a = elt2.f2w_cleanup_timeout) == null ? void 0 : _a.call(elt2);
    elt2.f2w_cleanup_timeout = () => {
      delete elt2.f2w_cleanup_timeout;
      clearTimeout(timerId);
    };
  }
  function cleanupEventListener(elt2, typeForCleanup) {
    var _a;
    const cleanupKey = cleanupFnKeyForType(typeForCleanup);
    (_a = elt2[cleanupKey]) == null ? void 0 : _a.call(elt2);
  }
  function addEventListenerWithCleanup(elt2, type, listener, typeForCleanup, ...extraCleanupFns) {
    var _a;
    const cleanups = [...extraCleanupFns, attachListener(elt2, type, listener)];
    const cleanupKey = cleanupFnKeyForType(typeForCleanup);
    (_a = elt2[cleanupKey]) == null ? void 0 : _a.call(elt2);
    elt2[cleanupKey] = () => {
      delete elt2[cleanupKey];
      cleanups.forEach((it) => it());
    };
  }
  function attachListener(elt2, type, listener, options) {
    const my_listener = (e) => {
      if (type !== "mousemove") {
        console.debug(
          `${elt2.isConnected ? "Handling" : "Ignoring"} ${type} on`,
          e.target
        );
      }
      if (!elt2.isConnected)
        return;
      listener(e);
    };
    elt2.addEventListener(type, my_listener, options);
    return () => {
      elt2.removeEventListener(type, my_listener, options);
    };
  }
  var COLOR_SCHEME_KEY = "f2w-color-scheme";
  var LANG_KEY = "f2w-lang";
  window.F2W_THEME_SWITCH = (theme) => {
    var _a;
    return (_a = window.F2W_COLOR_SCHEMES) == null ? void 0 : _a.forEach(
      (colName) => setCollectionAttrAndVariables(colName, theme)
    );
  };
  if (window.F2W_COLOR_SCHEMES) {
    const matchMediaQuery = matchMedia("(prefers-color-scheme: dark)").matches;
    const systemPreference = matchMediaQuery ? "dark" : "light";
    const userPreference = localStorage == null ? void 0 : localStorage.getItem(COLOR_SCHEME_KEY);
    onConnected("body", () => {
      var _a, _b;
      const previewPreference = document.body.getAttribute("data-preview-theme");
      const colorScheme = (_a = previewPreference != null ? previewPreference : userPreference) != null ? _a : systemPreference;
      (_b = window.F2W_THEME_SWITCH) == null ? void 0 : _b.call(window, colorScheme);
    });
  }
  if (window.F2W_LANGUAGES) {
    let userPreference = localStorage == null ? void 0 : localStorage.getItem(LANG_KEY);
    onConnected("body", () => {
      var _a, _b, _c;
      const alternates = Array.from(
        document.head.querySelectorAll('link[rel="alternate"]')
      );
      const isDefault = alternates.length === 0 || alternates.some(
        (it) => it.getAttribute("hreflang") === "x-default" && it.getAttribute("href") === window.location.href
      );
      if (!isDefault) {
        userPreference = document.documentElement.lang;
      }
      const is404 = (_b = (_a = document.head.querySelector('link[rel="canonical"]')) == null ? void 0 : _a.href) == null ? void 0 : _b.endsWith("/404/");
      (_c = window.F2W_LANGUAGES) == null ? void 0 : _c.forEach((colName) => {
        var _a2;
        const choices = Object.fromEntries(
          Object.entries(getColModes(colName)).map(([k]) => [k.toLowerCase(), k])
        );
        const langs = [...navigator.languages];
        if (userPreference)
          langs.unshift(userPreference);
        for (let lang of langs) {
          lang = lang.toLowerCase();
          const code = lang.split("-")[0];
          const modeValue = (_a2 = choices[lang]) != null ? _a2 : choices[code];
          if (modeValue) {
            setCollectionAttrAndVariables(colName, modeValue);
            if (!is404)
              saveMode(colName, modeValue);
            break;
          }
        }
      });
    });
  }
  var currentCollectionModes = {};
  var collectionModeBpsSorted = Object.entries(collectionModeBps()).map(
    ([collectionName, v]) => ({
      collectionName,
      breakpoints: Object.entries(v).map(([name, { minWidth }]) => ({ name, minWidth })).sort(({ minWidth: a }, { minWidth: b }) => a - b)
    })
  );
  function updateCollectionModes() {
    var _a;
    const width = ((_a = window.visualViewport) == null ? void 0 : _a.width) || window.innerWidth;
    for (const { collectionName, breakpoints } of collectionModeBpsSorted) {
      const bps = [...breakpoints];
      let newMode = bps.splice(0, 1)[0].name;
      for (const { name, minWidth } of bps) {
        if (width >= minWidth)
          newMode = name;
      }
      if (newMode !== currentCollectionModes[collectionName]) {
        setCollectionAttrAndVariables(collectionName, newMode);
        currentCollectionModes[collectionName] = newMode;
      }
    }
  }
  var drag_started = false;
  onConnected("body", () => {
    let drag_start = void 0;
    let suppress_click = false;
    attachListener(document, "mousedown", (e) => {
      drag_start = e;
      drag_started = false;
    });
    attachListener(document, "mousemove", (e) => {
      var _a, _b, _c;
      if (drag_start && getDistance(drag_start, e).dist > 2) {
        const dragging = {
          start: drag_start,
          end: e
        };
        if (!drag_started) {
          (_a = drag_start.target) == null ? void 0 : _a.dispatchEvent(
            new CustomEvent("dragging", { detail: dragging })
          );
          drag_started = true;
          suppress_click = true;
        } else {
          (_c = (_b = drag_start.target) == null ? void 0 : _b.f2w_drag_listener) == null ? void 0 : _c.call(_b, dragging);
        }
      }
    });
    attachListener(document, "mouseup", (e) => {
      var _a, _b;
      if (drag_start && drag_started) {
        (_b = (_a = drag_start.target) == null ? void 0 : _a.f2w_drag_listener) == null ? void 0 : _b.call(_a, {
          start: drag_start,
          end: e,
          finished: true
        });
      }
      drag_start = void 0;
      drag_started = false;
    });
    attachListener(document, "mouseup", (e) => {
      var _a, _b;
      if (drag_start && drag_started) {
        (_b = (_a = drag_start.target) == null ? void 0 : _a.f2w_drag_listener) == null ? void 0 : _b.call(_a, {
          start: drag_start,
          end: e,
          finished: true
        });
      }
      drag_start = void 0;
      drag_started = false;
    });
    attachListener(
      document,
      "click",
      (e) => {
        if (suppress_click) {
          suppress_click = false;
          e.preventDefault();
          e.stopPropagation();
        }
      },
      { capture: true }
    );
    updateCollectionModes();
    window.addEventListener("resize", updateCollectionModes);
  });
  addEventListener("DOMContentLoaded", () => hook(document));
  addEventListener("DOMContentLoaded", () => {
    if ("mediumZoom" in window) {
      const zoom = mediumZoom("[data-zoomable]");
      zoom.on("open", (event) => {
        const objectFit = getComputedStyle(event.target).objectFit;
        const zoomed = event.detail.zoom.getZoomedImage();
        if (objectFit && zoomed)
          zoomed.style.objectFit = objectFit;
      });
      zoom.on("closed", (event) => {
        const zoomed = event.detail.zoom.getZoomedImage();
        zoomed.style.objectFit = "";
      });
    }
  });
  function isCalcable(value) {
    return value.endsWith("px") || value.endsWith("%") || value.startsWith("calc");
  }
  function unCalc(value) {
    return value.startsWith("calc") ? value.slice(4) : value;
  }
  function interpolate({ from, to }, percent) {
    if (from === to)
      return to;
    if (typeof from === "number" && typeof to === "number") {
      return from + (to - from) * (percent / 100);
    }
    if (typeof from === "string" && typeof to === "string") {
      if (from === "none" || to === "none")
        return percent < 50 ? from : to;
      if (from === "auto" || to === "auto")
        return percent < 50 ? from : to;
      if (from.endsWith("px") && to.endsWith("px")) {
        const fromPx = parseFloat(from);
        const toP = parseFloat(to);
        return toPx(fromPx + (toP - fromPx) * (percent / 100));
      }
      if (from.endsWith("%") && to.endsWith("%")) {
        const fromPx = parseFloat(from);
        const toP = parseFloat(to);
        return toPercent(fromPx + (toP - fromPx) * (percent / 100));
      }
      if (isCalcable(from) && isCalcable(to)) {
        const fromCalc = unCalc(from);
        const toCalc = unCalc(to);
        return `calc(${fromCalc} + (${toCalc} - ${fromCalc}) * ${percent / 100})`;
      }
      if (from.startsWith("rgb") && to.startsWith("rgb")) {
        const fromColor = from.match(/\d+/g).map(Number);
        const toColor = to.match(/\d+/g).map(Number);
        const color = fromColor.map(
          (from2, i) => from2 + (toColor[i] - from2) * (percent / 100)
        );
        return `rgb(${color.join(",")})`;
      }
    }
    return percent < 50 ? from : to;
  }
  function getDistance(start, end) {
    const x = end.clientX - start.clientX;
    const y = end.clientY - start.clientY;
    return { x, y, dist: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) };
  }
  onConnected("[data-bound-characters]", (e) => {
    const handler = () => {
      const id = e.getAttribute("data-bound-characters");
      const characters = toString(resolve(allVariables()[id]));
      if (characters !== e.textContent)
        e.textContent = characters;
    };
    handler();
    document.addEventListener("f2w-set-variable", handler);
    return () => document.removeEventListener("f2w-set-variable", handler);
  });
  onConnected("[data-bound-visible]", (e) => {
    const handler = () => {
      const id = e.getAttribute("data-bound-visible");
      const visible = toString(resolve(allVariables()[id]));
      if (visible !== void 0)
        e.setAttribute("data-visible", visible);
    };
    handler();
    document.addEventListener("f2w-set-variable", handler);
    return () => document.removeEventListener("f2w-set-variable", handler);
  });
  var appearObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          entry.target.dispatchEvent(new CustomEvent("appear"));
        }
      });
    },
    { threshold: 0.1 }
  );
  addEventListener("load", () => {
    const hashIdPrefix = window.location.hash.slice(1);
    const hashRE = new RegExp(hashIdPrefix + "(_\\d+)?$");
    for (const e of document.querySelectorAll(`[id^="${hashIdPrefix}"]`))
      if (hashRE.test(e.id) && e.getBoundingClientRect().height > 0)
        return e.scrollIntoView();
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vdXRpbHMvc3JjL251bWJlcnMudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JnYi1oZXhANC4wLjEvbm9kZV9tb2R1bGVzL3JnYi1oZXgvaW5kZXguanMiLCAiLi4vdXRpbHMvc3JjL2FycmF5LnRzIiwgIi4uL3V0aWxzL3NyYy9hc3NlcnQudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvdmFyaWFibGVzLnRzIiwgIi4uL3V0aWxzL3NyYy9hbmFseXRpY3MvaW5kZXgudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BjcmVhdGUtZmlnbWEtcGx1Z2luK3V0aWxpdGllc0AyLjMuMF9wYXRjaF9oYXNoPW41MzZpa3RkZXdndTd2NWJ5eHV4ZG9qdmZxL25vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91dGlsaXRpZXMvc3JjL2V2ZW50cy50cyIsICIuLi9maWdtYS1wbHVnaW4tY29yZS12Mi9zcmMvZXZlbnRzLnRzIiwgIi4uL2ZpZ21hLXBsdWdpbi1jb3JlLXYyL3NyYy9jb2RlL3BsdWdpbkRhdGEudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvaGVscGVycy50cyIsICIuLi9maWdtYS10by1odG1sL3NyYy9tYXBwaW5nL3RyaWdnZXJzLnRzIiwgIi4uL3V0aWxzL3NyYy9mdW5jdGlvbnMudHMiLCAic3JjL2xpZmVjeWNsZS50cyIsICIuLi9maWdtYS10by1odG1sL3NyYy9tYXBwaW5nL3V0aWxzLnRzIiwgInNyYy9ydW50aW1lL3ZpZGVvcy50cyIsICIuLi91dGlscy9zcmMvbmF2aWdhdG9yLnRzIiwgIi4uL3V0aWxzL3NyYy9zdHlsZXMvaW5kZXgudHMiLCAic3JjL3J1bnRpbWUvYW5pbWF0b3IudHMiLCAic3JjL3J1bnRpbWUvYW5pbWF0aW9ucy50cyIsICJzcmMvcnVudGltZV9lbWJlZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGZ1bmN0aW9uIHJvdW5kVG8odjogbnVtYmVyLCBmYWN0b3I6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLnJvdW5kKHYgKiBmYWN0b3IpIC8gZmFjdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXF1YWxzRXBzaWxvbihhOiBudW1iZXIsIGI6IG51bWJlciwgZXBzOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIE1hdGguYWJzKGEgLSBiKSA8IGVwcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZ2JIZXgocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEpIHtcblx0Y29uc3QgaXNQZXJjZW50ID0gKHJlZCArIChhbHBoYSB8fCAnJykpLnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKTtcblxuXHRpZiAodHlwZW9mIHJlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRbcmVkLCBncmVlbiwgYmx1ZSwgYWxwaGFdID0gcmVkLm1hdGNoKC8oMD9cXC4/XFxkKyklP1xcYi9nKS5tYXAoY29tcG9uZW50ID0+IE51bWJlcihjb21wb25lbnQpKTtcblx0fSBlbHNlIGlmIChhbHBoYSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0YWxwaGEgPSBOdW1iZXIucGFyc2VGbG9hdChhbHBoYSk7XG5cdH1cblxuXHRpZiAodHlwZW9mIHJlZCAhPT0gJ251bWJlcicgfHxcblx0XHR0eXBlb2YgZ3JlZW4gIT09ICdudW1iZXInIHx8XG5cdFx0dHlwZW9mIGJsdWUgIT09ICdudW1iZXInIHx8XG5cdFx0cmVkID4gMjU1IHx8XG5cdFx0Z3JlZW4gPiAyNTUgfHxcblx0XHRibHVlID4gMjU1XG5cdCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRocmVlIG51bWJlcnMgYmVsb3cgMjU2Jyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIGFscGhhID09PSAnbnVtYmVyJykge1xuXHRcdGlmICghaXNQZXJjZW50ICYmIGFscGhhID49IDAgJiYgYWxwaGEgPD0gMSkge1xuXHRcdFx0YWxwaGEgPSBNYXRoLnJvdW5kKDI1NSAqIGFscGhhKTtcblx0XHR9IGVsc2UgaWYgKGlzUGVyY2VudCAmJiBhbHBoYSA+PSAwICYmIGFscGhhIDw9IDEwMCkge1xuXHRcdFx0YWxwaGEgPSBNYXRoLnJvdW5kKDI1NSAqIGFscGhhIC8gMTAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgYWxwaGEgdmFsdWUgKCR7YWxwaGF9KSBhcyBhIGZyYWN0aW9uIG9yIHBlcmNlbnRhZ2VgKTtcblx0XHR9XG5cblx0XHRhbHBoYSA9IChhbHBoYSB8IDEgPDwgOCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW1peGVkLW9wZXJhdG9yc1xuXHR9IGVsc2Uge1xuXHRcdGFscGhhID0gJyc7XG5cdH1cblxuXHQvLyBUT0RPOiBSZW1vdmUgdGhpcyBpZ25vcmUgY29tbWVudC5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1peGVkLW9wZXJhdG9yc1xuXHRyZXR1cm4gKChibHVlIHwgZ3JlZW4gPDwgOCB8IHJlZCA8PCAxNikgfCAxIDw8IDI0KS50b1N0cmluZygxNikuc2xpY2UoMSkgKyBhbHBoYTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gdW5pcXVlT3JOdWxsPFQ+KGFycjogVFtdKTogVCB8IHVuZGVmaW5lZCB7XG4gIGlmIChhcnIubGVuZ3RoKSB7XG4gICAgY29uc3QgYmFzZSA9IGFyclswXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKDEpLmV2ZXJ5KChpdCkgPT4gaXQgPT09IGJhc2UpID8gYmFzZSA6IHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRW1wdHk8VD4oYXJyOiAoVCB8IHVuZGVmaW5lZCB8IG51bGwgfCB2b2lkKVtdKTogVFtdIHtcbiAgcmV0dXJuIGFyci5maWx0ZXIobm90RW1wdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90RW1wdHk8VFZhbHVlPihcbiAgdmFsdWU6IFRWYWx1ZSB8IG51bGwgfCB1bmRlZmluZWQgfCB2b2lkXG4pOiB2YWx1ZSBpcyBUVmFsdWUge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZDtcbn1cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQzMDUzODAzLzYxNTkwM1xuZXhwb3J0IGZ1bmN0aW9uIGNhcnRlc2lhbjxUPihvcHRpb25zOiBUW11bXSk6IFRbXVtdIHtcbiAgcmV0dXJuIChvcHRpb25zIGFzIGFueSkucmVkdWNlKFxuICAgIChhOiBhbnksIGI6IGFueSkgPT4gYS5mbGF0TWFwKChkOiBhbnkpID0+IGIubWFwKChlOiBhbnkpID0+IFsuLi5kLCBlXSkpLFxuICAgIFtbXV1cbiAgKSBhcyBUW11bXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21FbnRyaWVzTXVsdGk8VD4obGlzdDogW3N0cmluZywgVF1bXSk6IFJlY29yZDxzdHJpbmcsIFRbXT4ge1xuICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIFRbXT4gPSB7fTtcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgbGlzdCkge1xuICAgIGlmICghKGsgaW4gcmVzdWx0KSkgcmVzdWx0W2tdID0gW107XG4gICAgcmVzdWx0W2tdLnB1c2godik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVudHJpZXNUb011bHRpTWFwPEssIFY+KGxpc3Q6IFtLLCBWXVtdKTogTWFwPEssIFZbXT4ge1xuICBjb25zdCByZXN1bHQgPSBuZXcgTWFwPEssIFZbXT4oKTtcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgbGlzdCkge1xuICAgIGNvbnN0IGFyciA9IHJlc3VsdC5nZXQoayk7XG4gICAgaWYgKGFycikgYXJyLnB1c2godik7XG4gICAgZWxzZSByZXN1bHQuc2V0KGssIFt2XSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwZTxUPihhcnI6IFRbXSk6IFRbXSB7XG4gIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYXJyKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cGVJdGVyYWJsZTxUPihhcnI6IFRbXSk6IEl0ZXJhYmxlPFQ+IHtcbiAgcmV0dXJuIG5ldyBTZXQoYXJyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwZWRLZXlzKFxuICBhOiBvYmplY3QgfCB1bmRlZmluZWQsXG4gIGI6IG9iamVjdCB8IHVuZGVmaW5lZFxuKTogSXRlcmFibGU8c3RyaW5nPiB7XG4gIGlmICghYSkge1xuICAgIGlmICghYikgcmV0dXJuIFtdO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhiKTtcbiAgfVxuICBpZiAoIWIpIHJldHVybiBPYmplY3Qua2V5cyhhKTtcbiAgcmV0dXJuIGRlZHVwZUl0ZXJhYmxlKFsuLi5PYmplY3Qua2V5cyhhKSwgLi4uT2JqZWN0LmtleXMoYildKTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gc2hvdWxkTm90SGFwcGVuKHR4dDogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnNvbGUud2Fybih0eHQpO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBkZWJ1Z2dlcjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkTm90SGFwcGVuRXJyb3IodHh0OiBzdHJpbmcpOiBFcnJvciB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGNvbnNvbGUuZXJyb3IodHh0KTtcbiAgICBkZWJ1Z2dlcjtcbiAgfVxuICByZXR1cm4gbmV3IEVycm9yKHR4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRUaGF0KGNoZWNrOiAoKSA9PiBib29sZWFuLCB0eHQ6IHN0cmluZyk6IHZvaWQge1xuICBpZiAoIWNoZWNrKCkpIHtcbiAgICBzaG91bGROb3RIYXBwZW4odHh0KTtcbiAgfVxufVxuIiwgImltcG9ydCB0eXBlIHsgQ29sbGVjdG9yTWFwcGluZ0NvbnRleHQgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IHJ1bm5pbmdJblBsdWdpbkNvZGUgfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvdXRpbHMnO1xuaW1wb3J0IHsgS2V5ZWRFcnJvciB9IGZyb20gJy4vd2FybmluZ3MnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VmFyaWFibGVCeUlkQXN5bmMoXG4gIGN0eDogQ29sbGVjdG9yTWFwcGluZ0NvbnRleHQgfCB1bmRlZmluZWQsXG4gIGlkOiBzdHJpbmdcbik6IFByb21pc2U8VmFyaWFibGUgfCB1bmRlZmluZWQ+IHtcbiAgaWYgKCFydW5uaW5nSW5QbHVnaW5Db2RlKSByZXR1cm47XG4gIGNvbnN0IHYgPSBhd2FpdCBmaWdtYS52YXJpYWJsZXMuZ2V0VmFyaWFibGVCeUlkQXN5bmMoaWQpO1xuICBpZiAoIXYpIHRocm93IG5ldyBLZXllZEVycm9yKCdWQVJJQUJMRVMnLCAnTWlzc2luZyB2YXJpYWJsZSAnICsgaWQpO1xuICB0cnkge1xuICAgIHYubmFtZTtcbiAgICByZXR1cm4gdjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgS2V5ZWRFcnJvcignVkFSSUFCTEVTJywgJ01pc3NpbmcgdmFyaWFibGUgJyArIGlkKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9WYXJpYWJsZShcbiAgdmFyaWFibGVJZDogc3RyaW5nLFxuICBjdHg6IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0IHwgdW5kZWZpbmVkXG4pOiBzdHJpbmcge1xuICByZXR1cm4gYHZhcigke2NvbGxlY3RWYXJpYWJsZUlkKHZhcmlhYmxlSWQsIGN0eCl9KWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xsZWN0VmFyaWFibGVJZChcbiAgdmFyaWFibGVJZDogc3RyaW5nLFxuICBjdHg6IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0IHwgdW5kZWZpbmVkXG4pOiBzdHJpbmcge1xuICBpZiAoY3R4ICYmICFjdHgudmFyaWFibGVzLmhhcyh2YXJpYWJsZUlkKSkgY3R4LnZhcmlhYmxlcy5zZXQodmFyaWFibGVJZCwge30pO1xuICByZXR1cm4gYC0tJHt2YXJpYWJsZUlkfWA7XG59XG5cbmNvbnN0IFNBTklUSVpFX1JFR0VYUCA9IC9bXjAtOWEtekEtWl0rL2c7XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUNvbGxlY3Rpb25Nb2RlTmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVDb2xsZWN0aW9uTmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoU0FOSVRJWkVfUkVHRVhQLCAnLScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVWYXJpYWJsZU5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUucmVwbGFjZShTQU5JVElaRV9SRUdFWFAsICctJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1ZhcmlhYmxlTmFtZSh2YXJpYWJsZTogVmFyaWFibGUpOiBzdHJpbmcge1xuICByZXR1cm4gYC0tJHtzYW5pdGl6ZVZhcmlhYmxlTmFtZSh2YXJpYWJsZS5uYW1lKX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9EYXRhQXR0cmlidXRlKHZhcmlhYmxlOiBWYXJpYWJsZSk6IHN0cmluZyB7XG4gIHJldHVybiBgZGF0YSR7dG9WYXJpYWJsZU5hbWUodmFyaWFibGUpLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxpYXModjogVmFyaWFibGVWYWx1ZVdpdGhFeHByZXNzaW9uKTogdiBpcyBWYXJpYWJsZUFsaWFzIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgdiA9PT0gJ29iamVjdCcgJiYgKHYgYXMgVmFyaWFibGVBbGlhcykudHlwZSA9PT0gJ1ZBUklBQkxFX0FMSUFTJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwVmFyaWFibGVEYXRhVG9GMncoXG4gIGRhdGE6IFZhcmlhYmxlRGF0YSxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dFxuKTogVmFyaWFibGVEYXRhIHtcbiAgY29uc3QgcmV0ID0geyAuLi5kYXRhIH07XG4gIGNvbnN0IHsgdmFsdWUgfSA9IHJldDtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoaXNBbGlhcyh2YWx1ZSkpIHtcbiAgICAgIHJldC52YWx1ZSA9IG1hcFZhcmlhYmxlQWxpYXNUb0Yydyh2YWx1ZSwgY3R4KTtcbiAgICB9IGVsc2UgaWYgKCdleHByZXNzaW9uQXJndW1lbnRzJyBpbiB2YWx1ZSkge1xuICAgICAgcmV0LnZhbHVlID0ge1xuICAgICAgICBleHByZXNzaW9uRnVuY3Rpb246IHZhbHVlLmV4cHJlc3Npb25GdW5jdGlvbixcbiAgICAgICAgZXhwcmVzc2lvbkFyZ3VtZW50czogdmFsdWUuZXhwcmVzc2lvbkFyZ3VtZW50cy5tYXAoKGEpID0+XG4gICAgICAgICAgbWFwVmFyaWFibGVEYXRhVG9GMncoYSwgY3R4KVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0LnZhbHVlID0geyAuLi52YWx1ZSB9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwVmFyaWFibGVBbGlhc1RvRjJ3KFxuICBkYXRhOiBWYXJpYWJsZUFsaWFzLFxuICBjdHg6IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0XG4pOiBWYXJpYWJsZUFsaWFzIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnVkFSSUFCTEVfQUxJQVMnLFxuICAgIGlkOiBjb2xsZWN0VmFyaWFibGVJZChkYXRhLmlkLCBjdHgpLFxuICB9O1xufVxuIiwgInR5cGUgUHJpbWl0aXZlVHlwZXMgPSBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG50eXBlIFByb3BlcnRpZXMgPSBSZWNvcmQ8XG4gIHN0cmluZyxcbiAgUHJpbWl0aXZlVHlwZXMgfCBSZWNvcmQ8c3RyaW5nLCBQcmltaXRpdmVUeXBlcz4gfCBBcnJheTxQcmltaXRpdmVUeXBlcz5cbj47XG5cbmV4cG9ydCB0eXBlIFRyYWNrUHJvZHVjdCA9XG4gIHwgJ3djZCdcbiAgfCAncmInXG4gIHwgJ3VwJ1xuICB8ICdybydcbiAgfCAnbGknXG4gIHwgJ3N0J1xuICB8ICdoMmQnXG4gIHwgJ2kyZCdcbiAgfCAnbGFyJ1xuICB8ICdzMmQnXG4gIHwgJ3AyZCdcbiAgfCAncHNkMmQnXG4gIHwgJ2MyZCdcbiAgfCAnZjJ3J1xuICB8ICdzaHInXG4gIHwgJ3oyZCdcbiAgfCAnaW1nJ1xuICB8ICdhMmQnO1xuXG50eXBlIFRyYWNrUGxhdGZvcm0gPSAnZmlnbWEnIHwgJ3dlYmZsb3cnIHwgJ2ZyYW1lcic7XG5cbnR5cGUgVHJhY2tQYXlsb2FkUGFydGlhbCA9IHtcbiAgcHJvZHVjdD86IFRyYWNrUHJvZHVjdDtcbiAgc3VicHJvZHVjdD86IHN0cmluZztcbiAgcGxhdGZvcm0/OiBUcmFja1BsYXRmb3JtO1xuICB1c2VyaWQ/OiBzdHJpbmc7XG4gIHByb3BlcnRpZXM/OiBQcm9wZXJ0aWVzO1xufTtcblxudHlwZSBUcmFja1BheWxvYWRQYXJ0aWFsV2l0aEVycm9yID0gVHJhY2tQYXlsb2FkUGFydGlhbCAmIHtcbiAgZXJyb3I/OiBhbnk7XG59O1xuXG50eXBlIE9wdGlvbnMgPSB7XG4gIGNvdW50cnk/OiBib29sZWFuO1xuICB1c2VyQWdlbnQ/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtZWRPcHRpb25zID0ge1xuICBjbz86IGJvb2xlYW47XG4gIHVhPzogYm9vbGVhbjtcbn07XG5cbnR5cGUgVHJhY2tQYXlsb2FkID0geyBldmVudDogc3RyaW5nIH0gJiBUcmFja1BheWxvYWRQYXJ0aWFsICYge1xuICAgIHZlcnNpb24/OiBzdHJpbmc7XG4gICAgb3B0aW9ucz86IFRyYW5zZm9ybWVkT3B0aW9ucztcbiAgfTtcblxuY2xhc3MgQW5hbHl0aWNzIHtcbiAgcHVibGljIGRlZj86IFRyYWNrUGF5bG9hZFBhcnRpYWw7XG5cbiAgc3RhdGljIFNIQVJFRF9TRVJWSUNFX1VSTFMgPVxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcbiAgICAgID8gWydodHRwczovL2FwaS5kaXZyaW90cy5jb20nLCAnaHR0cHM6Ly9hcGktZXUuZGl2cmlvdHMuY29tJ11cbiAgICAgIDogcHJvY2Vzcy5lbnYuTE9DQUxfU0hSXG4gICAgICA/IFsnaHR0cDovL2xvY2FsaG9zdDo1MDAxL2Rldi1zaGFyZWQtc2VydmljZXMvdXMtY2VudHJhbDEvYXBpJ11cbiAgICAgIDogW1xuICAgICAgICAgICdodHRwczovL2FwaS1vZGRocW40cG1xLXVjLmEucnVuLmFwcCcsXG4gICAgICAgICAgJ2h0dHBzOi8vYXBpZXUtb2RkaHFuNHBtcS1ldy5hLnJ1bi5hcHAnLFxuICAgICAgICBdO1xuICBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKGRlZjogVHJhY2tQYXlsb2FkUGFydGlhbCkge1xuICAgIHRoaXMuZGVmID0gZGVmO1xuICB9XG5cbiAgYWRkRGVmYXVsdChkZWY6IFRyYWNrUGF5bG9hZFBhcnRpYWwpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZWYpIHtcbiAgICAgIGlmICh0aGlzLmRlZi5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIGNvbnN0IHsgcHJvcGVydGllcywgLi4ucmVzdCB9ID0gZGVmO1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGVmLnByb3BlcnRpZXMsIHByb3BlcnRpZXMpO1xuICAgICAgICBkZWYgPSByZXN0O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmRlZiwgZGVmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWYgPSB7IC4uLmRlZiB9O1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0RGVmYXVsdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRlZiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNmb3JtT3B0aW9ucyhvcHRpb25zPzogT3B0aW9ucyk6IFRyYW5zZm9ybWVkT3B0aW9ucyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFvcHRpb25zKSByZXR1cm47XG4gICAgY29uc3QgeyBjb3VudHJ5LCB1c2VyQWdlbnQgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgdHJhbnNmb3JtZWQ6IFRyYW5zZm9ybWVkT3B0aW9ucyA9IHt9O1xuICAgIGlmIChjb3VudHJ5KSB0cmFuc2Zvcm1lZC5jbyA9IGNvdW50cnk7XG4gICAgaWYgKHVzZXJBZ2VudCkgdHJhbnNmb3JtZWQudWEgPSB1c2VyQWdlbnQ7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWVkO1xuICB9XG5cbiAgYXN5bmMgZmVhdHVyZV90ZXN0KGZlYXR1cmU6IHN0cmluZywgZGF0YTogUHJvcGVydGllcyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICgnZmVhdHVyZScgaW4gZGF0YSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgJ2BmZWF0dXJlYCBpcyBhIHJlc2VydmVkIHByb3BlcnR5IGZvciBmZWF0dXJlX3Rlc3QgdHJhY2tpbmcuJ1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudHJhY2soJ2ZlYXR1cmUtdGVzdCcsIHtcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZmVhdHVyZSxcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBleGNlcHRpb24obmFtZTogc3RyaW5nLCBlcnJvcjogYW55LCBkZXRhaWxzPzogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnIHx8IHByb2Nlc3MuZW52LkZJUkVCQVNFX0NPTkZJRykge1xuICAgICAgY29uc29sZS5lcnJvcihgQW5hbHl0aWNzLmV4Y2VwdGlvbigpOiAke25hbWV9YCwgZXJyb3IsIGRldGFpbHMpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzID0ge1xuICAgICAgbmFtZSxcbiAgICB9O1xuICAgIGlmIChkZXRhaWxzKVxuICAgICAgcHJvcGVydGllcy5kZXRhaWxzID1cbiAgICAgICAgdHlwZW9mIGRldGFpbHMgPT09ICdzdHJpbmcnID8gZGV0YWlscyA6IEpTT04uc3RyaW5naWZ5KGRldGFpbHMpO1xuICAgIHJldHVybiB0aGlzLnRyYWNrKCdleGNlcHRpb24nLCB7XG4gICAgICBlcnJvcixcbiAgICAgIHByb3BlcnRpZXMsXG4gICAgfSk7XG4gIH1cblxuICBjYXRjaGVyKG5hbWU6IHN0cmluZywgZGV0YWlscz86IGFueSk6IChlcnJvcjogYW55KSA9PiB2b2lkIHtcbiAgICByZXR1cm4gKGVycm9yOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuZXhjZXB0aW9uKG5hbWUsIGVycm9yLCBkZXRhaWxzKTtcbiAgICB9O1xuICB9XG5cbiAgdW5oYW5kbGVkPFQ+KG5hbWU6IHN0cmluZywgY2I6ICgpID0+IFQpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmV0ID0gY2IoKTtcbiAgICAgIGlmIChyZXQgJiYgdHlwZW9mIHJldCA9PT0gJ29iamVjdCcgJiYgJ2NhdGNoJyBpbiByZXQpIHtcbiAgICAgICAgcmV0dXJuIChyZXQgYXMgYW55KS5jYXRjaCh0aGlzLmNhdGNoZXIobmFtZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5leGNlcHRpb24obmFtZSwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHRyYWNrKFxuICAgIGV2ZW50OiBzdHJpbmcsXG4gICAgcGF5bG9hZFBhcnRpYWw6IFRyYWNrUGF5bG9hZFBhcnRpYWxXaXRoRXJyb3IgPSB7fSxcbiAgICBvcHRpb25zPzogT3B0aW9uc1xuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5kZWY/LnByb3BlcnRpZXNcbiAgICAgID8gT2JqZWN0LmFzc2lnbihwYXlsb2FkUGFydGlhbC5wcm9wZXJ0aWVzIHx8IHt9LCB0aGlzLmRlZi5wcm9wZXJ0aWVzKVxuICAgICAgOiBwYXlsb2FkUGFydGlhbC5wcm9wZXJ0aWVzIHx8IHt9O1xuXG4gICAgLy8gVHJhbnNmb3JtIGBlcnJvcmAgdGFnIGludG8gYGVycm9yX21lc3NhZ2VgIGFuZCBgZXJyb3Jfc3RhY2tgIHByb3BlcnRpZXNcbiAgICBpZiAocGF5bG9hZFBhcnRpYWwuZXJyb3IpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gcGF5bG9hZFBhcnRpYWwuZXJyb3I7XG4gICAgICBwcm9wZXJ0aWVzLmVycm9yX21lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8IFN0cmluZyhlcnJvcik7XG4gICAgICBwcm9wZXJ0aWVzLmVycm9yX3N0YWNrID0gZ2V0U3RhY2tUcmFjZShlcnJvcik7XG4gICAgICBkZWxldGUgcGF5bG9hZFBhcnRpYWwuZXJyb3I7XG4gICAgfVxuXG4gICAgY29uc3QgcGF5bG9hZDogVHJhY2tQYXlsb2FkID0ge1xuICAgICAgZXZlbnQsXG4gICAgICAuLi50aGlzLmRlZixcbiAgICAgIC4uLnBheWxvYWRQYXJ0aWFsLFxuICAgICAgLi4ueyB2ZXJzaW9uOiBwcm9jZXNzLmVudi5fX0ZJR01BX1BMVUdJTl9WRVJTSU9OX18gfSxcbiAgICAgIHByb3BlcnRpZXMsXG4gICAgICBvcHRpb25zOiB0aGlzLnRyYW5zZm9ybU9wdGlvbnMob3B0aW9ucyksXG4gICAgfTtcblxuICAgIC8vIENoZWNrIHBheWxvYWQgdmFsaWRpdHlcbiAgICBpZiAoIXBheWxvYWQucHJvZHVjdCkge1xuICAgICAgY29uc29sZS5lcnJvcignQW5hbHl0aWNzLnRyYWNrKCk6IGBwcm9kdWN0YCBwcm9wZXJ0eSBpcyBtaXNzaW5nLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRyeUZldGNoID0gYXN5bmMgKFxuICAgICAgdXJsOiBzdHJpbmcsXG4gICAgICBsb2dPbkVycm9yOiBib29sZWFuXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBmZXRjaChgJHt1cmx9L3BhYCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChsb2dPbkVycm9yKSB7XG4gICAgICAgICAgLy8gQWx3YXlzIGZhaWwgc2lsZW50bHkgdG8gYXZvaWQgc2VydmljZSBkaXN0dXJiYW5jZVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICBgQW5hbHl0aWNzLnRyYWNrKCk6IFVuZXhwZWN0ZWQgZXJyb3Igb24gZXZlbnQgJHtldmVudH0uYCxcbiAgICAgICAgICAgIGVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGlmIChBbmFseXRpY3Muc2VydmljZVVybCkge1xuICAgICAgYXdhaXQgdHJ5RmV0Y2goQW5hbHl0aWNzLnNlcnZpY2VVcmwsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB1cmxzID0gWy4uLkFuYWx5dGljcy5TSEFSRURfU0VSVklDRV9VUkxTXTtcbiAgICAgIHdoaWxlICh1cmxzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB1cmwgPSB1cmxzLnNoaWZ0KCkhO1xuICAgICAgICBpZiAoYXdhaXQgdHJ5RmV0Y2godXJsLCAhdXJscy5sZW5ndGgpKSB7XG4gICAgICAgICAgQW5hbHl0aWNzLnNlcnZpY2VVcmwgPSB1cmw7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpZiBub25lIHN1Y2NlZWRlZCBqdXN0IGtlZXAgdGhlIGZpcnN0IG9uZVxuICAgICAgaWYgKCFBbmFseXRpY3Muc2VydmljZVVybClcbiAgICAgICAgQW5hbHl0aWNzLnNlcnZpY2VVcmwgPSBBbmFseXRpY3MuU0hBUkVEX1NFUlZJQ0VfVVJMU1swXTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQW5hbHl0aWNzO1xuZXhwb3J0IHR5cGUgeyBQcm9wZXJ0aWVzLCBUcmFja1BheWxvYWQsIFRyYWNrUGF5bG9hZFBhcnRpYWwgfTtcblxuZXhwb3J0IGNsYXNzIEdsb2JhbEFuYWx5dGljcyBleHRlbmRzIEFuYWx5dGljcyB7XG4gIGlzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7fSk7XG4gIH1cblxuICBpbml0aWFsaXplKGRlZjogVHJhY2tQYXlsb2FkUGFydGlhbCk6IHZvaWQge1xuICAgIHRoaXMuYWRkRGVmYXVsdChkZWYpO1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFuYWx5dGljcyA9IG5ldyBHbG9iYWxBbmFseXRpY3MoKTtcblxuY29uc3QgZ2V0U3RhY2tUcmFjZSA9IChlcnI6IGFueSk6IHN0cmluZyA9PiB7XG4gIGlmIChlcnIuc3RhY2spIHtcbiAgICBsZXQgc3RhY2sgPSBlcnIuc3RhY2s7XG4gICAgaWYgKGVyci5jYXVzZSkge1xuICAgICAgY29uc3QgY2F1c2VTdGFjayA9IGdldFN0YWNrVHJhY2UoZXJyLmNhdXNlKTtcbiAgICAgIHN0YWNrICs9IGBcXG5DYXVzZWQgYnkgJHtjYXVzZVN0YWNrfWA7XG4gICAgfVxuICAgIHJldHVybiBzdGFjaztcbiAgfVxuICByZXR1cm4gJyc7XG59O1xuIiwgbnVsbCwgImltcG9ydCB7XG4gIEV2ZW50SGFuZGxlcixcbiAgb24gYXMgY2ZwX29uLFxuICBvbmNlLFxufSBmcm9tICdAY3JlYXRlLWZpZ21hLXBsdWdpbi91dGlsaXRpZXMnO1xuaW1wb3J0IHsgd3JhcFdpdGhFcnJvckhhbmRsaW5nIH0gZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgY2lyY3VsYXJEZWN0b3IgfSBmcm9tICcuL3V0aWxzL2NpcmN1bGFyLWRlY3Rvcic7XG5cbmV4cG9ydCB7IHR5cGUgRXZlbnRIYW5kbGVyLCBvbmNlIH07XG5cbmxldCBwbHVnaW5JZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGx1Z2luSWQoaWQ6IHN0cmluZyk6IHZvaWQge1xuICBwbHVnaW5JZCA9IGlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VuZERyb3BFdmVudChwbHVnaW5Ecm9wOiBhbnkpOiB2b2lkIHtcbiAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbkRyb3AsIHBsdWdpbklkIH0sICcqJyk7XG59XG5cbmV4cG9ydCBjb25zdCBjZnBfZW1pdCA9XG4gIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnXG4gICAgPyBmdW5jdGlvbiA8SGFuZGxlciBleHRlbmRzIEV2ZW50SGFuZGxlcj4oXG4gICAgICAgIG5hbWU6IEhhbmRsZXJbJ25hbWUnXSxcbiAgICAgICAgLi4uYXJnczogUGFyYW1ldGVyczxIYW5kbGVyWydoYW5kbGVyJ10+XG4gICAgICApOiB2b2lkIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShbbmFtZSwgLi4uYXJnc10pO1xuICAgICAgfVxuICAgIDogZnVuY3Rpb24gPEhhbmRsZXIgZXh0ZW5kcyBFdmVudEhhbmRsZXI+KFxuICAgICAgICBuYW1lOiBIYW5kbGVyWyduYW1lJ10sXG4gICAgICAgIC4uLmFyZ3M6IFBhcmFtZXRlcnM8SGFuZGxlclsnaGFuZGxlciddPlxuICAgICAgKTogdm9pZCB7XG4gICAgICAgIGlmIChwbHVnaW5JZCkge1xuICAgICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcbiAgICAgICAgICAgICAgcGx1Z2luSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2h0dHBzOi8vd3d3LmZpZ21hLmNvbSdcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnKidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9O1xuXG5leHBvcnQgZnVuY3Rpb24gZW1pdFBsdWdpblRvUGx1Z2luPEhhbmRsZXIgZXh0ZW5kcyBFdmVudEhhbmRsZXI+KFxuICBuYW1lOiBIYW5kbGVyWyduYW1lJ10sXG4gIC4uLmFyZ3M6IFBhcmFtZXRlcnM8SGFuZGxlclsnaGFuZGxlciddPlxuKTogdm9pZCB7XG4gIHdpbmRvdy5wb3N0TWVzc2FnZShcbiAgICB7XG4gICAgICBwbHVnaW5NZXNzYWdlOiBbbmFtZSwgLi4uYXJnc10sXG4gICAgfSxcbiAgICAnKidcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVtaXQ8SGFuZGxlciBleHRlbmRzIEV2ZW50SGFuZGxlcj4oXG4gIG5hbWU6IEhhbmRsZXJbJ25hbWUnXSxcbiAgLi4uYXJnczogUGFyYW1ldGVyczxIYW5kbGVyWydoYW5kbGVyJ10+XG4pOiB2b2lkIHtcbiAgaWYgKCFwcm9jZXNzLmVudi5OT19ERUJVR19MT0dTKSB7XG4gICAgY29uc29sZS5sb2coYEVNSVRgLCBuYW1lLCBhcmdzKTtcbiAgfVxuICBjZnBfZW1pdChuYW1lLCAuLi5hcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uPEhhbmRsZXIgZXh0ZW5kcyBFdmVudEhhbmRsZXI+KFxuICBuYW1lOiBIYW5kbGVyWyduYW1lJ10sXG4gIGhhbmRsZXI6IEhhbmRsZXJbJ2hhbmRsZXInXVxuKTogKCkgPT4gdm9pZCB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGNvbnNvbGUubG9nKGBSRUdJU1RFUmAsIG5hbWUpO1xuICB9XG4gIGNvbnN0IGRpc3AgPSBjZnBfb248SGFuZGxlcj4obmFtZSwgaGFuZGxlcik7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkaXNwKCk7XG4gICAgICBjb25zb2xlLmxvZyhgVU5SRUdJU1RFUmAsIG5hbWUpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGRpc3A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvblNhZmU8SGFuZGxlciBleHRlbmRzIEV2ZW50SGFuZGxlcj4oXG4gIG5hbWU6IEhhbmRsZXJbJ25hbWUnXSxcbiAgaGFuZGxlcjogSGFuZGxlclsnaGFuZGxlciddXG4pOiBSZXR1cm5UeXBlPHR5cGVvZiBvbj4ge1xuICByZXR1cm4gb24obmFtZSwgd3JhcFdpdGhFcnJvckhhbmRsaW5nKGBvbjoke25hbWV9YCwgaGFuZGxlcikpO1xufVxuXG5jb25zdCBtYXhDYWxsU3RhY2tSZWdleCA9IC9tYXhpbXVtIGNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZC9pO1xuXG5leHBvcnQgdHlwZSBQSGFuZGxlcjxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk+ID0gKFxuICAuLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+XG4pID0+IFJldHVyblR5cGU8VD4gZXh0ZW5kcyBQcm9taXNlPGFueT5cbiAgPyBSZXR1cm5UeXBlPFQ+XG4gIDogUHJvbWlzZTxSZXR1cm5UeXBlPFQ+PiB8IFJldHVyblR5cGU8VD47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmljT25SZXF1ZXN0PFxuICBWIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgKC4uLmFyZ3M6IGFueSkgPT4gYW55PixcbiAgVCBleHRlbmRzIGtleW9mIFYgPSBrZXlvZiBWLFxuPihuYW1lOiBULCBoYW5kbGVyOiBQSGFuZGxlcjxWW1RdPik6ICgpID0+IHZvaWQge1xuICByZXR1cm4gb24oU3RyaW5nKG5hbWUpLCBhc3luYyBmdW5jdGlvbiAoYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaGFuZGxlcj4pIHtcbiAgICBjb25zdCBpZCA9IGFyZ3Muc3BsaWNlKDAsIDEpWzBdO1xuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICB0cnkge1xuICAgICAgLy8gQHRzLWlnbm9yZSBDSSBvbmx5IGVycm9yOiBlcnJvciBUUzI0ODg6IFR5cGUgJ1BhcmFtZXRlcnM8VltUXT4nIG11c3QgaGF2ZSBhICdbU3ltYm9sLml0ZXJhdG9yXSgpJyBtZXRob2QgdGhhdCByZXR1cm5zIGFuIGl0ZXJhdG9yXG4gICAgICByZXN1bHQgPSBhd2FpdCBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZW1pdChgJHtTdHJpbmcobmFtZSl9LXJlc3BvbnNlLSR7aWR9YCwgeyByZXN1bHQgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRXJyb3IgJiYgbWF4Q2FsbFN0YWNrUmVnZXgudGVzdChlLm1lc3NhZ2UpKSB7XG4gICAgICAgICAgLy8gV2UgaGF2ZSBlcnJvcnMgaW4gcHJvZHVjdGlvbiBhYm91dCBgTWF4aW11bSBjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRgIGFuZCBiZWxpZXZlIHRoZXkgYXJlIGNhdXNlZFxuICAgICAgICAgIC8vIGJ5IGNpcmN1bGFyIHJlZmVyZW5jZXMsIHNvIHJ1biB0aGlzIGNoZWNrIHdoaWNoIHdpbGwgdGhyb3cgYSBuaWNlciBlcnJvciB3aXRoIGEgcGF0aCB0byBvZmZlbmRpbmcuXG4gICAgICAgICAgLy8gV2UgY291bGQgcmVtb3ZlIHRoaXMgY29kZS9jaGVjayBvbmNlIHdlIHJlc29sdmUgdGhhdCBlcnJvci5cbiAgICAgICAgICBjaXJjdWxhckRlY3RvcihyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgICBjb25zb2xlLmVycm9yKHJlc3VsdCwgZSk7XG4gICAgICB9XG4gICAgICBlbWl0KGAke1N0cmluZyhuYW1lKX0tcmVzcG9uc2UtJHtpZH1gLCB7XG4gICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgbWVzc2FnZTogYFske1N0cmluZyhuYW1lKX1dICR7ZS5tZXNzYWdlID8/IGV9YCxcbiAgICAgICAgICBzdGFjazogZS5zdGFjayxcbiAgICAgICAgICBuYW1lOiBlLm5hbWUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5sZXQgcmVxdWVzdElkID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyaWNFbWl0UmVxdWVzdDxcbiAgViBleHRlbmRzIFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnkpID0+IGFueT4sXG4gIFQgZXh0ZW5kcyBrZXlvZiBWID0ga2V5b2YgVixcbj4obmFtZTogVCwgLi4uYXJnczogUGFyYW1ldGVyczxWW1RdPik6IFByb21pc2U8QXdhaXRlZDxSZXR1cm5UeXBlPFZbVF0+Pj4ge1xuICBjb25zdCBpZCA9IHJlcXVlc3RJZCsrO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIG9uY2UoYCR7U3RyaW5nKG5hbWUpfS1yZXNwb25zZS0ke2lkfWAsIChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKCdlcnJvcicgaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdlLCBzdGFjaywgbmFtZSB9ID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIGNvbnN0IGxvY2FsRXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgIGlmIChuYW1lKSBsb2NhbEVycm9yLm5hbWUgPSBuYW1lO1xuICAgICAgICAobG9jYWxFcnJvciBhcyBhbnkpLmNhdXNlID0gbmV3IEN1c3RvbUVycm9yKG1lc3NhZ2UsIHN0YWNrKTtcbiAgICAgICAgcmVqZWN0KGxvY2FsRXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5yZXN1bHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVtaXQoU3RyaW5nKG5hbWUpLCBbaWQsIC4uLmFyZ3NdKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmljRW1pdFJlcXVlc3RlcjxcbiAgViBleHRlbmRzIFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnkpID0+IGFueT4sXG4+KCkge1xuICByZXR1cm4gPFQgZXh0ZW5kcyBrZXlvZiBWICYgc3RyaW5nPihcbiAgICBuYW1lOiBULFxuICAgIC4uLmFyZ3M6IFBhcmFtZXRlcnM8VltUXT5cbiAgKTogUHJvbWlzZTxBd2FpdGVkPFJldHVyblR5cGU8VltUXT4+PiA9PiB7XG4gICAgcmV0dXJuIGdlbmVyaWNFbWl0UmVxdWVzdDxWLCBUPihuYW1lLCAuLi5hcmdzKTtcbiAgfTtcbn1cblxuY2xhc3MgQ3VzdG9tRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgc3RhY2s6IHN0cmluZykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMuc3RhY2sgPSBzdGFjaztcbiAgfVxufVxuIiwgImltcG9ydCB7IGFuYWx5dGljcyB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9zcmMvYW5hbHl0aWNzJztcbmltcG9ydCB7IGdldEJhc2U2NEJ5dGVMZW5ndGggfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvc3JjL2Jhc2U2NCc7XG5pbXBvcnQgdHlwZSB7IFJlc3RQbHVnaW5EYXRhTWl4aW4gfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL2ZpZ21hLnJlc3QudHlwaW5ncyc7XG5pbXBvcnQgeyBkZXNjcmliZU5vZGUgfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL3BsdWdpbi9sb2dnZXInO1xuaW1wb3J0IHsgZ2VuZXJpY0VtaXRSZXF1ZXN0ZXIgfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHR5cGUgeyBac3RkQ29tcHJlc3MgfSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IENPTVBSRVNTX1RIUkVTSE9MRF9CWVRFUyA9IDEwXzAwMDtcbmNvbnN0IENPTVBSRVNTRURfVjEgPSAnXFx4REZcXHgxMCc7XG5jb25zdCBCSUdfREFUQV9USFJFU0hPTERfQllURVMgPSA1MF8wMDA7XG5jb25zdCBNQVhfREFUQV9CWVRFUyA9IDk5XzAwMDtcblxuY29uc3QgcmVxdWVzdFpzdGQgPSBnZW5lcmljRW1pdFJlcXVlc3Rlcjxac3RkQ29tcHJlc3M+KCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXliZUNvbXByZXNzKFxuICBrZXk6IHN0cmluZyxcbiAgdmFsdWU6IHN0cmluZ1xuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgodmFsdWUsICd1dGYtOCcpO1xuICBpZiAobGVuZ3RoIDwgQ09NUFJFU1NfVEhSRVNIT0xEX0JZVEVTKSByZXR1cm4gdmFsdWU7XG5cbiAgY29uc3QgY29tcHJlc3NlZEJhc2U2NCA9IGF3YWl0IHJlcXVlc3Rac3RkKCd6c3RkLWNvbXByZXNzJywgdmFsdWUsIHtcbiAgICBpbnB1dEVuY29kaW5nOiAndXRmLTgnLFxuICAgIGxldmVsOiAzLFxuICB9KTtcbiAgdmFsdWUgPSBDT01QUkVTU0VEX1YxICsgY29tcHJlc3NlZEJhc2U2NDtcbiAgY29uc3QgY29tcHJlc3NlZExlbmd0aCA9IGdldEJhc2U2NEJ5dGVMZW5ndGgoY29tcHJlc3NlZEJhc2U2NCk7XG4gIGlmIChjb21wcmVzc2VkTGVuZ3RoID4gQklHX0RBVEFfVEhSRVNIT0xEX0JZVEVTKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHsga2V5LCBsZW5ndGgsIGNvbXByZXNzZWRMZW5ndGggfTtcbiAgICBhbmFseXRpY3MudHJhY2soJ2JpZy1wbHVnaW5EYXRhJywgeyBwcm9wZXJ0aWVzIH0pO1xuICAgIGlmIChjb21wcmVzc2VkTGVuZ3RoID4gTUFYX0RBVEFfQllURVMpIHtcbiAgICAgIGFuYWx5dGljcy5leGNlcHRpb24oXG4gICAgICAgICdwbHVnaW5EYXRhOm1heWJlQ29tcHJlc3MnLFxuICAgICAgICBuZXcgRXJyb3IoJ1ZhbHVlIHRvbyBiaWcsIGRhdGEgd2lsbCBub3QgYmUgc2F2ZWQgc29vbicpLFxuICAgICAgICBwcm9wZXJ0aWVzXG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXliZURlY29tcHJlc3ModmFsdWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGlmICh2YWx1ZS5zdGFydHNXaXRoKENPTVBSRVNTRURfVjEpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbXByZXNzZWRCYXNlNjQgPSB2YWx1ZS5zbGljZShDT01QUkVTU0VEX1YxLmxlbmd0aCk7XG4gICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdFpzdGQoJ3pzdGQtZGVjb21wcmVzcycsIGNvbXByZXNzZWRCYXNlNjQsIHtcbiAgICAgICAgb3V0cHV0RW5jb2Rpbmc6ICd1dGY4JyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGFuYWx5dGljcy5leGNlcHRpb24oJ3BsdWdpbkRhdGE6bWF5YmVEZWNvbXByZXNzJywgZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNoYXJlZERhdGEoXG4gIG5vZGU6IFBsdWdpbkRhdGFNaXhpbiB8IFJlc3RQbHVnaW5EYXRhTWl4aW4sXG4gIHBsdWdpbktleTogc3RyaW5nLFxuICBrZXk6IHN0cmluZ1xuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgcmV0ID1cbiAgICAnZ2V0U2hhcmVkUGx1Z2luRGF0YScgaW4gbm9kZVxuICAgICAgPyBub2RlLmdldFNoYXJlZFBsdWdpbkRhdGEocGx1Z2luS2V5LCBrZXkpXG4gICAgICA6IG5vZGUuc2hhcmVkUGx1Z2luRGF0YT8uW3BsdWdpbktleV0/LltrZXldO1xuICByZXR1cm4gcmV0ID8gbWF5YmVEZWNvbXByZXNzKHJldCkgOiAnJztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNoYXJlZERhdGFPYmo8VD4oXG4gIG5vZGU6IFBsdWdpbkRhdGFNaXhpbiB8IFJlc3RQbHVnaW5EYXRhTWl4aW4sXG4gIHBsdWdpbktleTogc3RyaW5nLFxuICBrZXk6IHN0cmluZyxcbiAgZGVmOiBUXG4pOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgcmV0ID0gYXdhaXQgZ2V0U2hhcmVkRGF0YShub2RlLCBwbHVnaW5LZXksIGtleSk7XG4gIGlmIChyZXQpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmV0KSBhcyBUO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBGYWlsZWQgdG8gcGFyc2Ugc2hhcmVkIHBsdWdpbiBkYXRhIFske3BsdWdpbktleX1dWyR7a2V5fV06ICR7cmV0fWAsXG4gICAgICAgIGVycm9yXG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzU2hhcmVkUGx1Z2luRGF0YShcbiAgbm9kZTogUGx1Z2luRGF0YU1peGluIHwgUmVzdFBsdWdpbkRhdGFNaXhpbixcbiAgcGx1Z2luS2V5OiBzdHJpbmcsXG4gIGtleTogc3RyaW5nXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuICEhKCdnZXRTaGFyZWRQbHVnaW5EYXRhJyBpbiBub2RlXG4gICAgPyBub2RlLmdldFNoYXJlZFBsdWdpbkRhdGEocGx1Z2luS2V5LCBrZXkpXG4gICAgOiBub2RlLnNoYXJlZFBsdWdpbkRhdGE/LltwbHVnaW5LZXldPy5ba2V5XSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXREYXRhKFxuICBub2RlOiBCYXNlTm9kZSxcbiAga2V5OiBzdHJpbmcsXG4gIHZhbHVlOiBzdHJpbmdcbik6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNhdmVkID0gYXdhaXQgbWF5YmVDb21wcmVzcyhrZXksIHZhbHVlKTtcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoa2V5LCBzYXZlZCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhbmFseXRpY3MuZXhjZXB0aW9uKCdzZXREYXRhOnNldFBsdWdpbkRhdGEnLCBlLCB7XG4gICAgICBub2RlOiBkZXNjcmliZU5vZGUobm9kZSksXG4gICAgICBrZXksXG4gICAgICB2YWx1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YU9iaihcbiAgbm9kZTogQmFzZU5vZGUsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZTogYW55XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIHNldERhdGEobm9kZSwga2V5LCBzdHJpbmdpZnkodmFsdWUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEobm9kZTogQmFzZU5vZGUsIGtleTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG1heWJlRGVjb21wcmVzcyhub2RlLmdldFBsdWdpbkRhdGEoa2V5KSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRTaGFyZWREYXRhKFxuICBub2RlOiBCYXNlTm9kZSxcbiAgcGx1Z2luS2V5OiBzdHJpbmcsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZTogc3RyaW5nXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzYXZlZCA9IGF3YWl0IG1heWJlQ29tcHJlc3Moa2V5LCB2YWx1ZSk7XG4gICAgbm9kZS5zZXRTaGFyZWRQbHVnaW5EYXRhKHBsdWdpbktleSwga2V5LCBzYXZlZCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhbmFseXRpY3MuZXhjZXB0aW9uKCdzZXREYXRhOnNldFNoYXJlZFBsdWdpbkRhdGEnLCBlLCB7XG4gICAgICBub2RlOiBkZXNjcmliZU5vZGUobm9kZSksXG4gICAgICBwbHVnaW5LZXksXG4gICAgICBrZXksXG4gICAgICB2YWx1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0U2hhcmVkRGF0YU9iaihcbiAgbm9kZTogQmFzZU5vZGUsXG4gIHBsdWdpbktleTogc3RyaW5nLFxuICBrZXk6IHN0cmluZyxcbiAgdmFsdWU6IGFueVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBzZXRTaGFyZWREYXRhKG5vZGUsIHBsdWdpbktleSwga2V5LCBzdHJpbmdpZnkodmFsdWUpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpIHx8ICcnO1xufVxuIiwgImltcG9ydCB0eXBlIHtcbiAgUmVzdEJhc2VOb2RlLFxuICBSZXN0UGFpbnQsXG4gIFJlc3RTY2VuZU5vZGUsXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy9zcmMvZmlnbWEucmVzdC50eXBpbmdzJztcbmltcG9ydCB7IHJvdW5kVG8gfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvc3JjL251bWJlcnMnO1xuaW1wb3J0IHJnYkhleCBmcm9tICdyZ2ItaGV4JztcbmltcG9ydCB7XG4gIEYyd05hbWVzcGFjZSxcbiAgdHlwZSBGMndEYXRhLFxuICBGMndEYXRhS2V5LFxufSBmcm9tICdAZGl2cmlvdHMvc3RvcnktdG8tZmlnbWEvdHlwZXMvbm9kZXMnO1xuaW1wb3J0IHR5cGUge1xuICBBZHZGMndEYXRhLFxuICBCYXNlRjJ3QWN0aW9uLFxuICBIdG1sRWxlbWVudCxcbiAgSHRtbE5vZGUsXG4gIE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgV3JpdGFibGVWZWN0b3IsXG4gIEFsbG93ZWRQcm9wZXJ0aWVzLFxuICBUeXBlZFN0eWxlcyxcbiAgTm9kZVByb3BzLFxuICBDc3NWYWx1ZVZhcixcbiAgQ29sbGVjdG9yTWFwcGluZ0NvbnRleHQsXG4gIE1lZGlhQ2FsbHNpdGUsXG4gIERPTUYyd0FjdGlvbixcbn0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBpc0FsaWFzLCB0b1ZhcmlhYmxlIH0gZnJvbSAnLi92YXJpYWJsZXMnO1xuaW1wb3J0IHsgc2hvdWxkTm90SGFwcGVuIH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL2Fzc2VydCc7XG5pbXBvcnQgeyBnZXRTaGFyZWREYXRhT2JqIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXBsdWdpbi1jb3JlLXYyL3NyYy9jb2RlL3BsdWdpbkRhdGEnO1xuaW1wb3J0IHR5cGUgeyBWYWxpZFZhcmlhbnRQcm9wZXJ0aWVzIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXV0aWxzL3V0aWxzJztcbmltcG9ydCB7IGNzc1ZhbHVlVG9TdHJpbmcgfSBmcm9tICcuL2Nzc1ZhbHVlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaXplKFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlLFxuICBzY2FsZSA9IDFcbik6IFdyaXRhYmxlVmVjdG9yIHtcbiAgcmV0dXJuICdzaXplJyBpbiBub2RlXG4gICAgPyB7XG4gICAgICAgIHg6IG5vZGUuc2l6ZSEueCAqIHNjYWxlLFxuICAgICAgICB5OiBub2RlLnNpemUhLnkgKiBzY2FsZSxcbiAgICAgIH1cbiAgICA6IHtcbiAgICAgICAgeDogKG5vZGUgYXMgU2NlbmVOb2RlKS53aWR0aCAqIHNjYWxlLFxuICAgICAgICB5OiAobm9kZSBhcyBTY2VuZU5vZGUpLmhlaWdodCAqIHNjYWxlLFxuICAgICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE9mZnNldChcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSxcbiAgc2NhbGUgPSAxXG4pOiBXcml0YWJsZVZlY3RvciB7XG4gIHJldHVybiAneCcgaW4gbm9kZVxuICAgID8geyB4OiBub2RlLnggKiBzY2FsZSwgeTogbm9kZS55ICogc2NhbGUgfVxuICAgIDoge1xuICAgICAgICB4OiAobm9kZSBhcyBSZXN0U2NlbmVOb2RlKS5yZWxhdGl2ZVRyYW5zZm9ybSFbMF1bMl0gKiBzY2FsZSxcbiAgICAgICAgeTogKG5vZGUgYXMgUmVzdFNjZW5lTm9kZSkucmVsYXRpdmVUcmFuc2Zvcm0hWzFdWzJdICogc2NhbGUsXG4gICAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc29saWRQYWludFRvUmdiYShjb2xvcjogU29saWRQYWludCk6IFJHQkEge1xuICByZXR1cm4gZmlnbWFSZ2JhVG9Dc3NSZ2JhKHsgLi4uY29sb3IuY29sb3IsIGE6IGNvbG9yLm9wYWNpdHkgPz8gMSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZ21hUmdiYVRvU3RyaW5nKHJnYmE6IFJHQkEpOiBzdHJpbmcge1xuICByZXR1cm4gcmdiYVRvU3RyaW5nKGZpZ21hUmdiYVRvQ3NzUmdiYShyZ2JhKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWdtYVJnYmFPclZhclRvU3RyaW5nKFxuICByZ2JhOiBSR0JBLFxuICB2YXJpYWJsZTogVmFyaWFibGVBbGlhcyB8IHVuZGVmaW5lZCxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhcmlhYmxlID8gdG9WYXJpYWJsZSh2YXJpYWJsZS5pZCwgY3R4KSA6IGZpZ21hUmdiYVRvU3RyaW5nKHJnYmEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmdiYVRvU3RyaW5nKHJnYmE6IFJHQkEgfCBSR0IpOiBzdHJpbmcge1xuICBpZiAoJ2EnIGluIHJnYmEpIHtcbiAgICBjb25zdCBhID0gcm91bmRUbyhyZ2JhLmEsIDEwMCk7XG4gICAgaWYgKGEgIT09IDEpIHJldHVybiBgcmdiYSgke3JnYmEucn0sJHtyZ2JhLmd9LCR7cmdiYS5ifSwke2F9KWA7XG4gIH1cbiAgY29uc3QgaGV4ID0gcmdiSGV4KHJnYmEuciwgcmdiYS5nLCByZ2JhLmIpO1xuICBpZiAoaGV4WzBdID09PSBoZXhbMV0gJiYgaGV4WzJdID09PSBoZXhbM10gJiYgaGV4WzRdID09PSBoZXhbNV0pIHtcbiAgICByZXR1cm4gYCMke2hleFswXX0ke2hleFsyXX0ke2hleFs0XX1gO1xuICB9XG4gIHJldHVybiBgIyR7aGV4fWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWdtYVJnYmFUb0Nzc1JnYmEoY29sb3I6IFJHQkEgfCBSR0IpOiBSR0JBIHtcbiAgY29uc3QgeyByLCBnLCBiLCBhID0gMSB9ID0gY29sb3IgYXMgUkdCQTtcbiAgcmV0dXJuIHtcbiAgICByOiByb3VuZFRvKHIgKiAyNTUsIDEpLFxuICAgIGc6IHJvdW5kVG8oZyAqIDI1NSwgMSksXG4gICAgYjogcm91bmRUbyhiICogMjU1LCAxKSxcbiAgICBhLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Dc3NQeChcbiAgdmFsdWU6IG51bWJlcixcbiAgcm91bmQ6IG51bWJlcixcbiAgdmFyaWFibGU6IFZhcmlhYmxlQWxpYXMgfCB1bmRlZmluZWQsXG4gIGN0eDogTWFwcGluZ0V4ZWNDb250ZXh0XG4pOiBzdHJpbmcge1xuICByZXR1cm4gdmFyaWFibGVcbiAgICA/IGBjYWxjKDFweCAqICR7dG9WYXJpYWJsZSh2YXJpYWJsZS5pZCwgY3R4KX0pYFxuICAgIDogdG9QeChyb3VuZFRvKHZhbHVlLCByb3VuZCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Db2xvck9yVmFyaWFibGUoXG4gIGl0OiBTb2xpZFBhaW50LFxuICBjdHg6IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0XG4pOiBzdHJpbmcge1xuICByZXR1cm4gaXQuYm91bmRWYXJpYWJsZXM/LmNvbG9yXG4gICAgPyB0b1ZhcmlhYmxlKGl0LmJvdW5kVmFyaWFibGVzPy5jb2xvci5pZCwgY3R4KVxuICAgIDogcmdiYVRvU3RyaW5nKHNvbGlkUGFpbnRUb1JnYmEoaXQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUHgodjogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke3JvdW5kVG8odiwgMTApfXB4YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUGVyY2VudCh2OiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7cm91bmRUbyh2LCAxMCl9JWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZVRvU3RyaW5nKHY6IFZhcmlhYmxlVmFsdWUpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGlmIChpc0FsaWFzKHYpKSB7XG4gICAgICAgIHJldHVybiBgdmFyKCR7di5pZH0pYDtcbiAgICAgIH1cbiAgICAgIGlmICgncicgaW4gdikge1xuICAgICAgICByZXR1cm4gcmdiYVRvU3RyaW5nKGZpZ21hUmdiYVRvQ3NzUmdiYSh2KSk7XG4gICAgICB9XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICBjYXNlICdudW1iZXInOlxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gU3RyaW5nKHYpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUlkKGlkOiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcge1xuICBpZCA9IFN0cmluZyhpZCk7XG4gIGxldCByZXQgPSBpZC5tYXRjaCgvW14wLTlhLXpBLVpfLV0vKSA/IGlkLnJlcGxhY2UoL1teMC05YS16QS1aXSsvZywgJ18nKSA6IGlkO1xuICBpZiAocmV0Lm1hdGNoKC9eKFswLTldfC0tfC1bMC05XXwtJCkvKSkge1xuICAgIHJldCA9ICdfJyArIHJldDtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5yaWNoPFQgZXh0ZW5kcyBGMndEYXRhPihcbiAgZWw6IFQsXG4gIHsgdGFnLCB1bnNhZmVIdG1sLCBhdHRyLCBjc3MsIHN0eWxlcyB9OiBBZHZGMndEYXRhXG4pOiBUIHtcbiAgaWYgKHRhZykgZWwudGFnID0gdGFnO1xuICBpZiAodW5zYWZlSHRtbCkgZWwudW5zYWZlSHRtbCA9IHVuc2FmZUh0bWw7XG4gIGlmIChzdHlsZXMpIHtcbiAgICBPYmplY3QuYXNzaWduKChlbC5zdHlsZXMgfHw9IHt9KSwgc3R5bGVzKTtcbiAgfVxuICBpZiAoYXR0cikge1xuICAgIE9iamVjdC5hc3NpZ24oKGVsLmF0dHIgfHw9IHt9KSwgYXR0cik7XG4gIH1cbiAgaWYgKGNzcykge1xuICAgIChlbC5jc3MgfHw9IFtdKS5wdXNoKC4uLmNzcyk7XG4gIH1cbiAgcmV0dXJuIGVsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzTm9QYXJlbnRXaXRoVGFnKFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgdGFnOiBzdHJpbmdcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gY3R4LnBhcmVudHMuZXZlcnkoKGl0KSA9PiBpdC50YWcgIT09IHRhZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQYXJlbnRXaXRoVGFnKFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgdGFnOiBzdHJpbmdcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gISFjdHgucGFyZW50cy5maW5kKChpdCkgPT4gaXQudGFnID09PSB0YWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGFyZW50V2l0aFRhZ1JFKFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgdGFnUkU6IFJlZ0V4cFxuKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIWN0eC5wYXJlbnRzLmZpbmQoKGl0KSA9PiB0YWdSRS50ZXN0KGl0LnRhZykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2lkZXNUb1NpbXBsaWZpZWQ8VD4oXG4gIHRvcDogVCxcbiAgcmlnaHQ6IFQsXG4gIGJvdHRvbTogVCxcbiAgbGVmdDogVFxuKTogVFtdIHtcbiAgaWYgKGxlZnQgPT09IHJpZ2h0KSB7XG4gICAgaWYgKHRvcCA9PT0gYm90dG9tKSB7XG4gICAgICBpZiAodG9wID09PSBsZWZ0KSB7XG4gICAgICAgIHJldHVybiBbdG9wXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbdG9wLCBsZWZ0XTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFt0b3AsIGxlZnQsIGJvdHRvbV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBbdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0XTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29ybmVyc1RvU2ltcGxpZmllZDxUPihcbiAgdG9wbGVmdDogVCxcbiAgdG9wcmlnaHQ6IFQsXG4gIGJvdHRvbXJpZ2h0OiBULFxuICBib3R0b21sZWZ0OiBUXG4pOiBUW10ge1xuICByZXR1cm4gc2lkZXNUb1NpbXBsaWZpZWQodG9wbGVmdCwgdG9wcmlnaHQsIGJvdHRvbXJpZ2h0LCBib3R0b21sZWZ0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFN0eWxlcyhub2RlOiBIdG1sRWxlbWVudCwgdmFsdWVzOiBUeXBlZFN0eWxlcyk6IHZvaWQge1xuICBPYmplY3QuZW50cmllcyh2YWx1ZXMpLmZvckVhY2goKFtrLCB2XSkgPT5cbiAgICBzZXRTdHlsZShub2RlLCBrIGFzIEFsbG93ZWRQcm9wZXJ0aWVzLCB2KVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0U3R5bGUoXG4gIG5vZGU6IEh0bWxFbGVtZW50LFxuICBrZXk6IEFsbG93ZWRQcm9wZXJ0aWVzLFxuICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkXG4pOiB2b2lkIHtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBtYXAgPSAobm9kZS5zdHlsZXMgfHw9IHt9KTtcbiAgICBtYXBba2V5XSA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFN0eWxlKFxuICBub2RlOiBIdG1sRWxlbWVudCxcbiAga2V5OiBzdHJpbmcsXG4gIHZhbHVlczogc3RyaW5nW10sXG4gIHNlcGFyYXRvciA9ICcgJ1xuKTogdm9pZCB7XG4gIGlmICh2YWx1ZXMubGVuZ3RoKSB7XG4gICAgY29uc3Qgc3R5bGVzID0gKG5vZGUuc3R5bGVzID8/PSB7fSk7XG4gICAgY29uc3QgdiA9IHZhbHVlcy5qb2luKHNlcGFyYXRvcik7XG4gICAgaWYgKHN0eWxlc1trZXldKSB7XG4gICAgICBzdHlsZXNba2V5XSArPSBzZXBhcmF0b3IgKyB2O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXNba2V5XSA9IHY7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRNZWRpYUNhbGxzaXRlKFxuICBub2RlOiBIdG1sRWxlbWVudCxcbiAgLi4uY3M6IE1lZGlhQ2FsbHNpdGVbXVxuKTogdm9pZCB7XG4gIGlmIChub2RlLmNhbGxzaXRlcykge1xuICAgIG5vZGUuY2FsbHNpdGVzLnB1c2goLi4uY3MpO1xuICB9IGVsc2Uge1xuICAgIG5vZGUuY2FsbHNpdGVzID0gWy4uLmNzXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ2xhc3MoaHRtbDogSHRtbEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGNsYXNzTGlzdCA9IChodG1sLmNsYXNzZXMgPz89IFtdKTtcbiAgaWYgKCFjbGFzc0xpc3QuaW5jbHVkZXMoY2xhc3NOYW1lKSkgY2xhc3NMaXN0LnB1c2goY2xhc3NOYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NraWZ5KG5vZGU6IEh0bWxFbGVtZW50KTogdm9pZCB7XG4gIGlmICghbm9kZS5zdHlsZXM/LlsnZGlzcGxheSddKSBzZXRTdHlsZShub2RlLCAnZGlzcGxheScsICdibG9jaycpO1xuICBlbHNlIHtcbiAgICBjb25zdCBkaXNwbGF5ID0gbm9kZS5zdHlsZXNbJ2Rpc3BsYXknXTtcbiAgICBzZXRTdHlsZShcbiAgICAgIG5vZGUsXG4gICAgICAnZGlzcGxheScsXG4gICAgICBkaXNwbGF5ID09PSAnaW5saW5lJyA/ICdibG9jaycgOiBkaXNwbGF5LnJlcGxhY2UoL2lubGluZS0vLCAnJylcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5NYWtlSW1nKGZpbGxzOiAoUGFpbnQgfCBSZXN0UGFpbnQpW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBmaWxscy5sZW5ndGggPT09IDEgJiZcbiAgICBmaWxsc1swXS50eXBlID09PSAnSU1BR0UnICYmXG4gICAgZmlsbHNbMF0uc2NhbGVNb2RlICE9PSAnVElMRSdcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbk1ha2VWaWRlbyhmaWxscz86IHJlYWRvbmx5IChQYWludCB8IFJlc3RQYWludClbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGZpbGxzPy5sZW5ndGggPT09IDEgJiZcbiAgICBmaWxsc1swXS50eXBlID09PSAnVklERU8nICYmXG4gICAgZmlsbHNbMF0uc2NhbGVNb2RlICE9PSAnVElMRSdcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsdGVyZWRQYWludChmaWxsOiBQYWludCB8IFJlc3RQYWludCk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGZpbGwudHlwZSA9PT0gJ0lNQUdFJyAmJlxuICAgIChoYXNGaWx0ZXIoZmlsbC5maWx0ZXJzKSB8fCAoZmlsbC5vcGFjaXR5ID8/IDEpICE9PSAxKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzRmlsdGVyKGZpbHRlcnM/OiBJbWFnZUZpbHRlcnMpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICAhIWZpbHRlcnMgJiZcbiAgICAhIShcbiAgICAgIGZpbHRlcnMuY29udHJhc3QgfHxcbiAgICAgIGZpbHRlcnMuZXhwb3N1cmUgfHxcbiAgICAgIGZpbHRlcnMuaGlnaGxpZ2h0cyB8fFxuICAgICAgZmlsdGVycy5zYXR1cmF0aW9uIHx8XG4gICAgICBmaWx0ZXJzLnNoYWRvd3MgfHxcbiAgICAgIGZpbHRlcnMudGVtcGVyYXR1cmUgfHxcbiAgICAgIGZpbHRlcnMudGludFxuICAgIClcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldFBhcmVudCA9IChjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCk6IEh0bWxFbGVtZW50IHwgdW5kZWZpbmVkID0+XG4gIGN0eC5wYXJlbnRzW2N0eC5wYXJlbnRzLmxlbmd0aCAtIDFdO1xuXG5leHBvcnQgZnVuY3Rpb24gc2FtZUZpbHRlcihhPzogSW1hZ2VGaWx0ZXJzLCBiPzogSW1hZ2VGaWx0ZXJzKTogYm9vbGVhbiB7XG4gIGlmIChhID09PSBiKSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgaGFzQSA9IGhhc0ZpbHRlcihhKTtcbiAgY29uc3QgaGFzQiA9IGhhc0ZpbHRlcihiKTtcbiAgaWYgKGhhc0EgJiYgaGFzQikge1xuICAgIHJldHVybiAoXG4gICAgICBhIS5jb250cmFzdCA9PT0gYiEuY29udHJhc3QgJiZcbiAgICAgIGEhLmV4cG9zdXJlID09PSBiIS5leHBvc3VyZSAmJlxuICAgICAgYSEuaGlnaGxpZ2h0cyA9PT0gYiEuaGlnaGxpZ2h0cyAmJlxuICAgICAgYSEuc2F0dXJhdGlvbiA9PT0gYiEuc2F0dXJhdGlvbiAmJlxuICAgICAgYSEuc2hhZG93cyA9PT0gYiEuc2hhZG93cyAmJlxuICAgICAgYSEudGVtcGVyYXR1cmUgPT09IGIhLnRlbXBlcmF0dXJlICYmXG4gICAgICBhIS50aW50ID09PSBiIS50aW50XG4gICAgKTtcbiAgfVxuICByZXR1cm4gaGFzQSA9PT0gaGFzQjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxPcGFjaXR5RmlsdGVyKGZpbGw6IFBhaW50IHwgUmVzdFBhaW50IHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgcmV0dXJuIChmaWxsPy50eXBlID09PSAnSU1BR0UnICYmIGZpbGwub3BhY2l0eSkgfHwgMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5lZWRUb1NwbGl0RmlsbHMoXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUsXG4gIGZpbGxzOiAoUGFpbnQgfCBSZXN0UGFpbnQpW11cbik6IGJvb2xlYW4ge1xuICBpZiAoIWZpbGxzLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICBpZiAoZmlsbHMuZXZlcnkoKGl0KSA9PiAhaXNGaWx0ZXJlZFBhaW50KGl0KSkpIHJldHVybiBmYWxzZTtcbiAgLy8gaWYgY2hpbGRyZW4sIG5lZWQgdG8gc3BsaXQgZmlsbHMgdG8gdXNlIENTUyBmaWx0ZXIgKG90aGVyd2lzZSBmaWx0ZXIvb3BhY2l0eSB3b3VsZCBhcHBseSB0byBjaGlsZHJlbiBhcyB3ZWxsKVxuICBpZiAoaGFzQ2hpbGRyZW4obm9kZSkpIHJldHVybiB0cnVlO1xuICAvLyAxIGZpbGwgd2l0aCBmaWx0ZXIsIG5vIGNoaWxkcmVuIC0+IGNhbiB1c2UgQ1NTIGZpbHRlciZvcGFjaXR5XG4gIGlmIChmaWxscy5sZW5ndGggPT09IDEpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDaGlsZHJlbihub2RlOiBCYXNlTm9kZSB8IFJlc3RCYXNlTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gJ2NoaWxkcmVuJyBpbiBub2RlICYmIG5vZGUuY2hpbGRyZW4/Lmxlbmd0aCA+IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlT3BhY2l0eShcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIG5vZGU6IFNjZW5lTm9kZVxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCdvcGFjaXR5JyBpbiBub2RlKSB7XG4gICAgaWYgKG5vZGUuYm91bmRWYXJpYWJsZXM/Lm9wYWNpdHkpIHtcbiAgICAgIGNvbnN0IG9wYWNpdHk6IENzc1ZhbHVlVmFyID0ge1xuICAgICAgICB0eXBlOiAnVkFSSUFCTEUnLFxuICAgICAgICB2YXJpYWJsZTogbm9kZS5ib3VuZFZhcmlhYmxlcy5vcGFjaXR5LFxuICAgICAgICB1bml0OiAnJyxcbiAgICAgIH07XG4gICAgICByZXR1cm4gYGNhbGMoJHtjc3NWYWx1ZVRvU3RyaW5nKFtvcGFjaXR5XSwgY3R4KX0gLyAxMDApYDtcbiAgICB9IGVsc2UgaWYgKG5vZGUub3BhY2l0eSAhPT0gMSkgcmV0dXJuIFN0cmluZyhyb3VuZFRvKG5vZGUub3BhY2l0eSwgMTAwKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ3NzRmlsdGVycyhmaWx0ZXJzPzogSW1hZ2VGaWx0ZXJzKTogc3RyaW5nW10ge1xuICBjb25zdCBjc3NGaWx0ZXJzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoaGFzRmlsdGVyKGZpbHRlcnMpKSB7XG4gICAgY29uc3QgeyBjb250cmFzdCwgc2F0dXJhdGlvbiwgZXhwb3N1cmUgfSA9IGZpbHRlcnMhO1xuICAgIGlmIChjb250cmFzdCkge1xuICAgICAgLy8gLTEgLT4gMSA9PT4gMC44IC0+IDEuMiAoYXBwcm94ID8pXG4gICAgICBjc3NGaWx0ZXJzLnB1c2goYGNvbnRyYXN0KCR7MC44ICsgKGNvbnRyYXN0ICsgMSkgLyA1fSlgKTtcbiAgICB9XG4gICAgaWYgKHNhdHVyYXRpb24pIHtcbiAgICAgIC8vIC0xIC0+IDEgPT0+IDAgLT4gMiAoYXBwcm94ID8pXG4gICAgICBjc3NGaWx0ZXJzLnB1c2goYHNhdHVyYXRlKCR7c2F0dXJhdGlvbiArIDF9KWApO1xuICAgIH1cbiAgICBpZiAoZXhwb3N1cmUpIHtcbiAgICAgIC8vIC0xIC0+IDEgPT0+IDAuMSAtPiA2IChmaWdtYSBhbGdvcml0aG0gc2VlbXMgZGlmZmVyZW50KVxuICAgICAgY3NzRmlsdGVycy5wdXNoKFxuICAgICAgICBgYnJpZ2h0bmVzcygke1xuICAgICAgICAgIGV4cG9zdXJlIDwgMCA/IDAuMSArICgoZXhwb3N1cmUgKyAxKSAqIDkpIC8gMTAgOiAxICsgZXhwb3N1cmUgKiA1XG4gICAgICAgIH0pYFxuICAgICAgKTtcbiAgICB9XG4gICAgLy8gVE9ETyBzdXBwb3J0IG90aGVyIGZpZ21hIGZpbHRlcnMgc29tZWhvdyA/XG4gICAgLy8gZWl0aGVyIGJ5IGV4cG9ydGluZyBmaWdtYSB0cmFuc2Zvcm1lZCBpbWFnZSwgb3IgdXNpbmcgU1ZHIGltYWdlICYgZmlsdGVycyB3aGljaCBhcmUgbW9yZSBjYXBhYmxlID9cbiAgfVxuICByZXR1cm4gY3NzRmlsdGVycztcbn1cblxuZXhwb3J0IGNvbnN0IEVNQkVEX05BTUUgPSAnPGVtYmVkPic7XG5cbmV4cG9ydCBjb25zdCBpc0VtYmVkID0gKG46IHsgbmFtZTogc3RyaW5nOyBmMndEYXRhPzogRjJ3RGF0YSB9KTogYm9vbGVhbiA9PlxuICBuLm5hbWUgPT09IEVNQkVEX05BTUUgfHwgISFuLmYyd0RhdGE/LnVuc2FmZUh0bWw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRFbWJlZFJlbGF1Y2hEYXRhKG5vZGU6IFNjZW5lTm9kZSk6IHZvaWQge1xuICAvLyBSZWxhdW5jaEFjdGlvbnMuRURJVCBub3QgYWNjZXNzaWJsZSBmcm9tIGhlcmVcbiAgaWYgKCFub2RlLmdldFJlbGF1bmNoRGF0YSgpLmVkaXQpIHtcbiAgICBub2RlLnNldFJlbGF1bmNoRGF0YSh7IGVkaXQ6ICdFZGl0IGVtYmVkIEhUTUwnIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRGMndEYXRhKFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlXG4pOiBQcm9taXNlPEYyd0RhdGE+IHtcbiAgY29uc3QgZjJ3RGF0YSA9IGF3YWl0IGdldFNoYXJlZERhdGFPYmo8RjJ3RGF0YSB8IHVuZGVmaW5lZD4oXG4gICAgbm9kZSxcbiAgICBGMndOYW1lc3BhY2UsXG4gICAgRjJ3RGF0YUtleSxcbiAgICB1bmRlZmluZWRcbiAgKTtcbiAgaWYgKGYyd0RhdGEpIHJldHVybiBmMndEYXRhO1xuXG4gIC8vIGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9jb21tdW5pdHkvcGx1Z2luLzEzNTY2OTM4MDg5MzIzOTI3MjkvdGFncy1hdHRyaWJ1dGVzLWF0dGFjaC1zZW1hbnRpYy1kYXRhLXRvLXlvdXItZGVzaWduLWVsZW1lbnRzLWFuZC1lbnN1cmUtYS1zZWFtbGVzcy1kZXYtaGFuZG9mZlxuICBjb25zdCBmaWdtYUF0dHJzID0gYXdhaXQgZ2V0U2hhcmVkRGF0YU9iajxhbnk+KFxuICAgIG5vZGUsXG4gICAgJ2ZpZ21hLmF0dHJpYnV0ZXMnLFxuICAgICdhdHRyaWJ1dGVzJyxcbiAgICB1bmRlZmluZWRcbiAgKTtcbiAgaWYgKGZpZ21hQXR0cnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGFnOiBmaWdtYUF0dHJzLnRhZyxcbiAgICAgIGF0dHI6IGZpZ21hQXR0cnMuYXR0cmlidXRlcyxcbiAgICB9O1xuICB9XG4gIHJldHVybiB7fTtcbn1cblxubGV0IGN1cnJlbnRfZ3VpZCA9IDE7XG5jb25zdCBkZWJ1Z19jYWNoZTogUmVjb3JkPHN0cmluZywgSHRtbEVsZW1lbnQ+ID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVHdWlkKGVsdDogSHRtbEVsZW1lbnQpOiBzdHJpbmcge1xuICBjb25zdCBndWlkID0gKGVsdC5ndWlkIHx8PSBTdHJpbmcobmV4dEd1aWQoKSkpO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBkZWJ1Z19jYWNoZVtndWlkXSA9IGVsdDtcbiAgfVxuICByZXR1cm4gZ3VpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeUFuaW1hdGVkRWxlbWVudHNBcmVJbkRvbShcbiAgYm9keTogSHRtbEVsZW1lbnQsXG4gIHJlYWN0aW9uczogUmVjb3JkPHN0cmluZywgRE9NRjJ3QWN0aW9uPlxuKTogdm9pZCB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHRyYXZlcnNlRWxlbWVudChib2R5LCAoZWwpID0+IHtcbiAgICAgIChlbCBhcyBhbnkpLiRkb20gPSB0cnVlO1xuICAgICAgaWYgKCd0YWcnIGluIGVsKSB7XG4gICAgICAgIGVsLmNoaWxkcmVuPy5mb3JFYWNoKChjKSA9PiAndGFnJyBpbiBjICYmICgoYyBhcyBhbnkpLiRwYXJlbnQgPSBlbCkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGZvciAoY29uc3QgYSBvZiBjcmF3bEFjdGlvbnMoT2JqZWN0LnZhbHVlcyhyZWFjdGlvbnMpKSkge1xuICAgICAgaWYgKGEudHlwZSA9PT0gJ0FOSU1BVEUnKSB7XG4gICAgICAgIGZvciAoY29uc3QgYiBvZiBhLmFuaW1hdGlvbnMpIHtcbiAgICAgICAgICBjb25zdCBlbHQgPSBkZWJ1Z19jYWNoZVtiLmVsdElkXTtcbiAgICAgICAgICBpZiAoIShlbHQgYXMgYW55KT8uJGRvbSkge1xuICAgICAgICAgICAgc2hvdWxkTm90SGFwcGVuKGBFbGVtZW50ICR7Yi5lbHRJZH0gaXMgbm90IGluIHRoZSBET01gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGIuYWx0SWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFsdCA9IGRlYnVnX2NhY2hlW2IuYWx0SWRdO1xuICAgICAgICAgICAgaWYgKCEoYWx0IGFzIGFueSk/LiRkb20pIHtcbiAgICAgICAgICAgICAgc2hvdWxkTm90SGFwcGVuKGBFbGVtZW50ICR7Yi5hbHRJZH0gaXMgbm90IGluIHRoZSBET01gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdHJhdmVyc2VFbGVtZW50KGJvZHksIChlbCkgPT4ge1xuICAgICAgZGVsZXRlIChlbCBhcyBhbnkpLiRkb207XG4gICAgICBkZWxldGUgKGVsIGFzIGFueSkuJHBhcmVudDtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dEd1aWQoKTogbnVtYmVyIHtcbiAgcmV0dXJuIGN1cnJlbnRfZ3VpZCsrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Tm9kZVBhcmFtcyhcbiAgaHRtbDogSHRtbEVsZW1lbnQsXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUsXG4gIGN0eDogTWFwcGluZ0V4ZWNDb250ZXh0XG4pOiB2b2lkIHtcbiAgaHRtbC5ub2RlID0gbm9kZVByb3BzKG5vZGUsIGN0eC5zY2FsZSk7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGh0bWwucGF0aCA9IGN0eC5wYXRoO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub2RlUHJvcHMoXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUsXG4gIHNjYWxlID0gMVxuKTogTm9kZVByb3BzIHtcbiAgY29uc3QgeyBpZCwgdHlwZSwgbmFtZSB9ID0gbm9kZTtcbiAgY29uc3QgeyB4OiB3aWR0aCwgeTogaGVpZ2h0IH0gPSBnZXRTaXplKG5vZGUsIHNjYWxlKTtcbiAgY29uc3QgeyB4LCB5IH0gPSBnZXRPZmZzZXQobm9kZSwgc2NhbGUpO1xuICBjb25zdCBub2RlUHJvcHM6IE5vZGVQcm9wcyA9IHsgaWQsIHR5cGUsIHdpZHRoLCBoZWlnaHQsIHgsIHkgfTtcbiAgaWYgKChub2RlIGFzIEJsZW5kTWl4aW4pLmlzTWFzaykgbm9kZVByb3BzLmlzTWFzayA9IHRydWU7XG4gIGlmIChub2RlLnR5cGUgIT09ICdURVhUJyB8fCAhKG5vZGUgYXMgVGV4dE5vZGUpLmF1dG9SZW5hbWUpXG4gICAgbm9kZVByb3BzLm5hbWUgPSBuYW1lO1xuICByZXR1cm4gbm9kZVByb3BzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGVJZChpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuICdUJyArIGlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIGNyYXdsQWN0aW9uczxUPihcbiAgaXQ6IEl0ZXJhYmxlPEJhc2VGMndBY3Rpb248VD4+XG4pOiBHZW5lcmF0b3I8QmFzZUYyd0FjdGlvbjxUPj4ge1xuICBmb3IgKGNvbnN0IGEgb2YgaXQpIHtcbiAgICB5aWVsZCBhO1xuICAgIGlmIChhLnR5cGUgPT09ICdDT05ESVRJT05BTCcpIHtcbiAgICAgIGZvciAoY29uc3QgYiBvZiBhLmNvbmRpdGlvbmFsQmxvY2tzKSB7XG4gICAgICAgIHlpZWxkKiBjcmF3bEFjdGlvbnMoYi5hY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGEudHlwZSA9PT0gJ0tFWV9DT05ESVRJT04nKSB7XG4gICAgICB5aWVsZCogY3Jhd2xBY3Rpb25zKGEuYWN0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogY3Jhd2xBbmltYXRpb25zPFQ+KFxuICBpdDogUmVjb3JkPGFueSwgQmFzZUYyd0FjdGlvbjxUPj4sXG4gIHJldmVyc2UgPSBmYWxzZVxuKTogR2VuZXJhdG9yPFQ+IHtcbiAgY29uc3QgYXJyID0gT2JqZWN0LnZhbHVlcyhpdCk7XG4gIGlmIChyZXZlcnNlKSBhcnIucmV2ZXJzZSgpO1xuICBmb3IgKGNvbnN0IGEgb2YgY3Jhd2xBY3Rpb25zPFQ+KGFycikpIHtcbiAgICBpZiAoYS50eXBlID09PSAnQU5JTUFURScpIHtcbiAgICAgIGZvciAoY29uc3QgYiBvZiBhLmFuaW1hdGlvbnMpIHtcbiAgICAgICAgeWllbGQgYjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgVHJhdmVyc2VDYiA9IChcbiAgbm9kZTogSHRtbEVsZW1lbnQsXG4gIHBhcmVudD86IEh0bWxFbGVtZW50XG4pID0+IHZvaWQgfCBib29sZWFuO1xuXG5leHBvcnQgZnVuY3Rpb24gdHJhdmVyc2VFbGVtZW50cyhcbiAgcm9vdHM6IEh0bWxOb2RlW10sXG4gIC4uLmNiczogVHJhdmVyc2VDYltdXG4pOiB2b2lkIHtcbiAgY2JzLmZvckVhY2goKGNiKSA9PiByb290cy5mb3JFYWNoKChyKSA9PiB0cmF2ZXJzZUVsZW1lbnQociwgY2IpKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmF2ZXJzZUVsZW1lbnQocm9vdDogSHRtbE5vZGUsIGNiOiBUcmF2ZXJzZUNiKTogdm9pZCB7XG4gIGNvbnN0IHN0YWNrID1cbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IG5ldyBTZXQ8SHRtbE5vZGU+KCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHRyYXZlcnNlTm9kZSA9IChub2RlOiBIdG1sTm9kZSwgcGFyZW50PzogSHRtbEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoc3RhY2s/Lmhhcyhub2RlKSkge1xuICAgICAgc2hvdWxkTm90SGFwcGVuKCdDeWNsaW5nIGVsZW1lbnQgdHJlZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFjaz8uYWRkKG5vZGUpO1xuICAgIH1cbiAgICBpZiAoJ3RhZycgaW4gbm9kZSkge1xuICAgICAgaWYgKGNiKG5vZGUsIHBhcmVudCkpIHJldHVybjtcbiAgICAgIChub2RlLmNoaWxkcmVuIHx8IFtdKS5mb3JFYWNoKChpdCkgPT4gdHJhdmVyc2VOb2RlKGl0LCBub2RlKSk7XG4gICAgfVxuICB9O1xuICB0cmF2ZXJzZU5vZGUocm9vdCwgdW5kZWZpbmVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ3NzKFxuICB0YXJnZXQ6IHN0cmluZyxcbiAgdmFyczogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkPixcbiAgaW5kZW50Pzogc3RyaW5nXG4pOiBzdHJpbmcge1xuICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXModmFycyk7XG4gIGlmICghZW50cmllcy5sZW5ndGgpIHJldHVybiAnJztcbiAgbGV0IGxpbmVzID0gW1xuICAgIHRhcmdldCArICcgeycsXG4gICAgLi4uZW50cmllc1xuICAgICAgLmZpbHRlcigoWywgdl0pID0+IHYgIT09IHVuZGVmaW5lZCAmJiB2ICE9PSAnJylcbiAgICAgIC5tYXAoKFtrLCB2XSkgPT4gYCAgJHtrfTogJHt2fTtgKSxcbiAgICAnfScsXG4gIF07XG4gIGlmIChpbmRlbnQpIGxpbmVzID0gbGluZXMubWFwKChsKSA9PiBpbmRlbnQgKyBsKTtcbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hpbmdOb2RlczxUPihcbiAgdmFyaWFudHNXaXRoUHJvcHM6IHsgbm9kZTogVDsgcHJvcHM6IFZhbGlkVmFyaWFudFByb3BlcnRpZXMgfVtdLFxuICBuZXdQcm9wczogVmFsaWRWYXJpYW50UHJvcGVydGllcyxcbiAgY3VycmVudFByb3BzOiBWYWxpZFZhcmlhbnRQcm9wZXJ0aWVzXG4pOiBUW10ge1xuICBjb25zdCBuZXdFbnRyaWVzID0gT2JqZWN0LmVudHJpZXMobmV3UHJvcHMpO1xuICBjb25zdCBjdXJyZW50RW50cmllcyA9IE9iamVjdC5lbnRyaWVzKGN1cnJlbnRQcm9wcyk7XG4gIGNvbnN0IHNhbWUgPSAoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBib29sZWFuID0+XG4gICAgYS5sb2NhbGVDb21wYXJlKGIsIHVuZGVmaW5lZCwgeyBzZW5zaXRpdml0eTogJ2FjY2VudCcgfSkgPT09IDA7XG4gIHJldHVybiB2YXJpYW50c1dpdGhQcm9wc1xuICAgIC5maWx0ZXIoKHsgcHJvcHMgfSkgPT4gbmV3RW50cmllcy5ldmVyeSgoW2ssIHZdKSA9PiBzYW1lKHYsIHByb3BzW2tdKSkpXG4gICAgLm1hcCgoeyBub2RlLCBwcm9wcyB9KSA9PiAoe1xuICAgICAgc2NvcmU6IGN1cnJlbnRFbnRyaWVzLmZpbHRlcigoW2ssIHZdKSA9PiBzYW1lKHYsIHByb3BzW2tdKSkubGVuZ3RoLFxuICAgICAgbm9kZSxcbiAgICB9KSlcbiAgICAuc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpXG4gICAgLm1hcCgodikgPT4gdi5ub2RlKTtcbn1cblxuLy8gUmV0dXJuIG1heCBmaXhlZCBzaXplIGluIHRoZSBmb3JtYXQgXCIxNDBweFwiIGlmIHRoZXJlIGlzIGEgY2xhbXAgaW4gd2lkdGggZm9yIHRoaXMgZWxlbWVudFxuLy8gT3RoZXJ3aXNlIHJldHVybiB1bmRlZmluZWQuXG5leHBvcnQgZnVuY3Rpb24gbWF4Rml4ZWRXaWR0aE9mRWxlbWVudChcbiAgZWw6IEh0bWxFbGVtZW50IHwgdW5kZWZpbmVkLFxuICBwYXJlbnRlbDogSHRtbEVsZW1lbnQgfCB1bmRlZmluZWRcbik6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHcgPSBlbD8uc3R5bGVzPy53aWR0aDtcbiAgY29uc3QgbWF4dyA9IGVsPy5zdHlsZXM/LlsnbWF4LXdpZHRoJ107XG4gIGNvbnN0IHBfdyA9IHBhcmVudGVsPy5zdHlsZXM/LndpZHRoO1xuICBjb25zdCBwX21heHcgPSBwYXJlbnRlbD8uc3R5bGVzPy5bJ21heC13aWR0aCddO1xuXG4gIC8vIENoZWNrIGV2ZXJ5IHZhbHVlIGluIG9yZGVyXG4gIC8vIE5vdGU6IFRoaXMgd29ya3MgYmVjYXVzZSB3aWR0aCBhbmQgbWF4V2lkdGggd2lsbCBhbHdheXMgaGF2ZVxuICAvLyBgLi4ucHhgIG9yIGAuLi4lYCBhcyB2YWx1ZXMuXG4gIGNvbnN0IHZhbHVlcyA9IFt3LCBtYXh3LCBwX3csIHBfbWF4d107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdiA9IHZhbHVlc1tpXTtcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICBpZiAodi5lbmRzV2l0aCgnJScpKSBjb250aW51ZTtcbiAgICBpZiAodi5lbmRzV2l0aCgncHgnKSkgcmV0dXJuIHBhcnNlSW50KHYsIDEwKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qXG4gKiBSZXR1cm4gbWF4IGZpeGVkIHNpemUgaW4gdGhlIGZvcm1hdCBcIjE0MHB4XCIgaWYgdGhlcmUgaXMgYSBjbGFtcCBpbiB3aWR0aCBmb3IgdGhpcyBlbGVtZW50XG4gKiBPdGhlcndpc2UgcmV0dXJuIHVuZGVmaW5lZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1heEZpeGVkSGVpZ2h0T2ZFbGVtZW50KFxuICBlbDogSHRtbEVsZW1lbnQgfCB1bmRlZmluZWQsXG4gIHBhcmVudGVsOiBIdG1sRWxlbWVudCB8IHVuZGVmaW5lZFxuKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgaCA9IGVsPy5zdHlsZXM/LmhlaWdodDtcbiAgY29uc3QgbWF4aCA9IGVsPy5zdHlsZXM/LlsnbWF4LWhlaWdodCddO1xuICBjb25zdCBwX2ggPSBwYXJlbnRlbD8uc3R5bGVzPy5oZWlnaHQ7XG4gIGNvbnN0IHBfbWF4aCA9IHBhcmVudGVsPy5zdHlsZXM/LlsnbWF4LWhlaWdodCddO1xuXG4gIC8vIENoZWNrIGV2ZXJ5IHZhbHVlIGluIG9yZGVyXG4gIC8vIE5vdGU6IFRoaXMgd29ya3MgYmVjYXVzZSBoZWlnaHQgYW5kIG1heGhlaWdodCB3aWxsIGFsd2F5cyBoYXZlXG4gIC8vIGAuLi5weGAgb3IgYC4uLiVgIGFzIHZhbHVlcy5cbiAgY29uc3QgdmFsdWVzID0gW2gsIG1heGgsIHBfaCwgcF9tYXhoXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB2ID0gdmFsdWVzW2ldO1xuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgIGlmICh2LmVuZHNXaXRoKCclJykpIGNvbnRpbnVlO1xuICAgIGlmICh2LmVuZHNXaXRoKCdweCcpKSByZXR1cm4gcGFyc2VJbnQodiwgMTApO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsICJleHBvcnQgY29uc3QgcmVhY3Rpb25fdHlwZXMgPSBbXG4gICdhcHBlYXInLFxuICAnbW91c2Vkb3duJyxcbiAgJ21vdXNlZW50ZXInLFxuICAnbW91c2VsZWF2ZScsXG4gICdtb3VzZXVwJyxcbiAgJ3RpbWVvdXQnLFxuICAnY2xpY2snLFxuICAncHJlc3MnLFxuICAnZHJhZycsXG4gICdrZXlkb3duJyxcbiAgJ2hvdmVyJyxcbl0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIFRyaWdnZXJUeXBlID0gKHR5cGVvZiByZWFjdGlvbl90eXBlcylbbnVtYmVyXTtcbiIsICJleHBvcnQgZnVuY3Rpb24gb25jZTxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkPihcbiAgcnVuOiBUIHwgbnVsbCB8IHVuZGVmaW5lZCB8IHZvaWRcbik6IFQgfCB1bmRlZmluZWQge1xuICBpZiAoIXJ1bikgcmV0dXJuO1xuICByZXR1cm4gKCguLi5hcmdzKSA9PiB7XG4gICAgaWYgKCFydW4pIHJldHVybjtcbiAgICBjb25zdCB0b1J1biA9IHJ1bjtcbiAgICBydW4gPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHRvUnVuKC4uLmFyZ3MpO1xuICB9KSBhcyBUO1xufVxuIiwgImV4cG9ydCB0eXBlIENsZWFudXBGbiA9ICgpID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBCb3VuZEVsZW1lbnQgPSBTVkdFbGVtZW50IHwgSFRNTEVsZW1lbnQ7XG5jb25zdCBpc0JvdW5kRWxlbWVudCA9IChlOiBhbnkpOiBlIGlzIEJvdW5kRWxlbWVudCA9PlxuICBlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgZSBpbnN0YW5jZW9mIFNWR0VsZW1lbnQ7XG5cbmZ1bmN0aW9uIG9uRGlzY29ubmVjdGVkKGU6IEJvdW5kRWxlbWVudCwgY2I6IENsZWFudXBGbiB8IHZvaWQpOiB2b2lkIHtcbiAgaWYgKCFlLnBhcmVudEVsZW1lbnQpIHJldHVybjsgLy8gYWxyZWFkeSByZW1vdmVkXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zLmZpbHRlcigobSkgPT4gbS50eXBlID09PSAnY2hpbGRMaXN0JykpXG4gICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgbXV0YXRpb24ucmVtb3ZlZE5vZGVzKVxuICAgICAgICBpZiAobm9kZSA9PT0gZSkge1xuICAgICAgICAgIGNiPy4oKTtcbiAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgfSk7XG4gIG9ic2VydmVyLm9ic2VydmUoZS5wYXJlbnRFbGVtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uQ29ubmVjdGVkKFxuICBzZWxlY3Rvcjogc3RyaW5nLFxuICBjYjogKGU6IEJvdW5kRWxlbWVudCkgPT4gQ2xlYW51cEZuIHwgdm9pZFxuKTogKCkgPT4gdm9pZCB7XG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zLmZpbHRlcigobSkgPT4gbS50eXBlID09PSAnY2hpbGRMaXN0JykpXG4gICAgICBmb3IgKGNvbnN0IG4gb2YgbXV0YXRpb24uYWRkZWROb2RlcylcbiAgICAgICAgaWYgKGlzQm91bmRFbGVtZW50KG4pICYmIG4ubWF0Y2hlcyhzZWxlY3RvcikpIG9uRGlzY29ubmVjdGVkKG4sIGNiKG4pKTtcbiAgfSk7XG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuICByZXR1cm4gKCkgPT4gb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgRnJhbWVMaWtlTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHtcbiAgUmVzdEJhc2VOb2RlLFxuICBSZXN0U2NlbmVOb2RlLFxuICBSZXN0VGV4dE5vZGUsXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy9zcmMvZmlnbWEucmVzdC50eXBpbmdzJztcbmltcG9ydCB7IGFzc2VydFRoYXQgfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvYXNzZXJ0JztcbmltcG9ydCB7IG5vbmVPck51bGwgfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtcbiAgZ2V0Q2hpbGRyZW4sXG4gIGlzRnJhbWVMaWtlLFxufSBmcm9tICdAZGl2cmlvdHMvc3RvcnktdG8tZmlnbWEvaGVscGVycy9ub2Rlcyc7XG5pbXBvcnQge1xuICBsYXlvdXRTaXppbmdDb3VudGVyLFxuICBsYXlvdXRTaXppbmdIb3Jpem9udGFsLFxuICBsYXlvdXRTaXppbmdQcmltYXJ5LFxuICBsYXlvdXRTaXppbmdWZXJ0aWNhbCxcbn0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXV0aWxzL3NyYy9sYXlvdXRTaXppbmcnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkTW92ZU5lZ2F0aXZlR2FwVG9DaGlsZE1hcmdpbihcbiAgbm9kZTogRnJhbWVMaWtlTm9kZVxuKTogYm9vbGVhbiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGFzc2VydFRoYXQoKCkgPT4gIW5vbmVPck51bGwobm9kZS5sYXlvdXRNb2RlKSwgJ29ubHkgZm9yIGF1dG9sYXlvdXQgbm9kZXMnKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIG5vZGUucHJpbWFyeUF4aXNBbGlnbkl0ZW1zICE9PSAnU1BBQ0VfQkVUV0VFTicgJiZcbiAgICAhIW5vZGUuaXRlbVNwYWNpbmcgJiZcbiAgICBub2RlLml0ZW1TcGFjaW5nIDwgMFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkVXNlQWJzb2x1dGVQb3NpdGlvbkZvckF1dG9MYXlvdXQoXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGVcbik6IGJvb2xlYW4ge1xuICAvLyBtYXAgc3BhY2UtYmV0d2VlbiB3aXRoIGxlc3MgdGhhbiAyIGNoaWxkcmVuIGludG8gYWJzb2x1dGUgcG9zaXRpb25pbmdcbiAgaWYgKFxuICAgICFub25lT3JOdWxsKChub2RlIGFzIEF1dG9MYXlvdXRNaXhpbikubGF5b3V0TW9kZSkgJiZcbiAgICAobm9kZSBhcyBBdXRvTGF5b3V0TWl4aW4pLnByaW1hcnlBeGlzQWxpZ25JdGVtcyA9PT0gJ1NQQUNFX0JFVFdFRU4nICYmXG4gICAgKG5vZGUgYXMgQXV0b0xheW91dE1peGluKS5sYXlvdXRXcmFwICE9PSAnV1JBUCcgJiZcbiAgICBsYXlvdXRTaXppbmdIb3Jpem9udGFsKG5vZGUgYXMgU2NlbmVOb2RlKSA9PT0gJ0ZJWEVEJyAmJlxuICAgIGxheW91dFNpemluZ1ZlcnRpY2FsKG5vZGUgYXMgU2NlbmVOb2RlKSA9PT0gJ0ZJWEVEJ1xuICApIHtcbiAgICBjb25zdCBhdXRvbGF5b3V0Q2hpbGRyZW4gPSBnZXRBdXRvTGF5b3V0VmlzaWJsZUNoaWxkcmVuKG5vZGUpO1xuICAgIHJldHVybiAoXG4gICAgICAvLyBTaG91bGQgd29yayBmb3IgMSBjaGlsZCBhcyB3ZWxsLCBidXQgbm90IHN1cmUgaXQgaGFzIGFueSBiZW5lZml0IG92ZXIgZmxleFxuICAgICAgLy8gQ291bGQgYmUgdXNlZnVsIGlmIHRoZXJlJ3MgYW4gYW5pbWF0aW9uIHN3YXBwaW5nIGJldHdlZW4gMSBhbmQgMiBjaGlsZHJlblxuICAgICAgYXV0b2xheW91dENoaWxkcmVuLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgLy8gSWYgYSBjaGlsZCBpcyBGSUxMLCBmbGV4IHdpbGwgd29yayBqdXN0IGZpbmUgKG5vIG5lZ2F0aXZlIHBhZGRpbmcsIHVubGVzcyBzb21lIG1pbi1zaXplIGlzIGludm9sdmVkKVxuICAgICAgLy8gQW5kIGFueXdheSAxMDAlIHNpemUgd2lsbCBOT1Qgd29yayBpbiB0aGlzIGNhc2Ugd2l0aCBhYnNvbHV0ZSBwb3NpdGlvbmluZ1xuICAgICAgIWF1dG9sYXlvdXRDaGlsZHJlbi5zb21lKFxuICAgICAgICAoaXQpID0+XG4gICAgICAgICAgbGF5b3V0U2l6aW5nUHJpbWFyeShub2RlIGFzIFNjZW5lTm9kZSwgaXQgYXMgU2NlbmVOb2RlKSA9PT0gJ0ZJTEwnIHx8XG4gICAgICAgICAgLy8gVE9ETzogVGhpcyBvbmUgd2UgY291bGQgc3VwcG9ydCwgYnV0IHdlJ2QgaGF2ZSB0byByZW1vdmUgcGFkZGluZ3MgZnJvbSAlIGNoaWxkIGRpbWVuc2lvbnNcbiAgICAgICAgICBsYXlvdXRTaXppbmdDb3VudGVyKG5vZGUgYXMgU2NlbmVOb2RlLCBpdCBhcyBTY2VuZU5vZGUpID09PSAnRklMTCdcbiAgICAgIClcbiAgICApO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzVGV4dE5vZGUoXG4gIG5vZGU6IEJhc2VOb2RlIHwgUmVzdEJhc2VOb2RlXG4pOiBUZXh0Tm9kZSB8IFJlc3RUZXh0Tm9kZSB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdURVhUJ1xuICAgID8gbm9kZVxuICAgIDogaXNGcmFtZUxpa2Uobm9kZSlcbiAgICA/IChub2RlLmNoaWxkcmVuWzBdIGFzIFRleHROb2RlKVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgY29uc3QgY3VzdG9tVmlkZW9FbGVtZW50cyA9IG5ldyBTZXQoW1xuICAneW91dHViZS12aWRlbycsXG4gICd2aW1lby12aWRlbycsXG4gICdzcG90aWZ5LWF1ZGlvJyxcbiAgJ2p3cGxheWVyLXZpZGVvJyxcbiAgJ3ZpZGVvanMtdmlkZW8nLFxuICAnd2lzdGlhLXZpZGVvJyxcbiAgJ2Nsb3VkZmxhcmUtdmlkZW8nLFxuICAnaGxzLXZpZGVvJyxcbiAgJ3NoYWthLXZpZGVvJyxcbiAgJ2Rhc2gtdmlkZW8nLFxuXSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdXRvTGF5b3V0VmlzaWJsZUNoaWxkcmVuKFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlXG4pOiAoKFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUpICYgQXV0b0xheW91dENoaWxkcmVuTWl4aW4pW10ge1xuICBnZXRDaGlsZHJlbihub2RlKTtcbiAgaWYgKChub2RlIGFzIEF1dG9MYXlvdXRNaXhpbikubGF5b3V0TW9kZSAhPT0gJ05PTkUnKSB7XG4gICAgcmV0dXJuIGdldENoaWxkcmVuKG5vZGUpLmZpbHRlcihcbiAgICAgIChjaGlsZCkgPT5cbiAgICAgICAgKGNoaWxkIGFzIEF1dG9MYXlvdXRDaGlsZHJlbk1peGluKS5sYXlvdXRQb3NpdGlvbmluZyAhPT0gJ0FCU09MVVRFJyAmJlxuICAgICAgICBjaGlsZC52aXNpYmxlICE9PSBmYWxzZVxuICAgICkgYXMgKChTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlKSAmIEF1dG9MYXlvdXRDaGlsZHJlbk1peGluKVtdO1xuICB9XG4gIHJldHVybiBbXTtcbn1cbiIsICJpbXBvcnQgeyBjdXN0b21WaWRlb0VsZW1lbnRzIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXRvLWh0bWwvc3JjL21hcHBpbmcvdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNWaWRlb0VsZW1lbnQoZWx0OiBIVE1MRWxlbWVudCk6IGVsdCBpcyBIVE1MVmlkZW9FbGVtZW50IHtcbiAgcmV0dXJuIChcbiAgICBjdXN0b21WaWRlb0VsZW1lbnRzLmhhcyhlbHQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgIGVsdC50YWdOYW1lID09PSAnVklERU8nXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1lvdXR1YmVJZnJhbWUoZWx0OiBIVE1MRWxlbWVudCk6IGVsdCBpcyBIVE1MSUZyYW1lRWxlbWVudCB7XG4gIGlmIChlbHQudGFnTmFtZSAhPT0gJ0lGUkFNRScpIHJldHVybiBmYWxzZTtcbiAgY29uc3Qgc3JjID0gKGVsdCBhcyBIVE1MSUZyYW1lRWxlbWVudCkuc3JjO1xuICByZXR1cm4gKFxuICAgIChzcmMuaW5jbHVkZXMoJ3lvdXR1YmUuY29tJykgfHwgc3JjLmluY2x1ZGVzKCd5b3V0dWJlLW5vY29va2llLmNvbScpKSAmJlxuICAgIHNyYy5pbmNsdWRlcygnZW5hYmxlanNhcGk9MScpXG4gICk7XG59XG5cbmNsYXNzIFlvdXR1YmVDb250cm9sbGVyIHtcbiAgcHJpdmF0ZSBpbmZvOiBhbnkgPSB7fTtcbiAgcHJpdmF0ZSBsb2FkZWQ6IFByb21pc2U8Ym9vbGVhbj47XG4gIHByaXZhdGUgbWVzc2FnZUxpc3RlbmVyOiAoKGV2ZW50OiBNZXNzYWdlRXZlbnQpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCkge1xuICAgIHRoaXMubG9hZGVkID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IGxvYWRMaXN0ZW5lciA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5pZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRMaXN0ZW5lcik7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0WW91dHViZUxpc3RlbmluZygpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuaWZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkTGlzdGVuZXIpO1xuXG4gICAgICB0aGlzLm1lc3NhZ2VMaXN0ZW5lciA9IChldmVudDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cgJiYgZXZlbnQuZGF0YSkge1xuICAgICAgICAgIGxldCBldmVudERhdGE6IGFueTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBldmVudERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1lvdXR1YmVDb250cm9sbGVyIG1lc3NhZ2VMaXN0ZW5lcicsIGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChldmVudERhdGEuZXZlbnQgPT09ICdvblJlYWR5Jykge1xuICAgICAgICAgICAgdGhpcy5pZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRMaXN0ZW5lcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV2ZW50RGF0YS5pbmZvKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuaW5mbywgZXZlbnREYXRhLmluZm8pO1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5tZXNzYWdlTGlzdGVuZXIpO1xuICAgICAgdGhpcy5yZXF1ZXN0WW91dHViZUxpc3RlbmluZygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZW5kWW91dHViZU1lc3NhZ2UoXG4gICAgZnVuYzpcbiAgICAgIHwgJ211dGUnXG4gICAgICB8ICd1bk11dGUnXG4gICAgICB8ICdwbGF5VmlkZW8nXG4gICAgICB8ICdwYXVzZVZpZGVvJ1xuICAgICAgfCAnc3RvcFZpZGVvJ1xuICAgICAgfCAnc2Vla1RvJyxcbiAgICBhcmdzOiBhbnlbXSA9IFtdXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMubG9hZGVkO1xuICAgIHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3c/LnBvc3RNZXNzYWdlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyBldmVudDogJ2NvbW1hbmQnLCBmdW5jLCBhcmdzIH0pLFxuICAgICAgJyonXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVxdWVzdFlvdXR1YmVMaXN0ZW5pbmcoKTogdm9pZCB7XG4gICAgdGhpcy5pZnJhbWUuY29udGVudFdpbmRvdz8ucG9zdE1lc3NhZ2UoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IGV2ZW50OiAnbGlzdGVuaW5nJyB9KSxcbiAgICAgICcqJ1xuICAgICk7XG4gIH1cblxuICBnZXQgbXV0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5mby5tdXRlZDtcbiAgfVxuXG4gIGdldCB2b2x1bWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pbmZvLnZvbHVtZTtcbiAgfVxuXG4gIHNldCBtdXRlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSkgdGhpcy5zZW5kWW91dHViZU1lc3NhZ2UoJ211dGUnKTtcbiAgICBlbHNlIHRoaXMuc2VuZFlvdXR1YmVNZXNzYWdlKCd1bk11dGUnKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50VGltZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmluZm8uY3VycmVudFRpbWU7XG4gIH1cblxuICBzZXQgY3VycmVudFRpbWUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuc2VuZFlvdXR1YmVNZXNzYWdlKCdzZWVrVG8nLCBbdmFsdWUsIHRydWVdKTtcbiAgfVxuXG4gIGdldCBwYXVzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5mby5wbGF5ZXJTdGF0ZSA9PT0gMjtcbiAgfVxuXG4gIHBsYXkoKTogdm9pZCB7XG4gICAgdGhpcy5zZW5kWW91dHViZU1lc3NhZ2UoJ3BsYXlWaWRlbycpO1xuICB9XG5cbiAgcGF1c2UoKTogdm9pZCB7XG4gICAgdGhpcy5zZW5kWW91dHViZU1lc3NhZ2UoJ3BhdXNlVmlkZW8nKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tKGVsdDogSFRNTElGcmFtZUVsZW1lbnQpOiBZb3V0dWJlQ29udHJvbGxlciB7XG4gICAgcmV0dXJuICgoZWx0IGFzIGFueSkuZjJ3X3l0X2NvbnRyb2xsZXIgfHw9IG5ldyBZb3V0dWJlQ29udHJvbGxlcihlbHQpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDb250cm9sbGVyKFxuICBlbHQ6IEhUTUxFbGVtZW50XG4pOiBIVE1MVmlkZW9FbGVtZW50IHwgWW91dHViZUNvbnRyb2xsZXIgfCB1bmRlZmluZWQge1xuICBpZiAoaXNWaWRlb0VsZW1lbnQoZWx0KSkgcmV0dXJuIGVsdDtcbiAgaWYgKGlzWW91dHViZUlmcmFtZShlbHQpKSByZXR1cm4gWW91dHViZUNvbnRyb2xsZXIuZnJvbShlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlTXV0ZShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLm11dGVkID0gIWNvbnRyb2xsZXIubXV0ZWQ7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb250cm9sbGVyLm11dGVkID0gIWNvbnRyb2xsZXIubXV0ZWQ7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtdXRlKGVsdDogSFRNTEVsZW1lbnQpOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIubXV0ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29udHJvbGxlci5tdXRlZCA9IGZhbHNlO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5NdXRlKGVsdDogSFRNTEVsZW1lbnQpOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIubXV0ZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnRyb2xsZXIubXV0ZWQgPSB0cnVlO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGxheShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLnBsYXkoKTtcbiAgICAgIHJldHVybiAoKSA9PiBjb250cm9sbGVyLnBhdXNlKCk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdXNlKGVsdDogSFRNTEVsZW1lbnQpOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIucGF1c2UoKTtcbiAgICAgIHJldHVybiAoKSA9PiBjb250cm9sbGVyLnBsYXkoKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlUGxheShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoY29udHJvbGxlci5wYXVzZWQpIGNvbnRyb2xsZXIucGxheSgpO1xuICAgICAgZWxzZSBjb250cm9sbGVyLnBhdXNlKCk7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoY29udHJvbGxlci5wYXVzZWQpIGNvbnRyb2xsZXIucGxheSgpO1xuICAgICAgICBlbHNlIGNvbnRyb2xsZXIucGF1c2UoKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlZWtUbyhcbiAgZWx0OiBIVE1MRWxlbWVudCxcbiAgdGltZTogbnVtYmVyXG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgICAgLy8gbm8gcmV2ZXJ0ID9cbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2Vla0ZvcndhcmQoXG4gIGVsdDogSFRNTEVsZW1lbnQsXG4gIHNlY29uZHM6IG51bWJlclxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLmN1cnJlbnRUaW1lICs9IHNlY29uZHM7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb250cm9sbGVyLmN1cnJlbnRUaW1lIC09IHNlY29uZHM7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWVrQmFja3dhcmQoXG4gIGVsdDogSFRNTEVsZW1lbnQsXG4gIHNlY29uZHM6IG51bWJlclxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLmN1cnJlbnRUaW1lIC09IHNlY29uZHM7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb250cm9sbGVyLmN1cnJlbnRUaW1lICs9IHNlY29uZHM7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGlzU2FmYXJpKCk6IGJvb2xlYW4ge1xuICBjb25zdCB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB1YS5pbmNsdWRlcygnU2FmYXJpJykgJiYgIXVhLmluY2x1ZGVzKCdDaHJvbWUnKTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gaXNBYnNvbHV0ZU9yRml4ZWQocG9zaXRpb246IHN0cmluZyB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xuICByZXR1cm4gcG9zaXRpb24gPT09ICdhYnNvbHV0ZScgfHwgcG9zaXRpb24gPT09ICdmaXhlZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZsZXgoZGlzcGxheT86IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gISFkaXNwbGF5Py5lbmRzV2l0aCgnZmxleCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGbGV4T3JHcmlkKGRpc3BsYXk/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzRmxleChkaXNwbGF5KSB8fCBpc0dyaWQoZGlzcGxheSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0dyaWQoZGlzcGxheT86IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gISFkaXNwbGF5Py5lbmRzV2l0aCgnZ3JpZCcpO1xufVxuIiwgImltcG9ydCB7IHRvUHggfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC9zcmMvaGVscGVycyc7XG5pbXBvcnQgdHlwZSB7IEFuaW1hdGVkUHJvcCB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3NyYy90eXBlcyc7XG5pbXBvcnQgeyBpc1NhZmFyaSB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9uYXZpZ2F0b3InO1xuaW1wb3J0IHsgaXNBYnNvbHV0ZU9yRml4ZWQgfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvc3R5bGVzJztcbmltcG9ydCB0eXBlIHsgQm91bmRFbGVtZW50IH0gZnJvbSAnLi4vbGlmZWN5Y2xlJztcblxuY29uc3Qgc2FmYXJpID0gaXNTYWZhcmkoKTtcblxudHlwZSBUb0FuaW1hdGUgPSBSZWNvcmQ8c3RyaW5nLCBbQW5pbWF0ZWRQcm9wWydmcm9tJ10sIEFuaW1hdGVkUHJvcFsndG8nXV0+O1xuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICBwcm9wczogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgcHNldWRvPzogc3RyaW5nXG4pOiB2b2lkIHtcbiAgZWx0LmFuaW1hdGUoXG4gICAge1xuICAgICAgLi4ucHJvcHMsXG4gICAgfSxcbiAgICB7XG4gICAgICBwc2V1ZG9FbGVtZW50OiBwc2V1ZG8sXG4gICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgZHVyYXRpb246IDAsXG4gICAgICBmaWxsOiAnZm9yd2FyZHMnLFxuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gdG9PYmoocDogKEFuaW1hdGVkUHJvcCAmIHsgY2FtZWxLZXk6IHN0cmluZyB9KVtdKTogVG9BbmltYXRlIHtcbiAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhwLm1hcCgoaXQpID0+IFtpdC5jYW1lbEtleSwgW2l0LmZyb20sIGl0LnRvXV0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGVQcm9wcyhcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIHByb3BzOiBBbmltYXRlZFByb3BbXSxcbiAgZWFzaW5nOiBzdHJpbmcsXG4gIGR1cmF0aW9uOiBudW1iZXIsXG4gIGNvbnRhaW5lcnNUb1JlT3JkZXI6IFNldDxIVE1MRWxlbWVudD5cbik6IHZvaWQge1xuICBjb25zdCBwYXJlbnQgPSBlbHQucGFyZW50RWxlbWVudCE7XG4gIGNvbnN0IGNvbXB1dGVkU3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbHQpO1xuICBjb25zdCBwYXJlbnRTdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudCk7XG4gIGNvbnN0IHBhcmVudERpc3BsYXkgPSBwYXJlbnRTdHlsZXMuZGlzcGxheTtcbiAgY29uc3QgaXNGbGV4T3JHcmlkID1cbiAgICBwYXJlbnREaXNwbGF5LmVuZHNXaXRoKCdmbGV4JykgfHwgcGFyZW50RGlzcGxheS5lbmRzV2l0aCgnZ3JpZCcpO1xuICBjb25zdCBpc0Fic29sdXRlID0gaXNBYnNvbHV0ZU9yRml4ZWQoY29tcHV0ZWRTdHlsZXMucG9zaXRpb24pO1xuICBjb25zdCBjdXJyZW50UHJvcHMgPSBwcm9wcy5tYXAoKGl0KSA9PiAoe1xuICAgIC4uLml0LFxuICAgIGNhbWVsS2V5OiBpdC5rZXkuc3RhcnRzV2l0aCgnLS0nKVxuICAgICAgPyBpdC5rZXlcbiAgICAgIDogaXQua2V5LnJlcGxhY2UoLy0oW2Etel0pL2csIChfLCBsKSA9PiBsLnRvVXBwZXJDYXNlKCkpLFxuICB9KSk7XG5cbiAgY29uc3QgYXR0clByb3BzOiBSZWNvcmQ8c3RyaW5nLCBBbmltYXRlZFByb3BbJ3RvJ10+ID0ge307XG4gIGNvbnN0IG5Qcm9wcyA9IGN1cnJlbnRQcm9wcy5maWx0ZXIoKGl0KSA9PiB7XG4gICAgaWYgKGl0LnBzZXVkbykgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpdC5rZXkuc3RhcnRzV2l0aCgnLS1mMnctYXR0ci0nKSkge1xuICAgICAgYXR0clByb3BzW2l0LmtleS5zbGljZSgxMSldID0gaXQudG87XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbiAgY29uc3QgblByb3BzT2JqID0gdG9PYmooblByb3BzKTtcbiAgY29uc3QgYlByb3BzT2JqID0gdG9PYmooXG4gICAgY3VycmVudFByb3BzLmZpbHRlcigoaXQpID0+IGl0LnBzZXVkbyA9PT0gJzo6YmVmb3JlJylcbiAgKTtcbiAgY29uc3QgYVByb3BzT2JqID0gdG9PYmooY3VycmVudFByb3BzLmZpbHRlcigoaXQpID0+IGl0LnBzZXVkbyA9PT0gJzo6YWZ0ZXInKSk7XG4gIGxldCBkaXNwbGF5QWZ0ZXJBbmltYXRpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgaWYgKG5Qcm9wc09iai5kaXNwbGF5KSB7XG4gICAgLy8gZXZlbiBvbiBjaHJvbWUgd2hlcmUgZGlzcGxheSBpcyBhbmltYXRhYmxlLCB0aGUgZWxlbWVudCB3b24ndFxuICAgIC8vICByZWNlaXZlIG1vdXNlIGV2ZW50cyBpZiB3ZSBkb24ndCBzZXQgaXQgZXhwbGljaXRlbHlcbiAgICBpZiAoblByb3BzT2JqLmRpc3BsYXlbMF0gPT09ICdub25lJykge1xuICAgICAgLy8gc2hvdyBpdCBpbW1lZGlhdGx5LCBvcGFjaXR5IGFuaW1hdGlvbiB3aWxsIGhhbmRsZSB0aGUgcmVzdFxuICAgICAgZWx0LnN0eWxlLmRpc3BsYXkgPSBTdHJpbmcoblByb3BzT2JqLmRpc3BsYXlbMV0pO1xuICAgIH0gZWxzZSBpZiAoblByb3BzT2JqLmRpc3BsYXlbMV0gPT09ICdub25lJykge1xuICAgICAgaWYgKGlzRmxleE9yR3JpZCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgICAgICAvLyBwcm9iYWJseSBhIHN3YXAsIGhpZGUgaXQgaW1tZWRpYXRseSB0byBub3QgaGF2ZSBib3RoIGVsZW1lbnRzIChiZWZvcmUmYWZ0ZXIpIHZpc2libGUgZHVyaW5nIHRoZSB0cmFuc2l0aW9uXG4gICAgICAgIGVsdC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBmb3IgY29uY3VycmVudC9wYXJhbGxlbCBhbmltYXRpb25zLCBlbnN1cmUgdGhlIGZpbmFsIHN0YXRlIGlzIGNvcnJlY3QgYXMgd2VsbFxuICAgIGRpc3BsYXlBZnRlckFuaW1hdGlvbiA9IFN0cmluZyhuUHJvcHNPYmouZGlzcGxheVsxXSk7XG4gICAgZGVsZXRlIG5Qcm9wc09iai5kaXNwbGF5O1xuICB9XG4gIGlmIChzYWZhcmkpIHtcbiAgICBzZXRTdHlsZShlbHQsIG5Qcm9wc09iaiwgJ292ZXJmbG93Jyk7XG4gICAgc2V0U3R5bGUoZWx0LCBuUHJvcHNPYmosICdyb3dHYXAnLCAnZ3JpZFJvd0dhcCcpO1xuICB9XG4gIGxldCBmMndPcmRlciA9ICtnZXRDb21wdXRlZFN0eWxlKGVsdCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS1mMnctb3JkZXInKTtcbiAgaWYgKG5Qcm9wc09ialsnLS1mMnctb3JkZXInXSkge1xuICAgIGNvbnN0IHRvID0gblByb3BzT2JqWyctLWYydy1vcmRlciddWzFdO1xuICAgIGYyd09yZGVyID0gdG8gPT09IHVuZGVmaW5lZCA/IE5hTiA6ICt0bztcbiAgICAvLyByZS1wb3NpdGlvbiB0aGUgY2hpbGQgYXQgdGhlIHJpZ2h0IHBsYWNlIGluIHRoZSBwYXJlbnRcbiAgICBpZiAoIWlzTmFOKGYyd09yZGVyKSkge1xuICAgICAgZWx0LnN0eWxlLnNldFByb3BlcnR5KCctLWYydy1vcmRlcicsIFN0cmluZyhmMndPcmRlcikpO1xuICAgIH1cbiAgICBkZWxldGUgblByb3BzT2JqWyctLWYydy1vcmRlciddO1xuICB9XG4gIC8vIHJlLXBvc2l0aW9uIHRoZSBjaGlsZCBhdCB0aGUgcmlnaHQgcGxhY2UgaW4gdGhlIHBhcmVudFxuICBpZiAoIWlzTmFOKGYyd09yZGVyKSkge1xuICAgIGNvbnRhaW5lcnNUb1JlT3JkZXIuYWRkKHBhcmVudCk7XG4gIH1cbiAgaWYgKG5Qcm9wc09ialsnLS1mMnctaW1nLXNyYyddKSB7XG4gICAgbGV0IGkgPSAoZWx0IGFzIEhUTUxJbWFnZUVsZW1lbnQpLmYyd19pbWFnZV9sYXp5X2xvYWRlcjtcbiAgICBjb25zdCBzcmMgPSBuUHJvcHNPYmpbJy0tZjJ3LWltZy1zcmMnXVsxXSBhcyBzdHJpbmc7XG4gICAgaWYgKCFpKSB7XG4gICAgICAoZWx0IGFzIEhUTUxJbWFnZUVsZW1lbnQpLmYyd19pbWFnZV9sYXp5X2xvYWRlciA9IGkgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGkuZGVjb2RpbmcgPSAnc3luYyc7XG4gICAgICBpLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgKGVsdCBhcyBIVE1MSW1hZ2VFbGVtZW50KS5kZWNvZGluZyA9ICdzeW5jJztcbiAgICAgICAgZWx0LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjKTtcbiAgICAgICAgZGVsZXRlIChlbHQgYXMgSFRNTEltYWdlRWxlbWVudCkuZjJ3X2ltYWdlX2xhenlfbG9hZGVyO1xuICAgICAgfTtcbiAgICB9XG4gICAgaS5zcmMgPSBzcmM7XG4gICAgZGVsZXRlIG5Qcm9wc09ialsnLS1mMnctaW1nLXNyYyddO1xuICB9XG4gIGlmIChuUHJvcHNPYmpbJyRpbm5lckhUTUwnXSkge1xuICAgIGVsdC5pbm5lckhUTUwgPSBTdHJpbmcoblByb3BzT2JqWyckaW5uZXJIVE1MJ11bMV0pO1xuICAgIGRlbGV0ZSBuUHJvcHNPYmpbJyRpbm5lckhUTUwnXTtcbiAgfVxuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhhdHRyUHJvcHMpKSB7XG4gICAgZWx0LnNldEF0dHJpYnV0ZShrLCBTdHJpbmcodikpO1xuICB9XG4gIGlmIChuUHJvcHNPYmoubGVmdCAmJiBuUHJvcHNPYmoucmlnaHQpIHtcbiAgICBpZiAoblByb3BzT2JqLmxlZnRbMV0gPT09ICdyZXZlcnQnICYmIG5Qcm9wc09iai5yaWdodFswXSA9PT0gJ3JldmVydCcpIHtcbiAgICAgIC8vIGxlZnQgdG8gcmlnaHRcbiAgICAgIGNvbnN0IHsgcmlnaHQ6IHBhcmVudFJpZ2h0IH0gPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB7IHJpZ2h0IH0gPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAvLyBpcyB0aGlzIHRoZSByaWdodCB3YXkgdG8gY29tcHV0ZSByaWdodCBvZmZzZXQgP1xuICAgICAgY29uc3QgcmlnaHRTdHIgPSB0b1B4KHBhcmVudFJpZ2h0IC0gcmlnaHQpO1xuICAgICAgc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKGVsdCwgeyBsZWZ0OiAncmV2ZXJ0JywgcmlnaHQ6IHJpZ2h0U3RyIH0pO1xuICAgICAgZGVsZXRlIG5Qcm9wc09iai5sZWZ0O1xuICAgICAgblByb3BzT2JqLnJpZ2h0WzBdID0gcmlnaHRTdHI7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG5Qcm9wc09iai5sZWZ0WzBdID09PSAncmV2ZXJ0JyAmJlxuICAgICAgblByb3BzT2JqLnJpZ2h0WzFdID09PSAncmV2ZXJ0J1xuICAgICkge1xuICAgICAgLy8gcmlnaHQgdG8gbGVmdFxuICAgICAgY29uc3QgeyBsZWZ0OiBwYXJlbnRMZWZ0IH0gPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB7IGxlZnQgfSA9IGVsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIC8vIGlzIHRoaXMgdGhlIHJpZ2h0IHdheSB0byBjb21wdXRlIGxlZnQgb2Zmc2V0ID9cbiAgICAgIGNvbnN0IGxlZnRTdHIgPSB0b1B4KGxlZnQgLSBwYXJlbnRMZWZ0KTtcbiAgICAgIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZShlbHQsIHsgcmlnaHQ6ICdyZXZlcnQnLCBsZWZ0OiBsZWZ0U3RyIH0pO1xuICAgICAgZGVsZXRlIG5Qcm9wc09iai5yaWdodDtcbiAgICAgIG5Qcm9wc09iai5sZWZ0WzBdID0gbGVmdFN0cjtcbiAgICB9XG4gIH1cbiAgaWYgKG5Qcm9wc09iai50b3AgJiYgblByb3BzT2JqLmJvdHRvbSkge1xuICAgIGlmIChuUHJvcHNPYmoudG9wWzFdID09PSAncmV2ZXJ0JyAmJiBuUHJvcHNPYmouYm90dG9tWzBdID09PSAncmV2ZXJ0Jykge1xuICAgICAgLy8gdG9wIHRvIGJvdHRvbVxuICAgICAgY29uc3QgeyBib3R0b206IHBhcmVudEJvdHRvbSB9ID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgeyBib3R0b20gfSA9IGVsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIC8vIGlzIHRoaXMgdGhlIHJpZ2h0IHdheSB0byBjb21wdXRlIGJvdHRvbSBvZmZzZXQgP1xuICAgICAgY29uc3QgYm90dG9tU3RyID0gdG9QeChwYXJlbnRCb3R0b20gLSBib3R0b20pO1xuICAgICAgc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKGVsdCwgeyB0b3A6ICdyZXZlcnQnLCBib3R0b206IGJvdHRvbVN0ciB9KTtcbiAgICAgIGRlbGV0ZSBuUHJvcHNPYmoudG9wO1xuICAgICAgblByb3BzT2JqLmJvdHRvbVswXSA9IGJvdHRvbVN0cjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgblByb3BzT2JqLnRvcFswXSA9PT0gJ3JldmVydCcgJiZcbiAgICAgIG5Qcm9wc09iai5ib3R0b21bMV0gPT09ICdyZXZlcnQnXG4gICAgKSB7XG4gICAgICAvLyBib3R0b20gdG8gdG9wXG4gICAgICBjb25zdCB7IHRvcDogcGFyZW50VG9wIH0gPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB7IHRvcCB9ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgLy8gaXMgdGhpcyB0aGUgcmlnaHQgd2F5IHRvIGNvbXB1dGUgdG9wIG9mZnNldCA/XG4gICAgICBjb25zdCB0b3BTdHIgPSB0b1B4KHRvcCAtIHBhcmVudFRvcCk7XG4gICAgICBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoZWx0LCB7IGJvdHRvbTogJ3JldmVydCcsIHRvcDogdG9wU3RyIH0pO1xuICAgICAgZGVsZXRlIG5Qcm9wc09iai5ib3R0b207XG4gICAgICBuUHJvcHNPYmoudG9wWzBdID0gdG9wU3RyO1xuICAgIH1cbiAgfVxuICBjb25zdCBoYXNCZ0ltYWdlID0gISFuUHJvcHNPYmpbJ2JhY2tncm91bmRJbWFnZSddO1xuXG4gIGlmIChoYXNCZ0ltYWdlKSB7XG4gICAgLy8gSWYgYmctaW1hZ2UgY2hhbmdlcywgYW5pbWF0aW5nIHBvc2l0aW9uLCBzaXplIGV0LmFsIHdpbGwgaGF2ZSBiaXphcnJlIGVmZmVjdHNcbiAgICAvLyBJZGVhbGx5IHdlJ3ZlIHdvcmsgb24gdGhhdCBkdXJpbmcgZGlmZmluZywgYW5kIGF0dGVtcHQgdG8gdW5pZnkgYmctaW1hZ2UgYWNjcm9zcyB2YXJpYW50c1xuICAgIC8vIGFuZCBtYXliZSBhbmltYXRlIGl0IHRob3VnaCB2YXJpYWJsZXMgP1xuICAgIG5Qcm9wc1xuICAgICAgLmZpbHRlcigoaXQpID0+IGl0LmtleS5zdGFydHNXaXRoKCdiYWNrZ3JvdW5kLScpKVxuICAgICAgLmZvckVhY2goKGl0KSA9PiB7XG4gICAgICAgIC8vIFRPRE8gdXNlIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZSBpbnN0ZWFkIHRvIGtlZXAgcHJvcHMgYW5pbWF0YWJsZVxuICAgICAgICBlbHQuc3R5bGUuc2V0UHJvcGVydHkoaXQua2V5LCBTdHJpbmcoaXQudG8pKTtcbiAgICAgICAgZGVsZXRlIG5Qcm9wc09ialtpdC5jYW1lbEtleV07XG4gICAgICB9KTtcbiAgfVxuICBmb3IgKGNvbnN0IFtwc2V1ZG8sIG9ial0gb2YgW1xuICAgIFsnYmVmb3JlJywgYlByb3BzT2JqXSxcbiAgICBbJ2FmdGVyJywgYVByb3BzT2JqXSxcbiAgXSBhcyBjb25zdCkge1xuICAgIGlmIChvYmouZGlzcGxheSkge1xuICAgICAgLy8gdXNlIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZSBpbnN0ZWFkIG9mIGNsYXNzZXMgP1xuICAgICAgaWYgKG9iai5kaXNwbGF5WzFdID09PSAnbm9uZScpIHtcbiAgICAgICAgZWx0LmNsYXNzTGlzdC5yZW1vdmUocHNldWRvICsgJy12aXNpYmxlJyk7XG4gICAgICAgIGVsdC5jbGFzc0xpc3QuYWRkKHBzZXVkbyArICctaGlkZGVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbHQuY2xhc3NMaXN0LnJlbW92ZShwc2V1ZG8gKyAnLWhpZGRlbicpO1xuICAgICAgICBlbHQuY2xhc3NMaXN0LmFkZChwc2V1ZG8gKyAnLXZpc2libGUnKTtcbiAgICAgIH1cbiAgICAgIC8vIGRyb3AgaXQgZnJvbSBhbmltYXRpb24gP1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFuaW0gPSAoXG4gICAgdG9BbmltYXRlOiBUb0FuaW1hdGUsXG4gICAgcHNldWRvPzogc3RyaW5nLFxuICAgIGZvcmNlID0gZmFsc2VcbiAgKTogQW5pbWF0aW9uIHwgdW5kZWZpbmVkID0+IHtcbiAgICBpZiAoIWZvcmNlICYmICFPYmplY3Qua2V5cyh0b0FuaW1hdGUpLmxlbmd0aCkgcmV0dXJuO1xuICAgIHJldHVybiBlbHQuYW5pbWF0ZShcbiAgICAgIHtcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICAuLi50b0FuaW1hdGUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwc2V1ZG9FbGVtZW50OiBwc2V1ZG8sXG4gICAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBmaWxsOiAnYm90aCcsXG4gICAgICB9XG4gICAgKTtcbiAgfTtcbiAgY29uc3QgYSA9IGFuaW0oblByb3BzT2JqLCB1bmRlZmluZWQsICEhZGlzcGxheUFmdGVyQW5pbWF0aW9uKTtcbiAgaWYgKGRpc3BsYXlBZnRlckFuaW1hdGlvbikge1xuICAgIGEhLmZpbmlzaGVkLnRoZW4oKCkgPT4ge1xuICAgICAgZWx0LnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5QWZ0ZXJBbmltYXRpb24hO1xuICAgIH0pO1xuICB9XG4gIGFuaW0oYlByb3BzT2JqLCAnOjpiZWZvcmUnKTtcbiAgYW5pbShhUHJvcHNPYmosICc6OmFmdGVyJyk7XG59XG5cbmNvbnN0IHNldFN0eWxlID0gKGU6IEJvdW5kRWxlbWVudCwgbzogVG9BbmltYXRlLCAuLi5wcm9wczogc3RyaW5nW10pOiB2b2lkID0+IHtcbiAgY29uc3QgcCA9IHByb3BzLmZpbmQoKHApID0+IHAgaW4gbyk7XG4gIGlmICghcCkgcmV0dXJuO1xuICBlLnN0eWxlW3Byb3BzWzBdIGFzIGFueV0gPSBTdHJpbmcob1twXVsxXSk7XG4gIGRlbGV0ZSBvW3BdO1xufTtcbiIsICJpbXBvcnQge1xuICBBbmltYXRlZEVsdCxcbiAgRjJ3RGlyZWN0aW9uYWxUcmFuc2l0aW9uLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC9zcmMvdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW92ZUluQW5pbWF0aW9ucyhcbiAgZWx0SWQ6IHN0cmluZyxcbiAgb3ZlcmxheVBvc2l0aW9uVHlwZTogT3ZlcmxheVBvc2l0aW9uVHlwZSxcbiAgdHJhbnNpdGlvbjogRjJ3RGlyZWN0aW9uYWxUcmFuc2l0aW9uXG4pOiBBbmltYXRlZEVsdFtdIHtcbiAgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnTEVGVCcpIHtcbiAgICBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX0xFRlQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0xFRlQnXG4gICAgKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAnbGVmdCcsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG86ICcwJScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX1JJR0hUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9SSUdIVCdcbiAgICApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJSAwcHgnLFxuICAgICAgICAgICAgICB0bzogJzBweCAwcHgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2VudGVyXG4gICAgICBjb25zdCB0eSA9IG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdDRU5URVInID8gJy01MCUnIDogJzBweCc7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAnbGVmdCcsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG86ICc1MCUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYDBweCAke3R5fWAsXG4gICAgICAgICAgICAgIHRvOiBgLTUwJSAke3R5fWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ1JJR0hUJykge1xuICAgIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fTEVGVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfTEVGVCdcbiAgICApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiAnLTEwMCUgMHB4JyxcbiAgICAgICAgICAgICAgdG86ICcwcHggMHB4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fUklHSFQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX1JJR0hUJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzBweCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjZW50ZXJcbiAgICAgIGNvbnN0IHR5ID0gb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0NFTlRFUicgPyAnLTUwJScgOiAnMHB4JztcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgZnJvbTogJzBweCcsXG4gICAgICAgICAgICAgIHRvOiAnNTAlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206IGAtMTAwJSAke3R5fWAsXG4gICAgICAgICAgICAgIHRvOiBgLTUwJSAke3R5fWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ1RPUCcpIHtcbiAgICBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX0xFRlQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX1JJR0hUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9DRU5URVInXG4gICAgKSB7XG4gICAgICBjb25zdCB0eCA9IG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fQ0VOVEVSJyA/ICctNTAlJyA6ICcwcHgnO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206IGAke3R4fSAxMDAlYCxcbiAgICAgICAgICAgICAgdG86IGAke3R4fSAwcHhgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfQ0VOVEVSJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RvcCcsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG86ICcwcHgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2VudGVyXG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndG9wJyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzUwJScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiBgLTUwJSAwJWAsXG4gICAgICAgICAgICAgIHRvOiBgLTUwJSAtNTAlYCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnQk9UVE9NJykge1xuICAgIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fTEVGVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fUklHSFQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX0NFTlRFUidcbiAgICApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdib3R0b20nLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvOiAnMHB4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfTEVGVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfUklHSFQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0NFTlRFUidcbiAgICApIHtcbiAgICAgIGNvbnN0IHR4ID0gb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9DRU5URVInID8gJy01MCUnIDogJzBweCc7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYCR7dHh9IC0xMDAlYCxcbiAgICAgICAgICAgICAgdG86IGAke3R4fSAwcHhgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2VudGVyXG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndG9wJyxcbiAgICAgICAgICAgICAgZnJvbTogJzBweCcsXG4gICAgICAgICAgICAgIHRvOiAnNTAlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206IGAtNTAlIC0xMDAlYCxcbiAgICAgICAgICAgICAgdG86IGAtNTAlIC01MCVgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKCdVbnN1cHBvcnRlZCB0cmFuc2l0aW9uOicsIHRyYW5zaXRpb24pO1xuICB9XG4gIHJldHVybiBbXTtcbn1cbiIsICJpbXBvcnQge1xuICB0ZW1wbGF0ZUlkLFxuICB0b1BlcmNlbnQsXG4gIHRvUHgsXG4gIHZhbHVlVG9TdHJpbmcsXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL2hlbHBlcnMnO1xuaW1wb3J0IHtcbiAgdHlwZSBUcmlnZ2VyVHlwZSxcbiAgcmVhY3Rpb25fdHlwZXMsXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL21hcHBpbmcvdHJpZ2dlcnMnO1xuaW1wb3J0IHR5cGUge1xuICBBbmltYXRlZFByb3AsXG4gIEFuaW1hdGVkRWx0IGFzIEFuaW1hdGlvbixcbiAgRE9NRjJ3QWN0aW9uIGFzIEYyd0FjdGlvbixcbn0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXRvLWh0bWwvdHlwZXMnO1xuaW1wb3J0IHsgc2hvdWxkTm90SGFwcGVuIH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL2Fzc2VydCc7XG5pbXBvcnQgeyBvbmNlIH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyBpc0FsaWFzIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXRvLWh0bWwvdmFyaWFibGVzJztcbmltcG9ydCB7IGZpbHRlckVtcHR5IH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL2FycmF5JztcbmltcG9ydCB7IG9uQ29ubmVjdGVkLCBDbGVhbnVwRm4sIEJvdW5kRWxlbWVudCB9IGZyb20gJy4vbGlmZWN5Y2xlJztcbmltcG9ydCB7XG4gIHNlZWtCYWNrd2FyZCxcbiAgc2Vla0ZvcndhcmQsXG4gIG11dGUsXG4gIHBhdXNlLFxuICBwbGF5LFxuICBzZWVrVG8sXG4gIHRvZ2dsZU11dGUsXG4gIHRvZ2dsZVBsYXksXG4gIHVuTXV0ZSxcbn0gZnJvbSAnLi9ydW50aW1lL3ZpZGVvcyc7XG5pbXBvcnQgeyBhbmltYXRlUHJvcHMgfSBmcm9tICcuL3J1bnRpbWUvYW5pbWF0b3InO1xuaW1wb3J0IHsgZ2V0TW92ZUluQW5pbWF0aW9ucyB9IGZyb20gJy4vcnVudGltZS9hbmltYXRpb25zJztcblxudHlwZSBWYXJpYWJsZVZhbHVlTm9BbGlhcyA9IEV4Y2x1ZGU8VmFyaWFibGVWYWx1ZSwgVmFyaWFibGVBbGlhcz47XG5cbnR5cGUgU2V0VmFyaWFibGUgPSB7IGlkOiBzdHJpbmc7IHZhbHVlOiBWYXJpYWJsZVZhbHVlOyBzdHI6IHN0cmluZyB9O1xuXG5jb25zdCBhbGxSZWFjdGlvbnMgPSAoKTogUmVjb3JkPHN0cmluZywgRjJ3QWN0aW9uPiA9PiB3aW5kb3cuRjJXX1JFQUNUSU9OUztcbmNvbnN0IGFsbFZhcmlhYmxlcyA9ICgpOiBSZWNvcmQ8c3RyaW5nLCBWYXJpYWJsZVZhbHVlPiA9PiB3aW5kb3cuRjJXX1ZBUklBQkxFUztcbmNvbnN0IGNvbGxlY3Rpb25Nb2RlQnBzID0gKCk6IFJlY29yZDxcbiAgc3RyaW5nLFxuICBSZWNvcmQ8c3RyaW5nLCB7IG1pbldpZHRoOiBudW1iZXIgfT5cbj4gPT4gd2luZG93LkYyV19DT0xMRUNUSU9OX01PREVfQlBTO1xuY29uc3QgZ2V0Q29sTW9kZXMgPSAoY29sOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBWYXJpYWJsZXM+ID0+XG4gIHdpbmRvdy5GMldfQ09MTEVDVElPTl9WQVJTPy5bY29sXSA/PyB7fTtcbmNvbnN0IGdldENvbFZhcmlhYmxlcyA9IChcbiAgY29sOiBzdHJpbmcsXG4gIG1vZGU6IHN0cmluZ1xuKTogUmVjb3JkPHN0cmluZywgVmFyaWFibGVWYWx1ZT4gfCB1bmRlZmluZWQgPT4gZ2V0Q29sTW9kZXMoY29sKVttb2RlXTtcblxuZnVuY3Rpb24gc2V0VmFyaWFibGUoaWQ6IHN0cmluZywgdmFsdWU6IFZhcmlhYmxlVmFsdWUpOiB2b2lkIHtcbiAgYWxsVmFyaWFibGVzKClbaWRdID0gdmFsdWU7XG4gIGNvbnN0IHN0ciA9IHZhbHVlVG9TdHJpbmcodmFsdWUpO1xuICBkb2N1bWVudC5ib2R5LnN0eWxlLnNldFByb3BlcnR5KGlkLCBzdHIpO1xuICBjb25zdCBhdHRyID0gYGRhdGEke2lkLnNsaWNlKDEpfWA7XG4gIGlmIChkb2N1bWVudC5ib2R5Lmhhc0F0dHJpYnV0ZShhdHRyKSkge1xuICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKGF0dHIsIHN0cik7XG4gIH1cbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICBuZXcgQ3VzdG9tRXZlbnQ8U2V0VmFyaWFibGU+KCdmMnctc2V0LXZhcmlhYmxlJywge1xuICAgICAgZGV0YWlsOiB7IGlkLCB2YWx1ZSwgc3RyIH0sXG4gICAgfSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gc2V0Q29sbGVjdGlvbkF0dHJBbmRWYXJpYWJsZXMoXG4gIGNvbE5hbWU6IHN0cmluZyxcbiAgbW9kZU5hbWU6IHN0cmluZ1xuKTogdm9pZCB7XG4gIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKGBkYXRhLSR7Y29sTmFtZX1gLCBtb2RlTmFtZSk7XG4gIGNvbnN0IHZhcnMgPSBnZXRDb2xWYXJpYWJsZXMoY29sTmFtZSwgbW9kZU5hbWUpID8/IHt9O1xuICBmb3IgKGNvbnN0IFtpZCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHZhcnMpKSB7XG4gICAgc2V0VmFyaWFibGUoaWQsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRWYXJpYWJsZU1vZGUobmFtZTogc3RyaW5nLCBtb2RlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIHNldENvbGxlY3Rpb25BdHRyQW5kVmFyaWFibGVzKG5hbWUsIG1vZGVOYW1lKTtcbiAgc2F2ZU1vZGUobmFtZSwgbW9kZU5hbWUpO1xufVxuXG5mdW5jdGlvbiBzYXZlTW9kZShuYW1lOiBzdHJpbmcsIG1vZGVOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKHdpbmRvdy5GMldfQ09MT1JfU0NIRU1FUz8uaW5jbHVkZXMobmFtZSkpIHtcbiAgICBsb2NhbFN0b3JhZ2U/LnNldEl0ZW0oQ09MT1JfU0NIRU1FX0tFWSwgbW9kZU5hbWUpO1xuICB9IGVsc2UgaWYgKHdpbmRvdy5GMldfTEFOR1VBR0VTPy5pbmNsdWRlcyhuYW1lKSkge1xuICAgIGxvY2FsU3RvcmFnZT8uc2V0SXRlbShMQU5HX0tFWSwgbW9kZU5hbWUpO1xuICAgIGNvbnN0IGFsdGVybmF0ZSA9IEFycmF5LmZyb20oXG4gICAgICBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTExpbmtFbGVtZW50PignbGlua1tyZWw9XCJhbHRlcm5hdGVcIl0nKVxuICAgICkuZmluZCgoaXQpID0+IGl0LmhyZWZsYW5nID09PSBtb2RlTmFtZSk7XG4gICAgaWYgKGFsdGVybmF0ZSkge1xuICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIG5ldyBVUkwoYWx0ZXJuYXRlLmhyZWYpLnBhdGhuYW1lKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdG9GbG9hdCh2OiBWYXJpYWJsZVZhbHVlTm9BbGlhcyk6IG51bWJlciB7XG4gIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHJldHVybiB2O1xuICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykgcmV0dXJuIHYgPyAxIDogMDtcbiAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJykgcmV0dXJuIHBhcnNlRmxvYXQodik7XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiB0b1N0cmluZyh2OiBWYXJpYWJsZVZhbHVlTm9BbGlhcyk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmcodik7XG59XG5cbmZ1bmN0aW9uIHRvQm9vbGVhbih2OiBWYXJpYWJsZVZhbHVlTm9BbGlhcyk6IGJvb2xlYW4ge1xuICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSByZXR1cm4gdiA9PT0gJ3RydWUnO1xuICByZXR1cm4gISF2O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlKFxuICB2YWx1ZTogVmFyaWFibGVWYWx1ZVdpdGhFeHByZXNzaW9uIHwgdW5kZWZpbmVkLFxuICByb290SWQ/OiBzdHJpbmdcbik6IFZhcmlhYmxlVmFsdWVOb0FsaWFzIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgaWYgKGlzQWxpYXModmFsdWUpKSB7XG4gICAgcmV0dXJuIHJlc29sdmUoYWxsVmFyaWFibGVzKClbdmFsdWUuaWRdKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAnZXhwcmVzc2lvbkFyZ3VtZW50cycgaW4gdmFsdWUpIHtcbiAgICBjb25zdCBhcmdzID0gdmFsdWUuZXhwcmVzc2lvbkFyZ3VtZW50c1xuICAgICAgLm1hcCgoaXQpID0+IGl0LnZhbHVlKVxuICAgICAgLmZpbHRlcigoaXQpOiBpdCBpcyBWYXJpYWJsZVZhbHVlV2l0aEV4cHJlc3Npb24gPT4gaXQgIT09IHVuZGVmaW5lZClcbiAgICAgIC5tYXAoKGl0KSA9PiByZXNvbHZlKGl0LCByb290SWQpKTtcbiAgICBjb25zdCByZXNvbHZlZFR5cGUgPSB2YWx1ZS5leHByZXNzaW9uQXJndW1lbnRzWzBdPy5yZXNvbHZlZFR5cGUgPz8gJ1NUUklORyc7XG4gICAgc3dpdGNoICh2YWx1ZS5leHByZXNzaW9uRnVuY3Rpb24pIHtcbiAgICAgIGNhc2UgJ0FERElUSU9OJzpcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkVHlwZSA9PT0gJ0ZMT0FUJ1xuICAgICAgICAgID8gYXJncy5tYXAodG9GbG9hdCkucmVkdWNlKChhLCBiKSA9PiBhICsgYilcbiAgICAgICAgICA6IGFyZ3MubWFwKHRvU3RyaW5nKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcbiAgICAgIGNhc2UgJ1NVQlRSQUNUSU9OJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9GbG9hdChhcmdzWzBdKSAtIHRvRmxvYXQoYXJnc1sxXSk7XG4gICAgICBjYXNlICdESVZJU0lPTic6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgLyB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnTVVMVElQTElDQVRJT04nOlxuICAgICAgICByZXR1cm4gYXJncy5tYXAodG9GbG9hdCkucmVkdWNlKChhLCBiKSA9PiBhICogYik7XG4gICAgICBjYXNlICdORUdBVEUnOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDEpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiAtdG9GbG9hdChhcmdzWzBdKTtcbiAgICAgIGNhc2UgJ0dSRUFURVJfVEhBTic6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgPiB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnR1JFQVRFUl9USEFOX09SX0VRVUFMJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9GbG9hdChhcmdzWzBdKSA+PSB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnTEVTU19USEFOJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9GbG9hdChhcmdzWzBdKSA8IHRvRmxvYXQoYXJnc1sxXSk7XG4gICAgICBjYXNlICdMRVNTX1RIQU5fT1JfRVFVQUwnOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Zsb2F0KGFyZ3NbMF0pIDw9IHRvRmxvYXQoYXJnc1sxXSk7XG4gICAgICBjYXNlICdFUVVBTFMnOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiByZXNvbHZlZFR5cGUgPT09ICdGTE9BVCdcbiAgICAgICAgICA/IHRvRmxvYXQoYXJnc1swXSkgPT09IHRvRmxvYXQoYXJnc1sxXSlcbiAgICAgICAgICA6IHJlc29sdmVkVHlwZSA9PT0gJ0JPT0xFQU4nXG4gICAgICAgICAgPyB0b0Jvb2xlYW4oYXJnc1swXSkgPT09IHRvQm9vbGVhbihhcmdzWzFdKVxuICAgICAgICAgIDogdG9TdHJpbmcoYXJnc1swXSkgPT09IHRvU3RyaW5nKGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnTk9UX0VRVUFMJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWRUeXBlID09PSAnRkxPQVQnXG4gICAgICAgICAgPyB0b0Zsb2F0KGFyZ3NbMF0pICE9PSB0b0Zsb2F0KGFyZ3NbMV0pXG4gICAgICAgICAgOiByZXNvbHZlZFR5cGUgPT09ICdCT09MRUFOJ1xuICAgICAgICAgID8gdG9Cb29sZWFuKGFyZ3NbMF0pICE9PSB0b0Jvb2xlYW4oYXJnc1sxXSlcbiAgICAgICAgICA6IHRvU3RyaW5nKGFyZ3NbMF0pICE9PSB0b1N0cmluZyhhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ0FORCc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvQm9vbGVhbihhcmdzWzBdKSAmJiB0b0Jvb2xlYW4oYXJnc1sxXSk7XG4gICAgICBjYXNlICdPUic6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvQm9vbGVhbihhcmdzWzBdKSB8fCB0b0Jvb2xlYW4oYXJnc1sxXSk7XG4gICAgICBjYXNlICdOT1QnOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDEpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiAhdG9Cb29sZWFuKGFyZ3NbMF0pO1xuICAgICAgY2FzZSAnVkFSX01PREVfTE9PS1VQJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgRXhwcmVzc2lvbiBub3QgaW1wbGVtZW50ZWQgeWV0OiAke3ZhbHVlLmV4cHJlc3Npb25GdW5jdGlvbn1gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFjdGlvbnNUb1J1bihcbiAgYWN0aW9uczogRjJ3QWN0aW9uW10sXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIHRyaWdnZXI6IFRyaWdnZXJUeXBlXG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IHJ1bnMgPSBhY3Rpb25zLm1hcCgoaXQpID0+IHRvUnVuV2l0aERyYWdDbGVhbnVwKGl0LCBib3VuZCwgdHJpZ2dlcikpO1xuICByZXR1cm4gKGUsIGkpID0+IHtcbiAgICBjb25zdCByZXZlcnRzID0gcnVuc1xuICAgICAgLm1hcCgoaXQpID0+IGl0KGUsIGkpKVxuICAgICAgLmZpbHRlcigoaXQpOiBpdCBpcyBFdmVudENhbGxiYWNrID0+ICEhaXQpO1xuICAgIGlmIChyZXZlcnRzLmxlbmd0aCkgcmV0dXJuIChlLCBpKSA9PiByZXZlcnRzLmZvckVhY2goKGl0KSA9PiBpdChlLCBpKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvUnVuV2l0aERyYWdDbGVhbnVwKFxuICBhY3Rpb246IEYyd0FjdGlvbixcbiAgYm91bmQ6IEJvdW5kRWxlbWVudCxcbiAgdHJpZ2dlcjogVHJpZ2dlclR5cGVcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgd2hpbGUgKGFjdGlvbi50eXBlID09PSAnQUxJQVMnKSB7XG4gICAgYWN0aW9uID0gYWxsUmVhY3Rpb25zKClbYWN0aW9uLmFsaWFzXTtcbiAgfVxuICBjb25zdCBydW4gPSB0b1J1bihhY3Rpb24sIGJvdW5kLCB0cmlnZ2VyKTtcbiAgcmV0dXJuIChlKSA9PiB7XG4gICAgaWYgKGFjdGlvbi50eXBlICE9PSAnQU5JTUFURScgJiYgdHJpZ2dlciA9PT0gJ2RyYWcnKSB7XG4gICAgICBjb25zdCBkID0gKGUgYXMgQ3VzdG9tRXZlbnQ8RHJhZ2dpbmc+KS5kZXRhaWw7XG4gICAgICBpZiAoIWQuaGFuZGxlZCkge1xuICAgICAgICBkLmhhbmRsZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcnVuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBza2lwIGFsbCBhbmltYXRpb25zIHdoZW4gYSBkcmFnIGlzIGluIHByb2dyZXNzXG4gICAgaWYgKGRyYWdfc3RhcnRlZCkgcmV0dXJuO1xuICAgIGlmIChhY3Rpb24udHlwZSA9PT0gJ0FOSU1BVEUnICYmIGFjdGlvbi5yb290SWQpIHtcbiAgICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhY3Rpb24ucm9vdElkKTtcbiAgICAgIC8vIGFkZCByZXZlcnQgZnVuY3Rpb25zIHRvIHBhcmVudCBlbGVtZW50cywgc28gdGhleSBjYW4gcmVzZXQgdGhlaXIgY2hpbGRyZW4gd2hlbiBuZWVkZWRcbiAgICAgIGlmIChyb290Py5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHJldmVydCA9IG9uY2UocnVuKGUpKTtcbiAgICAgICAgaWYgKHJldmVydCkge1xuICAgICAgICAgIGxldCBlbDogSFRNTEVsZW1lbnQgfCBudWxsID0gcm9vdD8ucGFyZW50RWxlbWVudDtcbiAgICAgICAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gdGhpcyB3aWxsIGxlYWsgYXMgaXQncyB1bmxpa2VseSB0aGVzZSBlbGVtZW50cyB3aWxsIGV2ZXIgbmVlZCB0byByZXNldFxuICAgICAgICAgICAgLy8gQ291bGQgYmUgaW1wcm92ZWQgYnkgZmxhZ2dpbmcgJ3Jlc2V0dGFibGUnIG5vZGVzLCBhbmQgb25seSBhZGRpbmcgdGhlIHJlc2V0IGZ1bmN0aW9uIHRvIHRoZW1cbiAgICAgICAgICAgIChlbC5mMndfcmVzZXQgfHw9IFtdKS5wdXNoKHJldmVydCk7XG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoZWw/LnRhZ05hbWUgPT09ICdCT0RZJykgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXZlcnQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydW4oZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvUnVuKFxuICBhY3Rpb246IEYyd0FjdGlvbixcbiAgYm91bmQ6IEJvdW5kRWxlbWVudCxcbiAgdHJpZ2dlcjogVHJpZ2dlclR5cGVcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgJ0JBQ0snOlxuICAgICAgcmV0dXJuICgpID0+ICh3aW5kb3cuRjJXX1BSRVZJRVdfQkFDSyA/PyBoaXN0b3J5LmJhY2spKCk7XG4gICAgY2FzZSAnSlMnOlxuICAgICAgcmV0dXJuICgpID0+IGV2YWwoYWN0aW9uLmNvZGUpO1xuICAgIGNhc2UgJ1VSTCc6XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aW9uLm9wZW5Jbk5ld1RhYikge1xuICAgICAgICAgIHdpbmRvdy5vcGVuKGFjdGlvbi51cmwsICdfYmxhbmsnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aW5kb3cuRjJXX1BSRVZJRVdfTkFWSUdBVEVcbiAgICAgICAgICAgID8gd2luZG93LkYyV19QUkVWSUVXX05BVklHQVRFKGFjdGlvbi51cmwpXG4gICAgICAgICAgICA6IGxvY2F0aW9uLmFzc2lnbihhY3Rpb24udXJsKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICBjYXNlICdTRVRfVkFSSUFCTEUnOlxuICAgICAgY29uc3QgeyB2YXJpYWJsZUlkLCB2YXJpYWJsZVZhbHVlIH0gPSBhY3Rpb247XG4gICAgICBpZiAodmFyaWFibGVJZCAmJiB2YXJpYWJsZVZhbHVlPy52YWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gKCkgPT5cbiAgICAgICAgICBzZXRWYXJpYWJsZSh2YXJpYWJsZUlkLCByZXNvbHZlKHZhcmlhYmxlVmFsdWUudmFsdWUsIHZhcmlhYmxlSWQpKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1NFVF9WQVJJQUJMRV9NT0RFJzpcbiAgICAgIGNvbnN0IHsgdmFyaWFibGVDb2xsZWN0aW9uTmFtZSwgdmFyaWFibGVNb2RlTmFtZSB9ID0gYWN0aW9uO1xuICAgICAgaWYgKHZhcmlhYmxlQ29sbGVjdGlvbk5hbWUgJiYgdmFyaWFibGVNb2RlTmFtZSlcbiAgICAgICAgcmV0dXJuICgpID0+IHNldFZhcmlhYmxlTW9kZSh2YXJpYWJsZUNvbGxlY3Rpb25OYW1lLCB2YXJpYWJsZU1vZGVOYW1lKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0NPTkRJVElPTkFMJzpcbiAgICAgIGNvbnN0IGJsb2NrcyA9IGFjdGlvbi5jb25kaXRpb25hbEJsb2Nrcy5tYXAoKHYpID0+IHtcbiAgICAgICAgY29uc3QgcnVuID0gYWN0aW9uc1RvUnVuKHYuYWN0aW9ucywgYm91bmQsIHRyaWdnZXIpO1xuICAgICAgICBjb25zdCB7IGNvbmRpdGlvbiB9ID0gdjtcbiAgICAgICAgY29uc3QgdGVzdCA9IGNvbmRpdGlvblxuICAgICAgICAgID8gKCkgPT4gdG9Cb29sZWFuKHJlc29sdmUoY29uZGl0aW9uLnZhbHVlKSlcbiAgICAgICAgICA6ICgpID0+IHRydWU7XG4gICAgICAgIHJldHVybiB7IHRlc3QsIHJ1biB9O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb25zdCByZXZlcnRzOiBFdmVudENhbGxiYWNrW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiBibG9ja3MpIHtcbiAgICAgICAgICBpZiAoYmxvY2sudGVzdCgpKSB7XG4gICAgICAgICAgICBjb25zdCByZXZlcnQgPSBibG9jay5ydW4oKTtcbiAgICAgICAgICAgIGlmIChyZXZlcnQpIHJldmVydHMucHVzaChyZXZlcnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXZlcnRzLmxlbmd0aCkgcmV0dXJuIChlKSA9PiByZXZlcnRzLmZvckVhY2goKGl0KSA9PiBpdChlKSk7XG4gICAgICB9O1xuICAgIGNhc2UgJ0tFWV9DT05ESVRJT04nOlxuICAgICAgY29uc3QgcnVuID0gYWN0aW9uc1RvUnVuKGFjdGlvbi5hY3Rpb25zLCBib3VuZCwgdHJpZ2dlcik7XG4gICAgICBjb25zdCBrZXlDb2RlID0gYWN0aW9uLmtleUNvZGVzWzBdO1xuICAgICAgY29uc3Qgc2hpZnRLZXkgPSBhY3Rpb24ua2V5Q29kZXMuc2xpY2UoMSkuaW5jbHVkZXMoMTYpO1xuICAgICAgY29uc3QgY3RybEtleSA9IGFjdGlvbi5rZXlDb2Rlcy5zbGljZSgxKS5pbmNsdWRlcygxNyk7XG4gICAgICBjb25zdCBhbHRLZXkgPSBhY3Rpb24ua2V5Q29kZXMuc2xpY2UoMSkuaW5jbHVkZXMoMTgpO1xuICAgICAgY29uc3QgbWV0YUtleSA9IGFjdGlvbi5rZXlDb2Rlcy5zbGljZSgxKS5pbmNsdWRlcyg5MSk7XG4gICAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgICAgaWYgKGUua2V5Q29kZSAhPT0ga2V5Q29kZSkgcmV0dXJuO1xuICAgICAgICAgIGlmIChlLmN0cmxLZXkgIT09IGN0cmxLZXkpIHJldHVybjtcbiAgICAgICAgICBpZiAoZS5hbHRLZXkgIT09IGFsdEtleSkgcmV0dXJuO1xuICAgICAgICAgIGlmIChlLm1ldGFLZXkgIT09IG1ldGFLZXkpIHJldHVybjtcbiAgICAgICAgICBpZiAoZS5zaGlmdEtleSAhPT0gc2hpZnRLZXkpIHJldHVybjtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBydW4oZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgY2FzZSAnQ0xPU0VfT1ZFUkxBWSc6IHtcbiAgICAgIGlmIChhY3Rpb24uc2VsZikgcmV0dXJuIChlKSA9PiAoZT8udGFyZ2V0IGFzIEJvdW5kRWxlbWVudCk/LmYyd19jbG9zZT8uKCk7XG4gICAgICBpZiAoYWN0aW9uLm92ZXJsYXlJZCkge1xuICAgICAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWN0aW9uLm92ZXJsYXlJZCk7XG4gICAgICAgIGlmICghb3ZlcmxheSkgYnJlYWs7XG4gICAgICAgIHJldHVybiAoKSA9PiBvdmVybGF5LmYyd19jbG9zZT8uKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAnU0NST0xMX1RPJzpcbiAgICAgIGlmICghYWN0aW9uLmRlc3RpbmF0aW9uSWQpIGJyZWFrO1xuICAgICAgY29uc3QgZWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWN0aW9uLmRlc3RpbmF0aW9uSWQpO1xuICAgICAgaWYgKCFlbHQpIGJyZWFrO1xuICAgICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gc2Nyb2xsIGFuZCBuYXZpZ2F0ZSBhdCB0aGUgc2FtZSB0aW1lIGZvciBhbmNob3JzXG4gICAgICAgIGlmIChlPy5jdXJyZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpIGU/LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGVsdC5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgICAgYmVoYXZpb3I6IGFjdGlvbi50cmFuc2l0aW9uPy50eXBlID8gJ3Ntb290aCcgOiAnaW5zdGFudCcsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICBjYXNlICdPVkVSTEFZJzpcbiAgICAgIGlmICghYWN0aW9uLmRlc3RpbmF0aW9uSWQpIGJyZWFrO1xuICAgICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFjdGlvbi5kZXN0aW5hdGlvbklkKTtcbiAgICAgIGlmICghb3ZlcmxheSkgYnJlYWs7XG4gICAgICBjb25zdCBtb2RhbCA9IEFycmF5KC4uLm92ZXJsYXkuY2hpbGRyZW4pLmZpbmQoXG4gICAgICAgIChpdCkgPT4gaXQudGFnTmFtZSAhPT0gJ1RFTVBMQVRFJ1xuICAgICAgKSBhcyBCb3VuZEVsZW1lbnQ7XG4gICAgICBpZiAoIW1vZGFsKSBicmVhaztcbiAgICAgIGNvbnN0IHsgdHJhbnNpdGlvbiwgb3ZlcmxheVBvc2l0aW9uVHlwZSwgb3ZlcmxheVJlbGF0aXZlUG9zaXRpb24gfSA9XG4gICAgICAgIGFjdGlvbjtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gTWF0aC5yb3VuZCgxMDAwICogKHRyYW5zaXRpb24/LmR1cmF0aW9uID8/IDApKTtcbiAgICAgIGNvbnN0IGFuaW1hdGlvbnM6IEFuaW1hdGlvbltdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQ6IGFjdGlvbi5kZXN0aW5hdGlvbklkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7IGtleTogJ3Zpc2liaWxpdHknLCBmcm9tOiAnaGlkZGVuJywgdG86ICd2aXNpYmxlJyB9LFxuICAgICAgICAgICAgeyBrZXk6ICdvcGFjaXR5JywgZnJvbTogJzAnLCB0bzogJzEnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG5cbiAgICAgIGlmIChvdmVybGF5UG9zaXRpb25UeXBlID09PSAnTUFOVUFMJykge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIGlmICh0cmlnZ2VyID09PSAnaG92ZXInKSB7XG4gICAgICAgICAgICAvLyB0ZW1wb3JhcnkgZGlzYWJsZSBtb3VzZWxlYXZlIGhhbmRsZXIgb24gZWxlbWVudCwgYmVjYXVzZSB3ZSB3YW50IHRoZSBvdmVybGF5IHRvIHJlbWFpbiB2aXNpYmxlIHdoaWxlIHRoZSBjdXJzb3IgaG92ZXJzIHRoZSBib3VuZCBlbGVtZW50IE9SIHRoZSBvdmVybGF5IGl0c2VsZlxuICAgICAgICAgICAgY29uc3QgbGVhdmUgPSBib3VuZC5mMndfbW91c2VsZWF2ZV9yZW1vdmU/LigpO1xuICAgICAgICAgICAgaWYgKGxlYXZlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG1vdXNlbW92ZSA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc091dHNpZGUoZXZlbnQsIGJvdW5kKSAmJiBpc091dHNpZGUoZXZlbnQsIG1vZGFsKSkge1xuICAgICAgICAgICAgICAgICAgbGVhdmUoKTtcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBUT0RPIG1ha2UgaXQgc3RpY2sgdG8gZWxlbWVudCBpbiBjYXNlIG9mIHJlc2l6ZSA/XG4gICAgICAgICAgLy8gVE9ETyBjbG9zZSBpdCBpbiBjYXNlIG9mIHJlc3BvbnNpdmUgbGF5b3V0IGNoYW5nZSA/XG4gICAgICAgICAgY29uc3QgZHluYW1pY19hbmltYXRpb25zID0gYW5pbWF0aW9ucy5zbGljZSgwKTtcbiAgICAgICAgICBjb25zdCBtYW51YWxMZWZ0ID0gdG9QeChcbiAgICAgICAgICAgIGJvdW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgK1xuICAgICAgICAgICAgICAob3ZlcmxheVJlbGF0aXZlUG9zaXRpb24/LnggPz8gMClcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IG1hbnVhbFRvcCA9IHRvUHgoXG4gICAgICAgICAgICBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgK1xuICAgICAgICAgICAgICAob3ZlcmxheVJlbGF0aXZlUG9zaXRpb24/LnkgPz8gMClcbiAgICAgICAgICApO1xuICAgICAgICAgIG1vZGFsLnN0eWxlLnNldFByb3BlcnR5KCdsZWZ0JywgbWFudWFsTGVmdCk7XG4gICAgICAgICAgbW9kYWwuc3R5bGUuc2V0UHJvcGVydHkoJ3RvcCcsIG1hbnVhbFRvcCk7XG4gICAgICAgICAgaWYgKHRyYW5zaXRpb24/LnR5cGUgPT09ICdNT1ZFX0lOJykge1xuICAgICAgICAgICAgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnTEVGVCcpIHtcbiAgICAgICAgICAgICAgZHluYW1pY19hbmltYXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIGVsdElkOiBtb2RhbC5pZCxcbiAgICAgICAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICB0bzogbWFudWFsTGVmdCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnUklHSFQnKSB7XG4gICAgICAgICAgICAgIGR5bmFtaWNfYW5pbWF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICBlbHRJZDogbW9kYWwuaWQsXG4gICAgICAgICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICcwcHgnLFxuICAgICAgICAgICAgICAgICAgICB0bzogbWFudWFsTGVmdCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICctMTAwJSAwcHgnLFxuICAgICAgICAgICAgICAgICAgICB0bzogJzBweCAwcHgnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdUT1AnKSB7XG4gICAgICAgICAgICAgIGR5bmFtaWNfYW5pbWF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICBlbHRJZDogbW9kYWwuaWQsXG4gICAgICAgICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAndG9wJyxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICB0bzogbWFudWFsVG9wLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdCT1RUT00nKSB7XG4gICAgICAgICAgICAgIGR5bmFtaWNfYW5pbWF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICBlbHRJZDogbW9kYWwuaWQsXG4gICAgICAgICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAndG9wJyxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogJzBweCcsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBtYW51YWxUb3AsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiAnMHB4IC0xMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgdG86ICcwcHggMHB4JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0b0V4ZWN1dGFibGVBbmltYXRpb25zKFxuICAgICAgICAgICAgZHluYW1pY19hbmltYXRpb25zLFxuICAgICAgICAgICAgdHJhbnNpdGlvbj8uZWFzaW5nLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBib3VuZCxcbiAgICAgICAgICAgIHRyaWdnZXIsXG4gICAgICAgICAgICBgJHt0cmlnZ2VyfShtYW51YWxfb3ZlcmxheSlgLFxuICAgICAgICAgICAgb3ZlcmxheVxuICAgICAgICAgICkoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRyYW5zaXRpb24/LnR5cGUgPT09ICdNT1ZFX0lOJykge1xuICAgICAgICBhbmltYXRpb25zLnB1c2goXG4gICAgICAgICAgLi4uZ2V0TW92ZUluQW5pbWF0aW9ucyhtb2RhbC5pZCwgb3ZlcmxheVBvc2l0aW9uVHlwZSwgdHJhbnNpdGlvbilcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvbj8udHlwZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1Vuc3VwcG9ydGVkIHRyYW5zaXRpb246JywgdHJhbnNpdGlvbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9FeGVjdXRhYmxlQW5pbWF0aW9ucyhcbiAgICAgICAgYW5pbWF0aW9ucyxcbiAgICAgICAgdHJhbnNpdGlvbj8uZWFzaW5nLFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgYm91bmQsXG4gICAgICAgIHRyaWdnZXIsXG4gICAgICAgIGAke3RyaWdnZXJ9KG92ZXJsYXkpYCxcbiAgICAgICAgb3ZlcmxheVxuICAgICAgKTtcbiAgICBjYXNlICdBTklNQVRFJzoge1xuICAgICAgY29uc3QgeyBhbmltYXRpb25zLCB0cmFuc2l0aW9uLCByb290SWQsIHJlc2V0IH0gPSBhY3Rpb247XG4gICAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGgucm91bmQoMTAwMCAqICh0cmFuc2l0aW9uPy5kdXJhdGlvbiA/PyAwKSk7XG4gICAgICBjb25zdCBydW4gPSB0b0V4ZWN1dGFibGVBbmltYXRpb25zKFxuICAgICAgICBhbmltYXRpb25zLFxuICAgICAgICB0cmFuc2l0aW9uPy5lYXNpbmcsXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBib3VuZCxcbiAgICAgICAgdHJpZ2dlcixcbiAgICAgICAgcmVzZXQgPyBgJHt0cmlnZ2VyfSgrcmVzZXQpYCA6IHRyaWdnZXJcbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzZXQgJiYgcm9vdElkXG4gICAgICAgID8gKGUsIGkpID0+IHtcbiAgICAgICAgICAgIC8vIG5lZWQgdG8gcmVzZXQgYWxsIGFuaW1hdGlvbnMgZG9uZSBvbiBlbGVtZW50cyBiZWxvdyByb290XG4gICAgICAgICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocm9vdElkKTtcbiAgICAgICAgICAgIGlmIChyb290KSB7XG4gICAgICAgICAgICAgIGNvbnN0IHsgZjJ3X3Jlc2V0IH0gPSByb290O1xuICAgICAgICAgICAgICBpZiAoZjJ3X3Jlc2V0Py5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcm9vdC5mMndfcmVzZXQ7XG4gICAgICAgICAgICAgICAgZjJ3X3Jlc2V0LnJldmVyc2UoKS5mb3JFYWNoKChpdCkgPT4gaXQodW5kZWZpbmVkLCB0cnVlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW4oZSwgaSk7XG4gICAgICAgICAgfVxuICAgICAgICA6IHJ1bjtcbiAgICB9XG4gICAgY2FzZSAnVVBEQVRFX01FRElBX1JVTlRJTUUnOiB7XG4gICAgICBpZiAoIWFjdGlvbi5kZXN0aW5hdGlvbklkKSBicmVhaztcbiAgICAgIGNvbnN0IGVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFjdGlvbi5kZXN0aW5hdGlvbklkKTtcbiAgICAgIGlmICghZWx0KSBicmVhaztcbiAgICAgIHN3aXRjaCAoYWN0aW9uLm1lZGlhQWN0aW9uKSB7XG4gICAgICAgIGNhc2UgJ01VVEUnOlxuICAgICAgICAgIHJldHVybiBtdXRlKGVsdCk7XG4gICAgICAgIGNhc2UgJ1VOTVVURSc6XG4gICAgICAgICAgcmV0dXJuIHVuTXV0ZShlbHQpO1xuICAgICAgICBjYXNlICdUT0dHTEVfTVVURV9VTk1VVEUnOlxuICAgICAgICAgIHJldHVybiB0b2dnbGVNdXRlKGVsdCk7XG4gICAgICAgIGNhc2UgJ1BMQVknOlxuICAgICAgICAgIHJldHVybiBwbGF5KGVsdCk7XG4gICAgICAgIGNhc2UgJ1BBVVNFJzpcbiAgICAgICAgICByZXR1cm4gcGF1c2UoZWx0KTtcbiAgICAgICAgY2FzZSAnVE9HR0xFX1BMQVlfUEFVU0UnOlxuICAgICAgICAgIHJldHVybiB0b2dnbGVQbGF5KGVsdCk7XG4gICAgICAgIGNhc2UgJ1NLSVBfQkFDS1dBUkQnOlxuICAgICAgICAgIHJldHVybiBzZWVrQmFja3dhcmQoZWx0LCBhY3Rpb24uYW1vdW50VG9Ta2lwKTtcbiAgICAgICAgY2FzZSAnU0tJUF9GT1JXQVJEJzpcbiAgICAgICAgICByZXR1cm4gc2Vla0ZvcndhcmQoZWx0LCBhY3Rpb24uYW1vdW50VG9Ta2lwKTtcbiAgICAgICAgY2FzZSAnU0tJUF9UTyc6XG4gICAgICAgICAgcmV0dXJuIHNlZWtUbyhlbHQsIGFjdGlvbi5uZXdUaW1lc3RhbXApO1xuICAgICAgfVxuICAgIH1cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignQWN0aW9uIG5vdCBpbXBsZW1lbnRlZCB5ZXQ6ICcgKyBhY3Rpb24udHlwZSk7XG4gIH1cbiAgcmV0dXJuICgpID0+IHt9O1xufVxuXG5sZXQgb3ZlcmxheVN0YWNrWkluZGV4ID0gOTk5OTtcblxuZnVuY3Rpb24gdG9FeGVjdXRhYmxlQW5pbWF0aW9ucyhcbiAgb3JpZ0FuaW1hdGlvbnM6IEFuaW1hdGlvbltdLFxuICBlYXNpbmcgPSAnbGluZWFyJyxcbiAgZHVyYXRpb246IG51bWJlcixcbiAgYm91bmQ6IEJvdW5kRWxlbWVudCxcbiAgdHJpZ2dlcjogVHJpZ2dlclR5cGUsXG4gIGRlYnVnOiBzdHJpbmcsXG4gIG1vZGFsPzogSFRNTEVsZW1lbnRcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgcmV0dXJuIChlKSA9PiB7XG4gICAgLy8gbG9jYWwgY29weSBvZiBhbmltYXRpb25zLCBzbyB3ZSBjYW4gbW9kaWZ5IGl0IChlLmcuIHotaW5kZXggYmVsb3cpXG4gICAgbGV0IGFuaW1hdGlvbnMgPSBvcmlnQW5pbWF0aW9ucztcbiAgICBpZiAobW9kYWwpIHtcbiAgICAgIC8vIHNldCBtYWluIHNjcm9sbCBsb2NrIHdoZW4gbW9kYWwgaXMgb3BlbmVkXG4gICAgICBkb2N1bWVudC5ib2R5LnBhcmVudEVsZW1lbnQhLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAvLyBlbnN1cmUgb3ZlcmxheXMgYXJlIHN0YWNrZWQgb250byBlYWNoIG90aGVyXG4gICAgICBhbmltYXRpb25zID0gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQ6IG1vZGFsLmlkLFxuICAgICAgICAgIHByb3BzOiBbeyBrZXk6ICd6LWluZGV4JywgZnJvbTogMCwgdG86IG92ZXJsYXlTdGFja1pJbmRleCsrIH1dLFxuICAgICAgICB9LFxuICAgICAgICAuLi5hbmltYXRpb25zLFxuICAgICAgXTtcbiAgICB9XG4gICAgY29uc3QgcmV2ZXJzZUFuaW1hdGlvbnMgPSBleGVjdXRlQW5pbWF0aW9ucyhcbiAgICAgIGFuaW1hdGlvbnMsXG4gICAgICBlYXNpbmcsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIGJvdW5kLFxuICAgICAgdHJpZ2dlcixcbiAgICAgIGRlYnVnLFxuICAgICAgZVxuICAgICk7XG4gICAgY29uc3QgY2xvc2UgPSBvbmNlPEV2ZW50Q2FsbGJhY2s+KChfLCBpKTogdm9pZCA9PiB7XG4gICAgICBpZiAobW9kYWwpIHtcbiAgICAgICAgb3ZlcmxheVN0YWNrWkluZGV4LS07XG4gICAgICAgIC8vIHVuc2V0IG1haW4gc2Nyb2xsIGxvY2sgd2hlbiBtb2RhbCBpcyBjbG9zZWRcbiAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnRFbGVtZW50IS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgfVxuICAgICAgZXhlY3V0ZUFuaW1hdGlvbnMoXG4gICAgICAgIHJldmVyc2VBbmltYXRpb25zLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGkgPyAwIDogZHVyYXRpb24sXG4gICAgICAgIGJvdW5kLFxuICAgICAgICB0cmlnZ2VyLFxuICAgICAgICBgJHtkZWJ1Z30ocmV2ZXJ0KWBcbiAgICAgICk7XG4gICAgfSk7XG4gICAgaWYgKG1vZGFsKSBtb2RhbC5mMndfY2xvc2UgPSBjbG9zZTtcbiAgICByZXR1cm4gY2xvc2U7XG4gIH07XG59XG5cbi8vIElmIGEgY2hpbGQgZWx0IGhhcyBhIGhvdmVyIGVmZmVjdCwgYW5kIHBhcmVudCBoYXMgc3dhcCAob24gY2xpY2spIGVmZmVjdCwgd2UgbmVlZCB0byB0cmFjayB0aGUgY2hpbGQncyBhbHQgZWxlbWVudCB0byByZXBsYWNlIGl0XG5jb25zdCBlbHRUb0FsdE1hcHBpbmdzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuZnVuY3Rpb24gZXhlY3V0ZUFuaW1hdGlvbnMoXG4gIGFuaW1hdGlvbnM6IEFuaW1hdGlvbltdLFxuICBlYXNpbmc6IHN0cmluZyxcbiAgZHVyYXRpb246IG51bWJlcixcbiAgYm91bmQ6IEJvdW5kRWxlbWVudCxcbiAgdHJpZ2dlcjogVHJpZ2dlclR5cGUsXG4gIGRlYnVnOiBzdHJpbmcsXG4gIGU/OiBFdmVudFxuKTogQW5pbWF0aW9uW10ge1xuICAvLyBUT0RPIHVzZSB2aWV3IHRyYW5zaXRpb24gaWYgYXZhaWxhYmxlXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGNvbnNvbGUuZGVidWcoYEV4ZWN1dGluZyBhbmltYXRpb25zICgke2RlYnVnfSlgLCBhbmltYXRpb25zLCBib3VuZCk7XG4gIH1cbiAgY29uc3QgcmV2ZXJzZTogQW5pbWF0aW9uW10gPSBbXTtcbiAgY29uc3QgY29udGFpbmVyc1RvUmVPcmRlciA9IG5ldyBTZXQ8SFRNTEVsZW1lbnQ+KCk7XG5cbiAgaWYgKHRyaWdnZXIgPT09ICdkcmFnJykge1xuICAgIGV4ZWN1dGVEcmFnU3RhcnQoXG4gICAgICBhbmltYXRpb25zLFxuICAgICAgZWFzaW5nLFxuICAgICAgZHVyYXRpb24sXG4gICAgICBib3VuZCxcbiAgICAgIChlIGFzIEN1c3RvbUV2ZW50PERyYWdnaW5nPikuZGV0YWlsXG4gICAgKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBmb3IgKGNvbnN0IHsgZWx0SWQsIGFsdElkLCBwcm9wcywgcmVhY3Rpb25zIH0gb2YgYW5pbWF0aW9ucykge1xuICAgIGxldCBlbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbHRJZCk7XG4gICAgaWYgKCFlbHQpIHtcbiAgICAgIGNvbnN0IGVsdElkMiA9IGVsdFRvQWx0TWFwcGluZ3MuZ2V0KGVsdElkKTtcbiAgICAgIGlmIChlbHRJZDIpIHtcbiAgICAgICAgZWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWx0SWQyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFlbHQpIHtcbiAgICAgIHNob3VsZE5vdEhhcHBlbihgQ2FuJ3QgZmluZCBlbGVtZW50IGZvciBpZDogJHtlbHRJZH1gKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoYWx0SWQpIHtcbiAgICAgIGxldCBhbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhbHRJZCkgYXMgQm91bmRFbGVtZW50O1xuICAgICAgaWYgKCFhbHQpIHtcbiAgICAgICAgY29uc3QgYWx0VHBsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZChhbHRJZCkpO1xuICAgICAgICBpZiAoIWFsdFRwbCkge1xuICAgICAgICAgIHNob3VsZE5vdEhhcHBlbihgQ2FuJ3QgZmluZCB0ZW1wbGF0ZSBmb3IgaWQ6ICR7YWx0SWR9YCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWx0RnJhZ21lbnQgPSAoYWx0VHBsIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQpLmNvbnRlbnQ/LmNsb25lTm9kZShcbiAgICAgICAgICB0cnVlXG4gICAgICAgICkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGFsdCA9IGFsdEZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyonKSBhcyBCb3VuZEVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHByZXZpb3VzIGVsZW1lbnQgaGFkIGNsZWFudXAgY2FsbGJhY2tzLCBob29rIHRoZW0gaW50byB0aGUgcmVwbGFjZWQgZWxlbWVudHMgaW5zdGVhZFxuICAgICAgY29uc3QgeyBmMndfbW91c2V1cCB9ID0gZWx0O1xuICAgICAgY29uc3QgbW91c2VsZWF2ZSA9IGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmU/LigpO1xuICAgICAgaWYgKG1vdXNlbGVhdmUpIHtcbiAgICAgICAgaW5zdGFsbE1vdXNlTGVhdmUoYWx0LCBtb3VzZWxlYXZlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGYyd19tb3VzZXVwKSBhbHQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGYyd19tb3VzZXVwKTtcbiAgICAgIC8vIEhtbW0gbWF5YmUgbmVlZCB0byB0cmFuc2ZlciB0aGUgdGltZW91dCBjbGVhbnVwIGFzIHdlbGwgPyBub3Qgc3VyZVxuICAgICAgLy8gaWYgKGYyd19jbGVhbnVwX3RpbWVvdXQpIGFsdC5mMndfY2xlYW51cF90aW1lb3V0ID0gZjJ3X2NsZWFudXBfdGltZW91dDtcbiAgICAgIGlmIChtb3VzZWxlYXZlIHx8IGYyd19tb3VzZXVwKSB7XG4gICAgICAgIC8vIGVuc3VyZXMgdGhlIGFsdCBlbGVtZW50IHdpbGwgYWN0dWFsbHkgcmVjZWl2ZWQgbW91c2UgZXZlbnRzXG4gICAgICAgIHJlbW92ZVBvaW50ZXJFdmVudHNOb25lKGFsdCk7XG4gICAgICB9XG4gICAgICAvLyBpbnN0YWxsIGV2ZW50IGhhbmRsZXJzIGZvciBuZXcgZWxlbWVudFxuICAgICAgaG9vayhhbHQsIHRydWUsIGR1cmF0aW9uKTtcbiAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICBlbHQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsIGFsdCk7XG4gICAgICAgIC8vIEZpZ21hIGRpc3NvbHZlcyBvbmx5IGRpc3NvbHZlcyB0aGUgZGVzdGluYXRpb24gb24gdG9wIG9mIHRoZSBzb3VyY2UgbGF5ZXIsIHNvIHdlIG5lZWQgdG8gZG8gdGhlIHNhbWVcbiAgICAgICAgYW5pbWF0ZVByb3BzKFxuICAgICAgICAgIGVsdCxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2Rpc3BsYXknLFxuICAgICAgICAgICAgICBmcm9tOiBnZXRDb21wdXRlZFN0eWxlKGVsdCkuZGlzcGxheSxcbiAgICAgICAgICAgICAgdG86ICdub25lJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBlYXNpbmcsXG4gICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgY29udGFpbmVyc1RvUmVPcmRlclxuICAgICAgICApO1xuICAgICAgICBhbmltYXRlUHJvcHMoXG4gICAgICAgICAgYWx0LFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAnb3BhY2l0eScsXG4gICAgICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgICAgIHRvOiAncmV2ZXJ0LWxheWVyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2Rpc3BsYXknLFxuICAgICAgICAgICAgICBmcm9tOiAnbm9uZScsXG4gICAgICAgICAgICAgIHRvOiAncmV2ZXJ0LWxheWVyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBlYXNpbmcsXG4gICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgY29udGFpbmVyc1RvUmVPcmRlclxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWx0LnBhcmVudEVsZW1lbnQhLnJlcGxhY2VDaGlsZChhbHQsIGVsdCk7XG4gICAgICAgIGxldCBlbHRUcGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKGVsdElkKSk7XG4gICAgICAgIGlmICghZWx0VHBsKSB7XG4gICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBCYWNraW5nIHVwIGVsZW1lbnQgYmVmb3JlIHN3YXAsIGlkOiAke2VsdElkfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBiYWNrdXAgZWxlbWVudCBpbiBjYXNlIHdlIG5lZWQgdG8gcmV2ZXJ0IGJhY2sgdG8gaXRcbiAgICAgICAgICBlbHRUcGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgICAgIGVsdFRwbC5pZCA9IHRlbXBsYXRlSWQoZWx0SWQpO1xuICAgICAgICAgIGVsdFRwbC5pbm5lckhUTUwgPSBlbHQub3V0ZXJIVE1MO1xuICAgICAgICAgIGFsdC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgZWx0VHBsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHRUb0FsdE1hcHBpbmdzLnNldChlbHRJZCwgYWx0LmlkKTtcbiAgICAgIH1cbiAgICAgIHJldmVyc2UucHVzaCh7XG4gICAgICAgIGVsdElkOiBhbHQuaWQsXG4gICAgICAgIGFsdElkOiBlbHQuaWQsXG4gICAgICB9KTtcbiAgICAgIC8vIHJlLXBvc2l0aW9uIHRoZSBjaGlsZCBhdCB0aGUgcmlnaHQgcGxhY2UgaW4gdGhlIHBhcmVudFxuICAgICAgaWYgKCFpc05hTigrZ2V0Q29tcHV0ZWRTdHlsZShhbHQpLmdldFByb3BlcnR5VmFsdWUoJy0tZjJ3LW9yZGVyJykpKSB7XG4gICAgICAgIGNvbnRhaW5lcnNUb1JlT3JkZXIuYWRkKGFsdC5wYXJlbnRFbGVtZW50ISk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRQcm9wcyA9IChwcm9wcyB8fCBbXSlcbiAgICAgICAgLm1hcCgoaXQpID0+IHtcbiAgICAgICAgICBjb25zdCBmcm9tID0gbWFwQ3VycmVudChlbHQhLCBpdC5rZXksIGl0LmZyb20pO1xuICAgICAgICAgIGNvbnN0IHRvID0gbWFwQ3VycmVudChlbHQhLCBpdC5rZXksIGl0LnRvKTtcblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IGl0LmtleSxcbiAgICAgICAgICAgIHBzZXVkbzogaXQucHNldWRvLFxuICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgIHRvLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pXG4gICAgICAgIC5maWx0ZXIoKGl0KSA9PiBpdC5mcm9tICE9PSBpdC50byk7XG5cbiAgICAgIGFuaW1hdGVQcm9wcyhlbHQsIGN1cnJlbnRQcm9wcywgZWFzaW5nLCBkdXJhdGlvbiwgY29udGFpbmVyc1RvUmVPcmRlcik7XG4gICAgICBpZiAocmVhY3Rpb25zKSB7XG4gICAgICAgIGlmICh0cmlnZ2VyICE9PSAnaG92ZXInKSB7XG4gICAgICAgICAgZWx0LmYyd19tb3VzZWxlYXZlX3JlbW92ZT8uKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVhY3Rpb25zLmZvckVhY2goKGl0KSA9PiBob29rRWx0KGVsdCEsIGl0LnR5cGUsIGl0LnRvLCBkdXJhdGlvbikpO1xuICAgICAgfVxuICAgICAgY29uc3QgcmV2OiBBbmltYXRpb24gPSB7XG4gICAgICAgIGVsdElkLFxuICAgICAgICBwcm9wczogY3VycmVudFByb3BzLm1hcCgocCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJldDogQW5pbWF0ZWRQcm9wID0ge1xuICAgICAgICAgICAga2V5OiBwLmtleSxcbiAgICAgICAgICAgIGZyb206IHAudG8sXG4gICAgICAgICAgICB0bzogcC5mcm9tLFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHAucHNldWRvKSByZXQucHNldWRvID0gcC5wc2V1ZG87XG4gICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgICAgaWYgKHJlYWN0aW9ucykge1xuICAgICAgICByZXYucmVhY3Rpb25zID0gcmVhY3Rpb25zLm1hcCgoaXQpID0+ICh7XG4gICAgICAgICAgdHlwZTogaXQudHlwZSxcbiAgICAgICAgICBmcm9tOiBpdC50byxcbiAgICAgICAgICB0bzogaXQuZnJvbSxcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV2ZXJzZS5wdXNoKHJldik7XG4gICAgfVxuICB9XG4gIGZvciAoY29uc3QgY29udGFpbmVyIG9mIGNvbnRhaW5lcnNUb1JlT3JkZXIpIHtcbiAgICAvLyBUT0RPIGdlbmVyYXRlIG1pbmltdW0gc2V0IG9mIG1vdmVzIHJlcXVpcmVkPyAodXNpbmcgaW5zZXJ0QmVmb3JlIGFuZCBzb21lICdMb25nZXN0IEluY3JlYXNpbmcgU3Vic2VxdWVuY2UnIGFsZ29yaXRobSlcbiAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oY29udGFpbmVyLmNoaWxkcmVuKS5tYXAoKGl0LCBpKSA9PiAoeyBpdCwgaSB9KSk7XG4gICAgbGV0IG9yZGVySGFzQ2hhbmdlZCA9IGZhbHNlO1xuICAgIGNoaWxkcmVuXG4gICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBhT3JkZXIgPSArKFxuICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoYS5pdCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS1mMnctb3JkZXInKSB8fCAnOTk5OTknXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGJPcmRlciA9ICsoXG4gICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShiLml0KS5nZXRQcm9wZXJ0eVZhbHVlKCctLWYydy1vcmRlcicpIHx8ICc5OTk5OSdcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGFPcmRlciAtIGJPcmRlcjtcbiAgICAgIH0pXG4gICAgICAuZm9yRWFjaCgoY2hpbGQsIGopID0+IHtcbiAgICAgICAgaWYgKG9yZGVySGFzQ2hhbmdlZCkge1xuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZC5pdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gYXZvaWQgbW92aW5nIGFscmVhZHkgb3JkZXJlZCBlbGVtZW50cywgc2F2ZXMgbW9zdCBvZiB0aGUgcmVmbG93IHdpdGhvdXQgbXVjaCBjb21wbGV4aXR5XG4gICAgICAgICAgb3JkZXJIYXNDaGFuZ2VkID0gaiAhPT0gY2hpbGQuaTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJldmVyc2U7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVBvaW50ZXJFdmVudHNOb25lKGVsdDogQm91bmRFbGVtZW50KTogdm9pZCB7XG4gIGxldCBlOiBCb3VuZEVsZW1lbnQgfCBudWxsID0gZWx0O1xuICB3aGlsZSAoZSkge1xuICAgIGUuY2xhc3NMaXN0LnJlbW92ZSgncG9pbnRlci1ldmVudHMtbm9uZScpO1xuICAgIGUgPSBlLnBhcmVudEVsZW1lbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXhlY3V0ZURyYWdTdGFydChcbiAgYW5pbWF0aW9uczogQW5pbWF0aW9uW10sXG4gIGVhc2luZzogc3RyaW5nLFxuICBkdXJhdGlvbjogbnVtYmVyLFxuICBib3VuZDogQm91bmRFbGVtZW50LFxuICBkcmFnZ2luZzogRHJhZ2dpbmdcbik6IHZvaWQge1xuICBpZiAoZHJhZ2dpbmcuaGFuZGxlZCkgcmV0dXJuO1xuICAvLyB0ZW1wb3JhcnkgZXhlY3V0ZSBhbmltYXRpb25zIHRvIGdldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiBzdGFydCBhbmQgZW5kXG4gIGNvbnN0IHJlY3QxID0gYm91bmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHJldiA9IGV4ZWN1dGVBbmltYXRpb25zKFxuICAgIGFuaW1hdGlvbnNcbiAgICAgIC5maWx0ZXIoKGl0KSA9PiBpdC5wcm9wcylcbiAgICAgIC5tYXAoKHsgZWx0SWQsIHByb3BzIH0pID0+ICh7IGVsdElkLCBwcm9wcyB9KSksXG4gICAgJ2xpbmVhcicsXG4gICAgMCxcbiAgICBib3VuZCxcbiAgICAnY2xpY2snLFxuICAgIGBkcmFnX3N0YXJ0KHRtcClgXG4gICk7XG4gIGNvbnN0IHJlY3QyID0gYm91bmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IGRpZmZYID0gcmVjdDIubGVmdCAtIHJlY3QxLmxlZnQ7XG4gIGNvbnN0IGRpZmZZID0gcmVjdDIudG9wIC0gcmVjdDEudG9wO1xuICBjb25zdCBsZW5ndGggPSBNYXRoLnNxcnQoZGlmZlggKiBkaWZmWCArIGRpZmZZICogZGlmZlkpO1xuICAvLyByZXZlcnQgdGVtcCBjaGFuZ2VzXG4gIGV4ZWN1dGVBbmltYXRpb25zKHJldiwgJ2xpbmVhcicsIDAsIGJvdW5kLCAnY2xpY2snLCBgZHJhZ19zdGFydCh0bXAgdW5kbylgKTtcbiAgY29uc3QgeyB4OiBkaXN0WCwgeTogZGlzdFkgfSA9IGdldERpc3RhbmNlKGRyYWdnaW5nLnN0YXJ0LCBkcmFnZ2luZy5lbmQpO1xuICBjb25zdCBhY2NlcHRzRHJhZ0RpcmVjdGlvbiA9XG4gICAgKGRpc3RYID4gMCAmJiBkaWZmWCA+IDApIHx8XG4gICAgKGRpc3RYIDwgMCAmJiBkaWZmWCA8IDApIHx8XG4gICAgKGRpZmZYID09PSAwICYmICgoZGlzdFkgPiAwICYmIGRpZmZZID4gMCkgfHwgKGRpc3RZIDwgMCAmJiBkaWZmWSA8IDApKSk7XG4gIGlmIChhY2NlcHRzRHJhZ0RpcmVjdGlvbikge1xuICAgIGRyYWdnaW5nLmhhbmRsZWQgPSB0cnVlO1xuICAgIGNvbnN0IGRyYWdBbmltcyA9IGFuaW1hdGlvbnMubWFwKChpdCkgPT4gKHtcbiAgICAgIC4uLml0LFxuICAgICAgc3dhcHBlZDogZmFsc2UsXG4gICAgICBwcm9wczogaXQucHJvcHM/Lm1hcCgocCkgPT4gKHsgLi4ucCwgY3VycjogcC5mcm9tIH0pKSxcbiAgICB9KSk7XG4gICAgY29uc3QgZ2V0UGVyY2VudCA9IChkOiBEcmFnZ2luZyk6IG51bWJlciA9PiB7XG4gICAgICBjb25zdCB7IHg6IGRpc3RYLCB5OiBkaXN0WSB9ID0gZ2V0RGlzdGFuY2UoZC5zdGFydCwgZC5lbmQpO1xuICAgICAgY29uc3QgZGlzdCA9IChkaXN0WCAqIGRpZmZYICsgZGlzdFkgKiBkaWZmWSkgLyBsZW5ndGg7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCAoMTAwICogZGlzdCkgLyBsZW5ndGgpKTtcbiAgICB9O1xuICAgIGNvbnN0IG1vdmUgPSAoZDogRHJhZ2dpbmcpOiB2b2lkID0+IHtcbiAgICAgIGQuZW5kLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBkLmVuZC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IHBlcmNlbnQgPSBnZXRQZXJjZW50KGQpO1xuICAgICAgZXhlY3V0ZUFuaW1hdGlvbnMoXG4gICAgICAgIGZpbHRlckVtcHR5KFxuICAgICAgICAgIGRyYWdBbmltcy5tYXAoKGl0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHJlYWN0aW9uczogXywgLi4ucmVzdCB9ID0gaXQ7XG4gICAgICAgICAgICBpZiAoaXQucHJvcHMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5yZXN0LFxuICAgICAgICAgICAgICAgIHByb3BzOiBpdC5wcm9wcy5tYXAoKHApID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHRvID0gaW50ZXJwb2xhdGUocCwgcGVyY2VudCk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBmcm9tID0gcC5jdXJyO1xuICAgICAgICAgICAgICAgICAgcC5jdXJyID0gdG87XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5wLFxuICAgICAgICAgICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgICAgICAgICB0byxcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXQuYWx0SWQpIHtcbiAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPCA1MCAmJiBpdC5zd2FwcGVkKSB7XG4gICAgICAgICAgICAgICAgaXQuc3dhcHBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGFsdElkOiBpdC5lbHRJZCwgZWx0SWQ6IGl0LmFsdElkIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPj0gNTAgJiYgIWl0LnN3YXBwZWQpIHtcbiAgICAgICAgICAgICAgICBpdC5zd2FwcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgICAgICAnbGluZWFyJyxcbiAgICAgICAgMCxcbiAgICAgICAgYm91bmQsXG4gICAgICAgICdjbGljaycsXG4gICAgICAgIGBkcmFnZ2luZ2BcbiAgICAgICk7XG4gICAgfTtcbiAgICBtb3ZlKGRyYWdnaW5nKTtcbiAgICBib3VuZC5mMndfZHJhZ19saXN0ZW5lciA9IChkOiBEcmFnZ2luZykgPT4ge1xuICAgICAgbW92ZShkKTtcbiAgICAgIGlmIChkLmZpbmlzaGVkKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnQgPSBnZXRQZXJjZW50KGQpO1xuICAgICAgICBleGVjdXRlQW5pbWF0aW9ucyhcbiAgICAgICAgICBmaWx0ZXJFbXB0eShcbiAgICAgICAgICAgIGRyYWdBbmltcy5tYXAoKGl0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpdC5wcm9wcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlYWN0aW9ucyA9IHBlcmNlbnQgPCA1MCA/IHVuZGVmaW5lZCA6IGl0LnJlYWN0aW9ucztcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgZWx0SWQ6IGl0LmVsdElkLFxuICAgICAgICAgICAgICAgICAgcHJvcHM6IGl0LnByb3BzLm1hcCgocCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgLi4ucCxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogcC5jdXJyLFxuICAgICAgICAgICAgICAgICAgICB0bzogcGVyY2VudCA8IDUwID8gcC5mcm9tIDogcC50byxcbiAgICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgICAgICAgIHJlYWN0aW9ucyxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpdC5hbHRJZCkge1xuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50IDwgNTAgJiYgaXQuc3dhcHBlZCkge1xuICAgICAgICAgICAgICAgICAgaXQuc3dhcHBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWx0SWQ6IGl0LmVsdElkLCBlbHRJZDogaXQuYWx0SWQgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPj0gNTAgJiYgIWl0LnN3YXBwZWQpIHtcbiAgICAgICAgICAgICAgICAgIGl0LnN3YXBwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgIGVhc2luZyxcbiAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICBib3VuZCxcbiAgICAgICAgICAnY2xpY2snLFxuICAgICAgICAgIGBkcmFnX2VuZGBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcEN1cnJlbnQoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICBrZXk6IHN0cmluZyxcbiAgdjogQW5pbWF0ZWRQcm9wWydmcm9tJ11cbik6IEFuaW1hdGVkUHJvcFsnZnJvbSddIHtcbiAgaWYgKHYgIT09ICckY3VycmVudCcpIHJldHVybiB2O1xuICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZShlbHQpLmdldFByb3BlcnR5VmFsdWUoa2V5KTtcbn1cblxuZnVuY3Rpb24gaG9vayhcbiAgcm9vdDogUGFyZW50Tm9kZSxcbiAgd2l0aFJvb3QgPSBmYWxzZSxcbiAgZnJvbUFuaW1hdGlvbkR1cmF0aW9uID0gMFxuKTogdm9pZCB7XG4gIGZvciAoY29uc3QgdHlwZSBvZiByZWFjdGlvbl90eXBlcykge1xuICAgIGZvciAoY29uc3QgZWx0IG9mIHF1ZXJ5U2VsZWN0b3JBbGxFeHQoXG4gICAgICByb290IGFzIEJvdW5kRWxlbWVudCxcbiAgICAgIGBbZGF0YS1yZWFjdGlvbi0ke3R5cGV9XWAsXG4gICAgICB3aXRoUm9vdFxuICAgICkpIHtcbiAgICAgIGhvb2tFbHQoXG4gICAgICAgIGVsdCBhcyBCb3VuZEVsZW1lbnQsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGVsdC5nZXRBdHRyaWJ1dGUoYGRhdGEtcmVhY3Rpb24tJHt0eXBlfWApISxcbiAgICAgICAgZnJvbUFuaW1hdGlvbkR1cmF0aW9uXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBxdWVyeVNlbGVjdG9yQWxsRXh0KFxuICByb290OiBCb3VuZEVsZW1lbnQsXG4gIHNlbDogc3RyaW5nLFxuICBpbmNsdWRlUm9vdCA9IGZhbHNlXG4pOiBCb3VuZEVsZW1lbnRbXSB7XG4gIGNvbnN0IHJldCA9IFsuLi5yb290LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKV0gYXMgQm91bmRFbGVtZW50W107XG4gIGlmIChpbmNsdWRlUm9vdCAmJiByb290Lm1hdGNoZXMoc2VsKSkge1xuICAgIHJldC51bnNoaWZ0KHJvb3QpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbnR5cGUgVHJpZ2dlckV2ZW50ID0gS2V5Ym9hcmRFdmVudCB8IE1vdXNlRXZlbnQgfCBEcmFnRXZlbnQ7XG5cbmZ1bmN0aW9uIGhvb2tFbHQoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICB0eXBlOiBUcmlnZ2VyVHlwZSxcbiAgdiA9ICcnLFxuICBmcm9tQW5pbWF0aW9uRHVyYXRpb24gPSAwXG4pOiB2b2lkIHtcbiAgaWYgKCF2KSB7XG4gICAgaWYgKHR5cGUgIT09ICdob3ZlcicpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgICBjb25zb2xlLmRlYnVnKGBDbGVhbnVwIGhvb2tzICR7dHlwZX0gb25gLCBlbHQpO1xuICAgICAgfVxuICAgICAgY2xlYW51cEV2ZW50TGlzdGVuZXIoZWx0LCB0eXBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgbGV0IGRlbGF5ID0gMDtcbiAgaWYgKHZbMF0gPT09ICdUJykge1xuICAgIGNvbnN0IGlkeCA9IHYuaW5kZXhPZignbXMnKTtcbiAgICBkZWxheSA9IHBhcnNlRmxvYXQodi5zbGljZSgxLCBpZHgpKSB8fCAwO1xuICAgIHYgPSB2LnNsaWNlKGlkeCArIDMpO1xuICB9XG4gIGNvbnN0IHJlYWN0aW9ucyA9IGFsbFJlYWN0aW9ucygpO1xuICBjb25zdCBhY3Rpb25zID0gZmlsdGVyRW1wdHkodi5zcGxpdCgnLCcpLm1hcCgoaWQpID0+IHJlYWN0aW9uc1tpZF0pKTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhgU2V0dXAgaG9vayAke3R5cGV9IG9uYCwgZWx0LCBgLT5gLCBhY3Rpb25zKTtcbiAgfVxuICBjb25zdCBydW4gPSBhY3Rpb25zVG9SdW4oYWN0aW9ucywgZWx0LCB0eXBlKTtcbiAgaWYgKHR5cGUgPT09ICd0aW1lb3V0Jykge1xuICAgIHNldFRpbWVvdXRXaXRoQ2xlYW51cChlbHQsICgpID0+IHJ1bigpLCBkZWxheSArIGZyb21BbmltYXRpb25EdXJhdGlvbik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlbW92ZVBvaW50ZXJFdmVudHNOb25lKGVsdCk7XG4gIGlmICh0eXBlID09PSAncHJlc3MnKSB7XG4gICAgLy8gbm8gZGVsYXkgZm9yIHByZXNzXG4gICAgbGV0IHJldmVydDogRXZlbnRDYWxsYmFjayB8IHVuZGVmaW5lZCB8IHZvaWQgPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgbW91c2V1cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHJldmVydD8uKCk7XG4gICAgICByZXZlcnQgPSB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICBlbHQuZjJ3X21vdXNldXAgPSBtb3VzZXVwO1xuICAgIGFkZEV2ZW50TGlzdGVuZXJXaXRoQ2xlYW51cChcbiAgICAgIGVsdCxcbiAgICAgICdtb3VzZWRvd24nLFxuICAgICAgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgcmV2ZXJ0Py4oKTtcbiAgICAgICAgcmV2ZXJ0ID0gcnVuKGUpO1xuICAgICAgfSxcbiAgICAgIHR5cGUsXG4gICAgICBhdHRhY2hMaXN0ZW5lcihlbHQsICdtb3VzZXVwJywgbW91c2V1cClcbiAgICApO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkcmFnJykge1xuICAgIGFkZEV2ZW50TGlzdGVuZXJXaXRoQ2xlYW51cChcbiAgICAgIGVsdCxcbiAgICAgICdkcmFnZ2luZycgYXMgYW55LFxuICAgICAgKGU6IEN1c3RvbUV2ZW50PERyYWdnaW5nPikgPT4ge1xuICAgICAgICBydW4oZSk7XG4gICAgICB9LFxuICAgICAgdHlwZVxuICAgICk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2hvdmVyJykge1xuICAgIC8vIG5vIGRlbGF5IGZvciBob3ZlclxuICAgIGxldCByZXZlcnQ6IEV2ZW50Q2FsbGJhY2sgfCB1bmRlZmluZWQgfCB2b2lkID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHJ1bklmTm90QWxyZWFkeSA9IChlPzogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFyZXZlcnQpIHJldmVydCA9IG9uY2UocnVuKGUpKTtcbiAgICB9O1xuICAgIGNvbnN0IHByZXYgPSBlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlPy4oKTtcbiAgICBjb25zdCBtb3VzZWxlYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgcmV2ZXJ0Py4oKTtcbiAgICAgIHJldmVydCA9IHVuZGVmaW5lZDtcbiAgICAgIHByZXY/LigpO1xuICAgIH07XG4gICAgLy8gaWYgdGhlIG1vdXNlIGlzIGFscmVhZHkgb24gaXQsICdlbnRlcicgd29uJ3QgZmlyZSBhZ2FpbiwgZW5zdXJlIHdlIGdldCB0cmlnZ2VyZWQgYXMgc29vbiBhcyB0aGUgbW91c2UgbW92ZXNcbiAgICBjb25zdCB0aW1lcklkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoZWx0Lm1hdGNoZXMoJzpob3ZlcicpKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiAhcmV2ZXJ0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYEZvcmNpbmcgaG92ZXIgb24gdGltZW91dGApO1xuICAgICAgICB9XG4gICAgICAgIHJ1bklmTm90QWxyZWFkeSgpO1xuICAgICAgfVxuICAgIH0sIGZyb21BbmltYXRpb25EdXJhdGlvbik7XG4gICAgY29uc3QgbW91c2VsZWF2ZV9yZW1vdmUgPSBpbnN0YWxsTW91c2VMZWF2ZShlbHQsIG1vdXNlbGVhdmUsIHRpbWVySWQpO1xuICAgIGFkZEV2ZW50TGlzdGVuZXJXaXRoQ2xlYW51cChcbiAgICAgIGVsdCxcbiAgICAgICdtb3VzZWVudGVyJyxcbiAgICAgIHJ1bklmTm90QWxyZWFkeSxcbiAgICAgIHR5cGUsXG4gICAgICBtb3VzZWxlYXZlX3JlbW92ZVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGUgPT09ICdrZXlkb3duJyAmJiAhZWx0LmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSkge1xuICAgICAgLy8gdGFiaW5kZXggcmVxdWlyZWQgdG8gY2FwdHVyZSBrZXlkb3duXG4gICAgICBlbHQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ2FwcGVhcicpIHtcbiAgICAgIGFwcGVhck9ic2VydmVyLm9ic2VydmUoZWx0KTtcbiAgICB9XG4gICAgYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwKFxuICAgICAgZWx0LFxuICAgICAgdHlwZSBhcyBhbnksXG4gICAgICAoZTogVHJpZ2dlckV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0eXBlICE9PSAna2V5ZG93bicpIHtcbiAgICAgICAgICAvLyBEb24ndCB1c2UgZS5wcmV2ZW50RGVmYXVsdCBiZWNhdXNlIHRhcmdldCBlbGVtZW50cyBjYW4gY29udGFpbiBuZXN0ZWQgY2hpbGRyZW4sXG4gICAgICAgICAgLy8gaS5lIGFuY2hvciB0YWdzIGluc2lkZSBhbiBvdmVybGF5IHdoaWNoIHdpbGwgYnJlYWsgaWYgd2UgZG8gZS5wcmV2ZW50RGVmYXVsdC5cbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE8gY29uZmlybSB3aGV0aGVyIGEgZGVsYXllZCBldmVudCBjYW4gYmUgY2FuY2VsZWQgYnkgc3dhcHBpbmcgb3Igbm90IChpbiB3aGljaCBjYXNlIHNob3VsZCBjYW5jZWwgdGhlIHRpbWVvdXQpXG4gICAgICAgIGlmIChkZWxheSkgc2V0VGltZW91dCgoKSA9PiBydW4oZSksIGRlbGF5KTtcbiAgICAgICAgZWxzZSBydW4oZSk7XG4gICAgICB9LFxuICAgICAgdHlwZVxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5zdGFsbE1vdXNlTGVhdmUoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICBtb3VzZWxlYXZlOiAoKSA9PiB2b2lkLFxuICB0aW1lcklkID0gMFxuKTogKCkgPT4gKCkgPT4gdm9pZCB7XG4gIGNvbnN0IHVuc3ViID0gYXR0YWNoTGlzdGVuZXIoZWx0LCAnbW91c2VsZWF2ZScsIG1vdXNlbGVhdmUpO1xuICBjb25zdCBtb3VzZWxlYXZlX3JlbW92ZSA9ICgpOiAoKCkgPT4gdm9pZCkgPT4ge1xuICAgIHVuc3ViKCk7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIGlmIChlbHQuZjJ3X21vdXNlbGVhdmUgPT09IG1vdXNlbGVhdmUpIGRlbGV0ZSBlbHQuZjJ3X21vdXNlbGVhdmU7XG4gICAgaWYgKGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmUgPT09IG1vdXNlbGVhdmVfcmVtb3ZlKVxuICAgICAgZGVsZXRlIGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmU7XG4gICAgcmV0dXJuIG1vdXNlbGVhdmU7XG4gIH07XG4gIGVsdC5mMndfbW91c2VsZWF2ZSA9IG1vdXNlbGVhdmU7XG4gIHJldHVybiAoZWx0LmYyd19tb3VzZWxlYXZlX3JlbW92ZSA9IG1vdXNlbGVhdmVfcmVtb3ZlKTtcbn1cblxuZnVuY3Rpb24gaXNPdXRzaWRlKFxuICB7IGNsaWVudFgsIGNsaWVudFkgfTogUGljazxNb3VzZUV2ZW50LCAnY2xpZW50WCcgfCAnY2xpZW50WSc+LFxuICBib3VuZDogQm91bmRFbGVtZW50XG4pOiBib29sZWFuIHtcbiAgY29uc3QgQk9VTkRTX1hUUkFfUElYRUxTID0gMjtcbiAgY29uc3QgeyB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20gfSA9IGJvdW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICByZXR1cm4gKFxuICAgIGNsaWVudFggPiByaWdodCArIEJPVU5EU19YVFJBX1BJWEVMUyB8fFxuICAgIGNsaWVudFggPCBsZWZ0IC0gQk9VTkRTX1hUUkFfUElYRUxTIHx8XG4gICAgY2xpZW50WSA+IGJvdHRvbSArIEJPVU5EU19YVFJBX1BJWEVMUyB8fFxuICAgIGNsaWVudFkgPCB0b3AgLSBCT1VORFNfWFRSQV9QSVhFTFNcbiAgKTtcbn1cblxuZnVuY3Rpb24gY2xlYW51cEZuS2V5Rm9yVHlwZSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYGYyd19jbGVhbnVwXyR7dHlwZX1gO1xufVxuXG5mdW5jdGlvbiBzZXRUaW1lb3V0V2l0aENsZWFudXAoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICBmbjogKCkgPT4gdm9pZCxcbiAgZGVsYXk6IG51bWJlclxuKTogdm9pZCB7XG4gIGNvbnN0IHRpbWVySWQgPSBzZXRUaW1lb3V0KGZuLCBkZWxheSk7XG4gIGVsdC5mMndfY2xlYW51cF90aW1lb3V0Py4oKTtcbiAgZWx0LmYyd19jbGVhbnVwX3RpbWVvdXQgPSAoKSA9PiB7XG4gICAgZGVsZXRlIGVsdC5mMndfY2xlYW51cF90aW1lb3V0O1xuICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xlYW51cEV2ZW50TGlzdGVuZXIoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICB0eXBlRm9yQ2xlYW51cDogVHJpZ2dlclR5cGVcbik6IHZvaWQge1xuICBjb25zdCBjbGVhbnVwS2V5ID0gY2xlYW51cEZuS2V5Rm9yVHlwZSh0eXBlRm9yQ2xlYW51cCk7XG4gIChlbHQgYXMgYW55KVtjbGVhbnVwS2V5XT8uKCk7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJXaXRoQ2xlYW51cDxcbiAgSyBleHRlbmRzIGtleW9mIEdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE1hcCxcbj4oXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICB0eXBlOiBLLFxuICBsaXN0ZW5lcjogKGV2OiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXBbS10pID0+IGFueSxcbiAgdHlwZUZvckNsZWFudXA6IFRyaWdnZXJUeXBlLFxuICAuLi5leHRyYUNsZWFudXBGbnM6IENsZWFudXBGbltdXG4pOiB2b2lkIHtcbiAgY29uc3QgY2xlYW51cHMgPSBbLi4uZXh0cmFDbGVhbnVwRm5zLCBhdHRhY2hMaXN0ZW5lcihlbHQsIHR5cGUsIGxpc3RlbmVyKV07XG4gIGNvbnN0IGNsZWFudXBLZXkgPSBjbGVhbnVwRm5LZXlGb3JUeXBlKHR5cGVGb3JDbGVhbnVwKTtcbiAgKGVsdCBhcyBhbnkpW2NsZWFudXBLZXldPy4oKTtcbiAgKGVsdCBhcyBhbnkpW2NsZWFudXBLZXldID0gKCkgPT4ge1xuICAgIGRlbGV0ZSAoZWx0IGFzIGFueSlbY2xlYW51cEtleV07XG4gICAgY2xlYW51cHMuZm9yRWFjaCgoaXQpID0+IGl0KCkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRhY2hMaXN0ZW5lcjxLIGV4dGVuZHMga2V5b2YgR2xvYmFsRXZlbnRIYW5kbGVyc0V2ZW50TWFwPihcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIHR5cGU6IEssXG4gIGxpc3RlbmVyOiAoZXY6IEdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE1hcFtLXSkgPT4gYW55LFxuICBvcHRpb25zPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zXG4pOiBDbGVhbnVwRm4ge1xuICBjb25zdCBteV9saXN0ZW5lcjogdHlwZW9mIGxpc3RlbmVyID0gKGUpID0+IHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgdHlwZSAhPT0gJ21vdXNlbW92ZScpIHtcbiAgICAgIGNvbnNvbGUuZGVidWcoXG4gICAgICAgIGAke2VsdC5pc0Nvbm5lY3RlZCA/ICdIYW5kbGluZycgOiAnSWdub3JpbmcnfSAke3R5cGV9IG9uYCxcbiAgICAgICAgZS50YXJnZXRcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIE1heWJlIHNob3VsZCBwcmV2ZW50RGVmYXVsdC9zdG9wUHJvcGFnYXRpb24gdG8gYXZvaWQgZ2V0dGluZyBldmVudHMgb24gcmVtb3ZlZCBlbGVtZW50cz9cbiAgICBpZiAoIWVsdC5pc0Nvbm5lY3RlZCkgcmV0dXJuO1xuICAgIGxpc3RlbmVyKGUpO1xuICB9O1xuICAvLyBAdHMtaWdub3JlXG4gIGVsdC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIG15X2xpc3RlbmVyLCBvcHRpb25zKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZWx0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbXlfbGlzdGVuZXIsIG9wdGlvbnMpO1xuICB9O1xufVxuXG4vLyBGb3IgZWFjaCBjb2xsZWN0aW9uIHdlIHNldCB0aGUgY3VycmVudCBjb2xvciBzY2hlbWUvbW9kZVxuY29uc3QgQ09MT1JfU0NIRU1FX0tFWSA9ICdmMnctY29sb3Itc2NoZW1lJztcbmNvbnN0IExBTkdfS0VZID0gJ2Yydy1sYW5nJztcbndpbmRvdy5GMldfVEhFTUVfU1dJVENIID0gKHRoZW1lKSA9PlxuICB3aW5kb3cuRjJXX0NPTE9SX1NDSEVNRVM/LmZvckVhY2goKGNvbE5hbWUpID0+XG4gICAgc2V0Q29sbGVjdGlvbkF0dHJBbmRWYXJpYWJsZXMoY29sTmFtZSwgdGhlbWUpXG4gICk7XG5cbmlmICh3aW5kb3cuRjJXX0NPTE9SX1NDSEVNRVMpIHtcbiAgY29uc3QgbWF0Y2hNZWRpYVF1ZXJ5ID0gbWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXM7XG4gIGNvbnN0IHN5c3RlbVByZWZlcmVuY2UgPSBtYXRjaE1lZGlhUXVlcnkgPyAnZGFyaycgOiAnbGlnaHQnO1xuICBjb25zdCB1c2VyUHJlZmVyZW5jZSA9IGxvY2FsU3RvcmFnZT8uZ2V0SXRlbShDT0xPUl9TQ0hFTUVfS0VZKTtcbiAgb25Db25uZWN0ZWQoJ2JvZHknLCAoKSA9PiB7XG4gICAgY29uc3QgcHJldmlld1ByZWZlcmVuY2UgPSBkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS1wcmV2aWV3LXRoZW1lJyk7XG4gICAgY29uc3QgY29sb3JTY2hlbWUgPSBwcmV2aWV3UHJlZmVyZW5jZSA/PyB1c2VyUHJlZmVyZW5jZSA/PyBzeXN0ZW1QcmVmZXJlbmNlO1xuICAgIHdpbmRvdy5GMldfVEhFTUVfU1dJVENIPy4oY29sb3JTY2hlbWUpO1xuICB9KTtcbn1cbmlmICh3aW5kb3cuRjJXX0xBTkdVQUdFUykge1xuICBsZXQgdXNlclByZWZlcmVuY2UgPSBsb2NhbFN0b3JhZ2U/LmdldEl0ZW0oTEFOR19LRVkpO1xuICBvbkNvbm5lY3RlZCgnYm9keScsICgpID0+IHtcbiAgICBjb25zdCBhbHRlcm5hdGVzID0gQXJyYXkuZnJvbShcbiAgICAgIGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJhbHRlcm5hdGVcIl0nKVxuICAgICk7XG4gICAgY29uc3QgaXNEZWZhdWx0ID1cbiAgICAgIGFsdGVybmF0ZXMubGVuZ3RoID09PSAwIHx8XG4gICAgICBhbHRlcm5hdGVzLnNvbWUoXG4gICAgICAgIChpdCkgPT5cbiAgICAgICAgICBpdC5nZXRBdHRyaWJ1dGUoJ2hyZWZsYW5nJykgPT09ICd4LWRlZmF1bHQnICYmXG4gICAgICAgICAgaXQuZ2V0QXR0cmlidXRlKCdocmVmJykgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICApO1xuICAgIGlmICghaXNEZWZhdWx0KSB7XG4gICAgICAvLyBwYWdlIHVybCBpcyAvZnIvZm9vLCBzYXZlIHRoZSBsYW5nIHNvIHRoYXQgbmF2aWdhdGlvbiByZXRhaW4gdGhlIHNhbWUgbGFuZ3VhZ2VcbiAgICAgIHVzZXJQcmVmZXJlbmNlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lmxhbmc7XG4gICAgfVxuICAgIGNvbnN0IGlzNDA0ID0gZG9jdW1lbnQuaGVhZFxuICAgICAgLnF1ZXJ5U2VsZWN0b3I8SFRNTExpbmtFbGVtZW50PignbGlua1tyZWw9XCJjYW5vbmljYWxcIl0nKVxuICAgICAgPy5ocmVmPy5lbmRzV2l0aCgnLzQwNC8nKTtcbiAgICB3aW5kb3cuRjJXX0xBTkdVQUdFUz8uZm9yRWFjaCgoY29sTmFtZSkgPT4ge1xuICAgICAgY29uc3QgY2hvaWNlcyA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoZ2V0Q29sTW9kZXMoY29sTmFtZSkpLm1hcCgoW2tdKSA9PiBbay50b0xvd2VyQ2FzZSgpLCBrXSlcbiAgICAgICk7XG4gICAgICBjb25zdCBsYW5ncyA9IFsuLi5uYXZpZ2F0b3IubGFuZ3VhZ2VzXTtcbiAgICAgIGlmICh1c2VyUHJlZmVyZW5jZSkgbGFuZ3MudW5zaGlmdCh1c2VyUHJlZmVyZW5jZSk7XG4gICAgICBmb3IgKGxldCBsYW5nIG9mIGxhbmdzKSB7XG4gICAgICAgIGxhbmcgPSBsYW5nLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBsYW5nLnNwbGl0KCctJylbMF07XG4gICAgICAgIGNvbnN0IG1vZGVWYWx1ZSA9IGNob2ljZXNbbGFuZ10gPz8gY2hvaWNlc1tjb2RlXTtcbiAgICAgICAgaWYgKG1vZGVWYWx1ZSkge1xuICAgICAgICAgIHNldENvbGxlY3Rpb25BdHRyQW5kVmFyaWFibGVzKGNvbE5hbWUsIG1vZGVWYWx1ZSk7XG4gICAgICAgICAgaWYgKCFpczQwNCkgc2F2ZU1vZGUoY29sTmFtZSwgbW9kZVZhbHVlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuY29uc3QgY3VycmVudENvbGxlY3Rpb25Nb2RlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuY29uc3QgY29sbGVjdGlvbk1vZGVCcHNTb3J0ZWQgPSBPYmplY3QuZW50cmllcyhjb2xsZWN0aW9uTW9kZUJwcygpKS5tYXAoXG4gIChbY29sbGVjdGlvbk5hbWUsIHZdKSA9PiAoe1xuICAgIGNvbGxlY3Rpb25OYW1lLFxuICAgIGJyZWFrcG9pbnRzOiBPYmplY3QuZW50cmllcyh2KVxuICAgICAgLm1hcCgoW25hbWUsIHsgbWluV2lkdGggfV0pID0+ICh7IG5hbWUsIG1pbldpZHRoIH0pKVxuICAgICAgLnNvcnQoKHsgbWluV2lkdGg6IGEgfSwgeyBtaW5XaWR0aDogYiB9KSA9PiBhIC0gYiksXG4gIH0pXG4pO1xuXG5mdW5jdGlvbiB1cGRhdGVDb2xsZWN0aW9uTW9kZXMoKTogdm9pZCB7XG4gIGNvbnN0IHdpZHRoID0gd2luZG93LnZpc3VhbFZpZXdwb3J0Py53aWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgZm9yIChjb25zdCB7IGNvbGxlY3Rpb25OYW1lLCBicmVha3BvaW50cyB9IG9mIGNvbGxlY3Rpb25Nb2RlQnBzU29ydGVkKSB7XG4gICAgY29uc3QgYnBzID0gWy4uLmJyZWFrcG9pbnRzXTtcbiAgICBsZXQgbmV3TW9kZSA9IGJwcy5zcGxpY2UoMCwgMSlbMF0ubmFtZTtcbiAgICBmb3IgKGNvbnN0IHsgbmFtZSwgbWluV2lkdGggfSBvZiBicHMpIHtcbiAgICAgIGlmICh3aWR0aCA+PSBtaW5XaWR0aCkgbmV3TW9kZSA9IG5hbWU7XG4gICAgfVxuICAgIGlmIChuZXdNb2RlICE9PSBjdXJyZW50Q29sbGVjdGlvbk1vZGVzW2NvbGxlY3Rpb25OYW1lXSkge1xuICAgICAgc2V0Q29sbGVjdGlvbkF0dHJBbmRWYXJpYWJsZXMoY29sbGVjdGlvbk5hbWUsIG5ld01vZGUpO1xuICAgICAgY3VycmVudENvbGxlY3Rpb25Nb2Rlc1tjb2xsZWN0aW9uTmFtZV0gPSBuZXdNb2RlO1xuICAgIH1cbiAgfVxufVxuXG5sZXQgZHJhZ19zdGFydGVkID0gZmFsc2U7XG5vbkNvbm5lY3RlZCgnYm9keScsICgpID0+IHtcbiAgbGV0IGRyYWdfc3RhcnQ6IE1vdXNlRXZlbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGxldCBzdXBwcmVzc19jbGljayA9IGZhbHNlO1xuICBhdHRhY2hMaXN0ZW5lcihkb2N1bWVudCBhcyBhbnksICdtb3VzZWRvd24nLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGRyYWdfc3RhcnQgPSBlO1xuICAgIGRyYWdfc3RhcnRlZCA9IGZhbHNlO1xuICB9KTtcbiAgYXR0YWNoTGlzdGVuZXIoZG9jdW1lbnQgYXMgYW55LCAnbW91c2Vtb3ZlJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoZHJhZ19zdGFydCAmJiBnZXREaXN0YW5jZShkcmFnX3N0YXJ0LCBlKS5kaXN0ID4gMikge1xuICAgICAgY29uc3QgZHJhZ2dpbmc6IERyYWdnaW5nID0ge1xuICAgICAgICBzdGFydDogZHJhZ19zdGFydCxcbiAgICAgICAgZW5kOiBlLFxuICAgICAgfTtcbiAgICAgIGlmICghZHJhZ19zdGFydGVkKSB7XG4gICAgICAgIGRyYWdfc3RhcnQudGFyZ2V0Py5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudDxEcmFnZ2luZz4oJ2RyYWdnaW5nJywgeyBkZXRhaWw6IGRyYWdnaW5nIH0pXG4gICAgICAgICk7XG4gICAgICAgIGRyYWdfc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIHN1cHByZXNzX2NsaWNrID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChkcmFnX3N0YXJ0LnRhcmdldCBhcyBCb3VuZEVsZW1lbnQpPy5mMndfZHJhZ19saXN0ZW5lcj8uKGRyYWdnaW5nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBhdHRhY2hMaXN0ZW5lcihkb2N1bWVudCBhcyBhbnksICdtb3VzZXVwJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoZHJhZ19zdGFydCAmJiBkcmFnX3N0YXJ0ZWQpIHtcbiAgICAgIChkcmFnX3N0YXJ0LnRhcmdldCBhcyBCb3VuZEVsZW1lbnQpPy5mMndfZHJhZ19saXN0ZW5lcj8uKHtcbiAgICAgICAgc3RhcnQ6IGRyYWdfc3RhcnQsXG4gICAgICAgIGVuZDogZSxcbiAgICAgICAgZmluaXNoZWQ6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgZHJhZ19zdGFydCA9IHVuZGVmaW5lZDtcbiAgICBkcmFnX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgfSk7XG4gIGF0dGFjaExpc3RlbmVyKGRvY3VtZW50IGFzIGFueSwgJ21vdXNldXAnLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGlmIChkcmFnX3N0YXJ0ICYmIGRyYWdfc3RhcnRlZCkge1xuICAgICAgKGRyYWdfc3RhcnQudGFyZ2V0IGFzIEJvdW5kRWxlbWVudCk/LmYyd19kcmFnX2xpc3RlbmVyPy4oe1xuICAgICAgICBzdGFydDogZHJhZ19zdGFydCxcbiAgICAgICAgZW5kOiBlLFxuICAgICAgICBmaW5pc2hlZDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkcmFnX3N0YXJ0ID0gdW5kZWZpbmVkO1xuICAgIGRyYWdfc3RhcnRlZCA9IGZhbHNlO1xuICB9KTtcbiAgYXR0YWNoTGlzdGVuZXIoXG4gICAgZG9jdW1lbnQgYXMgYW55LFxuICAgICdjbGljaycsXG4gICAgKGUpID0+IHtcbiAgICAgIGlmIChzdXBwcmVzc19jbGljaykge1xuICAgICAgICBzdXBwcmVzc19jbGljayA9IGZhbHNlO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7IGNhcHR1cmU6IHRydWUgfVxuICApO1xuICB1cGRhdGVDb2xsZWN0aW9uTW9kZXMoKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZUNvbGxlY3Rpb25Nb2Rlcyk7XG59KTtcblxuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IGhvb2soZG9jdW1lbnQpKTtcbmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGlmICgnbWVkaXVtWm9vbScgaW4gd2luZG93KSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHpvb20gPSBtZWRpdW1ab29tKCdbZGF0YS16b29tYWJsZV0nKTtcbiAgICB6b29tLm9uKCdvcGVuJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG9iamVjdEZpdCA9IGdldENvbXB1dGVkU3R5bGUoZXZlbnQudGFyZ2V0KS5vYmplY3RGaXQ7XG4gICAgICBjb25zdCB6b29tZWQgPSBldmVudC5kZXRhaWwuem9vbS5nZXRab29tZWRJbWFnZSgpO1xuICAgICAgLy8gbWVkaXVtLXpvb20gd2lsbCBoYXZlIGNvbXB1dGVkIHRoZSBpbWFnZSBzaXplIHdpdGggYWRkaXRpb25hbCBib3JkZXJzLFxuICAgICAgLy8gbmVlZCBpdCB0byB1c2Ugb2JqZWN0LWZpdCB0b28gb3RoZXJ3aXNlIHRoZSByYXRpbyB3aWxsIGJlIHNjcmV3ZWRcbiAgICAgIGlmIChvYmplY3RGaXQgJiYgem9vbWVkKSB6b29tZWQuc3R5bGUub2JqZWN0Rml0ID0gb2JqZWN0Rml0O1xuICAgIH0pO1xuICAgIHpvb20ub24oJ2Nsb3NlZCcsIChldmVudDogYW55KSA9PiB7XG4gICAgICBjb25zdCB6b29tZWQgPSBldmVudC5kZXRhaWwuem9vbS5nZXRab29tZWRJbWFnZSgpO1xuICAgICAgem9vbWVkLnN0eWxlLm9iamVjdEZpdCA9ICcnO1xuICAgIH0pO1xuICB9XG59KTtcblxuZnVuY3Rpb24gaXNDYWxjYWJsZSh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgdmFsdWUuZW5kc1dpdGgoJ3B4JykgfHwgdmFsdWUuZW5kc1dpdGgoJyUnKSB8fCB2YWx1ZS5zdGFydHNXaXRoKCdjYWxjJylcbiAgKTtcbn1cblxuZnVuY3Rpb24gdW5DYWxjKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnY2FsYycpID8gdmFsdWUuc2xpY2UoNCkgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJwb2xhdGUoXG4gIHsgZnJvbSwgdG8gfTogQW5pbWF0ZWRQcm9wLFxuICBwZXJjZW50OiBudW1iZXJcbik6IEFuaW1hdGVkUHJvcFsndG8nXSB7XG4gIGlmIChmcm9tID09PSB0bykgcmV0dXJuIHRvO1xuICBpZiAodHlwZW9mIGZyb20gPT09ICdudW1iZXInICYmIHR5cGVvZiB0byA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gZnJvbSArICh0byAtIGZyb20pICogKHBlcmNlbnQgLyAxMDApO1xuICB9XG4gIGlmICh0eXBlb2YgZnJvbSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHRvID09PSAnc3RyaW5nJykge1xuICAgIGlmIChmcm9tID09PSAnbm9uZScgfHwgdG8gPT09ICdub25lJykgcmV0dXJuIHBlcmNlbnQgPCA1MCA/IGZyb20gOiB0bztcbiAgICBpZiAoZnJvbSA9PT0gJ2F1dG8nIHx8IHRvID09PSAnYXV0bycpIHJldHVybiBwZXJjZW50IDwgNTAgPyBmcm9tIDogdG87XG5cbiAgICBpZiAoZnJvbS5lbmRzV2l0aCgncHgnKSAmJiB0by5lbmRzV2l0aCgncHgnKSkge1xuICAgICAgY29uc3QgZnJvbVB4ID0gcGFyc2VGbG9hdChmcm9tKTtcbiAgICAgIGNvbnN0IHRvUCA9IHBhcnNlRmxvYXQodG8pO1xuICAgICAgcmV0dXJuIHRvUHgoZnJvbVB4ICsgKHRvUCAtIGZyb21QeCkgKiAocGVyY2VudCAvIDEwMCkpO1xuICAgIH1cbiAgICBpZiAoZnJvbS5lbmRzV2l0aCgnJScpICYmIHRvLmVuZHNXaXRoKCclJykpIHtcbiAgICAgIGNvbnN0IGZyb21QeCA9IHBhcnNlRmxvYXQoZnJvbSk7XG4gICAgICBjb25zdCB0b1AgPSBwYXJzZUZsb2F0KHRvKTtcbiAgICAgIHJldHVybiB0b1BlcmNlbnQoZnJvbVB4ICsgKHRvUCAtIGZyb21QeCkgKiAocGVyY2VudCAvIDEwMCkpO1xuICAgIH1cbiAgICBpZiAoaXNDYWxjYWJsZShmcm9tKSAmJiBpc0NhbGNhYmxlKHRvKSkge1xuICAgICAgY29uc3QgZnJvbUNhbGMgPSB1bkNhbGMoZnJvbSk7XG4gICAgICBjb25zdCB0b0NhbGMgPSB1bkNhbGModG8pO1xuICAgICAgcmV0dXJuIGBjYWxjKCR7ZnJvbUNhbGN9ICsgKCR7dG9DYWxjfSAtICR7ZnJvbUNhbGN9KSAqICR7cGVyY2VudCAvIDEwMH0pYDtcbiAgICB9XG5cbiAgICAvLyBuZWVkZWQgP1xuICAgIGlmIChmcm9tLnN0YXJ0c1dpdGgoJ3JnYicpICYmIHRvLnN0YXJ0c1dpdGgoJ3JnYicpKSB7XG4gICAgICBjb25zdCBmcm9tQ29sb3IgPSBmcm9tLm1hdGNoKC9cXGQrL2cpIS5tYXAoTnVtYmVyKTtcbiAgICAgIGNvbnN0IHRvQ29sb3IgPSB0by5tYXRjaCgvXFxkKy9nKSEubWFwKE51bWJlcik7XG4gICAgICBjb25zdCBjb2xvciA9IGZyb21Db2xvci5tYXAoXG4gICAgICAgIChmcm9tLCBpKSA9PiBmcm9tICsgKHRvQ29sb3JbaV0gLSBmcm9tKSAqIChwZXJjZW50IC8gMTAwKVxuICAgICAgKTtcbiAgICAgIHJldHVybiBgcmdiKCR7Y29sb3Iuam9pbignLCcpfSlgO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGVyY2VudCA8IDUwID8gZnJvbSA6IHRvO1xufVxuXG5mdW5jdGlvbiBnZXREaXN0YW5jZShcbiAgc3RhcnQ6IE1vdXNlRXZlbnQsXG4gIGVuZDogTW91c2VFdmVudFxuKTogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgZGlzdDogbnVtYmVyIH0ge1xuICBjb25zdCB4ID0gZW5kLmNsaWVudFggLSBzdGFydC5jbGllbnRYO1xuICBjb25zdCB5ID0gZW5kLmNsaWVudFkgLSBzdGFydC5jbGllbnRZO1xuICByZXR1cm4geyB4LCB5LCBkaXN0OiBNYXRoLnNxcnQoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSkgfTtcbn1cblxub25Db25uZWN0ZWQoJ1tkYXRhLWJvdW5kLWNoYXJhY3RlcnNdJywgKGUpID0+IHtcbiAgY29uc3QgaGFuZGxlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBpZCA9IGUuZ2V0QXR0cmlidXRlKCdkYXRhLWJvdW5kLWNoYXJhY3RlcnMnKSE7XG4gICAgY29uc3QgY2hhcmFjdGVycyA9IHRvU3RyaW5nKHJlc29sdmUoYWxsVmFyaWFibGVzKClbaWRdKSk7XG4gICAgaWYgKGNoYXJhY3RlcnMgIT09IGUudGV4dENvbnRlbnQpIGUudGV4dENvbnRlbnQgPSBjaGFyYWN0ZXJzO1xuICB9O1xuICBoYW5kbGVyKCk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Yydy1zZXQtdmFyaWFibGUnLCBoYW5kbGVyKTtcbiAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Yydy1zZXQtdmFyaWFibGUnLCBoYW5kbGVyKTtcbn0pO1xuXG5vbkNvbm5lY3RlZCgnW2RhdGEtYm91bmQtdmlzaWJsZV0nLCAoZSkgPT4ge1xuICBjb25zdCBoYW5kbGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGlkID0gZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYm91bmQtdmlzaWJsZScpITtcbiAgICBjb25zdCB2aXNpYmxlID0gdG9TdHJpbmcocmVzb2x2ZShhbGxWYXJpYWJsZXMoKVtpZF0pKTtcbiAgICBpZiAodmlzaWJsZSAhPT0gdW5kZWZpbmVkKSBlLnNldEF0dHJpYnV0ZSgnZGF0YS12aXNpYmxlJywgdmlzaWJsZSk7XG4gIH07XG4gIGhhbmRsZXIoKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZjJ3LXNldC12YXJpYWJsZScsIGhhbmRsZXIpO1xuICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZjJ3LXNldC12YXJpYWJsZScsIGhhbmRsZXIpO1xufSk7XG5cbmNvbnN0IGFwcGVhck9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKFxuICAoZW50cmllcywgb2JzZXJ2ZXIpID0+IHtcbiAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKGVudHJ5LnRhcmdldCk7XG4gICAgICAgIGVudHJ5LnRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYXBwZWFyJykpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLyAxMCUgb2YgdGhlIGVsZW1lbnQgbXVzdCBiZSB2aXNpYmxlXG4gIHsgdGhyZXNob2xkOiAwLjEgfVxuKTtcblxuLy8gRml4IHNjcm9sbCB0byBpZCBieSBpbnNwZWN0aW5nIGluamVjdGVkIGZpeGVkIGlkc1xuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgY29uc3QgaGFzaElkUHJlZml4ID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSk7XG4gIC8vIG1hdGNoaW5nICNmb28gb3IgI2Zvb18xXG4gIGNvbnN0IGhhc2hSRSA9IG5ldyBSZWdFeHAoaGFzaElkUHJlZml4ICsgJyhfXFxcXGQrKT8kJyk7XG4gIGZvciAoY29uc3QgZSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbaWRePVwiJHtoYXNoSWRQcmVmaXh9XCJdYCkpXG4gICAgaWYgKGhhc2hSRS50ZXN0KGUuaWQpICYmIGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ID4gMClcbiAgICAgIHJldHVybiBlLnNjcm9sbEludG9WaWV3KCk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTyxXQUFTLFFBQVEsR0FBVyxRQUF3QjtBQUN6RCxXQUFPLEtBQUssTUFBTSxJQUFJLE1BQU0sSUFBSTtBQUFBLEVBQ2xDOzs7QUNGZSxXQUFSLE9BQXdCLEtBQUssT0FBTyxNQUFNLE9BQU87QUFDdkQsVUFBTSxhQUFhLE9BQU8sU0FBUyxLQUFLLFNBQVMsRUFBRSxTQUFTLEdBQUc7QUFFL0QsUUFBSSxPQUFPLFFBQVEsVUFBVTtBQUM1QixPQUFDLEtBQUssT0FBTyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0saUJBQWlCLEVBQUUsSUFBSSxlQUFhLE9BQU8sU0FBUyxDQUFDO0FBQUEsSUFDNUYsV0FBVyxVQUFVLFFBQVc7QUFDL0IsY0FBUSxPQUFPLFdBQVcsS0FBSztBQUFBLElBQ2hDO0FBRUEsUUFBSSxPQUFPLFFBQVEsWUFDbEIsT0FBTyxVQUFVLFlBQ2pCLE9BQU8sU0FBUyxZQUNoQixNQUFNLE9BQ04sUUFBUSxPQUNSLE9BQU8sS0FDTjtBQUNELFlBQU0sSUFBSSxVQUFVLGtDQUFrQztBQUFBLElBQ3ZEO0FBRUEsUUFBSSxPQUFPLFVBQVUsVUFBVTtBQUM5QixVQUFJLENBQUMsYUFBYSxTQUFTLEtBQUssU0FBUyxHQUFHO0FBQzNDLGdCQUFRLEtBQUssTUFBTSxNQUFN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QUM1QyxVQUFNLFVBQVUsTUFBWTtBQUMxQixZQUFNLEtBQUssRUFBRSxhQUFhLHVCQUF1QjtBQUNqRCxZQUFNLGFBQWEsU0FBUyxRQUFRLGFBQWEsRUFBRSxHQUFHLENBQUM7QUFDdkQsVUFBSSxlQUFlLEVBQUU7QUFBYSxVQUFFLGNBQWM7QUFBQSxJQUNwRDtBQUNBLFlBQVE7QUFDUixhQUFTLGlCQUFpQixvQkFBb0IsT0FBTztBQUNyRCxXQUFPLE1BQU0sU0FBUyxvQkFBb0Isb0JBQW9CLE9BQU87QUFBQSxFQUN2RSxDQUFDO0FBRUQsY0FBWSx3QkFBd0IsQ0FBQyxNQUFNO0FBQ3pDLFVBQU0sVUFBVSxNQUFZO0FBQzFCLFlBQU0sS0FBSyxFQUFFLGFBQWEsb0JBQW9CO0FBQzlDLFlBQU0sVUFBVSxTQUFTLFFBQVEsYUFBYSxFQUFFLEdBQUcsQ0FBQztBQUNwRCxVQUFJLFlBQVk7QUFBVyxVQUFFLGFBQWEsZ0JBQWdCLE9BQU87QUFBQSxJQUNuRTtBQUNBLFlBQVE7QUFDUixhQUFTLGlCQUFpQixvQkFBb0IsT0FBTztBQUNyRCxXQUFPLE1BQU0sU0FBUyxvQkFBb0Isb0JBQW9CLE9BQU87QUFBQSxFQUN2RSxDQUFDO0FBRUQsTUFBTSxpQkFBaUIsSUFBSTtBQUFBLElBQ3pCLENBQUMsU0FBUyxhQUFhO0FBQ3JCLGNBQVEsUUFBUSxDQUFDLFVBQVU7QUFDekIsWUFBSSxNQUFNLGdCQUFnQjtBQUN4QixtQkFBUyxVQUFVLE1BQU0sTUFBTTtBQUMvQixnQkFBTSxPQUFPLGNBQWMsSUFBSSxZQUFZLFFBQVEsQ0FBQztBQUFBLFFBQ3REO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBRUEsRUFBRSxXQUFXLElBQUk7QUFBQSxFQUNuQjtBQUdBLG1CQUFpQixRQUFRLE1BQU07QUFDN0IsVUFBTSxlQUFlLE9BQU8sU0FBUyxLQUFLLE1BQU0sQ0FBQztBQUVqRCxVQUFNLFNBQVMsSUFBSSxPQUFPLGVBQWUsV0FBVztBQUNwRCxlQUFXLEtBQUssU0FBUyxpQkFBaUIsU0FBUyxnQkFBZ0I7QUFDakUsVUFBSSxPQUFPLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxTQUFTO0FBQzFELGVBQU8sRUFBRSxlQUFlO0FBQUEsRUFDOUIsQ0FBQzsiLAogICJuYW1lcyI6IFsiZW1pdCIsICJyZXNvbHZlIiwgIm5hbWUiLCAiZW1pdCIsICJvbmNlIiwgInJ1biIsICJ0b1J1biIsICJlbHQiLCAicmVzb2x2ZSIsICJlbHQiLCAiZHVyYXRpb24iLCAicCIsICJvdmVybGF5UG9zaXRpb25UeXBlIiwgInRyYW5zaXRpb24iLCAiYm91bmQiLCAidHJpZ2dlciIsICJlIiwgImkiLCAiYWN0aW9uIiwgInJ1biIsICJvbmNlIiwgIl9hIiwgIl9iIiwgIm92ZXJsYXkiLCAiYW5pbWF0aW9ucyIsICJ0cmFuc2l0aW9uIiwgImR1cmF0aW9uIiwgImVsdCIsICJtb2RhbCIsICJkaXN0WCIsICJkaXN0WSIsICJmcm9tIl0KfQo=
