const DRAWER_WIDTH = 280; 

const styles = (theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: '30ms',
      }),
    },
    appBarShift: {
      marginLeft: DRAWER_WIDTH,
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: '30ms',
      }),
    },
    menuButton: {
      marginRight: theme.spacing(4),
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
      alignContent: "center",
    },
    logo: {
      height: 30,
      width: "auto",
    },
    noDisplay: {
      display: "none",
    }
});

export default styles;