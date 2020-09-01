import React, { useEffect } from 'react';
import Space from '../Space';

const Canvas = () => {
    useEffect(() => {
        const space = new Space();
        space.init();
    }, [])

    return (
        <div id="canvas"></div>
    )
}

export default Canvas;
