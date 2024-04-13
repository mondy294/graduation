export interface TradeRow {
    id: number,
    seller: string,
    sellid: number,
    date: string,
    count: number,
    price: number,
    remain: number
}

export interface orderItem {
    id: number,
    seller: string,
    sellid: number,
    buyer: string,
    sbuyid: number,
    date: string,
    count: number,
    price: number,
    totalmoney: number
}

export interface MessageBox {
    text?: string,
    id: number,
    targetId?: number,
    type: MessageType
}

enum MessageType {
    LOGIN = 0,
    ADD_FRIEND = 1,
    FINISH_FRIEND = 2,
    TEXT = 3

}

