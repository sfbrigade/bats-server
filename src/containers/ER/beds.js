import React, {useState} from 'react';

const Beds = () => { 
    const [count, setCount] = useState(0)

    const handleIncrement = () => {
        setCount(prevCount => prevCount + 1);
    };

    const handleDecrement = () => {
        setCount(prevCount => prevCount - 1);
    };

    return (
        <div class = "cointainer">
            <h1> SF General ER </h1>
            <div> 
                <h2> Available Beds </h2>
                <div id = "erCountButtons">
                    <button onClick={handleDecrement}>-</button>
                    <h5>ER Beds {count}</h5>
                    <button onClick={handleIncrement}>+</button>
                </div>
                <div id = "psychCountButtons">
                    <button onClick={handleDecrement}>-</button>
                    <h5>Psych Beds {count}</h5>
                    <button onClick={handleIncrement}>+</button>
                </div>
                <div id="erNotesForm">
                    <label for="erNotes">ER Notes: </label>
                    <textarea id="erNotes" name="erNotes" rows="4" cols="50">
                    </textarea>
                    <button> Save </button>
                </div>
                <div id = "onDiversionForm">
                    On diversion <b><span class="onDiversion"> NO </span> </b> <button> Change </button>
                </div>
            </div>
        </div>
    )
}

export default Beds; 