import React, {useState} from "react";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import {IconButton, Grow } from "@material-ui/core";
import { fade, makeStyles } from '@material-ui/core/styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const useStyles = makeStyles((theme) => ({
    searchContainer: {
        width: "50%",
    },
    search: {
        alignItems: 'center',
        display: "flex",
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.30),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.40),
        },
        marginLeft: theme.spacing(2),
        width: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginLeft: 'auto',
            width: '100%',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        flexGrow: 1,
        },
    inputInput: {
        transition: theme.transitions.create('display'),
        width: 'auto',
    },
}))

export default function SearchBar() {
    const classes = useStyles();
    const [show, setShow] = useState(false);

    return <>
        { show === true? (
            <Grow direction="left" in={show}>
                <div className={classes.searchContainer}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search Location…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}/>
                        <div className={classes.searchIcon} onClick={()=> setShow(!show)}>
                            <CloseRoundedIcon />
                        </div>
                    </div>
                </div>
            </Grow>
            ): (
            <IconButton onClick={()=> setShow(!show)} color="inherit">
                <SearchIcon />
            </IconButton>
            )
        }
    </>;
}