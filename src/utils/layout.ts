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

export interface DataItem {
    title?: string,
    date?: string,
    color?: string,
    data?: string,
    datacolor?: string,
    logo?: string,
    subtitle?: string,
    subdata?: string
}
export interface DataList {
    [index: number]: DataItem
}

export interface ChatList {

}
export interface ChatItem {

}




