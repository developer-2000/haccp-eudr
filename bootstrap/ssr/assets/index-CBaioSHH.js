import { c, a as cB, b as cE, d as cM, i as iconSwitchTransition, N as NIconSwitchTransition, u as useConfig, e as useRtl, f as useTheme, g as createKey, h as useThemeClass, j as NBaseLoading, k as NFadeInExpandTransition } from "./_common-Dc_o1R5u.js";
import { B, X, m, l, n } from "./_common-Dc_o1R5u.js";
import { m as messageLight } from "./dark-IQH-hZ2R.js";
import { N, e, f, g, h, j, k, l as l2, o, n as n2, p, q, r, t, u, b, c as c2, d, v, w, x, y, z, A, B as B2, C, D, E, F, G, I, J, H, K, O, L, M, i, a, P, Q, R, S, T, U, V, W, X as X2, Y, Z, _, $, a0, a1, a2, a3, s, a4, a5, a6, a7, a8, a9, aa, ab, ac, ad, ae, af, ag, ah, ai, ak, aj, al, am, an } from "./dark-IQH-hZ2R.js";
import { f as fadeInHeightExpandTransition, r as render, N as NBaseClose, m as messageProviderInjectionKey, a as NBaseIcon, E as ErrorIcon, W as WarningIcon, S as SuccessIcon, I as InfoIcon, o as omit, b as messageApiInjectionKey, c as createId } from "./Tabs-vrLIIUBX.js";
import { e as e2, h as h2, j as j2, l as l3, n as n3, q as q2, u as u2, w as w2, y as y2, B as B3, D as D2, G as G2, J as J2, L as L2, P as P2, Q as Q2, T as T2, V as V2, Y as Y2, _ as _2, a0 as a02, a2 as a22, a4 as a42, a6 as a62, a8 as a82, d as d2, g as g2, k as k2, i as i2, ab as ab2, p as p2, s as s2, v as v2, t as t2, x as x2, aa as aa2, C as C2, A as A2, F as F2, K as K2, H as H2, O as O2, R as R2, U as U2, Z as Z2, X as X3, $ as $2, a3 as a32, a1 as a12, a5 as a52, a7 as a72, a9 as a92, M as M2, z as z2 } from "./Tabs-vrLIIUBX.js";
import { defineComponent, h as h3, inject, computed, ref, onMounted, Fragment, Teleport, provide, reactive } from "vue";
import { N as N2, s as s3 } from "./Space-hqCJ-i3G.js";
import { N as N3, s as s4 } from "./Switch-tnSHOxTf.js";
import "@emotion/hash";
import "lodash-es";
import "date-fns";
import "date-fns-tz";
import "async-validator";
import "date-fns/locale";
import "@juggle/resize-observer";
const messageProps = {
  icon: Function,
  type: {
    type: String,
    default: "info"
  },
  content: [String, Number, Function],
  showIcon: {
    type: Boolean,
    default: true
  },
  closable: Boolean,
  keepAliveOnHover: Boolean,
  onClose: Function,
  onMouseenter: Function,
  onMouseleave: Function
};
const style = c([cB("message-wrapper", `
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `, [fadeInHeightExpandTransition({
  overflow: "visible",
  originalTransition: "transform .3s var(--n-bezier)",
  enterToProps: {
    transform: "scale(1)"
  },
  leaveToProps: {
    transform: "scale(0.85)"
  }
})]), cB("message", `
 box-sizing: border-box;
 display: flex;
 align-items: center;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 margin-bottom .3s var(--n-bezier);
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 border: var(--n-border);
 flex-wrap: nowrap;
 overflow: hidden;
 max-width: var(--n-max-width);
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-shadow: var(--n-box-shadow);
 `, [cE("content", `
 display: inline-block;
 line-height: var(--n-line-height);
 font-size: var(--n-font-size);
 `), cE("icon", `
 position: relative;
 margin: var(--n-icon-margin);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 flex-shrink: 0;
 `, [["default", "info", "success", "warning", "error", "loading"].map((type) => cM(`${type}-type`, [c("> *", `
 color: var(--n-icon-color-${type});
 transition: color .3s var(--n-bezier);
 `)])), c("> *", `
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `, [iconSwitchTransition()])]), cE("close", `
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 flex-shrink: 0;
 `, [c("&:hover", `
 color: var(--n-close-icon-color-hover);
 `), c("&:active", `
 color: var(--n-close-icon-color-pressed);
 `)])]), cB("message-container", `
 z-index: 6000;
 position: fixed;
 height: 0;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: center;
 `, [cM("top", `
 top: 12px;
 left: 0;
 right: 0;
 `), cM("top-left", `
 top: 12px;
 left: 12px;
 right: 0;
 align-items: flex-start;
 `), cM("top-right", `
 top: 12px;
 left: 0;
 right: 12px;
 align-items: flex-end;
 `), cM("bottom", `
 bottom: 4px;
 left: 0;
 right: 0;
 justify-content: flex-end;
 `), cM("bottom-left", `
 bottom: 4px;
 left: 12px;
 right: 0;
 justify-content: flex-end;
 align-items: flex-start;
 `), cM("bottom-right", `
 bottom: 4px;
 left: 0;
 right: 12px;
 justify-content: flex-end;
 align-items: flex-end;
 `)])]);
const iconRenderMap = {
  info: () => h3(InfoIcon, null),
  success: () => h3(SuccessIcon, null),
  warning: () => h3(WarningIcon, null),
  error: () => h3(ErrorIcon, null),
  default: () => null
};
const NMessage = defineComponent({
  name: "Message",
  props: Object.assign(Object.assign({}, messageProps), {
    render: Function
  }),
  setup(props) {
    const {
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const {
      props: messageProviderProps2,
      mergedClsPrefixRef
    } = inject(messageProviderInjectionKey);
    const rtlEnabledRef = useRtl("Message", mergedRtlRef, mergedClsPrefixRef);
    const themeRef = useTheme("Message", "-message", style, messageLight, messageProviderProps2, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          padding,
          margin,
          maxWidth,
          iconMargin,
          closeMargin,
          closeSize,
          iconSize,
          fontSize,
          lineHeight,
          borderRadius,
          border,
          iconColorInfo,
          iconColorSuccess,
          iconColorWarning,
          iconColorError,
          iconColorLoading,
          closeIconSize,
          closeBorderRadius,
          [createKey("textColor", type)]: textColor,
          [createKey("boxShadow", type)]: boxShadow,
          [createKey("color", type)]: color,
          [createKey("closeColorHover", type)]: closeColorHover,
          [createKey("closeColorPressed", type)]: closeColorPressed,
          [createKey("closeIconColor", type)]: closeIconColor,
          [createKey("closeIconColorPressed", type)]: closeIconColorPressed,
          [createKey("closeIconColorHover", type)]: closeIconColorHover
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-margin": margin,
        "--n-padding": padding,
        "--n-max-width": maxWidth,
        "--n-font-size": fontSize,
        "--n-icon-margin": iconMargin,
        "--n-icon-size": iconSize,
        "--n-close-icon-size": closeIconSize,
        "--n-close-border-radius": closeBorderRadius,
        "--n-close-size": closeSize,
        "--n-close-margin": closeMargin,
        "--n-text-color": textColor,
        "--n-color": color,
        "--n-box-shadow": boxShadow,
        "--n-icon-color-info": iconColorInfo,
        "--n-icon-color-success": iconColorSuccess,
        "--n-icon-color-warning": iconColorWarning,
        "--n-icon-color-error": iconColorError,
        "--n-icon-color-loading": iconColorLoading,
        "--n-close-color-hover": closeColorHover,
        "--n-close-color-pressed": closeColorPressed,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-line-height": lineHeight,
        "--n-border-radius": borderRadius,
        "--n-border": border
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("message", computed(() => props.type[0]), cssVarsRef, {}) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      messageProviderProps: messageProviderProps2,
      handleClose() {
        var _a;
        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
      },
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender,
      placement: messageProviderProps2.placement
    };
  },
  render() {
    const {
      render: renderMessage,
      type,
      closable,
      content,
      mergedClsPrefix,
      cssVars,
      themeClass,
      onRender,
      icon,
      handleClose,
      showIcon
    } = this;
    onRender === null || onRender === void 0 ? void 0 : onRender();
    let iconNode;
    return h3("div", {
      class: [`${mergedClsPrefix}-message-wrapper`, themeClass],
      onMouseenter: this.onMouseenter,
      onMouseleave: this.onMouseleave,
      style: [{
        alignItems: this.placement.startsWith("top") ? "flex-start" : "flex-end"
      }, cssVars]
    }, renderMessage ? renderMessage(this.$props) : h3("div", {
      class: [`${mergedClsPrefix}-message ${mergedClsPrefix}-message--${type}-type`, this.rtlEnabled && `${mergedClsPrefix}-message--rtl`]
    }, (iconNode = createIconVNode(icon, type, mergedClsPrefix)) && showIcon ? h3("div", {
      class: `${mergedClsPrefix}-message__icon ${mergedClsPrefix}-message__icon--${type}-type`
    }, h3(NIconSwitchTransition, null, {
      default: () => iconNode
    })) : null, h3("div", {
      class: `${mergedClsPrefix}-message__content`
    }, render(content)), closable ? h3(NBaseClose, {
      clsPrefix: mergedClsPrefix,
      class: `${mergedClsPrefix}-message__close`,
      onClick: handleClose,
      absolute: true
    }) : null));
  }
});
function createIconVNode(icon, type, clsPrefix) {
  if (typeof icon === "function") {
    return icon();
  } else {
    const innerIcon = type === "loading" ? h3(NBaseLoading, {
      clsPrefix,
      strokeWidth: 24,
      scale: 0.85
    }) : iconRenderMap[type]();
    if (!innerIcon) return null;
    return h3(NBaseIcon, {
      clsPrefix,
      key: type
    }, {
      default: () => innerIcon
    });
  }
}
const MessageEnvironment = defineComponent({
  name: "MessageEnvironment",
  props: Object.assign(Object.assign({}, messageProps), {
    duration: {
      type: Number,
      default: 3e3
    },
    onAfterLeave: Function,
    onLeave: Function,
    internalKey: {
      type: String,
      required: true
    },
    // private
    onInternalAfterLeave: Function,
    // deprecated
    onHide: Function,
    onAfterHide: Function
  }),
  setup(props) {
    let timerId = null;
    const showRef = ref(true);
    onMounted(() => {
      setHideTimeout();
    });
    function setHideTimeout() {
      const {
        duration
      } = props;
      if (duration) {
        timerId = window.setTimeout(hide, duration);
      }
    }
    function handleMouseenter(e3) {
      if (e3.currentTarget !== e3.target) return;
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    }
    function handleMouseleave(e3) {
      if (e3.currentTarget !== e3.target) return;
      setHideTimeout();
    }
    function hide() {
      const {
        onHide
      } = props;
      showRef.value = false;
      if (timerId) {
        window.clearTimeout(timerId);
        timerId = null;
      }
      if (onHide) onHide();
    }
    function handleClose() {
      const {
        onClose
      } = props;
      if (onClose) onClose();
      hide();
    }
    function handleAfterLeave() {
      const {
        onAfterLeave,
        onInternalAfterLeave,
        onAfterHide,
        internalKey
      } = props;
      if (onAfterLeave) onAfterLeave();
      if (onInternalAfterLeave) onInternalAfterLeave(internalKey);
      if (onAfterHide) onAfterHide();
    }
    function deactivate() {
      hide();
    }
    return {
      show: showRef,
      hide,
      handleClose,
      handleAfterLeave,
      handleMouseleave,
      handleMouseenter,
      deactivate
    };
  },
  render() {
    return h3(NFadeInExpandTransition, {
      appear: true,
      onAfterLeave: this.handleAfterLeave,
      onLeave: this.onLeave
    }, {
      default: () => [this.show ? h3(NMessage, {
        content: this.content,
        type: this.type,
        icon: this.icon,
        showIcon: this.showIcon,
        closable: this.closable,
        onClose: this.handleClose,
        onMouseenter: this.keepAliveOnHover ? this.handleMouseenter : void 0,
        onMouseleave: this.keepAliveOnHover ? this.handleMouseleave : void 0
      }) : null]
    });
  }
});
const messageProviderProps = Object.assign(Object.assign({}, useTheme.props), {
  to: [String, Object],
  duration: {
    type: Number,
    default: 3e3
  },
  keepAliveOnHover: Boolean,
  max: Number,
  placement: {
    type: String,
    default: "top"
  },
  closable: Boolean,
  containerClass: String,
  containerStyle: [String, Object]
});
const NMessageProvider = defineComponent({
  name: "MessageProvider",
  props: messageProviderProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const messageListRef = ref([]);
    const messageRefs = ref({});
    const api = {
      create(content, options) {
        return create(content, Object.assign({
          type: "default"
        }, options));
      },
      info(content, options) {
        return create(content, Object.assign(Object.assign({}, options), {
          type: "info"
        }));
      },
      success(content, options) {
        return create(content, Object.assign(Object.assign({}, options), {
          type: "success"
        }));
      },
      warning(content, options) {
        return create(content, Object.assign(Object.assign({}, options), {
          type: "warning"
        }));
      },
      error(content, options) {
        return create(content, Object.assign(Object.assign({}, options), {
          type: "error"
        }));
      },
      loading(content, options) {
        return create(content, Object.assign(Object.assign({}, options), {
          type: "loading"
        }));
      },
      destroyAll
    };
    provide(messageProviderInjectionKey, {
      props,
      mergedClsPrefixRef
    });
    provide(messageApiInjectionKey, api);
    function create(content, options) {
      const key = createId();
      const messageReactive = reactive(Object.assign(Object.assign({}, options), {
        content,
        key,
        destroy: () => {
          var _a;
          (_a = messageRefs.value[key]) === null || _a === void 0 ? void 0 : _a.hide();
        }
      }));
      const {
        max
      } = props;
      if (max && messageListRef.value.length >= max) {
        messageListRef.value.shift();
      }
      messageListRef.value.push(messageReactive);
      return messageReactive;
    }
    function handleAfterLeave(key) {
      messageListRef.value.splice(messageListRef.value.findIndex((message) => message.key === key), 1);
      delete messageRefs.value[key];
    }
    function destroyAll() {
      Object.values(messageRefs.value).forEach((messageInstRef) => {
        messageInstRef.hide();
      });
    }
    return Object.assign({
      mergedClsPrefix: mergedClsPrefixRef,
      messageRefs,
      messageList: messageListRef,
      handleAfterLeave
    }, api);
  },
  render() {
    var _a, _b, _c;
    return h3(Fragment, null, (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a), this.messageList.length ? h3(Teleport, {
      to: (_c = this.to) !== null && _c !== void 0 ? _c : "body"
    }, h3("div", {
      class: [`${this.mergedClsPrefix}-message-container`, `${this.mergedClsPrefix}-message-container--${this.placement}`, this.containerClass],
      key: "message-container",
      style: this.containerStyle
    }, this.messageList.map((message) => {
      return h3(MessageEnvironment, Object.assign({
        ref: (inst) => {
          if (inst) {
            this.messageRefs[message.key] = inst;
          }
        },
        internalKey: message.key,
        onInternalAfterLeave: this.handleAfterLeave
      }, omit(message, ["destroy"], void 0), {
        duration: message.duration === void 0 ? this.duration : message.duration,
        keepAliveOnHover: message.keepAliveOnHover === void 0 ? this.keepAliveOnHover : message.keepAliveOnHover,
        closable: message.closable === void 0 ? this.closable : message.closable
      }));
    }))) : null);
  }
});
export {
  e2 as NAlert,
  B as NButton,
  h2 as NCard,
  j2 as NCheckbox,
  l3 as NCheckboxGroup,
  N as NConfigProvider,
  n3 as NDatePicker,
  q2 as NDialog,
  u2 as NDrawer,
  w2 as NDrawerContent,
  y2 as NEmpty,
  B3 as NForm,
  D2 as NFormItem,
  G2 as NIcon,
  J2 as NInput,
  L2 as NInputNumber,
  NMessageProvider,
  P2 as NModal,
  Q2 as NPopconfirm,
  T2 as NPopover,
  V2 as NRadio,
  Y2 as NRadioGroup,
  _2 as NSelect,
  N2 as NSpace,
  N3 as NSwitch,
  a02 as NTab,
  a22 as NTabPane,
  a42 as NTabs,
  a62 as NTag,
  a82 as NTimePicker,
  X as NxButton,
  e as alertDark,
  d2 as alertProps,
  f as anchorDark,
  g as autoCompleteDark,
  h as avatarDark,
  j as backTopDark,
  k as badgeDark,
  l2 as breadcrumbDark,
  o as buttonDark,
  n2 as buttonGroupDark,
  m as buttonProps,
  c,
  cB,
  cE,
  cM,
  l as cNotM,
  p as cardDark,
  g2 as cardProps,
  q as cascaderDark,
  r as checkboxDark,
  k2 as checkboxGroupProps,
  i2 as checkboxProps,
  t as codeDark,
  u as collapseDark,
  b as commonDark,
  n as commonLight,
  c2 as configProviderProps,
  d as darkTheme,
  v as dataTableDark,
  ab2 as dateEnUS,
  w as datePickerDark,
  p2 as datePickerProps,
  x as descriptionsDark,
  y as dialogDark,
  s2 as dialogProps,
  z as dividerDark,
  v2 as drawerContentProps,
  A as drawerDark,
  t2 as drawerProps,
  B2 as dropdownDark,
  C as dynamicInputDark,
  D as dynamicTagsDark,
  E as elementDark,
  F as emptyDark,
  x2 as emptyProps,
  aa2 as enUS,
  G as flexDark,
  I as formDark,
  C2 as formItemProps,
  A2 as formProps,
  J as gradientTextDark,
  H as heatmapDark,
  K as iconDark,
  F2 as iconProps,
  O as inputDark,
  L as inputNumberDark,
  K2 as inputNumberProps,
  M as inputOtpDark,
  H2 as inputProps,
  i as internalSelectMenuDark,
  a as internalSelectionDark,
  P as layoutDark,
  Q as listDark,
  R as loadingBarDark,
  S as logDark,
  T as mentionDark,
  U as menuDark,
  V as messageDark,
  messageProviderProps,
  W as modalDark,
  O2 as modalProps,
  X2 as notificationDark,
  Y as paginationDark,
  Z as popconfirmDark,
  R2 as popconfirmProps,
  _ as popoverDark,
  U2 as popoverProps,
  $ as popselectDark,
  a0 as progressDark,
  a1 as radioDark,
  Z2 as radioGroupProps,
  X3 as radioProps,
  a2 as rateDark,
  a3 as resultDark,
  s as scrollbarDark,
  a4 as selectDark,
  $2 as selectProps,
  a5 as sliderDark,
  a6 as spaceDark,
  s3 as spaceProps,
  a7 as spinDark,
  a8 as statisticDark,
  a9 as stepsDark,
  aa as switchDark,
  s4 as switchProps,
  a32 as tabPaneProps,
  a12 as tabProps,
  ab as tableDark,
  ac as tabsDark,
  a52 as tabsProps,
  ad as tagDark,
  a72 as tagProps,
  ae as thingDark,
  af as timePickerDark,
  a92 as timePickerProps,
  ag as timelineDark,
  ah as tooltipDark,
  ai as transferDark,
  ak as treeDark,
  aj as treeSelectDark,
  al as typographyDark,
  am as uploadDark,
  M2 as useMessage,
  an as watermarkDark,
  z2 as zindexable
};
