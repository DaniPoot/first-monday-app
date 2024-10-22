import { useContextStore } from "../store/useContextStore"
import { Actions } from "../services/monday"

export const useOrder = () => {
  const boardId = useContextStore((state) => state.context?.boardId)
  const userId = useContextStore((state) => state.context?.user?.id)

  const createOrder = async (order) => {
    try {
      await Actions.createOrder({ boardId, order, userId })
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  return {
    createOrder
  }
}