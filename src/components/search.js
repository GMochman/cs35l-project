import React from 'react'; // import from node modules


// create a component
const Form = ({placeHolder}) => {
    return(
        <form>
            <div className="search-input">
                <input type="text" placeholder={placeHolder}/>
                <button className="search-locations" type="submit"> 
                    <i class="fa-solid fa-magnifying-glass"></i> 
                </button> 
            </div>
        </form>
    );
}

export default Form;
