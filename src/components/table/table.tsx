import React, {FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import socketIOClient from 'socket.io-client';
import UserContext from "../user-context";
import idxToLetter from "../../utils/idx-to-letter";
import ApiService from "../../services/api-service";
import Td from '../td';
import {ITableCSSProperties} from '../td/td';
import './table.css';

interface ICell {
    text?: string | undefined,
    blocked?: boolean | undefined,
    agent?: string | undefined,
    agent_id?: string | undefined,
    row?: number,
    column?: number
}

const api = new ApiService();

const useSocket = (
    tableId?: string, 
    onChange?: (data:ICell) => void,
    onFocus?: (data:ICell) => void,
    onBlur?: (data:ICell) => void,
    onAddRow?: (data: ICell) => void,
    onAddColumn?: (data: ICell) => void
) => {
    const socketRef = useRef<any>(null);
    
    useEffect( () => {       
        console.log('socket init');
        socketRef.current = socketIOClient(api.socketURL, {
            query: {tableId}
        });
        
        socketRef.current.on('change', (data: ICell) => {
            onChange!(data);
        });

        socketRef.current.on('focus', (data: ICell) => {
            onFocus!(data);
        });

        socketRef.current.on('blur', (data: ICell) => {
            onBlur!(data);
        });

        socketRef.current.on('add_row', (data: ICell) => {
            onAddRow!(data);
        });

        socketRef.current.on('add_column', (data: ICell) => {
            onAddColumn!(data);
        });
        
        return () => {
            socketRef.current.disconnect();
        }
    }, [tableId, onChange, onAddColumn, onAddRow, onBlur, onFocus]);
    
    const sendChange = (cell: ICell) => {
        socketRef.current.emit('change', cell);
    }

    const sendFocus = (cell: ICell) => {
        socketRef.current.emit('focus', cell);
    }
    
    const sendBlur = (cell: ICell) => {
        socketRef.current.emit('blur', cell);
    }

    const sendAddRow = (cell: ICell) => {
        socketRef.current.emit('add_row', cell);
    }

    const sendAddColumn = (cell: ICell) => {
        socketRef.current.emit('add_column', cell);
    }
    
    return [sendChange, sendFocus, sendBlur, sendAddRow, sendAddColumn];
}

interface ITable {
    id?: string
}

interface IUser {
    id?: string,
    name?: string
}

const Table: FC<ITable> = ({id}) => {
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [table, setTable] = useState([
        [{},{},{}],
        [{},{},{}],
        [{},{},{}],
    ]);
    const user: IUser = useContext(UserContext);

    const changeTableCell = useCallback( (row: number, column: number, fields: ICell) => {
        setTable(prev => {
            const newTable = [...prev];
            newTable[row!][column!] = {...prev[row!][column!], ...fields};
            return newTable;
        });
    }, [setTable])

    const addRow = useCallback(() => {
        setTable( (prev: any[]) => {
            return [...prev, prev[0].map(() => {
                return {text: ''}
            })];
        })
    }, [setTable]);

    const addColumn = useCallback( () => {
        setTable( (prev: any[]) => {
            const newTable = [];
            for(let row=0; row<prev.length; row++) {
                newTable.push([...prev[row], {text: ''}]);
            }
            return newTable;
        })
    }, [setTable]);
    
    const onChangeBySocket = useCallback((data: ICell) => {
        const {text, row, column, agent_id, agent} = data;
        if(user.id !== agent_id) {
            changeTableCell(row!, column!, {text, agent, blocked: true});
        }
    }, [user.id, changeTableCell]);

    const onFocusBySocket = useCallback((data: ICell) => {
        if(user.id !== data.agent_id) {
            // TODO on focus by socket
        }
    }, [user.id]);

    const onBlurBySocket = useCallback((data: ICell) => {
        const {row, column, agent_id, agent} = data;
        if(user.id !== agent_id) {
            changeTableCell(row!, column!, {agent, blocked: false});
        }
    }, [user.id, changeTableCell]);

    const onAddRowBySocket = useCallback((data: ICell) => {
        const {agent_id} = data;

        if(user.id !== agent_id) {
            addRow();
            console.log('add row by socket');
        }
    }, [user.id, addRow]);

    const onAddColumnBySocket = useCallback((data: ICell) => {
        const {agent_id} = data;

        if(user.id !== agent_id) {
            addColumn();
            console.log('add column by socket');
        }
    }, [user.id, addColumn]);

    const [
        sendChange,
        sendFocus,
        sendBlur,
        sendAddRow,
        sendAddColumn
    ] = useSocket(id, onChangeBySocket, onFocusBySocket, onBlurBySocket, onAddRowBySocket, onAddColumnBySocket);
        
    useEffect( () => {
        api.getTable(id!)
            .then( data => {
                if(data.ok) {
                    setTable(() => data.parsedBody.result.content);
                    setName(data.parsedBody.result.name);
                    setLoading(false);
                    
                    console.log('loaded');
                } else {
                    alert(data.parsedBody.msg);
                }
            });
    }, [id]);
    
    // After input text in table cell
    const onInputHandler = useCallback((text: string, row: number, column: number) => {
        sendChange({text, row, column, agent_id: user.id, agent: user.name});
        setTable( prev => {
            const newTable = [...prev];
            newTable[row][column] = {...prev[row][column], text};
            return newTable;
        });
        
    }, [sendChange, user.id, user.name]);
    
    const onFocusHandler = useCallback( (row: number, column: number) => {
        //console.log('focus', row, column);
        sendFocus({row, column, agent_id: user.id});
    }, [sendFocus, user.id]);

    const onBlurHandler = useCallback( (row: number, column: number) => {
        //console.log('blur', row, column);
        sendBlur({row, column, agent_id: user.id, agent: user.name});
    }, [sendBlur, user.id, user.name]);
    
    // Event after click on icon Add Row
    const onAddRow = () => {
        sendAddRow({agent_id: user.id});
        addRow();
    }

    // Event after click on icon Add Column
    const onAddColumn = () => {
        sendAddColumn({agent_id: user.id});
        addColumn();
    }
    
    // Calculate sum of columns content
    const calculateSum = useCallback( (table: any[]): number[] => {
        const sum: any[] = [];
        for (let col = 0; col < table[0].length; col++) {
            sum[col] = 0;
        }
        
        for(let row=0; row<table.length; row++) {
            for(let col=0; col<table[row].length; col++) {
                const {text=''} = table[row][col];
                // If number
                if(text.match(/^[0-9]*$/)) {
                    sum[col] += Number(text);
                } else {
                    sum[col] += text.length;
                }
            }
        }
        
        return sum;
    }, []);
    
    const sum: number[] = calculateSum(table);
    const style: ITableCSSProperties = {'--columns': table[0].length};
    
    if(loading) return <div className="table"><br />Loading...</div>;
    
    return (
        <div className="table">
            <h1>{name}</h1>
            
            <table className="table">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        {
                            table[0].map( (column, idx) => {
                                return <th key={idx}>{idxToLetter(idx)}</th>
                            } )
                        }
                        <th><i className="material-icons table__icon-add-coll" onClick={onAddColumn}>arrow_drop_down_circle</i></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        table.map( (row, rowIdx) => {
                            return (
                                <tr key={rowIdx}>
                                    <td>{rowIdx+1}</td>
                                    {
                                        row.map( (cell: ICell, columnIdx) => {
                                            return (
                                                <Td 
                                                    style={style}
                                                    key={columnIdx} 
                                                    rowIdx={rowIdx} 
                                                    columnIdx={columnIdx} 
                                                    text={cell.text!}
                                                    blocked={cell.blocked!}
                                                    agent={cell.agent!}
                                                    onInputHandler={onInputHandler}
                                                    onFocusHandler={onFocusHandler}
                                                    onBlurHandler={onBlurHandler}
                                                 />
                                            )
                                        })
                                    }
                                    <td>&nbsp;</td>
                                </tr>
                            )
                        })
                    }
                    <tr>
                        <td><i className="material-icons table__icon-add-row" onClick={onAddRow}>arrow_drop_down_circle</i></td>
                        {
                            sum.map( (value, idx) => {
                                return <td key={idx}>{value}</td>
                            } )
                        }
                        <td>&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table;