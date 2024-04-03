export interface LayOutItem {
    text: string,
    icon?: string,
    children?: LayOutItem[],
    path?: string
}
export interface LayOutList {
    [index: number]: LayOutItem
}

export interface ToolList {
    [index: number]: ToolItem

}
export interface ToolItem {
    icon: string,
    image?: string,
    title?: string,
    tips?: string
}



