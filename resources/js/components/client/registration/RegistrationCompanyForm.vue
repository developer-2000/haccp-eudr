<template>
    <div class="form-wrapper">
        <h2>About your company</h2>
        <p class="form-subtitle">
            This information is used in setting up your system. You can change
            it anytime you need. </p>
        <n-form ref="formRef" :model="formData" :rules="rules" size="large" class="registration-form">
            <n-form-item label="Company name" path="companyName">
                <n-input v-model:value="formData.companyName" placeholder=""/>
            </n-form-item>
            <n-form-item path="businessType" class="box-search-select">
                <template #label>
                    <span class="label-svg">
                        Business type
                        <n-popover trigger="hover" style="max-width: 300px">
                            <template #trigger>
                                <InfoCircleTwotone class="svg-icon info-icon"/>
                            </template>
                            <span>
                                This is the category that most accurately describes your company and which you intend to audit and account for.
                            </span>
                        </n-popover>
                    </span>
                </template>
                <n-select
                    v-model:value="formData.businessType"
                    placeholder="Search business type"
                    :options="businessTypeOptions"
                    value-key="value"
                    label-key="label"
                    filterable
                    :filter="filterByLabel"
                />
            </n-form-item>
            <n-form-item label="Country" path="country" class="box-search-select">
                <n-select
                    v-model:value="formData.country"
                    placeholder="Search country"
                    :options="countryOptions"
                    value-key="value"
                    label-key="label"
                    filterable
                    :filter="filterByLabel"
                />
            </n-form-item>
            <n-form-item label="Total number of employees" path="employeeCount" class="box-radio" :show-feedback="false">
                <n-radio-group v-model:value="formData.employeeCount" name="employeeCount">
                    <n-space>
                        <n-radio v-for="option in employeeOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </n-radio>
                    </n-space>
                </n-radio-group>
            </n-form-item>
            <n-form-item label="Total number of business locations" path="numberCompanyOffices" class="box-radio" :show-feedback="false">
                <n-radio-group v-model:value="formData.numberCompanyOffices" name="numberCompanyOffices">
                    <n-space>
                        <n-radio v-for="option in locationOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </n-radio>
                    </n-space>
                </n-radio-group>
            </n-form-item>
            <div class="form-footer">
                <n-button type="primary" size="large" :loading="loading" @click="submitForm">
                    Next
                </n-button>
            </div>
        </n-form>
    </div>
</template>

<script setup>
defineOptions({
    name: "RegistrationCompanyForm",
});

// ============================================
// Импорты
// ============================================
import {ref, computed, onMounted} from "vue";
import {useMessage} from "naive-ui";
import {InfoCircleTwotone} from "@vicons/antd";
import {useSiteConfigStore, useAuthStore} from "@/stores";
import apiAxios from "@/utils/apiAxios";

// ============================================
// State (Реактивное состояние)
// ============================================
const formRef = ref(null);
const loading = ref(false);
const message = useMessage();
const siteConfigStore = useSiteConfigStore();

const formData = ref({
    companyName: "",
    businessType: null,
    country: null,
    employeeCount: null,
    numberCompanyOffices: null,
});

// ============================================
// Computed (Вычисляемые свойства)
// ============================================
const businessTypeOptions = computed(
    () => siteConfigStore.company.businessType,
);
const countryOptions = computed(() => siteConfigStore.company.countries);
const employeeOptions = computed(() => siteConfigStore.company.employeeCount);
const locationOptions = computed(() => siteConfigStore.company.numberOffices);

// ============================================
// Конфигурация
// ============================================
const rules = {
    companyName: {
        required: true,
        message: "Please input company name",
        trigger: "blur",
    },
    businessType: {
        required: true,
        validator: (_, value) => {
            if (value === null || value === undefined || value === "") {
                return new Error("Please select business type");
            }
            return true;
        },
        trigger: "change",
    },
    country: {
        required: true,
        validator: (_, value) => {
            if (value === null || value === undefined || value === "") {
                return new Error("Please select country");
            }
            return true;
        },
        trigger: "change",
    },
    employeeCount: {
        validator: (_, value) => {
            const isValid =
                value !== null && value !== undefined && value !== "";
            if (!isValid) {
                return new Error("Please select employee count");
            }
            return true;
        },
        trigger: "change",
    },
    numberCompanyOffices: {
        validator: (_, value) => {
            const isValid =
                value !== null && value !== undefined && value !== "";
            if (!isValid) {
                return new Error("Please select number of offices");
            }
            return true;
        },
        trigger: "change",
    },
};

// ============================================
// Методы
// ============================================
/**
 * SERVER - Отправка формы регистрации компании
 * Валидирует форму, отправляет данные компании на сервер и обновляет статус завершения профиля в store
 */
const submitForm = async () => {
    try {
        await formRef.value?.validate();
    } catch {
        // Валидация не прошла, не отправляем форму
        return;
    }

    loading.value = true;

    try {
        const params = {
            company_name: formData.value.companyName,
            company_business_type: formData.value.businessType,
            company_country: formData.value.country,
            company_employee_count: formData.value.employeeCount,
            company_number_offices: formData.value.numberCompanyOffices,
        };

        const {data} = await apiAxios.post(
            "/api/auth/register/company",
            params,
        );

        const responseData = data.data || data;

        // используем Pinia для хранения profile_completion
        if (responseData.profile_completion) {
            const authStore = useAuthStore();
            authStore.updateProfileCompletion(responseData.profile_completion);
        }
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "An error occurred during registration. Please try again.";
        message.error(errorMessage);
    } finally {
        loading.value = false;
    }
};

/**
 * Установка значения по умолчанию для количества сотрудников
 * Выбирает первый доступный вариант, если значение еще не установлено
 */
const setDefaultEmployeeCount = () => {
    const options = employeeOptions.value;
    if (options && options.length > 0 && !formData.value.employeeCount) {
        formData.value.employeeCount = options[0].value;
    }
};

/**
 * Установка значения по умолчанию для количества офисов
 * Выбирает первый доступный вариант, если значение еще не установлено
 */
const setDefaultNumberOffices = () => {
    const options = locationOptions.value;
    if (options && options.length > 0 && !formData.value.numberCompanyOffices) {
        formData.value.numberCompanyOffices = options[0].value;
    }
};

/**
 * Фильтрация опций по введенному паттерну по полю label
 * Используется в n-select для поиска опций по началу названия
 * @param {string} pattern - Текст для поиска
 * @param {Object} option - Опция из списка (должна содержать поле label)
 * @returns {boolean} true если название опции начинается с паттерна
 */
const filterByLabel = (pattern, option) => {
    return option.label.toLowerCase().startsWith(pattern.toLowerCase());
};
// ============================================
// Lifecycle Hooks
// ============================================
onMounted(() => {
    setDefaultEmployeeCount();
    setDefaultNumberOffices();
});
</script>
