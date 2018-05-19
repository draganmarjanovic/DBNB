import { Position, Toaster, Intent } from "@blueprintjs/core";
 
/** Singleton toaster instance. Create separate instances for different options. */
const AppToaster = Toaster.create({
    position: Position.RIGHT_TOP,

});

const showToast = (message, intent) => 
    AppToaster.show({
        message: message,
        intent: intent,
    })

const plainToast = message =>
    showToast(message, Intent.NONE)

const primaryToast = message =>
    showToast(message, Intent.PRIMARY)

const successToast = message =>
    showToast(message, Intent.SUCCESS)

const warningToast = message =>
    showToast(message, Intent.WARNING)

const errorToast = message => 
    showToast(message, Intent.DANGER)

export {
    plainToast,
    primaryToast,
    successToast,
    warningToast,
    errorToast
}
