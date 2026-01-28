'use client'

import classnames from 'classnames'
import styles from './FormElement.module.scss'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  FormElementContainerProps,
  FormElementImperativeHandle,
  FormElementProps,
  InputProps,
  SelectProps,
  TextAreaProps,
} from '@/types/components/FormElement'
import Icon from '../Icon/Icon'
import classNames from 'classnames'

const generateFormId = (name: string) => {
  return `formEl${name}`
}

const FormElement = forwardRef<FormElementImperativeHandle, FormElementProps>(({ className, ...props }, ref) => {
  const {
    label,
    name,
    theme = 'white',
    isRounded = false,
    buttonIcon,
    buttonOnClick,
    buttonSide = 'right',
    element = 'input',
    initialValue,
    required = false,
    regexp,
    disabled = false,
    ariaLabel,
  } = props
  const [currentValue, setCurrentValue] = useState<string | boolean>(initialValue || '')
  const [error, setError] = useState<null | string>(null)
  const hasButton = useMemo(() => {
    if (element !== 'input') return false
    return Boolean(buttonIcon || buttonOnClick)
  }, [element, buttonOnClick, buttonIcon])
  const [isValid, setIsValid] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const isCheckbox = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const propsCopy: any = props
    if (!propsCopy?.type) return false
    if (propsCopy?.type === 'checkbox') return true
    return false
  }, [props])

  const [isFocused, setIsFocused] = useState(false)

  const ElementComponent = useMemo(() => {
    if (element === 'input') {
      return FormElementInput
    } else if (element === 'select') {
      return FormElementSelect
    } else if (element === 'textarea') {
      return FormElementTextArea
    } else if (element === 'radioGroup') {
      return FormElementRadioGroup
    }

    return null
  }, [element])

  const imperativeHandleReturn = useMemo(() => {
    return {
      test: () => {
        let _isValid = true

        if (regexp) {
          if (typeof currentValue === 'string') {
            if (!regexp?.test(currentValue)) _isValid = false
          }
        } else {
          if (required && !currentValue) _isValid = false
        }

        setIsValid(_isValid)
        return _isValid
      },
      currentValue,
      setCurrentValue,
      setError,
      getContainerRef: () => {
        return containerRef.current
      },
    }
  }, [currentValue, regexp, required])

  useImperativeHandle(ref, () => imperativeHandleReturn)

  if (!ElementComponent) return null

  return (
    <FormElementContainer
      element={element}
      className={classNames(
        className,
        { [styles.isCheckbox]: isCheckbox },

        {
          [styles.isRounded]: isRounded,
        },
        {
          [styles.hasButton]: hasButton,
        },
        {
          [styles.isInvalid]: !isValid,
        },
        {
          [styles.isFocused]: isFocused,
        },
      )}
      theme={theme}
      isRounded={isRounded}
      buttonSide={buttonSide}
      hasButton={hasButton}
      isValid={isValid}
      containerRef={containerRef}
    >
      {label && name && (
        <div className={styles.labelContainer}>
          <label
            className={styles.label}
            htmlFor={generateFormId(name)}
          >
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        </div>
      )}
      <div className={styles.elementWrapper}>
        <ElementComponent
          {
            /* eslint-disable-next-line */
            ...(props as any)
          }
          setCurrentValue={setCurrentValue}
          currentValue={currentValue}
          setIsValid={setIsValid}
          setIsFocused={setIsFocused}
          onChange={props.onChange}
          disabled={disabled}
          ariaLabel={ariaLabel}
        />
        {hasButton && (
          <button
            className={styles.button}
            onClick={() => {
              if (buttonOnClick) buttonOnClick(imperativeHandleReturn)
            }}
            disabled={disabled}
            aria-label={ariaLabel ? ariaLabel : undefined}
            type="button"
          >
            <Icon
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              name={buttonIcon as any}
              className={styles.button__icon}
            />
          </button>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </FormElementContainer>
  )
})

const FormElementContainer = ({
  className,
  children,
  theme,
  buttonSide,
  element,
  containerRef,
}: FormElementContainerProps) => {
  return (
    <div
      className={classnames(styles.container, className)}
      data-form-theme={theme}
      data-form-button-side={buttonSide}
      data-form-element={element}
      ref={containerRef}
    >
      {children}
    </div>
  )
}

const FormElementInput = ({
  className,
  type = 'text',
  name,
  placeholder,
  setCurrentValue,
  currentValue,
  setIsValid,
  setIsFocused,
  onChange,
  disabled,
  ariaLabel,
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        className={classnames(styles.input, className)}
        id={generateFormId(name)}
        placeholder={placeholder}
        value={currentValue}
        disabled={disabled}
        aria-label={ariaLabel ? ariaLabel : undefined}
        onChange={e => {
          if (setCurrentValue) {
            let value: boolean | string = e.target.value
            if (type === 'checkbox') {
              value = Boolean(e.target.checked)
            }
            setCurrentValue(value)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (onChange) onChange(value as any)
          }
          if (setIsValid) setIsValid(true)
        }}
        onFocus={() => {
          if (setIsFocused) setIsFocused(true)
        }}
        onBlur={() => {
          if (setIsFocused) setIsFocused(false)
        }}
      />
      {type === 'checkbox' && (
        <span className={styles.checkbox}>
          {currentValue && (
            <Icon
              name="caretRight"
              className={styles.checkbox__icon}
            />
          )}
        </span>
      )}
    </>
  )
}

const FormElementTextArea = ({
  className,
  name,
  placeholder,
  setCurrentValue,
  currentValue,
  setIsValid,
  setIsFocused,
  disabled,
  ariaLabel,
}: TextAreaProps) => {
  return (
    <textarea
      className={classnames(styles.textarea, className)}
      id={generateFormId(name)}
      placeholder={placeholder}
      value={currentValue}
      disabled={disabled}
      aria-label={ariaLabel ? ariaLabel : undefined}
      onFocus={() => {
        if (setIsFocused) setIsFocused(true)
      }}
      onBlur={() => {
        if (setIsFocused) setIsFocused(false)
      }}
      onChange={e => {
        if (setCurrentValue) setCurrentValue(e.target.value)
        if (setIsValid) setIsValid(true)
      }}
    />
  )
}

const FormElementSelect = ({
  className,
  items,
  name,
  placeholder,
  setCurrentValue,
  currentValue,
  setIsValid,
  setIsFocused,
  onChange,
  disabled,
  ariaLabel,
}: SelectProps) => {
  if (!items?.length) {
    items = [
      {
        label: placeholder || 'Select an option',
        value: '',
      },
      {
        label: 'Needs items',
        value: 'invalid',
      },
    ]
  } else {
    if (placeholder && placeholder.trim() !== '') {
      items = [
        {
          label: placeholder,
          value: '',
        },
        ...items,
      ]
    }
  }

  return (
    <div className={styles.selectContainer}>
      <select
        disabled={disabled}
        className={classnames(styles.select, className)}
        id={generateFormId(name)}
        onChange={e => {
          const value = e.target.value
          if (setCurrentValue) setCurrentValue(value)
          if (setIsValid) setIsValid(true)
          // Call the parent's onChange callback if provided
          if (onChange) onChange(value)
        }}
        aria-label={ariaLabel ? ariaLabel : undefined}
        data-select-value={currentValue}
        value={currentValue}
        onFocus={() => {
          if (setIsFocused) setIsFocused(true)
        }}
        onBlur={() => {
          if (setIsFocused) setIsFocused(false)
        }}
      >
        {items.map((item, i) => (
          <option
            key={i}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
      <div className={styles.selectBar} />
      <Icon
        name="caretDown"
        className={styles.selectIcon}
      />
    </div>
  )
}

const FormElementRadioGroup = ({
  className,
  items,
  name,
  placeholder,
  setCurrentValue,
  currentValue,
  setIsValid,
  setIsFocused,
  onChange,
  disabled,
}: SelectProps) => {
  if (!items?.length) {
    items = [
      {
        label: placeholder || 'Select an option',
        value: '',
      },
      {
        label: 'Needs items',
        value: 'invalid',
      },
    ]
  } else {
    if (placeholder && placeholder.trim() !== '') {
      items = [
        {
          label: placeholder,
          value: '',
        },
        ...items,
      ]
    }
  }

  return (
    <div className={classnames(styles.radioGroup, className)}>
      {items.map((item, i) => (
        <label
          key={`${item.value}-${i}`}
          className={classnames(styles.radio, {
            [styles.isActive]: currentValue === item.value,
          })}
        >
          <input
            type="radio"
            className={styles.radioInput}
            name={generateFormId(name)}
            value={item.value}
            disabled={disabled}
            onFocus={() => {
              if (setIsFocused) setIsFocused(true)
            }}
            onBlur={() => {
              if (setIsFocused) setIsFocused(false)
            }}
            onChange={e => {
              if (setCurrentValue) {
                let value: boolean | string = e.target.value
                value = Boolean(e.target.checked)

                if (value === true) {
                  setCurrentValue(item.value)
                }

                if (onChange && value === true) {
                  onChange(item.value)
                }
              }
              if (setIsValid) setIsValid(true)
            }}
          />
          <span className={styles.radioCircle}>
            <span className={styles.radioCircleInner} />
          </span>
          <span className={styles.radioLabel}>{item.label}</span>
        </label>
      ))}
    </div>
  )
}

FormElement.displayName = 'FormElement'

export default FormElement
