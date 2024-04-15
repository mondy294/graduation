import { Repertory } from '@/api/index'

// 查询当前账号库存
const getRepertory = async (id): Promise<number> => {
    const res = await Repertory({ id })
    if (res.data.status == 0) {
        const { data } = res.data
        const { repertory } = data[0]
        localStorage.setItem('repertory', repertory)
        return repertory
    }
}

export { getRepertory }