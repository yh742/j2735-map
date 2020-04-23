const styles = (theme) => ({
    root: {
      display: "flex",
    },
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    appBarSpacer: {
      height: theme.spacing(6),
    },
    displayNone: {
      display: "none",
    },
    mapContainer: {
      // position: "fixed",
      height: `calc(100% - 48px)`,
      // height: '100%',
      width: '100%'
    }
});

export default styles;