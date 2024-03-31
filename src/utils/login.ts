export interface inputGroup {
    [index: number]: inputItem
}

export interface inputItem {
    text: String,
    flag: any,
    eventFlag: any,
    placeholder: String,
    warning: String,
    type: Boolean
}