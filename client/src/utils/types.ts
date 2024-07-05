import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  pathClassName?: string
}

export interface ResponseError {
  message: string
  response?: { data?: { message?: string } }
}
