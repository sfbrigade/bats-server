import React from 'react'


// const NavBar = ( {setSelectedTab }) => { 
//     return ( 
//         <div> 
//             <div onClick={() => setSelectedTab("beds")}>Beds</div>
//             <div onClick={() => setSelectedTab("ringDown")}>RingDown</div>
//         </div>
//     )
// }

// export default NavBar; 
export default function NavBar ({setSelectedTab}) { 
    return ( 
        <div> 
            <div onClick={() => setSelectedTab("beds")}>Beds</div>
            <div onClick={() => setSelectedTab("ringDown")}>RingDown</div>
        </div>
    )
}

// function NavBar(setSelectedTab) { 
//     return ( 
//         <div>
//         <div onClick={() => setSelectedTab('beds')}>Beds</div>
//         <div onClick={() => setSelectedTab('ringDown')}>RingDown</div>
//         </div>
//     )
// }

// export default NavBar; 