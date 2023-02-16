import React from 'react'; // import from node modules


// create a component
const Form = () => {
    return(
        <form>
            <input type="text" className="input-location" />
            <button className="add-location" type="submit"> 
                <i class="fa-solid fa-plus"></i> 
            </button> 
        </form>
    );
}

export default Form;
