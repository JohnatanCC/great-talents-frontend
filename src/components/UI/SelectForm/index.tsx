import type { SelectOption } from "@/types/main.types";
import { background, FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import Select, { type Props as DefaultPropsSelect, type GroupBase } from "react-select";
import { forwardRef } from "react";
type ValueType = SelectOption | SelectOption[] | null;

interface SelectFormProps
    extends Omit<DefaultPropsSelect<SelectOption, boolean, GroupBase<SelectOption>>, "onChange" | "options"> {
    label?: string;
    errorMessage?: string;
    options: SelectOption[];
    required?: boolean;
    isMulti?: boolean;
    onChangeSelect: (name: any, value: SelectOption) => void;
    name: string;
    value: SelectOption | null
}

/** CSS vars do Chakra usadas pelo tema (funcionam em light/dark) */
const COL = {
    surface: "var(--chakra-colors-surface)",
    subtle: "var(--chakra-colors-surfaceSubtle)",
    border: "var(--chakra-colors-border)",
    text: "var(--chakra-colors-text)",
    muted: "var(--chakra-colors-muted)",
    ring: "var(--chakra-colors-ring)",
    brand50: "var(--chakra-colors-brand-50)",
    brand100: "var(--chakra-colors-brand-100)",
    brand400: "var(--chakra-colors-brand-400)",
    brand600: "var(--chakra-colors-brand-600)",
    brand300: "var(--chakra-colors-brand-300)",
    danger50: "var(--chakra-colors-danger-50)",
    danger500: "var(--chakra-colors-danger-500)",
    radius: "var(--chakra-radii-md)",
};

export const SelectForm = forwardRef<HTMLDivElement, SelectFormProps>(
    (
        {
            label,
            options,
            name,
            errorMessage,
            required,
            onChangeSelect,
            isMulti = false,
            value,
            ...props
        },
        _ref
    ) => {
        const customStyles = {
            container: (base: any) => ({
                ...base,
                width: "100%",
            }),
            control: (base: any, state: any) => ({
                ...base,
                backgroundColor: COL.subtle,
                borderColor: state.isFocused ? COL.brand400 : COL.ring,
                boxShadow: state.isFocused ? `0 0 0 2px ${COL.ring}` : "none",
                "&:hover": {
                    borderColor: COL.ring,
                },
                minHeight: 40,
                borderRadius: COL.radius,
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                cursor: "text",
            }),
            valueContainer: (base: any) => ({
                ...base,
                paddingInline: 8,
                gap: 4,
            }),
            placeholder: (base: any) => ({
                ...base,
                color: COL.muted,
            }),
            singleValue: (base: any) => ({
                ...base,
                color: COL.text,
            }),
            input: (base: any) => ({
                ...base,
                color: COL.text,
            }),
            multiValue: (base: any) => ({
                ...base,
                backgroundColor: COL.brand50,
                borderRadius: 6,
            }),
            multiValueLabel: (base: any) => ({
                ...base,
                color: COL.brand600,
                fontWeight: 600,
            }),
            multiValueRemove: (base: any) => ({
                ...base,
                color: COL.brand600,
                borderRadius: 6,
                ":hover": {
                    backgroundColor: COL.brand100,
                    color: COL.brand600,
                },
            }),
            indicatorsContainer: (base: any) => ({
                ...base,
                color: COL.muted,
            }),
            dropdownIndicator: (base: any, state: any) => ({
                ...base,
                color: state.isFocused ? COL.brand600 : COL.muted,
                ":hover": { color: COL.brand600 },
            }),
            clearIndicator: (base: any) => ({
                ...base,
                color: COL.muted,
                ":hover": { color: COL.brand600 },
            }),
            menuPortal: (base: any) => ({
                ...base,
                zIndex: 9999,
            }),
            menu: (base: any) => ({
                ...base,
                backgroundColor: COL.surface,
                border: `1px solid ${COL.border}`,
                borderRadius: COL.radius,
                overflow: "hidden",
            }),
            menuList: (base: any) => ({
                ...base,
                paddingBlock: 4,
            }),
            option: (base: any, state: any) => ({
                ...base,
                backgroundColor: state.isSelected
                    ? COL.brand50
                    : state.isFocused
                        ? COL.subtle
                        : COL.surface,
                color: state.isSelected ? COL.brand600 : COL.text,
                cursor: "pointer",
                paddingBlock: 8,
            }),
            noOptionsMessage: (base: any) => ({
                ...base,
                color: COL.muted,
            }),
        };

        const handleChange = (newValue: any) => onChangeSelect(name, newValue);

        return (
            <FormControl mb={4} isRequired={required} isInvalid={!!errorMessage}>
                {label && <FormLabel m={0}>{label}</FormLabel>}
                <Select
                    classNamePrefix="gt-select"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                    options={options}
                    value={value as any}
                    isMulti={isMulti}
                    onChange={handleChange as any}
                    styles={customStyles}
                    placeholder="Selecione"
                    getOptionLabel={(opt) => opt.label}
                    getOptionValue={(opt) => String(opt.value)}
                    components={{ IndicatorSeparator: () => null }}
                    {...props}
                />
                {errorMessage && <FormHelperText color="red.500">{errorMessage}</FormHelperText>}
            </FormControl>
        );
    }
);

SelectForm.displayName = "SelectForm";
