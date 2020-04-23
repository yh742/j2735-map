const DRAWER_WIDTH = 280; 

const styles = (theme) =>({
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: '30ms',
      }),
    },
    drawerPaperClose: {
      border: 0,
      overflowX: 'hidden',
      width: theme.spacing(7),
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: '30ms',
      }),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    },
    listIcon: {
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(1),
      },
    }
});

export default styles;