export type FormElementTheme = 'gray' | 'white'

type FormElementImperativeHandle = {
  test: () => boolean
  currentValue?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  setError: (error: string) => void
  setCurrentValue: (value: string | boolean) => void
  getContainerRef: () => HTMLDivElement | null
}

type FormElementContainerProps = Pick<FormElementProps, 'className' | 'theme' | 'isRounded' | 'buttonSide'> & {
  children: ReactNode
  hasButton: boolean
  isValid: boolean
  element: 'input' | 'select' | 'textarea' | 'radioGroup'
  containerRef?: React.RefObject<HTMLDivElement>
}

type FormElementSharedProps = {
  name: string
  className?: string
  label?: string
  theme?: FormElementTheme
  onChange?: (value: string) => void
  isRounded?: boolean
  buttonIcon?: IconNames
  buttonOnClick?: ($ref: FormElementImperativeHandle) => void
  buttonSide?: 'left' | 'right'
  required?: boolean
  currentValue?: string
  setCurrentValue?: (value: string | boolean) => void
  setIsValid?: (value: boolean) => void
  setIsFocused?: (value: boolean) => void
  regexp?: RegExp
  disabled?: boolean
  ariaLabel?: string
}

type InputProps = FormElementSharedProps & {
  type: 'text' | 'email' | 'password' | 'checkbox'
  placeholder?: string
}

type TextAreaProps = FormElementSharedProps & {
  placeholder: string
}

type SelectProps = FormElementSharedProps & {
  items: { label: string; value: string }[]
  placeholder?: string
}

type RadioGroupProps = FormElementSharedProps & {
  items: { label: string; value: string }[]
  placeholder?: string
}

type FormElementProps = {
  className?: string
  initialValue?: string | boolean
} & (
  | ({
      element: 'input'
    } & InputProps)
  | ({
      element: 'select'
    } & SelectProps)
  | ({
      element: 'textarea'
    } & TextAreaProps)
  | ({
      element: 'radioGroup'
    } & RadioGroupProps)
)
