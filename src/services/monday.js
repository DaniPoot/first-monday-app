import mondaySdk from "monday-sdk-js"

export const monday = mondaySdk()

async function createOrder ({ boardId, order, userId }) {

  try {
    const { firstName, lastName, quantity, fragrances } = order
    
    const columns = {
      name: `Order by ${firstName} ${lastName}`,
      text: firstName,
      text6: lastName,
      numbers: quantity,
      date_1: new Date().toISOString().split('T')[0],
      status: 'New Order'
    }

    const columnValues = JSON.stringify(columns).replace(/"/g, '\\"')
    const { data: { create_item: newItemOnBoard } } = await monday.api(`mutation {
      create_item (
        board_id: ${boardId},
        item_name: "${firstName} ${lastName}",
        column_values: "${columnValues}"
      ) {
        id
      }
    }`)

    await monday.api(`mutation {
      change_simple_column_value (
        item_id: ${newItemOnBoard.id},
        board_id: ${boardId},
        column_id: "dropdown", 
        value: "${fragrances.toString()}",
        create_labels_if_missing: true
        ) {
        id
      }
    }`)
  
    await monday.api(`mutation {
      change_simple_column_value (
        item_id: ${newItemOnBoard.id},
        board_id: ${boardId},
        column_id: "person", 
        value: "${userId}",
        create_labels_if_missing: true
        ) {
        id
      }
    }`)

  } catch (err) {
    console.error('Error creating order:', err);
  }
}

export const Actions = {
  createOrder
}