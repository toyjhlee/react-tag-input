import React from "react";
interface Props {
    value: string;
    className: string;
    innerEditableRef: React.RefObject<HTMLDivElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    change: (value: string) => void;
    remove: () => void;
    validator?: (value: string) => boolean;
    removeOnBackspace?: boolean;
    maxLength?: number;
    spaceRemove?: boolean;
}
export declare class ContentEditable extends React.Component<Props> {
    focused: boolean;
    removed: boolean;
    preFocusedValue: string;
    regSpecialCharacter: RegExp;
    componentDidMount(): void;
    onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    finishConvert: (origin: string) => string;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    hasSpecialCharacter: (e: React.KeyboardEvent<HTMLDivElement>) => boolean;
    isAllowedKeyCode: (e: React.KeyboardEvent<HTMLDivElement>) => boolean;
    getValue: () => string;
    getRef: () => HTMLDivElement | null;
    focusInputRef: () => void;
    render(): JSX.Element;
}
export {};
