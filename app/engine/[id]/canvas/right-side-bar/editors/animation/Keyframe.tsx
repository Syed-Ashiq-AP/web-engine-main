type KeyframeType = { position: number };

export const Keyframe = ({ position }: KeyframeType) => {
    return (
        <div
            className="we-keyframe-box"
            style={{ left: `${(position - 0.1) * 4}%` }}
        >
            <div className="we-keyframe">
                <div className="we-keyframe-icon"></div>
            </div>
        </div>
    );
};
