import { ref, onMounted, onUnmounted, computed, mergeProps, useSSRContext, unref, withCtx, createTextVNode, toDisplayString, createVNode, onBeforeUnmount, isRef, createBlock, createCommentVNode, openBlock, watch, nextTick, shallowRef, mergeModels, useModel, reactive, Fragment, renderList, onActivated, resolveDynamicComponent } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
import { Link, router } from "@inertiajs/vue3";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc, a as _sfc_main$o, E as EQUIPMENT_GROUPS, R as ROOM_GROUPS, n as normalizeEquipmentTargetIds, b as normalizeRoomTargetIds, t as task_grain_cooling, m as markGrainCoolingScenarioStoredCompleted, r as readTaskTemperatureMinMaxC, c as resolveTaskNicheForTemperatureAi, p as parseTemperatureFromMeasurementValue, d as resolveTemperatureAiMode, e as resolveBreadRowForTaskMeasurement, f as resolveMeatRowForTaskMeasurement, g as resolveCoffeeRowForTaskMeasurement, h as createTemperatureAiAnalyzer, i as mapTaskNicheToAnalyzerNiche, j as i18n, T as TASK_FIELD_TYPE_OPTIONS, N as NICHE_TO_SITE_ID, k as resolveStaffFullName, u as useGrainCoolingStore, l as getGrainCoolingTaskFromDemoState, o as useDemoState, q as resolveGrainCoolingTaskFromDemoState, s as equipmentTargetsSummary, v as normalizeTaskFieldDefinitions, w as TASK_FIELD_TYPE, x as formatTaskFieldSummaryLine, y as normalizeTaskScopeType, z as TASK_SCOPE_TYPE, A as roomTargetsSummary, B as firstPendingMeasurementTime, C as useCurrentLocale, D as defaultConfigForFieldType, F as createEmptyTaskFieldRow, G as createModalDraft, H as equipmentGroupsForChecklistNiche, I as FREQUENCY_CODE, J as taskFieldTypeOptionsByScopeType, K as DEFAULT_TASK_ACTIVE_WEEKDAYS, L as resolveAssigneeIdForNiche, M as buildTaskPayloadFromDraft, O as registerGrainCoolingChecklistsDeepLinkWatcher, P as siteEmojiForDemo, Q as buildBatchPublicUrl, S as buildDailyReportPublicUrl, U as taskDisplayStatusKey } from "../ssr.js";
import { e as NAlert, G as NIcon, J as NInput, u as NDrawer, w as NDrawerContent, _ as NSelect, P as NModal, Q as NPopconfirm, D as NFormItem, L as NInputNumber, M as useMessage, B as NForm, Y as NRadioGroup, V as NRadio, n as NDatePicker, a8 as NTimePicker, l as NCheckboxGroup, j as NCheckbox, a4 as NTabs, a2 as NTabPane } from "./Tabs-vrLIIUBX.js";
import { AddAPhotoTwotone } from "@vicons/material";
import { B as Button } from "./_common-Dc_o1R5u.js";
import "./GlobalTaskReminderToast-BB35q0ZE.js";
import { v4 } from "uuid";
import { N as NSwitch } from "./Switch-tnSHOxTf.js";
import QRCode from "qrcode";
import "@vicons/antd";
import "@vicons/ionicons5";
import "@heroicons/vue/24/outline";
import "@tabler/icons-vue";
import "@vicons/ionicons4";
import "@vicons/carbon";
import "@vicons/fluent";
import "pinia";
import "vue3-toastify";
import "axios";
import "i18n-iso-countries";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "./dark-IQH-hZ2R.js";
import "lodash-es";
import "@emotion/hash";
import "date-fns";
import "date-fns-tz";
import "async-validator";
import "date-fns/locale";
import "@juggle/resize-observer";
const BOTTOM_ICONS_ONLY_MQ = "(max-width: 1024px)";
const _sfc_main$n = /* @__PURE__ */ Object.assign({ name: "DemoSectionNavigation" }, {
  __name: "DemoSectionNavigation",
  __ssrInlineRender: true,
  props: {
    variant: {
      type: String,
      required: true,
      validator: (value) => value === "sidebar" || value === "bottom"
    },
    links: {
      type: Array,
      required: true
    },
    activeId: {
      type: String,
      required: true
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const isBottomIconsOnly = ref(
      typeof window !== "undefined" && window.matchMedia(BOTTOM_ICONS_ONLY_MQ).matches
    );
    let bottomNavMq = null;
    let syncBottomNavMq = null;
    onMounted(() => {
      bottomNavMq = window.matchMedia(BOTTOM_ICONS_ONLY_MQ);
      syncBottomNavMq = () => {
        isBottomIconsOnly.value = bottomNavMq.matches;
      };
      syncBottomNavMq();
      bottomNavMq.addEventListener("change", syncBottomNavMq);
    });
    onUnmounted(() => {
      if (bottomNavMq && syncBottomNavMq) {
        bottomNavMq.removeEventListener("change", syncBottomNavMq);
      }
    });
    const props = __props;
    const showNavTextLabel = (item) => {
      if (props.variant === "sidebar") return true;
      if (props.variant !== "bottom") return false;
      if (!isBottomIconsOnly.value) return true;
      return !item.svg;
    };
    const bottomButtonAriaLabel = (item) => {
      if (props.variant === "bottom" && isBottomIconsOnly.value && item.svg) {
        return item.label;
      }
      return void 0;
    };
    const rootNavClass = computed(
      () => props.variant === "sidebar" ? "demo-sidebar__nav" : "demo-bottom-nav"
    );
    const ariaLabel = computed(
      () => props.variant === "sidebar" ? "Demo sections" : "Demo mobile navigation"
    );
    const buttonClassList = (itemId) => {
      const active = props.activeId === itemId;
      if (props.variant === "sidebar") {
        return {
          "demo-sidebar__link": true,
          "demo-sidebar__link--active": active
        };
      }
      return {
        "demo-bottom-nav__link": true,
        "demo-bottom-nav__link--active": active
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: rootNavClass.value,
        "aria-label": ariaLabel.value
      }, _attrs))} data-v-6cf63420><!--[-->`);
      ssrRenderList(__props.links, (item) => {
        _push(`<button type="button" class="${ssrRenderClass(buttonClassList(item.id))}"${ssrRenderAttr("aria-label", bottomButtonAriaLabel(item))} data-v-6cf63420>`);
        if (item.svg && props.variant === "bottom") {
          _push(ssrRenderComponent(_sfc_main$o, {
            name: item.svg,
            class: "demo-section-nav__icon",
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (showNavTextLabel(item)) {
          _push(`<span class="demo-section-nav__label" data-v-6cf63420>${ssrInterpolate(item.label)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></nav>`);
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/nav/DemoSectionNavigation.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const DemoSectionNavigation = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-6cf63420"]]);
const _sfc_main$m = {
  __name: "CompleteTaskModalHeader",
  __ssrInlineRender: true,
  props: {
    hasTask: {
      type: Boolean,
      default: false
    },
    taskTitle: {
      type: String,
      default: ""
    },
    taskTypeDisplay: {
      type: String,
      default: ""
    },
    taskTypeAria: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const props = __props;
    const headerText = computed(() => {
      const t2 = String(props.taskTitle ?? "").trim();
      if (props.hasTask && t2) {
        return t2;
      }
      return t2("demo.show_task_modal.task_details");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklist-modal__card-header" }, _attrs))} data-v-54d7f7d8><span class="checklist-modal__card-header-title" role="heading" data-v-54d7f7d8>${ssrInterpolate(headerText.value)}</span>`);
      if (__props.hasTask) {
        _push(`<span class="checklist-modal__card-header-type"${ssrRenderAttr("aria-label", __props.taskTypeAria)} role="img" data-v-54d7f7d8>${ssrInterpolate(__props.taskTypeDisplay)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/show_task/CompleteTaskModalHeader.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const CompleteTaskModalHeader = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-54d7f7d8"]]);
const _sfc_main$l = {
  __name: "TaskExecutionMetaBlock",
  __ssrInlineRender: true,
  props: {
    showAlert: {
      type: Boolean,
      default: false
    },
    targetsDisplay: {
      type: String,
      default: "—"
    }
  },
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (__props.showAlert) {
        _push(ssrRenderComponent(unref(NAlert), {
          title: "Error equipment",
          type: "error"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("demo.execution_meta.bluetooth_error"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("demo.execution_meta.bluetooth_error")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="checklist-modal__pending-meta" data-v-89e811a7><b class="checklist-modal__pending-meta-line" data-v-89e811a7>${ssrInterpolate(__props.targetsDisplay)}</b></div><!--]-->`);
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/task_execution_panel/TaskExecutionMetaBlock.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const TaskExecutionMetaBlock = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-89e811a7"]]);
const _sfc_main$k = /* @__PURE__ */ Object.assign({ name: "PendingPhotoCaptureBlock" }, {
  __name: "PendingPhotoCaptureBlock",
  __ssrInlineRender: true,
  props: {
    photoNames: {
      type: Array,
      default: () => []
    },
    reportFileName: {
      type: String,
      default: ""
    },
    showDocument: {
      type: Boolean,
      default: false
    },
    showCamera: {
      type: Boolean,
      default: true
    }
  },
  emits: ["camera", "attach-report"],
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "box-bottom-panel-content pending-photo-capture-block" }, _attrs))} data-v-fcd7dc0b><div class="pending-photo-capture-block__section checklist-modal__pending-photo-row checklist-modal__pending-photo-row--labeled" style="${ssrRenderStyle(__props.showCamera ? null : { display: "none" })}" data-v-fcd7dc0b><div class="label_for_element" data-v-fcd7dc0b>${ssrInterpolate(unref(t)("demo.photo_capture.take_photo"))}</div>`);
      _push(ssrRenderComponent(unref(Button), {
        type: "primary",
        secondary: "",
        class: "checklist-modal__pending-camera-btn",
        onClick: ($event) => _ctx.$emit("camera")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(NIcon), {
              size: "20",
              "aria-hidden": "true"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(AddAPhotoTwotone), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(AddAPhotoTwotone))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(NIcon), {
                size: "20",
                "aria-hidden": "true"
              }, {
                default: withCtx(() => [
                  createVNode(unref(AddAPhotoTwotone))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<ul class="checklist-modal__pending-photo-list" style="${ssrRenderStyle(__props.photoNames.length ? null : { display: "none" })}" data-v-fcd7dc0b><!--[-->`);
      ssrRenderList(__props.photoNames, (name, idx) => {
        _push(`<li data-v-fcd7dc0b>${ssrInterpolate(name)}</li>`);
      });
      _push(`<!--]--></ul></div><div class="pending-photo-capture-block__section checklist-modal__pending-photo-row checklist-modal__pending-photo-row--labeled checklist-modal__document" style="${ssrRenderStyle(__props.showDocument ? null : { display: "none" })}" data-v-fcd7dc0b><div class="label_for_element" data-v-fcd7dc0b>${ssrInterpolate(unref(t)("demo.photo_capture.report_document"))}</div>`);
      _push(ssrRenderComponent(unref(Button), {
        type: "primary",
        secondary: "",
        class: "checklist-modal__pending-camera-btn",
        onClick: ($event) => _ctx.$emit("attach-report")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.photo_capture.attach_file"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.photo_capture.attach_file")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="checklist-modal__pending-photo-name" data-v-fcd7dc0b>${ssrInterpolate(__props.reportFileName || "")}</p></div></div>`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/show_task/PendingPhotoCaptureBlock.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const PendingPhotoCaptureBlock = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-fcd7dc0b"]]);
const _sfc_main$j = {
  __name: "TaskExecutionSingleChoicePanel",
  __ssrInlineRender: true,
  props: {
    question: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    answer: {
      type: String,
      default: ""
    },
    comment: {
      type: String,
      default: ""
    },
    reportFileName: {
      type: String,
      default: ""
    },
    photoNames: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "update:answer",
    "update:comment",
    "submit",
    "attach-report",
    "camera"
  ],
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklist-modal__pending-input" }, _attrs))} data-v-a5f720c2><p class="checklist-modal__one-answer" data-v-a5f720c2>${ssrInterpolate(__props.question)}</p><div class="checklist-modal__single-choice-options" role="radiogroup"${ssrRenderAttr("aria-label", unref(t)("demo.single_choice_panel.options_aria"))} data-v-a5f720c2><!--[-->`);
      ssrRenderList(__props.options, (option) => {
        _push(`<button type="button" class="${ssrRenderClass([{
          "checklist-modal__single-choice-option--active": __props.answer === option
        }, "checklist-modal__single-choice-option"])}" data-v-a5f720c2><span class="checklist-modal__single-choice-radio" data-v-a5f720c2></span><span data-v-a5f720c2>${ssrInterpolate(option)}</span></button>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(unref(NInput), {
        value: __props.comment,
        type: "textarea",
        autosize: { minRows: 2, maxRows: 4 },
        placeholder: unref(t)("demo.single_choice_panel.comment_placeholder"),
        "onUpdate:value": ($event) => _ctx.$emit("update:comment", $event)
      }, null, _parent));
      _push(ssrRenderComponent(unref(Button), {
        type: "primary",
        class: "checklist-modal__single-choice-submit",
        disabled: !__props.answer,
        onClick: ($event) => _ctx.$emit("submit")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.single_choice_panel.confirm_answer"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.single_choice_panel.confirm_answer")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(PendingPhotoCaptureBlock, {
        "report-file-name": __props.reportFileName,
        "show-document": true,
        "show-camera": true,
        "photo-names": __props.photoNames,
        onAttachReport: ($event) => _ctx.$emit("attach-report"),
        onCamera: ($event) => _ctx.$emit("camera")
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/task_execution_panel/TaskExecutionSingleChoicePanel.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const TaskExecutionSingleChoicePanel = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-a5f720c2"]]);
const TEMPERATURE_DRAFT_MAX_FRACTION_DIGITS = 2;
const normalizeTemperatureDraftLeadingZeroBeforeDot = (out) => {
  if (out === "." || out === "-.") {
    return out === "-." ? "-0." : "0.";
  }
  if (out.startsWith("-.")) {
    return `-0.${out.slice(2)}`;
  }
  if (out.startsWith(".")) {
    return `0.${out.slice(1)}`;
  }
  return out;
};
const sanitizeTemperatureNumericDraft = (raw) => {
  const s = String(raw ?? "");
  let out = "";
  let i = 0;
  if (s.charAt(0) === "-") {
    out = "-";
    i = 1;
  }
  let hasSep = false;
  let fracDigits = 0;
  for (; i < s.length; i += 1) {
    const c = s.charAt(i);
    if (c >= "0" && c <= "9") {
      if (hasSep) {
        if (fracDigits >= TEMPERATURE_DRAFT_MAX_FRACTION_DIGITS) {
          continue;
        }
        fracDigits += 1;
      }
      out += c;
      continue;
    }
    if ((c === "." || c === ",") && !hasSep) {
      out += ".";
      hasSep = true;
    }
  }
  return normalizeTemperatureDraftLeadingZeroBeforeDot(out);
};
const applyKeyboardSignToTemperatureDraft = (sanitized, raw) => {
  const s = String(sanitized ?? "");
  const r = String(raw ?? "");
  if (s === "") {
    return s;
  }
  const last = r.charAt(r.length - 1);
  const first = r.charAt(0);
  const endsWithSign = last === "+" || last === "-";
  if (endsWithSign) {
    if (last === "+") {
      return s.startsWith("-") ? s.slice(1) : s;
    }
    return s.startsWith("-") ? s : `-${s}`;
  }
  if (first === "+") {
    return s.startsWith("-") ? s.slice(1) : s;
  }
  if (first === "-") {
    return s.startsWith("-") ? s : `-${s}`;
  }
  return s;
};
const _sfc_main$i = /* @__PURE__ */ Object.assign({ name: "TaskExecutionTemperatureTimerPanel" }, {
  __name: "TaskExecutionTemperatureTimerPanel",
  __ssrInlineRender: true,
  props: {
    fieldTypeDisplay: {
      type: String,
      default: "—"
    },
    temperatureDraft: {
      type: String,
      default: ""
    },
    inputPrefix: {
      type: String,
      default: ""
    },
    inputSuffix: {
      type: String,
      default: ""
    },
    photoNames: {
      type: Array,
      default: () => []
    },
    /** Из модалки / `taskFieldDefinitions[0].config.showCamera` (по умолчанию true для temp). */
    showCamera: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:temperatureDraft", "keypad-press", "camera-shot"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const onTemperatureDraftInput = (value) => {
      const sanitized = sanitizeTemperatureNumericDraft(value);
      emit(
        "update:temperatureDraft",
        applyKeyboardSignToTemperatureDraft(sanitized, value)
      );
    };
    const keypadDigitKeys = Object.freeze([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0"
    ]);
    const keypadToolKeys = Object.freeze([".", "DEL", "+/-", "✓"]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklist-modal__pending-input" }, _attrs))} data-v-7d8ee883><p class="checklist-modal__pending-input-label" data-v-7d8ee883>${ssrInterpolate(__props.fieldTypeDisplay)}</p>`);
      _push(ssrRenderComponent(unref(NInput), {
        value: __props.temperatureDraft,
        size: "large",
        inputmode: "decimal",
        placeholder: "—",
        class: "checklist-modal__pending-temp-input",
        "onUpdate:value": onTemperatureDraftInput
      }, {
        prefix: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="checklist-modal__pending-temp-prefix" aria-hidden="true" data-v-7d8ee883${_scopeId}>${ssrInterpolate(__props.inputPrefix)}</span>`);
          } else {
            return [
              createVNode("span", {
                class: "checklist-modal__pending-temp-prefix",
                "aria-hidden": "true"
              }, toDisplayString(__props.inputPrefix), 1)
            ];
          }
        }),
        suffix: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="checklist-modal__pending-temp-suffix" aria-hidden="true" data-v-7d8ee883${_scopeId}>${ssrInterpolate(__props.inputSuffix)}</span>`);
          } else {
            return [
              createVNode("span", {
                class: "checklist-modal__pending-temp-suffix",
                "aria-hidden": "true"
              }, toDisplayString(__props.inputSuffix), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="checklist-modal__keypad" role="group" data-v-7d8ee883><div class="checklist-modal__keypad-digits" data-v-7d8ee883><!--[-->`);
      ssrRenderList(unref(keypadDigitKeys), (key) => {
        _push(`<button type="button" class="checklist-modal__keypad-btn" data-v-7d8ee883>${ssrInterpolate(key)}</button>`);
      });
      _push(`<!--]--></div><div class="checklist-modal__keypad-tools" data-v-7d8ee883><!--[-->`);
      ssrRenderList(unref(keypadToolKeys), (key) => {
        _push(`<button type="button" class="${ssrRenderClass([{
          "checklist-modal__keypad-btn--danger": key === "DEL",
          "checklist-modal__keypad-btn--ok": key === "✓"
        }, "checklist-modal__keypad-btn"])}" data-v-7d8ee883>${ssrInterpolate(key)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(PendingPhotoCaptureBlock, {
        "show-document": false,
        "show-camera": __props.showCamera,
        "photo-names": __props.photoNames,
        onCamera: ($event) => _ctx.$emit("camera-shot")
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/task_execution_panel/TaskExecutionTemperatureTimerPanel.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const TaskExecutionTemperatureTimerPanel = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-7d8ee883"]]);
const _sfc_main$h = {
  __name: "TaskExecutionTicketPanel",
  __ssrInlineRender: true,
  props: {
    description: {
      type: String,
      default: "—"
    },
    ticketStatus: {
      type: String,
      default: "not_completed"
    },
    ticketComment: {
      type: String,
      default: ""
    },
    reportFileName: {
      type: String,
      default: ""
    },
    photoNames: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "update:ticketStatus",
    "update:ticketComment",
    "submit",
    "attach-report",
    "camera"
  ],
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklist-modal__pending-input" }, _attrs))} data-v-16af8ea9><div class="checklist-modal__ticket-description" data-v-16af8ea9><p class="checklist-modal__ticket-description-title" data-v-16af8ea9>${ssrInterpolate(unref(t)("demo.ticket_panel.description_label"))}</p><p class="checklist-modal__ticket-description-text" data-v-16af8ea9>${ssrInterpolate(__props.description)}</p></div><div class="checklist-modal__single-choice-options" role="radiogroup"${ssrRenderAttr("aria-label", unref(t)("demo.ticket_panel.status_aria"))} data-v-16af8ea9><button type="button" class="${ssrRenderClass([{
        "checklist-modal__single-choice-option--active": __props.ticketStatus === "not_completed",
        "checklist-modal__single-choice-option--warning": __props.ticketStatus === "not_completed"
      }, "checklist-modal__single-choice-option"])}" data-v-16af8ea9><span class="checklist-modal__single-choice-radio" data-v-16af8ea9></span><span data-v-16af8ea9>${ssrInterpolate(unref(t)("demo.ticket_panel.not_completed"))}</span></button><button type="button" class="${ssrRenderClass([{
        "checklist-modal__single-choice-option--active": __props.ticketStatus === "completed"
      }, "checklist-modal__single-choice-option"])}" data-v-16af8ea9><span class="checklist-modal__single-choice-radio" data-v-16af8ea9></span><span data-v-16af8ea9>${ssrInterpolate(unref(t)("demo.ticket_panel.completed"))}</span></button></div>`);
      _push(ssrRenderComponent(unref(NInput), {
        value: __props.ticketComment,
        type: "textarea",
        autosize: { minRows: 2, maxRows: 4 },
        placeholder: unref(t)("demo.ticket_panel.comment_placeholder"),
        "onUpdate:value": ($event) => _ctx.$emit("update:ticketComment", $event)
      }, null, _parent));
      _push(ssrRenderComponent(unref(Button), {
        type: "primary",
        class: "checklist-modal__single-choice-submit",
        onClick: ($event) => _ctx.$emit("submit")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.ticket_panel.confirm_status"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.ticket_panel.confirm_status")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(PendingPhotoCaptureBlock, {
        "report-file-name": __props.reportFileName,
        "show-document": true,
        "show-camera": true,
        "photo-names": __props.photoNames,
        onAttachReport: ($event) => _ctx.$emit("attach-report"),
        onCamera: ($event) => _ctx.$emit("camera")
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/task_execution_panel/TaskExecutionTicketPanel.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const TaskExecutionTicketPanel = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-16af8ea9"]]);
const EQUIPMENT_LABEL_BY_ID = new Map(
  EQUIPMENT_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label]))
);
const ROOM_LABEL_BY_ID = new Map(
  ROOM_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label]))
);
const COLD_EQ = /* @__PURE__ */ new Set([
  "eq-freezer",
  "eq-fridge-1",
  "eq-fridge-2",
  "eq-cold-storage",
  "eq-cold-display",
  "eq-frozen-storage",
  "eq-coffee-bean-cooler",
  "eq-coffee-shock-cooler"
]);
const COLD_ROOMS = /* @__PURE__ */ new Set(["room-cold-chamber", "room-shock-freezer"]);
function inferPendingDrawerFieldType(measurement, task) {
  const valueText = String((measurement == null ? void 0 : measurement.value) ?? "");
  if (/мин/i.test(valueText)) {
    return "timer";
  }
  if (/[°]\s*C|°C|℃/i.test(valueText)) {
    return "temperature";
  }
  const t = task ?? {};
  const eqIds = normalizeEquipmentTargetIds(t.equipmentTargetIds);
  const roomIds = normalizeRoomTargetIds(t.roomTargetIds);
  if (eqIds.some((id) => COLD_EQ.has(id))) {
    return "temperature";
  }
  if (roomIds.some((id) => COLD_ROOMS.has(id))) {
    return "temperature";
  }
  if (/температур|охлажден|холод|камер/i.test(String(t.title ?? ""))) {
    return "temperature";
  }
  return null;
}
function buildReportFileNameStamp() {
  const ts = /* @__PURE__ */ new Date();
  const stamp = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(ts.getDate()).padStart(2, "0")}_${String(
    ts.getHours()
  ).padStart(2, "0")}${String(ts.getMinutes()).padStart(2, "0")}${String(
    ts.getSeconds()
  ).padStart(2, "0")}`;
  return `report_${stamp}.pdf`;
}
function buildPhotoFileNameStamp() {
  const ts = /* @__PURE__ */ new Date();
  return `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(ts.getDate()).padStart(2, "0")}_${String(
    ts.getHours()
  ).padStart(2, "0")}${String(ts.getMinutes()).padStart(2, "0")}${String(
    ts.getSeconds()
  ).padStart(2, "0")}`;
}
function getCurrentMeasurementRowStatus(task, rowRef) {
  const rows = Array.isArray(task == null ? void 0 : task.measurements) ? task.measurements : [];
  const t = String((rowRef == null ? void 0 : rowRef.time) ?? "").trim();
  if (!t) {
    return null;
  }
  const row = rows.find((r) => String((r == null ? void 0 : r.time) ?? "").trim() === t);
  return (row == null ? void 0 : row.status) != null ? String(row.status) : null;
}
function isCurrentMeasurementRowPending(task, rowRef) {
  return getCurrentMeasurementRowStatus(task, rowRef) === "pending";
}
function findMeasurementRowIndexByTime(task, rowRef) {
  const rows = task == null ? void 0 : task.measurements;
  if (!Array.isArray(rows) || !rowRef) {
    return -1;
  }
  return rows.findIndex((row) => String((row == null ? void 0 : row.time) ?? "") === String((rowRef == null ? void 0 : rowRef.time) ?? ""));
}
const temperatureAiAnalyzer = createTemperatureAiAnalyzer();
function applyPendingMeasurementFromKeypadOk({
  task,
  measurementRow,
  draft,
  fieldType
}) {
  const m = measurementRow;
  m && typeof m === "object" ? findMeasurementRowIndexByTime(task, m) : -1;
  m && typeof m === "object" ? { ...m } : null;
  if (!m || typeof m !== "object") {
    return false;
  }
  if (!isCurrentMeasurementRowPending(task, m)) {
    return false;
  }
  const raw = String(draft ?? "").trim();
  if (!raw || raw === "-" || raw === "." || raw === "-.") {
    return false;
  }
  const normalized = raw.replace(",", ".");
  const n = Number.parseFloat(normalized);
  if (!Number.isFinite(n)) {
    return false;
  }
  if (fieldType === "timer") {
    const mins = Math.max(0, Math.trunc(n));
    m.value = `${mins} мин`;
    m.status = "success";
    m.aiWarning = null;
    if ((task == null ? void 0 : task.id) === task_grain_cooling.id) {
      markGrainCoolingScenarioStoredCompleted();
    }
    return true;
  }
  if (fieldType !== "temperature") {
    return false;
  }
  const limits = readTaskTemperatureMinMaxC(task);
  const minC = (limits == null ? void 0 : limits.minC) ?? null;
  const maxC = (limits == null ? void 0 : limits.maxC) ?? null;
  const withinMin = minC == null ? true : n >= minC;
  const withinMax = maxC == null ? true : n <= maxC;
  const inRange = withinMin && withinMax;
  const taskNiche = resolveTaskNicheForTemperatureAi(task);
  const analyzerNiche = mapTaskNicheToAnalyzerNiche(taskNiche);
  const display = String(normalized).replace(".", ",");
  m.value = `${display} °C`;
  const currentValueFromMeasurement = parseTemperatureFromMeasurementValue(m.value);
  const aiMode = resolveTemperatureAiMode(
    task,
    analyzerNiche,
    currentValueFromMeasurement
  );
  let statusOk = limits == null ? true : inRange;
  if (analyzerNiche === "bread") {
    const bandRow = resolveBreadRowForTaskMeasurement(
      n,
      task == null ? void 0 : task.equipmentTargetIds,
      aiMode
    );
    if (bandRow) {
      statusOk = bandRow.status === "normal";
    }
  }
  if (analyzerNiche === "meat") {
    const bandRow = resolveMeatRowForTaskMeasurement(
      n,
      task == null ? void 0 : task.equipmentTargetIds,
      aiMode
    );
    if (bandRow) {
      statusOk = bandRow.status === "normal";
    }
  }
  if (analyzerNiche === "coffee") {
    const bandRow = resolveCoffeeRowForTaskMeasurement(
      n,
      task == null ? void 0 : task.equipmentTargetIds,
      aiMode
    );
    if (bandRow) {
      statusOk = bandRow.status === "normal";
    }
  }
  m.status = statusOk ? "success" : "problem";
  let aiDisplay = null;
  if (currentValueFromMeasurement != null) {
    aiDisplay = statusOk ? temperatureAiAnalyzer.getHaccpInRangeDisplay({
      niche: analyzerNiche,
      mode: aiMode,
      currentValue: currentValueFromMeasurement,
      ccpMin: minC,
      ccpMax: maxC,
      equipmentTargetIds: task == null ? void 0 : task.equipmentTargetIds
    }) : temperatureAiAnalyzer.getHaccpWarning({
      niche: analyzerNiche,
      mode: aiMode,
      currentValue: currentValueFromMeasurement,
      ccpMin: minC,
      ccpMax: maxC,
      equipmentTargetIds: task == null ? void 0 : task.equipmentTargetIds
    });
  }
  m.aiWarning = aiDisplay;
  if (task && typeof task === "object") {
    const previousContext = task.aiContext && typeof task.aiContext === "object" ? task.aiContext : {};
    task.aiContext = {
      ...previousContext,
      engine: "temperature-v1",
      niche: taskNiche,
      mode: aiMode,
      taskType: "temperature",
      ccpMin: minC,
      ccpMax: maxC,
      ccpLabel: (aiDisplay == null ? void 0 : aiDisplay.ccpLabel) ?? previousContext.ccpLabel ?? "",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if ((task == null ? void 0 : task.id) === task_grain_cooling.id) {
    markGrainCoolingScenarioStoredCompleted();
  }
  return true;
}
const tt = (...args) => i18n.global.t(...args);
function useTaskExecutionDrawerState(props) {
  const isOpen = ref(false);
  const pendingDrawerMeasurement = ref(null);
  const pendingTemperatureDraft = ref("");
  const pendingPhotoNames = ref([]);
  const pendingReportFileName = ref("");
  const pendingSingleChoiceAnswer = ref("");
  const pendingSingleChoiceComment = ref("");
  const pendingTicketStatus = ref("not_completed");
  const pendingTicketComment = ref("");
  const viewportWidth = ref(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const onResize = () => {
    viewportWidth.value = window.innerWidth;
  };
  onMounted(() => {
    window.addEventListener("resize", onResize, { passive: true });
  });
  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
  });
  const pendingDrawerTitle = computed(() => {
    var _a;
    return String(((_a = props.task) == null ? void 0 : _a.title) ?? "—");
  });
  const pendingDrawerWidth = computed(() => {
    const vw = Number(viewportWidth.value) || 0;
    const max = 502;
    const w = Math.min(max, Math.max(320, vw));
    return Number.isFinite(w) ? Math.round(w) : max;
  });
  const pendingDrawerTargetsDisplay = computed(() => {
    const task = props.task ?? {};
    if (task.taskScopeType === "equipment") {
      const ids = normalizeEquipmentTargetIds(task.equipmentTargetIds);
      const names = ids.map((id) => EQUIPMENT_LABEL_BY_ID.get(id) ?? id);
      return names.length ? names.join(", ") : "—";
    }
    if (task.taskScopeType === "rooms") {
      const ids = normalizeRoomTargetIds(task.roomTargetIds);
      const names = ids.map((id) => ROOM_LABEL_BY_ID.get(id) ?? id);
      return names.length ? names.join(", ") : "—";
    }
    return "—";
  });
  const pendingDrawerFieldTypeFromTask = computed(
    () => {
      var _a, _b, _c;
      return ((_c = (_b = (_a = props.task) == null ? void 0 : _a.taskFieldDefinitions) == null ? void 0 : _b[0]) == null ? void 0 : _c.fieldType) ?? null;
    }
  );
  const pendingSingleChoiceDefinition = computed(() => {
    var _a, _b;
    const def = ((_b = (_a = props.task) == null ? void 0 : _a.taskFieldDefinitions) == null ? void 0 : _b[0]) ?? null;
    if (!def || def.fieldType !== "single_choice") {
      return null;
    }
    return def;
  });
  const pendingSingleChoiceQuestion = computed(() => {
    var _a, _b;
    const q = (_b = (_a = pendingSingleChoiceDefinition.value) == null ? void 0 : _a.config) == null ? void 0 : _b.question;
    return String(q ?? "").trim() || tt("demo.execution_drawer.select_answer");
  });
  const pendingSingleChoiceOptions = computed(() => {
    var _a, _b;
    const raw = (_b = (_a = pendingSingleChoiceDefinition.value) == null ? void 0 : _a.config) == null ? void 0 : _b.options;
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.map((x) => String(x ?? "").trim()).filter(Boolean);
  });
  const pendingTicketDescription = computed(() => {
    var _a, _b, _c;
    const def = ((_b = (_a = props.task) == null ? void 0 : _a.taskFieldDefinitions) == null ? void 0 : _b[0]) ?? null;
    if (!def || def.fieldType !== "ticket") {
      return "—";
    }
    const text = String(((_c = def == null ? void 0 : def.config) == null ? void 0 : _c.description) ?? "").trim();
    return text || "—";
  });
  const pendingDrawerFieldType = computed(
    () => pendingDrawerFieldTypeFromTask.value ?? inferPendingDrawerFieldType(
      pendingDrawerMeasurement.value,
      props.task
    )
  );
  const showBluetoothAlert = computed(() => {
    const ft = pendingDrawerFieldType.value;
    return ft === "temperature" || ft === "timer";
  });
  const pendingShowCamera = computed(() => {
    var _a, _b;
    const ft = pendingDrawerFieldType.value;
    if (ft !== "temperature" && ft !== "timer") {
      return false;
    }
    const def = (_b = (_a = props.task) == null ? void 0 : _a.taskFieldDefinitions) == null ? void 0 : _b[0];
    const cfg = (def == null ? void 0 : def.config) && typeof def.config === "object" ? def.config : {};
    if (Object.prototype.hasOwnProperty.call(cfg, "showCamera")) {
      return Boolean(cfg.showCamera);
    }
    return true;
  });
  const pendingDrawerFieldTypeDisplay = computed(() => {
    var _a;
    const ft = pendingDrawerFieldType.value;
    const options = typeof TASK_FIELD_TYPE_OPTIONS === "function" ? TASK_FIELD_TYPE_OPTIONS() : TASK_FIELD_TYPE_OPTIONS;
    const label = (_a = options.find((o) => o.value === ft)) == null ? void 0 : _a.label;
    return label ?? (ft ? String(ft) : "—");
  });
  const pendingInputSuffix = computed(
    () => pendingDrawerFieldType.value === "timer" ? "min" : "°C"
  );
  const pendingInputPrefix = computed(
    () => pendingDrawerFieldType.value === "timer" ? "⏱️" : "🌡️"
  );
  function openPendingDrawer(measurement) {
    if (!isCurrentMeasurementRowPending(props.task, measurement)) {
      return;
    }
    pendingDrawerMeasurement.value = measurement ?? null;
    pendingTemperatureDraft.value = "";
    pendingPhotoNames.value = [];
    pendingReportFileName.value = "";
    pendingSingleChoiceAnswer.value = "";
    pendingSingleChoiceComment.value = "";
    pendingTicketStatus.value = "not_completed";
    pendingTicketComment.value = "";
    viewportWidth.value = typeof window !== "undefined" ? window.innerWidth : 1024;
    isOpen.value = true;
  }
  function closeDrawer() {
    isOpen.value = false;
  }
  const applyPendingInputToMeasurement = () => applyPendingMeasurementFromKeypadOk({
    task: props.task,
    measurementRow: pendingDrawerMeasurement.value,
    draft: pendingTemperatureDraft.value,
    fieldType: pendingDrawerFieldType.value
  });
  const onKeypadPress = (key) => {
    const raw = String(pendingTemperatureDraft.value ?? "");
    if (key === "DEL") {
      pendingTemperatureDraft.value = raw.slice(0, -1);
      return;
    }
    if (key === "+/-") {
      pendingTemperatureDraft.value = raw.startsWith("-") ? raw.slice(1) : raw ? `-${raw}` : "-";
      return;
    }
    if (key === ".") {
      if (!raw.includes(".")) {
        if (raw === "-") {
          pendingTemperatureDraft.value = "-0.";
        } else if (raw === "") {
          pendingTemperatureDraft.value = "0.";
        } else {
          pendingTemperatureDraft.value = `${raw}.`;
        }
      }
      return;
    }
    if (key === "✓") {
      applyPendingInputToMeasurement();
      isOpen.value = false;
      return;
    }
    if (/^\d$/.test(key)) {
      const nextRaw = raw === "-" ? `-${key}` : `${raw}${key}`;
      const sign = nextRaw.startsWith("-") ? "-" : "";
      const body = sign ? nextRaw.slice(1) : nextRaw;
      if (!body.includes(".")) {
        const normalizedBody = body.replace(/^0+(?=\d)/, "");
        pendingTemperatureDraft.value = `${sign}${normalizedBody || "0"}`;
      } else {
        pendingTemperatureDraft.value = sanitizeTemperatureNumericDraft(nextRaw);
      }
    }
  };
  const submitSingleChoiceAnswer = () => {
    const m = pendingDrawerMeasurement.value;
    const answer = String(pendingSingleChoiceAnswer.value ?? "").trim();
    if (!m || !answer) {
      return;
    }
    if (!isCurrentMeasurementRowPending(props.task, m)) {
      return;
    }
    const comment = String(pendingSingleChoiceComment.value ?? "").trim();
    m.value = answer;
    m.status = "success";
    m.aiWarning = null;
    m.comment = comment || null;
    isOpen.value = false;
  };
  const submitTicketResult = () => {
    const m = pendingDrawerMeasurement.value;
    if (!m) {
      return;
    }
    if (!isCurrentMeasurementRowPending(props.task, m)) {
      return;
    }
    const completed = pendingTicketStatus.value === "completed";
    const comment = String(pendingTicketComment.value ?? "").trim();
    m.value = completed ? tt("demo.execution_drawer.status_completed") : tt("demo.execution_drawer.status_not_completed");
    m.status = completed ? "success" : "problem";
    m.aiWarning = null;
    m.comment = comment || null;
    isOpen.value = false;
  };
  const simulateReportFileAttach = () => {
    pendingReportFileName.value = buildReportFileNameStamp();
  };
  const simulateCameraShot = () => {
    pendingPhotoNames.value = [
      ...pendingPhotoNames.value,
      `photo_${buildPhotoFileNameStamp()}.jpg`
    ];
  };
  return {
    isOpen,
    pendingDrawerMeasurement,
    pendingTemperatureDraft,
    pendingPhotoNames,
    pendingReportFileName,
    pendingSingleChoiceAnswer,
    pendingSingleChoiceComment,
    pendingTicketStatus,
    pendingTicketComment,
    viewportWidth,
    pendingDrawerTitle,
    pendingDrawerWidth,
    pendingDrawerTargetsDisplay,
    pendingDrawerFieldType,
    showBluetoothAlert,
    pendingShowCamera,
    pendingSingleChoiceQuestion,
    pendingSingleChoiceOptions,
    pendingTicketDescription,
    pendingDrawerFieldTypeDisplay,
    pendingInputSuffix,
    pendingInputPrefix,
    openPendingDrawer,
    closeDrawer,
    onKeypadPress,
    submitSingleChoiceAnswer,
    submitTicketResult,
    simulateReportFileAttach,
    simulateCameraShot
  };
}
const _sfc_main$g = /* @__PURE__ */ Object.assign({ name: "TaskExecutionPanelModal" }, {
  __name: "TaskExecutionPanelModal",
  __ssrInlineRender: true,
  props: {
    task: {
      type: Object,
      default: null
    }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const {
      isOpen,
      pendingTemperatureDraft,
      pendingPhotoNames,
      pendingReportFileName,
      pendingSingleChoiceAnswer,
      pendingSingleChoiceComment,
      pendingTicketStatus,
      pendingTicketComment,
      pendingDrawerTitle,
      pendingDrawerWidth,
      pendingDrawerTargetsDisplay,
      pendingDrawerFieldType,
      showBluetoothAlert,
      pendingShowCamera,
      pendingSingleChoiceQuestion,
      pendingSingleChoiceOptions,
      pendingTicketDescription,
      pendingDrawerFieldTypeDisplay,
      pendingInputSuffix,
      pendingInputPrefix,
      openPendingDrawer,
      closeDrawer,
      onKeypadPress,
      submitSingleChoiceAnswer,
      submitTicketResult,
      simulateReportFileAttach,
      simulateCameraShot
    } = useTaskExecutionDrawerState(props);
    __expose({
      open: openPendingDrawer,
      close: closeDrawer
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NDrawer), mergeProps({
        show: unref(isOpen),
        "onUpdate:show": ($event) => isRef(isOpen) ? isOpen.value = $event : null,
        width: unref(pendingDrawerWidth),
        placement: "right"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(NDrawerContent), { closable: "" }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="checklist-modal__pending-header-title" data-v-40d13446${_scopeId2}>${ssrInterpolate(unref(pendingDrawerTitle))}</span>`);
                } else {
                  return [
                    createVNode("span", { class: "checklist-modal__pending-header-title" }, toDisplayString(unref(pendingDrawerTitle)), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="checklist-modal__pending-drawer" data-v-40d13446${_scopeId2}>`);
                  _push3(ssrRenderComponent(TaskExecutionMetaBlock, {
                    "show-alert": unref(showBluetoothAlert),
                    "targets-display": unref(pendingDrawerTargetsDisplay)
                  }, null, _parent3, _scopeId2));
                  if (unref(showBluetoothAlert)) {
                    _push3(ssrRenderComponent(TaskExecutionTemperatureTimerPanel, {
                      "field-type-display": unref(pendingDrawerFieldTypeDisplay),
                      "temperature-draft": unref(pendingTemperatureDraft),
                      "onUpdate:temperatureDraft": ($event) => isRef(pendingTemperatureDraft) ? pendingTemperatureDraft.value = $event : null,
                      "input-prefix": unref(pendingInputPrefix),
                      "input-suffix": unref(pendingInputSuffix),
                      "photo-names": unref(pendingPhotoNames),
                      "show-camera": unref(pendingShowCamera),
                      onKeypadPress: unref(onKeypadPress),
                      onCameraShot: unref(simulateCameraShot)
                    }, null, _parent3, _scopeId2));
                  } else if (unref(pendingDrawerFieldType) === "single_choice") {
                    _push3(ssrRenderComponent(TaskExecutionSingleChoicePanel, {
                      question: unref(pendingSingleChoiceQuestion),
                      options: unref(pendingSingleChoiceOptions),
                      answer: unref(pendingSingleChoiceAnswer),
                      "onUpdate:answer": ($event) => isRef(pendingSingleChoiceAnswer) ? pendingSingleChoiceAnswer.value = $event : null,
                      comment: unref(pendingSingleChoiceComment),
                      "onUpdate:comment": ($event) => isRef(pendingSingleChoiceComment) ? pendingSingleChoiceComment.value = $event : null,
                      "report-file-name": unref(pendingReportFileName),
                      "photo-names": unref(pendingPhotoNames),
                      onSubmit: unref(submitSingleChoiceAnswer),
                      onAttachReport: unref(simulateReportFileAttach),
                      onCamera: unref(simulateCameraShot)
                    }, null, _parent3, _scopeId2));
                  } else if (unref(pendingDrawerFieldType) === "ticket") {
                    _push3(ssrRenderComponent(TaskExecutionTicketPanel, {
                      description: unref(pendingTicketDescription),
                      "ticket-status": unref(pendingTicketStatus),
                      "onUpdate:ticketStatus": ($event) => isRef(pendingTicketStatus) ? pendingTicketStatus.value = $event : null,
                      "ticket-comment": unref(pendingTicketComment),
                      "onUpdate:ticketComment": ($event) => isRef(pendingTicketComment) ? pendingTicketComment.value = $event : null,
                      "report-file-name": unref(pendingReportFileName),
                      "photo-names": unref(pendingPhotoNames),
                      onSubmit: unref(submitTicketResult),
                      onAttachReport: unref(simulateReportFileAttach),
                      onCamera: unref(simulateCameraShot)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "checklist-modal__pending-drawer" }, [
                      createVNode(TaskExecutionMetaBlock, {
                        "show-alert": unref(showBluetoothAlert),
                        "targets-display": unref(pendingDrawerTargetsDisplay)
                      }, null, 8, ["show-alert", "targets-display"]),
                      unref(showBluetoothAlert) ? (openBlock(), createBlock(TaskExecutionTemperatureTimerPanel, {
                        key: 0,
                        "field-type-display": unref(pendingDrawerFieldTypeDisplay),
                        "temperature-draft": unref(pendingTemperatureDraft),
                        "onUpdate:temperatureDraft": ($event) => isRef(pendingTemperatureDraft) ? pendingTemperatureDraft.value = $event : null,
                        "input-prefix": unref(pendingInputPrefix),
                        "input-suffix": unref(pendingInputSuffix),
                        "photo-names": unref(pendingPhotoNames),
                        "show-camera": unref(pendingShowCamera),
                        onKeypadPress: unref(onKeypadPress),
                        onCameraShot: unref(simulateCameraShot)
                      }, null, 8, ["field-type-display", "temperature-draft", "onUpdate:temperatureDraft", "input-prefix", "input-suffix", "photo-names", "show-camera", "onKeypadPress", "onCameraShot"])) : unref(pendingDrawerFieldType) === "single_choice" ? (openBlock(), createBlock(TaskExecutionSingleChoicePanel, {
                        key: 1,
                        question: unref(pendingSingleChoiceQuestion),
                        options: unref(pendingSingleChoiceOptions),
                        answer: unref(pendingSingleChoiceAnswer),
                        "onUpdate:answer": ($event) => isRef(pendingSingleChoiceAnswer) ? pendingSingleChoiceAnswer.value = $event : null,
                        comment: unref(pendingSingleChoiceComment),
                        "onUpdate:comment": ($event) => isRef(pendingSingleChoiceComment) ? pendingSingleChoiceComment.value = $event : null,
                        "report-file-name": unref(pendingReportFileName),
                        "photo-names": unref(pendingPhotoNames),
                        onSubmit: unref(submitSingleChoiceAnswer),
                        onAttachReport: unref(simulateReportFileAttach),
                        onCamera: unref(simulateCameraShot)
                      }, null, 8, ["question", "options", "answer", "onUpdate:answer", "comment", "onUpdate:comment", "report-file-name", "photo-names", "onSubmit", "onAttachReport", "onCamera"])) : unref(pendingDrawerFieldType) === "ticket" ? (openBlock(), createBlock(TaskExecutionTicketPanel, {
                        key: 2,
                        description: unref(pendingTicketDescription),
                        "ticket-status": unref(pendingTicketStatus),
                        "onUpdate:ticketStatus": ($event) => isRef(pendingTicketStatus) ? pendingTicketStatus.value = $event : null,
                        "ticket-comment": unref(pendingTicketComment),
                        "onUpdate:ticketComment": ($event) => isRef(pendingTicketComment) ? pendingTicketComment.value = $event : null,
                        "report-file-name": unref(pendingReportFileName),
                        "photo-names": unref(pendingPhotoNames),
                        onSubmit: unref(submitTicketResult),
                        onAttachReport: unref(simulateReportFileAttach),
                        onCamera: unref(simulateCameraShot)
                      }, null, 8, ["description", "ticket-status", "onUpdate:ticketStatus", "ticket-comment", "onUpdate:ticketComment", "report-file-name", "photo-names", "onSubmit", "onAttachReport", "onCamera"])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(NDrawerContent), { closable: "" }, {
                header: withCtx(() => [
                  createVNode("span", { class: "checklist-modal__pending-header-title" }, toDisplayString(unref(pendingDrawerTitle)), 1)
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "checklist-modal__pending-drawer" }, [
                    createVNode(TaskExecutionMetaBlock, {
                      "show-alert": unref(showBluetoothAlert),
                      "targets-display": unref(pendingDrawerTargetsDisplay)
                    }, null, 8, ["show-alert", "targets-display"]),
                    unref(showBluetoothAlert) ? (openBlock(), createBlock(TaskExecutionTemperatureTimerPanel, {
                      key: 0,
                      "field-type-display": unref(pendingDrawerFieldTypeDisplay),
                      "temperature-draft": unref(pendingTemperatureDraft),
                      "onUpdate:temperatureDraft": ($event) => isRef(pendingTemperatureDraft) ? pendingTemperatureDraft.value = $event : null,
                      "input-prefix": unref(pendingInputPrefix),
                      "input-suffix": unref(pendingInputSuffix),
                      "photo-names": unref(pendingPhotoNames),
                      "show-camera": unref(pendingShowCamera),
                      onKeypadPress: unref(onKeypadPress),
                      onCameraShot: unref(simulateCameraShot)
                    }, null, 8, ["field-type-display", "temperature-draft", "onUpdate:temperatureDraft", "input-prefix", "input-suffix", "photo-names", "show-camera", "onKeypadPress", "onCameraShot"])) : unref(pendingDrawerFieldType) === "single_choice" ? (openBlock(), createBlock(TaskExecutionSingleChoicePanel, {
                      key: 1,
                      question: unref(pendingSingleChoiceQuestion),
                      options: unref(pendingSingleChoiceOptions),
                      answer: unref(pendingSingleChoiceAnswer),
                      "onUpdate:answer": ($event) => isRef(pendingSingleChoiceAnswer) ? pendingSingleChoiceAnswer.value = $event : null,
                      comment: unref(pendingSingleChoiceComment),
                      "onUpdate:comment": ($event) => isRef(pendingSingleChoiceComment) ? pendingSingleChoiceComment.value = $event : null,
                      "report-file-name": unref(pendingReportFileName),
                      "photo-names": unref(pendingPhotoNames),
                      onSubmit: unref(submitSingleChoiceAnswer),
                      onAttachReport: unref(simulateReportFileAttach),
                      onCamera: unref(simulateCameraShot)
                    }, null, 8, ["question", "options", "answer", "onUpdate:answer", "comment", "onUpdate:comment", "report-file-name", "photo-names", "onSubmit", "onAttachReport", "onCamera"])) : unref(pendingDrawerFieldType) === "ticket" ? (openBlock(), createBlock(TaskExecutionTicketPanel, {
                      key: 2,
                      description: unref(pendingTicketDescription),
                      "ticket-status": unref(pendingTicketStatus),
                      "onUpdate:ticketStatus": ($event) => isRef(pendingTicketStatus) ? pendingTicketStatus.value = $event : null,
                      "ticket-comment": unref(pendingTicketComment),
                      "onUpdate:ticketComment": ($event) => isRef(pendingTicketComment) ? pendingTicketComment.value = $event : null,
                      "report-file-name": unref(pendingReportFileName),
                      "photo-names": unref(pendingPhotoNames),
                      onSubmit: unref(submitTicketResult),
                      onAttachReport: unref(simulateReportFileAttach),
                      onCamera: unref(simulateCameraShot)
                    }, null, 8, ["description", "ticket-status", "onUpdate:ticketStatus", "ticket-comment", "onUpdate:ticketComment", "report-file-name", "photo-names", "onSubmit", "onAttachReport", "onCamera"])) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/task_execution_panel/TaskExecutionPanelModal.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const TaskExecutionPanelModal = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-40d13446"]]);
const _sfc_main$f = {
  __name: "TaskAssigneeSection",
  __ssrInlineRender: true,
  props: {
    task: {
      type: Object,
      required: true
    },
    staff: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: "checklists"
    },
    taskType: {
      type: String,
      default: "ccp"
    },
    /** Синхронизация с видимостью родительской модалки */
    modalShow: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const props = __props;
    const assigneePickerOpen = ref(false);
    const isHotMode = computed(() => props.mode === "hot");
    const siteIdForTask = computed(() => NICHE_TO_SITE_ID[props.taskType] ?? null);
    const assigneeSelectOptions = computed(() => {
      const sid = siteIdForTask.value;
      const list = Array.isArray(props.staff) ? props.staff : [];
      const filtered = sid ? list.filter((m) => m && m.siteId === sid && m.active !== false) : list.filter((m) => m && m.active !== false);
      return filtered.map((m) => ({
        label: `${m.fullName} — ${m.role}`,
        value: m.id
      }));
    });
    const modalAssigneeDisplay = computed(() => {
      const t2 = props.task;
      if (!(t2 == null ? void 0 : t2.assignedStaffId)) {
        return "";
      }
      const name = resolveStaffFullName(props.staff, t2.assignedStaffId);
      return name === "—" ? "" : name;
    });
    const onAssigneeUpdate = (value) => {
      if (!props.task) {
        return;
      }
      props.task.assignedStaffId = value ?? null;
      if (!value) {
        assigneePickerOpen.value = false;
      }
    };
    watch(
      () => [props.modalShow, props.task],
      ([show, task]) => {
        if (!show) {
          assigneePickerOpen.value = false;
          return;
        }
        if (task) {
          assigneePickerOpen.value = Boolean(task.assignedStaffId);
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklist-modal__assignee-block border-bottom-dashed" }, _attrs))} data-v-f25279a0>`);
      if (isHotMode.value) {
        _push(`<p class="checklist-modal__hot-assignee-label" data-v-f25279a0><span data-v-f25279a0>${ssrInterpolate(unref(t)("demo.task_assignee.label_colon"))}</span><span class="${ssrRenderClass([{
          "checklist-modal__hot-assignee-text--empty": !modalAssigneeDisplay.value
        }, "checklist-modal__hot-assignee-text"])}" data-v-f25279a0>${ssrInterpolate(modalAssigneeDisplay.value || unref(t)("demo.task_assignee.not_assigned"))}</span></p>`);
      } else {
        _push(`<!--[--><p class="checklist-modal__assignee-label" data-v-f25279a0>${ssrInterpolate(unref(t)("demo.task_assignee.label"))}</p>`);
        if (!__props.task.assignedStaffId && !assigneePickerOpen.value) {
          _push(`<div class="checklist-modal__assignee-row" data-v-f25279a0><span class="checklist-modal__assignee-empty" data-v-f25279a0>${ssrInterpolate(unref(t)("demo.task_assignee.not_assigned"))}</span>`);
          _push(ssrRenderComponent(unref(Button), {
            type: "primary",
            onClick: ($event) => assigneePickerOpen.value = true
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("demo.task_assignee.assign"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("demo.task_assignee.assign")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(ssrRenderComponent(unref(NSelect), {
            value: __props.task.assignedStaffId ?? null,
            options: assigneeSelectOptions.value,
            clearable: "",
            filterable: "",
            placeholder: unref(t)("demo.task_assignee.select_placeholder"),
            "onUpdate:value": onAssigneeUpdate
          }, null, _parent));
        }
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/show_task/TaskAssigneeSection.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const TaskAssigneeSection = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-f25279a0"]]);
const _sfc_main$e = {
  __name: "TaskFieldSummarySection",
  __ssrInlineRender: true,
  props: {
    lines: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.lines.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklist-modal__task-fields" }, _attrs))} data-v-61be1c73><p class="checklist-modal__assignee-label" data-v-61be1c73>${ssrInterpolate(unref(t)("demo.task_fields.section_title"))}</p><ul class="checklist-modal__task-fields-list" data-v-61be1c73><!--[-->`);
        ssrRenderList(__props.lines, (line, idx) => {
          _push(`<li class="checklist-modal__task-fields-item" data-v-61be1c73>${ssrInterpolate(line)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/show_task/TaskFieldSummarySection.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const TaskFieldSummarySection = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-61be1c73"]]);
const _sfc_main$d = {
  __name: "TaskMeasurementsTable",
  __ssrInlineRender: true,
  props: {
    task: {
      type: Object,
      required: true
    },
    isHotMode: {
      type: Boolean,
      default: false
    },
    expandedActionRowKey: {
      default: null
    },
    /** Уже вычислено для текущей `task` в родителе */
    taskScheduledForFuture: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:expandedActionRowKey", "open-pending"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const emit = __emit;
    const resolveActionOptions = (task) => ((task == null ? void 0 : task.correctiveActions) ?? []).map((label) => ({
      label,
      value: label
    }));
    const onCorrectiveActionSelect = (measurement, value) => {
      measurement.correctiveAction = value;
      emit("update:expandedActionRowKey", null);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if ((_a = __props.task.measurements) == null ? void 0 : _a.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklist-modal__table-wrap" }, _attrs))} data-v-dfca90e7><table class="checklist-modal__table checklist-modal__table--measurements" data-v-dfca90e7><colgroup data-v-dfca90e7><col class="checklist-modal__col-time" data-v-dfca90e7><col class="checklist-modal__col-decision" data-v-dfca90e7><col class="checklist-modal__col-status" data-v-dfca90e7></colgroup><thead data-v-dfca90e7><tr data-v-dfca90e7><th data-v-dfca90e7>${ssrInterpolate(unref(t)("demo.measurements.col_time"))}</th><th data-v-dfca90e7>${ssrInterpolate(unref(t)("demo.measurements.col_decision"))}</th><th data-v-dfca90e7>${ssrInterpolate(unref(t)("demo.measurements.col_status"))}</th></tr></thead><!--[-->`);
        ssrRenderList(__props.task.measurements, (item) => {
          var _a2, _b, _c;
          _push(`<tbody class="${ssrRenderClass([[
            "checklist-modal__measurement-group--" + (item.status || "pending"),
            {
              "checklist-modal__measurement-group--ai-warning": ((_a2 = item.aiWarning) == null ? void 0 : _a2.ai_status) === "warning",
              "checklist-modal__measurement-group--pending-neutral": (item.status || "pending") === "pending" && item.aiWarning == null
            }
          ], "checklist-modal__measurement-group"])}" data-v-dfca90e7><tr data-v-dfca90e7><td class="checklist-modal__measurement-row-cell" data-label="Время" data-v-dfca90e7><span class="checklist-modal__bolt-text" data-v-dfca90e7>${ssrInterpolate(item.time)}</span></td><td class="checklist-modal__measurement-row-cell" data-label="Решение" data-v-dfca90e7>`);
          if (item.aiWarning) {
            _push(`<table class="checklist-modal__decision-nested" data-v-dfca90e7><tbody data-v-dfca90e7><tr data-v-dfca90e7><td class="checklist-modal__decision-nested__value" data-v-dfca90e7><span class="checklist-modal__bolt-text metric-value" data-v-dfca90e7>${ssrInterpolate(item.value)}</span></td></tr>`);
            if (item.aiWarning.threat) {
              _push(`<tr data-v-dfca90e7><td class="checklist-modal__decision-nested__threat" data-v-dfca90e7>${ssrInterpolate(item.aiWarning.threat)}</td></tr>`);
            } else {
              _push(`<!---->`);
            }
            if (item.aiWarning.action) {
              _push(`<tr data-v-dfca90e7><td class="checklist-modal__decision-nested__action" data-v-dfca90e7>${ssrInterpolate(item.aiWarning.action)}</td></tr>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</tbody></table>`);
          } else {
            _push(`<span class="checklist-modal__measurement-value" data-v-dfca90e7>${ssrInterpolate(item.value)}</span>`);
          }
          _push(`</td><td class="checklist-modal__measurement-row-cell" data-label="Статус" data-v-dfca90e7><span class="checklist-modal__measurement-value checklist-modal__measurement-value--status" data-v-dfca90e7>`);
          if ((_b = item.aiWarning) == null ? void 0 : _b.deviationLine) {
            _push(`<p class="checklist-modal__status-deviation-line checklist-modal__bolt-text metric-value" data-v-dfca90e7>${ssrInterpolate(item.aiWarning.deviationLine)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (!__props.isHotMode && item.status === "problem") {
            _push(`<button type="button" class="${ssrRenderClass([[
              ((_c = item.aiWarning) == null ? void 0 : _c.ai_status) === "warning" ? "checklist-modal__status-trigger--warning" : "checklist-modal__status-trigger--problem",
              {
                "checklist-modal__status-trigger--with-action": Boolean(item.correctiveAction)
              }
            ], "checklist-modal__status-trigger"])}"${ssrRenderAttr("aria-label", unref(t)("demo.measurements.respond"))} data-v-dfca90e7>${ssrInterpolate(unref(t)("demo.measurements.respond"))}</button>`);
          } else if (!__props.isHotMode && item.status === "pending" && !__props.taskScheduledForFuture) {
            _push(`<button type="button" class="${ssrRenderClass([
              item.aiWarning == null ? "checklist-modal__status-trigger--pending-neutral" : "checklist-modal__status-trigger--pending",
              "checklist-modal__status-trigger"
            ])}"${ssrRenderAttr("aria-label", unref(t)("demo.measurements.resolve"))} data-v-dfca90e7>${ssrInterpolate(unref(t)("demo.measurements.resolve"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          if (item.status === "problem" && item.correctiveAction) {
            _push(`<p class="checklist-modal__selected-action" data-v-dfca90e7>${ssrInterpolate(item.correctiveAction)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></td></tr>`);
          if (!__props.isHotMode && __props.expandedActionRowKey === item.time && item.status === "problem") {
            _push(`<tr data-v-dfca90e7><td colspan="3" class="checklist-modal__action-row" data-v-dfca90e7><div class="checklist-modal__action-box" data-v-dfca90e7><p class="checklist-modal__action-title" data-v-dfca90e7>${ssrInterpolate(unref(t)("demo.measurements.corrective_actions"))}</p>`);
            _push(ssrRenderComponent(unref(NSelect), {
              value: item.correctiveAction ?? null,
              options: resolveActionOptions(__props.task),
              placeholder: unref(t)("demo.measurements.select_action"),
              "onUpdate:value": ($event) => onCorrectiveActionSelect(item, $event)
            }, null, _parent));
            _push(`</div></td></tr>`);
          } else {
            _push(`<!---->`);
          }
          if (String(item.comment ?? "").trim()) {
            _push(`<tr data-v-dfca90e7><td colspan="3" class="checklist-modal__comment-row" data-v-dfca90e7>${ssrInterpolate(item.comment)}</td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody>`);
        });
        _push(`<!--]--></table></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/show_task/TaskMeasurementsTable.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const TaskMeasurementsTable = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-dfca90e7"]]);
const _sfc_main$c = {
  __name: "TaskTargetsLine",
  __ssrInlineRender: true,
  props: {
    taskScopeType: {
      type: String,
      default: ""
    },
    targetsLine: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.targetsLine) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklist-modal__targets-line border-bottom-dashed" }, _attrs))} data-v-ec59e554>`);
        if (__props.taskScopeType === "equipment") {
          _push(ssrRenderComponent(_sfc_main$o, {
            name: "battery-charging-90-round",
            class: "checklist-modal__targets-icon equipment",
            "aria-hidden": "true"
          }, null, _parent));
        } else if (__props.taskScopeType === "rooms") {
          _push(ssrRenderComponent(_sfc_main$o, {
            name: "account-balance-twotone",
            class: "checklist-modal__targets-icon rooms",
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="checklist-modal__targets-text" data-v-ec59e554>${ssrInterpolate(__props.targetsLine)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/show_task/TaskTargetsLine.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const TaskTargetsLine = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-ec59e554"]]);
const MAX_OPEN_ATTEMPTS = 24;
async function openShowTaskModalPendingDrawer({
  getTask,
  item,
  source: _source = "неизвестно",
  pendingDrawerRef,
  demoStateRef: _demoStateRef
}) {
  const task = getTask();
  const statusNow = getCurrentMeasurementRowStatus(task, item);
  if (statusNow !== "pending") {
    return;
  }
  const idx = findMeasurementRowIndexByTime(task, item);
  const rows = Array.isArray(task == null ? void 0 : task.measurements) ? task.measurements : [];
  const rowForDrawer = idx >= 0 && idx < rows.length ? rows[idx] : null;
  if (!rowForDrawer) {
    return;
  }
  for (let attempt = 0; attempt < MAX_OPEN_ATTEMPTS; attempt++) {
    const inst = pendingDrawerRef.value;
    const openFn = inst == null ? void 0 : inst.open;
    if (typeof openFn === "function") {
      openFn.call(inst, rowForDrawer);
      return;
    }
    await nextTick();
    if (attempt % 6 === 5) {
      await new Promise((r) => {
        requestAnimationFrame(r);
      });
    }
  }
}
function useGrainCoolingShowTaskModalBridge({
  getShow,
  getTask,
  taskScheduledForFuture,
  isHotMode,
  pendingDrawerRef
}) {
  const { demoState } = useDemoState();
  const getTaskResolved = () => resolveGrainCoolingTaskFromDemoState(getTask(), demoState);
  const grainCoolingStoreRef = shallowRef(
    task_grain_cooling.scenarioProcessAllowed ? useGrainCoolingStore() : null
  );
  watch(
    () => task_grain_cooling.scenarioProcessAllowed,
    (allowed) => {
      if (allowed && !grainCoolingStoreRef.value) {
        grainCoolingStoreRef.value = useGrainCoolingStore();
      }
      if (!allowed) {
        grainCoolingStoreRef.value = null;
      }
    }
  );
  async function onOpenPending(item, source = "unknown") {
    await openShowTaskModalPendingDrawer({
      getTask: getTaskResolved,
      item,
      source,
      pendingDrawerRef,
      demoStateRef: demoState
    });
  }
  async function tryAutoOpenPendingDrawerAfterDeepLink() {
    if (!task_grain_cooling.scenarioProcessAllowed) {
      return;
    }
    const grainCoolingStore = grainCoolingStoreRef.value;
    if (!grainCoolingStore) {
      return;
    }
    const show = getShow();
    const task = getGrainCoolingTaskFromDemoState(demoState) ?? getTaskResolved();
    const future = taskScheduledForFuture.value;
    if (!show || !task) {
      return;
    }
    if (future || isHotMode.value) {
      return;
    }
    if (!grainCoolingStore.autoOpenPendingAfterTaskModal) {
      return;
    }
    if (task.id !== task_grain_cooling.id) {
      return;
    }
    if (typeof task_grain_cooling.lastProblemAppliedMeasurementIndex === "number") {
      task_grain_cooling.lastProblemAppliedMeasurementIndex = null;
      grainCoolingStore.clearAutoOpenPendingAfterTaskModal();
      return;
    }
    const measurements = Array.isArray(task.measurements) ? task.measurements : [];
    const lockedIdx = task_grain_cooling.measurementIndex;
    let pendingItem = null;
    if (typeof lockedIdx === "number" && lockedIdx >= 0 && lockedIdx < measurements.length) {
      const row = measurements[lockedIdx];
      if ((row == null ? void 0 : row.status) === "pending") {
        pendingItem = row;
      }
    }
    if (!pendingItem) {
      const firstIdx = measurements.findIndex((m) => (m == null ? void 0 : m.status) === "pending");
      pendingItem = firstIdx >= 0 ? measurements[firstIdx] : null;
    }
    grainCoolingStore.clearAutoOpenPendingAfterTaskModal();
    if (!pendingItem) {
      return;
    }
    await onOpenPending(
      pendingItem,
      "авто: autoOpenPendingAfterTaskModal (после диплинка из тоста)"
    );
  }
  function getGrainCoolingAutoOpenWatchSources() {
    const g = grainCoolingStoreRef.value;
    return [
      task_grain_cooling.scenarioProcessAllowed,
      task_grain_cooling.lastProblemAppliedMeasurementIndex,
      task_grain_cooling.measurementIndex,
      getShow(),
      getTask(),
      getGrainCoolingTaskFromDemoState(demoState),
      taskScheduledForFuture.value,
      isHotMode.value,
      g,
      g == null ? void 0 : g.autoOpenPendingAfterTaskModal
    ];
  }
  watch(
    getGrainCoolingAutoOpenWatchSources,
    () => {
      if (!task_grain_cooling.scenarioProcessAllowed) {
        return;
      }
      void tryAutoOpenPendingDrawerAfterDeepLink();
    },
    { flush: "post", immediate: true }
  );
  return {
    onOpenPending,
    tryAutoOpenPendingDrawerAfterDeepLink
  };
}
function useGrainCoolingShowTaskModalViewTask(props, demoStateRef) {
  return computed(() => {
    const p = props.task;
    if (!(p == null ? void 0 : p.id) || p.id !== task_grain_cooling.id) {
      return p;
    }
    return getGrainCoolingTaskFromDemoState(demoStateRef) ?? p;
  });
}
const _sfc_main$b = /* @__PURE__ */ Object.assign({ name: "ShowTaskModal" }, {
  __name: "ShowTaskModal",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      required: true
    },
    task: {
      type: Object,
      default: null
    },
    taskType: {
      type: String,
      default: "ccp"
    },
    staff: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: "checklists"
    }
  },
  emits: ["close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const { t: tr } = useI18n();
    const props = __props;
    const emit = __emit;
    const expandedActionRowKey = ref(null);
    const pendingDrawerRef = ref(null);
    const { demoState } = useDemoState();
    const viewTask = useGrainCoolingShowTaskModalViewTask(props, demoState);
    const isHotMode = computed(() => props.mode === "hot");
    const startOfTodayTs = () => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };
    const isTaskScheduledForFutureCheck = (task) => typeof (task == null ? void 0 : task.startDate) === "number" && Number.isFinite(task.startDate) && task.startDate > startOfTodayTs();
    const taskScheduledForFuture = computed(
      () => viewTask.value ? isTaskScheduledForFutureCheck(viewTask.value) : false
    );
    const { onOpenPending, tryAutoOpenPendingDrawerAfterDeepLink } = useGrainCoolingShowTaskModalBridge({
      getShow: () => props.show,
      getTask: () => viewTask.value,
      taskScheduledForFuture,
      isHotMode,
      pendingDrawerRef
    });
    const modalTargetsLine = computed(() => {
      const t = viewTask.value ?? null;
      if (!t) {
        return "";
      }
      if (t.taskScopeType === "equipment") {
        const s = equipmentTargetsSummary(t.equipmentTargetIds);
        return s || "";
      }
      if (t.taskScopeType === "rooms") {
        const ids = normalizeRoomTargetIds(t.roomTargetIds);
        if (!ids.length) {
          return "";
        }
        const roomLabelById = new Map(
          ROOM_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label]))
        );
        return ids.map((id) => roomLabelById.get(id) ?? id).join(", ");
      }
      return "";
    });
    const taskFieldSummaryLines = computed(() => {
      const t = viewTask.value;
      if (!t) {
        return [];
      }
      return normalizeTaskFieldDefinitions(t.taskFieldDefinitions).map((def) => {
        var _a;
        if ((def == null ? void 0 : def.fieldType) === TASK_FIELD_TYPE.TICKET) {
          const description = String(((_a = def == null ? void 0 : def.config) == null ? void 0 : _a.description) ?? "").trim();
          return tr("demo.show_task_modal.ticket_label", { description: description || "—" });
        }
        return formatTaskFieldSummaryLine(def);
      });
    });
    const NICHE_LABEL_KEYS = { coffee: "niche_coffee", bakery: "niche_bakery", meat: "niche_meat" };
    const NICHE_EMOJI = {
      coffee: "☕",
      bakery: "🥐",
      meat: "🥩"
    };
    const taskTypeDisplay = computed(
      () => NICHE_EMOJI[props.taskType] ?? props.taskType
    );
    const taskTypeAria = computed(() => {
      const key = NICHE_LABEL_KEYS[props.taskType];
      return key ? tr(`demo.show_task_modal.${key}`) : props.taskType;
    });
    const showModel = computed({
      get: () => props.show,
      set: (value) => {
        if (!value) {
          emit("close");
        }
      }
    });
    const applyDefaultCorrectiveActions = (task) => {
      var _a, _b;
      const first = (_a = task == null ? void 0 : task.correctiveActions) == null ? void 0 : _a[0];
      if (!first || !((_b = task == null ? void 0 : task.measurements) == null ? void 0 : _b.length)) {
        return;
      }
      for (const m of task.measurements) {
        if (m.status !== "problem") {
          continue;
        }
        if (m.correctiveAction != null && m.correctiveAction !== "") {
          continue;
        }
        m.correctiveAction = first;
      }
    };
    watch(
      () => [props.show, viewTask.value],
      ([show, task]) => {
        if (show && task) {
          applyDefaultCorrectiveActions(task);
        }
      },
      { immediate: true }
    );
    const onVisibilityChange = (visible) => {
      if (!visible) {
        expandedActionRowKey.value = null;
        emit("close");
      }
    };
    const closeModal = () => {
      expandedActionRowKey.value = null;
      emit("close");
    };
    const refreshTaskState = () => {
      var _a, _b;
      const task = viewTask.value;
      if (!task || typeof task !== "object") {
        return;
      }
      const currentRows = Array.isArray(task.measurements) ? task.measurements : [];
      const times = currentRows.map((m) => String((m == null ? void 0 : m.time) ?? "").trim()).filter(Boolean);
      task.measurements = times.map((time) => ({
        time,
        value: "-",
        status: "pending",
        aiWarning: null,
        correctiveAction: null,
        comment: null
      }));
      task.status = false;
      expandedActionRowKey.value = null;
      (_b = (_a = pendingDrawerRef.value) == null ? void 0 : _a.close) == null ? void 0 : _b.call(_a);
    };
    function onFooterRefreshClick() {
      refreshTaskState();
    }
    function onFooterCloseClick() {
      closeModal();
    }
    __expose({
      tryAutoOpenPendingDrawerAfterDeepLink
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NModal), mergeProps({
        show: showModel.value,
        "onUpdate:show": [($event) => showModel.value = $event, onVisibilityChange],
        preset: "card",
        class: "checklist-modal",
        "content-scrollable": "",
        style: { width: "800px", maxWidth: "calc(100vw - 32px)" },
        segmented: { content: true, footer: true }
      }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(ssrRenderComponent(CompleteTaskModalHeader, {
              "has-task": Boolean(unref(viewTask)),
              "task-title": ((_a = unref(viewTask)) == null ? void 0 : _a.title) ?? "",
              "task-type-display": taskTypeDisplay.value,
              "task-type-aria": taskTypeAria.value
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(CompleteTaskModalHeader, {
                "has-task": Boolean(unref(viewTask)),
                "task-title": ((_b = unref(viewTask)) == null ? void 0 : _b.title) ?? "",
                "task-type-display": taskTypeDisplay.value,
                "task-type-aria": taskTypeAria.value
              }, null, 8, ["has-task", "task-title", "task-type-display", "task-type-aria"])
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="checklist-modal__footer" data-v-dfc19919${_scopeId}>`);
            if (!isHotMode.value && unref(viewTask)) {
              _push2(ssrRenderComponent(unref(Button), {
                type: "warning",
                size: "large",
                onClick: onFooterRefreshClick
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(tr)("demo.show_task_modal.refresh"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(tr)("demo.show_task_modal.refresh")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<div data-v-dfc19919${_scopeId}></div>`);
            }
            _push2(ssrRenderComponent(unref(Button), {
              size: "large",
              type: "info",
              onClick: onFooterCloseClick
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(tr)("demo.show_task_modal.close"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(tr)("demo.show_task_modal.close")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "checklist-modal__footer" }, [
                !isHotMode.value && unref(viewTask) ? (openBlock(), createBlock(unref(Button), {
                  key: 0,
                  type: "warning",
                  size: "large",
                  onClick: onFooterRefreshClick
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(tr)("demo.show_task_modal.refresh")), 1)
                  ]),
                  _: 1
                })) : (openBlock(), createBlock("div", { key: 1 })),
                createVNode(unref(Button), {
                  size: "large",
                  type: "info",
                  onClick: onFooterCloseClick
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(tr)("demo.show_task_modal.close")), 1)
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(viewTask)) {
              _push2(`<div class="checklist-modal__content" data-v-dfc19919${_scopeId}>`);
              _push2(ssrRenderComponent(TaskAssigneeSection, {
                task: unref(viewTask),
                staff: __props.staff,
                mode: __props.mode,
                "task-type": __props.taskType,
                "modal-show": __props.show
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(TaskTargetsLine, {
                "task-scope-type": unref(viewTask).taskScopeType,
                "targets-line": modalTargetsLine.value
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(TaskFieldSummarySection, { lines: taskFieldSummaryLines.value }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(TaskMeasurementsTable, {
                task: unref(viewTask),
                "is-hot-mode": isHotMode.value,
                "task-scheduled-for-future": taskScheduledForFuture.value,
                "expanded-action-row-key": expandedActionRowKey.value,
                "onUpdate:expandedActionRowKey": ($event) => expandedActionRowKey.value = $event,
                onOpenPending: (row) => unref(onOpenPending)(row, "click: pending badge in Status column")
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(TaskExecutionPanelModal, {
              ref_key: "pendingDrawerRef",
              ref: pendingDrawerRef,
              task: unref(viewTask)
            }, null, _parent2, _scopeId));
          } else {
            return [
              unref(viewTask) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "checklist-modal__content"
              }, [
                createVNode(TaskAssigneeSection, {
                  task: unref(viewTask),
                  staff: __props.staff,
                  mode: __props.mode,
                  "task-type": __props.taskType,
                  "modal-show": __props.show
                }, null, 8, ["task", "staff", "mode", "task-type", "modal-show"]),
                createVNode(TaskTargetsLine, {
                  "task-scope-type": unref(viewTask).taskScopeType,
                  "targets-line": modalTargetsLine.value
                }, null, 8, ["task-scope-type", "targets-line"]),
                createVNode(TaskFieldSummarySection, { lines: taskFieldSummaryLines.value }, null, 8, ["lines"]),
                createVNode(TaskMeasurementsTable, {
                  task: unref(viewTask),
                  "is-hot-mode": isHotMode.value,
                  "task-scheduled-for-future": taskScheduledForFuture.value,
                  "expanded-action-row-key": expandedActionRowKey.value,
                  "onUpdate:expandedActionRowKey": ($event) => expandedActionRowKey.value = $event,
                  onOpenPending: (row) => unref(onOpenPending)(row, "click: pending badge in Status column")
                }, null, 8, ["task", "is-hot-mode", "task-scheduled-for-future", "expanded-action-row-key", "onUpdate:expandedActionRowKey", "onOpenPending"])
              ])) : createCommentVNode("", true),
              createVNode(TaskExecutionPanelModal, {
                ref_key: "pendingDrawerRef",
                ref: pendingDrawerRef,
                task: unref(viewTask)
              }, null, 8, ["task"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/show_task/ShowTaskModal.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const ShowTaskModal = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-dfc19919"]]);
const _sfc_main$a = /* @__PURE__ */ Object.assign({ name: "TaskCard" }, {
  __name: "TaskCard",
  __ssrInlineRender: true,
  props: {
    task: { type: Object, required: true },
    staff: { type: Array, default: () => [] },
    mode: {
      type: String,
      default: "checklists"
    },
    showDeleteAction: { type: Boolean, default: false },
    showNicheIcon: { type: Boolean, default: false }
  },
  emits: ["select", "remove"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const props = __props;
    const emit = __emit;
    const NICHE_LABEL_KEYS = { coffee: "niche_coffee", bakery: "niche_bakery", meat: "niche_meat" };
    const NICHE_EMOJI = {
      coffee: "☕",
      bakery: "🥐",
      meat: "🥩"
    };
    const isHotMode = computed(() => props.mode === "hot");
    const hasMultipleRepeatSlots = computed(() => {
      var _a;
      const n = Array.isArray((_a = props.task) == null ? void 0 : _a.repeatTimes) ? props.task.repeatTimes.length : 0;
      return n > 1;
    });
    const borderClass = computed(() => {
      if (hasMultipleRepeatSlots.value) {
        return "ccp-card--repeat";
      }
      return "ccp-card--ok";
    });
    const showRepeatLines = computed(
      () => {
        var _a;
        if (!Array.isArray((_a = props.task) == null ? void 0 : _a.measurements)) {
          return false;
        }
        return isHotMode.value ? props.task.measurements.length > 1 : props.task.measurements.length > 0;
      }
    );
    const startOfTodayTs = () => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };
    const formatEuDate = (ts) => new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(ts));
    const scheduledLine = computed(() => {
      var _a;
      const startDate = (_a = props.task) == null ? void 0 : _a.startDate;
      const isFuture = typeof startDate === "number" && Number.isFinite(startDate) && startDate > startOfTodayTs();
      return isFuture ? t("demo.task_card.scheduled_from", { date: formatEuDate(startDate) }) : "";
    });
    const assigneeDisplay = computed(() => {
      var _a;
      const id = (_a = props.task) == null ? void 0 : _a.assignedStaffId;
      if (!id) {
        return "";
      }
      const name = resolveStaffFullName(props.staff, id);
      return name === "—" ? "" : name;
    });
    const assigneeEmptyText = computed(() => isHotMode.value ? "—" : t("demo.task_card.assignee_empty"));
    const normalizedScopeType = computed(
      () => {
        var _a;
        return normalizeTaskScopeType((_a = props.task) == null ? void 0 : _a.taskScopeType);
      }
    );
    const targetsLine = computed(() => {
      var _a, _b;
      if (normalizedScopeType.value === TASK_SCOPE_TYPE.EQUIPMENT) {
        const s = equipmentTargetsSummary((_a = props.task) == null ? void 0 : _a.equipmentTargetIds);
        return s || "";
      }
      if (normalizedScopeType.value === TASK_SCOPE_TYPE.ROOMS) {
        const s = roomTargetsSummary((_b = props.task) == null ? void 0 : _b.roomTargetIds);
        return s || "";
      }
      return "";
    });
    const pendingTime = computed(() => firstPendingMeasurementTime(props.task));
    const nicheEmoji = computed(() => {
      var _a;
      const type = (_a = props.task) == null ? void 0 : _a.type;
      return type ? NICHE_EMOJI[type] ?? "" : "";
    });
    const nicheAria = computed(() => {
      var _a;
      const type = (_a = props.task) == null ? void 0 : _a.type;
      const key = NICHE_LABEL_KEYS[type];
      return key ? t(`demo.task_card.${key}`) : String(type);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: ["task-card ccp-card", [
          borderClass.value,
          { "task-card--hot": isHotMode.value },
          isHotMode.value ? "hot-task-row" : "",
          isHotMode.value ? `hot-task-row--${__props.task.status}` : ""
        ]],
        "data-task-id": __props.task.id
      }, _attrs))} data-v-3c3e92fe>`);
      if (__props.showDeleteAction) {
        _push(`<div class="ccp-card__actions" data-v-3c3e92fe>`);
        _push(ssrRenderComponent(unref(NPopconfirm), {
          "positive-text": unref(t)("demo.task_card.delete"),
          "negative-text": unref(t)("demo.task_card.cancel"),
          "positive-button-props": { type: "info" },
          "negative-button-props": { type: "warning" },
          onPositiveClick: ($event) => emit("remove", __props.task.id)
        }, {
          trigger: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Button), {
                quaternary: "",
                size: "tiny",
                type: "error",
                class: "ccp-card__delete-btn",
                "aria-label": unref(t)("demo.task_card.delete_aria")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$o, {
                      name: "delete-forever-twotone",
                      class: "ccp-card__delete-btn-icon",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$o, {
                        name: "delete-forever-twotone",
                        class: "ccp-card__delete-btn-icon",
                        "aria-hidden": "true"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Button), {
                  quaternary: "",
                  size: "tiny",
                  type: "error",
                  class: "ccp-card__delete-btn",
                  "aria-label": unref(t)("demo.task_card.delete_aria")
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$o, {
                      name: "delete-forever-twotone",
                      class: "ccp-card__delete-btn-icon",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ${ssrInterpolate(unref(t)("demo.task_card.delete_confirm"))}`);
            } else {
              return [
                createTextVNode(" " + toDisplayString(unref(t)("demo.task_card.delete_confirm")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showRepeatLines.value) {
        _push(`<span class="${ssrRenderClass([{ "hot-task-row__repeat-lines": isHotMode.value }, "ccp-card__repeat-lines"])}" aria-hidden="true" data-v-3c3e92fe><!--[-->`);
        ssrRenderList(__props.task.measurements, (item) => {
          _push(`<span class="${ssrRenderClass([
            [
              isHotMode.value ? "hot-task-row__repeat-line" : "",
              item.status === "success" ? "ccp-card__repeat-line--ok" : item.status === "pending" ? "ccp-card__repeat-line--pending" : "ccp-card__repeat-line--alert",
              item.status === "success" ? isHotMode.value ? "hot-task-row__repeat-line--ok" : "" : item.status === "pending" ? isHotMode.value ? "hot-task-row__repeat-line--pending" : "" : isHotMode.value ? "hot-task-row__repeat-line--alert" : ""
            ],
            "ccp-card__repeat-line"
          ])}" data-v-3c3e92fe></span>`);
        });
        _push(`<!--]--></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="ccp-card__head" data-v-3c3e92fe>`);
      if (scheduledLine.value) {
        _push(`<p class="ccp-card__scheduled-line" data-v-3c3e92fe>${ssrInterpolate(scheduledLine.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{
        "ccp-card__title--hot": isHotMode.value,
        "hot-task-row__top": isHotMode.value,
        "hot-task-row__top--with-repeat": isHotMode.value && showRepeatLines.value
      }, "ccp-card__title"])}" data-v-3c3e92fe><span class="${ssrRenderClass([{ "hot-task-row__title": isHotMode.value }, "ccp-card__title-text"])}" data-v-3c3e92fe>${ssrInterpolate(__props.task.title)}</span>`);
      if (__props.showNicheIcon && nicheEmoji.value) {
        _push(`<span class="${ssrRenderClass([{ "hot-task-row__niche": isHotMode.value }, "ccp-card__niche"])}" role="img"${ssrRenderAttr("aria-label", nicheAria.value)} data-v-3c3e92fe>${ssrInterpolate(nicheEmoji.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><p class="${ssrRenderClass([{
        "ccp-card__assignee--empty": !assigneeDisplay.value,
        "hot-task-row__assignee": isHotMode.value,
        "hot-task-row__assignee--empty": isHotMode.value && !assigneeDisplay.value
      }, "ccp-card__assignee"])}" data-v-3c3e92fe>${ssrInterpolate(unref(t)("demo.task_card.assignee_label"))} ${ssrInterpolate(assigneeDisplay.value || assigneeEmptyText.value)}</p>`);
      if (targetsLine.value) {
        _push(`<p class="${ssrRenderClass([{ "hot-task-row__targets": isHotMode.value }, "ccp-card__model-summary"])}" data-v-3c3e92fe>`);
        if (normalizedScopeType.value === unref(TASK_SCOPE_TYPE).EQUIPMENT) {
          _push(ssrRenderComponent(_sfc_main$o, {
            name: "battery-charging-90-round",
            class: ["ccp-card__targets-icon", { "hot-task-row__targets-icon": isHotMode.value, equipment: isHotMode.value }],
            "aria-hidden": "true"
          }, null, _parent));
        } else if (normalizedScopeType.value === unref(TASK_SCOPE_TYPE).ROOMS) {
          _push(ssrRenderComponent(_sfc_main$o, {
            name: "account-balance-twotone",
            class: ["ccp-card__targets-icon room", { "hot-task-row__targets-icon": isHotMode.value }],
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="${ssrRenderClass([{ "hot-task-row__targets-text": isHotMode.value }, "ccp-card__model-summary-text"])}" data-v-3c3e92fe>${ssrInterpolate(targetsLine.value)}</span></p>`);
      } else {
        _push(`<!---->`);
      }
      if (pendingTime.value) {
        _push(`<p class="${ssrRenderClass([{ "hot-task-row__value": isHotMode.value }, "ccp-card__value"])}" data-v-3c3e92fe>${ssrInterpolate(pendingTime.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/sections/TaskCard.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const TaskCard = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-3c3e92fe"]]);
const _sfc_main$9 = /* @__PURE__ */ Object.assign({ name: "DashboardSection" }, {
  __name: "DashboardSection",
  __ssrInlineRender: true,
  props: {
    metrics: {
      type: Object,
      required: true
    },
    hotTasks: {
      type: Array,
      required: true
    },
    checklistsByNiche: {
      type: Object,
      required: true
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const checklistsDemoRoute = computed(() => `/${useCurrentLocale()}/demo/checklists`);
    const props = __props;
    const isTaskModalOpen = ref(false);
    const selectedTaskId = ref(null);
    const selectedNiche = ref(null);
    const selectedTask = computed(() => {
      var _a;
      const id = selectedTaskId.value;
      const niche = selectedNiche.value;
      if (id == null || niche == null || niche === "") {
        return null;
      }
      const list = ((_a = props.checklistsByNiche) == null ? void 0 : _a[niche]) ?? [];
      return list.find((t2) => t2.id === id) ?? null;
    });
    const openTaskModal = (task) => {
      selectedTaskId.value = task.id;
      selectedNiche.value = task.type;
      isTaskModalOpen.value = true;
    };
    const closeTaskModal = () => {
      isTaskModalOpen.value = false;
      selectedTaskId.value = null;
      selectedNiche.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-section" }, _attrs))} data-v-37c7b14c><div class="dashboard-metrics" data-v-37c7b14c><article class="metric-card" data-v-37c7b14c><p class="metric-card__label metric-card__label--success" data-v-37c7b14c>${ssrInterpolate(unref(t)("demo.dashboard.completed"))}</p><p class="metric-card__value" data-v-37c7b14c>${ssrInterpolate(__props.metrics.tasksDone)}/${ssrInterpolate(__props.metrics.tasksTotal)}</p></article><article class="metric-card metric-card--success" data-v-37c7b14c><p class="metric-card__label" data-v-37c7b14c>${ssrInterpolate(unref(t)("demo.dashboard.compliance"))}</p><p class="metric-card__value" data-v-37c7b14c>${ssrInterpolate(__props.metrics.compliance)}%</p></article><article class="metric-card metric-card--danger" data-v-37c7b14c><p class="metric-card__label" data-v-37c7b14c>${ssrInterpolate(unref(t)("demo.dashboard.critical_ccp"))}</p><p class="metric-card__value" data-v-37c7b14c>${ssrInterpolate(__props.metrics.criticalCount)}</p></article><article class="metric-card metric-card--warn" data-v-37c7b14c><p class="metric-card__label" data-v-37c7b14c>${ssrInterpolate(unref(t)("demo.dashboard.no_assignee"))}</p><p class="metric-card__value" data-v-37c7b14c>${ssrInterpolate(__props.metrics.tasksWithoutAssignee ?? 0)}</p></article><article class="metric-card" data-v-37c7b14c><p class="metric-card__label" data-v-37c7b14c>${ssrInterpolate(unref(t)("demo.dashboard.inspection"))}</p><p class="metric-card__value" data-v-37c7b14c>${ssrInterpolate(__props.metrics.inspectionDate)}</p></article></div><div class="hot-tasks" data-v-37c7b14c><div class="hot-tasks__header" data-v-37c7b14c><h2 class="hot-tasks__title" data-v-37c7b14c>${ssrInterpolate(unref(t)("demo.dashboard.hot_tasks"))}</h2></div><div class="hot-tasks__list" data-v-37c7b14c><!--[-->`);
      ssrRenderList(__props.hotTasks, (task) => {
        _push(ssrRenderComponent(TaskCard, {
          key: task.id,
          task,
          staff: __props.staff,
          mode: "hot",
          "show-niche-icon": true,
          onSelect: openTaskModal
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "dashboard-section__checklists-cta",
        href: checklistsDemoRoute.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.dashboard.checklists"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.dashboard.checklists")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (isTaskModalOpen.value) {
        _push(ssrRenderComponent(ShowTaskModal, {
          show: isTaskModalOpen.value,
          task: selectedTask.value,
          "task-type": selectedNiche.value ?? "coffee",
          staff: __props.staff,
          mode: "hot",
          onClose: closeTaskModal
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/sections/DashboardSection.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const DashboardSection = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-37c7b14c"]]);
const _sfc_main$8 = /* @__PURE__ */ Object.assign({ name: "ChecklistTaskFieldsSection" }, {
  __name: "ChecklistTaskFieldsSection",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    taskFieldTypeOptions: {
      type: [Array, Function],
      default: () => TASK_FIELD_TYPE_OPTIONS
    }
  }, {
    "modelValue": { type: Array, default: () => [] },
    "modelModifiers": {},
    "correctiveActionRows": {
      type: Array,
      default: () => []
    },
    "correctiveActionRowsModifiers": {}
  }),
  emits: ["update:modelValue", "update:correctiveActionRows"],
  setup(__props) {
    const { t } = useI18n();
    const props = __props;
    const model = useModel(__props, "modelValue");
    const taskFieldTypeOptions = computed(() => {
      const raw = props.taskFieldTypeOptions;
      const resolved = typeof raw === "function" ? raw() : raw;
      return Array.isArray(resolved) ? resolved : typeof TASK_FIELD_TYPE_OPTIONS === "function" ? TASK_FIELD_TYPE_OPTIONS() : TASK_FIELD_TYPE_OPTIONS;
    });
    const hasSelectedTaskFieldType = computed(
      () => Array.isArray(model.value) && model.value.some(
        (row) => Boolean(row == null ? void 0 : row.fieldType) && row.fieldType !== TASK_FIELD_TYPE.SINGLE_CHOICE
      )
    );
    const correctiveActionRows = useModel(__props, "correctiveActionRows");
    const addExceptionRow = () => {
      if (correctiveActionRows.value.length >= 30) {
        return;
      }
      correctiveActionRows.value = [
        ...correctiveActionRows.value,
        { id: v4(), text: "" }
      ];
    };
    const removeExceptionRow = (index) => {
      const next = [...correctiveActionRows.value];
      next.splice(index, 1);
      correctiveActionRows.value = next;
    };
    const onFieldTypeChange = (row, value) => {
      row.fieldType = value ?? null;
      row.config = value ? defaultConfigForFieldType(value) : {};
    };
    const removeRow = (index) => {
      model.value.splice(index, 1);
    };
    const addRow = () => {
      if (model.value.length >= 1) {
        return;
      }
      model.value.push(createEmptyTaskFieldRow());
    };
    const updateSingleChoiceOption = (row, optionIndex, value) => {
      if (!Array.isArray(row.config.options)) {
        row.config.options = [""];
      }
      row.config.options[optionIndex] = String(value ?? "");
    };
    const addSingleChoiceOption = (row) => {
      if (!Array.isArray(row.config.options)) {
        row.config.options = [""];
      }
      row.config.options = [...row.config.options, ""];
    };
    const removeSingleChoiceOption = (row, optionIndex) => {
      if (!Array.isArray(row.config.options) || row.config.options.length <= 1) {
        return;
      }
      const next = [...row.config.options];
      next.splice(optionIndex, 1);
      row.config.options = next.length ? next : [""];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "task-fields-section" }, _attrs))} data-v-7d34599d><p class="task-fields-section__title" data-v-7d34599d>${ssrInterpolate(unref(t)("demo.task_fields.section_title"))}</p><p class="task-fields-section__lead" data-v-7d34599d>${ssrInterpolate(unref(t)("demo.task_fields.section_lead"))}</p><!--[-->`);
      ssrRenderList(model.value, (row, index) => {
        _push(`<div class="task-fields-section__row"${ssrRenderAttr("data-field-row-index", index)} data-v-7d34599d><div class="task-fields-section__row-head" data-v-7d34599d>`);
        _push(ssrRenderComponent(unref(NSelect), {
          value: row.fieldType,
          options: taskFieldTypeOptions.value,
          placeholder: unref(t)("demo.task_fields.field_type_placeholder"),
          clearable: "",
          class: "task-fields-section__type-select",
          size: "large",
          "onUpdate:value": (v) => onFieldTypeChange(row, v)
        }, null, _parent));
        _push(ssrRenderComponent(unref(Button), {
          type: "error",
          size: "large",
          onClick: ($event) => removeRow(index)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("demo.task_fields.delete"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("demo.task_fields.delete")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
        if (row.fieldType) {
          _push(`<div class="task-fields-section__panel" data-v-7d34599d>`);
          if (row.fieldType === unref(TASK_FIELD_TYPE).TEMPERATURE) {
            _push(`<div class="task-fields-section__temp-row" data-v-7d34599d>`);
            _push(ssrRenderComponent(unref(NFormItem), {
              required: "",
              label: unref(t)("demo.task_fields.min_c"),
              "show-feedback": false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(NInputNumber), {
                    value: row.config.minC,
                    "onUpdate:value": ($event) => row.config.minC = $event,
                    "show-button": false,
                    clearable: "",
                    size: "large",
                    placeholder: "—"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(unref(NInputNumber), {
                      value: row.config.minC,
                      "onUpdate:value": ($event) => row.config.minC = $event,
                      "show-button": false,
                      clearable: "",
                      size: "large",
                      placeholder: "—"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(ssrRenderComponent(unref(NFormItem), {
              required: "",
              label: unref(t)("demo.task_fields.max_c"),
              "show-feedback": false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(NInputNumber), {
                    value: row.config.maxC,
                    "onUpdate:value": ($event) => row.config.maxC = $event,
                    "show-button": false,
                    clearable: "",
                    size: "large",
                    placeholder: "—"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(unref(NInputNumber), {
                      value: row.config.maxC,
                      "onUpdate:value": ($event) => row.config.maxC = $event,
                      "show-button": false,
                      clearable: "",
                      size: "large",
                      placeholder: "—"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else if (row.fieldType === unref(TASK_FIELD_TYPE).SINGLE_CHOICE) {
            _push(`<!--[--><div class="task-fields-section__single-choice-row" data-v-7d34599d>`);
            _push(ssrRenderComponent(unref(NFormItem), {
              required: "",
              label: unref(t)("demo.task_fields.question"),
              "show-feedback": false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(NInput), {
                    value: row.config.question,
                    "onUpdate:value": ($event) => row.config.question = $event,
                    placeholder: unref(t)("demo.task_fields.question_placeholder"),
                    size: "large"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(unref(NInput), {
                      value: row.config.question,
                      "onUpdate:value": ($event) => row.config.question = $event,
                      placeholder: unref(t)("demo.task_fields.question_placeholder"),
                      size: "large"
                    }, null, 8, ["value", "onUpdate:value", "placeholder"])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div><!--[-->`);
            ssrRenderList(row.config.options, (option, optionIndex) => {
              _push(`<div class="task-fields-section__single-choice-row" data-v-7d34599d>`);
              _push(ssrRenderComponent(unref(NFormItem), {
                required: "",
                label: unref(t)("demo.task_fields.answer"),
                "show-feedback": false
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(ssrRenderComponent(unref(NInput), {
                      value: option,
                      placeholder: unref(t)("demo.task_fields.answer_placeholder"),
                      size: "large",
                      "onUpdate:value": (value) => updateSingleChoiceOption(row, optionIndex, value)
                    }, null, _parent2, _scopeId));
                  } else {
                    return [
                      createVNode(unref(NInput), {
                        value: option,
                        placeholder: unref(t)("demo.task_fields.answer_placeholder"),
                        size: "large",
                        "onUpdate:value": (value) => updateSingleChoiceOption(row, optionIndex, value)
                      }, null, 8, ["value", "placeholder", "onUpdate:value"])
                    ];
                  }
                }),
                _: 2
              }, _parent));
              if (row.config.options.length > 1) {
                _push(ssrRenderComponent(unref(Button), {
                  type: "error",
                  "attr-type": "button",
                  size: "large",
                  onClick: ($event) => removeSingleChoiceOption(row, optionIndex)
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(unref(t)("demo.task_fields.delete"))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(t)("demo.task_fields.delete")), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]-->`);
            _push(ssrRenderComponent(unref(Button), {
              type: "primary",
              "attr-type": "button",
              size: "large",
              onClick: ($event) => addSingleChoiceOption(row)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(t)("demo.task_fields.add_option"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("demo.task_fields.add_option")), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<!--]-->`);
          } else if (row.fieldType === unref(TASK_FIELD_TYPE).TICKET) {
            _push(`<!--[--><p class="task-fields-section__hint" data-v-7d34599d>${ssrInterpolate(unref(t)("demo.task_fields.ticket_hint"))}</p>`);
            _push(ssrRenderComponent(unref(NFormItem), {
              required: "",
              label: unref(t)("demo.task_fields.ticket_description"),
              "show-feedback": false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(NInput), {
                    value: row.config.description,
                    "onUpdate:value": ($event) => row.config.description = $event,
                    type: "textarea",
                    autosize: { minRows: 2, maxRows: 5 },
                    placeholder: unref(t)("demo.task_fields.ticket_placeholder")
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(unref(NInput), {
                      value: row.config.description,
                      "onUpdate:value": ($event) => row.config.description = $event,
                      type: "textarea",
                      autosize: { minRows: 2, maxRows: 5 },
                      placeholder: unref(t)("demo.task_fields.ticket_placeholder")
                    }, null, 8, ["value", "onUpdate:value", "placeholder"])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (model.value.length === 0) {
        _push(ssrRenderComponent(unref(Button), {
          type: "primary",
          class: "task-fields-section__add",
          size: "large",
          onClick: addRow
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("demo.task_fields.add_field"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("demo.task_fields.add_field")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (hasSelectedTaskFieldType.value) {
        _push(`<div class="task-fields-section__exception-block" data-v-7d34599d><p class="task-fields-section__exception-block__title" data-v-7d34599d>${ssrInterpolate(unref(t)("demo.task_fields.exceptions_title"))}</p><p class="task-fields-section__exception-block__lead" data-v-7d34599d>${ssrInterpolate(unref(t)("demo.task_fields.exceptions_lead"))}</p><!--[-->`);
        ssrRenderList(correctiveActionRows.value, (row, index) => {
          _push(`<div class="task-fields-section__exception-block__row" data-v-7d34599d>`);
          _push(ssrRenderComponent(unref(NInput), {
            value: row.text,
            "onUpdate:value": ($event) => row.text = $event,
            type: "text",
            size: "large",
            placeholder: unref(t)("demo.task_fields.exception_placeholder")
          }, null, _parent));
          _push(ssrRenderComponent(unref(Button), {
            type: "error",
            class: "task-fields-section__exception-block__remove",
            size: "large",
            onClick: ($event) => removeExceptionRow(index)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("demo.task_fields.delete"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("demo.task_fields.delete")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        _push(ssrRenderComponent(unref(Button), {
          type: "primary",
          class: "task-fields-section__exception-block__add",
          size: "large",
          disabled: correctiveActionRows.value.length >= 30,
          onClick: addExceptionRow
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("demo.task_fields.add_exception"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("demo.task_fields.add_exception")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/checklist/ChecklistTaskFieldsSection.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const ChecklistTaskFieldsSection = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-7d34599d"]]);
const _sfc_main$7 = /* @__PURE__ */ Object.assign({ name: "CreateTaskModal" }, {
  __name: "CreateTaskModal",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    activeNiche: {
      type: String,
      required: true
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:show"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const props = __props;
    const emit = __emit;
    const addModalCardRootStyle = {
      display: "flex",
      flexDirection: "column",
      width: "min(600px, calc(100vw - 32px))",
      maxWidth: "calc(100vw - 32px)",
      maxHeight: "calc(100vh - 32px)",
      minHeight: 0,
      overflow: "hidden",
      boxSizing: "border-box"
    };
    const addModalCardContentStyle = {
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      minHeight: 0,
      minWidth: 0,
      overflow: "hidden",
      padding: "0"
    };
    const addModalBodyScrollStyle = {
      flex: "1 1 auto",
      minHeight: 0,
      overflowX: "hidden",
      overflowY: "auto"
    };
    const message = useMessage();
    const { addChecklistTask } = useDemoState();
    const taskScopeOptions = computed(() => [
      {
        value: TASK_SCOPE_TYPE.EQUIPMENT,
        label: t("demo.create_task.scope_equipment"),
        hint: t("demo.create_task.scope_equipment_hint")
      },
      {
        value: TASK_SCOPE_TYPE.ROOMS,
        label: t("demo.create_task.scope_rooms"),
        hint: t("demo.create_task.scope_rooms_hint")
      }
    ]);
    let activeValidationErrorElements = [];
    const ADD_WIZARD_STEPS = Object.freeze([1, 2]);
    const addWizardStep = ref(1);
    const WEEKDAY_OPTIONS = computed(() => [
      { value: "mon", short: t("demo.create_task.day_mon") },
      { value: "tue", short: t("demo.create_task.day_tue") },
      { value: "wed", short: t("demo.create_task.day_wed") },
      { value: "thu", short: t("demo.create_task.day_thu") },
      { value: "fri", short: t("demo.create_task.day_fri") },
      { value: "sat", short: t("demo.create_task.day_sat") },
      { value: "sun", short: t("demo.create_task.day_sun") }
    ]);
    const startOfTodayTimestamp = () => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };
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
    const addForm = reactive({
      ...createModalDraft("coffee", { startDate: startOfTodayTimestamp() }),
      scheduleSlotCount: 1
    });
    const equipmentGroupsForActiveNiche = computed(
      () => equipmentGroupsForChecklistNiche(props.activeNiche)
    );
    const equipmentGroupSelectOptions = computed(
      () => equipmentGroupsForActiveNiche.value.map((g) => ({
        label: g.groupTitle,
        value: g.groupTitle
      }))
    );
    const equipmentPickerGroupTitle = ref("");
    watch(
      () => equipmentGroupsForActiveNiche.value,
      (groups) => {
        if (!Array.isArray(groups) || !groups.length) {
          return;
        }
        const titles = new Set(groups.map((g) => g.groupTitle));
        if (!titles.has(equipmentPickerGroupTitle.value)) {
          equipmentPickerGroupTitle.value = groups[0].groupTitle;
        }
      },
      { deep: true, immediate: true }
    );
    const equipmentGroupForPicker = computed(() => {
      const groups = equipmentGroupsForActiveNiche.value;
      if (!groups.length) {
        return { groupTitle: "", items: [] };
      }
      const found = groups.find(
        (g) => g.groupTitle === equipmentPickerGroupTitle.value
      );
      return found ?? groups[0];
    });
    const normalizedScheduleSlotCount = computed(() => {
      const n = Number(addForm.scheduleSlotCount);
      if (!Number.isFinite(n)) {
        return 1;
      }
      return Math.max(1, Math.trunc(n));
    });
    const isSingleWeekdayFrequency = computed(
      () => addForm.frequency === FREQUENCY_CODE.WEEKLY
    );
    watch(
      () => equipmentPickerGroupTitle.value,
      () => {
        if (addForm.taskScopeType !== TASK_SCOPE_TYPE.EQUIPMENT) {
          return;
        }
        addForm.equipmentTargetIds = [];
      }
    );
    watch(
      () => addForm.taskScopeType,
      (scope) => {
        var _a;
        if (scope !== TASK_SCOPE_TYPE.EQUIPMENT) {
          addForm.equipmentTargetIds = [];
        }
        if (scope !== TASK_SCOPE_TYPE.ROOMS) {
          addForm.roomTargetIds = [];
        }
        if (scope === TASK_SCOPE_TYPE.EQUIPMENT) {
          const g = equipmentGroupsForChecklistNiche(props.activeNiche);
          equipmentPickerGroupTitle.value = ((_a = g[0]) == null ? void 0 : _a.groupTitle) ?? "";
        }
        const allowedFieldTypes = new Set(
          taskFieldTypeOptionsByScopeType(scope).map((o) => o.value)
        );
        addForm.taskFieldDefinitions = (Array.isArray(addForm.taskFieldDefinitions) ? addForm.taskFieldDefinitions : []).filter((row) => allowedFieldTypes.has(row == null ? void 0 : row.fieldType));
      }
    );
    watch(
      () => addForm.startDate,
      (value) => {
        if (value == null) {
          addForm.startDate = startOfTodayTimestamp();
        }
      }
    );
    watch(
      () => addForm.frequency,
      (frequency) => {
        if (frequency === FREQUENCY_CODE.DAILY) {
          addForm.scheduleSlotCount = 1;
        }
        if (isSingleWeekdayFrequency.value) {
          addForm.activeWeekdays = ["mon"];
          return;
        }
        if (frequency === FREQUENCY_CODE.CUSTOM || frequency === FREQUENCY_CODE.DAILY) {
          addForm.activeWeekdays = [...DEFAULT_TASK_ACTIVE_WEEKDAYS];
        }
      }
    );
    watch(
      () => normalizedScheduleSlotCount.value,
      (count) => {
        addForm.repeatTimes = buildRepeatTimesByCount(count);
      },
      { immediate: true }
    );
    watch(
      () => addForm.repeatTimes,
      (times) => {
        const generated = buildRepeatTimesByCount(
          normalizedScheduleSlotCount.value
        );
        const current = Array.isArray(times) ? [...times] : [];
        let changed = false;
        for (let i = 0; i < generated.length; i += 1) {
          const value = String(current[i] ?? "").trim();
          if (!/^\d{2}:\d{2}$/.test(value)) {
            current[i] = generated[i];
            changed = true;
          }
        }
        if (current.length !== generated.length) {
          current.length = generated.length;
          changed = true;
        }
        if (changed) {
          addForm.repeatTimes = current;
        }
      },
      { deep: true }
    );
    watch(
      () => addForm.equipmentTargetIds,
      (ids) => {
        if (addForm.taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT && normalizeEquipmentTargetIds(ids).length) {
          clearValidationErrorForElement(".checklists-equipment-block");
        }
      },
      { deep: true }
    );
    watch(
      () => addForm.roomTargetIds,
      (ids) => {
        if (addForm.taskScopeType === TASK_SCOPE_TYPE.ROOMS && normalizeRoomTargetIds(ids).length) {
          clearValidationErrorForElement(".checklists-equipment-block");
        }
      },
      { deep: true }
    );
    watch(
      () => addForm.assignedStaffId,
      (value) => {
        if (value != null && String(value).trim()) {
          clearValidationErrorForSelectorControls(
            ".checklists-add-form__assignee .n-base-selection--selected.checklists-validation-error-control"
          );
        }
      }
    );
    watch(
      () => addForm.taskFieldDefinitions,
      () => {
        clearValidationErrorForSelectorControls(
          ".task-fields-section .n-base-selection--selected.checklists-validation-error-control"
        );
      },
      { deep: true }
    );
    watch(
      () => addForm.correctiveActionRows,
      () => {
        clearValidationErrorForElement(".task-fields-section__exception-block");
      },
      { deep: true }
    );
    const isEquipmentOrRooms = computed(
      () => addForm.taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT || addForm.taskScopeType === TASK_SCOPE_TYPE.ROOMS
    );
    const taskFieldTypeOptionsForCurrentScope = computed(
      () => taskFieldTypeOptionsByScopeType(addForm.taskScopeType)
    );
    const assigneeSelectOptions = computed(() => {
      const sid = NICHE_TO_SITE_ID[props.activeNiche] ?? null;
      const list = Array.isArray(props.staff) ? props.staff : [];
      const filtered = sid ? list.filter((m) => m && m.siteId === sid && m.active !== false) : list.filter((m) => m && m.active !== false);
      return filtered.map((m) => ({
        label: `${m.fullName} — ${m.role}`,
        value: m.id
      }));
    });
    const frequencySelectOptions = computed(() => [
      { label: t("demo.create_task.freq_custom"), value: FREQUENCY_CODE.CUSTOM },
      { label: t("demo.create_task.freq_daily"), value: FREQUENCY_CODE.DAILY },
      { label: t("demo.create_task.freq_weekly"), value: FREQUENCY_CODE.WEEKLY }
    ]);
    const onUpdateShow = (value) => {
      emit("update:show", value);
    };
    const closeModal = () => {
      emit("update:show", false);
    };
    watch(
      () => props.show,
      (visible) => {
        if (visible) {
          resetAddForm();
        }
      }
    );
    watch(
      () => props.activeNiche,
      () => {
        var _a;
        if (!props.show) {
          return;
        }
        if (addForm.taskScopeType !== TASK_SCOPE_TYPE.EQUIPMENT) {
          return;
        }
        addForm.equipmentTargetIds = [];
        const g = equipmentGroupsForChecklistNiche(props.activeNiche);
        equipmentPickerGroupTitle.value = ((_a = g[0]) == null ? void 0 : _a.groupTitle) ?? "";
      }
    );
    const resetAddForm = () => {
      var _a;
      addWizardStep.value = 1;
      const g = equipmentGroupsForChecklistNiche(props.activeNiche);
      equipmentPickerGroupTitle.value = ((_a = g[0]) == null ? void 0 : _a.groupTitle) ?? "";
      Object.assign(addForm, {
        ...createModalDraft(props.activeNiche, {
          startDate: startOfTodayTimestamp()
        }),
        scheduleSlotCount: 1
      });
    };
    const addWizardStepAriaLabel = (stepId) => {
      if (addWizardStep.value > stepId) {
        return t("demo.create_task.step_done", { n: stepId });
      }
      if (addWizardStep.value === stepId) {
        return t("demo.create_task.step_current", { n: stepId });
      }
      return t("demo.create_task.step_unavailable", { n: stepId });
    };
    const onAddWizardStepClick = (stepId) => {
      if (stepId >= addWizardStep.value) {
        return;
      }
      addWizardStep.value = stepId;
    };
    const validateScheduleFields = () => {
      if (addForm.startDate == null) {
        scrollToModalField(".checklists-details-start-date");
        message.warning(t("demo.create_task.warn_start_date"));
        return false;
      }
      const slotCountValue = Number(addForm.scheduleSlotCount);
      if (!Number.isFinite(slotCountValue) || Math.trunc(slotCountValue) < 1) {
        scrollToModalField(".checklists-details-repeats-per-day");
        message.warning(t("demo.create_task.warn_repeats"));
        return false;
      }
      if (addForm.repeatTimes.length !== normalizedScheduleSlotCount.value || addForm.repeatTimes.some((time) => !String(time ?? "").trim())) {
        scrollToModalField(".checklists-repeat-times-block");
        message.warning(t("demo.create_task.warn_repeat_times"));
        return false;
      }
      clearValidationErrorMark();
      return true;
    };
    const clearValidationErrorMark = () => {
      if (!activeValidationErrorElements.length) {
        return;
      }
      activeValidationErrorElements.forEach(
        (el) => el.classList.remove("checklists-validation-error-control")
      );
      activeValidationErrorElements = [];
    };
    const clearValidationErrorForElement = (selector) => {
      const target = document.querySelector(selector);
      if (!target) {
        return;
      }
      target.classList.remove("checklists-validation-error-control");
      activeValidationErrorElements = activeValidationErrorElements.filter(
        (el) => el !== target
      );
    };
    const clearValidationErrorForSelectorControls = (selector) => {
      const controls = Array.from(document.querySelectorAll(selector));
      if (!controls.length) {
        return;
      }
      controls.forEach((el) => el.classList.remove("checklists-validation-error-control"));
      activeValidationErrorElements = activeValidationErrorElements.filter(
        (el) => !controls.includes(el)
      );
    };
    const scrollToModalField = (selector, highlightContainer = false) => {
      requestAnimationFrame(() => {
        const container = document.querySelector(".checklists-add-modal__body");
        const target = document.querySelector(selector);
        if (!container || !target) {
          return;
        }
        clearValidationErrorMark();
        const controls = highlightContainer ? [] : target.querySelectorAll(
          ".n-input, .n-base-selection, .n-time-picker, .n-date-picker, .n-input-number"
        );
        if (controls.length) {
          activeValidationErrorElements = Array.from(controls);
        } else {
          activeValidationErrorElements = [target];
        }
        activeValidationErrorElements.forEach(
          (el) => el.classList.add("checklists-validation-error-control")
        );
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const top = targetRect.top - containerRect.top + container.scrollTop - 12;
        container.scrollTo({
          top: Math.max(top, 0),
          behavior: "smooth"
        });
      });
    };
    const validateTaskFieldsSection = () => {
      const rows = Array.isArray(addForm.taskFieldDefinitions) ? addForm.taskFieldDefinitions : [];
      if (!rows.length) {
        scrollToModalField(".task-fields-section", true);
        message.warning(t("demo.create_task.warn_task_field"));
        return false;
      }
      const hasSelectedFieldTypeRequiringExceptions = rows.some(
        (row) => Boolean(row == null ? void 0 : row.fieldType) && row.fieldType !== TASK_FIELD_TYPE.SINGLE_CHOICE
      );
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i] ?? {};
        const cfg = row.config && typeof row.config === "object" ? row.config : {};
        const rowNum = i + 1;
        if (!row.fieldType) {
          scrollToModalField(`[data-field-row-index="${i}"]`);
          message.warning(t("demo.create_task.warn_field_type", { n: rowNum }));
          return false;
        }
        const hasText = (v) => String(v ?? "").trim().length > 0;
        const hasRequiredNumber = (v) => v !== null && v !== void 0 && String(v).trim() !== "" && Number.isFinite(Number(v));
        switch (row.fieldType) {
          case TASK_FIELD_TYPE.TEMPERATURE:
            if (!hasRequiredNumber(cfg.minC) || !hasRequiredNumber(cfg.maxC)) {
              scrollToModalField(`[data-field-row-index="${i}"]`);
              message.warning(t("demo.create_task.warn_field_temp", { n: rowNum }));
              return false;
            }
            break;
          case TASK_FIELD_TYPE.SINGLE_CHOICE:
            if (!hasText(cfg.question)) {
              scrollToModalField(`[data-field-row-index="${i}"]`);
              message.warning(t("demo.create_task.warn_field_question", { n: rowNum }));
              return false;
            }
            if (!Array.isArray(cfg.options) || !cfg.options.length || cfg.options.some((opt) => !hasText(opt))) {
              scrollToModalField(`[data-field-row-index="${i}"]`);
              message.warning(t("demo.create_task.warn_field_answers", { n: rowNum }));
              return false;
            }
            break;
          case TASK_FIELD_TYPE.TICKET:
            if (!hasText(cfg.description)) {
              scrollToModalField(`[data-field-row-index="${i}"]`);
              message.warning(t("demo.create_task.warn_field_ticket", { n: rowNum }));
              return false;
            }
            break;
          default:
            scrollToModalField(`[data-field-row-index="${i}"]`);
            message.warning(t("demo.create_task.warn_field_invalid", { n: rowNum }));
            return false;
        }
      }
      if (hasSelectedFieldTypeRequiringExceptions) {
        const exceptionRows = Array.isArray(addForm.correctiveActionRows) ? addForm.correctiveActionRows : [];
        const hasAny = exceptionRows.some(
          (r) => String((r == null ? void 0 : r.text) ?? "").trim().length > 0
        );
        if (!hasAny) {
          scrollToModalField(".task-fields-section__exception-block", true);
          message.warning(t("demo.create_task.warn_corrective_actions"));
          return false;
        }
      }
      clearValidationErrorMark();
      return true;
    };
    const toggleActiveWeekday = (weekday) => {
      if (isSingleWeekdayFrequency.value) {
        addForm.activeWeekdays = [weekday];
        return;
      }
      const selected = addForm.activeWeekdays;
      if (selected.includes(weekday)) {
        if (selected.length === 1) {
          return;
        }
        addForm.activeWeekdays = selected.filter((item) => item !== weekday);
        return;
      }
      addForm.activeWeekdays = [...selected, weekday];
    };
    const isStartDateDisabled = (timestamp) => {
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      return timestamp < today.getTime();
    };
    const advanceAddWizardStep = () => {
      clearValidationErrorMark();
      if (addWizardStep.value === 2) {
        return;
      }
      if (!String(addForm.title ?? "").trim()) {
        scrollToModalField(".checklists-add-form__title");
        message.warning(t("demo.create_task.warn_title_required"));
        return;
      }
      const assigneeResolved = resolveAssigneeIdForNiche(
        props.staff,
        props.activeNiche,
        addForm.assignedStaffId
      );
      if (isEquipmentOrRooms.value && !assigneeResolved) {
        scrollToModalField(".checklists-add-form__assignee");
        message.warning(t("demo.create_task.warn_assignee_required"));
        return;
      }
      addWizardStep.value = 2;
    };
    const backToAddWizardStep1 = () => {
      clearValidationErrorMark();
      addWizardStep.value = 1;
    };
    const submitAddTask = () => {
      clearValidationErrorMark();
      const assigneeResolved = resolveAssigneeIdForNiche(
        props.staff,
        props.activeNiche,
        addForm.assignedStaffId
      );
      if (isEquipmentOrRooms.value && !assigneeResolved) {
        scrollToModalField(".checklists-add-form__assignee");
        message.warning(t("demo.create_task.warn_assignee_scope"));
        return;
      }
      if (!validateScheduleFields()) {
        return;
      }
      if (addForm.taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT) {
        const eq = normalizeEquipmentTargetIds(addForm.equipmentTargetIds);
        if (!eq.length) {
          scrollToModalField(".checklists-equipment-block", true);
          message.warning(t("demo.create_task.warn_scope_required"));
          return;
        }
      }
      if (addForm.taskScopeType === TASK_SCOPE_TYPE.ROOMS) {
        const rooms = normalizeRoomTargetIds(addForm.roomTargetIds);
        if (!rooms.length) {
          scrollToModalField(".checklists-equipment-block", true);
          message.warning(t("demo.create_task.warn_scope_empty"));
          return;
        }
      }
      if (!validateTaskFieldsSection()) {
        return;
      }
      const modalFormData = buildTaskPayloadFromDraft({
        ...addForm,
        assignedStaffId: assigneeResolved
      });
      const taskPayload = modalFormData;
      const id = addChecklistTask(props.activeNiche, taskPayload);
      if (!id) {
        message.warning(t("demo.create_task.warn_checkpoint_name"));
        return;
      }
      emit("update:show", false);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NModal), mergeProps({
        show: __props.show,
        preset: "card",
        class: "checklists-add-modal",
        title: unref(t)("demo.create_task.modal_title"),
        style: addModalCardRootStyle,
        "content-style": addModalCardContentStyle,
        segmented: { content: true, footer: true },
        "mask-closable": false,
        "close-on-esc": false,
        "onUpdate:show": onUpdateShow,
        onAfterLeave: resetAddForm
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="checklists-modal-footer" data-v-941f5eec${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              type: "warning",
              size: "large",
              onClick: closeModal
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("demo.create_task.cancel"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("demo.create_task.cancel")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (addWizardStep.value === 2) {
              _push2(ssrRenderComponent(unref(Button), {
                type: "success",
                size: "large",
                onClick: backToAddWizardStep1
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(t)("demo.create_task.back"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("demo.create_task.back")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (addWizardStep.value === 2) {
              _push2(ssrRenderComponent(unref(Button), {
                type: "info",
                size: "large",
                onClick: submitAddTask
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(t)("demo.create_task.add"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("demo.create_task.add")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (addWizardStep.value === 1) {
              _push2(ssrRenderComponent(unref(Button), {
                type: "primary",
                size: "large",
                onClick: advanceAddWizardStep
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(t)("demo.create_task.next"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("demo.create_task.next")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "checklists-modal-footer" }, [
                createVNode(unref(Button), {
                  type: "warning",
                  size: "large",
                  onClick: closeModal
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("demo.create_task.cancel")), 1)
                  ]),
                  _: 1
                }),
                addWizardStep.value === 2 ? (openBlock(), createBlock(unref(Button), {
                  key: 0,
                  type: "success",
                  size: "large",
                  onClick: backToAddWizardStep1
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("demo.create_task.back")), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                addWizardStep.value === 2 ? (openBlock(), createBlock(unref(Button), {
                  key: 1,
                  type: "info",
                  size: "large",
                  onClick: submitAddTask
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("demo.create_task.add")), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                addWizardStep.value === 1 ? (openBlock(), createBlock(unref(Button), {
                  key: 2,
                  type: "primary",
                  size: "large",
                  onClick: advanceAddWizardStep
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("demo.create_task.next")), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="checklists-add-modal__body" style="${ssrRenderStyle(addModalBodyScrollStyle)}" data-v-941f5eec${_scopeId}><nav class="checklists-add-wizard__rail"${ssrRenderAttr("aria-label", unref(t)("demo.create_task.wizard_aria"))} data-v-941f5eec${_scopeId}><!--[-->`);
            ssrRenderList(unref(ADD_WIZARD_STEPS), (stepId, stepIdx) => {
              _push2(`<!--[-->`);
              if (addWizardStep.value > stepId) {
                _push2(`<button type="button" class="checklists-add-wizard__step-btn checklists-add-wizard__step-btn--done"${ssrRenderAttr("aria-label", addWizardStepAriaLabel(stepId))} data-v-941f5eec${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$o, {
                  name: "check-circle",
                  class: "checklists-add-wizard__step-icon checklists-add-wizard__step-icon--ok",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else if (addWizardStep.value === stepId) {
                _push2(`<div class="checklists-add-wizard__step-btn checklists-add-wizard__step-btn--active" aria-current="step"${ssrRenderAttr("aria-label", addWizardStepAriaLabel(stepId))} data-v-941f5eec${_scopeId}><span class="checklists-add-wizard__digit" aria-hidden="true" data-v-941f5eec${_scopeId}>${ssrInterpolate(stepId)}</span></div>`);
              } else {
                _push2(`<div class="checklists-add-wizard__step-btn checklists-add-wizard__step-btn--future" aria-disabled="true"${ssrRenderAttr("aria-label", addWizardStepAriaLabel(stepId))} data-v-941f5eec${_scopeId}><span class="checklists-add-wizard__digit" aria-hidden="true" data-v-941f5eec${_scopeId}>${ssrInterpolate(stepId)}</span></div>`);
              }
              if (stepIdx < unref(ADD_WIZARD_STEPS).length - 1) {
                _push2(`<div class="checklists-add-wizard__connector" aria-hidden="true" data-v-941f5eec${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]--></nav>`);
            _push2(ssrRenderComponent(unref(NForm), {
              class: "checklists-add-form",
              model: addForm,
              "label-placement": "top",
              "label-width": "auto"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (addWizardStep.value === 1) {
                    _push3(`<!--[-->`);
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("demo.create_task.title_label"),
                      required: "",
                      class: "checklists-add-form__title"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NInput), {
                            value: addForm.title,
                            "onUpdate:value": ($event) => addForm.title = $event,
                            size: "large",
                            placeholder: unref(t)("demo.create_task.title_placeholder")
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NInput), {
                              value: addForm.title,
                              "onUpdate:value": ($event) => addForm.title = $event,
                              size: "large",
                              placeholder: unref(t)("demo.create_task.title_placeholder")
                            }, null, 8, ["value", "onUpdate:value", "placeholder"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("demo.create_task.task_type")
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NRadioGroup), {
                            value: addForm.taskScopeType,
                            "onUpdate:value": ($event) => addForm.taskScopeType = $event,
                            class: "checklists-scope-group"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(taskScopeOptions.value, (opt) => {
                                  _push5(ssrRenderComponent(unref(NRadio), {
                                    key: opt.value,
                                    value: opt.value,
                                    class: "checklists-scope-option"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<span class="checklists-scope-label" data-v-941f5eec${_scopeId5}>${ssrInterpolate(opt.label)}</span><p class="checklists-scope-hint" data-v-941f5eec${_scopeId5}>${ssrInterpolate(opt.hint)}</p>`);
                                      } else {
                                        return [
                                          createVNode("span", { class: "checklists-scope-label" }, toDisplayString(opt.label), 1),
                                          createVNode("p", { class: "checklists-scope-hint" }, toDisplayString(opt.hint), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(taskScopeOptions.value, (opt) => {
                                    return openBlock(), createBlock(unref(NRadio), {
                                      key: opt.value,
                                      value: opt.value,
                                      class: "checklists-scope-option"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", { class: "checklists-scope-label" }, toDisplayString(opt.label), 1),
                                        createVNode("p", { class: "checklists-scope-hint" }, toDisplayString(opt.hint), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NRadioGroup), {
                              value: addForm.taskScopeType,
                              "onUpdate:value": ($event) => addForm.taskScopeType = $event,
                              class: "checklists-scope-group"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(taskScopeOptions.value, (opt) => {
                                  return openBlock(), createBlock(unref(NRadio), {
                                    key: opt.value,
                                    value: opt.value,
                                    class: "checklists-scope-option"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", { class: "checklists-scope-label" }, toDisplayString(opt.label), 1),
                                      createVNode("p", { class: "checklists-scope-hint" }, toDisplayString(opt.hint), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ]),
                              _: 1
                            }, 8, ["value", "onUpdate:value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="checklists-details-block" data-v-941f5eec${_scopeId2}><p class="checklists-details-heading" data-v-941f5eec${_scopeId2}>${ssrInterpolate(unref(t)("demo.create_task.task_details"))}</p>`);
                    if (isEquipmentOrRooms.value) {
                      _push3(ssrRenderComponent(unref(NFormItem), {
                        label: unref(t)("demo.create_task.assignee_required"),
                        required: "",
                        class: "checklists-add-form__assignee"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(NSelect), {
                              value: addForm.assignedStaffId,
                              "onUpdate:value": ($event) => addForm.assignedStaffId = $event,
                              options: assigneeSelectOptions.value,
                              size: "large",
                              clearable: "",
                              filterable: "",
                              placeholder: unref(t)("demo.create_task.assignee_placeholder")
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(NSelect), {
                                value: addForm.assignedStaffId,
                                "onUpdate:value": ($event) => addForm.assignedStaffId = $event,
                                options: assigneeSelectOptions.value,
                                size: "large",
                                clearable: "",
                                filterable: "",
                                placeholder: unref(t)("demo.create_task.assignee_placeholder")
                              }, null, 8, ["value", "onUpdate:value", "options", "placeholder"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!--[-->`);
                      _push3(ssrRenderComponent(unref(NFormItem), {
                        label: unref(t)("demo.create_task.assign_task"),
                        class: "checklists-add-form__assignee"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(NSelect), {
                              value: addForm.assignedStaffId,
                              "onUpdate:value": ($event) => addForm.assignedStaffId = $event,
                              options: assigneeSelectOptions.value,
                              size: "large",
                              clearable: "",
                              filterable: "",
                              placeholder: unref(t)("demo.create_task.assign_optional")
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(NSelect), {
                                value: addForm.assignedStaffId,
                                "onUpdate:value": ($event) => addForm.assignedStaffId = $event,
                                options: assigneeSelectOptions.value,
                                size: "large",
                                clearable: "",
                                filterable: "",
                                placeholder: unref(t)("demo.create_task.assign_optional")
                              }, null, 8, ["value", "onUpdate:value", "options", "placeholder"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`<p class="checklists-standalone-hint" data-v-941f5eec${_scopeId2}>${ssrInterpolate(unref(t)("demo.create_task.assign_hint"))}</p><!--]-->`);
                    }
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("demo.create_task.frequency")
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NSelect), {
                            value: addForm.frequency,
                            "onUpdate:value": ($event) => addForm.frequency = $event,
                            options: frequencySelectOptions.value,
                            size: "large"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NSelect), {
                              value: addForm.frequency,
                              "onUpdate:value": ($event) => addForm.frequency = $event,
                              options: frequencySelectOptions.value,
                              size: "large"
                            }, null, 8, ["value", "onUpdate:value", "options"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="checklists-working-days-block" data-v-941f5eec${_scopeId2}><p class="checklists-working-days-block__title" data-v-941f5eec${_scopeId2}>${ssrInterpolate(unref(t)("demo.create_task.working_days"))}</p><div class="checklists-working-days-block__list" data-v-941f5eec${_scopeId2}><!--[-->`);
                    ssrRenderList(WEEKDAY_OPTIONS.value, (day) => {
                      _push3(`<button type="button" class="${ssrRenderClass([{
                        "checklists-working-days-block__day--active": addForm.activeWeekdays.includes(day.value)
                      }, "checklists-working-days-block__day"])}" data-v-941f5eec${_scopeId2}>${ssrInterpolate(day.short)}</button>`);
                    });
                    _push3(`<!--]--></div></div><div class="checklists-details-schedule-row" data-v-941f5eec${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("demo.create_task.start_date"),
                      required: "",
                      class: "checklists-details-start-date"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NDatePicker), {
                            value: addForm.startDate,
                            "onUpdate:value": ($event) => addForm.startDate = $event,
                            type: "date",
                            size: "large",
                            "is-date-disabled": isStartDateDisabled,
                            placeholder: unref(t)("demo.create_task.start_date_placeholder")
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NDatePicker), {
                              value: addForm.startDate,
                              "onUpdate:value": ($event) => addForm.startDate = $event,
                              type: "date",
                              size: "large",
                              "is-date-disabled": isStartDateDisabled,
                              placeholder: unref(t)("demo.create_task.start_date_placeholder")
                            }, null, 8, ["value", "onUpdate:value", "placeholder"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(NFormItem), {
                      label: unref(t)("demo.create_task.repeats_per_day"),
                      required: "",
                      class: "checklists-details-repeats-per-day"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(NInputNumber), {
                            value: addForm.scheduleSlotCount,
                            "onUpdate:value": ($event) => addForm.scheduleSlotCount = $event,
                            "show-button": false,
                            size: "large",
                            min: 1,
                            step: 1,
                            precision: 0,
                            disabled: addForm.frequency === unref(FREQUENCY_CODE).DAILY,
                            clearable: "",
                            placeholder: "1"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(NInputNumber), {
                              value: addForm.scheduleSlotCount,
                              "onUpdate:value": ($event) => addForm.scheduleSlotCount = $event,
                              "show-button": false,
                              size: "large",
                              min: 1,
                              step: 1,
                              precision: 0,
                              disabled: addForm.frequency === unref(FREQUENCY_CODE).DAILY,
                              clearable: "",
                              placeholder: "1"
                            }, null, 8, ["value", "onUpdate:value", "disabled"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="checklists-repeat-times-block" data-v-941f5eec${_scopeId2}><p class="checklists-repeat-times-block__title" data-v-941f5eec${_scopeId2}>${ssrInterpolate(unref(t)("demo.create_task.execution_time"))}</p><div class="checklists-repeat-times-block__list" data-v-941f5eec${_scopeId2}><!--[-->`);
                    ssrRenderList(normalizedScheduleSlotCount.value, (idx) => {
                      _push3(ssrRenderComponent(unref(NFormItem), {
                        key: `repeat-time-${idx}`,
                        label: unref(t)("demo.create_task.repeat_n", { n: idx }),
                        required: "",
                        class: "checklists-repeat-times-block__item"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(NTimePicker), {
                              "formatted-value": addForm.repeatTimes[idx - 1],
                              "onUpdate:formattedValue": ($event) => addForm.repeatTimes[idx - 1] = $event,
                              format: "HH:mm",
                              "value-format": "HH:mm",
                              size: "large",
                              clearable: "",
                              placeholder: unref(t)("demo.create_task.time_placeholder")
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(NTimePicker), {
                                "formatted-value": addForm.repeatTimes[idx - 1],
                                "onUpdate:formattedValue": ($event) => addForm.repeatTimes[idx - 1] = $event,
                                format: "HH:mm",
                                "value-format": "HH:mm",
                                size: "large",
                                clearable: "",
                                placeholder: unref(t)("demo.create_task.time_placeholder")
                              }, null, 8, ["formatted-value", "onUpdate:formattedValue", "placeholder"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div></div></div><!--]-->`);
                  } else {
                    _push3(`<!--[-->`);
                    if (addForm.taskScopeType === unref(TASK_SCOPE_TYPE).EQUIPMENT) {
                      _push3(`<div class="checklists-equipment-block" data-v-941f5eec${_scopeId2}><p class="checklists-details-heading" data-v-941f5eec${_scopeId2}>${ssrInterpolate(unref(t)("demo.create_task.task_subject"))}</p>`);
                      _push3(ssrRenderComponent(unref(NFormItem), {
                        label: unref(t)("demo.create_task.group"),
                        class: "checklists-equipment-group-select"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(NSelect), {
                              value: equipmentPickerGroupTitle.value,
                              "onUpdate:value": ($event) => equipmentPickerGroupTitle.value = $event,
                              options: equipmentGroupSelectOptions.value,
                              size: "large"
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(NSelect), {
                                value: equipmentPickerGroupTitle.value,
                                "onUpdate:value": ($event) => equipmentPickerGroupTitle.value = $event,
                                options: equipmentGroupSelectOptions.value,
                                size: "large"
                              }, null, 8, ["value", "onUpdate:value", "options"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(NCheckboxGroup), {
                        value: addForm.equipmentTargetIds,
                        "onUpdate:value": ($event) => addForm.equipmentTargetIds = $event
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<!--[-->`);
                            ssrRenderList(equipmentGroupForPicker.value.items, (item) => {
                              _push4(`<div class="checklists-equipment-item" data-v-941f5eec${_scopeId3}>`);
                              _push4(ssrRenderComponent(unref(NCheckbox), {
                                value: item.id,
                                label: item.label,
                                size: "large"
                              }, null, _parent4, _scopeId3));
                              _push4(`</div>`);
                            });
                            _push4(`<!--]-->`);
                          } else {
                            return [
                              (openBlock(true), createBlock(Fragment, null, renderList(equipmentGroupForPicker.value.items, (item) => {
                                return openBlock(), createBlock("div", {
                                  key: item.id,
                                  class: "checklists-equipment-item"
                                }, [
                                  createVNode(unref(NCheckbox), {
                                    value: item.id,
                                    label: item.label,
                                    size: "large"
                                  }, null, 8, ["value", "label"])
                                ]);
                              }), 128))
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (addForm.taskScopeType === unref(TASK_SCOPE_TYPE).ROOMS) {
                      _push3(`<div class="checklists-equipment-block" data-v-941f5eec${_scopeId2}><p class="checklists-details-heading" data-v-941f5eec${_scopeId2}>${ssrInterpolate(unref(t)("demo.create_task.task_subject"))}</p>`);
                      _push3(ssrRenderComponent(unref(NCheckboxGroup), {
                        value: addForm.roomTargetIds,
                        "onUpdate:value": ($event) => addForm.roomTargetIds = $event
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<!--[-->`);
                            ssrRenderList(unref(ROOM_GROUPS), (group) => {
                              _push4(`<div class="checklists-equipment-group" data-v-941f5eec${_scopeId3}><p class="checklists-equipment-group-title" data-v-941f5eec${_scopeId3}>${ssrInterpolate(group.groupTitle)}</p><!--[-->`);
                              ssrRenderList(group.items, (item) => {
                                _push4(`<div class="checklists-equipment-item" data-v-941f5eec${_scopeId3}>`);
                                _push4(ssrRenderComponent(unref(NCheckbox), {
                                  value: item.id,
                                  label: item.label,
                                  size: "large"
                                }, null, _parent4, _scopeId3));
                                _push4(`</div>`);
                              });
                              _push4(`<!--]--></div>`);
                            });
                            _push4(`<!--]-->`);
                          } else {
                            return [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(ROOM_GROUPS), (group) => {
                                return openBlock(), createBlock("div", {
                                  key: group.groupTitle,
                                  class: "checklists-equipment-group"
                                }, [
                                  createVNode("p", { class: "checklists-equipment-group-title" }, toDisplayString(group.groupTitle), 1),
                                  (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item) => {
                                    return openBlock(), createBlock("div", {
                                      key: item.id,
                                      class: "checklists-equipment-item"
                                    }, [
                                      createVNode(unref(NCheckbox), {
                                        value: item.id,
                                        label: item.label,
                                        size: "large"
                                      }, null, 8, ["value", "label"])
                                    ]);
                                  }), 128))
                                ]);
                              }), 128))
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div class="checklists-task-fields-block" data-v-941f5eec${_scopeId2}>`);
                    _push3(ssrRenderComponent(ChecklistTaskFieldsSection, {
                      modelValue: addForm.taskFieldDefinitions,
                      "onUpdate:modelValue": ($event) => addForm.taskFieldDefinitions = $event,
                      "task-field-type-options": taskFieldTypeOptionsForCurrentScope.value,
                      "corrective-action-rows": addForm.correctiveActionRows,
                      "onUpdate:correctiveActionRows": ($event) => addForm.correctiveActionRows = $event
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div class="checklists-report-corrections" data-v-941f5eec${_scopeId2}><div class="header-checklists-report-corrections" data-v-941f5eec${_scopeId2}><p class="checklists-report-corrections__title" data-v-941f5eec${_scopeId2}>${ssrInterpolate(unref(t)("demo.create_task.report_corrections"))}</p>`);
                    _push3(ssrRenderComponent(unref(NSwitch), {
                      value: addForm.allowAssigneeReportCorrections,
                      "onUpdate:value": ($event) => addForm.allowAssigneeReportCorrections = $event
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><p class="checklists-report-corrections__text" data-v-941f5eec${_scopeId2}>${ssrInterpolate(unref(t)("demo.create_task.report_corrections_text"))}</p></div><!--]-->`);
                  }
                } else {
                  return [
                    addWizardStep.value === 1 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode(unref(NFormItem), {
                        label: unref(t)("demo.create_task.title_label"),
                        required: "",
                        class: "checklists-add-form__title"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: addForm.title,
                            "onUpdate:value": ($event) => addForm.title = $event,
                            size: "large",
                            placeholder: unref(t)("demo.create_task.title_placeholder")
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(unref(NFormItem), {
                        label: unref(t)("demo.create_task.task_type")
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NRadioGroup), {
                            value: addForm.taskScopeType,
                            "onUpdate:value": ($event) => addForm.taskScopeType = $event,
                            class: "checklists-scope-group"
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(taskScopeOptions.value, (opt) => {
                                return openBlock(), createBlock(unref(NRadio), {
                                  key: opt.value,
                                  value: opt.value,
                                  class: "checklists-scope-option"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "checklists-scope-label" }, toDisplayString(opt.label), 1),
                                    createVNode("p", { class: "checklists-scope-hint" }, toDisplayString(opt.hint), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode("div", { class: "checklists-details-block" }, [
                        createVNode("p", { class: "checklists-details-heading" }, toDisplayString(unref(t)("demo.create_task.task_details")), 1),
                        isEquipmentOrRooms.value ? (openBlock(), createBlock(unref(NFormItem), {
                          key: 0,
                          label: unref(t)("demo.create_task.assignee_required"),
                          required: "",
                          class: "checklists-add-form__assignee"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NSelect), {
                              value: addForm.assignedStaffId,
                              "onUpdate:value": ($event) => addForm.assignedStaffId = $event,
                              options: assigneeSelectOptions.value,
                              size: "large",
                              clearable: "",
                              filterable: "",
                              placeholder: unref(t)("demo.create_task.assignee_placeholder")
                            }, null, 8, ["value", "onUpdate:value", "options", "placeholder"])
                          ]),
                          _: 1
                        }, 8, ["label"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createVNode(unref(NFormItem), {
                            label: unref(t)("demo.create_task.assign_task"),
                            class: "checklists-add-form__assignee"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NSelect), {
                                value: addForm.assignedStaffId,
                                "onUpdate:value": ($event) => addForm.assignedStaffId = $event,
                                options: assigneeSelectOptions.value,
                                size: "large",
                                clearable: "",
                                filterable: "",
                                placeholder: unref(t)("demo.create_task.assign_optional")
                              }, null, 8, ["value", "onUpdate:value", "options", "placeholder"])
                            ]),
                            _: 1
                          }, 8, ["label"]),
                          createVNode("p", { class: "checklists-standalone-hint" }, toDisplayString(unref(t)("demo.create_task.assign_hint")), 1)
                        ], 64)),
                        createVNode(unref(NFormItem), {
                          label: unref(t)("demo.create_task.frequency")
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NSelect), {
                              value: addForm.frequency,
                              "onUpdate:value": ($event) => addForm.frequency = $event,
                              options: frequencySelectOptions.value,
                              size: "large"
                            }, null, 8, ["value", "onUpdate:value", "options"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode("div", { class: "checklists-working-days-block" }, [
                          createVNode("p", { class: "checklists-working-days-block__title" }, toDisplayString(unref(t)("demo.create_task.working_days")), 1),
                          createVNode("div", { class: "checklists-working-days-block__list" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(WEEKDAY_OPTIONS.value, (day) => {
                              return openBlock(), createBlock("button", {
                                key: day.value,
                                type: "button",
                                class: ["checklists-working-days-block__day", {
                                  "checklists-working-days-block__day--active": addForm.activeWeekdays.includes(day.value)
                                }],
                                onClick: ($event) => toggleActiveWeekday(day.value)
                              }, toDisplayString(day.short), 11, ["onClick"]);
                            }), 128))
                          ])
                        ]),
                        createVNode("div", { class: "checklists-details-schedule-row" }, [
                          createVNode(unref(NFormItem), {
                            label: unref(t)("demo.create_task.start_date"),
                            required: "",
                            class: "checklists-details-start-date"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NDatePicker), {
                                value: addForm.startDate,
                                "onUpdate:value": ($event) => addForm.startDate = $event,
                                type: "date",
                                size: "large",
                                "is-date-disabled": isStartDateDisabled,
                                placeholder: unref(t)("demo.create_task.start_date_placeholder")
                              }, null, 8, ["value", "onUpdate:value", "placeholder"])
                            ]),
                            _: 1
                          }, 8, ["label"]),
                          createVNode(unref(NFormItem), {
                            label: unref(t)("demo.create_task.repeats_per_day"),
                            required: "",
                            class: "checklists-details-repeats-per-day"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: addForm.scheduleSlotCount,
                                "onUpdate:value": ($event) => addForm.scheduleSlotCount = $event,
                                "show-button": false,
                                size: "large",
                                min: 1,
                                step: 1,
                                precision: 0,
                                disabled: addForm.frequency === unref(FREQUENCY_CODE).DAILY,
                                clearable: "",
                                placeholder: "1"
                              }, null, 8, ["value", "onUpdate:value", "disabled"])
                            ]),
                            _: 1
                          }, 8, ["label"])
                        ]),
                        createVNode("div", { class: "checklists-repeat-times-block" }, [
                          createVNode("p", { class: "checklists-repeat-times-block__title" }, toDisplayString(unref(t)("demo.create_task.execution_time")), 1),
                          createVNode("div", { class: "checklists-repeat-times-block__list" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(normalizedScheduleSlotCount.value, (idx) => {
                              return openBlock(), createBlock(unref(NFormItem), {
                                key: `repeat-time-${idx}`,
                                label: unref(t)("demo.create_task.repeat_n", { n: idx }),
                                required: "",
                                class: "checklists-repeat-times-block__item"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(NTimePicker), {
                                    "formatted-value": addForm.repeatTimes[idx - 1],
                                    "onUpdate:formattedValue": ($event) => addForm.repeatTimes[idx - 1] = $event,
                                    format: "HH:mm",
                                    "value-format": "HH:mm",
                                    size: "large",
                                    clearable: "",
                                    placeholder: unref(t)("demo.create_task.time_placeholder")
                                  }, null, 8, ["formatted-value", "onUpdate:formattedValue", "placeholder"])
                                ]),
                                _: 2
                              }, 1032, ["label"]);
                            }), 128))
                          ])
                        ])
                      ])
                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      addForm.taskScopeType === unref(TASK_SCOPE_TYPE).EQUIPMENT ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "checklists-equipment-block"
                      }, [
                        createVNode("p", { class: "checklists-details-heading" }, toDisplayString(unref(t)("demo.create_task.task_subject")), 1),
                        createVNode(unref(NFormItem), {
                          label: unref(t)("demo.create_task.group"),
                          class: "checklists-equipment-group-select"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NSelect), {
                              value: equipmentPickerGroupTitle.value,
                              "onUpdate:value": ($event) => equipmentPickerGroupTitle.value = $event,
                              options: equipmentGroupSelectOptions.value,
                              size: "large"
                            }, null, 8, ["value", "onUpdate:value", "options"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode(unref(NCheckboxGroup), {
                          value: addForm.equipmentTargetIds,
                          "onUpdate:value": ($event) => addForm.equipmentTargetIds = $event
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(equipmentGroupForPicker.value.items, (item) => {
                              return openBlock(), createBlock("div", {
                                key: item.id,
                                class: "checklists-equipment-item"
                              }, [
                                createVNode(unref(NCheckbox), {
                                  value: item.id,
                                  label: item.label,
                                  size: "large"
                                }, null, 8, ["value", "label"])
                              ]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ])) : createCommentVNode("", true),
                      addForm.taskScopeType === unref(TASK_SCOPE_TYPE).ROOMS ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "checklists-equipment-block"
                      }, [
                        createVNode("p", { class: "checklists-details-heading" }, toDisplayString(unref(t)("demo.create_task.task_subject")), 1),
                        createVNode(unref(NCheckboxGroup), {
                          value: addForm.roomTargetIds,
                          "onUpdate:value": ($event) => addForm.roomTargetIds = $event
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(ROOM_GROUPS), (group) => {
                              return openBlock(), createBlock("div", {
                                key: group.groupTitle,
                                class: "checklists-equipment-group"
                              }, [
                                createVNode("p", { class: "checklists-equipment-group-title" }, toDisplayString(group.groupTitle), 1),
                                (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item) => {
                                  return openBlock(), createBlock("div", {
                                    key: item.id,
                                    class: "checklists-equipment-item"
                                  }, [
                                    createVNode(unref(NCheckbox), {
                                      value: item.id,
                                      label: item.label,
                                      size: "large"
                                    }, null, 8, ["value", "label"])
                                  ]);
                                }), 128))
                              ]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "checklists-task-fields-block" }, [
                        createVNode(ChecklistTaskFieldsSection, {
                          modelValue: addForm.taskFieldDefinitions,
                          "onUpdate:modelValue": ($event) => addForm.taskFieldDefinitions = $event,
                          "task-field-type-options": taskFieldTypeOptionsForCurrentScope.value,
                          "corrective-action-rows": addForm.correctiveActionRows,
                          "onUpdate:correctiveActionRows": ($event) => addForm.correctiveActionRows = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "task-field-type-options", "corrective-action-rows", "onUpdate:correctiveActionRows"])
                      ]),
                      createVNode("div", { class: "checklists-report-corrections" }, [
                        createVNode("div", { class: "header-checklists-report-corrections" }, [
                          createVNode("p", { class: "checklists-report-corrections__title" }, toDisplayString(unref(t)("demo.create_task.report_corrections")), 1),
                          createVNode(unref(NSwitch), {
                            value: addForm.allowAssigneeReportCorrections,
                            "onUpdate:value": ($event) => addForm.allowAssigneeReportCorrections = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        createVNode("p", { class: "checklists-report-corrections__text" }, toDisplayString(unref(t)("demo.create_task.report_corrections_text")), 1)
                      ])
                    ], 64))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: "checklists-add-modal__body",
                style: addModalBodyScrollStyle
              }, [
                createVNode("nav", {
                  class: "checklists-add-wizard__rail",
                  "aria-label": unref(t)("demo.create_task.wizard_aria")
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(ADD_WIZARD_STEPS), (stepId, stepIdx) => {
                    return openBlock(), createBlock(Fragment, { key: stepId }, [
                      addWizardStep.value > stepId ? (openBlock(), createBlock("button", {
                        key: 0,
                        type: "button",
                        class: "checklists-add-wizard__step-btn checklists-add-wizard__step-btn--done",
                        "aria-label": addWizardStepAriaLabel(stepId),
                        onClick: ($event) => onAddWizardStepClick(stepId)
                      }, [
                        createVNode(_sfc_main$o, {
                          name: "check-circle",
                          class: "checklists-add-wizard__step-icon checklists-add-wizard__step-icon--ok",
                          "aria-hidden": "true"
                        })
                      ], 8, ["aria-label", "onClick"])) : addWizardStep.value === stepId ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "checklists-add-wizard__step-btn checklists-add-wizard__step-btn--active",
                        "aria-current": "step",
                        "aria-label": addWizardStepAriaLabel(stepId)
                      }, [
                        createVNode("span", {
                          class: "checklists-add-wizard__digit",
                          "aria-hidden": "true"
                        }, toDisplayString(stepId), 1)
                      ], 8, ["aria-label"])) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "checklists-add-wizard__step-btn checklists-add-wizard__step-btn--future",
                        "aria-disabled": "true",
                        "aria-label": addWizardStepAriaLabel(stepId)
                      }, [
                        createVNode("span", {
                          class: "checklists-add-wizard__digit",
                          "aria-hidden": "true"
                        }, toDisplayString(stepId), 1)
                      ], 8, ["aria-label"])),
                      stepIdx < unref(ADD_WIZARD_STEPS).length - 1 ? (openBlock(), createBlock("div", {
                        key: 3,
                        class: "checklists-add-wizard__connector",
                        "aria-hidden": "true"
                      })) : createCommentVNode("", true)
                    ], 64);
                  }), 128))
                ], 8, ["aria-label"]),
                createVNode(unref(NForm), {
                  class: "checklists-add-form",
                  model: addForm,
                  "label-placement": "top",
                  "label-width": "auto"
                }, {
                  default: withCtx(() => [
                    addWizardStep.value === 1 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode(unref(NFormItem), {
                        label: unref(t)("demo.create_task.title_label"),
                        required: "",
                        class: "checklists-add-form__title"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: addForm.title,
                            "onUpdate:value": ($event) => addForm.title = $event,
                            size: "large",
                            placeholder: unref(t)("demo.create_task.title_placeholder")
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(unref(NFormItem), {
                        label: unref(t)("demo.create_task.task_type")
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NRadioGroup), {
                            value: addForm.taskScopeType,
                            "onUpdate:value": ($event) => addForm.taskScopeType = $event,
                            class: "checklists-scope-group"
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(taskScopeOptions.value, (opt) => {
                                return openBlock(), createBlock(unref(NRadio), {
                                  key: opt.value,
                                  value: opt.value,
                                  class: "checklists-scope-option"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "checklists-scope-label" }, toDisplayString(opt.label), 1),
                                    createVNode("p", { class: "checklists-scope-hint" }, toDisplayString(opt.hint), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode("div", { class: "checklists-details-block" }, [
                        createVNode("p", { class: "checklists-details-heading" }, toDisplayString(unref(t)("demo.create_task.task_details")), 1),
                        isEquipmentOrRooms.value ? (openBlock(), createBlock(unref(NFormItem), {
                          key: 0,
                          label: unref(t)("demo.create_task.assignee_required"),
                          required: "",
                          class: "checklists-add-form__assignee"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NSelect), {
                              value: addForm.assignedStaffId,
                              "onUpdate:value": ($event) => addForm.assignedStaffId = $event,
                              options: assigneeSelectOptions.value,
                              size: "large",
                              clearable: "",
                              filterable: "",
                              placeholder: unref(t)("demo.create_task.assignee_placeholder")
                            }, null, 8, ["value", "onUpdate:value", "options", "placeholder"])
                          ]),
                          _: 1
                        }, 8, ["label"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createVNode(unref(NFormItem), {
                            label: unref(t)("demo.create_task.assign_task"),
                            class: "checklists-add-form__assignee"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NSelect), {
                                value: addForm.assignedStaffId,
                                "onUpdate:value": ($event) => addForm.assignedStaffId = $event,
                                options: assigneeSelectOptions.value,
                                size: "large",
                                clearable: "",
                                filterable: "",
                                placeholder: unref(t)("demo.create_task.assign_optional")
                              }, null, 8, ["value", "onUpdate:value", "options", "placeholder"])
                            ]),
                            _: 1
                          }, 8, ["label"]),
                          createVNode("p", { class: "checklists-standalone-hint" }, toDisplayString(unref(t)("demo.create_task.assign_hint")), 1)
                        ], 64)),
                        createVNode(unref(NFormItem), {
                          label: unref(t)("demo.create_task.frequency")
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NSelect), {
                              value: addForm.frequency,
                              "onUpdate:value": ($event) => addForm.frequency = $event,
                              options: frequencySelectOptions.value,
                              size: "large"
                            }, null, 8, ["value", "onUpdate:value", "options"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode("div", { class: "checklists-working-days-block" }, [
                          createVNode("p", { class: "checklists-working-days-block__title" }, toDisplayString(unref(t)("demo.create_task.working_days")), 1),
                          createVNode("div", { class: "checklists-working-days-block__list" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(WEEKDAY_OPTIONS.value, (day) => {
                              return openBlock(), createBlock("button", {
                                key: day.value,
                                type: "button",
                                class: ["checklists-working-days-block__day", {
                                  "checklists-working-days-block__day--active": addForm.activeWeekdays.includes(day.value)
                                }],
                                onClick: ($event) => toggleActiveWeekday(day.value)
                              }, toDisplayString(day.short), 11, ["onClick"]);
                            }), 128))
                          ])
                        ]),
                        createVNode("div", { class: "checklists-details-schedule-row" }, [
                          createVNode(unref(NFormItem), {
                            label: unref(t)("demo.create_task.start_date"),
                            required: "",
                            class: "checklists-details-start-date"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NDatePicker), {
                                value: addForm.startDate,
                                "onUpdate:value": ($event) => addForm.startDate = $event,
                                type: "date",
                                size: "large",
                                "is-date-disabled": isStartDateDisabled,
                                placeholder: unref(t)("demo.create_task.start_date_placeholder")
                              }, null, 8, ["value", "onUpdate:value", "placeholder"])
                            ]),
                            _: 1
                          }, 8, ["label"]),
                          createVNode(unref(NFormItem), {
                            label: unref(t)("demo.create_task.repeats_per_day"),
                            required: "",
                            class: "checklists-details-repeats-per-day"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: addForm.scheduleSlotCount,
                                "onUpdate:value": ($event) => addForm.scheduleSlotCount = $event,
                                "show-button": false,
                                size: "large",
                                min: 1,
                                step: 1,
                                precision: 0,
                                disabled: addForm.frequency === unref(FREQUENCY_CODE).DAILY,
                                clearable: "",
                                placeholder: "1"
                              }, null, 8, ["value", "onUpdate:value", "disabled"])
                            ]),
                            _: 1
                          }, 8, ["label"])
                        ]),
                        createVNode("div", { class: "checklists-repeat-times-block" }, [
                          createVNode("p", { class: "checklists-repeat-times-block__title" }, toDisplayString(unref(t)("demo.create_task.execution_time")), 1),
                          createVNode("div", { class: "checklists-repeat-times-block__list" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(normalizedScheduleSlotCount.value, (idx) => {
                              return openBlock(), createBlock(unref(NFormItem), {
                                key: `repeat-time-${idx}`,
                                label: unref(t)("demo.create_task.repeat_n", { n: idx }),
                                required: "",
                                class: "checklists-repeat-times-block__item"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(NTimePicker), {
                                    "formatted-value": addForm.repeatTimes[idx - 1],
                                    "onUpdate:formattedValue": ($event) => addForm.repeatTimes[idx - 1] = $event,
                                    format: "HH:mm",
                                    "value-format": "HH:mm",
                                    size: "large",
                                    clearable: "",
                                    placeholder: unref(t)("demo.create_task.time_placeholder")
                                  }, null, 8, ["formatted-value", "onUpdate:formattedValue", "placeholder"])
                                ]),
                                _: 2
                              }, 1032, ["label"]);
                            }), 128))
                          ])
                        ])
                      ])
                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      addForm.taskScopeType === unref(TASK_SCOPE_TYPE).EQUIPMENT ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "checklists-equipment-block"
                      }, [
                        createVNode("p", { class: "checklists-details-heading" }, toDisplayString(unref(t)("demo.create_task.task_subject")), 1),
                        createVNode(unref(NFormItem), {
                          label: unref(t)("demo.create_task.group"),
                          class: "checklists-equipment-group-select"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NSelect), {
                              value: equipmentPickerGroupTitle.value,
                              "onUpdate:value": ($event) => equipmentPickerGroupTitle.value = $event,
                              options: equipmentGroupSelectOptions.value,
                              size: "large"
                            }, null, 8, ["value", "onUpdate:value", "options"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode(unref(NCheckboxGroup), {
                          value: addForm.equipmentTargetIds,
                          "onUpdate:value": ($event) => addForm.equipmentTargetIds = $event
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(equipmentGroupForPicker.value.items, (item) => {
                              return openBlock(), createBlock("div", {
                                key: item.id,
                                class: "checklists-equipment-item"
                              }, [
                                createVNode(unref(NCheckbox), {
                                  value: item.id,
                                  label: item.label,
                                  size: "large"
                                }, null, 8, ["value", "label"])
                              ]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ])) : createCommentVNode("", true),
                      addForm.taskScopeType === unref(TASK_SCOPE_TYPE).ROOMS ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "checklists-equipment-block"
                      }, [
                        createVNode("p", { class: "checklists-details-heading" }, toDisplayString(unref(t)("demo.create_task.task_subject")), 1),
                        createVNode(unref(NCheckboxGroup), {
                          value: addForm.roomTargetIds,
                          "onUpdate:value": ($event) => addForm.roomTargetIds = $event
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(ROOM_GROUPS), (group) => {
                              return openBlock(), createBlock("div", {
                                key: group.groupTitle,
                                class: "checklists-equipment-group"
                              }, [
                                createVNode("p", { class: "checklists-equipment-group-title" }, toDisplayString(group.groupTitle), 1),
                                (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item) => {
                                  return openBlock(), createBlock("div", {
                                    key: item.id,
                                    class: "checklists-equipment-item"
                                  }, [
                                    createVNode(unref(NCheckbox), {
                                      value: item.id,
                                      label: item.label,
                                      size: "large"
                                    }, null, 8, ["value", "label"])
                                  ]);
                                }), 128))
                              ]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "checklists-task-fields-block" }, [
                        createVNode(ChecklistTaskFieldsSection, {
                          modelValue: addForm.taskFieldDefinitions,
                          "onUpdate:modelValue": ($event) => addForm.taskFieldDefinitions = $event,
                          "task-field-type-options": taskFieldTypeOptionsForCurrentScope.value,
                          "corrective-action-rows": addForm.correctiveActionRows,
                          "onUpdate:correctiveActionRows": ($event) => addForm.correctiveActionRows = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "task-field-type-options", "corrective-action-rows", "onUpdate:correctiveActionRows"])
                      ]),
                      createVNode("div", { class: "checklists-report-corrections" }, [
                        createVNode("div", { class: "header-checklists-report-corrections" }, [
                          createVNode("p", { class: "checklists-report-corrections__title" }, toDisplayString(unref(t)("demo.create_task.report_corrections")), 1),
                          createVNode(unref(NSwitch), {
                            value: addForm.allowAssigneeReportCorrections,
                            "onUpdate:value": ($event) => addForm.allowAssigneeReportCorrections = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        createVNode("p", { class: "checklists-report-corrections__text" }, toDisplayString(unref(t)("demo.create_task.report_corrections_text")), 1)
                      ])
                    ], 64))
                  ]),
                  _: 1
                }, 8, ["model"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/create_task_modal/CreateTaskModal.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const CreateTaskModal = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-941f5eec"]]);
const _sfc_main$6 = /* @__PURE__ */ Object.assign({ name: "ChecklistsSection" }, {
  __name: "ChecklistsSection",
  __ssrInlineRender: true,
  props: {
    checklistsByNiche: {
      type: Object,
      required: true
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const { demoState, removeChecklistTask } = useDemoState();
    const nicheTabs = computed(() => [
      { id: "coffee", label: t("demo.checklists.niche_coffee") },
      { id: "bakery", label: t("demo.checklists.niche_bakery") },
      { id: "meat", label: t("demo.checklists.niche_meat") }
    ]);
    function resetActiveNicheToFirst() {
      activeNiche.value = nicheTabs.value[0].id;
    }
    const NICHE_EMOJI = {
      coffee: "☕",
      bakery: "🥐",
      meat: "🥩"
    };
    const nicheEmoji = (nicheId) => NICHE_EMOJI[nicheId] ?? "";
    const activeNiche = ref("coffee");
    const isModalOpen = ref(false);
    const tasksByNiche = (nicheId) => {
      var _a;
      return ((_a = demoState.value.checklistsByNiche) == null ? void 0 : _a[nicheId]) ?? [];
    };
    const selectedTaskId = ref(null);
    const selectedNicheForModal = ref(null);
    const selectedTask = computed(() => {
      const id = selectedTaskId.value;
      const niche = selectedNicheForModal.value;
      if (id == null || niche == null || niche === "") {
        return null;
      }
      const list = tasksByNiche(niche);
      return list.find((t2) => t2.id === id) ?? null;
    });
    const addModalVisible = ref(false);
    const showTaskModalRef = ref(null);
    function openShowTaskModal(task) {
      selectedTaskId.value = task.id;
      selectedNicheForModal.value = activeNiche.value;
      isModalOpen.value = true;
      void nextTick(() => {
        void nextTick(() => {
          var _a, _b;
          void ((_b = (_a = showTaskModalRef.value) == null ? void 0 : _a.tryAutoOpenPendingDrawerAfterDeepLink) == null ? void 0 : _b.call(_a));
        });
      });
    }
    async function tryConsumePendingDeepLink() {
      if (!task_grain_cooling.scenarioProcessAllowed) {
        return;
      }
      const grainCoolingStore = useGrainCoolingStore();
      if (!grainCoolingStore) {
        return;
      }
      const pending = grainCoolingStore.pendingDeepLink;
      if (!pending) {
        return;
      }
      const { taskId, niche } = pending;
      activeNiche.value = niche;
      await nextTick();
      await nextTick();
      const list = tasksByNiche(niche);
      const task = list.find((t2) => t2.id === taskId);
      grainCoolingStore.clearPendingDeepLink();
      if (task) {
        openShowTaskModal(task);
      }
    }
    registerGrainCoolingChecklistsDeepLinkWatcher(tryConsumePendingDeepLink);
    onActivated(() => {
      resetActiveNicheToFirst();
      void nextTick(() => {
        void tryConsumePendingDeepLink();
      });
    });
    const closeShowTaskModal = () => {
      isModalOpen.value = false;
      selectedTaskId.value = null;
      selectedNicheForModal.value = null;
    };
    const openAddModal = () => {
      addModalVisible.value = true;
    };
    const onConfirmRemoveTask = (taskId) => {
      removeChecklistTask(activeNiche.value, taskId);
      if (selectedTaskId.value === taskId) {
        closeShowTaskModal();
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checklists-section" }, _attrs))} data-v-bb0ad6b2><div class="checklists-toolbar" data-v-bb0ad6b2>`);
      _push(ssrRenderComponent(unref(Button), {
        type: "primary",
        class: "checklists-add-btn",
        size: "large",
        onClick: openAddModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.checklists.add"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.checklists.add")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(NTabs), {
        value: activeNiche.value,
        "onUpdate:value": ($event) => activeNiche.value = $event,
        type: "line",
        class: "checklists-section__tabs",
        animated: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(nicheTabs.value, (tab) => {
              _push2(ssrRenderComponent(unref(NTabPane), {
                key: tab.id,
                name: tab.id
              }, {
                tab: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="checklists-section__tab-label" data-v-bb0ad6b2${_scopeId2}>${ssrInterpolate(tab.label)} <span class="checklists-section__tab-emoji" aria-hidden="true" data-v-bb0ad6b2${_scopeId2}>${ssrInterpolate(nicheEmoji(tab.id))}</span></span>`);
                  } else {
                    return [
                      createVNode("span", { class: "checklists-section__tab-label" }, [
                        createTextVNode(toDisplayString(tab.label) + " ", 1),
                        createVNode("span", {
                          class: "checklists-section__tab-emoji",
                          "aria-hidden": "true"
                        }, toDisplayString(nicheEmoji(tab.id)), 1)
                      ])
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (!tasksByNiche(tab.id).length) {
                      _push3(`<div class="checklists-empty" data-v-bb0ad6b2${_scopeId2}>${ssrInterpolate(unref(t)("demo.checklists.empty_state"))}</div>`);
                    } else {
                      _push3(`<div class="checklists-grid" data-v-bb0ad6b2${_scopeId2}><!--[-->`);
                      ssrRenderList(tasksByNiche(tab.id), (task) => {
                        _push3(ssrRenderComponent(TaskCard, {
                          key: task.id,
                          task,
                          staff: __props.staff,
                          mode: "checklists",
                          "show-delete-action": true,
                          onSelect: openShowTaskModal,
                          onRemove: onConfirmRemoveTask
                        }, null, _parent3, _scopeId2));
                      });
                      _push3(`<!--]--></div>`);
                    }
                  } else {
                    return [
                      !tasksByNiche(tab.id).length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "checklists-empty"
                      }, toDisplayString(unref(t)("demo.checklists.empty_state")), 1)) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "checklists-grid"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(tasksByNiche(tab.id), (task) => {
                          return openBlock(), createBlock(TaskCard, {
                            key: task.id,
                            task,
                            staff: __props.staff,
                            mode: "checklists",
                            "show-delete-action": true,
                            onSelect: openShowTaskModal,
                            onRemove: onConfirmRemoveTask
                          }, null, 8, ["task", "staff"]);
                        }), 128))
                      ]))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(nicheTabs.value, (tab) => {
                return openBlock(), createBlock(unref(NTabPane), {
                  key: tab.id,
                  name: tab.id
                }, {
                  tab: withCtx(() => [
                    createVNode("span", { class: "checklists-section__tab-label" }, [
                      createTextVNode(toDisplayString(tab.label) + " ", 1),
                      createVNode("span", {
                        class: "checklists-section__tab-emoji",
                        "aria-hidden": "true"
                      }, toDisplayString(nicheEmoji(tab.id)), 1)
                    ])
                  ]),
                  default: withCtx(() => [
                    !tasksByNiche(tab.id).length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "checklists-empty"
                    }, toDisplayString(unref(t)("demo.checklists.empty_state")), 1)) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "checklists-grid"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(tasksByNiche(tab.id), (task) => {
                        return openBlock(), createBlock(TaskCard, {
                          key: task.id,
                          task,
                          staff: __props.staff,
                          mode: "checklists",
                          "show-delete-action": true,
                          onSelect: openShowTaskModal,
                          onRemove: onConfirmRemoveTask
                        }, null, 8, ["task", "staff"]);
                      }), 128))
                    ]))
                  ]),
                  _: 2
                }, 1032, ["name"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(CreateTaskModal, {
        show: addModalVisible.value,
        "onUpdate:show": ($event) => addModalVisible.value = $event,
        "active-niche": activeNiche.value,
        staff: __props.staff
      }, null, _parent));
      if (isModalOpen.value) {
        _push(ssrRenderComponent(ShowTaskModal, {
          ref_key: "showTaskModalRef",
          ref: showTaskModalRef,
          show: isModalOpen.value,
          task: selectedTask.value,
          "task-type": selectedNicheForModal.value ?? activeNiche.value,
          staff: __props.staff,
          onClose: closeShowTaskModal
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/sections/ChecklistsSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ChecklistsSection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-bb0ad6b2"]]);
const _sfc_main$5 = /* @__PURE__ */ Object.assign({ name: "CreateEditStaffModal" }, {
  __name: "CreateEditStaffModal",
  __ssrInlineRender: true,
  props: {
    /** Площадка по умолчанию для режима «Новый сотрудник» (активный таб секции). */
    defaultSiteId: {
      type: String,
      default: ""
    }
  },
  setup(__props, { expose: __expose }) {
    const { t } = useI18n();
    const props = __props;
    const message = useMessage();
    const { demoState, addStaff, updateStaff } = useDemoState();
    const modalCardStyle = {
      width: "520px",
      maxWidth: "calc(100vw - 32px)"
    };
    const sites = computed(() => demoState.value.sites ?? []);
    const siteOptions = computed(
      () => sites.value.map((s) => ({
        label: `${s.name} ${siteEmojiForDemo(s.id)}`.trim(),
        value: s.id
      }))
    );
    const modalShow = ref(false);
    const editTarget = ref(null);
    const submitLoading = ref(false);
    const editingId = ref(null);
    const siteSelectResetKey = ref(0);
    const formRef = ref(null);
    const form = ref({
      siteId: "",
      fullName: "",
      role: "",
      phone: "",
      email: "",
      active: true
    });
    const rules = {
      siteId: {
        required: true,
        message: () => t("demo.staff_modal.fill_required"),
        trigger: ["blur", "change"]
      },
      fullName: {
        required: true,
        whitespace: true,
        message: () => t("demo.staff_modal.fill_required"),
        trigger: ["blur", "input"]
      },
      role: {
        required: true,
        whitespace: true,
        message: () => t("demo.staff_modal.fill_required"),
        trigger: ["blur", "input"]
      }
    };
    const modalTitle = computed(
      () => editingId.value ? t("demo.staff_modal.title_edit") : t("demo.staff_modal.title_create")
    );
    const emptyForm = () => {
      var _a;
      return {
        siteId: props.defaultSiteId || ((_a = sites.value[0]) == null ? void 0 : _a.id) || "",
        fullName: "",
        role: "",
        phone: "",
        email: "",
        active: true
      };
    };
    const applyFormFromEditTarget = () => {
      const m = editTarget.value;
      if (m && typeof m === "object" && m.id) {
        editingId.value = m.id;
        form.value = {
          siteId: m.siteId,
          fullName: m.fullName,
          role: m.role,
          phone: m.phone ?? "",
          email: m.email ?? "",
          active: m.active !== false
        };
        return;
      }
      editingId.value = null;
      form.value = emptyForm();
    };
    watch(
      () => modalShow.value,
      async (visible) => {
        var _a, _b;
        if (!visible) {
          return;
        }
        applyFormFromEditTarget();
        await nextTick();
        if (!editingId.value) {
          form.value.siteId = props.defaultSiteId || ((_a = sites.value[0]) == null ? void 0 : _a.id) || "";
        }
        siteSelectResetKey.value += 1;
        (_b = formRef.value) == null ? void 0 : _b.restoreValidation();
      }
    );
    watch(
      () => props.defaultSiteId,
      () => {
        var _a;
        if (modalShow.value && !editingId.value) {
          form.value.siteId = props.defaultSiteId || ((_a = sites.value[0]) == null ? void 0 : _a.id) || "";
        }
      }
    );
    const onModalAfterLeave = () => {
      var _a;
      editingId.value = null;
      editTarget.value = null;
      form.value = emptyForm();
      (_a = formRef.value) == null ? void 0 : _a.restoreValidation();
    };
    const submitForm = () => {
      var _a;
      (_a = formRef.value) == null ? void 0 : _a.validate((errors) => {
        if (errors) {
          message.warning(t("demo.staff_modal.validation_required"));
          return;
        }
        submitLoading.value = true;
        try {
          if (editingId.value) {
            const ok = updateStaff({
              id: editingId.value,
              siteId: form.value.siteId,
              fullName: form.value.fullName,
              role: form.value.role,
              phone: form.value.phone || void 0,
              email: form.value.email || void 0,
              active: form.value.active
            });
            if (!ok) {
              message.error(t("demo.staff_modal.save_error"));
              return;
            }
            message.success(t("demo.staff_modal.save_success"));
          } else {
            const id = addStaff({
              siteId: form.value.siteId,
              fullName: form.value.fullName,
              role: form.value.role,
              phone: form.value.phone || void 0,
              email: form.value.email || void 0,
              active: form.value.active
            });
            if (!id) {
              message.error(t("demo.staff_modal.save_error"));
              return;
            }
            message.success(t("demo.staff_modal.add_success"));
          }
          modalShow.value = false;
        } finally {
          submitLoading.value = false;
        }
      }).catch(() => {
      });
    };
    function openCreate() {
      editTarget.value = null;
      modalShow.value = true;
    }
    function openEdit(member) {
      editTarget.value = member;
      modalShow.value = true;
    }
    __expose({ openCreate, openEdit });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NModal), mergeProps({
        show: modalShow.value,
        "onUpdate:show": ($event) => modalShow.value = $event,
        preset: "card",
        class: "create-edit-staff-modal",
        title: modalTitle.value,
        style: modalCardStyle,
        segmented: { content: true, footer: true },
        onAfterLeave: onModalAfterLeave
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="create-edit-staff-modal__footer" data-v-e7e49f24${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              type: "warning",
              onClick: ($event) => modalShow.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("demo.staff_modal.cancel"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("demo.staff_modal.cancel")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              type: "info",
              loading: submitLoading.value,
              onClick: submitForm
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("demo.staff_modal.save"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("demo.staff_modal.save")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "create-edit-staff-modal__footer" }, [
                createVNode(unref(Button), {
                  type: "warning",
                  onClick: ($event) => modalShow.value = false
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("demo.staff_modal.cancel")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(unref(Button), {
                  type: "info",
                  loading: submitLoading.value,
                  onClick: submitForm
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("demo.staff_modal.save")), 1)
                  ]),
                  _: 1
                }, 8, ["loading"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(NForm), {
              ref_key: "formRef",
              ref: formRef,
              class: "create-edit-staff-modal__form",
              model: form.value,
              rules,
              "label-placement": "top",
              "label-width": "auto"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.site"),
                    path: "siteId",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(NSelect), {
                          key: siteSelectResetKey.value,
                          value: form.value.siteId,
                          "onUpdate:value": ($event) => form.value.siteId = $event,
                          options: siteOptions.value
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          (openBlock(), createBlock(unref(NSelect), {
                            key: siteSelectResetKey.value,
                            value: form.value.siteId,
                            "onUpdate:value": ($event) => form.value.siteId = $event,
                            options: siteOptions.value
                          }, null, 8, ["value", "onUpdate:value", "options"]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.full_name"),
                    path: "fullName",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(NInput), {
                          value: form.value.fullName,
                          "onUpdate:value": ($event) => form.value.fullName = $event,
                          placeholder: unref(t)("demo.staff_modal.full_name_placeholder")
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(NInput), {
                            value: form.value.fullName,
                            "onUpdate:value": ($event) => form.value.fullName = $event,
                            placeholder: unref(t)("demo.staff_modal.full_name_placeholder")
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.role"),
                    path: "role",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(NInput), {
                          value: form.value.role,
                          "onUpdate:value": ($event) => form.value.role = $event,
                          placeholder: unref(t)("demo.staff_modal.role_placeholder")
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(NInput), {
                            value: form.value.role,
                            "onUpdate:value": ($event) => form.value.role = $event,
                            placeholder: unref(t)("demo.staff_modal.role_placeholder")
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.phone"),
                    path: "phone"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(NInput), {
                          value: form.value.phone,
                          "onUpdate:value": ($event) => form.value.phone = $event,
                          placeholder: unref(t)("demo.staff_modal.phone_placeholder")
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(NInput), {
                            value: form.value.phone,
                            "onUpdate:value": ($event) => form.value.phone = $event,
                            placeholder: unref(t)("demo.staff_modal.phone_placeholder")
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.email"),
                    path: "email"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(NInput), {
                          value: form.value.email,
                          "onUpdate:value": ($event) => form.value.email = $event,
                          placeholder: unref(t)("demo.staff_modal.email_placeholder")
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(NInput), {
                            value: form.value.email,
                            "onUpdate:value": ($event) => form.value.email = $event,
                            placeholder: unref(t)("demo.staff_modal.email_placeholder")
                          }, null, 8, ["value", "onUpdate:value", "placeholder"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.active"),
                    path: "active"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(NSwitch), {
                          value: form.value.active,
                          "onUpdate:value": ($event) => form.value.active = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(NSwitch), {
                            value: form.value.active,
                            "onUpdate:value": ($event) => form.value.active = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(NFormItem), {
                      label: unref(t)("demo.staff_modal.site"),
                      path: "siteId",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(unref(NSelect), {
                          key: siteSelectResetKey.value,
                          value: form.value.siteId,
                          "onUpdate:value": ($event) => form.value.siteId = $event,
                          options: siteOptions.value
                        }, null, 8, ["value", "onUpdate:value", "options"]))
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(unref(NFormItem), {
                      label: unref(t)("demo.staff_modal.full_name"),
                      path: "fullName",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: form.value.fullName,
                          "onUpdate:value": ($event) => form.value.fullName = $event,
                          placeholder: unref(t)("demo.staff_modal.full_name_placeholder")
                        }, null, 8, ["value", "onUpdate:value", "placeholder"])
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(unref(NFormItem), {
                      label: unref(t)("demo.staff_modal.role"),
                      path: "role",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: form.value.role,
                          "onUpdate:value": ($event) => form.value.role = $event,
                          placeholder: unref(t)("demo.staff_modal.role_placeholder")
                        }, null, 8, ["value", "onUpdate:value", "placeholder"])
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(unref(NFormItem), {
                      label: unref(t)("demo.staff_modal.phone"),
                      path: "phone"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: form.value.phone,
                          "onUpdate:value": ($event) => form.value.phone = $event,
                          placeholder: unref(t)("demo.staff_modal.phone_placeholder")
                        }, null, 8, ["value", "onUpdate:value", "placeholder"])
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(unref(NFormItem), {
                      label: unref(t)("demo.staff_modal.email"),
                      path: "email"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: form.value.email,
                          "onUpdate:value": ($event) => form.value.email = $event,
                          placeholder: unref(t)("demo.staff_modal.email_placeholder")
                        }, null, 8, ["value", "onUpdate:value", "placeholder"])
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(unref(NFormItem), {
                      label: unref(t)("demo.staff_modal.active"),
                      path: "active"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NSwitch), {
                          value: form.value.active,
                          "onUpdate:value": ($event) => form.value.active = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }, 8, ["label"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(NForm), {
                ref_key: "formRef",
                ref: formRef,
                class: "create-edit-staff-modal__form",
                model: form.value,
                rules,
                "label-placement": "top",
                "label-width": "auto"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.site"),
                    path: "siteId",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock(unref(NSelect), {
                        key: siteSelectResetKey.value,
                        value: form.value.siteId,
                        "onUpdate:value": ($event) => form.value.siteId = $event,
                        options: siteOptions.value
                      }, null, 8, ["value", "onUpdate:value", "options"]))
                    ]),
                    _: 1
                  }, 8, ["label"]),
                  createVNode(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.full_name"),
                    path: "fullName",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.fullName,
                        "onUpdate:value": ($event) => form.value.fullName = $event,
                        placeholder: unref(t)("demo.staff_modal.full_name_placeholder")
                      }, null, 8, ["value", "onUpdate:value", "placeholder"])
                    ]),
                    _: 1
                  }, 8, ["label"]),
                  createVNode(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.role"),
                    path: "role",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.role,
                        "onUpdate:value": ($event) => form.value.role = $event,
                        placeholder: unref(t)("demo.staff_modal.role_placeholder")
                      }, null, 8, ["value", "onUpdate:value", "placeholder"])
                    ]),
                    _: 1
                  }, 8, ["label"]),
                  createVNode(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.phone"),
                    path: "phone"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.phone,
                        "onUpdate:value": ($event) => form.value.phone = $event,
                        placeholder: unref(t)("demo.staff_modal.phone_placeholder")
                      }, null, 8, ["value", "onUpdate:value", "placeholder"])
                    ]),
                    _: 1
                  }, 8, ["label"]),
                  createVNode(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.email"),
                    path: "email"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.email,
                        "onUpdate:value": ($event) => form.value.email = $event,
                        placeholder: unref(t)("demo.staff_modal.email_placeholder")
                      }, null, 8, ["value", "onUpdate:value", "placeholder"])
                    ]),
                    _: 1
                  }, 8, ["label"]),
                  createVNode(unref(NFormItem), {
                    label: unref(t)("demo.staff_modal.active"),
                    path: "active"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSwitch), {
                        value: form.value.active,
                        "onUpdate:value": ($event) => form.value.active = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }, 8, ["label"])
                ]),
                _: 1
              }, 8, ["model"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/create_edit_staff/CreateEditStaffModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const CreateEditStaffModal = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-e7e49f24"]]);
const _sfc_main$4 = /* @__PURE__ */ Object.assign({ name: "PersonnelSection" }, {
  __name: "PersonnelSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const personnelSectionText = computed(() => ({
      add: t("demo.personnel.add"),
      colFullName: t("demo.personnel.col_full_name"),
      colRole: t("demo.personnel.col_role"),
      colPhone: t("demo.personnel.col_phone"),
      colEmail: t("demo.personnel.col_email"),
      colStatus: t("demo.personnel.col_status"),
      labelFullName: t("demo.personnel.label_full_name"),
      labelRole: t("demo.personnel.label_role"),
      labelPhone: t("demo.personnel.label_phone"),
      labelEmail: t("demo.personnel.label_email"),
      labelStatus: t("demo.personnel.label_status"),
      empty: t("demo.personnel.empty"),
      statusActive: t("demo.personnel.status_active"),
      statusInactive: t("demo.personnel.status_inactive"),
      edit: t("demo.personnel.edit"),
      delete: t("demo.personnel.delete"),
      cancel: t("demo.personnel.cancel"),
      removeConfirmBase: "demo.personnel.remove_confirm_base",
      removeConfirmWithTasks: "demo.personnel.remove_confirm_with_tasks",
      removeSuccess: t("demo.personnel.remove_success")
    }));
    const message = useMessage();
    const { demoState, removeStaff } = useDemoState();
    const sites = computed(() => demoState.value.sites ?? []);
    const activeSiteId = ref("");
    const siteEmoji = siteEmojiForDemo;
    const staffModalRef = ref(null);
    function resetActiveSiteToFirst() {
      const list = sites.value;
      if (!list.length) {
        activeSiteId.value = "";
        return;
      }
      activeSiteId.value = list[0].id;
    }
    watch(
      sites,
      (list) => {
        if (!list.length) {
          activeSiteId.value = "";
          return;
        }
        if (!list.some((s) => s.id === activeSiteId.value)) {
          activeSiteId.value = list[0].id;
        }
      },
      { immediate: true }
    );
    onActivated(() => {
      resetActiveSiteToFirst();
    });
    const staffBySite = (siteId) => demoState.value.staff.filter((m) => m.siteId === siteId);
    const countAssignedTasks = (staffId) => {
      let n = 0;
      for (const tasks of Object.values(
        demoState.value.checklistsByNiche ?? {}
      )) {
        for (const t2 of tasks) {
          if (t2.assignedStaffId === staffId) {
            n += 1;
          }
        }
      }
      return n;
    };
    const removeConfirmText = (member) => {
      const n = countAssignedTasks(member.id);
      const base = t(personnelSectionText.value.removeConfirmBase, { name: member.fullName });
      if (n === 0) {
        return base;
      }
      return `${base} ${t(personnelSectionText.value.removeConfirmWithTasks, { n: String(n) })}`;
    };
    const onConfirmRemove = (member) => {
      removeStaff(member.id);
      message.success(personnelSectionText.value.removeSuccess);
    };
    const openCreateModal = () => {
      var _a;
      (_a = staffModalRef.value) == null ? void 0 : _a.openCreate();
    };
    const openEditModal = (member) => {
      var _a;
      (_a = staffModalRef.value) == null ? void 0 : _a.openEdit(member);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "personnel-section" }, _attrs))} data-v-41558d20><div class="personnel-section__toolbar" data-v-41558d20>`);
      _push(ssrRenderComponent(unref(Button), {
        type: "primary",
        size: "large",
        onClick: openCreateModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(personnelSectionText.value.add)}`);
          } else {
            return [
              createTextVNode(toDisplayString(personnelSectionText.value.add), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(NTabs), {
        value: activeSiteId.value,
        "onUpdate:value": ($event) => activeSiteId.value = $event,
        type: "line",
        class: "personnel-section__tabs",
        animated: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(sites.value, (site) => {
              _push2(ssrRenderComponent(unref(NTabPane), {
                key: site.id,
                name: site.id
              }, {
                tab: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="personnel-section__tab-label" data-v-41558d20${_scopeId2}>${ssrInterpolate(site.name)} <span class="personnel-section__tab-emoji" aria-hidden="true" data-v-41558d20${_scopeId2}>${ssrInterpolate(unref(siteEmoji)(site.id))}</span></span>`);
                  } else {
                    return [
                      createVNode("span", { class: "personnel-section__tab-label" }, [
                        createTextVNode(toDisplayString(site.name) + " ", 1),
                        createVNode("span", {
                          class: "personnel-section__tab-emoji",
                          "aria-hidden": "true"
                        }, toDisplayString(unref(siteEmoji)(site.id)), 1)
                      ])
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (site.address) {
                      _push3(`<p class="personnel-section__site-address" data-v-41558d20${_scopeId2}>${ssrInterpolate(site.address)}</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div class="personnel-section__desktop" data-v-41558d20${_scopeId2}><div class="personnel-section__table-wrap" data-v-41558d20${_scopeId2}><table class="personnel-section__table" data-v-41558d20${_scopeId2}><thead data-v-41558d20${_scopeId2}><tr data-v-41558d20${_scopeId2}><th data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.colFullName)}</th><th data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.colRole)}</th><th data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.colPhone)}</th><th data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.colEmail)}</th><th data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.colStatus)}</th><th data-v-41558d20${_scopeId2}></th></tr></thead><tbody data-v-41558d20${_scopeId2}><!--[-->`);
                    ssrRenderList(staffBySite(site.id), (member) => {
                      _push3(`<tr data-v-41558d20${_scopeId2}><td data-v-41558d20${_scopeId2}>${ssrInterpolate(member.fullName)}</td><td data-v-41558d20${_scopeId2}>${ssrInterpolate(member.role)}</td><td data-v-41558d20${_scopeId2}>${ssrInterpolate(member.phone || personnelSectionText.value.empty)}</td><td data-v-41558d20${_scopeId2}>${ssrInterpolate(member.email || personnelSectionText.value.empty)}</td><td data-v-41558d20${_scopeId2}><span class="${ssrRenderClass([
                        member.active === false ? "personnel-section__status--inactive" : "personnel-section__status--active",
                        "personnel-section__status"
                      ])}" data-v-41558d20${_scopeId2}>${ssrInterpolate(member.active === false ? personnelSectionText.value.statusInactive : personnelSectionText.value.statusActive)}</span></td><td class="personnel-section__actions" data-v-41558d20${_scopeId2}><div class="box-button" data-v-41558d20${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Button), {
                        type: "info",
                        class: "personnel-section__action-btn",
                        size: "large",
                        onClick: ($event) => openEditModal(member)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(personnelSectionText.value.edit)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(personnelSectionText.value.edit), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(NPopconfirm), {
                        "positive-text": personnelSectionText.value.delete,
                        "negative-text": personnelSectionText.value.cancel,
                        "positive-button-props": {
                          type: "info"
                        },
                        "negative-button-props": {
                          type: "warning"
                        },
                        onPositiveClick: () => onConfirmRemove(member)
                      }, {
                        trigger: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Button), {
                              type: "error",
                              class: "personnel-section__action-btn",
                              size: "large"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(personnelSectionText.value.delete)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(personnelSectionText.value.delete), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(Button), {
                                type: "error",
                                class: "personnel-section__action-btn",
                                size: "large"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(personnelSectionText.value.delete), 1)
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` ${ssrInterpolate(removeConfirmText(member))}`);
                          } else {
                            return [
                              createTextVNode(" " + toDisplayString(removeConfirmText(member)), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div></td></tr>`);
                    });
                    _push3(`<!--]--></tbody></table></div></div><div class="personnel-section__mobile" data-v-41558d20${_scopeId2}><!--[-->`);
                    ssrRenderList(staffBySite(site.id), (member) => {
                      _push3(`<article class="personnel-card" data-v-41558d20${_scopeId2}><p class="personnel-card__line" data-v-41558d20${_scopeId2}><span class="personnel-card__label" data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.labelFullName)}</span> ${ssrInterpolate(member.fullName)}</p><p class="personnel-card__line" data-v-41558d20${_scopeId2}><span class="personnel-card__label" data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.labelRole)}</span> ${ssrInterpolate(member.role)}</p><p class="personnel-card__line" data-v-41558d20${_scopeId2}><span class="personnel-card__label" data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.labelPhone)}</span> ${ssrInterpolate(member.phone || personnelSectionText.value.empty)}</p><p class="personnel-card__line" data-v-41558d20${_scopeId2}><span class="personnel-card__label" data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.labelEmail)}</span> ${ssrInterpolate(member.email || personnelSectionText.value.empty)}</p><p class="personnel-card__line personnel-card__line--status" data-v-41558d20${_scopeId2}><span class="personnel-card__label" data-v-41558d20${_scopeId2}>${ssrInterpolate(personnelSectionText.value.labelStatus)}</span><span class="${ssrRenderClass([
                        member.active === false ? "personnel-section__status--inactive" : "personnel-section__status--active",
                        "personnel-section__status"
                      ])}" data-v-41558d20${_scopeId2}>${ssrInterpolate(member.active === false ? personnelSectionText.value.statusInactive : personnelSectionText.value.statusActive)}</span></p><div class="personnel-card__actions" data-v-41558d20${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Button), {
                        type: "info",
                        block: "",
                        class: "personnel-section__action-btn",
                        size: "large",
                        onClick: ($event) => openEditModal(member)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(personnelSectionText.value.edit)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(personnelSectionText.value.edit), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(NPopconfirm), {
                        "positive-text": personnelSectionText.value.delete,
                        "negative-text": personnelSectionText.value.cancel,
                        "positive-button-props": { type: "info" },
                        "negative-button-props": { type: "warning" },
                        onPositiveClick: () => onConfirmRemove(member)
                      }, {
                        trigger: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Button), {
                              type: "error",
                              block: "",
                              class: "personnel-section__action-btn",
                              size: "large"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(personnelSectionText.value.delete)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(personnelSectionText.value.delete), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(Button), {
                                type: "error",
                                block: "",
                                class: "personnel-section__action-btn",
                                size: "large"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(personnelSectionText.value.delete), 1)
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` ${ssrInterpolate(removeConfirmText(member))}`);
                          } else {
                            return [
                              createTextVNode(" " + toDisplayString(removeConfirmText(member)), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div></article>`);
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    return [
                      site.address ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "personnel-section__site-address"
                      }, toDisplayString(site.address), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "personnel-section__desktop" }, [
                        createVNode("div", { class: "personnel-section__table-wrap" }, [
                          createVNode("table", { class: "personnel-section__table" }, [
                            createVNode("thead", null, [
                              createVNode("tr", null, [
                                createVNode("th", null, toDisplayString(personnelSectionText.value.colFullName), 1),
                                createVNode("th", null, toDisplayString(personnelSectionText.value.colRole), 1),
                                createVNode("th", null, toDisplayString(personnelSectionText.value.colPhone), 1),
                                createVNode("th", null, toDisplayString(personnelSectionText.value.colEmail), 1),
                                createVNode("th", null, toDisplayString(personnelSectionText.value.colStatus), 1),
                                createVNode("th")
                              ])
                            ]),
                            createVNode("tbody", null, [
                              (openBlock(true), createBlock(Fragment, null, renderList(staffBySite(site.id), (member) => {
                                return openBlock(), createBlock("tr", {
                                  key: member.id
                                }, [
                                  createVNode("td", null, toDisplayString(member.fullName), 1),
                                  createVNode("td", null, toDisplayString(member.role), 1),
                                  createVNode("td", null, toDisplayString(member.phone || personnelSectionText.value.empty), 1),
                                  createVNode("td", null, toDisplayString(member.email || personnelSectionText.value.empty), 1),
                                  createVNode("td", null, [
                                    createVNode("span", {
                                      class: [
                                        "personnel-section__status",
                                        member.active === false ? "personnel-section__status--inactive" : "personnel-section__status--active"
                                      ]
                                    }, toDisplayString(member.active === false ? personnelSectionText.value.statusInactive : personnelSectionText.value.statusActive), 3)
                                  ]),
                                  createVNode("td", { class: "personnel-section__actions" }, [
                                    createVNode("div", { class: "box-button" }, [
                                      createVNode(unref(Button), {
                                        type: "info",
                                        class: "personnel-section__action-btn",
                                        size: "large",
                                        onClick: ($event) => openEditModal(member)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(personnelSectionText.value.edit), 1)
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(unref(NPopconfirm), {
                                        "positive-text": personnelSectionText.value.delete,
                                        "negative-text": personnelSectionText.value.cancel,
                                        "positive-button-props": {
                                          type: "info"
                                        },
                                        "negative-button-props": {
                                          type: "warning"
                                        },
                                        onPositiveClick: () => onConfirmRemove(member)
                                      }, {
                                        trigger: withCtx(() => [
                                          createVNode(unref(Button), {
                                            type: "error",
                                            class: "personnel-section__action-btn",
                                            size: "large"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(personnelSectionText.value.delete), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        default: withCtx(() => [
                                          createTextVNode(" " + toDisplayString(removeConfirmText(member)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["positive-text", "negative-text", "onPositiveClick"])
                                    ])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "personnel-section__mobile" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(staffBySite(site.id), (member) => {
                          return openBlock(), createBlock("article", {
                            key: member.id,
                            class: "personnel-card"
                          }, [
                            createVNode("p", { class: "personnel-card__line" }, [
                              createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelFullName), 1),
                              createTextVNode(" " + toDisplayString(member.fullName), 1)
                            ]),
                            createVNode("p", { class: "personnel-card__line" }, [
                              createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelRole), 1),
                              createTextVNode(" " + toDisplayString(member.role), 1)
                            ]),
                            createVNode("p", { class: "personnel-card__line" }, [
                              createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelPhone), 1),
                              createTextVNode(" " + toDisplayString(member.phone || personnelSectionText.value.empty), 1)
                            ]),
                            createVNode("p", { class: "personnel-card__line" }, [
                              createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelEmail), 1),
                              createTextVNode(" " + toDisplayString(member.email || personnelSectionText.value.empty), 1)
                            ]),
                            createVNode("p", { class: "personnel-card__line personnel-card__line--status" }, [
                              createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelStatus), 1),
                              createVNode("span", {
                                class: [
                                  "personnel-section__status",
                                  member.active === false ? "personnel-section__status--inactive" : "personnel-section__status--active"
                                ]
                              }, toDisplayString(member.active === false ? personnelSectionText.value.statusInactive : personnelSectionText.value.statusActive), 3)
                            ]),
                            createVNode("div", { class: "personnel-card__actions" }, [
                              createVNode(unref(Button), {
                                type: "info",
                                block: "",
                                class: "personnel-section__action-btn",
                                size: "large",
                                onClick: ($event) => openEditModal(member)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(personnelSectionText.value.edit), 1)
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(unref(NPopconfirm), {
                                "positive-text": personnelSectionText.value.delete,
                                "negative-text": personnelSectionText.value.cancel,
                                "positive-button-props": { type: "info" },
                                "negative-button-props": { type: "warning" },
                                onPositiveClick: () => onConfirmRemove(member)
                              }, {
                                trigger: withCtx(() => [
                                  createVNode(unref(Button), {
                                    type: "error",
                                    block: "",
                                    class: "personnel-section__action-btn",
                                    size: "large"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(personnelSectionText.value.delete), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                default: withCtx(() => [
                                  createTextVNode(" " + toDisplayString(removeConfirmText(member)), 1)
                                ]),
                                _: 2
                              }, 1032, ["positive-text", "negative-text", "onPositiveClick"])
                            ])
                          ]);
                        }), 128))
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(sites.value, (site) => {
                return openBlock(), createBlock(unref(NTabPane), {
                  key: site.id,
                  name: site.id
                }, {
                  tab: withCtx(() => [
                    createVNode("span", { class: "personnel-section__tab-label" }, [
                      createTextVNode(toDisplayString(site.name) + " ", 1),
                      createVNode("span", {
                        class: "personnel-section__tab-emoji",
                        "aria-hidden": "true"
                      }, toDisplayString(unref(siteEmoji)(site.id)), 1)
                    ])
                  ]),
                  default: withCtx(() => [
                    site.address ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "personnel-section__site-address"
                    }, toDisplayString(site.address), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "personnel-section__desktop" }, [
                      createVNode("div", { class: "personnel-section__table-wrap" }, [
                        createVNode("table", { class: "personnel-section__table" }, [
                          createVNode("thead", null, [
                            createVNode("tr", null, [
                              createVNode("th", null, toDisplayString(personnelSectionText.value.colFullName), 1),
                              createVNode("th", null, toDisplayString(personnelSectionText.value.colRole), 1),
                              createVNode("th", null, toDisplayString(personnelSectionText.value.colPhone), 1),
                              createVNode("th", null, toDisplayString(personnelSectionText.value.colEmail), 1),
                              createVNode("th", null, toDisplayString(personnelSectionText.value.colStatus), 1),
                              createVNode("th")
                            ])
                          ]),
                          createVNode("tbody", null, [
                            (openBlock(true), createBlock(Fragment, null, renderList(staffBySite(site.id), (member) => {
                              return openBlock(), createBlock("tr", {
                                key: member.id
                              }, [
                                createVNode("td", null, toDisplayString(member.fullName), 1),
                                createVNode("td", null, toDisplayString(member.role), 1),
                                createVNode("td", null, toDisplayString(member.phone || personnelSectionText.value.empty), 1),
                                createVNode("td", null, toDisplayString(member.email || personnelSectionText.value.empty), 1),
                                createVNode("td", null, [
                                  createVNode("span", {
                                    class: [
                                      "personnel-section__status",
                                      member.active === false ? "personnel-section__status--inactive" : "personnel-section__status--active"
                                    ]
                                  }, toDisplayString(member.active === false ? personnelSectionText.value.statusInactive : personnelSectionText.value.statusActive), 3)
                                ]),
                                createVNode("td", { class: "personnel-section__actions" }, [
                                  createVNode("div", { class: "box-button" }, [
                                    createVNode(unref(Button), {
                                      type: "info",
                                      class: "personnel-section__action-btn",
                                      size: "large",
                                      onClick: ($event) => openEditModal(member)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(personnelSectionText.value.edit), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(unref(NPopconfirm), {
                                      "positive-text": personnelSectionText.value.delete,
                                      "negative-text": personnelSectionText.value.cancel,
                                      "positive-button-props": {
                                        type: "info"
                                      },
                                      "negative-button-props": {
                                        type: "warning"
                                      },
                                      onPositiveClick: () => onConfirmRemove(member)
                                    }, {
                                      trigger: withCtx(() => [
                                        createVNode(unref(Button), {
                                          type: "error",
                                          class: "personnel-section__action-btn",
                                          size: "large"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(personnelSectionText.value.delete), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      default: withCtx(() => [
                                        createTextVNode(" " + toDisplayString(removeConfirmText(member)), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["positive-text", "negative-text", "onPositiveClick"])
                                  ])
                                ])
                              ]);
                            }), 128))
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "personnel-section__mobile" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(staffBySite(site.id), (member) => {
                        return openBlock(), createBlock("article", {
                          key: member.id,
                          class: "personnel-card"
                        }, [
                          createVNode("p", { class: "personnel-card__line" }, [
                            createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelFullName), 1),
                            createTextVNode(" " + toDisplayString(member.fullName), 1)
                          ]),
                          createVNode("p", { class: "personnel-card__line" }, [
                            createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelRole), 1),
                            createTextVNode(" " + toDisplayString(member.role), 1)
                          ]),
                          createVNode("p", { class: "personnel-card__line" }, [
                            createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelPhone), 1),
                            createTextVNode(" " + toDisplayString(member.phone || personnelSectionText.value.empty), 1)
                          ]),
                          createVNode("p", { class: "personnel-card__line" }, [
                            createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelEmail), 1),
                            createTextVNode(" " + toDisplayString(member.email || personnelSectionText.value.empty), 1)
                          ]),
                          createVNode("p", { class: "personnel-card__line personnel-card__line--status" }, [
                            createVNode("span", { class: "personnel-card__label" }, toDisplayString(personnelSectionText.value.labelStatus), 1),
                            createVNode("span", {
                              class: [
                                "personnel-section__status",
                                member.active === false ? "personnel-section__status--inactive" : "personnel-section__status--active"
                              ]
                            }, toDisplayString(member.active === false ? personnelSectionText.value.statusInactive : personnelSectionText.value.statusActive), 3)
                          ]),
                          createVNode("div", { class: "personnel-card__actions" }, [
                            createVNode(unref(Button), {
                              type: "info",
                              block: "",
                              class: "personnel-section__action-btn",
                              size: "large",
                              onClick: ($event) => openEditModal(member)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(personnelSectionText.value.edit), 1)
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(NPopconfirm), {
                              "positive-text": personnelSectionText.value.delete,
                              "negative-text": personnelSectionText.value.cancel,
                              "positive-button-props": { type: "info" },
                              "negative-button-props": { type: "warning" },
                              onPositiveClick: () => onConfirmRemove(member)
                            }, {
                              trigger: withCtx(() => [
                                createVNode(unref(Button), {
                                  type: "error",
                                  block: "",
                                  class: "personnel-section__action-btn",
                                  size: "large"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(personnelSectionText.value.delete), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              default: withCtx(() => [
                                createTextVNode(" " + toDisplayString(removeConfirmText(member)), 1)
                              ]),
                              _: 2
                            }, 1032, ["positive-text", "negative-text", "onPositiveClick"])
                          ])
                        ]);
                      }), 128))
                    ])
                  ]),
                  _: 2
                }, 1032, ["name"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(CreateEditStaffModal, {
        ref_key: "staffModalRef",
        ref: staffModalRef,
        "default-site-id": activeSiteId.value
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/sections/PersonnelSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const PersonnelSection = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-41558d20"]]);
const _sfc_main$3 = /* @__PURE__ */ Object.assign({ name: "EudrQrModal" }, {
  __name: "EudrQrModal",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      required: true
    },
    batch: {
      type: Object,
      default: null
    }
  },
  emits: ["close", "action"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const props = __props;
    const emit = __emit;
    const message = useMessage();
    const qrImageUrl = ref("");
    const copyField = ref(null);
    const batchPageLocale = computed(() => useCurrentLocale());
    const displayedBatchUrl = computed(
      () => {
        var _a;
        return ((_a = props.batch) == null ? void 0 : _a.id) ? buildBatchPublicUrl(String(props.batch.id), batchPageLocale.value) : "";
      }
    );
    const showModel = computed({
      get: () => props.show,
      set: (value) => {
        if (!value) {
          emit("close");
        }
      }
    });
    watch(
      () => {
        var _a;
        return [(_a = props.batch) == null ? void 0 : _a.id, displayedBatchUrl.value];
      },
      async (tuple) => {
        const id = tuple == null ? void 0 : tuple[0];
        const url = tuple == null ? void 0 : tuple[1];
        if (!id || !url) {
          qrImageUrl.value = "";
          return;
        }
        qrImageUrl.value = await QRCode.toDataURL(url, {
          width: 200,
          margin: 1
        });
      },
      { immediate: true }
    );
    const onVisibilityChange = (visible) => {
      if (!visible) {
        emit("close");
      }
    };
    const emitAction = (action) => {
      emit("action", action);
    };
    const resolveAbsoluteBatchUrl = () => {
      var _a;
      if (!((_a = props.batch) == null ? void 0 : _a.id)) {
        return "";
      }
      return displayedBatchUrl.value || buildBatchPublicUrl(props.batch.id, batchPageLocale.value);
    };
    const copyPageUrl = async () => {
      var _a;
      const href = resolveAbsoluteBatchUrl().trim();
      if (!href) {
        message.warning(t("demo.eudr_qr_modal.no_link"));
        return;
      }
      let ok = false;
      if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
        try {
          await navigator.clipboard.writeText(href);
          ok = true;
        } catch {
          ok = false;
        }
      }
      if (!ok && copyField.value) {
        const el = copyField.value;
        el.value = href;
        el.focus();
        el.select();
        el.setSelectionRange(0, href.length);
        try {
          ok = document.execCommand("copy");
        } catch {
          ok = false;
        }
      }
      if (ok) {
        message.success(t("demo.eudr_qr_modal.copy_success"));
        setTimeout(() => emit("close"), 0);
      } else {
        message.error(t("demo.eudr_qr_modal.copy_error"));
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NModal), mergeProps({
        show: showModel.value,
        "onUpdate:show": [($event) => showModel.value = $event, onVisibilityChange],
        preset: "card",
        title: unref(t)("demo.eudr_qr_modal.title"),
        class: "eudr-qr-modal",
        "content-scrollable": "",
        "trap-focus": false,
        style: { width: "600px", maxWidth: "calc(100vw - 32px)" },
        segmented: { content: true, footer: true }
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="eudr-qr-modal__actions" data-v-29f303b3${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              type: "warning",
              onClick: ($event) => emitAction("close")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("demo.eudr_qr_modal.cancel"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("demo.eudr_qr_modal.cancel")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              type: "info",
              onClick: copyPageUrl
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("demo.eudr_qr_modal.copy"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("demo.eudr_qr_modal.copy")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "eudr-qr-modal__actions" }, [
                createVNode(unref(Button), {
                  type: "warning",
                  onClick: ($event) => emitAction("close")
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("demo.eudr_qr_modal.cancel")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(unref(Button), {
                  type: "info",
                  onClick: copyPageUrl
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("demo.eudr_qr_modal.copy")), 1)
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.batch) {
              _push2(`<!--[--><textarea class="eudr-qr-modal__copy-field" tabindex="-1" aria-hidden="true" data-v-29f303b3${_scopeId}></textarea><div class="eudr-qr-modal__content" data-v-29f303b3${_scopeId}><h3 class="eudr-qr-modal__title" data-v-29f303b3${_scopeId}>${ssrInterpolate(__props.batch.id)}</h3><div class="eudr-qr-modal__table-wrap" data-v-29f303b3${_scopeId}><table class="eudr-qr-modal__table" data-v-29f303b3${_scopeId}><thead data-v-29f303b3${_scopeId}><tr data-v-29f303b3${_scopeId}><th data-v-29f303b3${_scopeId}>${ssrInterpolate(unref(t)("demo.eudr_qr_modal.col_parameter"))}</th><th data-v-29f303b3${_scopeId}>${ssrInterpolate(unref(t)("demo.eudr_qr_modal.col_value"))}</th></tr></thead><tbody data-v-29f303b3${_scopeId}><tr data-v-29f303b3${_scopeId}><td data-v-29f303b3${_scopeId}>${ssrInterpolate(unref(t)("demo.eudr_qr_modal.row_product"))}</td><td data-v-29f303b3${_scopeId}>${ssrInterpolate(__props.batch.product)}</td></tr><tr data-v-29f303b3${_scopeId}><td data-v-29f303b3${_scopeId}>${ssrInterpolate(unref(t)("demo.eudr_qr_modal.row_supplier"))}</td><td data-v-29f303b3${_scopeId}>${ssrInterpolate(__props.batch.supplier)}</td></tr><tr data-v-29f303b3${_scopeId}><td data-v-29f303b3${_scopeId}>${ssrInterpolate(unref(t)("demo.eudr_qr_modal.row_date"))}</td><td data-v-29f303b3${_scopeId}>${ssrInterpolate(__props.batch.date)}</td></tr><tr data-v-29f303b3${_scopeId}><td data-v-29f303b3${_scopeId}>${ssrInterpolate(unref(t)("demo.eudr_qr_modal.row_link"))}</td><td data-v-29f303b3${_scopeId}><a class="eudr-qr-modal__batch-link" target="_blank" rel="noopener noreferrer"${ssrRenderAttr("href", `/${batchPageLocale.value}/batch/${__props.batch.id}`)} data-v-29f303b3${_scopeId}>${ssrInterpolate(displayedBatchUrl.value)}</a></td></tr></tbody></table></div><div class="eudr-qr-modal__code" data-v-29f303b3${_scopeId}>`);
              if (qrImageUrl.value) {
                _push2(`<img${ssrRenderAttr("src", qrImageUrl.value)} alt="EUDR QR code" data-v-29f303b3${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.batch ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                createVNode("textarea", {
                  ref_key: "copyField",
                  ref: copyField,
                  class: "eudr-qr-modal__copy-field",
                  tabindex: "-1",
                  "aria-hidden": "true"
                }, null, 512),
                createVNode("div", { class: "eudr-qr-modal__content" }, [
                  createVNode("h3", { class: "eudr-qr-modal__title" }, toDisplayString(__props.batch.id), 1),
                  createVNode("div", { class: "eudr-qr-modal__table-wrap" }, [
                    createVNode("table", { class: "eudr-qr-modal__table" }, [
                      createVNode("thead", null, [
                        createVNode("tr", null, [
                          createVNode("th", null, toDisplayString(unref(t)("demo.eudr_qr_modal.col_parameter")), 1),
                          createVNode("th", null, toDisplayString(unref(t)("demo.eudr_qr_modal.col_value")), 1)
                        ])
                      ]),
                      createVNode("tbody", null, [
                        createVNode("tr", null, [
                          createVNode("td", null, toDisplayString(unref(t)("demo.eudr_qr_modal.row_product")), 1),
                          createVNode("td", null, toDisplayString(__props.batch.product), 1)
                        ]),
                        createVNode("tr", null, [
                          createVNode("td", null, toDisplayString(unref(t)("demo.eudr_qr_modal.row_supplier")), 1),
                          createVNode("td", null, toDisplayString(__props.batch.supplier), 1)
                        ]),
                        createVNode("tr", null, [
                          createVNode("td", null, toDisplayString(unref(t)("demo.eudr_qr_modal.row_date")), 1),
                          createVNode("td", null, toDisplayString(__props.batch.date), 1)
                        ]),
                        createVNode("tr", null, [
                          createVNode("td", null, toDisplayString(unref(t)("demo.eudr_qr_modal.row_link")), 1),
                          createVNode("td", null, [
                            createVNode("a", {
                              class: "eudr-qr-modal__batch-link",
                              target: "_blank",
                              rel: "noopener noreferrer",
                              href: `/${batchPageLocale.value}/batch/${__props.batch.id}`
                            }, toDisplayString(displayedBatchUrl.value), 9, ["href"])
                          ])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "eudr-qr-modal__code" }, [
                    qrImageUrl.value ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: qrImageUrl.value,
                      alt: "EUDR QR code"
                    }, null, 8, ["src"])) : createCommentVNode("", true)
                  ])
                ])
              ], 64)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/modals/EudrQrModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const EudrQrModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-29f303b3"]]);
const _sfc_main$2 = /* @__PURE__ */ Object.assign({ name: "EudrSection" }, {
  __name: "EudrSection",
  __ssrInlineRender: true,
  props: {
    batches: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const props = __props;
    const isQrModalOpen = ref(false);
    const selectedBatch = ref(null);
    const openQrModal = (batch) => {
      selectedBatch.value = batch;
      isQrModalOpen.value = true;
    };
    const closeQrModal = () => {
      isQrModalOpen.value = false;
      selectedBatch.value = null;
    };
    const handleQrAction = (action) => {
      closeQrModal();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "eudr-section" }, _attrs))} data-v-becddf3b><div class="eudr-section__desktop" data-v-becddf3b><div class="eudr-table-wrap" data-v-becddf3b><table class="eudr-table" data-v-becddf3b><thead data-v-becddf3b><tr data-v-becddf3b><th data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_id"))}</th><th data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_product"))}</th><th data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_supplier"))}</th><th data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_date"))}</th><th data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_status"))}</th><th data-v-becddf3b></th></tr></thead><tbody data-v-becddf3b><!--[-->`);
      ssrRenderList(props.batches, (batch) => {
        _push(`<tr data-v-becddf3b><td data-v-becddf3b>${ssrInterpolate(batch.id)}</td><td data-v-becddf3b>${ssrInterpolate(batch.product)}</td><td data-v-becddf3b>${ssrInterpolate(batch.supplier)}</td><td data-v-becddf3b>${ssrInterpolate(batch.date)}</td><td data-v-becddf3b><span class="${ssrRenderClass([`eudr-status--${batch.status}`, "eudr-status"])}" data-v-becddf3b>${ssrInterpolate(batch.statusLabel)}</span></td><td data-v-becddf3b>`);
        _push(ssrRenderComponent(unref(Button), {
          type: "info",
          onClick: ($event) => openQrModal(batch)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("demo.eudr.show_qr"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("demo.eudr.show_qr")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div><div class="eudr-section__mobile" data-v-becddf3b><!--[-->`);
      ssrRenderList(props.batches, (batch) => {
        _push(`<article class="eudr-card" data-v-becddf3b><p class="eudr-card__line" data-v-becddf3b><span class="eudr-card__label" data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_id"))}:</span> ${ssrInterpolate(batch.id)}</p><p class="eudr-card__line" data-v-becddf3b><span class="eudr-card__label" data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_product"))}:</span> ${ssrInterpolate(batch.product)}</p><p class="eudr-card__line" data-v-becddf3b><span class="eudr-card__label" data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_supplier"))}:</span> ${ssrInterpolate(batch.supplier)}</p><p class="eudr-card__line" data-v-becddf3b><span class="eudr-card__label" data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_date"))}:</span> ${ssrInterpolate(batch.date)}</p><p class="eudr-card__line eudr-card__line--status" data-v-becddf3b><span class="eudr-card__label" data-v-becddf3b>${ssrInterpolate(unref(t)("demo.eudr.col_status"))}:</span><span class="${ssrRenderClass([`eudr-status--${batch.status}`, "eudr-status"])}" data-v-becddf3b>${ssrInterpolate(batch.statusLabel)}</span></p><div class="eudr-card__actions" data-v-becddf3b>`);
        _push(ssrRenderComponent(unref(Button), {
          type: "info",
          block: "",
          onClick: ($event) => openQrModal(batch)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("demo.eudr.show_qr"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("demo.eudr.show_qr")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></article>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(EudrQrModal, {
        show: isQrModalOpen.value,
        batch: selectedBatch.value,
        onClose: closeQrModal,
        onAction: handleQrAction
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/sections/EudrSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const EudrSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-becddf3b"]]);
const _sfc_main$1 = /* @__PURE__ */ Object.assign({ name: "ReportsSection" }, {
  __name: "ReportsSection",
  __ssrInlineRender: true,
  props: {
    report: {
      type: Object,
      required: true
    },
    /** Все ниши и задачи — как в Checklists / Dashboard. */
    checklistsByNiche: {
      type: Object,
      required: true
    },
    /** Партии EUDR — как в секции EUDR QR. */
    batches: {
      type: Array,
      required: true
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const message = useMessage();
    const reportPageLocale = computed(() => useCurrentLocale());
    const props = __props;
    const nicheLabel = (niche) => {
      const map = { coffee: "niche_coffee", bakery: "niche_bakery", meat: "niche_meat" };
      return map[niche] ? t(`demo.reports.${map[niche]}`) : niche;
    };
    function isoToRuDots(iso) {
      const [y, m, d] = String(iso).split("-");
      if (!y || !m || !d) {
        return "—";
      }
      return `${d.padStart(2, "0")}.${m}.${y}`;
    }
    function todayIso() {
      const d = /* @__PURE__ */ new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    function formatTaskValue(task) {
      if (Array.isArray(task.measurements) && task.measurements.length) {
        const last = [...task.measurements].reverse().find((m) => m.status !== "pending");
        if (last) {
          return `${last.value} (${last.time})`;
        }
        const pend = task.measurements.find((m) => m.status === "pending");
        if (pend) {
          return `${pend.time} — ${pend.value}`;
        }
      }
      return "—";
    }
    function taskPhotoLabel(task) {
      if (Array.isArray(task.measurements) && task.measurements.length) {
        return t("demo.reports.photo_yes");
      }
      return "—";
    }
    function taskStatusRow(task) {
      if (Array.isArray(task.measurements) && task.measurements.length > 0) {
        const hasPending = task.measurements.some(
          (m) => m.status === "pending"
        );
        if (hasPending) {
          return { label: t("demo.reports.status_pending"), key: "review" };
        }
        return { label: t("demo.reports.status_success"), key: "ok" };
      }
      if (taskDisplayStatusKey(task) === "problem") {
        return { label: t("demo.reports.status_deviation"), key: "problem" };
      }
      return { label: t("demo.reports.status_ok"), key: "ok" };
    }
    const taskPreviewRows = computed(() => {
      const dayLabel = isoToRuDots(props.report.reportDayIso ?? todayIso());
      const rows = [];
      for (const [niche, tasks] of Object.entries(
        props.checklistsByNiche ?? {}
      )) {
        const nicheLbl = nicheLabel(niche);
        for (const task of tasks) {
          const st = taskStatusRow(task);
          rows.push({
            id: `ccp-${niche}-${task.id}`,
            date: dayLabel,
            point: `${nicheLbl} — ${task.title}`,
            value: formatTaskValue(task),
            assignee: resolveStaffFullName(
              props.staff,
              task.assignedStaffId
            ),
            photo: taskPhotoLabel(task),
            statusLabel: st.label,
            statusKey: st.key
          });
        }
      }
      return rows;
    });
    const batchPreviewRows = computed(
      () => (props.batches ?? []).map((b) => ({
        id: `eudr-${b.id}`,
        date: b.date ?? "—",
        point: `EUDR — ${b.product} (${b.id})`,
        value: `${b.supplier} · ${b.statusLabel}`,
        photo: t("demo.reports.photo_no"),
        statusLabel: b.statusLabel,
        statusKey: b.status === "review" ? "review" : "ok"
      }))
    );
    const publicReportUrl = computed(
      () => buildDailyReportPublicUrl(
        props.report.reportDayIso ?? todayIso(),
        reportPageLocale.value
      )
    );
    const goToPublicReport = () => {
      const url = publicReportUrl.value;
      if (typeof window !== "undefined" && url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    };
    function copyTextFallback(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        return document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
    const handleCopyLink = async () => {
      var _a;
      const text = buildDailyReportPublicUrl(
        props.report.reportDayIso ?? todayIso(),
        reportPageLocale.value
      );
      try {
        if (typeof navigator !== "undefined" && ((_a = navigator.clipboard) == null ? void 0 : _a.writeText)) {
          await navigator.clipboard.writeText(text);
        } else if (!copyTextFallback(text)) {
          throw new Error("copy");
        }
        message.success(t("demo.reports.copy_success"));
      } catch {
        if (copyTextFallback(text)) {
          message.success(t("demo.reports.copy_success"));
        } else {
          message.error(t("demo.reports.copy_error"));
        }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "reports-section" }, _attrs))} data-v-ea870366><div class="reports-public-link" data-v-ea870366><h3 data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.public_report"))}</h3><div class="reports-public-link__row" data-v-ea870366><code class="reports-public-link__url" data-v-ea870366><span class="reports-public-link__url-text" data-v-ea870366>${ssrInterpolate(publicReportUrl.value)}</span></code><div class="reports-public-link__actions" data-v-ea870366>`);
      _push(ssrRenderComponent(unref(Button), {
        type: "success",
        size: "large",
        onClick: handleCopyLink
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.reports.copy"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.reports.copy")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Button), {
        type: "info",
        size: "large",
        onClick: goToPublicReport
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.reports.go_to"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.reports.go_to")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="report-preview" data-v-ea870366><h2 data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.daily_report"))}</h2><h3 class="report-preview__category" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.tasks"))}</h3><div class="report-preview__desktop" data-v-ea870366><div class="report-preview__table-wrap" data-v-ea870366><table class="report-preview__table" data-v-ea870366><thead data-v-ea870366><tr data-v-ea870366><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_date"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_point"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_value"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_assignee"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_photo"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_status"))}</th></tr></thead><tbody data-v-ea870366><!--[-->`);
      ssrRenderList(taskPreviewRows.value, (row) => {
        _push(`<tr data-v-ea870366><td data-v-ea870366>${ssrInterpolate(row.date)}</td><td data-v-ea870366>${ssrInterpolate(row.point)}</td><td data-v-ea870366>${ssrInterpolate(row.value)}</td><td data-v-ea870366>${ssrInterpolate(row.assignee)}</td><td data-v-ea870366>${ssrInterpolate(row.photo)}</td><td data-v-ea870366><span class="${ssrRenderClass([`report-status--${row.statusKey}`, "report-status"])}" data-v-ea870366>${ssrInterpolate(row.statusLabel)}</span></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div><div class="report-preview__mobile" data-v-ea870366><!--[-->`);
      ssrRenderList(taskPreviewRows.value, (row) => {
        _push(`<article class="report-preview-card" data-v-ea870366><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_date"))}:</span> ${ssrInterpolate(row.date)}</p><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_point"))}:</span> ${ssrInterpolate(row.point)}</p><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_value"))}:</span> ${ssrInterpolate(row.value)}</p><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_assignee"))}:</span> ${ssrInterpolate(row.assignee)}</p><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_photo"))}:</span> ${ssrInterpolate(row.photo)}</p><p class="report-preview-card__line report-preview-card__line--status" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_status"))}:</span><span class="${ssrRenderClass([`report-status--${row.statusKey}`, "report-status"])}" data-v-ea870366>${ssrInterpolate(row.statusLabel)}</span></p></article>`);
      });
      _push(`<!--]--></div><h3 class="report-preview__category" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.raw_materials"))}</h3><div class="report-preview__desktop" data-v-ea870366><div class="report-preview__table-wrap" data-v-ea870366><table class="report-preview__table" data-v-ea870366><thead data-v-ea870366><tr data-v-ea870366><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_date"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_point"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_value"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_photo"))}</th><th data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_status"))}</th></tr></thead><tbody data-v-ea870366><!--[-->`);
      ssrRenderList(batchPreviewRows.value, (row) => {
        _push(`<tr data-v-ea870366><td data-v-ea870366>${ssrInterpolate(row.date)}</td><td data-v-ea870366>${ssrInterpolate(row.point)}</td><td data-v-ea870366>${ssrInterpolate(row.value)}</td><td data-v-ea870366>${ssrInterpolate(row.photo)}</td><td data-v-ea870366><span class="${ssrRenderClass([`report-status--${row.statusKey}`, "report-status"])}" data-v-ea870366>${ssrInterpolate(row.statusLabel)}</span></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div><div class="report-preview__mobile" data-v-ea870366><!--[-->`);
      ssrRenderList(batchPreviewRows.value, (row) => {
        _push(`<article class="report-preview-card" data-v-ea870366><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_date"))}:</span> ${ssrInterpolate(row.date)}</p><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_point"))}:</span> ${ssrInterpolate(row.point)}</p><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_value"))}:</span> ${ssrInterpolate(row.value)}</p><p class="report-preview-card__line" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_photo"))}:</span> ${ssrInterpolate(row.photo)}</p><p class="report-preview-card__line report-preview-card__line--status" data-v-ea870366><span class="report-preview-card__label" data-v-ea870366>${ssrInterpolate(unref(t)("demo.reports.col_status"))}:</span><span class="${ssrRenderClass([`report-status--${row.statusKey}`, "report-status"])}" data-v-ea870366>${ssrInterpolate(row.statusLabel)}</span></p></article>`);
      });
      _push(`<!--]--></div></div><div class="reports-footer-actions" data-v-ea870366>`);
      _push(ssrRenderComponent(unref(Button), {
        type: "info",
        size: "large",
        onClick: goToPublicReport
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.reports.go_to"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.reports.go_to")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/components/sections/ReportsSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ReportsSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ea870366"]]);
const getTodayStartTimestamp = () => {
  const d = /* @__PURE__ */ new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const isTaskScheduledForFuture = (task, todayStartTs) => typeof (task == null ? void 0 : task.startDate) === "number" && Number.isFinite(task.startDate) && task.startDate > todayStartTs;
const getTaskMeasurementStats = (task) => {
  const rows = Array.isArray(task == null ? void 0 : task.measurements) ? task.measurements : [];
  let hasPending = false;
  let problemCount = 0;
  for (const row of rows) {
    if ((row == null ? void 0 : row.status) === "pending") {
      hasPending = true;
    }
    if ((row == null ? void 0 : row.status) === "problem") {
      problemCount += 1;
    }
  }
  return { hasPending, problemCount, measurementCount: rows.length };
};
const useDemoDashboardViewModel = (demoState) => {
  const allChecklistTasks = computed(
    () => Object.entries(demoState.value.checklistsByNiche).flatMap(
      ([niche, tasks]) => tasks.map((task) => ({ ...task, niche }))
    )
  );
  const dashboardChecklistTasks = computed(() => {
    const todayStartTs = getTodayStartTimestamp();
    const source = allChecklistTasks.value;
    const filtered = source.filter(
      (task) => !isTaskScheduledForFuture(task, todayStartTs)
    );
    return filtered;
  });
  const dashboardDerivedData = computed(() => {
    const tasks = dashboardChecklistTasks.value;
    const hotTasks = [];
    let tasksDone = 0;
    let criticalCount = 0;
    let tasksWithoutAssignee = 0;
    for (const task of tasks) {
      const measurementStats = getTaskMeasurementStats(task);
      criticalCount += measurementStats.problemCount;
      if (!measurementStats.hasPending) {
        tasksDone += 1;
      }
      if (!(task == null ? void 0 : task.assignedStaffId)) {
        tasksWithoutAssignee += 1;
      }
      if (measurementStats.hasPending) {
        const displayKey = taskDisplayStatusKey(task);
        hotTasks.push({
          id: task.id,
          title: task.title,
          value: firstPendingMeasurementTime(task),
          status: displayKey === "problem" ? "warning" : displayKey,
          type: task.niche,
          assignedStaffId: task.assignedStaffId ?? null,
          measurements: task.measurements ?? [],
          correctiveActions: task.correctiveActions ?? [],
          taskFieldDefinitions: Array.isArray(task.taskFieldDefinitions) ? task.taskFieldDefinitions : [],
          taskScopeType: task.taskScopeType ?? null,
          equipmentTargetIds: Array.isArray(task.equipmentTargetIds) ? task.equipmentTargetIds : [],
          roomTargetIds: Array.isArray(task.roomTargetIds) ? task.roomTargetIds : []
        });
      }
    }
    const tasksTotal = tasks.length;
    const compliance = tasksTotal > 0 ? Math.round(tasksDone / tasksTotal * 100) : 0;
    return {
      tasksTotal,
      tasksDone,
      compliance,
      criticalCount,
      tasksWithoutAssignee,
      hotTasks
    };
  });
  const dashboardPanelData = computed(() => {
    const d = dashboardDerivedData.value;
    const result = {
      metrics: {
        tasksDone: d.tasksDone,
        tasksTotal: d.tasksTotal,
        compliance: d.compliance,
        criticalCount: d.criticalCount,
        tasksWithoutAssignee: d.tasksWithoutAssignee,
        inspectionDate: demoState.value.inspectionDate
      },
      hotTasks: d.hotTasks
    };
    return result;
  });
  return {
    dashboardChecklistTasks,
    dashboardPanelData
  };
};
const _sfc_main = /* @__PURE__ */ Object.assign({ name: "Demo" }, {
  __name: "DemoPage",
  __ssrInlineRender: true,
  props: {
    section: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const DEMO_SECTION_IDS = /* @__PURE__ */ new Set([
      "dashboard",
      "checklists",
      "personnel",
      "eudr",
      "reports"
    ]);
    const locale = computed(() => useCurrentLocale());
    const surveyPath = computed(() => `/${locale.value}/survey`);
    const { demoState } = useDemoState();
    const { dashboardPanelData } = useDemoDashboardViewModel(demoState);
    const activeSectionId = computed(
      () => DEMO_SECTION_IDS.has(props.section) ? props.section : "dashboard"
    );
    const sectionLinks = computed(() => [
      { id: "dashboard", label: t("demo.page.section_dashboard"), svg: "laptop-mac-twotone" },
      { id: "checklists", label: t("demo.page.section_checklists"), svg: "task-complete" },
      { id: "personnel", label: t("demo.page.section_personnel"), svg: "people-community-24-filled" },
      { id: "eudr", label: t("demo.page.section_eudr"), svg: "qr-code-twotone" },
      { id: "reports", label: t("demo.page.section_reports"), svg: "report-search" }
    ]);
    const sectionComponentMap = {
      dashboard: DashboardSection,
      checklists: ChecklistsSection,
      personnel: PersonnelSection,
      eudr: EudrSection,
      reports: ReportsSection
    };
    const sectionConfigMap = computed(() => ({
      dashboard: { id: "dashboard", title: t("demo.page.section_dashboard"), inlineTitle: false },
      checklists: { id: "checklists", title: t("demo.page.section_checklists"), inlineTitle: false },
      personnel: { id: "personnel", title: t("demo.page.section_personnel"), inlineTitle: false },
      eudr: { id: "eudr", title: t("demo.page.section_eudr"), inlineTitle: false },
      reports: { id: "reports", title: t("demo.page.section_reports"), inlineTitle: true }
    }));
    const activeSectionComponent = computed(
      () => sectionComponentMap[activeSectionId.value] ?? null
    );
    const activeSectionConfig = computed(
      () => sectionConfigMap.value[activeSectionId.value] ?? null
    );
    const activeSectionProps = computed(() => {
      if (activeSectionId.value === "dashboard") {
        return {
          metrics: dashboardPanelData.value.metrics,
          hotTasks: dashboardPanelData.value.hotTasks,
          checklistsByNiche: demoState.value.checklistsByNiche,
          staff: demoState.value.staff
        };
      }
      if (activeSectionId.value === "checklists") {
        return {
          checklistsByNiche: demoState.value.checklistsByNiche,
          staff: demoState.value.staff
        };
      }
      if (activeSectionId.value === "eudr") {
        return {
          batches: demoState.value.batches
        };
      }
      if (activeSectionId.value === "reports") {
        return {
          report: demoState.value.report,
          checklistsByNiche: demoState.value.checklistsByNiche,
          batches: demoState.value.batches,
          staff: demoState.value.staff
        };
      }
      return {};
    });
    const setActiveSection = (sectionId) => {
      if (!DEMO_SECTION_IDS.has(sectionId)) return;
      router.visit(`/${locale.value}/demo/${sectionId}`, {
        preserveState: true,
        preserveScroll: true
      });
    };
    const todayIso = computed(() => {
      const d = /* @__PURE__ */ new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    });
    const todayFormatted = computed(() => {
      return new Intl.DateTimeFormat(locale.value, {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(/* @__PURE__ */ new Date());
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "demo-page" }, _attrs))} data-v-2c6b1c6b>`);
      _push(ssrRenderComponent(DemoSectionNavigation, {
        variant: "bottom",
        links: sectionLinks.value,
        "active-id": activeSectionId.value,
        onSelect: setActiveSection
      }, null, _parent));
      _push(`<header class="demo-topbar" data-v-2c6b1c6b><div class="container demo-topbar__inner" data-v-2c6b1c6b><button type="button" class="demo-date-picker"${ssrRenderAttr("title", unref(t)("demo.page.calendar_day"))}${ssrRenderAttr("aria-label", unref(t)("demo.page.calendar_day"))} data-v-2c6b1c6b><span class="demo-date-picker__icon" aria-hidden="true" data-v-2c6b1c6b><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" data-v-2c6b1c6b><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.75" data-v-2c6b1c6b></rect><path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M16 3v4M8 3v4M3 11h18" data-v-2c6b1c6b></path><circle cx="8" cy="16" r="1" fill="currentColor" data-v-2c6b1c6b></circle><circle cx="12" cy="16" r="1" fill="currentColor" data-v-2c6b1c6b></circle><circle cx="16" cy="16" r="1" fill="currentColor" data-v-2c6b1c6b></circle></svg></span><span class="demo-date-picker__text" data-v-2c6b1c6b>${ssrInterpolate(unref(t)("demo.page.calendar_day"))}</span></button><div class="demo-topbar__date" data-v-2c6b1c6b><time class="demo-topbar__date-value"${ssrRenderAttr("datetime", todayIso.value)} data-v-2c6b1c6b>${ssrInterpolate(todayFormatted.value)}</time></div></div></header>`);
      _push(ssrRenderComponent(unref(Link), {
        href: surveyPath.value,
        class: "btn-client btn-success demo-topbar-cta"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.page.cta_survey"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.page.cta_survey")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="container demo-layout" data-v-2c6b1c6b><aside class="demo-sidebar" data-v-2c6b1c6b>`);
      _push(ssrRenderComponent(DemoSectionNavigation, {
        variant: "sidebar",
        links: sectionLinks.value,
        "active-id": activeSectionId.value,
        onSelect: setActiveSection
      }, null, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: surveyPath.value,
        class: "btn-client btn-success demo-sidebar__cta"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("demo.page.cta_survey"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("demo.page.cta_survey")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</aside><main class="demo-main" data-v-2c6b1c6b><section class="demo-section"${ssrRenderAttr("id", activeSectionConfig.value.id)} data-v-2c6b1c6b><h1 class="demo-section__title" data-v-2c6b1c6b>${ssrInterpolate(activeSectionConfig.value.title)}</h1>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(activeSectionComponent.value), mergeProps({ key: activeSectionId.value }, activeSectionProps.value), null), _parent);
      _push(`</section></main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/features/demo/page/DemoPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DemoPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2c6b1c6b"]]);
export {
  DemoPage as default
};
