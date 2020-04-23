const styles = () => ({
    transition: {
        transition: `all ${window.production.animate}ms linear`,
    },
    popups: {
        position: "absolute",
        display: "inline-block",
        textAlign: "center",
        whiteSpace: "nowrap",
        top: "-22px",
        height: "20px",
        maxWidth: "60px",
        minWidth: "40px",
        borderRadius: "2px",
        fontSize: "10px",
        padding: "4px",
        backgroundColor: "white"
    }
});

export default styles;