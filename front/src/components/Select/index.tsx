import React, { useState } from 'react';


interface Props {
    id: string;
    name: string;
    options: number[];
    onClick: (value: any) => void;
}
const Select = ({
    id,
    name,
    options,
    onClick,
}:Props) => {
    // const getInitialState = () =>({
    //     id: '',
    //     name: '',
    //     options: [],
    //     key:'',
    // });
    // // const [ state, setState ] = useState({...getInitialState})
    const handleClick = (event: any) => {
        onClick(event);
    }
    

    return (
        <select
            id = {id}
            name = {name}
            onClick = {handleClick}
            
            >
            {
                options.map((p)=>(
                    
                    <option 
                        value= { p }
                        id= {`${ p }`}
                        key= {p}>
                        {`${p} minutos`}
                    </option>
                ))
            }

        </select>
    )
}
export default (Select);