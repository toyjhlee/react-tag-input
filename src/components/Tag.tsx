import React from "react";
import {classSelectors} from "../utils/selectors";
import {ContentEditable} from "./ContentEditable";

interface Props {
  value: string;
  index: number;
  editable: boolean;
  readOnly: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  update: (i: number, value: string) => void;
  remove: (i: number) => void;
  validator?: (val: string) => boolean;
  removeOnBackspace?: boolean;
  maxLength?: number;
  spaceRemove?: boolean;
}

export class Tag extends React.Component<Props> {

  innerEditableRef: React.RefObject<HTMLDivElement> = React.createRef();

  remove = () => this.props.remove(this.props.index);

  render() {

    const { value, index, editable, inputRef, validator, update, readOnly, removeOnBackspace, maxLength, spaceRemove } = this.props;

    const tagRemoveClass = !readOnly ?
      classSelectors.tagRemove : `${classSelectors.tagRemove} ${classSelectors.tagRemoveReadOnly}`;

    return (
      <div className={classSelectors.tag}>
        {!editable && <div className={classSelectors.tagContent}>{value}</div>}
        {editable && (
          <ContentEditable
            value={value}
            inputRef={inputRef}
            innerEditableRef={this.innerEditableRef}
            className={classSelectors.tagContent}
            change={(newValue) => update(index, newValue)}
            remove={this.remove}
            validator={validator}
            removeOnBackspace={removeOnBackspace}
            maxLength={maxLength}
            spaceRemove={spaceRemove}
          />
        )}
        <div className={tagRemoveClass} onClick={this.remove}/>
      </div>
    );

  }

}
