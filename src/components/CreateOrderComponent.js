import React, { useMemo, useState, useCallback } from "react"
import { Flex, TextField, Dropdown, Button, Toast } from "monday-ui-react-core"
import { useFragrances } from "../hooks/useFragrances"
import { useOrder } from "../hooks/useOrder"

const mapValues = (inputObject) => {
  const mappedObject = {}

  for (const key in inputObject) {
    const currentItem = inputObject[key]
    
    if (Array.isArray(currentItem.value)) {
      mappedObject[key] = currentItem.value.map(item => item.value)
    } else {
      mappedObject[key] = currentItem.value
    }
  }

  return mappedObject
}

export default function CreateOrderComponent() {
  const [inputs, setInputs] = useState({
    firstName: {
      value: '',
      error: { text: '' } 
    },
    lastName: {
      value: '',
      error: { text: '' } 
    },
    quantity: {
      value: '',
      error: { text: '' } 
    },
    fragrances: {
      value: [],
      error: { text: '' } 
    }
  })

  const handleChange = (value, event) => {
    const name = event.target.name
    const newInputValue = {
      value,
      error: { text: '' }
    }

    setInputs(values => ({...values, [name]: newInputValue }))
  }

  const resetForm = useCallback(() => {
    setInputs({
      firstName: {
        value: '',
        error: { text: '' } 
      },
      lastName: {
        value: '',
        error: { text: '' } 
      },
      quantity: {
        value: '',
        error: { text: '' } 
      },
      fragrances: {
        value: [],
        error: { text: '' } 
      }
    })
  }, [])
  
  const handlerDropdownChange = (options) => {
    const newFragrancesValue = {
      value: options,
      error: { text: '' }
    }

    if (options.length === 0) {
      newFragrancesValue.error = { status: 'error', text: 'This field is required' }
    }

    if (options.length > 3) {
      newFragrancesValue.error = { status: 'error', text: 'You can only select up to 3 fragrances' }
    }

    setInputs(values => ({...values, fragrances: newFragrancesValue }))
  }

  const toastStates = useMemo(() => ({
    INITIAL: {
      status: 'INITIAL',
      message: '',
    },
    LOADING: {
      status: 'LOADING',
      message: 'We are processing your order',
      type: Toast.types.NORMAL
    },
    SUCCESS: {
      status: 'SUCCESS',
      message: 'We successfully received your order',
      type: Toast.types.POSITIVE
    },
    ERROR: {
      status: 'ERROR',
      message: 'There was an error processing your order',
      type: Toast.types.NEGATIVE
    }
  }), [])
  const [toast, setToast] = useState(toastStates.INITIAL)

  const { fragrances } = useFragrances()
  const { createOrder } = useOrder()

  // Validation function
  const validateInputs = () => {
    const newErrors = {}
    let isValid = true

    if (!inputs.firstName.value) {
      newErrors.firstName = { status: 'error', text: 'First name is required' }
      isValid = false
    }

    if (!inputs.lastName.value) {
      newErrors.lastName = { status: 'error', text: 'Last name is required' }
      isValid = false
    }

    if (!inputs.quantity.value || isNaN(inputs.quantity.value) || inputs.quantity.value <= 0) {
      newErrors.quantity = { status: 'error', text: 'Enter a valid quantity' }
      isValid = false
    }

    // Validate fragrances (must have between 1 and 3 selected)
    if (!inputs.fragrances.value.length) {
      newErrors.fragrances = { status: 'error', text: 'Please select at least one fragrance' }
      isValid = false
    } 

    if (inputs.fragrances.value.length !== 3) {
      newErrors.fragrances = { status: 'error', text: 'You can only select 3 fragrances' }
      isValid = false
    }

    // Update error state
    setInputs(values => ({
      ...values,
      ...Object.keys(newErrors).reduce((acc, key) => {
        acc[key] = {
          ...values[key],
          error: newErrors[key]
        }
        return acc
      }, {})
    }))

    return isValid
  }

  async function hanlderSubmit (event) {
    event.preventDefault()

    if (!validateInputs()) {
      return
    }

    const order = mapValues(inputs)

    try {
      setToast(toastStates.LOADING)
      await createOrder(order)
      resetForm()
      setToast(toastStates.SUCCESS)
    } catch (error) {
      setToast(toastStates.ERROR)
    }
  }

  return (
    <div>
      <form
        onSubmit={hanlderSubmit}
      >
        <Flex 
          gap={Flex.gaps.XS}
          direction={Flex.directions.COLUMN}
          align={Flex.align.STRETCH}
        >
          <Flex gap={Flex.gaps.XS}>
            <TextField
              title="First Name"
              placeholder="Enter Customer First Name" 
              size={TextField.sizes.MEDIUM}
              requiredAsterisk={true}
              name="firstName"
              debounceRate={500}
              value={inputs.firstName.value}
              validation={inputs.firstName.error}
              onChange={handleChange}
            />
            <TextField 
              title="Last Name"
              placeholder="Enter Customer Last Name"
              size={TextField.sizes.MEDIUM}
              requiredAsterisk={true}
              name="lastName"
              debounceRate={500}
              value={inputs.lastName.value}
              validation={inputs.lastName.error}
              onChange={handleChange}
            />
            <TextField
              title="Quantity"
              placeholder="1"
              type={TextField.types.NUMBER}
              size={TextField.sizes.MEDIUM}
              requiredAsterisk={true}
              name="quantity"
              debounceRate={500}
              value={inputs.quantity.value}
              validation={inputs.quantity.error}
              onChange={handleChange}
            />
          </Flex>

          <Dropdown
            placeholder="Choose your scents"
            options={fragrances}
            multi
            multiline
            className="dropdown-stories-styles_with-chips"
            requiredAsterisk={true}
            value={inputs.fragrances.value}
            onChange={handlerDropdownChange}
          />
          { inputs.fragrances.error.text && <span style={{ color: 'var(--negative-color)' }}>{inputs.fragrances.error.text}</span> }

          <Button type={Button.types.SUBMIT}>
            Start Order
          </Button>
        </Flex>
        { toast.status === toastStates.LOADING.status }
        <Toast
          open={toast.status !== toastStates.INITIAL.status} 
          type={toast.type}
          onClose={() => setToast(toastStates.INITIAL)}
          loading={toast.status === toastStates.LOADING.status}
          autoHideDuration={2000}
        >
          { toast.message }
        </Toast>
      </form>
    </div>
  )
}