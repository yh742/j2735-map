const DRAWER_WIDTH = 260;

const styles = (theme) => ({
  drawerPaper: {
    height: "100vh",
    overflow: "scroll",
    position: 'relative',
    whiteSpace: 'nowrap',
    width: DRAWER_WIDTH,
  },
  drawerPaperClose: {
    border: 0,
    width: 0,
  },
  menuTitle: {
    paddingTop: "16px",
    paddingBottom: "16px"
  },
  toolbarSpacer: {
    marginTop: theme.spacing(6),
  },
  menuList: {
    position: "relative", 
    overflow:"auto", 
    backgroundColor: "white", 
    padding: "0px"
  },
  emptyItem: {
    marginTop: "8px", 
    marginLeft: "64px", 
    paddingTop: "35VH"
  },
  emptyItemTracking: {
    marginTop: "8px", 
    marginLeft: "64px", 
    paddingTop: "15VH"
  },
  listIcon: {
    [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(1),
    },
  },
  header: {
      paddingLeft: theme.spacing(3),
      display: "block",
      lineHeight: "3.5rem",
  },
  refreshButton: {
      fontSize: '9px',
      minWidth: '0px',
      marginLeft: theme.spacing(6),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
  },
  trackButton: {
      fontSize: '9px',
      minWidth: '0px',
      paddingLeft: "8px",
      paddingRight: "8px",
  },
  highlightedEntry: {
      color: theme.palette.secondary.main,
  },
  listStartEntry: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(1),
    },
  },
  wordWrap: { 
      wordWrap: "break-word", 
      whiteSpace: "normal" 
  },
  loadingIcon: { 
    margin: "auto", 
    zIndex: "3", 
    display: "block", 
    position: "absolute", 
    left: "calc(50% - 24px)", 
    top: "calc(50VH - 24px)"
  },
  loadingBackground: {
    filter: "blur(10px)", 
    position: "absolute", 
    display: "inline-block", 
    height: "100vh", 
    width: "100vw", 
    zIndex: "2", 
    backgroundColor: "white", 
    opacity: "1"
  }
});

export default styles;