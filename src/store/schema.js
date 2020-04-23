const DisplaySettingsSchema = {
    intNotification: value => typeof value === 'boolean',
    vehPopup: value => typeof value === 'boolean',
    stNames: value => typeof value === 'boolean',
    trajectories: value => typeof value === 'boolean',
    sigDebug: value => typeof value === 'boolean',
    metric: value => typeof value === 'boolean'
};

const MessageSettingsSchema = {
    enableBSM: value => typeof value === 'boolean',
    enablePSM: value => typeof value === 'boolean',
    enableSPaT: value => typeof value === 'boolean'
};

const StateSchema = {
    messageSettings: value => typeof value === 'object',
    displaySettings: value => typeof value === 'object',
    history: value => Array.isArray(value),
    mapView: value => typeof value === 'object'
};

function validateSchema(obj, schema) {
    return Object.keys(schema).filter(key => !schema[key](obj[key])).length === 0;
}

export default function ValidateSettings(obj) {
    let valid = validateSchema(obj, StateSchema);
    if (valid && obj.displaySettings && obj.messageSettings) {
        return validateSchema(obj.displaySettings, DisplaySettingsSchema) &&
            validateSchema(obj.messageSettings, MessageSettingsSchema);
    }
    return false;
}
    