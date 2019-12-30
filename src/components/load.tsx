import React from 'react';
import ReactLoading from 'react-loading';

const Load = () => (
    <div id="load-proj">
        <ReactLoading type={"bars"} color={"white"} />
        <div>
            Loading your project
        </div>
    </div>
);

export default Load;