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

