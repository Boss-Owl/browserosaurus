import type { AppName } from '../../../config/apps.js'
import { actionNamespacer } from '../../../shared/utils/action-namespacer.js'

const picker = actionNamespacer('picker')

type OpenAppArguments = {
  appName: AppName | undefined
  isAlt: boolean
  isShift: boolean
}

const startedPicker = picker('started')

const clickedApp = picker<OpenAppArguments>('app/clicked')

const pressedKey = picker<{
  virtualKey: string
  physicalKey: string
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}>('key/pressed')

const clickedUrlBar = picker('url-bar/clicked')
const clickedUpdateBar = picker('update-bar/clicked')

export {
  clickedApp,
  clickedUpdateBar,
  clickedUrlBar,
  pressedKey,
  startedPicker,
}
