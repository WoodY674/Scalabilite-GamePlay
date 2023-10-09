import React from "react";

type LoadingProps = {
    size?: number;
};
const LoadingAnim = ({ size = 300 }: LoadingProps) => {
    return (
            <img
                    style={{ width: `${size}px`, height: `${size}px` }}
                    className="loading-img"
                    src="/assets/img/loading.gif"
                    alt="loading"
            />
    );
};

export default LoadingAnim;
