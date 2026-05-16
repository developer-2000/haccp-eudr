import { unref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { t as task_grain_cooling, u as useGrainCoolingStore, j as i18n, _ as _export_sfc } from "../ssr.js";
import { router } from "@inertiajs/vue3";
import { N as NConfigProvider, d as darkTheme } from "./dark-IQH-hZ2R.js";
import { B as Button } from "./_common-Dc_o1R5u.js";
import "vue-i18n";
import "@vicons/antd";
import "@vicons/ionicons5";
import "@vicons/material";
import "@heroicons/vue/24/outline";
import "@tabler/icons-vue";
import "@vicons/ionicons4";
import "@vicons/carbon";
import "@vicons/fluent";
import "pinia";
import "uuid";
import "vue3-toastify";
import "axios";
import "i18n-iso-countries";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "lodash-es";
import "@emotion/hash";
function resolveLocale() {
  if (typeof window !== "undefined") {
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    if (typeof first === "string" && first.length) {
      return first;
    }
  }
  return i18n.global.locale.value || "en";
}
function navigateGrainCoolingToDemoChecklists(options = {}) {
  if (!task_grain_cooling.scenarioProcessAllowed) {
    return;
  }
  const grain = useGrainCoolingStore();
  if (!grain) {
    return;
  }
  grain.clearNotificationBanner();
  grain.requestOpenTaskOnChecklists(task_grain_cooling.id, task_grain_cooling.niche, {
    autoOpenPending: task_grain_cooling.deepLinkAutoOpenPending
  });
  if (typeof options.closeToast === "function") {
    options.closeToast();
  }
  const locale = resolveLocale();
  router.visit(`/${locale}/demo/${task_grain_cooling.demoRouteSection}`, {
    preserveState: true,
    preserveScroll: true
  });
}
const _sfc_main = /* @__PURE__ */ Object.assign({ name: "GlobalTaskReminderToast" }, {
  __name: "GlobalTaskReminderToast",
  __ssrInlineRender: true,
  props: {
    closeToast: {
      type: Function,
      required: true
    }
  },
  setup(__props) {
    const t = (...args) => i18n.global.t(...args);
    const naiveThemeOverrides = {
      common: {
        bodyColor: "#1a1f2e",
        cardColor: "#1a1f2e",
        textColorBase: "#e8eaef",
        textColor1: "#e8eaef",
        textColor2: "rgba(232, 234, 239, 0.82)",
        textColor3: "rgba(232, 234, 239, 0.55)",
        borderColor: "rgba(255, 255, 255, 0.12)"
      }
    };
    const props = __props;
    function goToDemoChecklists() {
      navigateGrainCoolingToDemoChecklists({ closeToast: props.closeToast });
    }
    function handleClose() {
      props.closeToast();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NConfigProvider), mergeProps({
        theme: unref(darkTheme),
        "theme-overrides": naiveThemeOverrides
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="global-task-reminder-toast" role="status" data-v-81e6de9f${_scopeId}><p class="global-task-reminder-toast__title" data-v-81e6de9f${_scopeId}>${ssrInterpolate(t(unref(task_grain_cooling).toastTitleKey))}</p><p class="global-task-reminder-toast__task-name" data-v-81e6de9f${_scopeId}>${ssrInterpolate(t(unref(task_grain_cooling).toastTaskNameKey))}</p><div class="global-task-reminder-toast__actions" data-v-81e6de9f${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              type: "warning",
              onClick: handleClose
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(t(unref(task_grain_cooling).toastButtonCloseLabelKey))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(t(unref(task_grain_cooling).toastButtonCloseLabelKey)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              type: "info",
              onClick: goToDemoChecklists
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(t(unref(task_grain_cooling).toastButtonNavigateLabelKey))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(t(unref(task_grain_cooling).toastButtonNavigateLabelKey)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", {
                class: "global-task-reminder-toast",
                role: "status"
              }, [
                createVNode("p", { class: "global-task-reminder-toast__title" }, toDisplayString(t(unref(task_grain_cooling).toastTitleKey)), 1),
                createVNode("p", { class: "global-task-reminder-toast__task-name" }, toDisplayString(t(unref(task_grain_cooling).toastTaskNameKey)), 1),
                createVNode("div", { class: "global-task-reminder-toast__actions" }, [
                  createVNode(unref(Button), {
                    type: "warning",
                    onClick: handleClose
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(t(unref(task_grain_cooling).toastButtonCloseLabelKey)), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "info",
                    onClick: goToDemoChecklists
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(t(unref(task_grain_cooling).toastButtonNavigateLabelKey)), 1)
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/task_grain_cooling/GlobalTaskReminderToast.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const GlobalTaskReminderToast = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-81e6de9f"]]);
export {
  GlobalTaskReminderToast as default
};
