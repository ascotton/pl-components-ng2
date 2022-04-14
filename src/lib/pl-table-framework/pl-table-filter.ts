export interface PLTableFilter {
    value: string;
    label: string;

    defaultVisible?: boolean;
    modelOptions?: any[];
    noRemove?: boolean;
    optionsLimitedText?: string;
    optionWidth?: string;
    placeholder?: string;
    searchLoading?: boolean;
    selectOpts?: any[];
    selectOptsBigFilter?: any[];
    selectOptsApi?: any[];
    selectOptsCheckbox?: any[];
    selectOptsMulti?: any[];
    selectOptsMultiApi?: any[];
    selectOptsMultiApiTotalCount?: number;
    text?: string;
    textArray?: string[];
    type?: string;
    visible?: boolean;
    displayOptsInCurrentLabel?: boolean
}

export const plTableFilterMock = (options: any = {}): PLTableFilter => {
    return {
        value: 'filter-value',
        label: 'filter label',
        ...options,
    };
};
