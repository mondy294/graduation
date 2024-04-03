export interface InputGroup {
    [index: number]: InputItem
}

export interface InputItem {
    text: String,
    flag: any,
    eventFlag: any,
    placeholder: String,
    warning: String,
    type: Boolean
}