import deepEqual from 'fast-deep-equal'
import type { TypedUseSelectorHook } from 'react-redux'
import { shallowEqual, useSelector as useReduxSelector } from 'react-redux'

import type { AppName } from '../../../config/apps.js'
import type { RootState } from '../../../shared/state/reducer.root.js'

const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector, shallowEqual)

const useDeepEqualSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector, deepEqual)

type InstalledApp = {
  name: AppName
  hotCode: string | null
  isVisible: boolean
}

const useInstalledApps = (): InstalledApp[] => {
  const storedApps = useDeepEqualSelector((state) => state.storage.apps)
  return storedApps
    .filter((storedApp) => storedApp.isInstalled)
    .map((storedApp) => ({
      hotCode: storedApp.hotCode,
      isVisible: storedApp.isVisible ?? true,
      name: storedApp.name,
    }))
}

/**
 * Apps shown in the picker: installed and not hidden by the user.
 */
const useVisibleApps = (): InstalledApp[] =>
  useInstalledApps().filter((app) => app.isVisible)

const useKeyCodeMap = (): Record<string, string> =>
  useShallowEqualSelector((state) => state.data.keyCodeMap)

export {
  InstalledApp,
  useDeepEqualSelector,
  useInstalledApps,
  useKeyCodeMap,
  useSelector,
  useShallowEqualSelector,
  useVisibleApps,
}
