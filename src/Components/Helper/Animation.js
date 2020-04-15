import { SettingActions } from "../Store";

function AnimationStopper(state, dispatch, time=1000) {
    if (AnimationStopper.timer) {
        clearTimeout(AnimationStopper.timer)
    }
    if (state.animateIcon) {
        dispatch({
            type: SettingActions.setAnimation,
            payload: false,
        });
    }
    AnimationStopper.timer = setTimeout(()=>{
        dispatch({
            type: SettingActions.setAnimation,
            payload: true,
        });
    }, time);
}

export default AnimationStopper