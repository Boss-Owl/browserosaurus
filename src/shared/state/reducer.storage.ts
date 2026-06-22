import { createReducer } from '@reduxjs/toolkit'

import type { AppName } from '../../config/apps.js'
import {
  changedPickerWindowBounds,
  readiedApp,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
} from '../../main/state/actions.js'
import {
  confirmedReset,
  reorderedApp,
  toggledAppVisibility,
  updatedHotCode,
} from '../../renderers/prefs/state/actions.js'

type Storage = {
  apps: {
    name: AppName
    hotCode: string | null
    isInstalled: boolean
    isVisible: boolean
  }[]
  isSetup: boolean
  height: number
}

const defaultStorage: Storage = {
  apps: [],
  height: 200,
  isSetup: false,
}

const storage = createReducer<Storage>(defaultStorage, (builder) =>
  builder
    .addCase(readiedApp, (state) => {
      state.isSetup = true
    })

    .addCase(confirmedReset, () => defaultStorage)

    .addCase(
      receivedRendererStartupSignal,
      (_, action) => action.payload.storage,
    )

    .addCase(retrievedInstalledApps, (state, action) => {
      const installedAppNames = action.payload

      for (const storedApp of state.apps) {
        storedApp.isInstalled = installedAppNames.includes(storedApp.name)
        // Backfill visibility for apps stored before this field existed.
        storedApp.isVisible ??= true
      }

      for (const installedAppName of installedAppNames) {
        const installedAppInStorage = state.apps.some(
          ({ name }) => name === installedAppName,
        )

        if (!installedAppInStorage) {
          state.apps.push({
            hotCode: null,
            isInstalled: true,
            isVisible: true,
            name: installedAppName,
          })
        }
      }
    })

    .addCase(updatedHotCode, (state, action) => {
      const hotCode = action.payload.value

      const appWithSameHotCodeIndex = state.apps.findIndex(
        (app) => app.hotCode === hotCode,
      )

      if (appWithSameHotCodeIndex !== -1) {
        state.apps[appWithSameHotCodeIndex].hotCode = null
      }

      const appIndex = state.apps.findIndex(
        (app) => app.name === action.payload.appName,
      )

      state.apps[appIndex].hotCode = hotCode
    })

    .addCase(changedPickerWindowBounds, (state, action) => {
      state.height = action.payload.height
    })

    .addCase(toggledAppVisibility, (state, action) => {
      const app = state.apps.find(
        (storedApp) => storedApp.name === action.payload.appName,
      )

      if (app) {
        app.isVisible = !(app.isVisible ?? true)
      }
    })

    .addCase(reorderedApp, (state, action) => {
      const sourceIndex = state.apps.findIndex(
        (app) => app.name === action.payload.sourceName,
      )

      const destinationIndex = state.apps.findIndex(
        (app) => app.name === action.payload.destinationName,
      )

      const [removed] = state.apps.splice(sourceIndex, 1)
      state.apps.splice(destinationIndex, 0, removed)
    }),
)

export { defaultStorage, Storage, storage }
