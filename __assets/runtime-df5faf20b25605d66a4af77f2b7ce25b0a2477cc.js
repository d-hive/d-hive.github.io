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
  function once(run2) {
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
          const revert = once(run2(e));
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
      const close = once((_, i) => {
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
          revert = once(run2(e));
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
  var collectionModeBpsSorted = Object.fromEntries(
    Object.entries(collectionModeBps()).map(([k, v]) => [
      k,
      Object.entries(v).map(([name, { minWidth }]) => ({ name, minWidth }))
    ])
  );
  function updateCollectionModes() {
    var _a;
    const width = ((_a = window.visualViewport) == null ? void 0 : _a.width) || window.innerWidth;
    for (const [collectionName, breakpoints] of Object.entries(
      collectionModeBpsSorted
    )) {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vdXRpbHMvc3JjL251bWJlcnMudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JnYi1oZXhANC4wLjEvbm9kZV9tb2R1bGVzL3JnYi1oZXgvaW5kZXguanMiLCAiLi4vdXRpbHMvc3JjL2FycmF5LnRzIiwgIi4uL3V0aWxzL3NyYy9hc3NlcnQudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvdmFyaWFibGVzLnRzIiwgIi4uL2ZpZ21hLXRvLWh0bWwvc3JjL2hlbHBlcnMudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvbWFwcGluZy90cmlnZ2Vycy50cyIsICIuLi91dGlscy9zcmMvZnVuY3Rpb25zLnRzIiwgInNyYy9saWZlY3ljbGUudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvbWFwcGluZy91dGlscy50cyIsICJzcmMvcnVudGltZS92aWRlb3MudHMiLCAiLi4vdXRpbHMvc3JjL25hdmlnYXRvci50cyIsICIuLi91dGlscy9zcmMvc3R5bGVzL2luZGV4LnRzIiwgInNyYy9ydW50aW1lL2FuaW1hdG9yLnRzIiwgInNyYy9ydW50aW1lL2FuaW1hdGlvbnMudHMiLCAic3JjL3J1bnRpbWVfZW1iZWQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBmdW5jdGlvbiByb3VuZFRvKHY6IG51bWJlciwgZmFjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5yb3VuZCh2ICogZmFjdG9yKSAvIGZhY3Rvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsc0Vwc2lsb24oYTogbnVtYmVyLCBiOiBudW1iZXIsIGVwczogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBNYXRoLmFicyhhIC0gYikgPCBlcHM7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmdiSGV4KHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKSB7XG5cdGNvbnN0IGlzUGVyY2VudCA9IChyZWQgKyAoYWxwaGEgfHwgJycpKS50b1N0cmluZygpLmluY2x1ZGVzKCclJyk7XG5cblx0aWYgKHR5cGVvZiByZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0W3JlZCwgZ3JlZW4sIGJsdWUsIGFscGhhXSA9IHJlZC5tYXRjaCgvKDA/XFwuP1xcZCspJT9cXGIvZykubWFwKGNvbXBvbmVudCA9PiBOdW1iZXIoY29tcG9uZW50KSk7XG5cdH0gZWxzZSBpZiAoYWxwaGEgIT09IHVuZGVmaW5lZCkge1xuXHRcdGFscGhhID0gTnVtYmVyLnBhcnNlRmxvYXQoYWxwaGEpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiByZWQgIT09ICdudW1iZXInIHx8XG5cdFx0dHlwZW9mIGdyZWVuICE9PSAnbnVtYmVyJyB8fFxuXHRcdHR5cGVvZiBibHVlICE9PSAnbnVtYmVyJyB8fFxuXHRcdHJlZCA+IDI1NSB8fFxuXHRcdGdyZWVuID4gMjU1IHx8XG5cdFx0Ymx1ZSA+IDI1NVxuXHQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCB0aHJlZSBudW1iZXJzIGJlbG93IDI1NicpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBhbHBoYSA9PT0gJ251bWJlcicpIHtcblx0XHRpZiAoIWlzUGVyY2VudCAmJiBhbHBoYSA+PSAwICYmIGFscGhhIDw9IDEpIHtcblx0XHRcdGFscGhhID0gTWF0aC5yb3VuZCgyNTUgKiBhbHBoYSk7XG5cdFx0fSBlbHNlIGlmIChpc1BlcmNlbnQgJiYgYWxwaGEgPj0gMCAmJiBhbHBoYSA8PSAxMDApIHtcblx0XHRcdGFscGhhID0gTWF0aC5yb3VuZCgyNTUgKiBhbHBoYSAvIDEwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIGFscGhhIHZhbHVlICgke2FscGhhfSkgYXMgYSBmcmFjdGlvbiBvciBwZXJjZW50YWdlYCk7XG5cdFx0fVxuXG5cdFx0YWxwaGEgPSAoYWxwaGEgfCAxIDw8IDgpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1taXhlZC1vcGVyYXRvcnNcblx0fSBlbHNlIHtcblx0XHRhbHBoYSA9ICcnO1xuXHR9XG5cblx0Ly8gVE9ETzogUmVtb3ZlIHRoaXMgaWdub3JlIGNvbW1lbnQuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1taXhlZC1vcGVyYXRvcnNcblx0cmV0dXJuICgoYmx1ZSB8IGdyZWVuIDw8IDggfCByZWQgPDwgMTYpIHwgMSA8PCAyNCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpICsgYWxwaGE7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHVuaXF1ZU9yTnVsbDxUPihhcnI6IFRbXSk6IFQgfCB1bmRlZmluZWQge1xuICBpZiAoYXJyLmxlbmd0aCkge1xuICAgIGNvbnN0IGJhc2UgPSBhcnJbMF07XG4gICAgcmV0dXJuIGFyci5zbGljZSgxKS5ldmVyeSgoaXQpID0+IGl0ID09PSBiYXNlKSA/IGJhc2UgOiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckVtcHR5PFQ+KGFycjogKFQgfCB1bmRlZmluZWQgfCBudWxsIHwgdm9pZClbXSk6IFRbXSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKG5vdEVtcHR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdEVtcHR5PFRWYWx1ZT4oXG4gIHZhbHVlOiBUVmFsdWUgfCBudWxsIHwgdW5kZWZpbmVkIHwgdm9pZFxuKTogdmFsdWUgaXMgVFZhbHVlIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQ7XG59XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80MzA1MzgwMy82MTU5MDNcbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW48VD4ob3B0aW9uczogVFtdW10pOiBUW11bXSB7XG4gIHJldHVybiAob3B0aW9ucyBhcyBhbnkpLnJlZHVjZShcbiAgICAoYTogYW55LCBiOiBhbnkpID0+IGEuZmxhdE1hcCgoZDogYW55KSA9PiBiLm1hcCgoZTogYW55KSA9PiBbLi4uZCwgZV0pKSxcbiAgICBbW11dXG4gICkgYXMgVFtdW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRW50cmllc011bHRpPFQ+KGxpc3Q6IFtzdHJpbmcsIFRdW10pOiBSZWNvcmQ8c3RyaW5nLCBUW10+IHtcbiAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBUW10+ID0ge307XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIGxpc3QpIHtcbiAgICBpZiAoIShrIGluIHJlc3VsdCkpIHJlc3VsdFtrXSA9IFtdO1xuICAgIHJlc3VsdFtrXS5wdXNoKHYpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnRyaWVzVG9NdWx0aU1hcDxLLCBWPihsaXN0OiBbSywgVl1bXSk6IE1hcDxLLCBWW10+IHtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IE1hcDxLLCBWW10+KCk7XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIGxpc3QpIHtcbiAgICBjb25zdCBhcnIgPSByZXN1bHQuZ2V0KGspO1xuICAgIGlmIChhcnIpIGFyci5wdXNoKHYpO1xuICAgIGVsc2UgcmVzdWx0LnNldChrLCBbdl0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cGU8VD4oYXJyOiBUW10pOiBUW10ge1xuICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFycikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVkdXBlSXRlcmFibGU8VD4oYXJyOiBUW10pOiBJdGVyYWJsZTxUPiB7XG4gIHJldHVybiBuZXcgU2V0KGFycik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cGVkS2V5cyhcbiAgYTogb2JqZWN0IHwgdW5kZWZpbmVkLFxuICBiOiBvYmplY3QgfCB1bmRlZmluZWRcbik6IEl0ZXJhYmxlPHN0cmluZz4ge1xuICBpZiAoIWEpIHtcbiAgICBpZiAoIWIpIHJldHVybiBbXTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoYik7XG4gIH1cbiAgaWYgKCFiKSByZXR1cm4gT2JqZWN0LmtleXMoYSk7XG4gIHJldHVybiBkZWR1cGVJdGVyYWJsZShbLi4uT2JqZWN0LmtleXMoYSksIC4uLk9iamVjdC5rZXlzKGIpXSk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE5vdEhhcHBlbih0eHQ6IHN0cmluZyk6IHZvaWQge1xuICBjb25zb2xlLndhcm4odHh0KTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgZGVidWdnZXI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE5vdEhhcHBlbkVycm9yKHR4dDogc3RyaW5nKTogRXJyb3Ige1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBjb25zb2xlLmVycm9yKHR4dCk7XG4gICAgZGVidWdnZXI7XG4gIH1cbiAgcmV0dXJuIG5ldyBFcnJvcih0eHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0VGhhdChjaGVjazogKCkgPT4gYm9vbGVhbiwgdHh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKCFjaGVjaygpKSB7XG4gICAgc2hvdWxkTm90SGFwcGVuKHR4dCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgdHlwZSB7IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0IH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBydW5uaW5nSW5QbHVnaW5Db2RlIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXV0aWxzL3V0aWxzJztcbmltcG9ydCB7IEtleWVkRXJyb3IgfSBmcm9tICcuL3dhcm5pbmdzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFZhcmlhYmxlQnlJZEFzeW5jKFxuICBjdHg6IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0IHwgdW5kZWZpbmVkLFxuICBpZDogc3RyaW5nXG4pOiBQcm9taXNlPFZhcmlhYmxlIHwgdW5kZWZpbmVkPiB7XG4gIGlmICghcnVubmluZ0luUGx1Z2luQ29kZSkgcmV0dXJuO1xuICBjb25zdCB2ID0gYXdhaXQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQnlJZEFzeW5jKGlkKTtcbiAgaWYgKCF2KSB0aHJvdyBuZXcgS2V5ZWRFcnJvcignVkFSSUFCTEVTJywgJ01pc3NpbmcgdmFyaWFibGUgJyArIGlkKTtcbiAgdHJ5IHtcbiAgICB2Lm5hbWU7XG4gICAgcmV0dXJuIHY7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEtleWVkRXJyb3IoJ1ZBUklBQkxFUycsICdNaXNzaW5nIHZhcmlhYmxlICcgKyBpZCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyaWFibGUoXG4gIHZhcmlhYmxlSWQ6IHN0cmluZyxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dCB8IHVuZGVmaW5lZFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGB2YXIoJHtjb2xsZWN0VmFyaWFibGVJZCh2YXJpYWJsZUlkLCBjdHgpfSlgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29sbGVjdFZhcmlhYmxlSWQoXG4gIHZhcmlhYmxlSWQ6IHN0cmluZyxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dCB8IHVuZGVmaW5lZFxuKTogc3RyaW5nIHtcbiAgaWYgKGN0eCAmJiAhY3R4LnZhcmlhYmxlcy5oYXModmFyaWFibGVJZCkpIGN0eC52YXJpYWJsZXMuc2V0KHZhcmlhYmxlSWQsIHt9KTtcbiAgcmV0dXJuIGAtLSR7dmFyaWFibGVJZH1gO1xufVxuXG5jb25zdCBTQU5JVElaRV9SRUdFWFAgPSAvW14wLTlhLXpBLVpdKy9nO1xuXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVDb2xsZWN0aW9uTW9kZU5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQ29sbGVjdGlvbk5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKFNBTklUSVpFX1JFR0VYUCwgJy0nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplVmFyaWFibGVOYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBuYW1lLnJlcGxhY2UoU0FOSVRJWkVfUkVHRVhQLCAnLScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9WYXJpYWJsZU5hbWUodmFyaWFibGU6IFZhcmlhYmxlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAtLSR7c2FuaXRpemVWYXJpYWJsZU5hbWUodmFyaWFibGUubmFtZSl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRGF0YUF0dHJpYnV0ZSh2YXJpYWJsZTogVmFyaWFibGUpOiBzdHJpbmcge1xuICByZXR1cm4gYGRhdGEke3RvVmFyaWFibGVOYW1lKHZhcmlhYmxlKS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FsaWFzKHY6IFZhcmlhYmxlVmFsdWVXaXRoRXhwcmVzc2lvbik6IHYgaXMgVmFyaWFibGVBbGlhcyB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHYgPT09ICdvYmplY3QnICYmICh2IGFzIFZhcmlhYmxlQWxpYXMpLnR5cGUgPT09ICdWQVJJQUJMRV9BTElBUydcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFZhcmlhYmxlRGF0YVRvRjJ3KFxuICBkYXRhOiBWYXJpYWJsZURhdGEsXG4gIGN0eDogQ29sbGVjdG9yTWFwcGluZ0NvbnRleHRcbik6IFZhcmlhYmxlRGF0YSB7XG4gIGNvbnN0IHJldCA9IHsgLi4uZGF0YSB9O1xuICBjb25zdCB7IHZhbHVlIH0gPSByZXQ7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKGlzQWxpYXModmFsdWUpKSB7XG4gICAgICByZXQudmFsdWUgPSBtYXBWYXJpYWJsZUFsaWFzVG9GMncodmFsdWUsIGN0eCk7XG4gICAgfSBlbHNlIGlmICgnZXhwcmVzc2lvbkFyZ3VtZW50cycgaW4gdmFsdWUpIHtcbiAgICAgIHJldC52YWx1ZSA9IHtcbiAgICAgICAgZXhwcmVzc2lvbkZ1bmN0aW9uOiB2YWx1ZS5leHByZXNzaW9uRnVuY3Rpb24sXG4gICAgICAgIGV4cHJlc3Npb25Bcmd1bWVudHM6IHZhbHVlLmV4cHJlc3Npb25Bcmd1bWVudHMubWFwKChhKSA9PlxuICAgICAgICAgIG1hcFZhcmlhYmxlRGF0YVRvRjJ3KGEsIGN0eClcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldC52YWx1ZSA9IHsgLi4udmFsdWUgfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFZhcmlhYmxlQWxpYXNUb0YydyhcbiAgZGF0YTogVmFyaWFibGVBbGlhcyxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dFxuKTogVmFyaWFibGVBbGlhcyB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1ZBUklBQkxFX0FMSUFTJyxcbiAgICBpZDogY29sbGVjdFZhcmlhYmxlSWQoZGF0YS5pZCwgY3R4KSxcbiAgfTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7XG4gIFJlc3RCYXNlTm9kZSxcbiAgUmVzdFBhaW50LFxuICBSZXN0U2NlbmVOb2RlLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL2ZpZ21hLnJlc3QudHlwaW5ncyc7XG5pbXBvcnQgeyByb3VuZFRvIH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL3NyYy9udW1iZXJzJztcbmltcG9ydCByZ2JIZXggZnJvbSAncmdiLWhleCc7XG5pbXBvcnQge1xuICBGMndOYW1lc3BhY2UsXG4gIHR5cGUgRjJ3RGF0YSxcbiAgRjJ3RGF0YUtleSxcbn0gZnJvbSAnQGRpdnJpb3RzL3N0b3J5LXRvLWZpZ21hL3R5cGVzL25vZGVzJztcbmltcG9ydCB0eXBlIHtcbiAgQWR2RjJ3RGF0YSxcbiAgQmFzZUYyd0FjdGlvbixcbiAgSHRtbEVsZW1lbnQsXG4gIEh0bWxOb2RlLFxuICBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIFdyaXRhYmxlVmVjdG9yLFxuICBBbGxvd2VkUHJvcGVydGllcyxcbiAgVHlwZWRTdHlsZXMsXG4gIE5vZGVQcm9wcyxcbiAgQ3NzVmFsdWVWYXIsXG4gIENvbGxlY3Rvck1hcHBpbmdDb250ZXh0LFxuICBNZWRpYUNhbGxzaXRlLFxuICBET01GMndBY3Rpb24sXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgaXNBbGlhcywgdG9WYXJpYWJsZSB9IGZyb20gJy4vdmFyaWFibGVzJztcbmltcG9ydCB7IHNob3VsZE5vdEhhcHBlbiB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9hc3NlcnQnO1xuaW1wb3J0IHsgZ2V0U2hhcmVkUGx1Z2luRGF0YU9iaiB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy9wbHVnaW5EYXRhJztcbmltcG9ydCB0eXBlIHsgVmFsaWRWYXJpYW50UHJvcGVydGllcyB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy91dGlscyc7XG5pbXBvcnQgeyBjc3NWYWx1ZVRvU3RyaW5nIH0gZnJvbSAnLi9jc3NWYWx1ZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2l6ZShcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSxcbiAgc2NhbGUgPSAxXG4pOiBXcml0YWJsZVZlY3RvciB7XG4gIHJldHVybiAnc2l6ZScgaW4gbm9kZVxuICAgID8ge1xuICAgICAgICB4OiBub2RlLnNpemUhLnggKiBzY2FsZSxcbiAgICAgICAgeTogbm9kZS5zaXplIS55ICogc2NhbGUsXG4gICAgICB9XG4gICAgOiB7XG4gICAgICAgIHg6IChub2RlIGFzIFNjZW5lTm9kZSkud2lkdGggKiBzY2FsZSxcbiAgICAgICAgeTogKG5vZGUgYXMgU2NlbmVOb2RlKS5oZWlnaHQgKiBzY2FsZSxcbiAgICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPZmZzZXQoXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUsXG4gIHNjYWxlID0gMVxuKTogV3JpdGFibGVWZWN0b3Ige1xuICByZXR1cm4gJ3gnIGluIG5vZGVcbiAgICA/IHsgeDogbm9kZS54ICogc2NhbGUsIHk6IG5vZGUueSAqIHNjYWxlIH1cbiAgICA6IHtcbiAgICAgICAgeDogKG5vZGUgYXMgUmVzdFNjZW5lTm9kZSkucmVsYXRpdmVUcmFuc2Zvcm0hWzBdWzJdICogc2NhbGUsXG4gICAgICAgIHk6IChub2RlIGFzIFJlc3RTY2VuZU5vZGUpLnJlbGF0aXZlVHJhbnNmb3JtIVsxXVsyXSAqIHNjYWxlLFxuICAgICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvbGlkUGFpbnRUb1JnYmEoY29sb3I6IFNvbGlkUGFpbnQpOiBSR0JBIHtcbiAgcmV0dXJuIGZpZ21hUmdiYVRvQ3NzUmdiYSh7IC4uLmNvbG9yLmNvbG9yLCBhOiBjb2xvci5vcGFjaXR5ID8/IDEgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWdtYVJnYmFUb1N0cmluZyhyZ2JhOiBSR0JBKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJnYmFUb1N0cmluZyhmaWdtYVJnYmFUb0Nzc1JnYmEocmdiYSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlnbWFSZ2JhT3JWYXJUb1N0cmluZyhcbiAgcmdiYTogUkdCQSxcbiAgdmFyaWFibGU6IFZhcmlhYmxlQWxpYXMgfCB1bmRlZmluZWQsXG4gIGN0eDogQ29sbGVjdG9yTWFwcGluZ0NvbnRleHRcbik6IHN0cmluZyB7XG4gIHJldHVybiB2YXJpYWJsZSA/IHRvVmFyaWFibGUodmFyaWFibGUuaWQsIGN0eCkgOiBmaWdtYVJnYmFUb1N0cmluZyhyZ2JhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYmFUb1N0cmluZyhyZ2JhOiBSR0JBIHwgUkdCKTogc3RyaW5nIHtcbiAgaWYgKCdhJyBpbiByZ2JhKSB7XG4gICAgY29uc3QgYSA9IHJvdW5kVG8ocmdiYS5hLCAxMDApO1xuICAgIGlmIChhICE9PSAxKSByZXR1cm4gYHJnYmEoJHtyZ2JhLnJ9LCR7cmdiYS5nfSwke3JnYmEuYn0sJHthfSlgO1xuICB9XG4gIGNvbnN0IGhleCA9IHJnYkhleChyZ2JhLnIsIHJnYmEuZywgcmdiYS5iKTtcbiAgaWYgKGhleFswXSA9PT0gaGV4WzFdICYmIGhleFsyXSA9PT0gaGV4WzNdICYmIGhleFs0XSA9PT0gaGV4WzVdKSB7XG4gICAgcmV0dXJuIGAjJHtoZXhbMF19JHtoZXhbMl19JHtoZXhbNF19YDtcbiAgfVxuICByZXR1cm4gYCMke2hleH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlnbWFSZ2JhVG9Dc3NSZ2JhKGNvbG9yOiBSR0JBIHwgUkdCKTogUkdCQSB7XG4gIGNvbnN0IHsgciwgZywgYiwgYSA9IDEgfSA9IGNvbG9yIGFzIFJHQkE7XG4gIHJldHVybiB7XG4gICAgcjogcm91bmRUbyhyICogMjU1LCAxKSxcbiAgICBnOiByb3VuZFRvKGcgKiAyNTUsIDEpLFxuICAgIGI6IHJvdW5kVG8oYiAqIDI1NSwgMSksXG4gICAgYSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ3NzUHgoXG4gIHZhbHVlOiBudW1iZXIsXG4gIHJvdW5kOiBudW1iZXIsXG4gIHZhcmlhYmxlOiBWYXJpYWJsZUFsaWFzIHwgdW5kZWZpbmVkLFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhcmlhYmxlXG4gICAgPyBgY2FsYygxcHggKiAke3RvVmFyaWFibGUodmFyaWFibGUuaWQsIGN0eCl9KWBcbiAgICA6IHRvUHgocm91bmRUbyh2YWx1ZSwgcm91bmQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29sb3JPclZhcmlhYmxlKFxuICBpdDogU29saWRQYWludCxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGl0LmJvdW5kVmFyaWFibGVzPy5jb2xvclxuICAgID8gdG9WYXJpYWJsZShpdC5ib3VuZFZhcmlhYmxlcz8uY29sb3IuaWQsIGN0eClcbiAgICA6IHJnYmFUb1N0cmluZyhzb2xpZFBhaW50VG9SZ2JhKGl0KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1B4KHY6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBgJHtyb3VuZFRvKHYsIDEwKX1weGA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1BlcmNlbnQodjogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke3JvdW5kVG8odiwgMTApfSVgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVUb1N0cmluZyh2OiBWYXJpYWJsZVZhbHVlKTogc3RyaW5nIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBpZiAoaXNBbGlhcyh2KSkge1xuICAgICAgICByZXR1cm4gYHZhcigke3YuaWR9KWA7XG4gICAgICB9XG4gICAgICBpZiAoJ3InIGluIHYpIHtcbiAgICAgICAgcmV0dXJuIHJnYmFUb1N0cmluZyhmaWdtYVJnYmFUb0Nzc1JnYmEodikpO1xuICAgICAgfVxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIFN0cmluZyh2KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVJZChpZDogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHtcbiAgaWQgPSBTdHJpbmcoaWQpO1xuICBsZXQgcmV0ID0gaWQubWF0Y2goL1teMC05YS16QS1aXy1dLykgPyBpZC5yZXBsYWNlKC9bXjAtOWEtekEtWl0rL2csICdfJykgOiBpZDtcbiAgaWYgKHJldC5tYXRjaCgvXihbMC05XXwtLXwtWzAtOV18LSQpLykpIHtcbiAgICByZXQgPSAnXycgKyByZXQ7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVucmljaDxUIGV4dGVuZHMgRjJ3RGF0YT4oXG4gIGVsOiBULFxuICB7IHRhZywgdW5zYWZlSHRtbCwgYXR0ciwgY3NzLCBzdHlsZXMgfTogQWR2RjJ3RGF0YVxuKTogVCB7XG4gIGlmICh0YWcpIGVsLnRhZyA9IHRhZztcbiAgaWYgKHVuc2FmZUh0bWwpIGVsLnVuc2FmZUh0bWwgPSB1bnNhZmVIdG1sO1xuICBpZiAoc3R5bGVzKSB7XG4gICAgT2JqZWN0LmFzc2lnbigoZWwuc3R5bGVzIHx8PSB7fSksIHN0eWxlcyk7XG4gIH1cbiAgaWYgKGF0dHIpIHtcbiAgICBPYmplY3QuYXNzaWduKChlbC5hdHRyIHx8PSB7fSksIGF0dHIpO1xuICB9XG4gIGlmIChjc3MpIHtcbiAgICAoZWwuY3NzIHx8PSBbXSkucHVzaCguLi5jc3MpO1xuICB9XG4gIHJldHVybiBlbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc05vUGFyZW50V2l0aFRhZyhcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIHRhZzogc3RyaW5nXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIGN0eC5wYXJlbnRzLmV2ZXJ5KChpdCkgPT4gaXQudGFnICE9PSB0YWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGFyZW50V2l0aFRhZyhcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIHRhZzogc3RyaW5nXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuICEhY3R4LnBhcmVudHMuZmluZCgoaXQpID0+IGl0LnRhZyA9PT0gdGFnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1BhcmVudFdpdGhUYWdSRShcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIHRhZ1JFOiBSZWdFeHBcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gISFjdHgucGFyZW50cy5maW5kKChpdCkgPT4gdGFnUkUudGVzdChpdC50YWcpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZGVzVG9TaW1wbGlmaWVkPFQ+KFxuICB0b3A6IFQsXG4gIHJpZ2h0OiBULFxuICBib3R0b206IFQsXG4gIGxlZnQ6IFRcbik6IFRbXSB7XG4gIGlmIChsZWZ0ID09PSByaWdodCkge1xuICAgIGlmICh0b3AgPT09IGJvdHRvbSkge1xuICAgICAgaWYgKHRvcCA9PT0gbGVmdCkge1xuICAgICAgICByZXR1cm4gW3RvcF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW3RvcCwgbGVmdF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbdG9wLCBsZWZ0LCBib3R0b21dO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdF07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcm5lcnNUb1NpbXBsaWZpZWQ8VD4oXG4gIHRvcGxlZnQ6IFQsXG4gIHRvcHJpZ2h0OiBULFxuICBib3R0b21yaWdodDogVCxcbiAgYm90dG9tbGVmdDogVFxuKTogVFtdIHtcbiAgcmV0dXJuIHNpZGVzVG9TaW1wbGlmaWVkKHRvcGxlZnQsIHRvcHJpZ2h0LCBib3R0b21yaWdodCwgYm90dG9tbGVmdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdHlsZXMobm9kZTogSHRtbEVsZW1lbnQsIHZhbHVlczogVHlwZWRTdHlsZXMpOiB2b2lkIHtcbiAgT2JqZWN0LmVudHJpZXModmFsdWVzKS5mb3JFYWNoKChbaywgdl0pID0+XG4gICAgc2V0U3R5bGUobm9kZSwgayBhcyBBbGxvd2VkUHJvcGVydGllcywgdilcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFN0eWxlKFxuICBub2RlOiBIdG1sRWxlbWVudCxcbiAga2V5OiBBbGxvd2VkUHJvcGVydGllcyxcbiAgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZFxuKTogdm9pZCB7XG4gIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgbWFwID0gKG5vZGUuc3R5bGVzIHx8PSB7fSk7XG4gICAgbWFwW2tleV0gPSBTdHJpbmcodmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRTdHlsZShcbiAgbm9kZTogSHRtbEVsZW1lbnQsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZXM6IHN0cmluZ1tdLFxuICBzZXBhcmF0b3IgPSAnICdcbik6IHZvaWQge1xuICBpZiAodmFsdWVzLmxlbmd0aCkge1xuICAgIGNvbnN0IHN0eWxlcyA9IChub2RlLnN0eWxlcyA/Pz0ge30pO1xuICAgIGNvbnN0IHYgPSB2YWx1ZXMuam9pbihzZXBhcmF0b3IpO1xuICAgIGlmIChzdHlsZXNba2V5XSkge1xuICAgICAgc3R5bGVzW2tleV0gKz0gc2VwYXJhdG9yICsgdjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzW2tleV0gPSB2O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkTWVkaWFDYWxsc2l0ZShcbiAgbm9kZTogSHRtbEVsZW1lbnQsXG4gIC4uLmNzOiBNZWRpYUNhbGxzaXRlW11cbik6IHZvaWQge1xuICBpZiAobm9kZS5jYWxsc2l0ZXMpIHtcbiAgICBub2RlLmNhbGxzaXRlcy5wdXNoKC4uLmNzKTtcbiAgfSBlbHNlIHtcbiAgICBub2RlLmNhbGxzaXRlcyA9IFsuLi5jc107XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZENsYXNzKGh0bWw6IEh0bWxFbGVtZW50LCBjbGFzc05hbWU6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBjbGFzc0xpc3QgPSAoaHRtbC5jbGFzc2VzID8/PSBbXSk7XG4gIGlmICghY2xhc3NMaXN0LmluY2x1ZGVzKGNsYXNzTmFtZSkpIGNsYXNzTGlzdC5wdXNoKGNsYXNzTmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBibG9ja2lmeShub2RlOiBIdG1sRWxlbWVudCk6IHZvaWQge1xuICBpZiAoIW5vZGUuc3R5bGVzPy5bJ2Rpc3BsYXknXSkgc2V0U3R5bGUobm9kZSwgJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgZWxzZSB7XG4gICAgY29uc3QgZGlzcGxheSA9IG5vZGUuc3R5bGVzWydkaXNwbGF5J107XG4gICAgc2V0U3R5bGUoXG4gICAgICBub2RlLFxuICAgICAgJ2Rpc3BsYXknLFxuICAgICAgZGlzcGxheSA9PT0gJ2lubGluZScgPyAnYmxvY2snIDogZGlzcGxheS5yZXBsYWNlKC9pbmxpbmUtLywgJycpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuTWFrZUltZyhmaWxsczogKFBhaW50IHwgUmVzdFBhaW50KVtdKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgZmlsbHMubGVuZ3RoID09PSAxICYmXG4gICAgZmlsbHNbMF0udHlwZSA9PT0gJ0lNQUdFJyAmJlxuICAgIGZpbGxzWzBdLnNjYWxlTW9kZSAhPT0gJ1RJTEUnXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5NYWtlVmlkZW8oZmlsbHM/OiByZWFkb25seSAoUGFpbnQgfCBSZXN0UGFpbnQpW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBmaWxscz8ubGVuZ3RoID09PSAxICYmXG4gICAgZmlsbHNbMF0udHlwZSA9PT0gJ1ZJREVPJyAmJlxuICAgIGZpbGxzWzBdLnNjYWxlTW9kZSAhPT0gJ1RJTEUnXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpbHRlcmVkUGFpbnQoZmlsbDogUGFpbnQgfCBSZXN0UGFpbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBmaWxsLnR5cGUgPT09ICdJTUFHRScgJiZcbiAgICAoaGFzRmlsdGVyKGZpbGwuZmlsdGVycykgfHwgKGZpbGwub3BhY2l0eSA/PyAxKSAhPT0gMSlcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0ZpbHRlcihmaWx0ZXJzPzogSW1hZ2VGaWx0ZXJzKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgISFmaWx0ZXJzICYmXG4gICAgISEoXG4gICAgICBmaWx0ZXJzLmNvbnRyYXN0IHx8XG4gICAgICBmaWx0ZXJzLmV4cG9zdXJlIHx8XG4gICAgICBmaWx0ZXJzLmhpZ2hsaWdodHMgfHxcbiAgICAgIGZpbHRlcnMuc2F0dXJhdGlvbiB8fFxuICAgICAgZmlsdGVycy5zaGFkb3dzIHx8XG4gICAgICBmaWx0ZXJzLnRlbXBlcmF0dXJlIHx8XG4gICAgICBmaWx0ZXJzLnRpbnRcbiAgICApXG4gICk7XG59XG5cbmV4cG9ydCBjb25zdCBnZXRQYXJlbnQgPSAoY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQpOiBIdG1sRWxlbWVudCB8IHVuZGVmaW5lZCA9PlxuICBjdHgucGFyZW50c1tjdHgucGFyZW50cy5sZW5ndGggLSAxXTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNhbWVGaWx0ZXIoYT86IEltYWdlRmlsdGVycywgYj86IEltYWdlRmlsdGVycyk6IGJvb2xlYW4ge1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHRydWU7XG4gIGNvbnN0IGhhc0EgPSBoYXNGaWx0ZXIoYSk7XG4gIGNvbnN0IGhhc0IgPSBoYXNGaWx0ZXIoYik7XG4gIGlmIChoYXNBICYmIGhhc0IpIHtcbiAgICByZXR1cm4gKFxuICAgICAgYSEuY29udHJhc3QgPT09IGIhLmNvbnRyYXN0ICYmXG4gICAgICBhIS5leHBvc3VyZSA9PT0gYiEuZXhwb3N1cmUgJiZcbiAgICAgIGEhLmhpZ2hsaWdodHMgPT09IGIhLmhpZ2hsaWdodHMgJiZcbiAgICAgIGEhLnNhdHVyYXRpb24gPT09IGIhLnNhdHVyYXRpb24gJiZcbiAgICAgIGEhLnNoYWRvd3MgPT09IGIhLnNoYWRvd3MgJiZcbiAgICAgIGEhLnRlbXBlcmF0dXJlID09PSBiIS50ZW1wZXJhdHVyZSAmJlxuICAgICAgYSEudGludCA9PT0gYiEudGludFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGhhc0EgPT09IGhhc0I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxsT3BhY2l0eUZpbHRlcihmaWxsOiBQYWludCB8IFJlc3RQYWludCB8IHVuZGVmaW5lZCk6IG51bWJlciB7XG4gIHJldHVybiAoZmlsbD8udHlwZSA9PT0gJ0lNQUdFJyAmJiBmaWxsLm9wYWNpdHkpIHx8IDE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZWVkVG9TcGxpdEZpbGxzKFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlLFxuICBmaWxsczogKFBhaW50IHwgUmVzdFBhaW50KVtdXG4pOiBib29sZWFuIHtcbiAgaWYgKCFmaWxscy5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgaWYgKGZpbGxzLmV2ZXJ5KChpdCkgPT4gIWlzRmlsdGVyZWRQYWludChpdCkpKSByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIGNoaWxkcmVuLCBuZWVkIHRvIHNwbGl0IGZpbGxzIHRvIHVzZSBDU1MgZmlsdGVyIChvdGhlcndpc2UgZmlsdGVyL29wYWNpdHkgd291bGQgYXBwbHkgdG8gY2hpbGRyZW4gYXMgd2VsbClcbiAgaWYgKGhhc0NoaWxkcmVuKG5vZGUpKSByZXR1cm4gdHJ1ZTtcbiAgLy8gMSBmaWxsIHdpdGggZmlsdGVyLCBubyBjaGlsZHJlbiAtPiBjYW4gdXNlIENTUyBmaWx0ZXImb3BhY2l0eVxuICBpZiAoZmlsbHMubGVuZ3RoID09PSAxKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzQ2hpbGRyZW4obm9kZTogQmFzZU5vZGUgfCBSZXN0QmFzZU5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuICdjaGlsZHJlbicgaW4gbm9kZSAmJiBub2RlLmNoaWxkcmVuPy5sZW5ndGggPiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZU9wYWNpdHkoXG4gIGN0eDogTWFwcGluZ0V4ZWNDb250ZXh0LFxuICBub2RlOiBTY2VuZU5vZGVcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmICgnb3BhY2l0eScgaW4gbm9kZSkge1xuICAgIGlmIChub2RlLmJvdW5kVmFyaWFibGVzPy5vcGFjaXR5KSB7XG4gICAgICBjb25zdCBvcGFjaXR5OiBDc3NWYWx1ZVZhciA9IHtcbiAgICAgICAgdHlwZTogJ1ZBUklBQkxFJyxcbiAgICAgICAgdmFyaWFibGU6IG5vZGUuYm91bmRWYXJpYWJsZXMub3BhY2l0eSxcbiAgICAgICAgdW5pdDogJycsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGBjYWxjKCR7Y3NzVmFsdWVUb1N0cmluZyhbb3BhY2l0eV0sIGN0eCl9IC8gMTAwKWA7XG4gICAgfSBlbHNlIGlmIChub2RlLm9wYWNpdHkgIT09IDEpIHJldHVybiBTdHJpbmcocm91bmRUbyhub2RlLm9wYWNpdHksIDEwMCkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Nzc0ZpbHRlcnMoZmlsdGVycz86IEltYWdlRmlsdGVycyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY3NzRmlsdGVyczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKGhhc0ZpbHRlcihmaWx0ZXJzKSkge1xuICAgIGNvbnN0IHsgY29udHJhc3QsIHNhdHVyYXRpb24sIGV4cG9zdXJlIH0gPSBmaWx0ZXJzITtcbiAgICBpZiAoY29udHJhc3QpIHtcbiAgICAgIC8vIC0xIC0+IDEgPT0+IDAuOCAtPiAxLjIgKGFwcHJveCA/KVxuICAgICAgY3NzRmlsdGVycy5wdXNoKGBjb250cmFzdCgkezAuOCArIChjb250cmFzdCArIDEpIC8gNX0pYCk7XG4gICAgfVxuICAgIGlmIChzYXR1cmF0aW9uKSB7XG4gICAgICAvLyAtMSAtPiAxID09PiAwIC0+IDIgKGFwcHJveCA/KVxuICAgICAgY3NzRmlsdGVycy5wdXNoKGBzYXR1cmF0ZSgke3NhdHVyYXRpb24gKyAxfSlgKTtcbiAgICB9XG4gICAgaWYgKGV4cG9zdXJlKSB7XG4gICAgICAvLyAtMSAtPiAxID09PiAwLjEgLT4gNiAoZmlnbWEgYWxnb3JpdGhtIHNlZW1zIGRpZmZlcmVudClcbiAgICAgIGNzc0ZpbHRlcnMucHVzaChcbiAgICAgICAgYGJyaWdodG5lc3MoJHtcbiAgICAgICAgICBleHBvc3VyZSA8IDAgPyAwLjEgKyAoKGV4cG9zdXJlICsgMSkgKiA5KSAvIDEwIDogMSArIGV4cG9zdXJlICogNVxuICAgICAgICB9KWBcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIFRPRE8gc3VwcG9ydCBvdGhlciBmaWdtYSBmaWx0ZXJzIHNvbWVob3cgP1xuICAgIC8vIGVpdGhlciBieSBleHBvcnRpbmcgZmlnbWEgdHJhbnNmb3JtZWQgaW1hZ2UsIG9yIHVzaW5nIFNWRyBpbWFnZSAmIGZpbHRlcnMgd2hpY2ggYXJlIG1vcmUgY2FwYWJsZSA/XG4gIH1cbiAgcmV0dXJuIGNzc0ZpbHRlcnM7XG59XG5cbmV4cG9ydCBjb25zdCBFTUJFRF9OQU1FID0gJzxlbWJlZD4nO1xuXG5leHBvcnQgY29uc3QgaXNFbWJlZCA9IChuOiB7IG5hbWU6IHN0cmluZzsgZjJ3RGF0YT86IEYyd0RhdGEgfSk6IGJvb2xlYW4gPT5cbiAgbi5uYW1lID09PSBFTUJFRF9OQU1FIHx8ICEhbi5mMndEYXRhPy51bnNhZmVIdG1sO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0RW1iZWRSZWxhdWNoRGF0YShub2RlOiBTY2VuZU5vZGUpOiB2b2lkIHtcbiAgLy8gUmVsYXVuY2hBY3Rpb25zLkVESVQgbm90IGFjY2Vzc2libGUgZnJvbSBoZXJlXG4gIGlmICghbm9kZS5nZXRSZWxhdW5jaERhdGEoKS5lZGl0KSB7XG4gICAgbm9kZS5zZXRSZWxhdW5jaERhdGEoeyBlZGl0OiAnRWRpdCBlbWJlZCBIVE1MJyB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RjJ3RGF0YShub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlKTogRjJ3RGF0YSB7XG4gIGNvbnN0IGYyd0RhdGEgPSBnZXRTaGFyZWRQbHVnaW5EYXRhT2JqPEYyd0RhdGEgfCB1bmRlZmluZWQ+KFxuICAgIG5vZGUsXG4gICAgRjJ3TmFtZXNwYWNlLFxuICAgIEYyd0RhdGFLZXksXG4gICAgdW5kZWZpbmVkXG4gICk7XG4gIGlmIChmMndEYXRhKSByZXR1cm4gZjJ3RGF0YTtcblxuICAvLyBodHRwczovL3d3dy5maWdtYS5jb20vY29tbXVuaXR5L3BsdWdpbi8xMzU2NjkzODA4OTMyMzkyNzI5L3RhZ3MtYXR0cmlidXRlcy1hdHRhY2gtc2VtYW50aWMtZGF0YS10by15b3VyLWRlc2lnbi1lbGVtZW50cy1hbmQtZW5zdXJlLWEtc2VhbWxlc3MtZGV2LWhhbmRvZmZcbiAgY29uc3QgZmlnbWFBdHRycyA9IGdldFNoYXJlZFBsdWdpbkRhdGFPYmo8YW55PihcbiAgICBub2RlLFxuICAgICdmaWdtYS5hdHRyaWJ1dGVzJyxcbiAgICAnYXR0cmlidXRlcycsXG4gICAgdW5kZWZpbmVkXG4gICk7XG4gIGlmIChmaWdtYUF0dHJzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRhZzogZmlnbWFBdHRycy50YWcsXG4gICAgICBhdHRyOiBmaWdtYUF0dHJzLmF0dHJpYnV0ZXMsXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge307XG59XG5cbmxldCBjdXJyZW50X2d1aWQgPSAxO1xuY29uc3QgZGVidWdfY2FjaGU6IFJlY29yZDxzdHJpbmcsIEh0bWxFbGVtZW50PiA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlR3VpZChlbHQ6IEh0bWxFbGVtZW50KTogc3RyaW5nIHtcbiAgY29uc3QgZ3VpZCA9IChlbHQuZ3VpZCB8fD0gU3RyaW5nKG5leHRHdWlkKCkpKTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgZGVidWdfY2FjaGVbZ3VpZF0gPSBlbHQ7XG4gIH1cbiAgcmV0dXJuIGd1aWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlBbmltYXRlZEVsZW1lbnRzQXJlSW5Eb20oXG4gIGJvZHk6IEh0bWxFbGVtZW50LFxuICByZWFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIERPTUYyd0FjdGlvbj5cbik6IHZvaWQge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICB0cmF2ZXJzZUVsZW1lbnQoYm9keSwgKGVsKSA9PiB7XG4gICAgICAoZWwgYXMgYW55KS4kZG9tID0gdHJ1ZTtcbiAgICAgIGlmICgndGFnJyBpbiBlbCkge1xuICAgICAgICBlbC5jaGlsZHJlbj8uZm9yRWFjaCgoYykgPT4gJ3RhZycgaW4gYyAmJiAoKGMgYXMgYW55KS4kcGFyZW50ID0gZWwpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgY3Jhd2xBY3Rpb25zKE9iamVjdC52YWx1ZXMocmVhY3Rpb25zKSkpIHtcbiAgICAgIGlmIChhLnR5cGUgPT09ICdBTklNQVRFJykge1xuICAgICAgICBmb3IgKGNvbnN0IGIgb2YgYS5hbmltYXRpb25zKSB7XG4gICAgICAgICAgY29uc3QgZWx0ID0gZGVidWdfY2FjaGVbYi5lbHRJZF07XG4gICAgICAgICAgaWYgKCEoZWx0IGFzIGFueSk/LiRkb20pIHtcbiAgICAgICAgICAgIHNob3VsZE5vdEhhcHBlbihgRWxlbWVudCAke2IuZWx0SWR9IGlzIG5vdCBpbiB0aGUgRE9NYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChiLmFsdElkKSB7XG4gICAgICAgICAgICBjb25zdCBhbHQgPSBkZWJ1Z19jYWNoZVtiLmFsdElkXTtcbiAgICAgICAgICAgIGlmICghKGFsdCBhcyBhbnkpPy4kZG9tKSB7XG4gICAgICAgICAgICAgIHNob3VsZE5vdEhhcHBlbihgRWxlbWVudCAke2IuYWx0SWR9IGlzIG5vdCBpbiB0aGUgRE9NYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRyYXZlcnNlRWxlbWVudChib2R5LCAoZWwpID0+IHtcbiAgICAgIGRlbGV0ZSAoZWwgYXMgYW55KS4kZG9tO1xuICAgICAgZGVsZXRlIChlbCBhcyBhbnkpLiRwYXJlbnQ7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5leHRHdWlkKCk6IG51bWJlciB7XG4gIHJldHVybiBjdXJyZW50X2d1aWQrKztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE5vZGVQYXJhbXMoXG4gIGh0bWw6IEh0bWxFbGVtZW50LFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlLFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dFxuKTogdm9pZCB7XG4gIGh0bWwubm9kZSA9IG5vZGVQcm9wcyhub2RlLCBjdHguc2NhbGUpO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBodG1sLnBhdGggPSBjdHgucGF0aDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9kZVByb3BzKFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlLFxuICBzY2FsZSA9IDFcbik6IE5vZGVQcm9wcyB7XG4gIGNvbnN0IHsgaWQsIHR5cGUsIG5hbWUgfSA9IG5vZGU7XG4gIGNvbnN0IHsgeDogd2lkdGgsIHk6IGhlaWdodCB9ID0gZ2V0U2l6ZShub2RlLCBzY2FsZSk7XG4gIGNvbnN0IHsgeCwgeSB9ID0gZ2V0T2Zmc2V0KG5vZGUsIHNjYWxlKTtcbiAgY29uc3Qgbm9kZVByb3BzOiBOb2RlUHJvcHMgPSB7IGlkLCB0eXBlLCB3aWR0aCwgaGVpZ2h0LCB4LCB5IH07XG4gIGlmICgobm9kZSBhcyBCbGVuZE1peGluKS5pc01hc2spIG5vZGVQcm9wcy5pc01hc2sgPSB0cnVlO1xuICBpZiAobm9kZS50eXBlICE9PSAnVEVYVCcgfHwgIShub2RlIGFzIFRleHROb2RlKS5hdXRvUmVuYW1lKVxuICAgIG5vZGVQcm9wcy5uYW1lID0gbmFtZTtcbiAgcmV0dXJuIG5vZGVQcm9wcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlSWQoaWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiAnVCcgKyBpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBjcmF3bEFjdGlvbnM8VD4oXG4gIGl0OiBJdGVyYWJsZTxCYXNlRjJ3QWN0aW9uPFQ+PlxuKTogR2VuZXJhdG9yPEJhc2VGMndBY3Rpb248VD4+IHtcbiAgZm9yIChjb25zdCBhIG9mIGl0KSB7XG4gICAgeWllbGQgYTtcbiAgICBpZiAoYS50eXBlID09PSAnQ09ORElUSU9OQUwnKSB7XG4gICAgICBmb3IgKGNvbnN0IGIgb2YgYS5jb25kaXRpb25hbEJsb2Nrcykge1xuICAgICAgICB5aWVsZCogY3Jhd2xBY3Rpb25zKGIuYWN0aW9ucyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhLnR5cGUgPT09ICdLRVlfQ09ORElUSU9OJykge1xuICAgICAgeWllbGQqIGNyYXdsQWN0aW9ucyhhLmFjdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24qIGNyYXdsQW5pbWF0aW9uczxUPihcbiAgaXQ6IFJlY29yZDxhbnksIEJhc2VGMndBY3Rpb248VD4+LFxuICByZXZlcnNlID0gZmFsc2Vcbik6IEdlbmVyYXRvcjxUPiB7XG4gIGNvbnN0IGFyciA9IE9iamVjdC52YWx1ZXMoaXQpO1xuICBpZiAocmV2ZXJzZSkgYXJyLnJldmVyc2UoKTtcbiAgZm9yIChjb25zdCBhIG9mIGNyYXdsQWN0aW9uczxUPihhcnIpKSB7XG4gICAgaWYgKGEudHlwZSA9PT0gJ0FOSU1BVEUnKSB7XG4gICAgICBmb3IgKGNvbnN0IGIgb2YgYS5hbmltYXRpb25zKSB7XG4gICAgICAgIHlpZWxkIGI7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB0eXBlIFRyYXZlcnNlQ2IgPSAoXG4gIG5vZGU6IEh0bWxFbGVtZW50LFxuICBwYXJlbnQ/OiBIdG1sRWxlbWVudFxuKSA9PiB2b2lkIHwgYm9vbGVhbjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRyYXZlcnNlRWxlbWVudHMoXG4gIHJvb3RzOiBIdG1sTm9kZVtdLFxuICAuLi5jYnM6IFRyYXZlcnNlQ2JbXVxuKTogdm9pZCB7XG4gIGNicy5mb3JFYWNoKChjYikgPT4gcm9vdHMuZm9yRWFjaCgocikgPT4gdHJhdmVyc2VFbGVtZW50KHIsIGNiKSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhdmVyc2VFbGVtZW50KHJvb3Q6IEh0bWxOb2RlLCBjYjogVHJhdmVyc2VDYik6IHZvaWQge1xuICBjb25zdCBzdGFjayA9XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyBuZXcgU2V0PEh0bWxOb2RlPigpIDogdW5kZWZpbmVkO1xuICBjb25zdCB0cmF2ZXJzZU5vZGUgPSAobm9kZTogSHRtbE5vZGUsIHBhcmVudD86IEh0bWxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKHN0YWNrPy5oYXMobm9kZSkpIHtcbiAgICAgIHNob3VsZE5vdEhhcHBlbignQ3ljbGluZyBlbGVtZW50IHRyZWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhY2s/LmFkZChub2RlKTtcbiAgICB9XG4gICAgaWYgKCd0YWcnIGluIG5vZGUpIHtcbiAgICAgIGlmIChjYihub2RlLCBwYXJlbnQpKSByZXR1cm47XG4gICAgICAobm9kZS5jaGlsZHJlbiB8fCBbXSkuZm9yRWFjaCgoaXQpID0+IHRyYXZlcnNlTm9kZShpdCwgbm9kZSkpO1xuICAgIH1cbiAgfTtcbiAgdHJhdmVyc2VOb2RlKHJvb3QsIHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NzcyhcbiAgdGFyZ2V0OiBzdHJpbmcsXG4gIHZhcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZD4sXG4gIGluZGVudD86IHN0cmluZ1xuKTogc3RyaW5nIHtcbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHZhcnMpO1xuICBpZiAoIWVudHJpZXMubGVuZ3RoKSByZXR1cm4gJyc7XG4gIGxldCBsaW5lcyA9IFtcbiAgICB0YXJnZXQgKyAnIHsnLFxuICAgIC4uLmVudHJpZXNcbiAgICAgIC5maWx0ZXIoKFssIHZdKSA9PiB2ICE9PSB1bmRlZmluZWQgJiYgdiAhPT0gJycpXG4gICAgICAubWFwKChbaywgdl0pID0+IGAgICR7a306ICR7dn07YCksXG4gICAgJ30nLFxuICBdO1xuICBpZiAoaW5kZW50KSBsaW5lcyA9IGxpbmVzLm1hcCgobCkgPT4gaW5kZW50ICsgbCk7XG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoaW5nTm9kZXM8VD4oXG4gIHZhcmlhbnRzV2l0aFByb3BzOiB7IG5vZGU6IFQ7IHByb3BzOiBWYWxpZFZhcmlhbnRQcm9wZXJ0aWVzIH1bXSxcbiAgbmV3UHJvcHM6IFZhbGlkVmFyaWFudFByb3BlcnRpZXMsXG4gIGN1cnJlbnRQcm9wczogVmFsaWRWYXJpYW50UHJvcGVydGllc1xuKTogVFtdIHtcbiAgY29uc3QgbmV3RW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG5ld1Byb3BzKTtcbiAgY29uc3QgY3VycmVudEVudHJpZXMgPSBPYmplY3QuZW50cmllcyhjdXJyZW50UHJvcHMpO1xuICBjb25zdCBzYW1lID0gKGE6IHN0cmluZywgYjogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAgIGEubG9jYWxlQ29tcGFyZShiLCB1bmRlZmluZWQsIHsgc2Vuc2l0aXZpdHk6ICdhY2NlbnQnIH0pID09PSAwO1xuICByZXR1cm4gdmFyaWFudHNXaXRoUHJvcHNcbiAgICAuZmlsdGVyKCh7IHByb3BzIH0pID0+IG5ld0VudHJpZXMuZXZlcnkoKFtrLCB2XSkgPT4gc2FtZSh2LCBwcm9wc1trXSkpKVxuICAgIC5tYXAoKHsgbm9kZSwgcHJvcHMgfSkgPT4gKHtcbiAgICAgIHNjb3JlOiBjdXJyZW50RW50cmllcy5maWx0ZXIoKFtrLCB2XSkgPT4gc2FtZSh2LCBwcm9wc1trXSkpLmxlbmd0aCxcbiAgICAgIG5vZGUsXG4gICAgfSkpXG4gICAgLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKVxuICAgIC5tYXAoKHYpID0+IHYubm9kZSk7XG59XG5cbi8vIFJldHVybiBtYXggZml4ZWQgc2l6ZSBpbiB0aGUgZm9ybWF0IFwiMTQwcHhcIiBpZiB0aGVyZSBpcyBhIGNsYW1wIGluIHdpZHRoIGZvciB0aGlzIGVsZW1lbnRcbi8vIE90aGVyd2lzZSByZXR1cm4gdW5kZWZpbmVkLlxuZXhwb3J0IGZ1bmN0aW9uIG1heEZpeGVkV2lkdGhPZkVsZW1lbnQoXG4gIGVsOiBIdG1sRWxlbWVudCB8IHVuZGVmaW5lZCxcbiAgcGFyZW50ZWw6IEh0bWxFbGVtZW50IHwgdW5kZWZpbmVkXG4pOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICBjb25zdCB3ID0gZWw/LnN0eWxlcz8ud2lkdGg7XG4gIGNvbnN0IG1heHcgPSBlbD8uc3R5bGVzPy5bJ21heC13aWR0aCddO1xuICBjb25zdCBwX3cgPSBwYXJlbnRlbD8uc3R5bGVzPy53aWR0aDtcbiAgY29uc3QgcF9tYXh3ID0gcGFyZW50ZWw/LnN0eWxlcz8uWydtYXgtd2lkdGgnXTtcblxuICAvLyBDaGVjayBldmVyeSB2YWx1ZSBpbiBvcmRlclxuICAvLyBOb3RlOiBUaGlzIHdvcmtzIGJlY2F1c2Ugd2lkdGggYW5kIG1heFdpZHRoIHdpbGwgYWx3YXlzIGhhdmVcbiAgLy8gYC4uLnB4YCBvciBgLi4uJWAgYXMgdmFsdWVzLlxuICBjb25zdCB2YWx1ZXMgPSBbdywgbWF4dywgcF93LCBwX21heHddO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHYgPSB2YWx1ZXNbaV07XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgaWYgKHYuZW5kc1dpdGgoJyUnKSkgY29udGludWU7XG4gICAgaWYgKHYuZW5kc1dpdGgoJ3B4JykpIHJldHVybiBwYXJzZUludCh2LCAxMCk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKlxuICogUmV0dXJuIG1heCBmaXhlZCBzaXplIGluIHRoZSBmb3JtYXQgXCIxNDBweFwiIGlmIHRoZXJlIGlzIGEgY2xhbXAgaW4gd2lkdGggZm9yIHRoaXMgZWxlbWVudFxuICogT3RoZXJ3aXNlIHJldHVybiB1bmRlZmluZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXhGaXhlZEhlaWdodE9mRWxlbWVudChcbiAgZWw6IEh0bWxFbGVtZW50IHwgdW5kZWZpbmVkLFxuICBwYXJlbnRlbDogSHRtbEVsZW1lbnQgfCB1bmRlZmluZWRcbik6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGggPSBlbD8uc3R5bGVzPy5oZWlnaHQ7XG4gIGNvbnN0IG1heGggPSBlbD8uc3R5bGVzPy5bJ21heC1oZWlnaHQnXTtcbiAgY29uc3QgcF9oID0gcGFyZW50ZWw/LnN0eWxlcz8uaGVpZ2h0O1xuICBjb25zdCBwX21heGggPSBwYXJlbnRlbD8uc3R5bGVzPy5bJ21heC1oZWlnaHQnXTtcblxuICAvLyBDaGVjayBldmVyeSB2YWx1ZSBpbiBvcmRlclxuICAvLyBOb3RlOiBUaGlzIHdvcmtzIGJlY2F1c2UgaGVpZ2h0IGFuZCBtYXhoZWlnaHQgd2lsbCBhbHdheXMgaGF2ZVxuICAvLyBgLi4ucHhgIG9yIGAuLi4lYCBhcyB2YWx1ZXMuXG4gIGNvbnN0IHZhbHVlcyA9IFtoLCBtYXhoLCBwX2gsIHBfbWF4aF07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdiA9IHZhbHVlc1tpXTtcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICBpZiAodi5lbmRzV2l0aCgnJScpKSBjb250aW51ZTtcbiAgICBpZiAodi5lbmRzV2l0aCgncHgnKSkgcmV0dXJuIHBhcnNlSW50KHYsIDEwKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iLCAiZXhwb3J0IGNvbnN0IHJlYWN0aW9uX3R5cGVzID0gW1xuICAnYXBwZWFyJyxcbiAgJ21vdXNlZG93bicsXG4gICdtb3VzZWVudGVyJyxcbiAgJ21vdXNlbGVhdmUnLFxuICAnbW91c2V1cCcsXG4gICd0aW1lb3V0JyxcbiAgJ2NsaWNrJyxcbiAgJ3ByZXNzJyxcbiAgJ2RyYWcnLFxuICAna2V5ZG93bicsXG4gICdob3ZlcicsXG5dIGFzIGNvbnN0O1xuXG5leHBvcnQgdHlwZSBUcmlnZ2VyVHlwZSA9ICh0eXBlb2YgcmVhY3Rpb25fdHlwZXMpW251bWJlcl07XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG9uY2U8VCBleHRlbmRzICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD4oXG4gIHJ1bjogVCB8IG51bGwgfCB1bmRlZmluZWQgfCB2b2lkXG4pOiBUIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFydW4pIHJldHVybjtcbiAgcmV0dXJuICgoLi4uYXJncykgPT4ge1xuICAgIGlmICghcnVuKSByZXR1cm47XG4gICAgY29uc3QgdG9SdW4gPSBydW47XG4gICAgcnVuID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiB0b1J1biguLi5hcmdzKTtcbiAgfSkgYXMgVDtcbn1cbiIsICJleHBvcnQgdHlwZSBDbGVhbnVwRm4gPSAoKSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgQm91bmRFbGVtZW50ID0gU1ZHRWxlbWVudCB8IEhUTUxFbGVtZW50O1xuY29uc3QgaXNCb3VuZEVsZW1lbnQgPSAoZTogYW55KTogZSBpcyBCb3VuZEVsZW1lbnQgPT5cbiAgZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IGUgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuXG5mdW5jdGlvbiBvbkRpc2Nvbm5lY3RlZChlOiBCb3VuZEVsZW1lbnQsIGNiOiBDbGVhbnVwRm4gfCB2b2lkKTogdm9pZCB7XG4gIGlmICghZS5wYXJlbnRFbGVtZW50KSByZXR1cm47IC8vIGFscmVhZHkgcmVtb3ZlZFxuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpKVxuICAgICAgZm9yIChjb25zdCBub2RlIG9mIG11dGF0aW9uLnJlbW92ZWROb2RlcylcbiAgICAgICAgaWYgKG5vZGUgPT09IGUpIHtcbiAgICAgICAgICBjYj8uKCk7XG4gICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gIH0pO1xuICBvYnNlcnZlci5vYnNlcnZlKGUucGFyZW50RWxlbWVudCwgeyBjaGlsZExpc3Q6IHRydWUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkNvbm5lY3RlZChcbiAgc2VsZWN0b3I6IHN0cmluZyxcbiAgY2I6IChlOiBCb3VuZEVsZW1lbnQpID0+IENsZWFudXBGbiB8IHZvaWRcbik6ICgpID0+IHZvaWQge1xuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpKVxuICAgICAgZm9yIChjb25zdCBuIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpXG4gICAgICAgIGlmIChpc0JvdW5kRWxlbWVudChuKSAmJiBuLm1hdGNoZXMoc2VsZWN0b3IpKSBvbkRpc2Nvbm5lY3RlZChuLCBjYihuKSk7XG4gIH0pO1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbiAgcmV0dXJuICgpID0+IG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEZyYW1lTGlrZU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7XG4gIFJlc3RCYXNlTm9kZSxcbiAgUmVzdFNjZW5lTm9kZSxcbiAgUmVzdFRleHROb2RlLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL2ZpZ21hLnJlc3QudHlwaW5ncyc7XG5pbXBvcnQgeyBhc3NlcnRUaGF0IH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL2Fzc2VydCc7XG5pbXBvcnQgeyBub25lT3JOdWxsIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXV0aWxzL3V0aWxzJztcbmltcG9ydCB7XG4gIGdldENoaWxkcmVuLFxuICBpc0ZyYW1lTGlrZSxcbn0gZnJvbSAnQGRpdnJpb3RzL3N0b3J5LXRvLWZpZ21hL2hlbHBlcnMvbm9kZXMnO1xuaW1wb3J0IHtcbiAgbGF5b3V0U2l6aW5nQ291bnRlcixcbiAgbGF5b3V0U2l6aW5nSG9yaXpvbnRhbCxcbiAgbGF5b3V0U2l6aW5nUHJpbWFyeSxcbiAgbGF5b3V0U2l6aW5nVmVydGljYWwsXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy9zcmMvbGF5b3V0U2l6aW5nJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE1vdmVOZWdhdGl2ZUdhcFRvQ2hpbGRNYXJnaW4oXG4gIG5vZGU6IEZyYW1lTGlrZU5vZGVcbik6IGJvb2xlYW4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBhc3NlcnRUaGF0KCgpID0+ICFub25lT3JOdWxsKG5vZGUubGF5b3V0TW9kZSksICdvbmx5IGZvciBhdXRvbGF5b3V0IG5vZGVzJyk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICBub2RlLnByaW1hcnlBeGlzQWxpZ25JdGVtcyAhPT0gJ1NQQUNFX0JFVFdFRU4nICYmXG4gICAgISFub2RlLml0ZW1TcGFjaW5nICYmXG4gICAgbm9kZS5pdGVtU3BhY2luZyA8IDBcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFVzZUFic29sdXRlUG9zaXRpb25Gb3JBdXRvTGF5b3V0KFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlXG4pOiBib29sZWFuIHtcbiAgLy8gbWFwIHNwYWNlLWJldHdlZW4gd2l0aCBsZXNzIHRoYW4gMiBjaGlsZHJlbiBpbnRvIGFic29sdXRlIHBvc2l0aW9uaW5nXG4gIGlmIChcbiAgICAhbm9uZU9yTnVsbCgobm9kZSBhcyBBdXRvTGF5b3V0TWl4aW4pLmxheW91dE1vZGUpICYmXG4gICAgKG5vZGUgYXMgQXV0b0xheW91dE1peGluKS5wcmltYXJ5QXhpc0FsaWduSXRlbXMgPT09ICdTUEFDRV9CRVRXRUVOJyAmJlxuICAgIChub2RlIGFzIEF1dG9MYXlvdXRNaXhpbikubGF5b3V0V3JhcCAhPT0gJ1dSQVAnICYmXG4gICAgbGF5b3V0U2l6aW5nSG9yaXpvbnRhbChub2RlIGFzIFNjZW5lTm9kZSkgPT09ICdGSVhFRCcgJiZcbiAgICBsYXlvdXRTaXppbmdWZXJ0aWNhbChub2RlIGFzIFNjZW5lTm9kZSkgPT09ICdGSVhFRCdcbiAgKSB7XG4gICAgY29uc3QgYXV0b2xheW91dENoaWxkcmVuID0gZ2V0QXV0b0xheW91dFZpc2libGVDaGlsZHJlbihub2RlKTtcbiAgICByZXR1cm4gKFxuICAgICAgLy8gU2hvdWxkIHdvcmsgZm9yIDEgY2hpbGQgYXMgd2VsbCwgYnV0IG5vdCBzdXJlIGl0IGhhcyBhbnkgYmVuZWZpdCBvdmVyIGZsZXhcbiAgICAgIC8vIENvdWxkIGJlIHVzZWZ1bCBpZiB0aGVyZSdzIGFuIGFuaW1hdGlvbiBzd2FwcGluZyBiZXR3ZWVuIDEgYW5kIDIgY2hpbGRyZW5cbiAgICAgIGF1dG9sYXlvdXRDaGlsZHJlbi5sZW5ndGggPT09IDIgJiZcbiAgICAgIC8vIElmIGEgY2hpbGQgaXMgRklMTCwgZmxleCB3aWxsIHdvcmsganVzdCBmaW5lIChubyBuZWdhdGl2ZSBwYWRkaW5nLCB1bmxlc3Mgc29tZSBtaW4tc2l6ZSBpcyBpbnZvbHZlZClcbiAgICAgIC8vIEFuZCBhbnl3YXkgMTAwJSBzaXplIHdpbGwgTk9UIHdvcmsgaW4gdGhpcyBjYXNlIHdpdGggYWJzb2x1dGUgcG9zaXRpb25pbmdcbiAgICAgICFhdXRvbGF5b3V0Q2hpbGRyZW4uc29tZShcbiAgICAgICAgKGl0KSA9PlxuICAgICAgICAgIGxheW91dFNpemluZ1ByaW1hcnkobm9kZSBhcyBTY2VuZU5vZGUsIGl0IGFzIFNjZW5lTm9kZSkgPT09ICdGSUxMJyB8fFxuICAgICAgICAgIC8vIFRPRE86IFRoaXMgb25lIHdlIGNvdWxkIHN1cHBvcnQsIGJ1dCB3ZSdkIGhhdmUgdG8gcmVtb3ZlIHBhZGRpbmdzIGZyb20gJSBjaGlsZCBkaW1lbnNpb25zXG4gICAgICAgICAgbGF5b3V0U2l6aW5nQ291bnRlcihub2RlIGFzIFNjZW5lTm9kZSwgaXQgYXMgU2NlbmVOb2RlKSA9PT0gJ0ZJTEwnXG4gICAgICApXG4gICAgKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc1RleHROb2RlKFxuICBub2RlOiBCYXNlTm9kZSB8IFJlc3RCYXNlTm9kZVxuKTogVGV4dE5vZGUgfCBSZXN0VGV4dE5vZGUgfCB1bmRlZmluZWQge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnVEVYVCdcbiAgICA/IG5vZGVcbiAgICA6IGlzRnJhbWVMaWtlKG5vZGUpXG4gICAgPyAobm9kZS5jaGlsZHJlblswXSBhcyBUZXh0Tm9kZSlcbiAgICA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNvbnN0IGN1c3RvbVZpZGVvRWxlbWVudHMgPSBuZXcgU2V0KFtcbiAgJ3lvdXR1YmUtdmlkZW8nLFxuICAndmltZW8tdmlkZW8nLFxuICAnc3BvdGlmeS1hdWRpbycsXG4gICdqd3BsYXllci12aWRlbycsXG4gICd2aWRlb2pzLXZpZGVvJyxcbiAgJ3dpc3RpYS12aWRlbycsXG4gICdjbG91ZGZsYXJlLXZpZGVvJyxcbiAgJ2hscy12aWRlbycsXG4gICdzaGFrYS12aWRlbycsXG4gICdkYXNoLXZpZGVvJyxcbl0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXV0b0xheW91dFZpc2libGVDaGlsZHJlbihcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZVxuKTogKChTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlKSAmIEF1dG9MYXlvdXRDaGlsZHJlbk1peGluKVtdIHtcbiAgZ2V0Q2hpbGRyZW4obm9kZSk7XG4gIGlmICgobm9kZSBhcyBBdXRvTGF5b3V0TWl4aW4pLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgIHJldHVybiBnZXRDaGlsZHJlbihub2RlKS5maWx0ZXIoXG4gICAgICAoY2hpbGQpID0+XG4gICAgICAgIChjaGlsZCBhcyBBdXRvTGF5b3V0Q2hpbGRyZW5NaXhpbikubGF5b3V0UG9zaXRpb25pbmcgIT09ICdBQlNPTFVURScgJiZcbiAgICAgICAgY2hpbGQudmlzaWJsZSAhPT0gZmFsc2VcbiAgICApIGFzICgoU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSkgJiBBdXRvTGF5b3V0Q2hpbGRyZW5NaXhpbilbXTtcbiAgfVxuICByZXR1cm4gW107XG59XG4iLCAiaW1wb3J0IHsgY3VzdG9tVmlkZW9FbGVtZW50cyB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3NyYy9tYXBwaW5nL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmlkZW9FbGVtZW50KGVsdDogSFRNTEVsZW1lbnQpOiBlbHQgaXMgSFRNTFZpZGVvRWxlbWVudCB7XG4gIHJldHVybiAoXG4gICAgY3VzdG9tVmlkZW9FbGVtZW50cy5oYXMoZWx0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSkgfHxcbiAgICBlbHQudGFnTmFtZSA9PT0gJ1ZJREVPJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNZb3V0dWJlSWZyYW1lKGVsdDogSFRNTEVsZW1lbnQpOiBlbHQgaXMgSFRNTElGcmFtZUVsZW1lbnQge1xuICBpZiAoZWx0LnRhZ05hbWUgIT09ICdJRlJBTUUnKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHNyYyA9IChlbHQgYXMgSFRNTElGcmFtZUVsZW1lbnQpLnNyYztcbiAgcmV0dXJuIChcbiAgICAoc3JjLmluY2x1ZGVzKCd5b3V0dWJlLmNvbScpIHx8IHNyYy5pbmNsdWRlcygneW91dHViZS1ub2Nvb2tpZS5jb20nKSkgJiZcbiAgICBzcmMuaW5jbHVkZXMoJ2VuYWJsZWpzYXBpPTEnKVxuICApO1xufVxuXG5jbGFzcyBZb3V0dWJlQ29udHJvbGxlciB7XG4gIHByaXZhdGUgaW5mbzogYW55ID0ge307XG4gIHByaXZhdGUgbG9hZGVkOiBQcm9taXNlPGJvb2xlYW4+O1xuICBwcml2YXRlIG1lc3NhZ2VMaXN0ZW5lcjogKChldmVudDogTWVzc2FnZUV2ZW50KSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICB0aGlzLmxvYWRlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCBsb2FkTGlzdGVuZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuaWZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkTGlzdGVuZXIpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVxdWVzdFlvdXR1YmVMaXN0ZW5pbmcoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmlmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZExpc3RlbmVyKTtcblxuICAgICAgdGhpcy5tZXNzYWdlTGlzdGVuZXIgPSAoZXZlbnQ6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93ICYmIGV2ZW50LmRhdGEpIHtcbiAgICAgICAgICBsZXQgZXZlbnREYXRhOiBhbnk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZXZlbnREYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdZb3V0dWJlQ29udHJvbGxlciBtZXNzYWdlTGlzdGVuZXInLCBlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZXZlbnREYXRhLmV2ZW50ID09PSAnb25SZWFkeScpIHtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkTGlzdGVuZXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChldmVudERhdGEuaW5mbykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmluZm8sIGV2ZW50RGF0YS5pbmZvKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMubWVzc2FnZUxpc3RlbmVyKTtcbiAgICAgIHRoaXMucmVxdWVzdFlvdXR1YmVMaXN0ZW5pbmcoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2VuZFlvdXR1YmVNZXNzYWdlKFxuICAgIGZ1bmM6XG4gICAgICB8ICdtdXRlJ1xuICAgICAgfCAndW5NdXRlJ1xuICAgICAgfCAncGxheVZpZGVvJ1xuICAgICAgfCAncGF1c2VWaWRlbydcbiAgICAgIHwgJ3N0b3BWaWRlbydcbiAgICAgIHwgJ3NlZWtUbycsXG4gICAgYXJnczogYW55W10gPSBbXVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmxvYWRlZDtcbiAgICB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93Py5wb3N0TWVzc2FnZShcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgZXZlbnQ6ICdjb21tYW5kJywgZnVuYywgYXJncyB9KSxcbiAgICAgICcqJ1xuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlcXVlc3RZb3V0dWJlTGlzdGVuaW5nKCk6IHZvaWQge1xuICAgIHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3c/LnBvc3RNZXNzYWdlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyBldmVudDogJ2xpc3RlbmluZycgfSksXG4gICAgICAnKidcbiAgICApO1xuICB9XG5cbiAgZ2V0IG11dGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZm8ubXV0ZWQ7XG4gIH1cblxuICBnZXQgdm9sdW1lKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaW5mby52b2x1bWU7XG4gIH1cblxuICBzZXQgbXV0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHRoaXMuc2VuZFlvdXR1YmVNZXNzYWdlKCdtdXRlJyk7XG4gICAgZWxzZSB0aGlzLnNlbmRZb3V0dWJlTWVzc2FnZSgndW5NdXRlJyk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pbmZvLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRUaW1lKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLnNlbmRZb3V0dWJlTWVzc2FnZSgnc2Vla1RvJywgW3ZhbHVlLCB0cnVlXSk7XG4gIH1cblxuICBnZXQgcGF1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZm8ucGxheWVyU3RhdGUgPT09IDI7XG4gIH1cblxuICBwbGF5KCk6IHZvaWQge1xuICAgIHRoaXMuc2VuZFlvdXR1YmVNZXNzYWdlKCdwbGF5VmlkZW8nKTtcbiAgfVxuXG4gIHBhdXNlKCk6IHZvaWQge1xuICAgIHRoaXMuc2VuZFlvdXR1YmVNZXNzYWdlKCdwYXVzZVZpZGVvJyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbShlbHQ6IEhUTUxJRnJhbWVFbGVtZW50KTogWW91dHViZUNvbnRyb2xsZXIge1xuICAgIHJldHVybiAoKGVsdCBhcyBhbnkpLmYyd195dF9jb250cm9sbGVyIHx8PSBuZXcgWW91dHViZUNvbnRyb2xsZXIoZWx0KSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29udHJvbGxlcihcbiAgZWx0OiBIVE1MRWxlbWVudFxuKTogSFRNTFZpZGVvRWxlbWVudCB8IFlvdXR1YmVDb250cm9sbGVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKGlzVmlkZW9FbGVtZW50KGVsdCkpIHJldHVybiBlbHQ7XG4gIGlmIChpc1lvdXR1YmVJZnJhbWUoZWx0KSkgcmV0dXJuIFlvdXR1YmVDb250cm9sbGVyLmZyb20oZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZU11dGUoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5tdXRlZCA9ICFjb250cm9sbGVyLm11dGVkO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29udHJvbGxlci5tdXRlZCA9ICFjb250cm9sbGVyLm11dGVkO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbXV0ZShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLm11dGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnRyb2xsZXIubXV0ZWQgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuTXV0ZShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLm11dGVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb250cm9sbGVyLm11dGVkID0gdHJ1ZTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXkoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5wbGF5KCk7XG4gICAgICByZXR1cm4gKCkgPT4gY29udHJvbGxlci5wYXVzZSgpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXVzZShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLnBhdXNlKCk7XG4gICAgICByZXR1cm4gKCkgPT4gY29udHJvbGxlci5wbGF5KCk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZVBsYXkoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGNvbnRyb2xsZXIucGF1c2VkKSBjb250cm9sbGVyLnBsYXkoKTtcbiAgICAgIGVsc2UgY29udHJvbGxlci5wYXVzZSgpO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKGNvbnRyb2xsZXIucGF1c2VkKSBjb250cm9sbGVyLnBsYXkoKTtcbiAgICAgICAgZWxzZSBjb250cm9sbGVyLnBhdXNlKCk7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWVrVG8oXG4gIGVsdDogSFRNTEVsZW1lbnQsXG4gIHRpbWU6IG51bWJlclxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLmN1cnJlbnRUaW1lID0gdGltZTtcbiAgICAgIC8vIG5vIHJldmVydCA/XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlZWtGb3J3YXJkKFxuICBlbHQ6IEhUTUxFbGVtZW50LFxuICBzZWNvbmRzOiBudW1iZXJcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSArPSBzZWNvbmRzO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSAtPSBzZWNvbmRzO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2Vla0JhY2t3YXJkKFxuICBlbHQ6IEhUTUxFbGVtZW50LFxuICBzZWNvbmRzOiBudW1iZXJcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSAtPSBzZWNvbmRzO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSArPSBzZWNvbmRzO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBpc1NhZmFyaSgpOiBib29sZWFuIHtcbiAgY29uc3QgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4gdWEuaW5jbHVkZXMoJ1NhZmFyaScpICYmICF1YS5pbmNsdWRlcygnQ2hyb21lJyk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGlzQWJzb2x1dGVPckZpeGVkKHBvc2l0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgcmV0dXJuIHBvc2l0aW9uID09PSAnYWJzb2x1dGUnIHx8IHBvc2l0aW9uID09PSAnZml4ZWQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGbGV4KGRpc3BsYXk/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuICEhZGlzcGxheT8uZW5kc1dpdGgoJ2ZsZXgnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmxleE9yR3JpZChkaXNwbGF5Pzogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0ZsZXgoZGlzcGxheSkgfHwgaXNHcmlkKGRpc3BsYXkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHcmlkKGRpc3BsYXk/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuICEhZGlzcGxheT8uZW5kc1dpdGgoJ2dyaWQnKTtcbn1cbiIsICJpbXBvcnQgeyB0b1B4IH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXRvLWh0bWwvc3JjL2hlbHBlcnMnO1xuaW1wb3J0IHR5cGUgeyBBbmltYXRlZFByb3AgfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC9zcmMvdHlwZXMnO1xuaW1wb3J0IHsgaXNTYWZhcmkgfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvbmF2aWdhdG9yJztcbmltcG9ydCB7IGlzQWJzb2x1dGVPckZpeGVkIH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL3N0eWxlcyc7XG5pbXBvcnQgdHlwZSB7IEJvdW5kRWxlbWVudCB9IGZyb20gJy4uL2xpZmVjeWNsZSc7XG5cbmNvbnN0IHNhZmFyaSA9IGlzU2FmYXJpKCk7XG5cbnR5cGUgVG9BbmltYXRlID0gUmVjb3JkPHN0cmluZywgW0FuaW1hdGVkUHJvcFsnZnJvbSddLCBBbmltYXRlZFByb3BbJ3RvJ11dPjtcblxuZnVuY3Rpb24gc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgcHJvcHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gIHBzZXVkbz86IHN0cmluZ1xuKTogdm9pZCB7XG4gIGVsdC5hbmltYXRlKFxuICAgIHtcbiAgICAgIC4uLnByb3BzLFxuICAgIH0sXG4gICAge1xuICAgICAgcHNldWRvRWxlbWVudDogcHNldWRvLFxuICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgZmlsbDogJ2ZvcndhcmRzJyxcbiAgICB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIHRvT2JqKHA6IChBbmltYXRlZFByb3AgJiB7IGNhbWVsS2V5OiBzdHJpbmcgfSlbXSk6IFRvQW5pbWF0ZSB7XG4gIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMocC5tYXAoKGl0KSA9PiBbaXQuY2FtZWxLZXksIFtpdC5mcm9tLCBpdC50b11dKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlUHJvcHMoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICBwcm9wczogQW5pbWF0ZWRQcm9wW10sXG4gIGVhc2luZzogc3RyaW5nLFxuICBkdXJhdGlvbjogbnVtYmVyLFxuICBjb250YWluZXJzVG9SZU9yZGVyOiBTZXQ8SFRNTEVsZW1lbnQ+XG4pOiB2b2lkIHtcbiAgY29uc3QgcGFyZW50ID0gZWx0LnBhcmVudEVsZW1lbnQhO1xuICBjb25zdCBjb21wdXRlZFN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZWx0KTtcbiAgY29uc3QgcGFyZW50U3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShwYXJlbnQpO1xuICBjb25zdCBwYXJlbnREaXNwbGF5ID0gcGFyZW50U3R5bGVzLmRpc3BsYXk7XG4gIGNvbnN0IGlzRmxleE9yR3JpZCA9XG4gICAgcGFyZW50RGlzcGxheS5lbmRzV2l0aCgnZmxleCcpIHx8IHBhcmVudERpc3BsYXkuZW5kc1dpdGgoJ2dyaWQnKTtcbiAgY29uc3QgaXNBYnNvbHV0ZSA9IGlzQWJzb2x1dGVPckZpeGVkKGNvbXB1dGVkU3R5bGVzLnBvc2l0aW9uKTtcbiAgY29uc3QgY3VycmVudFByb3BzID0gcHJvcHMubWFwKChpdCkgPT4gKHtcbiAgICAuLi5pdCxcbiAgICBjYW1lbEtleTogaXQua2V5LnN0YXJ0c1dpdGgoJy0tJylcbiAgICAgID8gaXQua2V5XG4gICAgICA6IGl0LmtleS5yZXBsYWNlKC8tKFthLXpdKS9nLCAoXywgbCkgPT4gbC50b1VwcGVyQ2FzZSgpKSxcbiAgfSkpO1xuXG4gIGNvbnN0IGF0dHJQcm9wczogUmVjb3JkPHN0cmluZywgQW5pbWF0ZWRQcm9wWyd0byddPiA9IHt9O1xuICBjb25zdCBuUHJvcHMgPSBjdXJyZW50UHJvcHMuZmlsdGVyKChpdCkgPT4ge1xuICAgIGlmIChpdC5wc2V1ZG8pIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXQua2V5LnN0YXJ0c1dpdGgoJy0tZjJ3LWF0dHItJykpIHtcbiAgICAgIGF0dHJQcm9wc1tpdC5rZXkuc2xpY2UoMTEpXSA9IGl0LnRvO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG4gIGNvbnN0IG5Qcm9wc09iaiA9IHRvT2JqKG5Qcm9wcyk7XG4gIGNvbnN0IGJQcm9wc09iaiA9IHRvT2JqKFxuICAgIGN1cnJlbnRQcm9wcy5maWx0ZXIoKGl0KSA9PiBpdC5wc2V1ZG8gPT09ICc6OmJlZm9yZScpXG4gICk7XG4gIGNvbnN0IGFQcm9wc09iaiA9IHRvT2JqKGN1cnJlbnRQcm9wcy5maWx0ZXIoKGl0KSA9PiBpdC5wc2V1ZG8gPT09ICc6OmFmdGVyJykpO1xuICBsZXQgZGlzcGxheUFmdGVyQW5pbWF0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGlmIChuUHJvcHNPYmouZGlzcGxheSkge1xuICAgIC8vIGV2ZW4gb24gY2hyb21lIHdoZXJlIGRpc3BsYXkgaXMgYW5pbWF0YWJsZSwgdGhlIGVsZW1lbnQgd29uJ3RcbiAgICAvLyAgcmVjZWl2ZSBtb3VzZSBldmVudHMgaWYgd2UgZG9uJ3Qgc2V0IGl0IGV4cGxpY2l0ZWx5XG4gICAgaWYgKG5Qcm9wc09iai5kaXNwbGF5WzBdID09PSAnbm9uZScpIHtcbiAgICAgIC8vIHNob3cgaXQgaW1tZWRpYXRseSwgb3BhY2l0eSBhbmltYXRpb24gd2lsbCBoYW5kbGUgdGhlIHJlc3RcbiAgICAgIGVsdC5zdHlsZS5kaXNwbGF5ID0gU3RyaW5nKG5Qcm9wc09iai5kaXNwbGF5WzFdKTtcbiAgICB9IGVsc2UgaWYgKG5Qcm9wc09iai5kaXNwbGF5WzFdID09PSAnbm9uZScpIHtcbiAgICAgIGlmIChpc0ZsZXhPckdyaWQgJiYgIWlzQWJzb2x1dGUpIHtcbiAgICAgICAgLy8gcHJvYmFibHkgYSBzd2FwLCBoaWRlIGl0IGltbWVkaWF0bHkgdG8gbm90IGhhdmUgYm90aCBlbGVtZW50cyAoYmVmb3JlJmFmdGVyKSB2aXNpYmxlIGR1cmluZyB0aGUgdHJhbnNpdGlvblxuICAgICAgICBlbHQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZm9yIGNvbmN1cnJlbnQvcGFyYWxsZWwgYW5pbWF0aW9ucywgZW5zdXJlIHRoZSBmaW5hbCBzdGF0ZSBpcyBjb3JyZWN0IGFzIHdlbGxcbiAgICBkaXNwbGF5QWZ0ZXJBbmltYXRpb24gPSBTdHJpbmcoblByb3BzT2JqLmRpc3BsYXlbMV0pO1xuICAgIGRlbGV0ZSBuUHJvcHNPYmouZGlzcGxheTtcbiAgfVxuICBpZiAoc2FmYXJpKSB7XG4gICAgc2V0U3R5bGUoZWx0LCBuUHJvcHNPYmosICdvdmVyZmxvdycpO1xuICAgIHNldFN0eWxlKGVsdCwgblByb3BzT2JqLCAncm93R2FwJywgJ2dyaWRSb3dHYXAnKTtcbiAgfVxuICBsZXQgZjJ3T3JkZXIgPSArZ2V0Q29tcHV0ZWRTdHlsZShlbHQpLmdldFByb3BlcnR5VmFsdWUoJy0tZjJ3LW9yZGVyJyk7XG4gIGlmIChuUHJvcHNPYmpbJy0tZjJ3LW9yZGVyJ10pIHtcbiAgICBjb25zdCB0byA9IG5Qcm9wc09ialsnLS1mMnctb3JkZXInXVsxXTtcbiAgICBmMndPcmRlciA9IHRvID09PSB1bmRlZmluZWQgPyBOYU4gOiArdG87XG4gICAgLy8gcmUtcG9zaXRpb24gdGhlIGNoaWxkIGF0IHRoZSByaWdodCBwbGFjZSBpbiB0aGUgcGFyZW50XG4gICAgaWYgKCFpc05hTihmMndPcmRlcikpIHtcbiAgICAgIGVsdC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1mMnctb3JkZXInLCBTdHJpbmcoZjJ3T3JkZXIpKTtcbiAgICB9XG4gICAgZGVsZXRlIG5Qcm9wc09ialsnLS1mMnctb3JkZXInXTtcbiAgfVxuICAvLyByZS1wb3NpdGlvbiB0aGUgY2hpbGQgYXQgdGhlIHJpZ2h0IHBsYWNlIGluIHRoZSBwYXJlbnRcbiAgaWYgKCFpc05hTihmMndPcmRlcikpIHtcbiAgICBjb250YWluZXJzVG9SZU9yZGVyLmFkZChwYXJlbnQpO1xuICB9XG4gIGlmIChuUHJvcHNPYmpbJy0tZjJ3LWltZy1zcmMnXSkge1xuICAgIGxldCBpID0gKGVsdCBhcyBIVE1MSW1hZ2VFbGVtZW50KS5mMndfaW1hZ2VfbGF6eV9sb2FkZXI7XG4gICAgY29uc3Qgc3JjID0gblByb3BzT2JqWyctLWYydy1pbWctc3JjJ11bMV0gYXMgc3RyaW5nO1xuICAgIGlmICghaSkge1xuICAgICAgKGVsdCBhcyBIVE1MSW1hZ2VFbGVtZW50KS5mMndfaW1hZ2VfbGF6eV9sb2FkZXIgPSBpID0gbmV3IEltYWdlKCk7XG4gICAgICBpLmRlY29kaW5nID0gJ3N5bmMnO1xuICAgICAgaS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIChlbHQgYXMgSFRNTEltYWdlRWxlbWVudCkuZGVjb2RpbmcgPSAnc3luYyc7XG4gICAgICAgIGVsdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyk7XG4gICAgICAgIGRlbGV0ZSAoZWx0IGFzIEhUTUxJbWFnZUVsZW1lbnQpLmYyd19pbWFnZV9sYXp5X2xvYWRlcjtcbiAgICAgIH07XG4gICAgfVxuICAgIGkuc3JjID0gc3JjO1xuICAgIGRlbGV0ZSBuUHJvcHNPYmpbJy0tZjJ3LWltZy1zcmMnXTtcbiAgfVxuICBpZiAoblByb3BzT2JqWyckaW5uZXJIVE1MJ10pIHtcbiAgICBlbHQuaW5uZXJIVE1MID0gU3RyaW5nKG5Qcm9wc09ialsnJGlubmVySFRNTCddWzFdKTtcbiAgICBkZWxldGUgblByb3BzT2JqWyckaW5uZXJIVE1MJ107XG4gIH1cbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoYXR0clByb3BzKSkge1xuICAgIGVsdC5zZXRBdHRyaWJ1dGUoaywgU3RyaW5nKHYpKTtcbiAgfVxuICBpZiAoblByb3BzT2JqLmxlZnQgJiYgblByb3BzT2JqLnJpZ2h0KSB7XG4gICAgaWYgKG5Qcm9wc09iai5sZWZ0WzFdID09PSAncmV2ZXJ0JyAmJiBuUHJvcHNPYmoucmlnaHRbMF0gPT09ICdyZXZlcnQnKSB7XG4gICAgICAvLyBsZWZ0IHRvIHJpZ2h0XG4gICAgICBjb25zdCB7IHJpZ2h0OiBwYXJlbnRSaWdodCB9ID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgeyByaWdodCB9ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgLy8gaXMgdGhpcyB0aGUgcmlnaHQgd2F5IHRvIGNvbXB1dGUgcmlnaHQgb2Zmc2V0ID9cbiAgICAgIGNvbnN0IHJpZ2h0U3RyID0gdG9QeChwYXJlbnRSaWdodCAtIHJpZ2h0KTtcbiAgICAgIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZShlbHQsIHsgbGVmdDogJ3JldmVydCcsIHJpZ2h0OiByaWdodFN0ciB9KTtcbiAgICAgIGRlbGV0ZSBuUHJvcHNPYmoubGVmdDtcbiAgICAgIG5Qcm9wc09iai5yaWdodFswXSA9IHJpZ2h0U3RyO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBuUHJvcHNPYmoubGVmdFswXSA9PT0gJ3JldmVydCcgJiZcbiAgICAgIG5Qcm9wc09iai5yaWdodFsxXSA9PT0gJ3JldmVydCdcbiAgICApIHtcbiAgICAgIC8vIHJpZ2h0IHRvIGxlZnRcbiAgICAgIGNvbnN0IHsgbGVmdDogcGFyZW50TGVmdCB9ID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgeyBsZWZ0IH0gPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAvLyBpcyB0aGlzIHRoZSByaWdodCB3YXkgdG8gY29tcHV0ZSBsZWZ0IG9mZnNldCA/XG4gICAgICBjb25zdCBsZWZ0U3RyID0gdG9QeChsZWZ0IC0gcGFyZW50TGVmdCk7XG4gICAgICBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoZWx0LCB7IHJpZ2h0OiAncmV2ZXJ0JywgbGVmdDogbGVmdFN0ciB9KTtcbiAgICAgIGRlbGV0ZSBuUHJvcHNPYmoucmlnaHQ7XG4gICAgICBuUHJvcHNPYmoubGVmdFswXSA9IGxlZnRTdHI7XG4gICAgfVxuICB9XG4gIGlmIChuUHJvcHNPYmoudG9wICYmIG5Qcm9wc09iai5ib3R0b20pIHtcbiAgICBpZiAoblByb3BzT2JqLnRvcFsxXSA9PT0gJ3JldmVydCcgJiYgblByb3BzT2JqLmJvdHRvbVswXSA9PT0gJ3JldmVydCcpIHtcbiAgICAgIC8vIHRvcCB0byBib3R0b21cbiAgICAgIGNvbnN0IHsgYm90dG9tOiBwYXJlbnRCb3R0b20gfSA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHsgYm90dG9tIH0gPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAvLyBpcyB0aGlzIHRoZSByaWdodCB3YXkgdG8gY29tcHV0ZSBib3R0b20gb2Zmc2V0ID9cbiAgICAgIGNvbnN0IGJvdHRvbVN0ciA9IHRvUHgocGFyZW50Qm90dG9tIC0gYm90dG9tKTtcbiAgICAgIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZShlbHQsIHsgdG9wOiAncmV2ZXJ0JywgYm90dG9tOiBib3R0b21TdHIgfSk7XG4gICAgICBkZWxldGUgblByb3BzT2JqLnRvcDtcbiAgICAgIG5Qcm9wc09iai5ib3R0b21bMF0gPSBib3R0b21TdHI7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG5Qcm9wc09iai50b3BbMF0gPT09ICdyZXZlcnQnICYmXG4gICAgICBuUHJvcHNPYmouYm90dG9tWzFdID09PSAncmV2ZXJ0J1xuICAgICkge1xuICAgICAgLy8gYm90dG9tIHRvIHRvcFxuICAgICAgY29uc3QgeyB0b3A6IHBhcmVudFRvcCB9ID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgeyB0b3AgfSA9IGVsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIC8vIGlzIHRoaXMgdGhlIHJpZ2h0IHdheSB0byBjb21wdXRlIHRvcCBvZmZzZXQgP1xuICAgICAgY29uc3QgdG9wU3RyID0gdG9QeCh0b3AgLSBwYXJlbnRUb3ApO1xuICAgICAgc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKGVsdCwgeyBib3R0b206ICdyZXZlcnQnLCB0b3A6IHRvcFN0ciB9KTtcbiAgICAgIGRlbGV0ZSBuUHJvcHNPYmouYm90dG9tO1xuICAgICAgblByb3BzT2JqLnRvcFswXSA9IHRvcFN0cjtcbiAgICB9XG4gIH1cbiAgY29uc3QgaGFzQmdJbWFnZSA9ICEhblByb3BzT2JqWydiYWNrZ3JvdW5kSW1hZ2UnXTtcblxuICBpZiAoaGFzQmdJbWFnZSkge1xuICAgIC8vIElmIGJnLWltYWdlIGNoYW5nZXMsIGFuaW1hdGluZyBwb3NpdGlvbiwgc2l6ZSBldC5hbCB3aWxsIGhhdmUgYml6YXJyZSBlZmZlY3RzXG4gICAgLy8gSWRlYWxseSB3ZSd2ZSB3b3JrIG9uIHRoYXQgZHVyaW5nIGRpZmZpbmcsIGFuZCBhdHRlbXB0IHRvIHVuaWZ5IGJnLWltYWdlIGFjY3Jvc3MgdmFyaWFudHNcbiAgICAvLyBhbmQgbWF5YmUgYW5pbWF0ZSBpdCB0aG91Z2ggdmFyaWFibGVzID9cbiAgICBuUHJvcHNcbiAgICAgIC5maWx0ZXIoKGl0KSA9PiBpdC5rZXkuc3RhcnRzV2l0aCgnYmFja2dyb3VuZC0nKSlcbiAgICAgIC5mb3JFYWNoKChpdCkgPT4ge1xuICAgICAgICAvLyBUT0RPIHVzZSBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUgaW5zdGVhZCB0byBrZWVwIHByb3BzIGFuaW1hdGFibGVcbiAgICAgICAgZWx0LnN0eWxlLnNldFByb3BlcnR5KGl0LmtleSwgU3RyaW5nKGl0LnRvKSk7XG4gICAgICAgIGRlbGV0ZSBuUHJvcHNPYmpbaXQuY2FtZWxLZXldO1xuICAgICAgfSk7XG4gIH1cbiAgZm9yIChjb25zdCBbcHNldWRvLCBvYmpdIG9mIFtcbiAgICBbJ2JlZm9yZScsIGJQcm9wc09ial0sXG4gICAgWydhZnRlcicsIGFQcm9wc09ial0sXG4gIF0gYXMgY29uc3QpIHtcbiAgICBpZiAob2JqLmRpc3BsYXkpIHtcbiAgICAgIC8vIHVzZSBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUgaW5zdGVhZCBvZiBjbGFzc2VzID9cbiAgICAgIGlmIChvYmouZGlzcGxheVsxXSA9PT0gJ25vbmUnKSB7XG4gICAgICAgIGVsdC5jbGFzc0xpc3QucmVtb3ZlKHBzZXVkbyArICctdmlzaWJsZScpO1xuICAgICAgICBlbHQuY2xhc3NMaXN0LmFkZChwc2V1ZG8gKyAnLWhpZGRlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWx0LmNsYXNzTGlzdC5yZW1vdmUocHNldWRvICsgJy1oaWRkZW4nKTtcbiAgICAgICAgZWx0LmNsYXNzTGlzdC5hZGQocHNldWRvICsgJy12aXNpYmxlJyk7XG4gICAgICB9XG4gICAgICAvLyBkcm9wIGl0IGZyb20gYW5pbWF0aW9uID9cbiAgICB9XG4gIH1cblxuICBjb25zdCBhbmltID0gKFxuICAgIHRvQW5pbWF0ZTogVG9BbmltYXRlLFxuICAgIHBzZXVkbz86IHN0cmluZyxcbiAgICBmb3JjZSA9IGZhbHNlXG4gICk6IEFuaW1hdGlvbiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgaWYgKCFmb3JjZSAmJiAhT2JqZWN0LmtleXModG9BbmltYXRlKS5sZW5ndGgpIHJldHVybjtcbiAgICByZXR1cm4gZWx0LmFuaW1hdGUoXG4gICAgICB7XG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgLi4udG9BbmltYXRlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcHNldWRvRWxlbWVudDogcHNldWRvLFxuICAgICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZmlsbDogJ2JvdGgnLFxuICAgICAgfVxuICAgICk7XG4gIH07XG4gIGNvbnN0IGEgPSBhbmltKG5Qcm9wc09iaiwgdW5kZWZpbmVkLCAhIWRpc3BsYXlBZnRlckFuaW1hdGlvbik7XG4gIGlmIChkaXNwbGF5QWZ0ZXJBbmltYXRpb24pIHtcbiAgICBhIS5maW5pc2hlZC50aGVuKCgpID0+IHtcbiAgICAgIGVsdC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheUFmdGVyQW5pbWF0aW9uITtcbiAgICB9KTtcbiAgfVxuICBhbmltKGJQcm9wc09iaiwgJzo6YmVmb3JlJyk7XG4gIGFuaW0oYVByb3BzT2JqLCAnOjphZnRlcicpO1xufVxuXG5jb25zdCBzZXRTdHlsZSA9IChlOiBCb3VuZEVsZW1lbnQsIG86IFRvQW5pbWF0ZSwgLi4ucHJvcHM6IHN0cmluZ1tdKTogdm9pZCA9PiB7XG4gIGNvbnN0IHAgPSBwcm9wcy5maW5kKChwKSA9PiBwIGluIG8pO1xuICBpZiAoIXApIHJldHVybjtcbiAgZS5zdHlsZVtwcm9wc1swXSBhcyBhbnldID0gU3RyaW5nKG9bcF1bMV0pO1xuICBkZWxldGUgb1twXTtcbn07XG4iLCAiaW1wb3J0IHtcbiAgQW5pbWF0ZWRFbHQsXG4gIEYyd0RpcmVjdGlvbmFsVHJhbnNpdGlvbixcbn0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXRvLWh0bWwvc3JjL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vdmVJbkFuaW1hdGlvbnMoXG4gIGVsdElkOiBzdHJpbmcsXG4gIG92ZXJsYXlQb3NpdGlvblR5cGU6IE92ZXJsYXlQb3NpdGlvblR5cGUsXG4gIHRyYW5zaXRpb246IEYyd0RpcmVjdGlvbmFsVHJhbnNpdGlvblxuKTogQW5pbWF0ZWRFbHRbXSB7XG4gIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ0xFRlQnKSB7XG4gICAgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9MRUZUJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2xlZnQnLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvOiAnMCUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfUklHSFQnXG4gICAgKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUgMHB4JyxcbiAgICAgICAgICAgICAgdG86ICcwcHggMHB4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNlbnRlclxuICAgICAgY29uc3QgdHkgPSBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQ0VOVEVSJyA/ICctNTAlJyA6ICcwcHgnO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2xlZnQnLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvOiAnNTAlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206IGAwcHggJHt0eX1gLFxuICAgICAgICAgICAgICB0bzogYC01MCUgJHt0eX1gLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdSSUdIVCcpIHtcbiAgICBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX0xFRlQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0xFRlQnXG4gICAgKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogJy0xMDAlIDBweCcsXG4gICAgICAgICAgICAgIHRvOiAnMHB4IDBweCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX1JJR0hUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9SSUdIVCdcbiAgICApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG86ICcwcHgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2VudGVyXG4gICAgICBjb25zdCB0eSA9IG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdDRU5URVInID8gJy01MCUnIDogJzBweCc7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAnbGVmdCcsXG4gICAgICAgICAgICAgIGZyb206ICcwcHgnLFxuICAgICAgICAgICAgICB0bzogJzUwJScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiBgLTEwMCUgJHt0eX1gLFxuICAgICAgICAgICAgICB0bzogYC01MCUgJHt0eX1gLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdUT1AnKSB7XG4gICAgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fQ0VOVEVSJ1xuICAgICkge1xuICAgICAgY29uc3QgdHggPSBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX0NFTlRFUicgPyAnLTUwJScgOiAnMHB4JztcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiBgJHt0eH0gMTAwJWAsXG4gICAgICAgICAgICAgIHRvOiBgJHt0eH0gMHB4YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfTEVGVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfUklHSFQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0NFTlRFUidcbiAgICApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0b3AnLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvOiAnMHB4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNlbnRlclxuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RvcCcsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG86ICc1MCUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYC01MCUgMCVgLFxuICAgICAgICAgICAgICB0bzogYC01MCUgLTUwJWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ0JPVFRPTScpIHtcbiAgICBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX0xFRlQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX1JJR0hUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9DRU5URVInXG4gICAgKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAnYm90dG9tJyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzBweCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0xFRlQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX1JJR0hUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9DRU5URVInXG4gICAgKSB7XG4gICAgICBjb25zdCB0eCA9IG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfQ0VOVEVSJyA/ICctNTAlJyA6ICcwcHgnO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206IGAke3R4fSAtMTAwJWAsXG4gICAgICAgICAgICAgIHRvOiBgJHt0eH0gMHB4YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNlbnRlclxuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RvcCcsXG4gICAgICAgICAgICAgIGZyb206ICcwcHgnLFxuICAgICAgICAgICAgICB0bzogJzUwJScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiBgLTUwJSAtMTAwJWAsXG4gICAgICAgICAgICAgIHRvOiBgLTUwJSAtNTAlYCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUud2FybignVW5zdXBwb3J0ZWQgdHJhbnNpdGlvbjonLCB0cmFuc2l0aW9uKTtcbiAgfVxuICByZXR1cm4gW107XG59XG4iLCAiaW1wb3J0IHtcbiAgdGVtcGxhdGVJZCxcbiAgdG9QZXJjZW50LFxuICB0b1B4LFxuICB2YWx1ZVRvU3RyaW5nLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC9oZWxwZXJzJztcbmltcG9ydCB7XG4gIHR5cGUgVHJpZ2dlclR5cGUsXG4gIHJlYWN0aW9uX3R5cGVzLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC9tYXBwaW5nL3RyaWdnZXJzJztcbmltcG9ydCB0eXBlIHtcbiAgQW5pbWF0ZWRQcm9wLFxuICBBbmltYXRlZEVsdCBhcyBBbmltYXRpb24sXG4gIERPTUYyd0FjdGlvbiBhcyBGMndBY3Rpb24sXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3R5cGVzJztcbmltcG9ydCB7IHNob3VsZE5vdEhhcHBlbiB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9hc3NlcnQnO1xuaW1wb3J0IHsgb25jZSB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9mdW5jdGlvbnMnO1xuaW1wb3J0IHsgaXNBbGlhcyB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3ZhcmlhYmxlcyc7XG5pbXBvcnQgeyBmaWx0ZXJFbXB0eSB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9hcnJheSc7XG5pbXBvcnQgeyBvbkNvbm5lY3RlZCwgQ2xlYW51cEZuLCBCb3VuZEVsZW1lbnQgfSBmcm9tICcuL2xpZmVjeWNsZSc7XG5pbXBvcnQge1xuICBzZWVrQmFja3dhcmQsXG4gIHNlZWtGb3J3YXJkLFxuICBtdXRlLFxuICBwYXVzZSxcbiAgcGxheSxcbiAgc2Vla1RvLFxuICB0b2dnbGVNdXRlLFxuICB0b2dnbGVQbGF5LFxuICB1bk11dGUsXG59IGZyb20gJy4vcnVudGltZS92aWRlb3MnO1xuaW1wb3J0IHsgYW5pbWF0ZVByb3BzIH0gZnJvbSAnLi9ydW50aW1lL2FuaW1hdG9yJztcbmltcG9ydCB7IGdldE1vdmVJbkFuaW1hdGlvbnMgfSBmcm9tICcuL3J1bnRpbWUvYW5pbWF0aW9ucyc7XG5cbnR5cGUgVmFyaWFibGVWYWx1ZU5vQWxpYXMgPSBFeGNsdWRlPFZhcmlhYmxlVmFsdWUsIFZhcmlhYmxlQWxpYXM+O1xuXG50eXBlIFNldFZhcmlhYmxlID0geyBpZDogc3RyaW5nOyB2YWx1ZTogVmFyaWFibGVWYWx1ZTsgc3RyOiBzdHJpbmcgfTtcblxuY29uc3QgYWxsUmVhY3Rpb25zID0gKCk6IFJlY29yZDxzdHJpbmcsIEYyd0FjdGlvbj4gPT4gd2luZG93LkYyV19SRUFDVElPTlM7XG5jb25zdCBhbGxWYXJpYWJsZXMgPSAoKTogUmVjb3JkPHN0cmluZywgVmFyaWFibGVWYWx1ZT4gPT4gd2luZG93LkYyV19WQVJJQUJMRVM7XG5jb25zdCBjb2xsZWN0aW9uTW9kZUJwcyA9ICgpOiBSZWNvcmQ8XG4gIHN0cmluZyxcbiAgUmVjb3JkPHN0cmluZywgeyBtaW5XaWR0aDogbnVtYmVyIH0+XG4+ID0+IHdpbmRvdy5GMldfQ09MTEVDVElPTl9NT0RFX0JQUztcbmNvbnN0IGdldENvbE1vZGVzID0gKGNvbDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgVmFyaWFibGVzPiA9PlxuICB3aW5kb3cuRjJXX0NPTExFQ1RJT05fVkFSUz8uW2NvbF0gPz8ge307XG5jb25zdCBnZXRDb2xWYXJpYWJsZXMgPSAoXG4gIGNvbDogc3RyaW5nLFxuICBtb2RlOiBzdHJpbmdcbik6IFJlY29yZDxzdHJpbmcsIFZhcmlhYmxlVmFsdWU+IHwgdW5kZWZpbmVkID0+IGdldENvbE1vZGVzKGNvbClbbW9kZV07XG5cbmZ1bmN0aW9uIHNldFZhcmlhYmxlKGlkOiBzdHJpbmcsIHZhbHVlOiBWYXJpYWJsZVZhbHVlKTogdm9pZCB7XG4gIGFsbFZhcmlhYmxlcygpW2lkXSA9IHZhbHVlO1xuICBjb25zdCBzdHIgPSB2YWx1ZVRvU3RyaW5nKHZhbHVlKTtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5zZXRQcm9wZXJ0eShpZCwgc3RyKTtcbiAgY29uc3QgYXR0ciA9IGBkYXRhJHtpZC5zbGljZSgxKX1gO1xuICBpZiAoZG9jdW1lbnQuYm9keS5oYXNBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZShhdHRyLCBzdHIpO1xuICB9XG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgbmV3IEN1c3RvbUV2ZW50PFNldFZhcmlhYmxlPignZjJ3LXNldC12YXJpYWJsZScsIHtcbiAgICAgIGRldGFpbDogeyBpZCwgdmFsdWUsIHN0ciB9LFxuICAgIH0pXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNldENvbGxlY3Rpb25BdHRyQW5kVmFyaWFibGVzKFxuICBjb2xOYW1lOiBzdHJpbmcsXG4gIG1vZGVOYW1lOiBzdHJpbmdcbik6IHZvaWQge1xuICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZShgZGF0YS0ke2NvbE5hbWV9YCwgbW9kZU5hbWUpO1xuICBjb25zdCB2YXJzID0gZ2V0Q29sVmFyaWFibGVzKGNvbE5hbWUsIG1vZGVOYW1lKSA/PyB7fTtcbiAgZm9yIChjb25zdCBbaWQsIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh2YXJzKSkge1xuICAgIHNldFZhcmlhYmxlKGlkLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0VmFyaWFibGVNb2RlKG5hbWU6IHN0cmluZywgbW9kZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBzZXRDb2xsZWN0aW9uQXR0ckFuZFZhcmlhYmxlcyhuYW1lLCBtb2RlTmFtZSk7XG4gIHNhdmVNb2RlKG5hbWUsIG1vZGVOYW1lKTtcbn1cblxuZnVuY3Rpb24gc2F2ZU1vZGUobmFtZTogc3RyaW5nLCBtb2RlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGlmICh3aW5kb3cuRjJXX0NPTE9SX1NDSEVNRVM/LmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgbG9jYWxTdG9yYWdlPy5zZXRJdGVtKENPTE9SX1NDSEVNRV9LRVksIG1vZGVOYW1lKTtcbiAgfSBlbHNlIGlmICh3aW5kb3cuRjJXX0xBTkdVQUdFUz8uaW5jbHVkZXMobmFtZSkpIHtcbiAgICBsb2NhbFN0b3JhZ2U/LnNldEl0ZW0oTEFOR19LRVksIG1vZGVOYW1lKTtcbiAgICBjb25zdCBhbHRlcm5hdGUgPSBBcnJheS5mcm9tKFxuICAgICAgZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxMaW5rRWxlbWVudD4oJ2xpbmtbcmVsPVwiYWx0ZXJuYXRlXCJdJylcbiAgICApLmZpbmQoKGl0KSA9PiBpdC5ocmVmbGFuZyA9PT0gbW9kZU5hbWUpO1xuICAgIGlmIChhbHRlcm5hdGUpIHtcbiAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsICcnLCBuZXcgVVJMKGFsdGVybmF0ZS5ocmVmKS5wYXRobmFtZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRvRmxvYXQodjogVmFyaWFibGVWYWx1ZU5vQWxpYXMpOiBudW1iZXIge1xuICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSByZXR1cm4gdjtcbiAgaWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHJldHVybiB2ID8gMSA6IDA7XG4gIGlmICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpIHJldHVybiBwYXJzZUZsb2F0KHYpO1xuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gdG9TdHJpbmcodjogVmFyaWFibGVWYWx1ZU5vQWxpYXMpOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nKHYpO1xufVxuXG5mdW5jdGlvbiB0b0Jvb2xlYW4odjogVmFyaWFibGVWYWx1ZU5vQWxpYXMpOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJykgcmV0dXJuIHYgPT09ICd0cnVlJztcbiAgcmV0dXJuICEhdjtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShcbiAgdmFsdWU6IFZhcmlhYmxlVmFsdWVXaXRoRXhwcmVzc2lvbiB8IHVuZGVmaW5lZCxcbiAgcm9vdElkPzogc3RyaW5nXG4pOiBWYXJpYWJsZVZhbHVlTm9BbGlhcyB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGlmIChpc0FsaWFzKHZhbHVlKSkge1xuICAgIHJldHVybiByZXNvbHZlKGFsbFZhcmlhYmxlcygpW3ZhbHVlLmlkXSk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJ2V4cHJlc3Npb25Bcmd1bWVudHMnIGluIHZhbHVlKSB7XG4gICAgY29uc3QgYXJncyA9IHZhbHVlLmV4cHJlc3Npb25Bcmd1bWVudHNcbiAgICAgIC5tYXAoKGl0KSA9PiBpdC52YWx1ZSlcbiAgICAgIC5maWx0ZXIoKGl0KTogaXQgaXMgVmFyaWFibGVWYWx1ZVdpdGhFeHByZXNzaW9uID0+IGl0ICE9PSB1bmRlZmluZWQpXG4gICAgICAubWFwKChpdCkgPT4gcmVzb2x2ZShpdCwgcm9vdElkKSk7XG4gICAgY29uc3QgcmVzb2x2ZWRUeXBlID0gdmFsdWUuZXhwcmVzc2lvbkFyZ3VtZW50c1swXT8ucmVzb2x2ZWRUeXBlID8/ICdTVFJJTkcnO1xuICAgIHN3aXRjaCAodmFsdWUuZXhwcmVzc2lvbkZ1bmN0aW9uKSB7XG4gICAgICBjYXNlICdBRERJVElPTic6XG4gICAgICAgIHJldHVybiByZXNvbHZlZFR5cGUgPT09ICdGTE9BVCdcbiAgICAgICAgICA/IGFyZ3MubWFwKHRvRmxvYXQpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpXG4gICAgICAgICAgOiBhcmdzLm1hcCh0b1N0cmluZykucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XG4gICAgICBjYXNlICdTVUJUUkFDVElPTic6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgLSB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnRElWSVNJT04nOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Zsb2F0KGFyZ3NbMF0pIC8gdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ01VTFRJUExJQ0FUSU9OJzpcbiAgICAgICAgcmV0dXJuIGFyZ3MubWFwKHRvRmxvYXQpLnJlZHVjZSgoYSwgYikgPT4gYSAqIGIpO1xuICAgICAgY2FzZSAnTkVHQVRFJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gLXRvRmxvYXQoYXJnc1swXSk7XG4gICAgICBjYXNlICdHUkVBVEVSX1RIQU4nOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Zsb2F0KGFyZ3NbMF0pID4gdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ0dSRUFURVJfVEhBTl9PUl9FUVVBTCc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgPj0gdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ0xFU1NfVEhBTic6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgPCB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnTEVTU19USEFOX09SX0VRVUFMJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9GbG9hdChhcmdzWzBdKSA8PSB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnRVFVQUxTJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWRUeXBlID09PSAnRkxPQVQnXG4gICAgICAgICAgPyB0b0Zsb2F0KGFyZ3NbMF0pID09PSB0b0Zsb2F0KGFyZ3NbMV0pXG4gICAgICAgICAgOiByZXNvbHZlZFR5cGUgPT09ICdCT09MRUFOJ1xuICAgICAgICAgID8gdG9Cb29sZWFuKGFyZ3NbMF0pID09PSB0b0Jvb2xlYW4oYXJnc1sxXSlcbiAgICAgICAgICA6IHRvU3RyaW5nKGFyZ3NbMF0pID09PSB0b1N0cmluZyhhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ05PVF9FUVVBTCc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkVHlwZSA9PT0gJ0ZMT0FUJ1xuICAgICAgICAgID8gdG9GbG9hdChhcmdzWzBdKSAhPT0gdG9GbG9hdChhcmdzWzFdKVxuICAgICAgICAgIDogcmVzb2x2ZWRUeXBlID09PSAnQk9PTEVBTidcbiAgICAgICAgICA/IHRvQm9vbGVhbihhcmdzWzBdKSAhPT0gdG9Cb29sZWFuKGFyZ3NbMV0pXG4gICAgICAgICAgOiB0b1N0cmluZyhhcmdzWzBdKSAhPT0gdG9TdHJpbmcoYXJnc1sxXSk7XG4gICAgICBjYXNlICdBTkQnOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Jvb2xlYW4oYXJnc1swXSkgJiYgdG9Cb29sZWFuKGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnT1InOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Jvb2xlYW4oYXJnc1swXSkgfHwgdG9Cb29sZWFuKGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnTk9UJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gIXRvQm9vbGVhbihhcmdzWzBdKTtcbiAgICAgIGNhc2UgJ1ZBUl9NT0RFX0xPT0tVUCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYEV4cHJlc3Npb24gbm90IGltcGxlbWVudGVkIHlldDogJHt2YWx1ZS5leHByZXNzaW9uRnVuY3Rpb259YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhY3Rpb25zVG9SdW4oXG4gIGFjdGlvbnM6IEYyd0FjdGlvbltdLFxuICBib3VuZDogQm91bmRFbGVtZW50LFxuICB0cmlnZ2VyOiBUcmlnZ2VyVHlwZVxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBydW5zID0gYWN0aW9ucy5tYXAoKGl0KSA9PiB0b1J1bldpdGhEcmFnQ2xlYW51cChpdCwgYm91bmQsIHRyaWdnZXIpKTtcbiAgcmV0dXJuIChlLCBpKSA9PiB7XG4gICAgY29uc3QgcmV2ZXJ0cyA9IHJ1bnNcbiAgICAgIC5tYXAoKGl0KSA9PiBpdChlLCBpKSlcbiAgICAgIC5maWx0ZXIoKGl0KTogaXQgaXMgRXZlbnRDYWxsYmFjayA9PiAhIWl0KTtcbiAgICBpZiAocmV2ZXJ0cy5sZW5ndGgpIHJldHVybiAoZSwgaSkgPT4gcmV2ZXJ0cy5mb3JFYWNoKChpdCkgPT4gaXQoZSwgaSkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0b1J1bldpdGhEcmFnQ2xlYW51cChcbiAgYWN0aW9uOiBGMndBY3Rpb24sXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIHRyaWdnZXI6IFRyaWdnZXJUeXBlXG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIHdoaWxlIChhY3Rpb24udHlwZSA9PT0gJ0FMSUFTJykge1xuICAgIGFjdGlvbiA9IGFsbFJlYWN0aW9ucygpW2FjdGlvbi5hbGlhc107XG4gIH1cbiAgY29uc3QgcnVuID0gdG9SdW4oYWN0aW9uLCBib3VuZCwgdHJpZ2dlcik7XG4gIHJldHVybiAoZSkgPT4ge1xuICAgIGlmIChhY3Rpb24udHlwZSAhPT0gJ0FOSU1BVEUnICYmIHRyaWdnZXIgPT09ICdkcmFnJykge1xuICAgICAgY29uc3QgZCA9IChlIGFzIEN1c3RvbUV2ZW50PERyYWdnaW5nPikuZGV0YWlsO1xuICAgICAgaWYgKCFkLmhhbmRsZWQpIHtcbiAgICAgICAgZC5oYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHJ1bihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc2tpcCBhbGwgYW5pbWF0aW9ucyB3aGVuIGEgZHJhZyBpcyBpbiBwcm9ncmVzc1xuICAgIGlmIChkcmFnX3N0YXJ0ZWQpIHJldHVybjtcbiAgICBpZiAoYWN0aW9uLnR5cGUgPT09ICdBTklNQVRFJyAmJiBhY3Rpb24ucm9vdElkKSB7XG4gICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWN0aW9uLnJvb3RJZCk7XG4gICAgICAvLyBhZGQgcmV2ZXJ0IGZ1bmN0aW9ucyB0byBwYXJlbnQgZWxlbWVudHMsIHNvIHRoZXkgY2FuIHJlc2V0IHRoZWlyIGNoaWxkcmVuIHdoZW4gbmVlZGVkXG4gICAgICBpZiAocm9vdD8ucGFyZW50RWxlbWVudCkge1xuICAgICAgICBjb25zdCByZXZlcnQgPSBvbmNlKHJ1bihlKSk7XG4gICAgICAgIGlmIChyZXZlcnQpIHtcbiAgICAgICAgICBsZXQgZWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IHJvb3Q/LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgd2hpbGUgKGVsKSB7XG4gICAgICAgICAgICAvLyBUT0RPIHRoaXMgd2lsbCBsZWFrIGFzIGl0J3MgdW5saWtlbHkgdGhlc2UgZWxlbWVudHMgd2lsbCBldmVyIG5lZWQgdG8gcmVzZXRcbiAgICAgICAgICAgIC8vIENvdWxkIGJlIGltcHJvdmVkIGJ5IGZsYWdnaW5nICdyZXNldHRhYmxlJyBub2RlcywgYW5kIG9ubHkgYWRkaW5nIHRoZSByZXNldCBmdW5jdGlvbiB0byB0aGVtXG4gICAgICAgICAgICAoZWwuZjJ3X3Jlc2V0IHx8PSBbXSkucHVzaChyZXZlcnQpO1xuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgaWYgKGVsPy50YWdOYW1lID09PSAnQk9EWScpIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV2ZXJ0O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnVuKGUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0b1J1bihcbiAgYWN0aW9uOiBGMndBY3Rpb24sXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIHRyaWdnZXI6IFRyaWdnZXJUeXBlXG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdCQUNLJzpcbiAgICAgIHJldHVybiAoKSA9PiAod2luZG93LkYyV19QUkVWSUVXX0JBQ0sgPz8gaGlzdG9yeS5iYWNrKSgpO1xuICAgIGNhc2UgJ0pTJzpcbiAgICAgIHJldHVybiAoKSA9PiBldmFsKGFjdGlvbi5jb2RlKTtcbiAgICBjYXNlICdVUkwnOlxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKGFjdGlvbi5vcGVuSW5OZXdUYWIpIHtcbiAgICAgICAgICB3aW5kb3cub3BlbihhY3Rpb24udXJsLCAnX2JsYW5rJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luZG93LkYyV19QUkVWSUVXX05BVklHQVRFXG4gICAgICAgICAgICA/IHdpbmRvdy5GMldfUFJFVklFV19OQVZJR0FURShhY3Rpb24udXJsKVxuICAgICAgICAgICAgOiBsb2NhdGlvbi5hc3NpZ24oYWN0aW9uLnVybCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgY2FzZSAnU0VUX1ZBUklBQkxFJzpcbiAgICAgIGNvbnN0IHsgdmFyaWFibGVJZCwgdmFyaWFibGVWYWx1ZSB9ID0gYWN0aW9uO1xuICAgICAgaWYgKHZhcmlhYmxlSWQgJiYgdmFyaWFibGVWYWx1ZT8udmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgc2V0VmFyaWFibGUodmFyaWFibGVJZCwgcmVzb2x2ZSh2YXJpYWJsZVZhbHVlLnZhbHVlLCB2YXJpYWJsZUlkKSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTRVRfVkFSSUFCTEVfTU9ERSc6XG4gICAgICBjb25zdCB7IHZhcmlhYmxlQ29sbGVjdGlvbk5hbWUsIHZhcmlhYmxlTW9kZU5hbWUgfSA9IGFjdGlvbjtcbiAgICAgIGlmICh2YXJpYWJsZUNvbGxlY3Rpb25OYW1lICYmIHZhcmlhYmxlTW9kZU5hbWUpXG4gICAgICAgIHJldHVybiAoKSA9PiBzZXRWYXJpYWJsZU1vZGUodmFyaWFibGVDb2xsZWN0aW9uTmFtZSwgdmFyaWFibGVNb2RlTmFtZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdDT05ESVRJT05BTCc6XG4gICAgICBjb25zdCBibG9ja3MgPSBhY3Rpb24uY29uZGl0aW9uYWxCbG9ja3MubWFwKCh2KSA9PiB7XG4gICAgICAgIGNvbnN0IHJ1biA9IGFjdGlvbnNUb1J1bih2LmFjdGlvbnMsIGJvdW5kLCB0cmlnZ2VyKTtcbiAgICAgICAgY29uc3QgeyBjb25kaXRpb24gfSA9IHY7XG4gICAgICAgIGNvbnN0IHRlc3QgPSBjb25kaXRpb25cbiAgICAgICAgICA/ICgpID0+IHRvQm9vbGVhbihyZXNvbHZlKGNvbmRpdGlvbi52YWx1ZSkpXG4gICAgICAgICAgOiAoKSA9PiB0cnVlO1xuICAgICAgICByZXR1cm4geyB0ZXN0LCBydW4gfTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29uc3QgcmV2ZXJ0czogRXZlbnRDYWxsYmFja1tdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2YgYmxvY2tzKSB7XG4gICAgICAgICAgaWYgKGJsb2NrLnRlc3QoKSkge1xuICAgICAgICAgICAgY29uc3QgcmV2ZXJ0ID0gYmxvY2sucnVuKCk7XG4gICAgICAgICAgICBpZiAocmV2ZXJ0KSByZXZlcnRzLnB1c2gocmV2ZXJ0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmV2ZXJ0cy5sZW5ndGgpIHJldHVybiAoZSkgPT4gcmV2ZXJ0cy5mb3JFYWNoKChpdCkgPT4gaXQoZSkpO1xuICAgICAgfTtcbiAgICBjYXNlICdLRVlfQ09ORElUSU9OJzpcbiAgICAgIGNvbnN0IHJ1biA9IGFjdGlvbnNUb1J1bihhY3Rpb24uYWN0aW9ucywgYm91bmQsIHRyaWdnZXIpO1xuICAgICAgY29uc3Qga2V5Q29kZSA9IGFjdGlvbi5rZXlDb2Rlc1swXTtcbiAgICAgIGNvbnN0IHNoaWZ0S2V5ID0gYWN0aW9uLmtleUNvZGVzLnNsaWNlKDEpLmluY2x1ZGVzKDE2KTtcbiAgICAgIGNvbnN0IGN0cmxLZXkgPSBhY3Rpb24ua2V5Q29kZXMuc2xpY2UoMSkuaW5jbHVkZXMoMTcpO1xuICAgICAgY29uc3QgYWx0S2V5ID0gYWN0aW9uLmtleUNvZGVzLnNsaWNlKDEpLmluY2x1ZGVzKDE4KTtcbiAgICAgIGNvbnN0IG1ldGFLZXkgPSBhY3Rpb24ua2V5Q29kZXMuc2xpY2UoMSkuaW5jbHVkZXMoOTEpO1xuICAgICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICAgIGlmIChlLmtleUNvZGUgIT09IGtleUNvZGUpIHJldHVybjtcbiAgICAgICAgICBpZiAoZS5jdHJsS2V5ICE9PSBjdHJsS2V5KSByZXR1cm47XG4gICAgICAgICAgaWYgKGUuYWx0S2V5ICE9PSBhbHRLZXkpIHJldHVybjtcbiAgICAgICAgICBpZiAoZS5tZXRhS2V5ICE9PSBtZXRhS2V5KSByZXR1cm47XG4gICAgICAgICAgaWYgKGUuc2hpZnRLZXkgIT09IHNoaWZ0S2V5KSByZXR1cm47XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgcnVuKGUpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIGNhc2UgJ0NMT1NFX09WRVJMQVknOiB7XG4gICAgICBpZiAoYWN0aW9uLnNlbGYpIHJldHVybiAoZSkgPT4gKGU/LnRhcmdldCBhcyBCb3VuZEVsZW1lbnQpPy5mMndfY2xvc2U/LigpO1xuICAgICAgaWYgKGFjdGlvbi5vdmVybGF5SWQpIHtcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFjdGlvbi5vdmVybGF5SWQpO1xuICAgICAgICBpZiAoIW92ZXJsYXkpIGJyZWFrO1xuICAgICAgICByZXR1cm4gKCkgPT4gb3ZlcmxheS5mMndfY2xvc2U/LigpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgJ1NDUk9MTF9UTyc6XG4gICAgICBpZiAoIWFjdGlvbi5kZXN0aW5hdGlvbklkKSBicmVhaztcbiAgICAgIGNvbnN0IGVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFjdGlvbi5kZXN0aW5hdGlvbklkKTtcbiAgICAgIGlmICghZWx0KSBicmVhaztcbiAgICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNjcm9sbCBhbmQgbmF2aWdhdGUgYXQgdGhlIHNhbWUgdGltZSBmb3IgYW5jaG9yc1xuICAgICAgICBpZiAoZT8uY3VycmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSBlPy5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlbHQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgIGJlaGF2aW9yOiBhY3Rpb24udHJhbnNpdGlvbj8udHlwZSA/ICdzbW9vdGgnIDogJ2luc3RhbnQnLFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgY2FzZSAnT1ZFUkxBWSc6XG4gICAgICBpZiAoIWFjdGlvbi5kZXN0aW5hdGlvbklkKSBicmVhaztcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhY3Rpb24uZGVzdGluYXRpb25JZCk7XG4gICAgICBpZiAoIW92ZXJsYXkpIGJyZWFrO1xuICAgICAgY29uc3QgbW9kYWwgPSBBcnJheSguLi5vdmVybGF5LmNoaWxkcmVuKS5maW5kKFxuICAgICAgICAoaXQpID0+IGl0LnRhZ05hbWUgIT09ICdURU1QTEFURSdcbiAgICAgICkgYXMgQm91bmRFbGVtZW50O1xuICAgICAgaWYgKCFtb2RhbCkgYnJlYWs7XG4gICAgICBjb25zdCB7IHRyYW5zaXRpb24sIG92ZXJsYXlQb3NpdGlvblR5cGUsIG92ZXJsYXlSZWxhdGl2ZVBvc2l0aW9uIH0gPVxuICAgICAgICBhY3Rpb247XG4gICAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGgucm91bmQoMTAwMCAqICh0cmFuc2l0aW9uPy5kdXJhdGlvbiA/PyAwKSk7XG4gICAgICBjb25zdCBhbmltYXRpb25zOiBBbmltYXRpb25bXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkOiBhY3Rpb24uZGVzdGluYXRpb25JZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAgeyBrZXk6ICd2aXNpYmlsaXR5JywgZnJvbTogJ2hpZGRlbicsIHRvOiAndmlzaWJsZScgfSxcbiAgICAgICAgICAgIHsga2V5OiAnb3BhY2l0eScsIGZyb206ICcwJywgdG86ICcxJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuXG4gICAgICBpZiAob3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ01BTlVBTCcpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICBpZiAodHJpZ2dlciA9PT0gJ2hvdmVyJykge1xuICAgICAgICAgICAgLy8gdGVtcG9yYXJ5IGRpc2FibGUgbW91c2VsZWF2ZSBoYW5kbGVyIG9uIGVsZW1lbnQsIGJlY2F1c2Ugd2Ugd2FudCB0aGUgb3ZlcmxheSB0byByZW1haW4gdmlzaWJsZSB3aGlsZSB0aGUgY3Vyc29yIGhvdmVycyB0aGUgYm91bmQgZWxlbWVudCBPUiB0aGUgb3ZlcmxheSBpdHNlbGZcbiAgICAgICAgICAgIGNvbnN0IGxlYXZlID0gYm91bmQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlPy4oKTtcbiAgICAgICAgICAgIGlmIChsZWF2ZSkge1xuICAgICAgICAgICAgICBjb25zdCBtb3VzZW1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPdXRzaWRlKGV2ZW50LCBib3VuZCkgJiYgaXNPdXRzaWRlKGV2ZW50LCBtb2RhbCkpIHtcbiAgICAgICAgICAgICAgICAgIGxlYXZlKCk7XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVE9ETyBtYWtlIGl0IHN0aWNrIHRvIGVsZW1lbnQgaW4gY2FzZSBvZiByZXNpemUgP1xuICAgICAgICAgIC8vIFRPRE8gY2xvc2UgaXQgaW4gY2FzZSBvZiByZXNwb25zaXZlIGxheW91dCBjaGFuZ2UgP1xuICAgICAgICAgIGNvbnN0IGR5bmFtaWNfYW5pbWF0aW9ucyA9IGFuaW1hdGlvbnMuc2xpY2UoMCk7XG4gICAgICAgICAgY29uc3QgbWFudWFsTGVmdCA9IHRvUHgoXG4gICAgICAgICAgICBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICtcbiAgICAgICAgICAgICAgKG92ZXJsYXlSZWxhdGl2ZVBvc2l0aW9uPy54ID8/IDApXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBtYW51YWxUb3AgPSB0b1B4KFxuICAgICAgICAgICAgYm91bmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICtcbiAgICAgICAgICAgICAgKG92ZXJsYXlSZWxhdGl2ZVBvc2l0aW9uPy55ID8/IDApXG4gICAgICAgICAgKTtcbiAgICAgICAgICBtb2RhbC5zdHlsZS5zZXRQcm9wZXJ0eSgnbGVmdCcsIG1hbnVhbExlZnQpO1xuICAgICAgICAgIG1vZGFsLnN0eWxlLnNldFByb3BlcnR5KCd0b3AnLCBtYW51YWxUb3ApO1xuICAgICAgICAgIGlmICh0cmFuc2l0aW9uPy50eXBlID09PSAnTU9WRV9JTicpIHtcbiAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ0xFRlQnKSB7XG4gICAgICAgICAgICAgIGR5bmFtaWNfYW5pbWF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICBlbHRJZDogbW9kYWwuaWQsXG4gICAgICAgICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgdG86IG1hbnVhbExlZnQsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ1JJR0hUJykge1xuICAgICAgICAgICAgICBkeW5hbWljX2FuaW1hdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZWx0SWQ6IG1vZGFsLmlkLFxuICAgICAgICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiAnMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgdG86IG1hbnVhbExlZnQsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiAnLTEwMCUgMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgdG86ICcwcHggMHB4JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnVE9QJykge1xuICAgICAgICAgICAgICBkeW5hbWljX2FuaW1hdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZWx0SWQ6IG1vZGFsLmlkLFxuICAgICAgICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3RvcCcsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgdG86IG1hbnVhbFRvcCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnQk9UVE9NJykge1xuICAgICAgICAgICAgICBkeW5hbWljX2FuaW1hdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZWx0SWQ6IG1vZGFsLmlkLFxuICAgICAgICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3RvcCcsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICcwcHgnLFxuICAgICAgICAgICAgICAgICAgICB0bzogbWFudWFsVG9wLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogJzBweCAtMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIHRvOiAnMHB4IDBweCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdG9FeGVjdXRhYmxlQW5pbWF0aW9ucyhcbiAgICAgICAgICAgIGR5bmFtaWNfYW5pbWF0aW9ucyxcbiAgICAgICAgICAgIHRyYW5zaXRpb24/LmVhc2luZyxcbiAgICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgICAgYm91bmQsXG4gICAgICAgICAgICB0cmlnZ2VyLFxuICAgICAgICAgICAgYCR7dHJpZ2dlcn0obWFudWFsX292ZXJsYXkpYCxcbiAgICAgICAgICAgIG92ZXJsYXlcbiAgICAgICAgICApKCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICh0cmFuc2l0aW9uPy50eXBlID09PSAnTU9WRV9JTicpIHtcbiAgICAgICAgYW5pbWF0aW9ucy5wdXNoKFxuICAgICAgICAgIC4uLmdldE1vdmVJbkFuaW1hdGlvbnMobW9kYWwuaWQsIG92ZXJsYXlQb3NpdGlvblR5cGUsIHRyYW5zaXRpb24pXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24/LnR5cGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdVbnN1cHBvcnRlZCB0cmFuc2l0aW9uOicsIHRyYW5zaXRpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRvRXhlY3V0YWJsZUFuaW1hdGlvbnMoXG4gICAgICAgIGFuaW1hdGlvbnMsXG4gICAgICAgIHRyYW5zaXRpb24/LmVhc2luZyxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGJvdW5kLFxuICAgICAgICB0cmlnZ2VyLFxuICAgICAgICBgJHt0cmlnZ2VyfShvdmVybGF5KWAsXG4gICAgICAgIG92ZXJsYXlcbiAgICAgICk7XG4gICAgY2FzZSAnQU5JTUFURSc6IHtcbiAgICAgIGNvbnN0IHsgYW5pbWF0aW9ucywgdHJhbnNpdGlvbiwgcm9vdElkLCByZXNldCB9ID0gYWN0aW9uO1xuICAgICAgY29uc3QgZHVyYXRpb24gPSBNYXRoLnJvdW5kKDEwMDAgKiAodHJhbnNpdGlvbj8uZHVyYXRpb24gPz8gMCkpO1xuICAgICAgY29uc3QgcnVuID0gdG9FeGVjdXRhYmxlQW5pbWF0aW9ucyhcbiAgICAgICAgYW5pbWF0aW9ucyxcbiAgICAgICAgdHJhbnNpdGlvbj8uZWFzaW5nLFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgYm91bmQsXG4gICAgICAgIHRyaWdnZXIsXG4gICAgICAgIHJlc2V0ID8gYCR7dHJpZ2dlcn0oK3Jlc2V0KWAgOiB0cmlnZ2VyXG4gICAgICApO1xuICAgICAgcmV0dXJuIHJlc2V0ICYmIHJvb3RJZFxuICAgICAgICA/IChlLCBpKSA9PiB7XG4gICAgICAgICAgICAvLyBuZWVkIHRvIHJlc2V0IGFsbCBhbmltYXRpb25zIGRvbmUgb24gZWxlbWVudHMgYmVsb3cgcm9vdFxuICAgICAgICAgICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJvb3RJZCk7XG4gICAgICAgICAgICBpZiAocm9vdCkge1xuICAgICAgICAgICAgICBjb25zdCB7IGYyd19yZXNldCB9ID0gcm9vdDtcbiAgICAgICAgICAgICAgaWYgKGYyd19yZXNldD8ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJvb3QuZjJ3X3Jlc2V0O1xuICAgICAgICAgICAgICAgIGYyd19yZXNldC5yZXZlcnNlKCkuZm9yRWFjaCgoaXQpID0+IGl0KHVuZGVmaW5lZCwgdHJ1ZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVuKGUsIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgOiBydW47XG4gICAgfVxuICAgIGNhc2UgJ1VQREFURV9NRURJQV9SVU5USU1FJzoge1xuICAgICAgaWYgKCFhY3Rpb24uZGVzdGluYXRpb25JZCkgYnJlYWs7XG4gICAgICBjb25zdCBlbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhY3Rpb24uZGVzdGluYXRpb25JZCk7XG4gICAgICBpZiAoIWVsdCkgYnJlYWs7XG4gICAgICBzd2l0Y2ggKGFjdGlvbi5tZWRpYUFjdGlvbikge1xuICAgICAgICBjYXNlICdNVVRFJzpcbiAgICAgICAgICByZXR1cm4gbXV0ZShlbHQpO1xuICAgICAgICBjYXNlICdVTk1VVEUnOlxuICAgICAgICAgIHJldHVybiB1bk11dGUoZWx0KTtcbiAgICAgICAgY2FzZSAnVE9HR0xFX01VVEVfVU5NVVRFJzpcbiAgICAgICAgICByZXR1cm4gdG9nZ2xlTXV0ZShlbHQpO1xuICAgICAgICBjYXNlICdQTEFZJzpcbiAgICAgICAgICByZXR1cm4gcGxheShlbHQpO1xuICAgICAgICBjYXNlICdQQVVTRSc6XG4gICAgICAgICAgcmV0dXJuIHBhdXNlKGVsdCk7XG4gICAgICAgIGNhc2UgJ1RPR0dMRV9QTEFZX1BBVVNFJzpcbiAgICAgICAgICByZXR1cm4gdG9nZ2xlUGxheShlbHQpO1xuICAgICAgICBjYXNlICdTS0lQX0JBQ0tXQVJEJzpcbiAgICAgICAgICByZXR1cm4gc2Vla0JhY2t3YXJkKGVsdCwgYWN0aW9uLmFtb3VudFRvU2tpcCk7XG4gICAgICAgIGNhc2UgJ1NLSVBfRk9SV0FSRCc6XG4gICAgICAgICAgcmV0dXJuIHNlZWtGb3J3YXJkKGVsdCwgYWN0aW9uLmFtb3VudFRvU2tpcCk7XG4gICAgICAgIGNhc2UgJ1NLSVBfVE8nOlxuICAgICAgICAgIHJldHVybiBzZWVrVG8oZWx0LCBhY3Rpb24ubmV3VGltZXN0YW1wKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ0FjdGlvbiBub3QgaW1wbGVtZW50ZWQgeWV0OiAnICsgYWN0aW9uLnR5cGUpO1xuICB9XG4gIHJldHVybiAoKSA9PiB7fTtcbn1cblxubGV0IG92ZXJsYXlTdGFja1pJbmRleCA9IDk5OTk7XG5cbmZ1bmN0aW9uIHRvRXhlY3V0YWJsZUFuaW1hdGlvbnMoXG4gIG9yaWdBbmltYXRpb25zOiBBbmltYXRpb25bXSxcbiAgZWFzaW5nID0gJ2xpbmVhcicsXG4gIGR1cmF0aW9uOiBudW1iZXIsXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIHRyaWdnZXI6IFRyaWdnZXJUeXBlLFxuICBkZWJ1Zzogc3RyaW5nLFxuICBtb2RhbD86IEhUTUxFbGVtZW50XG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIHJldHVybiAoZSkgPT4ge1xuICAgIC8vIGxvY2FsIGNvcHkgb2YgYW5pbWF0aW9ucywgc28gd2UgY2FuIG1vZGlmeSBpdCAoZS5nLiB6LWluZGV4IGJlbG93KVxuICAgIGxldCBhbmltYXRpb25zID0gb3JpZ0FuaW1hdGlvbnM7XG4gICAgaWYgKG1vZGFsKSB7XG4gICAgICAvLyBzZXQgbWFpbiBzY3JvbGwgbG9jayB3aGVuIG1vZGFsIGlzIG9wZW5lZFxuICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnRFbGVtZW50IS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgLy8gZW5zdXJlIG92ZXJsYXlzIGFyZSBzdGFja2VkIG9udG8gZWFjaCBvdGhlclxuICAgICAgYW5pbWF0aW9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkOiBtb2RhbC5pZCxcbiAgICAgICAgICBwcm9wczogW3sga2V5OiAnei1pbmRleCcsIGZyb206IDAsIHRvOiBvdmVybGF5U3RhY2taSW5kZXgrKyB9XSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4uYW5pbWF0aW9ucyxcbiAgICAgIF07XG4gICAgfVxuICAgIGNvbnN0IHJldmVyc2VBbmltYXRpb25zID0gZXhlY3V0ZUFuaW1hdGlvbnMoXG4gICAgICBhbmltYXRpb25zLFxuICAgICAgZWFzaW5nLFxuICAgICAgZHVyYXRpb24sXG4gICAgICBib3VuZCxcbiAgICAgIHRyaWdnZXIsXG4gICAgICBkZWJ1ZyxcbiAgICAgIGVcbiAgICApO1xuICAgIGNvbnN0IGNsb3NlID0gb25jZTxFdmVudENhbGxiYWNrPigoXywgaSk6IHZvaWQgPT4ge1xuICAgICAgaWYgKG1vZGFsKSB7XG4gICAgICAgIG92ZXJsYXlTdGFja1pJbmRleC0tO1xuICAgICAgICAvLyB1bnNldCBtYWluIHNjcm9sbCBsb2NrIHdoZW4gbW9kYWwgaXMgY2xvc2VkXG4gICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50RWxlbWVudCEuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgIH1cbiAgICAgIGV4ZWN1dGVBbmltYXRpb25zKFxuICAgICAgICByZXZlcnNlQW5pbWF0aW9ucyxcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBpID8gMCA6IGR1cmF0aW9uLFxuICAgICAgICBib3VuZCxcbiAgICAgICAgdHJpZ2dlcixcbiAgICAgICAgYCR7ZGVidWd9KHJldmVydClgXG4gICAgICApO1xuICAgIH0pO1xuICAgIGlmIChtb2RhbCkgbW9kYWwuZjJ3X2Nsb3NlID0gY2xvc2U7XG4gICAgcmV0dXJuIGNsb3NlO1xuICB9O1xufVxuXG4vLyBJZiBhIGNoaWxkIGVsdCBoYXMgYSBob3ZlciBlZmZlY3QsIGFuZCBwYXJlbnQgaGFzIHN3YXAgKG9uIGNsaWNrKSBlZmZlY3QsIHdlIG5lZWQgdG8gdHJhY2sgdGhlIGNoaWxkJ3MgYWx0IGVsZW1lbnQgdG8gcmVwbGFjZSBpdFxuY29uc3QgZWx0VG9BbHRNYXBwaW5ncyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbmZ1bmN0aW9uIGV4ZWN1dGVBbmltYXRpb25zKFxuICBhbmltYXRpb25zOiBBbmltYXRpb25bXSxcbiAgZWFzaW5nOiBzdHJpbmcsXG4gIGR1cmF0aW9uOiBudW1iZXIsXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIHRyaWdnZXI6IFRyaWdnZXJUeXBlLFxuICBkZWJ1Zzogc3RyaW5nLFxuICBlPzogRXZlbnRcbik6IEFuaW1hdGlvbltdIHtcbiAgLy8gVE9ETyB1c2UgdmlldyB0cmFuc2l0aW9uIGlmIGF2YWlsYWJsZVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBjb25zb2xlLmRlYnVnKGBFeGVjdXRpbmcgYW5pbWF0aW9ucyAoJHtkZWJ1Z30pYCwgYW5pbWF0aW9ucywgYm91bmQpO1xuICB9XG4gIGNvbnN0IHJldmVyc2U6IEFuaW1hdGlvbltdID0gW107XG4gIGNvbnN0IGNvbnRhaW5lcnNUb1JlT3JkZXIgPSBuZXcgU2V0PEhUTUxFbGVtZW50PigpO1xuXG4gIGlmICh0cmlnZ2VyID09PSAnZHJhZycpIHtcbiAgICBleGVjdXRlRHJhZ1N0YXJ0KFxuICAgICAgYW5pbWF0aW9ucyxcbiAgICAgIGVhc2luZyxcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgYm91bmQsXG4gICAgICAoZSBhcyBDdXN0b21FdmVudDxEcmFnZ2luZz4pLmRldGFpbFxuICAgICk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZm9yIChjb25zdCB7IGVsdElkLCBhbHRJZCwgcHJvcHMsIHJlYWN0aW9ucyB9IG9mIGFuaW1hdGlvbnMpIHtcbiAgICBsZXQgZWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWx0SWQpO1xuICAgIGlmICghZWx0KSB7XG4gICAgICBjb25zdCBlbHRJZDIgPSBlbHRUb0FsdE1hcHBpbmdzLmdldChlbHRJZCk7XG4gICAgICBpZiAoZWx0SWQyKSB7XG4gICAgICAgIGVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsdElkMik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZWx0KSB7XG4gICAgICBzaG91bGROb3RIYXBwZW4oYENhbid0IGZpbmQgZWxlbWVudCBmb3IgaWQ6ICR7ZWx0SWR9YCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFsdElkKSB7XG4gICAgICBsZXQgYWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWx0SWQpIGFzIEJvdW5kRWxlbWVudDtcbiAgICAgIGlmICghYWx0KSB7XG4gICAgICAgIGNvbnN0IGFsdFRwbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQoYWx0SWQpKTtcbiAgICAgICAgaWYgKCFhbHRUcGwpIHtcbiAgICAgICAgICBzaG91bGROb3RIYXBwZW4oYENhbid0IGZpbmQgdGVtcGxhdGUgZm9yIGlkOiAke2FsdElkfWApO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFsdEZyYWdtZW50ID0gKGFsdFRwbCBhcyBIVE1MVGVtcGxhdGVFbGVtZW50KS5jb250ZW50Py5jbG9uZU5vZGUoXG4gICAgICAgICAgdHJ1ZVxuICAgICAgICApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBhbHQgPSBhbHRGcmFnbWVudC5xdWVyeVNlbGVjdG9yKCcqJykgYXMgQm91bmRFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBwcmV2aW91cyBlbGVtZW50IGhhZCBjbGVhbnVwIGNhbGxiYWNrcywgaG9vayB0aGVtIGludG8gdGhlIHJlcGxhY2VkIGVsZW1lbnRzIGluc3RlYWRcbiAgICAgIGNvbnN0IHsgZjJ3X21vdXNldXAgfSA9IGVsdDtcbiAgICAgIGNvbnN0IG1vdXNlbGVhdmUgPSBlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlPy4oKTtcbiAgICAgIGlmIChtb3VzZWxlYXZlKSB7XG4gICAgICAgIGluc3RhbGxNb3VzZUxlYXZlKGFsdCwgbW91c2VsZWF2ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmMndfbW91c2V1cCkgYWx0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmMndfbW91c2V1cCk7XG4gICAgICAvLyBIbW1tIG1heWJlIG5lZWQgdG8gdHJhbnNmZXIgdGhlIHRpbWVvdXQgY2xlYW51cCBhcyB3ZWxsID8gbm90IHN1cmVcbiAgICAgIC8vIGlmIChmMndfY2xlYW51cF90aW1lb3V0KSBhbHQuZjJ3X2NsZWFudXBfdGltZW91dCA9IGYyd19jbGVhbnVwX3RpbWVvdXQ7XG4gICAgICBpZiAobW91c2VsZWF2ZSB8fCBmMndfbW91c2V1cCkge1xuICAgICAgICAvLyBlbnN1cmVzIHRoZSBhbHQgZWxlbWVudCB3aWxsIGFjdHVhbGx5IHJlY2VpdmVkIG1vdXNlIGV2ZW50c1xuICAgICAgICByZW1vdmVQb2ludGVyRXZlbnRzTm9uZShhbHQpO1xuICAgICAgfVxuICAgICAgLy8gaW5zdGFsbCBldmVudCBoYW5kbGVycyBmb3IgbmV3IGVsZW1lbnRcbiAgICAgIGhvb2soYWx0LCB0cnVlLCBkdXJhdGlvbik7XG4gICAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgICAgZWx0Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBhbHQpO1xuICAgICAgICAvLyBGaWdtYSBkaXNzb2x2ZXMgb25seSBkaXNzb2x2ZXMgdGhlIGRlc3RpbmF0aW9uIG9uIHRvcCBvZiB0aGUgc291cmNlIGxheWVyLCBzbyB3ZSBuZWVkIHRvIGRvIHRoZSBzYW1lXG4gICAgICAgIGFuaW1hdGVQcm9wcyhcbiAgICAgICAgICBlbHQsXG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdkaXNwbGF5JyxcbiAgICAgICAgICAgICAgZnJvbTogZ2V0Q29tcHV0ZWRTdHlsZShlbHQpLmRpc3BsYXksXG4gICAgICAgICAgICAgIHRvOiAnbm9uZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgIGNvbnRhaW5lcnNUb1JlT3JkZXJcbiAgICAgICAgKTtcbiAgICAgICAgYW5pbWF0ZVByb3BzKFxuICAgICAgICAgIGFsdCxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ29wYWNpdHknLFxuICAgICAgICAgICAgICBmcm9tOiAwLFxuICAgICAgICAgICAgICB0bzogJ3JldmVydC1sYXllcicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdkaXNwbGF5JyxcbiAgICAgICAgICAgICAgZnJvbTogJ25vbmUnLFxuICAgICAgICAgICAgICB0bzogJ3JldmVydC1sYXllcicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgIGNvbnRhaW5lcnNUb1JlT3JkZXJcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsdC5wYXJlbnRFbGVtZW50IS5yZXBsYWNlQ2hpbGQoYWx0LCBlbHQpO1xuICAgICAgICBsZXQgZWx0VHBsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZChlbHRJZCkpO1xuICAgICAgICBpZiAoIWVsdFRwbCkge1xuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgQmFja2luZyB1cCBlbGVtZW50IGJlZm9yZSBzd2FwLCBpZDogJHtlbHRJZH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gYmFja3VwIGVsZW1lbnQgaW4gY2FzZSB3ZSBuZWVkIHRvIHJldmVydCBiYWNrIHRvIGl0XG4gICAgICAgICAgZWx0VHBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgICAgICBlbHRUcGwuaWQgPSB0ZW1wbGF0ZUlkKGVsdElkKTtcbiAgICAgICAgICBlbHRUcGwuaW5uZXJIVE1MID0gZWx0Lm91dGVySFRNTDtcbiAgICAgICAgICBhbHQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsIGVsdFRwbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWx0VG9BbHRNYXBwaW5ncy5zZXQoZWx0SWQsIGFsdC5pZCk7XG4gICAgICB9XG4gICAgICByZXZlcnNlLnB1c2goe1xuICAgICAgICBlbHRJZDogYWx0LmlkLFxuICAgICAgICBhbHRJZDogZWx0LmlkLFxuICAgICAgfSk7XG4gICAgICAvLyByZS1wb3NpdGlvbiB0aGUgY2hpbGQgYXQgdGhlIHJpZ2h0IHBsYWNlIGluIHRoZSBwYXJlbnRcbiAgICAgIGlmICghaXNOYU4oK2dldENvbXB1dGVkU3R5bGUoYWx0KS5nZXRQcm9wZXJ0eVZhbHVlKCctLWYydy1vcmRlcicpKSkge1xuICAgICAgICBjb250YWluZXJzVG9SZU9yZGVyLmFkZChhbHQucGFyZW50RWxlbWVudCEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjdXJyZW50UHJvcHMgPSAocHJvcHMgfHwgW10pXG4gICAgICAgIC5tYXAoKGl0KSA9PiB7XG4gICAgICAgICAgY29uc3QgZnJvbSA9IG1hcEN1cnJlbnQoZWx0ISwgaXQua2V5LCBpdC5mcm9tKTtcbiAgICAgICAgICBjb25zdCB0byA9IG1hcEN1cnJlbnQoZWx0ISwgaXQua2V5LCBpdC50byk7XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBpdC5rZXksXG4gICAgICAgICAgICBwc2V1ZG86IGl0LnBzZXVkbyxcbiAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICB0byxcbiAgICAgICAgICB9O1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKChpdCkgPT4gaXQuZnJvbSAhPT0gaXQudG8pO1xuXG4gICAgICBhbmltYXRlUHJvcHMoZWx0LCBjdXJyZW50UHJvcHMsIGVhc2luZywgZHVyYXRpb24sIGNvbnRhaW5lcnNUb1JlT3JkZXIpO1xuICAgICAgaWYgKHJlYWN0aW9ucykge1xuICAgICAgICBpZiAodHJpZ2dlciAhPT0gJ2hvdmVyJykge1xuICAgICAgICAgIGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmU/LigpO1xuICAgICAgICB9XG4gICAgICAgIHJlYWN0aW9ucy5mb3JFYWNoKChpdCkgPT4gaG9va0VsdChlbHQhLCBpdC50eXBlLCBpdC50bywgZHVyYXRpb24pKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJldjogQW5pbWF0aW9uID0ge1xuICAgICAgICBlbHRJZCxcbiAgICAgICAgcHJvcHM6IGN1cnJlbnRQcm9wcy5tYXAoKHApID0+IHtcbiAgICAgICAgICBjb25zdCByZXQ6IEFuaW1hdGVkUHJvcCA9IHtcbiAgICAgICAgICAgIGtleTogcC5rZXksXG4gICAgICAgICAgICBmcm9tOiBwLnRvLFxuICAgICAgICAgICAgdG86IHAuZnJvbSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwLnBzZXVkbykgcmV0LnBzZXVkbyA9IHAucHNldWRvO1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICAgIGlmIChyZWFjdGlvbnMpIHtcbiAgICAgICAgcmV2LnJlYWN0aW9ucyA9IHJlYWN0aW9ucy5tYXAoKGl0KSA9PiAoe1xuICAgICAgICAgIHR5cGU6IGl0LnR5cGUsXG4gICAgICAgICAgZnJvbTogaXQudG8sXG4gICAgICAgICAgdG86IGl0LmZyb20sXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldmVyc2UucHVzaChyZXYpO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IGNvbnRhaW5lciBvZiBjb250YWluZXJzVG9SZU9yZGVyKSB7XG4gICAgLy8gVE9ETyBnZW5lcmF0ZSBtaW5pbXVtIHNldCBvZiBtb3ZlcyByZXF1aXJlZD8gKHVzaW5nIGluc2VydEJlZm9yZSBhbmQgc29tZSAnTG9uZ2VzdCBJbmNyZWFzaW5nIFN1YnNlcXVlbmNlJyBhbGdvcml0aG0pXG4gICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikubWFwKChpdCwgaSkgPT4gKHsgaXQsIGkgfSkpO1xuICAgIGxldCBvcmRlckhhc0NoYW5nZWQgPSBmYWxzZTtcbiAgICBjaGlsZHJlblxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYU9yZGVyID0gKyhcbiAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGEuaXQpLmdldFByb3BlcnR5VmFsdWUoJy0tZjJ3LW9yZGVyJykgfHwgJzk5OTk5J1xuICAgICAgICApO1xuICAgICAgICBjb25zdCBiT3JkZXIgPSArKFxuICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoYi5pdCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS1mMnctb3JkZXInKSB8fCAnOTk5OTknXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBhT3JkZXIgLSBiT3JkZXI7XG4gICAgICB9KVxuICAgICAgLmZvckVhY2goKGNoaWxkLCBqKSA9PiB7XG4gICAgICAgIGlmIChvcmRlckhhc0NoYW5nZWQpIHtcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGQuaXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGF2b2lkIG1vdmluZyBhbHJlYWR5IG9yZGVyZWQgZWxlbWVudHMsIHNhdmVzIG1vc3Qgb2YgdGhlIHJlZmxvdyB3aXRob3V0IG11Y2ggY29tcGxleGl0eVxuICAgICAgICAgIG9yZGVySGFzQ2hhbmdlZCA9IGogIT09IGNoaWxkLmk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG4gIHJldHVybiByZXZlcnNlO1xufVxuXG5mdW5jdGlvbiByZW1vdmVQb2ludGVyRXZlbnRzTm9uZShlbHQ6IEJvdW5kRWxlbWVudCk6IHZvaWQge1xuICBsZXQgZTogQm91bmRFbGVtZW50IHwgbnVsbCA9IGVsdDtcbiAgd2hpbGUgKGUpIHtcbiAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ3BvaW50ZXItZXZlbnRzLW5vbmUnKTtcbiAgICBlID0gZS5wYXJlbnRFbGVtZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVEcmFnU3RhcnQoXG4gIGFuaW1hdGlvbnM6IEFuaW1hdGlvbltdLFxuICBlYXNpbmc6IHN0cmluZyxcbiAgZHVyYXRpb246IG51bWJlcixcbiAgYm91bmQ6IEJvdW5kRWxlbWVudCxcbiAgZHJhZ2dpbmc6IERyYWdnaW5nXG4pOiB2b2lkIHtcbiAgaWYgKGRyYWdnaW5nLmhhbmRsZWQpIHJldHVybjtcbiAgLy8gdGVtcG9yYXJ5IGV4ZWN1dGUgYW5pbWF0aW9ucyB0byBnZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gc3RhcnQgYW5kIGVuZFxuICBjb25zdCByZWN0MSA9IGJvdW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCByZXYgPSBleGVjdXRlQW5pbWF0aW9ucyhcbiAgICBhbmltYXRpb25zXG4gICAgICAuZmlsdGVyKChpdCkgPT4gaXQucHJvcHMpXG4gICAgICAubWFwKCh7IGVsdElkLCBwcm9wcyB9KSA9PiAoeyBlbHRJZCwgcHJvcHMgfSkpLFxuICAgICdsaW5lYXInLFxuICAgIDAsXG4gICAgYm91bmQsXG4gICAgJ2NsaWNrJyxcbiAgICBgZHJhZ19zdGFydCh0bXApYFxuICApO1xuICBjb25zdCByZWN0MiA9IGJvdW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBkaWZmWCA9IHJlY3QyLmxlZnQgLSByZWN0MS5sZWZ0O1xuICBjb25zdCBkaWZmWSA9IHJlY3QyLnRvcCAtIHJlY3QxLnRvcDtcbiAgY29uc3QgbGVuZ3RoID0gTWF0aC5zcXJ0KGRpZmZYICogZGlmZlggKyBkaWZmWSAqIGRpZmZZKTtcbiAgLy8gcmV2ZXJ0IHRlbXAgY2hhbmdlc1xuICBleGVjdXRlQW5pbWF0aW9ucyhyZXYsICdsaW5lYXInLCAwLCBib3VuZCwgJ2NsaWNrJywgYGRyYWdfc3RhcnQodG1wIHVuZG8pYCk7XG4gIGNvbnN0IHsgeDogZGlzdFgsIHk6IGRpc3RZIH0gPSBnZXREaXN0YW5jZShkcmFnZ2luZy5zdGFydCwgZHJhZ2dpbmcuZW5kKTtcbiAgY29uc3QgYWNjZXB0c0RyYWdEaXJlY3Rpb24gPVxuICAgIChkaXN0WCA+IDAgJiYgZGlmZlggPiAwKSB8fFxuICAgIChkaXN0WCA8IDAgJiYgZGlmZlggPCAwKSB8fFxuICAgIChkaWZmWCA9PT0gMCAmJiAoKGRpc3RZID4gMCAmJiBkaWZmWSA+IDApIHx8IChkaXN0WSA8IDAgJiYgZGlmZlkgPCAwKSkpO1xuICBpZiAoYWNjZXB0c0RyYWdEaXJlY3Rpb24pIHtcbiAgICBkcmFnZ2luZy5oYW5kbGVkID0gdHJ1ZTtcbiAgICBjb25zdCBkcmFnQW5pbXMgPSBhbmltYXRpb25zLm1hcCgoaXQpID0+ICh7XG4gICAgICAuLi5pdCxcbiAgICAgIHN3YXBwZWQ6IGZhbHNlLFxuICAgICAgcHJvcHM6IGl0LnByb3BzPy5tYXAoKHApID0+ICh7IC4uLnAsIGN1cnI6IHAuZnJvbSB9KSksXG4gICAgfSkpO1xuICAgIGNvbnN0IGdldFBlcmNlbnQgPSAoZDogRHJhZ2dpbmcpOiBudW1iZXIgPT4ge1xuICAgICAgY29uc3QgeyB4OiBkaXN0WCwgeTogZGlzdFkgfSA9IGdldERpc3RhbmNlKGQuc3RhcnQsIGQuZW5kKTtcbiAgICAgIGNvbnN0IGRpc3QgPSAoZGlzdFggKiBkaWZmWCArIGRpc3RZICogZGlmZlkpIC8gbGVuZ3RoO1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgKDEwMCAqIGRpc3QpIC8gbGVuZ3RoKSk7XG4gICAgfTtcbiAgICBjb25zdCBtb3ZlID0gKGQ6IERyYWdnaW5nKTogdm9pZCA9PiB7XG4gICAgICBkLmVuZC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZC5lbmQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCBwZXJjZW50ID0gZ2V0UGVyY2VudChkKTtcbiAgICAgIGV4ZWN1dGVBbmltYXRpb25zKFxuICAgICAgICBmaWx0ZXJFbXB0eShcbiAgICAgICAgICBkcmFnQW5pbXMubWFwKChpdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByZWFjdGlvbnM6IF8sIC4uLnJlc3QgfSA9IGl0O1xuICAgICAgICAgICAgaWYgKGl0LnByb3BzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4ucmVzdCxcbiAgICAgICAgICAgICAgICBwcm9wczogaXQucHJvcHMubWFwKChwKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCB0byA9IGludGVycG9sYXRlKHAsIHBlcmNlbnQpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgZnJvbSA9IHAuY3VycjtcbiAgICAgICAgICAgICAgICAgIHAuY3VyciA9IHRvO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgLi4ucCxcbiAgICAgICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgdG8sXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0LmFsdElkKSB7XG4gICAgICAgICAgICAgIGlmIChwZXJjZW50IDwgNTAgJiYgaXQuc3dhcHBlZCkge1xuICAgICAgICAgICAgICAgIGl0LnN3YXBwZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBhbHRJZDogaXQuZWx0SWQsIGVsdElkOiBpdC5hbHRJZCB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChwZXJjZW50ID49IDUwICYmICFpdC5zd2FwcGVkKSB7XG4gICAgICAgICAgICAgICAgaXQuc3dhcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgICAgJ2xpbmVhcicsXG4gICAgICAgIDAsXG4gICAgICAgIGJvdW5kLFxuICAgICAgICAnY2xpY2snLFxuICAgICAgICBgZHJhZ2dpbmdgXG4gICAgICApO1xuICAgIH07XG4gICAgbW92ZShkcmFnZ2luZyk7XG4gICAgYm91bmQuZjJ3X2RyYWdfbGlzdGVuZXIgPSAoZDogRHJhZ2dpbmcpID0+IHtcbiAgICAgIG1vdmUoZCk7XG4gICAgICBpZiAoZC5maW5pc2hlZCkge1xuICAgICAgICBjb25zdCBwZXJjZW50ID0gZ2V0UGVyY2VudChkKTtcbiAgICAgICAgZXhlY3V0ZUFuaW1hdGlvbnMoXG4gICAgICAgICAgZmlsdGVyRW1wdHkoXG4gICAgICAgICAgICBkcmFnQW5pbXMubWFwKChpdCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoaXQucHJvcHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFjdGlvbnMgPSBwZXJjZW50IDwgNTAgPyB1bmRlZmluZWQgOiBpdC5yZWFjdGlvbnM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIGVsdElkOiBpdC5lbHRJZCxcbiAgICAgICAgICAgICAgICAgIHByb3BzOiBpdC5wcm9wcy5tYXAoKHApID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIC4uLnAsXG4gICAgICAgICAgICAgICAgICAgIGZyb206IHAuY3VycixcbiAgICAgICAgICAgICAgICAgICAgdG86IHBlcmNlbnQgPCA1MCA/IHAuZnJvbSA6IHAudG8sXG4gICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgICByZWFjdGlvbnMsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaXQuYWx0SWQpIHtcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA8IDUwICYmIGl0LnN3YXBwZWQpIHtcbiAgICAgICAgICAgICAgICAgIGl0LnN3YXBwZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFsdElkOiBpdC5lbHRJZCwgZWx0SWQ6IGl0LmFsdElkIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50ID49IDUwICYmICFpdC5zd2FwcGVkKSB7XG4gICAgICAgICAgICAgICAgICBpdC5zd2FwcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBpdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKSxcbiAgICAgICAgICBlYXNpbmcsXG4gICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgYm91bmQsXG4gICAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgICBgZHJhZ19lbmRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBDdXJyZW50KFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAga2V5OiBzdHJpbmcsXG4gIHY6IEFuaW1hdGVkUHJvcFsnZnJvbSddXG4pOiBBbmltYXRlZFByb3BbJ2Zyb20nXSB7XG4gIGlmICh2ICE9PSAnJGN1cnJlbnQnKSByZXR1cm4gdjtcbiAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUoZWx0KS5nZXRQcm9wZXJ0eVZhbHVlKGtleSk7XG59XG5cbmZ1bmN0aW9uIGhvb2soXG4gIHJvb3Q6IFBhcmVudE5vZGUsXG4gIHdpdGhSb290ID0gZmFsc2UsXG4gIGZyb21BbmltYXRpb25EdXJhdGlvbiA9IDBcbik6IHZvaWQge1xuICBmb3IgKGNvbnN0IHR5cGUgb2YgcmVhY3Rpb25fdHlwZXMpIHtcbiAgICBmb3IgKGNvbnN0IGVsdCBvZiBxdWVyeVNlbGVjdG9yQWxsRXh0KFxuICAgICAgcm9vdCBhcyBCb3VuZEVsZW1lbnQsXG4gICAgICBgW2RhdGEtcmVhY3Rpb24tJHt0eXBlfV1gLFxuICAgICAgd2l0aFJvb3RcbiAgICApKSB7XG4gICAgICBob29rRWx0KFxuICAgICAgICBlbHQgYXMgQm91bmRFbGVtZW50LFxuICAgICAgICB0eXBlLFxuICAgICAgICBlbHQuZ2V0QXR0cmlidXRlKGBkYXRhLXJlYWN0aW9uLSR7dHlwZX1gKSEsXG4gICAgICAgIGZyb21BbmltYXRpb25EdXJhdGlvblxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcXVlcnlTZWxlY3RvckFsbEV4dChcbiAgcm9vdDogQm91bmRFbGVtZW50LFxuICBzZWw6IHN0cmluZyxcbiAgaW5jbHVkZVJvb3QgPSBmYWxzZVxuKTogQm91bmRFbGVtZW50W10ge1xuICBjb25zdCByZXQgPSBbLi4ucm9vdC5xdWVyeVNlbGVjdG9yQWxsKHNlbCldIGFzIEJvdW5kRWxlbWVudFtdO1xuICBpZiAoaW5jbHVkZVJvb3QgJiYgcm9vdC5tYXRjaGVzKHNlbCkpIHtcbiAgICByZXQudW5zaGlmdChyb290KTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG50eXBlIFRyaWdnZXJFdmVudCA9IEtleWJvYXJkRXZlbnQgfCBNb3VzZUV2ZW50IHwgRHJhZ0V2ZW50O1xuXG5mdW5jdGlvbiBob29rRWx0KFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgdHlwZTogVHJpZ2dlclR5cGUsXG4gIHYgPSAnJyxcbiAgZnJvbUFuaW1hdGlvbkR1cmF0aW9uID0gMFxuKTogdm9pZCB7XG4gIGlmICghdikge1xuICAgIGlmICh0eXBlICE9PSAnaG92ZXInKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgQ2xlYW51cCBob29rcyAke3R5cGV9IG9uYCwgZWx0KTtcbiAgICAgIH1cbiAgICAgIGNsZWFudXBFdmVudExpc3RlbmVyKGVsdCwgdHlwZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIGxldCBkZWxheSA9IDA7XG4gIGlmICh2WzBdID09PSAnVCcpIHtcbiAgICBjb25zdCBpZHggPSB2LmluZGV4T2YoJ21zJyk7XG4gICAgZGVsYXkgPSBwYXJzZUZsb2F0KHYuc2xpY2UoMSwgaWR4KSkgfHwgMDtcbiAgICB2ID0gdi5zbGljZShpZHggKyAzKTtcbiAgfVxuICBjb25zdCByZWFjdGlvbnMgPSBhbGxSZWFjdGlvbnMoKTtcbiAgY29uc3QgYWN0aW9ucyA9IGZpbHRlckVtcHR5KHYuc3BsaXQoJywnKS5tYXAoKGlkKSA9PiByZWFjdGlvbnNbaWRdKSk7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGNvbnNvbGUuZGVidWcoYFNldHVwIGhvb2sgJHt0eXBlfSBvbmAsIGVsdCwgYC0+YCwgYWN0aW9ucyk7XG4gIH1cbiAgY29uc3QgcnVuID0gYWN0aW9uc1RvUnVuKGFjdGlvbnMsIGVsdCwgdHlwZSk7XG4gIGlmICh0eXBlID09PSAndGltZW91dCcpIHtcbiAgICBzZXRUaW1lb3V0V2l0aENsZWFudXAoZWx0LCAoKSA9PiBydW4oKSwgZGVsYXkgKyBmcm9tQW5pbWF0aW9uRHVyYXRpb24pO1xuICAgIHJldHVybjtcbiAgfVxuICByZW1vdmVQb2ludGVyRXZlbnRzTm9uZShlbHQpO1xuICBpZiAodHlwZSA9PT0gJ3ByZXNzJykge1xuICAgIC8vIG5vIGRlbGF5IGZvciBwcmVzc1xuICAgIGxldCByZXZlcnQ6IEV2ZW50Q2FsbGJhY2sgfCB1bmRlZmluZWQgfCB2b2lkID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IG1vdXNldXAgPSAoKTogdm9pZCA9PiB7XG4gICAgICByZXZlcnQ/LigpO1xuICAgICAgcmV2ZXJ0ID0gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgZWx0LmYyd19tb3VzZXVwID0gbW91c2V1cDtcbiAgICBhZGRFdmVudExpc3RlbmVyV2l0aENsZWFudXAoXG4gICAgICBlbHQsXG4gICAgICAnbW91c2Vkb3duJyxcbiAgICAgIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHJldmVydD8uKCk7XG4gICAgICAgIHJldmVydCA9IHJ1bihlKTtcbiAgICAgIH0sXG4gICAgICB0eXBlLFxuICAgICAgYXR0YWNoTGlzdGVuZXIoZWx0LCAnbW91c2V1cCcsIG1vdXNldXApXG4gICAgKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnZHJhZycpIHtcbiAgICBhZGRFdmVudExpc3RlbmVyV2l0aENsZWFudXAoXG4gICAgICBlbHQsXG4gICAgICAnZHJhZ2dpbmcnIGFzIGFueSxcbiAgICAgIChlOiBDdXN0b21FdmVudDxEcmFnZ2luZz4pID0+IHtcbiAgICAgICAgcnVuKGUpO1xuICAgICAgfSxcbiAgICAgIHR5cGVcbiAgICApO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdob3ZlcicpIHtcbiAgICAvLyBubyBkZWxheSBmb3IgaG92ZXJcbiAgICBsZXQgcmV2ZXJ0OiBFdmVudENhbGxiYWNrIHwgdW5kZWZpbmVkIHwgdm9pZCA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBydW5JZk5vdEFscmVhZHkgPSAoZT86IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmV2ZXJ0KSByZXZlcnQgPSBvbmNlKHJ1bihlKSk7XG4gICAgfTtcbiAgICBjb25zdCBwcmV2ID0gZWx0LmYyd19tb3VzZWxlYXZlX3JlbW92ZT8uKCk7XG4gICAgY29uc3QgbW91c2VsZWF2ZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHJldmVydD8uKCk7XG4gICAgICByZXZlcnQgPSB1bmRlZmluZWQ7XG4gICAgICBwcmV2Py4oKTtcbiAgICB9O1xuICAgIC8vIGlmIHRoZSBtb3VzZSBpcyBhbHJlYWR5IG9uIGl0LCAnZW50ZXInIHdvbid0IGZpcmUgYWdhaW4sIGVuc3VyZSB3ZSBnZXQgdHJpZ2dlcmVkIGFzIHNvb24gYXMgdGhlIG1vdXNlIG1vdmVzXG4gICAgY29uc3QgdGltZXJJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKGVsdC5tYXRjaGVzKCc6aG92ZXInKSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgIXJldmVydCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBGb3JjaW5nIGhvdmVyIG9uIHRpbWVvdXRgKTtcbiAgICAgICAgfVxuICAgICAgICBydW5JZk5vdEFscmVhZHkoKTtcbiAgICAgIH1cbiAgICB9LCBmcm9tQW5pbWF0aW9uRHVyYXRpb24pO1xuICAgIGNvbnN0IG1vdXNlbGVhdmVfcmVtb3ZlID0gaW5zdGFsbE1vdXNlTGVhdmUoZWx0LCBtb3VzZWxlYXZlLCB0aW1lcklkKTtcbiAgICBhZGRFdmVudExpc3RlbmVyV2l0aENsZWFudXAoXG4gICAgICBlbHQsXG4gICAgICAnbW91c2VlbnRlcicsXG4gICAgICBydW5JZk5vdEFscmVhZHksXG4gICAgICB0eXBlLFxuICAgICAgbW91c2VsZWF2ZV9yZW1vdmVcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlID09PSAna2V5ZG93bicgJiYgIWVsdC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgIC8vIHRhYmluZGV4IHJlcXVpcmVkIHRvIGNhcHR1cmUga2V5ZG93blxuICAgICAgZWx0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdhcHBlYXInKSB7XG4gICAgICBhcHBlYXJPYnNlcnZlci5vYnNlcnZlKGVsdCk7XG4gICAgfVxuICAgIGFkZEV2ZW50TGlzdGVuZXJXaXRoQ2xlYW51cChcbiAgICAgIGVsdCxcbiAgICAgIHR5cGUgYXMgYW55LFxuICAgICAgKGU6IFRyaWdnZXJFdmVudCkgPT4ge1xuICAgICAgICBpZiAodHlwZSAhPT0gJ2tleWRvd24nKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgdXNlIGUucHJldmVudERlZmF1bHQgYmVjYXVzZSB0YXJnZXQgZWxlbWVudHMgY2FuIGNvbnRhaW4gbmVzdGVkIGNoaWxkcmVuLFxuICAgICAgICAgIC8vIGkuZSBhbmNob3IgdGFncyBpbnNpZGUgYW4gb3ZlcmxheSB3aGljaCB3aWxsIGJyZWFrIGlmIHdlIGRvIGUucHJldmVudERlZmF1bHQuXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPIGNvbmZpcm0gd2hldGhlciBhIGRlbGF5ZWQgZXZlbnQgY2FuIGJlIGNhbmNlbGVkIGJ5IHN3YXBwaW5nIG9yIG5vdCAoaW4gd2hpY2ggY2FzZSBzaG91bGQgY2FuY2VsIHRoZSB0aW1lb3V0KVxuICAgICAgICBpZiAoZGVsYXkpIHNldFRpbWVvdXQoKCkgPT4gcnVuKGUpLCBkZWxheSk7XG4gICAgICAgIGVsc2UgcnVuKGUpO1xuICAgICAgfSxcbiAgICAgIHR5cGVcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluc3RhbGxNb3VzZUxlYXZlKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgbW91c2VsZWF2ZTogKCkgPT4gdm9pZCxcbiAgdGltZXJJZCA9IDBcbik6ICgpID0+ICgpID0+IHZvaWQge1xuICBjb25zdCB1bnN1YiA9IGF0dGFjaExpc3RlbmVyKGVsdCwgJ21vdXNlbGVhdmUnLCBtb3VzZWxlYXZlKTtcbiAgY29uc3QgbW91c2VsZWF2ZV9yZW1vdmUgPSAoKTogKCgpID0+IHZvaWQpID0+IHtcbiAgICB1bnN1YigpO1xuICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICBpZiAoZWx0LmYyd19tb3VzZWxlYXZlID09PSBtb3VzZWxlYXZlKSBkZWxldGUgZWx0LmYyd19tb3VzZWxlYXZlO1xuICAgIGlmIChlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlID09PSBtb3VzZWxlYXZlX3JlbW92ZSlcbiAgICAgIGRlbGV0ZSBlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlO1xuICAgIHJldHVybiBtb3VzZWxlYXZlO1xuICB9O1xuICBlbHQuZjJ3X21vdXNlbGVhdmUgPSBtb3VzZWxlYXZlO1xuICByZXR1cm4gKGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmUgPSBtb3VzZWxlYXZlX3JlbW92ZSk7XG59XG5cbmZ1bmN0aW9uIGlzT3V0c2lkZShcbiAgeyBjbGllbnRYLCBjbGllbnRZIH06IFBpY2s8TW91c2VFdmVudCwgJ2NsaWVudFgnIHwgJ2NsaWVudFknPixcbiAgYm91bmQ6IEJvdW5kRWxlbWVudFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IEJPVU5EU19YVFJBX1BJWEVMUyA9IDI7XG4gIGNvbnN0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tIH0gPSBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcmV0dXJuIChcbiAgICBjbGllbnRYID4gcmlnaHQgKyBCT1VORFNfWFRSQV9QSVhFTFMgfHxcbiAgICBjbGllbnRYIDwgbGVmdCAtIEJPVU5EU19YVFJBX1BJWEVMUyB8fFxuICAgIGNsaWVudFkgPiBib3R0b20gKyBCT1VORFNfWFRSQV9QSVhFTFMgfHxcbiAgICBjbGllbnRZIDwgdG9wIC0gQk9VTkRTX1hUUkFfUElYRUxTXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNsZWFudXBGbktleUZvclR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBmMndfY2xlYW51cF8ke3R5cGV9YDtcbn1cblxuZnVuY3Rpb24gc2V0VGltZW91dFdpdGhDbGVhbnVwKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgZm46ICgpID0+IHZvaWQsXG4gIGRlbGF5OiBudW1iZXJcbik6IHZvaWQge1xuICBjb25zdCB0aW1lcklkID0gc2V0VGltZW91dChmbiwgZGVsYXkpO1xuICBlbHQuZjJ3X2NsZWFudXBfdGltZW91dD8uKCk7XG4gIGVsdC5mMndfY2xlYW51cF90aW1lb3V0ID0gKCkgPT4ge1xuICAgIGRlbGV0ZSBlbHQuZjJ3X2NsZWFudXBfdGltZW91dDtcbiAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsZWFudXBFdmVudExpc3RlbmVyKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgdHlwZUZvckNsZWFudXA6IFRyaWdnZXJUeXBlXG4pOiB2b2lkIHtcbiAgY29uc3QgY2xlYW51cEtleSA9IGNsZWFudXBGbktleUZvclR5cGUodHlwZUZvckNsZWFudXApO1xuICAoZWx0IGFzIGFueSlbY2xlYW51cEtleV0/LigpO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyV2l0aENsZWFudXA8XG4gIEsgZXh0ZW5kcyBrZXlvZiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXAsXG4+KFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgdHlwZTogSyxcbiAgbGlzdGVuZXI6IChldjogR2xvYmFsRXZlbnRIYW5kbGVyc0V2ZW50TWFwW0tdKSA9PiBhbnksXG4gIHR5cGVGb3JDbGVhbnVwOiBUcmlnZ2VyVHlwZSxcbiAgLi4uZXh0cmFDbGVhbnVwRm5zOiBDbGVhbnVwRm5bXVxuKTogdm9pZCB7XG4gIGNvbnN0IGNsZWFudXBzID0gWy4uLmV4dHJhQ2xlYW51cEZucywgYXR0YWNoTGlzdGVuZXIoZWx0LCB0eXBlLCBsaXN0ZW5lcildO1xuICBjb25zdCBjbGVhbnVwS2V5ID0gY2xlYW51cEZuS2V5Rm9yVHlwZSh0eXBlRm9yQ2xlYW51cCk7XG4gIChlbHQgYXMgYW55KVtjbGVhbnVwS2V5XT8uKCk7XG4gIChlbHQgYXMgYW55KVtjbGVhbnVwS2V5XSA9ICgpID0+IHtcbiAgICBkZWxldGUgKGVsdCBhcyBhbnkpW2NsZWFudXBLZXldO1xuICAgIGNsZWFudXBzLmZvckVhY2goKGl0KSA9PiBpdCgpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0YWNoTGlzdGVuZXI8SyBleHRlbmRzIGtleW9mIEdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE1hcD4oXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICB0eXBlOiBLLFxuICBsaXN0ZW5lcjogKGV2OiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXBbS10pID0+IGFueSxcbiAgb3B0aW9ucz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9uc1xuKTogQ2xlYW51cEZuIHtcbiAgY29uc3QgbXlfbGlzdGVuZXI6IHR5cGVvZiBsaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmIHR5cGUgIT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKFxuICAgICAgICBgJHtlbHQuaXNDb25uZWN0ZWQgPyAnSGFuZGxpbmcnIDogJ0lnbm9yaW5nJ30gJHt0eXBlfSBvbmAsXG4gICAgICAgIGUudGFyZ2V0XG4gICAgICApO1xuICAgIH1cbiAgICAvLyBNYXliZSBzaG91bGQgcHJldmVudERlZmF1bHQvc3RvcFByb3BhZ2F0aW9uIHRvIGF2b2lkIGdldHRpbmcgZXZlbnRzIG9uIHJlbW92ZWQgZWxlbWVudHM/XG4gICAgaWYgKCFlbHQuaXNDb25uZWN0ZWQpIHJldHVybjtcbiAgICBsaXN0ZW5lcihlKTtcbiAgfTtcbiAgLy8gQHRzLWlnbm9yZVxuICBlbHQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBteV9saXN0ZW5lciwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGVsdC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIG15X2xpc3RlbmVyLCBvcHRpb25zKTtcbiAgfTtcbn1cblxuLy8gRm9yIGVhY2ggY29sbGVjdGlvbiB3ZSBzZXQgdGhlIGN1cnJlbnQgY29sb3Igc2NoZW1lL21vZGVcbmNvbnN0IENPTE9SX1NDSEVNRV9LRVkgPSAnZjJ3LWNvbG9yLXNjaGVtZSc7XG5jb25zdCBMQU5HX0tFWSA9ICdmMnctbGFuZyc7XG53aW5kb3cuRjJXX1RIRU1FX1NXSVRDSCA9ICh0aGVtZSkgPT5cbiAgd2luZG93LkYyV19DT0xPUl9TQ0hFTUVTPy5mb3JFYWNoKChjb2xOYW1lKSA9PlxuICAgIHNldENvbGxlY3Rpb25BdHRyQW5kVmFyaWFibGVzKGNvbE5hbWUsIHRoZW1lKVxuICApO1xuXG5pZiAod2luZG93LkYyV19DT0xPUl9TQ0hFTUVTKSB7XG4gIGNvbnN0IG1hdGNoTWVkaWFRdWVyeSA9IG1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzO1xuICBjb25zdCBzeXN0ZW1QcmVmZXJlbmNlID0gbWF0Y2hNZWRpYVF1ZXJ5ID8gJ2RhcmsnIDogJ2xpZ2h0JztcbiAgY29uc3QgdXNlclByZWZlcmVuY2UgPSBsb2NhbFN0b3JhZ2U/LmdldEl0ZW0oQ09MT1JfU0NIRU1FX0tFWSk7XG4gIG9uQ29ubmVjdGVkKCdib2R5JywgKCkgPT4ge1xuICAgIGNvbnN0IHByZXZpZXdQcmVmZXJlbmNlID0gZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlldy10aGVtZScpO1xuICAgIGNvbnN0IGNvbG9yU2NoZW1lID0gcHJldmlld1ByZWZlcmVuY2UgPz8gdXNlclByZWZlcmVuY2UgPz8gc3lzdGVtUHJlZmVyZW5jZTtcbiAgICB3aW5kb3cuRjJXX1RIRU1FX1NXSVRDSD8uKGNvbG9yU2NoZW1lKTtcbiAgfSk7XG59XG5pZiAod2luZG93LkYyV19MQU5HVUFHRVMpIHtcbiAgbGV0IHVzZXJQcmVmZXJlbmNlID0gbG9jYWxTdG9yYWdlPy5nZXRJdGVtKExBTkdfS0VZKTtcbiAgb25Db25uZWN0ZWQoJ2JvZHknLCAoKSA9PiB7XG4gICAgY29uc3QgYWx0ZXJuYXRlcyA9IEFycmF5LmZyb20oXG4gICAgICBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwiYWx0ZXJuYXRlXCJdJylcbiAgICApO1xuICAgIGNvbnN0IGlzRGVmYXVsdCA9XG4gICAgICBhbHRlcm5hdGVzLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgYWx0ZXJuYXRlcy5zb21lKFxuICAgICAgICAoaXQpID0+XG4gICAgICAgICAgaXQuZ2V0QXR0cmlidXRlKCdocmVmbGFuZycpID09PSAneC1kZWZhdWx0JyAmJlxuICAgICAgICAgIGl0LmdldEF0dHJpYnV0ZSgnaHJlZicpID09PSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgICAgKTtcbiAgICBpZiAoIWlzRGVmYXVsdCkge1xuICAgICAgLy8gcGFnZSB1cmwgaXMgL2ZyL2Zvbywgc2F2ZSB0aGUgbGFuZyBzbyB0aGF0IG5hdmlnYXRpb24gcmV0YWluIHRoZSBzYW1lIGxhbmd1YWdlXG4gICAgICB1c2VyUHJlZmVyZW5jZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nO1xuICAgIH1cbiAgICBjb25zdCBpczQwNCA9IGRvY3VtZW50LmhlYWRcbiAgICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxMaW5rRWxlbWVudD4oJ2xpbmtbcmVsPVwiY2Fub25pY2FsXCJdJylcbiAgICAgID8uaHJlZj8uZW5kc1dpdGgoJy80MDQvJyk7XG4gICAgd2luZG93LkYyV19MQU5HVUFHRVM/LmZvckVhY2goKGNvbE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGNob2ljZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGdldENvbE1vZGVzKGNvbE5hbWUpKS5tYXAoKFtrXSkgPT4gW2sudG9Mb3dlckNhc2UoKSwga10pXG4gICAgICApO1xuICAgICAgY29uc3QgbGFuZ3MgPSBbLi4ubmF2aWdhdG9yLmxhbmd1YWdlc107XG4gICAgICBpZiAodXNlclByZWZlcmVuY2UpIGxhbmdzLnVuc2hpZnQodXNlclByZWZlcmVuY2UpO1xuICAgICAgZm9yIChsZXQgbGFuZyBvZiBsYW5ncykge1xuICAgICAgICBsYW5nID0gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBjb2RlID0gbGFuZy5zcGxpdCgnLScpWzBdO1xuICAgICAgICBjb25zdCBtb2RlVmFsdWUgPSBjaG9pY2VzW2xhbmddID8/IGNob2ljZXNbY29kZV07XG4gICAgICAgIGlmIChtb2RlVmFsdWUpIHtcbiAgICAgICAgICBzZXRDb2xsZWN0aW9uQXR0ckFuZFZhcmlhYmxlcyhjb2xOYW1lLCBtb2RlVmFsdWUpO1xuICAgICAgICAgIGlmICghaXM0MDQpIHNhdmVNb2RlKGNvbE5hbWUsIG1vZGVWYWx1ZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uTW9kZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbmNvbnN0IGNvbGxlY3Rpb25Nb2RlQnBzU29ydGVkID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICBPYmplY3QuZW50cmllcyhjb2xsZWN0aW9uTW9kZUJwcygpKS5tYXAoKFtrLCB2XSkgPT4gW1xuICAgIGssXG4gICAgT2JqZWN0LmVudHJpZXModikubWFwKChbbmFtZSwgeyBtaW5XaWR0aCB9XSkgPT4gKHsgbmFtZSwgbWluV2lkdGggfSkpLFxuICBdKVxuKTtcbmZ1bmN0aW9uIHVwZGF0ZUNvbGxlY3Rpb25Nb2RlcygpOiB2b2lkIHtcbiAgY29uc3Qgd2lkdGggPSB3aW5kb3cudmlzdWFsVmlld3BvcnQ/LndpZHRoIHx8IHdpbmRvdy5pbm5lcldpZHRoO1xuICBmb3IgKGNvbnN0IFtjb2xsZWN0aW9uTmFtZSwgYnJlYWtwb2ludHNdIG9mIE9iamVjdC5lbnRyaWVzKFxuICAgIGNvbGxlY3Rpb25Nb2RlQnBzU29ydGVkXG4gICkpIHtcbiAgICBjb25zdCBicHMgPSBbLi4uYnJlYWtwb2ludHNdO1xuICAgIGxldCBuZXdNb2RlID0gYnBzLnNwbGljZSgwLCAxKVswXS5uYW1lO1xuICAgIGZvciAoY29uc3QgeyBuYW1lLCBtaW5XaWR0aCB9IG9mIGJwcykge1xuICAgICAgaWYgKHdpZHRoID49IG1pbldpZHRoKSBuZXdNb2RlID0gbmFtZTtcbiAgICB9XG4gICAgaWYgKG5ld01vZGUgIT09IGN1cnJlbnRDb2xsZWN0aW9uTW9kZXNbY29sbGVjdGlvbk5hbWVdKSB7XG4gICAgICBzZXRDb2xsZWN0aW9uQXR0ckFuZFZhcmlhYmxlcyhjb2xsZWN0aW9uTmFtZSwgbmV3TW9kZSk7XG4gICAgICBjdXJyZW50Q29sbGVjdGlvbk1vZGVzW2NvbGxlY3Rpb25OYW1lXSA9IG5ld01vZGU7XG4gICAgfVxuICB9XG59XG5cbmxldCBkcmFnX3N0YXJ0ZWQgPSBmYWxzZTtcbm9uQ29ubmVjdGVkKCdib2R5JywgKCkgPT4ge1xuICBsZXQgZHJhZ19zdGFydDogTW91c2VFdmVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgbGV0IHN1cHByZXNzX2NsaWNrID0gZmFsc2U7XG4gIGF0dGFjaExpc3RlbmVyKGRvY3VtZW50IGFzIGFueSwgJ21vdXNlZG93bicsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgZHJhZ19zdGFydCA9IGU7XG4gICAgZHJhZ19zdGFydGVkID0gZmFsc2U7XG4gIH0pO1xuICBhdHRhY2hMaXN0ZW5lcihkb2N1bWVudCBhcyBhbnksICdtb3VzZW1vdmUnLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGlmIChkcmFnX3N0YXJ0ICYmIGdldERpc3RhbmNlKGRyYWdfc3RhcnQsIGUpLmRpc3QgPiAyKSB7XG4gICAgICBjb25zdCBkcmFnZ2luZzogRHJhZ2dpbmcgPSB7XG4gICAgICAgIHN0YXJ0OiBkcmFnX3N0YXJ0LFxuICAgICAgICBlbmQ6IGUsXG4gICAgICB9O1xuICAgICAgaWYgKCFkcmFnX3N0YXJ0ZWQpIHtcbiAgICAgICAgZHJhZ19zdGFydC50YXJnZXQ/LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgbmV3IEN1c3RvbUV2ZW50PERyYWdnaW5nPignZHJhZ2dpbmcnLCB7IGRldGFpbDogZHJhZ2dpbmcgfSlcbiAgICAgICAgKTtcbiAgICAgICAgZHJhZ19zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgc3VwcHJlc3NfY2xpY2sgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKGRyYWdfc3RhcnQudGFyZ2V0IGFzIEJvdW5kRWxlbWVudCk/LmYyd19kcmFnX2xpc3RlbmVyPy4oZHJhZ2dpbmcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGF0dGFjaExpc3RlbmVyKGRvY3VtZW50IGFzIGFueSwgJ21vdXNldXAnLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGlmIChkcmFnX3N0YXJ0ICYmIGRyYWdfc3RhcnRlZCkge1xuICAgICAgKGRyYWdfc3RhcnQudGFyZ2V0IGFzIEJvdW5kRWxlbWVudCk/LmYyd19kcmFnX2xpc3RlbmVyPy4oe1xuICAgICAgICBzdGFydDogZHJhZ19zdGFydCxcbiAgICAgICAgZW5kOiBlLFxuICAgICAgICBmaW5pc2hlZDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkcmFnX3N0YXJ0ID0gdW5kZWZpbmVkO1xuICAgIGRyYWdfc3RhcnRlZCA9IGZhbHNlO1xuICB9KTtcbiAgYXR0YWNoTGlzdGVuZXIoZG9jdW1lbnQgYXMgYW55LCAnbW91c2V1cCcsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKGRyYWdfc3RhcnQgJiYgZHJhZ19zdGFydGVkKSB7XG4gICAgICAoZHJhZ19zdGFydC50YXJnZXQgYXMgQm91bmRFbGVtZW50KT8uZjJ3X2RyYWdfbGlzdGVuZXI/Lih7XG4gICAgICAgIHN0YXJ0OiBkcmFnX3N0YXJ0LFxuICAgICAgICBlbmQ6IGUsXG4gICAgICAgIGZpbmlzaGVkOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGRyYWdfc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgZHJhZ19zdGFydGVkID0gZmFsc2U7XG4gIH0pO1xuICBhdHRhY2hMaXN0ZW5lcihcbiAgICBkb2N1bWVudCBhcyBhbnksXG4gICAgJ2NsaWNrJyxcbiAgICAoZSkgPT4ge1xuICAgICAgaWYgKHN1cHByZXNzX2NsaWNrKSB7XG4gICAgICAgIHN1cHByZXNzX2NsaWNrID0gZmFsc2U7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgY2FwdHVyZTogdHJ1ZSB9XG4gICk7XG4gIHVwZGF0ZUNvbGxlY3Rpb25Nb2RlcygpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlQ29sbGVjdGlvbk1vZGVzKTtcbn0pO1xuXG5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gaG9vayhkb2N1bWVudCkpO1xuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaWYgKCdtZWRpdW1ab29tJyBpbiB3aW5kb3cpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qgem9vbSA9IG1lZGl1bVpvb20oJ1tkYXRhLXpvb21hYmxlXScpO1xuICAgIHpvb20ub24oJ29wZW4nLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgb2JqZWN0Rml0ID0gZ2V0Q29tcHV0ZWRTdHlsZShldmVudC50YXJnZXQpLm9iamVjdEZpdDtcbiAgICAgIGNvbnN0IHpvb21lZCA9IGV2ZW50LmRldGFpbC56b29tLmdldFpvb21lZEltYWdlKCk7XG4gICAgICAvLyBtZWRpdW0tem9vbSB3aWxsIGhhdmUgY29tcHV0ZWQgdGhlIGltYWdlIHNpemUgd2l0aCBhZGRpdGlvbmFsIGJvcmRlcnMsXG4gICAgICAvLyBuZWVkIGl0IHRvIHVzZSBvYmplY3QtZml0IHRvbyBvdGhlcndpc2UgdGhlIHJhdGlvIHdpbGwgYmUgc2NyZXdlZFxuICAgICAgaWYgKG9iamVjdEZpdCAmJiB6b29tZWQpIHpvb21lZC5zdHlsZS5vYmplY3RGaXQgPSBvYmplY3RGaXQ7XG4gICAgfSk7XG4gICAgem9vbS5vbignY2xvc2VkJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHpvb21lZCA9IGV2ZW50LmRldGFpbC56b29tLmdldFpvb21lZEltYWdlKCk7XG4gICAgICB6b29tZWQuc3R5bGUub2JqZWN0Rml0ID0gJyc7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBpc0NhbGNhYmxlKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICB2YWx1ZS5lbmRzV2l0aCgncHgnKSB8fCB2YWx1ZS5lbmRzV2l0aCgnJScpIHx8IHZhbHVlLnN0YXJ0c1dpdGgoJ2NhbGMnKVxuICApO1xufVxuXG5mdW5jdGlvbiB1bkNhbGModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZS5zdGFydHNXaXRoKCdjYWxjJykgPyB2YWx1ZS5zbGljZSg0KSA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZShcbiAgeyBmcm9tLCB0byB9OiBBbmltYXRlZFByb3AsXG4gIHBlcmNlbnQ6IG51bWJlclxuKTogQW5pbWF0ZWRQcm9wWyd0byddIHtcbiAgaWYgKGZyb20gPT09IHRvKSByZXR1cm4gdG87XG4gIGlmICh0eXBlb2YgZnJvbSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHRvID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBmcm9tICsgKHRvIC0gZnJvbSkgKiAocGVyY2VudCAvIDEwMCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBmcm9tID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgdG8gPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGZyb20gPT09ICdub25lJyB8fCB0byA9PT0gJ25vbmUnKSByZXR1cm4gcGVyY2VudCA8IDUwID8gZnJvbSA6IHRvO1xuICAgIGlmIChmcm9tID09PSAnYXV0bycgfHwgdG8gPT09ICdhdXRvJykgcmV0dXJuIHBlcmNlbnQgPCA1MCA/IGZyb20gOiB0bztcblxuICAgIGlmIChmcm9tLmVuZHNXaXRoKCdweCcpICYmIHRvLmVuZHNXaXRoKCdweCcpKSB7XG4gICAgICBjb25zdCBmcm9tUHggPSBwYXJzZUZsb2F0KGZyb20pO1xuICAgICAgY29uc3QgdG9QID0gcGFyc2VGbG9hdCh0byk7XG4gICAgICByZXR1cm4gdG9QeChmcm9tUHggKyAodG9QIC0gZnJvbVB4KSAqIChwZXJjZW50IC8gMTAwKSk7XG4gICAgfVxuICAgIGlmIChmcm9tLmVuZHNXaXRoKCclJykgJiYgdG8uZW5kc1dpdGgoJyUnKSkge1xuICAgICAgY29uc3QgZnJvbVB4ID0gcGFyc2VGbG9hdChmcm9tKTtcbiAgICAgIGNvbnN0IHRvUCA9IHBhcnNlRmxvYXQodG8pO1xuICAgICAgcmV0dXJuIHRvUGVyY2VudChmcm9tUHggKyAodG9QIC0gZnJvbVB4KSAqIChwZXJjZW50IC8gMTAwKSk7XG4gICAgfVxuICAgIGlmIChpc0NhbGNhYmxlKGZyb20pICYmIGlzQ2FsY2FibGUodG8pKSB7XG4gICAgICBjb25zdCBmcm9tQ2FsYyA9IHVuQ2FsYyhmcm9tKTtcbiAgICAgIGNvbnN0IHRvQ2FsYyA9IHVuQ2FsYyh0byk7XG4gICAgICByZXR1cm4gYGNhbGMoJHtmcm9tQ2FsY30gKyAoJHt0b0NhbGN9IC0gJHtmcm9tQ2FsY30pICogJHtwZXJjZW50IC8gMTAwfSlgO1xuICAgIH1cblxuICAgIC8vIG5lZWRlZCA/XG4gICAgaWYgKGZyb20uc3RhcnRzV2l0aCgncmdiJykgJiYgdG8uc3RhcnRzV2l0aCgncmdiJykpIHtcbiAgICAgIGNvbnN0IGZyb21Db2xvciA9IGZyb20ubWF0Y2goL1xcZCsvZykhLm1hcChOdW1iZXIpO1xuICAgICAgY29uc3QgdG9Db2xvciA9IHRvLm1hdGNoKC9cXGQrL2cpIS5tYXAoTnVtYmVyKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gZnJvbUNvbG9yLm1hcChcbiAgICAgICAgKGZyb20sIGkpID0+IGZyb20gKyAodG9Db2xvcltpXSAtIGZyb20pICogKHBlcmNlbnQgLyAxMDApXG4gICAgICApO1xuICAgICAgcmV0dXJuIGByZ2IoJHtjb2xvci5qb2luKCcsJyl9KWA7XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJjZW50IDwgNTAgPyBmcm9tIDogdG87XG59XG5cbmZ1bmN0aW9uIGdldERpc3RhbmNlKFxuICBzdGFydDogTW91c2VFdmVudCxcbiAgZW5kOiBNb3VzZUV2ZW50XG4pOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBkaXN0OiBudW1iZXIgfSB7XG4gIGNvbnN0IHggPSBlbmQuY2xpZW50WCAtIHN0YXJ0LmNsaWVudFg7XG4gIGNvbnN0IHkgPSBlbmQuY2xpZW50WSAtIHN0YXJ0LmNsaWVudFk7XG4gIHJldHVybiB7IHgsIHksIGRpc3Q6IE1hdGguc3FydChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpKSB9O1xufVxuXG5vbkNvbm5lY3RlZCgnW2RhdGEtYm91bmQtY2hhcmFjdGVyc10nLCAoZSkgPT4ge1xuICBjb25zdCBoYW5kbGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGlkID0gZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYm91bmQtY2hhcmFjdGVycycpITtcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gdG9TdHJpbmcocmVzb2x2ZShhbGxWYXJpYWJsZXMoKVtpZF0pKTtcbiAgICBpZiAoY2hhcmFjdGVycyAhPT0gZS50ZXh0Q29udGVudCkgZS50ZXh0Q29udGVudCA9IGNoYXJhY3RlcnM7XG4gIH07XG4gIGhhbmRsZXIoKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZjJ3LXNldC12YXJpYWJsZScsIGhhbmRsZXIpO1xuICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZjJ3LXNldC12YXJpYWJsZScsIGhhbmRsZXIpO1xufSk7XG5cbm9uQ29ubmVjdGVkKCdbZGF0YS1ib3VuZC12aXNpYmxlXScsIChlKSA9PiB7XG4gIGNvbnN0IGhhbmRsZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaWQgPSBlLmdldEF0dHJpYnV0ZSgnZGF0YS1ib3VuZC12aXNpYmxlJykhO1xuICAgIGNvbnN0IHZpc2libGUgPSB0b1N0cmluZyhyZXNvbHZlKGFsbFZhcmlhYmxlcygpW2lkXSkpO1xuICAgIGlmICh2aXNpYmxlICE9PSB1bmRlZmluZWQpIGUuc2V0QXR0cmlidXRlKCdkYXRhLXZpc2libGUnLCB2aXNpYmxlKTtcbiAgfTtcbiAgaGFuZGxlcigpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmMnctc2V0LXZhcmlhYmxlJywgaGFuZGxlcik7XG4gIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmMnctc2V0LXZhcmlhYmxlJywgaGFuZGxlcik7XG59KTtcblxuY29uc3QgYXBwZWFyT2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoXG4gIChlbnRyaWVzLCBvYnNlcnZlcikgPT4ge1xuICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoZW50cnkudGFyZ2V0KTtcbiAgICAgICAgZW50cnkudGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdhcHBlYXInKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIC8vIDEwJSBvZiB0aGUgZWxlbWVudCBtdXN0IGJlIHZpc2libGVcbiAgeyB0aHJlc2hvbGQ6IDAuMSB9XG4pO1xuXG4vLyBGaXggc2Nyb2xsIHRvIGlkIGJ5IGluc3BlY3RpbmcgaW5qZWN0ZWQgZml4ZWQgaWRzXG5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICBjb25zdCBoYXNoSWRQcmVmaXggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKTtcbiAgLy8gbWF0Y2hpbmcgI2ZvbyBvciAjZm9vXzFcbiAgY29uc3QgaGFzaFJFID0gbmV3IFJlZ0V4cChoYXNoSWRQcmVmaXggKyAnKF9cXFxcZCspPyQnKTtcbiAgZm9yIChjb25zdCBlIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtpZF49XCIke2hhc2hJZFByZWZpeH1cIl1gKSlcbiAgICBpZiAoaGFzaFJFLnRlc3QoZS5pZCkgJiYgZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgPiAwKVxuICAgICAgcmV0dXJuIGUuc2Nyb2xsSW50b1ZpZXcoKTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFdBQVMsUUFBUSxHQUFXLFFBQXdCO0FBQ3pELFdBQU8sS0FBSyxNQUFNLElBQUksTUFBTSxJQUFJO0FBQUEsRUFDbEM7OztBQ0ZlLFdBQVIsT0FBd0IsS0FBSyxPQUFPLE1BQU0sT0FBTztBQUN2RCxVQUFNLGFBQWEsT0FBTyxTQUFTLEtBQUssU0FBUyxFQUFFLFNBQVMsR0FBRztBQUUvRCxRQUFJLE9BQU8sUUFBUSxVQUFVO0FBQzVCLE9BQUMsS0FBSyxPQUFPLE1BQU0sS0FBSyxJQUFJLElBQUksTUFBTSxpQkFBaUIsRUFBRSxJQUFJLGVBQWEsT0FBTyxTQUFTLENBQUM7QUFBQSxJQUM1RixXQUFXLFVBQVUsUUFBVztBQUMvQixjQUFRLE9BQU8sV0FBVyxLQUFLO0FBQUEsSUFDaEM7QUFFQSxRQUFJLE9BQU8sUUFBUSxZQUNsQixPQUFPLFVBQVUsWUFDakIsT0FBTyxTQUFTLFlBQ2hCLE1BQU0sT0FDTixRQUFRLE9BQ1IsT0FBTyxLQUNOO0FBQ0QsWUFBTSxJQUFJLFVBQVUsa0NBQWtDO0FBQUEsSUFDdkQ7QUFFQSxRQUFJLE9BQU8sVUFBVSxVQUFVO0FBQzlCLFVBQUksQ0FBQyxhQUFhLFNBQVMsS0FBSyxTQUFTLEdBQUc7QUFDM0MsZ0JBQVEsS0FBSyxNQUFNLE1BQU0sS0FBSztBQUFBLE1BQy9CLFdBQVcsYUFBYSxTQUFTLEtBQUssU0FBUyxLQUFLO0FBQ25ELGdCQUFRLEtBQUssTUFBTSxNQUFNLFFBQVEsR0FBRztBQUFBLE1BQ3JDLE9BQU87QUFDTixjQUFNLElB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QWlCLG9CQUFvQixPQUFPO0FBQ3JELFdBQU8sTUFBTSxTQUFTLG9CQUFvQixvQkFBb0IsT0FBTztBQUFBLEVBQ3ZFLENBQUM7QUFFRCxNQUFNLGlCQUFpQixJQUFJO0FBQUEsSUFDekIsQ0FBQyxTQUFTLGFBQWE7QUFDckIsY0FBUSxRQUFRLENBQUMsVUFBVTtBQUN6QixZQUFJLE1BQU0sZ0JBQWdCO0FBQ3hCLG1CQUFTLFVBQVUsTUFBTSxNQUFNO0FBQy9CLGdCQUFNLE9BQU8sY0FBYyxJQUFJLFlBQVksUUFBUSxDQUFDO0FBQUEsUUFDdEQ7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFFQSxFQUFFLFdBQVcsSUFBSTtBQUFBLEVBQ25CO0FBR0EsbUJBQWlCLFFBQVEsTUFBTTtBQUM3QixVQUFNLGVBQWUsT0FBTyxTQUFTLEtBQUssTUFBTSxDQUFDO0FBRWpELFVBQU0sU0FBUyxJQUFJLE9BQU8sZUFBZSxXQUFXO0FBQ3BELGVBQVcsS0FBSyxTQUFTLGlCQUFpQixTQUFTLGdCQUFnQjtBQUNqRSxVQUFJLE9BQU8sS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixFQUFFLFNBQVM7QUFDMUQsZUFBTyxFQUFFLGVBQWU7QUFBQSxFQUM5QixDQUFDOyIsCiAgIm5hbWVzIjogWyJydW4iLCAidG9SdW4iLCAiZWx0IiwgInJlc29sdmUiLCAiZWx0IiwgImR1cmF0aW9uIiwgInAiLCAib3ZlcmxheVBvc2l0aW9uVHlwZSIsICJ0cmFuc2l0aW9uIiwgImJvdW5kIiwgInRyaWdnZXIiLCAiZSIsICJpIiwgImFjdGlvbiIsICJydW4iLCAiX2EiLCAiX2IiLCAib3ZlcmxheSIsICJhbmltYXRpb25zIiwgInRyYW5zaXRpb24iLCAiZHVyYXRpb24iLCAiZWx0IiwgIm1vZGFsIiwgImRpc3RYIiwgImRpc3RZIiwgImZyb20iXQp9Cg==
