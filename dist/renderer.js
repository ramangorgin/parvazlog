"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/sweetalert2/dist/sweetalert2.all.js
  var require_sweetalert2_all = __commonJS({
    "node_modules/sweetalert2/dist/sweetalert2.all.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Sweetalert2 = factory());
      })(exports, (function() {
        "use strict";
        function _assertClassBrand(e, t, n) {
          if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
          throw new TypeError("Private element is not present on this object");
        }
        function _checkPrivateRedeclaration(e, t) {
          if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        }
        function _classPrivateFieldGet2(s, a) {
          return s.get(_assertClassBrand(s, a));
        }
        function _classPrivateFieldInitSpec(e, t, a) {
          _checkPrivateRedeclaration(e, t), t.set(e, a);
        }
        function _classPrivateFieldSet2(s, a, r) {
          return s.set(_assertClassBrand(s, a), r), r;
        }
        const RESTORE_FOCUS_TIMEOUT = 100;
        const globalState = {};
        const focusPreviousActiveElement = () => {
          if (globalState.previousActiveElement instanceof HTMLElement) {
            globalState.previousActiveElement.focus();
            globalState.previousActiveElement = null;
          } else if (document.body) {
            document.body.focus();
          }
        };
        const restoreActiveElement = (returnFocus) => {
          return new Promise((resolve) => {
            if (!returnFocus) {
              return resolve();
            }
            const x = window.scrollX;
            const y = window.scrollY;
            globalState.restoreFocusTimeout = setTimeout(() => {
              focusPreviousActiveElement();
              resolve();
            }, RESTORE_FOCUS_TIMEOUT);
            window.scrollTo(x, y);
          });
        };
        const swalPrefix = "swal2-";
        const classNames = ["container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "html-container", "actions", "confirm", "deny", "cancel", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error", "draggable", "dragging"];
        const swalClasses = classNames.reduce(
          (acc, className) => {
            acc[className] = swalPrefix + className;
            return acc;
          },
          /** @type {SwalClasses} */
          {}
        );
        const icons = ["success", "warning", "info", "question", "error"];
        const iconTypes = icons.reduce(
          (acc, icon) => {
            acc[icon] = swalPrefix + icon;
            return acc;
          },
          /** @type {SwalIcons} */
          {}
        );
        const consolePrefix = "SweetAlert2:";
        const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const warn = (message) => {
          console.warn(`${consolePrefix} ${typeof message === "object" ? message.join(" ") : message}`);
        };
        const error = (message) => {
          console.error(`${consolePrefix} ${message}`);
        };
        const previousWarnOnceMessages = [];
        const warnOnce = (message) => {
          if (!previousWarnOnceMessages.includes(message)) {
            previousWarnOnceMessages.push(message);
            warn(message);
          }
        };
        const warnAboutDeprecation = (deprecatedParam, useInstead = null) => {
          warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release.${useInstead ? ` Use "${useInstead}" instead.` : ""}`);
        };
        const callIfFunction = (arg) => typeof arg === "function" ? arg() : arg;
        const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === "function";
        const asPromise = (arg) => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
        const isPromise = (arg) => arg && Promise.resolve(arg) === arg;
        const isFirefox = () => navigator.userAgent.includes("Firefox");
        const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);
        const elementBySelector = (selectorString) => {
          const container = getContainer();
          return container ? container.querySelector(selectorString) : null;
        };
        const elementByClass = (className) => {
          return elementBySelector(`.${className}`);
        };
        const getPopup = () => elementByClass(swalClasses.popup);
        const getIcon = () => elementByClass(swalClasses.icon);
        const getIconContent = () => elementByClass(swalClasses["icon-content"]);
        const getTitle = () => elementByClass(swalClasses.title);
        const getHtmlContainer = () => elementByClass(swalClasses["html-container"]);
        const getImage = () => elementByClass(swalClasses.image);
        const getProgressSteps = () => elementByClass(swalClasses["progress-steps"]);
        const getValidationMessage = () => elementByClass(swalClasses["validation-message"]);
        const getConfirmButton = () => (
          /** @type {HTMLButtonElement} */
          elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`)
        );
        const getCancelButton = () => (
          /** @type {HTMLButtonElement} */
          elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`)
        );
        const getDenyButton = () => (
          /** @type {HTMLButtonElement} */
          elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`)
        );
        const getInputLabel = () => elementByClass(swalClasses["input-label"]);
        const getLoader = () => elementBySelector(`.${swalClasses.loader}`);
        const getActions = () => elementByClass(swalClasses.actions);
        const getFooter = () => elementByClass(swalClasses.footer);
        const getTimerProgressBar = () => elementByClass(swalClasses["timer-progress-bar"]);
        const getCloseButton = () => elementByClass(swalClasses.close);
        const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
        const getFocusableElements = () => {
          const popup = getPopup();
          if (!popup) {
            return [];
          }
          const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
          const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex).sort((a, b) => {
            const tabindexA = parseInt(a.getAttribute("tabindex") || "0");
            const tabindexB = parseInt(b.getAttribute("tabindex") || "0");
            if (tabindexA > tabindexB) {
              return 1;
            } else if (tabindexA < tabindexB) {
              return -1;
            }
            return 0;
          });
          const otherFocusableElements = popup.querySelectorAll(focusable);
          const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter((el) => el.getAttribute("tabindex") !== "-1");
          return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter((el) => isVisible$1(el));
        };
        const isModal = () => {
          return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses["toast-shown"]) && !hasClass(document.body, swalClasses["no-backdrop"]);
        };
        const isToast = () => {
          const popup = getPopup();
          if (!popup) {
            return false;
          }
          return hasClass(popup, swalClasses.toast);
        };
        const isLoading = () => {
          const popup = getPopup();
          if (!popup) {
            return false;
          }
          return popup.hasAttribute("data-loading");
        };
        const setInnerHtml = (elem, html) => {
          elem.textContent = "";
          if (html) {
            const parser = new DOMParser();
            const parsed = parser.parseFromString(html, `text/html`);
            const head = parsed.querySelector("head");
            if (head) {
              Array.from(head.childNodes).forEach((child) => {
                elem.appendChild(child);
              });
            }
            const body = parsed.querySelector("body");
            if (body) {
              Array.from(body.childNodes).forEach((child) => {
                if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
                  elem.appendChild(child.cloneNode(true));
                } else {
                  elem.appendChild(child);
                }
              });
            }
          }
        };
        const hasClass = (elem, className) => {
          if (!className) {
            return false;
          }
          return className.split(/\s+/).every((cls) => elem.classList.contains(cls));
        };
        const removeCustomClasses = (elem, params) => {
          Array.from(elem.classList).forEach((className) => {
            if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
              elem.classList.remove(className);
            }
          });
        };
        const applyCustomClass = (elem, params, className) => {
          removeCustomClasses(elem, params);
          if (!params.customClass) {
            return;
          }
          const customClass = params.customClass[
            /** @type {keyof SweetAlertCustomClass} */
            className
          ];
          if (!customClass) {
            return;
          }
          if (typeof customClass !== "string" && !customClass.forEach) {
            warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof customClass}"`);
            return;
          }
          addClass(elem, customClass);
        };
        const getInput$1 = (popup, inputClass) => {
          if (!inputClass) {
            return null;
          }
          switch (inputClass) {
            case "select":
            case "textarea":
            case "file":
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
            case "checkbox":
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
            case "radio":
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
            case "range":
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
            default:
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
          }
        };
        const focusInput = (input) => {
          input.focus();
          if (input.type !== "file") {
            const val = input.value;
            input.value = "";
            input.value = val;
          }
        };
        const toggleClass = (target, classList, condition) => {
          if (!target || !classList) {
            return;
          }
          const classes = typeof classList === "string" ? classList.split(/\s+/).filter(Boolean) : classList;
          const targets = Array.isArray(target) ? target : [target];
          targets.forEach((elem) => {
            classes.forEach((className) => {
              if (condition) {
                elem.classList.add(className);
              } else {
                elem.classList.remove(className);
              }
            });
          });
        };
        const addClass = (target, classList) => {
          toggleClass(target, classList, true);
        };
        const removeClass = (target, classList) => {
          toggleClass(target, classList, false);
        };
        const getDirectChildByClass = (elem, className) => (
          /** @type {HTMLElement | undefined} */
          Array.from(elem.children).find((child) => child instanceof HTMLElement && hasClass(child, className))
        );
        const applyNumericalStyle = (elem, property, value) => {
          if (value === `${parseInt(`${value}`)}`) {
            value = parseInt(value);
          }
          if (value || value === 0) {
            elem.style.setProperty(property, typeof value === "number" ? `${value}px` : (
              /** @type {string} */
              value
            ));
          } else {
            elem.style.removeProperty(property);
          }
        };
        const show = (elem, display = "flex") => {
          if (!elem) {
            return;
          }
          elem.style.display = display;
        };
        const hide = (elem) => {
          if (!elem) {
            return;
          }
          elem.style.display = "none";
        };
        const showWhenInnerHtmlPresent = (elem, display = "block") => {
          if (!elem) {
            return;
          }
          new MutationObserver(() => {
            toggle(elem, elem.innerHTML, display);
          }).observe(elem, {
            childList: true,
            subtree: true
          });
        };
        const setStyle = (parent, selector, property, value) => {
          const el = parent.querySelector(selector);
          if (el) {
            el.style.setProperty(property, value);
          }
        };
        const toggle = (elem, condition, display = "flex") => {
          if (condition) {
            show(elem, display);
          } else {
            hide(elem);
          }
        };
        const isVisible$1 = (elem) => Boolean(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
        const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
        const isScrollable = (elem) => Boolean(elem.scrollHeight > elem.clientHeight);
        const selfOrParentIsScrollable = (element, stopElement) => {
          let parent = (
            /** @type {HTMLElement | null} */
            element
          );
          while (parent && parent !== stopElement) {
            if (isScrollable(parent)) {
              return true;
            }
            parent = parent.parentElement;
          }
          return false;
        };
        const hasCssAnimation = (elem) => {
          const style = window.getComputedStyle(elem);
          const animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
          const transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
          return animDuration > 0 || transDuration > 0;
        };
        const animateTimerProgressBar = (timer, reset = false) => {
          const timerProgressBar = getTimerProgressBar();
          if (!timerProgressBar) {
            return;
          }
          if (isVisible$1(timerProgressBar)) {
            if (reset) {
              timerProgressBar.style.transition = "none";
              timerProgressBar.style.width = "100%";
            }
            setTimeout(() => {
              timerProgressBar.style.transition = `width ${timer / 1e3}s linear`;
              timerProgressBar.style.width = "0%";
            }, 10);
          }
        };
        const stopTimerProgressBar = () => {
          const timerProgressBar = getTimerProgressBar();
          if (!timerProgressBar) {
            return;
          }
          const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
          timerProgressBar.style.removeProperty("transition");
          timerProgressBar.style.width = "100%";
          const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
          const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
          timerProgressBar.style.width = `${timerProgressBarPercent}%`;
        };
        const isNodeEnv = () => typeof window === "undefined" || typeof document === "undefined";
        const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses["html-container"]}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses["progress-steps"]}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses["html-container"]}" id="${swalClasses["html-container"]}"></div>
   <input class="${swalClasses.input}" id="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}" id="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label class="${swalClasses.checkbox}">
     <input type="checkbox" id="${swalClasses.checkbox}" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}" id="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses["validation-message"]}" id="${swalClasses["validation-message"]}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses["timer-progress-bar-container"]}">
     <div class="${swalClasses["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, "");
        const resetOldContainer = () => {
          const oldContainer = getContainer();
          if (!oldContainer) {
            return false;
          }
          oldContainer.remove();
          removeClass([document.documentElement, document.body], [
            swalClasses["no-backdrop"],
            swalClasses["toast-shown"],
            // @ts-ignore: 'has-column' is not defined in swalClasses but may be set dynamically
            swalClasses["has-column"]
          ]);
          return true;
        };
        const resetValidationMessage$1 = () => {
          if (globalState.currentInstance) {
            globalState.currentInstance.resetValidationMessage();
          }
        };
        const addInputChangeListeners = () => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const input = getDirectChildByClass(popup, swalClasses.input);
          const file = getDirectChildByClass(popup, swalClasses.file);
          const range = popup.querySelector(`.${swalClasses.range} input`);
          const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
          const select = getDirectChildByClass(popup, swalClasses.select);
          const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
          const textarea = getDirectChildByClass(popup, swalClasses.textarea);
          if (input) {
            input.oninput = resetValidationMessage$1;
          }
          if (file) {
            file.onchange = resetValidationMessage$1;
          }
          if (select) {
            select.onchange = resetValidationMessage$1;
          }
          if (checkbox) {
            checkbox.onchange = resetValidationMessage$1;
          }
          if (textarea) {
            textarea.oninput = resetValidationMessage$1;
          }
          if (range && rangeOutput) {
            range.oninput = () => {
              resetValidationMessage$1();
              rangeOutput.value = range.value;
            };
            range.onchange = () => {
              resetValidationMessage$1();
              rangeOutput.value = range.value;
            };
          }
        };
        const getTarget = (target) => {
          if (typeof target === "string") {
            const element = document.querySelector(target);
            if (!element) {
              throw new Error(`Target element "${target}" not found`);
            }
            return (
              /** @type {HTMLElement} */
              element
            );
          }
          return target;
        };
        const setupAccessibility = (params) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          popup.setAttribute("role", params.toast ? "alert" : "dialog");
          popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
          if (!params.toast) {
            popup.setAttribute("aria-modal", "true");
          }
        };
        const setupRTL = (targetElement) => {
          if (window.getComputedStyle(targetElement).direction === "rtl") {
            addClass(getContainer(), swalClasses.rtl);
            globalState.isRTL = true;
          }
        };
        const init = (params) => {
          const oldContainerExisted = resetOldContainer();
          if (isNodeEnv()) {
            error("SweetAlert2 requires document to initialize");
            return;
          }
          const container = document.createElement("div");
          container.className = swalClasses.container;
          if (oldContainerExisted) {
            addClass(container, swalClasses["no-transition"]);
          }
          setInnerHtml(container, sweetHTML);
          container.dataset["swal2Theme"] = params.theme;
          const targetElement = getTarget(params.target || "body");
          targetElement.appendChild(container);
          if (params.topLayer) {
            container.setAttribute("popover", "");
            container.showPopover();
          }
          setupAccessibility(params);
          setupRTL(targetElement);
          addInputChangeListeners();
        };
        const parseHtmlToContainer = (param, target) => {
          if (param instanceof HTMLElement) {
            target.appendChild(param);
          } else if (typeof param === "object") {
            handleObject(param, target);
          } else if (param) {
            setInnerHtml(target, param);
          }
        };
        const handleObject = (param, target) => {
          if ("jquery" in param) {
            handleJqueryElem(target, param);
          } else {
            setInnerHtml(target, param.toString());
          }
        };
        const handleJqueryElem = (target, elem) => {
          target.textContent = "";
          if (0 in elem) {
            for (let i = 0; i in elem; i++) {
              target.appendChild(elem[i].cloneNode(true));
            }
          } else {
            target.appendChild(elem.cloneNode(true));
          }
        };
        const renderActions = (instance, params) => {
          const actions = getActions();
          const loader = getLoader();
          if (!actions || !loader) {
            return;
          }
          if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
            hide(actions);
          } else {
            show(actions);
          }
          applyCustomClass(actions, params, "actions");
          renderButtons(actions, loader, params);
          setInnerHtml(loader, params.loaderHtml || "");
          applyCustomClass(loader, params, "loader");
        };
        function renderButtons(actions, loader, params) {
          const confirmButton = getConfirmButton();
          const denyButton = getDenyButton();
          const cancelButton = getCancelButton();
          if (!confirmButton || !denyButton || !cancelButton) {
            return;
          }
          renderButton(confirmButton, "confirm", params);
          renderButton(denyButton, "deny", params);
          renderButton(cancelButton, "cancel", params);
          handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
          if (params.reverseButtons) {
            if (params.toast) {
              actions.insertBefore(cancelButton, confirmButton);
              actions.insertBefore(denyButton, confirmButton);
            } else {
              actions.insertBefore(cancelButton, loader);
              actions.insertBefore(denyButton, loader);
              actions.insertBefore(confirmButton, loader);
            }
          }
        }
        function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
          if (!params.buttonsStyling) {
            removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
            return;
          }
          addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
          const buttons = [[confirmButton, "confirm", params.confirmButtonColor], [denyButton, "deny", params.denyButtonColor], [cancelButton, "cancel", params.cancelButtonColor]];
          buttons.forEach(([button, type, color]) => {
            if (color) {
              button.style.setProperty(`--swal2-${type}-button-background-color`, color);
            }
            applyOutlineColor(button);
          });
        }
        function applyOutlineColor(button) {
          const buttonStyle = window.getComputedStyle(button);
          if (buttonStyle.getPropertyValue("--swal2-action-button-focus-box-shadow")) {
            return;
          }
          const outlineColor = buttonStyle.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, "rgba($1, $2, $3, 0.5)");
          button.style.setProperty("--swal2-action-button-focus-box-shadow", buttonStyle.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/, ` ${outlineColor}`));
        }
        function renderButton(button, buttonType, params) {
          const buttonName = (
            /** @type {'Confirm' | 'Deny' | 'Cancel'} */
            capitalizeFirstLetter(buttonType)
          );
          toggle(button, params[`show${buttonName}Button`], "inline-block");
          setInnerHtml(button, params[`${buttonType}ButtonText`] || "");
          button.setAttribute("aria-label", params[`${buttonType}ButtonAriaLabel`] || "");
          button.className = swalClasses[buttonType];
          applyCustomClass(button, params, `${buttonType}Button`);
        }
        const renderCloseButton = (instance, params) => {
          const closeButton = getCloseButton();
          if (!closeButton) {
            return;
          }
          setInnerHtml(closeButton, params.closeButtonHtml || "");
          applyCustomClass(closeButton, params, "closeButton");
          toggle(closeButton, params.showCloseButton);
          closeButton.setAttribute("aria-label", params.closeButtonAriaLabel || "");
        };
        const renderContainer = (instance, params) => {
          const container = getContainer();
          if (!container) {
            return;
          }
          handleBackdropParam(container, params.backdrop);
          handlePositionParam(container, params.position);
          handleGrowParam(container, params.grow);
          applyCustomClass(container, params, "container");
        };
        function handleBackdropParam(container, backdrop) {
          if (typeof backdrop === "string") {
            container.style.background = backdrop;
          } else if (!backdrop) {
            addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
          }
        }
        function handlePositionParam(container, position) {
          if (!position) {
            return;
          }
          if (position in swalClasses) {
            addClass(container, swalClasses[position]);
          } else {
            warn('The "position" parameter is not valid, defaulting to "center"');
            addClass(container, swalClasses.center);
          }
        }
        function handleGrowParam(container, grow) {
          if (!grow) {
            return;
          }
          addClass(container, swalClasses[`grow-${grow}`]);
        }
        var privateProps = {
          innerParams: /* @__PURE__ */ new WeakMap(),
          domCache: /* @__PURE__ */ new WeakMap(),
          focusedElement: /* @__PURE__ */ new WeakMap()
        };
        const inputClasses = ["input", "file", "range", "select", "radio", "checkbox", "textarea"];
        const renderInput = (instance, params) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const innerParams = privateProps.innerParams.get(instance);
          const rerender = !innerParams || params.input !== innerParams.input;
          inputClasses.forEach((inputClass) => {
            const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
            if (!inputContainer) {
              return;
            }
            setAttributes(inputClass, params.inputAttributes);
            inputContainer.className = swalClasses[inputClass];
            if (rerender) {
              hide(inputContainer);
            }
          });
          if (params.input) {
            if (rerender) {
              showInput(params);
            }
            setCustomClass(params);
          }
        };
        const showInput = (params) => {
          if (!params.input) {
            return;
          }
          if (!renderInputType[params.input]) {
            error(`Unexpected type of input! Expected ${Object.keys(renderInputType).join(" | ")}, got "${params.input}"`);
            return;
          }
          const inputContainer = getInputContainer(params.input);
          if (!inputContainer) {
            return;
          }
          const input = renderInputType[params.input](inputContainer, params);
          show(inputContainer);
          if (params.inputAutoFocus) {
            setTimeout(() => {
              focusInput(input);
            });
          }
        };
        const removeAttributes = (input) => {
          for (const {
            name
          } of Array.from(input.attributes)) {
            if (!["id", "type", "value", "style"].includes(name)) {
              input.removeAttribute(name);
            }
          }
        };
        const setAttributes = (inputClass, inputAttributes) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const input = getInput$1(popup, inputClass);
          if (!input) {
            return;
          }
          removeAttributes(input);
          for (const attr in inputAttributes) {
            input.setAttribute(attr, inputAttributes[attr]);
          }
        };
        const setCustomClass = (params) => {
          if (!params.input) {
            return;
          }
          const inputContainer = getInputContainer(params.input);
          if (inputContainer) {
            applyCustomClass(inputContainer, params, "input");
          }
        };
        const setInputPlaceholder = (input, params) => {
          if (!input.placeholder && params.inputPlaceholder) {
            input.placeholder = params.inputPlaceholder;
          }
        };
        const setInputLabel = (input, prependTo, params) => {
          if (params.inputLabel) {
            const label = document.createElement("label");
            const labelClass = swalClasses["input-label"];
            label.setAttribute("for", input.id);
            label.className = labelClass;
            if (typeof params.customClass === "object") {
              addClass(label, params.customClass.inputLabel);
            }
            label.innerText = params.inputLabel;
            prependTo.insertAdjacentElement("beforebegin", label);
          }
        };
        const getInputContainer = (inputType) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          return getDirectChildByClass(popup, swalClasses[
            /** @type {SwalClass} */
            inputType
          ] || swalClasses.input);
        };
        const checkAndSetInputValue = (input, inputValue) => {
          if (["string", "number"].includes(typeof inputValue)) {
            input.value = `${inputValue}`;
          } else if (!isPromise(inputValue)) {
            warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
          }
        };
        const renderInputType = {};
        renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType["datetime-local"] = renderInputType.time = renderInputType.week = renderInputType.month = /** @type {(input: Input | HTMLElement, params: SweetAlertOptions) => Input} */
        (input, params) => {
          const inputElement = (
            /** @type {HTMLInputElement} */
            input
          );
          checkAndSetInputValue(inputElement, params.inputValue);
          setInputLabel(inputElement, inputElement, params);
          setInputPlaceholder(inputElement, params);
          inputElement.type = /** @type {string} */
          params.input;
          return inputElement;
        };
        renderInputType.file = (input, params) => {
          const inputElement = (
            /** @type {HTMLInputElement} */
            input
          );
          setInputLabel(inputElement, inputElement, params);
          setInputPlaceholder(inputElement, params);
          return inputElement;
        };
        renderInputType.range = (range, params) => {
          const rangeContainer = (
            /** @type {HTMLElement} */
            range
          );
          const rangeInput = rangeContainer.querySelector("input");
          const rangeOutput = rangeContainer.querySelector("output");
          if (rangeInput) {
            checkAndSetInputValue(rangeInput, params.inputValue);
            rangeInput.type = /** @type {string} */
            params.input;
            setInputLabel(
              rangeInput,
              /** @type {Input} */
              range,
              params
            );
          }
          if (rangeOutput) {
            checkAndSetInputValue(rangeOutput, params.inputValue);
          }
          return (
            /** @type {Input} */
            range
          );
        };
        renderInputType.select = (select, params) => {
          const selectElement = (
            /** @type {HTMLSelectElement} */
            select
          );
          selectElement.textContent = "";
          if (params.inputPlaceholder) {
            const placeholder = document.createElement("option");
            setInnerHtml(placeholder, params.inputPlaceholder);
            placeholder.value = "";
            placeholder.disabled = true;
            placeholder.selected = true;
            selectElement.appendChild(placeholder);
          }
          setInputLabel(selectElement, selectElement, params);
          return selectElement;
        };
        renderInputType.radio = (radio) => {
          const radioElement = (
            /** @type {HTMLElement} */
            radio
          );
          radioElement.textContent = "";
          return (
            /** @type {Input} */
            radio
          );
        };
        renderInputType.checkbox = (checkboxContainer, params) => {
          const popup = getPopup();
          if (!popup) {
            throw new Error("Popup not found");
          }
          const checkbox = getInput$1(popup, "checkbox");
          if (!checkbox) {
            throw new Error("Checkbox input not found");
          }
          checkbox.value = "1";
          checkbox.checked = Boolean(params.inputValue);
          const containerElement = (
            /** @type {HTMLElement} */
            checkboxContainer
          );
          const label = containerElement.querySelector("span");
          if (label) {
            const placeholderOrLabel = params.inputPlaceholder || params.inputLabel;
            if (placeholderOrLabel) {
              setInnerHtml(label, placeholderOrLabel);
            }
          }
          return checkbox;
        };
        renderInputType.textarea = (textarea, params) => {
          const textareaElement = (
            /** @type {HTMLTextAreaElement} */
            textarea
          );
          checkAndSetInputValue(textareaElement, params.inputValue);
          setInputPlaceholder(textareaElement, params);
          setInputLabel(textareaElement, textareaElement, params);
          const getMargin = (el) => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
          setTimeout(() => {
            if ("MutationObserver" in window) {
              const popup = getPopup();
              if (!popup) {
                return;
              }
              const initialPopupWidth = parseInt(window.getComputedStyle(popup).width);
              const textareaResizeHandler = () => {
                if (!document.body.contains(textareaElement)) {
                  return;
                }
                const textareaWidth = textareaElement.offsetWidth + getMargin(textareaElement);
                const popupElement = getPopup();
                if (popupElement) {
                  if (textareaWidth > initialPopupWidth) {
                    popupElement.style.width = `${textareaWidth}px`;
                  } else {
                    applyNumericalStyle(popupElement, "width", params.width);
                  }
                }
              };
              new MutationObserver(textareaResizeHandler).observe(textareaElement, {
                attributes: true,
                attributeFilter: ["style"]
              });
            }
          });
          return textareaElement;
        };
        const renderContent = (instance, params) => {
          const htmlContainer = getHtmlContainer();
          if (!htmlContainer) {
            return;
          }
          showWhenInnerHtmlPresent(htmlContainer);
          applyCustomClass(htmlContainer, params, "htmlContainer");
          if (params.html) {
            parseHtmlToContainer(params.html, htmlContainer);
            show(htmlContainer, "block");
          } else if (params.text) {
            htmlContainer.textContent = params.text;
            show(htmlContainer, "block");
          } else {
            hide(htmlContainer);
          }
          renderInput(instance, params);
        };
        const renderFooter = (instance, params) => {
          const footer = getFooter();
          if (!footer) {
            return;
          }
          showWhenInnerHtmlPresent(footer);
          toggle(footer, Boolean(params.footer), "block");
          if (params.footer) {
            parseHtmlToContainer(params.footer, footer);
          }
          applyCustomClass(footer, params, "footer");
        };
        const renderIcon = (instance, params) => {
          const innerParams = privateProps.innerParams.get(instance);
          const icon = getIcon();
          if (!icon) {
            return;
          }
          if (innerParams && params.icon === innerParams.icon) {
            setContent(icon, params);
            applyStyles(icon, params);
            return;
          }
          if (!params.icon && !params.iconHtml) {
            hide(icon);
            return;
          }
          if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
            error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
            hide(icon);
            return;
          }
          show(icon);
          setContent(icon, params);
          applyStyles(icon, params);
          addClass(icon, params.showClass && params.showClass.icon);
          const colorSchemeQueryList = window.matchMedia("(prefers-color-scheme: dark)");
          colorSchemeQueryList.addEventListener("change", adjustSuccessIconBackgroundColor);
        };
        const applyStyles = (icon, params) => {
          for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
            if (params.icon !== iconType) {
              removeClass(icon, iconClassName);
            }
          }
          addClass(icon, params.icon && iconTypes[params.icon]);
          setColor(icon, params);
          adjustSuccessIconBackgroundColor();
          applyCustomClass(icon, params, "icon");
        };
        const adjustSuccessIconBackgroundColor = () => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
          const successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");
          successIconParts.forEach((part) => {
            part.style.backgroundColor = popupBackgroundColor;
          });
        };
        const successIconHtml = (params) => `
  ${params.animation ? '<div class="swal2-success-circular-line-left"></div>' : ""}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${params.animation ? '<div class="swal2-success-fix"></div>' : ""}
  ${params.animation ? '<div class="swal2-success-circular-line-right"></div>' : ""}
`;
        const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;
        const setContent = (icon, params) => {
          if (!params.icon && !params.iconHtml) {
            return;
          }
          let oldContent = icon.innerHTML;
          let newContent = "";
          if (params.iconHtml) {
            newContent = iconContent(params.iconHtml);
          } else if (params.icon === "success") {
            newContent = successIconHtml(params);
            oldContent = oldContent.replace(/ style=".*?"/g, "");
          } else if (params.icon === "error") {
            newContent = errorIconHtml;
          } else if (params.icon) {
            const defaultIconHtml = {
              question: "?",
              warning: "!",
              info: "i"
            };
            newContent = iconContent(defaultIconHtml[params.icon]);
          }
          if (oldContent.trim() !== newContent.trim()) {
            setInnerHtml(icon, newContent);
          }
        };
        const setColor = (icon, params) => {
          if (!params.iconColor) {
            return;
          }
          icon.style.color = params.iconColor;
          icon.style.borderColor = params.iconColor;
          for (const sel of [".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right"]) {
            setStyle(icon, sel, "background-color", params.iconColor);
          }
          setStyle(icon, ".swal2-success-ring", "border-color", params.iconColor);
        };
        const iconContent = (content) => `<div class="${swalClasses["icon-content"]}">${content}</div>`;
        const renderImage = (instance, params) => {
          const image = getImage();
          if (!image) {
            return;
          }
          if (!params.imageUrl) {
            hide(image);
            return;
          }
          show(image, "");
          image.setAttribute("src", params.imageUrl);
          image.setAttribute("alt", params.imageAlt || "");
          applyNumericalStyle(image, "width", params.imageWidth);
          applyNumericalStyle(image, "height", params.imageHeight);
          image.className = swalClasses.image;
          applyCustomClass(image, params, "image");
        };
        let dragging = false;
        let mousedownX = 0;
        let mousedownY = 0;
        let initialX = 0;
        let initialY = 0;
        const addDraggableListeners = (popup) => {
          popup.addEventListener("mousedown", down);
          document.body.addEventListener("mousemove", move);
          popup.addEventListener("mouseup", up);
          popup.addEventListener("touchstart", down);
          document.body.addEventListener("touchmove", move);
          popup.addEventListener("touchend", up);
        };
        const removeDraggableListeners = (popup) => {
          popup.removeEventListener("mousedown", down);
          document.body.removeEventListener("mousemove", move);
          popup.removeEventListener("mouseup", up);
          popup.removeEventListener("touchstart", down);
          document.body.removeEventListener("touchmove", move);
          popup.removeEventListener("touchend", up);
        };
        const down = (event) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const icon = getIcon();
          if (event.target === popup || icon && icon.contains(
            /** @type {HTMLElement} */
            event.target
          )) {
            dragging = true;
            const clientXY = getClientXY(event);
            mousedownX = clientXY.clientX;
            mousedownY = clientXY.clientY;
            initialX = parseInt(popup.style.insetInlineStart) || 0;
            initialY = parseInt(popup.style.insetBlockStart) || 0;
            addClass(popup, "swal2-dragging");
          }
        };
        const move = (event) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          if (dragging) {
            let {
              clientX,
              clientY
            } = getClientXY(event);
            const deltaX = clientX - mousedownX;
            popup.style.insetInlineStart = `${initialX + (globalState.isRTL ? -deltaX : deltaX)}px`;
            popup.style.insetBlockStart = `${initialY + (clientY - mousedownY)}px`;
          }
        };
        const up = () => {
          const popup = getPopup();
          dragging = false;
          removeClass(popup, "swal2-dragging");
        };
        const getClientXY = (event) => {
          const source = event.type.startsWith("touch") ? (
            /** @type {TouchEvent} */
            event.touches[0]
          ) : (
            /** @type {MouseEvent} */
            event
          );
          return {
            clientX: source.clientX,
            clientY: source.clientY
          };
        };
        const renderPopup = (instance, params) => {
          const container = getContainer();
          const popup = getPopup();
          if (!container || !popup) {
            return;
          }
          if (params.toast) {
            applyNumericalStyle(container, "width", params.width);
            popup.style.width = "100%";
            const loader = getLoader();
            if (loader) {
              popup.insertBefore(loader, getIcon());
            }
          } else {
            applyNumericalStyle(popup, "width", params.width);
          }
          applyNumericalStyle(popup, "padding", params.padding);
          if (params.color) {
            popup.style.color = params.color;
          }
          if (params.background) {
            popup.style.background = params.background;
          }
          hide(getValidationMessage());
          addClasses$1(popup, params);
          if (params.draggable && !params.toast) {
            addClass(popup, swalClasses.draggable);
            addDraggableListeners(popup);
          } else {
            removeClass(popup, swalClasses.draggable);
            removeDraggableListeners(popup);
          }
        };
        const addClasses$1 = (popup, params) => {
          const showClass = params.showClass || {};
          popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? showClass.popup : ""}`;
          if (params.toast) {
            addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
            addClass(popup, swalClasses.toast);
          } else {
            addClass(popup, swalClasses.modal);
          }
          applyCustomClass(popup, params, "popup");
          if (typeof params.customClass === "string") {
            addClass(popup, params.customClass);
          }
          if (params.icon) {
            addClass(popup, swalClasses[`icon-${params.icon}`]);
          }
        };
        const renderProgressSteps = (instance, params) => {
          const progressStepsContainer = getProgressSteps();
          if (!progressStepsContainer) {
            return;
          }
          const {
            progressSteps,
            currentProgressStep
          } = params;
          if (!progressSteps || progressSteps.length === 0 || currentProgressStep === void 0) {
            hide(progressStepsContainer);
            return;
          }
          show(progressStepsContainer);
          progressStepsContainer.textContent = "";
          if (currentProgressStep >= progressSteps.length) {
            warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)");
          }
          progressSteps.forEach((step, index) => {
            const stepEl = createStepElement(step);
            progressStepsContainer.appendChild(stepEl);
            if (index === currentProgressStep) {
              addClass(stepEl, swalClasses["active-progress-step"]);
            }
            if (index !== progressSteps.length - 1) {
              const lineEl = createLineElement(params);
              progressStepsContainer.appendChild(lineEl);
            }
          });
        };
        const createStepElement = (step) => {
          const stepEl = document.createElement("li");
          addClass(stepEl, swalClasses["progress-step"]);
          setInnerHtml(stepEl, step);
          return stepEl;
        };
        const createLineElement = (params) => {
          const lineEl = document.createElement("li");
          addClass(lineEl, swalClasses["progress-step-line"]);
          if (params.progressStepsDistance) {
            applyNumericalStyle(lineEl, "width", params.progressStepsDistance);
          }
          return lineEl;
        };
        const renderTitle = (instance, params) => {
          const title = getTitle();
          if (!title) {
            return;
          }
          showWhenInnerHtmlPresent(title);
          toggle(title, Boolean(params.title || params.titleText), "block");
          if (params.title) {
            parseHtmlToContainer(params.title, title);
          }
          if (params.titleText) {
            title.innerText = params.titleText;
          }
          applyCustomClass(title, params, "title");
        };
        const render = (instance, params) => {
          var _globalState$eventEmi;
          renderPopup(instance, params);
          renderContainer(instance, params);
          renderProgressSteps(instance, params);
          renderIcon(instance, params);
          renderImage(instance, params);
          renderTitle(instance, params);
          renderCloseButton(instance, params);
          renderContent(instance, params);
          renderActions(instance, params);
          renderFooter(instance, params);
          const popup = getPopup();
          if (typeof params.didRender === "function" && popup) {
            params.didRender(popup);
          }
          (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("didRender", popup);
        };
        const isVisible = () => {
          return isVisible$1(getPopup());
        };
        const clickConfirm = () => {
          var _dom$getConfirmButton;
          return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
        };
        const clickDeny = () => {
          var _dom$getDenyButton;
          return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
        };
        const clickCancel = () => {
          var _dom$getCancelButton;
          return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
        };
        const DismissReason = Object.freeze({
          cancel: "cancel",
          backdrop: "backdrop",
          close: "close",
          esc: "esc",
          timer: "timer"
        });
        const removeKeydownHandler = (globalState2) => {
          if (globalState2.keydownTarget && globalState2.keydownHandlerAdded && globalState2.keydownHandler) {
            const handler = (
              /** @type {EventListenerOrEventListenerObject} */
              /** @type {unknown} */
              globalState2.keydownHandler
            );
            globalState2.keydownTarget.removeEventListener("keydown", handler, {
              capture: globalState2.keydownListenerCapture
            });
            globalState2.keydownHandlerAdded = false;
          }
        };
        const addKeydownHandler = (globalState2, innerParams, dismissWith) => {
          removeKeydownHandler(globalState2);
          if (!innerParams.toast) {
            const handler = (e) => keydownHandler(innerParams, e, dismissWith);
            globalState2.keydownHandler = handler;
            const target = innerParams.keydownListenerCapture ? window : getPopup();
            if (target) {
              globalState2.keydownTarget = target;
              globalState2.keydownListenerCapture = innerParams.keydownListenerCapture;
              const eventHandler = (
                /** @type {EventListenerOrEventListenerObject} */
                /** @type {unknown} */
                handler
              );
              globalState2.keydownTarget.addEventListener("keydown", eventHandler, {
                capture: globalState2.keydownListenerCapture
              });
              globalState2.keydownHandlerAdded = true;
            }
          }
        };
        const setFocus = (index, increment) => {
          var _dom$getPopup;
          const focusableElements = getFocusableElements();
          if (focusableElements.length) {
            index = index + increment;
            if (index === -2) {
              index = focusableElements.length - 1;
            }
            if (index === focusableElements.length) {
              index = 0;
            } else if (index === -1) {
              index = focusableElements.length - 1;
            }
            focusableElements[index].focus();
            if (isFirefox() && focusableElements[index] instanceof HTMLIFrameElement) {
              return false;
            }
            return true;
          }
          (_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
          return true;
        };
        const arrowKeysNextButton = ["ArrowRight", "ArrowDown"];
        const arrowKeysPreviousButton = ["ArrowLeft", "ArrowUp"];
        const keydownHandler = (innerParams, event, dismissWith) => {
          if (!innerParams) {
            return;
          }
          if (event.isComposing || event.keyCode === 229) {
            return;
          }
          if (innerParams.stopKeydownPropagation) {
            event.stopPropagation();
          }
          if (event.key === "Enter") {
            handleEnter(event, innerParams);
          } else if (event.key === "Tab") {
            handleTab(event);
          } else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
            handleArrows(event.key);
          } else if (event.key === "Escape") {
            handleEsc(event, innerParams, dismissWith);
          }
        };
        const handleEnter = (event, innerParams) => {
          if (!callIfFunction(innerParams.allowEnterKey)) {
            return;
          }
          const popup = getPopup();
          if (!popup || !innerParams.input) {
            return;
          }
          const input = getInput$1(popup, innerParams.input);
          if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
            if (["textarea", "file"].includes(innerParams.input)) {
              return;
            }
            clickConfirm();
            event.preventDefault();
          }
        };
        const handleTab = (event) => {
          const targetElement = event.target;
          const focusableElements = getFocusableElements();
          const btnIndex = focusableElements.findIndex((el) => el === targetElement);
          let shouldPreventDefault = true;
          if (!event.shiftKey) {
            shouldPreventDefault = setFocus(btnIndex, 1);
          } else {
            shouldPreventDefault = setFocus(btnIndex, -1);
          }
          event.stopPropagation();
          if (shouldPreventDefault) {
            event.preventDefault();
          }
        };
        const handleArrows = (key) => {
          const actions = getActions();
          const confirmButton = getConfirmButton();
          const denyButton = getDenyButton();
          const cancelButton = getCancelButton();
          if (!actions || !confirmButton || !denyButton || !cancelButton) {
            return;
          }
          const buttons = [confirmButton, denyButton, cancelButton];
          if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
            return;
          }
          const sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
          let buttonToFocus = document.activeElement;
          if (!buttonToFocus) {
            return;
          }
          for (let i = 0; i < actions.children.length; i++) {
            buttonToFocus = buttonToFocus[sibling];
            if (!buttonToFocus) {
              return;
            }
            if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
              break;
            }
          }
          if (buttonToFocus instanceof HTMLButtonElement) {
            buttonToFocus.focus();
          }
        };
        const handleEsc = (event, innerParams, dismissWith) => {
          event.preventDefault();
          if (callIfFunction(innerParams.allowEscapeKey)) {
            dismissWith(DismissReason.esc);
          }
        };
        var privateMethods = {
          swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
          swalPromiseReject: /* @__PURE__ */ new WeakMap()
        };
        const setAriaHidden = () => {
          const container = getContainer();
          const bodyChildren = Array.from(document.body.children);
          bodyChildren.forEach((el) => {
            if (el.contains(container)) {
              return;
            }
            if (el.hasAttribute("aria-hidden")) {
              el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden") || "");
            }
            el.setAttribute("aria-hidden", "true");
          });
        };
        const unsetAriaHidden = () => {
          const bodyChildren = Array.from(document.body.children);
          bodyChildren.forEach((el) => {
            if (el.hasAttribute("data-previous-aria-hidden")) {
              el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden") || "");
              el.removeAttribute("data-previous-aria-hidden");
            } else {
              el.removeAttribute("aria-hidden");
            }
          });
        };
        const isSafariOrIOS = typeof window !== "undefined" && Boolean(window.GestureEvent);
        const isIOS = isSafariOrIOS && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const iOSfix = () => {
          if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
            const offset = document.body.scrollTop;
            document.body.style.top = `${offset * -1}px`;
            addClass(document.body, swalClasses.iosfix);
            lockBodyScroll();
          }
        };
        const lockBodyScroll = () => {
          const container = getContainer();
          if (!container) {
            return;
          }
          let preventTouchMove;
          container.ontouchstart = (event) => {
            preventTouchMove = shouldPreventTouchMove(event);
          };
          container.ontouchmove = (event) => {
            if (preventTouchMove) {
              event.preventDefault();
              event.stopPropagation();
            }
          };
        };
        const shouldPreventTouchMove = (event) => {
          const target = event.target;
          const container = getContainer();
          const htmlContainer = getHtmlContainer();
          if (!container || !htmlContainer) {
            return false;
          }
          if (isStylus(event) || isZoom(event)) {
            return false;
          }
          if (target === container) {
            return true;
          }
          if (!isScrollable(container) && target instanceof HTMLElement && !selfOrParentIsScrollable(target, htmlContainer) && // #2823
          target.tagName !== "INPUT" && // #1603
          target.tagName !== "TEXTAREA" && // #2266
          !(isScrollable(htmlContainer) && // #1944
          htmlContainer.contains(target))) {
            return true;
          }
          return false;
        };
        const isStylus = (event) => {
          return Boolean(event.touches && event.touches.length && // @ts-ignore - touchType is not a standard property
          event.touches[0].touchType === "stylus");
        };
        const isZoom = (event) => {
          return event.touches && event.touches.length > 1;
        };
        const undoIOSfix = () => {
          if (hasClass(document.body, swalClasses.iosfix)) {
            const offset = parseInt(document.body.style.top, 10);
            removeClass(document.body, swalClasses.iosfix);
            document.body.style.top = "";
            document.body.scrollTop = offset * -1;
          }
        };
        const measureScrollbar = () => {
          const scrollDiv = document.createElement("div");
          scrollDiv.className = swalClasses["scrollbar-measure"];
          document.body.appendChild(scrollDiv);
          const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);
          return scrollbarWidth;
        };
        let previousBodyPadding = null;
        const replaceScrollbarWithPadding = (initialBodyOverflow) => {
          if (previousBodyPadding !== null) {
            return;
          }
          if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === "scroll") {
            previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
            document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`;
          }
        };
        const undoReplaceScrollbarWithPadding = () => {
          if (previousBodyPadding !== null) {
            document.body.style.paddingRight = `${previousBodyPadding}px`;
            previousBodyPadding = null;
          }
        };
        function removePopupAndResetState(instance, container, returnFocus, didClose) {
          if (isToast()) {
            triggerDidCloseAndDispose(instance, didClose);
          } else {
            restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
            removeKeydownHandler(globalState);
          }
          if (isSafariOrIOS) {
            container.setAttribute("style", "display:none !important");
            container.removeAttribute("class");
            container.innerHTML = "";
          } else {
            container.remove();
          }
          if (isModal()) {
            undoReplaceScrollbarWithPadding();
            undoIOSfix();
            unsetAriaHidden();
          }
          removeBodyClasses();
        }
        function removeBodyClasses() {
          removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses["height-auto"], swalClasses["no-backdrop"], swalClasses["toast-shown"]]);
        }
        function close(resolveValue) {
          resolveValue = prepareResolveValue(resolveValue);
          const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
          const didClose = triggerClosePopup(this);
          if (this.isAwaitingPromise) {
            if (!resolveValue.isDismissed) {
              handleAwaitingPromise(this);
              swalPromiseResolve(resolveValue);
            }
          } else if (didClose) {
            swalPromiseResolve(resolveValue);
          }
        }
        const triggerClosePopup = (instance) => {
          const popup = getPopup();
          if (!popup) {
            return false;
          }
          const innerParams = privateProps.innerParams.get(instance);
          if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
            return false;
          }
          removeClass(popup, innerParams.showClass.popup);
          addClass(popup, innerParams.hideClass.popup);
          const backdrop = getContainer();
          removeClass(backdrop, innerParams.showClass.backdrop);
          addClass(backdrop, innerParams.hideClass.backdrop);
          handlePopupAnimation(instance, popup, innerParams);
          return true;
        };
        function rejectPromise(error2) {
          const rejectPromise2 = privateMethods.swalPromiseReject.get(this);
          handleAwaitingPromise(this);
          if (rejectPromise2) {
            rejectPromise2(error2);
          }
        }
        const handleAwaitingPromise = (instance) => {
          if (instance.isAwaitingPromise) {
            delete instance.isAwaitingPromise;
            if (!privateProps.innerParams.get(instance)) {
              instance._destroy();
            }
          }
        };
        const prepareResolveValue = (resolveValue) => {
          if (typeof resolveValue === "undefined") {
            return {
              isConfirmed: false,
              isDenied: false,
              isDismissed: true
            };
          }
          return Object.assign({
            isConfirmed: false,
            isDenied: false,
            isDismissed: false
          }, resolveValue);
        };
        const handlePopupAnimation = (instance, popup, innerParams) => {
          var _globalState$eventEmi;
          const container = getContainer();
          const animationIsSupported = hasCssAnimation(popup);
          if (typeof innerParams.willClose === "function") {
            innerParams.willClose(popup);
          }
          (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willClose", popup);
          if (animationIsSupported && container) {
            animatePopup(instance, popup, container, Boolean(innerParams.returnFocus), innerParams.didClose);
          } else if (container) {
            removePopupAndResetState(instance, container, Boolean(innerParams.returnFocus), innerParams.didClose);
          }
        };
        const animatePopup = (instance, popup, container, returnFocus, didClose) => {
          globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
          const swalCloseAnimationFinished = function(e) {
            if (e.target === popup) {
              var _globalState$swalClos;
              (_globalState$swalClos = globalState.swalCloseEventFinishedCallback) === null || _globalState$swalClos === void 0 || _globalState$swalClos.call(globalState);
              delete globalState.swalCloseEventFinishedCallback;
              popup.removeEventListener("animationend", swalCloseAnimationFinished);
              popup.removeEventListener("transitionend", swalCloseAnimationFinished);
            }
          };
          popup.addEventListener("animationend", swalCloseAnimationFinished);
          popup.addEventListener("transitionend", swalCloseAnimationFinished);
        };
        const triggerDidCloseAndDispose = (instance, didClose) => {
          setTimeout(() => {
            var _globalState$eventEmi2;
            if (typeof didClose === "function") {
              didClose.bind(instance.params)();
            }
            (_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didClose");
            if (instance._destroy) {
              instance._destroy();
            }
          });
        };
        const showLoading = (buttonToReplace) => {
          let popup = getPopup();
          if (!popup) {
            new Swal2();
          }
          popup = getPopup();
          if (!popup) {
            return;
          }
          const loader = getLoader();
          if (isToast()) {
            hide(getIcon());
          } else {
            replaceButton(popup, buttonToReplace);
          }
          show(loader);
          popup.setAttribute("data-loading", "true");
          popup.setAttribute("aria-busy", "true");
          popup.focus();
        };
        const replaceButton = (popup, buttonToReplace) => {
          const actions = getActions();
          const loader = getLoader();
          if (!actions || !loader) {
            return;
          }
          if (!buttonToReplace && isVisible$1(getConfirmButton())) {
            buttonToReplace = getConfirmButton();
          }
          show(actions);
          if (buttonToReplace) {
            hide(buttonToReplace);
            loader.setAttribute("data-button-to-replace", buttonToReplace.className);
            actions.insertBefore(loader, buttonToReplace);
          }
          addClass([popup, actions], swalClasses.loading);
        };
        const handleInputOptionsAndValue = (instance, params) => {
          if (params.input === "select" || params.input === "radio") {
            handleInputOptions(instance, params);
          } else if (["text", "email", "number", "tel", "textarea"].some((i) => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
            showLoading(getConfirmButton());
            handleInputValue(instance, params);
          }
        };
        const getInputValue = (instance, innerParams) => {
          const input = instance.getInput();
          if (!input) {
            return null;
          }
          switch (innerParams.input) {
            case "checkbox":
              return getCheckboxValue(input);
            case "radio":
              return getRadioValue(input);
            case "file":
              return getFileValue(input);
            default:
              return innerParams.inputAutoTrim ? input.value.trim() : input.value;
          }
        };
        const getCheckboxValue = (input) => input.checked ? 1 : 0;
        const getRadioValue = (input) => input.checked ? input.value : null;
        const getFileValue = (input) => input.files && input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
        const handleInputOptions = (instance, params) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const processInputOptions = (inputOptions) => {
            if (params.input === "select") {
              populateSelectOptions(popup, formatInputOptions(inputOptions), params);
            } else if (params.input === "radio") {
              populateRadioOptions(popup, formatInputOptions(inputOptions), params);
            }
          };
          if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
            showLoading(getConfirmButton());
            asPromise(params.inputOptions).then((inputOptions) => {
              instance.hideLoading();
              processInputOptions(inputOptions);
            });
          } else if (typeof params.inputOptions === "object") {
            processInputOptions(params.inputOptions);
          } else {
            error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
          }
        };
        const handleInputValue = (instance, params) => {
          const input = instance.getInput();
          if (!input) {
            return;
          }
          hide(input);
          asPromise(params.inputValue).then((inputValue) => {
            input.value = params.input === "number" ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
            show(input);
            input.focus();
            instance.hideLoading();
          }).catch((err) => {
            error(`Error in inputValue promise: ${err}`);
            input.value = "";
            show(input);
            input.focus();
            instance.hideLoading();
          });
        };
        function populateSelectOptions(popup, inputOptions, params) {
          const select = getDirectChildByClass(popup, swalClasses.select);
          if (!select) {
            return;
          }
          const renderOption = (parent, optionLabel, optionValue) => {
            const option = document.createElement("option");
            option.value = optionValue;
            setInnerHtml(option, optionLabel);
            option.selected = isSelected(optionValue, params.inputValue);
            parent.appendChild(option);
          };
          inputOptions.forEach((inputOption) => {
            const optionValue = inputOption[0];
            const optionLabel = inputOption[1];
            if (Array.isArray(optionLabel)) {
              const optgroup = document.createElement("optgroup");
              optgroup.label = optionValue;
              optgroup.disabled = false;
              select.appendChild(optgroup);
              optionLabel.forEach((o) => renderOption(optgroup, o[1], o[0]));
            } else {
              renderOption(select, optionLabel, optionValue);
            }
          });
          select.focus();
        }
        function populateRadioOptions(popup, inputOptions, params) {
          const radio = getDirectChildByClass(popup, swalClasses.radio);
          if (!radio) {
            return;
          }
          inputOptions.forEach((inputOption) => {
            const radioValue = inputOption[0];
            const radioLabel = inputOption[1];
            const radioInput = document.createElement("input");
            const radioLabelElement = document.createElement("label");
            radioInput.type = "radio";
            radioInput.name = swalClasses.radio;
            radioInput.value = radioValue;
            if (isSelected(radioValue, params.inputValue)) {
              radioInput.checked = true;
            }
            const label = document.createElement("span");
            setInnerHtml(label, radioLabel);
            label.className = swalClasses.label;
            radioLabelElement.appendChild(radioInput);
            radioLabelElement.appendChild(label);
            radio.appendChild(radioLabelElement);
          });
          const radios = radio.querySelectorAll("input");
          if (radios.length) {
            radios[0].focus();
          }
        }
        const formatInputOptions = (inputOptions) => {
          const entries = inputOptions instanceof Map ? Array.from(inputOptions) : Object.entries(inputOptions);
          return entries.map(([key, value]) => [key, typeof value === "object" ? formatInputOptions(value) : value]);
        };
        const isSelected = (optionValue, inputValue) => Boolean(inputValue) && inputValue != null && inputValue.toString() === optionValue.toString();
        const handleConfirmButtonClick = (instance) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableButtons();
          if (innerParams.input) {
            handleConfirmOrDenyWithInput(instance, "confirm");
          } else {
            confirm(instance, true);
          }
        };
        const handleDenyButtonClick = (instance) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableButtons();
          if (innerParams.returnInputValueOnDeny) {
            handleConfirmOrDenyWithInput(instance, "deny");
          } else {
            deny(instance, false);
          }
        };
        const handleCancelButtonClick = (instance, dismissWith) => {
          instance.disableButtons();
          dismissWith(DismissReason.cancel);
        };
        const handleConfirmOrDenyWithInput = (instance, type) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (!innerParams.input) {
            error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
            return;
          }
          const input = instance.getInput();
          const inputValue = getInputValue(instance, innerParams);
          if (innerParams.inputValidator) {
            handleInputValidator(instance, inputValue, type);
          } else if (input && !input.checkValidity()) {
            instance.enableButtons();
            instance.showValidationMessage(innerParams.validationMessage || input.validationMessage);
          } else if (type === "deny") {
            deny(instance, inputValue);
          } else {
            confirm(instance, inputValue);
          }
        };
        const handleInputValidator = (instance, inputValue, type) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableInput();
          const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
          validationPromise.then((validationMessage) => {
            instance.enableButtons();
            instance.enableInput();
            if (validationMessage) {
              instance.showValidationMessage(validationMessage);
            } else if (type === "deny") {
              deny(instance, inputValue);
            } else {
              confirm(instance, inputValue);
            }
          });
        };
        const deny = (instance, value) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (innerParams.showLoaderOnDeny) {
            showLoading(getDenyButton());
          }
          if (innerParams.preDeny) {
            instance.isAwaitingPromise = true;
            const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
            preDenyPromise.then((preDenyValue) => {
              if (preDenyValue === false) {
                instance.hideLoading();
                handleAwaitingPromise(instance);
              } else {
                instance.close(
                  /** @type SweetAlertResult */
                  {
                    isDenied: true,
                    value: typeof preDenyValue === "undefined" ? value : preDenyValue
                  }
                );
              }
            }).catch((error2) => rejectWith(instance, error2));
          } else {
            instance.close(
              /** @type SweetAlertResult */
              {
                isDenied: true,
                value
              }
            );
          }
        };
        const succeedWith = (instance, value) => {
          instance.close(
            /** @type SweetAlertResult */
            {
              isConfirmed: true,
              value
            }
          );
        };
        const rejectWith = (instance, error2) => {
          instance.rejectPromise(error2);
        };
        const confirm = (instance, value) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (innerParams.showLoaderOnConfirm) {
            showLoading();
          }
          if (innerParams.preConfirm) {
            instance.resetValidationMessage();
            instance.isAwaitingPromise = true;
            const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
            preConfirmPromise.then((preConfirmValue) => {
              if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
                instance.hideLoading();
                handleAwaitingPromise(instance);
              } else {
                succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
              }
            }).catch((error2) => rejectWith(instance, error2));
          } else {
            succeedWith(instance, value);
          }
        };
        function hideLoading() {
          const innerParams = privateProps.innerParams.get(this);
          if (!innerParams) {
            return;
          }
          const domCache = privateProps.domCache.get(this);
          hide(domCache.loader);
          if (isToast()) {
            if (innerParams.icon) {
              show(getIcon());
            }
          } else {
            showRelatedButton(domCache);
          }
          removeClass([domCache.popup, domCache.actions], swalClasses.loading);
          domCache.popup.removeAttribute("aria-busy");
          domCache.popup.removeAttribute("data-loading");
          this.enableButtons();
        }
        const showRelatedButton = (domCache) => {
          const dataButtonToReplace = domCache.loader.getAttribute("data-button-to-replace");
          const buttonToReplace = dataButtonToReplace ? domCache.popup.getElementsByClassName(dataButtonToReplace) : [];
          if (buttonToReplace.length) {
            show(
              /** @type {HTMLElement} */
              buttonToReplace[0],
              "inline-block"
            );
          } else if (allButtonsAreHidden()) {
            hide(domCache.actions);
          }
        };
        function getInput() {
          const innerParams = privateProps.innerParams.get(this);
          const domCache = privateProps.domCache.get(this);
          if (!domCache) {
            return null;
          }
          return getInput$1(domCache.popup, innerParams.input);
        }
        function setButtonsDisabled(instance, buttons, disabled) {
          const domCache = privateProps.domCache.get(instance);
          buttons.forEach((button) => {
            domCache[button].disabled = disabled;
          });
        }
        function setInputDisabled(input, disabled) {
          const popup = getPopup();
          if (!popup || !input) {
            return;
          }
          if (input.type === "radio") {
            const radios = popup.querySelectorAll(`[name="${swalClasses.radio}"]`);
            radios.forEach((radio) => {
              radio.disabled = disabled;
            });
          } else {
            input.disabled = disabled;
          }
        }
        function enableButtons() {
          setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], false);
          const focusedElement = privateProps.focusedElement.get(this);
          if (focusedElement instanceof HTMLElement && document.activeElement === document.body) {
            focusedElement.focus();
          }
          privateProps.focusedElement.delete(this);
        }
        function disableButtons() {
          privateProps.focusedElement.set(this, document.activeElement);
          setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], true);
        }
        function enableInput() {
          setInputDisabled(this.getInput(), false);
        }
        function disableInput() {
          setInputDisabled(this.getInput(), true);
        }
        function showValidationMessage(error2) {
          const domCache = privateProps.domCache.get(this);
          const params = privateProps.innerParams.get(this);
          setInnerHtml(domCache.validationMessage, error2);
          domCache.validationMessage.className = swalClasses["validation-message"];
          if (params.customClass && params.customClass.validationMessage) {
            addClass(domCache.validationMessage, params.customClass.validationMessage);
          }
          show(domCache.validationMessage);
          const input = this.getInput();
          if (input) {
            input.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-describedby", swalClasses["validation-message"]);
            focusInput(input);
            addClass(input, swalClasses.inputerror);
          }
        }
        function resetValidationMessage() {
          const domCache = privateProps.domCache.get(this);
          if (domCache.validationMessage) {
            hide(domCache.validationMessage);
          }
          const input = this.getInput();
          if (input) {
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-describedby");
            removeClass(input, swalClasses.inputerror);
          }
        }
        const defaultParams = {
          title: "",
          titleText: "",
          text: "",
          html: "",
          footer: "",
          icon: void 0,
          iconColor: void 0,
          iconHtml: void 0,
          template: void 0,
          toast: false,
          draggable: false,
          animation: true,
          theme: "light",
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show"
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide"
          },
          customClass: {},
          target: "body",
          color: void 0,
          backdrop: true,
          heightAuto: true,
          allowOutsideClick: true,
          allowEscapeKey: true,
          allowEnterKey: true,
          stopKeydownPropagation: true,
          keydownListenerCapture: false,
          showConfirmButton: true,
          showDenyButton: false,
          showCancelButton: false,
          preConfirm: void 0,
          preDeny: void 0,
          confirmButtonText: "OK",
          confirmButtonAriaLabel: "",
          confirmButtonColor: void 0,
          denyButtonText: "No",
          denyButtonAriaLabel: "",
          denyButtonColor: void 0,
          cancelButtonText: "Cancel",
          cancelButtonAriaLabel: "",
          cancelButtonColor: void 0,
          buttonsStyling: true,
          reverseButtons: false,
          focusConfirm: true,
          focusDeny: false,
          focusCancel: false,
          returnFocus: true,
          showCloseButton: false,
          closeButtonHtml: "&times;",
          closeButtonAriaLabel: "Close this dialog",
          loaderHtml: "",
          showLoaderOnConfirm: false,
          showLoaderOnDeny: false,
          imageUrl: void 0,
          imageWidth: void 0,
          imageHeight: void 0,
          imageAlt: "",
          timer: void 0,
          timerProgressBar: false,
          width: void 0,
          padding: void 0,
          background: void 0,
          input: void 0,
          inputPlaceholder: "",
          inputLabel: "",
          inputValue: "",
          inputOptions: {},
          inputAutoFocus: true,
          inputAutoTrim: true,
          inputAttributes: {},
          inputValidator: void 0,
          returnInputValueOnDeny: false,
          validationMessage: void 0,
          grow: false,
          position: "center",
          progressSteps: [],
          currentProgressStep: void 0,
          progressStepsDistance: void 0,
          willOpen: void 0,
          didOpen: void 0,
          didRender: void 0,
          willClose: void 0,
          didClose: void 0,
          didDestroy: void 0,
          scrollbarPadding: true,
          topLayer: false
        };
        const updatableParams = ["allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "color", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "draggable", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "preConfirm", "preDeny", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "theme", "willClose"];
        const deprecatedParams = {
          allowEnterKey: void 0
        };
        const toastIncompatibleParams = ["allowOutsideClick", "allowEnterKey", "backdrop", "draggable", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture"];
        const isValidParameter = (paramName) => {
          return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
        };
        const isUpdatableParameter = (paramName) => {
          return updatableParams.indexOf(paramName) !== -1;
        };
        const isDeprecatedParameter = (paramName) => {
          return deprecatedParams[paramName];
        };
        const checkIfParamIsValid = (param) => {
          if (!isValidParameter(param)) {
            warn(`Unknown parameter "${param}"`);
          }
        };
        const checkIfToastParamIsValid = (param) => {
          if (toastIncompatibleParams.includes(param)) {
            warn(`The parameter "${param}" is incompatible with toasts`);
          }
        };
        const checkIfParamIsDeprecated = (param) => {
          const isDeprecated = isDeprecatedParameter(param);
          if (isDeprecated) {
            warnAboutDeprecation(param, isDeprecated);
          }
        };
        const showWarningsForParams = (params) => {
          if (params.backdrop === false && params.allowOutsideClick) {
            warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
          }
          if (params.theme && !["light", "dark", "auto", "minimal", "borderless", "bootstrap-4", "bootstrap-4-light", "bootstrap-4-dark", "bootstrap-5", "bootstrap-5-light", "bootstrap-5-dark", "material-ui", "material-ui-light", "material-ui-dark", "embed-iframe", "bulma", "bulma-light", "bulma-dark"].includes(params.theme)) {
            warn(`Invalid theme "${params.theme}"`);
          }
          for (const param in params) {
            checkIfParamIsValid(param);
            if (params.toast) {
              checkIfToastParamIsValid(param);
            }
            checkIfParamIsDeprecated(param);
          }
        };
        function update(params) {
          const container = getContainer();
          const popup = getPopup();
          const innerParams = privateProps.innerParams.get(this);
          if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
            warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
            return;
          }
          const validUpdatableParams = filterValidParams(params);
          const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
          showWarningsForParams(updatedParams);
          if (container) {
            container.dataset["swal2Theme"] = updatedParams.theme;
          }
          render(this, updatedParams);
          privateProps.innerParams.set(this, updatedParams);
          Object.defineProperties(this, {
            params: {
              value: Object.assign({}, this.params, params),
              writable: false,
              enumerable: true
            }
          });
        }
        const filterValidParams = (params) => {
          const validUpdatableParams = {};
          Object.keys(params).forEach((param) => {
            if (isUpdatableParameter(param)) {
              const typedParams = (
                /** @type {Record<string, any>} */
                params
              );
              validUpdatableParams[param] = typedParams[param];
            } else {
              warn(`Invalid parameter to update: ${param}`);
            }
          });
          return validUpdatableParams;
        };
        function _destroy() {
          var _globalState$eventEmi;
          const domCache = privateProps.domCache.get(this);
          const innerParams = privateProps.innerParams.get(this);
          if (!innerParams) {
            disposeWeakMaps(this);
            return;
          }
          if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
            globalState.swalCloseEventFinishedCallback();
            delete globalState.swalCloseEventFinishedCallback;
          }
          if (typeof innerParams.didDestroy === "function") {
            innerParams.didDestroy();
          }
          (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("didDestroy");
          disposeSwal(this);
        }
        const disposeSwal = (instance) => {
          disposeWeakMaps(instance);
          delete instance.params;
          delete globalState.keydownHandler;
          delete globalState.keydownTarget;
          delete globalState.currentInstance;
        };
        const disposeWeakMaps = (instance) => {
          if (instance.isAwaitingPromise) {
            unsetWeakMaps(privateProps, instance);
            instance.isAwaitingPromise = true;
          } else {
            unsetWeakMaps(privateMethods, instance);
            unsetWeakMaps(privateProps, instance);
            delete instance.isAwaitingPromise;
            delete instance.disableButtons;
            delete instance.enableButtons;
            delete instance.getInput;
            delete instance.disableInput;
            delete instance.enableInput;
            delete instance.hideLoading;
            delete instance.disableLoading;
            delete instance.showValidationMessage;
            delete instance.resetValidationMessage;
            delete instance.close;
            delete instance.closePopup;
            delete instance.closeModal;
            delete instance.closeToast;
            delete instance.rejectPromise;
            delete instance.update;
            delete instance._destroy;
          }
        };
        const unsetWeakMaps = (obj, instance) => {
          for (const i in obj) {
            obj[i].delete(instance);
          }
        };
        var instanceMethods = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          _destroy,
          close,
          closeModal: close,
          closePopup: close,
          closeToast: close,
          disableButtons,
          disableInput,
          disableLoading: hideLoading,
          enableButtons,
          enableInput,
          getInput,
          handleAwaitingPromise,
          hideLoading,
          rejectPromise,
          resetValidationMessage,
          showValidationMessage,
          update
        });
        const handlePopupClick = (innerParams, domCache, dismissWith) => {
          if (innerParams.toast) {
            handleToastClick(innerParams, domCache, dismissWith);
          } else {
            handleModalMousedown(domCache);
            handleContainerMousedown(domCache);
            handleModalClick(innerParams, domCache, dismissWith);
          }
        };
        const handleToastClick = (innerParams, domCache, dismissWith) => {
          domCache.popup.onclick = () => {
            if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
              return;
            }
            dismissWith(DismissReason.close);
          };
        };
        const isAnyButtonShown = (innerParams) => {
          return Boolean(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
        };
        let ignoreOutsideClick = false;
        const handleModalMousedown = (domCache) => {
          domCache.popup.onmousedown = () => {
            domCache.container.onmouseup = function(e) {
              domCache.container.onmouseup = () => {
              };
              if (e.target === domCache.container) {
                ignoreOutsideClick = true;
              }
            };
          };
        };
        const handleContainerMousedown = (domCache) => {
          domCache.container.onmousedown = (e) => {
            if (e.target === domCache.container) {
              e.preventDefault();
            }
            domCache.popup.onmouseup = function(e2) {
              domCache.popup.onmouseup = () => {
              };
              if (e2.target === domCache.popup || e2.target instanceof HTMLElement && domCache.popup.contains(e2.target)) {
                ignoreOutsideClick = true;
              }
            };
          };
        };
        const handleModalClick = (innerParams, domCache, dismissWith) => {
          domCache.container.onclick = (e) => {
            if (ignoreOutsideClick) {
              ignoreOutsideClick = false;
              return;
            }
            if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
              dismissWith(DismissReason.backdrop);
            }
          };
        };
        const isJqueryElement = (elem) => typeof elem === "object" && elem !== null && "jquery" in elem;
        const isElement = (elem) => elem instanceof Element || isJqueryElement(elem);
        const argsToParams = (args) => {
          const params = {};
          if (typeof args[0] === "object" && !isElement(args[0])) {
            Object.assign(params, args[0]);
          } else {
            ["title", "html", "icon"].forEach((name, index) => {
              const arg = args[index];
              if (typeof arg === "string" || isElement(arg)) {
                params[name] = arg;
              } else if (arg !== void 0) {
                error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
              }
            });
          }
          return (
            /** @type {SweetAlertOptions} */
            params
          );
        };
        function fire(...args) {
          return new this(...args);
        }
        function mixin(mixinParams) {
          class MixinSwal extends this {
            /**
             * @param {any} params
             * @param {any} priorityMixinParams
             */
            _main(params, priorityMixinParams) {
              return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
            }
          }
          return MixinSwal;
        }
        const getTimerLeft = () => {
          return globalState.timeout && globalState.timeout.getTimerLeft();
        };
        const stopTimer = () => {
          if (globalState.timeout) {
            stopTimerProgressBar();
            return globalState.timeout.stop();
          }
        };
        const resumeTimer = () => {
          if (globalState.timeout) {
            const remaining = globalState.timeout.start();
            animateTimerProgressBar(remaining);
            return remaining;
          }
        };
        const toggleTimer = () => {
          const timer = globalState.timeout;
          return timer && (timer.running ? stopTimer() : resumeTimer());
        };
        const increaseTimer = (ms) => {
          if (globalState.timeout) {
            const remaining = globalState.timeout.increase(ms);
            animateTimerProgressBar(remaining, true);
            return remaining;
          }
        };
        const isTimerRunning = () => {
          return Boolean(globalState.timeout && globalState.timeout.isRunning());
        };
        let bodyClickListenerAdded = false;
        const clickHandlers = {};
        function bindClickHandler(attr = "data-swal-template") {
          clickHandlers[attr] = this;
          if (!bodyClickListenerAdded) {
            document.body.addEventListener("click", bodyClickListener);
            bodyClickListenerAdded = true;
          }
        }
        const bodyClickListener = (event) => {
          for (let el = (
            /** @type {any} */
            event.target
          ); el && el !== document; el = el.parentNode) {
            for (const attr in clickHandlers) {
              const template = el.getAttribute && el.getAttribute(attr);
              if (template) {
                clickHandlers[attr].fire({
                  template
                });
                return;
              }
            }
          }
        };
        class EventEmitter {
          constructor() {
            this.events = {};
          }
          /**
           * @param {string} eventName
           * @returns {EventHandlers}
           */
          _getHandlersByEventName(eventName) {
            if (typeof this.events[eventName] === "undefined") {
              this.events[eventName] = [];
            }
            return this.events[eventName];
          }
          /**
           * @param {string} eventName
           * @param {EventHandler} eventHandler
           */
          on(eventName, eventHandler) {
            const currentHandlers = this._getHandlersByEventName(eventName);
            if (!currentHandlers.includes(eventHandler)) {
              currentHandlers.push(eventHandler);
            }
          }
          /**
           * @param {string} eventName
           * @param {EventHandler} eventHandler
           */
          once(eventName, eventHandler) {
            const onceFn = (...args) => {
              this.removeListener(eventName, onceFn);
              eventHandler.apply(this, args);
            };
            this.on(eventName, onceFn);
          }
          /**
           * @param {string} eventName
           * @param {...any} args
           */
          emit(eventName, ...args) {
            this._getHandlersByEventName(eventName).forEach(
              /**
               * @param {EventHandler} eventHandler
               */
              (eventHandler) => {
                try {
                  eventHandler.apply(this, args);
                } catch (error2) {
                  console.error(error2);
                }
              }
            );
          }
          /**
           * @param {string} eventName
           * @param {EventHandler} eventHandler
           */
          removeListener(eventName, eventHandler) {
            const currentHandlers = this._getHandlersByEventName(eventName);
            const index = currentHandlers.indexOf(eventHandler);
            if (index > -1) {
              currentHandlers.splice(index, 1);
            }
          }
          /**
           * @param {string} eventName
           */
          removeAllListeners(eventName) {
            if (this.events[eventName] !== void 0) {
              this.events[eventName].length = 0;
            }
          }
          reset() {
            this.events = {};
          }
        }
        globalState.eventEmitter = new EventEmitter();
        const on = (eventName, eventHandler) => {
          if (globalState.eventEmitter) {
            globalState.eventEmitter.on(eventName, eventHandler);
          }
        };
        const once = (eventName, eventHandler) => {
          if (globalState.eventEmitter) {
            globalState.eventEmitter.once(eventName, eventHandler);
          }
        };
        const off = (eventName, eventHandler) => {
          if (!globalState.eventEmitter) {
            return;
          }
          if (!eventName) {
            globalState.eventEmitter.reset();
            return;
          }
          if (eventHandler) {
            globalState.eventEmitter.removeListener(eventName, eventHandler);
          } else {
            globalState.eventEmitter.removeAllListeners(eventName);
          }
        };
        var staticMethods = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          argsToParams,
          bindClickHandler,
          clickCancel,
          clickConfirm,
          clickDeny,
          enableLoading: showLoading,
          fire,
          getActions,
          getCancelButton,
          getCloseButton,
          getConfirmButton,
          getContainer,
          getDenyButton,
          getFocusableElements,
          getFooter,
          getHtmlContainer,
          getIcon,
          getIconContent,
          getImage,
          getInputLabel,
          getLoader,
          getPopup,
          getProgressSteps,
          getTimerLeft,
          getTimerProgressBar,
          getTitle,
          getValidationMessage,
          increaseTimer,
          isDeprecatedParameter,
          isLoading,
          isTimerRunning,
          isUpdatableParameter,
          isValidParameter,
          isVisible,
          mixin,
          off,
          on,
          once,
          resumeTimer,
          showLoading,
          stopTimer,
          toggleTimer
        });
        class Timer {
          /**
           * @param {() => void} callback
           * @param {number} delay
           */
          constructor(callback, delay) {
            this.callback = callback;
            this.remaining = delay;
            this.running = false;
            this.start();
          }
          /**
           * @returns {number}
           */
          start() {
            if (!this.running) {
              this.running = true;
              this.started = /* @__PURE__ */ new Date();
              this.id = setTimeout(this.callback, this.remaining);
            }
            return this.remaining;
          }
          /**
           * @returns {number}
           */
          stop() {
            if (this.started && this.running) {
              this.running = false;
              clearTimeout(this.id);
              this.remaining -= (/* @__PURE__ */ new Date()).getTime() - this.started.getTime();
            }
            return this.remaining;
          }
          /**
           * @param {number} n
           * @returns {number}
           */
          increase(n) {
            const running = this.running;
            if (running) {
              this.stop();
            }
            this.remaining += n;
            if (running) {
              this.start();
            }
            return this.remaining;
          }
          /**
           * @returns {number}
           */
          getTimerLeft() {
            if (this.running) {
              this.stop();
              this.start();
            }
            return this.remaining;
          }
          /**
           * @returns {boolean}
           */
          isRunning() {
            return this.running;
          }
        }
        const swalStringParams = ["swal-title", "swal-html", "swal-footer"];
        const getTemplateParams = (params) => {
          const template = typeof params.template === "string" ? (
            /** @type {HTMLTemplateElement} */
            document.querySelector(params.template)
          ) : params.template;
          if (!template) {
            return {};
          }
          const templateContent = template.content;
          showWarningsForElements(templateContent);
          const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
          return result;
        };
        const getSwalParams = (templateContent) => {
          const result = {};
          const swalParams = Array.from(templateContent.querySelectorAll("swal-param"));
          swalParams.forEach((param) => {
            showWarningsForAttributes(param, ["name", "value"]);
            const paramName = (
              /** @type {keyof SweetAlertOptions} */
              param.getAttribute("name")
            );
            const value = param.getAttribute("value");
            if (!paramName || !value) {
              return;
            }
            if (paramName in defaultParams && typeof defaultParams[
              /** @type {keyof typeof defaultParams} */
              paramName
            ] === "boolean") {
              result[paramName] = value !== "false";
            } else if (paramName in defaultParams && typeof defaultParams[
              /** @type {keyof typeof defaultParams} */
              paramName
            ] === "object") {
              result[paramName] = JSON.parse(value);
            } else {
              result[paramName] = value;
            }
          });
          return result;
        };
        const getSwalFunctionParams = (templateContent) => {
          const result = {};
          const swalFunctions = Array.from(templateContent.querySelectorAll("swal-function-param"));
          swalFunctions.forEach((param) => {
            const paramName = (
              /** @type {keyof SweetAlertOptions} */
              param.getAttribute("name")
            );
            const value = param.getAttribute("value");
            if (!paramName || !value) {
              return;
            }
            result[paramName] = new Function(`return ${value}`)();
          });
          return result;
        };
        const getSwalButtons = (templateContent) => {
          const result = {};
          const swalButtons = Array.from(templateContent.querySelectorAll("swal-button"));
          swalButtons.forEach((button) => {
            showWarningsForAttributes(button, ["type", "color", "aria-label"]);
            const type = button.getAttribute("type");
            if (!type || !["confirm", "cancel", "deny"].includes(type)) {
              return;
            }
            result[`${type}ButtonText`] = button.innerHTML;
            result[`show${capitalizeFirstLetter(type)}Button`] = true;
            const color = button.getAttribute("color");
            if (color !== null) {
              result[`${type}ButtonColor`] = color;
            }
            const ariaLabel = button.getAttribute("aria-label");
            if (ariaLabel !== null) {
              result[`${type}ButtonAriaLabel`] = ariaLabel;
            }
          });
          return result;
        };
        const getSwalImage = (templateContent) => {
          const result = {};
          const image = templateContent.querySelector("swal-image");
          if (image) {
            showWarningsForAttributes(image, ["src", "width", "height", "alt"]);
            const src = image.getAttribute("src");
            if (src !== null) result.imageUrl = src || void 0;
            const width = image.getAttribute("width");
            if (width !== null) result.imageWidth = width || void 0;
            const height = image.getAttribute("height");
            if (height !== null) result.imageHeight = height || void 0;
            const alt = image.getAttribute("alt");
            if (alt !== null) result.imageAlt = alt || void 0;
          }
          return result;
        };
        const getSwalIcon = (templateContent) => {
          const result = {};
          const icon = templateContent.querySelector("swal-icon");
          if (icon) {
            showWarningsForAttributes(icon, ["type", "color"]);
            if (icon.hasAttribute("type")) {
              result.icon = icon.getAttribute("type");
            }
            if (icon.hasAttribute("color")) {
              result.iconColor = icon.getAttribute("color");
            }
            result.iconHtml = icon.innerHTML;
          }
          return result;
        };
        const getSwalInput = (templateContent) => {
          const result = {};
          const input = templateContent.querySelector("swal-input");
          if (input) {
            showWarningsForAttributes(input, ["type", "label", "placeholder", "value"]);
            result.input = input.getAttribute("type") || "text";
            if (input.hasAttribute("label")) {
              result.inputLabel = input.getAttribute("label");
            }
            if (input.hasAttribute("placeholder")) {
              result.inputPlaceholder = input.getAttribute("placeholder");
            }
            if (input.hasAttribute("value")) {
              result.inputValue = input.getAttribute("value");
            }
          }
          const inputOptions = Array.from(templateContent.querySelectorAll("swal-input-option"));
          if (inputOptions.length) {
            result.inputOptions = {};
            inputOptions.forEach((option) => {
              showWarningsForAttributes(option, ["value"]);
              const optionValue = option.getAttribute("value");
              if (!optionValue) {
                return;
              }
              const optionName = option.innerHTML;
              result.inputOptions[optionValue] = optionName;
            });
          }
          return result;
        };
        const getSwalStringParams = (templateContent, paramNames) => {
          const result = {};
          for (const i in paramNames) {
            const paramName = paramNames[i];
            const tag = templateContent.querySelector(paramName);
            if (tag) {
              showWarningsForAttributes(tag, []);
              result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
            }
          }
          return result;
        };
        const showWarningsForElements = (templateContent) => {
          const allowedElements = swalStringParams.concat(["swal-param", "swal-function-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option"]);
          Array.from(templateContent.children).forEach((el) => {
            const tagName = el.tagName.toLowerCase();
            if (!allowedElements.includes(tagName)) {
              warn(`Unrecognized element <${tagName}>`);
            }
          });
        };
        const showWarningsForAttributes = (el, allowedAttributes) => {
          Array.from(el.attributes).forEach((attribute) => {
            if (allowedAttributes.indexOf(attribute.name) === -1) {
              warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(", ")}` : "To set the value, use HTML within the element."}`]);
            }
          });
        };
        const SHOW_CLASS_TIMEOUT = 10;
        const openPopup = (params) => {
          var _globalState$eventEmi, _globalState$eventEmi2;
          const container = getContainer();
          const popup = getPopup();
          if (!container || !popup) {
            return;
          }
          if (typeof params.willOpen === "function") {
            params.willOpen(popup);
          }
          (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willOpen", popup);
          const bodyStyles = window.getComputedStyle(document.body);
          const initialBodyOverflow = bodyStyles.overflowY;
          addClasses(container, popup, params);
          setTimeout(() => {
            setScrollingVisibility(container, popup);
          }, SHOW_CLASS_TIMEOUT);
          if (isModal()) {
            fixScrollContainer(container, params.scrollbarPadding !== void 0 ? params.scrollbarPadding : false, initialBodyOverflow);
            setAriaHidden();
          }
          if (isIOS && params.backdrop === false && popup.scrollHeight > container.clientHeight) {
            container.style.pointerEvents = "auto";
          }
          if (!isToast() && !globalState.previousActiveElement) {
            globalState.previousActiveElement = document.activeElement;
          }
          if (typeof params.didOpen === "function") {
            const didOpen = params.didOpen;
            setTimeout(() => didOpen(popup));
          }
          (_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didOpen", popup);
        };
        const swalOpenAnimationFinished = (event) => {
          const popup = getPopup();
          if (!popup || event.target !== popup) {
            return;
          }
          const container = getContainer();
          if (!container) {
            return;
          }
          popup.removeEventListener("animationend", swalOpenAnimationFinished);
          popup.removeEventListener("transitionend", swalOpenAnimationFinished);
          container.style.overflowY = "auto";
          removeClass(container, swalClasses["no-transition"]);
        };
        const setScrollingVisibility = (container, popup) => {
          if (hasCssAnimation(popup)) {
            container.style.overflowY = "hidden";
            popup.addEventListener("animationend", swalOpenAnimationFinished);
            popup.addEventListener("transitionend", swalOpenAnimationFinished);
          } else {
            container.style.overflowY = "auto";
          }
        };
        const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
          iOSfix();
          if (scrollbarPadding && initialBodyOverflow !== "hidden") {
            replaceScrollbarWithPadding(initialBodyOverflow);
          }
          setTimeout(() => {
            container.scrollTop = 0;
          });
        };
        const addClasses = (container, popup, params) => {
          var _params$showClass;
          if ((_params$showClass = params.showClass) !== null && _params$showClass !== void 0 && _params$showClass.backdrop) {
            addClass(container, params.showClass.backdrop);
          }
          if (params.animation) {
            popup.style.setProperty("opacity", "0", "important");
            show(popup, "grid");
            setTimeout(() => {
              var _params$showClass2;
              if ((_params$showClass2 = params.showClass) !== null && _params$showClass2 !== void 0 && _params$showClass2.popup) {
                addClass(popup, params.showClass.popup);
              }
              popup.style.removeProperty("opacity");
            }, SHOW_CLASS_TIMEOUT);
          } else {
            show(popup, "grid");
          }
          addClass([document.documentElement, document.body], swalClasses.shown);
          if (params.heightAuto && params.backdrop && !params.toast) {
            addClass([document.documentElement, document.body], swalClasses["height-auto"]);
          }
        };
        var defaultInputValidators = {
          /**
           * @param {string} string
           * @param {string} [validationMessage]
           * @returns {Promise<string | void>}
           */
          email: (string, validationMessage) => {
            return /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
          },
          /**
           * @param {string} string
           * @param {string} [validationMessage]
           * @returns {Promise<string | void>}
           */
          url: (string, validationMessage) => {
            return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
          }
        };
        function setDefaultInputValidators(params) {
          if (params.inputValidator) {
            return;
          }
          if (params.input === "email") {
            params.inputValidator = defaultInputValidators["email"];
          }
          if (params.input === "url") {
            params.inputValidator = defaultInputValidators["url"];
          }
        }
        function validateCustomTargetElement(params) {
          if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
            warn('Target parameter is not valid, defaulting to "body"');
            params.target = "body";
          }
        }
        function setParameters(params) {
          setDefaultInputValidators(params);
          if (params.showLoaderOnConfirm && !params.preConfirm) {
            warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request");
          }
          validateCustomTargetElement(params);
          if (typeof params.title === "string") {
            params.title = params.title.split("\n").join("<br />");
          }
          init(params);
        }
        let currentInstance;
        var _promise = /* @__PURE__ */ new WeakMap();
        class SweetAlert {
          /**
           * @param {...(SweetAlertOptions | string)} args
           * @this {SweetAlert}
           */
          constructor(...args) {
            _classPrivateFieldInitSpec(
              this,
              _promise,
              /** @type {Promise<SweetAlertResult>} */
              Promise.resolve({
                isConfirmed: false,
                isDenied: false,
                isDismissed: true
              })
            );
            if (typeof window === "undefined") {
              return;
            }
            currentInstance = this;
            const outerParams = Object.freeze(this.constructor.argsToParams(args));
            this.params = outerParams;
            this.isAwaitingPromise = false;
            _classPrivateFieldSet2(_promise, this, this._main(currentInstance.params));
          }
          /**
           * @param {any} userParams
           * @param {any} mixinParams
           */
          _main(userParams, mixinParams = {}) {
            showWarningsForParams(Object.assign({}, mixinParams, userParams));
            if (globalState.currentInstance) {
              const swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance);
              const {
                isAwaitingPromise
              } = globalState.currentInstance;
              globalState.currentInstance._destroy();
              if (!isAwaitingPromise) {
                swalPromiseResolve({
                  isDismissed: true
                });
              }
              if (isModal()) {
                unsetAriaHidden();
              }
            }
            globalState.currentInstance = currentInstance;
            const innerParams = prepareParams(userParams, mixinParams);
            setParameters(innerParams);
            Object.freeze(innerParams);
            if (globalState.timeout) {
              globalState.timeout.stop();
              delete globalState.timeout;
            }
            clearTimeout(globalState.restoreFocusTimeout);
            const domCache = populateDomCache(currentInstance);
            render(currentInstance, innerParams);
            privateProps.innerParams.set(currentInstance, innerParams);
            return swalPromise(currentInstance, domCache, innerParams);
          }
          // `catch` cannot be the name of a module export, so we define our thenable methods here instead
          /**
           * @param {any} onFulfilled
           */
          // oxlint-disable-next-line unicorn/no-thenable
          then(onFulfilled) {
            return _classPrivateFieldGet2(_promise, this).then(onFulfilled);
          }
          /**
           * @param {any} onFinally
           */
          finally(onFinally) {
            return _classPrivateFieldGet2(_promise, this).finally(onFinally);
          }
        }
        const swalPromise = (instance, domCache, innerParams) => {
          return new Promise((resolve, reject) => {
            const dismissWith = (dismiss) => {
              instance.close({
                isDismissed: true,
                dismiss,
                isConfirmed: false,
                isDenied: false
              });
            };
            privateMethods.swalPromiseResolve.set(instance, resolve);
            privateMethods.swalPromiseReject.set(instance, reject);
            domCache.confirmButton.onclick = () => {
              handleConfirmButtonClick(instance);
            };
            domCache.denyButton.onclick = () => {
              handleDenyButtonClick(instance);
            };
            domCache.cancelButton.onclick = () => {
              handleCancelButtonClick(instance, dismissWith);
            };
            domCache.closeButton.onclick = () => {
              dismissWith(DismissReason.close);
            };
            handlePopupClick(innerParams, domCache, dismissWith);
            addKeydownHandler(globalState, innerParams, dismissWith);
            handleInputOptionsAndValue(instance, innerParams);
            openPopup(innerParams);
            setupTimer(globalState, innerParams, dismissWith);
            initFocus(domCache, innerParams);
            setTimeout(() => {
              domCache.container.scrollTop = 0;
            });
          });
        };
        const prepareParams = (userParams, mixinParams) => {
          const templateParams = getTemplateParams(userParams);
          const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
          params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
          params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
          if (params.animation === false) {
            params.showClass = {
              backdrop: "swal2-noanimation"
            };
            params.hideClass = {};
          }
          return params;
        };
        const populateDomCache = (instance) => {
          const domCache = (
            /** @type {DomCache} */
            {
              popup: (
                /** @type {HTMLElement} */
                getPopup()
              ),
              container: (
                /** @type {HTMLElement} */
                getContainer()
              ),
              actions: (
                /** @type {HTMLElement} */
                getActions()
              ),
              confirmButton: (
                /** @type {HTMLElement} */
                getConfirmButton()
              ),
              denyButton: (
                /** @type {HTMLElement} */
                getDenyButton()
              ),
              cancelButton: (
                /** @type {HTMLElement} */
                getCancelButton()
              ),
              loader: (
                /** @type {HTMLElement} */
                getLoader()
              ),
              closeButton: (
                /** @type {HTMLElement} */
                getCloseButton()
              ),
              validationMessage: (
                /** @type {HTMLElement} */
                getValidationMessage()
              ),
              progressSteps: (
                /** @type {HTMLElement} */
                getProgressSteps()
              )
            }
          );
          privateProps.domCache.set(instance, domCache);
          return domCache;
        };
        const setupTimer = (globalState2, innerParams, dismissWith) => {
          const timerProgressBar = getTimerProgressBar();
          hide(timerProgressBar);
          if (innerParams.timer) {
            globalState2.timeout = new Timer(() => {
              dismissWith("timer");
              delete globalState2.timeout;
            }, innerParams.timer);
            if (innerParams.timerProgressBar && timerProgressBar) {
              show(timerProgressBar);
              applyCustomClass(timerProgressBar, innerParams, "timerProgressBar");
              setTimeout(() => {
                if (globalState2.timeout && globalState2.timeout.running) {
                  animateTimerProgressBar(
                    /** @type {number} */
                    innerParams.timer
                  );
                }
              });
            }
          }
        };
        const initFocus = (domCache, innerParams) => {
          if (innerParams.toast) {
            return;
          }
          if (!callIfFunction(innerParams.allowEnterKey)) {
            warnAboutDeprecation("allowEnterKey", "preConfirm: () => false");
            domCache.popup.focus();
            return;
          }
          if (focusAutofocus(domCache)) {
            return;
          }
          if (focusButton(domCache, innerParams)) {
            return;
          }
          setFocus(-1, 1);
        };
        const focusAutofocus = (domCache) => {
          const autofocusElements = Array.from(domCache.popup.querySelectorAll("[autofocus]"));
          for (const autofocusElement of autofocusElements) {
            if (autofocusElement instanceof HTMLElement && isVisible$1(autofocusElement)) {
              autofocusElement.focus();
              return true;
            }
          }
          return false;
        };
        const focusButton = (domCache, innerParams) => {
          if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
            domCache.denyButton.focus();
            return true;
          }
          if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
            domCache.cancelButton.focus();
            return true;
          }
          if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
            domCache.confirmButton.focus();
            return true;
          }
          return false;
        };
        SweetAlert.prototype.disableButtons = disableButtons;
        SweetAlert.prototype.enableButtons = enableButtons;
        SweetAlert.prototype.getInput = getInput;
        SweetAlert.prototype.disableInput = disableInput;
        SweetAlert.prototype.enableInput = enableInput;
        SweetAlert.prototype.hideLoading = hideLoading;
        SweetAlert.prototype.disableLoading = hideLoading;
        SweetAlert.prototype.showValidationMessage = showValidationMessage;
        SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
        SweetAlert.prototype.close = close;
        SweetAlert.prototype.closePopup = close;
        SweetAlert.prototype.closeModal = close;
        SweetAlert.prototype.closeToast = close;
        SweetAlert.prototype.rejectPromise = rejectPromise;
        SweetAlert.prototype.update = update;
        SweetAlert.prototype._destroy = _destroy;
        Object.assign(SweetAlert, staticMethods);
        Object.keys(instanceMethods).forEach((key) => {
          SweetAlert[key] = function(...args) {
            if (currentInstance && currentInstance[key]) {
              return currentInstance[key](...args);
            }
            return void 0;
          };
        });
        SweetAlert.DismissReason = DismissReason;
        SweetAlert.version = "11.26.25";
        const Swal2 = SweetAlert;
        Swal2.default = Swal2;
        return Swal2;
      }));
      if (typeof exports !== "undefined" && exports.Sweetalert2) {
        exports.swal = exports.sweetAlert = exports.Swal = exports.SweetAlert = exports.Sweetalert2;
      }
      "undefined" != typeof document && (function(e, t) {
        var n = e.createElement("style");
        if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet) n.styleSheet.disabled || (n.styleSheet.cssText = t);
        else try {
          n.innerHTML = t;
        } catch (e2) {
          n.innerText = t;
        }
      })(document, ':root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:auto}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:auto}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}');
    }
  });

  // src/utils.ts
  var persianDigits = ["\u06F0", "\u06F1", "\u06F2", "\u06F3", "\u06F4", "\u06F5", "\u06F6", "\u06F7", "\u06F8", "\u06F9"];
  var englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  function toEnglishDigits(str) {
    return str.replace(/[۰-۹]/g, (d) => englishDigits[persianDigits.indexOf(d)]);
  }
  function toPersianDigits(str) {
    return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
  }
  function generateReference() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ref = "";
    for (let i = 0; i < 6; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
    return ref;
  }
  function generateWatcher() {
    return String(Math.floor(1e7 + Math.random() * 9e7));
  }
  function generateFlightNumber() {
    const airlineCodes = ["IR", "W5", "EP", "ZV", "I3", "QB"];
    const code = airlineCodes[Math.floor(Math.random() * airlineCodes.length)];
    const num = Math.floor(1e3 + Math.random() * 9e3);
    return `${code}${num}`;
  }

  // src/dictionary.ts
  var cityAirports = [
    { persianCity: "\u062A\u0647\u0631\u0627\u0646", englishCity: "Tehran", airportPersian: "\u0645\u0647\u0631\u0622\u0628\u0627\u062F", airportEnglish: "Mehrabad International Airport", airportCode: "THR" },
    { persianCity: "\u062A\u0647\u0631\u0627\u0646", englishCity: "Tehran", airportPersian: "\u0627\u0645\u0627\u0645 \u062E\u0645\u06CC\u0646\u06CC", airportEnglish: "Imam Khomeini International Airport", airportCode: "IKA" },
    { persianCity: "\u0645\u0634\u0647\u062F", englishCity: "Mashhad", airportPersian: "\u0634\u0647\u06CC\u062F \u0647\u0627\u0634\u0645\u06CC\u200C\u0646\u0698\u0627\u062F", airportEnglish: "Mashhad International Airport", airportCode: "MHD" },
    { persianCity: "\u0627\u0635\u0641\u0647\u0627\u0646", englishCity: "Isfahan", airportPersian: "\u0634\u0647\u06CC\u062F \u0628\u0647\u0634\u062A\u06CC", airportEnglish: "Isfahan International Airport", airportCode: "IFN" },
    { persianCity: "\u0634\u06CC\u0631\u0627\u0632", englishCity: "Shiraz", airportPersian: "\u0634\u0647\u06CC\u062F \u062F\u0633\u062A\u063A\u06CC\u0628", airportEnglish: "Shiraz International Airport", airportCode: "SYZ" },
    { persianCity: "\u062A\u0628\u0631\u06CC\u0632", englishCity: "Tabriz", airportPersian: "\u0634\u0647\u06CC\u062F \u0645\u062F\u0646\u06CC", airportEnglish: "Tabriz International Airport", airportCode: "TBZ" },
    { persianCity: "\u0627\u0647\u0648\u0627\u0632", englishCity: "Ahvaz", airportPersian: "\u0633\u0631\u062F\u0627\u0631 \u0633\u0644\u06CC\u0645\u0627\u0646\u06CC", airportEnglish: "Ahvaz International Airport", airportCode: "AWZ" },
    { persianCity: "\u06A9\u0631\u0645\u0627\u0646", englishCity: "Kerman", airportPersian: "\u0622\u06CC\u062A\u200C\u0627\u0644\u0644\u0647 \u0647\u0627\u0634\u0645\u06CC \u0631\u0641\u0633\u0646\u062C\u0627\u0646\u06CC", airportEnglish: "Kerman Airport", airportCode: "KER" },
    { persianCity: "\u06CC\u0632\u062F", englishCity: "Yazd", airportPersian: "\u0634\u0647\u06CC\u062F \u0635\u062F\u0648\u0642\u06CC", airportEnglish: "Yazd Airport", airportCode: "AZD" },
    { persianCity: "\u0628\u0646\u062F\u0631\u0639\u0628\u0627\u0633", englishCity: "Bandar Abbas", airportPersian: "\u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u0628\u0646\u062F\u0631\u0639\u0628\u0627\u0633", airportEnglish: "Bandar Abbas International Airport", airportCode: "BND" },
    { persianCity: "\u06A9\u06CC\u0634", englishCity: "Kish", airportPersian: "\u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u06A9\u06CC\u0634", airportEnglish: "Kish International Airport", airportCode: "KIH" },
    { persianCity: "\u0631\u0634\u062A", englishCity: "Rasht", airportPersian: "\u0633\u0631\u062F\u0627\u0631 \u062C\u0646\u06AF\u0644", airportEnglish: "Sardar-e Jangal Airport", airportCode: "RAS" },
    { persianCity: "\u0628\u0648\u0634\u0647\u0631", englishCity: "Bushehr", airportPersian: "\u0634\u0647\u06CC\u062F \u06CC\u0627\u0633\u06CC\u0646\u06CC", airportEnglish: "Bushehr Airport", airportCode: "BUZ" },
    { persianCity: "\u0627\u0631\u062F\u0628\u06CC\u0644", englishCity: "Ardabil", airportPersian: "\u0627\u0631\u062F\u0628\u06CC\u0644", airportEnglish: "Ardabil Airport", airportCode: "ADU" },
    { persianCity: "\u0627\u0631\u0648\u0645\u06CC\u0647", englishCity: "Urmia", airportPersian: "\u0634\u0647\u06CC\u062F \u0628\u0627\u06A9\u0631\u06CC", airportEnglish: "Urmia Airport", airportCode: "OMH" },
    { persianCity: "\u0632\u0627\u0647\u062F\u0627\u0646", englishCity: "Zahedan", airportPersian: "\u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u0632\u0627\u0647\u062F\u0627\u0646", airportEnglish: "Zahedan International Airport", airportCode: "ZAH" },
    { persianCity: "\u0686\u0627\u0628\u0647\u0627\u0631", englishCity: "Chabahar", airportPersian: "\u06A9\u0646\u0627\u0631\u06A9", airportEnglish: "Konarak Airport", airportCode: "ZBR" },
    { persianCity: "\u0632\u0627\u0628\u0644", englishCity: "Zabol", airportPersian: "\u0632\u0627\u0628\u0644", airportEnglish: "Zabol Airport", airportCode: "ACZ" },
    { persianCity: "\u0627\u06CC\u0631\u0627\u0646\u0634\u0647\u0631", englishCity: "Iranshahr", airportPersian: "\u0627\u06CC\u0631\u0627\u0646\u0634\u0647\u0631", airportEnglish: "Iranshahr Airport", airportCode: "IHR" },
    { persianCity: "\u0628\u06CC\u0631\u062C\u0646\u062F", englishCity: "Birjand", airportPersian: "\u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u0628\u06CC\u0631\u062C\u0646\u062F", airportEnglish: "Birjand International Airport", airportCode: "XBJ" },
    { persianCity: "\u0637\u0628\u0633", englishCity: "Tabas", airportPersian: "\u0634\u0647\u06CC\u062F \u0631\u062D\u0645\u0627\u0646\u06CC", airportEnglish: "Tabas Airport", airportCode: "TCX" },
    { persianCity: "\u06A9\u0631\u0645\u0627\u0646\u0634\u0627\u0647", englishCity: "Kermanshah", airportPersian: "\u0634\u0647\u06CC\u062F \u0627\u0634\u0631\u0641\u06CC \u0627\u0635\u0641\u0647\u0627\u0646\u06CC", airportEnglish: "Kermanshah Airport", airportCode: "KSH" },
    { persianCity: "\u0633\u0646\u0646\u062F\u062C", englishCity: "Sanandaj", airportPersian: "\u0633\u0646\u0646\u062F\u062C", airportEnglish: "Sanandaj Airport", airportCode: "SDG" },
    { persianCity: "\u0647\u0645\u062F\u0627\u0646", englishCity: "Hamedan", airportPersian: "\u0647\u0645\u062F\u0627\u0646", airportEnglish: "Hamedan Airport", airportCode: "HDM" },
    { persianCity: "\u062E\u0631\u0645\u200C\u0622\u0628\u0627\u062F", englishCity: "Khorramabad", airportPersian: "\u062E\u0631\u0645\u200C\u0622\u0628\u0627\u062F", airportEnglish: "Khorramabad Airport", airportCode: "KHD" },
    { persianCity: "\u0622\u0628\u0627\u062F\u0627\u0646", englishCity: "Abadan", airportPersian: "\u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u0622\u0628\u0627\u062F\u0627\u0646", airportEnglish: "Abadan International Airport", airportCode: "ABD" },
    { persianCity: "\u062F\u0632\u0641\u0648\u0644", englishCity: "Dezful", airportPersian: "\u062F\u0632\u0641\u0648\u0644", airportEnglish: "Dezful Airport", airportCode: "DEF" },
    { persianCity: "\u0645\u0627\u0647\u0634\u0647\u0631", englishCity: "Mahshahr", airportPersian: "\u0645\u0627\u0647\u0634\u0647\u0631", airportEnglish: "Mahshahr Airport", airportCode: "MRX" },
    { persianCity: "\u06AF\u0631\u06AF\u0627\u0646", englishCity: "Gorgan", airportPersian: "\u06AF\u0631\u06AF\u0627\u0646", airportEnglish: "Gorgan Airport", airportCode: "GBT" },
    { persianCity: "\u0633\u0627\u0631\u06CC", englishCity: "Sari", airportPersian: "\u062F\u0634\u062A \u0646\u0627\u0632", airportEnglish: "Dasht-e Naz Airport", airportCode: "SRY" },
    { persianCity: "\u0631\u0627\u0645\u0633\u0631", englishCity: "Ramsar", airportPersian: "\u0631\u0627\u0645\u0633\u0631", airportEnglish: "Ramsar Airport", airportCode: "RZR" },
    { persianCity: "\u0646\u0648\u0634\u0647\u0631", englishCity: "Nowshahr", airportPersian: "\u0646\u0648\u0634\u0647\u0631", airportEnglish: "Nowshahr Airport", airportCode: "NSH" },
    { persianCity: "\u0642\u0634\u0645", englishCity: "Qeshm", airportPersian: "\u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u0642\u0634\u0645", airportEnglish: "Qeshm International Airport", airportCode: "GSM" },
    { persianCity: "\u0644\u0627\u0631", englishCity: "Lar", airportPersian: "\u0622\u06CC\u062A\u200C\u0627\u0644\u0644\u0647 \u0622\u06CC\u062A\u200C\u0627\u0644\u0644\u0647\u06CC", airportEnglish: "Larestan International Airport", airportCode: "LRR" },
    { persianCity: "\u0644\u0627\u0645\u0631\u062F", englishCity: "Lamerd", airportPersian: "\u0644\u0627\u0645\u0631\u062F", airportEnglish: "Lamerd Airport", airportCode: "LFM" },
    { persianCity: "\u062C\u0647\u0631\u0645", englishCity: "Jahrom", airportPersian: "\u062C\u0647\u0631\u0645", airportEnglish: "Jahrom Airport", airportCode: "JAR" },
    { persianCity: "\u0641\u0633\u0627", englishCity: "Fasa", airportPersian: "\u0641\u0633\u0627", airportEnglish: "Fasa Airport", airportCode: "FAZ" },
    { persianCity: "\u06AF\u0686\u0633\u0627\u0631\u0627\u0646", englishCity: "Gachsaran", airportPersian: "\u06AF\u0686\u0633\u0627\u0631\u0627\u0646", airportEnglish: "Gachsaran Airport", airportCode: "GCH" },
    { persianCity: "\u06CC\u0627\u0633\u0648\u062C", englishCity: "Yasuj", airportPersian: "\u06CC\u0627\u0633\u0648\u062C", airportEnglish: "Yasuj Airport", airportCode: "YES" },
    { persianCity: "\u0627\u06CC\u0644\u0627\u0645", englishCity: "Ilam", airportPersian: "\u0627\u06CC\u0644\u0627\u0645", airportEnglish: "Ilam Airport", airportCode: "IIL" },
    { persianCity: "\u0628\u062C\u0646\u0648\u0631\u062F", englishCity: "Bojnord", airportPersian: "\u0628\u062C\u0646\u0648\u0631\u062F", airportEnglish: "Bojnord Airport", airportCode: "BJB" },
    { persianCity: "\u0633\u0628\u0632\u0648\u0627\u0631", englishCity: "Sabzevar", airportPersian: "\u0634\u0647\u062F\u0627\u06CC \u0633\u0628\u0632\u0648\u0627\u0631", airportEnglish: "Sabzevar Airport", airportCode: "AFZ" },
    { persianCity: "\u06AF\u0646\u0627\u0628\u0627\u062F", englishCity: "Gonabad", airportPersian: "\u06AF\u0646\u0627\u0628\u0627\u062F", airportEnglish: "Gonabad Airport", airportCode: "GKD" },
    { persianCity: "\u0631\u0641\u0633\u0646\u062C\u0627\u0646", englishCity: "Rafsanjan", airportPersian: "\u0631\u0641\u0633\u0646\u062C\u0627\u0646", airportEnglish: "Rafsanjan Airport", airportCode: "RJN" },
    { persianCity: "\u0633\u06CC\u0631\u062C\u0627\u0646", englishCity: "Sirjan", airportPersian: "\u0633\u06CC\u0631\u062C\u0627\u0646", airportEnglish: "Sirjan Airport", airportCode: "SYJ" },
    { persianCity: "\u062C\u06CC\u0631\u0641\u062A", englishCity: "Jiroft", airportPersian: "\u062C\u06CC\u0631\u0641\u062A", airportEnglish: "Jiroft Airport", airportCode: "JYR" },
    { persianCity: "\u0628\u0645", englishCity: "Bam", airportPersian: "\u0628\u0645", airportEnglish: "Bam Airport", airportCode: "BXR" },
    { persianCity: "\u062E\u0631\u0645\u0634\u0647\u0631", englishCity: "Khorramshahr", airportPersian: "\u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u062E\u0631\u0645\u0634\u0647\u0631", airportEnglish: "Khorramshahr International Airport", airportCode: "KHZ" }
  ];
  var airlines = [
    { persianName: "\u0627\u06CC\u0631\u0627\u0646 \u0627\u06CC\u0631", englishName: "Iran Air", code: "IR" },
    { persianName: "\u0645\u0627\u0647\u0627\u0646", englishName: "Mahan Air", code: "W5" },
    { persianName: "\u0622\u0633\u0645\u0627\u0646", englishName: "Aseman Airlines", code: "EP" },
    { persianName: "\u0632\u0627\u06AF\u0631\u0633", englishName: "Zagros Airlines", code: "ZV" },
    { persianName: "\u0622\u062A\u0627", englishName: "ATA Airlines", code: "I3" },
    { persianName: "\u0642\u0634\u0645 \u0627\u06CC\u0631", englishName: "Qeshm Air", code: "QB" },
    { persianName: "\u0645\u0639\u0631\u0627\u062C", englishName: "Meraj Airlines", code: "JI" },
    { persianName: "\u06A9\u06CC\u0634 \u0627\u06CC\u0631", englishName: "Kish Air", code: "Y9" },
    { persianName: "\u06A9\u0627\u0633\u067E\u06CC\u0646", englishName: "Caspian Airlines", code: "RV" },
    { persianName: "\u062A\u0627\u0628\u0627\u0646", englishName: "Taban Air", code: "HH" },
    { persianName: "\u0633\u0627\u0647\u0627", englishName: "Saha Airlines", code: "IRZ" },
    { persianName: "\u0648\u0627\u0631\u0634", englishName: "Varesh Airlines", code: "VRH" },
    { persianName: "\u067E\u0648\u06CC\u0627", englishName: "Pouya Air", code: "PYA" },
    { persianName: "\u06A9\u0627\u0631\u0648\u0646", englishName: "Karun Airlines", code: "IRK" }
  ];
  function getCityEnglish(persian) {
    const f = cityAirports.find((c) => c.persianCity === persian);
    return f ? f.englishCity : persian;
  }
  function getAirportEnglish(persianAirportName) {
    const f = cityAirports.find((c) => c.airportPersian === persianAirportName);
    return f ? f.airportEnglish : persianAirportName;
  }
  function getAirlineEnglish(persian) {
    const f = airlines.find((a) => a.persianName === persian);
    return f ? f.englishName : persian;
  }

  // src/renderer.ts
  var import_sweetalert2 = __toESM(require_sweetalert2_all());
  var $ = jQuery;
  var api = window.electronAPI;
  var tickets = [];
  var editingId = null;
  var passengers = [];
  var currentPreviewTickets = [];
  var currentPreviewIsFull = true;
  var searchTerm = "";
  function computeTotal(price, penalty) {
    return Math.round(price * (1 - penalty / 100));
  }
  function formatPrice(value) {
    let eng = toEnglishDigits(value).replace(/[^0-9]/g, "");
    if (eng === "") return "";
    let formatted = "";
    for (let i = eng.length - 1, count = 0; i >= 0; i--, count++) {
      if (count > 0 && count % 3 === 0) formatted = "," + formatted;
      formatted = eng[i] + formatted;
    }
    return toPersianDigits(formatted);
  }
  function unformatPrice(str) {
    return parseInt(toEnglishDigits(str).replace(/,/g, "")) || 0;
  }
  async function loadTickets() {
    tickets = await api.getAllTickets();
    const tbody = document.getElementById("ticketsTableBody");
    tbody.innerHTML = "";
    tickets.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" class="ticket-checkbox" data-id="${t.id}"></td>
        <td>${toPersianDigits(String(t.row_number))}</td>
        <td>${t.first_name_persian} ${t.last_name_persian}</td>
        <td>${t.origin_city}</td>
        <td>${t.destination_city}</td>
        <td>${toPersianDigits(t.flight_date)}</td>
        <td>${t.flight_number}</td>
        <td>
        <button class="btn btn-sm btn-warning edit-btn" data-id="${t.id}">\u0648\u06CC\u0631\u0627\u06CC\u0634</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${t.id}">\u062D\u0630\u0641</button>
        <button class="btn btn-sm btn-info preview-btn" data-id="${t.id}">\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634</button>
        </td>`;
      tbody.appendChild(tr);
    });
    bindTableEvents();
    updateMultiButtons();
    applySearchFilter();
  }
  function applySearchFilter() {
    const filter = searchTerm.toLowerCase().trim();
    const rows = document.querySelectorAll("#ticketsTableBody tr");
    rows.forEach((row) => {
      const text = (row.textContent || "").toLowerCase();
      row.style.display = filter === "" || text.includes(filter) ? "" : "none";
    });
  }
  function bindTableEvents() {
    document.querySelectorAll(".edit-btn").forEach((b) => b.addEventListener("click", async (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      editTicket(id);
    }));
    document.querySelectorAll(".delete-btn").forEach((b) => b.addEventListener("click", async (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      const result = await import_sweetalert2.default.fire({
        title: "\u0622\u06CC\u0627 \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062A\u06CC\u062F\u061F",
        text: "\u0627\u06CC\u0646 \u0639\u0645\u0644\u06CC\u0627\u062A \u0642\u0627\u0628\u0644 \u0628\u0627\u0632\u06AF\u0634\u062A \u0646\u06CC\u0633\u062A!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "\u0628\u0644\u0647\u060C \u062D\u0630\u0641 \u06A9\u0646",
        cancelButtonText: "\u0644\u063A\u0648",
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#6c757d"
      });
      if (result.isConfirmed) {
        await api.deleteTicket(id);
        loadTickets();
        import_sweetalert2.default.fire("\u062D\u0630\u0641 \u0634\u062F!", "\u0628\u0644\u06CC\u0637 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062D\u0630\u0641 \u0634\u062F.", "success");
      }
    }));
    document.querySelectorAll(".preview-btn").forEach((b) => b.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      const t = tickets.find((tk) => tk.id === id);
      if (t) showPreview([t]);
    }));
  }
  document.getElementById("selectAll").addEventListener("change", (e) => {
    const ch = e.target.checked;
    document.querySelectorAll(".ticket-checkbox").forEach((cb) => cb.checked = ch);
    updateMultiButtons();
  });
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("ticket-checkbox")) updateMultiButtons();
  });
  function getSelectedIds() {
    return Array.from(document.querySelectorAll(".ticket-checkbox:checked")).map((cb) => parseInt(cb.dataset.id));
  }
  function updateMultiButtons() {
    const sel = getSelectedIds();
    document.getElementById("previewSelectedBtn").disabled = sel.length === 0;
  }
  async function editTicket(id) {
    const ticket = await api.getTicketById(id);
    if (!ticket) return;
    editingId = id;
    passengers = [{
      firstNameFa: ticket.first_name_persian,
      lastNameFa: ticket.last_name_persian,
      firstNameEn: ticket.first_name_english,
      lastNameEn: ticket.last_name_english
    }];
    buildForm(ticket);
  }
  async function showPreview(ticketsToPreview) {
    currentPreviewTickets = ticketsToPreview;
    const result = await import_sweetalert2.default.fire({
      title: "\u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u0648\u0639 \u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634",
      html: "\u0686\u0647 \u0646\u0633\u062E\u0647\u200C\u0627\u06CC \u0631\u0627 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u0645\u0634\u0627\u0647\u062F\u0647 \u06A9\u0646\u06CC\u062F\u061F",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "\u0646\u0633\u062E\u0647 \u06A9\u0627\u0645\u0644 (\u0622\u0698\u0627\u0646\u0633)",
      cancelButtonText: "\u0646\u0633\u062E\u0647 \u0645\u0634\u062A\u0631\u06CC",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f0ad4e",
      reverseButtons: true,
      focusCancel: true
    });
    if (result.isDismissed && result.dismiss !== import_sweetalert2.default.DismissReason.cancel) return;
    const isFull = result.isConfirmed;
    currentPreviewIsFull = isFull;
    const modalBody = document.getElementById("previewContent");
    let html = "";
    ticketsToPreview.forEach((t, idx) => {
      html += buildPreviewHTML(t, isFull);
      if (idx < ticketsToPreview.length - 1) html += '<div style="page-break-after: always;"></div>';
    });
    modalBody.innerHTML = html;
    const modalEl = document.getElementById("previewModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    document.getElementById("printPreviewBtn").onclick = () => window.print();
    document.getElementById("exportPreviewBtn").onclick = () => exportPreviewAsImage();
  }
  function buildPreviewHTML(ticket, isFull) {
    const originCityEn = getCityEnglish(ticket.origin_city);
    const destCityEn = getCityEnglish(ticket.destination_city);
    const originAirportEn = getAirportEnglish(ticket.origin_airport);
    const destAirportEn = getAirportEnglish(ticket.destination_airport);
    const airlineEn = getAirlineEnglish(ticket.airline);
    return `
    <div class="ticket-preview">
    <h5>Ticket #${ticket.row_number}</h5>
    <p><strong>Passenger:</strong> ${ticket.first_name_english} ${ticket.last_name_english} (Adult)</p>
    <p><strong>Route:</strong> ${originCityEn} (${originAirportEn}) \u2192 ${destCityEn} (${destAirportEn})</p>
    <p><strong>Date:</strong> ${ticket.flight_date} &nbsp; <strong>Time:</strong> ${ticket.flight_time}</p>
    <p><strong>Airline:</strong> ${airlineEn} &nbsp; <strong>Flight:</strong> ${ticket.flight_number}</p>
    <p><strong>Baggage Allowance:</strong> ${ticket.max_baggage} kg</p>
    <p><strong>Ticket Price:</strong> ${ticket.ticket_price.toLocaleString()} Rial</p>
    ${isFull ? `
        <p><strong>Reference:</strong> ${ticket.reference}</p>
        <p><strong>Watcher:</strong> ${ticket.watcher}</p>
        <p><strong>Penalty:</strong> ${ticket.penalty_percent}%</p>
        <p><strong>Refundable Amount:</strong> ${ticket.total_price.toLocaleString()} Rial</p>
        ` : ""}
        <div class="stamp-area">Stamp / Seal</div>
        ${!isFull ? `<p class="required-note">Passenger presence at the airport is mandatory at least 2 hours for domestic and 3 hours for international flights.</p>` : ""}
        </div>`;
  }
  async function exportPreviewAsImage() {
    const ticketsToExport = currentPreviewTickets;
    if (!ticketsToExport.length) return;
    let savedCount = 0;
    for (const ticket of ticketsToExport) {
      const container = document.createElement("div");
      container.style.cssText = "position:absolute;left:-9999px;top:0;";
      container.innerHTML = buildPreviewHTML(ticket, currentPreviewIsFull);
      document.body.appendChild(container);
      const canvas = await html2canvas(container, { scale: 2 });
      document.body.removeChild(container);
      const dataUrl = canvas.toDataURL("image/png");
      const year = ticket.flight_date.split("/")[0];
      const fileName = `${year}.${ticket.row_number}.png`;
      const filePath = await api.saveImage(dataUrl, fileName);
      if (filePath) {
        savedCount++;
      } else {
        break;
      }
    }
    if (savedCount === 0) {
      return;
    } else if (savedCount < ticketsToExport.length) {
      import_sweetalert2.default.fire("\u062A\u0648\u0642\u0641", `${savedCount} \u0641\u0627\u06CC\u0644 \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F. \u0628\u0627\u0642\u06CC \u0644\u063A\u0648 \u06AF\u0631\u062F\u06CC\u062F.`, "warning");
    } else {
      import_sweetalert2.default.fire("\u0630\u062E\u06CC\u0631\u0647 \u0634\u062F", `${savedCount} \u0641\u0627\u06CC\u0644 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F.`, "success");
    }
  }
  document.getElementById("previewSelectedBtn").addEventListener("click", () => {
    const ids = getSelectedIds();
    const selected = tickets.filter((t) => ids.includes(t.id));
    if (selected.length) showPreview(selected);
  });
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    applySearchFilter();
  });
  document.getElementById("newTicketBtn").addEventListener("click", () => {
    editingId = null;
    passengers = [{ firstNameFa: "", lastNameFa: "", firstNameEn: "", lastNameEn: "" }];
    buildForm();
  });
  function buildForm(existingTicket) {
    const container = document.getElementById("formContainer");
    container.classList.add("visible");
    const hours = Array.from({ length: 24 }, (_, i) => {
      const n = i.toString().padStart(2, "0");
      return { english: n, persian: toPersianDigits(n) };
    });
    const minutes = Array.from({ length: 12 }, (_, i) => {
      const n = (i * 5).toString().padStart(2, "0");
      return { english: n, persian: toPersianDigits(n) };
    });
    const refreshSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
    </svg>`;
    let html = `
    <h4 class="mb-4 text-center" style="color: #2c3e50;">${existingTicket ? "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0628\u0644\u06CC\u0637" : "\u062B\u0628\u062A \u0628\u0644\u06CC\u0637 \u062C\u062F\u06CC\u062F"}</h4>
    <form id="ticketForm" class="row g-3">
    <div class="col-md-6">
    <label class="form-label">\u0634\u0647\u0631 \u0645\u0628\u062F\u0627</label>
    <select id="originCity" class="form-select searchable" required>
    <option value="">\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F</option>
    ${[...new Set(cityAirports.map((c) => c.persianCity))].map((city) => `<option value="${city}" ${existingTicket?.origin_city === city ? "selected" : ""}>${city}</option>`).join("")}
    </select>
    </div>
    <div class="col-md-6">
    <label class="form-label">\u0634\u0647\u0631 \u0645\u0642\u0635\u062F</label>
    <select id="destCity" class="form-select searchable" required>
    <option value="">\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F</option>
    ${[...new Set(cityAirports.map((c) => c.persianCity))].map((city) => `<option value="${city}" ${existingTicket?.destination_city === city ? "selected" : ""}>${city}</option>`).join("")}
    </select>
    </div>
    <div class="col-md-6">
    <label class="form-label">\u0641\u0631\u0648\u062F\u06AF\u0627\u0647 \u0645\u0628\u062F\u0627</label>
    <select id="originAirport" class="form-select searchable" required></select>
    </div>
    <div class="col-md-6">
    <label class="form-label">\u0641\u0631\u0648\u062F\u06AF\u0627\u0647 \u0645\u0642\u0635\u062F</label>
    <select id="destAirport" class="form-select searchable" required></select>
    </div>
    <div class="col-md-6">
    <label class="form-label">\u062A\u0627\u0631\u06CC\u062E (\u062C\u0644\u0627\u0644\u06CC)</label>
    <input type="text" id="flightDate" class="form-control" data-jdp value="${existingTicket?.flight_date || ""}" required>
    </div>
    <div class="col-md-3">
    <label class="form-label">\u0633\u0627\u0639\u062A \u067E\u0631\u0648\u0627\u0632</label>
    <select id="flightHour" class="form-select" required>
    ${hours.map((h) => `<option value="${h.english}" ${existingTicket?.flight_time?.startsWith(h.english + ":") ? "selected" : ""}>${h.persian}</option>`).join("")}
    </select>
    </div>
    <div class="col-md-3">
    <label class="form-label">\u062F\u0642\u06CC\u0642\u0647</label>
    <select id="flightMinute" class="form-select" required>
    ${minutes.map((m) => `<option value="${m.english}" ${existingTicket?.flight_time?.endsWith(":" + m.english) ? "selected" : ""}>${m.persian}</option>`).join("")}
    </select>
    </div>
    <div class="col-md-6">
    <label class="form-label">\u0627\u06CC\u0631\u0644\u0627\u06CC\u0646</label>
    <select id="airline" class="form-select searchable" required>
    <option value="">\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F</option>
    ${airlines.map((a) => `<option value="${a.persianName}" ${existingTicket?.airline === a.persianName ? "selected" : ""}>${a.persianName}</option>`).join("")}
    </select>
    </div>
    <div class="col-md-3">
    <label class="form-label">\u0634\u0645\u0627\u0631\u0647 \u067E\u0631\u0648\u0627\u0632</label>
    <div class="input-group">
    <input type="text" id="flightNumber" class="form-control" value="${existingTicket?.flight_number || ""}" required>
    <button type="button" class="btn btn-outline-secondary auto-flight" title="\u062A\u0648\u0644\u06CC\u062F \u062A\u0635\u0627\u062F\u0641\u06CC">${refreshSVG}</button>
    </div>
    </div>
    <div class="col-md-3">
    <label class="form-label">\u062D\u062F\u0627\u06A9\u062B\u0631 \u0628\u0627\u0631 (kg)</label>
    <input type="text" id="maxBaggage" class="form-control numeric" value="${existingTicket ? toPersianDigits(String(existingTicket.max_baggage)) : "\u06F2\u06F0"}" required>
    </div>

    <div class="col-md-3">
    <label class="form-label">\u0646\u0627\u0638\u0631 (\u06F8 \u0631\u0642\u0645\u06CC)</label>
    <div class="input-group">
    <input type="text" id="watcher" class="form-control numeric" value="${existingTicket ? toPersianDigits(existingTicket.watcher) : ""}" required>
    <button type="button" class="btn btn-outline-secondary auto-watcher" title="\u062A\u0648\u0644\u06CC\u062F \u062A\u0635\u0627\u062F\u0641\u06CC">${refreshSVG}</button>
    </div>
    </div>
    <div class="col-md-3">
    <label class="form-label">\u0645\u0631\u062C\u0639 (\u06F6 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631)</label>
    <div class="input-group">
    <input type="text" id="reference" class="form-control" value="${existingTicket?.reference || ""}" required>
    <button type="button" class="btn btn-outline-secondary auto-ref" title="\u062A\u0648\u0644\u06CC\u062F \u062A\u0635\u0627\u062F\u0641\u06CC">${refreshSVG}</button>
    </div>
    </div>

    <div class="col-md-6">
    <label class="form-label">\u0642\u06CC\u0645\u062A \u0628\u0644\u06CC\u0637 (\u0631\u06CC\u0627\u0644)</label>
    <input type="text" id="ticketPrice" class="form-control numeric price-input" value="${existingTicket ? formatPrice(String(existingTicket.ticket_price)) : ""}" required>
    </div>
    <div class="col-12"></div>
    <div class="col-md-6">
    <label class="form-label">\u062F\u0631\u0635\u062F \u062C\u0631\u06CC\u0645\u0647</label>
    <input type="text" id="penaltyPercent" class="form-control numeric" value="${existingTicket ? toPersianDigits(String(existingTicket.penalty_percent)) : "\u06F0"}" required>
    </div>
    <div class="col-md-6">
    <label class="form-label">\u0642\u06CC\u0645\u062A \u06A9\u0644</label>
    <input type="text" id="totalPrice" class="form-control" readonly>
    </div>

    <div class="col-12 mt-4">
    <h5 class="mb-3" style="color: #2c3e50;">\u0645\u0633\u0627\u0641\u0631\u0627\u0646</h5>
    <div id="passengerList"></div>
    <button type="button" id="addPassengerBtn" class="btn btn-outline-primary btn-sm mt-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
    \u0627\u0641\u0632\u0648\u062F\u0646 \u0645\u0633\u0627\u0641\u0631
    </button>
    </div>

    <div class="col-12 d-flex justify-content-end gap-3 mt-4">
    <button type="button" id="cancelFormBtn" class="btn btn-outline-secondary btn-lg px-5">\u0627\u0646\u0635\u0631\u0627\u0641</button>
    <button type="submit" class="btn btn-success btn-lg px-5">\u0630\u062E\u06CC\u0631\u0647</button>
    </div>
    </form>`;
    container.innerHTML = html;
    $(".searchable").select2({
      placeholder: "\u062C\u0633\u062A\u062C\u0648...",
      language: { noResults: () => "\u0646\u062A\u06CC\u062C\u0647\u200C\u0627\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" }
    });
    jalaliDatepicker.startWatch({
      input: document.getElementById("flightDate"),
      persianDigits: true
    });
    const populateAirports = (citySelectId, airportSelectId, existingValue) => {
      const cityVal = $(`#${citySelectId}`).val();
      const $airport = $(`#${airportSelectId}`);
      $airport.empty();
      if (!cityVal) {
        $airport.append('<option value="">\u0627\u0628\u062A\u062F\u0627 \u0634\u0647\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F</option>');
      } else {
        const airports = cityAirports.filter((c) => c.persianCity === cityVal);
        airports.forEach((ap) => {
          const selected = existingValue === ap.airportPersian ? " selected" : "";
          $airport.append(`<option value="${ap.airportPersian}"${selected}>${ap.airportPersian}</option>`);
        });
        if (airports.length === 1) {
          $airport.val(airports[0].airportPersian).trigger("change");
        }
      }
      $airport.select2({ placeholder: "\u0627\u0646\u062A\u062E\u0627\u0628 \u0641\u0631\u0648\u062F\u06AF\u0627\u0647" });
    };
    populateAirports("originCity", "originAirport", existingTicket?.origin_airport);
    populateAirports("destCity", "destAirport", existingTicket?.destination_airport);
    $("#originCity").on("change", () => populateAirports("originCity", "originAirport"));
    $("#destCity").on("change", () => populateAirports("destCity", "destAirport"));
    renderPassengerInputs();
    attachFormEvents(existingTicket);
  }
  function renderPassengerInputs() {
    const listDiv = document.getElementById("passengerList");
    listDiv.innerHTML = passengers.map((p, idx) => `
    <div class="passenger-row row g-3 align-items-center mt-3">
    <div class="col-md-3">
    <label class="form-label">\u0646\u0627\u0645 \u0641\u0627\u0631\u0633\u06CC</label>
    <input class="form-control" placeholder="\u0646\u0627\u0645" value="${p.firstNameFa}" data-idx="${idx}" data-field="firstNameFa">
    </div>
    <div class="col-md-3">
    <label class="form-label">\u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC \u0641\u0627\u0631\u0633\u06CC</label>
    <input class="form-control" placeholder="\u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC" value="${p.lastNameFa}" data-idx="${idx}" data-field="lastNameFa">
    </div>
    <div class="col-md-3">
    <label class="form-label">First Name</label>
    <input class="form-control" placeholder="First" value="${p.firstNameEn}" data-idx="${idx}" data-field="firstNameEn">
    </div>
    <div class="col-md-3">
    <label class="form-label">Last Name</label>
    <input class="form-control" placeholder="Last" value="${p.lastNameEn}" data-idx="${idx}" data-field="lastNameEn">
    </div>
    ${idx > 0 ? `<div class="col-12 text-end"><button type="button" class="btn btn-danger btn-sm remove-passenger" data-idx="${idx}">\u062D\u0630\u0641 \u0645\u0633\u0627\u0641\u0631</button></div>` : ""}
    </div>`).join("");
    document.querySelectorAll(".remove-passenger").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx);
        passengers.splice(idx, 1);
        renderPassengerInputs();
      });
    });
    listDiv.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const target = e.target;
        const idx = parseInt(target.dataset.idx);
        const field = target.dataset.field;
        passengers[idx][field] = target.value;
      });
    });
    document.getElementById("addPassengerBtn").onclick = () => {
      passengers.push({ firstNameFa: "", lastNameFa: "", firstNameEn: "", lastNameEn: "" });
      renderPassengerInputs();
    };
  }
  function attachFormEvents(existingTicket) {
    const form = document.getElementById("ticketForm");
    document.getElementById("cancelFormBtn").onclick = () => {
      const container = document.getElementById("formContainer");
      container.classList.remove("visible");
    };
    document.querySelectorAll(".numeric").forEach((inp) => {
      inp.addEventListener("input", (e) => {
        const target = e.target;
        target.value = toPersianDigits(toEnglishDigits(target.value).replace(/[^0-9]/g, ""));
      });
    });
    const priceInp = document.getElementById("ticketPrice");
    priceInp.addEventListener("input", () => {
      const raw = toEnglishDigits(priceInp.value).replace(/,/g, "");
      if (raw === "") {
        priceInp.value = "";
        return;
      }
      priceInp.value = formatPrice(raw);
    });
    document.querySelector(".auto-watcher")?.addEventListener("click", () => {
      document.getElementById("watcher").value = toPersianDigits(generateWatcher());
    });
    document.querySelector(".auto-ref")?.addEventListener("click", () => {
      document.getElementById("reference").value = generateReference();
    });
    document.querySelector(".auto-flight")?.addEventListener("click", () => {
      document.getElementById("flightNumber").value = generateFlightNumber();
    });
    const penaltyInp = document.getElementById("penaltyPercent");
    const totalInp = document.getElementById("totalPrice");
    const updateTotal = () => {
      const price = unformatPrice(priceInp.value);
      const penalty = parseInt(toEnglishDigits(penaltyInp.value)) || 0;
      totalInp.value = formatPrice(String(computeTotal(price, penalty)));
    };
    priceInp.addEventListener("input", updateTotal);
    penaltyInp.addEventListener("input", updateTotal);
    updateTotal();
    form.onsubmit = async (e) => {
      e.preventDefault();
      const shared = {
        origin_city: $("#originCity").val(),
        destination_city: $("#destCity").val(),
        origin_airport: $("#originAirport").val(),
        destination_airport: $("#destAirport").val(),
        flight_date: document.getElementById("flightDate").value,
        flight_time: `${document.getElementById("flightHour").value}:${document.getElementById("flightMinute").value}`,
        airline: $("#airline").val(),
        flight_number: document.getElementById("flightNumber").value,
        max_baggage: parseInt(toEnglishDigits(document.getElementById("maxBaggage").value)) || 20,
        ticket_price: unformatPrice(priceInp.value),
        penalty_percent: parseInt(toEnglishDigits(penaltyInp.value)) || 0,
        total_price: unformatPrice(totalInp.value),
        watcher: toEnglishDigits(document.getElementById("watcher").value),
        reference: document.getElementById("reference").value
      };
      if (!passengers.length) {
        import_sweetalert2.default.fire("\u062E\u0637\u0627", "\u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9 \u0645\u0633\u0627\u0641\u0631 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.", "error");
        return;
      }
      if (editingId) {
        const p = passengers[0];
        await api.updateTicket(editingId, {
          ...shared,
          row_number: existingTicket.row_number,
          first_name_persian: p.firstNameFa,
          last_name_persian: p.lastNameFa,
          first_name_english: p.firstNameEn,
          last_name_english: p.lastNameEn,
          group_id: null
        });
        import_sweetalert2.default.fire("\u0645\u0648\u0641\u0642", "\u0628\u0644\u06CC\u0637 \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0634\u062F.", "success");
      } else {
        const maxRow = await api.getMaxRowNumber();
        let rowNum = maxRow + 1;
        const groupId = passengers.length > 1 ? `GRP-${Date.now()}-${Math.floor(Math.random() * 1e3)}` : null;
        for (const p of passengers) {
          await api.insertTicket({
            ...shared,
            row_number: rowNum++,
            first_name_persian: p.firstNameFa,
            last_name_persian: p.lastNameFa,
            first_name_english: p.firstNameEn,
            last_name_english: p.lastNameEn,
            group_id: groupId
          });
        }
        import_sweetalert2.default.fire("\u0645\u0648\u0641\u0642", "\u0628\u0644\u06CC\u0637(\u0647\u0627) \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F.", "success");
      }
      const container = document.getElementById("formContainer");
      container.classList.remove("visible");
      editingId = null;
      passengers = [];
      loadTickets();
    };
  }
  loadTickets();
})();
/*! Bundled license information:

sweetalert2/dist/sweetalert2.all.js:
  (*!
  * sweetalert2 v11.26.25
  * Released under the MIT License.
  *)
*/
