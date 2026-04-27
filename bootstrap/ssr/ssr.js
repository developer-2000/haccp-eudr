var _a, _b;
import { useSSRContext, computed, mergeProps, createVNode, resolveDynamicComponent, h, unref, withCtx, createBlock, toDisplayString, openBlock, Fragment, renderList, ref, onMounted, onUnmounted, createCommentVNode, createTextVNode, shallowRef, watch, onBeforeUnmount, reactive, defineAsyncComponent, nextTick, withDirectives, vModelText, withModifiers, renderSlot, createSSRApp } from "vue";
import { ssrRenderAttrs, ssrRenderVNode, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderSlot, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { useI18n, createI18n } from "vue-i18n";
import { LeftOutlined, RightOutlined, LogoutOutlined, SettingOutlined, DatabaseOutlined, FileTextOutlined, DashboardOutlined, UserOutlined, ControlTwotone, ScheduleTwotone, InfoCircleTwotone, ExclamationCircleTwotone } from "@vicons/antd";
import { ExitOutline, Bulb } from "@vicons/ionicons5";
import { MarkEmailReadTwotone, DeleteForeverTwotone, EventRepeatTwotone, QrCodeTwotone, WatchLaterTwotone, SmartphoneTwotone, LaptopMacTwotone, DashboardTwotone, CoffeeMakerTwotone, AccountBalanceWalletTwotone, AccountBalanceTwotone, BatteryCharging90Round, BusinessCenterRound, ManageAccountsTwotone } from "@vicons/material";
import { EyeSlashIcon, EyeIcon, InformationCircleIcon, CheckCircleIcon, XCircleIcon, CheckIcon, XMarkIcon, Bars3Icon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { IconArrowBigDownLines, IconReportSearch } from "@tabler/icons-vue";
import { IosMailUnread } from "@vicons/ionicons4";
import { TaskComplete, TagExport } from "@vicons/carbon";
import { TargetArrow24Regular, PeopleCommunity24Filled } from "@vicons/fluent";
import { Head, Link, usePage, createInertiaApp } from "@inertiajs/vue3";
import { defineStore, storeToRefs, createPinia } from "pinia";
import { v4 } from "uuid";
import { toast } from "vue3-toastify";
import axios from "axios";
import countries$1 from "i18n-iso-countries";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
const HAND_POINT_RIGHT_PATH_D = "M512 199.652c0 23.625-20.65 43.826-44.8 43.826h-99.851c16.34 17.048 18.346 49.766-6.299 70.944c14.288 22.829 2.147 53.017-16.45 62.315C353.574 425.878 322.654 448 272 448c-2.746 0-13.276-.203-16-.195c-61.971.168-76.894-31.065-123.731-38.315C120.596 407.683 112 397.599 112 385.786V214.261l.002-.001c.011-18.366 10.607-35.889 28.464-43.845c28.886-12.994 95.413-49.038 107.534-77.323c7.797-18.194 21.384-29.084 40-29.092c34.222-.014 57.752 35.098 44.119 66.908c-3.583 8.359-8.312 16.67-14.153 24.918H467.2c23.45 0 44.8 20.543 44.8 43.826zM96 200v192c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V200c0-13.255 10.745-24 24-24h48c13.255 0 24 10.745 24 24zM68 368c0-11.046-8.954-20-20-20s-20 8.954-20 20s8.954 20 20 20s20-8.954 20-20z";
const _sfc_main$C = /* @__PURE__ */ Object.assign({
  name: "Icon"
}, {
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    /**
     * name - имя иконки для отображения
     * Должно соответствовать одному из ключей в объекте icons
     */
    name: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const HandPointRightIcon = {
      name: "HandPointRightIcon",
      inheritAttrs: false,
      setup(_, { attrs }) {
        return () => h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 512 512",
            fill: "currentColor",
            ...attrs
          },
          [
            h("path", {
              d: HAND_POINT_RIGHT_PATH_D
            })
          ]
        );
      }
    };
    const icons = Object.freeze({
      // Иконки из @heroicons/vue (рендерятся напрямую)
      "chevron-down": ChevronDownIcon,
      search: MagnifyingGlassIcon,
      bars: Bars3Icon,
      close: XMarkIcon,
      check: CheckIcon,
      "x-circle": XCircleIcon,
      "check-circle": CheckCircleIcon,
      info: InformationCircleIcon,
      eye: EyeIcon,
      "eye-slash": EyeSlashIcon,
      // Tabler (@tabler/icons-vue), рендер напрямую
      "report-search": IconReportSearch,
      "arrow-big-down-lines": IconArrowBigDownLines,
      // Встроенный SVG (классический hand-point-right)
      "hand-point-right": HandPointRightIcon,
      // Иконки из @vicons (требуют обертки ViconsIcon)
      "info-circle-twotone": InfoCircleTwotone,
      "schedule-twotone": ScheduleTwotone,
      "control-twotone": ControlTwotone,
      "ios-mail-unread": IosMailUnread,
      "user-outlined": UserOutlined,
      "dashboard-outlined": DashboardOutlined,
      "file-text-outlined": FileTextOutlined,
      "database-outlined": DatabaseOutlined,
      "setting-outlined": SettingOutlined,
      "logout-outlined": LogoutOutlined,
      "right-outlined": RightOutlined,
      "left-outlined": LeftOutlined,
      "exit-outline": ExitOutline,
      "tag-export": TagExport,
      "task-complete": TaskComplete,
      "business-center-round": BusinessCenterRound,
      "battery-charging-90-round": BatteryCharging90Round,
      "account-balance-twotone": AccountBalanceTwotone,
      "account-balance-wallet-twotone": AccountBalanceWalletTwotone,
      "coffee-maker-twotone": CoffeeMakerTwotone,
      "dashboard-twotone": DashboardTwotone,
      "laptop-mac-twotone": LaptopMacTwotone,
      "smartphone-twotone": SmartphoneTwotone,
      "watch-later-twotone": WatchLaterTwotone,
      "qr-code-twotone": QrCodeTwotone,
      "event-repeat-twotone": EventRepeatTwotone,
      "delete-forever-twotone": DeleteForeverTwotone,
      "mark-email-read-twotone": MarkEmailReadTwotone,
      "people-community-24-filled": PeopleCommunity24Filled,
      "target-arrow-24-regular": TargetArrow24Regular
    });
    const props = __props;
    const iconComponent = computed(() => icons[props.name] || null);
    const viconsIcons = [
      "info-circle-twotone",
      // @vicons/antd
      "ios-mail-unread",
      // @vicons/ionicons4
      "control-twotone",
      // @vicons/antd
      "user-outlined",
      // @vicons/antd
      "dashboard-outlined",
      // @vicons/antd
      "file-text-outlined",
      // @vicons/antd
      "database-outlined",
      // @vicons/antd
      "setting-outlined",
      // @vicons/antd
      "logout-outlined",
      // @vicons/antd
      "right-outlined",
      // @vicons/antd
      "left-outlined",
      // @vicons/antd
      "exit-outline",
      // @vicons/ionicons5
      "tag-export",
      // @vicons/carbon
      "task-complete",
      // @vicons/carbon
      "business-center-round",
      // @vicons/material
      "battery-charging-90-round",
      // @vicons/material
      "account-balance-twotone",
      // @vicons/material
      "account-balance-wallet-twotone",
      // @vicons/material
      "coffee-maker-twotone",
      // @vicons/material
      "dashboard-twotone",
      // @vicons/material
      "laptop-mac-twotone",
      // @vicons/material
      "smartphone-twotone",
      // @vicons/material
      "watch-later-twotone",
      // @vicons/material
      "event-repeat-twotone",
      // @vicons/material
      "delete-forever-twotone",
      // @vicons/material
      "mark-email-read-twotone",
      // @vicons/material
      "people-community-24-filled",
      // @vicons/fluent
      "target-arrow-24-regular"
      // @vicons/fluent
    ];
    const isViconsIcon = computed(() => viconsIcons.includes(props.name));
    return (_ctx, _push, _parent, _attrs) => {
      if (isViconsIcon.value) {
        _push(`<span${ssrRenderAttrs(mergeProps({ class: "xicon" }, _ctx.$attrs, _attrs))}>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), null, null), _parent);
        _push(`</span>`);
      } else {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps(_ctx.$attrs, _attrs), null), _parent);
      }
    };
  }
});
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Icon.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
function useCurrentLocale() {
  if (typeof window === "undefined") {
    return "en";
  }
  const segments = window.location.pathname.split("/").filter(Boolean);
  const available = window.availableLocales || [];
  if (available.length > 0 && available.includes(segments[0])) {
    return segments[0];
  }
  if (segments[0] && /^[a-z]{2}$/.test(segments[0])) {
    return segments[0];
  }
  return "en";
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$B = /* @__PURE__ */ Object.assign({
  name: "SurveyCtaSection"
}, {
  __name: "SurveyCtaSection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "survey-cta",
        "aria-label": "Survey CTA"
      }, _attrs))} data-v-3b9f780b><div class="survey-cta__content" data-v-3b9f780b><h2 class="survey-cta__title" data-v-3b9f780b>${ssrInterpolate(_ctx.$t("home.survey_cta.title"))} <span class="survey-cta__title-secondary" data-v-3b9f780b>${ssrInterpolate(_ctx.$t("home.survey_cta.title_secondary"))}</span></h2><button type="button" class="btn-client btn-success survey-cta__button"${ssrRenderAttr("aria-label", _ctx.$t("home.survey_cta.button_aria_label"))} data-v-3b9f780b>${ssrInterpolate(_ctx.$t("home.survey_cta.button_text"))}</button></div></section>`);
    };
  }
});
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/home/SurveyCtaSection.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const SurveyCtaSection = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["__scopeId", "data-v-3b9f780b"]]);
const _sfc_main$A = /* @__PURE__ */ Object.assign({ name: "SeoHead" }, {
  __name: "SeoHead",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Head), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(__props.seo.title)}</title><meta name="description"${ssrRenderAttr("content", __props.seo.description)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", __props.seo.canonical)}${_scopeId}><!--[-->`);
            ssrRenderList(__props.seo.hreflang, (alt) => {
              _push2(`<link rel="alternate"${ssrRenderAttr("hreflang", alt.lang)}${ssrRenderAttr("href", alt.href)}${_scopeId}>`);
            });
            _push2(`<!--]--><meta property="og:title"${ssrRenderAttr("content", __props.seo.og.title)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.seo.og.description)}${_scopeId}><meta property="og:image"${ssrRenderAttr("content", __props.seo.og.image)}${_scopeId}><meta property="og:url"${ssrRenderAttr("content", __props.seo.canonical)}${_scopeId}><meta property="og:type"${ssrRenderAttr("content", __props.seo.og.type)}${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", __props.seo.twitter.title)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", __props.seo.twitter.description)}${_scopeId}><meta name="twitter:image"${ssrRenderAttr("content", __props.seo.twitter.image)}${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(__props.seo.title), 1),
              createVNode("meta", {
                name: "description",
                content: __props.seo.description
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: __props.seo.canonical
              }, null, 8, ["href"]),
              (openBlock(true), createBlock(Fragment, null, renderList(__props.seo.hreflang, (alt) => {
                return openBlock(), createBlock("link", {
                  key: alt.lang,
                  rel: "alternate",
                  hreflang: alt.lang,
                  href: alt.href
                }, null, 8, ["hreflang", "href"]);
              }), 128)),
              createVNode("meta", {
                property: "og:title",
                content: __props.seo.og.title
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.seo.og.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:image",
                content: __props.seo.og.image
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:url",
                content: __props.seo.canonical
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: __props.seo.og.type
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: __props.seo.twitter.title
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: __props.seo.twitter.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:image",
                content: __props.seo.twitter.image
              }, null, 8, ["content"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/SeoHead.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const navConfig = {
  logo: {
    link: "/"
  },
  menu: [
    {
      label: "header.menu.how_it_works",
      link: "/how-it-works",
      hasDropdown: false
    },
    {
      label: "header.menu.demo",
      link: "/demo/dashboard",
      activePathPrefix: "/demo",
      hasDropdown: false
    },
    {
      label: "header.menu.about",
      link: "/about",
      hasDropdown: false
    },
    {
      label: "header.menu.survey",
      link: "/survey",
      hasDropdown: false
    }
  ]
};
function useMobileMenu() {
  const isOpen = ref(false);
  const openedDropdownsSet = ref(/* @__PURE__ */ new Set());
  const openedDropdowns = computed(
    () => Array.from(openedDropdownsSet.value)
  );
  const hasDropdown = (identifier) => {
    return openedDropdownsSet.value.has(identifier);
  };
  const toggle = () => {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) {
      openedDropdownsSet.value.clear();
    }
  };
  const close = () => {
    isOpen.value = false;
    openedDropdownsSet.value.clear();
  };
  const toggleDropdown = (identifier) => {
    if (openedDropdownsSet.value.has(identifier)) {
      openedDropdownsSet.value.delete(identifier);
    } else {
      openedDropdownsSet.value.clear();
      openedDropdownsSet.value.add(identifier);
    }
  };
  return {
    isOpen,
    openedDropdowns,
    toggle,
    close,
    toggleDropdown,
    hasDropdown
  };
}
function useBreakpoint(breakpoint = 1024) {
  const isMobile = ref(false);
  const checkBreakpoint = () => {
    isMobile.value = window.innerWidth < breakpoint;
  };
  onMounted(() => {
    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", checkBreakpoint);
  });
  return { isMobile };
}
const hasDropdownColumns = (item) => {
  var _a2;
  return (_a2 = item == null ? void 0 : item.dropdown) == null ? void 0 : _a2.columns;
};
const isSimpleDropdown = (item) => {
  return Array.isArray(item == null ? void 0 : item.dropdown) && item.dropdown.length > 0;
};
const isDropdownLink = (dropdownItem) => {
  return (dropdownItem == null ? void 0 : dropdownItem.isLink) === true;
};
const hasValidLink = (dropdownItem) => {
  return (dropdownItem == null ? void 0 : dropdownItem.link) && dropdownItem.link !== "#";
};
const _sfc_main$z = /* @__PURE__ */ Object.assign({
  name: "DropdownMenu"
}, {
  __name: "DropdownMenu",
  __ssrInlineRender: true,
  props: {
    item: {
      type: Object,
      required: true
    },
    variant: {
      type: String,
      default: "desktop",
      validator: (value) => ["desktop", "mobile"].includes(value)
    },
    onItemClick: {
      type: Function,
      default: null
    }
  },
  setup(__props) {
    const props = __props;
    const hasColumns = computed(() => {
      if (!props.item) {
        return false;
      }
      return hasDropdownColumns(props.item);
    });
    const isSimple = computed(() => {
      if (!props.item) {
        return false;
      }
      return isSimpleDropdown(props.item);
    });
    const firstColumnItems = computed(() => {
      var _a2;
      if (!isSimple.value || !Array.isArray((_a2 = props.item) == null ? void 0 : _a2.dropdown)) {
        return [];
      }
      return props.item.dropdown.slice(0, 4);
    });
    const secondColumnItems = computed(() => {
      var _a2;
      if (!isSimple.value || !Array.isArray((_a2 = props.item) == null ? void 0 : _a2.dropdown)) {
        return [];
      }
      return props.item.dropdown.slice(4);
    });
    const hasSecondColumn = computed(() => {
      var _a2;
      return Array.isArray((_a2 = props.item) == null ? void 0 : _a2.dropdown) && props.item.dropdown.length > 4;
    });
    const handleClick = () => {
      var _a2;
      (_a2 = props.onItemClick) == null ? void 0 : _a2.call(props);
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (hasColumns.value) {
        _push(`<!--[-->`);
        if (__props.variant === "desktop") {
          _push(`<div class="dropdown-menu dropdown-menu-with-headers" data-v-06f250b6><!--[-->`);
          ssrRenderList(__props.item.dropdown.columns, (column) => {
            _push(`<div class="dropdown-column" data-v-06f250b6><div class="dropdown-column-title" data-v-06f250b6>${ssrInterpolate(column.title)}</div><!--[-->`);
            ssrRenderList(column.items, (dropdownItem) => {
              _push(`<!--[-->`);
              if (unref(hasValidLink)(dropdownItem) && !unref(isDropdownLink)(dropdownItem)) {
                _push(ssrRenderComponent(unref(Link), {
                  href: dropdownItem.link,
                  class: "dropdown-item"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`<div class="dropdown-title" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.title)}</div>`);
                      if (dropdownItem.description) {
                        _push2(`<div class="dropdown-desc" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.description)}</div>`);
                      } else {
                        _push2(`<!---->`);
                      }
                    } else {
                      return [
                        createVNode("div", { class: "dropdown-title" }, toDisplayString(dropdownItem.title), 1),
                        dropdownItem.description ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "dropdown-desc"
                        }, toDisplayString(dropdownItem.description), 1)) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else if (unref(isDropdownLink)(dropdownItem)) {
                _push(ssrRenderComponent(unref(Link), {
                  href: dropdownItem.link,
                  class: "dropdown-link"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(dropdownItem.title)} → `);
                    } else {
                      return [
                        createTextVNode(toDisplayString(dropdownItem.title) + " → ", 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<div class="dropdown-item" data-v-06f250b6><div class="dropdown-title" data-v-06f250b6>${ssrInterpolate(dropdownItem.title)}</div>`);
                if (dropdownItem.description) {
                  _push(`<div class="dropdown-desc" data-v-06f250b6>${ssrInterpolate(dropdownItem.description)}</div>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
              }
              _push(`<!--]-->`);
            });
            _push(`<!--]--></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(__props.item.dropdown.columns, (column) => {
            _push(`<div class="mobile-menu-column" data-v-06f250b6><div class="mobile-menu-column-title" data-v-06f250b6>${ssrInterpolate(column.title)}</div><!--[-->`);
            ssrRenderList(column.items, (dropdownItem) => {
              _push(`<!--[-->`);
              if (unref(hasValidLink)(dropdownItem) && !unref(isDropdownLink)(dropdownItem)) {
                _push(ssrRenderComponent(unref(Link), {
                  href: dropdownItem.link,
                  class: "mobile-menu-subitem",
                  onClick: handleClick
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`<div class="mobile-menu-subitem-title" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.title)}</div>`);
                      if (dropdownItem.description) {
                        _push2(`<div class="mobile-menu-subitem-desc" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.description)}</div>`);
                      } else {
                        _push2(`<!---->`);
                      }
                    } else {
                      return [
                        createVNode("div", { class: "mobile-menu-subitem-title" }, toDisplayString(dropdownItem.title), 1),
                        dropdownItem.description ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mobile-menu-subitem-desc"
                        }, toDisplayString(dropdownItem.description), 1)) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else if (unref(isDropdownLink)(dropdownItem)) {
                _push(ssrRenderComponent(unref(Link), {
                  href: dropdownItem.link,
                  class: "mobile-menu-subitem-link",
                  onClick: handleClick
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(dropdownItem.title)} → `);
                    } else {
                      return [
                        createTextVNode(toDisplayString(dropdownItem.title) + " → ", 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<div class="mobile-menu-subitem" data-v-06f250b6><div class="mobile-menu-subitem-title" data-v-06f250b6>${ssrInterpolate(dropdownItem.title)}</div>`);
                if (dropdownItem.description) {
                  _push(`<div class="mobile-menu-subitem-desc" data-v-06f250b6>${ssrInterpolate(dropdownItem.description)}</div>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
              }
              _push(`<!--]-->`);
            });
            _push(`<!--]--></div>`);
          });
          _push(`<!--]-->`);
        }
        _push(`<!--]-->`);
      } else if (isSimple.value) {
        _push(`<!--[-->`);
        if (__props.variant === "desktop") {
          _push(`<div class="${ssrRenderClass([{ "dropdown-menu-columns": hasSecondColumn.value }, "dropdown-menu"])}" data-v-06f250b6><div class="dropdown-column" data-v-06f250b6><!--[-->`);
          ssrRenderList(firstColumnItems.value, (dropdownItem) => {
            _push(`<!--[-->`);
            if (unref(hasValidLink)(dropdownItem)) {
              _push(ssrRenderComponent(unref(Link), {
                href: dropdownItem.link,
                class: "dropdown-item"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="dropdown-title" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.title)}</div><div class="dropdown-desc" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.description)}</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "dropdown-title" }, toDisplayString(dropdownItem.title), 1),
                      createVNode("div", { class: "dropdown-desc" }, toDisplayString(dropdownItem.description), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<div class="dropdown-item" data-v-06f250b6><div class="dropdown-title" data-v-06f250b6>${ssrInterpolate(dropdownItem.title)}</div><div class="dropdown-desc" data-v-06f250b6>${ssrInterpolate(dropdownItem.description)}</div></div>`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></div>`);
          if (hasSecondColumn.value) {
            _push(`<div class="dropdown-column" data-v-06f250b6><!--[-->`);
            ssrRenderList(secondColumnItems.value, (dropdownItem) => {
              _push(`<!--[-->`);
              if (unref(hasValidLink)(dropdownItem)) {
                _push(ssrRenderComponent(unref(Link), {
                  href: dropdownItem.link,
                  class: "dropdown-item"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`<div class="dropdown-title" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.title)}</div><div class="dropdown-desc" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.description)}</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "dropdown-title" }, toDisplayString(dropdownItem.title), 1),
                        createVNode("div", { class: "dropdown-desc" }, toDisplayString(dropdownItem.description), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<div class="dropdown-item" data-v-06f250b6><div class="dropdown-title" data-v-06f250b6>${ssrInterpolate(dropdownItem.title)}</div><div class="dropdown-desc" data-v-06f250b6>${ssrInterpolate(dropdownItem.description)}</div></div>`);
              }
              _push(`<!--]-->`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(__props.item.dropdown, (dropdownItem) => {
            _push(`<!--[-->`);
            if (unref(hasValidLink)(dropdownItem)) {
              _push(ssrRenderComponent(unref(Link), {
                href: dropdownItem.link,
                class: "mobile-menu-subitem",
                onClick: handleClick
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="mobile-menu-subitem-title" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.title)}</div>`);
                    if (dropdownItem.description) {
                      _push2(`<div class="mobile-menu-subitem-desc" data-v-06f250b6${_scopeId}>${ssrInterpolate(dropdownItem.description)}</div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode("div", { class: "mobile-menu-subitem-title" }, toDisplayString(dropdownItem.title), 1),
                      dropdownItem.description ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mobile-menu-subitem-desc"
                      }, toDisplayString(dropdownItem.description), 1)) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<div class="mobile-menu-subitem" data-v-06f250b6><div class="mobile-menu-subitem-title" data-v-06f250b6>${ssrInterpolate(dropdownItem.title)}</div>`);
              if (dropdownItem.description) {
                _push(`<div class="mobile-menu-subitem-desc" data-v-06f250b6>${ssrInterpolate(dropdownItem.description)}</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]-->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/header/DropdownMenu.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const DropdownMenu = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["__scopeId", "data-v-06f250b6"]]);
const _sfc_main$y = /* @__PURE__ */ Object.assign({
  name: "NavMenuItem"
}, {
  __name: "NavMenuItem",
  __ssrInlineRender: true,
  props: {
    /** @type {import('vue').PropType<NavMenuItem>} */
    item: {
      type: Object,
      required: true,
      validator: (value) => {
        return value && typeof value === "object" && typeof value.label === "string" && typeof value.link === "string";
      }
    },
    variant: {
      type: String,
      default: "desktop",
      validator: (value) => ["desktop", "mobile"].includes(value)
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    onToggle: {
      type: Function,
      default: null
    },
    onItemClick: {
      type: Function,
      default: null
    }
  },
  setup(__props) {
    const page = usePage();
    const currentPath = computed(() => {
      const url = page.url || "/";
      const qIdx = url.search(/[?#]/);
      return qIdx === -1 ? url : url.slice(0, qIdx);
    });
    const props = __props;
    const hasDropdown = computed(() => {
      var _a2;
      return Boolean((_a2 = props.item) == null ? void 0 : _a2.hasDropdown);
    });
    const itemLink = computed(() => {
      var _a2;
      return ((_a2 = props.item) == null ? void 0 : _a2.link) || "#";
    });
    const itemDropdown = computed(() => {
      var _a2;
      return ((_a2 = props.item) == null ? void 0 : _a2.dropdown) || null;
    });
    const isExactPageLink = computed(() => {
      var _a2;
      const path = currentPath.value;
      const prefix = (_a2 = props.item) == null ? void 0 : _a2.activePathPrefix;
      if (prefix) {
        return path === prefix || path.startsWith(`${prefix}/`);
      }
      const link = itemLink.value;
      const pathname = link.includes("#") ? link.slice(0, link.indexOf("#")) : link;
      return path === pathname && !link.includes("#");
    });
    const handleItemClick = () => {
      var _a2;
      (_a2 = props.onItemClick) == null ? void 0 : _a2.call(props);
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.variant === "desktop") {
        _push(`<!--[-->`);
        if (hasDropdown.value) {
          _push(`<div class="nav-dropdown" role="button" aria-haspopup="true" data-v-f4d0ee2a>`);
          _push(ssrRenderComponent(unref(Link), {
            href: itemLink.value,
            class: ["nav-link", { "nav-link--exact-page": isExactPageLink.value }],
            "aria-label": _ctx.$t("header.nav.item_menu_aria", {
              item: _ctx.$t(__props.item.label)
            })
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(_ctx.$t(__props.item.label))} `);
                _push2(ssrRenderComponent(_sfc_main$C, {
                  name: "chevron-down",
                  class: "nav-arrow",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.$t(__props.item.label)) + " ", 1),
                  createVNode(_sfc_main$C, {
                    name: "chevron-down",
                    class: "nav-arrow",
                    "aria-hidden": "true"
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
          if (itemDropdown.value) {
            _push(ssrRenderComponent(DropdownMenu, {
              item: props.item,
              variant: "desktop"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(ssrRenderComponent(unref(Link), {
            href: itemLink.value,
            class: ["nav-link", { "nav-link--exact-page": isExactPageLink.value }]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(_ctx.$t(__props.item.label))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.$t(__props.item.label)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        if (hasDropdown.value) {
          _push(`<div class="${ssrRenderClass([{ "mobile-menu-item-open": __props.isOpen }, "mobile-menu-item"])}" data-v-f4d0ee2a><button class="mobile-menu-item-header"${ssrRenderAttr("aria-expanded", __props.isOpen)}${ssrRenderAttr(
            "aria-label",
            _ctx.$t("header.nav.toggle_submenu_aria", {
              item: _ctx.$t(__props.item.label)
            })
          )} role="menuitem" data-v-f4d0ee2a><span data-v-f4d0ee2a>${ssrInterpolate(_ctx.$t(__props.item.label))}</span>`);
          _push(ssrRenderComponent(_sfc_main$C, {
            name: "chevron-down",
            class: "mobile-menu-item-arrow",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`</button><div class="mobile-menu-item-content" data-v-f4d0ee2a>`);
          if (itemDropdown.value) {
            _push(ssrRenderComponent(DropdownMenu, {
              item: props.item,
              variant: "mobile",
              "on-item-click": __props.onItemClick
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(ssrRenderComponent(unref(Link), {
            href: itemLink.value,
            class: ["mobile-menu-item-simple", { "mobile-menu-item-simple--exact-page": isExactPageLink.value }],
            onClick: handleItemClick
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(_ctx.$t(__props.item.label))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.$t(__props.item.label)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`<!--]-->`);
      }
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/header/NavMenuItem.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const NavMenuItem = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["__scopeId", "data-v-f4d0ee2a"]]);
const _sfc_main$x = /* @__PURE__ */ Object.assign({
  name: "Header"
}, {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const siteConfig = computed(() => page.props.siteConfig || { name: "", adminEmail: "" });
    const languagesList = computed(() => page.props.switcherLocales || []);
    const {
      /** @type {import('vue').Ref<boolean>} */
      isOpen: isMobileMenuOpen,
      /** @type {Function} */
      close: closeMobileMenu,
      /** @type {Function} */
      toggleDropdown: toggleMobileDropdown,
      /** @type {Function} */
      hasDropdown: hasMobileDropdown
    } = useMobileMenu();
    const { isMobile } = useBreakpoint(1101);
    const { isMobile: isCtaIconOnly } = useBreakpoint(1350);
    const { isMobile: isLangSwitcherHidden } = useBreakpoint(581);
    const initialLocale = ref(useCurrentLocale());
    const currentLocale = computed(() => initialLocale.value);
    const defaultConfig = {
      logo: { text: "", link: "/" },
      menu: [],
      actions: { buttons: [] }
    };
    const validatedNavConfig = navConfig || /* @__PURE__ */ (() => {
      return defaultConfig;
    })();
    const navConfigRef = shallowRef(validatedNavConfig);
    const safeLogo = computed(() => {
      var _a2;
      const logo = ((_a2 = navConfigRef.value) == null ? void 0 : _a2.logo) || defaultConfig.logo;
      const locale2 = currentLocale.value;
      const link = logo.link === "/" ? "/" + locale2 : "/" + locale2 + (logo.link.startsWith("/") ? logo.link : "/" + logo.link);
      return { ...logo, link };
    });
    const safeMenu = computed(() => {
      var _a2;
      const menu = ((_a2 = navConfigRef.value) == null ? void 0 : _a2.menu) ?? defaultConfig.menu;
      const locale2 = currentLocale.value;
      return (Array.isArray(menu) ? menu : []).map((item) => ({
        ...item,
        link: "/" + locale2 + (item.link.startsWith("/") ? item.link : "/" + item.link),
        activePathPrefix: item.activePathPrefix != null && item.activePathPrefix !== "" ? "/" + locale2 + (String(item.activePathPrefix).startsWith("/") ? item.activePathPrefix : "/" + item.activePathPrefix) : null
      }));
    });
    onMounted(() => {
      initialLocale.value = useCurrentLocale();
    });
    watch(isMobileMenuOpen, (open) => {
      if (open) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    });
    onBeforeUnmount(() => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-7318535f><nav class="nav" role="navigation"${ssrRenderAttr("aria-label", _ctx.$t("header.nav.aria_label"))} data-v-7318535f><div class="container nav-container" data-v-7318535f><div class="nav-logo" data-v-7318535f>`);
      _push(ssrRenderComponent(unref(Link), {
        href: safeLogo.value.link,
        class: "logo-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="logo-site" data-v-7318535f${_scopeId}>${ssrInterpolate(siteConfig.value.name)}</span><span class="logo-app" data-v-7318535f${_scopeId}>demo</span>`);
          } else {
            return [
              createVNode("span", { class: "logo-site" }, toDisplayString(siteConfig.value.name), 1),
              createVNode("span", { class: "logo-app" }, "demo")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (!unref(isMobile)) {
        _push(`<div class="nav-menu" data-v-7318535f><!--[-->`);
        ssrRenderList(safeMenu.value, (item) => {
          _push(ssrRenderComponent(NavMenuItem, {
            key: `${item.label}-${item.link}`,
            item,
            variant: "desktop"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isMobile)) {
        _push(`<button class="mobile-menu-toggle"${ssrRenderAttr("aria-expanded", unref(isMobileMenuOpen))}${ssrRenderAttr("aria-label", _ctx.$t("header.nav.toggle_mobile_menu"))} data-v-7318535f>`);
        _push(ssrRenderComponent(_sfc_main$C, {
          name: unref(isMobileMenuOpen) ? "close" : "bars",
          class: "mobile-menu-icon"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isMobile)) {
        _push(`<div class="${ssrRenderClass([{ "mobile-menu-open": unref(isMobileMenuOpen) }, "mobile-menu"])}" role="menu"${ssrRenderAttr("aria-hidden", !unref(isMobileMenuOpen))} data-v-7318535f><div class="box-switch-lang-mobile-menu" data-v-7318535f>`);
        if (unref(isLangSwitcherHidden) && languagesList.value.length > 1) {
          _push(`<div class="mobile-menu__lang" role="group"${ssrRenderAttr("aria-label", _ctx.$t("header.nav.language_group_aria"))} data-v-7318535f><!--[-->`);
          ssrRenderList(languagesList.value, (lang) => {
            _push(`<button type="button" class="${ssrRenderClass([
              "lang-switcher__btn",
              {
                "lang-switcher__btn--active": currentLocale.value === lang.code
              }
            ])}"${ssrRenderAttr("aria-pressed", currentLocale.value === lang.code)}${ssrRenderAttr("title", lang.name)} data-v-7318535f>${ssrInterpolate(lang.prefix)}</button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--[-->`);
        ssrRenderList(safeMenu.value, (item) => {
          _push(ssrRenderComponent(NavMenuItem, {
            key: `mobile-${item.label}-${item.link}`,
            item,
            variant: "mobile",
            "is-open": unref(hasMobileDropdown)(`${item.label}-${item.link}`),
            "on-toggle": () => unref(toggleMobileDropdown)(
              `${item.label}-${item.link}`
            ),
            "on-item-click": unref(closeMobileMenu)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="nav-actions" data-v-7318535f>`);
      if (languagesList.value.length > 1) {
        _push(`<div class="lang-switcher" role="group"${ssrRenderAttr("aria-label", _ctx.$t("header.nav.language_group_aria"))} data-v-7318535f><!--[-->`);
        ssrRenderList(languagesList.value, (lang) => {
          _push(`<button type="button" class="${ssrRenderClass([
            "lang-switcher__btn",
            {
              "lang-switcher__btn--active": currentLocale.value === lang.code
            }
          ])}"${ssrRenderAttr("aria-pressed", currentLocale.value === lang.code)}${ssrRenderAttr("title", lang.name)} data-v-7318535f>${ssrInterpolate(lang.prefix)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="${ssrRenderClass([{ "nav-cta--icon-only": unref(isCtaIconOnly) }, "btn-client btn-primary nav-cta"])}"${ssrRenderAttr(
        "aria-label",
        unref(isCtaIconOnly) ? _ctx.$t("header.cta.aria_icon_only") : void 0
      )} data-v-7318535f>`);
      if (unref(isCtaIconOnly)) {
        _push(ssrRenderComponent(_sfc_main$C, {
          name: "business-center-round",
          class: "nav-cta-icon"
        }, null, _parent));
      } else {
        _push(`<!--[--><span class="nav-cta-line" data-v-7318535f>${ssrInterpolate(_ctx.$t("header.cta.leave_request"))}</span><span class="nav-cta-line nav-cta-line--accent" data-v-7318535f>${ssrInterpolate(_ctx.$t("header.cta.tell_about_business"))}</span><!--]-->`);
      }
      _push(`</button></div></div></nav></header>`);
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/header/Header.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["__scopeId", "data-v-7318535f"]]);
const START_YEAR = 2026;
const _sfc_main$w = /* @__PURE__ */ Object.assign({ name: "Footer" }, {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const page = usePage();
    const siteConfig = computed(() => page.props.siteConfig || { name: "", adminEmail: "" });
    const yearLabel = computed(() => {
      const current = (/* @__PURE__ */ new Date()).getFullYear();
      return current > START_YEAR ? `${START_YEAR}—${current}` : `${START_YEAR}`;
    });
    const currentLocale = ref(useCurrentLocale());
    const currentPath = computed(() => {
      const url = page.url || "/";
      const qIdx = url.search(/[?#]/);
      return qIdx === -1 ? url : url.slice(0, qIdx);
    });
    onMounted(() => {
      currentLocale.value = useCurrentLocale();
    });
    const privacyLink = computed(() => `/${currentLocale.value}/privacy-policy`);
    const contactLink = computed(() => `/${currentLocale.value}/contact`);
    const seoLocaleLinks = computed(() => {
      const allLocales = page.props.availableLocales || [];
      const countries2 = page.props.localeCountries || {};
      const switcherCodes = new Set(
        (page.props.switcherLocales || []).map((l) => l.code)
      );
      const locale2 = currentLocale.value;
      const pathWithoutLocale = currentPath.value.replace(new RegExp(`^/${locale2}(/|$)`), "$1") || "/";
      return allLocales.filter((code) => !switcherCodes.has(code)).map((code) => {
        var _a2;
        return {
          code,
          name: ((_a2 = countries2[code]) == null ? void 0 : _a2.name) || code.toUpperCase(),
          href: `/${code}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`
        };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({
        class: "footer",
        role: "contentinfo"
      }, _attrs))} data-v-33e3cb7b><div class="container footer-container" data-v-33e3cb7b><div class="footer-brand" data-v-33e3cb7b><span class="logo-site" data-v-33e3cb7b>${ssrInterpolate(siteConfig.value.name)}</span><span class="logo-app" data-v-33e3cb7b>demo</span></div><nav class="footer-nav" aria-label="Footer" data-v-33e3cb7b>`);
      _push(ssrRenderComponent(unref(Link), {
        href: privacyLink.value,
        class: ["footer-link", { "footer-link--exact-page": currentPath.value === privacyLink.value }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("privacy_policy.page.title"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("privacy_policy.page.title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: contactLink.value,
        class: ["footer-link", { "footer-link--exact-page": currentPath.value === contactLink.value }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("contact.title"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("contact.title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="footer-copyright" data-v-33e3cb7b>© ${ssrInterpolate(yearLabel.value)} ${ssrInterpolate(siteConfig.value.name)}</div></div>`);
      if (seoLocaleLinks.value.length) {
        _push(`<nav class="footer-seo-locales" aria-hidden="true" data-v-33e3cb7b><!--[-->`);
        ssrRenderList(seoLocaleLinks.value, (link) => {
          _push(`<a${ssrRenderAttr("href", link.href)}${ssrRenderAttr("hreflang", link.code)} data-v-33e3cb7b>${ssrInterpolate(link.name)}</a>`);
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</footer>`);
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/footer/Footer.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-33e3cb7b"]]);
const LS_DEMO_STATE = "haccp-demo-state";
const LS_CONSENT_VERSION = "consent_version_1";
const LS_SURVEY_SUBMISSION_STATE = "survey_submission_state_v1";
const SS_VERIFICATION_TOKEN = "verification_token";
const SS_TASK_GRAIN_COOLING = "task_grain_cooling";
const DEMO_TEMPERATURE_TASK_AI_CONTEXT_SHAPE = Object.freeze({
  engine: "temperature-v1",
  niche: null,
  mode: null,
  taskType: "temperature",
  ccpMin: null,
  ccpMax: null,
  ccpLabel: "",
  updatedAt: null
});
const DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE = Object.freeze({
  title: "",
  /** Уровень UI: `ok` | `warning` | `problem` (порог для problem/ warning — в `TemperatureAiAnalyzer`). Не путать с `measurement.status` строки замера. */
  ai_status: "warning",
  risk: 0,
  niche: null,
  mode: null,
  ccpLabel: "",
  currentLine: "",
  deviationLine: "",
  threat: "",
  economy: "",
  inspector: "",
  action: "",
  direction: null,
  value: null,
  ccpMin: null,
  ccpMax: null
});
const task_grain_cooling = reactive({
  /** Уникальный id задачи в демо-чеклистах (`checklistsByNiche[niche]`), совпадает с карточкой CCP. */
  id: "coffee-2",
  /** Ключ ниши в демо-state: `coffee` | `bakery` | `meat`. */
  niche: "coffee",
  /** i18n-ключ названия задачи (используется в `task.title` через `t()` в компонентах). */
  taskTitleKey: "demo_ai.grain_cooling.task_title",
  /**
   * Индекс элемента в массиве `measurements` целевой задачи.
   * В файле изначально `null`; при старте сценария сюда мутируется индекс первого `pending` (`lockGrainCoolingMeasurementIndex`).
   * Таймер `problem` меняет статус только у этого индекса; сброс — `unlockGrainCoolingMeasurementIndex` → снова `null`.
   */
  measurementIndex: null,
  /** Задержка после загрузки SPA: через столько мс показать глобальное оповещение. */
  initialToastDelayMs: 6e4,
  // initialToastDelayMs: 1000,
  /**
   * После показа тоста: через столько мс выставить `problem` у замера с индексом `measurementIndex`, если он ещё `pending`.
   * При показе тоста значение копируется в Pinia (`notificationProblemWindowMs`) и в sessionStorage — полоса и таймер используют снимок.
   * После смены числа на проде нужен новый фронт-бандл; на телефоне сбросьте кэш Safari/Chrome, иначе возможен старый чанк с прежней константой.
   */
  measurementProblemDelayMs: 3e5,
  /** i18n-ключ первой строки оповещения. */
  toastTitleKey: "demo_ai.grain_cooling.toast_title",
  /** i18n-ключ имени задачи в оповещении. */
  toastTaskNameKey: "demo_ai.grain_cooling.task_title",
  /** i18n-ключ кнопки закрытия оповещения. */
  toastButtonCloseLabelKey: "demo_ai.grain_cooling.toast_button_close",
  /** i18n-ключ кнопки перехода к задаче. */
  toastButtonNavigateLabelKey: "demo_ai.grain_cooling.toast_button_navigate",
  /** Ключ `sessionStorage` для персиста «глобальное оповещение уже показывали в этой вкладке». */
  sessionStorageKey: SS_TASK_GRAIN_COOLING,
  /**
   * Для тестов - sessionStorageKey - true
   * В продакшене держать `false`.
   */
  // clearGrainCoolingSessionStorageBeforeLoad: true,
  clearGrainCoolingSessionStorageBeforeLoad: false,
  /** Строковый id Pinia-store сценария (первый аргумент `defineStore`). */
  piniaStoreId: "taskGrainCooling",
  /** Имя именованного роута Vue Router при переходе из оповещения на демо. */
  demoRouteName: "Demo",
  /** Значение `params.section` при переходе: сегмент URL демо-секции с чек-листами. */
  demoRouteSection: "checklists",
  /** CSS-класс на корне toast vue3-toastify; стили в `task-grain-cooling-toastify.scss`. */
  toastifyToastClassName: "global-task-reminder-toast-wrap",
  /** После перехода по диплинку: запросить автооткрытие drawer по первому `pending` в модалке задачи. */
  deepLinkAutoOpenPending: true,
  /**
   * Заглушка полной схемы: флаг «оповещение уже показывали» хранится в Pinia + `sessionStorage`.
   * В экспортируемом объекте остаётся `null` как признак «не дублировать сюда рантайм».
   */
  notificationLaunched: null,
  /**
   * Заглушка: ISO-время запуска оповещения — в Pinia после `markNotificationLaunched`.
   */
  notificationLaunchedAt: null,
  /**
   * Заглушка: id задачи для диплинка — фактически в `store.pendingDeepLink.taskId` (обычно = `id`).
   */
  pendingDeepLinkTaskId: null,
  /**
   * Заглушка: ниша диплинка — в `store.pendingDeepLink.niche` (обычно = `niche`).
   */
  pendingDeepLinkNiche: null,
  /**
   * Заглушка: автооткрытие drawer — фактически `store.autoOpenPendingAfterTaskModal`.
   */
  autoOpenPendingAfterTaskModal: null,
  /**
   * Заглушка: полоса под шапкой — фактически `store.notificationBannerActive`.
   */
  notificationBannerActive: null,
  /**
   * Завершился ли отсчёт `measurementProblemDelayMs` после оповещения (таймер сработал); пишется в Pinia + `sessionStorage`.
   */
  notificationCountdownCompleted: null,
  /**
   * Рантайм: выставляется в `useGrainCoolingDemoEntry` из `demoState` (есть ли `pending` у целевой задачи).
   * Все проверки сначала смотрят сюда; при `false` Pinia store сценария не создают.
   */
  scenarioProcessAllowed: false,
  /**
   * Рантайм: `useGlobalTaskReminder` регистрирует сюда отмену таймеров и закрытие оповещения при `markGrainCoolingScenarioStoredCompleted()`.
   * @type {null | (() => void)}
   */
  cancelGrainCoolingReminderTimers: null,
  /**
   * После перевода замера в `problem` таймером: индекс строки (пока `measurementIndex` уже `null`).
   * Сбрасывается при новом `lockGrainCoolingMeasurementIndex` или после обработки автооткрытия модалки.
   */
  lastProblemAppliedMeasurementIndex: null
});
function lockGrainCoolingMeasurementIndex(index) {
  task_grain_cooling.lastProblemAppliedMeasurementIndex = null;
  if (typeof index !== "number" || index < 0 || !Number.isFinite(index)) {
    task_grain_cooling.measurementIndex = null;
    return;
  }
  task_grain_cooling.measurementIndex = index;
}
function unlockGrainCoolingMeasurementIndex() {
  task_grain_cooling.measurementIndex = null;
}
function readInertiaInitial() {
  var _a2, _b2;
  if (typeof document === "undefined") {
    return { locale: "en", messages: {} };
  }
  const el = document.querySelector('script[data-page="app"][type="application/json"]');
  if (!(el == null ? void 0 : el.textContent)) {
    return { locale: "en", messages: {} };
  }
  try {
    const page = JSON.parse(el.textContent);
    const locale2 = ((_a2 = page == null ? void 0 : page.props) == null ? void 0 : _a2.locale) || "en";
    const translations = ((_b2 = page == null ? void 0 : page.props) == null ? void 0 : _b2.translations) || {};
    return { locale: locale2, messages: translations };
  } catch {
    return { locale: "en", messages: {} };
  }
}
const { locale: locale$1, messages } = readInertiaInitial();
const isServer = typeof document === "undefined";
const i18n = createI18n({
  legacy: false,
  locale: locale$1,
  fallbackLocale: "en",
  messages,
  missingWarn: !isServer,
  fallbackWarn: !isServer
});
const FREQUENCY_CODE = {
  WEEKLY: "weekly",
  DAILY: "daily",
  UNSPECIFIED: "unspecified",
  CUSTOM: "custom"
};
const normalizeFrequency = (raw) => {
  const v = raw == null ? "" : String(raw);
  if (v === "monthly" || v === "yearly") {
    return FREQUENCY_CODE.WEEKLY;
  }
  const allowed = new Set(Object.values(FREQUENCY_CODE));
  if (allowed.has(v)) {
    return v;
  }
  return FREQUENCY_CODE.UNSPECIFIED;
};
const tt$a = (...args) => i18n.global.t(...args);
const TASK_FIELD_TYPE = {
  TEMPERATURE: "temperature",
  SINGLE_CHOICE: "single_choice",
  TICKET: "ticket"
};
function getTaskFieldTypeOptionsBase() {
  return [
    { label: tt$a("demo.task_fields.single_choice"), value: TASK_FIELD_TYPE.SINGLE_CHOICE },
    { label: tt$a("demo.task_fields.ticket"), value: TASK_FIELD_TYPE.TICKET }
  ];
}
function getTaskFieldTypeOptionsEquipment() {
  return [
    { label: tt$a("demo.task_fields.temperature"), value: TASK_FIELD_TYPE.TEMPERATURE },
    ...getTaskFieldTypeOptionsBase()
  ];
}
const TASK_FIELD_TYPE_OPTIONS = getTaskFieldTypeOptionsEquipment;
const taskFieldTypeOptionsByScopeType = (taskScopeType) => taskScopeType === "rooms" ? getTaskFieldTypeOptionsBase() : getTaskFieldTypeOptionsEquipment();
const EQUIPMENT_GROUPS = [
  { groupTitle: tt$a("demo.equipment.group_coffee_roasting"), typeEquipment: "coffee", items: [
    { id: "eq-coffee-roaster", label: tt$a("demo.equipment.eq_roaster") },
    { id: "eq-coffee-destoner", label: tt$a("demo.equipment.eq_destoner") },
    { id: "eq-coffee-machine", label: tt$a("demo.equipment.eq_coffee_machine") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_coffee_cooling"), typeEquipment: "coffee", items: [
    { id: "eq-coffee-bean-cooler", label: tt$a("demo.equipment.eq_bean_cooler") },
    { id: "eq-coffee-shock-cooler", label: tt$a("demo.equipment.eq_shock_cooler") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_coffee_storage"), typeEquipment: "coffee", items: [
    { id: "eq-coffee-vacuum-containers", label: tt$a("demo.equipment.eq_vacuum_containers") },
    { id: "eq-coffee-warehouse-shelving", label: tt$a("demo.equipment.eq_storage_racks") },
    { id: "eq-coffee-grain-canisters", label: tt$a("demo.equipment.eq_bean_canisters") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_bread_sponge"), typeEquipment: "bread", items: [
    { id: "eq-bread-spiral-mixer", label: tt$a("demo.equipment.eq_dough_mixer") },
    { id: "eq-bread-preferment-vat", label: tt$a("demo.equipment.eq_sponge_vat") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_bread_proofing"), typeEquipment: "bread", items: [
    { id: "eq-bread-proofing-cabinet", label: tt$a("demo.equipment.eq_proofing_cabinet") },
    { id: "eq-bread-proofing-trays", label: tt$a("demo.equipment.eq_proofing_trays") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_bread_baking"), typeEquipment: "bread", items: [
    { id: "eq-bread-rotary-oven", label: tt$a("demo.equipment.eq_rotary_oven") },
    { id: "eq-bread-crumb-probe", label: tt$a("demo.equipment.eq_core_thermometer") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_bread_cooling"), typeEquipment: "bread", items: [
    { id: "eq-bread-cooling-conveyor", label: tt$a("demo.equipment.eq_cooling_conveyor") },
    { id: "eq-bread-ventilated-racks", label: tt$a("demo.equipment.eq_ventilation_racks") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_meat_chilled"), typeEquipment: "meat", items: [
    { id: "eq-meat-chilled-room", label: tt$a("demo.equipment.eq_cold_chamber") },
    { id: "eq-meat-chilled-cabinet", label: tt$a("demo.equipment.eq_cold_cabinet") },
    { id: "eq-meat-chilled-display", label: tt$a("demo.equipment.eq_cold_display") },
    { id: "eq-meat-chilled-semi-finished", label: tt$a("demo.equipment.eq_semi_finished_chamber") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_meat_frozen"), typeEquipment: "meat", items: [
    { id: "eq-meat-freezer-room", label: tt$a("demo.equipment.eq_freezer_chamber") },
    { id: "eq-meat-shock-freezer", label: tt$a("demo.equipment.eq_shock_freezer") },
    { id: "eq-meat-freezer-cabinet", label: tt$a("demo.equipment.eq_freezer_cabinet") },
    { id: "eq-meat-deep-freezer", label: tt$a("demo.equipment.eq_deep_freezer") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_cooking"), typeEquipment: "different", items: [
    { id: "eq-stove", label: tt$a("demo.equipment.eq_stove") },
    { id: "eq-combi-oven", label: tt$a("demo.equipment.eq_combi_oven") },
    { id: "eq-fryer", label: tt$a("demo.equipment.eq_fryer") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_cold_storage"), typeEquipment: "different", items: [
    { id: "eq-fridge-1", label: tt$a("demo.equipment.eq_fridge_1") },
    { id: "eq-fridge-2", label: tt$a("demo.equipment.eq_fridge_2") },
    { id: "eq-freezer", label: tt$a("demo.equipment.eq_freezer") },
    { id: "eq-cold-storage", label: tt$a("demo.equipment.eq_cold_storage") },
    { id: "eq-frozen-storage", label: tt$a("demo.equipment.eq_frozen_storage") },
    { id: "eq-cold-display", label: tt$a("demo.equipment.eq_cold_display_gen") },
    { id: "eq-dry-goods", label: tt$a("demo.equipment.eq_dry_goods") },
    { id: "eq-vacuum-packer", label: tt$a("demo.equipment.eq_vacuum_packer") },
    { id: "eq-ice-maker", label: tt$a("demo.equipment.eq_ice_maker") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_control"), typeEquipment: "different", items: [
    { id: "eq-probe-1", label: tt$a("demo.equipment.eq_probe_1") },
    { id: "eq-probe-2", label: tt$a("demo.equipment.eq_probe_2") },
    { id: "eq-scale", label: tt$a("demo.equipment.eq_scale") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_surfaces"), typeEquipment: "different", items: [
    { id: "eq-countertop", label: tt$a("demo.equipment.eq_countertop") },
    { id: "eq-cutting-boards", label: tt$a("demo.equipment.eq_cutting_boards") },
    { id: "eq-door-handles", label: tt$a("demo.equipment.eq_door_handles") },
    { id: "eq-switches", label: tt$a("demo.equipment.eq_switches") },
    { id: "eq-windows", label: tt$a("demo.equipment.eq_windows") },
    { id: "eq-ceiling", label: tt$a("demo.equipment.eq_ceiling") },
    { id: "eq-floors", label: tt$a("demo.equipment.eq_floors") },
    { id: "eq-tables", label: tt$a("demo.equipment.eq_tables") },
    { id: "eq-toilet", label: tt$a("demo.equipment.eq_toilet") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_sanitation"), typeEquipment: "different", items: [
    { id: "eq-sinks", label: tt$a("demo.equipment.eq_sinks") },
    { id: "eq-handwash", label: tt$a("demo.equipment.eq_handwash") },
    { id: "eq-dishwasher", label: tt$a("demo.equipment.eq_dishwasher") },
    { id: "eq-pre-rinse", label: tt$a("demo.equipment.eq_pre_rinse") },
    { id: "eq-dishes", label: tt$a("demo.equipment.eq_dishes") },
    { id: "eq-cutlery-containers", label: tt$a("demo.equipment.eq_cutlery_containers") }
  ] },
  { groupTitle: tt$a("demo.equipment.group_logistics"), typeEquipment: "different", items: [
    { id: "eq-transport-box", label: tt$a("demo.equipment.eq_transport_box") },
    { id: "eq-trolley", label: tt$a("demo.equipment.eq_trolley") },
    { id: "eq-trash-bins", label: tt$a("demo.equipment.eq_trash_bins") },
    { id: "eq-wall-shelf", label: tt$a("demo.equipment.eq_wall_shelf") },
    { id: "eq-cleaning-cabinet", label: tt$a("demo.equipment.eq_cleaning_cabinet") }
  ] }
];
function checklistNicheToEquipmentGroupType(checklistNiche) {
  const n = String(checklistNiche ?? "").trim();
  if (n === "bakery") {
    return "bread";
  }
  if (n === "coffee" || n === "meat") {
    return n;
  }
  return "different";
}
function equipmentGroupsForChecklistNiche(checklistNiche) {
  const want = checklistNicheToEquipmentGroupType(checklistNiche);
  return EQUIPMENT_GROUPS.filter(
    (g) => g.typeEquipment === want || g.typeEquipment === "different"
  );
}
const KNOWN_EQUIPMENT_IDS = new Set(
  EQUIPMENT_GROUPS.flatMap((g) => g.items.map((it) => it.id))
);
const LABEL_BY_EQUIPMENT_ID = new Map(
  EQUIPMENT_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label]))
);
const normalizeEquipmentTargetIds = (raw) => {
  if (!Array.isArray(raw)) {
    return [];
  }
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const x of raw) {
    const id = typeof x === "string" ? x.trim() : "";
    if (!id || !KNOWN_EQUIPMENT_IDS.has(id) || seen.has(id)) {
      continue;
    }
    seen.add(id);
    out.push(id);
  }
  return out;
};
const equipmentTargetsSummary = (ids) => {
  const list = normalizeEquipmentTargetIds(ids);
  if (!list.length) {
    return "";
  }
  if (list.length <= 2) {
    return list.map((id) => LABEL_BY_EQUIPMENT_ID.get(id) ?? id).join(", ");
  }
  return `${list.length} выбрано`;
};
const tt$9 = (...args) => i18n.global.t(...args);
const ROOM_STRUCTURE = [
  { groupKey: "group_production", items: [
    { id: "room-production-hall", labelKey: "room_production_hall" },
    { id: "room-shock-freezer", labelKey: "room_shock_freezer" },
    { id: "room-glazing", labelKey: "room_glazing_zone" }
  ] },
  { groupKey: "group_storage", items: [
    { id: "room-raw-storage", labelKey: "room_raw_storage" },
    { id: "room-finished-storage", labelKey: "room_finished_storage" },
    { id: "room-receiving", labelKey: "room_receiving" },
    { id: "room-cold-chamber", labelKey: "room_cold_chamber" },
    { id: "room-waste", labelKey: "room_waste" }
  ] },
  { groupKey: "group_sanitation", items: [
    { id: "room-wash", labelKey: "room_wash" },
    { id: "room-wc-staff", labelKey: "room_wc_staff" },
    { id: "room-locker", labelKey: "room_locker" }
  ] },
  { groupKey: "group_infrastructure", items: [
    { id: "room-corridor", labelKey: "room_corridor" },
    { id: "room-office-qc", labelKey: "room_office_qc" }
  ] }
];
function getRoomGroups() {
  return ROOM_STRUCTURE.map((g) => ({
    groupTitle: tt$9(`demo.rooms.${g.groupKey}`),
    items: g.items.map((it) => ({ id: it.id, label: tt$9(`demo.rooms.${it.labelKey}`) }))
  }));
}
const ROOM_GROUPS = getRoomGroups();
const KNOWN_ROOM_IDS = new Set(
  ROOM_STRUCTURE.flatMap((g) => g.items.map((it) => it.id))
);
function getRoomLabelById(id) {
  for (const g of ROOM_STRUCTURE) {
    const item = g.items.find((it) => it.id === id);
    if (item) return tt$9(`demo.rooms.${item.labelKey}`);
  }
  return id;
}
const normalizeRoomTargetIds = (raw) => {
  if (!Array.isArray(raw)) {
    return [];
  }
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const x of raw) {
    const id = typeof x === "string" ? x.trim() : "";
    if (!id || !KNOWN_ROOM_IDS.has(id) || seen.has(id)) {
      continue;
    }
    seen.add(id);
    out.push(id);
  }
  return out;
};
const roomTargetsSummary = (ids) => {
  const list = normalizeRoomTargetIds(ids);
  if (!list.length) {
    return "";
  }
  if (list.length <= 2) {
    return list.map((id) => getRoomLabelById(id)).join(", ");
  }
  return tt$9("demo.rooms.selected_count", { count: list.length });
};
const TASK_SCOPE_TYPE = {
  EQUIPMENT: "equipment",
  ROOMS: "rooms",
  STANDALONE: "standalone"
};
const normalizeTaskScopeType = (raw) => {
  const v = raw == null ? "" : String(raw);
  if (v === TASK_SCOPE_TYPE.EQUIPMENT || v === TASK_SCOPE_TYPE.ROOMS || v === TASK_SCOPE_TYPE.STANDALONE) {
    return v;
  }
  return TASK_SCOPE_TYPE.EQUIPMENT;
};
const tt$8 = (...args) => i18n.global.t(...args);
const ALLOWED = new Set(Object.values(TASK_FIELD_TYPE));
const MAX_FIELDS = 20;
const numOrNull = (x) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
};
const strOrEmpty = (x) => typeof x === "string" ? x.trim() : "";
const defaultConfigForFieldType = (fieldType) => {
  switch (fieldType) {
    case TASK_FIELD_TYPE.TEMPERATURE:
      return {
        label: "",
        minC: null,
        maxC: null
      };
    case TASK_FIELD_TYPE.SINGLE_CHOICE:
      return { question: "", options: [""] };
    case TASK_FIELD_TYPE.TICKET:
      return {
        description: ""
      };
    default:
      return {};
  }
};
const createEmptyTaskFieldRow = () => ({
  id: v4(),
  fieldType: null,
  config: {}
});
const normalizeConfig = (fieldType, raw) => {
  const r = raw && typeof raw === "object" ? raw : {};
  switch (fieldType) {
    case TASK_FIELD_TYPE.TEMPERATURE: {
      const base = {
        label: strOrEmpty(r.label) || tt$8("demo.task_field_summary.temperature_default"),
        minC: numOrNull(r.minC),
        maxC: numOrNull(r.maxC)
      };
      if (Object.prototype.hasOwnProperty.call(r, "showCamera")) {
        base.showCamera = Boolean(r.showCamera);
      }
      return base;
    }
    case TASK_FIELD_TYPE.SINGLE_CHOICE: {
      let opts = Array.isArray(r.options) ? r.options.map((x) => String(x ?? "").trim()).filter(Boolean) : [];
      if (!opts.length) {
        opts = [""];
      }
      return {
        question: strOrEmpty(r.question),
        options: opts.slice(0, 20)
      };
    }
    case TASK_FIELD_TYPE.TICKET:
      return {
        description: strOrEmpty(r.description)
      };
    default:
      return {};
  }
};
const normalizeTaskFieldDefinitionItem = (item) => {
  if (!item || typeof item !== "object") {
    return null;
  }
  const ft = item.fieldType;
  if (!ft || !ALLOWED.has(ft)) {
    return null;
  }
  const id = typeof item.id === "string" && item.id.trim() ? item.id.trim() : v4();
  return {
    id,
    fieldType: ft,
    config: normalizeConfig(ft, item.config)
  };
};
const normalizeTaskFieldDefinitions = (raw) => {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out = [];
  for (const x of raw.slice(0, MAX_FIELDS)) {
    const n = normalizeTaskFieldDefinitionItem(x);
    if (n) {
      out.push(n);
    }
  }
  return out;
};
const formatTaskFieldSummaryLine = (def) => {
  if (!(def == null ? void 0 : def.fieldType)) {
    return "";
  }
  const c = def.config ?? {};
  switch (def.fieldType) {
    case TASK_FIELD_TYPE.TEMPERATURE:
      return tt$8("demo.task_field_summary.temperature_line", { min: c.minC ?? "—", max: c.maxC ?? "—" });
    case TASK_FIELD_TYPE.SINGLE_CHOICE:
      return tt$8("demo.task_field_summary.single_choice_line", { question: c.question || "—", count: Array.isArray(c.options) ? c.options.length : 0 });
    case TASK_FIELD_TYPE.TICKET:
      return tt$8("demo.task_field_summary.ticket_line", { description: c.description || tt$8("demo.task_field_summary.ticket_no_desc") });
    default:
      return def.fieldType;
  }
};
function parseTemperatureFromMeasurementValue(rawValue) {
  const source = String(rawValue ?? "").trim();
  if (!source) {
    return null;
  }
  const normalized = source.replace(/\s+/g, "").replace("°C", "").replace("°c", "").replace(",", ".");
  const match = normalized.match(/^[+-]?\d+(?:\.\d+)?$/);
  if (!match) {
    return null;
  }
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}
const tt$7 = (...args) => i18n.global.t(...args);
const BREAD_SPONGE_MIX_EQUIPMENT_IDS = Object.freeze([
  "eq-bread-spiral-mixer",
  "eq-bread-preferment-vat"
]);
const BREAD_PROOFING_EQUIPMENT_IDS = Object.freeze([
  "eq-bread-proofing-cabinet",
  "eq-bread-proofing-trays"
]);
const BREAD_BAKING_EQUIPMENT_IDS = Object.freeze([
  "eq-bread-rotary-oven",
  "eq-bread-crumb-probe"
]);
const BREAD_COOLING_EQUIPMENT_IDS = Object.freeze([
  "eq-bread-cooling-conveyor",
  "eq-bread-ventilated-racks"
]);
const BREAD_TEMP = Object.freeze({
  /** Опарка/замес: три полосы — `>35`, `26…34`, `<25` (см. `BREAD_SPONGE_MIX_BANDS`). */
  sponge_mix: Object.freeze({
    gtCritical: 35,
    normalMin: 26,
    normalMax: 34,
    ltWarn: 25
  }),
  /** Расстойка: три полосы — `>40`, `32…40`, `<30` (см. `BREAD_PROOFING_BANDS`). */
  proofing: Object.freeze({
    gtCritical: 40,
    normalMin: 32,
    normalMax: 40,
    ltWarn: 30
  }),
  /** Выпечка: четыре полосы — `36…94`, `95…180`, `181…260`, `>260` (см. `BREAD_BAKING_BANDS`). Окно CCP «норма» — `181…260`. */
  baking: Object.freeze({
    /** t < 95 — зона «недопечённое» (в т.ч. &lt;36 °C). */
    undercookBelow: 95,
    sterileUnderbakedMax: 180,
    normalBakeMax: 260,
    overheatAbove: 260,
    ccpMin: 181,
    ccpMax: 260
  }),
  /** Охлаждение: три полосы — `>35` (>2 ч в таблице не моделируем), `25…35`, `<25` (см. `BREAD_COOLING_BANDS`). */
  cooling: Object.freeze({
    gtCritical: 35,
    normalMin: 25,
    normalMax: 35,
    warnLow: 25
  })
});
const SM = BREAD_TEMP.sponge_mix;
const PF = BREAD_TEMP.proofing;
const BK = BREAD_TEMP.baking;
const CL = BREAD_TEMP.cooling;
function getBreadModeCcpWindow(mode) {
  const m = String(mode ?? "").trim().toLowerCase();
  if (m === "sponge_mix") {
    return { min: SM.normalMin, max: SM.normalMax };
  }
  if (m === "proofing") {
    return { min: PF.normalMin, max: PF.normalMax };
  }
  if (m === "baking") {
    return { min: BK.ccpMin, max: BK.ccpMax };
  }
  if (m === "cooling") {
    return { min: CL.normalMin, max: CL.normalMax };
  }
  return null;
}
const BREAD_SPONGE_MIX_BANDS = Object.freeze([
  Object.freeze({
    id: "bread_sponge_gt_35",
    processLabel: tt$7("demo.bread_bands.process_sponge"),
    temperatureLabel: "> 35°C",
    status: "critical",
    threat: tt$7("demo.bread_bands.sponge_hot_threat"),
    action: tt$7("demo.bread_bands.sponge_hot_action"),
    equipmentTargetIds: BREAD_SPONGE_MIX_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "bread_sponge_26_34",
    processLabel: tt$7("demo.bread_bands.process_sponge"),
    temperatureLabel: "26…34°C",
    status: "normal",
    threat: tt$7("demo.bread_bands.sponge_normal_threat"),
    action: "—",
    equipmentTargetIds: BREAD_SPONGE_MIX_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "bread_sponge_lt_25",
    processLabel: tt$7("demo.bread_bands.process_sponge"),
    temperatureLabel: "< 25°C",
    status: "warning",
    threat: tt$7("demo.bread_bands.sponge_cold_threat"),
    action: tt$7("demo.bread_bands.sponge_cold_action"),
    equipmentTargetIds: BREAD_SPONGE_MIX_EQUIPMENT_IDS
  })
]);
const BREAD_PROOFING_BANDS = Object.freeze([
  Object.freeze({
    id: "bread_proof_gt_40",
    processLabel: tt$7("demo.bread_bands.process_proofing"),
    temperatureLabel: "> 41°C",
    status: "critical",
    threat: tt$7("demo.bread_bands.proofing_hot_threat"),
    action: tt$7("demo.bread_bands.proofing_hot_action"),
    equipmentTargetIds: BREAD_PROOFING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "bread_proof_32_40",
    processLabel: tt$7("demo.bread_bands.process_proofing"),
    temperatureLabel: "32…40°C",
    status: "normal",
    threat: tt$7("demo.bread_bands.proofing_normal_threat"),
    action: "—",
    equipmentTargetIds: BREAD_PROOFING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "bread_proof_lt_30",
    processLabel: tt$7("demo.bread_bands.process_proofing"),
    temperatureLabel: "< 31°C",
    status: "warning",
    threat: tt$7("demo.bread_bands.proofing_cold_threat"),
    action: tt$7("demo.bread_bands.proofing_cold_action"),
    equipmentTargetIds: BREAD_PROOFING_EQUIPMENT_IDS
  })
]);
const BREAD_BAKING_BANDS = Object.freeze([
  // 36-94°C — недопечённое
  Object.freeze({
    id: "bread_undercook_36_94",
    processLabel: tt$7("demo.bread_bands.process_baking"),
    temperatureLabel: "36…94°C",
    status: "critical",
    threat: tt$7("demo.bread_bands.baking_raw_threat"),
    action: tt$7("demo.bread_bands.baking_raw_action"),
    equipmentTargetIds: BREAD_BAKING_EQUIPMENT_IDS
  }),
  // 95-180°C — стерильно, но не выпечено
  Object.freeze({
    id: "bread_sterile_95_180",
    processLabel: tt$7("demo.bread_bands.process_baking"),
    temperatureLabel: "95…180°C",
    status: "normal",
    threat: tt$7("demo.bread_bands.baking_sterile_threat"),
    action: tt$7("demo.bread_bands.baking_sterile_action"),
    equipmentTargetIds: BREAD_BAKING_EQUIPMENT_IDS
  }),
  // 181-260°C — стандартная выпечка
  Object.freeze({
    id: "bread_bake_normal_181_260",
    processLabel: tt$7("demo.bread_bands.process_baking"),
    temperatureLabel: "181…260°C",
    status: "normal",
    threat: tt$7("demo.bread_bands.baking_normal_threat"),
    action: tt$7("demo.bread_bands.baking_normal_action"),
    equipmentTargetIds: BREAD_BAKING_EQUIPMENT_IDS
  }),
  // > 260°C — перегрев
  Object.freeze({
    id: "bread_overheat_gt_260",
    processLabel: tt$7("demo.bread_bands.process_baking"),
    temperatureLabel: "> 260°C",
    status: "warning",
    threat: tt$7("demo.bread_bands.baking_burn_threat"),
    action: tt$7("demo.bread_bands.baking_burn_action"),
    equipmentTargetIds: BREAD_BAKING_EQUIPMENT_IDS
  })
]);
const BREAD_COOLING_BANDS = Object.freeze([
  Object.freeze({
    id: "bread_cool_gt_35",
    processLabel: tt$7("demo.bread_bands.process_cooling"),
    temperatureLabel: "> 35°C (>2ч)",
    status: "critical",
    threat: tt$7("demo.bread_bands.cooling_hot_threat"),
    action: tt$7("demo.bread_bands.cooling_hot_action"),
    equipmentTargetIds: BREAD_COOLING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "bread_cool_25_35",
    processLabel: tt$7("demo.bread_bands.process_cooling"),
    temperatureLabel: "25…35°C",
    status: "normal",
    threat: tt$7("demo.bread_bands.cooling_normal_threat"),
    action: tt$7("demo.bread_bands.cooling_normal_action"),
    equipmentTargetIds: BREAD_COOLING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "bread_cool_lt_25",
    processLabel: tt$7("demo.bread_bands.process_cooling"),
    temperatureLabel: "< 25°C",
    status: "warning",
    threat: tt$7("demo.bread_bands.cooling_cold_threat"),
    action: tt$7("demo.bread_bands.cooling_cold_action"),
    equipmentTargetIds: BREAD_COOLING_EQUIPMENT_IDS
  })
]);
const DEFAULT_BREAD_AI_PROFILE_FALLBACK = Object.freeze([
  Object.freeze({
    id: "bread_cool_lt_25",
    processLabel: tt$7("demo.bread_bands.process_cooling"),
    temperatureLabel: "< 25°C",
    status: "warning",
    threat: tt$7("demo.bread_bands.fallback_cold_threat"),
    action: tt$7("demo.bread_bands.fallback_cold_action")
  }),
  Object.freeze({
    id: "bread_cool_25_35",
    processLabel: tt$7("demo.bread_bands.process_cooling"),
    temperatureLabel: "25…35°C",
    status: "normal",
    threat: tt$7("demo.bread_bands.fallback_cool_threat"),
    action: tt$7("demo.bread_bands.fallback_cool_action")
  }),
  Object.freeze({
    id: "bread_undercook_36_94",
    processLabel: tt$7("demo.bread_bands.process_baking"),
    temperatureLabel: "36…94°C",
    status: "critical",
    threat: tt$7("demo.bread_bands.baking_raw_threat"),
    action: tt$7("demo.bread_bands.baking_raw_action")
  }),
  Object.freeze({
    id: "bread_sterile_95_180",
    processLabel: tt$7("demo.bread_bands.process_baking"),
    temperatureLabel: "95…180°C",
    status: "normal",
    threat: tt$7("demo.bread_bands.baking_sterile_threat"),
    action: tt$7("demo.bread_bands.baking_sterile_action")
  }),
  Object.freeze({
    id: "bread_bake_normal_181_260",
    processLabel: tt$7("demo.bread_bands.process_baking"),
    temperatureLabel: "181…260°C",
    status: "normal",
    threat: tt$7("demo.bread_bands.baking_normal_threat"),
    action: tt$7("demo.bread_bands.baking_normal_action")
  }),
  Object.freeze({
    id: "bread_overheat_gt_260",
    processLabel: tt$7("demo.bread_bands.process_baking"),
    temperatureLabel: "> 260°C",
    status: "warning",
    threat: tt$7("demo.bread_bands.baking_burn_threat"),
    action: tt$7("demo.bread_bands.baking_burn_action")
  })
]);
function taskHasBreadEquipment(taskEquipmentTargetIds) {
  const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
  return ids.some((id) => String(id).startsWith("eq-bread-"));
}
function pickDefaultBreadNoEquipmentBand(t) {
  if (!Number.isFinite(t)) {
    return null;
  }
  const rows = DEFAULT_BREAD_AI_PROFILE_FALLBACK;
  if (t < 25) {
    return rows[0];
  }
  if (t <= 35) {
    return rows[1];
  }
  if (t < BK.undercookBelow) {
    return rows[2];
  }
  if (t <= BK.sterileUnderbakedMax) {
    return rows[3];
  }
  if (t <= BK.normalBakeMax) {
    return rows[4];
  }
  return rows[5];
}
const BREAD_MODE_ANALYZER_PROFILES = Object.freeze({
  sponge_mix: Object.freeze({
    ccpMin: SM.normalMin,
    ccpMax: SM.normalMax,
    ccpLabel: tt$7("demo.bread_bands.ccp_sponge_mix"),
    riskSlope: 14
  }),
  proofing: Object.freeze({
    ccpMin: PF.normalMin,
    ccpMax: PF.normalMax,
    ccpLabel: tt$7("demo.bread_bands.ccp_proofing"),
    riskSlope: 14
  }),
  baking: Object.freeze({
    ccpMin: BK.ccpMin,
    ccpMax: BK.ccpMax,
    ccpLabel: tt$7("demo.bread_bands.ccp_baking"),
    riskSlope: 12
  }),
  cooling: Object.freeze({
    ccpMin: CL.normalMin,
    ccpMax: CL.normalMax,
    ccpLabel: tt$7("demo.bread_bands.ccp_cooling"),
    riskSlope: 12
  })
});
const SPONGE_I = Object.freeze({
  gt35: 0,
  norm26_34: 1,
  lt25: 2
});
const PROOF_I = Object.freeze({
  gt40: 0,
  norm32_40: 1,
  lt30: 2
});
const BAKE_I = Object.freeze({
  undercook: 0,
  sterile95_180: 1,
  normal181_260: 2,
  overheatGt260: 3
});
const COOLB_I = Object.freeze({
  gt35: 0,
  norm25_35: 1,
  lt25: 2
});
function pickSpongeMixBand(t) {
  if (t > SM.gtCritical) {
    return BREAD_SPONGE_MIX_BANDS[SPONGE_I.gt35];
  }
  if (t >= SM.normalMin && t <= SM.normalMax) {
    return BREAD_SPONGE_MIX_BANDS[SPONGE_I.norm26_34];
  }
  if (t < SM.ltWarn) {
    return BREAD_SPONGE_MIX_BANDS[SPONGE_I.lt25];
  }
  if (t >= SM.ltWarn && t < SM.normalMin) {
    return BREAD_SPONGE_MIX_BANDS[SPONGE_I.lt25];
  }
  if (t > SM.normalMax && t <= SM.gtCritical) {
    return BREAD_SPONGE_MIX_BANDS[SPONGE_I.gt35];
  }
  return null;
}
function pickProofingBand(t) {
  if (t > PF.gtCritical) {
    return BREAD_PROOFING_BANDS[PROOF_I.gt40];
  }
  if (t >= PF.normalMin && t <= PF.normalMax) {
    return BREAD_PROOFING_BANDS[PROOF_I.norm32_40];
  }
  if (t < PF.ltWarn) {
    return BREAD_PROOFING_BANDS[PROOF_I.lt30];
  }
  if (t >= PF.ltWarn && t < PF.normalMin) {
    return BREAD_PROOFING_BANDS[PROOF_I.lt30];
  }
  return null;
}
function pickBakingBand(t) {
  if (t < BK.undercookBelow) {
    return BREAD_BAKING_BANDS[BAKE_I.undercook];
  }
  if (t <= BK.sterileUnderbakedMax) {
    return BREAD_BAKING_BANDS[BAKE_I.sterile95_180];
  }
  if (t <= BK.normalBakeMax) {
    return BREAD_BAKING_BANDS[BAKE_I.normal181_260];
  }
  if (t > BK.overheatAbove) {
    return BREAD_BAKING_BANDS[BAKE_I.overheatGt260];
  }
  return null;
}
function pickBreadCoolingBand(t) {
  if (t > CL.gtCritical) {
    return BREAD_COOLING_BANDS[COOLB_I.gt35];
  }
  if (t >= CL.normalMin && t <= CL.normalMax) {
    return BREAD_COOLING_BANDS[COOLB_I.norm25_35];
  }
  if (t < CL.warnLow) {
    return BREAD_COOLING_BANDS[COOLB_I.lt25];
  }
  return null;
}
function normalizeBreadMode(mode) {
  if (mode == null || mode === "") {
    return "proofing";
  }
  const m = String(mode).toLowerCase();
  if (m === "sponge_mix" || m === "proofing" || m === "baking" || m === "cooling") {
    return m;
  }
  return null;
}
function resolveBreadBand(t, mode) {
  const m = normalizeBreadMode(mode);
  if (m === "sponge_mix") {
    return pickSpongeMixBand(t);
  }
  if (m === "proofing") {
    return pickProofingBand(t);
  }
  if (m === "baking") {
    return pickBakingBand(t);
  }
  if (m === "cooling") {
    return pickBreadCoolingBand(t);
  }
  return null;
}
function resolveBreadRowForTaskMeasurement(t, taskEquipmentTargetIds, mode) {
  if (!Number.isFinite(t)) {
    return null;
  }
  if (taskHasBreadEquipment(taskEquipmentTargetIds)) {
    return resolveBreadBand(t, mode);
  }
  return pickDefaultBreadNoEquipmentBand(t);
}
function breadBandMatchesTaskEquipment(band, taskEquipmentTargetIds) {
  var _a2;
  if (!((_a2 = band == null ? void 0 : band.equipmentTargetIds) == null ? void 0 : _a2.length)) {
    return true;
  }
  const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
  if (!ids.length) {
    return true;
  }
  return band.equipmentTargetIds.some((id) => ids.includes(id));
}
const tt$6 = (...args) => i18n.global.t(...args);
const COFFEE_STORAGE_EQUIPMENT_IDS = Object.freeze([
  "eq-coffee-vacuum-containers",
  "eq-coffee-warehouse-shelving",
  "eq-coffee-grain-canisters"
]);
const COFFEE_ROASTING_EQUIPMENT_IDS = Object.freeze([
  "eq-coffee-roaster",
  "eq-coffee-destoner"
]);
const COFFEE_COOLING_EQUIPMENT_IDS = Object.freeze([
  "eq-coffee-bean-cooler",
  "eq-coffee-shock-cooler"
]);
const COFFEE_TEMP = Object.freeze({
  storage: Object.freeze({
    gtCritical: 30,
    /** Нижняя граница зоны предупреждения +25…+30 °C; норма хранения — [normalMin, warnHigh) °C */
    warnHigh: 25,
    normalMin: 15
  }),
  roasting: Object.freeze({
    gtCritical: 230,
    normalMin: 195,
    normalMax: 230,
    warnMin: 165,
    warnMax: 195,
    ltCritical: 165
  }),
  cooling: Object.freeze({
    gtCritical: 40,
    /** Нижняя граница зоны «медленное охлаждение» +25…+40 °C; норма — [normalMin, warnLow) °C */
    warnLow: 25,
    warnHigh: 40,
    normalMin: 15
  })
});
const S = COFFEE_TEMP.storage;
const R = COFFEE_TEMP.roasting;
const C$1 = COFFEE_TEMP.cooling;
const COFFEE_STORAGE_BANDS = Object.freeze([
  Object.freeze({
    id: "coffee_storage_gt_30",
    processLabel: tt$6("demo.coffee_bands.process_storage"),
    temperatureLabel: "> +30°C",
    status: "critical",
    threat: tt$6("demo.coffee_bands.storage_hot_threat"),
    action: tt$6("demo.coffee_bands.storage_hot_action"),
    equipmentTargetIds: COFFEE_STORAGE_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_storage_25_30",
    processLabel: tt$6("demo.coffee_bands.process_storage"),
    temperatureLabel: "+25…+30°C",
    status: "warning",
    threat: tt$6("demo.coffee_bands.storage_warm_threat"),
    action: tt$6("demo.coffee_bands.storage_warm_action"),
    equipmentTargetIds: COFFEE_STORAGE_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_storage_15_24",
    processLabel: tt$6("demo.coffee_bands.process_storage"),
    temperatureLabel: "+15…+24°C",
    status: "normal",
    threat: tt$6("demo.coffee_bands.storage_normal_threat"),
    action: tt$6("demo.coffee_bands.storage_normal_action"),
    equipmentTargetIds: COFFEE_STORAGE_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_storage_lt_15",
    processLabel: tt$6("demo.coffee_bands.process_storage"),
    temperatureLabel: "< +15°C",
    status: "warning",
    threat: tt$6("demo.coffee_bands.storage_cold_threat"),
    action: tt$6("demo.coffee_bands.storage_cold_action"),
    equipmentTargetIds: COFFEE_STORAGE_EQUIPMENT_IDS
  })
]);
const COFFEE_ROASTING_BANDS = Object.freeze([
  Object.freeze({
    id: "coffee_roast_gt_230",
    processLabel: tt$6("demo.coffee_bands.process_roasting"),
    temperatureLabel: "> 230°C",
    status: "critical",
    threat: tt$6("demo.coffee_bands.roasting_burn_threat"),
    action: tt$6("demo.coffee_bands.roasting_burn_action"),
    equipmentTargetIds: COFFEE_ROASTING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_roast_195_230",
    processLabel: tt$6("demo.coffee_bands.process_roasting"),
    temperatureLabel: "195…230°C",
    status: "normal",
    threat: tt$6("demo.coffee_bands.roasting_normal_threat"),
    action: "—",
    equipmentTargetIds: COFFEE_ROASTING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_roast_165_195",
    processLabel: tt$6("demo.coffee_bands.process_roasting"),
    temperatureLabel: "165…194°C",
    status: "warning",
    threat: tt$6("demo.coffee_bands.roasting_under_threat"),
    action: tt$6("demo.coffee_bands.roasting_under_action"),
    equipmentTargetIds: COFFEE_ROASTING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_roast_lt_165",
    processLabel: tt$6("demo.coffee_bands.process_roasting"),
    temperatureLabel: "< 165°C",
    status: "critical",
    threat: tt$6("demo.coffee_bands.roasting_raw_threat"),
    action: tt$6("demo.coffee_bands.roasting_raw_action"),
    equipmentTargetIds: COFFEE_ROASTING_EQUIPMENT_IDS
  })
]);
const COFFEE_COOLING_BANDS = Object.freeze([
  Object.freeze({
    id: "coffee_cool_gt_40",
    processLabel: tt$6("demo.coffee_bands.process_cooling"),
    temperatureLabel: tt$6("demo.coffee_bands.temp_label_cooling_critical"),
    status: "critical",
    threat: tt$6("demo.coffee_bands.cooling_hot_threat"),
    action: tt$6("demo.coffee_bands.cooling_hot_action"),
    equipmentTargetIds: COFFEE_COOLING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_cool_25_40",
    processLabel: tt$6("demo.coffee_bands.process_cooling"),
    temperatureLabel: "+25…+40°C",
    status: "warning",
    threat: tt$6("demo.coffee_bands.cooling_warm_threat"),
    action: tt$6("demo.coffee_bands.cooling_warm_action"),
    equipmentTargetIds: COFFEE_COOLING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_cool_15_24",
    processLabel: tt$6("demo.coffee_bands.process_cooling"),
    temperatureLabel: "+15…+24°C",
    status: "normal",
    threat: tt$6("demo.coffee_bands.cooling_normal_threat"),
    action: tt$6("demo.coffee_bands.cooling_normal_action"),
    equipmentTargetIds: COFFEE_COOLING_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "coffee_cool_lt_15",
    processLabel: tt$6("demo.coffee_bands.process_cooling"),
    temperatureLabel: "< +15°C",
    status: "warning",
    threat: tt$6("demo.coffee_bands.cooling_cold_threat"),
    action: tt$6("demo.coffee_bands.cooling_cold_action"),
    equipmentTargetIds: COFFEE_COOLING_EQUIPMENT_IDS
  })
]);
const DEFAULT_COFFEE_AI_PROFILE_FALLBACK = Object.freeze([
  Object.freeze({
    id: "coffee_cold_lt_14",
    processLabel: tt$6("demo.coffee_bands.process_storage_cooling"),
    temperatureLabel: "< +15°C",
    status: "warning",
    threat: tt$6("demo.coffee_bands.fallback_cold_threat"),
    action: tt$6("demo.coffee_bands.fallback_cold_action")
  }),
  Object.freeze({
    id: "coffee_ideal_15_24",
    processLabel: tt$6("demo.coffee_bands.process_storage_cooling"),
    temperatureLabel: "+15…+24°C",
    status: "normal",
    threat: tt$6("demo.coffee_bands.fallback_normal_threat"),
    action: tt$6("demo.coffee_bands.fallback_normal_action")
  }),
  Object.freeze({
    id: "coffee_warm_25_40",
    processLabel: tt$6("demo.coffee_bands.process_storage_cooling"),
    temperatureLabel: "+25…+40°C",
    status: "warning",
    threat: tt$6("demo.coffee_bands.fallback_warm_threat"),
    action: tt$6("demo.coffee_bands.fallback_warm_action")
  }),
  Object.freeze({
    id: "coffee_hot_41_194",
    processLabel: tt$6("demo.coffee_bands.process_roasting_cooling"),
    temperatureLabel: "+41…+194°C",
    status: "normal",
    threat: tt$6("demo.coffee_bands.fallback_mid_threat"),
    action: tt$6("demo.coffee_bands.fallback_mid_action")
  }),
  Object.freeze({
    id: "coffee_roast_perfect_195_230",
    processLabel: tt$6("demo.coffee_bands.process_roasting"),
    temperatureLabel: "195…230°C",
    status: "normal",
    threat: tt$6("demo.coffee_bands.fallback_roast_threat"),
    action: tt$6("demo.coffee_bands.fallback_roast_action")
  }),
  Object.freeze({
    id: "coffee_burn_gt_231",
    processLabel: tt$6("demo.coffee_bands.process_roasting"),
    temperatureLabel: "> +230°C",
    status: "critical",
    threat: tt$6("demo.coffee_bands.fallback_burn_threat"),
    action: tt$6("demo.coffee_bands.fallback_burn_action")
  })
]);
function pickDefaultCoffeeNoEquipmentBand(t) {
  if (!Number.isFinite(t)) {
    return null;
  }
  const rows = DEFAULT_COFFEE_AI_PROFILE_FALLBACK;
  if (t < 15) {
    return rows[0];
  }
  if (t < 25) {
    return rows[1];
  }
  if (t < 41) {
    return rows[2];
  }
  if (t < 195) {
    return rows[3];
  }
  if (t <= 230) {
    return rows[4];
  }
  return rows[5];
}
const STORAGE_I = Object.freeze({
  gt30: 0,
  open25_30: 1,
  closed15_24: 2,
  lt15: 3
});
const ROAST_I = Object.freeze({
  gt230: 0,
  closed195_230: 1,
  closed165_195: 2,
  lt165: 3
});
const COOL_I = Object.freeze({
  gt40: 0,
  open25_40: 1,
  closed15_24: 2,
  lt15: 3
});
function pickStorageBand(t) {
  if (t > S.gtCritical) {
    return COFFEE_STORAGE_BANDS[STORAGE_I.gt30];
  }
  if (t >= S.warnHigh && t <= S.gtCritical) {
    return COFFEE_STORAGE_BANDS[STORAGE_I.open25_30];
  }
  if (t >= S.normalMin && t < S.warnHigh) {
    return COFFEE_STORAGE_BANDS[STORAGE_I.closed15_24];
  }
  if (t < S.normalMin) {
    return COFFEE_STORAGE_BANDS[STORAGE_I.lt15];
  }
  return null;
}
function pickRoastingBand(t) {
  if (t > R.gtCritical) {
    return COFFEE_ROASTING_BANDS[ROAST_I.gt230];
  }
  if (t >= R.normalMin && t <= R.normalMax) {
    return COFFEE_ROASTING_BANDS[ROAST_I.closed195_230];
  }
  if (t >= R.warnMin && t < R.warnMax) {
    return COFFEE_ROASTING_BANDS[ROAST_I.closed165_195];
  }
  if (t < R.ltCritical) {
    return COFFEE_ROASTING_BANDS[ROAST_I.lt165];
  }
  return null;
}
function pickCoolingBand(t) {
  if (t > C$1.gtCritical) {
    return COFFEE_COOLING_BANDS[COOL_I.gt40];
  }
  if (t >= C$1.warnLow && t <= C$1.warnHigh) {
    return COFFEE_COOLING_BANDS[COOL_I.open25_40];
  }
  if (t >= C$1.normalMin && t < C$1.warnLow) {
    return COFFEE_COOLING_BANDS[COOL_I.closed15_24];
  }
  if (t < C$1.normalMin) {
    return COFFEE_COOLING_BANDS[COOL_I.lt15];
  }
  return null;
}
function normalizeCoffeeMode(mode) {
  if (mode == null || mode === "") {
    return "storage";
  }
  const m = String(mode).toLowerCase();
  if (m === "storage" || m === "roasting" || m === "cooling") {
    return m;
  }
  return null;
}
function resolveCoffeeBand(t, mode) {
  const m = normalizeCoffeeMode(mode);
  if (m === "storage") {
    return pickStorageBand(t);
  }
  if (m === "roasting") {
    return pickRoastingBand(t);
  }
  if (m === "cooling") {
    return pickCoolingBand(t);
  }
  return null;
}
function taskHasCoffeeEquipment(taskEquipmentTargetIds) {
  const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
  return ids.some((id) => String(id).startsWith("eq-coffee-"));
}
function coffeeBandMatchesTaskEquipment(band, taskEquipmentTargetIds) {
  var _a2;
  if (!taskHasCoffeeEquipment(taskEquipmentTargetIds)) {
    return true;
  }
  if (!((_a2 = band == null ? void 0 : band.equipmentTargetIds) == null ? void 0 : _a2.length)) {
    return true;
  }
  const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
  if (!ids.length) {
    return true;
  }
  return band.equipmentTargetIds.some((id) => ids.includes(id));
}
function resolveCoffeeRowForTaskMeasurement(t, taskEquipmentTargetIds, mode) {
  if (!Number.isFinite(t)) {
    return null;
  }
  if (taskHasCoffeeEquipment(taskEquipmentTargetIds)) {
    return resolveCoffeeBand(t, mode);
  }
  return pickDefaultCoffeeNoEquipmentBand(t);
}
const MEAT_CHILLED_EQUIPMENT_IDS = Object.freeze([
  "eq-meat-chilled-room",
  "eq-meat-chilled-cabinet",
  "eq-meat-chilled-display",
  "eq-meat-chilled-semi-finished"
]);
const MEAT_FREEZER_EQUIPMENT_IDS = Object.freeze([
  "eq-meat-freezer-room",
  "eq-meat-shock-freezer",
  "eq-meat-freezer-cabinet",
  "eq-meat-deep-freezer"
]);
const MEAT_STORAGE_TEMP = Object.freeze({
  chilled: Object.freeze({
    salmonella: 8,
    dangerZone: 5,
    fridgeMeat: 2,
    /** Граница: ≥0 → chilled-таблица, <0 → freezer-таблица */
    juicesFreeze: 0
  }),
  freezer: Object.freeze({
    surfaceOk: -12,
    standard: -18,
    burn: -25
  })
});
const C = MEAT_STORAGE_TEMP.chilled;
const F = MEAT_STORAGE_TEMP.freezer;
function pickDefaultMeatNoEquipmentBand(t) {
  if (!Number.isFinite(t)) {
    return null;
  }
  const rows = DEFAULT_MEAT_AI_PROFILE_FALLBACK;
  if (t < -25) {
    return rows[0];
  }
  if (t <= -12) {
    return rows[1];
  }
  if (t <= -1) {
    return rows[2];
  }
  if (t <= 1) {
    return rows[3];
  }
  if (t <= 4) {
    return rows[4];
  }
  if (t <= 8) {
    return rows[5];
  }
  return rows[6];
}
const tt$5 = (...args) => i18n.global.t(...args);
const MEAT_MODE_ANALYZER_PROFILES = Object.freeze({
  chilled: Object.freeze({
    ccpMin: 0,
    ccpMax: 2,
    ccpLabel: tt$5("demo.meat_bands.ccp_chilled"),
    riskSlope: 20
  }),
  freezer: Object.freeze({
    ccpMin: -24,
    ccpMax: -18,
    ccpLabel: tt$5("demo.meat_bands.ccp_freezer"),
    riskSlope: 16
  })
});
const MEAT_STORAGE_CHILLED_BANDS = Object.freeze([
  Object.freeze({
    id: "chilled_gt_8",
    temperatureLabel: tt$5("demo.meat_bands.temp_label_fresh_meat"),
    status: "critical",
    threat: tt$5("demo.meat_bands.chilled_critical_threat"),
    action: tt$5("demo.meat_bands.chilled_critical_action"),
    equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "chilled_5_8",
    temperatureLabel: "+5…+8°C",
    status: "warning",
    threat: tt$5("demo.meat_bands.chilled_warning_threat"),
    action: tt$5("demo.meat_bands.chilled_warning_action"),
    equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "chilled_2_5",
    temperatureLabel: "+2…+4°C",
    status: "normal",
    threat: tt$5("demo.meat_bands.chilled_normal_threat"),
    action: tt$5("demo.meat_bands.chilled_normal_action"),
    equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "chilled_0_2",
    temperatureLabel: "0…+1°C",
    status: "normal",
    threat: tt$5("demo.meat_bands.chilled_low_threat"),
    action: tt$5("demo.meat_bands.chilled_low_action"),
    equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS
  })
]);
const MEAT_STORAGE_FREEZER_BANDS = Object.freeze([
  Object.freeze({
    id: "freezer_gt_m12",
    temperatureLabel: tt$5("demo.meat_bands.temp_label_above_freezing"),
    status: "warning",
    threat: tt$5("demo.meat_bands.frozen_warm_threat"),
    action: tt$5("demo.meat_bands.frozen_warm_action"),
    equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "freezer_m12_m18",
    temperatureLabel: "−12…−18°C",
    status: "normal",
    threat: tt$5("demo.meat_bands.frozen_normal_threat"),
    action: tt$5("demo.meat_bands.frozen_normal_action"),
    equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "freezer_m25_m18",
    temperatureLabel: "−19°…−25C",
    status: "normal",
    threat: tt$5("demo.meat_bands.frozen_premium_threat"),
    action: tt$5("demo.meat_bands.frozen_premium_action"),
    equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS
  }),
  Object.freeze({
    id: "freezer_lt_m25",
    temperatureLabel: "< −26°C",
    status: "warning",
    threat: tt$5("demo.meat_bands.frozen_overcool_threat"),
    action: tt$5("demo.meat_bands.frozen_overcool_action"),
    equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS
  })
]);
const DEFAULT_MEAT_AI_PROFILE_FALLBACK = Object.freeze([
  Object.freeze({
    id: "meat_deep_freeze_lt_m25",
    processLabel: tt$5("demo.meat_bands.process_freezing"),
    temperatureLabel: "< −25°C",
    status: "warning",
    threat: tt$5("demo.meat_bands.fallback_overcool_threat"),
    action: tt$5("demo.meat_bands.fallback_overcool_action")
  }),
  Object.freeze({
    id: "meat_freeze_m25_m12",
    processLabel: tt$5("demo.meat_bands.process_freezing"),
    temperatureLabel: "−25…−12°C",
    status: "normal",
    threat: tt$5("demo.meat_bands.fallback_frozen_threat"),
    action: tt$5("demo.meat_bands.fallback_frozen_action")
  }),
  Object.freeze({
    id: "meat_superchilled_m11_0",
    processLabel: tt$5("demo.meat_bands.process_overcooling"),
    temperatureLabel: "−11…−1°C",
    status: "warning",
    threat: tt$5("demo.meat_bands.fallback_softening_threat"),
    action: tt$5("demo.meat_bands.fallback_softening_action")
  }),
  Object.freeze({
    id: "meat_chilled_0_1",
    processLabel: tt$5("demo.meat_bands.process_cooling"),
    temperatureLabel: "0…+1°C",
    status: "normal",
    threat: tt$5("demo.meat_bands.fallback_ground_threat"),
    action: tt$5("demo.meat_bands.fallback_ground_action")
  }),
  Object.freeze({
    id: "meat_chilled_2_4",
    processLabel: tt$5("demo.meat_bands.process_cooling"),
    temperatureLabel: "+2…+4°C",
    status: "normal",
    threat: tt$5("demo.meat_bands.fallback_fridge_threat"),
    action: tt$5("demo.meat_bands.fallback_fridge_action")
  }),
  Object.freeze({
    id: "meat_danger_5_8",
    processLabel: tt$5("demo.meat_bands.process_cooling"),
    temperatureLabel: "+5…+8°C",
    status: "warning",
    threat: tt$5("demo.meat_bands.fallback_bacteria_threat"),
    action: tt$5("demo.meat_bands.fallback_bacteria_action")
  }),
  Object.freeze({
    id: "meat_critical_gt_8",
    processLabel: tt$5("demo.meat_bands.process_cooling"),
    temperatureLabel: "> +8°C",
    status: "critical",
    threat: tt$5("demo.meat_bands.fallback_danger_threat"),
    action: tt$5("demo.meat_bands.fallback_danger_action")
  })
]);
const CHILLED_I = Object.freeze({
  gt8: 0,
  open5_8: 1,
  closed2_5: 2,
  closed0_2: 3
});
const FREEZER_I = Object.freeze({
  gtM12: 0,
  m12_m18: 1,
  m25_m18: 2,
  ltM25: 3
});
function pickChilledBand(t) {
  if (t > C.salmonella) {
    return MEAT_STORAGE_CHILLED_BANDS[CHILLED_I.gt8];
  }
  if (t > C.dangerZone && t <= C.salmonella) {
    return MEAT_STORAGE_CHILLED_BANDS[CHILLED_I.open5_8];
  }
  if (t >= C.fridgeMeat && t <= C.dangerZone) {
    return MEAT_STORAGE_CHILLED_BANDS[CHILLED_I.closed2_5];
  }
  if (t >= C.juicesFreeze && t < C.fridgeMeat) {
    return MEAT_STORAGE_CHILLED_BANDS[CHILLED_I.closed0_2];
  }
  return null;
}
function pickFreezerBand(t) {
  if (t > F.surfaceOk) {
    return MEAT_STORAGE_FREEZER_BANDS[FREEZER_I.gtM12];
  }
  if (t >= F.standard && t <= F.surfaceOk) {
    return MEAT_STORAGE_FREEZER_BANDS[FREEZER_I.m12_m18];
  }
  if (t >= F.burn && t < F.standard) {
    return MEAT_STORAGE_FREEZER_BANDS[FREEZER_I.m25_m18];
  }
  if (t < F.burn) {
    return MEAT_STORAGE_FREEZER_BANDS[FREEZER_I.ltM25];
  }
  return null;
}
function normalizeMeatStorageMode(mode) {
  const m = String(mode ?? "").trim().toLowerCase();
  if (m === "freezer" || m === "chilled") {
    return m;
  }
  return null;
}
function taskHasMeatEquipment(taskEquipmentTargetIds) {
  const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
  return ids.some((id) => String(id).startsWith("eq-meat-"));
}
function meatBandMatchesTaskEquipment(band, taskEquipmentTargetIds) {
  var _a2;
  if (!taskHasMeatEquipment(taskEquipmentTargetIds)) {
    return true;
  }
  if (!((_a2 = band == null ? void 0 : band.equipmentTargetIds) == null ? void 0 : _a2.length)) {
    return true;
  }
  const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
  if (!ids.length) {
    return true;
  }
  return band.equipmentTargetIds.some((id) => ids.includes(id));
}
function resolveMeatStorageBand(t, mode) {
  if (!Number.isFinite(t)) {
    return null;
  }
  const m = normalizeMeatStorageMode(mode);
  if (m === "freezer") {
    return pickFreezerBand(t);
  }
  if (m === "chilled") {
    if (t >= C.juicesFreeze) {
      return pickChilledBand(t);
    }
    return pickFreezerBand(t);
  }
  if (t >= C.juicesFreeze) {
    return pickChilledBand(t);
  }
  return pickFreezerBand(t);
}
function resolveMeatRowForTaskMeasurement(t, taskEquipmentTargetIds, mode) {
  if (!Number.isFinite(t)) {
    return null;
  }
  if (taskHasMeatEquipment(taskEquipmentTargetIds)) {
    return resolveMeatStorageBand(t, mode);
  }
  return pickDefaultMeatNoEquipmentBand(t);
}
const BREAD_MODE_INFER_ORDER = Object.freeze([
  "cooling",
  "sponge_mix",
  "proofing",
  "baking"
]);
function inferBreadModeFromCcpRange(tmin, tmax) {
  if (!Number.isFinite(tmin) || !Number.isFinite(tmax) || tmin > tmax) {
    return null;
  }
  let best = null;
  let bestScore = -1;
  let bestRefWidth = Infinity;
  let bestRmin = Infinity;
  for (const mode of BREAD_MODE_INFER_ORDER) {
    const w = getBreadModeCcpWindow(mode);
    if (!w) {
      continue;
    }
    const { min: rmin, max: rmax } = w;
    const lo = Math.max(tmin, rmin);
    const hi = Math.min(tmax, rmax);
    const score = hi >= lo ? hi - lo : -1;
    if (score < 0) {
      continue;
    }
    const refWidth = rmax - rmin;
    if (score > bestScore || score === bestScore && refWidth < bestRefWidth || score === bestScore && refWidth === bestRefWidth && rmin < bestRmin) {
      bestScore = score;
      bestRefWidth = refWidth;
      bestRmin = rmin;
      best = mode;
    }
  }
  return best;
}
function inferBreadModeFromTaskCcp(task) {
  const limits = readTaskTemperatureMinMaxC(task);
  const tmin = limits == null ? void 0 : limits.minC;
  const tmax = limits == null ? void 0 : limits.maxC;
  if (tmin == null || tmax == null || !Number.isFinite(tmin) || !Number.isFinite(tmax)) {
    return null;
  }
  return inferBreadModeFromCcpRange(tmin, tmax);
}
function inferBreadModeFromMeasurementC(t) {
  if (!Number.isFinite(t)) {
    return null;
  }
  return inferBreadModeFromCcpRange(t, t);
}
function resolveTaskNicheForTemperatureAi(task) {
  const niche = String((task == null ? void 0 : task.niche) ?? "").trim();
  if (niche) {
    return niche;
  }
  const id = String((task == null ? void 0 : task.id) ?? "").trim();
  if (id.startsWith("coffee-") || id.startsWith("default-coffee-")) {
    return "coffee";
  }
  if (id.startsWith("bakery-") || id.startsWith("default-bakery-") || id.startsWith("custom-bakery-")) {
    return "bakery";
  }
  if (id.startsWith("meat-") || id.startsWith("default-meat-")) {
    return "meat";
  }
  return null;
}
function mapTaskNicheToAnalyzerNiche(niche) {
  if (niche === "bakery") {
    return "bread";
  }
  if (niche === "coffee" || niche === "meat" || niche === "bread") {
    return niche;
  }
  return null;
}
function resolveTemperatureAiMode(task, analyzerNiche, measurementC) {
  var _a2;
  const explicitMode = String(((_a2 = task == null ? void 0 : task.aiContext) == null ? void 0 : _a2.mode) ?? "").trim();
  if (analyzerNiche === "coffee") {
    if (explicitMode) {
      return explicitMode;
    }
    const targets = Array.isArray(task == null ? void 0 : task.equipmentTargetIds) ? task.equipmentTargetIds : [];
    if (targets.includes("eq-coffee-roaster") || targets.includes("eq-coffee-destoner")) {
      return "roasting";
    }
    if (targets.includes("eq-coffee-bean-cooler") || targets.includes("eq-coffee-shock-cooler")) {
      return "cooling";
    }
    if (targets.includes("eq-coffee-vacuum-containers") || targets.includes("eq-coffee-warehouse-shelving") || targets.includes("eq-coffee-grain-canisters")) {
      return "storage";
    }
    return "storage";
  }
  if (analyzerNiche === "bread") {
    const targets = Array.isArray(task == null ? void 0 : task.equipmentTargetIds) ? task.equipmentTargetIds : [];
    if (targets.includes("eq-bread-spiral-mixer") || targets.includes("eq-bread-preferment-vat")) {
      return "sponge_mix";
    }
    if (targets.includes("eq-bread-proofing-cabinet") || targets.includes("eq-bread-proofing-trays")) {
      return "proofing";
    }
    if (targets.includes("eq-bread-rotary-oven") || targets.includes("eq-bread-crumb-probe")) {
      return "baking";
    }
    if (targets.includes("eq-bread-cooling-conveyor") || targets.includes("eq-bread-ventilated-racks")) {
      return "cooling";
    }
    if (!taskHasBreadEquipment(targets)) {
      const mc2 = measurementC != null && Number.isFinite(Number(measurementC)) ? Number(measurementC) : NaN;
      if (Number.isFinite(mc2)) {
        const fromMeas2 = inferBreadModeFromMeasurementC(mc2);
        if (fromMeas2) {
          return fromMeas2;
        }
      }
      const inferred2 = inferBreadModeFromTaskCcp(task);
      if (inferred2) {
        return inferred2;
      }
      if (explicitMode) {
        return explicitMode;
      }
      return "proofing";
    }
    const inferred = inferBreadModeFromTaskCcp(task);
    if (inferred) {
      return inferred;
    }
    const mc = measurementC != null && Number.isFinite(Number(measurementC)) ? Number(measurementC) : NaN;
    const fromMeas = inferBreadModeFromMeasurementC(mc);
    if (fromMeas) {
      return fromMeas;
    }
    if (explicitMode) {
      return explicitMode;
    }
    return "proofing";
  }
  if (analyzerNiche === "meat") {
    if (explicitMode) {
      return explicitMode;
    }
    const targets = Array.isArray(task == null ? void 0 : task.equipmentTargetIds) ? task.equipmentTargetIds : [];
    const hasChilledEq = targets.some(
      (id) => MEAT_CHILLED_EQUIPMENT_IDS.includes(id)
    );
    const hasFreezerEq = targets.some(
      (id) => MEAT_FREEZER_EQUIPMENT_IDS.includes(id)
    );
    if (hasFreezerEq && !hasChilledEq) {
      return "freezer";
    }
    if (hasChilledEq && !hasFreezerEq) {
      return "chilled";
    }
    if (targets.includes("eq-freezer") || targets.includes("eq-frozen-storage")) {
      return "freezer";
    }
    const mc = measurementC != null && Number.isFinite(Number(measurementC)) ? Number(measurementC) : NaN;
    if (Number.isFinite(mc)) {
      return mc < 0 ? "freezer" : "chilled";
    }
    return "chilled";
  }
  if (explicitMode) {
    return explicitMode;
  }
  return null;
}
const tt$4 = (...args) => i18n.global.t(...args);
const DEFAULT_TASK_ACTIVE_WEEKDAYS = Object.freeze([
  "mon",
  "tue",
  "wed",
  "thu",
  "fri"
]);
const DEFAULT_TASK_REPEAT_TIMES = Object.freeze(["00:00"]);
const ALLOWED_MEASUREMENT_ROW_STATUSES = /* @__PURE__ */ new Set([
  "success",
  "problem",
  "pending"
]);
function normalizeMeasurementRowStatus(raw) {
  const s = typeof raw === "string" ? raw.trim() : "";
  if (ALLOWED_MEASUREMENT_ROW_STATUSES.has(s)) {
    return (
      /** @type {"success"|"problem"|"pending"} */
      s
    );
  }
  return "pending";
}
function normalizeTaskMeasurementRowStatuses(task) {
  if (!(task == null ? void 0 : task.measurements) || !Array.isArray(task.measurements)) {
    return;
  }
  for (const row of task.measurements) {
    if (row && typeof row === "object") {
      row.status = normalizeMeasurementRowStatus(row.status);
    }
  }
}
function isSameNormalizedTemperatureAiContext(current, next) {
  return current.engine === next.engine && current.niche === next.niche && current.mode === next.mode && current.taskType === next.taskType && current.ccpMin === next.ccpMin && current.ccpMax === next.ccpMax && current.ccpLabel === next.ccpLabel && current.updatedAt === next.updatedAt;
}
function normalizeTaskAiFields(task, niche = null) {
  var _a2, _b2;
  if (!task || typeof task !== "object") {
    return;
  }
  if (typeof task.niche !== "string" || !task.niche.trim()) {
    task.niche = typeof niche === "string" && niche.trim() ? niche.trim() : null;
  }
  const fieldType = ((_b2 = (_a2 = task == null ? void 0 : task.taskFieldDefinitions) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.fieldType) ?? null;
  const isTemperatureTask = fieldType === "temperature";
  if (isTemperatureTask) {
    const aiContext = task.aiContext && typeof task.aiContext === "object" ? task.aiContext : {};
    const nextAiContext = {
      ...DEMO_TEMPERATURE_TASK_AI_CONTEXT_SHAPE,
      niche: task.niche ?? null,
      mode: aiContext.mode ?? null,
      ccpMin: typeof aiContext.ccpMin === "number" && Number.isFinite(aiContext.ccpMin) ? aiContext.ccpMin : null,
      ccpMax: typeof aiContext.ccpMax === "number" && Number.isFinite(aiContext.ccpMax) ? aiContext.ccpMax : null,
      ccpLabel: String(aiContext.ccpLabel ?? ""),
      updatedAt: typeof aiContext.updatedAt === "string" && aiContext.updatedAt.trim() ? aiContext.updatedAt : null
    };
    const cur = task.aiContext;
    if (!cur || typeof cur !== "object" || !isSameNormalizedTemperatureAiContext(cur, nextAiContext)) {
      task.aiContext = nextAiContext;
    }
  } else if (task.aiContext != null) {
    task.aiContext = null;
  }
  if (!Array.isArray(task.measurements)) {
    return;
  }
  for (const row of task.measurements) {
    if (!row || typeof row !== "object") {
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(row, "aiWarning")) {
      row.aiWarning = null;
    }
    if (row.aiWarning && typeof row.aiWarning !== "object") {
      row.aiWarning = null;
    }
    if (row.aiWarning && typeof row.aiWarning === "object") {
      const w = row.aiWarning;
      if (Object.prototype.hasOwnProperty.call(w, "severity") && !Object.prototype.hasOwnProperty.call(w, "ai_status")) {
        w.ai_status = w.severity;
        delete w.severity;
      }
      if (Object.prototype.hasOwnProperty.call(w, "status")) {
        delete w.status;
      }
    }
  }
}
function normalizeAllChecklistTaskMeasurementStatuses(checklistsByNiche) {
  if (!checklistsByNiche || typeof checklistsByNiche !== "object") {
    return;
  }
  for (const niche of Object.keys(checklistsByNiche)) {
    const list = checklistsByNiche[niche];
    if (!Array.isArray(list)) {
      continue;
    }
    for (const task of list) {
      normalizeTaskMeasurementRowStatuses(task);
      normalizeTaskAiFields(task, niche);
    }
  }
}
const repeatsPerDayFromMeasurements = (measurements) => {
  const n = Array.isArray(measurements) ? measurements.length : 0;
  return Math.max(1, n);
};
const taskHasMultiSlotSchedule = (task) => {
  var _a2, _b2;
  const m = ((_a2 = task == null ? void 0 : task.measurements) == null ? void 0 : _a2.length) ?? 0;
  const r = ((_b2 = task == null ? void 0 : task.repeatTimes) == null ? void 0 : _b2.length) ?? 0;
  return m > 1 || r > 1;
};
const payloadUsesPresetMeasurementsBranch = (payload) => {
  const m = Array.isArray(payload == null ? void 0 : payload.measurements) ? payload.measurements : [];
  return m.length > 1;
};
const taskDisplayStatusKey = (task) => {
  const multi = taskHasMultiSlotSchedule(task);
  const raw = task == null ? void 0 : task.status;
  if (raw === true || raw === "ok") {
    return multi ? "repeat" : "ok";
  }
  if (raw === false || raw === "repeat" || raw === "problem" || raw === "pending") {
    return multi ? "repeat" : "problem";
  }
  return multi ? "repeat" : "ok";
};
const DEMO_COLD_EQ_VALUE = Object.freeze({
  "eq-freezer": "-19 °C",
  "eq-fridge-1": "4,2 °C",
  "eq-fridge-2": "4,1 °C",
  "eq-cold-storage": "3 °C",
  "eq-cold-display": "5 °C",
  "eq-frozen-storage": "-21 °C"
});
const DEMO_HEAT_PROCESS_EQ = /* @__PURE__ */ new Set([
  "eq-combi-oven",
  "eq-stove",
  "eq-fryer",
  "eq-bain-marie",
  "eq-immersion-circ"
]);
const DEMO_PROBE_EQ = /* @__PURE__ */ new Set(["eq-probe-1", "eq-probe-2"]);
const DEMO_DRY_STORAGE_EQ = /* @__PURE__ */ new Set([
  "eq-dry-goods",
  "eq-transport-box",
  "eq-vacuum-packer"
]);
const DEMO_SURFACE_SANITARY_EQ = /* @__PURE__ */ new Set([
  "eq-countertop",
  "eq-cutting-boards",
  "eq-door-handles",
  "eq-switches",
  "eq-windows",
  "eq-ceiling",
  "eq-floors",
  "eq-tables",
  "eq-toilet"
]);
const inferDefaultOkMeasurementDisplayValue = ({
  equipmentTargetIds = [],
  roomTargetIds = []
}) => {
  const eq = Array.isArray(equipmentTargetIds) ? equipmentTargetIds : [];
  const rooms = Array.isArray(roomTargetIds) ? roomTargetIds : [];
  for (const id of eq) {
    if (DEMO_COLD_EQ_VALUE[id]) {
      return DEMO_COLD_EQ_VALUE[id];
    }
  }
  if (eq.some((id) => DEMO_PROBE_EQ.has(id))) {
    return "72 °C";
  }
  if (eq.some((id) => DEMO_HEAT_PROCESS_EQ.has(id))) {
    return "185 °C";
  }
  if (eq.includes("eq-coffee-roaster")) {
    return "212 °C";
  }
  if (eq.includes("eq-coffee-machine")) {
    return "93 °C";
  }
  if (eq.some((id) => DEMO_DRY_STORAGE_EQ.has(id))) {
    return "21 °C";
  }
  if (eq.some((id) => DEMO_SURFACE_SANITARY_EQ.has(id)) || ["eq-handwash", "eq-sinks", "eq-dishwasher"].some((id) => eq.includes(id))) {
    return tt$4("demo.ok_values.surfaces_normal");
  }
  if (rooms.includes("room-cold-chamber")) {
    return "7 °C";
  }
  if (rooms.includes("room-wash") || rooms.includes("room-wc-staff")) {
    return tt$4("demo.ok_values.on_schedule");
  }
  if (rooms.length > 0 && eq.length === 0) {
    return tt$4("demo.ok_values.compliant");
  }
  return tt$4("demo.ok_values.normal");
};
const toStartOfDayTimestamp = (dateLike = /* @__PURE__ */ new Date()) => {
  const date = new Date(dateLike);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};
const createModalDraft = (_niche, context = {}) => ({
  title: "",
  taskScopeType: TASK_SCOPE_TYPE.EQUIPMENT,
  assignedStaffId: null,
  frequency: FREQUENCY_CODE.CUSTOM,
  startDate: typeof context.startDate === "number" ? context.startDate : toStartOfDayTimestamp(),
  repeatTimes: [...DEFAULT_TASK_REPEAT_TIMES],
  activeWeekdays: [...DEFAULT_TASK_ACTIVE_WEEKDAYS],
  equipmentTargetIds: [],
  roomTargetIds: [],
  taskFieldDefinitions: [],
  correctiveActionRows: [],
  allowAssigneeReportCorrections: true
});
const toTimeString = (minutesTotal) => {
  const hours = Math.floor(minutesTotal / 60);
  const minutes = minutesTotal % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
const buildRepeatTimesByCount = (count) => {
  const n = Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
  return Array.from({ length: n }, (_, idx) => {
    const minutes = Math.floor(1440 * idx / n);
    return toTimeString(minutes);
  });
};
const toIdToken = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const resolveTaskId = ({ niche, payload, source, idFactory, context = {} }) => {
  if (source !== "default") {
    return typeof idFactory === "function" ? idFactory(niche) : `custom-${niche}-${v4()}`;
  }
  const rawId = String((payload == null ? void 0 : payload.id) ?? "").trim();
  if (rawId) {
    return rawId;
  }
  const titleToken = toIdToken(payload == null ? void 0 : payload.title);
  const fallbackToken = titleToken || "task";
  const indexSuffix = Number.isInteger(context.index) ? `-${context.index + 1}` : "";
  return `default-${niche}-${fallbackToken}${indexSuffix}`;
};
const resolveTaskTitle = ({ payload, source, context = {} }) => {
  const directTitle = String((payload == null ? void 0 : payload.title) ?? "").trim();
  if (directTitle) {
    return directTitle;
  }
  if (source !== "default") {
    return "";
  }
  const fallbackValue = String((payload == null ? void 0 : payload.value) ?? "").trim();
  if (fallbackValue) {
    return tt$4("demo.task_title.task_prefix", { value: fallbackValue });
  }
  const indexSuffix = Number.isInteger(context.index) ? ` #${context.index + 1}` : "";
  return tt$4("demo.task_title.default_task", { suffix: indexSuffix });
};
const firstPendingMeasurement = (task) => {
  const list = Array.isArray(task == null ? void 0 : task.measurements) ? task.measurements : [];
  const pend = list.find((m) => (m == null ? void 0 : m.status) === "pending");
  return pend ?? null;
};
const firstPendingMeasurementTime = (task) => {
  const pend = firstPendingMeasurement(task);
  const t = pend == null ? void 0 : pend.time;
  return typeof t === "string" && t.trim() ? t.trim() : "";
};
const resolveTaskAggregateOk = ({ payload, source }) => {
  const raw = payload == null ? void 0 : payload.status;
  if (raw === true) {
    return true;
  }
  if (raw === false) {
    return false;
  }
  if (raw === "ok") {
    return true;
  }
  if (raw === "repeat" || raw === "problem" || raw === "pending") {
    return false;
  }
  if (source === "default") {
    return true;
  }
  return true;
};
const resolveTaskIsCustom = ({ source }) => source !== "default";
const resolveTaskScopeType = ({ payload }) => normalizeTaskScopeType(payload == null ? void 0 : payload.taskScopeType);
const resolveTaskAssignedStaffId = ({ payload }) => {
  const raw = payload == null ? void 0 : payload.assignedStaffId;
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
};
const resolveTaskFrequency = ({ payload }) => normalizeFrequency(payload == null ? void 0 : payload.frequency);
const resolveTaskStartDate = ({ payload }) => {
  const raw = payload == null ? void 0 : payload.startDate;
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
};
const resolveTaskRepeatTimes = ({ payload, slotCount }) => {
  const n = Number.isFinite(slotCount) ? Math.max(1, Math.trunc(slotCount)) : 1;
  const prepared = (Array.isArray(payload == null ? void 0 : payload.repeatTimes) ? payload.repeatTimes : []).map((time) => String(time ?? "").trim()).filter((time) => /^\d{2}:\d{2}$/.test(time)).slice(0, n);
  const generated = buildRepeatTimesByCount(n);
  while (prepared.length < n) {
    prepared.push(generated[prepared.length]);
  }
  return prepared;
};
const resolveTaskActiveWeekdays = ({ payload }) => {
  const raw = Array.isArray(payload == null ? void 0 : payload.activeWeekdays) ? payload.activeWeekdays : [];
  const filtered = raw.filter(
    (value) => ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(value)
  );
  return filtered.length ? Array.from(new Set(filtered)) : [...DEFAULT_TASK_ACTIVE_WEEKDAYS];
};
const resolveTaskAllowAssigneeReportCorrections = ({ payload }) => Boolean(payload == null ? void 0 : payload.allowAssigneeReportCorrections);
const resolveTaskFieldDefinitions = ({ payload }) => normalizeTaskFieldDefinitions(payload == null ? void 0 : payload.taskFieldDefinitions);
const readTemperatureFieldFromDefinitions = (taskFieldDefinitions) => {
  const defs = Array.isArray(taskFieldDefinitions) ? taskFieldDefinitions : [];
  return defs.find((def) => (def == null ? void 0 : def.fieldType) === "temperature") ?? null;
};
const readTemperatureLimitsFromDefinitions = (taskFieldDefinitions) => {
  const temperatureDef = readTemperatureFieldFromDefinitions(taskFieldDefinitions);
  if (!temperatureDef) {
    return {
      ccpMin: null,
      ccpMax: null,
      ccpLabel: "",
      taskType: null
    };
  }
  const config = temperatureDef.config && typeof temperatureDef.config === "object" ? temperatureDef.config : {};
  const minRaw = Number(config.minC);
  const maxRaw = Number(config.maxC);
  let ccpMin = Number.isFinite(minRaw) ? minRaw : null;
  let ccpMax = Number.isFinite(maxRaw) ? maxRaw : null;
  if (ccpMin != null && ccpMax != null && ccpMin > ccpMax) {
    const swap = ccpMin;
    ccpMin = ccpMax;
    ccpMax = swap;
  }
  const ccpLabel = ccpMin != null && ccpMax != null ? `${ccpMin}..${ccpMax}°C` : "";
  return {
    ccpMin,
    ccpMax,
    ccpLabel,
    taskType: "temperature"
  };
};
const readTaskTemperatureMinMaxC = (task) => {
  const limits = readTemperatureLimitsFromDefinitions((task == null ? void 0 : task.taskFieldDefinitions) ?? []);
  if (limits.taskType !== "temperature") {
    return null;
  }
  return {
    minC: limits.ccpMin,
    maxC: limits.ccpMax,
    ccpLabel: limits.ccpLabel
  };
};
const parseMeasurementTemperatureCAndSyncRowStatusToCcp = (task, row) => {
  if (!task || !row || typeof row !== "object") {
    return null;
  }
  const limits = readTaskTemperatureMinMaxC(task);
  if (!limits) {
    return null;
  }
  const current = parseTemperatureFromMeasurementValue(row.value);
  if (current == null) {
    return null;
  }
  const minC = limits.minC;
  const maxC = limits.maxC;
  const withinMin = minC == null ? true : current >= minC;
  const withinMax = maxC == null ? true : current <= maxC;
  const inRange = withinMin && withinMax;
  let statusOk = inRange;
  const taskNiche = resolveTaskNicheForTemperatureAi(task);
  const analyzerNiche = mapTaskNicheToAnalyzerNiche(taskNiche);
  if (analyzerNiche === "bread") {
    const mode = resolveTemperatureAiMode(task, analyzerNiche, current);
    const band = resolveBreadRowForTaskMeasurement(
      current,
      task == null ? void 0 : task.equipmentTargetIds,
      mode
    );
    if (band) {
      statusOk = band.status === "normal";
    }
  }
  if (analyzerNiche === "meat") {
    const mode = resolveTemperatureAiMode(task, analyzerNiche, current);
    const band = resolveMeatRowForTaskMeasurement(
      current,
      task == null ? void 0 : task.equipmentTargetIds,
      mode
    );
    if (band) {
      statusOk = band.status === "normal";
    }
  }
  if (analyzerNiche === "coffee") {
    const mode = resolveTemperatureAiMode(task, analyzerNiche, current);
    const band = resolveCoffeeRowForTaskMeasurement(
      current,
      task == null ? void 0 : task.equipmentTargetIds,
      mode
    );
    if (band) {
      statusOk = band.status === "normal";
    }
  }
  row.status = statusOk ? "success" : "problem";
  return current;
};
const buildTaskAiContext = ({ niche, taskFieldDefinitions }) => {
  const limits = readTemperatureLimitsFromDefinitions(taskFieldDefinitions);
  if (limits.taskType !== "temperature") {
    return null;
  }
  return {
    ...DEMO_TEMPERATURE_TASK_AI_CONTEXT_SHAPE,
    niche: niche ?? null,
    mode: null,
    taskType: limits.taskType,
    ccpMin: limits.ccpMin,
    ccpMax: limits.ccpMax,
    ccpLabel: limits.ccpLabel,
    updatedAt: null
  };
};
const resolveTaskEquipmentTargetIds = ({ payload, taskScopeType }) => {
  if (taskScopeType !== TASK_SCOPE_TYPE.EQUIPMENT) {
    return null;
  }
  return normalizeEquipmentTargetIds(payload == null ? void 0 : payload.equipmentTargetIds);
};
const resolveTaskRoomTargetIds = ({ payload, taskScopeType }) => {
  if (taskScopeType !== TASK_SCOPE_TYPE.ROOMS) {
    return null;
  }
  return normalizeRoomTargetIds(payload == null ? void 0 : payload.roomTargetIds);
};
const resolveTaskScope = ({ taskScopeType }) => taskScopeType === TASK_SCOPE_TYPE.STANDALONE ? "standalone" : null;
const readPresetMeasurementsPayload = (payload) => Array.isArray(payload == null ? void 0 : payload.measurements) ? payload.measurements : [];
const REPEAT_MEASUREMENT_TIME_RE = /^\d{2}:\d{2}$/;
const buildDefaultNonRepeatMeasurementsFromRepeatTimes = (repeatTimes, aggregateOk, measurementHintCtx) => {
  const list = Array.isArray(repeatTimes) ? repeatTimes : [];
  const slotStatus = aggregateOk ? "success" : "problem";
  const value = aggregateOk ? inferDefaultOkMeasurementDisplayValue(measurementHintCtx) : "-";
  return list.map((time) => ({
    time: String(time ?? "").trim() || "00:00",
    value,
    status: slotStatus,
    aiWarning: null
  }));
};
const buildCustomPendingMeasurementsFromRepeatTimes = (repeatTimes, measurementHintCtx) => {
  const list = Array.isArray(repeatTimes) ? repeatTimes : [];
  const value = "-";
  return list.map((time) => ({
    time: String(time ?? "").trim() || "00:00",
    value,
    status: "pending",
    aiWarning: null
  }));
};
const resolveTaskCorrectiveActions = ({ payload, usePresetMeasurements }) => {
  const raw = Array.isArray(payload == null ? void 0 : payload.correctiveActions) ? payload.correctiveActions : [];
  const list = raw.map((item) => String(item ?? "").trim()).filter(Boolean);
  if (usePresetMeasurements) {
    return list;
  }
  return list.length > 0 ? list : null;
};
const normalizeModalDraft = (draft = {}) => {
  const taskScopeType = normalizeTaskScopeType(draft.taskScopeType);
  const frequency = normalizeFrequency(draft.frequency);
  const legacyRepeats = Number(draft.repeatsPerDay);
  const legacySlots = Number.isFinite(legacyRepeats) && legacyRepeats >= 1 ? Math.trunc(legacyRepeats) : null;
  let repeatTimes = (Array.isArray(draft.repeatTimes) ? draft.repeatTimes : []).map((time) => String(time ?? "").trim()).filter((time) => /^\d{2}:\d{2}$/.test(time));
  const slotCount = Math.max(
    1,
    repeatTimes.length,
    legacySlots ?? 0
  );
  const generatedRepeatTimes = buildRepeatTimesByCount(slotCount);
  while (repeatTimes.length < slotCount) {
    repeatTimes.push(generatedRepeatTimes[repeatTimes.length]);
  }
  const activeWeekdaysRaw = Array.isArray(draft.activeWeekdays) ? draft.activeWeekdays : [];
  const activeWeekdays = activeWeekdaysRaw.filter(
    (value) => ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(value)
  );
  const uniqueWeekdays = activeWeekdays.length ? Array.from(new Set(activeWeekdays)) : [...DEFAULT_TASK_ACTIVE_WEEKDAYS];
  const correctiveActionsFromRows = Array.isArray(draft.correctiveActionRows) ? draft.correctiveActionRows.map((row) => String((row == null ? void 0 : row.text) ?? "").trim()).filter(Boolean) : [];
  const correctiveActionsFromPayload = Array.isArray(draft.correctiveActions) ? draft.correctiveActions.map((item) => String(item ?? "").trim()).filter(Boolean) : [];
  const correctiveActions = correctiveActionsFromRows.length ? correctiveActionsFromRows : correctiveActionsFromPayload;
  return {
    title: String(draft.title ?? ""),
    taskScopeType,
    assignedStaffId: typeof draft.assignedStaffId === "string" && draft.assignedStaffId.trim() ? draft.assignedStaffId.trim() : null,
    frequency,
    startDate: typeof draft.startDate === "number" && Number.isFinite(draft.startDate) ? draft.startDate : null,
    repeatTimes,
    activeWeekdays: uniqueWeekdays,
    equipmentTargetIds: normalizeEquipmentTargetIds(draft.equipmentTargetIds),
    roomTargetIds: normalizeRoomTargetIds(draft.roomTargetIds),
    taskFieldDefinitions: normalizeTaskFieldDefinitions(
      draft.taskFieldDefinitions
    ),
    allowAssigneeReportCorrections: Boolean(
      draft.allowAssigneeReportCorrections
    ),
    correctiveActions
  };
};
const buildTaskPayloadFromDraft = (draft = {}) => {
  const normalized = normalizeModalDraft(draft);
  return {
    title: normalized.title,
    taskScopeType: normalized.taskScopeType,
    assignedStaffId: normalized.assignedStaffId,
    frequency: normalized.frequency,
    startDate: normalized.startDate,
    repeatTimes: normalized.repeatTimes,
    activeWeekdays: normalized.activeWeekdays,
    equipmentTargetIds: normalized.equipmentTargetIds,
    roomTargetIds: normalized.roomTargetIds,
    taskFieldDefinitions: normalized.taskFieldDefinitions,
    allowAssigneeReportCorrections: normalized.allowAssigneeReportCorrections,
    correctiveActions: normalized.correctiveActions
  };
};
const buildTaskFromPayload = ({
  niche,
  payload = {},
  source = "custom",
  idFactory,
  context = {}
}) => {
  const normalized = normalizeModalDraft(payload);
  const taskScopeType = resolveTaskScopeType({ payload: normalized });
  const title = resolveTaskTitle({ payload: normalized, source, context });
  if (!title) {
    return null;
  }
  const aggregateOk = resolveTaskAggregateOk({ payload, source });
  const usePresetMeasurements = payloadUsesPresetMeasurementsBranch(payload);
  let repeatTimes;
  let repeatMeasurements = null;
  if (usePresetMeasurements) {
    repeatMeasurements = readPresetMeasurementsPayload(payload);
    const slotCount = repeatsPerDayFromMeasurements(repeatMeasurements);
    const timesFromM = repeatMeasurements.map(
      (m) => String((m == null ? void 0 : m.time) ?? "").trim()
    );
    const allValid = repeatMeasurements.length > 0 && timesFromM.length === repeatMeasurements.length && timesFromM.every((t) => REPEAT_MEASUREMENT_TIME_RE.test(t));
    repeatTimes = allValid ? timesFromM : resolveTaskRepeatTimes({ payload: normalized, slotCount });
  } else {
    repeatTimes = normalized.repeatTimes;
  }
  const activeWeekdays = resolveTaskActiveWeekdays({ payload: normalized });
  const equipmentTargetIds = resolveTaskEquipmentTargetIds({
    payload: normalized,
    taskScopeType
  });
  const roomTargetIds = resolveTaskRoomTargetIds({
    payload: normalized,
    taskScopeType
  });
  const id = resolveTaskId({
    niche,
    payload,
    source,
    idFactory,
    context
  });
  if (!id) {
    return null;
  }
  const base = {
    id,
    niche,
    title,
    status: aggregateOk,
    isCustom: resolveTaskIsCustom({ source }),
    taskScopeType,
    assignedStaffId: resolveTaskAssignedStaffId({ payload: normalized }),
    frequency: resolveTaskFrequency({ payload: normalized }),
    taskFieldDefinitions: resolveTaskFieldDefinitions({
      payload: normalized
    }),
    startDate: resolveTaskStartDate({ payload: normalized }),
    repeatTimes,
    activeWeekdays,
    allowAssigneeReportCorrections: resolveTaskAllowAssigneeReportCorrections({ payload: normalized })
  };
  const aiContext = buildTaskAiContext({
    niche,
    taskFieldDefinitions: base.taskFieldDefinitions
  });
  if (aiContext) {
    base.aiContext = aiContext;
  }
  if (equipmentTargetIds) {
    base.equipmentTargetIds = equipmentTargetIds;
  }
  if (roomTargetIds) {
    base.roomTargetIds = roomTargetIds;
  }
  const scope = resolveTaskScope({ taskScopeType });
  if (scope) {
    base.scope = scope;
  }
  if (usePresetMeasurements) {
    const correctiveActions = resolveTaskCorrectiveActions({
      payload: normalized,
      usePresetMeasurements: true
    });
    return {
      ...base,
      measurements: (repeatMeasurements ?? []).map((m) => ({
        ...m,
        aiWarning: null
      })),
      correctiveActions: correctiveActions ?? []
    };
  }
  const correctiveActionsOk = resolveTaskCorrectiveActions({
    payload: normalized,
    usePresetMeasurements: false
  });
  if (correctiveActionsOk && correctiveActionsOk.length > 0) {
    base.correctiveActions = correctiveActionsOk;
  }
  const measurementHintCtx = {
    equipmentTargetIds: normalized.equipmentTargetIds,
    roomTargetIds: normalized.roomTargetIds
  };
  if (source === "default") {
    base.measurements = buildDefaultNonRepeatMeasurementsFromRepeatTimes(
      repeatTimes,
      aggregateOk,
      measurementHintCtx
    );
  } else if (source === "custom") {
    base.measurements = buildCustomPendingMeasurementsFromRepeatTimes(
      repeatTimes
    );
  }
  return base;
};
const deriveDefaultRepeatScheduleFromMeasurements = (measurements) => {
  if (!Array.isArray(measurements) || measurements.length === 0) {
    return null;
  }
  const repeatTimes = measurements.map((m) => String((m == null ? void 0 : m.time) ?? "").trim());
  if (!repeatTimes.every((t) => REPEAT_MEASUREMENT_TIME_RE.test(t))) {
    return null;
  }
  return {
    repeatTimes: [...repeatTimes]
  };
};
const inferDefaultEquipmentTargetIdsForTask = (title, niche) => {
  if (niche === "coffee") {
    return ["eq-coffee-machine"];
  }
  if (niche === "bakery") {
    return ["eq-bread-proofing-cabinet"];
  }
  if (niche === "meat") {
    return ["eq-fridge-1"];
  }
  return [];
};
const buildDefaultTask = (baseTask, niche, context = {}) => {
  const fallbackScopeByNiche = {
    coffee: TASK_SCOPE_TYPE.EQUIPMENT,
    bakery: TASK_SCOPE_TYPE.ROOMS,
    meat: TASK_SCOPE_TYPE.STANDALONE
  };
  const taskScopeType = normalizeTaskScopeType(
    baseTask.taskScopeType ?? fallbackScopeByNiche[niche] ?? TASK_SCOPE_TYPE.STANDALONE
  );
  const equipmentTargetIdsBase = Array.isArray(baseTask.equipmentTargetIds) ? baseTask.equipmentTargetIds : [];
  const equipmentTargetIds = taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT && equipmentTargetIdsBase.length === 0 ? inferDefaultEquipmentTargetIdsForTask(baseTask.title, niche) : equipmentTargetIdsBase;
  const roomTargetIds = Array.isArray(baseTask.roomTargetIds) ? baseTask.roomTargetIds : [];
  const repeatFromMeasurements = payloadUsesPresetMeasurementsBranch(baseTask) ? deriveDefaultRepeatScheduleFromMeasurements(baseTask.measurements) : null;
  const repeatTimes = repeatFromMeasurements ? repeatFromMeasurements.repeatTimes : [...DEFAULT_TASK_REPEAT_TIMES];
  return buildTaskFromPayload({
    niche,
    source: "default",
    context,
    payload: {
      ...baseTask,
      taskScopeType,
      frequency: FREQUENCY_CODE.CUSTOM,
      startDate: typeof context.startDate === "number" ? context.startDate : toStartOfDayTimestamp(),
      repeatTimes,
      activeWeekdays: [...DEFAULT_TASK_ACTIVE_WEEKDAYS],
      taskFieldDefinitions: Array.isArray(baseTask.taskFieldDefinitions) ? baseTask.taskFieldDefinitions : [],
      equipmentTargetIds,
      roomTargetIds,
      allowAssigneeReportCorrections: true
    }
  });
};
const buildChecklistTaskFromPayload = (niche, payload) => buildTaskFromPayload({
  niche,
  payload,
  source: "custom",
  idFactory: (targetNiche) => `custom-${targetNiche}-${v4()}`
});
const tt$3 = (...args) => i18n.global.t(...args);
const DEMO_STATE_SCHEMA_VERSION = 12;
const DEFAULT_SITES = [
  {
    id: "site-coffee",
    name: "Grain & Fire Roastery",
    address: "Roasters' Quay 14, 1012 AB Amsterdam, Netherlands"
  },
  {
    id: "site-bakery",
    name: "Piotr Bakery",
    address: "Chlebna 12, 00-001 Warsaw, Poland"
  },
  {
    id: "site-meat",
    name: "Columbus Meat Processing",
    address: "2450 Industrial Blvd, Suite 300, Columbus, OH 43215, USA"
  }
];
const DEFAULT_STAFF = [
  {
    id: "staff-coffee-1",
    siteId: "site-coffee",
    fullName: "Morgan James",
    role: tt$3("demo.staff_roles.senior_roaster"),
    phone: "+31 20 555 0101",
    email: "j.morgan@demo.local",
    active: true
  },
  {
    id: "staff-coffee-2",
    siteId: "site-coffee",
    fullName: "Richardson Emma",
    role: tt$3("demo.staff_roles.food_technologist"),
    phone: "+31 20 555 0102",
    email: "e.richardson@demo.local",
    active: true
  },
  {
    id: "staff-coffee-3",
    siteId: "site-coffee",
    fullName: "O'Brien Michael",
    role: tt$3("demo.staff_roles.warehouse_keeper"),
    phone: "+31 20 555 0103",
    email: "m.obrien@demo.local",
    active: true
  },
  {
    id: "staff-bakery-1",
    siteId: "site-bakery",
    fullName: "Laurent Sophie",
    role: tt$3("demo.staff_roles.bakery_technologist"),
    phone: "+48 22 555 0101",
    email: "s.laurent@demo.local",
    active: true
  },
  {
    id: "staff-bakery-2",
    siteId: "site-bakery",
    fullName: "Keller Thomas",
    role: tt$3("demo.staff_roles.baker_6th_grade"),
    phone: "+48 22 555 0102",
    email: "t.keller@demo.local",
    active: true
  },
  {
    id: "staff-bakery-3",
    siteId: "site-bakery",
    fullName: "Kowalska Anna",
    role: tt$3("demo.staff_roles.shift_supervisor"),
    phone: "+48 22 555 0103",
    email: "a.kowalska@demo.local",
    active: true
  },
  {
    id: "staff-meat-1",
    siteId: "site-meat",
    fullName: "Hayes David",
    role: tt$3("demo.staff_roles.meat_shop_foreman"),
    phone: "+1 614 555 0101",
    email: "d.hayes@demo.local",
    active: true
  },
  {
    id: "staff-meat-2",
    siteId: "site-meat",
    fullName: "Walsh Jennifer",
    role: tt$3("demo.staff_roles.cold_chain_specialist"),
    phone: "+1 614 555 0102",
    email: "j.walsh@demo.local",
    active: true
  },
  {
    id: "staff-meat-3",
    siteId: "site-meat",
    fullName: "Chen Robert",
    role: tt$3("demo.staff_roles.qc_inspector"),
    phone: "+1 614 555 0103",
    email: "r.chen@demo.local",
    active: true
  }
];
const DEMO_SITE_EMOJI = Object.freeze({
  "site-coffee": "☕",
  "site-bakery": "🥐",
  "site-meat": "🥩"
});
function siteEmojiForDemo(siteId) {
  return DEMO_SITE_EMOJI[siteId] ?? "";
}
const DEFAULT_TASK_ASSIGNEE_IDS = {
  "coffee-1": "staff-coffee-1",
  "coffee-2": "staff-coffee-1",
  "coffee-3": "staff-coffee-3",
  "coffee-4": "staff-coffee-2",
  "coffee-5": "staff-coffee-2",
  "bakery-1": "staff-bakery-2",
  "bakery-2": "staff-bakery-2",
  "bakery-3": "staff-bakery-3",
  "bakery-4": "staff-bakery-1",
  "bakery-5": "staff-bakery-1",
  "meat-1": "staff-meat-2",
  "meat-2": "staff-meat-3",
  "meat-3": "staff-meat-2",
  "meat-4": "staff-meat-3",
  "meat-5": "staff-meat-1"
};
const tt$2 = (...args) => i18n.global.t(...args);
const origin$1 = typeof window !== "undefined" && ((_a = window.location) == null ? void 0 : _a.origin) ? window.location.origin : "https://haccpilot.eu";
const formatDateToRu$1 = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
const getTodayDateRu = () => formatDateToRu$1(/* @__PURE__ */ new Date());
const buildBatchPublicUrl = (batchId, locale2 = null) => {
  if (!batchId) {
    return origin$1;
  }
  if (locale2 && typeof locale2 === "string") {
    return `${origin$1}/${locale2}/batch/${batchId}`;
  }
  return `${origin$1}/batch/${batchId}`;
};
function resolveDemoLocaleForBatchUrls() {
  var _a2;
  if (typeof window === "undefined") {
    return "en";
  }
  const fromApp = (_a2 = document.getElementById("app")) == null ? void 0 : _a2.getAttribute("data-locale");
  if (typeof fromApp === "string" && fromApp.length) {
    return fromApp.toLowerCase();
  }
  if (typeof window.locale === "string" && window.locale.length) {
    return window.locale;
  }
  return "en";
}
const DEMO_LIST_META = {
  AB123: {
    productShort: tt$2("demo.batch_products.meat"),
    listDate: "21.03.2026",
    supplierShort: "Forest Meats"
  },
  CF762: {
    productShort: tt$2("demo.batch_products.coffee"),
    listDate: "21.03.2026",
    supplierShort: "Roast Trade"
  },
  BR041: {
    productShort: tt$2("demo.batch_products.flour"),
    listDate: "21.03.2026",
    supplierShort: "Bread Supply"
  }
};
function buildBatchRecord(id) {
  const builders = {
    AB123: () => ({
      id: "AB123",
      ddsReference: "EU-EUDR-DDS-2026-AB123-01",
      status: "ok",
      statusLabel: tt$2("batch.status_labels.satisfactory"),
      statusDetail: tt$2("batch.records.AB123.status_detail"),
      operator: {
        name: tt$2("batch.records.AB123.operator_name"),
        address: tt$2("batch.records.AB123.operator_address"),
        role: tt$2("batch.records.AB123.operator_role"),
        eori: "PL1234567890000"
      },
      product: {
        name: tt$2("batch.records.AB123.product_name"),
        cnCode: "0201 30 00",
        category: tt$2("batch.records.AB123.product_category"),
        quantity: tt$2("batch.records.AB123.product_quantity"),
        lot: "AB123-L1"
      },
      plot: {
        country: tt$2("batch.records.AB123.plot_country"),
        region: tt$2("batch.records.AB123.plot_region"),
        geo: tt$2("batch.records.AB123.plot_geo")
      },
      harvestPeriod: tt$2("batch.records.AB123.harvest_period"),
      supplierChain: [
        {
          role: tt$2("batch.roles.producer"),
          name: tt$2("batch.records.AB123.chain_producer_name"),
          country: tt$2("batch.records.AB123.chain_producer_country"),
          ref: "FM-BR-7788"
        },
        {
          role: tt$2("batch.roles.exporter"),
          name: tt$2("batch.records.AB123.chain_exporter_name"),
          country: tt$2("batch.records.AB123.chain_exporter_country"),
          ref: "STL-BR-221"
        },
        {
          role: tt$2("batch.roles.importer_eu"),
          name: tt$2("batch.records.AB123.chain_importer_name"),
          country: tt$2("batch.records.AB123.chain_importer_country"),
          ref: "NCC-SE-09"
        },
        {
          role: tt$2("batch.roles.operator_eu"),
          name: tt$2("batch.records.AB123.chain_operator_name"),
          country: tt$2("batch.records.AB123.chain_operator_country"),
          ref: "PB-PL-01"
        }
      ],
      evidence: [
        { label: tt$2("batch.evidence_labels.supplier_declarations"), ref: "DECL-AB123-2026-03" },
        { label: tt$2("batch.evidence_labels.traceability"), ref: "TB-AB123-2026-02" },
        { label: tt$2("batch.evidence_labels.risk_assessment"), ref: "RA-AB123-2026-01" }
      ],
      generatedAt: "21.03.2026",
      documentVersion: tt$2("batch.common.document_version_1"),
      disclaimer: tt$2("batch.common.disclaimer_full")
    }),
    CF762: () => ({
      id: "CF762",
      ddsReference: "EU-EUDR-DDS-2026-CF762-PEND",
      status: "review",
      statusLabel: tt$2("batch.status_labels.verification"),
      statusDetail: tt$2("batch.records.CF762.status_detail"),
      operator: {
        name: tt$2("batch.records.CF762.operator_name"),
        address: tt$2("batch.records.CF762.operator_address"),
        role: tt$2("batch.records.CF762.operator_role"),
        eori: "NL9876543210001"
      },
      product: {
        name: tt$2("batch.records.CF762.product_name"),
        cnCode: "0901 11 00",
        category: tt$2("batch.records.CF762.product_category"),
        quantity: tt$2("batch.records.CF762.product_quantity"),
        lot: "CF762-R5"
      },
      plot: {
        country: tt$2("batch.records.CF762.plot_country"),
        region: tt$2("batch.records.CF762.plot_region"),
        geo: tt$2("batch.records.CF762.plot_geo")
      },
      harvestPeriod: tt$2("batch.records.CF762.harvest_period"),
      supplierChain: [
        {
          role: tt$2("batch.roles.cooperative"),
          name: tt$2("batch.records.CF762.chain_cooperative_name"),
          country: tt$2("batch.records.CF762.chain_cooperative_country"),
          ref: "RTO-CO-441"
        },
        {
          role: tt$2("batch.roles.exporter"),
          name: tt$2("batch.records.CF762.chain_exporter_name"),
          country: tt$2("batch.records.CF762.chain_exporter_country"),
          ref: "PGCE-CO-12"
        },
        {
          role: tt$2("batch.roles.operator_eu"),
          name: tt$2("batch.records.CF762.chain_operator_name"),
          country: tt$2("batch.records.CF762.chain_operator_country"),
          ref: "RTE-NL-02"
        }
      ],
      evidence: [
        { label: tt$2("batch.evidence_labels.initial_supplier_declaration"), ref: "DECL-CF762-2026-01" },
        { label: tt$2("batch.evidence_labels.verification_queue"), ref: "VQ-CF762-OPEN" }
      ],
      generatedAt: "15.03.2026",
      documentVersion: tt$2("batch.common.document_version_draft"),
      disclaimer: tt$2("batch.common.disclaimer_short")
    }),
    BR041: () => ({
      id: "BR041",
      ddsReference: "EU-EUDR-DDS-2026-BR041-01",
      status: "ok",
      statusLabel: tt$2("batch.status_labels.satisfactory"),
      statusDetail: tt$2("batch.records.BR041.status_detail"),
      operator: {
        name: tt$2("batch.records.BR041.operator_name"),
        address: tt$2("batch.records.BR041.operator_address"),
        role: tt$2("batch.records.BR041.operator_role"),
        eori: "PL1234567890000"
      },
      product: {
        name: tt$2("batch.records.BR041.product_name"),
        cnCode: "1101 00 15",
        category: tt$2("batch.records.BR041.product_category"),
        quantity: tt$2("batch.records.BR041.product_quantity"),
        lot: "BR041-F9"
      },
      plot: {
        country: tt$2("batch.records.BR041.plot_country"),
        region: tt$2("batch.records.BR041.plot_region"),
        geo: tt$2("batch.records.BR041.plot_geo")
      },
      harvestPeriod: tt$2("batch.records.BR041.harvest_period"),
      supplierChain: [
        {
          role: tt$2("batch.roles.miller"),
          name: tt$2("batch.records.BR041.chain_miller_name"),
          country: tt$2("batch.records.BR041.chain_miller_country"),
          ref: "BS-PL-303"
        },
        {
          role: tt$2("batch.roles.operator_eu"),
          name: tt$2("batch.records.BR041.chain_operator_name"),
          country: tt$2("batch.records.BR041.chain_operator_country"),
          ref: "PB-PL-01"
        }
      ],
      evidence: [
        { label: tt$2("batch.evidence_labels.supplier_declarations"), ref: "DECL-BR041-2026-01" },
        { label: tt$2("batch.evidence_labels.mass_balance"), ref: "MB-BR041-2026-01" }
      ],
      generatedAt: "15.03.2026",
      documentVersion: tt$2("batch.common.document_version_1"),
      disclaimer: tt$2("batch.common.disclaimer_short")
    })
  };
  return builders[id] ? builders[id]() : null;
}
const BATCH_IDS = ["AB123", "CF762", "BR041"];
const getBatchPublicRecord = (batchId) => {
  if (!batchId || typeof batchId !== "string") {
    return null;
  }
  const row = buildBatchRecord(batchId);
  if (!row) {
    return null;
  }
  return {
    ...row,
    generatedAt: getTodayDateRu()
  };
};
const buildDemoBatches = () => BATCH_IDS.map((id) => {
  var _a2;
  const r = buildBatchRecord(id);
  const meta = DEMO_LIST_META[id] ?? {};
  const loc = resolveDemoLocaleForBatchUrls();
  return {
    id: r.id,
    product: meta.productShort ?? r.product.name.split("(")[0].trim(),
    supplier: meta.supplierShort ?? ((_a2 = r.supplierChain[0]) == null ? void 0 : _a2.name) ?? "—",
    date: getTodayDateRu(),
    status: r.status,
    statusLabel: r.statusLabel,
    url: buildBatchPublicUrl(id, loc)
  };
});
const NICHE_TO_SITE_ID = {
  coffee: "site-coffee",
  bakery: "site-bakery",
  meat: "site-meat"
};
const resolveAssigneeIdForNiche = (staff, niche, staffId) => {
  if (!Array.isArray(staff)) {
    return null;
  }
  const sid = staffId == null ? "" : String(staffId).trim();
  if (!sid) {
    return null;
  }
  const siteId = NICHE_TO_SITE_ID[niche];
  if (!siteId) {
    return null;
  }
  const m = staff.find(
    (s) => s && s.id === sid && s.siteId === siteId && s.active !== false
  );
  return m ? m.id : null;
};
const resolveStaffFullName = (staff, staffId) => {
  if (!staffId || !Array.isArray(staff)) {
    return "—";
  }
  const m = staff.find((s) => s && s.id === staffId);
  if (typeof (m == null ? void 0 : m.fullName) === "string" && m.fullName.trim()) {
    return m.fullName.trim();
  }
  return "—";
};
const applyDefaultAssigneesToChecklists = (checklistsByNiche, taskIdToStaffId = DEFAULT_TASK_ASSIGNEE_IDS) => {
  return Object.fromEntries(
    Object.entries(checklistsByNiche).map(([niche, tasks]) => [
      niche,
      tasks.map((task) => ({
        ...task,
        assignedStaffId: taskIdToStaffId[task.id] ?? null
      }))
    ])
  );
};
const clearAssigneeInChecklists = (checklistsByNiche, removedStaffId) => {
  return Object.fromEntries(
    Object.entries(checklistsByNiche).map(([niche, tasks]) => [
      niche,
      tasks.map((task) => {
        if (!task || typeof task !== "object") {
          return task;
        }
        if (task.assignedStaffId === removedStaffId) {
          return { ...task, assignedStaffId: null };
        }
        return task;
      })
    ])
  );
};
const tt$1 = (...args) => i18n.global.t(...args);
const pendingSlot = (time) => ({
  time,
  value: "-",
  status: "pending"
});
const REPEAT_MEASUREMENTS_BY_TASK_ID = {
  "coffee-1": [pendingSlot("09:00"), pendingSlot("15:00")],
  "coffee-2": [
    pendingSlot("00:00"),
    pendingSlot("06:00"),
    pendingSlot("12:00"),
    pendingSlot("18:00")
  ],
  "coffee-3": [pendingSlot("09:00"), pendingSlot("15:00")],
  "coffee-4": [pendingSlot("10:00"), pendingSlot("16:00")],
  "bakery-3": [
    pendingSlot("00:00"),
    pendingSlot("08:00"),
    pendingSlot("12:00"),
    pendingSlot("16:00")
  ],
  "bakery-4": [pendingSlot("09:00"), pendingSlot("15:00")],
  "meat-1": [
    pendingSlot("00:00"),
    pendingSlot("06:00"),
    pendingSlot("12:00"),
    pendingSlot("18:00")
  ],
  "meat-3": [
    pendingSlot("00:00"),
    pendingSlot("06:00"),
    pendingSlot("12:00"),
    pendingSlot("18:00")
  ],
  "meat-4": [pendingSlot("10:00"), pendingSlot("16:00")]
};
const DEMO_CHECKLIST_NICHES = /* @__PURE__ */ new Set(["coffee", "bakery", "meat"]);
const CORRECTIVE_ACTIONS_BY_TASK_ID = {
  "coffee-1": [],
  /** Задача «Охлаждение зерна» (`coffee-2`): почему ответственный не выполнил задачу вовремя / как задумано. */
  "coffee-2": [
    tt$1("demo.seed_corrective.left_workplace"),
    tt$1("demo.seed_corrective.distracted"),
    tt$1("demo.seed_corrective.no_measurement"),
    tt$1("demo.seed_corrective.no_understanding"),
    tt$1("demo.seed_corrective.equipment_downtime"),
    tt$1("demo.seed_corrective.missed_deadline"),
    tt$1("demo.seed_corrective.no_handoff")
  ],
  "coffee-3": [],
  "coffee-4": [],
  "bakery-3": [],
  "bakery-4": [],
  "meat-1": [],
  "meat-3": [],
  "meat-4": []
};
const TASK_FIELD_DEFINITIONS_BY_TASK_ID = {
  "coffee-1": [
    {
      id: "def-coffee-1-ticket",
      fieldType: "ticket",
      config: {
        description: tt$1("demo.seed_field_descriptions.coffee_1_desc")
      }
    }
  ],
  "coffee-2": [
    {
      id: "def-coffee-2-temperature",
      fieldType: "temperature",
      config: {
        minC: 15,
        maxC: 25
      }
    }
  ],
  "coffee-3": [
    {
      id: "def-coffee-3-single-choice",
      fieldType: "single_choice",
      config: {
        question: tt$1("demo.seed_field_descriptions.coffee_3_question"),
        options: [tt$1("demo.seed_field_descriptions.coffee_3_opt_yes"), tt$1("demo.seed_field_descriptions.coffee_3_opt_no")]
      }
    }
  ],
  "coffee-4": [
    {
      id: "def-coffee-4-ticket",
      fieldType: "ticket",
      config: {
        description: tt$1("demo.seed_field_descriptions.coffee_4_desc")
      }
    }
  ],
  "bakery-3": [
    {
      id: "def-bakery-3-temperature",
      fieldType: "temperature",
      config: {
        minC: 32,
        maxC: 40
      }
    }
  ],
  "bakery-4": [
    {
      id: "def-bakery-4-ticket",
      fieldType: "ticket",
      config: {
        description: tt$1("demo.seed_field_descriptions.bakery_4_desc")
      }
    }
  ],
  "bakery-5": [
    {
      id: "def-bakery-5-single-choice",
      fieldType: "single_choice",
      config: {
        question: tt$1("demo.seed_field_descriptions.bakery_5_question"),
        options: [tt$1("demo.seed_field_descriptions.bakery_5_opt_yes"), tt$1("demo.seed_field_descriptions.bakery_5_opt_no")]
      }
    }
  ],
  "meat-1": [
    {
      id: "def-meat-1-temperature",
      fieldType: "temperature",
      config: { minC: -21, maxC: -17 }
    }
  ],
  "meat-2": [
    {
      id: "def-meat-2-single-choice",
      fieldType: "single_choice",
      config: {
        question: tt$1("demo.seed_field_descriptions.meat_2_question"),
        options: [tt$1("demo.seed_field_descriptions.meat_2_opt_yes"), tt$1("demo.seed_field_descriptions.meat_2_opt_no")]
      }
    }
  ],
  "meat-3": [
    {
      id: "def-meat-3-temperature",
      fieldType: "temperature",
      config: { minC: 0, maxC: 4 }
    }
  ],
  "meat-4": [
    {
      id: "def-meat-4-ticket",
      fieldType: "ticket",
      config: {
        description: tt$1("demo.seed_field_descriptions.meat_4_desc")
      }
    }
  ],
  "meat-5": [
    {
      id: "def-meat-5-ticket",
      fieldType: "ticket",
      config: {
        description: tt$1("demo.seed_field_descriptions.meat_5_desc")
      }
    }
  ]
};
const formatDateToRu = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
const formatDateToIso = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
const getTodayDateIso = () => formatDateToIso(/* @__PURE__ */ new Date());
const getEndOfCurrentMonthDateRu = () => {
  const now = /* @__PURE__ */ new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return formatDateToRu(lastDayOfMonth);
};
const tt = (...args) => i18n.global.t(...args);
function getCoffeeTemperatureProfiles() {
  return {
    storage: {
      ccpMin: 15,
      ccpMax: 24,
      riskSlope: 12,
      ccpLabel: tt("demo.temperature_ai.storage_ccp_label"),
      threatHigh: tt("demo.temperature_ai.storage_threat_high"),
      threatLow: tt("demo.temperature_ai.storage_threat_low"),
      economyHigh: tt("demo.temperature_ai.storage_economy_high"),
      economyLow: tt("demo.temperature_ai.storage_economy_low"),
      inspectorHigh: tt("demo.temperature_ai.storage_inspector_high"),
      inspectorLow: tt("demo.temperature_ai.storage_inspector_low"),
      actionHigh: tt("demo.temperature_ai.storage_action_high"),
      actionLow: tt("demo.temperature_ai.storage_action_low")
    },
    roasting: {
      ccpMin: 195,
      ccpMax: 230,
      riskSlope: 14,
      ccpLabel: tt("demo.temperature_ai.roasting_ccp_label"),
      threatHigh: tt("demo.temperature_ai.roasting_threat_high"),
      threatLow: tt("demo.temperature_ai.roasting_threat_low"),
      economyHigh: tt("demo.temperature_ai.roasting_economy_high"),
      economyLow: tt("demo.temperature_ai.roasting_economy_low"),
      inspectorHigh: tt("demo.temperature_ai.roasting_inspector_high"),
      inspectorLow: tt("demo.temperature_ai.roasting_inspector_low"),
      actionHigh: tt("demo.temperature_ai.roasting_action_high"),
      actionLow: tt("demo.temperature_ai.roasting_action_low")
    },
    cooling: {
      ccpMin: 15,
      ccpMax: 24,
      riskSlope: 12,
      ccpLabel: tt("demo.temperature_ai.cooling_ccp_label"),
      threatHigh: tt("demo.temperature_ai.cooling_threat_high"),
      threatLow: tt("demo.temperature_ai.cooling_threat_low"),
      economyHigh: tt("demo.temperature_ai.cooling_economy_high"),
      economyLow: tt("demo.temperature_ai.cooling_economy_low"),
      inspectorHigh: tt("demo.temperature_ai.cooling_inspector_high"),
      inspectorLow: tt("demo.temperature_ai.cooling_inspector_low"),
      actionHigh: tt("demo.temperature_ai.cooling_action_high"),
      actionLow: tt("demo.temperature_ai.cooling_action_low")
    }
  };
}
const AI_STATUS_PROBLEM_MIN_RISK_PERCENT = 70;
function getTemperatureProfiles() {
  return {
    meat: MEAT_MODE_ANALYZER_PROFILES,
    coffee: getCoffeeTemperatureProfiles(),
    bread: {
      sponge_mix: BREAD_MODE_ANALYZER_PROFILES.sponge_mix,
      proofing: BREAD_MODE_ANALYZER_PROFILES.proofing,
      baking: BREAD_MODE_ANALYZER_PROFILES.baking,
      cooling: BREAD_MODE_ANALYZER_PROFILES.cooling
    }
  };
}
function parseFiniteNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}
function buildRangeLabel(min, max) {
  return `${min}..${max}°C`;
}
function calculateRiskFromDeviation(deviationFromLimit, riskSlope) {
  const slope = parseFiniteNumber(riskSlope) ?? 12;
  const rawRisk = Math.round(deviationFromLimit * slope);
  return clampValue(rawRisk, 1, 100);
}
function formatTemperatureValueForUi(value, withPlusSign = true) {
  const numeric = parseFiniteNumber(value);
  if (numeric == null) {
    return "—";
  }
  const rounded = roundToTwoDecimals(numeric);
  const sign = rounded > 0 && withPlusSign ? "+" : "";
  return `${sign}${rounded}°C`;
}
function deviationFromTaskCcpRange(current, rangeMin, rangeMax) {
  const min = parseFiniteNumber(rangeMin);
  const max = parseFiniteNumber(rangeMax);
  if (min == null || max == null || current == null || !Number.isFinite(current)) {
    return { line: "" };
  }
  if (current >= min && current <= max) {
    return {
      line: tt("demo.temperature_ai.in_range")
    };
  }
  if (current > max) {
    const mag = roundToTwoDecimals(current - max);
    return {
      line: tt("demo.temperature_ai.exceeded_by", { value: formatTemperatureValueForUi(mag, true) })
    };
  }
  const delta = roundToTwoDecimals(current - min);
  return {
    line: tt("demo.temperature_ai.below_by", { value: formatTemperatureValueForUi(delta, false) })
  };
}
function meatOutOfRangeBandTexts(temperatureC, mode, equipmentTargetIds) {
  const band = resolveMeatRowForTaskMeasurement(
    temperatureC,
    equipmentTargetIds,
    mode
  );
  if (band && !meatBandMatchesTaskEquipment(band, equipmentTargetIds)) {
    return {
      threat: null,
      action: null,
      economy: null,
      inspector: null
    };
  }
  return {
    threat: (band == null ? void 0 : band.threat) ?? null,
    action: (band == null ? void 0 : band.action) ?? null,
    economy: null,
    inspector: null
  };
}
function coffeeOutOfRangeBandTexts(profileContext, direction, temperatureC, equipmentTargetIds) {
  const p = profileContext.profile;
  const high = direction === "too_high";
  const fromCoffeeProfile = () => ({
    threat: high ? (p == null ? void 0 : p.threatHigh) ?? null : (p == null ? void 0 : p.threatLow) ?? null,
    economy: high ? (p == null ? void 0 : p.economyHigh) ?? null : (p == null ? void 0 : p.economyLow) ?? null,
    inspector: high ? (p == null ? void 0 : p.inspectorHigh) ?? null : (p == null ? void 0 : p.inspectorLow) ?? null,
    action: high ? (p == null ? void 0 : p.actionHigh) ?? null : (p == null ? void 0 : p.actionLow) ?? null
  });
  const row = resolveCoffeeRowForTaskMeasurement(
    temperatureC,
    equipmentTargetIds,
    profileContext.mode
  );
  if (row && !coffeeBandMatchesTaskEquipment(row, equipmentTargetIds)) {
    return fromCoffeeProfile();
  }
  return {
    threat: (row == null ? void 0 : row.threat) ?? null,
    action: (row == null ? void 0 : row.action) ?? null,
    economy: null,
    inspector: null
  };
}
function breadOutOfRangeBandTexts(profileContext, direction, temperatureC, equipmentTargetIds) {
  const row = resolveBreadRowForTaskMeasurement(
    temperatureC,
    equipmentTargetIds,
    profileContext.mode
  );
  if (row) {
    return {
      threat: row.threat ?? null,
      action: row.action ?? null,
      economy: null,
      inspector: null
    };
  }
  const p = profileContext.profile;
  const high = direction === "too_high";
  return {
    threat: high ? (p == null ? void 0 : p.threatHigh) ?? null : (p == null ? void 0 : p.threatLow) ?? null,
    economy: high ? (p == null ? void 0 : p.economyHigh) ?? null : (p == null ? void 0 : p.economyLow) ?? null,
    inspector: high ? (p == null ? void 0 : p.inspectorHigh) ?? null : (p == null ? void 0 : p.inspectorLow) ?? null,
    action: high ? (p == null ? void 0 : p.actionHigh) ?? null : (p == null ? void 0 : p.actionLow) ?? null
  };
}
function profileOutOfRangeTexts(profile, direction) {
  const p = profile;
  const high = direction === "too_high";
  return {
    threat: high ? (p == null ? void 0 : p.threatHigh) ?? null : (p == null ? void 0 : p.threatLow) ?? null,
    economy: high ? (p == null ? void 0 : p.economyHigh) ?? null : (p == null ? void 0 : p.economyLow) ?? null,
    inspector: high ? (p == null ? void 0 : p.inspectorHigh) ?? null : (p == null ? void 0 : p.inspectorLow) ?? null,
    action: high ? (p == null ? void 0 : p.actionHigh) ?? null : (p == null ? void 0 : p.actionLow) ?? null
  };
}
function resolveOutOfRangeTextsForNiche(profileContext, direction, temperatureC, equipmentTargetIds) {
  if (profileContext.niche === "meat") {
    return meatOutOfRangeBandTexts(
      temperatureC,
      profileContext.mode,
      equipmentTargetIds
    );
  }
  if (profileContext.niche === "coffee") {
    return coffeeOutOfRangeBandTexts(
      profileContext,
      direction,
      temperatureC,
      equipmentTargetIds
    );
  }
  if (profileContext.niche === "bread") {
    return breadOutOfRangeBandTexts(
      profileContext,
      direction,
      temperatureC,
      equipmentTargetIds
    );
  }
  return profileOutOfRangeTexts(profileContext.profile, direction);
}
function shouldForceProblemForMeatCriticalBand(value, mode, equipmentTargetIds) {
  const row = resolveMeatRowForTaskMeasurement(value, equipmentTargetIds, mode);
  if (!row) {
    return false;
  }
  if (!taskHasMeatEquipment(equipmentTargetIds)) {
    return row.status === "critical";
  }
  return meatBandMatchesTaskEquipment(row, equipmentTargetIds) && row.status === "critical";
}
function shouldForceProblemForCoffeeCriticalBand(value, mode, equipmentTargetIds) {
  const row = resolveCoffeeRowForTaskMeasurement(value, equipmentTargetIds, mode);
  if (!row) {
    return false;
  }
  if (!taskHasCoffeeEquipment(equipmentTargetIds)) {
    return row.status === "critical";
  }
  return coffeeBandMatchesTaskEquipment(row, equipmentTargetIds) && row.status === "critical";
}
function shouldForceProblemForBreadCriticalBand(value, mode, equipmentTargetIds) {
  const row = resolveBreadRowForTaskMeasurement(value, equipmentTargetIds, mode);
  if (!row) {
    return false;
  }
  if (!taskHasBreadEquipment(equipmentTargetIds)) {
    return row.status === "critical";
  }
  return breadBandMatchesTaskEquipment(row, equipmentTargetIds) && row.status === "critical";
}
class TemperatureAiAnalyzer {
  constructor(options = {}) {
    this.options = options;
  }
  /**
   * [ОБЩЕЕ] Экспорт `TEMPERATURE_PROFILES` для контрактов и тестов.
   */
  getProfiles() {
    return getTemperatureProfiles();
  }
  // ───────────────────────────────────────────────────────────────────────
  // ОБЩЕЕ — контекст профиля и диапазон CCP
  // ───────────────────────────────────────────────────────────────────────
  /**
   * [ОБЩЕЕ] Ниша + режим → объект профиля из `TEMPERATURE_PROFILES`.
   */
  resolveProfileContext(niche, mode) {
    const normalizedNiche = String(niche ?? "").trim();
    const normalizedMode = String(mode ?? "").trim();
    const nicheConfig = getTemperatureProfiles()[normalizedNiche] ?? null;
    if (!nicheConfig) {
      return {
        niche: normalizedNiche || null,
        mode: normalizedMode || null,
        profile: null
      };
    }
    if (normalizedMode && nicheConfig[normalizedMode]) {
      return {
        niche: normalizedNiche,
        mode: normalizedMode,
        profile: nicheConfig[normalizedMode]
      };
    }
    const defaultMode = Object.keys(nicheConfig)[0] ?? null;
    return {
      niche: normalizedNiche,
      mode: defaultMode,
      profile: defaultMode ? nicheConfig[defaultMode] : null
    };
  }
  /**
   * [ОБЩЕЕ] Диапазон из задачи с fallback на профиль ниши.
   */
  resolveCcpRange(inputMin, inputMax, profile) {
    const profileMin = parseFiniteNumber(profile == null ? void 0 : profile.ccpMin);
    const profileMax = parseFiniteNumber(profile == null ? void 0 : profile.ccpMax);
    const inMin = parseFiniteNumber(inputMin);
    const inMax = parseFiniteNumber(inputMax);
    const rangeMin = inMin ?? profileMin;
    const rangeMax = inMax ?? profileMax;
    if (rangeMin == null || rangeMax == null) {
      return null;
    }
    if (rangeMin > rangeMax) {
      return null;
    }
    const boundsFromTask = inMin != null && inMax != null && Number.isFinite(inMin) && Number.isFinite(inMax);
    const ccpLabel = boundsFromTask ? buildRangeLabel(rangeMin, rangeMax) : (profile == null ? void 0 : profile.ccpLabel) ?? buildRangeLabel(rangeMin, rangeMax);
    return {
      ccpMin: rangeMin,
      ccpMax: rangeMax,
      ccpLabel
    };
  }
  // ───────────────────────────────────────────────────────────────────────
  // ОБЩЕЕ — ядро анализа по допуску задачи
  // ───────────────────────────────────────────────────────────────────────
  /**
   * [ОБЩЕЕ] Температура относительно CCP задачи; риск и тексты — через диспетчер ниш.
   */
  analyzeTemperature(params = {}) {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    const {
      niche,
      mode,
      currentValue,
      ccpMin: inputCcpMin,
      ccpMax: inputCcpMax,
      equipmentTargetIds
    } = params;
    const profileContext = this.resolveProfileContext(niche, mode);
    const current = parseFiniteNumber(currentValue);
    const ccpMin = parseFiniteNumber(inputCcpMin);
    const ccpMax = parseFiniteNumber(inputCcpMax);
    if (profileContext.niche === "bread" && current != null) {
      const row = resolveBreadRowForTaskMeasurement(
        current,
        equipmentTargetIds,
        mode
      );
      if (!row) {
        return {
          status: "invalid",
          niche: profileContext.niche,
          mode: profileContext.mode,
          value: current,
          ccpMin: null,
          ccpMax: null,
          ccpLabel: ((_a2 = profileContext.profile) == null ? void 0 : _a2.ccpLabel) ?? "",
          inRange: null,
          direction: null,
          deviationFromLimit: null,
          risk: 0,
          threat: null,
          economy: null,
          inspector: null,
          action: null,
          taskCcpDeviationLine: ""
        };
      }
      const taskRange = this.resolveCcpRange(ccpMin, ccpMax, profileContext.profile);
      const taskCcpDev2 = deviationFromTaskCcpRange(
        current,
        taskRange == null ? void 0 : taskRange.ccpMin,
        taskRange == null ? void 0 : taskRange.ccpMax
      );
      const labelFromRow = row.temperatureLabel ?? "";
      const ccpLabelForUi = (taskRange == null ? void 0 : taskRange.ccpLabel) && String(taskRange.ccpLabel).trim() !== "" ? taskRange.ccpLabel : labelFromRow || ((_b2 = profileContext.profile) == null ? void 0 : _b2.ccpLabel) || "";
      if (row.status === "normal") {
        return {
          status: "ok",
          niche: profileContext.niche,
          mode: profileContext.mode,
          value: current,
          ccpMin: (taskRange == null ? void 0 : taskRange.ccpMin) ?? null,
          ccpMax: (taskRange == null ? void 0 : taskRange.ccpMax) ?? null,
          ccpLabel: ccpLabelForUi,
          inRange: true,
          direction: "in_range",
          deviationFromLimit: 0,
          risk: 0,
          threat: null,
          economy: null,
          inspector: null,
          action: null,
          taskCcpDeviationLine: taskCcpDev2.line
        };
      }
      const riskForUi = row.status === "critical" ? 100 : 55;
      return {
        status: "problem",
        niche: profileContext.niche,
        mode: profileContext.mode,
        value: current,
        ccpMin: (taskRange == null ? void 0 : taskRange.ccpMin) ?? null,
        ccpMax: (taskRange == null ? void 0 : taskRange.ccpMax) ?? null,
        ccpLabel: ccpLabelForUi,
        inRange: false,
        direction: row.status === "critical" ? "too_high" : "too_low",
        deviationFromLimit: roundToTwoDecimals(0),
        risk: riskForUi,
        threat: row.threat ?? null,
        economy: null,
        inspector: null,
        action: row.action ?? null,
        taskCcpDeviationLine: taskCcpDev2.line
      };
    }
    if (profileContext.niche === "meat" && current != null) {
      const row = resolveMeatRowForTaskMeasurement(
        current,
        equipmentTargetIds,
        mode
      );
      if (!row) {
        return {
          status: "invalid",
          niche: profileContext.niche,
          mode: profileContext.mode,
          value: current,
          ccpMin: null,
          ccpMax: null,
          ccpLabel: ((_c = profileContext.profile) == null ? void 0 : _c.ccpLabel) ?? "",
          inRange: null,
          direction: null,
          deviationFromLimit: null,
          risk: 0,
          threat: null,
          economy: null,
          inspector: null,
          action: null,
          taskCcpDeviationLine: ""
        };
      }
      const taskRange = this.resolveCcpRange(ccpMin, ccpMax, profileContext.profile);
      const taskCcpDev2 = deviationFromTaskCcpRange(
        current,
        taskRange == null ? void 0 : taskRange.ccpMin,
        taskRange == null ? void 0 : taskRange.ccpMax
      );
      const labelFromRow = row.temperatureLabel ?? "";
      const ccpLabelForUi = (taskRange == null ? void 0 : taskRange.ccpLabel) && String(taskRange.ccpLabel).trim() !== "" ? taskRange.ccpLabel : labelFromRow || ((_d = profileContext.profile) == null ? void 0 : _d.ccpLabel) || "";
      if (row.status === "normal") {
        return {
          status: "ok",
          niche: profileContext.niche,
          mode: profileContext.mode,
          value: current,
          ccpMin: (taskRange == null ? void 0 : taskRange.ccpMin) ?? null,
          ccpMax: (taskRange == null ? void 0 : taskRange.ccpMax) ?? null,
          ccpLabel: ccpLabelForUi,
          inRange: true,
          direction: "in_range",
          deviationFromLimit: 0,
          risk: 0,
          threat: null,
          economy: null,
          inspector: null,
          action: null,
          taskCcpDeviationLine: taskCcpDev2.line
        };
      }
      const riskForUi = row.status === "critical" ? 100 : 55;
      return {
        status: "problem",
        niche: profileContext.niche,
        mode: profileContext.mode,
        value: current,
        ccpMin: (taskRange == null ? void 0 : taskRange.ccpMin) ?? null,
        ccpMax: (taskRange == null ? void 0 : taskRange.ccpMax) ?? null,
        ccpLabel: ccpLabelForUi,
        inRange: false,
        direction: row.status === "critical" ? "too_high" : "too_low",
        deviationFromLimit: roundToTwoDecimals(0),
        risk: riskForUi,
        threat: row.threat ?? null,
        economy: null,
        inspector: null,
        action: row.action ?? null,
        taskCcpDeviationLine: taskCcpDev2.line
      };
    }
    if (profileContext.niche === "coffee" && current != null) {
      const row = resolveCoffeeRowForTaskMeasurement(
        current,
        equipmentTargetIds,
        mode
      );
      if (!row) {
        return {
          status: "invalid",
          niche: profileContext.niche,
          mode: profileContext.mode,
          value: current,
          ccpMin: null,
          ccpMax: null,
          ccpLabel: ((_e = profileContext.profile) == null ? void 0 : _e.ccpLabel) ?? "",
          inRange: null,
          direction: null,
          deviationFromLimit: null,
          risk: 0,
          threat: null,
          economy: null,
          inspector: null,
          action: null,
          taskCcpDeviationLine: ""
        };
      }
      const taskRange = this.resolveCcpRange(ccpMin, ccpMax, profileContext.profile);
      const taskCcpDev2 = deviationFromTaskCcpRange(
        current,
        taskRange == null ? void 0 : taskRange.ccpMin,
        taskRange == null ? void 0 : taskRange.ccpMax
      );
      const labelFromRow = row.temperatureLabel ?? "";
      const ccpLabelForUi = (taskRange == null ? void 0 : taskRange.ccpLabel) && String(taskRange.ccpLabel).trim() !== "" ? taskRange.ccpLabel : labelFromRow || ((_f = profileContext.profile) == null ? void 0 : _f.ccpLabel) || "";
      if (row.status === "normal") {
        return {
          status: "ok",
          niche: profileContext.niche,
          mode: profileContext.mode,
          value: current,
          ccpMin: (taskRange == null ? void 0 : taskRange.ccpMin) ?? null,
          ccpMax: (taskRange == null ? void 0 : taskRange.ccpMax) ?? null,
          ccpLabel: ccpLabelForUi,
          inRange: true,
          direction: "in_range",
          deviationFromLimit: 0,
          risk: 0,
          threat: null,
          economy: null,
          inspector: null,
          action: null,
          taskCcpDeviationLine: taskCcpDev2.line
        };
      }
      const riskForUi = row.status === "critical" ? 100 : 55;
      return {
        status: "problem",
        niche: profileContext.niche,
        mode: profileContext.mode,
        value: current,
        ccpMin: (taskRange == null ? void 0 : taskRange.ccpMin) ?? null,
        ccpMax: (taskRange == null ? void 0 : taskRange.ccpMax) ?? null,
        ccpLabel: ccpLabelForUi,
        inRange: false,
        direction: row.status === "critical" ? "too_high" : "too_low",
        deviationFromLimit: roundToTwoDecimals(0),
        risk: riskForUi,
        threat: row.threat ?? null,
        economy: null,
        inspector: null,
        action: row.action ?? null,
        taskCcpDeviationLine: taskCcpDev2.line
      };
    }
    const range = this.resolveCcpRange(ccpMin, ccpMax, profileContext.profile);
    if (current == null || range == null) {
      return {
        status: "invalid",
        niche: profileContext.niche,
        mode: profileContext.mode,
        value: current,
        ccpMin: (range == null ? void 0 : range.ccpMin) ?? null,
        ccpMax: (range == null ? void 0 : range.ccpMax) ?? null,
        ccpLabel: (range == null ? void 0 : range.ccpLabel) ?? ((_g = profileContext.profile) == null ? void 0 : _g.ccpLabel) ?? "",
        inRange: null,
        direction: null,
        deviationFromLimit: null,
        risk: 0,
        threat: null,
        economy: null,
        inspector: null,
        action: null
      };
    }
    const ccpLabel = range.ccpLabel || buildRangeLabel(range.ccpMin, range.ccpMax);
    const inRange = current >= range.ccpMin && current <= range.ccpMax;
    if (inRange) {
      const taskCcpDev2 = deviationFromTaskCcpRange(
        current,
        range.ccpMin,
        range.ccpMax
      );
      return {
        status: "ok",
        niche: profileContext.niche,
        mode: profileContext.mode,
        value: current,
        ccpMin: range.ccpMin,
        ccpMax: range.ccpMax,
        ccpLabel,
        inRange: true,
        direction: "in_range",
        deviationFromLimit: 0,
        risk: 0,
        threat: null,
        economy: null,
        inspector: null,
        action: null,
        taskCcpDeviationLine: taskCcpDev2.line
      };
    }
    const direction = current > range.ccpMax ? "too_high" : "too_low";
    const deviationFromLimit = direction === "too_high" ? current - range.ccpMax : range.ccpMin - current;
    const risk = calculateRiskFromDeviation(
      deviationFromLimit,
      (_h = profileContext.profile) == null ? void 0 : _h.riskSlope
    );
    const texts = resolveOutOfRangeTextsForNiche(
      profileContext,
      direction,
      current,
      equipmentTargetIds
    );
    const taskCcpDev = deviationFromTaskCcpRange(
      current,
      range.ccpMin,
      range.ccpMax
    );
    return {
      status: "problem",
      niche: profileContext.niche,
      mode: profileContext.mode,
      value: current,
      ccpMin: range.ccpMin,
      ccpMax: range.ccpMax,
      ccpLabel,
      inRange: false,
      direction,
      deviationFromLimit: roundToTwoDecimals(deviationFromLimit),
      risk,
      ...texts,
      taskCcpDeviationLine: taskCcpDev.line
    };
  }
  // ───────────────────────────────────────────────────────────────────────
  // ОБЩЕЕ — UI: предупреждение при отклонении (каркас + МЯСО | КОФЕ для critical)
  // ───────────────────────────────────────────────────────────────────────
  /**
   * [ОБЩЕЕ] Объект для строки замера при `problem` по CCP. Порог риска общий;
   * [МЯСО | КОФЕ | ТЕСТО]: `problem`, если полоса `critical` (кофе/хлеб — при совпадении equipment).
   */
  getHaccpWarning(params = {}) {
    const analysis = this.analyzeTemperature(params);
    if (!analysis || analysis.status !== "problem") {
      return null;
    }
    const risk = clampValue(Math.round(analysis.risk ?? 0), 0, 100);
    let ai_status = risk >= AI_STATUS_PROBLEM_MIN_RISK_PERCENT ? "problem" : "warning";
    if (analysis.niche === "meat") {
      if (shouldForceProblemForMeatCriticalBand(
        analysis.value,
        analysis.mode,
        params.equipmentTargetIds
      )) {
        ai_status = "problem";
      }
    } else if (analysis.niche === "coffee") {
      if (shouldForceProblemForCoffeeCriticalBand(
        analysis.value,
        analysis.mode,
        params.equipmentTargetIds
      )) {
        ai_status = "problem";
      }
    } else if (analysis.niche === "bread") {
      if (shouldForceProblemForBreadCriticalBand(
        analysis.value,
        analysis.mode,
        params.equipmentTargetIds
      )) {
        ai_status = "problem";
      }
    }
    const directionLabel = analysis.direction === "too_high" ? tt("demo.temperature_ai.direction_high") : analysis.direction === "too_low" ? tt("demo.temperature_ai.direction_low") : tt("demo.temperature_ai.direction_deviation");
    const headlineWord = analysis.direction === "too_high" ? tt("demo.temperature_ai.headline_high") : analysis.direction === "too_low" ? tt("demo.temperature_ai.headline_low") : tt("demo.temperature_ai.headline_deviation");
    const currentFormatted = formatTemperatureValueForUi(analysis.value);
    const mag = analysis.deviationFromLimit;
    const deviationFormatted = analysis.direction === "too_high" ? formatTemperatureValueForUi(mag, true) : analysis.direction === "too_low" ? formatTemperatureValueForUi(-mag, false) : formatTemperatureValueForUi(mag, false);
    const deviationLineFromTaskCcp = (analysis.niche === "bread" || analysis.niche === "meat" || analysis.niche === "coffee") && typeof analysis.taskCcpDeviationLine === "string" && analysis.taskCcpDeviationLine.trim() !== "" ? analysis.taskCcpDeviationLine : null;
    const deviationLineBread = deviationLineFromTaskCcp ?? `${directionLabel}: ${deviationFormatted}`;
    return {
      ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
      title: `${headlineWord}: ${risk}%`,
      ai_status,
      risk,
      niche: analysis.niche,
      mode: analysis.mode,
      ccpLabel: analysis.ccpLabel ?? "",
      currentLine: currentFormatted,
      deviationLine: deviationLineBread,
      threat: analysis.threat ?? "",
      economy: analysis.economy ?? "",
      inspector: analysis.inspector ?? "",
      action: analysis.action ?? "",
      direction: analysis.direction,
      value: analysis.value,
      ccpMin: analysis.ccpMin,
      ccpMax: analysis.ccpMax
    };
  }
  // ───────────────────────────────────────────────────────────────────────
  // МЯСО | КОФЕ | ТЕСТО — UI: в норме по CCP, тексты из полос
  // ───────────────────────────────────────────────────────────────────────
  /**
   * [МЯСО | КОФЕ | ТЕСТО] В окне min/max задачи: тексты из полос;
   * [КОФЕ | ТЕСТО] без совпадения equipment — пустые threat/action.
   */
  getHaccpInRangeDisplay(params = {}) {
    const analysis = this.analyzeTemperature(params);
    if (!analysis || analysis.status !== "ok") {
      return null;
    }
    if (analysis.niche !== "meat" && analysis.niche !== "coffee" && analysis.niche !== "bread") {
      return null;
    }
    const currentFormatted = formatTemperatureValueForUi(analysis.value);
    if (analysis.niche === "meat") {
      const row = resolveMeatRowForTaskMeasurement(
        analysis.value,
        params.equipmentTargetIds,
        analysis.mode
      );
      if (!row) {
        return null;
      }
      const useBandNarrative = !taskHasMeatEquipment(params.equipmentTargetIds) || meatBandMatchesTaskEquipment(row, params.equipmentTargetIds);
      const taskDevLine = analysis.taskCcpDeviationLine && analysis.taskCcpDeviationLine.trim() !== "" ? analysis.taskCcpDeviationLine : "—";
      return {
        ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
        title: tt("demo.temperature_ai.within_ccp"),
        ai_status: "ok",
        risk: 0,
        niche: analysis.niche,
        mode: analysis.mode,
        ccpLabel: analysis.ccpLabel ?? "",
        currentLine: currentFormatted,
        deviationLine: taskDevLine,
        threat: useBandNarrative ? row.threat ?? "" : "",
        economy: "",
        inspector: "",
        action: useBandNarrative ? row.action ?? "" : "",
        direction: "in_range",
        value: analysis.value,
        ccpMin: analysis.ccpMin,
        ccpMax: analysis.ccpMax
      };
    }
    if (analysis.niche === "bread") {
      const row = resolveBreadRowForTaskMeasurement(
        analysis.value,
        params.equipmentTargetIds,
        analysis.mode
      );
      if (!row) {
        return null;
      }
      const useBandNarrative = !taskHasBreadEquipment(params.equipmentTargetIds) || breadBandMatchesTaskEquipment(row, params.equipmentTargetIds);
      const taskDevLine = analysis.taskCcpDeviationLine && analysis.taskCcpDeviationLine.trim() !== "" ? analysis.taskCcpDeviationLine : "—";
      return {
        ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
        title: tt("demo.temperature_ai.within_ccp"),
        ai_status: "ok",
        risk: 0,
        niche: analysis.niche,
        mode: analysis.mode,
        ccpLabel: analysis.ccpLabel ?? "",
        currentLine: currentFormatted,
        deviationLine: taskDevLine,
        threat: useBandNarrative ? row.threat ?? "" : "",
        economy: "",
        inspector: "",
        action: useBandNarrative ? row.action ?? "" : "",
        direction: "in_range",
        value: analysis.value,
        ccpMin: analysis.ccpMin,
        ccpMax: analysis.ccpMax
      };
    }
    if (analysis.niche === "coffee") {
      const row = resolveCoffeeRowForTaskMeasurement(
        analysis.value,
        params.equipmentTargetIds,
        analysis.mode
      );
      if (!row) {
        return null;
      }
      const useBandNarrative = !taskHasCoffeeEquipment(params.equipmentTargetIds) || coffeeBandMatchesTaskEquipment(row, params.equipmentTargetIds);
      const taskDevLine = analysis.taskCcpDeviationLine && analysis.taskCcpDeviationLine.trim() !== "" ? analysis.taskCcpDeviationLine : "—";
      return {
        ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
        title: tt("demo.temperature_ai.within_ccp"),
        ai_status: "ok",
        risk: 0,
        niche: analysis.niche,
        mode: analysis.mode,
        ccpLabel: analysis.ccpLabel ?? "",
        currentLine: currentFormatted,
        deviationLine: taskDevLine,
        threat: useBandNarrative ? row.threat ?? "" : "",
        economy: "",
        inspector: "",
        action: useBandNarrative ? row.action ?? "" : "",
        direction: "in_range",
        value: analysis.value,
        ccpMin: analysis.ccpMin,
        ccpMax: analysis.ccpMax
      };
    }
    return null;
  }
  // ───────────────────────────────────────────────────────────────────────
  // ОБЩЕЕ — делегаты к модульным утилитам (совместимость, если вызывали с `this`)
  // ───────────────────────────────────────────────────────────────────────
  /** [ОБЩЕЕ] Парсинг числа для входных данных (делегат к `parseFiniteNumber`). */
  toFiniteNumber(value) {
    return parseFiniteNumber(value);
  }
  /** [ОБЩЕЕ] */
  clamp(value, min, max) {
    return clampValue(value, min, max);
  }
  /** [ОБЩЕЕ] */
  roundToTwo(value) {
    return roundToTwoDecimals(value);
  }
  /** [ОБЩЕЕ] */
  formatTemperatureValue(value, withPlusSign = true) {
    return formatTemperatureValueForUi(value, withPlusSign);
  }
  /** [ОБЩЕЕ] */
  buildRangeLabel(min, max) {
    return buildRangeLabel(min, max);
  }
  /** [ОБЩЕЕ] */
  calculateRisk(deviationFromLimit, riskSlope) {
    return calculateRiskFromDeviation(deviationFromLimit, riskSlope);
  }
}
const createTemperatureAiAnalyzer = (options = {}) => new TemperatureAiAnalyzer(options);
const analyzer = createTemperatureAiAnalyzer();
const measurementAiSnapshotMatchesValue = (row, currentC) => {
  const w = row == null ? void 0 : row.aiWarning;
  if (!w || typeof w !== "object") {
    return false;
  }
  if (typeof w.value !== "number" || !Number.isFinite(w.value)) {
    return false;
  }
  return Math.round(w.value * 100) === Math.round(currentC * 100);
};
function seedChecklistsTemperatureAi(checklistsByNiche) {
  if (!checklistsByNiche || typeof checklistsByNiche !== "object") {
    return;
  }
  for (const nicheKey of Object.keys(checklistsByNiche)) {
    const list = checklistsByNiche[nicheKey];
    if (!Array.isArray(list)) {
      continue;
    }
    for (const task of list) {
      if (!task || typeof task !== "object") {
        continue;
      }
      const limits = readTaskTemperatureMinMaxC(task);
      if (!limits) {
        continue;
      }
      const { minC, maxC, ccpLabel: limitsLabel } = limits;
      const taskNiche = resolveTaskNicheForTemperatureAi(task) ?? nicheKey;
      const analyzerNiche = mapTaskNicheToAnalyzerNiche(taskNiche);
      const measurements = Array.isArray(task.measurements) ? task.measurements : [];
      let lastDisplay = null;
      let lastAiMode = resolveTemperatureAiMode(task, analyzerNiche);
      for (const row of measurements) {
        if (!row || typeof row !== "object") {
          continue;
        }
        const current = parseMeasurementTemperatureCAndSyncRowStatusToCcp(task, row);
        if (current == null) {
          if (!Object.prototype.hasOwnProperty.call(row, "aiWarning")) {
            row.aiWarning = null;
          }
          continue;
        }
        if (measurementAiSnapshotMatchesValue(row, current)) {
          if (row.aiWarning) {
            lastDisplay = row.aiWarning;
          }
          continue;
        }
        const aiMode = resolveTemperatureAiMode(task, analyzerNiche, current);
        lastAiMode = aiMode;
        const aiParams = {
          niche: analyzerNiche,
          mode: aiMode,
          currentValue: current,
          ccpMin: minC,
          ccpMax: maxC,
          equipmentTargetIds: task.equipmentTargetIds
        };
        const display = row.status === "success" ? analyzer.getHaccpInRangeDisplay(aiParams) : analyzer.getHaccpWarning(aiParams);
        row.aiWarning = display;
        if (display) {
          lastDisplay = display;
        }
      }
      if (task.aiContext && typeof task.aiContext === "object") {
        task.aiContext = {
          ...task.aiContext,
          niche: task.niche ?? taskNiche,
          mode: lastAiMode,
          taskType: "temperature",
          ccpMin: minC,
          ccpMax: maxC,
          ccpLabel: (lastDisplay == null ? void 0 : lastDisplay.ccpLabel) || limitsLabel || task.aiContext.ccpLabel || "",
          engine: "temperature-v1",
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
    }
  }
}
const createDefaultState = () => {
  const startDate = toStartOfDayTimestamp(`${getTodayDateIso()}T00:00:00`);
  const checklistsByNicheBase = {
    coffee: [
      {
        id: "coffee-1",
        title: i18n.global.t("demo.seed_tasks.coffee_1"),
        status: true,
        taskScopeType: "rooms",
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-1"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-1"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-1"],
        roomTargetIds: [
          "room-production-hall",
          "room-raw-storage",
          "room-receiving"
        ]
      },
      {
        id: "coffee-2",
        title: i18n.global.t("demo.seed_tasks.coffee_2"),
        status: false,
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-2"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-2"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-2"],
        equipmentTargetIds: ["eq-coffee-bean-cooler"]
      },
      {
        id: "coffee-3",
        title: i18n.global.t("demo.seed_tasks.coffee_3"),
        status: false,
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-3"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-3"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-3"],
        equipmentTargetIds: ["eq-transport-box", "eq-dry-goods"]
      },
      {
        id: "coffee-4",
        title: i18n.global.t("demo.seed_tasks.coffee_4"),
        status: false,
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-4"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-4"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-4"],
        equipmentTargetIds: ["eq-coffee-machine"]
      }
    ],
    bakery: [
      {
        id: "bakery-3",
        title: i18n.global.t("demo.seed_tasks.bakery_3"),
        status: false,
        taskScopeType: "equipment",
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["bakery-3"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["bakery-3"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-3"],
        equipmentTargetIds: ["eq-bread-proofing-cabinet"]
      },
      {
        id: "bakery-4",
        title: i18n.global.t("demo.seed_tasks.bakery_4"),
        status: false,
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["bakery-4"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["bakery-4"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-4"],
        roomTargetIds: ["room-production-hall", "room-raw-storage"]
      },
      {
        id: "bakery-5",
        title: i18n.global.t("demo.seed_tasks.bakery_5"),
        status: true,
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-5"],
        roomTargetIds: ["room-raw-storage", "room-receiving"]
      }
    ],
    meat: [
      {
        id: "meat-1",
        title: i18n.global.t("demo.seed_tasks.meat_1"),
        status: false,
        taskScopeType: "equipment",
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-1"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-1"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-1"],
        equipmentTargetIds: ["eq-freezer", "eq-cold-storage"]
      },
      {
        id: "meat-2",
        title: i18n.global.t("demo.seed_tasks.meat_2"),
        status: true,
        taskScopeType: "rooms",
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-2"],
        roomTargetIds: ["room-finished-storage", "room-office-qc"]
      },
      {
        id: "meat-3",
        title: i18n.global.t("demo.seed_tasks.meat_3"),
        status: false,
        taskScopeType: "equipment",
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-3"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-3"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-3"],
        equipmentTargetIds: ["eq-fridge-1", "eq-fridge-2"]
      },
      {
        id: "meat-4",
        title: i18n.global.t("demo.seed_tasks.meat_4"),
        status: false,
        taskScopeType: "equipment",
        measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-4"],
        correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-4"],
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-4"],
        equipmentTargetIds: ["eq-probe-1", "eq-fridge-2"]
      },
      {
        id: "meat-5",
        title: i18n.global.t("demo.seed_tasks.meat_5"),
        status: true,
        taskScopeType: "rooms",
        taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-5"],
        roomTargetIds: ["room-wash", "room-production-hall"]
      }
    ]
  };
  const checklistsByNicheRaw = Object.fromEntries(
    Object.entries(checklistsByNicheBase).map(([niche, tasks]) => [
      niche,
      tasks.map(
        (task, index) => buildDefaultTask(task, niche, { startDate, index })
      )
    ])
  );
  const checklistsByNiche = applyDefaultAssigneesToChecklists(checklistsByNicheRaw);
  seedChecklistsTemperatureAi(checklistsByNiche);
  return {
    demoStateSchemaVersion: DEMO_STATE_SCHEMA_VERSION,
    inspectionDate: getEndOfCurrentMonthDateRu(),
    sites: DEFAULT_SITES.map((s) => ({ ...s })),
    staff: DEFAULT_STAFF.map((s) => ({ ...s })),
    checklistsByNiche,
    batches: buildDemoBatches(),
    report: {
      /** Публичная страница ежедневного отчёта: /report/YYYY-MM-DD (не карточка партии). */
      reportDayIso: getTodayDateIso(),
      company: "Piotr Bakery"
    }
  };
};
const STORAGE_KEY$1 = LS_DEMO_STATE;
const normalizeHydratedStateDates = (state) => {
  const defaults = createDefaultState();
  const nextReport = {
    ...(state == null ? void 0 : state.report) ?? {},
    reportDayIso: defaults.report.reportDayIso
  };
  const next = {
    ...state,
    inspectionDate: defaults.inspectionDate,
    report: nextReport,
    // Гарантируем, что в Reports/дневном отчёте даты партий синхронны с текущим днем.
    batches: buildDemoBatches()
  };
  normalizeAllChecklistTaskMeasurementStatuses(next.checklistsByNiche);
  seedChecklistsTemperatureAi(next.checklistsByNiche);
  return next;
};
const loadStateFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY$1);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return normalizeHydratedStateDates(parsed);
  } catch {
    return null;
  }
};
const loadPersistedDemoState = () => loadStateFromStorage() ?? createDefaultState();
const saveStateToStorage = (state) => {
  try {
    normalizeAllChecklistTaskMeasurementStatuses(state.checklistsByNiche);
    localStorage.setItem(STORAGE_KEY$1, JSON.stringify(state));
  } catch {
  }
};
const demoState = ref(loadStateFromStorage() ?? createDefaultState());
watch(
  demoState,
  (nextState) => {
    saveStateToStorage(nextState);
  },
  { deep: true }
);
const useDemoState = () => {
  const setChecklistsByNiche = (nextChecklists) => {
    demoState.value = {
      ...demoState.value,
      checklistsByNiche: nextChecklists
    };
  };
  const addStaff = (payload) => {
    const id = v4();
    const next = {
      id,
      siteId: payload.siteId,
      fullName: String(payload.fullName ?? "").trim(),
      role: String(payload.role ?? "").trim(),
      phone: payload.phone ? String(payload.phone).trim() : void 0,
      email: payload.email ? String(payload.email).trim() : void 0,
      active: payload.active !== false
    };
    if (!next.fullName || !next.role || !next.siteId) {
      return null;
    }
    demoState.value = {
      ...demoState.value,
      staff: [...demoState.value.staff, next]
    };
    return id;
  };
  const updateStaff = (patch) => {
    if (!(patch == null ? void 0 : patch.id)) {
      return false;
    }
    const idx = demoState.value.staff.findIndex((s) => s.id === patch.id);
    if (idx === -1) {
      return false;
    }
    const prev = demoState.value.staff[idx];
    const fullName = patch.fullName != null ? String(patch.fullName).trim() : prev.fullName;
    const role = patch.role != null ? String(patch.role).trim() : prev.role;
    const siteId = patch.siteId != null ? patch.siteId : prev.siteId;
    if (!fullName || !role || !siteId) {
      return false;
    }
    const phone = patch.phone !== void 0 ? patch.phone ? String(patch.phone).trim() : void 0 : prev.phone;
    const email = patch.email !== void 0 ? patch.email ? String(patch.email).trim() : void 0 : prev.email;
    const active = patch.active !== void 0 ? patch.active !== false : prev.active !== false;
    const nextStaff = [...demoState.value.staff];
    nextStaff[idx] = {
      ...prev,
      fullName,
      role,
      siteId,
      phone,
      email,
      active
    };
    demoState.value = { ...demoState.value, staff: nextStaff };
    return true;
  };
  const removeStaff = (staffId) => {
    demoState.value = {
      ...demoState.value,
      staff: demoState.value.staff.filter((s) => s.id !== staffId),
      checklistsByNiche: clearAssigneeInChecklists(
        demoState.value.checklistsByNiche,
        staffId
      )
    };
  };
  const addChecklistTask = (niche, payload) => {
    if (!DEMO_CHECKLIST_NICHES.has(niche)) {
      return null;
    }
    const task = buildChecklistTaskFromPayload(niche, payload);
    if (!task) {
      return null;
    }
    const prev = demoState.value.checklistsByNiche[niche] ?? [];
    const nextChecklistsByNiche = {
      ...demoState.value.checklistsByNiche,
      [niche]: [...prev, task]
    };
    demoState.value = {
      ...demoState.value,
      checklistsByNiche: nextChecklistsByNiche
    };
    seedChecklistsTemperatureAi(demoState.value.checklistsByNiche);
    return task.id;
  };
  const removeChecklistTask = (niche, taskId) => {
    if (!DEMO_CHECKLIST_NICHES.has(niche) || typeof taskId !== "string") {
      return false;
    }
    const prev = demoState.value.checklistsByNiche[niche];
    if (!Array.isArray(prev)) {
      return false;
    }
    const next = prev.filter((t) => t.id !== taskId);
    if (next.length === prev.length) {
      return false;
    }
    demoState.value = {
      ...demoState.value,
      checklistsByNiche: {
        ...demoState.value.checklistsByNiche,
        [niche]: next
      }
    };
    return true;
  };
  const resetDemoState = () => {
    demoState.value = createDefaultState();
  };
  return {
    demoState,
    setChecklistsByNiche,
    addStaff,
    updateStaff,
    removeStaff,
    addChecklistTask,
    removeChecklistTask,
    resetDemoState
  };
};
function getGrainCoolingTaskFromDemoState(demoStateRef) {
  var _a2, _b2;
  const { id, niche } = task_grain_cooling;
  const list = (_b2 = (_a2 = demoStateRef.value) == null ? void 0 : _a2.checklistsByNiche) == null ? void 0 : _b2[niche];
  if (!Array.isArray(list)) {
    return null;
  }
  return list.find((t) => (t == null ? void 0 : t.id) === id) ?? null;
}
function resolveGrainCoolingTaskFromDemoState(task, demoStateRef) {
  if (!(task == null ? void 0 : task.id) || task.id !== task_grain_cooling.id) {
    return task;
  }
  return getGrainCoolingTaskFromDemoState(demoStateRef) ?? task;
}
function getGrainCoolingTaskAndMeasurementByRowIndex(demoStateRef, measurementRowIndex) {
  const task = getGrainCoolingTaskFromDemoState(demoStateRef);
  const measurements = Array.isArray(task == null ? void 0 : task.measurements) ? task.measurements : [];
  const idx = typeof measurementRowIndex === "number" && Number.isFinite(measurementRowIndex) && measurementRowIndex >= 0 ? measurementRowIndex : -1;
  if (!task || idx < 0) {
    return {
      task,
      measurementRow: null,
      measurementRowIndex: idx,
      measurements
    };
  }
  if (idx >= measurements.length) {
    return {
      task,
      measurementRow: null,
      measurementRowIndex: idx,
      measurements
    };
  }
  return {
    task,
    measurementRow: measurements[idx] ?? null,
    measurementRowIndex: idx,
    measurements
  };
}
function isGrainCoolingScenarioSuppressedForPath(pathname) {
  if (typeof pathname !== "string" || pathname === "") {
    return false;
  }
  if (/^\/batch(\/|$)/.test(pathname)) {
    return true;
  }
  if (/^\/[^/]+\/batch\//.test(pathname)) {
    return true;
  }
  if (/^\/report\/\d{4}-\d{2}-\d{2}/.test(pathname)) {
    return true;
  }
  if (/^\/[^/]+\/report\/\d{4}-\d{2}-\d{2}/.test(pathname)) {
    return true;
  }
  return false;
}
const KEY$1 = () => task_grain_cooling.sessionStorageKey;
function readGrainCoolingSessionStorage() {
  try {
    if (typeof sessionStorage === "undefined") {
      return {};
    }
    const raw = sessionStorage.getItem(KEY$1());
    if (!raw) {
      return {};
    }
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? { ...data } : {};
  } catch {
    return {};
  }
}
function mergeGrainCoolingSessionStorage(patch) {
  try {
    if (typeof sessionStorage === "undefined") {
      return {};
    }
    const prev = readGrainCoolingSessionStorage();
    const next = { ...prev, ...patch };
    sessionStorage.setItem(KEY$1(), JSON.stringify(next));
    return readGrainCoolingSessionStorage();
  } catch (e) {
    return {};
  }
}
function finalizeGrainCoolingNotificationStorage(finalPatch) {
  const written = mergeGrainCoolingSessionStorage(finalPatch);
  return written;
}
const STORAGE_KEY = task_grain_cooling.sessionStorageKey;
function loadPersistedNotification() {
  try {
    if (typeof sessionStorage === "undefined") {
      return null;
    }
    if (task_grain_cooling.clearGrainCoolingSessionStorageBeforeLoad) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    const data = readGrainCoolingSessionStorage();
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      return null;
    }
    const launched = Boolean(data.notificationLaunched);
    const countdownDone = Boolean(data.notificationCountdownCompleted);
    const scenarioTaskDone = data.status === "completed";
    const flowComplete = launched && countdownDone || scenarioTaskDone;
    const rawWindow = data.notificationProblemWindowMs;
    const notificationProblemWindowMs = typeof rawWindow === "number" && Number.isFinite(rawWindow) && rawWindow >= 0 ? rawWindow : null;
    const out = {
      notificationLaunched: launched,
      notificationLaunchedAt: typeof data.notificationLaunchedAt === "string" ? data.notificationLaunchedAt : null,
      notificationCountdownCompleted: countdownDone,
      notificationFlowLogicallyComplete: flowComplete,
      notificationProblemWindowMs,
      notificationLogicalCycleCompletedAt: typeof data.notificationLogicalCycleCompletedAt === "string" ? data.notificationLogicalCycleCompletedAt : null
    };
    return out;
  } catch (e) {
    return null;
  }
}
const useTaskGrainCoolingStore = defineStore(task_grain_cooling.piniaStoreId, {
  state: () => {
    const persisted = loadPersistedNotification();
    const logicalComplete = Boolean(persisted == null ? void 0 : persisted.notificationFlowLogicallyComplete);
    const launchedAtForUi = logicalComplete && typeof (persisted == null ? void 0 : persisted.notificationLaunchedAt) === "string" ? persisted.notificationLaunchedAt : null;
    task_grain_cooling.notificationLaunchedAt = launchedAtForUi;
    task_grain_cooling.notificationBannerActive = false;
    task_grain_cooling.notificationCountdownCompleted = Boolean(
      persisted == null ? void 0 : persisted.notificationCountdownCompleted
    );
    const initial = {
      /**
       * Оповещение уже было **для блокировки повторной цепочки** — только если полный цикл в storage завершён
       * (`notificationLaunched` + `notificationCountdownCompleted`), иначе после reload снова оповещение и новый отсчёт.
       */
      notificationLaunched: logicalComplete ?? false,
      /** ISO-время запуска оповещения; только если логически завершённый цикл, иначе `null` (новый отсчёт с нуля). */
      notificationLaunchedAt: launchedAtForUi,
      /**
       * Полоса: только `showNotificationBannerAfterToast()` из `useGlobalTaskReminder` сразу после оповещения (не из sessionStorage при init).
       */
      notificationBannerActive: false,
      /**
       * Отсчёт `measurementProblemDelayMs` после оповещения завершился (попытка смены статуса замера на `problem`).
       */
      notificationCountdownCompleted: Boolean(persisted == null ? void 0 : persisted.notificationCountdownCompleted),
      /**
       * Запрос на открытие задачи из оповещения или полосы: после перехода на чек-листы
       * `ChecklistsSection` находит задачу и открывает модалку, затем сбрасывает в `null`.
       * @type {PendingDeepLink}
       */
      pendingDeepLink: (
        /** @type {PendingDeepLink} */
        null
      ),
      /**
       * Если `true`, после открытия `ShowTaskModal` нужно программно открыть drawer
       * по первому замеру со статусом `pending` (тот же сценарий, что клик по строке).
       */
      autoOpenPendingAfterTaskModal: false,
      /**
       * Окно до смены статуса на `problem` в мс, зафиксированное при показе оповещения (как у `setTimeout` в `useGlobalTaskReminder`).
       * `null` — до первого показа; после reload подтягивается из sessionStorage.
       */
      notificationProblemWindowMs: typeof (persisted == null ? void 0 : persisted.notificationProblemWindowMs) === "number" ? persisted.notificationProblemWindowMs : null,
      /**
       * ISO-время срабатывания таймера после оповещения (единственное «логическое завершение» цикла); пишется только там.
       */
      notificationLogicalCycleCompletedAt: typeof (persisted == null ? void 0 : persisted.notificationLogicalCycleCompletedAt) === "string" ? persisted.notificationLogicalCycleCompletedAt : null
    };
    return initial;
  },
  actions: {
    /**
     * Снимок полей уведомления для merge в sessionStorage (промежуточные записи — без лога «завершен»).
     *
     * @returns {Record<string, unknown>}
     */
    notificationSnapshotForStorage() {
      return {
        notificationLaunched: this.notificationLaunched,
        notificationLaunchedAt: this.notificationLaunchedAt,
        notificationBannerActive: this.notificationBannerActive,
        notificationCountdownCompleted: this.notificationCountdownCompleted,
        notificationProblemWindowMs: this.notificationProblemWindowMs,
        notificationLogicalCycleCompletedAt: this.notificationLogicalCycleCompletedAt
      };
    },
    /**
     * Промежуточный persist (тост, полоса, сброс до завершения). Только `mergeGrainCoolingSessionStorage`.
     *
     * @returns {void}
     */
    persistGrainCoolingSession() {
      task_grain_cooling.notificationCountdownCompleted = this.notificationCountdownCompleted;
      mergeGrainCoolingSessionStorage(this.notificationSnapshotForStorage());
    },
    /**
     * Фиксирует факт показа глобального оповещения: дальше `useGlobalTaskReminder` не запускает повторно цепочку с нуля.
     * Пишет `notificationLaunched` и ISO-время в state и в `sessionStorage`.
     *
     * @returns {void}
     */
    markNotificationLaunched() {
      this.notificationLaunched = true;
      this.notificationLaunchedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.notificationProblemWindowMs = task_grain_cooling.measurementProblemDelayMs;
      task_grain_cooling.notificationLaunchedAt = this.notificationLaunchedAt;
      this.persistGrainCoolingSession();
    },
    /**
     * Показать полосу под шапкой сразу после оповещения (не при старте SPA и не по отдельному таймеру полосы).
     *
     * @returns {void}
     */
    showNotificationBannerAfterToast() {
      if (!task_grain_cooling.scenarioProcessAllowed) {
        return;
      }
      this.notificationBannerActive = true;
      task_grain_cooling.notificationBannerActive = true;
      this.persistGrainCoolingSession();
    },
    /**
     * Скрыть полосу и убрать из sessionStorage.
     *
     * @returns {void}
     */
    clearNotificationBanner() {
      if (!this.notificationBannerActive) {
        return;
      }
      this.notificationBannerActive = false;
      task_grain_cooling.notificationBannerActive = false;
      this.persistGrainCoolingSession();
    },
    /**
     * Отсчёт после оповещения (`measurementProblemDelayMs`) дошёл до конца; вызывается из таймера в `useGlobalTaskReminder`
     * после попытки `applyGrainCoolingProblemIfPending` (смена статуса замера могла произойти или нет — не важно).
     * Единственная точка логического завершения цикла: `notificationCountdownCompleted`, метка времени в storage.
     *
     * @returns {void}
     */
    markNotificationCountdownCompleted() {
      this.notificationCountdownCompleted = true;
      task_grain_cooling.notificationCountdownCompleted = true;
      this.notificationLogicalCycleCompletedAt = (/* @__PURE__ */ new Date()).toISOString();
      finalizeGrainCoolingNotificationStorage(this.notificationSnapshotForStorage());
    },
    /**
     * Сохраняет намерение открыть задачу на секции чек-листов (например после клика «Перейти к задаче» в оповещении или на полосе).
     * `ChecklistsSection` по `pendingDeepLink` переключает нишу и открывает модалку.
     *
     * @param {string} taskId — id задачи в `checklistsByNiche[niche]`.
     * @param {string} niche — ключ ниши (`coffee` и т.д.).
     * @param {{ autoOpenPending?: boolean }} [options]
     *   `autoOpenPending: true` — после открытия модалки открыть drawer по первому `pending` замеру.
     * @returns {void}
     */
    requestOpenTaskOnChecklists(taskId, niche, options = {}) {
      if (!task_grain_cooling.scenarioProcessAllowed) {
        return;
      }
      const autoOpenPending = Boolean(options.autoOpenPending);
      this.pendingDeepLink = { taskId, niche };
      this.autoOpenPendingAfterTaskModal = autoOpenPending;
    },
    /**
     * Сбрасывает очередь диплинка после того, как `ChecklistsSection` открыл задачу или решил, что задачи нет.
     *
     * @returns {void}
     */
    clearPendingDeepLink() {
      this.pendingDeepLink = null;
    },
    /**
     * Сбрасывает флаг автооткрытия drawer; вызывается из `ShowTaskModal` после попытки открыть pending.
     *
     * @returns {void}
     */
    clearAutoOpenPendingAfterTaskModal() {
      this.autoOpenPendingAfterTaskModal = false;
    }
  }
});
const KEY = task_grain_cooling.sessionStorageKey;
function isGrainCoolingScenarioStorageCompleted() {
  try {
    if (typeof sessionStorage === "undefined") {
      return false;
    }
    const raw = sessionStorage.getItem(KEY);
    if (!raw) {
      return false;
    }
    const data = JSON.parse(raw);
    return (data == null ? void 0 : data.status) === "completed";
  } catch {
    return false;
  }
}
function markGrainCoolingScenarioStoredCompleted() {
  const cancel = task_grain_cooling.cancelGrainCoolingReminderTimers;
  if (typeof cancel === "function") {
    cancel();
    task_grain_cooling.cancelGrainCoolingReminderTimers = null;
  }
  task_grain_cooling.scenarioProcessAllowed = false;
  task_grain_cooling.notificationBannerActive = false;
  const completedAt = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const store = useTaskGrainCoolingStore();
    store.notificationCountdownCompleted = true;
    store.notificationLogicalCycleCompletedAt = completedAt;
    task_grain_cooling.notificationCountdownCompleted = true;
    store.notificationBannerActive = false;
    finalizeGrainCoolingNotificationStorage({
      ...store.notificationSnapshotForStorage(),
      notificationBannerActive: false,
      notificationCountdownCompleted: true,
      notificationLogicalCycleCompletedAt: completedAt,
      status: "completed"
    });
  } catch {
    finalizeGrainCoolingNotificationStorage({
      notificationCountdownCompleted: true,
      notificationLogicalCycleCompletedAt: completedAt,
      status: "completed"
    });
  }
}
function findFirstPendingMeasurementIndex(measurements) {
  var _a2;
  if (!Array.isArray(measurements)) {
    return -1;
  }
  for (let i = 0; i < measurements.length; i++) {
    if (((_a2 = measurements[i]) == null ? void 0 : _a2.status) === "pending") {
      return i;
    }
  }
  return -1;
}
function hasGrainCoolingPendingMeasurement(demoStateRef) {
  return getGrainCoolingFirstPendingMeasurementIndex(demoStateRef) >= 0;
}
function grainCoolingScenarioShouldRun(demoStateRef) {
  const task = getGrainCoolingTaskFromDemoState(demoStateRef);
  const measurements = Array.isArray(task == null ? void 0 : task.measurements) ? task.measurements : [];
  const firstPendingIndex = findFirstPendingMeasurementIndex(measurements);
  return firstPendingIndex >= 0;
}
function syncGrainCoolingScenarioProcessAllowed(demoStateRef, pathname) {
  const consentAccepted = typeof localStorage !== "undefined" && localStorage.getItem(LS_CONSENT_VERSION) === "true";
  const dataOk = grainCoolingScenarioShouldRun(demoStateRef);
  const suppressed = pathname ? isGrainCoolingScenarioSuppressedForPath(pathname) : false;
  const storedDone = isGrainCoolingScenarioStorageCompleted();
  task_grain_cooling.scenarioProcessAllowed = consentAccepted && dataOk && !suppressed && !storedDone;
}
function getGrainCoolingFirstPendingMeasurementIndex(demoStateRef) {
  const task = getGrainCoolingTaskFromDemoState(demoStateRef);
  const measurements = Array.isArray(task == null ? void 0 : task.measurements) ? task.measurements : [];
  return findFirstPendingMeasurementIndex(measurements);
}
function formatLocalTimeHHmm(date = /* @__PURE__ */ new Date()) {
  const h2 = date.getHours();
  const m = date.getMinutes();
  return `${String(h2).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function syncGrainCoolingPendingMeasurementTimeToUserLocal(demoStateRef) {
  var _a2;
  const { id: taskId, niche } = task_grain_cooling;
  const measurementIndex = task_grain_cooling.measurementIndex;
  if (measurementIndex == null || measurementIndex < 0) {
    return false;
  }
  const { task, measurementRow: current, measurements } = getGrainCoolingTaskAndMeasurementByRowIndex(
    demoStateRef,
    measurementIndex
  );
  if (!task || measurementIndex >= measurements.length || current == null) {
    return false;
  }
  if ((current == null ? void 0 : current.status) !== "pending") {
    return false;
  }
  const state = demoStateRef.value;
  const tasks = (_a2 = state == null ? void 0 : state.checklistsByNiche) == null ? void 0 : _a2[niche];
  if (!Array.isArray(tasks)) {
    return false;
  }
  const localTime = formatLocalTimeHHmm(/* @__PURE__ */ new Date());
  const nextMeasurements = measurements.map(
    (m, idx) => idx === measurementIndex ? { ...m, time: localTime } : m
  );
  const nextTasks = tasks.map(
    (t) => t.id === taskId ? { ...t, measurements: nextMeasurements } : t
  );
  demoStateRef.value = {
    ...state,
    checklistsByNiche: {
      ...state.checklistsByNiche,
      [niche]: nextTasks
    }
  };
  return true;
}
function applyGrainCoolingProblemIfPending(demoStateRef) {
  var _a2;
  const { id: taskId, niche } = task_grain_cooling;
  const measurementIndex = task_grain_cooling.measurementIndex;
  if (measurementIndex == null || measurementIndex < 0) {
    return false;
  }
  const { task, measurementRow: current, measurements } = getGrainCoolingTaskAndMeasurementByRowIndex(
    demoStateRef,
    measurementIndex
  );
  if (!task) {
    unlockGrainCoolingMeasurementIndex();
    return false;
  }
  if (measurementIndex >= measurements.length || current == null) {
    unlockGrainCoolingMeasurementIndex();
    return false;
  }
  if ((current == null ? void 0 : current.status) !== "pending") {
    unlockGrainCoolingMeasurementIndex();
    return false;
  }
  const state = demoStateRef.value;
  const tasks = (_a2 = state == null ? void 0 : state.checklistsByNiche) == null ? void 0 : _a2[niche];
  if (!Array.isArray(tasks)) {
    unlockGrainCoolingMeasurementIndex();
    return false;
  }
  const nextMeasurements = measurements.map(
    (m, idx) => idx === measurementIndex ? { ...m, status: "problem" } : m
  );
  const nextTasks = tasks.map(
    (t) => t.id === taskId ? { ...t, measurements: nextMeasurements } : t
  );
  demoStateRef.value = {
    ...state,
    checklistsByNiche: {
      ...state.checklistsByNiche,
      [niche]: nextTasks
    }
  };
  task_grain_cooling.lastProblemAppliedMeasurementIndex = measurementIndex;
  unlockGrainCoolingMeasurementIndex();
  return true;
}
const GlobalTaskReminderToast = defineAsyncComponent(
  () => import("./assets/GlobalTaskReminderToast-BB35q0ZE.js")
);
function useGlobalTaskReminder() {
  const { demoState: demoState2 } = useDemoState();
  let toastTimerId = null;
  let problemTimerId = null;
  let grainCoolingReminderToastId = null;
  function cancelGrainCoolingReminderTimersRegistered() {
    if (toastTimerId !== null) {
      clearTimeout(toastTimerId);
      toastTimerId = null;
    }
    if (problemTimerId !== null) {
      clearTimeout(problemTimerId);
      problemTimerId = null;
    }
    if (grainCoolingReminderToastId != null && toast.isActive(grainCoolingReminderToastId)) {
      toast.remove(grainCoolingReminderToastId);
    }
    grainCoolingReminderToastId = null;
    unlockGrainCoolingMeasurementIndex();
  }
  function requestGrainCoolingBannerAfterNotificationSurface() {
    if (!task_grain_cooling.scenarioProcessAllowed) {
      return;
    }
    if (!hasGrainCoolingPendingMeasurement(demoState2)) {
      return;
    }
    const grainStore = useTaskGrainCoolingStore();
    grainStore.showNotificationBannerAfterToast();
  }
  function scheduleReminderChain() {
    if (!task_grain_cooling.scenarioProcessAllowed) {
      return;
    }
    if (toastTimerId !== null || problemTimerId !== null) {
      return;
    }
    const grainStore = useTaskGrainCoolingStore();
    if (grainStore.notificationLaunched) {
      return;
    }
    const lockedIdx = getGrainCoolingFirstPendingMeasurementIndex(demoState2);
    if (lockedIdx < 0) {
      return;
    }
    lockGrainCoolingMeasurementIndex(lockedIdx);
    task_grain_cooling.cancelGrainCoolingReminderTimers = cancelGrainCoolingReminderTimersRegistered;
    toastTimerId = window.setTimeout(() => {
      toastTimerId = null;
      if (!task_grain_cooling.scenarioProcessAllowed) {
        unlockGrainCoolingMeasurementIndex();
        return;
      }
      if (!hasGrainCoolingPendingMeasurement(demoState2)) {
        unlockGrainCoolingMeasurementIndex();
        return;
      }
      readGrainCoolingSessionStorage();
      syncGrainCoolingPendingMeasurementTimeToUserLocal(demoState2);
      grainStore.markNotificationLaunched();
      const problemDelayMs = grainStore.notificationProblemWindowMs ?? task_grain_cooling.measurementProblemDelayMs;
      grainCoolingReminderToastId = toast(
        ({ closeToast }) => h(GlobalTaskReminderToast, { closeToast }),
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: false,
          icon: false,
          theme: "dark",
          toastClassName: task_grain_cooling.toastifyToastClassName
        }
      );
      requestGrainCoolingBannerAfterNotificationSurface();
      problemTimerId = window.setTimeout(() => {
        problemTimerId = null;
        if (!task_grain_cooling.scenarioProcessAllowed) {
          return;
        }
        applyGrainCoolingProblemIfPending(demoState2);
        if (grainCoolingReminderToastId != null && toast.isActive(grainCoolingReminderToastId)) {
          toast.remove(grainCoolingReminderToastId);
        }
        grainCoolingReminderToastId = null;
        grainStore.markNotificationCountdownCompleted();
      }, problemDelayMs);
    }, task_grain_cooling.initialToastDelayMs);
  }
  watch(
    () => task_grain_cooling.scenarioProcessAllowed,
    (allowed) => {
      if (!allowed) {
        task_grain_cooling.cancelGrainCoolingReminderTimers = null;
        cancelGrainCoolingReminderTimersRegistered();
        return;
      }
      scheduleReminderChain();
    },
    { immediate: true }
  );
  onUnmounted(() => {
    task_grain_cooling.cancelGrainCoolingReminderTimers = null;
    cancelGrainCoolingReminderTimersRegistered();
  });
}
let demoGrainCoolingEntryActive = false;
function useGrainCoolingDemoEntry() {
  if (demoGrainCoolingEntryActive) {
    return;
  }
  demoGrainCoolingEntryActive = true;
  const { demoState: demoState2 } = useDemoState();
  const page = usePage();
  const grainStore = useTaskGrainCoolingStore();
  function syncAndReact() {
    const pathname = typeof window !== "undefined" ? window.location.pathname : page.url;
    syncGrainCoolingScenarioProcessAllowed(demoState2, pathname);
    if (!task_grain_cooling.scenarioProcessAllowed) {
      grainStore.clearNotificationBanner();
      if (typeof task_grain_cooling.cancelGrainCoolingReminderTimers === "function") {
        task_grain_cooling.cancelGrainCoolingReminderTimers();
      }
    }
  }
  syncAndReact();
  watch(
    () => [demoState2.value, page.url],
    syncAndReact,
    { deep: true, immediate: false }
  );
  useGlobalTaskReminder();
  onUnmounted(() => {
    demoGrainCoolingEntryActive = false;
    task_grain_cooling.scenarioProcessAllowed = false;
  });
}
function useGrainCoolingStore() {
  if (!demoGrainCoolingEntryActive) {
    throw new Error(
      "[task_grain_cooling] useGrainCoolingStore: сначала useGrainCoolingDemoEntry() в PublicLayout.vue"
    );
  }
  if (!task_grain_cooling.scenarioProcessAllowed) {
    return null;
  }
  return useTaskGrainCoolingStore();
}
function registerGrainCoolingChecklistsDeepLinkWatcher(consumePendingDeepLink) {
  let stopPendingDeepLink = null;
  watch(
    () => task_grain_cooling.scenarioProcessAllowed,
    (allowed) => {
      if (stopPendingDeepLink) {
        stopPendingDeepLink();
        stopPendingDeepLink = null;
      }
      if (!allowed) {
        return;
      }
      const grainCoolingStore = useGrainCoolingStore();
      if (!grainCoolingStore) {
        return;
      }
      stopPendingDeepLink = watch(
        () => grainCoolingStore.pendingDeepLink,
        (p) => {
          if (p) {
            void consumePendingDeepLink();
          }
        },
        { flush: "post", immediate: true }
      );
    },
    { immediate: true }
  );
}
const _sfc_main$v = /* @__PURE__ */ Object.assign({ name: "GrainCoolingNotificationBanner" }, {
  __name: "GrainCoolingNotificationBanner",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const grainStore = useTaskGrainCoolingStore();
    const { notificationBannerActive, notificationLaunched, notificationProblemWindowMs } = storeToRefs(grainStore);
    const remainingMs = ref(0);
    let intervalId = null;
    function tick() {
      const at = task_grain_cooling.notificationLaunchedAt;
      if (!at || typeof at !== "string") {
        remainingMs.value = 0;
        return;
      }
      const start = Date.parse(at);
      if (!Number.isFinite(start)) {
        remainingMs.value = 0;
        return;
      }
      const windowMs = notificationProblemWindowMs.value != null && Number.isFinite(notificationProblemWindowMs.value) ? notificationProblemWindowMs.value : task_grain_cooling.measurementProblemDelayMs;
      const end = start + windowMs;
      remainingMs.value = Math.max(0, end - Date.now());
    }
    function stopTickLoop() {
      if (intervalId != null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    }
    function startTickLoopIfNeeded() {
      if (intervalId != null) {
        return;
      }
      if (!notificationBannerActive.value || !notificationLaunched.value) {
        return;
      }
      const at = task_grain_cooling.notificationLaunchedAt;
      if (!at || typeof at !== "string") {
        return;
      }
      tick();
      intervalId = window.setInterval(tick, 250);
    }
    const showBanner = computed(
      () => notificationBannerActive.value && notificationLaunched.value && Boolean(task_grain_cooling.notificationLaunchedAt) && remainingMs.value > 0
    );
    const countdownLabel = computed(() => {
      const ms = remainingMs.value;
      const totalSec = Math.max(0, Math.ceil(ms / 1e3));
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${m}:${String(s).padStart(2, "0")}`;
    });
    watch(
      () => [
        notificationBannerActive.value,
        notificationLaunched.value,
        task_grain_cooling.notificationLaunchedAt,
        notificationProblemWindowMs.value,
        task_grain_cooling.measurementProblemDelayMs
      ],
      () => {
        stopTickLoop();
        startTickLoopIfNeeded();
      },
      { immediate: true }
    );
    watch(
      () => [notificationBannerActive.value, remainingMs.value],
      ([active, ms]) => {
        if (!active || ms > 0) {
          return;
        }
        grainStore.clearNotificationBanner();
      },
      { immediate: true }
    );
    onUnmounted(() => {
      stopTickLoop();
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (showBanner.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "grain-cooling-notification-banner",
          role: "status",
          "aria-live": "polite"
        }, _attrs))} data-v-1f8dc3e0><div class="grain-cooling-notification-banner__inner container" data-v-1f8dc3e0><p class="grain-cooling-notification-banner__text" data-v-1f8dc3e0>${ssrInterpolate(unref(t)(unref(task_grain_cooling).toastTitleKey))} — ${ssrInterpolate(unref(t)(unref(task_grain_cooling).toastTaskNameKey))}: <span class="grain-cooling-notification-banner__countdown" data-v-1f8dc3e0>${ssrInterpolate(countdownLabel.value)}</span></p><button type="button" class="grain-cooling-notification-banner__go" data-v-1f8dc3e0>${ssrInterpolate(unref(t)(unref(task_grain_cooling).toastButtonNavigateLabelKey))}</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/task_grain_cooling/GrainCoolingNotificationBanner.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const GrainCoolingNotificationBanner = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-1f8dc3e0"]]);
const _sfc_main$u = /* @__PURE__ */ Object.assign({ name: "ClientOnly" }, {
  __name: "ClientOnly",
  __ssrInlineRender: true,
  setup(__props) {
    const mounted = ref(false);
    onMounted(() => {
      mounted.value = true;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (mounted.value) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ClientOnly.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
function getApiErrors(error) {
  var _a2;
  const errorData = error && typeof error === "object" && "response" in error ? ((_a2 = error.response) == null ? void 0 : _a2.data) ?? {} : {};
  let errorMessages = "";
  if (typeof errorData.errors !== "undefined") {
    if (errorData.errors) {
      if (Array.isArray(errorData.errors) && errorData.errors.length) {
        if (errorData.errors.every(
          (item) => typeof item === "object" && item !== null
        )) {
          errorMessages = errorData.errors.map((obj) => Object.values(obj).join("\n")).join("\n");
        } else if (errorData.errors.every((item) => typeof item === "string")) {
          errorMessages = errorData.errors.join("\n");
        } else {
          errorMessages = errorData.message || "An unknown error occurred";
        }
      } else if (typeof errorData.errors === "object" && errorData.errors !== null) {
        const hasArrays = Object.values(errorData.errors).some(
          (value) => Array.isArray(value) && value.length > 0
        );
        if (hasArrays) {
          errorMessages = Object.values(errorData.errors).flat().map(
            (item) => Array.isArray(item) ? item.join("\n") : String(item)
          ).join("\n");
        } else {
          errorMessages = Object.values(errorData.errors).flat().join("\n") || errorData.message || "Validation failed";
        }
      } else {
        errorMessages = errorData.message || "An unknown error occurred";
      }
    } else if (Array.isArray(errorData.errors) && !errorData.errors.length) {
      errorMessages = errorData.message || "Validation failed";
    }
  } else {
    errorMessages = typeof errorData.message === "string" && errorData.message || "An unknown error occurred";
  }
  return errorMessages;
}
function isCanceledError(error) {
  var _a2, _b2;
  if ((_b2 = (_a2 = axios).isCancel) == null ? void 0 : _b2.call(_a2, error)) {
    return true;
  }
  return (error == null ? void 0 : error.code) === "ERR_CANCELED" || (error == null ? void 0 : error.name) === "CanceledError" || (error == null ? void 0 : error.name) === "AbortError";
}
class ApiAxios {
  /**
   * Создает axios-клиент с базовым URL и общими заголовками.
   */
  constructor(options = {}) {
    this.options = { ...options };
    this.client = axios.create({
      baseURL: this.options.baseURL ?? "",
      withCredentials: this.options.withCredentials ?? false,
      validateStatus: (status) => status === 200,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        ...this.options.headers
      }
    });
    this.client.interceptors.request.use((config) => {
      var _a2, _b2;
      const locale2 = (_b2 = (_a2 = i18n == null ? void 0 : i18n.global) == null ? void 0 : _a2.locale) == null ? void 0 : _b2.value;
      if (locale2) {
        config.headers = config.headers || {};
        config.headers["X-Locale"] = locale2;
      }
      return config;
    });
  }
  /** Привязывает abort к `beforeunload`, чтобы не оставлять висящие запросы при уходе со страницы. */
  _attachUnloadAbort(userSignal, useUnload = true) {
    const controller = new AbortController();
    const onUnload = () => {
      try {
        controller.abort(new DOMException("Page unloading", "AbortError"));
      } catch {
        controller.abort();
      }
    };
    if (useUnload) {
      window.addEventListener("beforeunload", onUnload);
    }
    let signal = controller.signal;
    if (userSignal && typeof AbortSignal !== "undefined" && AbortSignal.any) {
      signal = AbortSignal.any([userSignal, controller.signal]);
    } else if (userSignal) {
      signal = userSignal;
    }
    return {
      signal,
      detach: () => {
        if (useUnload) {
          window.removeEventListener("beforeunload", onUnload);
        }
      }
    };
  }
  /** Готовит конфиг запроса: выносит служебные флаги и добавляет `signal` для отмены. */
  _prepareConfig(config = {}) {
    const { unloadAbort, signal: userSignal, ...axiosConfig } = config;
    const { signal, detach } = this._attachUnloadAbort(
      userSignal,
      unloadAbort !== false
    );
    return { axiosConfig: { ...axiosConfig, signal }, detach };
  }
  /** Единая обработка ошибок: либо возвращает строку, либо показывает toast. */
  _handleError(error, returnError) {
    var _a2;
    if (isCanceledError(error)) {
      return null;
    }
    const showToast = this.options.showToast;
    if ((error == null ? void 0 : error.message) === "Network Error") {
      showToast == null ? void 0 : showToast(
        "Error",
        "No internet connection or the server is unavailable."
      );
      return returnError ? "Network Error" : null;
    }
    if ((error == null ? void 0 : error.code) === "ECONNABORTED") {
      showToast == null ? void 0 : showToast(
        "Error",
        "The request took too long, the server might be unavailable."
      );
      return returnError ? "Timeout" : null;
    }
    const status = ((_a2 = error == null ? void 0 : error.response) == null ? void 0 : _a2.status) ?? "Error";
    if (status === 419) {
      showToast == null ? void 0 : showToast(
        "Session expired",
        "The page will reload to refresh the session."
      );
      setTimeout(() => window.location.reload(), 1500);
      return returnError ? "Session expired" : null;
    }
    let errorMessages = getApiErrors(error);
    if (typeof errorMessages !== "string") {
      errorMessages = "An unknown error occurred.";
    }
    if (returnError) {
      return errorMessages;
    }
    showToast == null ? void 0 : showToast(String(status), errorMessages);
    return null;
  }
  /**
   * Выполняет GET-запрос и возвращает полный axios response.
   */
  async get(url, params = {}, returnError = false, config = {}) {
    const { axiosConfig, detach } = this._prepareConfig(config);
    try {
      const response = await this.client.get(url, {
        ...axiosConfig,
        params
      });
      return response.data;
    } catch (error) {
      return this._handleError(error, returnError);
    } finally {
      detach();
    }
  }
  /**
   * Выполняет POST-запрос и возвращает `response.data`.
   */
  async post(url, data, returnError = false, config = {}) {
    const { axiosConfig, detach } = this._prepareConfig(config);
    try {
      const response = await this.client.post(url, data, axiosConfig);
      return response.data;
    } catch (error) {
      return this._handleError(error, returnError);
    } finally {
      detach();
    }
  }
  /**
   * Выполняет PUT-запрос и возвращает `response.data`.
   */
  async put(url, data, returnError = false, config = {}) {
    const { axiosConfig, detach } = this._prepareConfig(config);
    try {
      const response = await this.client.put(url, data, axiosConfig);
      return response.data;
    } catch (error) {
      return this._handleError(error, returnError);
    } finally {
      detach();
    }
  }
  /**
   * Выполняет DELETE-запрос и возвращает `response.data`.
   */
  async destroy(url, returnError = false, config = {}) {
    const { axiosConfig, detach } = this._prepareConfig(config);
    try {
      const response = await this.client.delete(url, axiosConfig);
      return response.data;
    } catch (error) {
      return this._handleError(error, returnError);
    } finally {
      detach();
    }
  }
}
const defaultApiAxios = new ApiAxios({
  baseURL: ""
});
const PING_THROTTLE_MS = 3e4;
function readMetaCsrf() {
  var _a2;
  return ((_a2 = document.head.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a2.getAttribute("content")) || "";
}
function writeMetaCsrf(token) {
  var _a2, _b2, _c;
  const el = document.head.querySelector('meta[name="csrf-token"]');
  if (el) el.setAttribute("content", token);
  if ((_c = (_b2 = (_a2 = window.axios) == null ? void 0 : _a2.defaults) == null ? void 0 : _b2.headers) == null ? void 0 : _c.common) {
    window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
  }
}
function useSessionGuard() {
  let lastPingAt = 0;
  let inflight = false;
  const pingSession = async () => {
    var _a2;
    const now = Date.now();
    if (inflight) {
      return;
    }
    if (now - lastPingAt < PING_THROTTLE_MS) {
      return;
    }
    lastPingAt = now;
    inflight = true;
    try {
      const result = await defaultApiAxios.get("/session/ping", {}, true);
      if (!result || typeof result === "string" || (result == null ? void 0 : result.status) !== "success") {
        return;
      }
      const fresh = (_a2 = result == null ? void 0 : result.data) == null ? void 0 : _a2.csrf;
      if (fresh && fresh !== readMetaCsrf()) {
        writeMetaCsrf(fresh);
      }
    } finally {
      inflight = false;
    }
  };
  const onVisibilityChange = () => {
    if (!document.hidden) {
      void pingSession();
    }
  };
  onMounted(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  });
}
const _sfc_main$t = /* @__PURE__ */ Object.assign({ name: "PublicLayout" }, {
  __name: "PublicLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const ConsentOverlay = defineAsyncComponent(
      () => import("./assets/ConsentOverlay-C2YbvSyu.js")
    );
    const page = usePage();
    const isAboutPage = computed(() => page.component === "About");
    useSessionGuard();
    useGrainCoolingDemoEntry();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-wrapper" }, _attrs))}>`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$u, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(GrainCoolingNotificationBanner, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(GrainCoolingNotificationBanner)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<main class="${ssrRenderClass([{ "main-content--bg-style-white": isAboutPage.value }, "main-content"])}" scroll-region>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$u, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ConsentOverlay), null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ConsentOverlay))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/PublicLayout.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const FP_SCROLL_SNAP_OFF_CLASS = "about-page__fp-scroll--snap-off";
const _sfc_main$s = /* @__PURE__ */ Object.assign({
  name: "About",
  layout: _sfc_main$t
}, {
  __name: "About",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const WELCOME_MARKERS = Object.freeze([
      "W",
      "E",
      "L",
      "C",
      "O",
      "M",
      "E"
    ]);
    ref(null);
    const scrollRef = ref(null);
    const activeIndex = ref(0);
    const sectionCount = ref(0);
    const sectionsRef = ref([]);
    function getContext() {
      return {
        root: scrollRef.value,
        sections: sectionsRef.value
      };
    }
    function clamp(val, min, max) {
      return Math.min(max, Math.max(min, val));
    }
    function isReady(root, sections) {
      return Boolean(root && sections.length);
    }
    function initSections() {
      const { root } = getContext();
      if (!root) {
        sectionsRef.value = [];
        return;
      }
      sectionsRef.value = [...root.querySelectorAll(".about-fp-section")];
    }
    let programmaticNavIndex = null;
    let programmaticNavGen = 0;
    function syncActiveFromScroll() {
      if (programmaticNavIndex !== null) {
        return;
      }
      const { root, sections } = getContext();
      if (!isReady(root, sections)) {
        return;
      }
      const st = root.scrollTop;
      const maxScroll = Math.max(0, root.scrollHeight - root.clientHeight);
      const vh = root.clientHeight;
      const viewportTop = st;
      const viewportBottom = st + vh;
      const vCenter = viewportTop + vh / 2;
      if (maxScroll > 0 && st >= maxScroll - 1) {
        const last = sections.length - 1;
        if (activeIndex.value !== last) {
          activeIndex.value = last;
        }
        return;
      }
      let bestIdx = 0;
      let bestOverlap = -1;
      let bestCenterDist = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        const overlap = Math.max(
          0,
          Math.min(bottom, viewportBottom) - Math.max(top, viewportTop)
        );
        const secCenter = (top + bottom) / 2;
        const centerDist = Math.abs(vCenter - secCenter);
        if (overlap > bestOverlap || overlap === bestOverlap && overlap > 0 && centerDist < bestCenterDist) {
          bestOverlap = overlap;
          bestCenterDist = centerDist;
          bestIdx = i;
        }
      }
      if (bestOverlap <= 0) {
        let idx = 0;
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].offsetTop <= st + 1) {
            idx = i;
          } else {
            break;
          }
        }
        bestIdx = idx;
      }
      if (activeIndex.value !== bestIdx) {
        activeIndex.value = bestIdx;
      }
    }
    function goToSection(index) {
      const { root, sections } = getContext();
      if (!isReady(root, sections)) {
        return;
      }
      const sec = sections[index];
      if (!sec) {
        return;
      }
      const gen = ++programmaticNavGen;
      programmaticNavIndex = index;
      activeIndex.value = index;
      const rootRect = root.getBoundingClientRect();
      const secRect = sec.getBoundingClientRect();
      const top = root.scrollTop + (secRect.top - rootRect.top);
      root.scrollTo({ top, behavior: "smooth" });
      const finishProgrammaticNav = () => {
        if (gen !== programmaticNavGen) {
          return;
        }
        programmaticNavIndex = null;
        syncActiveFromScroll();
      };
      root.addEventListener("scrollend", finishProgrammaticNav, { once: true });
      window.setTimeout(finishProgrammaticNav, 900);
    }
    function navDotLetter(index) {
      const letter = WELCOME_MARKERS[index];
      if (letter) {
        return letter;
      }
      return String(index + 1);
    }
    function navDotAriaLabel(index) {
      const letter = WELCOME_MARKERS[index];
      const n = index + 1;
      if (letter) {
        return t("about.page.nav_dot_aria", { n, letter });
      }
      return t("about.page.nav_dot_aria_simple", { n });
    }
    let wheelForwardHandler = null;
    function handleAboutGlobalWheel(e) {
      const { root } = getContext();
      if (!root) {
        return;
      }
      const sc = root;
      const t2 = e.target;
      const inside = t2 instanceof Node && (sc === t2 || sc.contains(t2));
      if (inside) {
        if (sc.classList.contains(FP_SCROLL_SNAP_OFF_CLASS)) {
          sc.classList.remove(FP_SCROLL_SNAP_OFF_CLASS);
        }
        return;
      }
      const dir = Math.sign(e.deltaY);
      e.preventDefault();
      e.stopPropagation();
      const total = sectionCount.value;
      const cur = activeIndex.value;
      const nextIdx = dir === 0 || total < 1 ? cur : clamp(cur + dir, 0, total - 1);
      if (nextIdx === cur) {
        return;
      }
      sc.classList.remove(FP_SCROLL_SNAP_OFF_CLASS);
      goToSection(nextIdx);
    }
    onMounted(() => {
      nextTick(() => {
        initSections();
        const { root, sections } = getContext();
        if (isReady(root, sections)) {
          sectionCount.value = sections.length;
          syncActiveFromScroll();
        }
        wheelForwardHandler = handleAboutGlobalWheel;
        document.addEventListener("wheel", wheelForwardHandler, {
          passive: false,
          capture: true
        });
      });
    });
    onUnmounted(() => {
      programmaticNavGen += 1;
      programmaticNavIndex = null;
      sectionsRef.value = [];
      if (wheelForwardHandler) {
        document.removeEventListener("wheel", wheelForwardHandler, {
          passive: false,
          capture: true
        });
        wheelForwardHandler = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(`<div class="container about-page" data-v-58da0643><header class="about-page__title-bar" data-v-58da0643><h1 class="about-page__heading" data-v-58da0643>${ssrInterpolate(unref(t)("about.page.heading"))}</h1></header><div class="about-page__split" data-v-58da0643><aside class="about-page__photo" aria-hidden="true" data-v-58da0643><img class="about-page__photo-img"${ssrRenderAttr("src", "/images/avatar_500_500.jpg")} alt="" decoding="async" data-v-58da0643></aside><div class="about-page__fp" data-v-58da0643><div class="about-page__fp-scroll" tabindex="0" role="region"${ssrRenderAttr("aria-label", unref(t)("about.page.aria_sections"))} data-v-58da0643><section class="about-fp-section" data-v-58da0643><div class="about-fp" data-v-58da0643><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.intro.p1"))}</p><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.intro.p2"))}</p><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.intro.p3"))}</p>`);
      _push(ssrRenderComponent(_sfc_main$C, {
        name: "arrow-big-down-lines",
        class: "about-fp__intro-arrow",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</div></section><section class="about-fp-section" data-v-58da0643><div class="about-fp" data-v-58da0643><h2 class="about-fp__title about-fp__title--with-icon" data-v-58da0643>`);
      _push(ssrRenderComponent(unref(ExclamationCircleTwotone), {
        class: "about-fp__title-icon about-fp__title-icon--danger",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="about-fp__title-label" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.title"))}</span></h2><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.lead"))}</p><ul class="about-fp__list" data-v-58da0643><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.item_1"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.item_2"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.item_3"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.item_4"))}</li></ul><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.as_result"))}</p><ul class="about-fp__list" data-v-58da0643><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.result_1"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.result_2"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.result_3"))}</li></ul><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.two_options"))}</p><ul class="about-fp__list" data-v-58da0643><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.option_1"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.problem.option_2"))}</li></ul></div></section><section class="about-fp-section" data-v-58da0643><div class="about-fp" data-v-58da0643><h2 class="about-fp__title about-fp__title--with-icon" data-v-58da0643>`);
      _push(ssrRenderComponent(unref(Bulb), {
        class: "about-fp__title-icon about-fp__title-icon--accent-orange",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="about-fp__title-label" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.title"))}</span></h2><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.p1"))}</p><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.every_action"))}</p><ul class="about-fp__list" data-v-58da0643><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.item_1"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.item_2"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.item_3"))}</li></ul><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.task_not_done"))}</p><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.main_thing"))}</p><p class="about-fp__text about-fp__text--with-inline-icon" data-v-58da0643>`);
      _push(ssrRenderComponent(_sfc_main$C, {
        name: "hand-point-right",
        class: "about-fp__title-icon about-fp__title-icon--accent-orange",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span data-v-58da0643>${ssrInterpolate(unref(t)("about.what_i_do.highlight"))}</span></p></div></section><section class="about-fp-section" data-v-58da0643><div class="about-fp" data-v-58da0643><h2 class="about-fp__title about-fp__title--with-icon" data-v-58da0643>`);
      _push(ssrRenderComponent(unref(ManageAccountsTwotone), {
        class: "about-fp__title-icon about-fp__title-icon--accent-success-dark",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="about-fp__title-label" data-v-58da0643>${ssrInterpolate(unref(t)("about.why_me.title"))}</span></h2><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.why_me.p1"))}</p><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.why_me.p2"))}</p><ul class="about-fp__list" data-v-58da0643><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.why_me.item_1"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.why_me.item_2"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.why_me.item_3"))}</li></ul><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.why_me.simple_thing"))}</p><p class="about-fp__text about-fp__text--with-inline-icon" data-v-58da0643>`);
      _push(ssrRenderComponent(_sfc_main$C, {
        name: "hand-point-right",
        class: "about-fp__title-icon about-fp__title-icon--accent-orange",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span data-v-58da0643>${ssrInterpolate(unref(t)("about.why_me.highlight"))}</span></p></div></section><section class="about-fp-section" data-v-58da0643><div class="about-fp" data-v-58da0643><h2 class="about-fp__title about-fp__title--with-icon" data-v-58da0643>`);
      _push(ssrRenderComponent(_sfc_main$C, {
        name: "schedule-twotone",
        class: "about-fp__title-icon about-fp__title-icon--accent-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="about-fp__title-label" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_you_get.title"))}</span></h2><ul class="about-fp__list" data-v-58da0643><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_you_get.item_1"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_you_get.item_2"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_you_get.item_3"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_you_get.item_4"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_you_get.item_5"))}</li></ul><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_you_get.additional"))}</p><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.what_you_get.extra"))}</p></div></section><section class="about-fp-section" data-v-58da0643><div class="about-fp" data-v-58da0643><h2 class="about-fp__title about-fp__title--with-icon" data-v-58da0643>`);
      _push(ssrRenderComponent(_sfc_main$C, {
        name: "target-arrow-24-regular",
        class: "about-fp__title-icon about-fp__title-icon--danger",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="about-fp__title-label" data-v-58da0643>${ssrInterpolate(unref(t)("about.survey.title"))}</span></h2><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.survey.p1"))}</p><p class="about-fp__text" data-v-58da0643>${ssrInterpolate(unref(t)("about.survey.if_complete"))}</p><ul class="about-fp__list" data-v-58da0643><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.survey.item_1"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.survey.item_2"))}</li><li class="about-fp__list-item" data-v-58da0643>${ssrInterpolate(unref(t)("about.survey.item_3"))}</li></ul><p class="about-fp__text about-fp__text--with-inline-icon" data-v-58da0643>`);
      _push(ssrRenderComponent(_sfc_main$C, {
        name: "watch-later-twotone",
        class: "about-fp__text-icon",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span data-v-58da0643>${ssrInterpolate(unref(t)("about.survey.time_estimate"))}</span></p></div></section><section class="about-fp-section about-fp-section--cta" data-v-58da0643><div class="about-fp about-fp--cta" data-v-58da0643><div class="about-fp__cta-surface" data-v-58da0643>`);
      _push(ssrRenderComponent(SurveyCtaSection, null, null, _parent));
      _push(`</div></div></section></div><nav class="about-page__nav-dots"${ssrRenderAttr("aria-label", unref(t)("about.page.aria_navigation"))} data-v-58da0643><!--[-->`);
      ssrRenderList(sectionCount.value, (i) => {
        _push(`<div class="about-page__nav-dot-wrap" data-v-58da0643>`);
        if (activeIndex.value === i - 1 && sectionCount.value > 1 && i > 1) {
          _push(`<span class="about-page__nav-arrow about-page__nav-arrow--up" aria-hidden="true" data-v-58da0643></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="${ssrRenderClass([{
          "about-page__nav-dot--active": activeIndex.value === i - 1
        }, "about-page__nav-dot"])}"${ssrRenderAttr("aria-label", navDotAriaLabel(i - 1))}${ssrRenderAttr(
          "aria-current",
          activeIndex.value === i - 1 ? "true" : void 0
        )} data-v-58da0643><span class="about-page__nav-dot-letter" aria-hidden="true" data-v-58da0643>${ssrInterpolate(navDotLetter(i - 1))}</span></button>`);
        if (activeIndex.value === i - 1 && sectionCount.value > 1 && i < sectionCount.value) {
          _push(`<span class="about-page__nav-arrow about-page__nav-arrow--down" aria-hidden="true" data-v-58da0643></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></nav></div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/About.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const About = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-58da0643"]]);
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$r = /* @__PURE__ */ Object.assign({
  name: "BatchPublic"
}, {
  __name: "BatchPublic",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    },
    batchId: {
      type: String,
      required: true
    },
    print: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const page = usePage();
    const batchId = computed(() => props.batchId);
    const record = computed(() => getBatchPublicRecord(batchId.value));
    const canonicalUrl = computed(
      () => buildBatchPublicUrl(batchId.value, page.props.locale ?? null)
    );
    const wantsAutoPrint = computed(() => props.print === true);
    const runAutoPrint = () => {
      if (!record.value || !wantsAutoPrint.value) {
        return;
      }
      nextTick(() => {
        requestAnimationFrame(() => {
          setTimeout(() => window.print(), 400);
        });
      });
    };
    watch(
      () => {
        var _a2;
        return [(_a2 = record.value) == null ? void 0 : _a2.id, props.print];
      },
      () => runAutoPrint(),
      { flush: "post", immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(`<div class="batch-public" data-v-fd02a8b6><div class="batch-public__toolbar no-print" data-v-fd02a8b6><button type="button" class="btn-client btn-outline-primary" data-v-fd02a8b6>${ssrInterpolate(unref(t)("demo.show_task_modal.close"))}</button>`);
      if (record.value) {
        _push(`<button type="button" class="batch-public__print btn-client btn-outline-primary" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.print_pdf"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (!record.value) {
        _push(`<div class="batch-public__missing container" data-v-fd02a8b6><h1 class="batch-public__missing-title" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.not_found_title"))}</h1><p class="batch-public__missing-text" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.not_found_text", { batchId: batchId.value }))}</p><button type="button" class="btn-client btn-outline-primary elem-right" data-v-fd02a8b6>${ssrInterpolate(unref(t)("demo.show_task_modal.close"))}</button></div>`);
      } else {
        _push(`<article class="batch-public__paper" data-v-fd02a8b6><header class="batch-public__head" data-v-fd02a8b6><div class="batch-public__eu-band" aria-hidden="true" data-v-fd02a8b6></div><p class="batch-public__kicker" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.kicker"))}</p><h1 class="batch-public__title" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.title"))}</h1><p class="batch-public__sub" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.subtitle"))}</p><div class="batch-public__refs" data-v-fd02a8b6><div data-v-fd02a8b6><span class="batch-public__label" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.batch_id_label"))}</span><strong data-v-fd02a8b6>${ssrInterpolate(record.value.id)}</strong></div><div data-v-fd02a8b6><span class="batch-public__label" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.dds_reference_label"))}</span><strong data-v-fd02a8b6>${ssrInterpolate(record.value.ddsReference)}</strong></div><div data-v-fd02a8b6><span class="batch-public__label" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.status_label"))}</span><span class="${ssrRenderClass([`batch-public__status--${record.value.status}`, "batch-public__status"])}" data-v-fd02a8b6>${ssrInterpolate(record.value.statusLabel)}</span></div></div></header><section class="batch-public__section" data-v-fd02a8b6><h2 data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.section_operator"))}</h2><dl class="batch-public__dl" data-v-fd02a8b6><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.operator_name"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.operator.name)}</dd></div><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.operator_address"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.operator.address)}</dd></div><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.operator_role"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.operator.role)}</dd></div><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.operator_eori"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.operator.eori)}</dd></div></dl></section><section class="batch-public__section" data-v-fd02a8b6><h2 data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.section_product"))}</h2><dl class="batch-public__dl" data-v-fd02a8b6><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.product_description"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.product.name)}</dd></div><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.product_cn_code"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.product.cnCode)}</dd></div><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.product_category"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.product.category)}</dd></div><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.product_quantity"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.product.quantity)}</dd></div><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.product_lot"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.product.lot)}</dd></div></dl></section><section class="batch-public__section" data-v-fd02a8b6><h2 data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.section_origin"))}</h2><dl class="batch-public__dl" data-v-fd02a8b6><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.plot_country"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.plot.country)}</dd></div><div data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.plot_region"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.plot.region)}</dd></div><div class="batch-public__dl-wide" data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.plot_geo"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.plot.geo)}</dd></div><div class="batch-public__dl-wide" data-v-fd02a8b6><dt data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.plot_harvest"))}</dt><dd data-v-fd02a8b6>${ssrInterpolate(record.value.harvestPeriod)}</dd></div></dl></section><section class="batch-public__section" data-v-fd02a8b6><h2 data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.section_supply_chain"))}</h2><div class="batch-public__table-wrap" data-v-fd02a8b6><div class="batch-public__chain-desktop" data-v-fd02a8b6><table class="batch-public__table" data-v-fd02a8b6><thead data-v-fd02a8b6><tr data-v-fd02a8b6><th data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.chain_role"))}</th><th data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.chain_participant"))}</th><th data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.chain_country"))}</th><th data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.chain_ref"))}</th></tr></thead><tbody data-v-fd02a8b6><!--[-->`);
        ssrRenderList(record.value.supplierChain, (row, idx) => {
          _push(`<tr data-v-fd02a8b6><td data-v-fd02a8b6>${ssrInterpolate(row.role)}</td><td data-v-fd02a8b6>${ssrInterpolate(row.name)}</td><td data-v-fd02a8b6>${ssrInterpolate(row.country)}</td><td data-v-fd02a8b6>${ssrInterpolate(row.ref)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="batch-public__chain-mobile" data-v-fd02a8b6><!--[-->`);
        ssrRenderList(record.value.supplierChain, (row, idx) => {
          _push(`<article class="batch-public__chain-card" data-v-fd02a8b6><p class="batch-public__chain-line" data-v-fd02a8b6><span class="batch-public__chain-label" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.chain_role"))}:</span> ${ssrInterpolate(row.role)}</p><p class="batch-public__chain-line" data-v-fd02a8b6><span class="batch-public__chain-label" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.chain_participant"))}:</span> ${ssrInterpolate(row.name)}</p><p class="batch-public__chain-line" data-v-fd02a8b6><span class="batch-public__chain-label" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.chain_country"))}:</span> ${ssrInterpolate(row.country)}</p><p class="batch-public__chain-line" data-v-fd02a8b6><span class="batch-public__chain-label" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.chain_ref"))}:</span> ${ssrInterpolate(row.ref)}</p></article>`);
        });
        _push(`<!--]--></div></div></section><section class="batch-public__section" data-v-fd02a8b6><h2 data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.section_evidence"))}</h2><p class="batch-public__lead" data-v-fd02a8b6>${ssrInterpolate(record.value.statusDetail)}</p><ul class="batch-public__evidence" data-v-fd02a8b6><!--[-->`);
        ssrRenderList(record.value.evidence, (ev, idx) => {
          _push(`<li data-v-fd02a8b6><strong data-v-fd02a8b6>${ssrInterpolate(ev.label)}</strong><span class="batch-public__evidence-ref" data-v-fd02a8b6>${ssrInterpolate(ev.ref)}</span></li>`);
        });
        _push(`<!--]--></ul></section><footer class="batch-public__footer" data-v-fd02a8b6><div class="batch-public__meta" data-v-fd02a8b6><span data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.document_version", { version: record.value.documentVersion }))}</span><span data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.generated_at", { date: record.value.generatedAt }))}</span></div><p class="batch-public__disclaimer" data-v-fd02a8b6>${ssrInterpolate(record.value.disclaimer)}</p><p class="batch-public__url no-print" data-v-fd02a8b6>${ssrInterpolate(unref(t)("batch.public.public_link", { url: canonicalUrl.value }))}</p></footer></article>`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/BatchPublic.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const BatchPublic = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-fd02a8b6"]]);
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BatchPublic
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$q = /* @__PURE__ */ Object.assign({
  name: "Contact",
  layout: _sfc_main$t
}, {
  __name: "Contact",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const NForm = defineAsyncComponent(() => import("./assets/index-CBaioSHH.js").then((m) => m.NForm));
    const NFormItem = defineAsyncComponent(() => import("./assets/index-CBaioSHH.js").then((m) => m.NFormItem));
    const NInput = defineAsyncComponent(() => import("./assets/index-CBaioSHH.js").then((m) => m.NInput));
    const NButton = defineAsyncComponent(() => import("./assets/index-CBaioSHH.js").then((m) => m.NButton));
    const { t } = useI18n();
    const formRef = ref(null);
    const submitting = ref(false);
    const sent = ref(false);
    const honeypotStartedAt = ref(0);
    onMounted(() => {
      honeypotStartedAt.value = Math.floor(Date.now() / 1e3);
    });
    const form = reactive({
      name: "",
      email: "",
      company: "",
      message: "",
      hp_company: ""
    });
    const rules = {
      name: { required: true, trigger: ["blur", "input"], message: t("contact.validation_name_required") },
      email: [
        { required: true, trigger: ["blur", "input"], message: t("contact.validation_email_required") },
        {
          trigger: ["blur", "input"],
          validator: (_, value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : new Error(t("contact.validation_email_invalid"))
        }
      ],
      message: [
        { required: true, trigger: ["blur", "input"], message: t("contact.validation_message_required") },
        { min: 10, trigger: ["blur", "input"], message: t("contact.validation_message_min") }
      ]
    };
    async function submitForm() {
      var _a2;
      try {
        await ((_a2 = formRef.value) == null ? void 0 : _a2.validate());
      } catch {
        return;
      }
      submitting.value = true;
      const payload = {
        name: form.name,
        email: form.email,
        company: form.company,
        message: form.message,
        hp_company: form.hp_company,
        hp_elapsed: Math.floor(Date.now() / 1e3) - honeypotStartedAt.value
      };
      const response = await defaultApiAxios.post("/contact", payload, true);
      submitting.value = false;
      if ((response == null ? void 0 : response.status) !== "success") {
        const errorText = typeof response === "string" ? response : "";
        toast.error(errorText || t("contact.toast_error"), { autoClose: 5e3 });
        return;
      }
      sent.value = true;
      toast.success(t("contact.toast_success"), { autoClose: 5e3 });
      form.name = "";
      form.email = "";
      form.company = "";
      form.message = "";
      form.hp_company = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(`<div class="section-container-contact" data-v-0e8fa41c><div class="container" data-v-0e8fa41c><div class="contact-grid" data-v-0e8fa41c><div class="contact-intro" data-v-0e8fa41c><span class="contact-intro__eyebrow" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.eyebrow"))}</span><h1 class="contact-intro__title" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.title"))}</h1><div class="box-contact-intro" data-v-0e8fa41c><p class="contact-intro__lead" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.lead"))}</p></div><div class="box-contact-intro" data-v-0e8fa41c><p class="contact-intro__text" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.text_intro"))}</p><ul class="contact-intro__list" data-v-0e8fa41c><li data-v-0e8fa41c><span class="point-dot-shadow" aria-hidden="true" data-v-0e8fa41c></span><span data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.list_1"))}</span></li><li data-v-0e8fa41c><span class="point-dot-shadow" aria-hidden="true" data-v-0e8fa41c></span><span data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.list_2"))}</span></li><li data-v-0e8fa41c><span class="point-dot-shadow" aria-hidden="true" data-v-0e8fa41c></span><span data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.list_3"))}</span></li></ul></div><div class="box-contact-intro" data-v-0e8fa41c><div class="contact-intro__badge" data-v-0e8fa41c><span class="point-dot-shadow animate-pulse" aria-hidden="true" data-v-0e8fa41c></span> ${ssrInterpolate(unref(t)("contact.badge_response"))}</div><div class="contact-intro__author" data-v-0e8fa41c><div class="contact-intro__author-avatar" data-v-0e8fa41c><img${ssrRenderAttr("src", "/images/avatar_120_120.jpg")}${ssrRenderAttr("alt", unref(t)("contact.author_name"))} class="contact-intro__author-photo" data-v-0e8fa41c></div><div class="contact-intro__author-info" data-v-0e8fa41c><p class="contact-intro__author-name" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.author_name"))}</p><p class="contact-intro__author-role" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.author_role"))}</p></div></div></div></div><div class="contact-form-wrap" data-v-0e8fa41c>`);
      if (sent.value) {
        _push(`<div class="contact-sent-card" data-v-0e8fa41c><h2 class="contact-sent-card__title" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.sent_title"))}</h2><p class="contact-sent-card__text" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.sent_line_1"))}</p><p class="contact-sent-card__text" data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.sent_line_2"))}</p>`);
        _push(ssrRenderComponent(_sfc_main$C, {
          name: "mark-email-read-twotone",
          class: "contact-sent-card__icon"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$u, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!sent.value) {
              _push2(`<div class="contact-form-card" data-v-0e8fa41c${_scopeId}>`);
              _push2(ssrRenderComponent(unref(NForm), {
                ref_key: "formRef",
                ref: formRef,
                model: form,
                rules,
                "label-placement": "top",
                "label-width": "auto",
                class: "contact-form",
                onSubmit: submitForm
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input${ssrRenderAttr("value", form.hp_company)} type="text" name="company_hp" class="contact-form__honeypot" tabindex="-1" autocomplete="new-password" aria-hidden="true" data-v-0e8fa41c${_scopeId2}><div class="contact-form__row" data-v-0e8fa41c${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("contact.name_label"),
                      path: "name",
                      required: ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NInput), {
                            value: form.name,
                            "onUpdate:value": ($event) => form.name = $event,
                            size: "large",
                            placeholder: unref(t)("contact.name_placeholder")
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NInput), {
                              value: form.name,
                              "onUpdate:value": ($event) => form.name = $event,
                              size: "large",
                              placeholder: unref(t)("contact.name_placeholder")
                            }, null, 8, ["value", "onUpdate:value", "placeholder"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("contact.email_label"),
                      path: "email",
                      required: ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NInput), {
                            value: form.email,
                            "onUpdate:value": ($event) => form.email = $event,
                            size: "large",
                            placeholder: unref(t)("contact.email_placeholder"),
                            "input-props": {
                              type: "email",
                              name: "email",
                              autocomplete: "email",
                              inputmode: "email"
                            }
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NInput), {
                              value: form.email,
                              "onUpdate:value": ($event) => form.email = $event,
                              size: "large",
                              placeholder: unref(t)("contact.email_placeholder"),
                              "input-props": {
                                type: "email",
                                name: "email",
                                autocomplete: "email",
                                inputmode: "email"
                              }
                            }, null, 8, ["value", "onUpdate:value", "placeholder"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("contact.company_label"),
                      path: "company"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NInput), {
                            value: form.company,
                            "onUpdate:value": ($event) => form.company = $event,
                            size: "large",
                            placeholder: unref(t)("contact.company_placeholder")
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NInput), {
                              value: form.company,
                              "onUpdate:value": ($event) => form.company = $event,
                              size: "large",
                              placeholder: unref(t)("contact.company_placeholder")
                            }, null, 8, ["value", "onUpdate:value", "placeholder"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("contact.message_label"),
                      path: "message",
                      required: ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NInput), {
                            value: form.message,
                            "onUpdate:value": ($event) => form.message = $event,
                            type: "textarea",
                            size: "large",
                            placeholder: unref(t)("contact.message_placeholder"),
                            autosize: { minRows: 5, maxRows: 10 }
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NInput), {
                              value: form.message,
                              "onUpdate:value": ($event) => form.message = $event,
                              type: "textarea",
                              size: "large",
                              placeholder: unref(t)("contact.message_placeholder"),
                              autosize: { minRows: 5, maxRows: 10 }
                            }, null, 8, ["value", "onUpdate:value", "placeholder"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="contact-form__submit" data-v-0e8fa41c${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(NButton), {
                      type: "primary",
                      size: "large",
                      block: "",
                      "attr-type": "submit",
                      loading: submitting.value
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(t)("contact.submit"))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(t)("contact.submit")), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<p class="contact-form__hint" data-v-0e8fa41c${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$C, {
                      name: "check-circle",
                      class: "contact-form__hint-icon"
                    }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(unref(t)("contact.hint"))}</p></div>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.hp_company = $event,
                        type: "text",
                        name: "company_hp",
                        class: "contact-form__honeypot",
                        tabindex: "-1",
                        autocomplete: "new-password",
                        "aria-hidden": "true"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.hp_company]
                      ]),
                      createVNode("div", { class: "contact-form__row" }, [
                        createVNode(unref(NFormItem), {
                          label: unref(t)("contact.name_label"),
                          path: "name",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NInput), {
                              value: form.name,
                              "onUpdate:value": ($event) => form.name = $event,
                              size: "large",
                              placeholder: unref(t)("contact.name_placeholder")
                            }, null, 8, ["value", "onUpdate:value", "placeholder"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode(unref(NFormItem), {
                          label: unref(t)("contact.email_label"),
                          path: "email",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NInput), {
                              value: form.email,
                              "onUpdate:value": ($event) => form.email = $event,
                              size: "large",
                              placeholder: unref(t)("contact.email_placeholder"),
                              "input-props": {
                                type: "email",
                                name: "email",
                                autocomplete: "email",
                                inputmode: "email"
                              }
                            }, null, 8, ["value", "onUpdate:value", "placeholder"])
                          ]),
                          _: 1
                        }, 8, ["label"])
                      ]),
                      createVNode(unref(NFormItem), {
                        label: unref(t)("contact.company_label"),
                        path: "company"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.company,
                            "onUpdate:value": ($event) => form.company = $event,
                            size: "large",
                            placeholder: unref(t)("contact.company_placeholder")
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(unref(NFormItem), {
                        label: unref(t)("contact.message_label"),
                        path: "message",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.message,
                            "onUpdate:value": ($event) => form.message = $event,
                            type: "textarea",
                            size: "large",
                            placeholder: unref(t)("contact.message_placeholder"),
                            autosize: { minRows: 5, maxRows: 10 }
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode("div", { class: "contact-form__submit" }, [
                        createVNode(unref(NButton), {
                          type: "primary",
                          size: "large",
                          block: "",
                          "attr-type": "submit",
                          loading: submitting.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(t)("contact.submit")), 1)
                          ]),
                          _: 1
                        }, 8, ["loading"]),
                        createVNode("p", { class: "contact-form__hint" }, [
                          createVNode(_sfc_main$C, {
                            name: "check-circle",
                            class: "contact-form__hint-icon"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("contact.hint")), 1)
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !sent.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "contact-form-card"
              }, [
                createVNode(unref(NForm), {
                  ref_key: "formRef",
                  ref: formRef,
                  model: form,
                  rules,
                  "label-placement": "top",
                  "label-width": "auto",
                  class: "contact-form",
                  onSubmit: withModifiers(submitForm, ["prevent"])
                }, {
                  default: withCtx(() => [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => form.hp_company = $event,
                      type: "text",
                      name: "company_hp",
                      class: "contact-form__honeypot",
                      tabindex: "-1",
                      autocomplete: "new-password",
                      "aria-hidden": "true"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.hp_company]
                    ]),
                    createVNode("div", { class: "contact-form__row" }, [
                      createVNode(unref(NFormItem), {
                        label: unref(t)("contact.name_label"),
                        path: "name",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.name,
                            "onUpdate:value": ($event) => form.name = $event,
                            size: "large",
                            placeholder: unref(t)("contact.name_placeholder")
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(unref(NFormItem), {
                        label: unref(t)("contact.email_label"),
                        path: "email",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.email,
                            "onUpdate:value": ($event) => form.email = $event,
                            size: "large",
                            placeholder: unref(t)("contact.email_placeholder"),
                            "input-props": {
                              type: "email",
                              name: "email",
                              autocomplete: "email",
                              inputmode: "email"
                            }
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ]),
                        _: 1
                      }, 8, ["label"])
                    ]),
                    createVNode(unref(NFormItem), {
                      label: unref(t)("contact.company_label"),
                      path: "company"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: form.company,
                          "onUpdate:value": ($event) => form.company = $event,
                          size: "large",
                          placeholder: unref(t)("contact.company_placeholder")
                        }, null, 8, ["value", "onUpdate:value", "placeholder"])
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(unref(NFormItem), {
                      label: unref(t)("contact.message_label"),
                      path: "message",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: form.message,
                          "onUpdate:value": ($event) => form.message = $event,
                          type: "textarea",
                          size: "large",
                          placeholder: unref(t)("contact.message_placeholder"),
                          autosize: { minRows: 5, maxRows: 10 }
                        }, null, 8, ["value", "onUpdate:value", "placeholder"])
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode("div", { class: "contact-form__submit" }, [
                      createVNode(unref(NButton), {
                        type: "primary",
                        size: "large",
                        block: "",
                        "attr-type": "submit",
                        loading: submitting.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t)("contact.submit")), 1)
                        ]),
                        _: 1
                      }, 8, ["loading"]),
                      createVNode("p", { class: "contact-form__hint" }, [
                        createVNode(_sfc_main$C, {
                          name: "check-circle",
                          class: "contact-form__hint-icon"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("contact.hint")), 1)
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["model"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="contact-trust" data-v-0e8fa41c><div class="contact-trust__card" data-v-0e8fa41c>`);
      _push(ssrRenderComponent(_sfc_main$C, {
        name: "check-circle",
        class: "contact-trust__icon"
      }, null, _parent));
      _push(`<div data-v-0e8fa41c><h4 data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.trust_compliance_title"))}</h4><p data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.trust_compliance_subtitle"))}</p></div></div><div class="contact-trust__card" data-v-0e8fa41c>`);
      _push(ssrRenderComponent(_sfc_main$C, {
        name: "info",
        class: "contact-trust__icon"
      }, null, _parent));
      _push(`<div data-v-0e8fa41c><h4 data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.trust_privacy_title"))}</h4><p data-v-0e8fa41c>${ssrInterpolate(unref(t)("contact.trust_privacy_subtitle"))}</p></div></div></div></div></div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Contact.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const Contact = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-0e8fa41c"]]);
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Contact
}, Symbol.toStringTag, { value: "Module" }));
const origin = typeof window !== "undefined" && ((_b = window.location) == null ? void 0 : _b.origin) ? window.location.origin : "https://haccpilot.eu";
const REPORT_REFERENCE_ISO = (() => {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
})();
const buildDailyReportPublicUrl = (isoDate, locale2 = null) => {
  if (!isoDate) {
    return origin;
  }
  if (locale2 && typeof locale2 === "string") {
    return `${origin}/${locale2}/report/${isoDate}`;
  }
  return `${origin}/report/${isoDate}`;
};
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const parseIsoDateSafe = (s) => {
  if (typeof s !== "string" || !ISO_RE.test(s)) {
    return null;
  }
  const d = /* @__PURE__ */ new Date(`${s}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  const [, y, m, day] = s.match(ISO_RE);
  const yi = Number(y);
  const mi = Number(m);
  const di = Number(day);
  if (d.getFullYear() !== yi || d.getMonth() + 1 !== mi || d.getDate() !== di) {
    return null;
  }
  return s;
};
const ruDottedDateToIso = (ru) => {
  if (typeof ru !== "string" || !/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(ru)) {
    return null;
  }
  const [d, m, y] = ru.split(".");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};
const formatIsoLongRu = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(dt).replace(/\s+г\.?$/u, "").trim();
};
const NICHE_LABEL = {
  coffee: "Coffee",
  bakery: "Bakery",
  meat: "Meat / EUDR"
};
const fallbackStatus = (task) => {
  const key = taskDisplayStatusKey(task);
  if (key === "ok") {
    return "Within limits";
  }
  if (key === "problem") {
    return "Deviation";
  }
  if (key === "repeat") {
    return "Monitored (scheduled)";
  }
  return "—";
};
const measurementStatus = (m) => {
  const raw = String((m == null ? void 0 : m.status) ?? "").toLowerCase();
  if (raw === "success") {
    return { key: "ok", label: "success" };
  }
  if (raw === "problem") {
    return { key: "problem", label: "problem" };
  }
  if (raw === "pending") {
    return { key: "review", label: "pending" };
  }
  return { key: "review", label: raw || "—" };
};
const hasAnyPendingMeasurement = (task) => Array.isArray(task == null ? void 0 : task.measurements) && task.measurements.some((m) => (m == null ? void 0 : m.status) === "pending");
const reportTaskStatus = (task) => {
  if (Array.isArray(task == null ? void 0 : task.measurements) && task.measurements.length > 0) {
    return hasAnyPendingMeasurement(task) ? { key: "review", label: "Pending" } : { key: "ok", label: "Success" };
  }
  const key = taskDisplayStatusKey(task);
  if (key === "problem") {
    return { key: "problem", label: fallbackStatus(task) };
  }
  if (key === "repeat") {
    return { key: "review", label: fallbackStatus(task) };
  }
  return { key: "ok", label: fallbackStatus(task) };
};
const NICHE_ORDER = ["coffee", "bakery", "meat"];
const buildNicheSections = (state) => NICHE_ORDER.map((nicheKey) => {
  var _a2;
  const tasks = ((_a2 = state.checklistsByNiche) == null ? void 0 : _a2[nicheKey]) ?? [];
  const nicheLabel = NICHE_LABEL[nicheKey] ?? nicheKey;
  return {
    nicheKey,
    nicheLabel,
    tasks: tasks.map((task) => {
      const reportStatus = reportTaskStatus(task);
      return {
        id: task.id,
        title: task.title,
        value: firstPendingMeasurementTime(task) || "—",
        statusPillKey: reportStatus.key,
        statusLabel: reportStatus.label,
        assigneeName: resolveStaffFullName(
          state.staff,
          task.assignedStaffId
        ),
        measurements: Array.isArray(task.measurements) ? task.measurements.map((m) => ({
          time: m.time,
          value: m.value,
          status: m.status,
          resultPillKey: measurementStatus(m).key,
          resultLabel: measurementStatus(m).label
        })) : null,
        correctiveActions: Array.isArray(task.correctiveActions) ? [...task.correctiveActions] : null
      };
    })
  };
});
const flattenCcpRows = (state) => {
  const rows = [];
  for (const [niche, tasks] of Object.entries(
    state.checklistsByNiche ?? {}
  )) {
    const nicheLabel = NICHE_LABEL[niche] ?? niche;
    for (const task of tasks) {
      const reportStatus = reportTaskStatus(task);
      let detail = firstPendingMeasurementTime(task) || "—";
      if (taskHasMultiSlotSchedule(task) && Array.isArray(task.measurements)) {
        const last = [...task.measurements].reverse().find((m) => m.status !== "pending");
        if (last) {
          detail = `${last.value} @ ${last.time}`;
        }
      }
      rows.push({
        id: `${niche}-${task.id}`,
        niche: nicheLabel,
        ccp: task.title,
        detail,
        assigneeName: resolveStaffFullName(
          state.staff,
          task.assignedStaffId
        ),
        statusPillKey: reportStatus.key,
        statusLabel: reportStatus.label
      });
    }
  }
  return rows;
};
const batchesForCalendarDay = (dateIso, state) => {
  const list = state.batches ?? [];
  return list.filter((b) => ruDottedDateToIso(b.date) === dateIso);
};
const getDailyReportSnapshot = (dateIso) => {
  const safe = parseIsoDateSafe(dateIso);
  if (!safe) {
    return null;
  }
  const state = loadPersistedDemoState();
  const isReferenceDay = safe === REPORT_REFERENCE_ISO;
  const ccpRows = isReferenceDay ? flattenCcpRows(state) : [];
  const supplyRows = isReferenceDay ? batchesForCalendarDay(safe, state) : [];
  const nicheSections = isReferenceDay ? buildNicheSections(state) : [];
  const supplyDetails = isReferenceDay ? supplyRows.map((b) => ({
    listRow: b,
    eudr: getBatchPublicRecord(b.id)
  })) : [];
  const totalCcpTasks = isReferenceDay ? nicheSections.reduce((n, s) => n + s.tasks.length, 0) : 0;
  return {
    dateIso: safe,
    dateLongRu: formatIsoLongRu(safe),
    hasFullRecord: isReferenceDay,
    documentRef: `HACCPilot-DAILY-${safe}-DEMO`,
    establishment: {
      legalName: "Piotr Bakery Sp. z o.o.",
      address: "ul. Przykładowa 12, 00-001 Warszawa, Poland",
      eori: "PL1234567890000",
      fdaRegistration: "Illustrative — U.S. FDA establishment identifier not applicable in this demo (FSMA recordkeeping narrative only).",
      competentAuthorityEu: "Competent authority (illustrative): Chief Sanitary Inspectorate / PIH — demo placeholder."
    },
    inspectionDateLabel: state.inspectionDate,
    companyShort: state.report.company,
    ccpRows,
    nicheSections,
    totalCcpTasks,
    supplyRows,
    supplyDetails,
    disclaimer: "Demonstration document for inspection readiness review only. Not a legally binding EU DDS, FDA submission, or official regulatory record. Operational data are illustrative.",
    generatedAtUtcHint: (/* @__PURE__ */ new Date()).toISOString()
  };
};
const SCROLL_TOP_THRESHOLD = 1500;
const _sfc_main$p = /* @__PURE__ */ Object.assign({
  name: "DailyReportPublic"
}, {
  __name: "DailyReportPublic",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    print: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const page = usePage();
    const dateParam = computed(() => props.date);
    const reportReferenceIso = REPORT_REFERENCE_ISO;
    const snapshot = computed(() => {
      const safe = parseIsoDateSafe(dateParam.value);
      if (!safe) {
        return null;
      }
      return getDailyReportSnapshot(safe);
    });
    const canonicalUrl = computed(
      () => buildDailyReportPublicUrl(dateParam.value, page.props.locale ?? null)
    );
    const generatedAtFormatted = computed(() => {
      if (!snapshot.value) {
        return "";
      }
      const localeTag = page.props.locale || "en";
      return new Intl.DateTimeFormat(localeTag, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(snapshot.value.generatedAtUtcHint));
    });
    const wantsAutoPrint = computed(() => props.print === true);
    const showToTop = ref(false);
    let scrollContainer = null;
    const getWindowScrollTop = () => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const onScroll = () => {
      const containerTop = scrollContainer ? scrollContainer.scrollTop : 0;
      const windowTop = getWindowScrollTop();
      let height = Math.max(containerTop, windowTop);
      showToTop.value = height > SCROLL_TOP_THRESHOLD;
    };
    onMounted(() => {
      scrollContainer = document.querySelector(".main-content");
      window.addEventListener("scroll", onScroll, { passive: true });
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", onScroll, { passive: true });
      }
      onScroll();
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", onScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", onScroll);
      }
      scrollContainer = null;
    });
    const runAutoPrint = () => {
      if (!snapshot.value || !wantsAutoPrint.value) {
        return;
      }
      nextTick(() => {
        requestAnimationFrame(() => {
          setTimeout(() => window.print(), 400);
        });
      });
    };
    watch(
      () => {
        var _a2;
        return [(_a2 = snapshot.value) == null ? void 0 : _a2.dateIso, props.print];
      },
      () => runAutoPrint(),
      { flush: "post", immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(`<div class="${ssrRenderClass([{ "daily-report--pdf-open": wantsAutoPrint.value }, "daily-report"])}" data-v-049cf019><div class="daily-report__toolbar no-print" data-v-049cf019><button type="button" class="btn-client btn-outline-primary" data-v-049cf019>${ssrInterpolate(unref(t)("demo.show_task_modal.close"))}</button>`);
      if (snapshot.value) {
        _push(`<button type="button" class="daily-report__print btn-client btn-outline-primary" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.print_pdf"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (!snapshot.value) {
        _push(`<div class="daily-report__missing container" data-v-049cf019><h1 class="daily-report__missing-title" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.invalid_title"))}</h1><p class="daily-report__missing-text" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.invalid_text", { date: unref(reportReferenceIso) }))}</p><button type="button" class="btn-client btn-outline-primary elem-right" data-v-049cf019>${ssrInterpolate(unref(t)("demo.show_task_modal.close"))}</button></div>`);
      } else {
        _push(`<article class="daily-report__paper" data-v-049cf019><header class="daily-report__head" data-v-049cf019><div class="daily-report__eu-band" aria-hidden="true" data-v-049cf019></div><p class="daily-report__kicker" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.kicker"))}</p><h1 class="daily-report__title" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.title"))}</h1><p class="daily-report__sub" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.subtitle"))}</p><div class="daily-report__refs" data-v-049cf019><div data-v-049cf019><span class="daily-report__label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.report_reference"))}</span><strong data-v-049cf019>${ssrInterpolate(snapshot.value.documentRef)}</strong></div><div data-v-049cf019><span class="daily-report__label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.calendar_date_utc"))}</span><strong data-v-049cf019>${ssrInterpolate(snapshot.value.dateIso)}</strong></div><div data-v-049cf019><span class="daily-report__label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.localized"))}</span><strong data-v-049cf019>${ssrInterpolate(snapshot.value.dateLongRu)}</strong></div></div></header><section class="daily-report__section" data-v-049cf019><h2 data-v-049cf019>${ssrInterpolate(unref(t)("report.public.section_establishment"))}</h2><dl class="daily-report__dl" data-v-049cf019><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.legal_name"))}</dt><dd data-v-049cf019>${ssrInterpolate(snapshot.value.establishment.legalName)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.registered_address"))}</dt><dd data-v-049cf019>${ssrInterpolate(snapshot.value.establishment.address)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.eori_eu"))}</dt><dd data-v-049cf019>${ssrInterpolate(snapshot.value.establishment.eori)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.fda_note"))}</dt><dd data-v-049cf019>${ssrInterpolate(snapshot.value.establishment.fdaRegistration)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.competent_authority"))}</dt><dd data-v-049cf019>${ssrInterpolate(snapshot.value.establishment.competentAuthorityEu)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.operating_name"))}</dt><dd data-v-049cf019>${ssrInterpolate(snapshot.value.companyShort)}</dd></div></dl></section>`);
        if (!snapshot.value.hasFullRecord) {
          _push(`<section class="daily-report__section daily-report__section--muted" data-v-049cf019><h2 data-v-049cf019>${ssrInterpolate(unref(t)("report.public.section_no_records"))}</h2><p class="daily-report__lead" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.no_records_text"))}</p></section>`);
        } else {
          _push(`<!--[--><section class="daily-report__section" data-v-049cf019><h2 data-v-049cf019>${ssrInterpolate(unref(t)("report.public.section_scope"))}</h2><p class="daily-report__lead" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.scope_lead"))}</p><div class="daily-report__summary" data-v-049cf019><div class="daily-report__summary-item" data-v-049cf019><span class="daily-report__label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.total_ccp_tasks"))}</span><strong data-v-049cf019>${ssrInterpolate(snapshot.value.totalCcpTasks)}</strong></div><div class="daily-report__summary-item" data-v-049cf019><span class="daily-report__label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.reporting_date"))}</span><strong data-v-049cf019>${ssrInterpolate(snapshot.value.inspectionDateLabel)}</strong></div></div><div class="daily-report__table-wrap daily-report__table-wrap--mt" data-v-049cf019><p class="daily-report__register-caption-mobile" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.register_caption"))}</p><div class="daily-report__register-desktop" data-v-049cf019><table class="daily-report__table daily-report__table--compact" data-v-049cf019><caption class="daily-report__caption" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.register_caption"))}</caption><thead data-v-049cf019><tr data-v-049cf019><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_process"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_control_point"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_recorded_value"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_assignee"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_status"))}</th></tr></thead><tbody data-v-049cf019><!--[-->`);
          ssrRenderList(snapshot.value.ccpRows, (row) => {
            _push(`<tr data-v-049cf019><td data-v-049cf019>${ssrInterpolate(row.niche)}</td><td data-v-049cf019>${ssrInterpolate(row.ccp)}</td><td data-v-049cf019>${ssrInterpolate(row.detail)}</td><td data-v-049cf019>${ssrInterpolate(row.assigneeName)}</td><td data-v-049cf019><span class="${ssrRenderClass([`daily-report__pill--${row.statusPillKey}`, "daily-report__pill"])}" data-v-049cf019>${ssrInterpolate(row.statusLabel)}</span></td></tr>`);
          });
          _push(`<!--]--></tbody></table></div><div class="daily-report__register-mobile" data-v-049cf019><!--[-->`);
          ssrRenderList(snapshot.value.ccpRows, (row) => {
            _push(`<article class="daily-report__register-card" data-v-049cf019><p class="daily-report__register-line" data-v-049cf019><span class="daily-report__register-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_process"))}:</span> ${ssrInterpolate(row.niche)}</p><p class="daily-report__register-line" data-v-049cf019><span class="daily-report__register-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_control_point"))}:</span> ${ssrInterpolate(row.ccp)}</p><p class="daily-report__register-line" data-v-049cf019><span class="daily-report__register-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_recorded_value"))}:</span> ${ssrInterpolate(row.detail)}</p><p class="daily-report__register-line" data-v-049cf019><span class="daily-report__register-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_assignee"))}:</span> ${ssrInterpolate(row.assigneeName)}</p><p class="daily-report__register-line daily-report__register-line--status" data-v-049cf019><span class="daily-report__register-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_status"))}:</span><span class="${ssrRenderClass([`daily-report__pill--${row.statusPillKey}`, "daily-report__pill"])}" data-v-049cf019>${ssrInterpolate(row.statusLabel)}</span></p></article>`);
          });
          _push(`<!--]--></div></div></section><!--[-->`);
          ssrRenderList(snapshot.value.nicheSections, (section) => {
            _push(`<section class="daily-report__section daily-report__section--niche" data-v-049cf019><h2 class="daily-report__h2-niche" data-v-049cf019> 3.${ssrInterpolate(section.nicheKey === "coffee" ? "A" : section.nicheKey === "bakery" ? "B" : "C")} ${ssrInterpolate(unref(t)("report.public.haccp_section_title", { label: section.nicheLabel }))}</h2><p class="daily-report__lead" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.haccp_section_lead"))}</p><!--[-->`);
            ssrRenderList(section.tasks, (task) => {
              _push(`<div class="daily-report__task-block" data-v-049cf019><div class="daily-report__task-head" data-v-049cf019><h3 class="daily-report__task-title" data-v-049cf019>${ssrInterpolate(task.title)}</h3><span class="${ssrRenderClass([`daily-report__pill--${task.statusPillKey}`, "daily-report__pill"])}" data-v-049cf019>${ssrInterpolate(task.statusLabel)}</span></div><dl class="daily-report__task-dl" data-v-049cf019><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.control_point_id"))}</dt><dd data-v-049cf019><code class="daily-report__code" data-v-049cf019>${ssrInterpolate(task.id)}</code></dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.last_recorded"))}</dt><dd data-v-049cf019>${ssrInterpolate(task.value)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.person_responsible_demo"))}</dt><dd data-v-049cf019>${ssrInterpolate(task.assigneeName)}</dd></div></dl>`);
              if (task.measurements && task.measurements.length) {
                _push(`<div class="daily-report__subblock" data-v-049cf019><h4 class="daily-report__h4" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.time_stamped_verification"))}</h4><div class="daily-report__table-wrap daily-report__table-wrap--meas" data-v-049cf019><div class="daily-report__meas-desktop" data-v-049cf019><table class="daily-report__table" data-v-049cf019><thead data-v-049cf019><tr data-v-049cf019><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_time"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_observed_value"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_result"))}</th></tr></thead><tbody data-v-049cf019><!--[-->`);
                ssrRenderList(task.measurements, (m, idx) => {
                  _push(`<tr data-v-049cf019><td data-v-049cf019>${ssrInterpolate(m.time)}</td><td data-v-049cf019>${ssrInterpolate(m.value)}</td><td data-v-049cf019><span class="${ssrRenderClass([`daily-report__pill--${m.resultPillKey}`, "daily-report__pill daily-report__pill--sm"])}" data-v-049cf019>${ssrInterpolate(m.resultLabel)}</span></td></tr>`);
                });
                _push(`<!--]--></tbody></table></div><div class="daily-report__meas-mobile" data-v-049cf019><!--[-->`);
                ssrRenderList(task.measurements, (m, idx) => {
                  _push(`<article class="daily-report__meas-card" data-v-049cf019><p class="daily-report__meas-line" data-v-049cf019><span class="daily-report__meas-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_time"))}:</span> ${ssrInterpolate(m.time)}</p><p class="daily-report__meas-line" data-v-049cf019><span class="daily-report__meas-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_observed_value"))}:</span> ${ssrInterpolate(m.value)}</p><p class="daily-report__meas-line daily-report__meas-line--result" data-v-049cf019><span class="daily-report__meas-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_result"))}:</span><span class="${ssrRenderClass([`daily-report__pill--${m.resultPillKey}`, "daily-report__pill daily-report__pill--sm"])}" data-v-049cf019>${ssrInterpolate(m.resultLabel)}</span></p></article>`);
                });
                _push(`<!--]--></div></div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (task.correctiveActions && task.correctiveActions.length) {
                _push(`<div class="daily-report__subblock" data-v-049cf019><h4 class="daily-report__h4" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.corrective_actions_title"))}</h4><ol class="daily-report__ol" data-v-049cf019><!--[-->`);
                ssrRenderList(task.correctiveActions, (line, idx) => {
                  _push(`<li data-v-049cf019>${ssrInterpolate(line)}</li>`);
                });
                _push(`<!--]--></ol></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></section>`);
          });
          _push(`<!--]--><section class="daily-report__section" data-v-049cf019><h2 data-v-049cf019>${ssrInterpolate(unref(t)("report.public.section_eudr"))}</h2><p class="daily-report__lead" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.eudr_lead"))}</p>`);
          if (snapshot.value.supplyRows.length === 0) {
            _push(`<p class="daily-report__lead daily-report__lead--warn" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.no_eudr_intake"))}</p>`);
          } else {
            _push(`<!--[--><div class="daily-report__table-wrap daily-report__table-wrap--supply" data-v-049cf019><div class="daily-report__supply-desktop" data-v-049cf019><table class="daily-report__table" data-v-049cf019><thead data-v-049cf019><tr data-v-049cf019><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_batch_id"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_product_list"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_status"))}</th><th scope="col" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_public_disclosure"))}</th></tr></thead><tbody data-v-049cf019><!--[-->`);
            ssrRenderList(snapshot.value.supplyRows, (b) => {
              _push(`<tr data-v-049cf019><td data-v-049cf019><strong data-v-049cf019>${ssrInterpolate(b.id)}</strong></td><td data-v-049cf019>${ssrInterpolate(b.product)}</td><td data-v-049cf019>${ssrInterpolate(b.statusLabel)}</td><td data-v-049cf019><a class="daily-report__a"${ssrRenderAttr("href", b.url)} target="_blank" rel="noopener" data-v-049cf019>${ssrInterpolate(b.url)}</a></td></tr>`);
            });
            _push(`<!--]--></tbody></table></div><div class="daily-report__supply-mobile" data-v-049cf019><!--[-->`);
            ssrRenderList(snapshot.value.supplyRows, (b) => {
              _push(`<article class="daily-report__supply-card" data-v-049cf019><p class="daily-report__supply-line" data-v-049cf019><span class="daily-report__supply-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_batch_id"))}:</span><strong data-v-049cf019>${ssrInterpolate(b.id)}</strong></p><p class="daily-report__supply-line" data-v-049cf019><span class="daily-report__supply-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_product_list"))}:</span> ${ssrInterpolate(b.product)}</p><p class="daily-report__supply-line" data-v-049cf019><span class="daily-report__supply-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_status"))}:</span> ${ssrInterpolate(b.statusLabel)}</p><p class="daily-report__supply-line daily-report__supply-line--url" data-v-049cf019><span class="daily-report__supply-label" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.col_public_disclosure"))}:</span><a class="daily-report__a"${ssrRenderAttr("href", b.url)} target="_blank" rel="noopener" data-v-049cf019>${ssrInterpolate(b.url)}</a></p></article>`);
            });
            _push(`<!--]--></div></div><!--[-->`);
            ssrRenderList(snapshot.value.supplyDetails, (sd, idx) => {
              _push(`<div class="daily-report__eudr-detail" data-v-049cf019><h3 class="daily-report__h3-eudr" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.eudr_detail_title", { n: idx + 1, id: sd.listRow.id }))}</h3>`);
              if (sd.eudr) {
                _push(`<dl class="daily-report__dl daily-report__dl--tight" data-v-049cf019><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.dds_reference"))}</dt><dd data-v-049cf019>${ssrInterpolate(sd.eudr.ddsReference)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.eu_operator"))}</dt><dd data-v-049cf019>${ssrInterpolate(sd.eudr.operator.name)} — ${ssrInterpolate(sd.eudr.operator.address)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.product"))}</dt><dd data-v-049cf019>${ssrInterpolate(sd.eudr.product.name)} (CN ${ssrInterpolate(sd.eudr.product.cnCode)}) — ${ssrInterpolate(sd.eudr.product.quantity)}</dd></div><div data-v-049cf019><dt data-v-049cf019>${ssrInterpolate(unref(t)("report.public.assessment"))}</dt><dd data-v-049cf019>${ssrInterpolate(sd.eudr.statusDetail)}</dd></div></dl>`);
              } else {
                _push(`<p class="daily-report__lead" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.extended_record_missing"))}</p>`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--><!--]-->`);
          }
          _push(`</section><section class="daily-report__section daily-report__section--muted" data-v-049cf019><h2 data-v-049cf019>${ssrInterpolate(unref(t)("report.public.section_integrity"))}</h2><ul class="daily-report__checklist" data-v-049cf019><li data-v-049cf019>${ssrInterpolate(unref(t)("report.public.integrity_item_1"))}</li><li data-v-049cf019>${ssrInterpolate(unref(t)("report.public.integrity_item_2"))}</li><li data-v-049cf019>${ssrInterpolate(unref(t)("report.public.integrity_item_3"))}</li><li data-v-049cf019>${ssrInterpolate(unref(t)("report.public.integrity_item_4"))}</li></ul></section><!--]-->`);
        }
        _push(`<footer class="daily-report__footer" data-v-049cf019><div class="daily-report__meta" data-v-049cf019><span data-v-049cf019>${ssrInterpolate(unref(t)("report.public.demo_inspection_preview"))}</span><span data-v-049cf019>${ssrInterpolate(unref(t)("report.public.inspection_date_label", { label: snapshot.value.inspectionDateLabel }))}</span><span class="no-print" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.generated_client", { time: generatedAtFormatted.value }))}</span></div><p class="daily-report__disclaimer" data-v-049cf019>${ssrInterpolate(snapshot.value.disclaimer)}</p><p class="daily-report__url no-print" data-v-049cf019>${ssrInterpolate(unref(t)("report.public.public_link", { url: canonicalUrl.value }))}</p></footer></article>`);
      }
      _push(`<button type="button" class="daily-report__to-top no-print" aria-label="Scroll to top" style="${ssrRenderStyle(showToTop.value ? null : { display: "none" })}" data-v-049cf019><svg viewBox="0 0 24 24" aria-hidden="true" data-v-049cf019><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M6 14l6-6 6 6" data-v-049cf019></path></svg></button></div><!--]-->`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/DailyReportPublic.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const DailyReportPublic = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-049cf019"]]);
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DailyReportPublic
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$o = /* @__PURE__ */ Object.assign({
  name: "Demo",
  layout: _sfc_main$t
}, {
  __name: "Demo",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    },
    section: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const NMessageProvider = defineAsyncComponent(
      () => import("./assets/index-CBaioSHH.js").then((m) => m.NMessageProvider)
    );
    const DemoPage = defineAsyncComponent(
      () => import("./assets/DemoPage-C7BooJT6.js")
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$u, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(NMessageProvider), { placement: "top" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(DemoPage), { section: __props.section }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(DemoPage), { section: __props.section }, null, 8, ["section"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(NMessageProvider), { placement: "top" }, {
                default: withCtx(() => [
                  createVNode(unref(DemoPage), { section: __props.section }, null, 8, ["section"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Demo.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$o
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$n = /* @__PURE__ */ Object.assign({
  name: "Hero"
}, {
  __name: "HeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "hero-section__content" }, _attrs))} data-v-209d8e9d><div class="hero-section__left" data-v-209d8e9d><h1 data-v-209d8e9d>${ssrInterpolate(_ctx.$t("home.hero.title_line1"))}</h1><p class="hero-section__description" data-v-209d8e9d><strong data-v-209d8e9d>${ssrInterpolate(_ctx.$t("home.hero.description_prefix"))}</strong> ${ssrInterpolate(_ctx.$t("home.hero.description_emphasis"))}</p><div class="hero-section__buttons" data-v-209d8e9d><button class="btn-client btn-success btn-success-hero" data-v-209d8e9d>${ssrInterpolate(_ctx.$t("home.hero.tell_about_business"))}</button><button class="btn-client btn-outline-primary" data-v-209d8e9d>${ssrInterpolate(_ctx.$t("home.hero.view_demo"))}</button></div></div><div class="hero-section__right" data-v-209d8e9d><img${ssrRenderAttr("src", "/images/tablets.jpg")}${ssrRenderAttr("alt", _ctx.$t("home.hero.devices_alt"))} class="hero-image" fetchpriority="high" data-v-209d8e9d></div></div>`);
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/home/HeroSection.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-209d8e9d"]]);
const _sfc_main$m = /* @__PURE__ */ Object.assign({
  name: "MetricsSection"
}, {
  __name: "MetricsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const PRICE_HIGHLIGHT_CLASS = {
      competitor: "red-text",
      ours: "green-text"
    };
    function formatMetricValue(value, highlight) {
      if (!highlight || !PRICE_HIGHLIGHT_CLASS[highlight]) {
        return value;
      }
      const cssClass = PRICE_HIGHLIGHT_CLASS[highlight];
      return value.replace(
        /€[\d,]+(?:\+)?/,
        (match) => `<span class="${cssClass}">${match}</span>`
      );
    }
    const metricCards = [
      {
        id: "profit",
        iconName: "account-balance-wallet-twotone",
        iconClass: "metric-icon--wallet",
        title: t("home.metrics.profit.title"),
        lines: [
          {
            word: t("home.metrics.profit.line1.word"),
            value: t("home.metrics.profit.line1.value"),
            highlight: "competitor"
          },
          {
            word: t("home.metrics.profit.line2.word"),
            value: t("home.metrics.profit.line2.value"),
            highlight: "ours"
          }
        ],
        right: t("home.metrics.profit.right")
      },
      {
        id: "inspection",
        iconName: "schedule-twotone",
        iconClass: "metric-icon--inspection",
        title: t("home.metrics.inspection.title"),
        lines: [
          {
            word: t("home.metrics.inspection.line1.word"),
            value: t("home.metrics.inspection.line1.value")
          },
          {
            word: t("home.metrics.inspection.line2.word"),
            value: t("home.metrics.inspection.line2.value")
          }
        ]
      },
      {
        id: "time",
        iconName: "watch-later-twotone",
        iconClass: "metric-icon--time",
        title: t("home.metrics.time.title"),
        lines: [
          {
            word: t("home.metrics.time.line1.word"),
            value: t("home.metrics.time.line1.value")
          },
          {
            word: t("home.metrics.time.line2.word"),
            value: t("home.metrics.time.line2.value")
          }
        ]
      },
      {
        id: "eudr",
        iconName: "qr-code-twotone",
        iconClass: "metric-icon--eudr",
        title: t("home.metrics.eudr.title"),
        lines: [
          {
            word: t("home.metrics.eudr.line1.word"),
            value: t("home.metrics.eudr.line1.value")
          },
          {
            word: t("home.metrics.eudr.line2.word"),
            value: t("home.metrics.eudr.line2.value")
          }
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "metrics-section" }, _attrs))} data-v-076c214d><div class="metrics-grid" data-v-076c214d><!--[-->`);
      ssrRenderList(metricCards, (metric) => {
        _push(`<article class="metric-card" data-v-076c214d><div class="metric-card-header" data-v-076c214d><div class="${ssrRenderClass([metric.iconClass, "metric-icon"])}" data-v-076c214d>`);
        _push(ssrRenderComponent(_sfc_main$C, {
          name: metric.iconName,
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</div><h2 class="metric-title" data-v-076c214d>${ssrInterpolate(metric.title)}</h2></div><div class="metric-card-body metric-card-body--savings" data-v-076c214d><div class="metric-card-body-col metric-card-body-col--left" data-v-076c214d><!--[-->`);
        ssrRenderList(metric.lines, (line, idx) => {
          _push(`<p class="metric-line" data-v-076c214d><span class="metric-bold" data-v-076c214d>${ssrInterpolate(line.word)}</span><span class="metric-text" data-v-076c214d>${formatMetricValue(
            line.value,
            line.highlight
          ) ?? ""}</span></p>`);
        });
        _push(`<!--]--></div>`);
        if (metric.right) {
          _push(`<div class="metric-card-body-col metric-card-body-col--right" data-v-076c214d><p class="metric-line metric-details--accent" data-v-076c214d>${ssrInterpolate(metric.right)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/home/MetricsSection.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const MetricsSection = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-076c214d"]]);
const _sfc_main$l = /* @__PURE__ */ Object.assign({
  name: "NichesSection"
}, {
  __name: "NichesSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const niches = [
      {
        id: "coffee",
        emoji: "☕",
        title: t("home.niches.coffee.title"),
        subtitle: t("home.niches.coffee.subtitle"),
        points: [
          t("home.niches.coffee.points.roaster_195C"),
          t("home.niches.coffee.points.grain_plus_15C"),
          t("home.niches.coffee.points.eudr_qr")
        ],
        result: t("home.niches.coffee.result"),
        cta: t("home.niches.coffee.cta")
      },
      {
        id: "bakery",
        emoji: "🍞",
        title: t("home.niches.bakery.title"),
        subtitle: t("home.niches.bakery.subtitle"),
        points: [
          t("home.niches.bakery.points.dough_26C"),
          t("home.niches.bakery.points.core_95C"),
          t("home.niches.bakery.points.starter_plus21C")
        ],
        result: t("home.niches.bakery.result"),
        cta: t("home.niches.bakery.cta")
      },
      {
        id: "meat",
        emoji: "🥩",
        title: t("home.niches.meat.title"),
        subtitle: t("home.niches.meat.subtitle"),
        points: [
          t("home.niches.meat.points.frozen_minus18C"),
          t("home.niches.meat.points.disinfection"),
          t("home.niches.meat.points.eudr_qr")
        ],
        result: t("home.niches.meat.result"),
        cta: t("home.niches.meat.cta")
      },
      {
        id: "other",
        emoji: "💼",
        title: t("home.niches.other.title"),
        subtitle: t("home.niches.other.subtitle"),
        points: [
          t("home.niches.other.points.survey_5_min"),
          t("home.niches.other.points.ccp_for_your_business"),
          t("home.niches.other.points.discount_30_forever")
        ],
        result: t("home.niches.other.result"),
        cta: t("home.niches.other.cta")
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "niches" }, _attrs))} data-v-72b0ae19><div class="niches__grid" data-v-72b0ae19><!--[-->`);
      ssrRenderList(niches, (niche) => {
        _push(`<article class="${ssrRenderClass([{ "niche-card--other": niche.id === "other" }, "niche-card card-shadow"])}" data-v-72b0ae19><div class="niche-card__header" data-v-72b0ae19><div class="niche-card__emoji" aria-hidden="true" data-v-72b0ae19>${ssrInterpolate(niche.emoji)}</div><div class="niche-card__titles" data-v-72b0ae19><h3 class="niche-card__title" data-v-72b0ae19>${ssrInterpolate(niche.title)}</h3><p class="niche-card__subtitle" data-v-72b0ae19>${ssrInterpolate(niche.subtitle)}</p></div></div><ul class="niche-card__points" data-v-72b0ae19><!--[-->`);
        ssrRenderList(niche.points, (point, idx) => {
          _push(`<li data-v-72b0ae19>${ssrInterpolate(point)}</li>`);
        });
        _push(`<!--]--></ul><p class="niche-card__result" data-v-72b0ae19>${ssrInterpolate(niche.result)}</p>`);
        if (niche.id !== "other") {
          _push(`<button type="button" class="btn-client btn-outline-primary niche-card__cta" data-v-72b0ae19>${ssrInterpolate(niche.cta)}</button>`);
        } else {
          _push(`<button type="button" class="btn-client btn-outline-primary niche-card__cta" data-v-72b0ae19>${ssrInterpolate(niche.cta)}</button>`);
        }
        _push(`</article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/home/NichesSection.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const NichesSection = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-72b0ae19"]]);
const _sfc_main$k = /* @__PURE__ */ Object.assign({
  name: "Home",
  layout: _sfc_main$t
}, {
  __name: "Home",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(`<div class="section-container-home section-container--home-hero" data-v-d5bd1c45><div class="container" data-v-d5bd1c45>`);
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(`</div></div><div class="section-container-home section-container--home-metrics" data-v-d5bd1c45><div class="container" data-v-d5bd1c45>`);
      _push(ssrRenderComponent(MetricsSection, null, null, _parent));
      _push(`</div></div><div class="section-container-home section-container--home-niches" data-v-d5bd1c45><div class="container" data-v-d5bd1c45>`);
      _push(ssrRenderComponent(NichesSection, null, null, _parent));
      _push(`</div></div><div class="section-container-home section-container--home-survey-cta" data-v-d5bd1c45><div class="container" data-v-d5bd1c45>`);
      _push(ssrRenderComponent(SurveyCtaSection, null, null, _parent));
      _push(`</div></div><!--]-->`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-d5bd1c45"]]);
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$j = /* @__PURE__ */ Object.assign({
  name: "StepsSection"
}, {
  __name: "StepsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const steps = computed(() => [
      {
        id: 1,
        title: t("how_it_work.steps.step1_title"),
        iconName: "laptop-mac-twotone",
        desc: t("how_it_work.steps.step1_desc"),
        accent: false,
        benefits: [
          t("how_it_work.steps.step1_benefit_1"),
          t("how_it_work.steps.step1_benefit_2"),
          t("how_it_work.steps.step1_benefit_3"),
          t("how_it_work.steps.step1_benefit_4"),
          t("how_it_work.steps.step1_benefit_5")
        ]
      },
      {
        id: 2,
        title: t("how_it_work.steps.step2_title"),
        iconName: "control-twotone",
        desc: t("how_it_work.steps.step2_desc"),
        accent: false,
        benefits: [
          t("how_it_work.steps.step2_benefit_1"),
          t("how_it_work.steps.step2_benefit_2"),
          t("how_it_work.steps.step2_benefit_3"),
          t("how_it_work.steps.step2_benefit_4"),
          t("how_it_work.steps.step2_benefit_5"),
          t("how_it_work.steps.step2_benefit_6")
        ]
      },
      {
        id: 3,
        title: t("how_it_work.steps.step3_title"),
        iconName: "coffee-maker-twotone",
        desc: t("how_it_work.steps.step3_desc"),
        accent: false,
        benefits: [
          t("how_it_work.steps.step3_benefit_1"),
          t("how_it_work.steps.step3_benefit_2"),
          t("how_it_work.steps.step3_benefit_3"),
          t("how_it_work.steps.step3_benefit_4"),
          t("how_it_work.steps.step3_benefit_5")
        ]
      },
      {
        id: 4,
        title: t("how_it_work.steps.step4_title"),
        iconName: "schedule-twotone",
        iconClass: "metric-icon--inspection",
        desc: t("how_it_work.steps.step4_desc"),
        accent: false,
        benefits: [
          t("how_it_work.steps.step4_benefit_1"),
          t("how_it_work.steps.step4_benefit_2"),
          t("how_it_work.steps.step4_benefit_3"),
          t("how_it_work.steps.step4_benefit_4"),
          t("how_it_work.steps.step4_benefit_5"),
          t("how_it_work.steps.step4_benefit_6"),
          t("how_it_work.steps.step4_benefit_7")
        ]
      },
      {
        id: 5,
        title: t("how_it_work.steps.step5_title"),
        iconName: "qr-code-twotone",
        iconClass: "metric-icon--eudr",
        desc: t("how_it_work.steps.step5_desc"),
        accent: false,
        benefits: [
          t("how_it_work.steps.step5_benefit_1"),
          t("how_it_work.steps.step5_benefit_2"),
          t("how_it_work.steps.step5_benefit_3")
        ]
      },
      {
        id: 6,
        title: t("how_it_work.steps.step6_title"),
        iconName: "dashboard-twotone",
        desc: t("how_it_work.steps.step6_desc"),
        accent: false,
        benefits: [
          t("how_it_work.steps.step6_benefit_1"),
          t("how_it_work.steps.step6_benefit_2"),
          t("how_it_work.steps.step6_benefit_3"),
          t("how_it_work.steps.step6_benefit_4"),
          t("how_it_work.steps.step6_benefit_5"),
          t("how_it_work.steps.step6_benefit_6"),
          t("how_it_work.steps.step6_benefit_7")
        ]
      },
      {
        id: 7,
        title: t("how_it_work.steps.step7_title"),
        iconName: "tag-export",
        desc: t("how_it_work.steps.step7_desc"),
        accent: false,
        benefits: [
          t("how_it_work.steps.step7_benefit_1"),
          t("how_it_work.steps.step7_benefit_2"),
          t("how_it_work.steps.step7_benefit_3")
        ]
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "steps-section" }, _attrs))} data-v-4238c459><div class="container" data-v-4238c459><h1 class="steps-section__heading" data-v-4238c459>${ssrInterpolate(unref(t)("how_it_work.steps.heading"))}</h1><div class="steps-section__list" data-v-4238c459><!--[-->`);
      ssrRenderList(steps.value, (step) => {
        var _a2;
        _push(`<article class="step-block" data-v-4238c459><div class="step-block__num" aria-hidden="true" data-v-4238c459>${ssrInterpolate(step.id)}</div><div class="step-block__content" data-v-4238c459><h2 class="step-block__title" data-v-4238c459>`);
        if (step.iconName) {
          _push(ssrRenderComponent(_sfc_main$C, {
            name: step.iconName,
            class: ["step-block__icon", step.iconClass],
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="step-block__title-text" data-v-4238c459>${ssrInterpolate(step.title)}</span></h2><h3 class="${ssrRenderClass([{ "step-block__desc--accent": step.accent }, "step-block__desc"])}" data-v-4238c459>${ssrInterpolate(step.desc)}</h3>`);
        if ((_a2 = step.benefits) == null ? void 0 : _a2.length) {
          _push(`<ul class="step-block__benefits" data-v-4238c459><!--[-->`);
          ssrRenderList(step.benefits, (benefit, i) => {
            _push(`<li class="step-block__benefit" data-v-4238c459>${ssrInterpolate(benefit)}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></article>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/how-it-works/StepsSection.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const StepsSection = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-4238c459"]]);
const _sfc_main$i = /* @__PURE__ */ Object.assign({
  name: "AdvantagesSection"
}, {
  __name: "AdvantagesSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const advantageCategories = computed(() => [
      {
        id: "setup-speed",
        title: t("how_it_work.advantages.cat1_title"),
        points: [
          t("how_it_work.advantages.cat1_point_1"),
          t("how_it_work.advantages.cat1_point_2"),
          t("how_it_work.advantages.cat1_point_3")
        ]
      },
      {
        id: "full-control",
        title: t("how_it_work.advantages.cat2_title"),
        points: [
          t("how_it_work.advantages.cat2_point_1"),
          t("how_it_work.advantages.cat2_point_2"),
          t("how_it_work.advantages.cat2_point_3")
        ]
      },
      {
        id: "smart-checklist",
        title: t("how_it_work.advantages.cat3_title"),
        points: [
          t("how_it_work.advantages.cat3_point_1"),
          t("how_it_work.advantages.cat3_point_2"),
          t("how_it_work.advantages.cat3_point_3")
        ]
      },
      {
        id: "inspector-proof",
        title: t("how_it_work.advantages.cat4_title"),
        points: [
          t("how_it_work.advantages.cat4_point_1"),
          t("how_it_work.advantages.cat4_point_2"),
          t("how_it_work.advantages.cat4_point_3")
        ]
      },
      {
        id: "pro-dashboard",
        title: t("how_it_work.advantages.cat5_title"),
        points: [
          t("how_it_work.advantages.cat5_point_1"),
          t("how_it_work.advantages.cat5_point_2"),
          t("how_it_work.advantages.cat5_point_3")
        ]
      },
      {
        id: "eudr-safe",
        title: t("how_it_work.advantages.cat6_title"),
        points: [
          t("how_it_work.advantages.cat6_point_1"),
          t("how_it_work.advantages.cat6_point_2"),
          t("how_it_work.advantages.cat6_point_3")
        ]
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "advantages-section" }, _attrs))} data-v-96a7cf29><div class="container" data-v-96a7cf29><h2 class="advantages-section__heading" data-v-96a7cf29>${ssrInterpolate(unref(t)("how_it_work.advantages.heading"))}</h2><div class="advantages-section__grid" data-v-96a7cf29><!--[-->`);
      ssrRenderList(advantageCategories.value, (cat) => {
        _push(`<article class="advantage-card card-shadow" data-v-96a7cf29><h3 class="advantage-card__title" data-v-96a7cf29>${ssrInterpolate(cat.title)}</h3><ul class="advantage-card__list" data-v-96a7cf29><!--[-->`);
        ssrRenderList(cat.points, (point, i) => {
          _push(`<li data-v-96a7cf29>${ssrInterpolate(point)}</li>`);
        });
        _push(`<!--]--></ul></article>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/how-it-works/AdvantagesSection.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const AdvantagesSection = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-96a7cf29"]]);
const _sfc_main$h = /* @__PURE__ */ Object.assign({
  name: "HowItWorks",
  layout: _sfc_main$t
}, {
  __name: "HowWorks",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(`<div class="how-works-page" data-v-828be139>`);
      _push(ssrRenderComponent(StepsSection, null, null, _parent));
      _push(ssrRenderComponent(AdvantagesSection, null, null, _parent));
      _push(`<div class="section-container-home section-container--home-survey-cta" data-v-828be139><div class="container" data-v-828be139>`);
      _push(ssrRenderComponent(SurveyCtaSection, null, null, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/HowWorks.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const HowWorks = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-828be139"]]);
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HowWorks
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$g = /* @__PURE__ */ Object.assign({
  name: "PrivacyPolicy",
  layout: _sfc_main$t
}, {
  __name: "PrivacyPolicy",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const page = usePage();
    const siteConfig = computed(() => page.props.siteConfig);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(`<div class="privacy-page" data-v-6ea916b8><div class="container" data-v-6ea916b8><div class="privacy-header" data-v-6ea916b8><h1 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.page.title"))}</h1><p class="subtitle" data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.page.subtitle", { name: siteConfig.value.name }))}</p></div><div class="privacy-content" data-v-6ea916b8><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.general.heading"))}</h2><p data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.general.text", { name: siteConfig.value.name }))}</p></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.collected_data.heading"))}</h2><ul data-v-6ea916b8><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.collected_data.item_name"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.collected_data.item_email"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.collected_data.item_business"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.collected_data.item_phone"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.collected_data.item_type"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.collected_data.item_country"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.collected_data.item_answers"))}</li></ul></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.purpose.heading"))}</h2><ul data-v-6ea916b8><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.purpose.item_analysis"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.purpose.item_development"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.purpose.item_contact"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.purpose.item_launch"))}</li></ul></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.legal_basis.heading"))}</h2><p data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.legal_basis.text"))}</p></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.storage.heading"))}</h2><p data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.storage.text"))}</p></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.retention.heading"))}</h2><p data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.retention.text"))}</p></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.rights.heading"))}</h2><ul data-v-6ea916b8><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.rights.item_access"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.rights.item_correction"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.rights.item_deletion"))}</li><li data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.rights.item_restriction"))}</li></ul></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.local_storage.heading"))}</h2><p data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.local_storage.text"))}</p></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.changes.heading"))}</h2><p data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.changes.text"))}</p></section><section data-v-6ea916b8><h2 data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.contacts.heading"))}</h2><p data-v-6ea916b8>${ssrInterpolate(unref(t)("privacy_policy.contacts.text"))}</p><p class="contact-email" data-v-6ea916b8>${ssrInterpolate(siteConfig.value.adminEmail)}</p></section></div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PrivacyPolicy.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const PrivacyPolicy = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-6ea916b8"]]);
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PrivacyPolicy
}, Symbol.toStringTag, { value: "Module" }));
const locale = "en";
const countries = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BV: "Bouvet Island",
  BR: "Brazil",
  IO: "British Indian Ocean Territory",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: [
    "People's Republic of China",
    "China"
  ],
  CX: "Christmas Island",
  CC: "Cocos (Keeling) Islands",
  CO: "Colombia",
  KM: "Comoros",
  CG: [
    "Republic of the Congo",
    "Congo"
  ],
  CD: [
    "Democratic Republic of the Congo",
    "Congo"
  ],
  CK: "Cook Islands",
  CR: "Costa Rica",
  CI: [
    "Cote d'Ivoire",
    "Côte d'Ivoire",
    "Ivory Coast"
  ],
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: [
    "Czech Republic",
    "Czechia"
  ],
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Falkland Islands (Malvinas)",
  FO: "Faroe Islands",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "French Southern Territories",
  GA: "Gabon",
  GM: [
    "Republic of The Gambia",
    "The Gambia",
    "Gambia"
  ],
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard Island and McDonald Islands",
  VA: "Holy See (Vatican City State)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: [
    "Islamic Republic of Iran",
    "Iran"
  ],
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "North Korea",
  KR: [
    "South Korea",
    "Korea, Republic of",
    "Republic of Korea"
  ],
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macao",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia, Federated States of",
  MD: "Moldova, Republic of",
  MC: "Monaco",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: [
    "Netherlands",
    "The Netherlands",
    "Netherlands (Kingdom of the)"
  ],
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MK: [
    "The Republic of North Macedonia",
    "North Macedonia"
  ],
  MP: "Northern Mariana Islands",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: [
    "State of Palestine",
    "Palestine"
  ],
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PN: [
    "Pitcairn",
    "Pitcairn Islands"
  ],
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RU: [
    "Russian Federation",
    "Russia"
  ],
  RW: "Rwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre and Miquelon",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome and Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  GS: "South Georgia and the South Sandwich Islands",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard and Jan Mayen",
  SZ: "Eswatini",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syrian Arab Republic",
  TW: [
    "Taiwan, Province of China",
    "Taiwan"
  ],
  TJ: "Tajikistan",
  TZ: [
    "United Republic of Tanzania",
    "Tanzania"
  ],
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: [
    "Türkiye",
    "Turkey"
  ],
  TM: "Turkmenistan",
  TC: "Turks and Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: [
    "United Arab Emirates",
    "UAE"
  ],
  GB: [
    "United Kingdom",
    "UK",
    "Great Britain"
  ],
  US: [
    "United States of America",
    "United States",
    "USA",
    "U.S.A.",
    "US",
    "U.S."
  ],
  UM: "United States Minor Outlying Islands",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Virgin Islands, British",
  VI: "Virgin Islands, U.S.",
  WF: "Wallis and Futuna",
  EH: "Western Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: [
    "Åland Islands",
    "Aland Islands"
  ],
  BQ: "Bonaire, Sint Eustatius and Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Isle of Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (French part)",
  RS: "Serbia",
  SX: "Sint Maarten (Dutch part)",
  SS: "South Sudan",
  XK: "Kosovo"
};
const enLocale = {
  locale,
  countries
};
countries$1.registerLocale(enLocale);
const englishCountryNamesByAlpha2 = countries$1.getNames("en", {
  select: "official"
});
function buildSortedEnglishCountrySelectOptions(namesByAlpha2) {
  return Object.entries(namesByAlpha2).map(([value, label]) => ({ value, label })).sort(
    (a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" })
  );
}
const SURVEY_ENGLISH_COUNTRY_SELECT_OPTIONS = buildSortedEnglishCountrySelectOptions(englishCountryNamesByAlpha2);
function isSurveyCountryAlpha2Valid(value) {
  if (typeof value !== "string" || value === "") {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(
    englishCountryNamesByAlpha2,
    value
  );
}
const SURVEY_PAGE_LEAD = {
  title: "survey.lead.title",
  bullets: [
    "survey.lead.bullet_discount",
    "survey.lead.bullet_access",
    "survey.lead.bullet_influence"
  ],
  /** П. 7.3: явное ожидание перед полями (после вопросов опросника). */
  expectation: "survey.lead.expectation"
};
const SURVEY_PAGE_SUCCESS = {
  title: "survey.success.title",
  /** Текст после заголовка; перенос после «песочницу),» — \\n + white-space: pre-line. */
  bodyParagraphs: "survey.success.body",
  reassurance: "survey.success.reassurance",
  updateViaEmailHint: "survey.success.update_hint"
};
const surveyQuestionsByIdLive = {};
let mainQuestionIds = [];
let branchChildIds = /* @__PURE__ */ new Set();
function getSurveyQuestionsById() {
  return surveyQuestionsByIdLive;
}
function getSurveyMainQuestionIds() {
  return mainQuestionIds;
}
function replaceSurveyQuestionsById(next) {
  if (!next || typeof next !== "object") {
    return;
  }
  if (Object.keys(next).length === 0) {
    return;
  }
  for (const k of Object.keys(surveyQuestionsByIdLive)) {
    delete surveyQuestionsByIdLive[k];
  }
  Object.assign(surveyQuestionsByIdLive, next);
  rebuildDerivedData();
}
function rebuildDerivedData() {
  const allIds = Object.keys(surveyQuestionsByIdLive);
  branchChildIds = /* @__PURE__ */ new Set();
  for (const q of Object.values(surveyQuestionsByIdLive)) {
    if (q.branches && typeof q.branches === "object") {
      for (const childId of Object.values(q.branches)) {
        branchChildIds.add(childId);
      }
    }
  }
  mainQuestionIds = allIds.filter((id) => !branchChildIds.has(id));
}
function getSurveyBranchParentId() {
  for (const q of Object.values(surveyQuestionsByIdLive)) {
    if (q.branches && typeof q.branches === "object" && Object.keys(q.branches).length > 0) {
      return q.id;
    }
  }
  return null;
}
function getSurveyBranchChildIds() {
  return [...branchChildIds];
}
function surveyQuestionAllOptions(question) {
  if (!question) {
    return [];
  }
  if (Array.isArray(question.option_groups) && question.option_groups.length > 0) {
    const out = [];
    for (const g of question.option_groups) {
      if (Array.isArray(g.options)) {
        out.push(...g.options);
      }
    }
    return out;
  }
  return Array.isArray(question.options) ? question.options : [];
}
function surveyOtherDetailKey(questionId) {
  return `${questionId}__other`;
}
function getSurveyQuestionByStepId(stepId) {
  return surveyQuestionsByIdLive[stepId] ?? null;
}
const LEAD_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const SURVEY_FLOW_STEP_INTRO = "intro";
const SURVEY_FLOW_STEP_LEAD = "lead";
const SURVEY_FLOW_STEP_SUCCESS = "success";
const SURVEY_DIGITAL_CODE_VERIFICATION = "digital_code";
const SURVEY_RADIO_AUTO_ADVANCE_MS = 280;
function getSurveyProgressTotal() {
  return getSurveyMainQuestionIds().length + 4;
}
function resolveBranchStepId(answers) {
  const branchParentId = getSurveyBranchParentId();
  if (!branchParentId) {
    return null;
  }
  const parent = getSurveyQuestionsById()[branchParentId];
  const value = answers[branchParentId];
  if (!(parent == null ? void 0 : parent.branches) || value == null || value === "") {
    return null;
  }
  const nextId = parent.branches[value];
  return typeof nextId === "string" ? nextId : null;
}
function buildVisibleSurveyStepIds(surveySubmitted, answers) {
  if (surveySubmitted) {
    return [SURVEY_FLOW_STEP_SUCCESS];
  }
  const mainIds = getSurveyMainQuestionIds();
  const branchParentId = getSurveyBranchParentId();
  if (!branchParentId) {
    return [
      SURVEY_FLOW_STEP_INTRO,
      ...mainIds,
      SURVEY_FLOW_STEP_LEAD,
      SURVEY_DIGITAL_CODE_VERIFICATION
    ];
  }
  const parentIdx = mainIds.indexOf(branchParentId);
  const beforeBranch = mainIds.slice(0, parentIdx + 1);
  const afterBranch = mainIds.slice(parentIdx + 1);
  const branch = resolveBranchStepId(answers);
  if (!branch) {
    return [SURVEY_FLOW_STEP_INTRO, ...beforeBranch, SURVEY_DIGITAL_CODE_VERIFICATION];
  }
  return [
    SURVEY_FLOW_STEP_INTRO,
    ...beforeBranch,
    branch,
    ...afterBranch,
    SURVEY_FLOW_STEP_LEAD,
    SURVEY_DIGITAL_CODE_VERIFICATION
  ];
}
function clearBranchDerivedAnswers(answers) {
  for (const id of getSurveyBranchChildIds()) {
    delete answers[id];
    delete answers[surveyOtherDetailKey(id)];
  }
}
function isSurveyQuestionAnswerValid(question, answers) {
  const id = question.id;
  if (question.type === "text") {
    if (question.text_allow_empty) {
      return true;
    }
    const raw = answers[id];
    return typeof raw === "string" && raw.trim().length > 0;
  }
  if (question.type === "select" && question.country_iso_select) {
    return isSurveyCountryAlpha2Valid(answers[id]);
  }
  const opts = surveyQuestionAllOptions(question);
  if (!opts.length) {
    return false;
  }
  if (question.type === "radio" || question.type === "select") {
    const value = answers[id];
    if (value == null || value === "") {
      return false;
    }
    const opt = opts.find((o) => o.value === value);
    if (!opt) {
      return false;
    }
    if (opt.is_other) {
      const detail = answers[surveyOtherDetailKey(id)];
      return typeof detail === "string" && detail.trim().length > 0;
    }
    return true;
  }
  if (question.type === "checkbox") {
    const arr = answers[id];
    const list = Array.isArray(arr) ? arr : [];
    if (question.checkbox_allow_empty && list.length === 0) {
      return true;
    }
    if (list.length === 0) {
      return false;
    }
    const hasOther = list.some((v) => {
      const opt = opts.find((o) => o.value === v);
      return (opt == null ? void 0 : opt.is_other) === true;
    });
    if (hasOther) {
      const detail = answers[surveyOtherDetailKey(id)];
      return typeof detail === "string" && detail.trim().length > 0;
    }
    return true;
  }
  return false;
}
function surveyRadioAllowsAutoAdvance(question, selectedValue) {
  if ((question == null ? void 0 : question.type) !== "radio") {
    return false;
  }
  if (selectedValue == null || selectedValue === "") {
    return false;
  }
  const opt = surveyQuestionAllOptions(question).find(
    (o) => o.value === selectedValue
  );
  return !(opt == null ? void 0 : opt.is_other);
}
function surveyQuestionUsesNextButton(question) {
  if (!question) {
    return false;
  }
  return question.type === "checkbox" || question.type === "select" || question.type === "text";
}
function surveyLeadEmailErrorMessage(raw) {
  const s = String(raw ?? "").trim();
  if (!s) {
    return "survey.validation.email_required";
  }
  if (!LEAD_EMAIL_RE.test(s)) {
    return "survey.validation.email_invalid";
  }
  return "";
}
function maskSurveyEmail(email) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const atIndex = normalizedEmail.indexOf("@");
  if (atIndex <= 0 || atIndex === normalizedEmail.length - 1) {
    return "***";
  }
  const localPart = normalizedEmail.slice(0, atIndex);
  const domainPart = normalizedEmail.slice(atIndex + 1);
  const dotIndex = domainPart.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === domainPart.length - 1) {
    return "***";
  }
  const domainName = domainPart.slice(0, dotIndex);
  const domainZone = domainPart.slice(dotIndex + 1);
  const localPrefix = localPart.slice(0, Math.min(3, localPart.length));
  const domainTail = domainName.slice(Math.max(0, domainName.length - 3));
  const zoneHead = domainZone;
  return `${localPrefix}*******${domainTail}.${zoneHead}`;
}
function surveyFieldText(t, value) {
  if (value == null || value === "") {
    return "";
  }
  const s = String(value);
  if (s.startsWith("survey.")) {
    return t(s);
  }
  return s;
}
function createSurveyFieldTextTranslator(t) {
  return (value) => surveyFieldText(t, value);
}
const _sfc_main$f = /* @__PURE__ */ Object.assign({ name: "SurveyChoiceList" }, {
  __name: "SurveyChoiceList",
  __ssrInlineRender: true,
  props: {
    /** id заголовка вопроса (h2) для связи с `radiogroup` (п. 7.6). */
    groupLabelledby: {
      type: String,
      required: true
    },
    /** Варианты из конфига вопроса. */
    options: {
      type: Array,
      required: true
    },
    /** Текущее значение ответа (radio). */
    selectedValue: {
      type: String,
      default: void 0
    }
  },
  emits: {
    /** Выбор варианта одиночного ответа. */
    pick: (value) => typeof value === "string"
  },
  setup(__props) {
    const { t } = useI18n();
    const tr = createSurveyFieldTextTranslator(t);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "survey-choice-list survey-page__options-stack",
        role: "radiogroup",
        "aria-labelledby": __props.groupLabelledby,
        "aria-required": "true"
      }, _attrs))} data-v-632520ce><!--[-->`);
      ssrRenderList(__props.options, (opt) => {
        _push(`<button type="button" role="radio"${ssrRenderAttr("aria-checked", __props.selectedValue === opt.value)} class="${ssrRenderClass([{
          "survey-choice-list__btn--selected": __props.selectedValue === opt.value
        }, "survey-choice-list__btn"])}" data-v-632520ce>${ssrInterpolate(unref(tr)(opt.label))}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyChoiceList.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const SurveyChoiceList = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-632520ce"]]);
function foldCountrySearchString(s) {
  return s.normalize("NFKC").normalize("NFD").replace(new RegExp("\\p{M}", "gu"), "").toLowerCase();
}
const foldedCountryOptionsCache = /* @__PURE__ */ new WeakMap();
function getFoldedCountryOptions(options) {
  const cached = foldedCountryOptionsCache.get(options);
  if (cached) {
    return cached;
  }
  const prepared = options.map((opt) => ({
    source: opt,
    foldedLabel: foldCountrySearchString(opt.label)
  }));
  foldedCountryOptionsCache.set(options, prepared);
  return prepared;
}
function filterCountryOptionsByLabel(options, queryRaw) {
  const q = queryRaw.trim();
  if (!q) {
    return options;
  }
  const needle = foldCountrySearchString(q);
  const prepared = getFoldedCountryOptions(options);
  return prepared.filter((opt) => opt.foldedLabel.startsWith(needle)).map((opt) => opt.source);
}
const _sfc_main$e = /* @__PURE__ */ Object.assign({ name: "SurveyCountrySelect" }, {
  __name: "SurveyCountrySelect",
  __ssrInlineRender: true,
  props: {
    /** Значение ответа: ISO 3166-1 alpha-2. */
    modelValue: {
      type: String,
      default: ""
    },
    /** Список { value, label } из того же источника, что и конфиг вопроса. */
    options: {
      type: Array,
      required: true
    },
    /** id кнопки-триггера; совпадает с `for` у подписи поля в шаге вопроса. */
    triggerId: {
      type: String,
      required: true
    },
    /** Текст вопроса для доступности свёрнутого combobox. */
    ariaLabel: {
      type: String,
      required: true
    },
    /** id подсказок (подзаголовок, field_caption), через пробел. */
    ariaDescribedby: {
      type: String,
      default: void 0
    },
    /** Обязательный ответ на шаге (как у прежнего native select). */
    ariaRequired: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    "update:modelValue": (v) => typeof v === "string"
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { t } = useI18n();
    const PLACEHOLDER = computed(() => t("survey.ui.select_placeholder"));
    const rootRef = ref(null);
    ref(null);
    const filterRef = ref(null);
    const listRef = ref(null);
    const open = ref(false);
    const filterQuery = ref("");
    const activeIndex = ref(-1);
    let activeOptionScrollRafId = null;
    const listboxId = computed(() => `${props.triggerId}-country-listbox`);
    function optionElementId(value) {
      return `${props.triggerId}-opt-${value}`;
    }
    const selectedLabel = computed(() => {
      if (!props.modelValue) {
        return PLACEHOLDER.value;
      }
      const opt = props.options.find((o) => o.value === props.modelValue);
      return (opt == null ? void 0 : opt.label) ?? props.modelValue;
    });
    const filteredOptions = computed(
      () => filterCountryOptionsByLabel(props.options, filterQuery.value)
    );
    const activeDescendantId = computed(() => {
      const list = filteredOptions.value;
      const i = activeIndex.value;
      if (i < 0 || i >= list.length) {
        return void 0;
      }
      return optionElementId(list[i].value);
    });
    watch(filteredOptions, (list) => {
      if (activeIndex.value >= list.length) {
        activeIndex.value = list.length > 0 ? list.length - 1 : -1;
      }
    });
    watch(filterQuery, () => {
      if (!open.value) {
        return;
      }
      const list = filteredOptions.value;
      activeIndex.value = list.length > 0 ? 0 : -1;
    });
    watch(open, (isOpen) => {
      if (!isOpen) {
        return;
      }
      filterQuery.value = "";
      activeIndex.value = filteredOptions.value.length > 0 ? 0 : -1;
      nextTick(() => {
        var _a2;
        (_a2 = filterRef.value) == null ? void 0 : _a2.focus();
      });
    });
    function scrollActiveOptionIntoViewIfNeeded() {
      const listEl = listRef.value;
      if (!listEl) {
        return;
      }
      const id = activeDescendantId.value;
      if (!id) {
        return;
      }
      const optionEl = document.getElementById(id);
      if (!optionEl) {
        return;
      }
      const listRect = listEl.getBoundingClientRect();
      const optionRect = optionEl.getBoundingClientRect();
      if (optionRect.top < listRect.top) {
        listEl.scrollTop -= listRect.top - optionRect.top;
        return;
      }
      if (optionRect.bottom > listRect.bottom) {
        listEl.scrollTop += optionRect.bottom - listRect.bottom;
      }
    }
    function scheduleActiveOptionScroll() {
      if (activeOptionScrollRafId != null) {
        cancelAnimationFrame(activeOptionScrollRafId);
      }
      activeOptionScrollRafId = requestAnimationFrame(() => {
        activeOptionScrollRafId = null;
        scrollActiveOptionIntoViewIfNeeded();
      });
    }
    watch(activeIndex, () => {
      nextTick(() => {
        scheduleActiveOptionScroll();
      });
    });
    function closePanel() {
      open.value = false;
      filterQuery.value = "";
      activeIndex.value = -1;
    }
    function onDocumentPointerDownCapture(e) {
      if (!open.value) {
        return;
      }
      const root = rootRef.value;
      if (root && e.target instanceof globalThis.Node && root.contains(e.target)) {
        return;
      }
      closePanel();
    }
    onMounted(() => {
      document.addEventListener(
        "pointerdown",
        onDocumentPointerDownCapture,
        true
      );
    });
    onUnmounted(() => {
      if (activeOptionScrollRafId != null) {
        cancelAnimationFrame(activeOptionScrollRafId);
        activeOptionScrollRafId = null;
      }
      document.removeEventListener(
        "pointerdown",
        onDocumentPointerDownCapture,
        true
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "rootRef",
        ref: rootRef,
        class: ["survey-country-select", { "survey-country-select--open": open.value }]
      }, _attrs))} data-v-a715e7e4><div class="${ssrRenderClass([{
        "survey-country-select__trigger-shell--open": open.value,
        "survey-country-select__trigger-shell--has-value": __props.modelValue
      }, "survey-page__control survey-country-select__trigger-shell"])}" data-v-a715e7e4><button${ssrRenderAttr("id", __props.triggerId)} type="button" class="survey-country-select__trigger"${ssrRenderAttr("role", open.value ? void 0 : "combobox")}${ssrRenderAttr("aria-expanded", open.value ? "true" : "false")}${ssrRenderAttr("aria-controls", listboxId.value)} aria-haspopup="listbox"${ssrRenderAttr("aria-label", __props.ariaLabel)}${ssrRenderAttr("aria-describedby", __props.ariaDescribedby || void 0)}${ssrRenderAttr("aria-required", __props.ariaRequired ? "true" : void 0)}${ssrRenderAttr("tabindex", open.value ? -1 : 0)} data-v-a715e7e4><span class="survey-country-select__trigger-text" data-v-a715e7e4>${ssrInterpolate(selectedLabel.value)}</span></button>`);
      if (__props.modelValue) {
        _push(`<button type="button" class="survey-country-select__clear"${ssrRenderAttr("aria-label", unref(t)("survey.ui.country_clear"))}${ssrRenderAttr("tabindex", open.value ? -1 : 0)} data-v-a715e7e4>`);
        _push(ssrRenderComponent(_sfc_main$C, {
          name: "close",
          class: "survey-country-select__clear-icon",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="survey-country-select__chevron" aria-hidden="true" data-v-a715e7e4></span></div><div class="survey-country-select__popover" style="${ssrRenderStyle(open.value ? null : { display: "none" })}" data-v-a715e7e4><input${ssrRenderAttr("value", filterQuery.value)} type="search" class="survey-page__control survey-country-select__filter" role="combobox" aria-expanded="true"${ssrRenderAttr("aria-controls", listboxId.value)}${ssrRenderAttr("aria-activedescendant", activeDescendantId.value)} aria-autocomplete="list"${ssrRenderAttr("aria-label", unref(t)("survey.ui.country_search"))} autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search"${ssrRenderAttr("placeholder", unref(t)("survey.ui.country_search_placeholder"))} data-v-a715e7e4><ul${ssrRenderAttr("id", listboxId.value)} role="listbox" class="survey-country-select__list" tabindex="-1" data-v-a715e7e4><!--[-->`);
      ssrRenderList(filteredOptions.value, (opt, idx) => {
        _push(`<li${ssrRenderAttr("id", optionElementId(opt.value))} role="option"${ssrRenderAttr("aria-selected", __props.modelValue === opt.value ? "true" : "false")} class="${ssrRenderClass([{
          "survey-country-select__option--active": idx === activeIndex.value
        }, "survey-country-select__option"])}" data-v-a715e7e4>${ssrInterpolate(opt.label)}</li>`);
      });
      _push(`<!--]--></ul></div></div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyCountrySelect.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const SurveyCountrySelect = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-a715e7e4"]]);
const _sfc_main$d = /* @__PURE__ */ Object.assign({ name: "SurveyCountryPicker" }, {
  __name: "SurveyCountryPicker",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    triggerId: {
      type: String,
      required: true
    },
    ariaLabel: {
      type: String,
      required: true
    },
    ariaDescribedby: {
      type: String,
      default: void 0
    },
    ariaRequired: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    "update:modelValue": (v) => typeof v === "string"
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(SurveyCountrySelect, mergeProps({
        "model-value": __props.modelValue,
        options: unref(SURVEY_ENGLISH_COUNTRY_SELECT_OPTIONS),
        "trigger-id": __props.triggerId,
        "aria-label": __props.ariaLabel,
        "aria-describedby": __props.ariaDescribedby,
        "aria-required": __props.ariaRequired,
        "onUpdate:modelValue": ($event) => _ctx.$emit("update:modelValue", $event)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyCountryPicker.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ Object.assign({ name: "SurveyMultiChoice" }, {
  __name: "SurveyMultiChoice",
  __ssrInlineRender: true,
  props: {
    /** id заголовка вопроса для `role="group"` (п. 7.6). */
    groupLabelledby: {
      type: String,
      required: true
    },
    /** id подзаголовка (несколько вариантов) — `aria-describedby`. */
    subtitleId: {
      type: String,
      default: ""
    },
    /** Плоский список вариантов, если не заданы секции `optionGroups`. */
    options: {
      type: Array,
      default: () => []
    },
    /**
     * Секции с подзаголовками (п. 14 опросника); один `role="group"` на весь список.
     */
    optionGroups: {
      type: Array,
      default: null
    },
    /** Текущие выбранные value (копия из answers[questionId]). */
    selectedValues: {
      type: Array,
      default: () => []
    },
    /** `false` для вопросов с необязательным мультивыбором (п. 14). */
    groupAriaRequired: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    /** Клик по чекбоксу варианта — родитель обновляет answers и сброс «Другое». */
    toggle: (value) => typeof value === "string"
  },
  setup(__props) {
    const { t } = useI18n();
    const tr = createSurveyFieldTextTranslator(t);
    const props = __props;
    const useOptionGroups = computed(
      () => Array.isArray(props.optionGroups) && props.optionGroups.length > 0
    );
    function isSelected(value) {
      return props.selectedValues.includes(value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "survey-multi-choice survey-page__options-stack",
        role: "group",
        "aria-labelledby": __props.groupLabelledby,
        "aria-describedby": __props.subtitleId || void 0,
        "aria-required": __props.groupAriaRequired ? "true" : void 0
      }, _attrs))} data-v-9db4f6c4>`);
      if (useOptionGroups.value) {
        _push(`<!--[-->`);
        ssrRenderList(__props.optionGroups, (group, gi) => {
          _push(`<div class="survey-multi-choice__group-block" data-v-9db4f6c4>`);
          if (group.heading) {
            _push(`<p class="survey-multi-choice__group-heading survey-page__text-wrap" data-v-9db4f6c4>${ssrInterpolate(unref(tr)(group.heading))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(group.options, (opt) => {
            _push(`<label class="${ssrRenderClass([{
              "survey-multi-choice__row--selected": isSelected(
                opt.value
              )
            }, "survey-multi-choice__row"])}" data-v-9db4f6c4><input class="survey-multi-choice__input" type="checkbox"${ssrIncludeBooleanAttr(isSelected(opt.value)) ? " checked" : ""} data-v-9db4f6c4><span class="survey-multi-choice__label-text" data-v-9db4f6c4>${ssrInterpolate(unref(tr)(opt.label))}</span></label>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(__props.options, (opt) => {
          _push(`<label class="${ssrRenderClass([{
            "survey-multi-choice__row--selected": isSelected(opt.value)
          }, "survey-multi-choice__row"])}" data-v-9db4f6c4><input class="survey-multi-choice__input" type="checkbox"${ssrIncludeBooleanAttr(isSelected(opt.value)) ? " checked" : ""} data-v-9db4f6c4><span class="survey-multi-choice__label-text" data-v-9db4f6c4>${ssrInterpolate(unref(tr)(opt.label))}</span></label>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyMultiChoice.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const SurveyMultiChoice = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-9db4f6c4"]]);
const _sfc_main$b = /* @__PURE__ */ Object.assign({ name: "SurveyQuestionStep" }, {
  __name: "SurveyQuestionStep",
  __ssrInlineRender: true,
  props: {
    /** Полное описание вопроса из API/заглушки. */
    question: {
      type: Object,
      required: true
    },
    /** Id текущего шага (ключ в answers для value вопроса). */
    stepId: {
      type: String,
      required: true
    },
    /** Общий объект ответов опроса. */
    answers: {
      type: Object,
      required: true
    },
    /** Ключ для текста «Другое». */
    otherDetailKey: {
      type: String,
      required: true
    },
    /** Показать textarea уточнения. */
    showOtherField: {
      type: Boolean,
      default: false
    },
    /** Показать кнопку «Далее». */
    showNextButton: {
      type: Boolean,
      default: false
    },
    /** Блокировка «Далее», пока шаг невалиден (п. 6.5). */
    nextDisabled: {
      type: Boolean,
      default: false
    },
    /** id заголовка для переноса фокуса при смене шага. */
    stepHeadingId: {
      type: String,
      default: "survey-step-heading"
    }
  },
  emits: {
    /** Выбран вариант radio; родитель вызывает applyRadioAnswer. */
    "pick-radio": (value) => typeof value === "string",
    /** Переключён checkbox; родитель — toggleCheckboxOption. */
    "toggle-checkbox": (value) => typeof value === "string",
    /** Переход на следующий шаг. */
    next: () => true
  },
  setup(__props) {
    const { t } = useI18n();
    const tr = createSurveyFieldTextTranslator(t);
    const props = __props;
    const checkboxSelected = computed(() => {
      const arr = props.answers[props.question.id];
      return Array.isArray(arr) ? arr : [];
    });
    const questionSubtitleId = computed(
      () => `survey-q-subtitle-${props.question.id}`
    );
    const fieldCaptionId = computed(() => `survey-field-caption-${props.question.id}`);
    const selectId = computed(() => `survey-select-${props.question.id}`);
    const otherTextareaId = computed(() => `survey-other-${props.stepId}`);
    const openTextInputId = computed(() => `survey-open-text-${props.question.id}`);
    const textFieldAriaDescribedBy = computed(() => {
      if (props.question.type !== "text" || !props.question.subtitle) {
        return void 0;
      }
      return questionSubtitleId.value;
    });
    const selectAriaDescribedBy = computed(() => {
      const parts = [];
      if (props.question.subtitle) {
        parts.push(questionSubtitleId.value);
      }
      if (props.question.field_caption) {
        parts.push(fieldCaptionId.value);
      }
      return parts.length ? parts.join(" ") : void 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "survey-question-step" }, _attrs))} data-v-8acfebc3><div class="survey-question-step__main" data-v-8acfebc3><h2${ssrRenderAttr("id", __props.stepHeadingId)} class="survey-question-step__title survey-page__text-wrap" tabindex="-1" data-v-8acfebc3>${ssrInterpolate(unref(tr)(__props.question.question_text))}</h2>`);
      if (__props.question.subtitle) {
        _push(`<p${ssrRenderAttr("id", questionSubtitleId.value)} class="survey-question-step__subtitle survey-page__text-wrap" data-v-8acfebc3>${ssrInterpolate(unref(tr)(__props.question.subtitle))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.question.field_caption && __props.question.type !== "text") {
        _push(`<label${ssrRenderAttr("id", fieldCaptionId.value)} class="survey-question-step__caption survey-page__text-wrap"${ssrRenderAttr("for", selectId.value)} data-v-8acfebc3>${ssrInterpolate(unref(tr)(__props.question.field_caption))}</label>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.question.type === "radio") {
        _push(ssrRenderComponent(SurveyChoiceList, {
          "group-labelledby": __props.stepHeadingId,
          options: __props.question.options,
          "selected-value": __props.answers[__props.stepId],
          onPick: ($event) => _ctx.$emit("pick-radio", $event)
        }, null, _parent));
      } else if (__props.question.type === "select" && __props.question.country_iso_select) {
        _push(`<div class="survey-question-step__select-wrap" data-v-8acfebc3>`);
        _push(ssrRenderComponent(_sfc_main$d, {
          modelValue: __props.answers[__props.stepId],
          "onUpdate:modelValue": ($event) => __props.answers[__props.stepId] = $event,
          "trigger-id": selectId.value,
          "aria-label": unref(tr)(__props.question.question_text),
          "aria-describedby": selectAriaDescribedBy.value
        }, null, _parent));
        _push(`</div>`);
      } else if (__props.question.type === "select") {
        _push(`<div class="survey-question-step__select-wrap" data-v-8acfebc3><select${ssrRenderAttr("id", selectId.value)} class="survey-page__control survey-question-step__select"${ssrRenderAttr("aria-label", unref(tr)(__props.question.question_text))}${ssrRenderAttr("aria-describedby", selectAriaDescribedBy.value)} aria-required="true" data-v-8acfebc3><option disabled value="" data-v-8acfebc3${ssrIncludeBooleanAttr(Array.isArray(__props.answers[__props.stepId]) ? ssrLooseContain(__props.answers[__props.stepId], "") : ssrLooseEqual(__props.answers[__props.stepId], "")) ? " selected" : ""}>${ssrInterpolate(unref(t)("survey.ui.select_placeholder"))}</option><!--[-->`);
        ssrRenderList(__props.question.options, (opt) => {
          _push(`<option${ssrRenderAttr("value", opt.value)} data-v-8acfebc3${ssrIncludeBooleanAttr(Array.isArray(__props.answers[__props.stepId]) ? ssrLooseContain(__props.answers[__props.stepId], opt.value) : ssrLooseEqual(__props.answers[__props.stepId], opt.value)) ? " selected" : ""}>${ssrInterpolate(unref(tr)(opt.label))}</option>`);
        });
        _push(`<!--]--></select></div>`);
      } else if (__props.question.type === "checkbox") {
        _push(ssrRenderComponent(SurveyMultiChoice, {
          "group-labelledby": __props.stepHeadingId,
          "subtitle-id": __props.question.subtitle ? questionSubtitleId.value : "",
          options: __props.question.options ?? [],
          "option-groups": __props.question.option_groups,
          "group-aria-required": !__props.question.checkbox_allow_empty,
          "selected-values": checkboxSelected.value,
          onToggle: ($event) => _ctx.$emit("toggle-checkbox", $event)
        }, null, _parent));
      } else if (__props.question.type === "text") {
        _push(`<div class="survey-question-step__text-wrap" data-v-8acfebc3><label class="survey-page__field"${ssrRenderAttr("for", openTextInputId.value)} data-v-8acfebc3>`);
        if (__props.question.field_caption) {
          _push(`<span class="survey-page__field-label survey-page__text-wrap" data-v-8acfebc3>${ssrInterpolate(unref(tr)(__props.question.field_caption))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.question.text_multiline !== false) {
          _push(`<textarea${ssrRenderAttr("id", openTextInputId.value)} class="survey-page__control survey-question-step__textarea survey-question-step__open-text"${ssrRenderAttr("rows", __props.question.text_rows ?? 4)} autocomplete="off"${ssrRenderAttr("aria-label", unref(tr)(__props.question.question_text))}${ssrRenderAttr("aria-describedby", textFieldAriaDescribedBy.value)}${ssrRenderAttr(
            "aria-required",
            __props.question.text_allow_empty ? void 0 : "true"
          )} data-v-8acfebc3>${ssrInterpolate(__props.answers[__props.stepId])}</textarea>`);
        } else {
          _push(`<input${ssrRenderAttr("id", openTextInputId.value)}${ssrRenderAttr("value", __props.answers[__props.stepId])} type="text" class="survey-page__control survey-question-step__open-text-input" autocomplete="off"${ssrRenderAttr("aria-label", unref(tr)(__props.question.question_text))}${ssrRenderAttr("aria-describedby", textFieldAriaDescribedBy.value)}${ssrRenderAttr(
            "aria-required",
            __props.question.text_allow_empty ? void 0 : "true"
          )} data-v-8acfebc3>`);
        }
        _push(`</label></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showOtherField) {
        _push(`<label class="survey-page__field survey-question-step__field--other"${ssrRenderAttr("for", otherTextareaId.value)} data-v-8acfebc3><span class="survey-page__field-label" data-v-8acfebc3>${ssrInterpolate(unref(tr)(__props.question.other_detail_field_label) || unref(t)("survey.ui.other_default_label"))}</span><textarea${ssrRenderAttr("id", otherTextareaId.value)} class="survey-page__control survey-question-step__textarea" rows="3" autocomplete="off"${ssrRenderAttr(
          "aria-label",
          unref(t)("survey.ui.other_aria_prefix") + " " + unref(tr)(__props.question.question_text)
        )} data-v-8acfebc3>${ssrInterpolate(__props.answers[__props.otherDetailKey])}</textarea></label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.showNextButton) {
        _push(`<footer class="survey-page__footer" data-v-8acfebc3><button type="button" class="survey-question-step__next survey-primary-action"${ssrIncludeBooleanAttr(__props.nextDisabled) ? " disabled" : ""}${ssrRenderAttr("aria-disabled", __props.nextDisabled ? "true" : "false")}${ssrRenderAttr(
          "aria-label",
          __props.nextDisabled ? unref(t)("survey.ui.next_disabled_aria") : void 0
        )} data-v-8acfebc3>${ssrInterpolate(unref(t)("survey.ui.next"))}</button></footer>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyQuestionStep.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const SurveyQuestionStep = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-8acfebc3"]]);
const _sfc_main$a = /* @__PURE__ */ Object.assign({ name: "SurveySubmittedState" }, {
  __name: "SurveySubmittedState",
  __ssrInlineRender: true,
  props: {
    maskedEmail: {
      type: String,
      required: true
    },
    submittedAt: {
      type: String,
      default: null
    },
    stepHeadingId: {
      type: String,
      default: "survey-step-heading"
    }
  },
  emits: {
    "reset-survey": () => true
  },
  setup(__props) {
    const { t } = useI18n();
    const props = __props;
    function formatSubmittedAt(isoValue) {
      if (!isoValue) {
        return "";
      }
      const date = new Date(isoValue);
      if (Number.isNaN(date.getTime())) {
        return "";
      }
      return date.toLocaleString();
    }
    const formattedSubmittedAt = computed(
      () => formatSubmittedAt(props.submittedAt)
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "survey-submitted-state",
        "aria-live": "polite"
      }, _attrs))} data-v-8f69a8b5><div class="survey-submitted-state__inner" data-v-8f69a8b5><h2${ssrRenderAttr("id", __props.stepHeadingId)} class="survey-submitted-state__title survey-page__text-wrap" tabindex="-1" data-v-8f69a8b5>${ssrInterpolate(unref(t)("survey.submitted_state.title"))}</h2><p class="survey-submitted-state__text survey-page__text-wrap" data-v-8f69a8b5>${ssrInterpolate(unref(t)("survey.submitted_state.subtitle"))}</p><img class="survey-submitted-state__image"${ssrRenderAttr("src", "/images/edit_answer.jpg")}${ssrRenderAttr("alt", unref(t)("survey.submitted_state.image_alt"))} loading="lazy" data-v-8f69a8b5><p class="survey-submitted-state__email survey-page__text-wrap" data-v-8f69a8b5>${ssrInterpolate(unref(t)("survey.submitted_state.email_label"))} <strong data-v-8f69a8b5>${ssrInterpolate(__props.maskedEmail)}</strong></p>`);
      if (formattedSubmittedAt.value) {
        _push(`<p class="survey-submitted-state__meta survey-page__text-wrap" data-v-8f69a8b5>${ssrInterpolate(unref(t)("survey.submitted_state.sent_label"))} ${ssrInterpolate(formattedSubmittedAt.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<footer class="survey-page__footer" data-v-8f69a8b5><button type="button" class="survey-submitted-state__reset survey-primary-action" data-v-8f69a8b5>${ssrInterpolate(unref(t)("survey.submitted_state.reset_button"))}</button></footer></div></section>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveySubmittedState.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const SurveySubmittedState = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-8f69a8b5"]]);
const _sfc_main$9 = /* @__PURE__ */ Object.assign({ name: "SurveyLayout" }, {
  __name: "SurveyLayout",
  __ssrInlineRender: true,
  props: {
    /** Показывать верхнюю зону (назад + прогресс); на success обычно false. */
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "survey-layout" }, _attrs))} data-v-3167ecbd>`);
      if (__props.showHeader) {
        _push(`<header class="survey-layout__top" data-v-3167ecbd>`);
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(`</header>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="survey-layout__body" data-v-3167ecbd>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyLayout.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const SurveyLayout = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-3167ecbd"]]);
const _sfc_main$8 = /* @__PURE__ */ Object.assign({ name: "SurveyProgressBar" }, {
  __name: "SurveyProgressBar",
  __ssrInlineRender: true,
  props: {
    /** Текущее значение для aria (шаг). */
    numerator: {
      type: Number,
      required: true
    },
    /** Максимум для aria. */
    denominator: {
      type: Number,
      required: true
    },
    /** Ширина заполнения полосы, 0–100. */
    percent: {
      type: Number,
      required: true
    },
    /** Подпись для скринридеров. */
    ariaLabel: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "survey-progress" }, _attrs))} data-v-a0446979><div class="survey-progress__bar" role="progressbar"${ssrRenderAttr("aria-valuenow", __props.numerator)}${ssrRenderAttr("aria-valuemin", 1)}${ssrRenderAttr("aria-valuemax", __props.denominator)}${ssrRenderAttr("aria-label", __props.ariaLabel)} data-v-a0446979><div class="survey-progress__fill" style="${ssrRenderStyle({ width: __props.percent + "%" })}" data-v-a0446979></div></div><p class="survey-progress__label" aria-hidden="true" data-v-a0446979>${ssrInterpolate(Math.round(__props.percent))}% </p></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyProgressBar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const SurveyProgressBar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-a0446979"]]);
const _sfc_main$7 = /* @__PURE__ */ Object.assign({ name: "SurveyStepTransition" }, {
  __name: "SurveyStepTransition",
  __ssrInlineRender: true,
  props: {
    /** Ключ смены шага для анимации входа/выхода. */
    stepKey: {
      type: [String, Number],
      required: true
    },
    /** Без fade/slide (напр. intro ↔ первый вопрос). */
    instant: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        key: __props.stepKey,
        class: "survey-step-transition"
      }, _attrs))} data-v-446b7dde>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyStepTransition.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const SurveyStepTransition = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-446b7dde"]]);
const _sfc_main$6 = /* @__PURE__ */ Object.assign({ name: "SurveyMainFlow" }, {
  __name: "SurveyMainFlow",
  __ssrInlineRender: true,
  props: {
    /** Текущий номер шага для прогресс-бара. */
    progressNumerator: {
      type: Number,
      required: true
    },
    /** Общее количество шагов для прогресс-бара. */
    progressDenominator: {
      type: Number,
      required: true
    },
    /** Процент заполнения прогресс-бара. */
    progressPercent: {
      type: Number,
      required: true
    },
    /** Aria-label для прогресс-бара. */
    progressBarAriaLabel: {
      type: String,
      default: ""
    },
    /** Доступна ли навигация назад. */
    canGoBack: {
      type: Boolean,
      default: false
    },
    /** Готовность к рендеру содержимого (resolved submitted state или submitted). */
    renderReady: {
      type: Boolean,
      default: false
    },
    /** Ключ шага для анимации переходов SurveyStepTransition. */
    transitionStepKey: {
      type: [String, Number],
      required: true
    },
    /** Отключить анимацию перехода (intro -> первый вопрос). */
    instantTransition: {
      type: Boolean,
      default: false
    }
  },
  emits: ["go-back"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(SurveyLayout, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="survey-main-flow__header-stack" data-v-76ae5bf8${_scopeId}>`);
            _push2(ssrRenderComponent(SurveyProgressBar, {
              numerator: __props.progressNumerator,
              denominator: __props.progressDenominator,
              percent: __props.progressPercent,
              "aria-label": __props.progressBarAriaLabel
            }, null, _parent2, _scopeId));
            if (__props.canGoBack) {
              _push2(`<div class="survey-main-flow__top-nav" data-v-76ae5bf8${_scopeId}><button type="button" class="survey-main-flow__nav-back"${ssrRenderAttr("aria-label", unref(t)("survey.nav.back_aria"))} data-v-76ae5bf8${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$C, {
                class: "survey-main-flow__nav-back-icon",
                name: "left-outlined",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="survey-main-flow__nav-back-text" data-v-76ae5bf8${_scopeId}>${ssrInterpolate(unref(t)("survey.nav.back"))}</span></button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "survey-main-flow__header-stack" }, [
                createVNode(SurveyProgressBar, {
                  numerator: __props.progressNumerator,
                  denominator: __props.progressDenominator,
                  percent: __props.progressPercent,
                  "aria-label": __props.progressBarAriaLabel
                }, null, 8, ["numerator", "denominator", "percent", "aria-label"]),
                __props.canGoBack ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "survey-main-flow__top-nav"
                }, [
                  createVNode("button", {
                    type: "button",
                    class: "survey-main-flow__nav-back",
                    "aria-label": unref(t)("survey.nav.back_aria"),
                    onClick: ($event) => emit("go-back")
                  }, [
                    createVNode(_sfc_main$C, {
                      class: "survey-main-flow__nav-back-icon",
                      name: "left-outlined",
                      "aria-hidden": "true"
                    }),
                    createVNode("span", { class: "survey-main-flow__nav-back-text" }, toDisplayString(unref(t)("survey.nav.back")), 1)
                  ], 8, ["aria-label", "onClick"])
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.renderReady) {
              _push2(ssrRenderComponent(SurveyStepTransition, {
                "step-key": __props.transitionStepKey,
                instant: __props.instantTransition
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", {}, void 0, true)
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.renderReady ? (openBlock(), createBlock(SurveyStepTransition, {
                key: 0,
                "step-key": __props.transitionStepKey,
                instant: __props.instantTransition
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, void 0, true)
                ]),
                _: 3
              }, 8, ["step-key", "instant"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/screens/SurveyMainFlow.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const SurveyMainFlow = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-76ae5bf8"]]);
const _sfc_main$5 = /* @__PURE__ */ Object.assign({ name: "SurveyIntroScreen" }, {
  __name: "SurveyIntroScreen",
  __ssrInlineRender: true,
  emits: ["start"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "survey-page__block survey-page__block--intro" }, _attrs))} data-v-fab06fc9><div class="survey-page__intro-main" data-v-fab06fc9><h1 id="survey-step-heading" class="survey-page__title survey-page__title--hero survey-page__text-wrap" tabindex="-1" data-v-fab06fc9>${ssrInterpolate(unref(t)("survey.intro.title"))}</h1><p class="survey-page__subtitle survey-page__text-wrap" data-v-fab06fc9>${ssrInterpolate(unref(t)("survey.intro.subtitle"))}</p><p class="survey-page__trust survey-page__text-wrap" data-v-fab06fc9>${ssrInterpolate(unref(t)("survey.intro.trust"))}</p></div><footer class="survey-page__footer" data-v-fab06fc9><button type="button" class="survey-page__primary survey-primary-action" data-v-fab06fc9>${ssrInterpolate(unref(t)("survey.intro.start"))}</button></footer></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/screens/SurveyIntroScreen.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const SurveyIntroScreen = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-fab06fc9"]]);
const _sfc_main$4 = /* @__PURE__ */ Object.assign({ name: "SurveySuccessScreen" }, {
  __name: "SurveySuccessScreen",
  __ssrInlineRender: true,
  props: {
    /** Объект копирайта: title, bodyParagraphs, reassurance, updateViaEmailHint. */
    successCopy: {
      type: Object,
      required: true
    },
    /** URL главной страницы с учётом текущей локали — рендерится в `<a href>` без зависимости от vue-router/Inertia. */
    homeHref: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const tr = createSurveyFieldTextTranslator(t);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "survey-page__block survey-page__block--success" }, _attrs))} data-v-28045cf2><div class="survey-page__success-inner" data-v-28045cf2><div id="survey-step-heading" class="survey-page__success-heading survey-page__text-wrap survey-page__success-heading--center" tabindex="-1" role="heading" aria-level="1" data-v-28045cf2>${ssrInterpolate(unref(tr)(__props.successCopy.title))}</div>`);
      if (__props.successCopy.bodyParagraphs) {
        _push(`<p class="survey-page__success-body survey-page__text-wrap" data-v-28045cf2>${ssrInterpolate(unref(tr)(__props.successCopy.bodyParagraphs))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.successCopy.reassurance) {
        _push(`<p class="survey-page__success-reassurance survey-page__text-wrap" data-v-28045cf2>${ssrInterpolate(unref(tr)(__props.successCopy.reassurance))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.successCopy.updateViaEmailHint) {
        _push(`<p class="survey-page__success-update-hint survey-page__text-wrap" data-v-28045cf2>${ssrInterpolate(unref(tr)(__props.successCopy.updateViaEmailHint))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<a class="survey-page__success-home survey-primary-action"${ssrRenderAttr("href", __props.homeHref)} data-v-28045cf2>${ssrInterpolate(unref(t)("survey.success.home_link"))}</a></div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/screens/SurveySuccessScreen.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const SurveySuccessScreen = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-28045cf2"]]);
const _sfc_main$3 = /* @__PURE__ */ Object.assign({ name: "SurveyLeadForm" }, {
  __name: "SurveyLeadForm",
  __ssrInlineRender: true,
  props: {
    /** Объект ответов страницы (мутация полей lead + honeypot). */
    answers: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    bullets: {
      type: Array,
      default: () => []
    },
    /** П. 7.3: короткий текст ожиданий перед полями (последний шаг, зачем контакты). */
    expectation: {
      type: String,
      default: ""
    },
    emailError: {
      type: String,
      default: ""
    },
    emailInputId: {
      type: String,
      required: true
    },
    emailErrorId: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    submitLabel: {
      type: String,
      default: ""
    },
    /** Текст ошибки сети/API под полями (п. 6.5). */
    submitError: {
      type: String,
      default: ""
    },
    /** id заголовка экрана для фокуса при переходе на lead. */
    stepHeadingId: {
      type: String,
      default: "survey-step-heading"
    }
  },
  emits: {
    /** Отправка формы — родитель валидирует и вызывает API. */
    submit: () => true
  },
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "survey-lead-form",
        "aria-busy": __props.loading ? "true" : "false"
      }, _attrs))} data-v-a7756b97><h2${ssrRenderAttr("id", __props.stepHeadingId)} class="survey-lead-form__title survey-page__text-wrap" tabindex="-1" data-v-a7756b97>${ssrInterpolate(__props.title)}</h2>`);
      if ((_a2 = __props.bullets) == null ? void 0 : _a2.length) {
        _push(`<ul class="survey-lead-form__bullets" data-v-a7756b97><!--[-->`);
        ssrRenderList(__props.bullets, (line, i) => {
          _push(`<li class="survey-lead-form__bullet" data-v-a7756b97>${ssrInterpolate(line)}</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.expectation) {
        _push(`<p class="survey-lead-form__expectation survey-page__text-wrap" data-v-a7756b97>${ssrInterpolate(__props.expectation)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="survey-lead-form__fields" data-v-a7756b97><input${ssrRenderAttr("value", __props.answers.hp_company)} type="text" name="company" class="survey-lead-form__honeypot" tabindex="-1" autocomplete="new-password" aria-label="Website" data-v-a7756b97><div class="survey-lead-form__row survey-lead-form__row--two" data-v-a7756b97><label class="survey-page__field" data-v-a7756b97><span class="survey-page__field-label" data-v-a7756b97>${ssrInterpolate(unref(t)("survey.lead.field_name"))}</span><input${ssrRenderAttr("value", __props.answers.name)} type="text" class="survey-page__control" autocomplete="name" data-v-a7756b97></label><label class="survey-page__field" data-v-a7756b97><span class="survey-page__field-label" data-v-a7756b97>${ssrInterpolate(unref(t)("survey.lead.field_business_name"))}</span><input${ssrRenderAttr("value", __props.answers.business_name)} type="text" class="survey-page__control" autocomplete="organization" data-v-a7756b97></label></div><label class="survey-page__field" data-v-a7756b97><span class="survey-page__field-label" data-v-a7756b97>${ssrInterpolate(unref(t)("survey.lead.field_email"))} <span class="survey-lead-form__star" aria-hidden="true" data-v-a7756b97>*</span><span class="survey-lead-form__sr-only" data-v-a7756b97>${ssrInterpolate(unref(t)("survey.lead.field_email_required_sr"))}</span></span><input${ssrRenderAttr("id", __props.emailInputId)}${ssrRenderAttr("value", __props.answers.email)} type="email" name="email" class="${ssrRenderClass([{
        "survey-lead-form__input--invalid": !!__props.emailError
      }, "survey-page__control"])}" autocomplete="email" inputmode="email" aria-required="true"${ssrRenderAttr("aria-invalid", __props.emailError ? "true" : "false")}${ssrRenderAttr("aria-describedby", __props.emailError ? __props.emailErrorId : void 0)} data-v-a7756b97>`);
      if (__props.emailError) {
        _push(`<p${ssrRenderAttr("id", __props.emailErrorId)} class="survey-lead-form__error" role="alert" data-v-a7756b97>${ssrInterpolate(__props.emailError)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="survey-lead-form__row survey-lead-form__row--three" data-v-a7756b97><label class="survey-page__field" data-v-a7756b97><span class="survey-page__field-label" data-v-a7756b97>${ssrInterpolate(unref(t)("survey.lead.field_phone"))}</span><input${ssrRenderAttr("value", __props.answers.phone)} type="tel" class="survey-page__control" autocomplete="tel" inputmode="tel"${ssrRenderAttr("placeholder", unref(t)("survey.lead.placeholder_phone"))} data-v-a7756b97></label><label class="survey-page__field" data-v-a7756b97><span class="survey-page__field-label" data-v-a7756b97>${ssrInterpolate(unref(t)("survey.lead.field_whatsapp"))}</span><input${ssrRenderAttr("value", __props.answers.whatsapp)} type="text" class="survey-page__control" autocomplete="tel" inputmode="tel"${ssrRenderAttr("placeholder", unref(t)("survey.lead.placeholder_whatsapp"))} data-v-a7756b97></label><label class="survey-page__field" data-v-a7756b97><span class="survey-page__field-label" data-v-a7756b97>${ssrInterpolate(unref(t)("survey.lead.field_telegram"))}</span><input${ssrRenderAttr("value", __props.answers.telegram)} type="text" class="survey-page__control" autocomplete="off" spellcheck="false"${ssrRenderAttr("placeholder", unref(t)("survey.lead.placeholder_telegram"))} data-v-a7756b97></label></div></div>`);
      if (__props.submitError) {
        _push(`<p class="survey-lead-form__submit-error" role="alert" data-v-a7756b97>${ssrInterpolate(__props.submitError)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<footer class="survey-page__footer" data-v-a7756b97><button type="button" class="survey-lead-form__submit survey-primary-action"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""}${ssrRenderAttr("aria-busy", __props.loading ? "true" : "false")} data-v-a7756b97>${ssrInterpolate(__props.submitLabel)}</button></footer></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyLeadForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SurveyLeadForm = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-a7756b97"]]);
const EMAIL_INPUT_ID = "survey-lead-email";
const EMAIL_ERROR_ID = "survey-lead-email-err";
const _sfc_main$2 = /* @__PURE__ */ Object.assign({ name: "SurveyLeadScreen" }, {
  __name: "SurveyLeadScreen",
  __ssrInlineRender: true,
  props: {
    /** Reactive-объект ответов опроса (v-model полей внутри SurveyLeadForm). */
    answers: {
      type: Object,
      required: true
    },
    /** Текст ошибки валидации email. */
    emailError: {
      type: String,
      default: ""
    },
    /** Флаг отправки формы (блокировка кнопки, aria-busy). */
    loading: {
      type: Boolean,
      default: false
    },
    /** Текст кнопки отправки. */
    submitLabel: {
      type: String,
      default: ""
    },
    /** Текст ошибки отправки на сервер. */
    submitError: {
      type: String,
      default: ""
    }
  },
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const { t } = useI18n();
    const tr = createSurveyFieldTextTranslator(t);
    const translatedTitle = computed(() => tr(SURVEY_PAGE_LEAD.title));
    const translatedBullets = computed(() => SURVEY_PAGE_LEAD.bullets.map((item) => tr(item)));
    const translatedExpectation = computed(() => tr(SURVEY_PAGE_LEAD.expectation));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "survey-page__block survey-page__block--lead" }, _attrs))} data-v-ebfae527>`);
      _push(ssrRenderComponent(SurveyLeadForm, {
        answers: __props.answers,
        title: translatedTitle.value,
        bullets: translatedBullets.value,
        expectation: translatedExpectation.value,
        "email-error": __props.emailError,
        "email-input-id": EMAIL_INPUT_ID,
        "email-error-id": EMAIL_ERROR_ID,
        loading: __props.loading,
        "submit-label": __props.submitLabel,
        "submit-error": __props.submitError,
        onSubmit: ($event) => emit("submit")
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/screens/SurveyLeadScreen.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const SurveyLeadScreen = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-ebfae527"]]);
const _sfc_main$1 = {
  __name: "SurveyDigitalCodeVerification",
  __ssrInlineRender: true,
  props: {
    attemptsLeft: {
      type: Number,
      required: true
    },
    /** Максимальное число попыток ввода кода (для расчёта "X of Y remaining"). */
    totalAttempts: {
      type: Number,
      required: true
    }
  },
  emits: {
    complete: (pin) => typeof pin === "string" && /^\d{4}$/.test(pin)
  },
  setup(__props, { expose: __expose, emit: __emit }) {
    const digits = ref(["", "", "", ""]);
    const inputRefs = ref([null, null, null, null]);
    const { t } = useI18n();
    const clearDigits = () => {
      digits.value = ["", "", "", ""];
      nextTick(() => {
        focusInput(0);
      });
    };
    __expose({ clearDigits });
    onMounted(() => {
      nextTick(() => {
        focusInput(0);
      });
    });
    const focusInput = (index) => {
      const element = inputRefs.value[index];
      if (element) {
        element.focus();
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "technical-section" }, _attrs))} data-v-766728e1><div class="message-pin-code" data-v-766728e1>${ssrInterpolate(unref(t)("survey.ui.pin_instruction"))}</div>`);
      if (__props.attemptsLeft > 0 && __props.attemptsLeft < __props.totalAttempts) {
        _push(`<div class="pin-header warning" data-v-766728e1>${ssrInterpolate(unref(t)("survey.ui.pin_attempts_left", { used: __props.attemptsLeft, total: __props.totalAttempts }))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="pin-box"${ssrRenderAttr("aria-label", unref(t)("survey.ui.pin_container_aria"))} data-v-766728e1><div class="pin-inputs" role="group"${ssrRenderAttr("aria-label", unref(t)("survey.ui.pin_group_aria"))} data-v-766728e1><!--[-->`);
      ssrRenderList(digits.value, (_, index) => {
        _push(`<input${ssrRenderAttr("value", digits.value[index])} class="digit" type="text" inputmode="numeric" maxlength="1" autocomplete="one-time-code"${ssrRenderAttr("aria-label", `Digit ${index + 1}`)} data-v-766728e1>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/client/survey/SurveyDigitalCodeVerification.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SurveyDigitalCodeVerification = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-766728e1"]]);
const SURVEY_LEAD_EMAIL_INPUT_ID = "survey-lead-email";
const SURVEY_MOBILE_SCROLL_PADDING_BOTTOM = "calc(env(safe-area-inset-bottom, 0px) + 96px)";
const _sfc_main = /* @__PURE__ */ Object.assign({
  name: "Survey",
  layout: _sfc_main$t
}, {
  __name: "Survey",
  __ssrInlineRender: true,
  props: {
    seo: {
      type: Object,
      required: true
    },
    questions: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const surveyHomeHref = computed(() => `/${useCurrentLocale()}`);
    const SURVEY_SUBMISSION_STATE_KEY = LS_SURVEY_SUBMISSION_STATE;
    const successCopy = SURVEY_PAGE_SUCCESS;
    const answers = reactive({
      name: "",
      email: "",
      business_name: "",
      phone: "",
      whatsapp: "",
      telegram: "",
      hp_company: ""
    });
    const currentIndex = ref(0);
    const skipIntroQuestionTransitionOnce = ref(false);
    const surveySubmitted = ref(false);
    const leadSubmitting = ref(false);
    const honeypotStartedAt = ref(null);
    const validation = reactive({
      leadFormAttempted: false,
      leadEmailError: "",
      leadSubmitError: ""
    });
    const questionsLoadError = ref("");
    const questionsLoadFailed = ref(false);
    const questionsVersion = ref(0);
    const submittedStateActive = ref(false);
    const submittedState = reactive({
      maskedEmail: "",
      submittedAt: null
    });
    const submittedStateResolved = ref(false);
    const pinAttemptsTotal = ref(0);
    const pinAttemptsLeft = ref(0);
    const pinVerificationRef = ref(null);
    let autoNextTimer = null;
    function applyServerProvidedQuestions() {
      try {
        const questions = props.questions;
        if (!questions || typeof questions !== "object" || Array.isArray(questions)) {
          throw new Error("bad_questions_shape");
        }
        const entries = Object.entries(questions);
        if (entries.length === 0) {
          throw new Error("empty_questions");
        }
        const normalized = {};
        for (const [stableId, question] of entries) {
          if (!question || typeof question !== "object") {
            throw new Error("bad_question_item");
          }
          if (typeof question.id !== "string" || question.id !== stableId) {
            throw new Error("bad_question_id");
          }
          normalized[stableId] = question;
        }
        replaceSurveyQuestionsById(normalized);
        questionsVersion.value++;
      } catch {
        questionsLoadError.value = t("survey.ui.questions_load_error");
        questionsLoadFailed.value = true;
      }
    }
    async function submitSurveyResponse(data = null) {
      const request = data !== null ? data : buildSurveySubmitPayload();
      const response = await defaultApiAxios.post("/survey/submit", request, true);
      if ((response == null ? void 0 : response.status) === "success") {
        const { status } = response.data;
        if (status === "success") {
          const { update_record, attempt_counter, total_attempts, verification_token } = response.data;
          if (!update_record) {
            toast.info(t("survey.ui.response_saved"), { autoClose: 5e3 });
            await persistSurveySubmissionState(request.contacts.email);
            finalizeSurveyLocally();
          } else {
            toast.info(t("survey.ui.verification_sent"), { autoClose: 5e3 });
            sessionStorage.setItem(SS_VERIFICATION_TOKEN, verification_token);
            pinAttemptsLeft.value = attempt_counter;
            pinAttemptsTotal.value = Number(total_attempts) || attempt_counter;
            if (attempt_counter > 0) {
              const ids = visibleStepIds.value;
              const idx = ids.indexOf(SURVEY_DIGITAL_CODE_VERIFICATION);
              if (idx !== -1) {
                currentIndex.value = idx;
              }
            }
          }
        } else if (status === "warning") {
          const { update_record, alert } = response.data;
          if (!update_record && alert === "cooldown") {
            toast.info(t("survey.ui.cooldown_wait"), { autoClose: 5e3 });
            resetSurveyStateToIntro();
          }
        }
      }
    }
    async function handlePinComplete(pin) {
      var _a2;
      const token = sessionStorage.getItem(SS_VERIFICATION_TOKEN);
      if (!token) {
        toast.error(t("survey.ui.token_not_found"), { autoClose: 5e3 });
        return;
      }
      try {
        const params = { token, code: pin };
        const response = await defaultApiAxios.post("/survey/verify", params, true);
        if ((response == null ? void 0 : response.status) === "success") {
          const { status, code, message } = response.data;
          if (status === "success") {
            toast.info(message, { autoClose: 5e3 });
            finalizeSurveyLocally();
          } else if (status === "warning") {
            if (code === 3) {
              pinAttemptsLeft.value--;
              (_a2 = pinVerificationRef.value) == null ? void 0 : _a2.clearDigits();
              toast.info(message, { autoClose: 5e3 });
            } else if (code === 1 || code === 2) {
              sessionStorage.removeItem(SS_VERIFICATION_TOKEN);
              toast.info(message, { autoClose: 5e3 });
              resetSurveyStateToIntro();
            }
          }
        }
      } catch {
        toast.error(t("survey.ui.network_error"), { autoClose: 5e3 });
      }
    }
    async function markSurveySubmitted() {
      if (isSurveyFlowBlocked()) {
        return;
      }
      if (surveySubmitted.value || leadSubmitting.value) {
        return;
      }
      clearAutoNextTimer();
      validation.leadFormAttempted = true;
      if (String(answers.hp_company ?? "").trim() !== "") {
        finalizeSurveyLocally();
        return;
      }
      const emailErr = surveyLeadEmailErrorMessage(answers.email);
      if (emailErr) {
        validation.leadEmailError = t(emailErr);
        return;
      }
      validation.leadEmailError = "";
      validation.leadSubmitError = "";
      leadSubmitting.value = true;
      try {
        await submitSurveyResponse();
      } catch {
        validation.leadSubmitError = t("survey.ui.submit_failed");
      } finally {
        leadSubmitting.value = false;
      }
    }
    function nowUnixSeconds() {
      return Math.floor(Date.now() / 1e3);
    }
    function buildSurveySubmitPayload() {
      const contacts = collectSurveyLeadContacts();
      const questionAnswers = collectSurveyQuestionAnswers();
      const answersMap = {};
      for (const row of questionAnswers) {
        if (row.value !== null) {
          answersMap[row.id] = row.value;
        }
        if (row.other !== null && row.other.trim() !== "") {
          answersMap[`${row.id}__other`] = row.other;
        }
      }
      return {
        company: String(answers.hp_company ?? ""),
        hp_started_at: honeypotStartedAt.value,
        contacts,
        answers: answersMap,
        question_answers: questionAnswers
      };
    }
    const visibleStepIds = computed(() => {
      void questionsVersion.value;
      const branchParentId = getSurveyBranchParentId();
      const branchAnswers = branchParentId ? { [branchParentId]: answers[branchParentId] } : {};
      return buildVisibleSurveyStepIds(surveySubmitted.value, branchAnswers);
    });
    const currentStepId = computed(
      () => visibleStepIds.value[currentIndex.value] ?? null
    );
    const transitionStepKey = computed(
      () => currentStepId.value ?? `idx-${currentIndex.value}`
    );
    const currentQuestion = computed(() => {
      const id = currentStepId.value;
      if (!id || id === SURVEY_FLOW_STEP_INTRO || id === SURVEY_FLOW_STEP_LEAD || id === SURVEY_FLOW_STEP_SUCCESS) {
        return null;
      }
      return getSurveyQuestionByStepId(id);
    });
    const otherDetailAnswerKey = computed(
      () => currentQuestion.value ? surveyOtherDetailKey(currentQuestion.value.id) : ""
    );
    const currentQuestionOptionsMap = computed(() => {
      const q = currentQuestion.value;
      const map = /* @__PURE__ */ new Map();
      for (const opt of surveyQuestionAllOptions(q)) {
        map.set(opt.value, opt);
      }
      return map;
    });
    const showOtherDetailField = computed(() => {
      const q = currentQuestion.value;
      const optionsMap = currentQuestionOptionsMap.value;
      if (optionsMap.size === 0) {
        return false;
      }
      if (q.type === "radio" || q.type === "select") {
        const value = answers[q.id];
        const opt = optionsMap.get(value);
        return (opt == null ? void 0 : opt.is_other) === true;
      }
      if (q.type === "checkbox") {
        const arr = answers[q.id];
        if (!Array.isArray(arr)) {
          return false;
        }
        return arr.some((v) => {
          var _a2;
          return ((_a2 = optionsMap.get(v)) == null ? void 0 : _a2.is_other) === true;
        });
      }
      return false;
    });
    const showQuestionNextButton = computed(() => {
      const q = currentQuestion.value;
      if (!q) {
        return false;
      }
      if (surveyQuestionUsesNextButton(q)) {
        return true;
      }
      return showOtherDetailField.value;
    });
    const questionStepNextDisabled = computed(() => {
      const q = currentQuestion.value;
      if (!q || !showQuestionNextButton.value) {
        return false;
      }
      return !isSurveyQuestionAnswerValid(q, answers);
    });
    const leadSubmitButtonLabel = computed(
      () => leadSubmitting.value ? t("survey.ui.submit_sending") : t("survey.ui.submit")
    );
    const isSubmittedStateStep = computed(
      () => submittedStateActive.value && !surveySubmitted.value
    );
    const isSurveyRenderReady = computed(
      () => submittedStateResolved.value || surveySubmitted.value
    );
    const activeScreen = computed(() => {
      if (questionsLoadFailed.value) return null;
      if (currentStepId.value === SURVEY_DIGITAL_CODE_VERIFICATION) return "verification";
      if (!isSurveyRenderReady.value) return null;
      if (isSubmittedStateStep.value) return "submitted";
      if (currentStepId.value === SURVEY_FLOW_STEP_INTRO) return "intro";
      if (currentStepId.value === SURVEY_FLOW_STEP_SUCCESS) return "success";
      return "survey";
    });
    const progressDenominator = computed(
      () => surveySubmitted.value ? 1 : getSurveyProgressTotal()
    );
    const progressNumerator = computed(
      () => surveySubmitted.value ? 1 : currentIndex.value + 1
    );
    const progressBarAriaLabel = computed(
      () => t("survey.progress.aria", {
        current: progressNumerator.value,
        total: progressDenominator.value
      })
    );
    const progressRealRatio = computed(() => {
      if (currentStepId.value === SURVEY_FLOW_STEP_INTRO) {
        return 0;
      }
      const d = progressDenominator.value;
      if (d <= 1) {
        return 1;
      }
      const completedAfterIntro = Math.max(0, progressNumerator.value - 2);
      const totalAfterIntro = d - 1;
      return Math.min(1, completedAfterIntro / totalAfterIntro);
    });
    const progressPercent = computed(() => {
      return progressRealRatio.value * 100;
    });
    const canGoBack = computed(
      () => currentIndex.value > 0 && currentStepId.value !== SURVEY_FLOW_STEP_SUCCESS
    );
    function clampCurrentIndexToVisibleSteps() {
      const ids = visibleStepIds.value;
      const max = ids.length - 1;
      if (max < 0) {
        return;
      }
      if (currentIndex.value > max) {
        currentIndex.value = max;
      }
    }
    watch(visibleStepIds, clampCurrentIndexToVisibleSteps, { flush: "sync" });
    watch(
      () => {
        var _a2;
        return [currentStepId.value, (_a2 = currentQuestion.value) == null ? void 0 : _a2.type];
      },
      ([stepId, qType]) => {
        const needsEmptyStringInit = qType === "select" || qType === "text";
        if (needsEmptyStringInit && stepId && (answers[stepId] === void 0 || answers[stepId] === null)) {
          answers[stepId] = "";
        }
      },
      { flush: "post" }
    );
    let previousBranchParentAnswer = void 0;
    watch(
      () => {
        const id = getSurveyBranchParentId();
        return id ? answers[id] : void 0;
      },
      (next) => {
        if (previousBranchParentAnswer !== void 0 && next !== previousBranchParentAnswer) {
          clearBranchDerivedAnswers(answers);
        }
        previousBranchParentAnswer = next;
      }
    );
    watch(
      () => answers.email,
      () => {
        validation.leadEmailError = "";
      }
    );
    watch(
      () => validation.leadEmailError,
      (msg) => {
        if (!msg) {
          return;
        }
        nextTick(() => {
          var _a2, _b2;
          (_b2 = (_a2 = document.getElementById(SURVEY_LEAD_EMAIL_INPUT_ID)) == null ? void 0 : _a2.scrollIntoView) == null ? void 0 : _b2.call(_a2, {
            block: "center",
            behavior: "smooth"
          });
        });
      }
    );
    function focusSurveyStepHeading() {
      requestAnimationFrame(() => {
        var _a2, _b2;
        (_b2 = (_a2 = document.getElementById("survey-step-heading")) == null ? void 0 : _a2.focus) == null ? void 0 : _b2.call(_a2, {
          preventScroll: true
        });
      });
    }
    watch(transitionStepKey, async () => {
      await nextTick();
      const el = document.querySelector(".app-wrapper .main-content");
      if (!el) return;
      const observer = new ResizeObserver(() => {
        el.scrollTo({ top: 0, behavior: "smooth" });
        observer.disconnect();
        setTimeout(() => {
          if (el.scrollTop > 0) {
            el.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 500);
      });
      observer.observe(el);
      focusSurveyStepHeading();
    });
    watch(
      () => currentStepId.value,
      (stepId) => {
        if (!stepId) {
          return;
        }
        if (stepId === "1" && honeypotStartedAt.value === null) {
          honeypotStartedAt.value = nowUnixSeconds();
        }
        const startedAt = honeypotStartedAt.value;
        if (startedAt === null) {
          return;
        }
      },
      { flush: "post" }
    );
    applyServerProvidedQuestions();
    onMounted(() => {
      var _a2;
      hydrateSubmittedStateFromStorage();
      submittedStateResolved.value = true;
      if (questionsLoadFailed.value) {
        return;
      }
      const branchId = getSurveyBranchParentId();
      previousBranchParentAnswer = branchId ? answers[branchId] : void 0;
      clampCurrentIndexToVisibleSteps();
      if (typeof document !== "undefined") {
        (_a2 = document.querySelector(".app-wrapper .main-content")) == null ? void 0 : _a2.style.setProperty(
          "scroll-padding-bottom",
          SURVEY_MOBILE_SCROLL_PADDING_BOTTOM
        );
      }
      nextTick(() => {
        focusSurveyStepHeading();
      });
    });
    function clearAutoNextTimer() {
      if (autoNextTimer != null) {
        clearTimeout(autoNextTimer);
        autoNextTimer = null;
      }
    }
    function isSurveyFlowBlocked() {
      return questionsLoadFailed.value;
    }
    onUnmounted(() => {
      var _a2;
      clearAutoNextTimer();
      if (typeof document !== "undefined") {
        (_a2 = document.querySelector(".app-wrapper .main-content")) == null ? void 0 : _a2.style.removeProperty("scroll-padding-bottom");
      }
    });
    function scheduleAutoNext(stepIdWhenScheduled) {
      clearAutoNextTimer();
      autoNextTimer = setTimeout(() => {
        autoNextTimer = null;
        if (!surveySubmitted.value && currentStepId.value === stepIdWhenScheduled) {
          goNextSurveyStep();
        }
      }, SURVEY_RADIO_AUTO_ADVANCE_MS);
    }
    function goPreviousSurveyStep() {
      if (isSurveyFlowBlocked()) {
        return;
      }
      clearAutoNextTimer();
      if (currentIndex.value <= 0) {
        return;
      }
      const prevId = visibleStepIds.value[currentIndex.value - 1];
      const toIntro = prevId === SURVEY_FLOW_STEP_INTRO;
      if (toIntro) {
        skipIntroQuestionTransitionOnce.value = true;
      }
      currentIndex.value -= 1;
      if (toIntro) {
        nextTick(() => {
          skipIntroQuestionTransitionOnce.value = false;
        });
      }
    }
    function goNextSurveyStep() {
      if (isSurveyFlowBlocked()) {
        return;
      }
      clearAutoNextTimer();
      if (surveySubmitted.value) {
        return;
      }
      const id = currentStepId.value;
      if (id === SURVEY_FLOW_STEP_LEAD) {
        return;
      }
      const q = getSurveyQuestionByStepId(id);
      if (q && !isSurveyQuestionAnswerValid(q, answers)) {
        return;
      }
      if (id === getSurveyBranchParentId() && !resolveBranchStepId(answers)) {
        return;
      }
      const last = visibleStepIds.value.length - 1;
      if (currentIndex.value >= last) {
        return;
      }
      const leaveIntro = id === SURVEY_FLOW_STEP_INTRO;
      if (leaveIntro) {
        skipIntroQuestionTransitionOnce.value = true;
      }
      currentIndex.value += 1;
      if (leaveIntro) {
        nextTick(() => {
          skipIntroQuestionTransitionOnce.value = false;
        });
      }
    }
    function onPickRadio(value) {
      if (isSurveyFlowBlocked()) {
        return;
      }
      const q = currentQuestion.value;
      if (!q) {
        return;
      }
      applyRadioAnswer(q.id, value);
    }
    function onToggleCheckbox(value) {
      if (isSurveyFlowBlocked()) {
        return;
      }
      const q = currentQuestion.value;
      if (!q) {
        return;
      }
      toggleCheckboxOption(q.id, value);
    }
    function getQuestionAndOptions(questionId) {
      const question = getSurveyQuestionsById()[questionId] ?? null;
      return {
        question,
        options: surveyQuestionAllOptions(question)
      };
    }
    function applyRadioAnswer(questionId, value) {
      if (isSurveyFlowBlocked()) {
        return;
      }
      if (surveySubmitted.value) {
        return;
      }
      const { question, options } = getQuestionAndOptions(questionId);
      if (!question) {
        return;
      }
      answers[questionId] = value;
      const opt = options.find((o) => o.value === value);
      if (!(opt == null ? void 0 : opt.is_other)) {
        delete answers[surveyOtherDetailKey(questionId)];
      }
      const stepId = currentStepId.value;
      if (questionId === getSurveyBranchParentId() && stepId === questionId) {
        const last = visibleStepIds.value.length - 1;
        if (currentIndex.value < last) {
          currentIndex.value += 1;
        }
        return;
      }
      if (surveyRadioAllowsAutoAdvance(question, value)) {
        scheduleAutoNext(stepId);
      }
    }
    function toggleCheckboxOption(questionId, value) {
      if (isSurveyFlowBlocked()) {
        return;
      }
      const { options } = getQuestionAndOptions(questionId);
      const opts = options;
      if (!opts.length) {
        return;
      }
      if (!Array.isArray(answers[questionId])) {
        answers[questionId] = [];
      }
      const arr = answers[questionId];
      const idx = arr.indexOf(value);
      if (idx === -1) {
        arr.push(value);
      } else {
        arr.splice(idx, 1);
        const removedOpt = opts.find((o) => o.value === value);
        if (removedOpt == null ? void 0 : removedOpt.is_other) {
          delete answers[surveyOtherDetailKey(questionId)];
        }
      }
    }
    function collectSurveyQuestionAnswers() {
      const questions = getSurveyQuestionsById();
      return Object.keys(questions).map((id) => {
        const rawValue = answers[id];
        const otherKey = surveyOtherDetailKey(id);
        return {
          id,
          value: rawValue === void 0 ? null : Array.isArray(rawValue) ? [...rawValue] : rawValue,
          other: typeof answers[otherKey] === "string" ? answers[otherKey] : null
        };
      });
    }
    function collectSurveyLeadContacts() {
      return {
        name: String(answers.name ?? ""),
        email: String(answers.email ?? ""),
        business_name: String(answers.business_name ?? ""),
        phone: String(answers.phone ?? ""),
        whatsapp: String(answers.whatsapp ?? ""),
        telegram: String(answers.telegram ?? "")
      };
    }
    function finalizeSurveyLocally() {
      nextTick(() => {
        surveySubmitted.value = true;
        currentIndex.value = 0;
      });
    }
    async function buildSubmissionEmailHash(email) {
      const normalizedEmail = String(email ?? "").trim().toLowerCase();
      if (typeof crypto === "undefined" || !(crypto == null ? void 0 : crypto.subtle)) {
        return "";
      }
      const bytes = new TextEncoder().encode(normalizedEmail);
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    async function persistSurveySubmissionState(email) {
      if (typeof window === "undefined" || !(window == null ? void 0 : window.localStorage)) {
        return;
      }
      const statePayload = {
        submitted: true,
        submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
        email_masked: maskSurveyEmail(email),
        email_raw_hash: await buildSubmissionEmailHash(email)
      };
      try {
        window.localStorage.setItem(
          SURVEY_SUBMISSION_STATE_KEY,
          JSON.stringify(statePayload)
        );
      } catch {
      }
    }
    function hydrateSubmittedStateFromStorage() {
      if (typeof window === "undefined" || !(window == null ? void 0 : window.localStorage)) {
        return;
      }
      let parsedState = null;
      try {
        const raw = window.localStorage.getItem(SURVEY_SUBMISSION_STATE_KEY);
        if (!raw) {
          return;
        }
        parsedState = JSON.parse(raw);
      } catch {
        return;
      }
      if (!parsedState || parsedState.submitted !== true) {
        return;
      }
      const maskedEmailRaw = typeof parsedState.email_masked === "string" ? parsedState.email_masked.trim() : "";
      submittedState.maskedEmail = normalizeMaskedEmailForUi(maskedEmailRaw);
      submittedState.submittedAt = typeof parsedState.submitted_at === "string" ? parsedState.submitted_at : null;
      submittedStateActive.value = true;
    }
    function normalizeMaskedEmailForUi(maskedEmail) {
      const source = String(maskedEmail ?? "").trim().toLowerCase();
      const atIndex = source.indexOf("@");
      if (atIndex > 0 && atIndex < source.length - 1) {
        const localPart = source.slice(0, atIndex).replace(/\*/g, "");
        const domainPart = source.slice(atIndex + 1);
        const dotIndex = domainPart.lastIndexOf(".");
        if (dotIndex <= 0 || dotIndex === domainPart.length - 1) {
          return "***";
        }
        const domainName = domainPart.slice(0, dotIndex).replace(/\*/g, "");
        const domainZone = domainPart.slice(dotIndex + 1).replace(/\*/g, "");
        const localPrefix = localPart.slice(0, Math.min(3, localPart.length));
        const domainTail = domainName.slice(Math.max(0, domainName.length - 3));
        const zoneHead = domainZone.slice(0, Math.min(3, domainZone.length));
        if (!localPrefix || !domainTail || !zoneHead) {
          return "***";
        }
        return `${localPrefix}*******${domainTail}.${zoneHead}`;
      }
      return source || "***";
    }
    function resetSurveyStateToIntro() {
      const staticLeadFields = [
        "name",
        "email",
        "business_name",
        "phone",
        "whatsapp",
        "telegram",
        "hp_company"
      ];
      for (const field of staticLeadFields) {
        answers[field] = "";
      }
      honeypotStartedAt.value = Math.floor(Date.now() / 1e3);
      const questionIds = Object.keys(getSurveyQuestionsById());
      for (const questionId of questionIds) {
        delete answers[questionId];
        delete answers[surveyOtherDetailKey(questionId)];
      }
      currentIndex.value = 0;
      surveySubmitted.value = false;
      skipIntroQuestionTransitionOnce.value = false;
      validation.leadFormAttempted = false;
      validation.leadEmailError = "";
      validation.leadSubmitError = "";
      honeypotStartedAt.value = null;
    }
    function resetSurveyFromSubmittedState() {
      submittedStateActive.value = false;
      resetSurveyStateToIntro();
      currentIndex.value = 1;
      nextTick(() => {
        focusSurveyStepHeading();
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$A, { seo: __props.seo }, null, _parent));
      _push(`<div class="survey-page container" data-v-82910d20>`);
      if (questionsLoadError.value) {
        _push(`<div class="survey-page__api-error" role="alert" data-v-82910d20>${ssrInterpolate(questionsLoadError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeScreen.value === "verification") {
        _push(ssrRenderComponent(SurveyDigitalCodeVerification, {
          ref_key: "pinVerificationRef",
          ref: pinVerificationRef,
          "attempts-left": pinAttemptsLeft.value,
          "total-attempts": pinAttemptsTotal.value,
          onComplete: handlePinComplete
        }, null, _parent));
      } else if (activeScreen.value === "submitted") {
        _push(ssrRenderComponent(SurveySubmittedState, {
          "masked-email": submittedState.maskedEmail,
          "submitted-at": submittedState.submittedAt,
          onResetSurvey: resetSurveyFromSubmittedState
        }, null, _parent));
      } else if (activeScreen.value === "intro") {
        _push(ssrRenderComponent(SurveyIntroScreen, { onStart: goNextSurveyStep }, null, _parent));
      } else if (activeScreen.value === "success") {
        _push(ssrRenderComponent(SurveySuccessScreen, {
          "success-copy": unref(successCopy),
          "home-href": surveyHomeHref.value
        }, null, _parent));
      } else if (activeScreen.value === "survey") {
        _push(ssrRenderComponent(SurveyMainFlow, {
          "progress-numerator": progressNumerator.value,
          "progress-denominator": progressDenominator.value,
          "progress-percent": progressPercent.value,
          "progress-bar-aria-label": progressBarAriaLabel.value,
          "can-go-back": canGoBack.value,
          "render-ready": isSurveyRenderReady.value,
          "transition-step-key": transitionStepKey.value,
          "instant-transition": skipIntroQuestionTransitionOnce.value,
          onGoBack: goPreviousSurveyStep
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (currentStepId.value === unref(SURVEY_FLOW_STEP_LEAD)) {
                _push2(ssrRenderComponent(SurveyLeadScreen, {
                  answers,
                  "email-error": validation.leadEmailError,
                  loading: leadSubmitting.value,
                  "submit-label": leadSubmitButtonLabel.value,
                  "submit-error": validation.leadSubmitError,
                  onSubmit: markSurveySubmitted
                }, null, _parent2, _scopeId));
              } else if (currentQuestion.value) {
                _push2(ssrRenderComponent(SurveyQuestionStep, {
                  question: currentQuestion.value,
                  "step-id": currentStepId.value,
                  answers,
                  "other-detail-key": otherDetailAnswerKey.value,
                  "show-other-field": showOtherDetailField.value,
                  "show-next-button": showQuestionNextButton.value,
                  "next-disabled": questionStepNextDisabled.value,
                  onPickRadio,
                  onToggleCheckbox,
                  onNext: goNextSurveyStep
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                currentStepId.value === unref(SURVEY_FLOW_STEP_LEAD) ? (openBlock(), createBlock(SurveyLeadScreen, {
                  key: 0,
                  answers,
                  "email-error": validation.leadEmailError,
                  loading: leadSubmitting.value,
                  "submit-label": leadSubmitButtonLabel.value,
                  "submit-error": validation.leadSubmitError,
                  onSubmit: markSurveySubmitted
                }, null, 8, ["answers", "email-error", "loading", "submit-label", "submit-error"])) : currentQuestion.value ? (openBlock(), createBlock(SurveyQuestionStep, {
                  key: 1,
                  question: currentQuestion.value,
                  "step-id": currentStepId.value,
                  answers,
                  "other-detail-key": otherDetailAnswerKey.value,
                  "show-other-field": showOtherDetailField.value,
                  "show-next-button": showQuestionNextButton.value,
                  "next-disabled": questionStepNextDisabled.value,
                  onPickRadio,
                  onToggleCheckbox,
                  onNext: goNextSurveyStep
                }, null, 8, ["question", "step-id", "answers", "other-detail-key", "show-other-field", "show-next-button", "next-disabled"])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Survey.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Survey = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-82910d20"]]);
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Survey
}, Symbol.toStringTag, { value: "Module" }));
const pages = /* @__PURE__ */ Object.assign({ "./Pages/About.vue": __vite_glob_0_0, "./Pages/BatchPublic.vue": __vite_glob_0_1, "./Pages/Contact.vue": __vite_glob_0_2, "./Pages/DailyReportPublic.vue": __vite_glob_0_3, "./Pages/Demo.vue": __vite_glob_0_4, "./Pages/Home.vue": __vite_glob_0_5, "./Pages/HowWorks.vue": __vite_glob_0_6, "./Pages/PrivacyPolicy.vue": __vite_glob_0_7, "./Pages/Survey.vue": __vite_glob_0_8 });
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const path = `./Pages/${name}.vue`;
      if (!pages[path]) {
        throw new Error(
          `Inertia page not found: "${name}" (expected at ${path})`
        );
      }
      return pages[path];
    },
    setup({ App, props, plugin }) {
      var _a2;
      const initial = props.initialPage.props;
      i18n.global.locale.value = initial.locale;
      i18n.global.setLocaleMessage(
        initial.locale,
        ((_a2 = initial.translations) == null ? void 0 : _a2[initial.locale]) || {}
      );
      const app = createSSRApp({ render: () => h(App, props) });
      app.use(plugin);
      app.use(createPinia());
      app.use(i18n);
      return app;
    }
  })
);
export {
  roomTargetsSummary as A,
  firstPendingMeasurementTime as B,
  useCurrentLocale as C,
  defaultConfigForFieldType as D,
  EQUIPMENT_GROUPS as E,
  createEmptyTaskFieldRow as F,
  createModalDraft as G,
  equipmentGroupsForChecklistNiche as H,
  FREQUENCY_CODE as I,
  taskFieldTypeOptionsByScopeType as J,
  DEFAULT_TASK_ACTIVE_WEEKDAYS as K,
  resolveAssigneeIdForNiche as L,
  buildTaskPayloadFromDraft as M,
  NICHE_TO_SITE_ID as N,
  registerGrainCoolingChecklistsDeepLinkWatcher as O,
  siteEmojiForDemo as P,
  buildBatchPublicUrl as Q,
  ROOM_GROUPS as R,
  buildDailyReportPublicUrl as S,
  TASK_FIELD_TYPE_OPTIONS as T,
  taskDisplayStatusKey as U,
  LS_CONSENT_VERSION as V,
  _export_sfc as _,
  _sfc_main$C as a,
  normalizeRoomTargetIds as b,
  resolveTaskNicheForTemperatureAi as c,
  resolveTemperatureAiMode as d,
  resolveBreadRowForTaskMeasurement as e,
  resolveMeatRowForTaskMeasurement as f,
  resolveCoffeeRowForTaskMeasurement as g,
  createTemperatureAiAnalyzer as h,
  mapTaskNicheToAnalyzerNiche as i,
  i18n as j,
  resolveStaffFullName as k,
  getGrainCoolingTaskFromDemoState as l,
  markGrainCoolingScenarioStoredCompleted as m,
  normalizeEquipmentTargetIds as n,
  useDemoState as o,
  parseTemperatureFromMeasurementValue as p,
  resolveGrainCoolingTaskFromDemoState as q,
  readTaskTemperatureMinMaxC as r,
  equipmentTargetsSummary as s,
  task_grain_cooling as t,
  useGrainCoolingStore as u,
  normalizeTaskFieldDefinitions as v,
  TASK_FIELD_TYPE as w,
  formatTaskFieldSummaryLine as x,
  normalizeTaskScopeType as y,
  TASK_SCOPE_TYPE as z
};
