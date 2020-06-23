import React from "react";
import {safeHtmlString} from "../utils/functions";

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

export class ContentEditable extends React.Component<Props> {

  // Track focus state of editable tag
  focused: boolean = false;

  // Track if element has been removed from DOM
  removed: boolean = false;

  // Save value before input is focused / user starts typing
  preFocusedValue: string = "";

  regSpecialCharacter: RegExp = /[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]/g;

  componentDidMount() {
    this.preFocusedValue = this.getValue();
  }

  onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {

    // Cancel paste event
    e.preventDefault();

    // Remove formatting from clipboard contents
    const text = e.clipboardData.getData("text/plain");

    // Insert text manually from paste command
    document.execCommand("insertHTML", false, safeHtmlString(text));

  }

  onFocus = () => {
    this.preFocusedValue = this.getValue();
    this.focused = true;
  }

  onBlur = () => {

    this.focused = false;

    const ref = this.props.innerEditableRef.current;
    const { validator, change, maxLength } = this.props;

    if (!this.removed && ref) {

      // On blur, if no content in tag, remove it
      if (ref.innerText === "") {
        this.props.remove();
        return;
      }

      // Validate input if needed
      if (validator) {
        const valid = validator(this.getValue());
        // If invalidate, switch ref back to pre focused value
        if (!valid) {
          ref.innerText = this.preFocusedValue;
          return;
        }
      }

      change(this.finishConvert(ref.innerText));
    }
  }

  finishConvert = (origin: string) => {
    const { maxLength, spaceRemove } = this.props;
    let input: string = origin;
    if (spaceRemove) { // TEST: 한글 + space
      input = input.replace(/\s/g, "");
    }

    if (maxLength) {
      input = input.slice(0, maxLength);
    }

    return input;
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // On enter, focus main tag input
    if (e.keyCode === 13) {
      e.preventDefault();
      this.focusInputRef();
      return;
    }

    // On backspace, if no content in ref, remove tag and focus main tag input
    const { removeOnBackspace, maxLength } = this.props;
    const value = this.getValue();
    if (removeOnBackspace && e.keyCode === 8 && value === "") {
      this.removed = true;
      this.props.remove();
      this.focusInputRef();
      return;
    }

    const overMaxLength = maxLength && this.getValue().trim().length >= maxLength;

    if ((e.ctrlKey || e.metaKey) && e.keyCode === 86) { // paste
      if (overMaxLength) {
        e.preventDefault();
        return;
      }
    }

    if (overMaxLength && !this.isAllowedKeyCode(e)) {
      e.preventDefault();
      return;
    }

    if (!this.hasSpecialCharacter(e) && !this.isAllowedKeyCode(e)) {
      e.preventDefault();
      return;
    }
  }

  hasSpecialCharacter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const inputChar = String.fromCharCode(e.keyCode);
    let ret = false;
    if (inputChar === "" && inputChar == null) {
      ret = false;
    } else {
      if (inputChar.replace(this.regSpecialCharacter, "") === "") {
        ret = false;
      } else {
        ret = true;
      }
    }
    return ret;
  }

  isAllowedKeyCode = (e: React.KeyboardEvent<HTMLDivElement>) => {
    return e.keyCode === 8 ||
        e.keyCode === 38 ||
        e.keyCode === 39 ||
        e.keyCode === 37 ||
        e.keyCode === 40 ||
        e.ctrlKey ||
        e.metaKey;
  }

  getValue = () => {
    const ref = this.getRef();
    return ref ? ref.innerText : "";
  }

  getRef = () => {
    return this.props.innerEditableRef.current;
  }

  focusInputRef = () => {
    const { inputRef } = this.props;
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }

  render() {
    const { value, className, innerEditableRef } = this.props;
    return (
      <div
        ref={innerEditableRef}
        className={className}
        contentEditable={true}
        onPaste={this.onPaste}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        dangerouslySetInnerHTML={{ __html: safeHtmlString(value) }}
      />
    );
  }

}
