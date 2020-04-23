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
  }
});

export default styles;