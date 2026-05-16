import { computed, ref, onMounted, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { useI18n } from "vue-i18n";
import { C as useCurrentLocale, V as LS_CONSENT_VERSION } from "../ssr.js";
import { N as NSpace } from "./Space-hqCJ-i3G.js";
import { N as NSwitch } from "./Switch-tnSHOxTf.js";
import { B as Button } from "./_common-Dc_o1R5u.js";
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
import "@emotion/hash";
import "lodash-es";
const _sfc_main = /* @__PURE__ */ Object.assign({ name: "ConsentOverlay" }, {
  __name: "ConsentOverlay",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const page = usePage();
    const appName = computed(() => {
      var _a;
      return ((_a = page.props.siteConfig) == null ? void 0 : _a.name) || "";
    });
    const visible = ref(false);
    const accepted = ref(false);
    const currentLocale = ref(useCurrentLocale());
    const currentPath = ref(typeof window !== "undefined" ? window.location.pathname : "");
    const privacyLink = computed(() => `/${currentLocale.value}/privacy-policy`);
    const isPrivacyRoute = computed(() => /\/privacy-policy\/?$/.test(currentPath.value));
    onMounted(() => {
      currentLocale.value = useCurrentLocale();
      currentPath.value = window.location.pathname;
      const consent = localStorage.getItem(LS_CONSENT_VERSION);
      if (!consent) {
        visible.value = true;
      }
    });
    function continueToApp() {
      localStorage.setItem(LS_CONSENT_VERSION, "true");
      visible.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (visible.value && !isPrivacyRoute.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "consent-overlay" }, _attrs))}><div class="consent-card"><h2>${ssrInterpolate(appName.value)}</h2><div class="title">${ssrInterpolate(unref(t)("consent.title"))}</div><p>${ssrInterpolate(unref(t)("consent.description_1"))}</p><p>${ssrInterpolate(unref(t)("consent.description_2", { name: appName.value }))}</p><div class="box-checkbox">`);
        _push(ssrRenderComponent(unref(Link), {
          href: privacyLink.value,
          rel: "nofollow"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("consent.privacy_link"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("consent.privacy_link")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(NSpace), {
          class: "checkbox",
          onClick: ($event) => accepted.value = !accepted.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(NSwitch), {
                value: accepted.value,
                "onUpdate:value": ($event) => accepted.value = $event,
                size: "medium"
              }, null, _parent2, _scopeId));
              _push2(`<span class="switch-label"${_scopeId}>${ssrInterpolate(unref(t)("consent.checkbox_label"))}</span>`);
            } else {
              return [
                createVNode(unref(NSwitch), {
                  value: accepted.value,
                  "onUpdate:value": ($event) => accepted.value = $event,
                  size: "medium"
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode("span", { class: "switch-label" }, toDisplayString(unref(t)("consent.checkbox_label")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(unref(Button), {
          type: "info",
          size: "large",
          disabled: !accepted.value,
          onClick: continueToApp
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("consent.continue"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("consent.continue")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/consent/ConsentOverlay.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
