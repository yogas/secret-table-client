import React, {ChangeEvent, CSSProperties, FC, useCallback, useEffect, useRef, useState} from "react";

export interface ITableCSSProperties extends CSSProperties {
    ['--columns']: number
}

export interface ITd {
    text?: string,
    blocked?: boolean,
    agent?: string,
    rowIdx: number,
    columnIdx: number,
    style: ITableCSSProperties,
    onInputHandler(text: string, rowIdx: number, columnIdx: number): void,
    onFocusHandler(rowIdx: number, columnIdx: number): void,
    onBlurHandler(rowIdx: number, columnIdx: number): void,
}

const Td: FC<ITd> = (props) => {
    const {
        style, 
        text='', 
        blocked=false, 
        agent='', 
        rowIdx, 
        columnIdx, 
        onInputHandler,
        onFocusHandler,
        onBlurHandler
    } = props;
    const ref = useRef<HTMLTableCellElement>(null);
    const [init, setInit] = useState<boolean>(false);

    const setCaret = (el:HTMLTableCellElement, offset: number = 0) => {
        const range = document.createRange()
        const sel = window.getSelection();

        if (sel && el.childNodes.length) {
            range.setStart(el.childNodes[0], offset);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    const getCaret = useCallback((): number => {
        const sel = window.getSelection();
        if(sel) return sel.focusOffset;
        return 0;
    }, []);

    useEffect( () => {
        if (init && !blocked) {
            //setCaret(ref.current!, text);
        }
    }, [text, blocked]);

    useEffect( () => {
        // Fot not select last cell
        setInit(true);
    }, [text]);

    const onInput = useCallback((text: string, rowIdx: number, columnIdx: number) => {
        const prevCaret: number = getCaret();
        ref.current!.innerHTML = text; // Cancel formatting
        onInputHandler(text, rowIdx, columnIdx);
        setCaret(ref.current!, prevCaret);
    }, []);

    let cls = 'table__cell';
    let agentName = null;

    if(blocked) {
        cls+=' table__cell_blocked';
        agentName = <span className="table__agent-name">{agent}</span>;
    }

    return (
        <td
            style={style}
            ref={ref}
            className={cls}
            contentEditable={!blocked}
            suppressContentEditableWarning={true}
            onInput={(e:ChangeEvent<HTMLTableCellElement>) => {
                onInput(e.target.innerText, rowIdx, columnIdx);
            }}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    e.preventDefault();
                }
            }}
            onFocus={() => onFocusHandler(rowIdx, columnIdx)}
            onBlur={() => onBlurHandler(rowIdx, columnIdx)}
        >
            {text}{agentName}
        </td>
    )
}

export default Td;